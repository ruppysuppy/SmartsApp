import 'dart:convert' as convert;
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart' show ChangeNotifier;
import 'package:cloud_firestore/cloud_firestore.dart';

import '../base_url.dart';

final firestore = FirebaseFirestore.instance;
bool isInitialized = false;

class ContactProvider with ChangeNotifier {
  List<Map<String, dynamic>> contacts = [];
  bool isLoading = false;
  bool isMessageLoading = false;
  bool isNewUserLoading = false;
  String error = "";
  String newUserError = "";
  int selectedContact;
  bool shouldPlayReceiveAudio = false;
  bool shouldPlaySendAudio = false;

  bool isInitialized = false;
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

      final List<Map<String, dynamic>> contactData = [];
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

        contacts.add({
          ...user,
          'sharedKey': keys[i]['shared_key'],
          'messages': messagesArr[i],
          'hasMore': true,
          'newMessages': 0,
        });
        userIndexMap[user['uid']] = i;
      }
      previousData = contacts;

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
              contacts[userIndexMap[user['uid']]]['messages'] = [
                ...contacts[userIndexMap[user['uid']]]['messages'],
                message
              ];
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
}
