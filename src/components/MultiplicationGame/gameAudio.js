let audioContext = null;
let activeNodes = [];
let bedNodes = [];
let bedTimer = null;
let bedName = null;
let nextBedAt = 0;
let currentStyle = "pixel";

const LOOKAHEAD_TIME = 1.0;
const SCHEDULER_INTERVAL = 60;

/* =========================================================================
   ESTILO 1: PIXEL ART RETRO (Chiptune 8-bit / 16-bit JRPG)
   Temas musicales extendidos, ricos y enérgicos (8 a 16 compases)
   ========================================================================= */

// Fase 1: Selección de héroe - Tema de aventura animado y extendido (125 BPM, 9.6s, Sol Mayor)
// Estructura: Frase A (Tema principal alegre) + Frase B (Desarrollo armónico enérgico) + Cadencia de enlace (D7 -> G)
const PIXEL_SELECT_LOOP = [
  // Línea de bajo chiptune caminante y rítmica (Triangle, 16 notas)
  { frequency: 196.0, time: 0.0, duration: 0.55, type: "triangle", gain: 0.045 }, // G3
  { frequency: 246.94, time: 0.6, duration: 0.55, type: "triangle", gain: 0.042 }, // B3
  { frequency: 293.66, time: 1.2, duration: 0.55, type: "triangle", gain: 0.042 }, // D4
  { frequency: 196.0, time: 1.8, duration: 0.55, type: "triangle", gain: 0.045 }, // G3
  { frequency: 261.63, time: 2.4, duration: 0.55, type: "triangle", gain: 0.044 }, // C4
  { frequency: 329.63, time: 3.0, duration: 0.55, type: "triangle", gain: 0.042 }, // E4
  { frequency: 220.0, time: 3.6, duration: 0.55, type: "triangle", gain: 0.042 }, // A3
  { frequency: 146.83, time: 4.2, duration: 0.55, type: "triangle", gain: 0.046 }, // D3
  { frequency: 196.0, time: 4.8, duration: 0.55, type: "triangle", gain: 0.045 }, // G3
  { frequency: 293.66, time: 5.4, duration: 0.55, type: "triangle", gain: 0.042 }, // D4
  { frequency: 261.63, time: 6.0, duration: 0.55, type: "triangle", gain: 0.044 }, // C4
  { frequency: 220.0, time: 6.6, duration: 0.55, type: "triangle", gain: 0.042 }, // A3
  { frequency: 246.94, time: 7.2, duration: 0.55, type: "triangle", gain: 0.042 }, // B3
  { frequency: 196.0, time: 7.8, duration: 0.55, type: "triangle", gain: 0.044 }, // G3
  { frequency: 146.83, time: 8.4, duration: 0.55, type: "triangle", gain: 0.046 }, // D3
  { frequency: 293.66, time: 9.0, duration: 0.56, type: "triangle", gain: 0.046 }, // D4 (Dominante que conecta con G3)

  // Melodía principal alegre y vivaz (Square, 22 notas)
  // Frase A: Presentación del motivo aventurero
  { frequency: 392.0, time: 0.0, duration: 0.28, type: "square", gain: 0.04 }, // G4
  { frequency: 493.88, time: 0.3, duration: 0.26, type: "square", gain: 0.042 }, // B4
  { frequency: 587.33, time: 0.6, duration: 0.52, type: "square", gain: 0.048 }, // D5
  { frequency: 659.25, time: 1.2, duration: 0.52, type: "square", gain: 0.048 }, // E5
  { frequency: 587.33, time: 1.8, duration: 0.52, type: "square", gain: 0.045 }, // D5
  { frequency: 493.88, time: 2.4, duration: 0.28, type: "square", gain: 0.042 }, // B4
  { frequency: 523.25, time: 2.7, duration: 0.28, type: "square", gain: 0.044 }, // C5
  { frequency: 587.33, time: 3.0, duration: 0.52, type: "square", gain: 0.046 }, // D5
  { frequency: 440.0, time: 3.6, duration: 0.52, type: "square", gain: 0.042 }, // A4
  { frequency: 392.0, time: 4.2, duration: 0.52, type: "square", gain: 0.044 }, // G4

  // Frase B: Ascenso melódico heroico
  { frequency: 493.88, time: 4.8, duration: 0.28, type: "square", gain: 0.042 }, // B4
  { frequency: 523.25, time: 5.1, duration: 0.28, type: "square", gain: 0.044 }, // C5
  { frequency: 587.33, time: 5.4, duration: 0.28, type: "square", gain: 0.046 }, // D5
  { frequency: 783.99, time: 5.7, duration: 0.48, type: "square", gain: 0.05 }, // G5
  { frequency: 659.25, time: 6.2, duration: 0.46, type: "square", gain: 0.048 }, // E5
  { frequency: 587.33, time: 6.7, duration: 0.46, type: "square", gain: 0.046 }, // D5
  { frequency: 523.25, time: 7.2, duration: 0.28, type: "square", gain: 0.044 }, // C5
  { frequency: 493.88, time: 7.5, duration: 0.28, type: "square", gain: 0.042 }, // B4
  { frequency: 440.0, time: 7.8, duration: 0.52, type: "square", gain: 0.044 }, // A4

  // Turnaround: Conducción brillante hacia la tónica
  { frequency: 493.88, time: 8.4, duration: 0.26, type: "square", gain: 0.044 }, // B4
  { frequency: 587.33, time: 8.7, duration: 0.26, type: "square", gain: 0.046 }, // D5
  { frequency: 739.99, time: 9.0, duration: 0.56, type: "square", gain: 0.048 }, // F#5 (Sensible que resuelve en Sol al reiniciar)
];

