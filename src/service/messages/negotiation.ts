import {
  CATEGORY,
  MESSAGE_TYPE,
  NEGOTIATION_MESSAGE_ID,
  ProtocolData,
} from '../../constants/protocol';
import { CreateProtocolFunctionParam, createProtocolMessage } from './index';

export const negotiationProtocolMessage = (
  protocol: CreateProtocolFunctionParam,
) => {
  const protocolMessage = createProtocolMessage(CATEGORY.NEGOTIATION);
  return protocolMessage(protocol);
};
export const negotiationOfferMessage = (data: ProtocolData) => {
  return negotiationProtocolMessage({
    messageId: NEGOTIATION_MESSAGE_ID.OFFER,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};

export const negotiationAnswerMessage = (data: ProtocolData) => {
  return negotiationProtocolMessage({
    messageId: NEGOTIATION_MESSAGE_ID.ANSWER,
    messageType: MESSAGE_TYPE.SOCKET,
    data,
  });
};
