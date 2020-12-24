import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/dark_mode_provider.dart';

class DarkModeToggler extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final themeChange = Provider.of<DarkModeProvider>(context);

    return Checkbox(
      value: themeChange.isDarkTheme,
      onChanged: (bool value) {
        themeChange.isDarkTheme = value;
      },
    );
  }
}
