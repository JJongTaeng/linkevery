class VideoManager {
  constructor() {}

  addVideo(id: string, mediaStream: MediaStream) {
    const video = document.createElement('video');
    video.setAttribute('id', id);
    video.classList.add('screenshare-video');
    video.srcObject = mediaStream;
    document.body.appendChild(video);
    video.play();
    video.autoplay = true;
  }

  removeVideo(id: string) {
    const video = document.getElementById(id);
    if (!video) return;
    video.parentNode?.removeChild(video);
  }

  clearAllVideo() {
    const videoNodeList = document.querySelectorAll('.screenshare-video');
    videoNodeList.forEach((node) => {
      node.parentNode?.removeChild(node);
    });
  }
}

export const videoManager = new VideoManager();
