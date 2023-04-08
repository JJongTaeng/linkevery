import styled from 'styled-components';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import TopMenuContainer from '../container/TopMenuContainer';

const NoRoom = () => {
  return (
    <>
      <TopMenuContainer />
      <NoRoomContent> 방에 입장해주세요 ~ </NoRoomContent>
    </>
  );
};

const NoRoomContent = styled.div`
  width: 100%;
  height: calc(100% - ${TOP_MENU_HEIGHT}px);
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default NoRoom;
