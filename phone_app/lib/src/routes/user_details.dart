import 'package:flutter/material.dart';

import '../widgets/sidedrawer.dart';

class UserDetailsPage extends StatelessWidget {
  static const routeName = "/user-details";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text("User Details"),
      ),
      drawer: SideDrawer(),
    );
  }
}
