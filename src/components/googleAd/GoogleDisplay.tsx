import React, { useEffect } from 'react';

interface GoogleDisplayProps {
  className: string;
  adClient: string;
  adSlot: string;
  adFormat: string;
  fullWidthResponsive: string;
}

const GoogleDisplay = (props: GoogleDisplayProps) => {
  useEffect(() => {
    if (window) (window.adsbygoogle = window.adsbygoogle || []).push({});
  }, []);

  return (
    <ins
      style={{ display: 'inline-block', width: '100%', height: 90 }}
      className={`adsbygoogle ${props.className}`}
      data-ad-client={props.adClient}
      data-ad-slot={props.adSlot}
      data-ad-format={props.adFormat}
      data-full-width-responsive={props.fullWidthResponsive}
    />
  );
};

export default GoogleDisplay;
