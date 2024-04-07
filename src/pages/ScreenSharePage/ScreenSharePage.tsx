import React, { useEffect } from 'react';
import { useApp } from '../../hooks/useApp.ts';

const ScreenSharePage = () => {
  const { drawEmitter } = useApp();

  useEffect(() => {}, []);

  return <button>screen share page@</button>;
};

export default ScreenSharePage;
