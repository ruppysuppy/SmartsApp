import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/dark_mode_provider.dart';
import '../routes/login.dart';
import '../routes/register.dart';

class UnauthenticatedDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final navigator = Navigator.of(context);
    final themeData = Theme.of(context);
    final darkModeProvider = Provider.of<DarkModeProvider>(context);

    return Drawer(
      child: Container(
        color: themeData.backgroundColor,
        padding: const EdgeInsets.only(
          top: 16,
          left: 12,
          right: 12,
          bottom: 12,
        ),
        child: Column(
          children: [
            ListTile(
              title: Text("Login"),
              leading: Icon(
                Icons.login,
                color:
                    darkModeProvider.isDarkTheme ? Colors.white : Colors.grey,
              ),
              onTap: () => navigator.pushReplacementNamed(Login.routeName),
            ),
            Divider(),
            ListTile(
              title: Text("Register"),
              leading: Icon(
                Icons.person_add,
                color:
                    darkModeProvider.isDarkTheme ? Colors.white : Colors.grey,
              ),
              onTap: () => navigator.pushReplacementNamed(Register.routeName),
            ),
            Divider(),
          ],
        ),
      ),
    );
  }
}
