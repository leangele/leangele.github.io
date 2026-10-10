import React from "react";

export const SPACE_WARRIORS = [
  { id: "ranger", name: "Star Ranger", role: "Blaster & Jetpack" },
  { id: "guardian", name: "Cyber Guardian", role: "Plasma Blade & Shield" },
  { id: "psionic", name: "Psionic", role: "Cosmic Energy & Telekinesis" },
];

export const ALIENS = {
  1: {
    id: "cosmo-blob",
    baseId: "cosmo-blob",
    name: "Cosmo Blob",
    title: "Plasma Amorphous Specimen",
    color: "#06b6d4",
    accent: "#67e8f9",
    dark: "#0e7490",
  },
  2: {
    id: "mantis-stalker",
    baseId: "mantis-stalker",
    name: "Mantis Stalker",
    title: "Insectoid Predator",
    color: "#10b981",
    accent: "#a7f3d0",
    dark: "#064e3b",
  },
  3: {
    id: "cyber-droid",
    baseId: "cyber-droid",
    name: "Cyber Droid",
    title: "Autonomous Invader Unit",
    color: "#6366f1",
    accent: "#a5b4fc",
    dark: "#312e81",
  },
  4: {
    id: "void-behemoth",
    baseId: "void-behemoth",
    name: "Void Behemoth",
    title: "Four-Armed Cosmic Titan",
    color: "#d97706",
    accent: "#fde047",
    dark: "#78350f",
  },
  5: {
    id: "cosmic-overlord",
    baseId: "cosmic-overlord",
    name: "Cosmic Overlord",
    title: "Psionic Mind Emperor",
    color: "#8b5cf6",
    accent: "#f43f5e",
    dark: "#4c1d95",
  },
};

export const EVOLVED_ALIENS = {
  1: {
    id: "xenoblob-prime",
    baseId: "cosmo-blob",
    name: "Radioactive Xenoblob",
    title: "Mutated Nuclear Anomaly",
    color: "#84cc16",
    accent: "#facc15",
    dark: "#365314",
    evolved: true,
  },
  2: {
    id: "xenoscythe-alpha",
    baseId: "mantis-stalker",
    name: "Shadow Xenoscythe",
    title: "Apex Bio-Scythe Stalker",
    color: "#9333ea",
    accent: "#f43f5e",
    dark: "#3b0764",
    evolved: true,
  },
  3: {
    id: "annihilator-mech",
    baseId: "cyber-droid",
    name: "Annihilator Mech",
    title: "Heavy Dreadnought Platform",
    color: "#dc2626",
    accent: "#facc15",
    dark: "#450a0a",
    evolved: true,
  },
  4: {
    id: "nebula-colossus",
    baseId: "void-behemoth",
    name: "Nebula Colossus",
    title: "Star-Forged Stellar Brute",
    color: "#2563eb",
    accent: "#38bdf8",
    dark: "#0f172a",
    evolved: true,
  },
  5: {
    id: "galactic-emperor",
    baseId: "cosmic-overlord",
    name: "Galactic Emperor",
    title: "Dark Singularity Monarch",
    color: "#4c1d95",
    accent: "#fb7185",
    dark: "#1e1b4b",
    evolved: true,
  },
};

export const getAlien = (levelId, isAdvance = false) => {
  const table = isAdvance ? EVOLVED_ALIENS : ALIENS;
  const num = Number(levelId);
  return (
    table[num] || {
      id: "alien-scout",
      baseId: "alien-scout",
      name: `Alien Specimen ${num || 1}`,
      title: "Deep Space Entity",
      color: "#06b6d4",
      accent: "#67e8f9",
      dark: "#0e7490",
      evolved: isAdvance,
    }
  );
};

/* =========================================================================
   GUERREROS ESPACIALES (PIXEL ART & SCI-FI VECTOR)
   ========================================================================= */

