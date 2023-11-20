import { useRef } from 'react';
import { container } from 'tsyringe';
import { RoomEmitter } from '../service/emitter/RoomEmitter';

export const useEmitter = () => {
  const roomEmitter = useRef(container.resolve(RoomEmitter)).current;

  return {
    roomEmitter,
  };
};
