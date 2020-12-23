import 'package:flutter/material.dart';

class Login extends StatelessWidget {
  static const routeName = "/login";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("SmartsApp"),
      ),
      body: Center(
        child: CircularProgressIndicator(),
      ),
    );
  }
}
