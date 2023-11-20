import { useRef } from 'react';
import { container } from 'tsyringe';
import { RoomLocalEmitter } from 'service/emitter/RoomLocalEmitter';

export const useLocalEmitter = () => {
  const roomLocalEmitter = useRef(container.resolve(RoomLocalEmitter)).current;

  return {
    roomLocalEmitter,
  };
};
