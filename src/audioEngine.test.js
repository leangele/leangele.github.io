import { audioEngine } from "./audioEngine";

class FakeAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = "running";
    this.destination = {};
    this.started = [];
  }

  createOscillator() {
    const oscillator = {
      type: "",
      frequency: {
        setValueAtTime() {},
        exponentialRampToValueAtTime() {},
      },
      connect() {},
      start: () => {
        oscillator.started = true;
        this.started.push(oscillator);
      },
      stop() {
        oscillator.stopped = true;
      },
    };
    oscillator.start = oscillator.start.bind(this);
    return oscillator;
  }

  createGain() {
    return {
      gain: {
        setValueAtTime() {},
        exponentialRampToValueAtTime() {},
      },
      connect() {},
    };
  }
}

test("plays a hit or a miss and stays quiet when muted", () => {
  const OriginalAudioContext = window.AudioContext;
  const context = new FakeAudioContext();
  window.AudioContext = class extends FakeAudioContext {
    constructor() {
      super();
      return context;
    }
  };
  audioEngine.ctx = null;
  audioEngine.isMuted = false;

  audioEngine.playAttackHit();
  audioEngine.playMissSound();
  expect(context.started).toHaveLength(2);
  expect(context.started.every((oscillator) => oscillator.stopped)).toBe(true);

  audioEngine.isMuted = true;
  audioEngine.playAttackHit();
  audioEngine.playMissSound();
  expect(context.started).toHaveLength(2);

  audioEngine.isMuted = false;
  audioEngine.ctx = null;
  window.AudioContext = OriginalAudioContext;
});

test("adapts hit sound waveform to graphic style", () => {
  const OriginalAudioContext = window.AudioContext;
  const context = new FakeAudioContext();
  window.AudioContext = class extends FakeAudioContext {
    constructor() {
      super();
      return context;
    }
  };
  audioEngine.ctx = null;
  audioEngine.isMuted = false;

  audioEngine.setGraphicStyle("fantasy");
  audioEngine.playAttackHit();
  expect(context.started[0].type).toBe("triangle");

  audioEngine.setGraphicStyle("pixel");
  audioEngine.playAttackHit();
  expect(context.started[1].type).toBe("square");

  audioEngine.ctx = null;
  window.AudioContext = OriginalAudioContext;
});
