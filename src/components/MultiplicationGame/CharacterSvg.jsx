import React from "react";

export const HEROES = [
  { id: "hunter", name: "Hunter" },
  { id: "knight", name: "Knight" },
  { id: "mage", name: "Mage" },
];

export const CREATURES = {
  1: { id: "slime", name: "Forest Slime", color: "#10b981", accent: "#a7f3d0", dark: "#064e3b" },
  2: { id: "werewolf", name: "Werewolf", color: "#334155", accent: "#f1f5f9", dark: "#0f172a" },
  3: { id: "goblin", name: "Goblin", color: "#84cc16", accent: "#fef08a", dark: "#365314" },
  4: { id: "troll", name: "Stone Troll", color: "#1e293b", accent: "#38bdf8", dark: "#0f172a" },
  5: { id: "dragon", name: "Fire Dragon", color: "#7f1d1d", accent: "#fef08a", dark: "#450a0a" },
  6: { id: "cyclops", name: "Cyclops", color: "#c2410c", accent: "#fed7aa", dark: "#7c2d12" },
  7: { id: "griffin", name: "Griffin", color: "#e2e8f0", accent: "#fef08a", dark: "#94a3b8" },
  8: { id: "minotaur", name: "Minotaur", color: "#291609", accent: "#ffffff", dark: "#140a04" },
  9: { id: "kraken", name: "Kraken", color: "#4c1d95", accent: "#f43f5e", dark: "#2e1065" },
  10: { id: "phoenix", name: "Phoenix", color: "#be123c", accent: "#ffffff", dark: "#881337" },
};

export const getCreature = (levelId) =>
  CREATURES[Number(levelId)] || {
    id: "ancient-beast",
    name: `Ancient Beast ${levelId}`,
    color: "#6d28d9",
    accent: "#ddd6fe",
    dark: "#3b0764",
  };

const heroArt = {
  pixel: {
    hunter: "pixel-hunter.svg",
    knight: "pixel-knight.svg",
    mage: "pixel-mage.svg",
  },
  fantasy: {
    hunter: "hunter.svg",
    knight: "knight.svg",
    mage: "mage.svg",
  },
};

export const HeroSvg = ({ id, action = "idle", graphicStyle = "pixel" }) => {
  const styleArt = heroArt[graphicStyle] || heroArt.pixel;
  const fileName = styleArt[id] || styleArt.hunter;

  return (
    <img
      className={`character-svg hero-svg hero-svg--${id} hero-svg--${action} hero-svg--${graphicStyle}`}
      src={`${process.env.PUBLIC_URL || ""}/assets/${fileName}`}
      alt=""
      draggable="false"
    />
  );
};

/* =========================================================================
   ESTILO 1: FANTASÍA MEDIEVAL ILUSTRADA (Criaturas con volumen y sombras)
   ========================================================================= */

