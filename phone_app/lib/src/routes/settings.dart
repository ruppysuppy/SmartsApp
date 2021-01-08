import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import '../providers/auth_provider.dart';
import '../routes/user_details.dart';
import '../widgets/dark_mode_toggler.dart';
import '../widgets/dp_image_picker.dart';
import '../widgets/sidedrawer.dart';

class SettingsPage extends StatefulWidget {
  static const routeName = "/settings";

  @override
  _SettingsPageState createState() => _SettingsPageState();
}

class _SettingsPageState extends State<SettingsPage> {
  bool _isUpdating = false;
  bool _modified = false;
  String _about = "";

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final deviceSize = MediaQuery.of(context).size;
    final authProvider = Provider.of<AuthProvider>(context);

    if (authProvider.authData == null) {
      Navigator.of(context).pushReplacementNamed(UserDetailsPage.routeName);
    }

    return Scaffold(
      appBar: AppBar(
        title: const Text("SETTINGS"),
      ),
      drawer: SideDrawer(),
      body: Container(
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        height: deviceSize.height,
        width: deviceSize.width,
        color: themeData.backgroundColor,
        child: SingleChildScrollView(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              if (_isUpdating) ...[
                const SizedBox(height: 8),
                DpImagePicker(
                  (String url) => setImageUrl(url, authProvider),
                  setImageValid,
                ),
                const SizedBox(height: 8),
              ] else
                GestureDetector(
                  onTap: () {
                    setState(() {
                      _isUpdating = true;
                    });
                  },
                  child: Stack(
                    children: [
                      CircleAvatar(
                        child: ClipOval(
                          child:
                              Image.network(authProvider.authData['photoUrl']),
                        ),
                        radius: deviceSize.width > 350 ? 120 : 100,
                        backgroundImage: AssetImage("assets/img/loading.gif"),
                      ),
                      const Positioned(
                        bottom: 8,
                        right: 8,
                        child: CircleAvatar(
                          backgroundColor: Colors.tealAccent,
                          child: Icon(
                            Icons.edit,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              const SizedBox(height: 8),
              TextFormField(
                decoration: InputDecoration(
                  hintText: "Enter About",
                  labelText: "About",
                ),
                initialValue: authProvider.authData['about'],
                onChanged: (value) {
                  setState(() {
                    _about = value;
                    _modified = true;
                  });
                },
              ),
              if (_about != authProvider.authData['about'] && _modified) ...[
                const SizedBox(height: 8),
                Row(
                  children: [
                    authProvider.isLoading
                        ? const CircularProgressIndicator()
                        : RaisedButton(
                            onPressed: () {
                              authProvider.updateAbout(_about);
                            },
                            child: const Text("Update"),
                          ),
                    Expanded(
                      child: Container(),
                      flex: 1,
                    ),
                  ],
                ),
              ],
              const SizedBox(height: 16),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("Dark Mode"),
                  DarkModeToggler(),
                ],
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> setImageUrl(String url, AuthProvider authProvider) async {
    await authProvider.updateDp(url);
    Future.delayed(
      Duration(milliseconds: 500),
      () => setState(() {
        _isUpdating = false;
      }),
    );
  }

  void setImageValid(bool value) {}
}
