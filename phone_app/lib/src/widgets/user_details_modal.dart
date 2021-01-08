import 'package:flutter/material.dart';

class UserDetailsModal extends StatelessWidget {
  final Map<String, dynamic> _contact;

  UserDetailsModal(this._contact);

  @override
  Widget build(BuildContext context) {
    final deviceSize = MediaQuery.of(context).size;
    final themeData = Theme.of(context);

    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      color: themeData.backgroundColor,
      child: Column(
        children: [
          CircleAvatar(
            radius: deviceSize.width > 350 ? 120 : 100,
            child: ClipOval(
              child: Image.network(_contact['photoUrl']),
            ),
            backgroundImage: AssetImage("assets/img/loading.gif"),
          ),
          const SizedBox(
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
            children: [
              Text(_contact['about']),
            ],
          ),
        ],
      ),
    );
  }
}
