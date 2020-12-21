const XOREncryptDecrypt = (message: string, keyString: string) => {
	const key = keyString.split("");
	const output = [];
	for (let i = 0; i < message.length; i++) {
		const charCode =
			message.charCodeAt(i) ^ key[i % key.length].charCodeAt(0);
		output.push(String.fromCharCode(charCode));
	}
	return output.join("");
};

export const encrypt = (message: string, key: string) =>
	XOREncryptDecrypt(message, key);
export const decrypt = (encryptedMessage: string, key: string) =>
	XOREncryptDecrypt(encryptedMessage, key);
