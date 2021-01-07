import 'dart:convert' as convert;
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart' show ChangeNotifier;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../base_url.dart';

final _firebaseAuth = FirebaseAuth.instance;
final _firestore = FirebaseFirestore.instance;

class AuthProvider with ChangeNotifier {
  User _auth;
  Map<String, dynamic> _authData;
  bool _isLoading = false;
  final _googleSignIn = GoogleSignIn(
    scopes: [
      'email',
    ],
  );

  User get auth {
    return _auth;
  }

  Map<String, dynamic> get authData {
    return {..._authData};
  }

  bool get isLoading {
    return _isLoading;
  }

  Future<void> getUserData() async {
    setIsLoading(true);
    final uid = _firebaseAuth.currentUser.uid;

    final data = await _firestore.collection("users").doc(uid).get();
    if (!data.exists) {
      setIsLoading(false);
      return;
    }

    final userData = data.data();

    final key = await _firestore.collection("keys").doc(uid).get();
    userData["privateKey"] = key.data()["privateKey"];

    _authData = userData;
    setIsLoading(false);
  }

  void login() {
    if (_firebaseAuth.currentUser != null) {
      _auth = _firebaseAuth.currentUser;
    }
  }

  Future<void> loginWithCredentails() async {
    setIsLoading(true);

    await _googleSignIn.signIn();
    if (_googleSignIn.currentUser != null) {
      final googleAuth = await _googleSignIn.currentUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      await _firebaseAuth.signInWithCredential(credential);
      login();
    }

    setIsLoading(false);
  }

  Future<void> loginWithEmail(String email, String password) async {
    setIsLoading(true);

    await _firebaseAuth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );

    login();
    setIsLoading(false);
  }

  void logout() {
    _firebaseAuth.signOut();
    _googleSignIn.disconnect();
    _auth = null;
    _authData = null;
    _isLoading = false;
    notifyListeners();
  }

  Future<void> registerWithEmail(String email, String password) async {
    setIsLoading(true);

    await _firebaseAuth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    login();
    setIsLoading(false);
  }

  void setIsLoading(bool value) {
    _isLoading = value;
    notifyListeners();
  }

  Future<void> setUserData(Map<String, String> userData, String uid) async {
    final username = userData['username'];
    final userRef = _firestore.collection("users").where(
          "username",
          isEqualTo: username,
        );
    final doc = await userRef.get();
    if (doc.size > 0) {
      throw "Username already in use";
    }

    final response = await http.get("$BASE_URL/generate-keys");
    if (response.statusCode == 200) {
      final keys = convert.jsonDecode(response.body) as Map<String, dynamic>;

      final setKeyRef = _firestore.collection("keys").doc(uid);
      final setUserRef = _firestore.collection("users").doc(uid);

      final userDataWithCredential = {...userData};
      userDataWithCredential['uid'] = uid;
      userDataWithCredential['publicKey'] = keys['public_key'];

      await setKeyRef.set({
        "privateKey": keys['private_key'],
      });
      await setUserRef.set(userDataWithCredential);

      userDataWithCredential['privateKey'] = keys['private_key'];
      _authData = userDataWithCredential;
    } else {
      throw "An Error Occoured!";
    }
  }

  Future<void> updateAbout(String about) async {
    setIsLoading(true);

    await _firestore.collection("users").doc(_auth.uid).update({
      "about": about,
    });
    _authData['about'] = about;

    setIsLoading(false);
  }

  Future<void> updateDp(String url) async {
    await _firestore.collection("users").doc(_auth.uid).update({
      "photoUrl": url,
    });
    _authData['photoUrl'] = url;
    notifyListeners();
  }
}
