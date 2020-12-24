import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/dark_mode_provider.dart';

class Login extends StatelessWidget {
  static const routeName = "/login";

  @override
  Widget build(BuildContext context) {
    final themeChange = Provider.of<DarkModeProvider>(context);
    final themeData = Theme.of(context);

    return Scaffold(
      appBar: AppBar(
        title: const Text("SmartsApp"),
      ),
      body: Container(
        color: themeData.backgroundColor,
        child: Center(
          child: Container(
            child: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                Checkbox(
                    value: themeChange.isDarkTheme,
                    onChanged: (bool value) {
                      themeChange.isDarkTheme = value;
                    }),
                Text("data")
              ],
            ),
          ),
        ),
      ),
    );
  }
}
