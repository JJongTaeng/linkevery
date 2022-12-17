import React from "react";
import UsernameForm from "./components/UsernameForm";
import ChatRoom from "./components/ChatRoom";
import { useRecoilValue } from "recoil";
import { usernameAtom } from "./store/roomInfo";

function App() {
  const myName = useRecoilValue(usernameAtom);

  return (
    <div className="App">
      <div className={"flex justify-center items-center min-h-screen"}>
        <div className="mockup-phone">
          <div className="camera"></div>
          <div className="display">
            <div className="artboard artboard-demo phone-1">
              {myName ? <ChatRoom /> : <UsernameForm />}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
