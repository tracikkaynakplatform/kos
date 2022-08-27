import {app, BrowserWindow, ipcMain} from 'electron';
import {initApis} from './api';

const createWindow = () => {
    const mainWindow = new BrowserWindow({
        width: 1000,
        height: 1000,
        webPreferences: {
            preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
        },
    });
    mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);
    mainWindow.webContents.openDevTools();
};

if (require('electron-squirrel-startup'))
    app.quit();
app.whenReady().then(() => initApis());
app.on('ready', createWindow);

app.on('activate', () => BrowserWindow.getAllWindows().length === 0 ? createWindow() : null);
app.on('window-all-closed', () => process.platform !== 'darwin' ? app.quit() : null);
