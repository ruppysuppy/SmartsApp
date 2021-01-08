import 'package:Smartsapp/src/widgets/chat_input.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';

import './contacts.dart';
import './user_details.dart';
import '../providers/auth_provider.dart';
import '../providers/contact_provider.dart';
import '../widgets/chat_item.dart';
import '../widgets/date.dart';
import '../widgets/user_details_modal.dart';

class ChatPage extends StatefulWidget {
  static const routeName = "/chat";

  @override
  _ChatPageState createState() => _ChatPageState();
}

class _ChatPageState extends State<ChatPage> {
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();

    _scrollController.addListener(() async {
      if (_scrollController.position.pixels ==
          _scrollController.position.minScrollExtent) {
        final shouldScroll = await Provider.of<ContactProvider>(
          context,
          listen: false,
        ).fetchPreviousMessages(
          Provider.of<AuthProvider>(context, listen: false).auth.uid,
        );
        if (shouldScroll) {
          _scrollController.jumpTo(
            MediaQuery.of(context).size.height,
          );
        }
      }
    });

    WidgetsBinding.instance.addPostFrameCallback((_) async {
      final contactProvider = Provider.of<ContactProvider>(
        context,
        listen: false,
      );
      contactProvider.resetNewMessages();
      await contactProvider.fetchPreviousMessages(
        Provider.of<AuthProvider>(context, listen: false).auth.uid,
      );

      Future.delayed(
          Duration.zero,
          () => _scrollController
              .jumpTo(_scrollController.position.maxScrollExtent));
    });
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final themeData = Theme.of(context);
    final deviceSize = MediaQuery.of(context).size;
    final authProvider = Provider.of<AuthProvider>(context);
    final contactProvider = Provider.of<ContactProvider>(context);

    Future.delayed(Duration.zero, () {
      if (authProvider.authData == null) {
        Navigator.of(context).pushReplacementNamed(UserDetailsPage.routeName);
      } else if (contactProvider.selectedContact < 0) {
        Navigator.of(context).pushReplacementNamed(ContactsPage.routeName);
      }
    });

    final contact = contactProvider.contacts[contactProvider.selectedContact];

    return Scaffold(
      appBar: AppBar(
        title: GestureDetector(
          onTap: () => showModalBottomSheet(
            context: context,
            builder: (ctx) => UserDetailsModal(contact),
          ),
          child: Row(
            children: [
              CircleAvatar(
                child: ClipOval(
                  child: Image.network(contact['photoUrl']),
                ),
                backgroundImage: AssetImage("assets/img/loading.gif"),
              ),
              const SizedBox(width: 8),
              Text(contact['username']),
            ],
          ),
        ),
      ),
      body: Container(
        height: deviceSize.height,
        width: deviceSize.width,
        color: themeData.backgroundColor,
        child: authProvider.isLoading || contactProvider.isLoading
            ? Center(
                child: const CircularProgressIndicator(),
              )
            : Column(
                children: [
                  Expanded(
                    child: ListView.builder(
                      controller: _scrollController,
                      padding: EdgeInsets.all(16),
                      itemBuilder: (ctx, index) {
                        final dateCurr = DateTime.fromMillisecondsSinceEpoch(
                            contact['messages'][index]['timestamp']);
                        final datePrev = index > 0
                            ? DateTime.fromMillisecondsSinceEpoch(
                                contact['messages'][index - 1]['timestamp'])
                            : null;
                        if (index == 0 || datePrev.day != dateCurr.day) {
                          return Column(
                            children: [
                              if (contactProvider.isMessageLoading &&
                                  index == 0) ...[
                                const SizedBox(height: 8),
                                const CircularProgressIndicator(),
                                const SizedBox(height: 4),
                              ],
                              const SizedBox(height: 4),
                              DateDisplay(dateCurr),
                              const SizedBox(height: 4),
                              ChatItem(
                                contact['messages'][index]
                                    as Map<String, dynamic>,
                                authProvider.auth.uid,
                                contact['sharedKey'],
                              ),
                            ],
                          );
                        }
                        return ChatItem(
                          contact['messages'][index] as Map<String, dynamic>,
                          authProvider.auth.uid,
                          contact['sharedKey'],
                        );
                      },
                      itemCount: contact['messages'].length,
                    ),
                  ),
                  ChatInput(),
                ],
              ),
      ),
    );
  }
}