// Fase 2: Combate activo - Batalla veloz, épica y prolongada (150 BPM, 9.6s, Re Menor)
// 6 compases intensos con galope ininterrumpido de bajo y melodía con 3 fases de combate (54 notas)
const PIXEL_COMBAT_LOOP = [
  // Bajo galopante rápido y propulsor (Triangle/Square, 32 notas)
  { frequency: 146.83, time: 0.0, duration: 0.14, type: "square", gain: 0.038 }, // D3
  { frequency: 73.42, time: 0.15, duration: 0.14, type: "triangle", gain: 0.045 }, // D2
  { frequency: 146.83, time: 0.3, duration: 0.14, type: "square", gain: 0.038 }, // D3
  { frequency: 174.61, time: 0.45, duration: 0.14, type: "triangle", gain: 0.042 }, // F3
  { frequency: 146.83, time: 0.6, duration: 0.14, type: "square", gain: 0.038 }, // D3
  { frequency: 220.0, time: 0.75, duration: 0.14, type: "triangle", gain: 0.042 }, // A3
  { frequency: 116.54, time: 0.9, duration: 0.14, type: "square", gain: 0.042 }, // Bb2
  { frequency: 130.81, time: 1.05, duration: 0.14, type: "triangle", gain: 0.042 }, // C3
  { frequency: 146.83, time: 1.2, duration: 0.14, type: "square", gain: 0.038 }, // D3
  { frequency: 73.42, time: 1.35, duration: 0.14, type: "triangle", gain: 0.045 }, // D2
  { frequency: 174.61, time: 1.5, duration: 0.14, type: "square", gain: 0.04 }, // F3
  { frequency: 196.0, time: 1.65, duration: 0.14, type: "triangle", gain: 0.04 }, // G3
  { frequency: 220.0, time: 1.8, duration: 0.14, type: "square", gain: 0.044 }, // A3
  { frequency: 110.0, time: 1.95, duration: 0.14, type: "triangle", gain: 0.045 }, // A2
  { frequency: 138.59, time: 2.1, duration: 0.14, type: "square", gain: 0.046 }, // C#3
  { frequency: 220.0, time: 2.25, duration: 0.14, type: "triangle", gain: 0.044 }, // A3

  { frequency: 146.83, time: 2.4, duration: 0.14, type: "square", gain: 0.038 }, // D3
  { frequency: 73.42, time: 2.55, duration: 0.14, type: "triangle", gain: 0.045 }, // D2
  { frequency: 146.83, time: 2.7, duration: 0.14, type: "square", gain: 0.038 }, // D3
  { frequency: 220.0, time: 2.85, duration: 0.14, type: "triangle", gain: 0.042 }, // A3
  { frequency: 116.54, time: 3.0, duration: 0.14, type: "square", gain: 0.042 }, // Bb2
  { frequency: 130.81, time: 3.15, duration: 0.14, type: "triangle", gain: 0.042 }, // C3
  { frequency: 146.83, time: 3.3, duration: 0.14, type: "square", gain: 0.038 }, // D3
  { frequency: 174.61, time: 3.45, duration: 0.14, type: "triangle", gain: 0.042 }, // F3

  { frequency: 196.0, time: 4.8, duration: 0.28, type: "square", gain: 0.04 }, // G3
  { frequency: 220.0, time: 5.4, duration: 0.28, type: "triangle", gain: 0.042 }, // A3
  { frequency: 116.54, time: 6.0, duration: 0.28, type: "square", gain: 0.042 }, // Bb2
  { frequency: 130.81, time: 6.6, duration: 0.28, type: "triangle", gain: 0.044 }, // C3
  { frequency: 146.83, time: 7.2, duration: 0.28, type: "square", gain: 0.044 }, // D3
  { frequency: 174.61, time: 7.8, duration: 0.28, type: "triangle", gain: 0.045 }, // F3
  { frequency: 110.0, time: 8.4, duration: 0.28, type: "triangle", gain: 0.046 }, // A2
  { frequency: 138.59, time: 9.0, duration: 0.56, type: "square", gain: 0.048 }, // C#3 (Sensible que resuelve en D)

  // Melodía de batalla heroica y desarrollo cinemático (Triangle, 22 notas)
  // Tema A: Ataque inicial
  { frequency: 293.66, time: 0.0, duration: 0.35, type: "triangle", gain: 0.05 }, // D4
  { frequency: 349.23, time: 0.4, duration: 0.18, type: "triangle", gain: 0.048 }, // F4
  { frequency: 392.0, time: 0.6, duration: 0.18, type: "triangle", gain: 0.048 }, // G4
  { frequency: 440.0, time: 0.8, duration: 0.35, type: "triangle", gain: 0.052 }, // A4
  { frequency: 587.33, time: 1.2, duration: 0.35, type: "triangle", gain: 0.055 }, // D5
  { frequency: 523.25, time: 1.6, duration: 0.18, type: "triangle", gain: 0.05 }, // C5
  { frequency: 466.16, time: 1.8, duration: 0.18, type: "triangle", gain: 0.048 }, // Bb4
  { frequency: 440.0, time: 2.0, duration: 0.35, type: "triangle", gain: 0.05 }, // A4

  // Tema B: Respuesta y avance táctico
  { frequency: 349.23, time: 2.4, duration: 0.18, type: "triangle", gain: 0.046 }, // F4
  { frequency: 392.0, time: 2.6, duration: 0.18, type: "triangle", gain: 0.048 }, // G4
  { frequency: 440.0, time: 2.8, duration: 0.35, type: "triangle", gain: 0.05 }, // A4
  { frequency: 523.25, time: 3.2, duration: 0.35, type: "triangle", gain: 0.052 }, // C5
  { frequency: 587.33, time: 3.6, duration: 0.52, type: "triangle", gain: 0.055 }, // D5
  { frequency: 659.25, time: 4.2, duration: 0.45, type: "triangle", gain: 0.055 }, // E5
  { frequency: 698.46, time: 4.8, duration: 0.52, type: "triangle", gain: 0.056 }, // F5
  { frequency: 659.25, time: 5.4, duration: 0.35, type: "triangle", gain: 0.052 }, // E5
  { frequency: 587.33, time: 5.8, duration: 0.35, type: "triangle", gain: 0.052 }, // D5
  { frequency: 523.25, time: 6.2, duration: 0.52, type: "triangle", gain: 0.05 }, // C5

  // Tema C: Clímax y resolución rítmica
  { frequency: 466.16, time: 6.8, duration: 0.35, type: "triangle", gain: 0.05 }, // Bb4
  { frequency: 523.25, time: 7.2, duration: 0.35, type: "triangle", gain: 0.052 }, // C5
  { frequency: 587.33, time: 7.8, duration: 0.55, type: "triangle", gain: 0.055 }, // D5
  { frequency: 554.37, time: 8.6, duration: 0.96, type: "triangle", gain: 0.054 }, // C#5 (Sensible dramática que resuelve en D4)
];

