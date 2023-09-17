import { useRef } from 'react';
import { container } from 'tsyringe';
import { App } from 'service/app/App';
import { ConnectionDispatch } from '../service/dispatch/ConnectionDispatch';
import { SignalingDispatch } from '../service/dispatch/SignalingDispatch';
import { ChatDispatch } from '../service/dispatch/ChatDispatch';
import { MemberDispatch } from '../service/dispatch/MemberDispatch';
import { NegotiationDispatch } from '../service/dispatch/NegotiationDispatch';
import { ScreenShareDispatch } from '../service/dispatch/ScreenShareDispatch';
import { VoiceDispatch } from '../service/dispatch/VoiceDispatch';

export const useApp = () => {
  const app = useRef(container.resolve(App)).current;
  const connectionDispatch = useRef(
    container.resolve(ConnectionDispatch),
  ).current;
  const signalingDispatch = useRef(
    container.resolve(SignalingDispatch),
  ).current;
  const chatDispatch = useRef(container.resolve(ChatDispatch)).current;
  const memberDispatch = useRef(container.resolve(MemberDispatch)).current;
  const negotiationDispatch = useRef(
    container.resolve(NegotiationDispatch),
  ).current;
  const screenShareDispatch = useRef(
    container.resolve(ScreenShareDispatch),
  ).current;
  const voiceDispatch = useRef(container.resolve(VoiceDispatch)).current;

  return {
    app,
    connectionDispatch,
    signalingDispatch,
    chatDispatch,
    memberDispatch,
    negotiationDispatch,
    screenShareDispatch,
    voiceDispatch,
  };
};
