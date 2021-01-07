import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './send_media_message_btn.dart';
import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';
import '../providers/dark_mode_provider.dart';

class ChatInput extends StatefulWidget {
  @override
  _ChatInputState createState() => _ChatInputState();
}

class _ChatInputState extends State<ChatInput> {
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
    final authProvider = Provider.of<AuthProvider>(context);
    final darkModeProvider = Provider.of<DarkModeProvider>(context);
    final contactProvider = Provider.of<ContactProvider>(context);
    final themeData = Theme.of(context);

    final contact = contactProvider.contacts[contactProvider.selectedContact];

    return Padding(
      padding: const EdgeInsets.all(16),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _textController,
              decoration: InputDecoration(
                hintText: "Type your message",
                hintStyle: TextStyle(
                    color: darkModeProvider.isDarkTheme
                        ? Colors.white
                        : Colors.grey),
              ),
            ),
          ),
          SendMediaMessageBtn(contact['uid'], contact['sharedKey']),
          CircleAvatar(
            child: IconButton(
              icon: const Icon(
                Icons.send,
                color: Colors.white,
              ),
              onPressed: () async {
                try {
                  await contactProvider.sendMessgae(
                    authProvider.auth.uid,
                    contact['uid'],
                    _textController.text,
                    contact['sharedKey'],
                  );
                  _textController.clear();
                } catch (e) {
                  final message =
                      e.message == null ? "An Error Occoured" : e.message;
                  Scaffold.of(context).showSnackBar(
                    SnackBar(
                      content: Text(
                        message,
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
              },
            ),
          ),
        ],
      ),
    );
  }
}
