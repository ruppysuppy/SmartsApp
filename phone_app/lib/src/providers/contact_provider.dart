import 'dart:convert' as convert;
import 'dart:io';

import 'package:http/http.dart' as http;
import 'package:flutter/material.dart' show ChangeNotifier;
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_storage/firebase_storage.dart';
import 'package:uuid/uuid.dart' show Uuid;

import '../base_url.dart';
import '../util/cipher.dart';

final _firestore = FirebaseFirestore.instance;
final _firebaseStorage = FirebaseStorage.instance;
bool _isInitialized = false;

class ContactProvider with ChangeNotifier {
  List<Map<String, dynamic>> _contacts = [];
  String _error = "";
  String _imageUrl = "";
  bool _isLoading = false;
  bool _isMessageLoading = false;
  bool _isNewUserLoading = false;
  String _newUserError = "";
  int _selectedContact;

  List<Map<String, dynamic>> _previousData = [];
  final _userIndexMap = {};
  final _messageSnapshotListeners = Set<String>();

  List<Map<String, dynamic>> get contacts {
    return [..._contacts];
  }

  String get error {
    return _error;
  }

  String get imageUrl {
    return _imageUrl;
  }

  bool get isLoading {
    return _isLoading;
  }

  bool get isMessageLoading {
    return _isMessageLoading;
  }

  bool get isNewUserLoading {
    return _isNewUserLoading;
  }

  String get newUserError {
    return _newUserError;
  }

  int get selectedContact {
    return _selectedContact;
  }

  Future<void> addUser(
    String username,
    String userId,
  ) async {
    _isNewUserLoading = true;
    _newUserError = "";
    notifyListeners();

    try {
      final userRef =
          _firestore.collection("users").where("username", isEqualTo: username);
      final userData = await userRef.get();
      if (userData.size == 0) {
        throw "User does not exist";
      }

      final uid = (userData.docs[0].data())['uid'];
      final userContactsRef = _firestore.collection("contacts").doc(userId);
      final contactContactsRef = _firestore.collection("contacts").doc(uid);

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

        _isNewUserLoading = false;
        notifyListeners();
      }
    } catch (_error) {
      _isNewUserLoading = false;
      _newUserError = _error.runtimeType == String ? _error : _error.message;
      notifyListeners();
    }
  }

  Future<bool> fetchPreviousMessages(String uid) async {
    if (!_contacts[_selectedContact]['hasMore'] ||
        _contacts[_selectedContact]['messages'].isEmpty) {
      return false;
    }

    _isMessageLoading = true;
    notifyListeners();

    final String otherId = _contacts[_selectedContact]['uid'];
    final int lastTimestamp =
        _contacts[_selectedContact]['messages'][0]['timestamp'];

    final users = [otherId, uid];
    users.sort();
    final usersList = users.join(",");
    final query = _firestore
        .collection("messages")
        .where("users", isEqualTo: usersList)
        .where("timestamp", isLessThan: lastTimestamp)
        .orderBy("timestamp", descending: true)
        .limit(20);

    try {
      final docs = await query.get();

      if (docs.docs.length > 0) {
        final messages = [];
        docs.docs.forEach((doc) => messages.add({...doc.data(), uid: doc.id}));
        _contacts[_selectedContact]['messages'] = [
          ...messages.reversed.toList(),
          ..._contacts[_selectedContact]['messages'],
        ];

        _isMessageLoading = false;
        notifyListeners();
        return true;
      } else {
        _contacts[_selectedContact]['hasMore'] = false;
      }
    } catch (_error) {
      print(_error);
    }

    _isMessageLoading = false;
    notifyListeners();
    return false;
  }

  void getContact(String uid, String privateKey) async {
    if (_isInitialized) {
      return;
    }
    _isInitialized = true;
    setIsLoading(true);
    final contactsRef = _firestore.collection("contacts").doc(uid);
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
          .map((userId) => _firestore.collection("users").doc(userId).get())
          .toList();
      final users = await Future.wait(userFutureArr);
      final usersDataArr = users.map((user) => user.data()).toList();

      final List<Future<http.Response>> keyFutureArr = [];
      final List<List<Map<String, dynamic>>> messagesArr = [];
      for (var i = 0; i < usersDataArr.length; i++) {
        final user = usersDataArr[i];
        if (_previousData.length > i &&
            _previousData[i]['uid'] == user['uid']) {
          keyFutureArr.add(
            Future.delayed(
                Duration.zero,
                () => http.Response(
                    convert.json.encode({
                      'shared_key': _previousData[i]['sharedKey'],
                    }),
                    200)),
          );
          messagesArr.add([
            ..._previousData[i]['messages'],
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

        if (i < _previousData.length) {
          currContacts.add({
            ..._previousData[i],
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
        _userIndexMap[user['uid']] = i;
      }
      _contacts = currContacts;
      _previousData = currContacts;

      usersDataArr.forEach((user) {
        if (!_messageSnapshotListeners.contains(user['uid'])) {
          _messageSnapshotListeners.add(user['uid']);
          final usersField = [uid, user['uid']];
          usersField.sort();
          final usersList = usersField.join(",");

          _firestore
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
              _contacts[_userIndexMap[user['uid']]]['messages'] = [
                ..._contacts[_userIndexMap[user['uid']]]['messages'],
                message
              ];
              if (_selectedContact != _userIndexMap[user['uid']]) {
                _contacts[_userIndexMap[user['uid']]]['newMessages'] += 1;
              }
              notifyListeners();
            });
          });
        }
      });

      setIsLoading(false);
    });
  }

  void resetNewMessages() {
    _contacts[_selectedContact]['newMessages'] = 0;
    notifyListeners();
  }

  void resetContacts() {
    _contacts = [];
    _error = "";
    _imageUrl = "";
    _isLoading = false;
    _isMessageLoading = false;
    _isNewUserLoading = false;
    _newUserError = "";
    _selectedContact = null;
    notifyListeners();
  }

  selectContact(String uid) {
    _selectedContact = _userIndexMap[uid];
    notifyListeners();
  }

  void selectImage(String url) {
    _imageUrl = url;
    notifyListeners();
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
      await _firestore.collection("messages").add(messageData);
    } catch (_error) {
      throw _error;
    }
  }

  Future<void> sendImage(
    String uid,
    String otherId,
    File image,
    String sharedKey,
  ) async {
    final ref =
        _firebaseStorage.ref().child("media").child("${Uuid().v4()}.jpg");
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
      await _firestore.collection("messages").add(messageData);
    } catch (_error) {
      throw _error;
    }
  }

  setIsLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }
}
