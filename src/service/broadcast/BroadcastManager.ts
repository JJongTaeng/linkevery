import { EventType } from '../../constants/eventType.ts';
import { utils } from '../utils/Utils.ts';
import { SLICE_LENGTH } from '../../constants/message.ts';

export class BroadcastManager {
  broadcastChannel: BroadcastChannel = new BroadcastChannel('linkevery');

  send(protocol: EventType) {
    console.debug('%c[send] ', 'color:green;font-weight:bold;', protocol);
    const dataString = JSON.stringify(protocol.data);
    const slicedDataList = utils.sliceString(dataString, SLICE_LENGTH);
    slicedDataList.forEach((slicedData, index) => {
      const newProtocol = {
        ...protocol,
        data: slicedData,
        index,
        endIndex: slicedDataList.length - 1,
      };
      const stringify = JSON.stringify(newProtocol);
      this.broadcastChannel.postMessage(stringify);
    });
  }
}