export const SpaceHeroSvg = ({ id, pose = "ready", combat = null, graphicStyle = "pixel" }) => {
  const isPixel = graphicStyle === "pixel";
  const isHit = combat === "hit";
  const isSelected = pose === "selected";

  // 1. STAR RANGER (Soldado espacial con visor cian y rifle bláster)
  if (id === "ranger") {
    if (isPixel) {
      return (
        <svg className={`character-svg space-hero space-hero--ranger space-hero--${pose}`} viewBox="0 0 100 140" shapeRendering="crispEdges">
          {/* Sombra */}
          <ellipse cx="50" cy="134" rx="24" ry="5" fill="#020617" opacity="0.6" />
          {/* Mochila propulsora con llama iónica */}
          <rect x="22" y="52" width="10" height="24" fill="#334155" />
          <rect x="20" y="56" width="4" height="16" fill="#06b6d4" />
          <rect x="23" y="76" width="8" height="10" fill="#0284c7" />
          <rect x="25" y="86" width="4" height="8" fill="#38bdf8" />
          <rect x="26" y="94" width="2" height="6" fill="#ffffff" />

          {/* Piernas blindadas */}
          <rect x="36" y="96" width="10" height="22" fill="#1e293b" />
          <rect x="52" y="96" width="10" height="22" fill="#1e293b" />
          <rect x="34" y="118" width="12" height="14" fill="#0f172a" />
          <rect x="52" y="118" width="12" height="14" fill="#0f172a" />
          <rect x="32" y="128" width="16" height="5" fill="#38bdf8" />
          <rect x="52" y="128" width="16" height="5" fill="#38bdf8" />

          {/* Torso con armadura espacial blanca y azul */}
          <rect x="32" y="56" width="34" height="42" fill="#0f172a" />
          <rect x="34" y="58" width="30" height="38" fill="#f8fafc" />
          <rect x="40" y="64" width="18" height="16" fill="#0284c7" />
          <rect x="44" y="68" width="10" height="8" fill="#38bdf8" />
          <rect x="36" y="90" width="26" height="6" fill="#0f172a" />

          {/* Brazo izquierdo / hombrera */}
          <rect x="24" y="58" width="10" height="12" fill="#0284c7" />

          {/* Casco espacial con visor holográfico cian */}
          <rect x="34" y="22" width="30" height="34" fill="#0f172a" />
          <rect x="36" y="24" width="26" height="30" fill="#f8fafc" />
          <rect x="42" y="28" width="22" height="14" fill="#0f172a" />
          <rect x="44" y="30" width="20" height="10" fill="#06b6d4" />
          <rect x="48" y="32" width="14" height="4" fill="#a5f3fc" />
          {/* Antena del casco */}
          <rect x="32" y="16" width="4" height="16" fill="#0284c7" />
          <rect x="32" y="12" width="4" height="4" fill="#38bdf8" />

          {/* Brazo derecho y Rifle Bláster apuntando al frente */}
          <rect x="58" y="62" width="14" height="12" fill="#0284c7" />
          <rect x="68" y="66" width="18" height="8" fill="#1e293b" />
          <rect x="82" y="64" width="12" height="6" fill="#0f172a" />
          <rect x="80" y="70" width="6" height="12" fill="#334155" />
          {/* Cañón del láser y destello si está disparando */}
          <rect x="94" y="65" width="4" height="4" fill="#38bdf8" />
          {isHit && (
            <g>
              <rect x="98" y="63" width="8" height="8" fill="#38bdf8" />
              <rect x="100" y="65" width="4" height="4" fill="#ffffff" />
            </g>
          )}
        </svg>
      );
    }

    // Estilo Ilustrado / Vector
    return (
      <svg className={`character-svg space-hero space-hero--ranger space-hero--${pose}`} viewBox="0 0 100 140">
        <defs>
          <linearGradient id="ranger-suit" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f8fafc" />
            <stop offset="60%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          <linearGradient id="ranger-visor" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0891b2" />
            <stop offset="50%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>
        <ellipse cx="50" cy="134" rx="24" ry="5" fill="#020617" opacity="0.6" />
        {/* Propulsor */}
        <rect x="20" y="52" width="12" height="26" rx="4" fill="#334155" />
        <ellipse cx="26" cy="84" rx="4" ry="10" fill="#38bdf8" />
        <ellipse cx="26" cy="82" rx="2" ry="6" fill="#ffffff" />
        {/* Piernas */}
        <rect x="36" y="96" width="10" height="26" rx="4" fill="#1e293b" />
        <rect x="52" y="96" width="10" height="26" rx="4" fill="#1e293b" />
        <path d="M34 122h14v10H32z" fill="#0f172a" />
        <path d="M52 122h14v10H50z" fill="#0f172a" />
        {/* Cuerpo */}
        <path d="M32 56h34v40H32z" fill="url(#ranger-suit)" rx="6" />
        <circle cx="49" cy="74" r="7" fill="#0284c7" />
        <circle cx="49" cy="74" r="4" fill="#38bdf8" />
        {/* Casco */}
        <ellipse cx="49" cy="38" rx="16" ry="18" fill="url(#ranger-suit)" />
        <path d="M42 32h16c4 0 6 3 6 8s-2 8-6 8H42c-4 0-6-3-6-8s2-8 6-8z" fill="url(#ranger-visor)" />
        {/* Blaster */}
        <rect x="62" y="66" width="26" height="8" rx="2" fill="#1e293b" />
        <rect x="88" y="68" width="6" height="4" fill="#38bdf8" />
      </svg>
    );
  }

  // 2. CYBER GUARDIAN (Mecha blindado con espada de plasma magenta)
  if (id === "guardian") {
    if (isPixel) {
      return (
        <svg className={`character-svg space-hero space-hero--guardian space-hero--${pose}`} viewBox="0 0 100 140" shapeRendering="crispEdges">
          <ellipse cx="50" cy="134" rx="26" ry="5" fill="#020617" opacity="0.6" />
          {/* Piernas pesadas de mecha */}
          <rect x="32" y="94" width="14" height="24" fill="#1e1b4b" />
          <rect x="54" y="94" width="14" height="24" fill="#1e1b4b" />
          <rect x="28" y="118" width="18" height="14" fill="#4338ca" />
          <rect x="54" y="118" width="18" height="14" fill="#4338ca" />

          {/* Torso blindado con coraza de energía */}
          <rect x="28" y="54" width="44" height="44" fill="#1e1b4b" />
          <rect x="30" y="56" width="40" height="40" fill="#3730a3" />
          <rect x="36" y="62" width="28" height="18" fill="#4f46e5" />
          <rect x="42" y="68" width="16" height="6" fill="#f43f5e" />

          {/* Hombreras masivas */}
          <rect x="18" y="54" width="14" height="16" fill="#312e81" />
          <rect x="20" y="56" width="10" height="12" fill="#6366f1" />
          <rect x="68" y="54" width="14" height="16" fill="#312e81" />
          <rect x="70" y="56" width="10" height="12" fill="#6366f1" />

          {/* Casco mecha angular con visor magenta */}
          <rect x="34" y="20" width="32" height="34" fill="#1e1b4b" />
          <rect x="36" y="22" width="28" height="30" fill="#3730a3" />
          <rect x="40" y="32" width="24" height="6" fill="#f43f5e" />
          <rect x="44" y="33" width="16" height="4" fill="#fda4af" />
          <rect x="48" y="14" width="4" height="8" fill="#6366f1" />

          {/* Espada de plasma neón en mano derecha */}
          <rect x="74" y="70" width="12" height="12" fill="#312e81" />
          <rect x="80" y="78" width="6" height="8" fill="#1e1b4b" />
          <rect x="76" y="74" width="14" height="4" fill="#ca8a04" />
          {/* Filo de plasma magenta */}
          <rect x="81" y="24" width="4" height="50" fill="#f43f5e" />
          <rect x="82" y="26" width="2" height="46" fill="#ffffff" />
        </svg>
      );
    }

    return (
      <svg className={`character-svg space-hero space-hero--guardian space-hero--${pose}`} viewBox="0 0 100 140">
        <ellipse cx="50" cy="134" rx="26" ry="5" fill="#020617" opacity="0.6" />
        <rect x="32" y="96" width="14" height="26" rx="4" fill="#1e1b4b" />
        <rect x="54" y="96" width="14" height="26" rx="4" fill="#1e1b4b" />
        <path d="M28 54h44v42H28z" fill="#3730a3" rx="6" />
        <polygon points="40,64 60,64 50,78" fill="#f43f5e" />
        <ellipse cx="50" cy="36" rx="16" ry="18" fill="#312e81" />
        <path d="M38 34h24v6H38z" fill="#f43f5e" rx="3" />
        {/* Espada de plasma */}
        <rect x="82" y="24" width="5" height="54" rx="2.5" fill="#f43f5e" filter="drop-shadow(0 0 4px #fb7185)" />
        <rect x="83.5" y="26" width="2" height="50" fill="#ffffff" />
      </svg>
    );
  }

  // 3. PSIONIC (Especialista psiónico con orbes de energía cósmica)
  if (isPixel) {
    return (
      <svg className={`character-svg space-hero space-hero--psionic space-hero--${pose}`} viewBox="0 0 100 140" shapeRendering="crispEdges">
        <ellipse cx="50" cy="134" rx="24" ry="5" fill="#020617" opacity="0.6" />
        {/* Túnica cuántica flotante */}
        <rect x="32" y="86" width="36" height="42" fill="#581c87" />
        <rect x="28" y="112" width="44" height="18" fill="#3b0764" />
        <rect x="36" y="90" width="28" height="36" fill="#7e22ce" />
        <rect x="42" y="128" width="16" height="4" fill="#a855f7" />

        {/* Torso con peto de cristal cuántico */}
        <rect x="34" y="56" width="32" height="34" fill="#581c87" />
        <rect x="36" y="58" width="28" height="30" fill="#9333ea" />
        <rect x="44" y="64" width="12" height="14" fill="#c084fc" />
        <rect x="47" y="67" width="6" height="8" fill="#fde047" />

        {/* Cabeza con diadema de cristal psiónico */}
        <rect x="38" y="24" width="24" height="32" fill="#e2e8f0" />
        <rect x="36" y="22" width="28" height="12" fill="#1e1b4b" />
        <rect x="46" y="26" width="8" height="8" fill="#fde047" />
        <rect x="48" y="28" width="4" height="4" fill="#ffffff" />
        {/* Ojos brillantes violeta */}
        <rect x="40" y="36" width="6" height="4" fill="#9333ea" />
        <rect x="52" y="36" width="6" height="4" fill="#9333ea" />

        {/* Orbes de energía cósmica flotando en ambas manos */}
        <rect x="18" y="72" width="12" height="12" fill="#a855f7" />
        <rect x="20" y="74" width="8" height="8" fill="#c084fc" />
        <rect x="22" y="76" width="4" height="4" fill="#ffffff" />

        <rect x="70" y="72" width="12" height="12" fill="#a855f7" />
        <rect x="72" y="74" width="8" height="8" fill="#c084fc" />
        <rect x="74" y="76" width="4" height="4" fill="#ffffff" />

        {/* Aura psiónica flotante si está seleccionado */}
        {isSelected && (
          <g>
            <rect x="14" y="44" width="6" height="6" fill="#fde047" />
            <rect x="80" y="44" width="6" height="6" fill="#fde047" />
          </g>
        )}
      </svg>
    );
  }

  return (
    <svg className={`character-svg space-hero space-hero--psionic space-hero--${pose}`} viewBox="0 0 100 140">
      <ellipse cx="50" cy="134" rx="24" ry="5" fill="#020617" opacity="0.6" />
      <path d="M34 84l-8 44h48l-8-44z" fill="#581c87" />
      <rect x="34" y="56" width="32" height="32" rx="4" fill="#7e22ce" />
      <circle cx="50" cy="72" r="6" fill="#fde047" />
      <ellipse cx="50" cy="38" rx="14" ry="16" fill="#f8fafc" />
      <circle cx="50" cy="28" r="4" fill="#fde047" />
      {/* Orbes flotantes */}
      <circle cx="22" cy="76" r="8" fill="#c084fc" filter="drop-shadow(0 0 6px #e879f9)" />
      <circle cx="22" cy="76" r="3" fill="#ffffff" />
      <circle cx="78" cy="76" r="8" fill="#c084fc" filter="drop-shadow(0 0 6px #e879f9)" />
      <circle cx="78" cy="76" r="3" fill="#ffffff" />
    </svg>
  );
};

