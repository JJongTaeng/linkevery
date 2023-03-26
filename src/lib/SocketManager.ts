import EventEmitter from "events";
import { io, Socket } from "socket.io-client";

enum EVENT_TYPE {
  JOIN_ROOM = "JOIN_ROOM",
  WELCOME = "WELCOME",
  MY_ID = "MY_ID",
  ON_OFFER = "ON_OFFER",
  ANSWER = "ANSWER",
  ON_ICE = "ON_ICE",
  LEAVE = "LEAVE",
  SEND_ICE = "SEND_ICE",
  SEND_OFFER = "SEND_OFFER",
}

export class SocketManager extends EventEmitter {
  private static instance: SocketManager;
  private socket: Socket;
  public eventType = EVENT_TYPE;

  constructor(url: string) {
    super();
    this.socket = io(url);
    this.init();
  }

  public static getInstance() {
    if (!SocketManager.instance) {
      SocketManager.instance = new SocketManager(
        process.env.REACT_APP_REQUEST_URL + "/rtc"
      );
    }

    return SocketManager.instance;
  }

  public sendJoinRoom(roomName: string) {
    this.socket.emit("joinRoom", { roomName });
    this.emit(this.eventType.JOIN_ROOM, { roomName });
  }

  public sendIce({
    callerId,
    receiverId,
    ice,
  }: {
    callerId: string;
    receiverId: string;
    ice: RTCIceCandidate;
  }) {
    this.socket.emit("ice", { callerId, receiverId, ice });
    this.emit(this.eventType.SEND_ICE, { callerId, receiverId, ice });
  }

  public sendOffer({
    offer,
    callerId,
    receiverId,
  }: {
    offer: RTCSessionDescriptionInit;
    callerId: string;
    receiverId: string;
  }) {
    this.socket.emit("offer", { offer, callerId, receiverId });
    this.emit(this.eventType.SEND_OFFER, { offer, callerId, receiverId });
  }

  private init() {
    this.onMyId();
    this.onWelcome();
    this.onOffer();
    this.onAnswer();
    this.onIce();
    this.onLeave();
  }

  private onMyId() {
    this.socket.on("myId", ({ myId }) => {
      this.emit(this.eventType.MY_ID, { myId });
    });
  }

  private onWelcome() {
    this.socket.on("welcome", ({ callerId }) => {
      this.emit(this.eventType.WELCOME, { callerId });
    });
  }

  private onOffer() {
    this.socket.on("offer", ({ callerId, sdp }) => {
      this.emit(this.eventType.ON_OFFER, { callerId, sdp });
    });
  }

  private onAnswer() {
    this.socket.on("answer", ({ callerId, sdp }) => {
      this.emit(this.eventType.ANSWER, { callerId, sdp });
    });
  }

  private onIce() {
    this.socket.on("ice", async ({ callerId, ice }) => {
      this.emit(this.eventType.ON_ICE, { callerId, ice });
    });
  }

  private onLeave() {
    this.socket.on("leave", ({ callerId }) => {
      this.emit(this.eventType.LEAVE, { callerId });
    });
  }
}

export const socketManager = SocketManager.getInstance();
