let audioContext = null;
let activeNodes = [];
let bedNodes = [];
let bedTimer = null;
let bedName = null;
let nextBedAt = 0;
let currentStyle = "pixel";

const LOOKAHEAD_TIME = 0.75;
const SCHEDULER_INTERVAL = 60;

/* =========================================================================
   ESTILO 1: PIXEL ART RETRO (Chiptune 8-bit / 16-bit JRPG)
   ========================================================================= */

// Fase 1: Selección de héroe - Animado tema de aventura retro (133 BPM, G Mayor)
// Turnaround armónico en 3.15s (D4/D5) que resuelve en la tónica (G3/G4) al inicio del loop (3.6s)
const PIXEL_SELECT_LOOP = [
  // Línea de bajo chiptune saltarín (Triangle)
  { frequency: 196.0, time: 0.0, duration: 0.4, type: "triangle", gain: 0.045 }, // G3
  { frequency: 246.94, time: 0.45, duration: 0.4, type: "triangle", gain: 0.042 }, // B3
  { frequency: 293.66, time: 0.9, duration: 0.4, type: "triangle", gain: 0.042 }, // D4
  { frequency: 196.0, time: 1.35, duration: 0.4, type: "triangle", gain: 0.045 }, // G3
  { frequency: 261.63, time: 1.8, duration: 0.4, type: "triangle", gain: 0.044 }, // C4
  { frequency: 220.0, time: 2.25, duration: 0.4, type: "triangle", gain: 0.042 }, // A3
  { frequency: 146.83, time: 2.7, duration: 0.4, type: "triangle", gain: 0.046 }, // D3
  { frequency: 293.66, time: 3.15, duration: 0.42, type: "triangle", gain: 0.044 }, // D4 (Dominante preparatoria)

  // Melodía alegre y dinámica de inicio (Square)
  { frequency: 392.0, time: 0.0, duration: 0.22, type: "square", gain: 0.038 }, // G4
  { frequency: 493.88, time: 0.22, duration: 0.2, type: "square", gain: 0.04 }, // B4
  { frequency: 587.33, time: 0.45, duration: 0.38, type: "square", gain: 0.046 }, // D5
  { frequency: 659.25, time: 0.9, duration: 0.38, type: "square", gain: 0.048 }, // E5
  { frequency: 587.33, time: 1.35, duration: 0.38, type: "square", gain: 0.045 }, // D5
  { frequency: 523.25, time: 1.8, duration: 0.38, type: "square", gain: 0.044 }, // C5
  { frequency: 493.88, time: 2.25, duration: 0.38, type: "square", gain: 0.042 }, // B4
  { frequency: 440.0, time: 2.7, duration: 0.22, type: "square", gain: 0.042 }, // A4
  { frequency: 587.33, time: 3.15, duration: 0.42, type: "square", gain: 0.046 }, // D5 (Turnaround melódico que conecta con G4)
];

