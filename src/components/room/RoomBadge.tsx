import { Avatar } from 'antd';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAppSelector } from '../../store/hooks';

interface RoomBadgeProps {
  name: string;
  onClick: () => void;
}

const RoomBadge = ({ name, onClick }: RoomBadgeProps) => {
  const navigate = useNavigate();
  const { currentRoomName } = useAppSelector((state) => ({
    currentRoomName: state.room.room.roomName,
  }));
  return (
    <Badge
      isCurrent={name === currentRoomName}
      shape="square"
      onClick={() => onClick()}
      size={50}
    >
      {name.split('+')[0]}
    </Badge>
  );
};

const Badge = styled(Avatar)<{ isCurrent: boolean }>`
  margin-top: 16px;
  cursor: pointer;

  ${({ isCurrent }) =>
    isCurrent && 'box-shadow: 0 0 2px 4px rgba(255, 255, 255, 0.5);'}
`;

export default RoomBadge;
