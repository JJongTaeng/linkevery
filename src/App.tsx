import { useEffect, useRef } from 'react';
import ContentContainer from './components/container/ContentContainer';
import LeftMenuContainer from './components/container/LeftMenuContainer';
import TopMenuContainer from './components/container/TopMenuContainer';
import { AppServiceImpl } from './service/app/AppServiceImpl';
import styled from 'styled-components';

function App() {
  const app = useRef(AppServiceImpl.getInstance()).current;

  useEffect(() => {
    app.connectSocket();
  }, []);

  return (
    <Container>
      <div>
        <LeftMenuContainer />
      </div>
      <ContentSection>
        <TopMenuContainer />
        <ContentContainer />
      </ContentSection>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  min-width: 1400px;
  background-color: ${({ theme }) => theme.color.grey800};
  display: flex;
`;

const ContentSection = styled.section`
  width: 100%;
  height: 100%;
`;

export default App;
