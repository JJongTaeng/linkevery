import EventEmitter from 'events';
import { EVENT_NAME, EventType } from '../../constants/eventType';
import { utils } from '../utils/Utils';
import { SLICE_LENGTH } from '../../constants/message';

export class EventManager extends EventEmitter {
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
      this.emit(EVENT_NAME, stringify);
    });
  }
}
