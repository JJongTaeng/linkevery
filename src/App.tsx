import { useEffect, useRef } from 'react';
import { Route, Routes } from 'react-router-dom';
import AppContainer from './components/container/AppContainer';
import { AppServiceImpl } from './service/app/AppServiceImpl';

function App() {
  const app = useRef(AppServiceImpl.getInstance()).current;

  useEffect(() => {
    app.connectSocket();
  }, []);

  return (
    <Routes>
      <Route path={'/'} element={<AppContainer />} />
    </Routes>
  );
}

export default App;
