import React, { useEffect, useRef, useState } from "react";
import { rtcManager, WebRTCManager } from "../lib/WebRTCManager";
import { io } from "socket.io-client";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { roomNameAtom, usernameAtom } from "../store/roomInfo";
import cloneDeep from "clone-deep";
import { nanoid } from "nanoid";
import { BeatLoader } from "react-spinners";

let mySocketId = "";

const ChatRoom = () => {
  const content = useRef<HTMLDivElement>(null);
  const socket = io(process.env.REACT_APP_REQUEST_URL + "/rtc");
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

  useEffect(() => {
    socket.emit("joinRoom", { roomName });

    socket.on("myId", ({ myId }) => {
      mySocketId = myId;
    });

    socket.on("welcome", async ({ callerId }) => {
      console.log(1, "welcome", callerId);
      rtcManager.createRTCPeer(callerId);
      rtcManager.createDataChannel(callerId);
      rtcManager.setEventIcecandidate(callerId, (ice) => {
        socket.emit("ice", { callerId: mySocketId, receiverId: callerId, ice });
      });
      const offer = await rtcManager.createOffer({
        id: callerId,
      });
      await rtcManager.setSdp({ type: "local", sdp: offer, id: callerId });
      socket.emit("offer", {
        offer,
        callerId: mySocketId,
        receiverId: callerId,
      });
    });

    socket.on("offer", async ({ callerId, sdp }) => {
      console.log(2, "offer", callerId, sdp);
      rtcManager.createRTCPeer(callerId);
      rtcManager.linkDataChannel(callerId);
      rtcManager.setEventIcecandidate(callerId, (ice) => {
        socket.emit("ice", { id: mySocketId, roomName, ice });
      });
      await rtcManager.setSdp({ type: "remote", sdp, id: callerId });
      const answer = await rtcManager.createAnswer({
        id: callerId,
      });
      await rtcManager.setSdp({ type: "local", sdp: answer, id: callerId });
      socket.emit("answer", {
        answer,
        callerId: mySocketId,
        receiverId: callerId,
      });
      rtcManager.log();
    });

    socket.on("answer", async ({ callerId, sdp }) => {
      console.log(3, "answer", callerId, sdp);
      await rtcManager.setSdp({ type: "remote", sdp, id: callerId });
      rtcManager.log();
    });
    socket.on("ice", async ({ callerId, ice }) => {
      console.log(5, "received ice", ice);
      rtcManager.setIcecandidate({ id: callerId, ice });
    });

    rtcManager.on(WebRTCManager.RTC_EVENT.MESSAGE, ({ name, message }) => {
      console.log(name, message);
      setMessage((prev) =>
        cloneDeep(prev).concat({ type: "other", name, message })
      );
    });
    rtcManager.on(WebRTCManager.RTC_EVENT.CONNECTING, () => {
      setLoading(true);
    });
    rtcManager.on(WebRTCManager.RTC_EVENT.CONNECTION, () => {
      setLoading(false);
    });
    return () => {
      socket.removeAllListeners();
      rtcManager.removeAllListeners();
    };
  }, []);

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
      <div className="divider"></div>
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
          rtcManager.sendAllDatachannelMessage({
            name: myName,
            message: value,
          });
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
