import { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { Route, Routes } from 'react-router-dom';

function App() {
  // const app = useRef(AppService.getInstance()).current;

  useEffect(() => {
    // app.start();
  }, []);

  return (
    <Routes>
      <Route path={'/'} element={<Card>Hello</Card>} />
    </Routes>
  );
}

export default App;