// Fase 2: Combate activo - Ritmo de batalla veloz, enérgico y continuo (150 BPM, D Menor)
// Cadencia A7/C# al compás 3.0s que conecta perfectamente con la tónica D3/D4 a 0.0s (3.2s)
const PIXEL_COMBAT_LOOP = [
  // Bajo galopante rápido y propulsor
  { frequency: 146.83, time: 0.0, duration: 0.18, type: "square", gain: 0.038 }, // D3
  { frequency: 73.42, time: 0.2, duration: 0.18, type: "triangle", gain: 0.045 }, // D2
  { frequency: 146.83, time: 0.4, duration: 0.18, type: "square", gain: 0.038 }, // D3
  { frequency: 174.61, time: 0.6, duration: 0.18, type: "triangle", gain: 0.042 }, // F3
  { frequency: 146.83, time: 0.8, duration: 0.18, type: "square", gain: 0.038 }, // D3
  { frequency: 220.0, time: 1.0, duration: 0.18, type: "triangle", gain: 0.042 }, // A3
  { frequency: 116.54, time: 1.2, duration: 0.18, type: "square", gain: 0.042 }, // Bb2
  { frequency: 130.81, time: 1.4, duration: 0.18, type: "triangle", gain: 0.042 }, // C3
  { frequency: 146.83, time: 1.6, duration: 0.18, type: "square", gain: 0.038 }, // D3
  { frequency: 73.42, time: 1.8, duration: 0.18, type: "triangle", gain: 0.045 }, // D2
  { frequency: 174.61, time: 2.0, duration: 0.18, type: "square", gain: 0.04 }, // F3
  { frequency: 196.0, time: 2.2, duration: 0.18, type: "triangle", gain: 0.04 }, // G3
  { frequency: 220.0, time: 2.4, duration: 0.18, type: "square", gain: 0.044 }, // A3
  { frequency: 110.0, time: 2.6, duration: 0.18, type: "triangle", gain: 0.045 }, // A2
  { frequency: 138.59, time: 2.8, duration: 0.18, type: "square", gain: 0.046 }, // C#3 (Sensible)
  { frequency: 220.0, time: 3.0, duration: 0.18, type: "triangle", gain: 0.044 }, // A3

  // Melodía de acción heroica y tensión ascendente
  { frequency: 293.66, time: 0.0, duration: 0.36, type: "triangle", gain: 0.05 }, // D4
  { frequency: 349.23, time: 0.4, duration: 0.18, type: "triangle", gain: 0.048 }, // F4
  { frequency: 392.0, time: 0.6, duration: 0.18, type: "triangle", gain: 0.048 }, // G4
  { frequency: 440.0, time: 0.8, duration: 0.36, type: "triangle", gain: 0.052 }, // A4
  { frequency: 587.33, time: 1.2, duration: 0.36, type: "triangle", gain: 0.055 }, // D5
  { frequency: 523.25, time: 1.6, duration: 0.18, type: "triangle", gain: 0.05 }, // C5
  { frequency: 466.16, time: 1.8, duration: 0.18, type: "triangle", gain: 0.048 }, // Bb4
  { frequency: 440.0, time: 2.0, duration: 0.36, type: "triangle", gain: 0.05 }, // A4
  { frequency: 349.23, time: 2.4, duration: 0.18, type: "triangle", gain: 0.046 }, // F4
  { frequency: 392.0, time: 2.6, duration: 0.18, type: "triangle", gain: 0.048 }, // G4
  { frequency: 440.0, time: 2.8, duration: 0.18, type: "triangle", gain: 0.05 }, // A4
  { frequency: 554.37, time: 3.0, duration: 0.19, type: "triangle", gain: 0.052 }, // C#5 (Resuelve en D4 al reiniciar)
];

// Fase 3: Victoria - Fanfarria triunfal y alegre con loop festivo continuo (133 BPM, C Mayor)
// Turnaround en 3.36s (B5) que asciende naturalmente a la tónica C5/C6 (3.6s)
const PIXEL_VICTORY_LOOP = [
  // Base rítmica de celebración
  { frequency: 130.81, time: 0.0, duration: 0.4, type: "triangle", gain: 0.045 }, // C3
  { frequency: 196.0, time: 0.45, duration: 0.4, type: "triangle", gain: 0.042 }, // G3
  { frequency: 130.81, time: 0.9, duration: 0.4, type: "triangle", gain: 0.045 }, // C3
  { frequency: 174.61, time: 1.35, duration: 0.4, type: "triangle", gain: 0.044 }, // F3
  { frequency: 220.0, time: 1.8, duration: 0.4, type: "triangle", gain: 0.044 }, // A3
  { frequency: 196.0, time: 2.25, duration: 0.4, type: "triangle", gain: 0.046 }, // G3
  { frequency: 146.83, time: 2.7, duration: 0.4, type: "triangle", gain: 0.044 }, // D3
  { frequency: 196.0, time: 3.15, duration: 0.42, type: "triangle", gain: 0.046 }, // G3 (Turnaround de bajo)

  // Fanfarria melódica jubilosa
  { frequency: 523.25, time: 0.0, duration: 0.2, type: "square", gain: 0.045 }, // C5
  { frequency: 659.25, time: 0.22, duration: 0.2, type: "square", gain: 0.048 }, // E5
  { frequency: 783.99, time: 0.45, duration: 0.4, type: "square", gain: 0.052 }, // G5
  { frequency: 1046.5, time: 0.9, duration: 0.4, type: "square", gain: 0.055 }, // C6
  { frequency: 880.0, time: 1.35, duration: 0.4, type: "square", gain: 0.05 }, // A5
  { frequency: 783.99, time: 1.8, duration: 0.4, type: "square", gain: 0.05 }, // G5
  { frequency: 659.25, time: 2.25, duration: 0.4, type: "square", gain: 0.046 }, // E5
  { frequency: 587.33, time: 2.7, duration: 0.2, type: "square", gain: 0.044 }, // D5
  { frequency: 659.25, time: 2.92, duration: 0.2, type: "square", gain: 0.046 }, // E5
  { frequency: 783.99, time: 3.15, duration: 0.2, type: "square", gain: 0.048 }, // G5
  { frequency: 987.77, time: 3.36, duration: 0.22, type: "square", gain: 0.05 }, // B5 (Sensible que resuelve en C)
];

