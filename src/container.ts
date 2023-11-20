import { container, Lifecycle } from 'tsyringe';
import { App } from './service/app/App';
import { ConnectionPeerHandler } from './service/handler/ConnectionPeerHandler';
import { SignalingPeerHandler } from './service/handler/SignalingPeerHandler';
import { NegotiationPeerHandler } from './service/handler/NegotiationPeerHandler';
import { VoicePeerHandler } from './service/handler/VoicePeerHandler';
import { HandlerManager } from './service/handler/HandlerManager';
import { ChatPeerHandler } from './service/handler/ChatPeerHandler';
import { ScreenSharePeerHandler } from './service/handler/ScreenSharePeerHandler';
import { AudioManager } from './service/media/AudioManager';
import { VideoManager } from './service/media/VideoManager';
import { SoundEffect } from './service/media/SoundEffect';
import { RTCManager } from './service/rtc/RTCManager';
import { MemberPeerHandler } from './service/handler/MemberPeerHandler';
import { ConnectionPeerEmitter } from './service/emitter/ConnectionPeerEmitter';
import { ChatPeerEmitter } from './service/emitter/ChatPeerEmitter';
import { MemberPeerEmitter } from './service/emitter/MemberPeerEmitter';
import { NegotiationPeerEmitter } from './service/emitter/NegotiationPeerEmitter';
import { ScreenSharePeerEmitter } from './service/emitter/ScreenSharePeerEmitter';
import { VoicePeerEmitter } from './service/emitter/VoicePeerEmitter';
import { SignalingPeerEmitter } from './service/emitter/SignalingPeerEmitter';
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
  container.register(SoundEffect, { useClass: SoundEffect });
  container.register(
    RTCManager,
    { useClass: RTCManager },
    { lifecycle: Lifecycle.Singleton },
  );

  container.register('EmitterService', { useClass: EmitterManager });

  container.register(ConnectionPeerEmitter, {
    useClass: ConnectionPeerEmitter,
  });
  container.register(SignalingPeerEmitter, { useClass: SignalingPeerEmitter });
  container.register(ChatPeerEmitter, { useClass: ChatPeerEmitter });
  container.register(MemberPeerEmitter, { useClass: MemberPeerEmitter });
  container.register(NegotiationPeerEmitter, {
    useClass: NegotiationPeerEmitter,
  });
  container.register(ScreenSharePeerEmitter, {
    useClass: ScreenSharePeerEmitter,
  });
  container.register(VoicePeerEmitter, { useClass: VoicePeerEmitter });

  container.register('PeerHandler', { useClass: ConnectionPeerHandler });
  container.register('PeerHandler', { useClass: SignalingPeerHandler });
  container.register('PeerHandler', { useClass: NegotiationPeerHandler });
  container.register('PeerHandler', { useClass: VoicePeerHandler });
  container.register('PeerHandler', { useClass: ChatPeerHandler });
  container.register('PeerHandler', { useClass: ScreenSharePeerHandler });
  container.register('PeerHandler', { useClass: MemberPeerHandler });
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
