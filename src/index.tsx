import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import { DispatchEvent } from "./test/DispatchEvent";
import { io } from "socket.io-client";
import { HandlerManager } from "./test/HandlerManager";
import { RTCManager } from "./lib/RTCManager";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

const rtcManager = RTCManager.getInstance();
const socket = io(process.env.REACT_APP_REQUEST_URL + "/rtc");

const dispatch = new DispatchEvent(socket, rtcManager);
new HandlerManager(socket, rtcManager, dispatch);

dispatch.joinMessage({});

// @ts-ignore
window.dispatch = dispatch;
root.render(
  // <React.StrictMode>
  <RecoilRoot>{/*<App />*/}</RecoilRoot>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
