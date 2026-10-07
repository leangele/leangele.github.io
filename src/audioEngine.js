import {
  playDefeat,
  playVictory,
  setAudioGraphicStyle,
  startCombatMusic,
  stopCombatMusic,
} from "./components/MultiplicationGame/gameAudio";

class AdventureAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.currentLoop = null;
    this.graphicStyle = "pixel";
  }

  setGraphicStyle(style) {
    if (style === "pixel" || style === "fantasy") {
      this.graphicStyle = style;
      setAudioGraphicStyle(style);
    }
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

  playBattleTheme(style) {
    this.init();
    this.stopAllMusic();
    if (this.isMuted) {
      return;
    }
    startCombatMusic(style || this.graphicStyle);
  }

  playVictoryTheme(style) {
    this.init();
    this.stopAllMusic();
    if (this.isMuted) {
      return;
    }
    playVictory(style || this.graphicStyle);
  }

  playDefeatTheme(style) {
    this.init();
    this.stopAllMusic();
    if (this.isMuted) {
      return;
    }
    playDefeat(style || this.graphicStyle);
  }

  playAttackHit() {
    this.init();
    if (this.isMuted || !this.ctx) {
      return;
    }
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (this.graphicStyle === "fantasy") {
      // Impacto de espada medieval con resonancia armónica
      osc.type = "triangle";
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(220, now + 0.22);
      gain.gain.setValueAtTime(0.24, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.25);
    } else {
      // Golpe arcade retro chiptune con onda cuadrada
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
  }

  playMissSound() {
    this.init();
    if (this.isMuted || !this.ctx) {
      return;
    }
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    if (this.graphicStyle === "fantasy") {
      // Silbido de esquiva / ráfaga de aire suave
      osc.type = "sine";
      osc.frequency.setValueAtTime(261.63, now);
      osc.frequency.exponentialRampToValueAtTime(98, now + 0.28);
      gain.gain.setValueAtTime(0.16, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.3);
    } else {
      // Caída tonal clásica retro de 8 bits
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
}

export const audioEngine = new AdventureAudioEngine();
