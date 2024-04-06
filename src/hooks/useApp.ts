import { useRef } from 'react';
import { container } from 'tsyringe';
import { App } from 'service/app/App';
import { ConnectionEmitter } from '../service/emitter/ConnectionEmitter';
import { SignalingEmitter } from '../service/emitter/SignalingEmitter';
import { ChatEmitter } from '../service/emitter/ChatEmitter';
import { MemberEmitter } from '../service/emitter/MemberEmitter';
import { NegotiationEmitter } from '../service/emitter/NegotiationEmitter';
import { ScreenShareEmitter } from '../service/emitter/ScreenShareEmitter';
import { VoiceEmitter } from '../service/emitter/VoiceEmitter';
import { AudioManager } from '../service/media/AudioManager.ts';
import { VideoManager } from '../service/media/VideoManager.ts';
import { RoomEmitter } from '../service/emitter/RoomEmitter.ts';

export const useApp = () => {
  const app = useRef(container.resolve(App)).current;
  const connectionPeerEmitter = useRef(
    container.resolve(ConnectionEmitter),
  ).current;
  const signalingPeerEmitter = useRef(
    container.resolve(SignalingEmitter),
  ).current;
  const chatPeerEmitter = useRef(container.resolve(ChatEmitter)).current;
  const memberPeerEmitter = useRef(container.resolve(MemberEmitter)).current;
  const negotiationPeerEmitter = useRef(
    container.resolve(NegotiationEmitter),
  ).current;
  const screenSharePeerEmitter = useRef(
    container.resolve(ScreenShareEmitter),
  ).current;
  const voicePeerEmitter = useRef(container.resolve(VoiceEmitter)).current;
  const roomEmitter = useRef(container.resolve(RoomEmitter)).current;
  const audioManager = useRef(container.resolve(AudioManager))
    .current as AudioManager;
  const videoManager = useRef(container.resolve(VideoManager))
    .current as VideoManager;
  const broadcastChannel = useRef<BroadcastChannel>(
    container.resolve('broadcastChannel'),
  ).current;

  return {
    app,
    connectionPeerEmitter,
    signalingPeerEmitter,
    chatPeerEmitter,
    memberPeerEmitter,
    negotiationPeerEmitter,
    screenSharePeerEmitter,
    voicePeerEmitter,
    roomEmitter,
    audioManager,
    videoManager,
    broadcastChannel,
  };
};
