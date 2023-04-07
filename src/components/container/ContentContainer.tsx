import { Link, Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import Room from '../content/Room';

const ContentContainer = () => {
  return (
    <Container>
      <Routes>
        <Route path={'/'} element={<div>방에 입장해주세요!</div>} />
        <Route path={'/:roomName'} element={<Room />} />
      </Routes>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: calc(100% - ${TOP_MENU_HEIGHT}px);
`;

export default ContentContainer;