const FantasyGradients = ({ creature }) => (
  <defs>
    <linearGradient id={`grad-${creature.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stopColor={creature.accent} />
      <stop offset="60%" stopColor={creature.color} />
      <stop offset="100%" stopColor={creature.dark || "#1a1a24"} />
    </linearGradient>
    <radialGradient id={`glow-${creature.id}`} cx="45%" cy="40%" r="55%">
      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.45" />
      <stop offset="70%" stopColor={creature.color} />
      <stop offset="100%" stopColor={creature.dark || "#1a1a24"} />
    </radialGradient>
    <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
      <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
    </filter>
  </defs>
);

const FantasyEyes = ({ mood, single = false }) => {
  if (mood === "defeated") {
    return (
      <g className="svg-creature-eyes" stroke="#1c0a0a" strokeWidth="2.8" strokeLinecap="round">
        <path d={single ? "M50 52l10 10M60 52L50 62" : "M38 52l10 10M48 52L38 62"} />
        {!single && <path d="M62 52l10 10M72 52L62 62" />}
      </g>
    );
  }

  if (mood === "laughing" || mood === "smile") {
    return (
      <g className="svg-creature-eyes" fill="none" stroke="#1c0a0a" strokeWidth="2.8" strokeLinecap="round">
        <path d={single ? "M48 58c5-9 13-9 18 0" : "M36 58c4-8 12-8 16 0"} />
        {!single && <path d="M58 58c4-8 12-8 16 0" />}
      </g>
    );
  }

  return (
    <g className="svg-creature-eyes">
      {single ? (
        <>
          <ellipse cx="55" cy="56" rx="13" ry="14" fill="#fef08a" stroke="#ca8a04" strokeWidth="2" />
          <ellipse cx="55" cy="56" rx="5" ry="8" fill="#1c0a0a" />
          <circle cx="53" cy="53" r="2.5" fill="#ffffff" />
        </>
      ) : (
        <>
          <ellipse cx="43" cy="56" rx="7" ry="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <ellipse cx="67" cy="56" rx="7" ry="8" fill="#fef08a" stroke="#ca8a04" strokeWidth="1.5" />
          <circle cx="43" cy="57" r="3.2" fill="#1c0a0a" />
          <circle cx="67" cy="57" r="3.2" fill="#1c0a0a" />
          <circle cx="41.5" cy="54.5" r="1.5" fill="#ffffff" />
          <circle cx="65.5" cy="54.5" r="1.5" fill="#ffffff" />
        </>
      )}
    </g>
  );
};

const FantasyFeatures = ({ creature }) => {
  switch (creature.id) {
    case "slime":
      return (
        <g>
          <path
            d="M24 92c0-30 12-52 31-52s31 22 31 52c0 22-62 22-62 0z"
            fill={`url(#glow-${creature.id})`}
            filter="url(#soft-shadow)"
          />
          <circle cx="42" cy="74" r="5" fill="#ffffff" opacity="0.35" />
          <circle cx="66" cy="80" r="3.5" fill="#ffffff" opacity="0.4" />
          <ellipse cx="55" cy="46" rx="8" ry="4" fill="#ffffff" opacity="0.5" />
        </g>
      );
    case "werewolf":
      return (
        <g>
          {/* Orejas puntiagudas lupinas con pelaje interior plateado */}
          <polygon points="26,50 14,8 46,36" fill={creature.dark} />
          <polygon points="28,46 20,16 42,36" fill="#94a3b8" />
          <polygon points="84,50 96,8 64,36" fill={creature.dark} />
          <polygon points="82,46 90,16 68,36" fill="#94a3b8" />
          {/* Mechones puntiagudos de pelaje en las mejillas */}
          <polygon points="24,54 8,62 24,70 12,76 26,82" fill={creature.dark} />
          <polygon points="86,54 102,62 86,70 98,76 84,82" fill={creature.dark} />
          {/* Melena plateada en el pecho */}
          <path d="M42 86l13 22 13-22-6 16-7-4-7 4z" fill={creature.accent} />
          {/* Garras afiladas en las manos */}
          <path d="M22 132l-6 10M27 134l-3 10M32 133l-1 10" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
          <path d="M88 132l6 10M83 134l3 10M78 133l1 10" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" />
        </g>
      );
    case "goblin":
      return (
        <g>
          <polygon points="32,54 2,40 30,68" fill={`url(#grad-${creature.id})`} />
          <polygon points="78,54 108,40 80,68" fill={`url(#grad-${creature.id})`} />
          <polygon points="30,52 10,43 28,62" fill="#fbcfe8" opacity="0.8" />
          <polygon points="80,52 100,43 82,62" fill="#fbcfe8" opacity="0.8" />
        </g>
      );
    case "troll":
      return (
        <g>
          <path d="M26 44l10-22 9 16 10-21 10 21 9-16 10 22" fill={creature.dark} />
          <circle cx="38" cy="48" r="4" fill="#84cc16" opacity="0.8" />
          <circle cx="70" cy="52" r="5" fill="#84cc16" opacity="0.8" />
        </g>
      );
    case "dragon":
      return (
        <g>
          <path d="M34 46C20 30 18 10 32 8c2 14 8 26 18 30" fill={creature.dark} />
          <path d="M76 46C90 30 92 10 78 8c-2 14-8 26-18 30" fill={creature.dark} />
          <path d="M28 86L2 58l27 4M82 86l26-28-27 4" fill={`url(#grad-${creature.id})`} />
          <polygon points="50,22 55,10 60,22" fill={creature.accent} />
          <polygon points="51,32 55,22 59,32" fill={creature.accent} />
        </g>
      );
    case "cyclops":
      return (
        <g>
          <path d="M34 42l10-24 11 18 11-18 10 24" fill="#d97706" />
          <polygon points="50,14 55,4 60,14" fill="#fbbf24" />
        </g>
      );
    case "griffin":
      return (
        <g>
          <path d="M30 84L4 56l26 6M80 84l26-28-26 6" fill={`url(#grad-${creature.id})`} />
          <polygon points="34,42 22,20 44,36" fill={creature.dark} />
          <polygon points="76,42 88,20 66,36" fill={creature.dark} />
          <path d="M46 58l18-6-8 16z" fill="#f59e0b" stroke="#b45309" strokeWidth="1" />
        </g>
      );
    case "minotaur":
      return (
        <g>
          <path d="M36 48C10 42 6 16 18 14c4 16 12 22 24 20" fill="#f5f5f4" stroke="#78716c" strokeWidth="2" />
          <path d="M74 48C100 42 104 16 92 14c-4 16-12 22-24 20" fill="#f5f5f4" stroke="#78716c" strokeWidth="2" />
          <rect x="22" y="24" width="5" height="4" fill="#facc15" transform="rotate(-20 24 26)" />
          <rect x="83" y="24" width="5" height="4" fill="#facc15" transform="rotate(20 85 26)" />
        </g>
      );
    case "kraken":
      return (
        <g fill="none" stroke={`url(#grad-${creature.id})`} strokeWidth="11" strokeLinecap="round">
          <path d="M36 96c-28 8-30 36-15 44" />
          <path d="M48 98c-14 18-10 38 1 44" />
          <path d="M62 98c14 18 10 38-1 44" />
          <path d="M74 96c28 8 30 36 15 44" />
          <circle cx="24" cy="116" r="2.5" fill="#a7f3d0" stroke="none" />
          <circle cx="42" cy="124" r="2.5" fill="#a7f3d0" stroke="none" />
          <circle cx="68" cy="124" r="2.5" fill="#a7f3d0" stroke="none" />
          <circle cx="86" cy="116" r="2.5" fill="#a7f3d0" stroke="none" />
        </g>
      );
    case "phoenix":
      return (
        <g>
          <path d="M32 86L2 54l28 6M78 86l30-32-28 6" fill={`url(#grad-${creature.id})`} />
          <path d="M40 38l15-28 15 28-15-10z" fill="#fde047" />
          <path d="M46 36l9-18 9 18-9-6z" fill="#f97316" />
        </g>
      );
    default:
      return <path d="M34 44l10-22 11 17 11-17 10 22" fill={creature.accent} />;
  }
};

