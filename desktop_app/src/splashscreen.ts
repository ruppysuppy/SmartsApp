import { join } from "path";

import { BrowserWindow } from "electron";

export const createSplashScreen = (iconPath: string) => {
	const splashScreen = new BrowserWindow({
		frame: false,
		hasShadow: true,
		height: 300,
		icon: iconPath,
		resizable: false,
		show: false,
		width: 400,
	});

	splashScreen.loadFile(join(__dirname, "..", "splash-screen", "index.html"));
	splashScreen.on("ready-to-show", () => {
		splashScreen.show();
	});

	return splashScreen;
};
