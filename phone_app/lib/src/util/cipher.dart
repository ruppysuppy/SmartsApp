String _xorEncryptDecrypt(String input, String key) {
  final List<String> keyList = key.split('');
  final List<String> output = [];
  for (int i = 0; i < input.length; i++) {
    final int charCode =
        input.codeUnitAt(i) ^ keyList[i % keyList.length].codeUnitAt(0);
    output.add(new String.fromCharCode(charCode));
  }
  return output.join("");
}

String encrypt(String message, String key) {
  return _xorEncryptDecrypt(message, key);
}

String decrypt(String encryptedMessage, String key) {
  return _xorEncryptDecrypt(encryptedMessage, key);
}
