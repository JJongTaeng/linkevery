import styled from 'styled-components';
import ContentContainer from './components/container/ContentContainer';
import LeftMenuContainer from './components/container/LeftMenuContainer';

function App() {
  return (
    <Container>
      <div>
        <LeftMenuContainer />
      </div>
      <ContentSection>
        <ContentContainer />
      </ContentSection>
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.color.white};
  display: flex;
`;

const ContentSection = styled.section`
  width: 100%;
  height: 100%;
`;

export default App;
