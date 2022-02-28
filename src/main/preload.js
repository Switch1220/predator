const { contextBridge, ipcRenderer } = require('electron');

const validChannels = [
  'event-update',
  'event-is-pending',
  'event-is-connected',
  'connect-res',
  'disconnect-res',
];

contextBridge.exposeInMainWorld('electron', {
  store: {
    get(val) {
      return ipcRenderer.sendSync('electron-store-get', val);
    },
    set(property, val) {
      ipcRenderer.send('electron-store-set', property, val);
    },
  },
  ipcRenderer: {
    connectReq() {
      ipcRenderer.send('connect-req');
    },
    disconnectReq() {
      ipcRenderer.send('disconnect-req');
    },
    vpnReq() {
      ipcRenderer.send('vpn-req');
    },
    on(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args) => func(...args));
      }
    },
    once(channel, func) {
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.once(channel, (event, ...args) => func(...args));
      }
    },
  },
});
