import 'package:flutter/material.dart';

class UserDetailsModal extends StatelessWidget {
  final Map<String, dynamic> contact;

  UserDetailsModal(this.contact);

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;
    final themeData = Theme.of(context);

    return Container(
      padding: EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      color: themeData.backgroundColor,
      child: Column(
        children: [
          CircleAvatar(
            radius: deviceSize.width > 350 ? 120 : 100,
            child: ClipOval(
              child: Image.network(contact['photoUrl']),
            ),
            backgroundImage: AssetImage("assets/img/loading.gif"),
          ),
          SizedBox(
            height: 24,
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [
              Text(
                "About",
                style: TextStyle(color: themeData.primaryColor),
              )
            ],
          ),
          Row(
            mainAxisAlignment: MainAxisAlignment.start,
            children: [Text(contact['about'])],
          ),
        ],
      ),
    );
  }
}
