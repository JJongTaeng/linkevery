import { useRef } from 'react';
import { useAppSelector } from '../../../store/hooks';
import { container } from 'tsyringe';
import { AudioManager } from '../../../service/media/AudioManager';
import { VideoManager } from '../../../service/media/VideoManager';
import { nanoid } from 'nanoid';
import { Button, Card, Popover, Slider } from 'antd';
import SvgScreenShareOn from 'components/icons/ScreenShareOn';
import SvgSpeakerOn from 'components/icons/SpeakerOn';
import styled from 'styled-components';
import { highlight } from 'style';

interface MemberCardProps {
  userKey: string;
}

const MemberCard = ({ userKey }: MemberCardProps) => {
  const { room } = useAppSelector((state) => ({
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
    <MemberCardContainer key={nanoid()}>
      <Card size="small">
        <span>{room.member[userKey].username}</span>
        {room.member[userKey].screenShareStatus && (
          <Button
            className={'screen-share-button'}
            size="small"
            shape="circle"
            onClick={() => {
              // videoManager.openVideoPopup(room.member[userKey].clientId);
              videoManager.openTestPopup(room.member[userKey].clientId);
            }}
            icon={<SvgScreenShareOn />}
          />
        )}
        {room.member[userKey].voiceStatus && (
          <Popover
            placement="right"
            content={
              <Slider
                min={0}
                max={1}
                step={0.01}
                style={{ width: 80 }}
                onChange={(value) => {
                  onChangeVolume(room.member[userKey].clientId, value);
                }}
                defaultValue={0.5}
              />
            }
            trigger="click"
          >
            <Button size="small" shape="circle" icon={<SvgSpeakerOn />} />
          </Popover>
        )}
      </Card>
    </MemberCardContainer>
  );
};

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
