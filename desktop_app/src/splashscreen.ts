import * as fs from "fs";
import { join } from "path";

import { app, BrowserWindow } from "electron";

import { ISettings } from "./interfaces";

const appDataPath = join(app.getPath("appData"), "data.json");
const defaultSettings = {
	isDarkModeEnabled: false,
};

const fetchSettings = () => {
	if (fs.existsSync(appDataPath)) {
		const rawData = fs.readFileSync(appDataPath).toString();
		const data = JSON.parse(rawData) as ISettings;
		return data.isDarkModeEnabled;
	} else {
		fs.writeFileSync(appDataPath, JSON.stringify(defaultSettings));
		return defaultSettings.isDarkModeEnabled;
	}
};

export const createSplashScreen = (iconPath: string) => {
	const splashScreen = new BrowserWindow({
		frame: false,
		hasShadow: true,
		height: 300,
		icon: iconPath,
		resizable: false,
		show: false,
		width: 400,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	splashScreen.loadFile(join(__dirname, "..", "splash-screen", "index.html"));
	splashScreen.on("ready-to-show", () => {
		splashScreen.show();
		splashScreen.webContents.send("darkMode:get", fetchSettings());
	});

	return splashScreen;
};
