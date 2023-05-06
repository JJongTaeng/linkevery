class MediaDeviceUtils {
  public async isAvailableAudioInput() {
    const deviceList = await navigator.mediaDevices.enumerateDevices();
    for (const device of deviceList) {
      if (device.kind === 'audioinput') return true;
    }
    return false;
  }
}

export const mdUtils = new MediaDeviceUtils();
