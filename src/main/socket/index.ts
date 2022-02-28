import { io } from 'socket.io-client';

import store from '../store';

const socketUrl = (store.get('socketUrl') as string) || 'ws://localhost:80';

const socket = io(socketUrl, { autoConnect: false });

export default socket;
