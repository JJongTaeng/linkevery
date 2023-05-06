import { Button } from 'antd';
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
    leftSideView: state.room.leftSideView,
    myName: state.room.username,
    member: state.room.member,
    messageList: state.chat.messageList,
    isReadAllChat: state.room.isScrollButtonView,
  }));
  return (
    <MemberList>
      <div className="member-item">{myName} - me</div>
      {Object.keys(member).map((clientId) => (
        <div key={clientId} className="member-item">
          <span>{member[clientId].username}</span>
          {member[clientId].voiceStatus && (
            <Button size="small" shape="circle" icon={<SvgSpeakerOn />} />
          )}
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
        </div>
      ))}
    </MemberList>
  );
};

export default MemberListContainer;
