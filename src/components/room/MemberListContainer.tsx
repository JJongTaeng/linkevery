import { Button, Card, Tooltip } from 'antd';
import { useRef } from 'react';
import styled from 'styled-components';
import { useAppSelector } from 'store/hooks';
import { container } from 'tsyringe';
import { AudioManager } from 'service/media/AudioManager';
import { VideoManager } from 'service/media/VideoManager';
import MemberCard from './MemberCard';
import { clipboard } from '../../service/utils/Clipboard';
import SvgInviteMember from '../icons/InviteMember';

interface MemberListContainerProps {}

const MemberListContainer = ({}: MemberListContainerProps) => {
  const { myName, room } = useAppSelector((state) => ({
    myName: state.user.username,
    room: state.room.current,
  }));
  const audioManager = useRef(container.resolve(AudioManager))
    .current as AudioManager;
  const videoManager = useRef(container.resolve(VideoManager))
    .current as VideoManager;

  const onChangeVolume = (id: string, volume: number) => {
    audioManager.changeVolume(id, volume);
  };

  return (
    <MemberList className="member-list">
      <div>
        <Card size="small">
          <div>{myName} - me</div>
        </Card>
        {Object.keys(room.member).map((userKey) => (
          <MemberCard key={userKey} userKey={userKey} />
        ))}
      </div>{' '}
      <Tooltip
        defaultOpen={true}
        title="복사된 URL을 초대할 사람에게 보내주세요."
      >
        <StyledButton
          onClick={() => {
            clipboard.updateClipboard(window.location.href);
          }}
        >
          <span>초대하기</span>
          <SvgInviteMember style={{ marginLeft: 4, lineHeight: 1.8 }} />
        </StyledButton>
      </Tooltip>
    </MemberList>
  );
};

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100%;

  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.primary800};
  box-shadow: ${({ theme }) => theme.boxShadow};

  justify-content: space-between;
`;

export default MemberListContainer;
