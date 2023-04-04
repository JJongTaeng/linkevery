import React from "react";
import { useRecoilValue } from "recoil";
import { usernameAtom } from "./store/roomInfo";
import { Card } from "antd";

function App() {
  const myName = useRecoilValue(usernameAtom);

  return (
    <div className="App">
      <Card>hello</Card>
    </div>
  );
}

export default App;
