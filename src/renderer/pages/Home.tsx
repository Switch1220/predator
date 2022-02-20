import { Link } from 'react-router-dom';
import {
  useStatusContext,
  useVpnContext,
} from 'renderer/context/GlobalContext';
import '../App.css';

const RenderVpnTable = () => {
  const { vpns } = useVpnContext();
  return vpns?.map((vpn) => {
    return (
      <tr key={vpn.id} className={vpn.isAvailable ? 'Avail' : 'Unavail'}>
        <td>{vpn.vpnName}</td>
        <td>{vpn.vpnAddress}</td>
        <td>{vpn.userInfo}</td>
      </tr>
    );
  });
};

const Home = () => {
  const { isConnected } = useStatusContext();

  const handleClick = () => {
    if (isConnected) {
      window.electron.ipcRenderer.connectReq();
    } else {
      window.electron.ipcRenderer.disconnectReq();
    }
    // window.electron.store.set('test-set', 'please');
    // console.log(window.electron.store.get('test-set'));
  };

  return (
    <div>
      <h1>hi</h1>
      <table>
        <tbody>{RenderVpnTable()}</tbody>
      </table>
      <div className="Hello">
        <button type="button" onClick={handleClick}>
          <span role="img" aria-label="books">
            {isConnected ? 'Disconnect' : 'Connect'}
          </span>
        </button>
        <Link to="/signup">Sign Up!</Link>
      </div>
    </div>
  );
};

export default Home;
