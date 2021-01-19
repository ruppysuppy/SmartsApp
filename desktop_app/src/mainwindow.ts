import * as fs from "fs";
import { join } from "path";

import { app, BrowserWindow, ipcMain, Menu } from "electron";

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

const storeSettings = (value: boolean) => {
	const rawData = fs.readFileSync(appDataPath).toString();
	const data = JSON.parse(rawData) as ISettings;
	data.isDarkModeEnabled = value;
	fs.writeFileSync(appDataPath, JSON.stringify(data));
};

export const createMainWindow = (
	iconPath: string,
	isDev: boolean,
	splashScreen?: BrowserWindow
) => {
	const mainWindow = new BrowserWindow({
		height: 600,
		icon: iconPath,
		minHeight: 600,
		minWidth: 800,
		show: false,
		width: 800,
		webPreferences: {
			nodeIntegration: true,
		},
	});

	isDev
		? mainWindow.loadURL("http://localhost:3000/")
		: mainWindow.loadFile(
				join(__dirname, "..", "front-end", "build", "index.html")
		  );

	!isDev && Menu.setApplicationMenu(null);
	mainWindow.on("ready-to-show", () => {
		mainWindow.maximize();
		mainWindow.show();
		mainWindow.webContents.send("darkMode:get", fetchSettings());
		ipcMain.on("darkMode:set", (_: any, value: boolean) =>
			storeSettings(value)
		);

		if (splashScreen) {
			splashScreen.destroy();
		}
	});

	return mainWindow;
};
