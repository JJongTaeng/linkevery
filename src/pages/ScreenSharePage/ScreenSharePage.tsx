import React, { useEffect } from 'react';
import styled from 'styled-components';

const ScreenSharePage = () => {
  useEffect(() => {}, []);

  return <Video autoPlay={true} />;
};

const Video = styled.video`
  width: 100%;
  height: 100%;
`;

export default ScreenSharePage;
