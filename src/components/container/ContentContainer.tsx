import { Outlet } from 'react-router-dom';
import styled from 'styled-components';

const ContentContainer = () => {
  return (
    <Container>
      <Outlet />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: 100%;
`;

export default ContentContainer;
