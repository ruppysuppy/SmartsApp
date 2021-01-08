import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../routes/chat.dart';
import '../providers/contact_provider.dart';
import '../util/cipher.dart';

class ContactCard extends StatelessWidget {
  final Map<String, dynamic> _userData;

  ContactCard(this._userData);

  @override
  Widget build(BuildContext context) {
    final contactProvider = Provider.of<ContactProvider>(context);
    final navigator = Navigator.of(context);

    final lastMessage = _userData['messages'].length > 0
        ? decrypt(
            _userData['messages'].last['text'],
            _userData['sharedKey'],
          )
        : "No Message Exchanged";
    final bool isMedia = _userData['messages'].length > 0 &&
        _userData['messages'].last['isMedia'] == true;

    return Column(
      key: Key(_userData['uid']),
      children: [
        ListTile(
          onTap: () {
            contactProvider.selectContact(_userData['uid']);
            navigator.pushNamed(ChatPage.routeName);
          },
          leading: CircleAvatar(
            child: ClipOval(
              child: Image.network(_userData['photoUrl']),
            ),
            backgroundImage: const AssetImage("assets/img/loading.gif"),
          ),
          title: Text(
            _userData['username'],
            overflow: TextOverflow.ellipsis,
          ),
          subtitle: isMedia
              ? Row(
                  children: [
                    const Icon(
                      Icons.image,
                      size: 16,
                      color: Colors.grey,
                    ),
                    const SizedBox(width: 4),
                    const Text(
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
          trailing: _userData['newMessages'] > 0
              ? CircleAvatar(
                  radius: 16,
                  child: Text(
                    (_userData['newMessages'] < 10
                            ? _userData['newMessages']
                            : "9+")
                        .toString(),
                  ),
                )
              : null,
        ),
        const Divider(),
      ],
    );
  }
}
