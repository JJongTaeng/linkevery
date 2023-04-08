import ContentContainer from './components/container/ContentContainer';
import LeftMenuContainer from './components/container/LeftMenuContainer';
import styled from 'styled-components';

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
  min-width: 1400px;
  background-color: ${({ theme }) => theme.color.grey800};
  display: flex;
`;

const ContentSection = styled.section`
  width: 100%;
  height: 100%;
`;

export default App;
