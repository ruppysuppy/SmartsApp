import 'package:flutter/material.dart';
import 'package:font_awesome_flutter/font_awesome_flutter.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';

class GoogleOAuth extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final authProvider = Provider.of<AuthProvider>(context, listen: false);

    return Center(
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.center,
        children: [
          Text("OR"),
          Container(
            padding: EdgeInsets.all(4),
            child: RaisedButton.icon(
              color: themeData.backgroundColor,
              shape: RoundedRectangleBorder(
                side: BorderSide(
                  color: themeData.textTheme.headline6.color,
                  width: 3,
                ),
                borderRadius: BorderRadius.circular(24),
              ),
              onPressed: () => signIn(authProvider, context, themeData),
              icon: FaIcon(
                FontAwesomeIcons.google,
                color: themeData.textTheme.headline6.color,
                size: themeData.textTheme.headline6.fontSize,
              ),
              label: Text(
                "Sign In with Google",
                style: TextStyle(
                  color: themeData.textTheme.headline6.color,
                  fontSize: 16,
                  fontWeight: FontWeight.bold,
                ),
              ),
              padding: EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            ),
          ),
        ],
      ),
    );
  }

  Future<void> signIn(
    AuthProvider authProvider,
    BuildContext context,
    ThemeData themeData,
  ) async {
    try {
      await authProvider.loginWithCredentails();
    } catch (_) {
      authProvider.setIsLoading(false);
      Scaffold.of(context).showSnackBar(
        SnackBar(
          content: Text(
            "An Error Occoured",
            style: TextStyle(
              color: themeData.errorColor,
            ),
          ),
          backgroundColor: Colors.black87,
          action: SnackBarAction(
            label: "Close",
            onPressed: Scaffold.of(context).hideCurrentSnackBar,
            textColor: themeData.errorColor,
          ),
        ),
      );
    }
  }
}
