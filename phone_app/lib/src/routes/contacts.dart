import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './user_details.dart';
import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';
import '../widgets/contact_card.dart';
import '../widgets/sidedrawer.dart';
import '../widgets/add_user_modal.dart';

int sortContacts(Map<String, dynamic> user1, Map<String, dynamic> user2) {
  if (user1['messages'].length == 0 && user2['messages'].length == 0) {
    return -1;
  } else if (user1['messages'].length == 0 || user2['messages'].length == 0) {
    return user2['messages'].length - user1['messages'].length;
  }
  return (user2['messages'].last['timestamp'] -
      user1['messages'].last['timestamp']);
}

class ContactsPage extends StatefulWidget {
  static const routeName = "/contacts";
  final inputController = TextEditingController();

  @override
  _ContactsPageState createState() => _ContactsPageState();
}

class _ContactsPageState extends State<ContactsPage> {
  String searchQuery = "";

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
          authProvider.auth.uid,
          authProvider.authData['privateKey'] as String,
        );
      }
    });

    final filteredContacts = searchQuery == ""
        ? contactProvider.contacts
        : contactProvider.contacts
            .where((contact) => (contact['username'] as String)
                .toLowerCase()
                .contains(searchQuery.toLowerCase()))
            .toList();
    filteredContacts.sort(sortContacts);

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: widget.inputController,
          style: TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: "Search Contacts",
            contentPadding: EdgeInsets.only(bottom: 0),
            focusColor: Colors.white,
            suffix: IconButton(
              icon: Icon(Icons.close),
              onPressed: () {
                widget.inputController.clear();
                setState(() => searchQuery = "");
              },
            ),
          ),
          onChanged: (value) {
            setState(() => searchQuery = value);
          },
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: themeData.primaryColor,
        child: Icon(
          Icons.person_add,
          color: Colors.white,
        ),
        onPressed: () {
          showModalBottomSheet(
            context: context,
            builder: (ctx) => AddUserModal(),
          );
        },
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
            : contactProvider.contacts.length == 0
                ? Center(
                    child: Text("You don't have any contact"),
                  )
                : filteredContacts.length == 0
                    ? Center(
                        child: Text("No contact matched"),
                      )
                    : ListView.builder(
                        padding:
                            EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                        itemBuilder: (ctx, index) =>
                            ContactCard(filteredContacts[index], index),
                        itemCount: filteredContacts.length,
                      ),
      ),
    );
  }
}
