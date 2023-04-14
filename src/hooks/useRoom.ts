import { useEffect, useRef, useState } from 'react';
import { APP_SERVICE_EVENT_NAME } from '../constants/appEvent';
import { AppServiceImpl } from '../service/app/AppServiceImpl';

interface RoomUsername {
  [key: string]: string;
}

export const useRoom = () => {
  const [roomUsername, setRoomUsername] = useState<RoomUsername>({});
  const { ee } = useRef(AppServiceImpl.getInstance()).current;

  useEffect(() => {
    ee.on(APP_SERVICE_EVENT_NAME.ROOM_USERNAME, ({ username, clientId }) => {
      const state = {
        ...roomUsername,
        [clientId]: username,
      };

      setRoomUsername(state);
    });
  }, []);

  return {
    roomUsername,
  };
};
