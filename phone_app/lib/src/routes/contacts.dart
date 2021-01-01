import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:smartsapp/src/widgets/contact_card.dart';

import './user_details.dart';
import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';
import '../widgets/sidedrawer.dart';

class ContactsPage extends StatelessWidget {
  static const routeName = "/contacts";

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final contactProvider = Provider.of<ContactProvider>(context);

    Future.delayed(Duration.zero, () {
      if (authProvider.authData == null) {
        Navigator.of(context).pushReplacementNamed(UserDetailsPage.routeName);
      } else if (!authProvider.isLoading) {
        contactProvider.getContact(
            authProvider.auth.uid, authProvider.authData['privateKey']);
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Text("CONTACTS"),
      ),
      drawer: SideDrawer(),
      body: Container(
        color: themeData.backgroundColor,
        child: authProvider.isLoading || contactProvider.isLoading
            ? Center(
                child: CircularProgressIndicator(
                  valueColor:
                      AlwaysStoppedAnimation<Color>(themeData.primaryColor),
                ),
              )
            : ListView.builder(
                padding: EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                itemBuilder: (ctx, index) =>
                    ContactCard(contactProvider.contacts[index]),
                itemCount: contactProvider.contacts.length,
              ),
      ),
    );
  }
}
