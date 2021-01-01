String _xorEncryptDecrypt(String input, String keyString) {
  final List<String> key = keyString.split('');
  final List<String> output = [];
  for (int i = 0; i < input.length; i++) {
    final int charCode =
        input.codeUnitAt(i) ^ key[i % key.length].codeUnitAt(0);
    output.add(new String.fromCharCode(charCode));
  }
  return output.join("");
}

String encrypt(String message, String keyString) {
  return _xorEncryptDecrypt(message, keyString);
}

String decrypt(String encryptedMessage, String keyString) {
  return _xorEncryptDecrypt(encryptedMessage, keyString);
}
