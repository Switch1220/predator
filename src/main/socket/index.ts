import { io } from 'socket.io-client';
import task from '../event';

import store from '../store';

const socketUrl = (store.get('socketUrl') as string) ?? 'ws://192.168.0.161:80';
const socket = io(socketUrl);

// renderer => connect-req
// main => emit('connect-req')

task.on('', () => {});

// connect
// disconnect
// update
