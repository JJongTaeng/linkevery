import React, { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { ADS_TYPE, EVENT_NAME } from '../../constants/gtm';
import { storage } from '../../service/storage/StorageService';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Ads = styled.div`
  display: flex;
  justify-content: center;
`;

interface KakaoAdsfitProps {
  width: number;
  height: number;
  unit: string;
}

const KakaoAdsfit = ({ width, height, unit }: KakaoAdsfitProps) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let ins = document.createElement('ins');
    let script = document.createElement('script');

    ins.className = 'kakao_ad_area';
    ins.style.cssText = 'display:none;';
    script.async = true;
    script.type = 'text/javascript';
    script.src = '//t1.daumcdn.net/kas/static/ba.min.js';
    ins.setAttribute('data-ad-width', `${width}`);
    ins.setAttribute('data-ad-height', `${height}`);
    ins.setAttribute('data-ad-unit', unit);

    ref.current!.append(ins, script);

    return () => {
      ins.remove();
      script.remove();
    };
  }, [unit]);
  return (
    <Container>
      <Ads
        onClick={() => {
          window.dataLayer.push({
            event: EVENT_NAME.clickAds,
            username: storage.getItem('username'),
            roomName: storage.getItem('roomName'),
            adsType: ADS_TYPE.KAKAO,
          });
        }}
        style={{
          width,
          height,
        }}
        ref={ref}
      ></Ads>
    </Container>
  );
};

export default KakaoAdsfit;
