import 'package:flutter/material.dart';
import 'package:smartsapp/src/widgets/dark_mode_toggler.dart';

class Login extends StatelessWidget {
  static const routeName = "/login";

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;
    final themeData = Theme.of(context);
    final navigator = Navigator.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("LOGIN"),
      ),
      body: Container(
        color: themeData.backgroundColor,
        height: deviceSize.height,
        child: Form(
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 8,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'E-Mail',
                    hintText: 'Enter your email',
                  ),
                  keyboardType: TextInputType.emailAddress,
                  validator: (email) {
                    if (email.isEmpty ||
                        !RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                            .hasMatch(email)) {
                      return 'Invalid email';
                    }
                    return null;
                  },
                  onSaved: (value) {},
                ),
                TextFormField(
                  decoration: InputDecoration(
                    labelText: 'Password',
                    hintText: 'Enter your password',
                  ),
                  obscureText: true,
                  validator: (password) {
                    if (password.length < 6) {
                      return 'Password must contain at least 6 characters';
                    }
                    return null;
                  },
                  onSaved: (value) {},
                ),
                SizedBox(
                  height: 4,
                ),
                Row(
                  children: [
                    Text("Not a member yet?"),
                    FlatButton(
                      padding: const EdgeInsets.all(0),
                      onPressed: () {
                        navigator.pushReplacementNamed("/register");
                      },
                      child: Text("Register"),
                    ),
                  ],
                ),
                RaisedButton(
                  onPressed: () {},
                  child: Text(
                    "Login",
                    style: TextStyle(
                      color: Colors.white,
                    ),
                  ),
                ),
                DarkModeToggler(),
              ],
            ),
          ),
        ),
      ),
    );
  }
}
