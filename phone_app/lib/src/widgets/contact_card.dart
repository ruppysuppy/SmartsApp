import 'package:flutter/material.dart';

class ContactCard extends StatelessWidget {
  final Map<String, dynamic> userData;

  ContactCard(this.userData);

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        ListTile(
          onTap: () {},
          leading: CircleAvatar(
            child: ClipOval(
              child: Image.network(userData['photoUrl']),
            ),
          ),
          title: Text(userData['username']),
          subtitle: Text("No Message Exchanged"),
        ),
        Divider(),
      ],
    );
  }
}
