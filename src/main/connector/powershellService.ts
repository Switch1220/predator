import task from 'main/event';
import store from 'main/store';

task.on('connect', async () => {
  const targetVpn = store.get('connectedVpn');
});
