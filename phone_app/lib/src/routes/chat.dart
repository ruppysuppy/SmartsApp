import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './contacts.dart';
import './user_details.dart';
import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';
import '../providers/dark_mode_provider.dart';
import '../widgets/user_details_modal.dart';

class ChatPage extends StatelessWidget {
  static const routeName = "/chat";

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final deviceSize = MediaQuery.of(context).size;
    final authProvider = Provider.of<AuthProvider>(context);
    final contactProvider = Provider.of<ContactProvider>(context);
    final darkModeProvider = Provider.of<DarkModeProvider>(context);

    Future.delayed(Duration.zero, () {
      if (authProvider.authData == null) {
        Navigator.of(context).pushReplacementNamed(UserDetailsPage.routeName);
      } else if (contactProvider.selectedContact < 0) {
        Navigator.of(context).pushReplacementNamed(ContactsPage.routeName);
      }
    });

    final contact = contactProvider.contacts[contactProvider.selectedContact];

    return Scaffold(
      appBar: AppBar(
        title: GestureDetector(
          onTap: () => showModalBottomSheet(
            context: context,
            builder: (ctx) => UserDetailsModal(contact),
          ),
          child: Row(
            children: [
              CircleAvatar(
                child: ClipOval(
                  child: Image.network(contact['photoUrl']),
                ),
                backgroundImage: AssetImage("assets/img/loading.gif"),
              ),
              SizedBox(width: 8),
              Text(contact['username']),
            ],
          ),
        ),
      ),
      body: Container(
        height: deviceSize.height,
        width: deviceSize.width,
        padding: EdgeInsets.all(16),
        color: themeData.backgroundColor,
        child: authProvider.isLoading || contactProvider.isLoading
            ? Center(
                child: CircularProgressIndicator(
                  valueColor:
                      AlwaysStoppedAnimation<Color>(themeData.primaryColor),
                ),
              )
            : Column(
                children: [
                  Expanded(
                    child: ListView.builder(
                      itemBuilder: (ctx, index) => Text("PLACEHOLDER"),
                      itemCount: contact['messages'].length,
                    ),
                  ),
                  Row(
                    children: [
                      Expanded(
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: "Type your message",
                            hintStyle: TextStyle(
                                color: darkModeProvider.isDarkTheme
                                    ? Colors.white
                                    : Colors.grey),
                          ),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          Icons.attachment,
                          color: darkModeProvider.isDarkTheme
                              ? Colors.white
                              : Colors.grey,
                        ),
                        onPressed: null,
                      ),
                      CircleAvatar(
                        child: IconButton(
                            icon: Icon(
                              Icons.send,
                              color: Colors.white,
                            ),
                            onPressed: null),
                      ),
                    ],
                  ),
                ],
              ),
      ),
    );
  }
}