// Fase 3: Victoria - Fanfarria triunfal festiva extendida (125 BPM, 9.6s, Do Mayor)
// Celebración jubilosa de 8 compases con trinos, arpegios y motivo triunfal (44 notas)
const PIXEL_VICTORY_LOOP = [
  // Base rítmica alegre y saltarina (Triangle, 18 notas)
  { frequency: 130.81, time: 0.0, duration: 0.5, type: "triangle", gain: 0.045 }, // C3
  { frequency: 196.0, time: 0.55, duration: 0.5, type: "triangle", gain: 0.042 }, // G3
  { frequency: 130.81, time: 1.1, duration: 0.5, type: "triangle", gain: 0.045 }, // C3
  { frequency: 174.61, time: 1.65, duration: 0.5, type: "triangle", gain: 0.044 }, // F3
  { frequency: 220.0, time: 2.2, duration: 0.5, type: "triangle", gain: 0.044 }, // A3
  { frequency: 196.0, time: 2.75, duration: 0.5, type: "triangle", gain: 0.046 }, // G3
  { frequency: 146.83, time: 3.3, duration: 0.5, type: "triangle", gain: 0.044 }, // D3
  { frequency: 196.0, time: 3.85, duration: 0.5, type: "triangle", gain: 0.046 }, // G3
  { frequency: 130.81, time: 4.4, duration: 0.5, type: "triangle", gain: 0.045 }, // C3
  { frequency: 164.81, time: 4.95, duration: 0.5, type: "triangle", gain: 0.044 }, // E3
  { frequency: 174.61, time: 5.5, duration: 0.5, type: "triangle", gain: 0.044 }, // F3
  { frequency: 220.0, time: 6.05, duration: 0.5, type: "triangle", gain: 0.045 }, // A3
  { frequency: 196.0, time: 6.6, duration: 0.5, type: "triangle", gain: 0.046 }, // G3
  { frequency: 130.81, time: 7.15, duration: 0.5, type: "triangle", gain: 0.045 }, // C3
  { frequency: 146.83, time: 7.7, duration: 0.5, type: "triangle", gain: 0.044 }, // D3
  { frequency: 164.81, time: 8.25, duration: 0.5, type: "triangle", gain: 0.044 }, // E3
  { frequency: 196.0, time: 8.8, duration: 0.38, type: "triangle", gain: 0.046 }, // G3
  { frequency: 246.94, time: 9.2, duration: 0.38, type: "triangle", gain: 0.046 }, // B3 (Enlace cadencial a C3)

  // Fanfarria melódica de triunfo (Square, 26 notas)
  // Tema A: Fanfarria de victoria
  { frequency: 523.25, time: 0.0, duration: 0.25, type: "square", gain: 0.046 }, // C5
  { frequency: 659.25, time: 0.28, duration: 0.25, type: "square", gain: 0.048 }, // E5
  { frequency: 783.99, time: 0.55, duration: 0.48, type: "square", gain: 0.052 }, // G5
  { frequency: 1046.5, time: 1.1, duration: 0.52, type: "square", gain: 0.056 }, // C6
  { frequency: 880.0, time: 1.65, duration: 0.5, type: "square", gain: 0.05 }, // A5
  { frequency: 783.99, time: 2.2, duration: 0.5, type: "square", gain: 0.05 }, // G5
  { frequency: 659.25, time: 2.75, duration: 0.5, type: "square", gain: 0.046 }, // E5
  { frequency: 587.33, time: 3.3, duration: 0.25, type: "square", gain: 0.044 }, // D5
  { frequency: 659.25, time: 3.58, duration: 0.25, type: "square", gain: 0.046 }, // E5
  { frequency: 783.99, time: 3.85, duration: 0.48, type: "square", gain: 0.048 }, // G5

  // Tema B: Canción de fiesta y júbilo
  { frequency: 880.0, time: 4.4, duration: 0.26, type: "square", gain: 0.05 }, // A5
  { frequency: 987.77, time: 4.68, duration: 0.26, type: "square", gain: 0.052 }, // B5
  { frequency: 1046.5, time: 4.95, duration: 0.5, type: "square", gain: 0.056 }, // C6
  { frequency: 1174.66, time: 5.5, duration: 0.38, type: "square", gain: 0.054 }, // D6
  { frequency: 1046.5, time: 5.9, duration: 0.38, type: "square", gain: 0.052 }, // C6
  { frequency: 880.0, time: 6.3, duration: 0.38, type: "square", gain: 0.05 }, // A5
  { frequency: 783.99, time: 6.7, duration: 0.5, type: "square", gain: 0.05 }, // G5
  { frequency: 659.25, time: 7.25, duration: 0.4, type: "square", gain: 0.046 }, // E5
  { frequency: 523.25, time: 7.7, duration: 0.4, type: "square", gain: 0.045 }, // C5
  { frequency: 587.33, time: 8.15, duration: 0.3, type: "square", gain: 0.046 }, // D5
  { frequency: 659.25, time: 8.48, duration: 0.3, type: "square", gain: 0.048 }, // E5
  { frequency: 783.99, time: 8.8, duration: 0.28, type: "square", gain: 0.05 }, // G5
  { frequency: 880.0, time: 9.1, duration: 0.24, type: "square", gain: 0.05 }, // A5
  { frequency: 987.77, time: 9.35, duration: 0.24, type: "square", gain: 0.052 }, // B5 (Sensible que resuelve en C)
  { frequency: 523.25, time: 4.4, duration: 0.24, type: "triangle", gain: 0.038 }, // Refuerzo armónico
  { frequency: 659.25, time: 4.95, duration: 0.24, type: "triangle", gain: 0.038 },
];