// Derrota / Reintento: Balada solemne con cadencia cíclica hacia A menor (3.6s)
const PIXEL_DEFEAT_LOOP = [
  { frequency: 110.0, time: 0.0, duration: 0.65, type: "sine", gain: 0.038 }, // A2
  { frequency: 146.83, time: 0.7, duration: 0.65, type: "sine", gain: 0.035 }, // D3
  { frequency: 130.81, time: 1.4, duration: 0.65, type: "sine", gain: 0.032 }, // C3
  { frequency: 123.47, time: 2.1, duration: 0.65, type: "sine", gain: 0.032 }, // B2
  { frequency: 164.81, time: 2.8, duration: 0.75, type: "sine", gain: 0.035 }, // E3 (Dominante de A)

  { frequency: 220.0, time: 0.0, duration: 0.65, type: "triangle", gain: 0.04 }, // A3
  { frequency: 207.65, time: 0.7, duration: 0.65, type: "triangle", gain: 0.038 }, // G#3
  { frequency: 196.0, time: 1.4, duration: 0.65, type: "triangle", gain: 0.035 }, // G3
  { frequency: 174.61, time: 2.1, duration: 0.65, type: "triangle", gain: 0.034 }, // F3
  { frequency: 164.81, time: 2.8, duration: 0.75, type: "triangle", gain: 0.036 }, // E3 (Turnaround melódico)
];

/* =========================================================================
   ESTILO 2: FANTASÍA MEDIEVAL ILUSTRADA (Acústico / Orquestal)
   ========================================================================= */

// Fase 1: Selección de héroe - Danza animada de taberna medieval (Lira, laúd y flauta, 133 BPM, 3.6s)
// Turnaround E3/E4 que resuelve fluidamente en A3/A4 al inicio del bucle
const FANTASY_SELECT_LOOP = [
  // Laúd y bajo acústico
  { frequency: 220.0, time: 0.0, duration: 0.4, type: "sine", gain: 0.04 }, // A3
  { frequency: 329.63, time: 0.45, duration: 0.4, type: "sine", gain: 0.038 }, // E4
  { frequency: 220.0, time: 0.9, duration: 0.4, type: "sine", gain: 0.04 }, // A3
  { frequency: 261.63, time: 1.35, duration: 0.4, type: "sine", gain: 0.038 }, // C4
  { frequency: 293.66, time: 1.8, duration: 0.4, type: "sine", gain: 0.04 }, // D4
  { frequency: 220.0, time: 2.25, duration: 0.4, type: "sine", gain: 0.038 }, // A3
  { frequency: 164.81, time: 2.7, duration: 0.4, type: "sine", gain: 0.042 }, // E3
  { frequency: 329.63, time: 3.15, duration: 0.42, type: "sine", gain: 0.04 }, // E4 (Dominante preparatoria)

  // Flauta dulce y arpa céltica
  { frequency: 440.0, time: 0.0, duration: 0.22, type: "triangle", gain: 0.045 }, // A4
  { frequency: 493.88, time: 0.22, duration: 0.2, type: "triangle", gain: 0.042 }, // B4
  { frequency: 523.25, time: 0.45, duration: 0.4, type: "triangle", gain: 0.048 }, // C5
  { frequency: 587.33, time: 0.9, duration: 0.4, type: "triangle", gain: 0.048 }, // D5
  { frequency: 523.25, time: 1.35, duration: 0.4, type: "triangle", gain: 0.046 }, // C5
  { frequency: 493.88, time: 1.8, duration: 0.4, type: "triangle", gain: 0.044 }, // B4
  { frequency: 440.0, time: 2.25, duration: 0.4, type: "triangle", gain: 0.046 }, // A4
  { frequency: 392.0, time: 2.7, duration: 0.85, type: "triangle", gain: 0.042 }, // G4 (Conduce con suavidad hacia A4)
];

