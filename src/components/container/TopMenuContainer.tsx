import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import SvgOutDoor from '../icons/OutDoor';

const TopMenuContainer = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();
  return (
    <Container>
      심플 채팅 <Text>{roomName ? roomName : ''}</Text>
      <SvgOutDoor className={'out-door'} onClick={() => navigate('/')} />
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: ${TOP_MENU_HEIGHT}px;
  background-color: ${({ theme }) => theme.color.grey200};
  color: ${({ theme }) => theme.color.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .out-door {
    cursor: pointer;
    width: 20px;
    height: 20px;
    path {
      fill: ${({ theme }) => theme.color.white};
    }
    &:hover {
      path {
        fill: ${({ theme }) => theme.color.blue800};
      }
    }
  }
`;

const Text = styled.span`
  color: ${({ theme }) => theme.color.grey100};
  font-weight: bold;
  color: ${({ theme }) => theme.color.white};
  margin-left: 16px;
`;

export default TopMenuContainer;
