import { container, Lifecycle } from 'tsyringe';
import { App } from './service/app/App';
import { ConnectionHandler } from './service/handlers/ConnectionHandler';
import { SignalingHandler } from './service/handlers/SignalingHandler';
import { NegotiationHandler } from './service/handlers/NegotiationHandler';
import { RoomHandler } from './service/handlers/RoomHandler';
import { VoiceHandler } from './service/handlers/VoiceHandler';
import { HandlerManagerV2 } from './service/handlers/HandlerManagerV2';
import { ChatHandler } from './service/handlers/ChatHandler';
import { ScreenShareHandler } from './service/handlers/ScreenShareHandler';
import { AudioManager } from './service/media/AudioManager';
import { VideoManager } from './service/media/VideoManager';
import { SoundEffect } from './service/media/SoundEffect';

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

  container.register('Handler', { useClass: ConnectionHandler });
  container.register('Handler', { useClass: SignalingHandler });
  container.register('Handler', { useClass: NegotiationHandler });
  container.register('Handler', { useClass: RoomHandler });
  container.register('Handler', { useClass: VoiceHandler });
  container.register('Handler', { useClass: ChatHandler });
  container.register('Handler', { useClass: ScreenShareHandler });
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
