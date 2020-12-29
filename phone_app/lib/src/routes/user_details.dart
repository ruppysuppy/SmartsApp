import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smartsapp/src/widgets/dark_mode_toggler.dart';

import '../widgets/sidedrawer.dart';

import '../providers/auth_provider.dart';

class UserDetailsPage extends StatefulWidget {
  static const routeName = "/user-details";

  @override
  _UserDetailsPageState createState() => _UserDetailsPageState();
}

class _UserDetailsPageState extends State<UserDetailsPage> {
  final GlobalKey<FormState> formKey = GlobalKey();
  bool isUsernameValid = true;
  bool isAboutValid = true;
  Map<String, String> userData = {
    'username': '',
    'about': '',
  };

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;
    final themeData = Theme.of(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final node = FocusScope.of(context);

    return Scaffold(
      appBar: AppBar(
        title: Text("User Details"),
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
                createUsernameField(themeData, node),
                createAboutField(themeData, node),
                SizedBox(height: 8),
                Visibility(
                  child: RaisedButton(
                    onPressed: () => submit(),
                    child: Text(
                      "Submit",
                      style: TextStyle(
                        color: Colors.white,
                      ),
                    ),
                  ),
                  visible: !authProvider.isLoading,
                ),
                DarkModeToggler(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget createUsernameField(ThemeData themeData, FocusNode node) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: 'Username',
        hintText: 'Enter your username',
        labelStyle: TextStyle(
          color:
              isUsernameValid ? themeData.primaryColor : themeData.errorColor,
        ),
      ),
      validator: (username) {
        if (username.trim().length < 4) {
          setState(() {
            isUsernameValid = false;
          });
          return 'Username must contain at least 4 characters';
        } else if (username.trim().length > 14) {
          setState(() {
            isUsernameValid = false;
          });
          return "Maximum Username length is 14 characters";
        } else if (username.trim().indexOf(" ") >= 0) {
          setState(() {
            isUsernameValid = false;
          });
          return "Username cannot contain spaces";
        }
        setState(() {
          isUsernameValid = true;
        });
        return null;
      },
      onEditingComplete: () => node.nextFocus(),
      onSaved: (value) {
        userData['username'] = value;
      },
    );
  }

  Widget createAboutField(ThemeData themeData, FocusNode node) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: 'About',
        hintText: 'Enter something about you',
        labelStyle: TextStyle(
          color: isAboutValid ? themeData.primaryColor : themeData.errorColor,
        ),
      ),
      validator: (about) {
        if (about.trim().length == 0) {
          setState(() {
            isAboutValid = false;
          });
          return 'About cannot be blank';
        } else if (about.trim().length > 80) {
          setState(() {
            isAboutValid = false;
          });
          return "Maximum About length is 80 characters";
        }
        setState(() {
          isAboutValid = true;
        });
        return null;
      },
      onEditingComplete: () => node.unfocus(),
      onSaved: (value) {
        userData['username'] = value;
      },
    );
  }

  Future<void> submit() async {
    formKey.currentState.save();
    if (!formKey.currentState.validate()) {
      return;
    }
  }
}
