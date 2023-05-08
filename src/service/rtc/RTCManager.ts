import { Protocol } from '../../constants/protocol';
import { ERROR_TYPE } from '../../error/error';
import { RTCManagerService } from './RTCManagerService';

export const config = {
  iceServers: [
    {
      urls: ['stun:ntk-turn-1.xirsys.com'],
    },
    {
      username: process.env.REACT_APP_RTC_CONFIG_USERNAME,
      credential: process.env.REACT_APP_RTC_CONFIG_CREDENTIAL,
      urls: [
        'turn:ntk-turn-1.xirsys.com:80?transport=udp',
        'turn:ntk-turn-1.xirsys.com:3478?transport=udp',
        'turn:ntk-turn-1.xirsys.com:80?transport=tcp',
        'turn:ntk-turn-1.xirsys.com:3478?transport=tcp',
        'turns:ntk-turn-1.xirsys.com:443?transport=tcp',
        'turns:ntk-turn-1.xirsys.com:5349?transport=tcp',
      ],
    },
  ],
};

export class RTCManager extends RTCManagerService {
  public static RTC_EVENT = {
    DATA: 'RTC_DATA',
  };

  constructor() {
    super();
  }

  sendTo(protocol: Protocol) {
    const { to } = protocol.data;
    if (!to)
      throw new Error(
        ERROR_TYPE.INVALID_PEER_ID + 'sendTo Error 잘못연결된 Peer가 있습니다.',
      );
    const peer = this.peerMap.get(to);
    const datachannel = peer?.getDataChannel();
    const stringify = JSON.stringify(protocol);
    console.debug('[send] ', protocol);
    datachannel?.send(stringify);
  }

  sendAll(protocol: Protocol) {
    this.peerMap.forEach((peer, key) => {
      const datachannel = peer.getDataChannel();
      if (!datachannel)
        throw new Error(ERROR_TYPE.INVALID_DATACHANNEL + `id = ${key}`);
      const stringify = JSON.stringify(protocol);
      console.debug('[send] ', protocol);
      datachannel.send(stringify);
    });
  }
}
