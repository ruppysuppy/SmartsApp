import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../routes/contacts.dart';
import '../widgets/dp_image_picker.dart';
import '../widgets/sidedrawer.dart';

import '../providers/auth_provider.dart';

class UserDetailsPage extends StatefulWidget {
  static const routeName = "/user-details";

  @override
  _UserDetailsPageState createState() => _UserDetailsPageState();
}

class _UserDetailsPageState extends State<UserDetailsPage> {
  final GlobalKey<FormState> formKey = GlobalKey();
  FocusScopeNode _node;

  bool _isUsernameValid = true;
  bool _isAboutValid = true;
  bool _isImageValid = false;
  bool _shouldDisplayErrorMessage = false;
  Map<String, String> _userData = {
    'username': '',
    'about': '',
    'photoUrl': '',
  };

  @override
  void initState() {
    super.initState();
    _node = FocusScopeNode();
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
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    return Scaffold(
      appBar: AppBar(
        title: const Text("USER DETAILS"),
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
                createUsernameField(themeData),
                createAboutField(themeData),
                const SizedBox(height: 4),
                DpImagePicker(setImageUrl, setImageValid),
                if (!_isImageValid && _shouldDisplayErrorMessage) ...[
                  const SizedBox(height: 4),
                  Row(
                    children: [
                      Icon(
                        Icons.error,
                        color: themeData.errorColor,
                      ),
                      const SizedBox(width: 4),
                      Text(
                        "Please add an image",
                        style: TextStyle(color: themeData.errorColor),
                      ),
                    ],
                  ),
                  const SizedBox(height: 4),
                ],
                const SizedBox(height: 8),
                Visibility(
                  child: Builder(
                    builder: (ctx) => RaisedButton(
                      onPressed: () =>
                          submit(authProvider, ctx, themeData, navigator),
                      child: const Text(
                        "Submit",
                        style: TextStyle(
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  visible: !authProvider.isLoading,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget createUsernameField(ThemeData themeData) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: 'Username',
        hintText: 'Enter your username',
        labelStyle: TextStyle(
          color:
              _isUsernameValid ? themeData.primaryColor : themeData.errorColor,
        ),
      ),
      validator: (username) {
        if (username.trim().length < 4) {
          setState(() {
            _isUsernameValid = false;
          });
          return 'Username must contain at least 4 characters';
        } else if (username.trim().length > 14) {
          setState(() {
            _isUsernameValid = false;
          });
          return "Maximum Username length is 14 characters";
        } else if (username.trim().indexOf(" ") >= 0) {
          setState(() {
            _isUsernameValid = false;
          });
          return "Username cannot contain spaces";
        }
        setState(() {
          _isUsernameValid = true;
        });
        return null;
      },
      onEditingComplete: () => _node.nextFocus(),
      onSaved: (value) {
        _userData['username'] = value;
      },
    );
  }

  Widget createAboutField(ThemeData themeData) {
    return TextFormField(
      decoration: InputDecoration(
        labelText: 'About',
        hintText: 'Enter something about you',
        labelStyle: TextStyle(
          color: _isAboutValid ? themeData.primaryColor : themeData.errorColor,
        ),
      ),
      validator: (about) {
        if (about.trim().length == 0) {
          setState(() {
            _isAboutValid = false;
          });
          return 'About cannot be blank';
        } else if (about.trim().length > 80) {
          setState(() {
            _isAboutValid = false;
          });
          return "Maximum About length is 80 characters";
        }
        setState(() {
          _isAboutValid = true;
        });
        return null;
      },
      onEditingComplete: () => _node.unfocus(),
      onSaved: (value) {
        _userData['about'] = value;
      },
    );
  }

  Future<void> submit(
    AuthProvider authProvider,
    BuildContext context,
    ThemeData themeData,
    NavigatorState navigator,
  ) async {
    setState(() {
      _shouldDisplayErrorMessage = true;
    });
    formKey.currentState.save();
    if (!formKey.currentState.validate()) {
      return;
    }
    try {
      await authProvider.setUserData(
        _userData,
        authProvider.auth.uid,
      );
      navigator.pushReplacementNamed(ContactsPage.routeName);
    } catch (e) {
      Scaffold.of(context).showSnackBar(
        SnackBar(
          content: Text(
            e is String ? e : e.message,
            style: TextStyle(
              color: themeData.errorColor,
            ),
          ),
          backgroundColor: Colors.black87,
          action: SnackBarAction(
            label: "Close",
            onPressed: Scaffold.of(context).hideCurrentSnackBar,
            textColor: themeData.errorColor,
          ),
        ),
      );
    }
  }

  void setImageUrl(String url) {
    setState(() {
      _userData['photoUrl'] = url;
    });
  }

  void setImageValid(bool value) {
    setState(() {
      _isImageValid = value;
      _shouldDisplayErrorMessage = !value;
    });
  }
}
