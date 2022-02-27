import { io } from 'socket.io-client';

import store from '../store';

const socketUrl = (store.get('socketUrl') as string) || 'ws://localhost:80';
const socket = io(socketUrl);

// renderer => connect-req
// main => emit('connect-req')

// connect
// disconnect
// update
export default socket;
