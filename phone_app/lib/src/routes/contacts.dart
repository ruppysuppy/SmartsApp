import 'package:flutter/material.dart';

import '../widgets/sidedrawer.dart';

class ContactsPage extends StatelessWidget {
  static const routeName = "/contacts";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("Contacts"),
      ),
      drawer: SideDrawer(),
    );
  }
}