// Derrota / Reintento: Balada solemne y emotiva extendida (8.4s, 26 notas)
const PIXEL_DEFEAT_LOOP = [
  // Acompañamiento grave y reflexivo (12 notas)
  { frequency: 110.0, time: 0.0, duration: 0.68, type: "sine", gain: 0.038 }, // A2
  { frequency: 146.83, time: 0.7, duration: 0.68, type: "sine", gain: 0.035 }, // D3
  { frequency: 130.81, time: 1.4, duration: 0.68, type: "sine", gain: 0.032 }, // C3
  { frequency: 123.47, time: 2.1, duration: 0.68, type: "sine", gain: 0.032 }, // B2
  { frequency: 110.0, time: 2.8, duration: 0.68, type: "sine", gain: 0.035 }, // A2
  { frequency: 164.81, time: 3.5, duration: 0.68, type: "sine", gain: 0.035 }, // E3
  { frequency: 146.83, time: 4.2, duration: 0.68, type: "sine", gain: 0.035 }, // D3
  { frequency: 130.81, time: 4.9, duration: 0.68, type: "sine", gain: 0.032 }, // C3
  { frequency: 110.0, time: 5.6, duration: 0.68, type: "sine", gain: 0.035 }, // A2
  { frequency: 98.0, time: 6.3, duration: 0.68, type: "sine", gain: 0.034 }, // G2
  { frequency: 123.47, time: 7.0, duration: 0.68, type: "sine", gain: 0.035 }, // B2
  { frequency: 164.81, time: 7.7, duration: 0.68, type: "sine", gain: 0.036 }, // E3 (Dominante de A)

  // Melodía solemne pero esperanzadora (14 notas)
  { frequency: 220.0, time: 0.0, duration: 0.68, type: "triangle", gain: 0.04 }, // A3
  { frequency: 207.65, time: 0.7, duration: 0.68, type: "triangle", gain: 0.038 }, // G#3
  { frequency: 196.0, time: 1.4, duration: 0.68, type: "triangle", gain: 0.035 }, // G3
  { frequency: 174.61, time: 2.1, duration: 0.68, type: "triangle", gain: 0.034 }, // F3
  { frequency: 220.0, time: 2.8, duration: 0.68, type: "triangle", gain: 0.038 }, // A3
  { frequency: 261.63, time: 3.5, duration: 0.68, type: "triangle", gain: 0.038 }, // C4
  { frequency: 246.94, time: 4.2, duration: 0.68, type: "triangle", gain: 0.036 }, // B3
  { frequency: 220.0, time: 4.9, duration: 0.68, type: "triangle", gain: 0.035 }, // A3
  { frequency: 196.0, time: 5.6, duration: 0.68, type: "triangle", gain: 0.034 }, // G3
  { frequency: 174.61, time: 6.3, duration: 0.68, type: "triangle", gain: 0.034 }, // F3
  { frequency: 164.81, time: 7.0, duration: 0.68, type: "triangle", gain: 0.035 }, // E3
  { frequency: 207.65, time: 7.7, duration: 0.68, type: "triangle", gain: 0.036 }, // G#3 (Sensible que conduce a A3)
  { frequency: 440.0, time: 0.0, duration: 0.7, type: "sine", gain: 0.025 },
  { frequency: 440.0, time: 4.2, duration: 0.7, type: "sine", gain: 0.025 },
];

