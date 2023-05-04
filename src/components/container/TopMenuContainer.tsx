import { Tooltip } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { clipboard } from '../../service/utils/Clipboard';
import { TOP_MENU_HEIGHT } from '../../style/constants';
import SvgExit from '../icons/Exit';
import SvgInviteMember from '../icons/InviteMember';

const TopMenuContainer = () => {
  const { roomName } = useParams();
  const navigate = useNavigate();

  return (
    <Container>
      <div>Linkevery </div>
      <RoomName>
        <Text>{roomName ? roomName?.split('_')[0] : ''}</Text>
        <div>
          {roomName && (
            <Tooltip
              defaultOpen={true}
              title="복사된 URL을 초대할 사람에게 보내주세요."
            >
              <SvgInviteMember
                onClick={() => {
                  clipboard.updateClipboard(window.location.href);
                }}
              />
            </Tooltip>
          )}
        </div>
      </RoomName>
      {roomName && (
        <SvgExit
          className={'exit'}
          onClick={() => {
            navigate('/');
          }}
        />
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  height: ${TOP_MENU_HEIGHT}px;
  background-color: ${({ theme }) => theme.color.primary200};
  color: ${({ theme }) => theme.color.white};
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;

  .exit {
    cursor: pointer;
    width: 20px;
    height: 20px;
    transition: 0.2s;
  }
  .exit:hover {
    transform: scale(1.1);
  }
`;

const Text = styled.span`
  color: ${({ theme }) => theme.color.primary100};
  font-weight: bold;
  color: ${({ theme }) => theme.color.white};
  margin-left: 16px;
`;

const RoomName = styled.div`
  display: flex;
  svg {
    margin-left: 8px;
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export default TopMenuContainer;
