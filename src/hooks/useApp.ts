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
import { VideoManager } from '../service/media/VideoManager.ts';
import { RoomEmitter } from '../service/emitter/RoomEmitter.ts';
import { DrawEmitter } from '../service/emitter/DrawEmitter.ts';
import { AudioStreamManager } from 'service/media/AudioStreamManager.ts';

export const useApp = () => {
  const app = useRef(container.resolve(App)).current;
  const connectionEmitter = useRef(
    container.resolve(ConnectionEmitter),
  ).current;
  const signalingEmitter = useRef(container.resolve(SignalingEmitter)).current;
  const chatEmitter = useRef(container.resolve(ChatEmitter)).current;
  const memberEmitter = useRef(container.resolve(MemberEmitter)).current;
  const negotiationEmitter = useRef(
    container.resolve(NegotiationEmitter),
  ).current;
  const screenShareEmitter = useRef(
    container.resolve(ScreenShareEmitter),
  ).current;
  const drawEmitter = useRef(container.resolve(DrawEmitter))
    .current as DrawEmitter;
  const voiceEmitter = useRef(container.resolve(VoiceEmitter)).current;
  const roomEmitter = useRef(container.resolve(RoomEmitter)).current;
  const audioStreamManager = useRef(container.resolve(AudioStreamManager))
    .current as AudioStreamManager;
  const videoManager = useRef(container.resolve(VideoManager))
    .current as VideoManager;

  return {
    app,
    connectionEmitter,
    signalingEmitter,
    chatEmitter,
    memberEmitter,
    negotiationEmitter,
    screenShareEmitter,
    voiceEmitter,
    roomEmitter,
    drawEmitter,
    audioStreamManager,
    videoManager,
  };
};
