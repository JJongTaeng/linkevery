import React from 'react';

interface CoupangAdsProps {
  src: string;
  width: number;
  height: number;
}

const CoupangAds = ({ src, height, width }: CoupangAdsProps) => {
  return (
    <div>
      <iframe
        src={src}
        width={width}
        height={height}
        frameBorder="0"
        scrolling="no"
        referrerPolicy="unsafe-url"
      ></iframe>
    </div>
  );
};

export default CoupangAds;
