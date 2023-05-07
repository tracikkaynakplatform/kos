import { app, BrowserWindow } from "electron";
import { initAPIs } from "./api";

declare const MAIN_WINDOW_WEBPACK_ENTRY: string;
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string;

if (require("electron-squirrel-startup")) {
	app.quit();
}

const createWindow = (): void => {
	// Create the browser window.
	const mainWindow = new BrowserWindow({
		height: 800,
		width: 1200,
		icon: "assets/icon.png",
		webPreferences: {
			// https://github.com/electron/forge/issues/2931#issuecomment-1355864473
			nodeIntegration: true,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
	mainWindow.webContents.openDevTools();
	initAPIs();
};

app.on("ready", createWindow);
app.on("window-all-closed", () => {
	app.quit();
});
app.on("activate", () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
