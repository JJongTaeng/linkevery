import { Avatar } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

interface RoomBadgeProps {
  roomName: string;
}

const RoomBadge = ({ roomName }: RoomBadgeProps) => {
  const navigate = useNavigate();
  return (
    <Badge onClick={() => navigate('/' + roomName)} size={50}>
      {roomName[0]}
    </Badge>
  );
};

const Badge = styled(Avatar)`
  margin-top: 16px;
  cursor: pointer;
`;

export default RoomBadge;
