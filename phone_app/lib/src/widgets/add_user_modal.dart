import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';

class AddUserModal extends StatefulWidget {
  @override
  _AddUserModalState createState() => _AddUserModalState();
}

class _AddUserModalState extends State<AddUserModal> {
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
    final contactProvider = Provider.of<ContactProvider>(context);
    final themeData = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(
        horizontal: 16,
        vertical: 24,
      ),
      color: themeData.backgroundColor,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          TextField(
            decoration: const InputDecoration(
              hintText: "Enter Username",
              labelText: "Username",
            ),
            controller: _textController,
          ),
          const SizedBox(height: 8),
          if (contactProvider.newUserError.isNotEmpty) ...[
            Row(
              children: [
                Icon(
                  Icons.error,
                  color: themeData.errorColor,
                ),
                const SizedBox(width: 4),
                Text(
                  contactProvider.newUserError,
                  style: TextStyle(color: themeData.errorColor),
                ),
              ],
            ),
            const SizedBox(height: 6),
          ],
          if (contactProvider.isNewUserLoading) ...[
            const SizedBox(height: 6),
            const CircularProgressIndicator(),
          ] else
            RaisedButton(
              child: const Text("Add User"),
              onPressed: () async {
                try {
                  await contactProvider.addUser(
                    _textController.text,
                    authProvider.auth.uid,
                  );
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
                  return;
                }
                if (contactProvider.newUserError.isEmpty) {
                  _textController.clear();
                  Navigator.pop(context);
                }
              },
            ),
        ],
      ),
    );
  }
}
