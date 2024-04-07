import { inject, injectable } from 'tsyringe';
import { ScreenShareEmitter } from '../emitter/ScreenShareEmitter.ts';

@injectable()
export class VideoManager {
  constructor(
    @inject(ScreenShareEmitter) private screenShareEmitter: ScreenShareEmitter,
  ) {}
  private videoElementMap: { [key: string]: HTMLVideoElement } = {};
  private windowPopupMap: { [key: string]: Window } = {};

  addVideo(id: string, mediaStream: MediaStream) {
    const video = document.createElement('video');
    video.setAttribute('id', id + '_video');
    video.classList.add('screen-share-video');
    video.srcObject = mediaStream;
    video.play();
    video.autoplay = true;
    this.videoElementMap[id] = video;
  }

  openVideoPopup(clientId: string) {
    const popUpWindow = window.open('', '_blank', 'x=y')!;
    this.windowPopupMap[clientId] = popUpWindow!;
    const videoElem = document.createElement('video');
    videoElem.autoplay = true;
    videoElem.muted = true;
    videoElem.style.width = '100%';
    videoElem.style.height = '100%';
    let remoteVideo = popUpWindow?.document.body.appendChild(videoElem);
    remoteVideo!.srcObject = this.videoElementMap[clientId].srcObject;
  }

  openTestPopup(clientId: string) {
    const popUpWindow = window.open(`/linkevery/#/screen`, '_blank', 'x=y')!;
    if (popUpWindow) {
      setTimeout(() => {
        this.screenShareEmitter.sendScreenPopupOpenMessage({
          srcObject: this.videoElementMap[clientId],
        });
      }, 1000);
    }
  }

  clearAllVideo() {
    for (const key in this.videoElementMap) {
      this.clearVideo(key);
    }
  }

  clearVideo(id: string) {
    const video = this.videoElementMap[id];
    const popup = this.windowPopupMap[id];
    popup?.close();
    delete this.windowPopupMap[id];
    if (!video) {
      return;
    }
    // @ts-ignore
    const tracks = video.srcObject?.getTracks();
    if (!tracks) return;
    tracks.forEach((track: any) => {
      track.stop();
    });
    delete this.videoElementMap[id];
  }
}
