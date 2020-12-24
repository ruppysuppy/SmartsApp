import { join } from "path";

import { app, BrowserWindow } from "electron";

import { createMainWindow } from "./mainwindow";
import { createSplashScreen } from "./splashscreen";

import * as environments from "./nodeEnvironments";

const gotSingleInstanceLock = app.requestSingleInstanceLock();
if (!gotSingleInstanceLock) {
	app.quit();
}

process.env.NODE_ENV = environments.PRODUCTION;

const isDarwin = process.platform === "darwin";
const isDev = process.env.NODE_ENV === environments.DEVELOPMENT;

let mainWindow: BrowserWindow;
let splashScreen: BrowserWindow;
const iconPath = join(
	__dirname,
	"..",
	"front-end",
	"src",
	"assets",
	"img",
	isDarwin ? "ChatIcon.icns" : "ChatIcon.png"
);

const initializeHandler = () => {
	splashScreen = createSplashScreen(iconPath);
	setTimeout(() => {
		mainWindow = createMainWindow(iconPath, isDev, splashScreen);
	}, 1200);
};

const secondInstanceHandler = () => {
	if (mainWindow) {
		mainWindow.maximize();
		mainWindow.focus();
	} else if (splashScreen) {
		splashScreen.focus();
	}
};

const allWindowClosedHandler = () => {
	!isDarwin && app.quit();
};

app.on("second-instance", secondInstanceHandler);
app.on("ready", initializeHandler);
app.on("window-all-closed", allWindowClosedHandler);
