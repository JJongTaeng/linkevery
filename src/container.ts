import { container } from 'tsyringe';
import { App } from './service/app/App';
import { ConnectionHandler } from './service/handlers/ConnectionHandler';
import { SignalingHandler } from './service/handlers/SignalingHandler';
import { NegotiationHandler } from './service/handlers/NegotiationHandler';
import { RoomHandler } from './service/handlers/RoomHandler';
import { VoiceHandler } from './service/handlers/VoiceHandler';
import { HandlerManager2 } from './service/handlers/HandlerManager2';
import { ChatHandler } from './service/handlers/ChatHandler';
import { ScreenShareHandler } from './service/handlers/ScreenShareHandler';

export const initContainer = () => {
  container.register('Handler', { useClass: ConnectionHandler });
  container.register('Handler', { useClass: SignalingHandler });
  container.register('Handler', { useClass: NegotiationHandler });
  container.register('Handler', { useClass: RoomHandler });
  container.register('Handler', { useClass: VoiceHandler });
  container.register('Handler', { useClass: ChatHandler });
  container.register('Handler', { useClass: ScreenShareHandler });
  container.resolve(App);
  container.afterResolution(
    App,
    (_t, result) => {
      container.resolve(HandlerManager2);
    },
    { frequency: 'Once' },
  );
};
