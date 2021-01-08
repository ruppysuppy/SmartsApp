import 'package:flutter/material.dart';
import 'package:photo_view/photo_view.dart';
import 'package:provider/provider.dart';

import '../providers/contact_provider.dart';

class ViewImagePage extends StatelessWidget {
  static const routeName = "/view-image";

  @override
  Widget build(BuildContext context) {
    final contactProvider = Provider.of<ContactProvider>(context);

    if (contactProvider.imageUrl.isEmpty) {
      Navigator.of(context).pop();
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text("Image"),
      ),
      body: Container(
        child: PhotoView(
          imageProvider: NetworkImage(contactProvider.imageUrl),
          maxScale: PhotoViewComputedScale.contained * 2,
          minScale: PhotoViewComputedScale.contained * 1,
        ),
      ),
    );
  }
}
