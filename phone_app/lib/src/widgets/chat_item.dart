import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/dark_mode_provider.dart';
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
    final darkModeProvider = Provider.of<DarkModeProvider>(context);

    final isUserSent = uid == message['sender'];
    final text = decrypt(message['text'], sharedKey);
    final time = DateTime.fromMillisecondsSinceEpoch(message['timestamp']);

    return Padding(
      padding: const EdgeInsets.only(bottom: 16, top: 8),
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
              color: isUserSent
                  ? themeData.primaryColor
                  : darkModeProvider.isDarkTheme
                      ? Colors.black
                      : themeData.backgroundColor,
              boxShadow: [
                BoxShadow(
                  color: isUserSent ? themeData.primaryColor : Colors.black,
                  spreadRadius: 0,
                  blurRadius: 6,
                ),
              ],
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                message['isMedia'] == true
                    ? Stack(
                        alignment: Alignment.center,
                        children: [
                          CircularProgressIndicator(
                            valueColor: AlwaysStoppedAnimation<Color>(
                              isUserSent ? null : themeData.primaryColor,
                            ),
                          ),
                          Image.network(text),
                        ],
                      )
                    : Text(
                        text,
                        style: TextStyle(
                          color: isUserSent ? Colors.white : null,
                          fontSize: 16,
                        ),
                      ),
                SizedBox(height: 4),
                Text(
                  "${time.hour}:${time.minute}",
                  style: TextStyle(
                    color: Colors.grey,
                    fontSize: 12,
                  ),
                ),
              ],
            ),
          )
        ],
      ),
    );
  }
}
