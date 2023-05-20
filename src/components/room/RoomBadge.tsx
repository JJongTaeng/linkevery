import { Avatar } from 'antd';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { deleteRoomByDB } from '../../store/thunk/roomThunk';
import SvgDelete from '../icons/Delete';

interface RoomBadgeProps {
  name: string;
  onClick: () => void;
}

const RoomBadge = ({ name, onClick }: RoomBadgeProps) => {
  const dispatch = useAppDispatch();
  const { currentRoomName } = useAppSelector((state) => ({
    currentRoomName: state.room.room.roomName,
  }));
  return (
    <BadgeContainer>
      {name !== currentRoomName && (
        <XButton
          className={'x-button'}
          onClick={() => dispatch(deleteRoomByDB({ roomName: name }))}
        >
          <SvgDelete />
        </XButton>
      )}
      <Badge
        $isCurrent={name === currentRoomName}
        shape="square"
        onClick={() => onClick()}
        size={50}
      >
        {name.split('+')[0]}
      </Badge>
    </BadgeContainer>
  );
};

const BadgeContainer = styled.div`
  position: relative;

  &:hover .x-button {
    display: flex;
  }
`;

const XButton = styled.div`
  position: absolute;
  top: 4px;
  right: -8px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  cursor: pointer;

  display: none;
  justify-content: center;
  align-items: center;

  transition: 0.3s;
  svg {
    padding-bottom: 4px;
  }

  &:hover {
    transform: scale(1.1);
  }
`;

const Badge = styled(Avatar)<{ $isCurrent: boolean }>`
  margin-top: 16px;
  cursor: pointer;

  ${({ $isCurrent, theme }) => $isCurrent && `box-shadow: ${theme.boxShadow}};`}
`;

export default RoomBadge;