/* =========================================================================
   ALIENÍGENAS EXTRATERRESTRES (PIXEL ART RETRO Y VECTOR SCI-FI)
   ========================================================================= */

/* 1. COSMO BLOB (Nivel 1) */
const PixelCosmoBlob = ({ alien, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";
  const isEvolved = alien.evolved;

  return (
    <g className="pixel-alien pixel-cosmo-blob" shapeRendering="crispEdges">
      {/* Charco viscoso alienígena */}
      <rect x="20" y="130" width="70" height="8" fill={alien.dark} />
      <rect x="24" y="134" width="62" height="4" fill={alien.dark} />

      {/* Antenas alienígenas en la cabeza */}
      <rect x="38" y="16" width="4" height="20" fill={alien.dark} />
      <rect x="36" y="12" width="8" height="6" fill={isEvolved ? "#fde047" : "#38bdf8"} />
      <rect x="68" y="16" width="4" height="20" fill={alien.dark} />
      <rect x="66" y="12" width="8" height="6" fill={isEvolved ? "#fde047" : "#38bdf8"} />

      {/* Cuerpo gelatinoso fluido de plasma */}
      <rect x="32" y="36" width="46" height="14" fill={alien.color} />
      <rect x="26" y="48" width="58" height="18" fill={alien.color} />
      <rect x="22" y="66" width="66" height="24" fill={alien.color} />
      <rect x="18" y="90" width="74" height="32" fill={alien.color} />
      <rect x="22" y="122" width="66" height="10" fill={alien.dark} />

      {/* Núcleo de energía de plasma estelar */}
      <rect x="42" y="78" width="26" height="22" fill={alien.dark} />
      <rect x="46" y="82" width="18" height="14" fill={alien.accent} />
      <rect x="50" y="86" width="10" height="6" fill="#ffffff" />

      {/* Brillos y burbujas de xenoplasma */}
      <rect x="30" y="44" width="6" height="6" fill="#ffffff" opacity="0.8" />
      <rect x="28" y="52" width="4" height="4" fill="#ffffff" opacity="0.6" />
      <rect x="74" y="72" width="6" height="6" fill={alien.accent} />
      <rect x="24" y="98" width="4" height="10" fill={alien.accent} />

      {/* Ojos alienígenas */}
      <g className="svg-creature-eyes">
        {isDefeated ? (
          <>
            <rect x="36" y="56" width="4" height="4" fill={alien.dark} />
            <rect x="44" y="64" width="4" height="4" fill={alien.dark} />
            <rect x="44" y="56" width="4" height="4" fill={alien.dark} />
            <rect x="36" y="64" width="4" height="4" fill={alien.dark} />

            <rect x="60" y="56" width="4" height="4" fill={alien.dark} />
            <rect x="68" y="64" width="4" height="4" fill={alien.dark} />
            <rect x="68" y="56" width="4" height="4" fill={alien.dark} />
            <rect x="60" y="64" width="4" height="4" fill={alien.dark} />
          </>
        ) : isLaughing ? (
          <>
            <rect x="34" y="58" width="14" height="4" fill={alien.dark} />
            <rect x="38" y="60" width="6" height="2" fill="#ffffff" />
            <rect x="62" y="58" width="14" height="4" fill={alien.dark} />
            <rect x="66" y="60" width="6" height="2" fill="#ffffff" />
          </>
        ) : (
          <>
            <rect x="34" y="52" width="14" height="14" fill="#0f172a" />
            <rect x="36" y="54" width="10" height="10" fill={isEvolved ? "#fde047" : "#a5f3fc"} />
            <rect x="40" y="56" width="4" height="6" fill="#0f172a" />
            <rect x="38" y="55" width="2" height="2" fill="#ffffff" />

            <rect x="62" y="52" width="14" height="14" fill="#0f172a" />
            <rect x="64" y="54" width="10" height="10" fill={isEvolved ? "#fde047" : "#a5f3fc"} />
            <rect x="66" y="56" width="4" height="6" fill="#0f172a" />
            <rect x="65" y="55" width="2" height="2" fill="#ffffff" />
          </>
        )}
      </g>

      {/* Boca */}
      <g className="svg-creature-mouth">
        {isDefeated ? (
          <rect x="46" y="74" width="18" height="4" fill={alien.dark} />
        ) : isLaughing ? (
          <>
            <rect x="42" y="70" width="26" height="8" fill={alien.dark} />
            <rect x="44" y="72" width="22" height="4" fill="#f43f5e" />
          </>
        ) : (
          <rect x="44" y="72" width="22" height="4" fill={alien.dark} />
        )}
      </g>
    </g>
  );
};

/* 2. MANTIS STALKER (Nivel 2) */
const PixelMantisStalker = ({ alien, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";
  const isEvolved = alien.evolved;
  const bladeColor = isEvolved ? "#f43f5e" : "#6ee7b7";

  return (
    <g className="pixel-alien pixel-mantis-stalker" shapeRendering="crispEdges">
      {/* Guadañas de combate cibernéticas a los lados */}
      <g className="mantis-scythes">
        {/* Guadaña izquierda */}
        <rect x="6" y="36" width="10" height="34" fill={alien.dark} />
        <rect x="14" y="62" width="10" height="20" fill={alien.color} />
        <rect x="4" y="24" width="8" height="16" fill={bladeColor} />
        <rect x="8" y="16" width="6" height="10" fill="#ffffff" />

        {/* Guadaña derecha */}
        <rect x="94" y="36" width="10" height="34" fill={alien.dark} />
        <rect x="86" y="62" width="10" height="20" fill={alien.color} />
        <rect x="98" y="24" width="8" height="16" fill={bladeColor} />
        <rect x="96" y="16" width="6" height="10" fill="#ffffff" />
      </g>

      {/* Patas insectoides digitígradas */}
      <rect x="28" y="98" width="8" height="26" fill={alien.dark} />
      <rect x="22" y="122" width="16" height="10" fill={alien.dark} />
      <rect x="18" y="130" width="8" height="4" fill={bladeColor} />

      <rect x="74" y="98" width="8" height="26" fill={alien.dark} />
      <rect x="72" y="122" width="16" height="10" fill={alien.dark} />
      <rect x="84" y="130" width="8" height="4" fill={bladeColor} />

      {/* Torso insectoide segmentado */}
      <rect x="36" y="60" width="38" height="42" fill={alien.dark} />
      <rect x="38" y="62" width="34" height="38" fill={alien.color} />
      {/* Placas quitinosas */}
      <rect x="42" y="66" width="26" height="6" fill={alien.accent} />
      <rect x="44" y="76" width="22" height="6" fill={alien.accent} />
      <rect x="46" y="86" width="18" height="6" fill={alien.accent} />

      {/* Cabeza triangular de mantis */}
      <rect x="34" y="24" width="42" height="38" fill={alien.dark} />
      <rect x="36" y="26" width="38" height="34" fill={alien.color} />
      {/* Antenas finas */}
      <rect x="32" y="8" width="4" height="18" fill={alien.dark} />
      <rect x="74" y="8" width="4" height="18" fill={alien.dark} />

      {/* Ojos compuestos grandes de rubí/esmeralda */}
      <g className="svg-creature-eyes">
        {isDefeated ? (
          <>
            <rect x="34" y="32" width="12" height="4" fill="#0f172a" />
            <rect x="64" y="32" width="12" height="4" fill="#0f172a" />
          </>
        ) : isLaughing ? (
          <>
            <rect x="34" y="32" width="14" height="6" fill="#ef4444" />
            <rect x="62" y="32" width="14" height="6" fill="#ef4444" />
          </>
        ) : (
          <>
            <rect x="32" y="28" width="16" height="16" fill="#0f172a" />
            <rect x="34" y="30" width="12" height="12" fill={isEvolved ? "#f43f5e" : "#ef4444"} />
            <rect x="36" y="32" width="4" height="4" fill="#ffffff" />

            <rect x="62" y="28" width="16" height="16" fill="#0f172a" />
            <rect x="64" y="30" width="12" height="12" fill={isEvolved ? "#f43f5e" : "#ef4444"} />
            <rect x="66" y="32" width="4" height="4" fill="#ffffff" />
          </>
        )}
      </g>

      {/* Mandíbulas insectoides */}
      <g className="svg-creature-mouth">
        <rect x="46" y="48" width="18" height="10" fill={alien.dark} />
        <rect x="42" y="52" width="6" height="8" fill="#ffffff" />
        <rect x="62" y="52" width="6" height="8" fill="#ffffff" />
      </g>
    </g>
  );
};

/* 3. CYBER DROID (Nivel 3) */
const PixelCyberDroid = ({ alien, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";
  const isEvolved = alien.evolved;
  const eyeColor = isEvolved ? "#ef4444" : "#38bdf8";

  return (
    <g className="pixel-alien pixel-cyber-droid" shapeRendering="crispEdges">
      {/* Propulsor antigravedad con llama iónica */}
      <rect x="44" y="112" width="22" height="10" fill={alien.dark} />
      <rect x="48" y="122" width="14" height="8" fill="#0284c7" />
      <rect x="52" y="130" width="6" height="8" fill="#38bdf8" />
      <rect x="54" y="136" width="2" height="4" fill="#ffffff" />

      {/* Brazos mecánicos con pinzas robóticas */}
      <rect x="16" y="60" width="12" height="26" fill={alien.dark} />
      <rect x="12" y="84" width="10" height="14" fill="#94a3b8" />
      <rect x="8" y="96" width="6" height="10" fill={eyeColor} />
      <rect x="18" y="96" width="6" height="10" fill={eyeColor} />

      <rect x="82" y="60" width="12" height="26" fill={alien.dark} />
      <rect x="88" y="84" width="10" height="14" fill="#94a3b8" />
      <rect x="86" y="96" width="6" height="10" fill={eyeColor} />
      <rect x="96" y="96" width="6" height="10" fill={eyeColor} />

      {/* Chasis blindado mecha */}
      <rect x="28" y="52" width="54" height="58" fill={alien.dark} />
      <rect x="30" y="54" width="50" height="54" fill={alien.color} />
      {/* Reactor de fusión central */}
      <rect x="44" y="78" width="22" height="20" fill="#0f172a" />
      <rect x="48" y="82" width="14" height="12" fill={eyeColor} />
      <rect x="52" y="86" width="6" height="4" fill="#ffffff" />

      {/* Cabeza mecha con antena de radar */}
      <rect x="34" y="22" width="42" height="34" fill={alien.dark} />
      <rect x="36" y="24" width="38" height="30" fill={alien.color} />
      <rect x="52" y="12" width="6" height="12" fill={alien.dark} />
      <rect x="50" y="8" width="10" height="4" fill={eyeColor} />

      {/* Ojo visor de escáner cibernético */}
      <g className="svg-creature-eyes">
        {isDefeated ? (
          <rect x="42" y="34" width="26" height="4" fill="#0f172a" />
        ) : isLaughing ? (
          <rect x="40" y="34" width="30" height="8" fill={eyeColor} />
        ) : (
          <>
            <rect x="38" y="32" width="34" height="12" fill="#0f172a" />
            <rect x="44" y="34" width="22" height="8" fill={eyeColor} />
            <rect x="52" y="36" width="6" height="4" fill="#ffffff" />
          </>
        )}
      </g>

      {/* Rejilla de altavoz / sonido */}
      <g className="svg-creature-mouth">
        <rect x="44" y="48" width="22" height="4" fill="#0f172a" />
        <rect x="46" y="49" width="3" height="2" fill={alien.accent} />
        <rect x="53" y="49" width="3" height="2" fill={alien.accent} />
        <rect x="60" y="49" width="3" height="2" fill={alien.accent} />
      </g>
    </g>
  );
};

/* 4. VOID BEHEMOTH (Nivel 4) */
const PixelVoidBehemoth = ({ alien, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";
  const isEvolved = alien.evolved;

  return (
    <g className="pixel-alien pixel-void-behemoth" shapeRendering="crispEdges">
      {/* 4 Brazos colosales con puños alienígenas */}
      {/* Par superior */}
      <rect x="8" y="44" width="16" height="30" fill={alien.dark} />
      <rect x="4" y="68" width="14" height="16" fill={alien.color} />
      <rect x="86" y="44" width="16" height="30" fill={alien.dark} />
      <rect x="92" y="68" width="14" height="16" fill={alien.color} />

      {/* Par inferior */}
      <rect x="14" y="80" width="14" height="28" fill={alien.dark} />
      <rect x="10" y="104" width="14" height="16" fill={alien.color} />
      <rect x="82" y="80" width="14" height="28" fill={alien.dark} />
      <rect x="86" y="104" width="14" height="16" fill={alien.color} />

      {/* Piernas masivas de titán */}
      <rect x="30" y="106" width="16" height="22" fill={alien.dark} />
      <rect x="64" y="106" width="16" height="22" fill={alien.dark} />
      <rect x="26" y="126" width="22" height="10" fill={alien.color} />
      <rect x="62" y="126" width="22" height="10" fill={alien.color} />

      {/* Torso titánico con núcleo de energía solar */}
      <rect x="26" y="56" width="58" height="52" fill={alien.dark} />
      <rect x="28" y="58" width="54" height="48" fill={alien.color} />
      <rect x="42" y="68" width="26" height="24" fill={alien.dark} />
      <rect x="46" y="72" width="18" height="16" fill={alien.accent} />
      <rect x="50" y="76" width="10" height="8" fill="#ffffff" />

      {/* Cabeza blindada con cuernos cósmicos */}
      <rect x="20" y={isEvolved ? "10" : "16"} width="10" height={isEvolved ? "22" : "16"} fill={alien.accent} />
      <rect x="80" y={isEvolved ? "10" : "16"} width="10" height={isEvolved ? "22" : "16"} fill={alien.accent} />
      <rect x="32" y="24" width="46" height="38" fill={alien.dark} />
      <rect x="34" y="26" width="42" height="34" fill={alien.color} />

      {/* Ojos cuádruples alienígenas */}
      <g className="svg-creature-eyes">
        {isDefeated ? (
          <>
            <rect x="38" y="36" width="8" height="4" fill="#0f172a" />
            <rect x="64" y="36" width="8" height="4" fill="#0f172a" />
          </>
        ) : isLaughing ? (
          <>
            <rect x="38" y="36" width="10" height="4" fill="#ffffff" />
            <rect x="62" y="36" width="10" height="4" fill="#ffffff" />
          </>
        ) : (
          <>
            <rect x="38" y="32" width="8" height="6" fill="#fde047" />
            <rect x="40" y="33" width="4" height="4" fill="#0f172a" />
            <rect x="64" y="32" width="8" height="6" fill="#fde047" />
            <rect x="66" y="33" width="4" height="4" fill="#0f172a" />
            {/* Ojos secundarios */}
            <rect x="40" y="40" width="4" height="4" fill="#f97316" />
            <rect x="66" y="40" width="4" height="4" fill="#f97316" />
          </>
        )}
      </g>

      {/* Mandíbula pesada con colmillos */}
      <g className="svg-creature-mouth">
        <rect x="42" y="48" width="26" height="8" fill={alien.dark} />
        <rect x="46" y="46" width="4" height="6" fill="#ffffff" />
        <rect x="60" y="46" width="4" height="6" fill="#ffffff" />
      </g>
    </g>
  );
};

/* 5. COSMIC OVERLORD (Nivel 5) */
const PixelCosmicOverlord = ({ alien, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";
  const isEvolved = alien.evolved;

  return (
    <g className="pixel-alien pixel-cosmic-overlord" shapeRendering="crispEdges">
      {/* Túnica/manto de levitación astral que flota sobre el suelo */}
      <rect x="28" y="88" width="54" height="44" fill={alien.dark} />
      <rect x="32" y="92" width="46" height="38" fill={alien.color} />
      <rect x="40" y="126" width="30" height="8" fill={alien.accent} />
      {/* Energía antigravedad inferior */}
      <rect x="44" y="134" width="22" height="4" fill="#f43f5e" />
      <rect x="48" y="138" width="14" height="2" fill="#ffffff" />

      {/* Cristales telequinéticos flotantes a los costados */}
      <g className="floating-crystals">
        <rect x="12" y="48" width="8" height="18" fill={alien.accent} />
        <rect x="14" y="52" width="4" height="10" fill="#ffffff" />
        <rect x="90" y="48" width="8" height="18" fill={alien.accent} />
        <rect x="92" y="52" width="4" height="10" fill="#ffffff" />
      </g>

      {/* Torso con armadura psiónica */}
      <rect x="32" y="58" width="46" height="34" fill={alien.dark} />
      <rect x="34" y="60" width="42" height="30" fill={alien.color} />
      <rect x="46" y="66" width="18" height="16" fill={alien.accent} />
      <rect x="50" y="70" width="10" height="8" fill="#ffffff" />

      {/* Enorme cúpula craneal transparente con cerebro de energía psiónica */}
      <rect x="28" y="12" width="54" height="48" fill={alien.dark} />
      <rect x="30" y="14" width="50" height="44" fill={alien.color} />
      {/* Circunvoluciones del cerebro psiónico */}
      <rect x="36" y="18" width="38" height="20" fill={alien.accent} />
      <rect x="42" y="20" width="26" height="16" fill="#fda4af" />
      <rect x="48" y="24" width="14" height="8" fill="#ffffff" />

      {/* Corona del señor supremo si está evolucionado */}
      {isEvolved && (
        <g id="overlord-crown">
          <rect x="26" y="6" width="6" height="12" fill="#facc15" />
          <rect x="52" y="2" width="6" height="14" fill="#facc15" />
          <rect x="78" y="6" width="6" height="12" fill="#facc15" />
        </g>
      )}

      {/* Ojos psiónicos hipnóticos (incluyendo tercer ojo central) */}
      <g className="svg-creature-eyes">
        {isDefeated ? (
          <>
            <rect x="38" y="44" width="8" height="4" fill="#0f172a" />
            <rect x="64" y="44" width="8" height="4" fill="#0f172a" />
          </>
        ) : isLaughing ? (
          <>
            <rect x="36" y="44" width="12" height="4" fill="#ffffff" />
            <rect x="62" y="44" width="12" height="4" fill="#ffffff" />
            <rect x="50" y="38" width="10" height="4" fill="#ffffff" />
          </>
        ) : (
          <>
            <rect x="36" y="42" width="10" height="8" fill="#0f172a" />
            <rect x="38" y="44" width="6" height="4" fill="#f43f5e" />
            <rect x="40" y="45" width="2" height="2" fill="#ffffff" />

            <rect x="64" y="42" width="10" height="8" fill="#0f172a" />
            <rect x="66" y="44" width="6" height="4" fill="#f43f5e" />
            <rect x="68" y="45" width="2" height="2" fill="#ffffff" />

            {/* Tercer ojo psiónico en la frente */}
            <rect x="50" y="34" width="10" height="8" fill="#0f172a" />
            <rect x="52" y="36" width="6" height="4" fill="#fde047" />
            <rect x="54" y="37" width="2" height="2" fill="#ffffff" />
          </>
        )}
      </g>

      {/* Boca / respirador psiónico */}
      <g className="svg-creature-mouth">
        <rect x="46" y="52" width="18" height="4" fill={alien.dark} />
        <rect x="50" y="53" width="10" height="2" fill={alien.accent} />
      </g>
    </g>
  );
};

/* Componente principal para renderizar el Alienígena */
export const AlienSvg = ({
  levelId,
  mood = "idle",
  action = "idle",
  graphicStyle = "pixel",
  isAdvance = false,
}) => {
  const alien = getAlien(levelId, isAdvance);
  const isPixel = graphicStyle === "pixel";
  const baseKey = alien.baseId || alien.id;

  if (isPixel) {
    let body = null;
    switch (baseKey) {
      case "cosmo-blob":
        body = <PixelCosmoBlob alien={alien} mood={mood} />;
        break;
      case "mantis-stalker":
        body = <PixelMantisStalker alien={alien} mood={mood} />;
        break;
      case "cyber-droid":
        body = <PixelCyberDroid alien={alien} mood={mood} />;
        break;
      case "void-behemoth":
        body = <PixelVoidBehemoth alien={alien} mood={mood} />;
        break;
      case "cosmic-overlord":
      default:
        body = <PixelCosmicOverlord alien={alien} mood={mood} />;
        break;
    }

    return (
      <svg
        className={`character-svg alien-svg alien-svg--${alien.baseId || alien.id} alien-svg--${alien.id} alien-svg--${mood} alien-svg--${action} alien-svg--pixel`}
        viewBox="0 0 110 150"
        aria-hidden="true"
      >
        <ellipse className="svg-shadow" cx="55" cy="143" rx="28" ry="5" fill="#020617" opacity="0.6" />
        <g className="svg-character-body">{body}</g>
      </svg>
    );
  }

  // Estilo Vector / Sci-Fi Ilustrado
  return (
    <svg
      className={`character-svg alien-svg alien-svg--${alien.baseId || alien.id} alien-svg--${alien.id} alien-svg--${mood} alien-svg--${action} alien-svg--scifi`}
      viewBox="0 0 110 150"
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={`grad-alien-${alien.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={alien.accent} />
          <stop offset="60%" stopColor={alien.color} />
          <stop offset="100%" stopColor={alien.dark || "#020617"} />
        </linearGradient>
        <filter id="alien-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={alien.accent} floodOpacity="0.6" />
        </filter>
      </defs>
      <ellipse className="svg-shadow" cx="55" cy="143" rx="28" ry="5" fill="#020617" opacity="0.6" />

      <g className="svg-character-body">
        {/* Cuerpo extraterrestre vectorial */}
        <path
          d="M30 92c0-34 16-56 35-56s35 22 35 56c0 24-70 24-70 0z"
          fill={`url(#grad-alien-${alien.id})`}
          filter="url(#alien-glow)"
        />
        <circle cx="55" cy="74" r="14" fill={alien.accent} opacity="0.8" />
        <circle cx="55" cy="74" r="6" fill="#ffffff" />

        {/* Antenas cósmicas */}
        <path d="M42 38L32 16M68 38L78 16" stroke={alien.accent} strokeWidth="3" strokeLinecap="round" />
        <circle cx="32" cy="16" r="4" fill="#38bdf8" />
        <circle cx="78" cy="16" r="3" fill="#38bdf8" />

        {/* Ojos */}
        <g className="svg-creature-eyes">
          <ellipse cx="44" cy="54" rx="7" ry="8" fill="#0f172a" />
          <ellipse cx="66" cy="54" rx="7" ry="8" fill="#0f172a" />
          <circle cx="44" cy="54" r="4" fill={alien.accent} />
          <circle cx="66" cy="54" r="4" fill={alien.accent} />
          <circle cx="43" cy="52" r="1.5" fill="#ffffff" />
          <circle cx="65" cy="52" r="1.5" fill="#ffffff" />
        </g>

        {/* Boca */}
        <path
          className="svg-creature-mouth"
          d={mood === "laughing" || mood === "smile" ? "M44 68c6 8 16 8 22 0v4c-6 6-16 6-22 0z" : "M46 72h18"}
          fill={mood === "laughing" || mood === "smile" ? "#f43f5e" : "none"}
          stroke="#0f172a"
          strokeWidth="2.5"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
};
