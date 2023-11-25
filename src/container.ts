import { container, Lifecycle } from 'tsyringe';
import { App } from './service/app/App';
import { ConnectionHandler } from './service/handler/ConnectionHandler';
import { SignalingHandler } from './service/handler/SignalingHandler';
import { NegotiationHandler } from './service/handler/NegotiationHandler';
import { VoiceHandler } from './service/handler/VoiceHandler';
import { HandlerManager } from './service/handler/HandlerManager';
import { ChatHandler } from './service/handler/ChatHandler';
import { ScreenShareHandler } from './service/handler/ScreenShareHandler';
import { AudioManager } from './service/media/AudioManager';
import { VideoManager } from './service/media/VideoManager';
import { RTCManager } from './service/rtc/RTCManager';
import { MemberHandler } from './service/handler/MemberHandler';
import { ConnectionEmitter } from './service/emitter/ConnectionEmitter';
import { ChatEmitter } from './service/emitter/ChatEmitter';
import { MemberEmitter } from './service/emitter/MemberEmitter';
import { NegotiationEmitter } from './service/emitter/NegotiationEmitter';
import { ScreenShareEmitter } from './service/emitter/ScreenShareEmitter';
import { VoiceEmitter } from './service/emitter/VoiceEmitter';
import { SignalingEmitter } from './service/emitter/SignalingEmitter';
import EventEmitter from 'events';
import { EventManager } from './service/event/EventManager';
import { EmitterManager } from './service/emitter/EmitterManager';
import { RoomHandler } from './service/handler/RoomHandler';

export const initContainer = () => {
  container.register('ee', { useValue: new EventEmitter() });
  container.register(
    EventManager,
    { useClass: EventManager },
    { lifecycle: Lifecycle.Singleton },
  );
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
  container.register(
    RTCManager,
    { useClass: RTCManager },
    { lifecycle: Lifecycle.Singleton },
  );

  container.register('EmitterService', { useClass: EmitterManager });

  container.register(ConnectionEmitter, {
    useClass: ConnectionEmitter,
  });
  container.register(SignalingEmitter, { useClass: SignalingEmitter });
  container.register(ChatEmitter, { useClass: ChatEmitter });
  container.register(MemberEmitter, { useClass: MemberEmitter });
  container.register(NegotiationEmitter, {
    useClass: NegotiationEmitter,
  });
  container.register(ScreenShareEmitter, {
    useClass: ScreenShareEmitter,
  });
  container.register(VoiceEmitter, { useClass: VoiceEmitter });

  container.register('PeerHandler', { useClass: ConnectionHandler });
  container.register('PeerHandler', { useClass: SignalingHandler });
  container.register('PeerHandler', { useClass: NegotiationHandler });
  container.register('PeerHandler', { useClass: VoiceHandler });
  container.register('PeerHandler', { useClass: ChatHandler });
  container.register('PeerHandler', { useClass: ScreenShareHandler });
  container.register('PeerHandler', { useClass: MemberHandler });
  container.register('PeerHandler', { useClass: RoomHandler });

  container.register('HandlerManager', { useClass: HandlerManager });
  container.resolve(App);
  container.afterResolution(
    App,
    (_t, result) => {
      container.resolve('HandlerManager');
    },
    { frequency: 'Once' },
  );
};
