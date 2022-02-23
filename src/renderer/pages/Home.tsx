import { Link } from 'react-router-dom';
import {
  useStatusContext,
  useVpnContext,
} from 'renderer/context/GlobalContext';
import '../App.css';

const RenderVpnTable = () => {
  const { vpns } = useVpnContext();
  return [1 , 2, 3].map((vpn) => {
    return (
      <tr key={vpn} className={'Avail t-row'}>
        <td className='t-cell'>dev2 vpn</td>
        <td className='t-cell'>59.15.3.213</td>
        <td className='t-cell availability'>
          <div className='available available--false'></div>
        </td>
        <td className='t-cell'>LESRFgHFq8HXCa0HAAAB</td>
      </tr>
    );
  });
};

const Home = () => {
  const { isConnected, canConnect, setCanConnect } = useStatusContext();

  const handleClick = () => {
    if (isConnected) {
      setCanConnect(!canConnect);
      console.log(`current: ${canConnect}`);
      window.electron.ipcRenderer.disconnectReq();
    } else {
      setCanConnect(!canConnect);
      window.electron.ipcRenderer.connectReq();
    }
    // window.electron.store.set('test-set', 'please');
    // console.log(window.electron.store.get('test-set'));
  };

  const handleCan = () => {
    setCanConnect(!canConnect);
  };

  return (
    <div>
      <h1>hi</h1>
      <table className='table'>
        <thead className='table__el'>
          <tr className="t-row">
            <th className="t-cell">Name</th>
            <th className="t-cell">Address</th>
            <th className="t-cell">Available</th>
            <th className="t-cell">User Info</th>
          </tr>
        </thead>
        <tbody className='table__el'>{RenderVpnTable()}</tbody>
      </table>
      <div className="Hello">
        <button type="button" onClick={handleClick} disabled={!canConnect}>
          <span role="img" aria-label="books">
            {isConnected ? 'Disconnect' : 'Connect'}
          </span>
        </button>
        <button type="button" onClick={handleCan}>
          set can connect!
        </button>
        <Link to="/signup">Sign Up!</Link>
      </div>
    </div>
  );
};

export default Home;
