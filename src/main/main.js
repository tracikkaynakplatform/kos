import { app, BrowserWindow, Menu } from "electron";
import contextMenu from "electron-context-menu";
import { initApis } from "./api";

// import { progressBar } from "electron-progressbar"
// global.ProgressBar = progressBar;

const mainMenuTemplate = [
	{
		label: "Dosya",
		submenu: [
			{
				label: "Çıkış",
				accelerator:
					process.platform == "darwin" ? "Command+Q" : "Ctrl+Q",
				role: "quit",
			},
		],
	},
	{
		label: "Düzenle",
		submenu: [
			{
				label: "Kes",
				accelerator:
					process.platform == "darwin" ? "Command+X" : "Ctrl+X",
				role: "cut",
			},
			{
				label: "Kopyala",
				accelerator:
					process.platform == "darwin" ? "Command+C" : "Ctrl+C",
				role: "copy",
			},
			{
				label: "Yapıştır",
				accelerator:
					process.platform == "darwin" ? "Command+V" : "Ctrl+V",
				role: "paste",
			},
			{
				label: "Hepsini Seç",
				accelerator:
					process.platform == "darwin" ? "Command+A" : "Ctrl+A",
				role: "selectAll",
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

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 1000,
		height: 1000,
		title: `KOS v${app.getVersion()}`,
		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			// devTools: !app.isPackaged, // => disabled explicit setting, below..
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

if (require("electron-squirrel-startup")) app.quit();

app.whenReady().then(() => {
	initApis();
});

app.on("ready", createWindow);
app.on("window-all-closed", () => app.quit());
app.on("activate", () =>
	BrowserWindow.getAllWindows().length === 0 ? createWindow() : null
);
