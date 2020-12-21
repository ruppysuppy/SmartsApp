import * as path from "path";

import { app, BrowserWindow, Menu } from "electron";

import * as environments from "./nodeEnvironments";

const gotSingleInstanceLock = app.requestSingleInstanceLock();

if (!gotSingleInstanceLock) {
	app.quit();
}

process.env.NODE_ENV = environments.DEVELOPMENT;

const isDarwin = process.platform === "darwin";
const isDev = process.env.NODE_ENV === environments.DEVELOPMENT;

let mainWindow: BrowserWindow;
let splashScreen: BrowserWindow;

function createSplashScreen() {
	splashScreen = new BrowserWindow({
		frame: false,
		hasShadow: true,
		height: 300,
		icon: path.join(
			__dirname,
			"..",
			"front-end",
			"src",
			"assets",
			"img",
			isDarwin ? "ChatIcon.icns" : "ChatIcon.png"
		),
		resizable: false,
		show: false,
		width: 400,
	});
	splashScreen.loadFile(
		path.join(__dirname, "..", "splash-screen", "index.html")
	);
	splashScreen.on("ready-to-show", () => {
		splashScreen.show();
	});
}

function createMainWindow() {
	mainWindow = new BrowserWindow({
		height: 600,
		icon: path.join(
			__dirname,
			"..",
			"front-end",
			"src",
			"assets",
			"img",
			isDarwin ? "ChatIcon.icns" : "ChatIcon.png"
		),
		minHeight: 600,
		minWidth: 800,
		show: false,
		width: 800,
	});
	isDev
		? mainWindow.loadURL("http://localhost:3000/")
		: mainWindow.loadFile(
				path.join(__dirname, "..", "front-end", "build", "index.html")
		  );
	Menu.setApplicationMenu(null);
	mainWindow.on("ready-to-show", () => {
		mainWindow.show();
		if (splashScreen) {
			splashScreen.destroy();
		}
	});
}

const initializeHandler = () => {
	createSplashScreen();
	setTimeout(createMainWindow, 1200);
};

const secondInstanceHandler = () => {
	if (mainWindow) {
		mainWindow.maximize();
		mainWindow.focus();
	} else if (splashScreen) {
		splashScreen.focus();
	}
};

app.on("second-instance", secondInstanceHandler);

app.on("ready", initializeHandler);

app.on("window-all-closed", () => !isDarwin && app.quit());
