import {
  playDefeat,
  playVictory,
  startCombatMusic,
  stopCombatMusic,
} from "./components/MultiplicationGame/gameAudio";

class AdventureAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentLoop = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) {
        return;
      }
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  stopAllMusic() {
    stopCombatMusic();
    if (this.currentLoop) {
      window.clearInterval(this.currentLoop);
      this.currentLoop = null;
    }
  }

  playBattleTheme() {
    this.init();
    this.stopAllMusic();
    if (this.isMuted) {
      return;
    }
    startCombatMusic();
  }

  playVictoryTheme() {
    this.init();
    this.stopAllMusic();
    if (this.isMuted) {
      return;
    }
    playVictory();
  }

  playDefeatTheme() {
    this.init();
    this.stopAllMusic();
    if (this.isMuted) {
      return;
    }
    playDefeat();
  }

  playAttackHit() {
    this.init();
    if (this.isMuted || !this.ctx) {
      return;
    }
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.15);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.2);
  }

  playMissSound() {
    this.init();
    if (this.isMuted || !this.ctx) {
      return;
    }
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);

    gain.gain.setValueAtTime(0.18, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 0.3);
  }
}

export const audioEngine = new AdventureAudioEngine();
