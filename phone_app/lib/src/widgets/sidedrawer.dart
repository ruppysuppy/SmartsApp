import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/dark_mode_provider.dart';
import '../routes/contacts.dart';
import '../routes/login.dart';
import '../routes/register.dart';
import '../routes/settings.dart';

class SideDrawer extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final navigator = Navigator.of(context);
    final themeData = Theme.of(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final darkModeProvider = Provider.of<DarkModeProvider>(context);

    return Drawer(
      elevation: darkModeProvider.isDarkTheme ? 0 : 4,
      child: Container(
        color: themeData.backgroundColor,
        padding: const EdgeInsets.only(
          top: 32,
          left: 12,
          right: 12,
          bottom: 12,
        ),
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Image(
                image: AssetImage(
                  "assets/img/chat_full.png",
                ),
                width: 180,
              ),
              SizedBox(
                height: 12,
              ),
              Divider(),
              if (authProvider.auth == null)
                ...getUnauthenticatedWidgets(navigator, darkModeProvider),
              if (authProvider.auth != null)
                ...getAuthenticatedWidgets(
                    navigator, darkModeProvider, authProvider),
            ],
          ),
        ),
      ),
    );
  }

  List<Widget> getUnauthenticatedWidgets(
    NavigatorState navigator,
    DarkModeProvider darkModeProvider,
  ) {
    return [
      ListTile(
        title: Text("Login"),
        leading: Icon(
          Icons.login,
          color: darkModeProvider.isDarkTheme ? Colors.white : Colors.grey,
        ),
        onTap: () => navigator.pushReplacementNamed(LoginPage.routeName),
      ),
      Divider(),
      ListTile(
        title: Text("Register"),
        leading: Icon(
          Icons.person_add,
          color: darkModeProvider.isDarkTheme ? Colors.white : Colors.grey,
        ),
        onTap: () => navigator.pushReplacementNamed(RegisterPage.routeName),
      ),
      Divider(),
    ];
  }

  List<Widget> getAuthenticatedWidgets(
    NavigatorState navigator,
    DarkModeProvider darkModeProvider,
    AuthProvider authProvider,
  ) {
    return [
      ListTile(
        title: Text("Chats"),
        leading: Icon(
          Icons.chat,
          color: darkModeProvider.isDarkTheme ? Colors.white : Colors.grey,
        ),
        onTap: () {
          navigator.pushReplacementNamed(ContactsPage.routeName);
        },
      ),
      Divider(),
      ListTile(
        title: Text("Settings"),
        leading: Icon(
          Icons.settings,
          color: darkModeProvider.isDarkTheme ? Colors.white : Colors.grey,
        ),
        onTap: () {
          navigator.pushReplacementNamed(SettingsPage.routeName);
        },
      ),
      Divider(),
      ListTile(
        title: Text("Logout"),
        leading: Icon(
          Icons.logout,
          color: darkModeProvider.isDarkTheme ? Colors.white : Colors.grey,
        ),
        onTap: () {
          authProvider.logout();
          navigator.pushReplacementNamed(LoginPage.routeName);
        },
      ),
      Divider(),
    ];
  }
}
