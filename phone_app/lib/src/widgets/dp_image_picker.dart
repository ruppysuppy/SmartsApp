import 'dart:io';

import 'package:firebase_storage/firebase_storage.dart';
import 'package:flutter/material.dart';
import 'package:image_cropper/image_cropper.dart';
import 'package:image_picker/image_picker.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';

class DpImagePicker extends StatefulWidget {
  final Function _setImageUrl;
  final Function _setImageValid;

  DpImagePicker(this._setImageUrl, this._setImageValid);

  @override
  _DpImagePickerState createState() => _DpImagePickerState();
}

class _DpImagePickerState extends State<DpImagePicker> {
  final _firebaseStorage = FirebaseStorage.instance;
  final _picker = ImagePicker();
  bool _isLoading = false;
  bool _isDone = false;

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
          child: const Text(
            "Select Profile Picture",
          ),
        ),
        if (_isLoading) const CircularProgressIndicator(),
        if (_isDone)
          const Icon(
            Icons.done,
            color: Colors.green,
          ),
      ],
    );
  }

  selectImage(ThemeData themeData) async {
    final authProvider = Provider.of<AuthProvider>(context, listen: false);
    widget._setImageValid(false);
    setState(() {
      _isLoading = true;
      _isDone = false;
    });
    final pickedImage = await _picker.getImage(source: ImageSource.gallery);
    if (pickedImage == null) {
      setState(() {
        _isLoading = false;
        _isDone = false;
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
        _isLoading = false;
        _isDone = false;
      });
      return;
    }

    final ref = _firebaseStorage
        .ref()
        .child("profilepic")
        .child("${authProvider.auth.uid}");
    final uploadTask = ref.putFile(croppedImageFile);
    final url = await (await uploadTask).ref.getDownloadURL();

    widget._setImageUrl(url);
    widget._setImageValid(true);

    setState(() {
      _isLoading = false;
      _isDone = true;
    });
  }
}
