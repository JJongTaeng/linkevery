import { useEffect, useRef } from 'react';
import { APP_SERVICE_EVENT_NAME } from '../constants/appEvent';
import { AppServiceImpl } from '../service/app/AppServiceImpl';
import { roomActions } from '../store/features/room/roomSlice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

export const useRoom = () => {
  const dispatch = useAppDispatch();
  const { member } = useAppSelector((state) => ({
    member: state.room.member,
  }));
  const { ee } = useRef(AppServiceImpl.getInstance()).current;

  useEffect(() => {
    ee.on(APP_SERVICE_EVENT_NAME.ROOM_USERNAME, ({ username, clientId }) => {
      dispatch(
        roomActions.setMember({
          ...member,
          [clientId]: username,
        }),
      );
    });
  }, []);

  return {
    member,
  };
};
