import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { roomNameAtom, usernameAtom } from "../store/roomInfo";
import cloneDeep from "clone-deep";
import { nanoid } from "nanoid";
import { BeatLoader } from "react-spinners";
import { RTCManager } from "../service/rtc/RTCManager";
import { DispatchEvent } from "../service/dispatch/DispatchEvent";
import { HandlerManager } from "../service/handlers/HandlerManager";

const rtcManager = RTCManager.getInstance();
const socket = io(process.env.REACT_APP_REQUEST_URL + "/rtc");

const dispatch = new DispatchEvent(socket, rtcManager);
new HandlerManager(socket, rtcManager, dispatch);

dispatch.joinMessage({});

// @ts-ignore
window.dispatch = dispatch;

const ChatRoom = () => {
  const content = useRef<HTMLDivElement>(null);
  const [message, setMessage] = useState<
    {
      type: "other" | "me";
      name: string;
      message: string;
    }[]
  >([]);
  const roomName = useRecoilValue(roomNameAtom);
  const myName = useRecoilValue(usernameAtom);
  const setUsername = useSetRecoilState(usernameAtom);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (content.current)
      content.current.scrollIntoView({
        block: "end",
        inline: "end",
        behavior: "smooth",
      });
  }, [message.length]);

  return (
    <div className="w-full min-h-full flex flex-col py-3">
      <div className={"w-full px-3 pt-3 flex justify-between"}>
        <span className="px-3 badge badge-primary ">{myName}</span>
        <span
          className="px-3 badge cursor-pointer"
          onClick={() => {
            sessionStorage.removeItem("username");
            setUsername("");
          }}
        >
          나가기
        </span>
      </div>
      <div className="divider" />
      {loading ? (
        <div className="flex px-3 h-full justify-center items-center">
          <BeatLoader />
        </div>
      ) : (
        <div className="px-3 h-full overflow-auto">
          {message.map(({ name, message, type }) => {
            return (
              <div key={nanoid()}>
                {type === "other" ? (
                  <div className="chat chat-start">
                    <div className="chat-header">{name}</div>
                    <div className="chat-bubble">{message}</div>
                  </div>
                ) : (
                  <div className="chat chat-end">
                    <div className="chat-header">{name}</div>
                    <div className="chat-bubble">{message}</div>
                  </div>
                )}
              </div>
            );
          })}
          <div ref={content} className={"w-full h-1"} />
        </div>
      )}
      <div className="divider" />
      <form
        className="flex px-3"
        onSubmit={(e: any) => {
          e.preventDefault();
          const value = e.target.message.value;
          if (!value) return;
          setMessage((prev) =>
            cloneDeep(prev).concat({
              type: "me",
              name: myName,
              message: value,
            })
          );
          e.target.message.value = "";
          e.target.focus();
        }}
      >
        <input
          className="input input-bordered input-info w-full"
          type={"text"}
          name={"message"}
        />
        <button disabled={loading} className="btn" type={"submit"}>
          전송
        </button>
      </form>
    </div>
  );
};

export default ChatRoom;