// Fase 2: Combate medieval - Marcha sinfónica de guerra con percusión de marcha y trompas (145 BPM, 3.3s)
// Conducción de la sensible B3/B4 a 3.2s hacia la tónica C3/C4 al recomenzar
const FANTASY_COMBAT_LOOP = [
  // Tambores de guerra y pulso orquestal grave
  { frequency: 130.81, time: 0.0, duration: 0.2, type: "triangle", gain: 0.048 }, // C3
  { frequency: 98.0, time: 0.2, duration: 0.2, type: "sine", gain: 0.045 }, // G2
  { frequency: 130.81, time: 0.41, duration: 0.2, type: "triangle", gain: 0.048 }, // C3
  { frequency: 155.56, time: 0.82, duration: 0.2, type: "triangle", gain: 0.045 }, // Eb3
  { frequency: 174.61, time: 1.24, duration: 0.2, type: "triangle", gain: 0.045 }, // F3
  { frequency: 196.0, time: 1.65, duration: 0.2, type: "triangle", gain: 0.048 }, // G3
  { frequency: 116.54, time: 2.06, duration: 0.2, type: "sine", gain: 0.044 }, // Bb2
  { frequency: 130.81, time: 2.47, duration: 0.2, type: "triangle", gain: 0.046 }, // C3
  { frequency: 196.0, time: 2.88, duration: 0.2, type: "triangle", gain: 0.048 }, // G3
  { frequency: 246.94, time: 3.09, duration: 0.2, type: "triangle", gain: 0.05 }, // B3 (Sensible armónica)

  // Metales y cornos medievales
  { frequency: 261.63, time: 0.0, duration: 0.38, type: "sine", gain: 0.05 }, // C4
  { frequency: 523.25, time: 0.0, duration: 0.18, type: "triangle", gain: 0.042 }, // C5
  { frequency: 311.13, time: 0.41, duration: 0.2, type: "sine", gain: 0.048 }, // Eb4
  { frequency: 349.23, time: 0.62, duration: 0.2, type: "sine", gain: 0.048 }, // F4
  { frequency: 392.0, time: 0.82, duration: 0.38, type: "sine", gain: 0.052 }, // G4
  { frequency: 466.16, time: 1.24, duration: 0.38, type: "sine", gain: 0.052 }, // Bb4
  { frequency: 523.25, time: 1.65, duration: 0.38, type: "sine", gain: 0.056 }, // C5
  { frequency: 466.16, time: 2.06, duration: 0.2, type: "sine", gain: 0.05 }, // Bb4
  { frequency: 392.0, time: 2.26, duration: 0.2, type: "sine", gain: 0.048 }, // G4
  { frequency: 349.23, time: 2.47, duration: 0.2, type: "sine", gain: 0.048 }, // F4
  { frequency: 311.13, time: 2.68, duration: 0.2, type: "sine", gain: 0.046 }, // Eb4
  { frequency: 293.66, time: 2.88, duration: 0.2, type: "sine", gain: 0.046 }, // D4
  { frequency: 392.0, time: 3.09, duration: 0.2, type: "sine", gain: 0.05 }, // G4
  { frequency: 493.88, time: 3.2, duration: 0.1, type: "sine", gain: 0.052 }, // B4 (Turnaround hacia C4)
];

