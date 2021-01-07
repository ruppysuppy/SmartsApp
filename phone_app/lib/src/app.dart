import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:provider/provider.dart';

import './providers/auth_provider.dart';
import './providers/contact_provider.dart';
import './providers/dark_mode_provider.dart';

import './routes/chat.dart';
import './routes/contacts.dart';
import './routes/login.dart';
import './routes/register.dart';
import './routes/settings.dart';
import './routes/user_details.dart';
import './routes/view_image.dart';

const _primarySwatch = MaterialColor(0xFF7905FF, {
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

const _blankPage = Scaffold(
  body: Center(
    child: CircularProgressIndicator(),
  ),
);

ThemeData _generateThemeData(bool isDark) {
  return ThemeData(
    primarySwatch: _primarySwatch,
    fontFamily: "Lato",
    backgroundColor: isDark ? Color(0xFF222222) : Color(0xFFF0F0F0),
    errorColor: isDark ? Color(0xFFFF3E3E) : Color(0xFFFF0000),
    appBarTheme: AppBarTheme(elevation: isDark ? 0 : 4),
    buttonTheme: ButtonThemeData(
      buttonColor: _primarySwatch,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20.0)),
      textTheme: ButtonTextTheme.primary,
    ),
    textTheme: TextTheme(
      bodyText1:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      bodyText2:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      caption: TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      headline1:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      headline2:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      headline3:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      headline4:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      headline5:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      headline6:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      subtitle1:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      subtitle2:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
      overline:
          TextStyle(color: isDark ? Color(0xFFFFFFFF) : Color(0xFF000000)),
    ),
    inputDecorationTheme: InputDecorationTheme(
      enabledBorder: UnderlineInputBorder(
        borderSide: BorderSide(
          color: _primarySwatch,
        ),
      ),
      hintStyle: TextStyle(color: Color(0xFF808080)),
      labelStyle: TextStyle(color: _primarySwatch),
    ),
    dividerColor: isDark ? Colors.white : Colors.black,
  );
}

class App extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MultiProvider(
      providers: [
        ChangeNotifierProvider.value(
          value: AuthProvider(),
        ),
        ChangeNotifierProvider.value(
          value: ContactProvider(),
        ),
        ChangeNotifierProvider.value(
          value: DarkModeProvider(),
        ),
      ],
      child: FutureBuilder<void>(
          future: Firebase.initializeApp(),
          builder: (context, snapshot) {
            if (snapshot.connectionState == ConnectionState.waiting) {
              return MaterialApp(
                title: "SmartApp",
                home: _blankPage,
              );
            }
            return Consumer<DarkModeProvider>(
              builder: (_, darkModeProvider, _2) => MaterialApp(
                title: "SmartApp",
                theme: _generateThemeData(darkModeProvider.isDarkTheme),
                home: StreamBuilder<User>(
                  stream: FirebaseAuth.instance.authStateChanges(),
                  builder: (_, snapshot) {
                    if (snapshot.connectionState == ConnectionState.active) {
                      User user = snapshot.data;
                      if (user == null) {
                        return LoginPage();
                      }
                      final authProvider =
                          Provider.of<AuthProvider>(context, listen: false);
                      authProvider.login();
                      return FutureBuilder(
                        builder: (_, snapshotAuthData) =>
                            snapshotAuthData.connectionState ==
                                    ConnectionState.waiting
                                ? _blankPage
                                : ContactsPage(),
                        future: authProvider.getUserData(),
                      );
                    } else {
                      return _blankPage;
                    }
                  },
                ),
                routes: {
                  ChatPage.routeName: (ctx) => ChatPage(),
                  ContactsPage.routeName: (ctx) => ContactsPage(),
                  LoginPage.routeName: (ctx) => LoginPage(),
                  RegisterPage.routeName: (ctx) => RegisterPage(),
                  SettingsPage.routeName: (ctx) => SettingsPage(),
                  UserDetailsPage.routeName: (ctx) => UserDetailsPage(),
                  ViewImagePage.routeName: (ctx) => ViewImagePage(),
                },
              ),
            );
          }),
    );
  }
}
