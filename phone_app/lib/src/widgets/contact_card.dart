import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../routes/chat.dart';
import '../providers/contact_provider.dart';
import '../util/cipher.dart';

class ContactCard extends StatelessWidget {
  final Map<String, dynamic> userData;
  final int index;

  ContactCard(this.userData, this.index);

  @override
  Widget build(BuildContext context) {
    final lastMessage = userData['messages'].length > 0
        ? decrypt(
            userData['messages'].last['text'],
            userData['sharedKey'],
          )
        : "No Message Exchanged";
    final bool isMedia = userData['messages'].length > 0 &&
        userData['messages'].last['isMedia'] == true;
    final contactProvider = Provider.of<ContactProvider>(context);
    final navigator = Navigator.of(context);

    return Column(
      key: Key(userData['uid']),
      children: [
        ListTile(
          onTap: () {
            contactProvider.selectContact(userData['uid']);
            navigator.pushNamed(ChatPage.routeName);
          },
          leading: CircleAvatar(
            child: ClipOval(
              child: Image.network(userData['photoUrl']),
            ),
            backgroundImage: AssetImage("assets/img/loading.gif"),
          ),
          title: Text(
            userData['username'],
            overflow: TextOverflow.ellipsis,
          ),
          subtitle: isMedia
              ? Row(
                  children: [
                    Icon(
                      Icons.image,
                      size: 16,
                      color: Colors.grey,
                    ),
                    SizedBox(width: 4),
                    Text(
                      "Image",
                      style: TextStyle(
                        color: Colors.grey,
                      ),
                    ),
                  ],
                )
              : Text(
                  lastMessage,
                  overflow: TextOverflow.ellipsis,
                  style: TextStyle(
                    color: Colors.grey,
                  ),
                ),
          trailing: userData['newMessages'] > 0
              ? CircleAvatar(
                  radius: 16,
                  child: Text(
                    (userData['newMessages'] < 10
                            ? userData['newMessages']
                            : "9+")
                        .toString(),
                  ),
                )
              : null,
        ),
        Divider(),
      ],
    );
  }
}