// Fase 3: Victoria medieval - Fanfarria real con campanas y trompetas de corte (133 BPM, C Mayor, 3.6s)
// Turnaround armónico en 3.37s que eleva y enlaza de nuevo con la fanfarria
const FANTASY_VICTORY_LOOP = [
  // Acompañamiento regio de arpa y cuerdas
  { frequency: 261.63, time: 0.0, duration: 0.4, type: "triangle", gain: 0.042 }, // C4
  { frequency: 392.0, time: 0.45, duration: 0.4, type: "triangle", gain: 0.04 }, // G4
  { frequency: 261.63, time: 0.9, duration: 0.4, type: "triangle", gain: 0.042 }, // C4
  { frequency: 349.23, time: 1.35, duration: 0.4, type: "triangle", gain: 0.042 }, // F4
  { frequency: 440.0, time: 1.8, duration: 0.4, type: "triangle", gain: 0.042 }, // A4
  { frequency: 392.0, time: 2.25, duration: 0.4, type: "triangle", gain: 0.044 }, // G4
  { frequency: 293.66, time: 2.7, duration: 0.4, type: "triangle", gain: 0.04 }, // D4
  { frequency: 392.0, time: 3.15, duration: 0.42, type: "triangle", gain: 0.044 }, // G4

  // Fanfarria de la corte
  { frequency: 523.25, time: 0.0, duration: 0.22, type: "sine", gain: 0.05 }, // C5
  { frequency: 659.25, time: 0.22, duration: 0.2, type: "sine", gain: 0.052 }, // E5
  { frequency: 783.99, time: 0.45, duration: 0.4, type: "sine", gain: 0.055 }, // G5
  { frequency: 1046.5, time: 0.9, duration: 0.4, type: "sine", gain: 0.058 }, // C6
  { frequency: 880.0, time: 1.35, duration: 0.2, type: "sine", gain: 0.05 }, // A5
  { frequency: 987.77, time: 1.57, duration: 0.2, type: "sine", gain: 0.052 }, // B5
  { frequency: 1046.5, time: 1.8, duration: 0.4, type: "sine", gain: 0.056 }, // C6
  { frequency: 783.99, time: 2.25, duration: 0.4, type: "sine", gain: 0.05 }, // G5
  { frequency: 659.25, time: 2.7, duration: 0.22, type: "sine", gain: 0.048 }, // E5
  { frequency: 783.99, time: 2.92, duration: 0.2, type: "sine", gain: 0.05 }, // G5
  { frequency: 987.77, time: 3.15, duration: 0.22, type: "sine", gain: 0.052 }, // B5
  { frequency: 1174.66, time: 3.37, duration: 0.2, type: "sine", gain: 0.052 }, // D6 (Turnaround hacia C)
];

// Derrota medieval: Réquiem noble con campana lejana (4.0s)
const FANTASY_DEFEAT_LOOP = [
  { frequency: 110.0, time: 0.0, duration: 0.75, type: "sine", gain: 0.038 }, // A2
  { frequency: 146.83, time: 0.8, duration: 0.75, type: "sine", gain: 0.035 }, // D3
  { frequency: 130.81, time: 1.6, duration: 0.75, type: "sine", gain: 0.032 }, // C3
  { frequency: 123.47, time: 2.4, duration: 0.75, type: "sine", gain: 0.032 }, // B2
  { frequency: 164.81, time: 3.2, duration: 0.78, type: "sine", gain: 0.035 }, // E3

  { frequency: 220.0, time: 0.0, duration: 0.75, type: "sine", gain: 0.04 }, // A3
  { frequency: 261.63, time: 0.8, duration: 0.75, type: "triangle", gain: 0.038 }, // C4
  { frequency: 246.94, time: 1.6, duration: 0.75, type: "sine", gain: 0.036 }, // B3
  { frequency: 220.0, time: 2.4, duration: 0.75, type: "triangle", gain: 0.035 }, // A3
  { frequency: 196.0, time: 3.2, duration: 0.38, type: "sine", gain: 0.034 }, // G3
  { frequency: 207.65, time: 3.58, duration: 0.4, type: "triangle", gain: 0.036 }, // G#3 (Sensible que conduce a A3)
  { frequency: 440.0, time: 0.0, duration: 0.75, type: "sine", gain: 0.03 }, // A4
];

const MUSIC_BEDS = {
  pixel: {
    select: { seconds: 3.6, notes: PIXEL_SELECT_LOOP },
    combat: { seconds: 3.2, notes: PIXEL_COMBAT_LOOP },
    victory: { seconds: 3.6, notes: PIXEL_VICTORY_LOOP },
    defeat: { seconds: 3.6, notes: PIXEL_DEFEAT_LOOP },
  },
  fantasy: {
    select: { seconds: 3.6, notes: FANTASY_SELECT_LOOP },
    combat: { seconds: 3.3, notes: FANTASY_COMBAT_LOOP },
    victory: { seconds: 3.6, notes: FANTASY_VICTORY_LOOP },
    defeat: { seconds: 4.0, notes: FANTASY_DEFEAT_LOOP },
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
    gain.gain.exponentialRampToValueAtTime(note.gain || 0.12, noteStart + 0.015);
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

  // Prevenir desincronizaciones si la pestaña estuvo en segundo plano
  if (nextBedAt < context.currentTime) {
    nextBedAt = context.currentTime + 0.02;
  }

  // Programación continua adelantada para garantizar bucles sin silencios ni cortes
  while (nextBedAt < context.currentTime + LOOKAHEAD_TIME) {
    scheduleNotes(bed.notes, bedNodes, nextBedAt);
    nextBedAt += bed.seconds;
  }

  bedTimer = window.setTimeout(queueMusicBed, SCHEDULER_INTERVAL);
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
