import React from 'react';
import styled from 'styled-components';

interface CoupangAdsProps {
  src: string;
  width: number;
  height: number;
}

const CoupangAdsContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CoupangAds = ({ src, height, width }: CoupangAdsProps) => {
  return (
    <CoupangAdsContainer>
      <div
        style={{
          width,
          height,
        }}
      >
        <iframe
          src={src}
          width={width}
          height={height}
          frameBorder="0"
          scrolling="no"
          referrerPolicy="unsafe-url"
        ></iframe>
      </div>
    </CoupangAdsContainer>
  );
};

export default CoupangAds;
