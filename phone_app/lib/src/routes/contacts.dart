import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './user_details.dart';
import '../providers/auth_provider.dart';
import '../widgets/sidedrawer.dart';

class ContactsPage extends StatelessWidget {
  static const routeName = "/contacts";

  @override
  Widget build(BuildContext context) {
    final authProvider = Provider.of<AuthProvider>(context);

    Future.delayed(Duration.zero, () {
      if (authProvider.authData == null) {
        Navigator.of(context).pushReplacementNamed(UserDetailsPage.routeName);
      }
    });

    return Scaffold(
      appBar: AppBar(
        title: Text("Contacts"),
      ),
      drawer: SideDrawer(),
    );
  }
}
