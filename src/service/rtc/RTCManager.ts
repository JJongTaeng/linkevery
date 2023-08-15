import { Protocol } from '../../constants/protocol';
import { ERROR_TYPE } from '../../error/error';
import { utils } from '../utils/Utils';
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
  static SLICE_LENGTH = 4096;
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
    const dataString = JSON.stringify(protocol.data);
    const slicedDataList = utils.sliceString(
      dataString,
      RTCManager.SLICE_LENGTH,
    );
    slicedDataList.forEach((slicedData, index) => {
      const newProtocol = {
        ...protocol,
        data: slicedData,
        index,
        endIndex: slicedDataList.length - 1,
      };
      const stringify = JSON.stringify(newProtocol);
      datachannel?.send(stringify);
    });
  }

  sendAll(protocol: Protocol) {
    this.peerMap.forEach((peer, key) => {
      const datachannel = peer.getDataChannel();
      const dataString = JSON.stringify(protocol.data);
      const slicedDataList = utils.sliceString(
        dataString,
        RTCManager.SLICE_LENGTH,
      );
      slicedDataList.forEach((slicedData, index) => {
        const newProtocol = {
          ...protocol,
          data: slicedData,
          index,
          endIndex: slicedDataList.length - 1,
        };
        const stringify = JSON.stringify(newProtocol);
        datachannel?.send(stringify);
      });
    });
  }
}

export const rtcManager = new RTCManager();
