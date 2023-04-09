import { Route, Routes } from 'react-router-dom';
import styled from 'styled-components';
import NoRoom from '../room/NoRoom';
import Room from '../room/Room';

const ContentContainer = () => {
  return (
    <Container>
      <Routes>
        <Route path={'/'} element={<NoRoom />} />
        <Route path={'/:roomName'} element={<Room />} />
      </Routes>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export default ContentContainer;
