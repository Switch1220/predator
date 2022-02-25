import { ipcMain } from 'electron';

import store from '../store';

ipcMain.on('electron-store-get', async (event, key) => {
  event.returnValue = store.get(key);
});

ipcMain.on('electron-store-set', async (_event, key, val) => {
  store.set(key, val);
});