/* =========================================================================
   ESTILO 2: FANTASÍA MEDIEVAL ILUSTRADA (Acústico / Orquestal)
   Grandes baladas y marchas medievales extendidas
   ========================================================================= */

// Fase 1: Selección de héroe - Danza animada de taberna medieval extendida (Laúd, arpa y flautas, 125 BPM, 9.6s, 36 notas)
const FANTASY_SELECT_LOOP = [
  // Laúd y bajo acústico (16 notas)
  { frequency: 220.0, time: 0.0, duration: 0.55, type: "sine", gain: 0.04 }, // A3
  { frequency: 329.63, time: 0.6, duration: 0.55, type: "sine", gain: 0.038 }, // E4
  { frequency: 220.0, time: 1.2, duration: 0.55, type: "sine", gain: 0.04 }, // A3
  { frequency: 261.63, time: 1.8, duration: 0.55, type: "sine", gain: 0.038 }, // C4
  { frequency: 293.66, time: 2.4, duration: 0.55, type: "sine", gain: 0.04 }, // D4
  { frequency: 220.0, time: 3.0, duration: 0.55, type: "sine", gain: 0.038 }, // A3
  { frequency: 164.81, time: 3.6, duration: 0.55, type: "sine", gain: 0.042 }, // E3
  { frequency: 220.0, time: 4.2, duration: 0.55, type: "sine", gain: 0.04 }, // A3
  { frequency: 261.63, time: 4.8, duration: 0.55, type: "sine", gain: 0.04 }, // C4
  { frequency: 329.63, time: 5.4, duration: 0.55, type: "sine", gain: 0.038 }, // E4
  { frequency: 293.66, time: 6.0, duration: 0.55, type: "sine", gain: 0.04 }, // D4
  { frequency: 220.0, time: 6.6, duration: 0.55, type: "sine", gain: 0.038 }, // A3
  { frequency: 196.0, time: 7.2, duration: 0.55, type: "sine", gain: 0.04 }, // G3
  { frequency: 220.0, time: 7.8, duration: 0.55, type: "sine", gain: 0.04 }, // A3
  { frequency: 164.81, time: 8.4, duration: 0.55, type: "sine", gain: 0.042 }, // E3
  { frequency: 329.63, time: 9.0, duration: 0.56, type: "sine", gain: 0.042 }, // E4 (Dominante preparatoria)

  // Flauta dulce y arpa céltica en danza continua (20 notas)
  { frequency: 440.0, time: 0.0, duration: 0.28, type: "triangle", gain: 0.045 }, // A4
  { frequency: 493.88, time: 0.3, duration: 0.28, type: "triangle", gain: 0.042 }, // B4
  { frequency: 523.25, time: 0.6, duration: 0.52, type: "triangle", gain: 0.048 }, // C5
  { frequency: 587.33, time: 1.2, duration: 0.52, type: "triangle", gain: 0.048 }, // D5
  { frequency: 523.25, time: 1.8, duration: 0.52, type: "triangle", gain: 0.046 }, // C5
  { frequency: 493.88, time: 2.4, duration: 0.52, type: "triangle", gain: 0.044 }, // B4
  { frequency: 440.0, time: 3.0, duration: 0.52, type: "triangle", gain: 0.046 }, // A4
  { frequency: 392.0, time: 3.6, duration: 0.52, type: "triangle", gain: 0.042 }, // G4
  { frequency: 440.0, time: 4.2, duration: 0.52, type: "triangle", gain: 0.045 }, // A4
  { frequency: 523.25, time: 4.8, duration: 0.28, type: "triangle", gain: 0.046 }, // C5
  { frequency: 587.33, time: 5.1, duration: 0.28, type: "triangle", gain: 0.048 }, // D5
  { frequency: 659.25, time: 5.4, duration: 0.52, type: "triangle", gain: 0.05 }, // E5
  { frequency: 587.33, time: 6.0, duration: 0.35, type: "triangle", gain: 0.046 }, // D5
  { frequency: 523.25, time: 6.4, duration: 0.35, type: "triangle", gain: 0.046 }, // C5
  { frequency: 493.88, time: 6.8, duration: 0.35, type: "triangle", gain: 0.044 }, // B4
  { frequency: 440.0, time: 7.2, duration: 0.52, type: "triangle", gain: 0.046 }, // A4
  { frequency: 392.0, time: 7.8, duration: 0.52, type: "triangle", gain: 0.042 }, // G4
  { frequency: 440.0, time: 8.4, duration: 0.28, type: "triangle", gain: 0.045 }, // A4
  { frequency: 493.88, time: 8.7, duration: 0.28, type: "triangle", gain: 0.044 }, // B4
  { frequency: 659.25, time: 9.0, duration: 0.56, type: "triangle", gain: 0.046 }, // E5 (Conducción cadencial a A)
];

