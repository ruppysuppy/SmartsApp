import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './contacts.dart';
import './user_details.dart';
import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';

class ChatPage extends StatelessWidget {
  static const routeName = "/contacts";

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final contactProvider = Provider.of<ContactProvider>(context);

    Future.delayed(Duration.zero, () {
      if (authProvider.authData == null) {
        Navigator.of(context).pushReplacementNamed(UserDetailsPage.routeName);
      } else if (contactProvider.selectedContact < 0) {
        Navigator.of(context).pushReplacementNamed(ContactsPage.routeName);
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Text("CHAT"),
      ),
      body: Container(
        color: themeData.backgroundColor,
        child: authProvider.isLoading || contactProvider.isLoading
            ? Center(
                child: CircularProgressIndicator(
                  valueColor:
                      AlwaysStoppedAnimation<Color>(themeData.primaryColor),
                ),
              )
            : Text("CHAT"),
      ),
    );
  }
}
