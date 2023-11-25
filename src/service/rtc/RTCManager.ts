import { EventType } from 'constants/eventType';
import { SLICE_LENGTH } from 'constants/message';
import { ERROR_TYPE } from 'error/error';
import { utils } from 'service/utils/Utils';
import { RTCManagerService } from './RTCManagerService';
import { storage } from '../storage/StorageService';

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

  send(protocol: EventType) {
    const clientId = storage.getItem('clientId');
    console.debug('%c[send] ', 'color:green;font-weight:bold;', {
      ...protocol,
      from: clientId,
    });
    const { to } = protocol.data;
    if (to) {
      this.sendTo(protocol);
    } else {
      this.sendAll(protocol);
    }
  }

  private sendTo(protocol: EventType) {
    const clientId = storage.getItem('clientId');
    const { to } = protocol.data;
    if (!to)
      throw new Error(
        ERROR_TYPE.INVALID_PEER_ID + 'sendTo Error 잘못연결된 Peer가 있습니다.',
      );
    const peer = this.peerMap.get(to);
    const datachannel = peer?.getDataChannel();
    const dataString = JSON.stringify(protocol.data);
    const slicedDataList = utils.sliceString(dataString, SLICE_LENGTH);
    slicedDataList.forEach((slicedData, index) => {
      const newProtocol = {
        ...protocol,
        data: slicedData,
        index,
        endIndex: slicedDataList.length - 1,
        from: clientId,
      };
      const stringify = JSON.stringify(newProtocol);
      datachannel?.send(stringify);
    });
  }

  private sendAll(protocol: EventType) {
    const clientId = storage.getItem('clientId');

    this.peerMap.forEach((peer, key) => {
      const datachannel = peer.getDataChannel();
      const dataString = JSON.stringify(protocol.data);
      const slicedDataList = utils.sliceString(dataString, SLICE_LENGTH);
      slicedDataList.forEach((slicedData, index) => {
        const newProtocol = {
          ...protocol,
          data: slicedData,
          index,
          endIndex: slicedDataList.length - 1,
          from: clientId,
        };
        const stringify = JSON.stringify(newProtocol);
        datachannel?.send(stringify);
      });
    });
  }
}
