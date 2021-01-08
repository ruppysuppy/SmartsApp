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

  @override
  _ContactsPageState createState() => _ContactsPageState();
}

class _ContactsPageState extends State<ContactsPage> {
  TextEditingController _textController;

  @override
  void initState() {
    super.initState();
    _textController = TextEditingController();
  }

  @override
  void dispose() {
    _textController.dispose();
    super.dispose();
  }

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

    final filteredContacts = _textController.text == ""
        ? contactProvider.contacts
        : contactProvider.contacts
            .where((contact) => (contact['username'] as String)
                .toLowerCase()
                .contains(_textController.text.toLowerCase()))
            .toList();
    filteredContacts.sort(sortContacts);

    return Scaffold(
      appBar: AppBar(
        title: TextField(
          controller: _textController,
          style: const TextStyle(color: Colors.white),
          decoration: InputDecoration(
            hintText: "Search Contacts",
            contentPadding: const EdgeInsets.only(bottom: 0),
            focusColor: Colors.white,
            suffix: IconButton(
              icon: const Icon(Icons.close),
              onPressed: () {
                _textController.clear();
              },
            ),
          ),
        ),
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: themeData.primaryColor,
        child: const Icon(
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
            ? const Center(
                child: CircularProgressIndicator(),
              )
            : contactProvider.contacts.length == 0
                ? const Center(
                    child: Text("You don't have any contact"),
                  )
                : filteredContacts.length == 0
                    ? const Center(
                        child: Text("No contact matched"),
                      )
                    : ListView.builder(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 16,
                          vertical: 8,
                        ),
                        itemBuilder: (ctx, index) =>
                            ContactCard(filteredContacts[index]),
                        itemCount: filteredContacts.length,
                      ),
      ),
    );
  }
}
