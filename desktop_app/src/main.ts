import { app, BrowserWindow } from "electron";
import * as path from "path";

const isDarwin = process.platform === "darwin";

let win: BrowserWindow;
let splashScreen: BrowserWindow;

function createSplashScreen() {
	splashScreen = new BrowserWindow({
		width: 400,
		height: 300,
		frame: false,
		skipTaskbar: true,
		hasShadow: true,
	});
	splashScreen.loadFile(
		path.join(__dirname, "..", "splash-screen", "index.html")
	);
}

function createMainWindow() {
	win = new BrowserWindow({
		width: 800,
		height: 600,
		show: false,
	});
	win.loadFile(path.join(__dirname, "..", "front-end", "index.html"));
	win.on("ready-to-show", () => {
		win.show();
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
