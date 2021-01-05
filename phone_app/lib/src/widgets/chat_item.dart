import 'package:flutter/material.dart';

import '../util/cipher.dart';

class ChatItem extends StatelessWidget {
  final Map<String, dynamic> message;
  final String uid;
  final String sharedKey;

  ChatItem(this.message, this.uid, this.sharedKey);

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final deviceSize = MediaQuery.of(context).size;

    final isUserSent = uid == message['sender'];

    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: Row(
        mainAxisAlignment:
            isUserSent ? MainAxisAlignment.end : MainAxisAlignment.start,
        children: [
          Container(
            padding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
            constraints: BoxConstraints(maxWidth: 0.8 * deviceSize.width),
            decoration: BoxDecoration(
              borderRadius: BorderRadius.only(
                topLeft: Radius.circular(12),
                topRight: Radius.circular(12),
                bottomLeft:
                    isUserSent ? Radius.circular(12) : Radius.circular(0),
                bottomRight:
                    isUserSent ? Radius.circular(0) : Radius.circular(12),
              ),
              color: isUserSent ? themeData.primaryColor : Colors.grey,
            ),
            child: Text(
              decrypt(message['text'], sharedKey),
              style: TextStyle(color: Colors.white),
            ),
          )
        ],
      ),
    );
  }
}
