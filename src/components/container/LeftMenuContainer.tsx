import { Button } from 'antd';
import styled from 'styled-components';
import { AppServiceImpl } from '../../service/app/AppServiceImpl';
import {
  UserStatus,
  userInfoActions,
} from '../../store/features/userInfoSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import RoomBadge from '../room/RoomBadge';

const LeftMenuContainer = () => {
  const { dispatch: appDispatch } = AppServiceImpl.getInstance();
  const dispatch = useAppDispatch();
  const { status } = useAppSelector((state) => ({
    status: state.userInfo.status,
  }));

  console.log(status);
  return (
    <Container>
      <RoomBadge roomName="hello" />
      <Button
        onClick={() => {
          appDispatch.sendVoiceJoinMessage({});
          dispatch(userInfoActions.changeStatus(UserStatus.VOICE));
        }}
      >
        voice
      </Button>
    </Container>
  );
};

const Container = styled.section`
  height: 100%;
  width: 70px;
  background-color: ${({ theme }) => theme.color.primary100};
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default LeftMenuContainer;
