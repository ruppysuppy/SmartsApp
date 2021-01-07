import 'package:flutter/material.dart' show ChangeNotifier;

import '../util/shared_preferences.dart';

class DarkModeProvider with ChangeNotifier {
  DarkModePreference _darkThemePreference = DarkModePreference();
  bool _isDarkTheme = false;

  bool get isDarkTheme {
    return _isDarkTheme;
  }

  set isDarkTheme(bool value) {
    _isDarkTheme = value;
    _darkThemePreference.setDarkTheme(value);
    notifyListeners();
  }
}
