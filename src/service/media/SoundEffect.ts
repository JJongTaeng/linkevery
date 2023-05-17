import voiceOff from '../../assets/voiceOff.mp3';
import voiceOn from '../../assets/voiceOn.mp3';
class SoundEffect {
  private voiceOn = new Audio(voiceOn);
  private voiceOff = new Audio(voiceOff);
  public startVoice() {
    this.voiceOn.pause();
    this.voiceOn.currentTime = 0;
    this.voiceOn.play();
  }
  public closeVoice() {
    this.voiceOff.pause();
    this.voiceOff.currentTime = 0;

    this.voiceOff.play();
  }
}

export const soundEffect = new SoundEffect();
