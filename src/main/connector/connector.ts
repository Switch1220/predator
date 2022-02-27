import store from '../store';

import { confirmVpn, registerVpn, updateVpns } from '../http';

import { connectVpn } from './powershellService';

import { messenger, logger } from '../event-emitter';

export const connect = async () => {
  try {
    store.set('isPending', true);
    messenger.emit('event-pending');

    await registerVpn();

    await connectVpn();
    store.set('isConnected', true);
    messenger.emit('event-connection', true);

    await confirmVpn();

    logger.emit('connected');
  } catch (error) {
    logger.emit('error', error);
  } finally {
    await updateVpns();
    messenger.emit('event-update');

    store.set('isPending', false);
    messenger.emit('event-pending');
  }
};

export const disconnect = async () => {};
