import { BrowserWindow } from 'electron';
import Store from 'electron-store';
import { IStoreSchema } from 'main/store';
import { Vpn } from 'renderer/types/Vpn';
import { io, Socket } from 'socket.io-client';
import { connectVpn, disconnectVpn } from './vpnConnector';

export default class SocketProvider {
  private readonly socket: Socket;

  private mainWindow: BrowserWindow;

  private store: Store<IStoreSchema>;

  constructor(
    socketUrl: string,
    mainWindow: BrowserWindow,
    store: Store<IStoreSchema>
  ) {
    this.socket = io(socketUrl);
    this.mainWindow = mainWindow;
    this.store = store;
  }

  public emit(channel: string, args?: unknown) {
    this.socket.emit(channel, args);
  }

  public init() {
    this.socket.on('vpn-res', (vpns: Vpn[]) => {
      this.mainWindow.webContents.send('vpn-res', vpns);
    });

    this.socket.on('connect-res', async (vpn: Vpn) => {
      // connect logic
      const result = await connectVpn(vpn);

      const { id } = vpn;
      const userInfo = this.store.get('userInfo') ?? this.socket.id;
      this.store.set('connectedVpn', id);
      this.emit('confirm-req', { id, userInfo });
      this.mainWindow.webContents.send('connect-res', true);
      result.forEach((a) => console.log(a));
    });

    this.socket.on('disconnect-res', async (vpn: Vpn) => {
      // disconnect logic
      await disconnectVpn(vpn);

      this.store.reset('connectedVpn');
      this.mainWindow.webContents.send('disconnect-res');
    });
  }
}
