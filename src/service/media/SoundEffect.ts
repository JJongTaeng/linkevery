import voiceOff from 'assets/voiceOff.mp3';
import voiceOn from 'assets/voiceOn.mp3';
import chat from '../../assets/chat.mp3';
import { Lifecycle, scoped } from 'tsyringe';

@scoped(Lifecycle.ContainerScoped)
export class SoundEffect {
  private voiceOn = new Audio(voiceOn);
  private chat = new Audio(chat);
  private voiceOff = new Audio(voiceOff);
  public startVoice() {
    this.voiceOn.pause();
    this.voiceOn.currentTime = 0;
    this.voiceOff.volume = 0.5;
    this.voiceOn.play();
  }
  public closeVoice() {
    this.voiceOff.pause();
    this.voiceOff.currentTime = 0;
    this.voiceOff.volume = 0.5;
    this.voiceOff.play();
  }
  public receiveChat() {
    this.chat.pause();
    this.chat.currentTime = 0;
    this.chat.volume = 0.5;
    this.chat.play();
  }
}
