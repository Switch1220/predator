import store from '../store';
import socket from '../socket';

import {
  confirmConnectedVpn,
  confirmDisconnectedVpn,
  queueToDisconnect,
  registerVpn,
  updateVpns,
} from '../http';

import { connectVpn, disconnectVpn } from './powershellService';

import { messenger, logger } from '../event-emitter';

export const connect = async () => {
  try {
    store.set('isPending', true);

    await registerVpn();

    await connectVpn();
    store.set('isConnected', true);

    await confirmConnectedVpn();

    logger.emit('connected');
  } catch (error) {
    logger.emit('error', error);
  } finally {
    await updateVpns();
    messenger.emit('event-update');

    store.set('isPending', false);
  }
};

export const disconnect = async () => {
  try {
    store.set('isPending', true);

    await queueToDisconnect();

    await disconnectVpn();
    store.set('isConnected', false);

    await confirmDisconnectedVpn();
  } catch (error) {
    logger.emit('error', error);
  } finally {
    await updateVpns();
    messenger.emit('event-update');

    store.set('isPending', false);
  }
};
