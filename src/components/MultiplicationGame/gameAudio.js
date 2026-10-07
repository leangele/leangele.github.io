let audioContext = null;
let activeNodes = [];
let bedNodes = [];
let bedTimer = null;
let bedName = null;
let nextBedAt = 0;

const SELECT_LOOP = [
  { frequency: 196, time: 0, duration: 3.15, type: "sine", gain: 0.03 },
  { frequency: 392, time: 0, duration: 0.42, type: "triangle", gain: 0.04 },
  { frequency: 493.88, time: 0.46, duration: 0.36, type: "triangle", gain: 0.038 },
  { frequency: 440, time: 0.9, duration: 0.34, type: "triangle", gain: 0.036 },
  { frequency: 392, time: 1.32, duration: 0.4, type: "triangle", gain: 0.038 },
  { frequency: 329.63, time: 1.8, duration: 0.36, type: "triangle", gain: 0.034 },
  { frequency: 349.23, time: 2.22, duration: 0.3, type: "triangle", gain: 0.034 },
  { frequency: 392, time: 2.6, duration: 0.5, type: "triangle", gain: 0.04 },
];

const COMBAT_LOOP = [
  { frequency: 146.83, time: 0, duration: 2.35, type: "sine", gain: 0.035 },
  { frequency: 98, time: 0, duration: 0.08, type: "square", gain: 0.02 },
  { frequency: 293.66, time: 0, duration: 0.28, type: "triangle", gain: 0.045 },
  { frequency: 349.23, time: 0.32, duration: 0.22, type: "triangle", gain: 0.04 },
  { frequency: 392, time: 0.58, duration: 0.26, type: "triangle", gain: 0.045 },
  { frequency: 98, time: 0.6, duration: 0.07, type: "square", gain: 0.016 },
  { frequency: 440, time: 0.9, duration: 0.22, type: "triangle", gain: 0.04 },
  { frequency: 349.23, time: 1.18, duration: 0.28, type: "triangle", gain: 0.04 },
  { frequency: 98, time: 1.2, duration: 0.08, type: "square", gain: 0.02 },
  { frequency: 293.66, time: 1.55, duration: 0.42, type: "triangle", gain: 0.04 },
  { frequency: 73.42, time: 1.8, duration: 0.12, type: "square", gain: 0.016 },
];

const VICTORY_LOOP = [
  { frequency: 261.63, time: 0, duration: 3.15, type: "sine", gain: 0.03 },
  { frequency: 523.25, time: 0, duration: 0.24, type: "triangle", gain: 0.05 },
  { frequency: 659.25, time: 0.26, duration: 0.24, type: "triangle", gain: 0.05 },
  { frequency: 783.99, time: 0.52, duration: 0.28, type: "triangle", gain: 0.052 },
  { frequency: 1046.5, time: 0.84, duration: 0.46, type: "triangle", gain: 0.05 },
  { frequency: 880, time: 1.4, duration: 0.28, type: "triangle", gain: 0.046 },
  { frequency: 783.99, time: 1.74, duration: 0.28, type: "triangle", gain: 0.046 },
  { frequency: 659.25, time: 2.08, duration: 0.3, type: "triangle", gain: 0.044 },
  { frequency: 1046.5, time: 2.46, duration: 0.62, type: "triangle", gain: 0.05 },
];

const DEFEAT_LOOP = [
  { frequency: 110, time: 0, duration: 3.55, type: "sine", gain: 0.03 },
  { frequency: 220, time: 0, duration: 0.5, type: "triangle", gain: 0.04 },
  { frequency: 196, time: 0.56, duration: 0.46, type: "triangle", gain: 0.036 },
  { frequency: 174.61, time: 1.1, duration: 0.5, type: "triangle", gain: 0.034 },
  { frequency: 164.81, time: 1.68, duration: 0.5, type: "triangle", gain: 0.032 },
  { frequency: 146.83, time: 2.26, duration: 0.55, type: "triangle", gain: 0.03 },
  { frequency: 130.81, time: 2.9, duration: 0.6, type: "triangle", gain: 0.028 },
];

const MUSIC_BEDS = {
  select: { seconds: 3.2, notes: SELECT_LOOP },
  combat: { seconds: 2.4, notes: COMBAT_LOOP },
  victory: { seconds: 3.2, notes: VICTORY_LOOP },
  defeat: { seconds: 3.6, notes: DEFEAT_LOOP },
};

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
  stopNodeList(activeNodes);
};

const scheduleNotes = (notes, destinationNodes, startAt) => {
  const context = getAudioContext();
  if (!context) {
    return;
  }

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
    destinationNodes.push(oscillator);
  });
};

const stopNodeList = (nodes) => {
  nodes.forEach((node) => {
    try {
      node.stop();
    } catch (error) {
      // The oscillator may already have stopped.
    }
  });
  nodes.length = 0;
};

const queueMusicBed = () => {
  const context = getAudioContext();
  const bed = MUSIC_BEDS[bedName];
  if (!bed || !context) {
    return;
  }

  while (nextBedAt < context.currentTime + 0.35) {
    scheduleNotes(bed.notes, bedNodes, nextBedAt);
    nextBedAt += bed.seconds;
  }

  bedTimer = window.setTimeout(queueMusicBed, 120);
};

const stopMusicBed = () => {
  bedName = null;
  window.clearTimeout(bedTimer);
  bedTimer = null;
  stopNodeList(bedNodes);
};

const startMusicBed = (name) => {
  if (bedName === name || !getAudioContext()) {
    return;
  }

  stopMusicBed();
  bedName = name;
  nextBedAt = getAudioContext().currentTime + 0.05;
  queueMusicBed();
};

export const startSelectMusic = () => startMusicBed("select");

export const startCombatMusic = () => startMusicBed("combat");

export const stopCombatMusic = () => {
  stopMusicBed();
};

const playMelody = (notes) => {
  const context = getAudioContext();
  if (!context) {
    return;
  }

  stopSounds();
  scheduleNotes(notes, activeNodes, context.currentTime + 0.02);
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
  startMusicBed("victory");
};

export const playDefeat = () => {
  startMusicBed("defeat");
};
