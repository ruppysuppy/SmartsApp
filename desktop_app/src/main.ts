import * as path from "path";

import { app, BrowserWindow, Menu } from "electron";

import * as environments from "./nodeEnvironments";

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

function initialize() {
	createSplashScreen();
	setTimeout(createMainWindow, 1200);
}

app.on("ready", initialize);

app.on("window-all-closed", () => !isDarwin && app.quit());
