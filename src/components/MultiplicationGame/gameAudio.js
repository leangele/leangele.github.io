let audioContext = null;
let activeNodes = [];

export const passedChallenge = (score, total, passPercent = 70) => {
  if (!total) {
    return false;
  }
  return (score / total) * 100 > passPercent;
};

const getAudioContext = () => {
  const AudioContextClass = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClass) {
    return null;
  }
  if (!audioContext) {
    audioContext = new AudioContextClass();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
  return audioContext;
};

const stopSounds = () => {
  activeNodes.forEach((node) => {
    try {
      node.stop();
    } catch (error) {
      // The oscillator may already have stopped.
    }
  });
  activeNodes = [];
};

const playMelody = (notes) => {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  stopSounds();
  const startAt = context.currentTime + 0.02;

  notes.forEach((note) => {
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    const noteStart = startAt + note.time;
    const noteEnd = noteStart + note.duration;

    oscillator.type = note.type || "sine";
    oscillator.frequency.setValueAtTime(note.frequency, noteStart);
    gain.gain.setValueAtTime(0.0001, noteStart);
    gain.gain.exponentialRampToValueAtTime(note.gain || 0.12, noteStart + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, noteEnd);
    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start(noteStart);
    oscillator.stop(noteEnd + 0.02);
    activeNodes.push(oscillator);
  });
};

export const unlockGameAudio = () => {
  getAudioContext();
};

export const playBetweenQuestions = () => {
  playMelody([
    { frequency: 523.25, time: 0, duration: 0.12 },
    { frequency: 659.25, time: 0.1, duration: 0.16 },
  ]);
};

export const playVictory = () => {
  playMelody([
    { frequency: 523.25, time: 0, duration: 0.18, type: "triangle" },
    { frequency: 659.25, time: 0.16, duration: 0.18, type: "triangle" },
    { frequency: 783.99, time: 0.32, duration: 0.18, type: "triangle" },
    { frequency: 1046.5, time: 0.48, duration: 0.42, type: "triangle", gain: 0.14 },
  ]);
};

export const playDefeat = () => {
  playMelody([
    { frequency: 392, time: 0, duration: 0.22, type: "sawtooth", gain: 0.05 },
    { frequency: 349.23, time: 0.2, duration: 0.22, type: "sawtooth", gain: 0.05 },
    { frequency: 311.13, time: 0.4, duration: 0.24, type: "sawtooth", gain: 0.05 },
    { frequency: 233.08, time: 0.62, duration: 0.4, type: "sawtooth", gain: 0.04 },
  ]);
};
