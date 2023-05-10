import { Button, Popover, Slider } from 'antd';
import { audioManager } from '../../service/media/AudioManager';
import { useAppSelector } from '../../store/hooks';
import SvgScreenShareOn from '../icons/ScreenShareOn';
import SvgSpeakerOn from '../icons/SpeakerOn';
import { MemberList } from './Room.styled';

interface MemberListContainerProps {
  onClickMemberScreenShare: (id: string) => void;
}

const MemberListContainer = ({
  onClickMemberScreenShare,
}: MemberListContainerProps) => {
  const { myName, member } = useAppSelector((state) => ({
    myName: state.room.username,
    member: state.room.member,
    messageList: state.chat.messageList,
    leftSideView: state.user.leftSideView,
    isReadAllChat: state.user.isScrollButtonView,
  }));

  const onChangeVolume = (id: string, volume: number) => {
    audioManager.changeVolume(id, volume);
  };

  return (
    <MemberList>
      <div className="member-item">{myName} - me</div>
      {Object.keys(member).map((clientId) => (
        <div key={clientId} className="member-item">
          <span>{member[clientId].username}</span>

          {member[clientId].screenShareStatus && (
            <Button
              className={'screen-share-button'}
              size="small"
              shape="circle"
              onClick={() => {
                onClickMemberScreenShare(clientId);
              }}
              icon={<SvgScreenShareOn />}
            />
          )}
          {member[clientId].voiceStatus && (
            <Popover
              placement="right"
              content={
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  style={{ width: 80 }}
                  onChange={(value) => {
                    onChangeVolume(clientId, value);
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
