import 'dart:convert' as convert;
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart' show ChangeNotifier;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:google_sign_in/google_sign_in.dart';

import '../base_url.dart';

final firebaseAuth = FirebaseAuth.instance;
final firestore = FirebaseFirestore.instance;

class AuthProvider with ChangeNotifier {
  User auth;
  Map<String, dynamic> authData;
  bool isLoading = false;
  final googleSignIn = GoogleSignIn(
    scopes: [
      'email',
    ],
  );

  Future<void> loginWithEmail(String email, String password) async {
    setIsLoading(true);

    await firebaseAuth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );

    login();
    setIsLoading(false);
  }

  Future<void> loginWithCredentails() async {
    setIsLoading(true);

    await googleSignIn.signIn();
    if (googleSignIn.currentUser != null) {
      final googleAuth = await googleSignIn.currentUser.authentication;
      final credential = GoogleAuthProvider.credential(
        accessToken: googleAuth.accessToken,
        idToken: googleAuth.idToken,
      );

      await firebaseAuth.signInWithCredential(credential);
      login();
    }

    setIsLoading(false);
  }

  Future<void> registerWithEmail(String email, String password) async {
    setIsLoading(true);

    await firebaseAuth.createUserWithEmailAndPassword(
      email: email,
      password: password,
    );

    login();
    setIsLoading(false);
  }

  void setIsLoading(bool value) {
    isLoading = value;
    notifyListeners();
  }

  Future<void> getUserData() async {
    setIsLoading(true);
    final uid = firebaseAuth.currentUser.uid;

    final data = await firestore.collection("users").doc(uid).get();
    if (!data.exists) {
      setIsLoading(false);
      return;
    }

    final userData = data.data();

    final key = await firestore.collection("keys").doc(uid).get();
    userData["privateKey"] = key.data()["privateKey"];

    authData = userData;
    setIsLoading(false);
  }

  void login() {
    if (firebaseAuth.currentUser != null) {
      auth = firebaseAuth.currentUser;
    }
  }

  void logout() {
    firebaseAuth.signOut();
    googleSignIn.disconnect();
    auth = null;
    authData = null;
    isLoading = false;
    notifyListeners();
  }

  Future<void> setUserData(Map<String, String> userData, String uid) async {
    final username = userData['username'];
    final userRef = firestore.collection("users").where(
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

      final setKeyRef = firestore.collection("keys").doc(uid);
      final setUserRef = firestore.collection("users").doc(uid);

      final userDataWithCredential = {...userData};
      userDataWithCredential['uid'] = uid;
      userDataWithCredential['publicKey'] = keys['public_key'];

      await setKeyRef.set({
        "privateKey": keys['private_key'],
      });
      await setUserRef.set(userDataWithCredential);

      userDataWithCredential['privateKey'] = keys['private_key'];
      authData = userDataWithCredential;
    } else {
      throw "An Error Occoured!";
    }
  }

  void updateDp(String url) {
    firestore.collection("users").doc(auth.uid).update({
      "photoUrl": url,
    });
    authData['photoUrl'] = url;
    notifyListeners();
  }

  Future<void> updateAbout(String about) async {
    setIsLoading(true);

    await firestore.collection("users").doc(auth.uid).update({
      "about": about,
    });
    authData['about'] = about;

    setIsLoading(false);
  }
}