/* =========================================================================
   ESTILO 2: PIXEL ART RETRO (Criaturas con estética 16-bit)
   ========================================================================= */

const PixelEyes = ({ mood, single = false }) => {
  if (mood === "defeated") {
    return (
      <g className="svg-creature-eyes" fill="#0f172a">
        {single ? (
          <>
            <rect x="50" y="52" width="10" height="3" />
            <rect x="50" y="58" width="10" height="3" />
          </>
        ) : (
          <>
            <rect x="38" y="52" width="8" height="3" />
            <rect x="64" y="52" width="8" height="3" />
          </>
        )}
      </g>
    );
  }

  if (mood === "laughing" || mood === "smile") {
    return (
      <g className="svg-creature-eyes" fill="#0f172a">
        {single ? (
          <>
            <rect x="48" y="54" width="14" height="3" />
            <rect x="46" y="57" width="4" height="3" />
            <rect x="60" y="57" width="4" height="3" />
          </>
        ) : (
          <>
            <rect x="38" y="54" width="10" height="3" />
            <rect x="62" y="54" width="10" height="3" />
            <rect x="36" y="57" width="3" height="3" />
            <rect x="71" y="57" width="3" height="3" />
          </>
        )}
      </g>
    );
  }

  return (
    <g className="svg-creature-eyes">
      {single ? (
        <>
          <rect x="46" y="48" width="18" height="18" fill="#fef08a" />
          <rect x="50" y="50" width="10" height="14" fill="#ca8a04" />
          <rect x="52" y="52" width="6" height="10" fill="#0f172a" />
          <rect x="53" y="53" width="2" height="3" fill="#ffffff" />
        </>
      ) : (
        <>
          <rect x="38" y="50" width="10" height="12" fill="#fef08a" />
          <rect x="62" y="50" width="10" height="12" fill="#fef08a" />
          <rect x="42" y="52" width="5" height="8" fill="#0f172a" />
          <rect x="65" y="52" width="5" height="8" fill="#0f172a" />
          <rect x="43" y="53" width="2" height="2" fill="#ffffff" />
          <rect x="66" y="53" width="2" height="2" fill="#ffffff" />
        </>
      )}
    </g>
  );
};

