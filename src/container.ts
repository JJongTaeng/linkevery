import { container, Lifecycle } from 'tsyringe';
import { App } from './service/app/App';
import { ConnectionHandler } from './service/handlers/ConnectionHandler';
import { SignalingHandler } from './service/handlers/SignalingHandler';
import { NegotiationHandler } from './service/handlers/NegotiationHandler';
import { VoiceHandler } from './service/handlers/VoiceHandler';
import { HandlerManagerV2 } from './service/handlers/HandlerManagerV2';
import { ChatHandler } from './service/handlers/ChatHandler';
import { ScreenShareHandler } from './service/handlers/ScreenShareHandler';
import { AudioManager } from './service/media/AudioManager';
import { VideoManager } from './service/media/VideoManager';
import { SoundEffect } from './service/media/SoundEffect';
import { RTCManager } from './service/rtc/RTCManager';
import { DispatchEvent } from './service/peerEmitter/DispatchEvent';
import { MemberHandler } from './service/handlers/MemberHandler';
import { ConnectionDispatch } from './service/peerEmitter/ConnectionDispatch';
import { ChatDispatch } from './service/peerEmitter/ChatDispatch';
import { MemberDispatch } from './service/peerEmitter/MemberDispatch';
import { NegotiationDispatch } from './service/peerEmitter/NegotiationDispatch';
import { ScreenShareDispatch } from './service/peerEmitter/ScreenShareDispatch';
import { VoiceDispatch } from './service/peerEmitter/VoiceDispatch';
import { SignalingDispatch } from './service/peerEmitter/SignalingDispatch';

export const initContainer = () => {
  container.register(
    AudioManager,
    { useClass: AudioManager },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(
    VideoManager,
    { useClass: VideoManager },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(SoundEffect, { useClass: SoundEffect });
  container.register(
    RTCManager,
    { useClass: RTCManager },
    { lifecycle: Lifecycle.Singleton },
  );
  container.register(DispatchEvent, {
    useClass: DispatchEvent,
  });

  container.register(ConnectionDispatch, { useClass: ConnectionDispatch });
  container.register(SignalingDispatch, { useClass: SignalingDispatch });
  container.register(ChatDispatch, { useClass: ChatDispatch });
  container.register(MemberDispatch, { useClass: MemberDispatch });
  container.register(NegotiationDispatch, { useClass: NegotiationDispatch });
  container.register(ScreenShareDispatch, { useClass: ScreenShareDispatch });
  container.register(VoiceDispatch, { useClass: VoiceDispatch });

  container.register('Handler', { useClass: ConnectionHandler });
  container.register('Handler', { useClass: SignalingHandler });
  container.register('Handler', { useClass: NegotiationHandler });
  container.register('Handler', { useClass: VoiceHandler });
  container.register('Handler', { useClass: ChatHandler });
  container.register('Handler', { useClass: ScreenShareHandler });
  container.register('Handler', { useClass: MemberHandler });
  container.register('HandlerManager', { useClass: HandlerManagerV2 });
  container.resolve(App);
  container.afterResolution(
    App,
    (_t, result) => {
      container.resolve('HandlerManager');
    },
    { frequency: 'Once' },
  );
};
