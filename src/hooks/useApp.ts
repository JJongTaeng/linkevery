import { useRef } from 'react';
import { container } from 'tsyringe';
import { App } from 'service/app/App';
import { ConnectionPeerEmitter } from '../service/peerEmitter/ConnectionPeerEmitter';
import { SignalingPeerEmitter } from '../service/peerEmitter/SignalingPeerEmitter';
import { ChatPeerEmitter } from '../service/peerEmitter/ChatPeerEmitter';
import { MemberPeerEmitter } from '../service/peerEmitter/MemberPeerEmitter';
import { NegotiationPeerEmitter } from '../service/peerEmitter/NegotiationPeerEmitter';
import { ScreenSharePeerEmitter } from '../service/peerEmitter/ScreenSharePeerEmitter';
import { VoicePeerEmitter } from '../service/peerEmitter/VoicePeerEmitter';

export const useApp = () => {
  const app = useRef(container.resolve(App)).current;
  const connectionPeerEmitter = useRef(
    container.resolve(ConnectionPeerEmitter),
  ).current;
  const signalingPeerEmitter = useRef(
    container.resolve(SignalingPeerEmitter),
  ).current;
  const chatPeerEmitter = useRef(container.resolve(ChatPeerEmitter)).current;
  const memberPeerEmitter = useRef(
    container.resolve(MemberPeerEmitter),
  ).current;
  const negotiationPeerEmitter = useRef(
    container.resolve(NegotiationPeerEmitter),
  ).current;
  const screenSharePeerEmitter = useRef(
    container.resolve(ScreenSharePeerEmitter),
  ).current;
  const voicePeerEmitter = useRef(container.resolve(VoicePeerEmitter)).current;

  return {
    app,
    connectionPeerEmitter,
    signalingPeerEmitter,
    chatPeerEmitter,
    memberPeerEmitter,
    negotiationPeerEmitter,
    screenSharePeerEmitter,
    voicePeerEmitter,
  };
};
