import EventEmitter from "events";

export enum EVENT_MEDIA_DEVICE {
  INIT = "EVENT_MEDIA_DEVICE_INIT",
}

export enum MEDIA_TYPE {
  BOTH_MEDIA = "BOTH_MEDIA",
  ONLY_AUDIO = "ONLY_AUDIO",
  ONLY_VIDEO = "ONLY_VIDEO",
  NONE_MEDIA_DEVICE = "NONE_MEDIA_DEVICE",
}

export class MediaDevice extends EventEmitter {
  private mediaType?: MEDIA_TYPE;

  public async get() {
    try {
      const stream = await this.getMediaDevice({ video: true, audio: true });
      this.mediaType = MEDIA_TYPE.BOTH_MEDIA;
      this.emit(EVENT_MEDIA_DEVICE.INIT, { stream, type: this.mediaType });
    } catch (e) {
      try {
        const stream = await this.getMediaDevice({ video: false, audio: true });
        this.mediaType = MEDIA_TYPE.ONLY_AUDIO;
        this.emit(EVENT_MEDIA_DEVICE.INIT, {
          stream,
          type: this.mediaType,
        });
      } catch (e) {
        try {
          const stream = await this.getMediaDevice({
            video: true,
            audio: false,
          });
          this.mediaType = MEDIA_TYPE.ONLY_VIDEO;
          this.emit(EVENT_MEDIA_DEVICE.INIT, {
            stream,
            type: this.mediaType,
          });
        } catch (e) {
          // no media device
          this.mediaType = MEDIA_TYPE.NONE_MEDIA_DEVICE;
          this.emit(EVENT_MEDIA_DEVICE.INIT, {
            stream: undefined,
            type: this.mediaType,
          });
        }
      }
    }
  }

  private async getMediaDevice(constraints: {
    video: boolean;
    audio: boolean;
  }) {
    return await navigator.mediaDevices.getUserMedia(constraints);
  }
}
