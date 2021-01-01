import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../routes/user_details.dart';
import '../widgets/dark_mode_toggler.dart';
import '../widgets/sidedrawer.dart';

class SettingsPage extends StatelessWidget {
  static const routeName = "/settings";

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
              GestureDetector(
                onTap: () {},
                child: CircleAvatar(
                  child: ClipOval(
                    child: Image.network(authProvider.authData['photoUrl']),
                  ),
                  radius: deviceSize.width > 350 ? 120 : 100,
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
}
