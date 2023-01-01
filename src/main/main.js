import { app, BrowserWindow, Menu } from "electron";
import contextMenu from "electron-context-menu";
import { initApis } from "./api";

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 1000,
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	});
	contextMenu({
		window: mainWindow,
		labels: {
			copy: "Kopyala",
			paste: "Yapıştır",
			cut: "Kes",
		},
		showSelectAll: false,
		showSearchWithGoogle: false,
		showInspectElement: false,
	});
	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
	if (process.env.NODE_ENV === "development")
		mainWindow.webContents.openDevTools();
	const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(mainMenu);
};

const mainMenuTemplate = [
	{
		label: "Menu",
		submenu: [
			{
				label: "Çıkış",
				accelerator:
					process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
				role: "quit",
			},
		],
	},
];

if (process.platform == "darwin") {
	mainMenuTemplate.unshift({
		label: app.getName(),
		role: "TODO",
	});
}

if (require("electron-squirrel-startup")) app.quit();

app.whenReady().then(() => {
	initApis();
});

app.on("ready", createWindow);
app.on("activate", () =>
	BrowserWindow.getAllWindows().length === 0 ? createWindow() : null
);
app.on("window-all-closed", () =>
	process.platform !== "darwin" ? app.quit() : null
);
