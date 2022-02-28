/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, ipcMain, Menu, shell, Tray } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';

import store from './store';

import MenuBuilder from './menu';
import { resolveHtmlPath } from './util';

import socket from './socket';

import { messenger, logger } from './event-emitter';

import { checkHealth, updateVpns } from './http';
import { connect, disconnect } from './connector';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

const init = async () => {
  try {
    logger.emit('log', 'init...');

    socket.connect();

    await checkHealth();
    await updateVpns();

    const isFull = store.get('isFull');
    if (isFull !== undefined) {
      mainWindow?.webContents.send('event-is-full', isFull);
    }

    const isConnected = store.get('isConnected');
    if (isConnected !== undefined) {
      mainWindow?.webContents.send('event-is-connected', isConnected);
    }
  } catch (error) {
    logger.emit('error', error);
  }
};

const registerListeners = async () => {
  socket.on('connect', () => {
    const userInfo = store.get('userInfo');

    if (!userInfo) {
      const socketId = socket.id;
      store.set('userInfo', socketId);

      logger.emit('Main: set userInfo');
    }
  });

  messenger.on('update', () => {
    const vpns = store.get('vpns');
    mainWindow?.webContents.send('event-update', vpns);
  });

  // store.onDidChange('vpns', () => {
  // });

  store.onDidChange('isFull', () => {
    const isFull = store.get('isFull');
    mainWindow?.webContents.send('event-is-full', isFull);
  });

  store.onDidChange('isPending', (value: boolean | undefined) => {
    if (value !== undefined) {
      mainWindow?.webContents.send('event-is-pending', value);
    }
  });

  store.onDidChange('isConnected', (value: boolean | undefined) => {
    if (value !== undefined) {
      console.log('isconnected triggered');
      mainWindow?.webContents.send('event-is-connected', value);
    }
  });

  ipcMain.on('connect-req', connect);
  ipcMain.on('disconnect-req', disconnect);
};

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDevelopment =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDevelopment) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  mainWindow.on('close', (event) => {
    event.preventDefault();
    mainWindow?.hide();
  });

  tray = new Tray(getAssetPath('icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'quit',
      click: () => {
        mainWindow?.destroy();
        app.quit();
      },
    },
  ]);
  tray.setToolTip('predator');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow?.show();
  });

  mainWindow.once('ready-to-show', async () => {
    /**
     * throw error to renderer
     * @param {string} error msg
     */
    logger.on('error', (msg: string) => {
      console.log(msg);
      mainWindow?.webContents.send('error', msg);
    });

    logger.on('log', (msg: string) => {
      console.log(msg);
      mainWindow?.webContents.send('log', msg);
    });

    // eslint-disable-next-line @typescript-eslint/no-use-before-define
    registerListeners();

    await init();
  });

  // ipcMain.on('update', async () => {
  //   try {
  //     const res = await getVpns(httpUrl);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // ipcMain.on('connect-req', async () => {
  //   // socketProvider.emit('connect-req');
  // });

  // ipcMain.on('disconnect-req', async () => {
  //   const id = store.get('connectedVpn');

  //   socketProvider.emit('disconnect-req', id);
  // });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  socket.disconnect();
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
