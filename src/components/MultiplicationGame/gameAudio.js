let audioContext = null;
let activeNodes = [];
let bedNodes = [];
let bedTimer = null;
let bedName = null;
let nextBedAt = 0;
let currentStyle = "pixel";

/* =========================================================================
   ESTILO 1: PIXEL ART RETRO (Chiptune 8-bit / 16-bit JRPG)
   ========================================================================= */

const PIXEL_SELECT_LOOP = [
  { frequency: 196, time: 0, duration: 3.15, type: "sine", gain: 0.03 },
  { frequency: 392, time: 0, duration: 0.42, type: "triangle", gain: 0.04 },
  { frequency: 493.88, time: 0.46, duration: 0.36, type: "triangle", gain: 0.038 },
  { frequency: 440, time: 0.9, duration: 0.34, type: "triangle", gain: 0.036 },
  { frequency: 392, time: 1.32, duration: 0.4, type: "triangle", gain: 0.038 },
  { frequency: 329.63, time: 1.8, duration: 0.36, type: "triangle", gain: 0.034 },
  { frequency: 349.23, time: 2.22, duration: 0.3, type: "triangle", gain: 0.034 },
  { frequency: 392, time: 2.6, duration: 0.5, type: "triangle", gain: 0.04 },
];

const PIXEL_COMBAT_LOOP = [
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

const PIXEL_VICTORY_LOOP = [
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

const PIXEL_DEFEAT_LOOP = [
  { frequency: 110, time: 0, duration: 3.55, type: "sine", gain: 0.03 },
  { frequency: 220, time: 0, duration: 0.5, type: "triangle", gain: 0.04 },
  { frequency: 196, time: 0.56, duration: 0.46, type: "triangle", gain: 0.036 },
  { frequency: 174.61, time: 1.1, duration: 0.5, type: "triangle", gain: 0.034 },
  { frequency: 164.81, time: 1.68, duration: 0.5, type: "triangle", gain: 0.032 },
  { frequency: 146.83, time: 2.26, duration: 0.55, type: "triangle", gain: 0.03 },
  { frequency: 130.81, time: 2.9, duration: 0.6, type: "triangle", gain: 0.028 },
];

/* =========================================================================
   ESTILO 2: FANTASÍA MEDIEVAL ILUSTRADA (Baladas y Fanfarrias Medievales)
   ========================================================================= */

const FANTASY_SELECT_LOOP = [
  { frequency: 220, time: 0, duration: 3.5, type: "sine", gain: 0.03 }, // Lute Drone A3
  { frequency: 329.63, time: 0, duration: 0.5, type: "sine", gain: 0.04 }, // E4
  { frequency: 440, time: 0.52, duration: 0.4, type: "sine", gain: 0.045 }, // A4
  { frequency: 493.88, time: 0.94, duration: 0.36, type: "triangle", gain: 0.04 }, // B4
  { frequency: 523.25, time: 1.32, duration: 0.6, type: "sine", gain: 0.048 }, // C5
  { frequency: 493.88, time: 1.94, duration: 0.34, type: "triangle", gain: 0.038 }, // B4
  { frequency: 440, time: 2.3, duration: 0.4, type: "sine", gain: 0.042 }, // A4
  { frequency: 392, time: 2.72, duration: 0.38, type: "sine", gain: 0.038 }, // G4
  { frequency: 329.63, time: 3.12, duration: 0.45, type: "triangle", gain: 0.04 }, // E4
  { frequency: 440, time: 3.58, duration: 0.6, type: "sine", gain: 0.045 }, // A4
];

const FANTASY_COMBAT_LOOP = [
  { frequency: 130.81, time: 0, duration: 2.8, type: "sine", gain: 0.038 }, // Low C3 Drone
  { frequency: 196, time: 0, duration: 0.3, type: "triangle", gain: 0.045 }, // G3
  { frequency: 261.63, time: 0.32, duration: 0.28, type: "triangle", gain: 0.048 }, // C4
  { frequency: 311.13, time: 0.62, duration: 0.24, type: "sine", gain: 0.042 }, // Eb4 (Modal)
  { frequency: 392, time: 0.88, duration: 0.32, type: "triangle", gain: 0.05 }, // G4
  { frequency: 196, time: 1.22, duration: 0.18, type: "triangle", gain: 0.04 }, // G3
  { frequency: 466.16, time: 1.42, duration: 0.28, type: "sine", gain: 0.048 }, // Bb4
  { frequency: 392, time: 1.72, duration: 0.24, type: "triangle", gain: 0.046 }, // G4
  { frequency: 349.23, time: 1.98, duration: 0.24, type: "sine", gain: 0.042 }, // F4
  { frequency: 311.13, time: 2.24, duration: 0.26, type: "triangle", gain: 0.042 }, // Eb4
  { frequency: 293.66, time: 2.52, duration: 0.3, type: "sine", gain: 0.04 }, // D4
  { frequency: 261.63, time: 2.84, duration: 0.42, type: "triangle", gain: 0.048 }, // C4
  { frequency: 196, time: 3.28, duration: 0.35, type: "sine", gain: 0.04 }, // G3
];

const FANTASY_VICTORY_LOOP = [
  { frequency: 261.63, time: 0, duration: 3.6, type: "sine", gain: 0.035 }, // Royal Drone C4
  { frequency: 392, time: 0, duration: 0.32, type: "triangle", gain: 0.045 }, // G4
  { frequency: 523.25, time: 0.34, duration: 0.3, type: "sine", gain: 0.052 }, // C5
  { frequency: 659.25, time: 0.66, duration: 0.32, type: "triangle", gain: 0.052 }, // E5
  { frequency: 783.99, time: 1.0, duration: 0.46, type: "sine", gain: 0.055 }, // G5
  { frequency: 659.25, time: 1.48, duration: 0.26, type: "triangle", gain: 0.048 }, // E5
  { frequency: 783.99, time: 1.76, duration: 0.32, type: "sine", gain: 0.05 }, // G5
  { frequency: 880, time: 2.1, duration: 0.36, type: "triangle", gain: 0.05 }, // A5
  { frequency: 1046.5, time: 2.48, duration: 0.52, type: "sine", gain: 0.055 }, // C6
  { frequency: 880, time: 3.02, duration: 0.28, type: "triangle", gain: 0.046 }, // A5
  { frequency: 783.99, time: 3.32, duration: 0.32, type: "sine", gain: 0.048 }, // G5
  { frequency: 1046.5, time: 3.66, duration: 0.7, type: "sine", gain: 0.058 }, // C6
];

const FANTASY_DEFEAT_LOOP = [
  { frequency: 110, time: 0, duration: 4.2, type: "sine", gain: 0.03 }, // Somber A2
  { frequency: 220, time: 0, duration: 0.7, type: "sine", gain: 0.038 }, // A3
  { frequency: 196, time: 0.75, duration: 0.65, type: "triangle", gain: 0.034 }, // G3
  { frequency: 174.61, time: 1.42, duration: 0.7, type: "sine", gain: 0.032 }, // F3
  { frequency: 164.81, time: 2.15, duration: 0.75, type: "triangle", gain: 0.03 }, // E3
  { frequency: 146.83, time: 2.95, duration: 1.1, type: "sine", gain: 0.028 }, // D3
];

const MUSIC_BEDS = {
  pixel: {
    select: { seconds: 3.2, notes: PIXEL_SELECT_LOOP },
    combat: { seconds: 2.4, notes: PIXEL_COMBAT_LOOP },
    victory: { seconds: 3.2, notes: PIXEL_VICTORY_LOOP },
    defeat: { seconds: 3.6, notes: PIXEL_DEFEAT_LOOP },
  },
  fantasy: {
    select: { seconds: 4.2, notes: FANTASY_SELECT_LOOP },
    combat: { seconds: 3.6, notes: FANTASY_COMBAT_LOOP },
    victory: { seconds: 4.4, notes: FANTASY_VICTORY_LOOP },
    defeat: { seconds: 4.2, notes: FANTASY_DEFEAT_LOOP },
  },
};

export const setAudioGraphicStyle = (style) => {
  if (style === "pixel" || style === "fantasy") {
    currentStyle = style;
  }
};

export const getAudioGraphicStyle = () => currentStyle;

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
  const [styleKey, loopKey] = (bedName || "").split(":");
  const styleBeds = MUSIC_BEDS[styleKey] || MUSIC_BEDS[currentStyle] || MUSIC_BEDS.pixel;
  const bed = styleBeds?.[loopKey || bedName];
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

const startMusicBed = (name, style) => {
  const chosenStyle = style || currentStyle;
  const compositeName = `${chosenStyle}:${name}`;
  if (bedName === compositeName || !getAudioContext()) {
    return;
  }

  stopMusicBed();
  bedName = compositeName;
  nextBedAt = getAudioContext().currentTime + 0.05;
  queueMusicBed();
};

export const startSelectMusic = (style) => startMusicBed("select", style);

export const startCombatMusic = (style) => startMusicBed("combat", style);

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

export const resetGameAudio = () => {
  stopMusicBed();
  audioContext = null;
  activeNodes = [];
  bedNodes = [];
  bedTimer = null;
  bedName = null;
  nextBedAt = 0;
};

export const unlockGameAudio = () => {
  getAudioContext();
};

export const playBetweenQuestions = (style) => {
  const chosen = style || currentStyle;
  if (chosen === "fantasy") {
    playMelody([
      { frequency: 440, time: 0, duration: 0.14, type: "sine", gain: 0.05 },
      { frequency: 554.37, time: 0.08, duration: 0.16, type: "triangle", gain: 0.05 },
      { frequency: 659.25, time: 0.16, duration: 0.22, type: "sine", gain: 0.05 },
    ]);
  } else {
    playMelody([
      { frequency: 523.25, time: 0, duration: 0.12, type: "square", gain: 0.04 },
      { frequency: 659.25, time: 0.1, duration: 0.16, type: "square", gain: 0.04 },
    ]);
  }
};

export const playVictory = (style) => {
  startMusicBed("victory", style);
};

export const playDefeat = (style) => {
  startMusicBed("defeat", style);
};
