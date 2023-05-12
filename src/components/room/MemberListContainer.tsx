import { Button, Popover, Slider } from 'antd';
import { nanoid } from 'nanoid';
import { audioManager } from '../../service/media/AudioManager';
import { useAppSelector } from '../../store/hooks';
import SvgScreenShareOn from '../icons/ScreenShareOn';
import SvgSpeakerOn from '../icons/SpeakerOn';
import { MemberList } from './Room.styled';

interface MemberListContainerProps {
  onClickMemberScreenShare: (userKey: string) => void;
}

const MemberListContainer = ({
  onClickMemberScreenShare,
}: MemberListContainerProps) => {
  const { myName, room } = useAppSelector((state) => ({
    myName: state.user.username,
    room: state.room.room,
  }));

  const onChangeVolume = (id: string, volume: number) => {
    audioManager.changeVolume(id, volume);
  };

  return (
    <MemberList>
      <div className="member-item">{myName} - me</div>
      {Object.keys(room.member).map((userKey) => (
        <div key={nanoid()} className="member-item">
          <span>{room.member[userKey].username}</span>

          {room.member[userKey].screenShareStatus && (
            <Button
              className={'screen-share-button'}
              size="small"
              shape="circle"
              onClick={() => {
                onClickMemberScreenShare(userKey);
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
        </div>
      ))}
    </MemberList>
  );
};

export default MemberListContainer;