const PixelFeatures = ({ creature }) => {
  switch (creature.id) {
    case "slime":
      return (
        <g shapeRendering="crispEdges">
          <rect x="48" y="32" width="14" height="6" fill={creature.accent} />
          <rect x="44" y="38" width="22" height="6" fill={creature.accent} />
          <rect x="36" y="44" width="38" height="8" fill={creature.color} />
          <rect x="30" y="52" width="50" height="36" fill={creature.color} />
          <rect x="26" y="88" width="58" height="14" fill={creature.dark} />
          <rect x="40" y="48" width="6" height="6" fill="#ffffff" opacity="0.6" />
        </g>
      );
    case "werewolf":
      return (
        <g shapeRendering="crispEdges">
          <rect x="22" y="24" width="8" height="22" fill={creature.dark} />
          <rect x="24" y="26" width="4" height="16" fill="#fbcfe8" />
          <rect x="80" y="24" width="8" height="22" fill={creature.dark} />
          <rect x="82" y="26" width="4" height="16" fill="#fbcfe8" />
        </g>
      );
    case "goblin":
      return (
        <g shapeRendering="crispEdges">
          <rect x="14" y="44" width="18" height="6" fill={creature.color} />
          <rect x="10" y="40" width="8" height="6" fill={creature.accent} />
          <rect x="78" y="44" width="18" height="6" fill={creature.color} />
          <rect x="92" y="40" width="8" height="6" fill={creature.accent} />
        </g>
      );
    case "troll":
      return (
        <g shapeRendering="crispEdges">
          <rect x="30" y="36" width="50" height="8" fill={creature.dark} />
          <rect x="42" y="30" width="12" height="6" fill={creature.accent} />
          <rect x="58" y="32" width="10" height="4" fill={creature.accent} />
        </g>
      );
    case "dragon":
      return (
        <g shapeRendering="crispEdges">
          <rect x="24" y="22" width="8" height="20" fill={creature.dark} />
          <rect x="20" y="16" width="6" height="8" fill={creature.accent} />
          <rect x="78" y="22" width="8" height="20" fill={creature.dark} />
          <rect x="84" y="16" width="6" height="8" fill={creature.accent} />
          <rect x="6" y="60" width="22" height="22" fill={creature.dark} />
          <rect x="82" y="60" width="22" height="22" fill={creature.dark} />
        </g>
      );
    case "cyclops":
      return (
        <g shapeRendering="crispEdges">
          <rect x="46" y="22" width="18" height="14" fill="#d97706" />
          <rect x="52" y="12" width="6" height="10" fill="#facc15" />
        </g>
      );
    case "griffin":
      return (
        <g shapeRendering="crispEdges">
          <rect x="12" y="58" width="18" height="24" fill={creature.accent} />
          <rect x="80" y="58" width="18" height="24" fill={creature.accent} />
          <rect x="48" y="58" width="14" height="8" fill="#f59e0b" />
        </g>
      );
    case "minotaur":
      return (
        <g shapeRendering="crispEdges">
          <rect x="16" y="24" width="16" height="10" fill="#e2e8f0" />
          <rect x="12" y="18" width="8" height="8" fill="#cbd5e1" />
          <rect x="78" y="24" width="16" height="10" fill="#e2e8f0" />
          <rect x="90" y="18" width="8" height="8" fill="#cbd5e1" />
        </g>
      );
    case "kraken":
      return (
        <g shapeRendering="crispEdges">
          <rect x="20" y="96" width="12" height="34" fill={creature.color} />
          <rect x="36" y="104" width="10" height="28" fill={creature.accent} />
          <rect x="64" y="104" width="10" height="28" fill={creature.accent} />
          <rect x="78" y="96" width="12" height="34" fill={creature.color} />
        </g>
      );
    case "phoenix":
      return (
        <g shapeRendering="crispEdges">
          <rect x="48" y="16" width="14" height="18" fill="#fde047" />
          <rect x="10" y="60" width="20" height="24" fill="#ea580c" />
          <rect x="80" y="60" width="20" height="24" fill="#ea580c" />
        </g>
      );
    default:
      return <rect x="40" y="30" width="30" height="10" fill={creature.accent} />;
  }
};

/* =========================================================================
   DISEÑO EXCLUSIVO PIXEL ART: HOMBRE LOBO (16-bit JRPG Werewolf)
   - Orejas lupinas puntiagudas con pelaje interior plateado
   - Cabeza con mechones salvajes en las mejillas
   - Ceño agresivo y ojos ámbar feroces con pupila vertical
   - Hocico pronunciado con trufa canina negra y orificios
   - Fauces amenazantes con colmillos afilados (superior e inferior)
   - Torso fornido con gran melena plateada en pecho
   - Brazos musculosos con afiladas garras de combate
   - Patas digitígradas y cola tupida
   ========================================================================= */