// Fase 2: Combate medieval - Marcha sinfónica de guerra extendida (145 BPM, 9.9s, Do Dórico/Menor, 50 notas)
const FANTASY_COMBAT_LOOP = [
  // Tambores de guerra y pulso orquestal grave continuo (24 notas)
  { frequency: 130.81, time: 0.0, duration: 0.22, type: "triangle", gain: 0.048 }, // C3
  { frequency: 98.0, time: 0.25, duration: 0.22, type: "sine", gain: 0.045 }, // G2
  { frequency: 130.81, time: 0.5, duration: 0.22, type: "triangle", gain: 0.048 }, // C3
  { frequency: 155.56, time: 0.9, duration: 0.22, type: "triangle", gain: 0.045 }, // Eb3
  { frequency: 174.61, time: 1.35, duration: 0.22, type: "triangle", gain: 0.045 }, // F3
  { frequency: 196.0, time: 1.8, duration: 0.22, type: "triangle", gain: 0.048 }, // G3
  { frequency: 116.54, time: 2.25, duration: 0.22, type: "sine", gain: 0.044 }, // Bb2
  { frequency: 130.81, time: 2.7, duration: 0.22, type: "triangle", gain: 0.046 }, // C3
  { frequency: 196.0, time: 3.15, duration: 0.22, type: "triangle", gain: 0.048 }, // G3
  { frequency: 246.94, time: 3.4, duration: 0.22, type: "triangle", gain: 0.05 }, // B3
  { frequency: 130.81, time: 3.65, duration: 0.22, type: "triangle", gain: 0.048 }, // C3
  { frequency: 98.0, time: 3.9, duration: 0.22, type: "sine", gain: 0.045 }, // G2
  { frequency: 130.81, time: 4.15, duration: 0.22, type: "triangle", gain: 0.048 }, // C3
  { frequency: 155.56, time: 4.5, duration: 0.22, type: "triangle", gain: 0.045 }, // Eb3
  { frequency: 174.61, time: 4.95, duration: 0.22, type: "triangle", gain: 0.045 }, // F3
  { frequency: 196.0, time: 5.4, duration: 0.22, type: "triangle", gain: 0.048 }, // G3
  { frequency: 220.0, time: 5.85, duration: 0.22, type: "triangle", gain: 0.046 }, // A3
  { frequency: 233.08, time: 6.3, duration: 0.22, type: "triangle", gain: 0.046 }, // Bb3
  { frequency: 261.63, time: 6.75, duration: 0.22, type: "triangle", gain: 0.048 }, // C4
  { frequency: 196.0, time: 7.2, duration: 0.22, type: "triangle", gain: 0.048 }, // G3
  { frequency: 174.61, time: 7.65, duration: 0.22, type: "triangle", gain: 0.046 }, // F3
  { frequency: 155.56, time: 8.1, duration: 0.22, type: "triangle", gain: 0.046 }, // Eb3
  { frequency: 196.0, time: 8.7, duration: 0.25, type: "triangle", gain: 0.048 }, // G3
  { frequency: 246.94, time: 9.3, duration: 0.55, type: "triangle", gain: 0.05 }, // B3 (Sensible armónica que conduce a C)

  // Metales, cornos y fanfarria bélica de corte (26 notas)
  // Tema A: Marcha marcial
  { frequency: 261.63, time: 0.0, duration: 0.42, type: "sine", gain: 0.05 }, // C4
  { frequency: 523.25, time: 0.0, duration: 0.22, type: "triangle", gain: 0.042 }, // C5
  { frequency: 311.13, time: 0.45, duration: 0.22, type: "sine", gain: 0.048 }, // Eb4
  { frequency: 349.23, time: 0.68, duration: 0.22, type: "sine", gain: 0.048 }, // F4
  { frequency: 392.0, time: 0.9, duration: 0.42, type: "sine", gain: 0.052 }, // G4
  { frequency: 466.16, time: 1.35, duration: 0.42, type: "sine", gain: 0.052 }, // Bb4
  { frequency: 523.25, time: 1.8, duration: 0.42, type: "sine", gain: 0.056 }, // C5
  { frequency: 466.16, time: 2.25, duration: 0.22, type: "sine", gain: 0.05 }, // Bb4
  { frequency: 392.0, time: 2.48, duration: 0.22, type: "sine", gain: 0.048 }, // G4
  { frequency: 349.23, time: 2.7, duration: 0.22, type: "sine", gain: 0.048 }, // F4
  { frequency: 311.13, time: 2.92, duration: 0.22, type: "sine", gain: 0.046 }, // Eb4
  { frequency: 293.66, time: 3.15, duration: 0.22, type: "sine", gain: 0.046 }, // D4

  // Tema B: Carga y avance heroico
  { frequency: 392.0, time: 3.6, duration: 0.42, type: "sine", gain: 0.052 }, // G4
  { frequency: 466.16, time: 4.05, duration: 0.42, type: "sine", gain: 0.054 }, // Bb4
  { frequency: 523.25, time: 4.5, duration: 0.42, type: "sine", gain: 0.056 }, // C5
  { frequency: 587.33, time: 4.95, duration: 0.42, type: "sine", gain: 0.058 }, // D5
  { frequency: 622.25, time: 5.4, duration: 0.45, type: "sine", gain: 0.058 }, // Eb5
  { frequency: 587.33, time: 5.9, duration: 0.35, type: "sine", gain: 0.054 }, // D5
  { frequency: 523.25, time: 6.3, duration: 0.45, type: "sine", gain: 0.054 }, // C5

  // Tema C: Clímax de trompas y resolución
  { frequency: 466.16, time: 6.9, duration: 0.35, type: "sine", gain: 0.052 }, // Bb4
  { frequency: 392.0, time: 7.3, duration: 0.35, type: "sine", gain: 0.05 }, // G4
  { frequency: 349.23, time: 7.7, duration: 0.35, type: "sine", gain: 0.048 }, // F4
  { frequency: 311.13, time: 8.1, duration: 0.35, type: "sine", gain: 0.046 }, // Eb4
  { frequency: 293.66, time: 8.5, duration: 0.35, type: "sine", gain: 0.046 }, // D4
  { frequency: 392.0, time: 8.9, duration: 0.35, type: "sine", gain: 0.05 }, // G4
  { frequency: 493.88, time: 9.3, duration: 0.55, type: "sine", gain: 0.054 }, // B4 (Sensible que resuelve en C5)
];

