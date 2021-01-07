import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';

class AddUserModal extends StatefulWidget {
  @override
  _AddUserModalState createState() => _AddUserModalState();
}

class _AddUserModalState extends State<AddUserModal> {
  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final authProvider = Provider.of<AuthProvider>(context);
    final contactProvider = Provider.of<ContactProvider>(context);

    final controller = TextEditingController();

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
            decoration: InputDecoration(
              hintText: "Enter Username",
              labelText: "Username",
            ),
            controller: controller,
          ),
          SizedBox(height: 8),
          if (contactProvider.newUserError.isNotEmpty) ...[
            Row(
              children: [
                Icon(
                  Icons.error,
                  color: themeData.errorColor,
                ),
                SizedBox(width: 4),
                Text(
                  contactProvider.newUserError,
                  style: TextStyle(color: themeData.errorColor),
                ),
              ],
            ),
            SizedBox(height: 6),
          ],
          if (contactProvider.isNewUserLoading) ...[
            SizedBox(height: 6),
            CircularProgressIndicator(),
          ] else
            RaisedButton(
              child: Text("Add User"),
              onPressed: () async {
                await contactProvider.addUser(
                  controller.text,
                  authProvider.auth.uid,
                );
                if (contactProvider.newUserError.isEmpty) {
                  Navigator.pop(context);
                }
              },
            ),
        ],
      ),
    );
  }
}