const PixelWerewolf = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-werewolf" shapeRendering="crispEdges">
      {/* 1. Cola tupida de lobo hacia la derecha */}
      <g className="pixel-wolf-tail">
        <rect x="76" y="102" width="10" height="10" fill="#0f172a" />
        <rect x="84" y="94" width="12" height="18" fill="#1e293b" />
        <rect x="88" y="90" width="10" height="18" fill="#334155" />
        <rect x="94" y="86" width="8" height="16" fill="#475569" />
        <rect x="96" y="80" width="8" height="10" fill="#cbd5e1" />
        <rect x="98" y="78" width="6" height="6" fill="#f1f5f9" />
      </g>

      {/* 2. Patas traseras digitígradas y garras inferiores */}
      <g className="pixel-wolf-legs">
        {/* Muslos musculosos */}
        <rect x="26" y="104" width="14" height="20" fill="#1e293b" />
        <rect x="28" y="106" width="10" height="14" fill="#334155" />
        <rect x="70" y="104" width="14" height="20" fill="#1e293b" />
        <rect x="72" y="106" width="10" height="14" fill="#334155" />

        {/* Jarretes y patas inferiores */}
        <rect x="28" y="122" width="12" height="14" fill="#0f172a" />
        <rect x="30" y="124" width="8" height="10" fill="#1e293b" />
        <rect x="70" y="122" width="12" height="14" fill="#0f172a" />
        <rect x="72" y="124" width="8" height="10" fill="#1e293b" />

        {/* Pezuñas / almohadillas */}
        <rect x="24" y="134" width="18" height="6" fill="#1e293b" />
        <rect x="68" y="134" width="18" height="6" fill="#1e293b" />

        {/* Garras afiladas de las patas */}
        <rect x="22" y="137" width="3" height="4" fill="#ffffff" />
        <rect x="28" y="138" width="3" height="3" fill="#ffffff" />
        <rect x="34" y="138" width="3" height="3" fill="#ffffff" />
        <rect x="39" y="137" width="3" height="4" fill="#ffffff" />

        <rect x="68" y="137" width="3" height="4" fill="#ffffff" />
        <rect x="73" y="138" width="3" height="3" fill="#ffffff" />
        <rect x="79" y="138" width="3" height="3" fill="#ffffff" />
        <rect x="85" y="137" width="3" height="4" fill="#ffffff" />
      </g>

      {/* 3. Torso de bestia con melena plateada en el pecho */}
      <g className="pixel-wolf-torso">
        <rect x="34" y="80" width="42" height="28" fill="#1e293b" />
        <rect x="36" y="82" width="38" height="24" fill="#334155" />
        <rect x="40" y="98" width="30" height="10" fill="#1e293b" />

        {/* Hombros anchos de bestia */}
        <rect x="24" y="68" width="62" height="18" fill="#1e293b" />
        <rect x="26" y="70" width="58" height="14" fill="#334155" />

        {/* Mechones de pelo en los hombros */}
        <rect x="18" y="72" width="8" height="6" fill="#1e293b" />
        <rect x="20" y="76" width="6" height="6" fill="#334155" />
        <rect x="84" y="72" width="8" height="6" fill="#1e293b" />
        <rect x="84" y="76" width="6" height="6" fill="#334155" />

        {/* Gran melena plateada en el pecho */}
        <rect x="42" y="66" width="26" height="6" fill="#cbd5e1" />
        <rect x="40" y="72" width="30" height="16" fill="#f1f5f9" />
        <rect x="44" y="74" width="22" height="12" fill="#ffffff" />
        {/* Puntas en zig-zag de la melena */}
        <rect x="44" y="88" width="6" height="8" fill="#cbd5e1" />
        <rect x="52" y="88" width="6" height="11" fill="#cbd5e1" />
        <rect x="60" y="88" width="6" height="8" fill="#cbd5e1" />
        <rect x="53" y="98" width="4" height="6" fill="#94a3b8" />
      </g>

      {/* 4. Brazos musculosos con garras afiladas */}
      <g className="pixel-wolf-arms">
        {/* Brazo izquierdo */}
        <rect x="16" y="76" width="12" height="18" fill="#1e293b" />
        <rect x="18" y="78" width="8" height="14" fill="#334155" />
        <rect x="12" y="92" width="14" height="20" fill="#0f172a" />
        <rect x="14" y="94" width="10" height="16" fill="#1e293b" />
        <rect x="16" y="96" width="6" height="10" fill="#475569" />
        <rect x="12" y="110" width="14" height="6" fill="#0f172a" />
        {/* Garras afiladas mano izquierda */}
        <rect x="10" y="116" width="3" height="8" fill="#ffffff" />
        <rect x="15" y="116" width="3" height="10" fill="#ffffff" />
        <rect x="20" y="116" width="3" height="8" fill="#ffffff" />
        <rect x="11" y="121" width="2" height="3" fill="#cbd5e1" />
        <rect x="16" y="123" width="2" height="3" fill="#cbd5e1" />
        <rect x="21" y="121" width="2" height="3" fill="#cbd5e1" />

        {/* Brazo derecho */}
        <rect x="82" y="76" width="12" height="18" fill="#1e293b" />
        <rect x="84" y="78" width="8" height="14" fill="#334155" />
        <rect x="84" y="92" width="14" height="20" fill="#0f172a" />
        <rect x="86" y="94" width="10" height="16" fill="#1e293b" />
        <rect x="88" y="96" width="6" height="10" fill="#475569" />
        <rect x="84" y="110" width="14" height="6" fill="#0f172a" />
        {/* Garras afiladas mano derecha */}
        <rect x="87" y="116" width="3" height="8" fill="#ffffff" />
        <rect x="92" y="116" width="3" height="10" fill="#ffffff" />
        <rect x="97" y="116" width="3" height="8" fill="#ffffff" />
        <rect x="88" y="121" width="2" height="3" fill="#cbd5e1" />
        <rect x="93" y="123" width="2" height="3" fill="#cbd5e1" />
        <rect x="98" y="121" width="2" height="3" fill="#cbd5e1" />
      </g>

      {/* 5. Orejas lupinas puntiagudas (NOT bunny/pink ears) */}
      <g className="pixel-wolf-ears">
        {/* Oreja Izquierda */}
        <rect x="26" y="10" width="6" height="6" fill="#0f172a" />
        <rect x="24" y="16" width="10" height="8" fill="#0f172a" />
        <rect x="22" y="24" width="14" height="16" fill="#0f172a" />
        <rect x="26" y="18" width="6" height="20" fill="#334155" />
        <rect x="28" y="22" width="4" height="12" fill="#1e293b" />
        <rect x="29" y="24" width="2" height="8" fill="#94a3b8" />

        {/* Oreja Derecha */}
        <rect x="78" y="10" width="6" height="6" fill="#0f172a" />
        <rect x="76" y="16" width="10" height="8" fill="#0f172a" />
        <rect x="74" y="24" width="14" height="16" fill="#0f172a" />
        <rect x="78" y="18" width="6" height="20" fill="#334155" />
        <rect x="78" y="22" width="4" height="12" fill="#1e293b" />
        <rect x="79" y="24" width="2" height="8" fill="#94a3b8" />
      </g>

      {/* 6. Cabeza y mechones de las mejillas */}
      <g className="pixel-wolf-head">
        <rect x="34" y="24" width="42" height="16" fill="#1e293b" />
        <rect x="36" y="26" width="38" height="14" fill="#334155" />
        {/* Cresta superior */}
        <rect x="50" y="18" width="10" height="8" fill="#475569" />
        <rect x="52" y="14" width="6" height="6" fill="#334155" />

        {/* Mechones puntiagudos de las mejillas */}
        <rect x="18" y="38" width="12" height="6" fill="#0f172a" />
        <rect x="14" y="42" width="12" height="6" fill="#1e293b" />
        <rect x="10" y="48" width="14" height="6" fill="#0f172a" />
        <rect x="14" y="54" width="12" height="6" fill="#1e293b" />
        <rect x="18" y="60" width="10" height="6" fill="#0f172a" />

        <rect x="80" y="38" width="12" height="6" fill="#0f172a" />
        <rect x="84" y="42" width="12" height="6" fill="#1e293b" />
        <rect x="86" y="48" width="14" height="6" fill="#0f172a" />
        <rect x="84" y="54" width="12" height="6" fill="#1e293b" />
        <rect x="82" y="60" width="10" height="6" fill="#0f172a" />

        {/* Centro de la cabeza */}
        <rect x="30" y="38" width="50" height="24" fill="#334155" />
      </g>

      {/* 7. Cejas amenazantes y Ojos feroces */}
      <g className="pixel-wolf-eyes">
        {/* Ceño agresivo */}
        <rect x="34" y="36" width="16" height="4" fill="#0f172a" />
        <rect x="46" y="38" width="6" height="4" fill="#0f172a" />
        <rect x="60" y="36" width="16" height="4" fill="#0f172a" />
        <rect x="58" y="38" width="6" height="4" fill="#0f172a" />

        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              {/* Ojo izquierdo X */}
              <rect x="36" y="42" width="3" height="3" fill="#0f172a" />
              <rect x="40" y="45" width="3" height="3" fill="#0f172a" />
              <rect x="44" y="48" width="3" height="3" fill="#0f172a" />
              <rect x="44" y="42" width="3" height="3" fill="#0f172a" />
              <rect x="36" y="48" width="3" height="3" fill="#0f172a" />

              {/* Ojo derecho X */}
              <rect x="63" y="42" width="3" height="3" fill="#0f172a" />
              <rect x="67" y="45" width="3" height="3" fill="#0f172a" />
              <rect x="71" y="48" width="3" height="3" fill="#0f172a" />
              <rect x="71" y="42" width="3" height="3" fill="#0f172a" />
              <rect x="63" y="48" width="3" height="3" fill="#0f172a" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="36" y="42" width="10" height="3" fill="#0f172a" />
              <rect x="35" y="44" width="3" height="3" fill="#0f172a" />
              <rect x="45" y="44" width="3" height="3" fill="#0f172a" />
              <rect x="38" y="45" width="8" height="2" fill="#fde047" />

              <rect x="64" y="42" width="10" height="3" fill="#0f172a" />
              <rect x="62" y="44" width="3" height="3" fill="#0f172a" />
              <rect x="72" y="44" width="3" height="3" fill="#0f172a" />
              <rect x="64" y="45" width="8" height="2" fill="#fde047" />
            </>
          ) : (
            <>
              {/* Ojo izquierdo ámbar con pupila hendida */}
              <rect x="36" y="40" width="11" height="9" fill="#ca8a04" />
              <rect x="37" y="41" width="9" height="7" fill="#fde047" />
              <rect x="41" y="41" width="3" height="7" fill="#0f172a" />
              <rect x="38" y="42" width="2" height="2" fill="#ffffff" />

              {/* Ojo derecho ámbar con pupila hendida */}
              <rect x="63" y="40" width="11" height="9" fill="#ca8a04" />
              <rect x="64" y="41" width="9" height="7" fill="#fde047" />
              <rect x="66" y="41" width="3" height="7" fill="#0f172a" />
              <rect x="65" y="42" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>
      </g>

      {/* 8. Hocico de lobo sobresaliente, nariz canina negra y fauces con colmillos */}
      <g className="pixel-wolf-snout">
        {/* Puente del hocico */}
        <rect x="48" y="42" width="14" height="8" fill="#1e293b" />
        <rect x="51" y="44" width="8" height="6" fill="#334155" />

        {/* Masa del hocico */}
        <rect x="40" y="50" width="30" height="12" fill="#1e293b" />
        <rect x="42" y="52" width="26" height="8" fill="#334155" />

        {/* Nariz canina negra */}
        <rect x="48" y="50" width="14" height="6" fill="#090d16" />
        <rect x="50" y="51" width="10" height="2" fill="#475569" />
        <rect x="50" y="53" width="3" height="2" fill="#000000" />
        <rect x="57" y="53" width="3" height="2" fill="#000000" />

        {/* Bigotera y almohadillas */}
        <rect x="42" y="58" width="26" height="4" fill="#1e293b" />
        <rect x="44" y="59" width="2" height="2" fill="#0f172a" />
        <rect x="48" y="59" width="2" height="2" fill="#0f172a" />
        <rect x="60" y="59" width="2" height="2" fill="#0f172a" />
        <rect x="64" y="59" width="2" height="2" fill="#0f172a" />

        {/* Fauces con colmillos afilados */}
        <g className="svg-creature-mouth">
          {isDefeated ? (
            <>
              <rect x="46" y="62" width="18" height="5" fill="#0f172a" />
              <rect x="48" y="63" width="3" height="3" fill="#ffffff" />
              <rect x="59" y="63" width="3" height="3" fill="#ffffff" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="40" y="62" width="30" height="12" fill="#0f172a" />
              <rect x="42" y="64" width="26" height="8" fill="#4c0519" />
              <rect x="49" y="68" width="12" height="4" fill="#e11d48" />

              {/* Colmillos superiores */}
              <rect x="42" y="62" width="4" height="7" fill="#ffffff" />
              <rect x="43" y="68" width="2" height="2" fill="#ffffff" />
              <rect x="64" y="62" width="4" height="7" fill="#ffffff" />
              <rect x="65" y="68" width="2" height="2" fill="#ffffff" />
              <rect x="48" y="62" width="14" height="2" fill="#f1f5f9" />

              {/* Colmillos inferiores */}
              <rect x="44" y="68" width="3" height="4" fill="#ffffff" />
              <rect x="63" y="68" width="3" height="4" fill="#ffffff" />
            </>
          ) : (
            <>
              <rect x="42" y="62" width="26" height="8" fill="#0f172a" />
              <rect x="44" y="63" width="22" height="6" fill="#500724" />
              <rect x="50" y="65" width="10" height="3" fill="#e11d48" />

              {/* Colmillos superiores prominentes */}
              <rect x="43" y="62" width="4" height="6" fill="#ffffff" />
              <rect x="44" y="67" width="2" height="2" fill="#ffffff" />
              <rect x="63" y="62" width="4" height="6" fill="#ffffff" />
              <rect x="64" y="67" width="2" height="2" fill="#ffffff" />
              <rect x="48" y="62" width="14" height="2" fill="#e2e8f0" />

              {/* Colmillos inferiores */}
              <rect x="46" y="65" width="3" height="4" fill="#ffffff" />
              <rect x="61" y="65" width="3" height="4" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Mandíbula inferior y barbilla */}
        <rect x="44" y="70" width="22" height="6" fill="#1e293b" />
        <rect x="46" y="72" width="18" height="4" fill="#334155" />
        <rect x="50" y="76" width="10" height="5" fill="#1e293b" />
        <rect x="52" y="80" width="6" height="4" fill="#0f172a" />
      </g>
    </g>
  );
};

