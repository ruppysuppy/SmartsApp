import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../routes/user_details.dart';
import '../widgets/dark_mode_toggler.dart';
import '../widgets/dp_image_picker.dart';
import '../widgets/sidedrawer.dart';

class SettingsPage extends StatefulWidget {
  static const routeName = "/settings";

  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool isUpdating = false;
  bool isImageValid = true;

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final deviceSize = MediaQuery.of(context).size;
    final authProvider = Provider.of<AuthProvider>(context);

    if (authProvider.authData == null) {
      Navigator.of(context).pushReplacementNamed(UserDetailsPage.routeName);
    }

    return Scaffold(
      appBar: AppBar(
        title: Text("SETTINGS"),
      ),
      drawer: SideDrawer(),
      body: Container(
        padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        height: deviceSize.height,
        width: deviceSize.width,
        color: themeData.backgroundColor,
        child: SingleChildScrollView(
          child: Column(
            children: [
              if (isUpdating) ...[
                SizedBox(height: 8),
                DpImagePicker(
                  (url) => setImageUrl(url, authProvider),
                  setImageValid,
                ),
                SizedBox(height: 8),
              ] else
                GestureDetector(
                  onTap: () {
                    setState(() {
                      isUpdating = true;
                    });
                  },
                  child: Stack(
                    children: [
                      CircleAvatar(
                        child: ClipOval(
                          child:
                              Image.network(authProvider.authData['photoUrl']),
                        ),
                        radius: deviceSize.width > 350 ? 120 : 100,
                      ),
                      Positioned(
                        bottom: 8,
                        right: 8,
                        child: CircleAvatar(
                          backgroundColor: themeData.accentColor,
                          child: Icon(
                            Icons.edit,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  Text("Dark Mode"),
                  DarkModeToggler(),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  void setImageUrl(String url, AuthProvider authProvider) {
    authProvider.updateDp(url);
    Future.delayed(
      Duration(seconds: 1),
      () => setState(() {
        isUpdating = false;
      }),
    );
  }

  void setImageValid(bool value) {
    setState(() {
      isImageValid = value;
    });
  }
}
