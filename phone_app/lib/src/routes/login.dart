import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './contacts.dart';
import './register.dart';
import './user_details.dart';
import '../widgets/dark_mode_toggler.dart';
import '../widgets/google_oauth.dart';
import '../widgets/sidedrawer.dart';

import '../providers/auth_provider.dart';
import '../providers/dark_mode_provider.dart';

class LoginPage extends StatefulWidget {
  static const routeName = "/login";

  @override
  _LoginPageState createState() => _LoginPageState();
}

class _LoginPageState extends State<LoginPage> {
  final GlobalKey<FormState> formKey = GlobalKey();
  bool isEmailValid = true;
  bool isPasswordValid = true;
  Map<String, String> authData = {
    'email': '',
    'password': '',
  };

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;
    final themeData = Theme.of(context);
    final navigator = Navigator.of(context);
    final darkModeProvider = Provider.of<DarkModeProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final node = FocusScope.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("LOGIN"),
      ),
      drawer: SideDrawer(),
      body: Container(
        color: themeData.backgroundColor,
        height: deviceSize.height,
        child: Form(
          key: formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 8,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                createEmailField(themeData, node),
                createPasswordField(themeData, node),
                SizedBox(
                  height: 4,
                ),
                Row(
                  children: [
                    Text("Not a member yet?"),
                    FlatButton(
                      padding: const EdgeInsets.all(0),
                      onPressed: () {
                        navigator.pushReplacementNamed(RegisterPage.routeName);
                      },
                      child: Text("Register"),
                    ),
                  ],
                ),
                if (authProvider.isLoading)
                  CircularProgressIndicator(
                    valueColor: AlwaysStoppedAnimation<Color>(
                      themeData.primaryColor.withOpacity(0.8),
                    ),
                  ),
                Builder(
                  builder: (ctx) => Visibility(
                    child: RaisedButton(
                      onPressed: () => submit(
                        ctx,
                        themeData,
                        darkModeProvider,
                        authProvider,
                        navigator,
                      ),
                      child: Text(
                        "Login",
                        style: TextStyle(
                          color: Colors.white,
                        ),
                      ),
                    ),
                    visible: !authProvider.isLoading,
                  ),
                ),
                GoogleOAuth(),
                DarkModeToggler(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget createEmailField(ThemeData themeData, FocusNode node) {
    return TextFormField(
      decoration: InputDecoration(
          labelText: 'E-Mail',
          hintText: 'Enter your email',
          labelStyle: TextStyle(
              color: isEmailValid
                  ? themeData.primaryColor
                  : themeData.errorColor)),
      keyboardType: TextInputType.emailAddress,
      validator: (email) {
        if (email.isEmpty ||
            !RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                .hasMatch(email)) {
          setState(() {
            isEmailValid = false;
          });
          return 'Invalid email';
        }
        setState(() {
          isEmailValid = true;
        });
        return null;
      },
      onEditingComplete: () => node.nextFocus(),
      onSaved: (value) {
        authData['email'] = value;
      },
    );
  }

  Widget createPasswordField(ThemeData themeData, FocusNode node) {
    return TextFormField(
      decoration: InputDecoration(
          labelText: 'Password',
          hintText: 'Enter your password',
          labelStyle: TextStyle(
              color: isPasswordValid
                  ? themeData.primaryColor
                  : themeData.errorColor)),
      obscureText: true,
      validator: (password) {
        if (password.length < 6) {
          setState(() {
            isPasswordValid = false;
          });
          return 'Password must contain at least 6 characters';
        }
        setState(() {
          isPasswordValid = true;
        });
        return null;
      },
      onEditingComplete: () => node.unfocus(),
      onSaved: (value) {
        authData['password'] = value;
      },
    );
  }

  Future<void> submit(
    BuildContext ctx,
    ThemeData themeData,
    DarkModeProvider darkModeProvider,
    AuthProvider authProvider,
    NavigatorState navigator,
  ) async {
    formKey.currentState.save();
    if (!formKey.currentState.validate()) {
      return;
    }
    try {
      await authProvider.loginWithEmail(
        authData['email'],
        authData['password'],
      );
      await authProvider.getUserData();
      if (authProvider.authData.isNotEmpty) {
        navigator.pushReplacementNamed(ContactsPage.routeName);
      } else {
        navigator.pushReplacementNamed(UserDetailsPage.routeName);
      }
    } catch (e) {
      authProvider.setIsLoading(false);
      final message = e.message == null ? "An Error Occoured" : e.message;
      Scaffold.of(ctx).showSnackBar(
        SnackBar(
          content: Text(
            message,
            style: TextStyle(
              color: themeData.errorColor,
            ),
          ),
          backgroundColor: Colors.black87,
          action: SnackBarAction(
            label: "Close",
            onPressed: Scaffold.of(ctx).hideCurrentSnackBar,
            textColor: themeData.errorColor,
          ),
        ),
      );
    }
  }
}
