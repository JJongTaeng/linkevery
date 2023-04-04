import React, { useEffect, useRef, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { roomNameAtom, usernameAtom } from "../store/roomInfo";
import { StorageService } from "../service/storage/StorageService";
import { AppService } from "../service/app/AppService";

const storage = StorageService.getInstance();

const ChatRoom = () => {
  const app = useRef(AppService.getInstance()).current;
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

  useEffect(() => {
    // app.start();
  }, []);

  return <div></div>;
};

export default ChatRoom;
