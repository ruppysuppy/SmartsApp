import 'dart:convert' as convert;
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:flutter/material.dart' show ChangeNotifier;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:uuid/uuid.dart' show Uuid;

import '../base_url.dart';
import '../util/cipher.dart';

final firestore = FirebaseFirestore.instance;
final firebaseStorage = FirebaseStorage.instance;
bool isInitialized = false;

class ContactProvider with ChangeNotifier {
  List<Map<String, dynamic>> _contacts = [];
  bool isLoading = false;
  bool isMessageLoading = false;
  bool isNewUserLoading = false;
  String error = "";
  String newUserError = "";
  int selectedContact;
  bool shouldPlayReceiveAudio = false;
  bool shouldPlaySendAudio = false;

  List<Map<String, dynamic>> previousData = [];
  final userIndexMap = {};
  final messageSnapshotListeners = Set<String>();

  void getContact(String uid, String privateKey) async {
    if (isInitialized) {
      return;
    }
    isInitialized = true;
    setIsLoading(true);
    final contactsRef = firestore.collection("contacts").doc(uid);
    contactsRef.snapshots().listen((docSnapshot) async {
      if (!docSnapshot.exists) {
        setIsLoading(false);
        return;
      }

      List<Map<String, dynamic>> currContacts = [];
      final List<String> contactList =
          (docSnapshot.data()['contacts'] as List<dynamic>)
              .map((e) => e.toString())
              .toList();

      final userFutureArr = contactList
          .map((userId) => firestore.collection("users").doc(userId).get())
          .toList();
      final users = await Future.wait(userFutureArr);
      final usersDataArr = users.map((user) => user.data()).toList();

      final List<Future<http.Response>> keyFutureArr = [];
      final List<List<Map<String, dynamic>>> messagesArr = [];
      for (var i = 0; i < usersDataArr.length; i++) {
        final user = usersDataArr[i];
        if (previousData.length > i && previousData[i]['uid'] == user['uid']) {
          keyFutureArr.add(
            Future.delayed(
                Duration.zero,
                () => http.Response(
                    convert.json.encode({
                      'shared_key': previousData[i]['sharedKey'],
                    }),
                    200)),
          );
          messagesArr.add([
            ...previousData[i]['messages'],
          ]);
        } else {
          keyFutureArr.add(http.get(
              "$BASE_URL/generate-shared-key?local_private_key=$privateKey&remote_public_key=${user['publicKey']}"));
          messagesArr.add([]);
        }
      }
      final keys = (await Future.wait(keyFutureArr))
          .map((res) => convert.json.decode(res.body) as Map<String, dynamic>)
          .toList();
      for (var i = 0; i < usersDataArr.length; i++) {
        final user = usersDataArr[i];

        if (i < previousData.length) {
          currContacts.add({
            ...previousData[i],
            ...user,
          });
        } else {
          currContacts.add({
            ...user,
            'sharedKey': keys[i]['shared_key'],
            'messages': messagesArr[i],
            'hasMore': true,
            'newMessages': 0,
          });
        }
        userIndexMap[user['uid']] = i;
      }
      _contacts = currContacts;
      previousData = currContacts;

      usersDataArr.forEach((user) {
        if (!messageSnapshotListeners.contains(user['uid'])) {
          messageSnapshotListeners.add(user['uid']);
          final usersField = [uid, user['uid']];
          usersField.sort();
          final usersList = usersField.join(",");

          firestore
              .collection("messages")
              .where("users", isEqualTo: usersList)
              .orderBy("timestamp", descending: true)
              .limit(1)
              .snapshots()
              .listen((docSnapshot) {
            docSnapshot.docs.forEach((snapshot) {
              final message = {
                ...snapshot.data(),
                uid: snapshot.id,
              };
              _contacts[userIndexMap[user['uid']]]['messages'] = [
                ..._contacts[userIndexMap[user['uid']]]['messages'],
                message
              ];
              _contacts[userIndexMap[user['uid']]]['newMessages'] += 1;
              notifyListeners();
            });
          });
        }
      });

      setIsLoading(false);
    });
  }

  setIsLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  selectContact(int index) {
    selectedContact = index;
    notifyListeners();
  }

  List<Map<String, dynamic>> get contacts {
    return [..._contacts];
  }

  Future<void> addUser(
    String username,
    String userId,
  ) async {
    isNewUserLoading = true;
    newUserError = "";
    notifyListeners();

    try {
      final userRef =
          firestore.collection("users").where("username", isEqualTo: username);
      final userData = await userRef.get();
      if (userData.size == 0) {
        throw "User does not exist";
      }

      final uid = (userData.docs[0].data())['uid'];
      final userContactsRef = firestore.collection("contacts").doc(userId);
      final contactContactsRef = firestore.collection("contacts").doc(uid);

      if (!(await userContactsRef.get()).exists) {
        await userContactsRef.set({
          'contacts': [uid]
        });
      } else {
        await userContactsRef.update({
          'contacts': FieldValue.arrayUnion([uid]),
        });
      }
      if (!(await contactContactsRef.get()).exists) {
        await contactContactsRef.set({
          'contacts': [userId]
        });
      } else {
        await contactContactsRef.update({
          'contacts': FieldValue.arrayUnion([userId]),
        });

        isNewUserLoading = false;
        notifyListeners();
      }
    } catch (error) {
      isNewUserLoading = false;
      newUserError = error.runtimeType == String ? error : error.message;
      notifyListeners();
    }
  }

  Future<void> sendMessgae(
    String uid,
    String otherId,
    String message,
    String sharedKey,
  ) async {
    final encryptedMessage = encrypt(message, sharedKey);
    final users = [otherId, uid];
    users.sort();

    final messageData = {
      'sender': uid,
      'users': users.join(","),
      'text': encryptedMessage,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
    };
    try {
      await firestore.collection("messages").add(messageData);
    } catch (error) {
      throw error;
    }
  }

  Future<void> sendImage(
    String uid,
    String otherId,
    File image,
    String sharedKey,
  ) async {
    final ref =
        firebaseStorage.ref().child("media").child("${Uuid().v4()}.jpg");
    final uploadTask = ref.putFile(image);
    final url = await (await uploadTask).ref.getDownloadURL();
    final encryptedMessage = encrypt(url, sharedKey);
    final users = [otherId, uid];
    users.sort();

    final messageData = {
      'sender': uid,
      'users': users.join(","),
      'text': encryptedMessage,
      'timestamp': DateTime.now().millisecondsSinceEpoch,
      'isMedia': true,
    };
    try {
      await firestore.collection("messages").add(messageData);
    } catch (error) {
      throw error;
    }
  }
}
