import { useEffect, useRef } from 'react';
import { Card } from 'antd';
import { AppService } from './service/app/AppService';

function App() {
  const app = useRef(AppService.getInstance()).current;

  useEffect(() => {
    app.start();
  }, []);

  return (
    <div className="App">
      <Card onClick={() => app.getDispatch().chatMessage({ message: 'hello' })}>
        hello
      </Card>
    </div>
  );
}

export default App;
