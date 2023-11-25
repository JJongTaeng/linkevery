import React, { useEffect, useState } from 'react';
import KakaoAdsfit from './KakaoAdsfit';

const KakaoAdsfitByDevice = () => {
  const [isMobile, setIsMobile] = useState(false);

  const isMobileWidth = () => window.innerWidth <= 1100;
  const handleMediaQueryList = () => {
    setIsMobile(isMobileWidth());
  };

  useEffect(() => {
    setIsMobile(isMobileWidth());
    const mql = matchMedia('(max-width: 1100px)');
    mql.addEventListener('change', handleMediaQueryList);

    return () => {
      mql.removeEventListener('change', handleMediaQueryList);
    };
  }, []);

  return (
    <>
      {isMobile ? (
        <KakaoAdsfit width={320} height={100} unit={'DAN-rm2GqaHQlVVxQ4N7'} />
      ) : (
        <KakaoAdsfit width={728} height={90} unit={'DAN-CfhDMGJQmWvTuhcK'} />
      )}
    </>
  );
};

export default KakaoAdsfitByDevice;