// Fase 3: Victoria medieval - Fanfarria real con campanas y trompetas extendida (125 BPM, 9.6s, Do Mayor, 42 notas)
const FANTASY_VICTORY_LOOP = [
  // Acompañamiento regio de arpa y laúd (18 notas)
  { frequency: 261.63, time: 0.0, duration: 0.5, type: "triangle", gain: 0.042 }, // C4
  { frequency: 392.0, time: 0.55, duration: 0.5, type: "triangle", gain: 0.04 }, // G4
  { frequency: 261.63, time: 1.1, duration: 0.5, type: "triangle", gain: 0.042 }, // C4
  { frequency: 349.23, time: 1.65, duration: 0.5, type: "triangle", gain: 0.042 }, // F4
  { frequency: 440.0, time: 2.2, duration: 0.5, type: "triangle", gain: 0.042 }, // A4
  { frequency: 392.0, time: 2.75, duration: 0.5, type: "triangle", gain: 0.044 }, // G4
  { frequency: 293.66, time: 3.3, duration: 0.5, type: "triangle", gain: 0.04 }, // D4
  { frequency: 392.0, time: 3.85, duration: 0.5, type: "triangle", gain: 0.044 }, // G4
  { frequency: 261.63, time: 4.4, duration: 0.5, type: "triangle", gain: 0.042 }, // C4
  { frequency: 329.63, time: 4.95, duration: 0.5, type: "triangle", gain: 0.04 }, // E4
  { frequency: 349.23, time: 5.5, duration: 0.5, type: "triangle", gain: 0.042 }, // F4
  { frequency: 440.0, time: 6.05, duration: 0.5, type: "triangle", gain: 0.042 }, // A4
  { frequency: 392.0, time: 6.6, duration: 0.5, type: "triangle", gain: 0.044 }, // G4
  { frequency: 261.63, time: 7.15, duration: 0.5, type: "triangle", gain: 0.042 }, // C4
  { frequency: 293.66, time: 7.7, duration: 0.5, type: "triangle", gain: 0.04 }, // D4
  { frequency: 329.63, time: 8.25, duration: 0.5, type: "triangle", gain: 0.042 }, // E4
  { frequency: 392.0, time: 8.8, duration: 0.38, type: "triangle", gain: 0.044 }, // G4
  { frequency: 493.88, time: 9.2, duration: 0.38, type: "triangle", gain: 0.044 }, // B4

  // Fanfarria de la corte y trompetas reales (24 notas)
  { frequency: 523.25, time: 0.0, duration: 0.26, type: "sine", gain: 0.05 }, // C5
  { frequency: 659.25, time: 0.28, duration: 0.26, type: "sine", gain: 0.052 }, // E5
  { frequency: 783.99, time: 0.55, duration: 0.48, type: "sine", gain: 0.055 }, // G5
  { frequency: 1046.5, time: 1.1, duration: 0.52, type: "sine", gain: 0.058 }, // C6
  { frequency: 880.0, time: 1.65, duration: 0.26, type: "sine", gain: 0.05 }, // A5
  { frequency: 987.77, time: 1.92, duration: 0.26, type: "sine", gain: 0.052 }, // B5
  { frequency: 1046.5, time: 2.2, duration: 0.5, type: "sine", gain: 0.056 }, // C6
  { frequency: 783.99, time: 2.75, duration: 0.5, type: "sine", gain: 0.05 }, // G5
  { frequency: 659.25, time: 3.3, duration: 0.26, type: "sine", gain: 0.048 }, // E5
  { frequency: 783.99, time: 3.58, duration: 0.26, type: "sine", gain: 0.05 }, // G5
  { frequency: 987.77, time: 3.85, duration: 0.5, type: "sine", gain: 0.052 }, // B5

  // Desarrollo alegre de victoria
  { frequency: 880.0, time: 4.4, duration: 0.26, type: "sine", gain: 0.05 }, // A5
  { frequency: 1046.5, time: 4.7, duration: 0.35, type: "sine", gain: 0.055 }, // C6
  { frequency: 1174.66, time: 5.1, duration: 0.38, type: "sine", gain: 0.055 }, // D6
  { frequency: 1318.51, time: 5.5, duration: 0.48, type: "sine", gain: 0.058 }, // E6
  { frequency: 1174.66, time: 6.0, duration: 0.35, type: "sine", gain: 0.054 }, // D6
  { frequency: 1046.5, time: 6.4, duration: 0.35, type: "sine", gain: 0.054 }, // C6
  { frequency: 880.0, time: 6.8, duration: 0.35, type: "sine", gain: 0.05 }, // A5
  { frequency: 783.99, time: 7.2, duration: 0.48, type: "sine", gain: 0.05 }, // G5
  { frequency: 659.25, time: 7.7, duration: 0.4, type: "sine", gain: 0.048 }, // E5
  { frequency: 587.33, time: 8.15, duration: 0.3, type: "sine", gain: 0.046 }, // D5
  { frequency: 659.25, time: 8.48, duration: 0.3, type: "sine", gain: 0.048 }, // E5
  { frequency: 783.99, time: 8.8, duration: 0.28, type: "sine", gain: 0.05 }, // G5
  { frequency: 987.77, time: 9.15, duration: 0.42, type: "sine", gain: 0.054 }, // B5 (Conducción cadencial a C6)
];

