import 'package:flutter/material.dart' show ChangeNotifier;

import '../util/shared_preferences.dart';

class DarkModeProvider with ChangeNotifier {
  DarkModePreference darkThemePreference = DarkModePreference();
  bool _isDarkTheme = false;

  bool get isDarkTheme => _isDarkTheme;

  set isDarkTheme(bool value) {
    _isDarkTheme = value;
    darkThemePreference.setDarkTheme(value);
    notifyListeners();
  }
}
