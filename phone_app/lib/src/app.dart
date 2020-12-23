import 'package:flutter/material.dart';

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

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "SmartApp",
      theme: ThemeData(
        primarySwatch: primarySwatch,
        fontFamily: "Lato",
      ),
      home: Login(),
      routes: {
        Login.routeName: (ctx) => Login(),
      },
    );
  }
}