// Derrota medieval: Réquiem noble con campana lejana y flauta extendida (8.8s, 28 notas)
const FANTASY_DEFEAT_LOOP = [
  // Acompañamiento solemne (14 notas)
  { frequency: 110.0, time: 0.0, duration: 0.72, type: "sine", gain: 0.038 }, // A2
  { frequency: 146.83, time: 0.75, duration: 0.72, type: "sine", gain: 0.035 }, // D3
  { frequency: 130.81, time: 1.5, duration: 0.72, type: "sine", gain: 0.032 }, // C3
  { frequency: 123.47, time: 2.25, duration: 0.72, type: "sine", gain: 0.032 }, // B2
  { frequency: 110.0, time: 3.0, duration: 0.72, type: "sine", gain: 0.035 }, // A2
  { frequency: 164.81, time: 3.75, duration: 0.72, type: "sine", gain: 0.035 }, // E3
  { frequency: 146.83, time: 4.5, duration: 0.72, type: "sine", gain: 0.035 }, // D3
  { frequency: 130.81, time: 5.25, duration: 0.72, type: "sine", gain: 0.032 }, // C3
  { frequency: 110.0, time: 6.0, duration: 0.72, type: "sine", gain: 0.035 }, // A2
  { frequency: 98.0, time: 6.75, duration: 0.72, type: "sine", gain: 0.034 }, // G2
  { frequency: 123.47, time: 7.5, duration: 0.65, type: "sine", gain: 0.035 }, // B2
  { frequency: 164.81, time: 8.2, duration: 0.58, type: "sine", gain: 0.036 }, // E3
  { frequency: 440.0, time: 0.0, duration: 0.75, type: "sine", gain: 0.025 },
  { frequency: 440.0, time: 4.5, duration: 0.75, type: "sine", gain: 0.025 },

  // Flauta dulce y requiem (14 notas)
  { frequency: 220.0, time: 0.0, duration: 0.72, type: "sine", gain: 0.04 }, // A3
  { frequency: 261.63, time: 0.75, duration: 0.72, type: "triangle", gain: 0.038 }, // C4
  { frequency: 246.94, time: 1.5, duration: 0.72, type: "sine", gain: 0.036 }, // B3
  { frequency: 220.0, time: 2.25, duration: 0.72, type: "triangle", gain: 0.035 }, // A3
  { frequency: 261.63, time: 3.0, duration: 0.72, type: "triangle", gain: 0.038 }, // C4
  { frequency: 293.66, time: 3.75, duration: 0.72, type: "triangle", gain: 0.038 }, // D4
  { frequency: 261.63, time: 4.5, duration: 0.72, type: "triangle", gain: 0.036 }, // C4
  { frequency: 246.94, time: 5.25, duration: 0.72, type: "sine", gain: 0.036 }, // B3
  { frequency: 220.0, time: 6.0, duration: 0.72, type: "triangle", gain: 0.035 }, // A3
  { frequency: 196.0, time: 6.75, duration: 0.72, type: "sine", gain: 0.034 }, // G3
  { frequency: 174.61, time: 7.5, duration: 0.65, type: "triangle", gain: 0.034 }, // F3
  { frequency: 207.65, time: 8.2, duration: 0.58, type: "triangle", gain: 0.036 }, // G#3 (Sensible que conduce a A3)
  { frequency: 329.63, time: 0.0, duration: 0.72, type: "sine", gain: 0.03 },
  { frequency: 329.63, time: 4.5, duration: 0.72, type: "sine", gain: 0.03 },
];

const MUSIC_BEDS = {
  pixel: {
    select: { seconds: 9.6, notes: PIXEL_SELECT_LOOP },
    combat: { seconds: 9.6, notes: PIXEL_COMBAT_LOOP },
    victory: { seconds: 9.6, notes: PIXEL_VICTORY_LOOP },
    defeat: { seconds: 8.4, notes: PIXEL_DEFEAT_LOOP },
  },
  fantasy: {
    select: { seconds: 9.6, notes: FANTASY_SELECT_LOOP },
    combat: { seconds: 9.9, notes: FANTASY_COMBAT_LOOP },
    victory: { seconds: 9.6, notes: FANTASY_VICTORY_LOOP },
    defeat: { seconds: 8.8, notes: FANTASY_DEFEAT_LOOP },
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
