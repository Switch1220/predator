import { useEffect, useState } from 'react';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import {
  defaultStatusValue,
  defaultVpnValue,
  MyStatusContext,
  MyVpnContext,
} from './context/GlobalContext';
import Home from './pages/Home';
import SignUp from './pages/SignUp';
import { Vpn } from './types/Vpn';
import './styles/index.scss';

export default function App() {
  const [vpns, setVpns] = useState<Vpn[] | null>(defaultVpnValue.vpns);
  const [canConnect, setCanConnect] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(
    defaultStatusValue.isConnected
  );

  useEffect(() => {
    window.electron.ipcRenderer.on('vpn-res', (val) => {
      const vpnArray = val as Vpn[];

      const hasAvailableVpn = vpnArray.some((vpn) => {
        return vpn.isAvailable === true;
      });

      setCanConnect(hasAvailableVpn);
      console.log('iasdf');

      // update res와 vpn res를 분리하여 구현
      // update <- broadcast
      // 그리고 sender에게 직접 업데이트된 vpn리스트 전송(setCanConnect 없이)

      setVpns(vpnArray);
    });

    window.electron.ipcRenderer.vpnReq();

    window.electron.ipcRenderer.on('connect-res', (val) => {
      setIsConnected(val as unknown as boolean);
      setCanConnect(true);
    });

    window.electron.ipcRenderer.on('disconnect-res', () => {
      setIsConnected(false);
      setCanConnect(true);
    });
  }, []);

  return (
    <MyVpnContext.Provider value={{ vpns }}>
      <MyStatusContext.Provider
        value={{ isConnected, canConnect, setCanConnect }}
      >
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<SignUp />} />
          </Routes>
        </Router>
      </MyStatusContext.Provider>
    </MyVpnContext.Provider>
  );
}
