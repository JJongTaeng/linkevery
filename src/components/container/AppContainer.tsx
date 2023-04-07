import React from 'react';
import styled from 'styled-components';
import ContentContainer from './ContentContainer';
import LeftMenuContainer from './LeftMenuContainer';
import TopMenuContainer from './TopMenuContainer';

const AppContainer = () => {
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
};

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

export default AppContainer;
