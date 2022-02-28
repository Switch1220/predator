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
import { Vpn } from '../common/typings/Vpn';

export default function App() {
  const [vpns, setVpns] = useState<Vpn[] | null>(defaultVpnValue.vpns);
  const [isFull, setIsFull] = useState<boolean>(defaultStatusValue.isFull);
  const [isPending, setIsPending] = useState<boolean>(
    defaultStatusValue.isPending
  );
  const [isConnected, setIsConnected] = useState<boolean>(
    defaultStatusValue.isConnected
  );
  const [isDisabled, setIsDisabled] = useState<boolean>(
    defaultStatusValue.isDisabled
  );

  useEffect(() => {
    window.electron.ipcRenderer.on('event-update', (update) => {
      setVpns(update as Vpn[]);
    });

    window.electron.ipcRenderer.on('event-is-full', (status) => {
      setIsFull(status as unknown as boolean);
    });

    window.electron.ipcRenderer.on('event-is-pending', (status) => {
      setIsDisabled(status as unknown as boolean);
    });

    window.electron.ipcRenderer.on('event-is-connected', (status) => {
      setIsConnected(status as unknown as boolean);
    });
  }, []);

  useEffect(() => {
    // 다 찼는데 연결되있으면 트루
    // 그거랑 상관없이 팬딩중이면 퐐스

    // 연결되있고 다 찼으면 클릭할수있음
    // 연결 안되있고 다 찼으면 못함
    const canClick = isConnected ? isFull : isFull;
    setIsDisabled(!canClick);
  }, [isFull, isConnected]);

  return (
    <MyVpnContext.Provider value={{ vpns }}>
      <MyStatusContext.Provider
        value={{ isConnected, isPending, isFull, isDisabled }}
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
