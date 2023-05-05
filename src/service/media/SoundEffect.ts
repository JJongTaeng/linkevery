import chat from '../../assets/chat.mp3';
import voiceOn from '../../assets/voiceOn.mp3';
class SoundEffect {
  private voice = new Audio(voiceOn);
  private chat = new Audio(chat);
  public startVoice() {
    this.voice.pause();
    this.voice.currentTime = 0;
    this.voice.play();
  }
  public receivedChat() {
    this.chat.pause();
    this.chat.currentTime = 0;

    this.chat.play();
  }
}

export const soundEffect = new SoundEffect();
