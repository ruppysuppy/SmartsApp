import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './providers/dark_mode_provider.dart';

import './routes/login.dart';

const primarySwatch = MaterialColor(0xFF7905FF, {
  50: Color.fromRGBO(121, 5, 255, 0.1),
  100: Color.fromRGBO(121, 5, 255, 0.2),
  200: Color.fromRGBO(121, 5, 255, 0.3),
  300: Color.fromRGBO(121, 5, 255, 0.4),
  400: Color.fromRGBO(121, 5, 255, 0.5),
  500: Color.fromRGBO(121, 5, 255, 0.6),
  600: Color.fromRGBO(121, 5, 255, 0.7),
  700: Color.fromRGBO(121, 5, 255, 0.8),
  800: Color.fromRGBO(121, 5, 255, 0.9),
  900: Color.fromRGBO(121, 5, 255, 1.0),
});

ThemeData generateThemeData(bool isDark) {
  return ThemeData(
    primarySwatch: primarySwatch,
    accentColor: Colors.teal,
    fontFamily: "Lato",
    backgroundColor: isDark ? Color(0xFF222222) : Color(0xFFF0F0F0),
    errorColor: isDark ? Color(0xFFFF3E3E) : Color(0xFFFF0000),
    textTheme: TextTheme(
      headline1:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      headline6:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      bodyText2:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
    ),
  );
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(
          value: DarkModeProvider(),
        ),
      ],
      child: Consumer<DarkModeProvider>(
        builder: (_, darkModeProvider, _2) => MaterialApp(
          title: "SmartApp",
          theme: generateThemeData(darkModeProvider.isDarkTheme),
          home: Login(),
          routes: {
            Login.routeName: (ctx) => Login(),
          },
        ),
      ),
    );
  }
}
