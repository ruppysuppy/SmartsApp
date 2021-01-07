import 'package:flutter/material.dart';

class DateDisplay extends StatefulWidget {
  final DateTime _dateCurr;

  DateDisplay(this._dateCurr);

  @override
  _DateDisplayState createState() => _DateDisplayState();
}

class _DateDisplayState extends State<DateDisplay>
    with TickerProviderStateMixin {
  AnimationController _controller;
  Animation<double> _animation;

  @override
  void initState() {
    super.initState();

    _controller = AnimationController(
      duration: const Duration(milliseconds: 200),
      vsync: this,
    );
    _animation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeInOut,
    );

    WidgetsBinding.instance.addPostFrameCallback((_) {
      _controller?.forward();
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return ScaleTransition(
      scale: _animation,
      alignment: Alignment.center,
      child: Container(
        child: Text(
          "${widget._dateCurr.day}/${widget._dateCurr.month}/${widget._dateCurr.year}",
          style: TextStyle(color: Colors.white),
        ),
        padding: EdgeInsets.symmetric(
          horizontal: 12,
          vertical: 8,
        ),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.all(
            Radius.circular(12),
          ),
          color: Colors.grey,
        ),
      ),
    );
  }
}
