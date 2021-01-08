import 'dart:io';

import 'package:flutter/material.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';
import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';

import '../providers/dark_mode_provider.dart';

class SendMediaMessageBtn extends StatelessWidget {
  final String _otherId;
  final String _sharedKey;
  final _picker = ImagePicker();

  SendMediaMessageBtn(this._otherId, this._sharedKey);

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);
    final contactProvider = Provider.of<ContactProvider>(context);
    final darkModeProvider = Provider.of<DarkModeProvider>(context);

    return IconButton(
      icon: Icon(
        Icons.attachment,
        color: darkModeProvider.isDarkTheme ? Colors.white : Colors.grey,
      ),
      onPressed: () async {
        final pickedFile = await _picker.getImage(
          source: ImageSource.gallery,
          imageQuality: 65,
        );
        if (pickedFile == null) {
          return;
        }
        final image = File(pickedFile.path);
        await contactProvider.sendImage(
          authProvider.auth.uid,
          _otherId,
          image,
          _sharedKey,
        );
      },
    );
  }
}
