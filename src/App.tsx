import styled from 'styled-components';
import ContentContainer from './components/container/ContentContainer';
import LeftMenuContainer from './components/container/LeftMenuContainer';
import TopMenuContainer from './components/container/TopMenuContainer';
import { TOP_MENU_HEIGHT } from './style/constants';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.body.click();
  }, []);

  return (
    <Container>
      <TopMenuContainer />
      <div className={'main-content-container'}>
        <LeftMenuContainer />
        <ContentSection>
          <ContentContainer />
        </ContentSection>
      </div>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.white};
  .main-content-container {
    width: 100%;
    height: calc(100% - ${TOP_MENU_HEIGHT}px);
    display: flex;
  }
`;

const ContentSection = styled.section`
  width: 100%;
  height: 100%;

  overflow: auto;
`;

export default App;
