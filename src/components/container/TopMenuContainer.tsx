import { Button } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { TOP_MENU_HEIGHT } from '../../style/constants';

const TopMenuContainer = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();
  return (
    <Container>
      심플 채팅 <Text>{roomName ? roomName : ''}</Text>
      <Button onClick={() => navigate('/')}>나가기</Button>
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
  padding: 0 16px;
`;

const Text = styled.span`
  color: ${({ theme }) => theme.color.grey100};
  font-weight: bold;
  color: ${({ theme }) => theme.color.white};
  margin-left: 16px;
`;

export default TopMenuContainer;
