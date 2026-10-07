import {
  passedChallenge,
  playDefeat,
  playVictory,
  startCombatMusic,
  startSelectMusic,
  stopCombatMusic,
} from "./gameAudio";

class FakeAudioContext {
  constructor() {
    this.currentTime = 0;
    this.state = "running";
    this.destination = {};
  }

  createOscillator() {
    return {
      frequency: { setValueAtTime() {} },
      connect() {},
      start() {
        this.started = true;
      },
      stop() {
        this.stopped = true;
      },
    };
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

test("counts a score above 70 percent as a win", () => {
  expect(passedChallenge(4, 5, 70)).toBe(true);
  expect(passedChallenge(71, 100, 70)).toBe(true);
});

test("plays a different loop for selection, combat, victory, and defeat", () => {
  const oscillators = [];
  const OriginalAudioContext = window.AudioContext;
  window.AudioContext = class extends FakeAudioContext {
    createOscillator() {
      const oscillator = super.createOscillator();
      const start = oscillator.start;
      oscillator.start = () => {
        start.call(oscillator);
        oscillators.push(oscillator);
      };
      return oscillator;
    }
  };

  let mark = 0;
  const takeNewNotes = () => {
    const notes = oscillators.slice(mark);
    mark = oscillators.length;
    return notes;
  };

  startSelectMusic();
  const selectNotes = takeNewNotes();
  startCombatMusic();
  const combatNotes = takeNewNotes();
  playVictory();
  const victoryNotes = takeNewNotes();
  playDefeat();
  const defeatNotes = takeNewNotes();

  expect(selectNotes.length).toBeGreaterThan(0);
  expect(selectNotes.every((oscillator) => oscillator.stopped)).toBe(true);
  expect(combatNotes.every((oscillator) => oscillator.stopped)).toBe(true);
  expect(victoryNotes.every((oscillator) => oscillator.stopped)).toBe(true);
  expect(defeatNotes.length).toBeGreaterThan(0);
  expect(
    new Set([
      selectNotes.length,
      combatNotes.length,
      victoryNotes.length,
      defeatNotes.length,
    ]).size
  ).toBe(4);

  stopCombatMusic();
  window.AudioContext = OriginalAudioContext;
});

test("counts 70 percent and below as a loss", () => {
  expect(passedChallenge(3, 5, 70)).toBe(false);
  expect(passedChallenge(70, 100, 70)).toBe(false);
  expect(passedChallenge(0, 5, 70)).toBe(false);
});
