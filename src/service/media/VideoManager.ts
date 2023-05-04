class VideoManager {
  constructor() {}
  private videoElementMap: { [key: string]: HTMLVideoElement } = {};

  addVideo(id: string, mediaStream: MediaStream) {
    this.removeVideo(id);
    const video = document.createElement('video');

    video.setAttribute('id', id);
    video.classList.add('screen-share-video');
    video.srcObject = mediaStream;
    video.play();
    video.autoplay = true;
    this.videoElementMap[id] = video;
  }

  appendVideo(id: string) {
    this.clearAllVideo();
    const container = document.querySelector('#video-container');
    if (!container) {
      throw new Error('video container not defined');
    }
    container.appendChild(this.videoElementMap[id]);
  }

  removeVideo(id: string) {
    const video = document.getElementById(id);
    if (!video) return;
    video.parentNode?.removeChild(video);
  }

  clearAllVideo() {
    const videoNodeList = document.querySelectorAll('.screen-share-video');
    videoNodeList.forEach((node) => {
      node.parentNode?.removeChild(node);
    });
  }
}

export const videoManager = new VideoManager();
