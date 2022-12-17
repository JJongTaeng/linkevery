import {
  EVENT_MEDIA_DEVICE,
  MEDIA_TYPE,
  MediaDevice,
} from "../lib/MediaDevice";
import { useEffect, useState } from "react";

export interface MediaDeviceState {
  stream?: MediaStream;
  type: MEDIA_TYPE;
}

export const useMediaDevice = () => {
  const mediaDevice = new MediaDevice();
  const [mediaInfo, setMediaInfo] = useState<MediaDeviceState | null>(null);
  useEffect(() => {
    mediaDevice.on(EVENT_MEDIA_DEVICE.INIT, ({ stream, type }) =>
      setMediaInfo({ stream, type })
    );
  }, []);

  return {
    getMedia: () => mediaDevice.get(),
    mediaInfo,
  };
};
