import 'package:flutter/material.dart' show ChangeNotifier;
import 'package:firebase_auth/firebase_auth.dart';
import 'package:cloud_firestore/cloud_firestore.dart';

final firebaseAuth = FirebaseAuth.instance;
final firestore = FirebaseFirestore.instance;

class AuthProvider with ChangeNotifier {
  UserCredential auth;
  Map<String, dynamic> authData;
  bool isLoading = false;
  String error = "";

  Future<void> loginWithEmail(String email, String password) async {
    setIsLoading(true);

    final UserCredential authResult =
        await firebaseAuth.signInWithEmailAndPassword(
      email: email,
      password: password,
    );
    auth = authResult;

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
    print(authData);
  }
}
