import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './login.dart';
import './user_details.dart';
import '../providers/auth_provider.dart';
import '../providers/dark_mode_provider.dart';
import '../widgets/google_oauth.dart';
import '../widgets/sidedrawer.dart';

class RegisterPage extends StatefulWidget {
  static const routeName = "/register";

  @override
  _RegisterPageState createState() => _RegisterPageState();
}

class _RegisterPageState extends State<RegisterPage> {
  final GlobalKey<FormState> _formKey = GlobalKey();
  FocusScopeNode _node;

  bool _isEmailValid = true;
  bool _isPasswordValid = true;
  bool _isPasswordConfirmValid = true;
  Map<String, String> _authData = {
    'email': '',
    'password': '',
    'passwordConfirm': '',
  };

  @override
  void initState() {
    super.initState();
    _node = FocusScope.of(context);
  }

  @override
  void dispose() {
    _node.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;
    final themeData = Theme.of(context);
    final navigator = Navigator.of(context);
    final darkModeProvider = Provider.of<DarkModeProvider>(context);
    final authProvider = Provider.of<AuthProvider>(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("REGISTER"),
      ),
      drawer: SideDrawer(),
      body: Container(
        color: themeData.backgroundColor,
        height: deviceSize.height,
        child: Form(
          key: _formKey,
          child: SingleChildScrollView(
            padding: const EdgeInsets.symmetric(
              horizontal: 16,
              vertical: 8,
            ),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                createEmailField(themeData),
                createPasswordField(themeData),
                createPasswordConfirmField(themeData),
                const SizedBox(
                  height: 4,
                ),
                Row(
                  children: [
                    const Text("Already a member?"),
                    FlatButton(
                      padding: const EdgeInsets.all(0),
                      onPressed: () {
                        navigator.pushReplacementNamed(LoginPage.routeName);
                      },
                      child: const Text("Login"),
                    ),
                  ],
                ),
                if (authProvider.isLoading) CircularProgressIndicator(),
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
                      child: const Text(
                        "Register",
                        style: TextStyle(
                          color: Colors.white,
                        ),
                      ),
                    ),
                    visible: !authProvider.isLoading,
                  ),
                ),
                GoogleOAuth(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget createEmailField(ThemeData themeData) {
    return TextFormField(
      decoration: InputDecoration(
          labelText: 'E-Mail',
          hintText: 'Enter your email',
          labelStyle: TextStyle(
              color: _isEmailValid
                  ? themeData.primaryColor
                  : themeData.errorColor)),
      keyboardType: TextInputType.emailAddress,
      validator: (email) {
        if (email.isEmpty ||
            !RegExp(r"^[a-zA-Z0-9.a-zA-Z0-9.!#$%&'*+-/=?^_`{|}~]+@[a-zA-Z0-9]+\.[a-zA-Z]+")
                .hasMatch(email)) {
          setState(() {
            _isEmailValid = false;
          });
          return 'Invalid email';
        }
        setState(() {
          _isEmailValid = true;
        });
        return null;
      },
      onEditingComplete: () => _node.nextFocus(),
      onSaved: (value) {
        _authData['email'] = value;
      },
    );
  }

  Widget createPasswordField(ThemeData themeData) {
    return TextFormField(
      decoration: InputDecoration(
          labelText: 'Password',
          hintText: 'Enter your password',
          labelStyle: TextStyle(
              color: _isPasswordValid
                  ? themeData.primaryColor
                  : themeData.errorColor)),
      obscureText: true,
      validator: (password) {
        if (password.length < 6) {
          setState(() {
            _isPasswordValid = false;
          });
          return 'Password must contain at least 6 characters';
        }
        setState(() {
          _isPasswordValid = true;
        });
        return null;
      },
      onEditingComplete: () => _node.unfocus(),
      onSaved: (value) {
        _authData['password'] = value;
      },
    );
  }

  Widget createPasswordConfirmField(ThemeData themeData) {
    return TextFormField(
      decoration: InputDecoration(
          labelText: 'Confirm Password',
          hintText: 'Enter your password again',
          labelStyle: TextStyle(
              color: _isPasswordConfirmValid
                  ? themeData.primaryColor
                  : themeData.errorColor)),
      obscureText: true,
      validator: (password) {
        if (_authData['password'] != password) {
          setState(() {
            _isPasswordConfirmValid = false;
          });
          return 'Password and Confirm Passwords must match';
        }
        setState(() {
          _isPasswordConfirmValid = true;
        });
        return null;
      },
      onEditingComplete: () => _node.unfocus(),
      onSaved: (value) {
        _authData['passwordConfirm'] = value;
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
    _formKey.currentState.save();
    if (!_formKey.currentState.validate()) {
      return;
    }
    try {
      await authProvider.registerWithEmail(
        _authData['email'],
        _authData['password'],
      );
      navigator.pushReplacementNamed(UserDetailsPage.routeName);
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
