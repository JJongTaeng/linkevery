import { useAppSelector } from 'store/hooks';
import { nanoid } from 'nanoid';
import { Button, Card, Popover, Slider } from 'antd';
import SvgScreenShareOn from 'components/icons/ScreenShareOn';
import SvgSpeakerOn from 'components/icons/SpeakerOn';
import styled from 'styled-components';
import { highlight } from 'style';
import { useApp } from 'hooks/useApp.ts';
import { useMemo } from 'react';

interface MemberCardProps {
  userKey: string;
}

const MemberCard = ({ userKey }: MemberCardProps) => {
  const { room } = useAppSelector((state) => ({
    room: state.room.current,
  }));
  const { audioPlayerManager, videoManager } = useApp();
  const onChangeVolume = (id: string, volume: number) => {
    audioPlayerManager.setVolume(id, volume);
  };

  const member = useMemo(() => room.member[userKey], [room, userKey]);
  return (
    <MemberCardContainer key={nanoid()}>
      <Card size="small">
        <span>{member.username}</span>
        {member.screenShareStatus && (
          <Button
            className={'screen-share-button'}
            size="small"
            shape="circle"
            onClick={() => {
              videoManager.openVideoPopup(member.clientId);
              // videoManager.openTestPopup(user.clientId);
            }}
            icon={<SvgScreenShareOn />}
          />
        )}
        {member.voiceStatus && (
          <Popover
            placement="right"
            content={
              <Slider
                min={0}
                max={1}
                step={0.01}
                style={{ width: 80 }}
                onChange={(value) => {
                  onChangeVolume(member.clientId, value);
                }}
                defaultValue={0.5}
              />
            }
            trigger="click"
          >
            <SpeakerButton
              size="small"
              shape="circle"
              icon={<SvgSpeakerOn />}
              speaking={member.speaking}
            />
          </Popover>
        )}
      </Card>
    </MemberCardContainer>
  );
};

const SpeakerButton = styled(Button)<{ speaking: boolean }>`
  box-shadow: ${({ speaking }) =>
    speaking ? '0 0 4px 4px rgba(0, 0, 255, .2)' : 'none'};
  transition: box-shadow 0.3s;
`;

const MemberCardContainer = styled.div`
  color: ${({ theme }) => theme.color.grey100};
  path {
    stroke: #000;
  }
  .ant-btn {
    margin-left: 4px;
  }
  .screen-share-button {
    animation: ${highlight} 1s 1s infinite linear alternate;
  }
`;

export default MemberCard;
