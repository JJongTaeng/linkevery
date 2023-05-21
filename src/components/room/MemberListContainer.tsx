import { Button, Card, Popover, Slider } from 'antd';
import { nanoid } from 'nanoid';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { audioManager } from '../../service/media/AudioManager';
import { videoManager } from '../../service/media/VideoManager';
import { userActions } from '../../store/features/userSlice';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { highlight } from '../../style';
import SvgScreenShareOn from '../icons/ScreenShareOn';
import SvgSpeakerOn from '../icons/SpeakerOn';

interface MemberListContainerProps {}

const MemberListContainer = ({}: MemberListContainerProps) => {
  const dispatch = useAppDispatch();
  const [selectedUserKey, setSelectedUserKey] = useState('');
  const { myName, room } = useAppSelector((state) => ({
    myName: state.user.username,
    room: state.room.room,
  }));

  const onChangeVolume = (id: string, volume: number) => {
    audioManager.changeVolume(id, volume);
  };

  useEffect(() => {
    if (!room.member[selectedUserKey])
      dispatch(userActions.changeLeftSideView(false));
  }, [room.member]);
  return (
    <MemberList className="member-list">
      <Card size="small">
        <div className="member-item">{myName} - me</div>
      </Card>
      {Object.keys(room.member).map((userKey) => (
        <div key={nanoid()} className="member-item">
          <Card size="small">
            <span>{room.member[userKey].username}</span>
            {room.member[userKey].screenShareStatus && (
              <Button
                className={'screen-share-button'}
                size="small"
                shape="circle"
                onClick={() => {
                  dispatch(userActions.changeLeftSideView(true));
                  setSelectedUserKey(userKey);
                  videoManager.appendVideoNode(room.member[userKey].clientId);
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
        </div>
      ))}
    </MemberList>
  );
};

const MemberList = styled.div`
  display: flex;
  flex-direction: column;
  width: 240px;
  height: 100%;

  padding: 16px;
  border-radius: 8px;
  background-color: ${({ theme }) => theme.color.primary800};
  box-shadow: ${({ theme }) => theme.boxShadow};

  .member-item:nth-child(1) {
    color: ${({ theme }) => theme.color.primary100};
    font-weight: bold;
  }
  .member-item {
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
  }
`;

export default MemberListContainer;
