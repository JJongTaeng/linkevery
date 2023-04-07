import React from 'react';
import { useParams } from 'react-router-dom';

const Room = () => {
  const params = useParams<{
    roomName: string;
  }>();
  return <div>roomName : {params.roomName}</div>;
};

export default Room;
