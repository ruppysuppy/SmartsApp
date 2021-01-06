import 'dart:io';

import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';

class DpImagePicker extends StatefulWidget {
  final Function setImageUrl;
  final Function setImageValid;

  DpImagePicker(this.setImageUrl, this.setImageValid);

  @override
  _DpImagePickerState createState() => _DpImagePickerState();
}

class _DpImagePickerState extends State<DpImagePicker> {
  final firebaseStorage = FirebaseStorage.instance;
  final picker = ImagePicker();
  bool isLoading = false;
  bool isDone = false;

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);

    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        RaisedButton(
          color: Colors.grey,
          textColor: Colors.white,
          onPressed: () => selectImage(themeData),
          child: Text(
            "Select Profile Picture",
          ),
        ),
        if (isLoading)
          CircularProgressIndicator(
            valueColor: AlwaysStoppedAnimation(themeData.primaryColor),
          ),
        if (isDone)
          Icon(
            Icons.done,
            color: Colors.green,
          ),
      ],
    );
  }

  selectImage(ThemeData themeData) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    widget.setImageValid(false);
    setState(() {
      isLoading = true;
      isDone = false;
    });
    final pickedImage = await picker.getImage(source: ImageSource.gallery);
    if (pickedImage == null) {
      setState(() {
        isLoading = false;
        isDone = false;
      });
      return;
    }
    final File croppedImageFile = await ImageCropper.cropImage(
      sourcePath: pickedImage.path,
      aspectRatio: CropAspectRatio(
        ratioX: 1,
        ratioY: 1,
      ),
      maxHeight: 800,
      maxWidth: 800,
      compressFormat: ImageCompressFormat.jpg,
    );

    if (croppedImageFile == null) {
      setState(() {
        isLoading = false;
        isDone = false;
      });
      return;
    }

    final ref = firebaseStorage
        .ref()
        .child("profilepic")
        .child("${authProvider.auth.uid}.jpg");
    final uploadTask = ref.putFile(croppedImageFile);
    final url = await (await uploadTask).ref.getDownloadURL();

    widget.setImageUrl(url);
    widget.setImageValid(true);

    setState(() {
      isLoading = false;
      isDone = true;
    });
  }
}
