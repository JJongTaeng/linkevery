class VideoManager {
  constructor() {}
  private videoElementMap: { [key: string]: HTMLVideoElement } = {};

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
    let popUpWindow = window.open('', '_blank', 'x=y');
    const videoElem = document.createElement('video');
    videoElem.autoplay = true;
    videoElem.muted = true;
    videoElem.style.width = '100%';
    videoElem.style.height = '100%';
    let remoteVideo = popUpWindow?.document.body.appendChild(videoElem);
    remoteVideo!.srcObject = this.videoElementMap[clientId].srcObject;
  }

  removeVideoNode(id: string) {
    const video = document.getElementById(id + '_video') as HTMLVideoElement;
    if (!video) return;
    video.parentNode?.removeChild(video);
  }

  removeAllVideoNode() {
    const videoNodeList = document.querySelectorAll('.screen-share-video');
    videoNodeList.forEach((node) => {
      node.parentNode?.removeChild(node);
    });
  }

  clearAllVideo() {
    this.removeAllVideoNode();
    for (const key in this.videoElementMap) {
      this.clearVideo(key);
    }
  }

  clearVideo(id: string) {
    const video = this.videoElementMap[id];
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
    this.removeVideoNode(id);
  }
}

export const videoManager = new VideoManager();
