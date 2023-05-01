import { HandlerMap, SCREEN_SHARE_MESSAGE_ID } from '../../constants/protocol';
import { StorageService } from '../storage/StorageService';

const storage = StorageService.getInstance();

export const screenShareHandlers: HandlerMap<SCREEN_SHARE_MESSAGE_ID> = {
  [SCREEN_SHARE_MESSAGE_ID.JOIN]: (protocol, { dispatch }) => {},
  [SCREEN_SHARE_MESSAGE_ID.OFFER]: (protocol, { rtcManager }) => {},
  [SCREEN_SHARE_MESSAGE_ID.ANSWER]: (protocol, { dispatch }) => {},
  [SCREEN_SHARE_MESSAGE_ID.ICE]: (protocol, { rtcManager }) => {},
  [SCREEN_SHARE_MESSAGE_ID.DISCONNECT]: (protocol, { dispatch }) => {},
};
