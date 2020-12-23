import { join } from "path";

import { BrowserWindow, Menu } from "electron";

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
		if (splashScreen) {
			splashScreen.destroy();
		}
	});

	return mainWindow;
};