export const CreatureSvg = ({
  levelId,
  mood = "idle",
  action = "idle",
  graphicStyle = "pixel",
}) => {
  const creature = getCreature(levelId);
  const isCyclops = creature.id === "cyclops";
  const isSlime = creature.id === "slime";
  const isKraken = creature.id === "kraken";
  const isWerewolf = creature.id === "werewolf";
  const isPixel = graphicStyle === "pixel";

  return (
    <svg
      className={`character-svg creature-svg creature-svg--${creature.id} creature-svg--${mood} creature-svg--${action} creature-svg--${graphicStyle}`}
      viewBox="0 0 110 150"
      aria-hidden="true"
    >
      {!isPixel && <FantasyGradients creature={creature} />}
      <ellipse className="svg-shadow" cx="55" cy="143" rx="28" ry="5" />
      
      <g className="svg-character-body">
        {isPixel ? (
          isWerewolf ? (
            <PixelWerewolf creature={creature} mood={mood} />
          ) : (
            <>
              <PixelFeatures creature={creature} />
              {!isSlime && !isKraken && (
                <g shapeRendering="crispEdges">
                  <rect x="34" y="80" width="42" height="46" fill={creature.color} />
                  <rect x="30" y="94" width="8" height="28" fill={creature.dark} />
                  <rect x="72" y="94" width="8" height="28" fill={creature.dark} />
                </g>
              )}
              {!isSlime && (
                <g shapeRendering="crispEdges">
                  <rect x="32" y="44" width="46" height="40" fill={creature.color} />
                  <rect x="40" y="70" width="30" height="14" fill={creature.accent} />
                </g>
              )}
              <PixelEyes mood={mood} single={isCyclops} />
              <path
                className="svg-creature-mouth"
                d={
                  mood === "laughing" || mood === "smile"
                    ? "M44 76h22v6h-22z"
                    : "M48 80h14v4h-14z"
                }
                fill="#0f172a"
              />
            </>
          )
        ) : (
          <>
            <FantasyFeatures creature={creature} />
            {!isSlime && !isKraken && (
              <path
                d="M34 86c0-14 42-14 42 0v42c0 14-42 14-42 0z"
                fill={`url(#grad-${creature.id})`}
                filter="url(#soft-shadow)"
              />
            )}
            {!isSlime && (
              <>
                <ellipse
                  cx="55"
                  cy="60"
                  rx="28"
                  ry="26"
                  fill={`url(#glow-${creature.id})`}
                  filter="url(#soft-shadow)"
                />
                <ellipse cx="55" cy="76" rx="16" ry="11" fill={creature.accent} opacity="0.85" />
              </>
            )}
            <FantasyEyes mood={mood} single={isCyclops} />
            <path
              className="svg-creature-mouth"
              d={
                mood === "laughing" || mood === "smile"
                  ? "M42 76c6 12 20 12 26 0v7c-8 6-18 6-26 0z"
                  : "M46 80h6l-3 7zm12 0h6l-3 7z"
              }
              fill="#1c0a0a"
            />
            {!isSlime && !isKraken && (
              <>
                <path
                  d="M33 100c-16 6-18 24-8 32"
                  fill="none"
                  stroke={creature.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
                <path
                  d="M77 100c16 6 18 24 8 32"
                  fill="none"
                  stroke={creature.color}
                  strokeWidth="10"
                  strokeLinecap="round"
                />
              </>
            )}
          </>
        )}
      </g>
    </svg>
  );
};
