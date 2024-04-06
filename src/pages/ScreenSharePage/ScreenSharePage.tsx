import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAppSelector } from '../../store/hooks.ts';
import { useApp } from '../../hooks/useApp.ts';

const ScreenSharePage = () => {
  const { broadcastChannel } = useApp();
  const { roomName } = useParams();
  const { username, status, modalVisible } = useAppSelector((state) => ({
    status: state.status,
    username: state.user.username,
    modalVisible: state.status.usernameModalVisible,
  }));

  useEffect(() => {
    // 메시지 수신을 위한 리스너 추가
    broadcastChannel.addEventListener('message', (event) => {
      console.log('Received', event.data);
    });

    // 채널을 통해 메시지 보내기
    broadcastChannel.postMessage('Hello from the other side!');
  }, []);

  return <div>screen share page@</div>;
};

export default ScreenSharePage;
