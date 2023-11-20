import { container, Lifecycle } from 'tsyringe';
import { App } from './service/app/App';
import { ConnectionPeerHandler } from './service/handler/ConnectionPeerHandler';
import { SignalingPeerHandler } from './service/handler/SignalingPeerHandler';
import { NegotiationPeerHandler } from './service/handler/NegotiationPeerHandler';
import { VoicePeerHandler } from './service/handler/VoicePeerHandler';
import { PeerHandler } from './service/handler/PeerHandler';
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
import { ChatLocalHandler } from 'service/localHandler/ChatLocalHandler';
import { LocalHandler } from './service/localHandler/LocalHandler';
import { ChatLocalEmitter } from './service/localEmitter/ChatLocalEmitter';
import { RoomLocalHandler } from './service/localHandler/RoomLocalHandler';
import { RoomLocalEmitter } from 'service/localEmitter/RoomLocalEmitter';
import { EventManager } from './service/event/EventManager';
import { Emitter } from './service/emitter/Emitter';

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

  container.register('EmitterService', { useClass: Emitter });

  container.register(ChatLocalEmitter, { useClass: ChatLocalEmitter });
  container.register(RoomLocalEmitter, { useClass: RoomLocalEmitter });

  container.register('LocalHandler', { useClass: ChatLocalHandler });
  container.register('LocalHandler', { useClass: RoomLocalHandler });
  container.register('LocalHandlerManager', { useClass: LocalHandler });

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
  container.register('PeerHandlerManager', { useClass: PeerHandler });
  container.resolve(App);
  container.afterResolution(
    App,
    (_t, result) => {
      container.resolve('PeerHandlerManager');
      container.resolve('LocalHandlerManager');
    },
    { frequency: 'Once' },
  );
};
