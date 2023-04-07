import styled from 'styled-components';
import { TOP_MENU_HEIGHT } from '../../style/constants';

const ContentContainer = () => {
  return <Container></Container>;
};

const Container = styled.div`
  width: 100%;
  height: calc(100% - ${TOP_MENU_HEIGHT}px);
`;

export default ContentContainer;
