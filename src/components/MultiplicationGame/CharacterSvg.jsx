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
   ESTILO 2: PIXEL ART RETRO (Criaturas 16-bit JRPG Dedicadas)
   Cada enemigo cuenta con una anatomía completa, paleta auténtica,
   expresiones según estado (idle, risa/victoria, derrotado) y etiquetas
   svg-creature-eyes y svg-creature-mouth para animaciones de combate.
   ========================================================================= */

/* 1. FOREST SLIME (Gota translúcida con núcleo mágico, burbujas y brote) */
const PixelSlime = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-slime" shapeRendering="crispEdges">
      {/* Charco y gotas de slime en la base */}
      <rect x="22" y="132" width="66" height="6" fill={creature.dark} />
      <rect x="18" y="134" width="74" height="4" fill={creature.dark} />
      <rect x="14" y="136" width="82" height="4" fill="#047857" />
      <rect x="12" y="138" width="86" height="3" fill="#065f46" />

      {/* Brote de hojas del bosque en la coronilla */}
      <rect x="54" y="24" width="3" height="10" fill="#4d7c0f" />
      <rect x="46" y="20" width="8" height="5" fill="#84cc16" />
      <rect x="44" y="23" width="6" height="4" fill="#65a30d" />
      <rect x="57" y="18" width="9" height="5" fill="#a3e635" />
      <rect x="60" y="22" width="7" height="4" fill="#65a30d" />

      {/* Cuerpo abovedado de gota de slime */}
      <rect x="52" y="32" width="6" height="6" fill={creature.color} />
      <rect x="50" y="34" width="10" height="6" fill={creature.accent} />
      <rect x="44" y="40" width="22" height="8" fill={creature.color} />
      <rect x="40" y="48" width="30" height="10" fill={creature.color} />
      <rect x="34" y="58" width="42" height="12" fill={creature.color} />
      <rect x="28" y="70" width="54" height="16" fill={creature.color} />
      <rect x="24" y="86" width="62" height="20" fill={creature.color} />
      <rect x="22" y="106" width="66" height="24" fill={creature.color} />
      <rect x="24" y="128" width="62" height="6" fill={creature.dark} />

      {/* Núcleo interno gelatinoso brillante */}
      <rect x="46" y="80" width="18" height="20" fill="#047857" />
      <rect x="48" y="82" width="14" height="16" fill="#059669" />
      <rect x="51" y="85" width="8" height="10" fill="#10b981" />
      <rect x="53" y="87" width="4" height="6" fill={creature.accent} />

      {/* Brillos y reflejos de burbuja translúcida */}
      <rect x="36" y="48" width="6" height="6" fill="#ffffff" opacity="0.85" />
      <rect x="34" y="54" width="4" height="4" fill="#ffffff" opacity="0.7" />
      <rect x="42" y="44" width="4" height="3" fill="#ffffff" opacity="0.6" />
      <rect x="30" y="80" width="4" height="14" fill={creature.accent} opacity="0.8" />
      <rect x="28" y="94" width="4" height="16" fill={creature.accent} opacity="0.6" />
      <rect x="74" y="112" width="10" height="4" fill={creature.accent} opacity="0.5" />

      {/* Ojos grandes y expresivos de slime */}
      <g className="svg-creature-eyes">
        {isDefeated ? (
          <>
            <rect x="38" y="68" width="3" height="3" fill="#064e3b" />
            <rect x="41" y="71" width="3" height="3" fill="#064e3b" />
            <rect x="44" y="74" width="3" height="3" fill="#064e3b" />
            <rect x="44" y="68" width="3" height="3" fill="#064e3b" />
            <rect x="38" y="74" width="3" height="3" fill="#064e3b" />

            <rect x="63" y="68" width="3" height="3" fill="#064e3b" />
            <rect x="66" y="71" width="3" height="3" fill="#064e3b" />
            <rect x="69" y="74" width="3" height="3" fill="#064e3b" />
            <rect x="69" y="68" width="3" height="3" fill="#064e3b" />
            <rect x="63" y="74" width="3" height="3" fill="#064e3b" />
          </>
        ) : isLaughing ? (
          <>
            <rect x="36" y="68" width="12" height="3" fill="#064e3b" />
            <rect x="34" y="71" width="4" height="3" fill="#064e3b" />
            <rect x="46" y="71" width="4" height="3" fill="#064e3b" />

            <rect x="62" y="68" width="12" height="3" fill="#064e3b" />
            <rect x="60" y="71" width="4" height="3" fill="#064e3b" />
            <rect x="72" y="71" width="4" height="3" fill="#064e3b" />
          </>
        ) : (
          <>
            {/* Ojo izquierdo */}
            <rect x="36" y="64" width="12" height="14" fill="#064e3b" />
            <rect x="38" y="66" width="8" height="10" fill="#047857" />
            <rect x="38" y="66" width="4" height="5" fill="#ffffff" />
            <rect x="43" y="72" width="2" height="2" fill="#ffffff" />

            {/* Ojo derecho */}
            <rect x="62" y="64" width="12" height="14" fill="#064e3b" />
            <rect x="64" y="66" width="8" height="10" fill="#047857" />
            <rect x="64" y="66" width="4" height="5" fill="#ffffff" />
            <rect x="69" y="72" width="2" height="2" fill="#ffffff" />
          </>
        )}
      </g>

      {/* Boca de slime */}
      <g className="svg-creature-mouth">
        {isDefeated ? (
          <rect x="48" y="88" width="14" height="3" fill="#064e3b" />
        ) : isLaughing ? (
          <>
            <rect x="44" y="82" width="22" height="8" fill="#064e3b" />
            <rect x="46" y="84" width="18" height="6" fill="#f43f5e" />
            <rect x="50" y="87" width="10" height="3" fill="#fda4af" />
          </>
        ) : (
          <>
            <rect x="46" y="84" width="18" height="4" fill="#064e3b" />
            <rect x="48" y="86" width="14" height="3" fill="#047857" />
          </>
        )}
      </g>
    </g>
  );
};

/* 2. WEREWOLF (Lobo bípedo con orejas puntiagudas, hocico, colmillos, melena y garras) */
const PixelWerewolf = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-werewolf" shapeRendering="crispEdges">
      {/* Cola tupida de lobo hacia la derecha */}
      <g className="pixel-wolf-tail">
        <rect x="76" y="102" width="10" height="10" fill="#0f172a" />
        <rect x="84" y="94" width="12" height="18" fill="#1e293b" />
        <rect x="88" y="90" width="10" height="18" fill="#334155" />
        <rect x="94" y="86" width="8" height="16" fill="#475569" />
        <rect x="96" y="80" width="8" height="10" fill="#cbd5e1" />
        <rect x="98" y="78" width="6" height="6" fill="#f1f5f9" />
      </g>

      {/* Patas traseras digitígradas y garras inferiores */}
      <g className="pixel-wolf-legs">
        <rect x="26" y="104" width="14" height="20" fill="#1e293b" />
        <rect x="28" y="106" width="10" height="14" fill="#334155" />
        <rect x="70" y="104" width="14" height="20" fill="#1e293b" />
        <rect x="72" y="106" width="10" height="14" fill="#334155" />

        <rect x="28" y="122" width="12" height="14" fill="#0f172a" />
        <rect x="30" y="124" width="8" height="10" fill="#1e293b" />
        <rect x="70" y="122" width="12" height="14" fill="#0f172a" />
        <rect x="72" y="124" width="8" height="10" fill="#1e293b" />

        <rect x="24" y="134" width="18" height="6" fill="#1e293b" />
        <rect x="68" y="134" width="18" height="6" fill="#1e293b" />

        <rect x="22" y="137" width="3" height="4" fill="#ffffff" />
        <rect x="28" y="138" width="3" height="3" fill="#ffffff" />
        <rect x="34" y="138" width="3" height="3" fill="#ffffff" />
        <rect x="39" y="137" width="3" height="4" fill="#ffffff" />

        <rect x="68" y="137" width="3" height="4" fill="#ffffff" />
        <rect x="73" y="138" width="3" height="3" fill="#ffffff" />
        <rect x="79" y="138" width="3" height="3" fill="#ffffff" />
        <rect x="85" y="137" width="3" height="4" fill="#ffffff" />
      </g>

      {/* Torso de bestia con melena plateada en el pecho */}
      <g className="pixel-wolf-torso">
        <rect x="34" y="80" width="42" height="28" fill="#1e293b" />
        <rect x="36" y="82" width="38" height="24" fill="#334155" />
        <rect x="40" y="98" width="30" height="10" fill="#1e293b" />

        <rect x="24" y="68" width="62" height="18" fill="#1e293b" />
        <rect x="26" y="70" width="58" height="14" fill="#334155" />

        <rect x="18" y="72" width="8" height="6" fill="#1e293b" />
        <rect x="20" y="76" width="6" height="6" fill="#334155" />
        <rect x="84" y="72" width="8" height="6" fill="#1e293b" />
        <rect x="84" y="76" width="6" height="6" fill="#334155" />

        <rect x="42" y="66" width="26" height="6" fill="#cbd5e1" />
        <rect x="40" y="72" width="30" height="16" fill="#f1f5f9" />
        <rect x="44" y="74" width="22" height="12" fill="#ffffff" />
        <rect x="44" y="88" width="6" height="8" fill="#cbd5e1" />
        <rect x="52" y="88" width="6" height="11" fill="#cbd5e1" />
        <rect x="60" y="88" width="6" height="8" fill="#cbd5e1" />
        <rect x="53" y="98" width="4" height="6" fill="#94a3b8" />
      </g>

      {/* Brazos musculosos con garras afiladas */}
      <g className="pixel-wolf-arms">
        <rect x="16" y="76" width="12" height="18" fill="#1e293b" />
        <rect x="18" y="78" width="8" height="14" fill="#334155" />
        <rect x="12" y="92" width="14" height="20" fill="#0f172a" />
        <rect x="14" y="94" width="10" height="16" fill="#1e293b" />
        <rect x="16" y="96" width="6" height="10" fill="#475569" />
        <rect x="12" y="110" width="14" height="6" fill="#0f172a" />
        <rect x="10" y="116" width="3" height="8" fill="#ffffff" />
        <rect x="15" y="116" width="3" height="10" fill="#ffffff" />
        <rect x="20" y="116" width="3" height="8" fill="#ffffff" />
        <rect x="11" y="121" width="2" height="3" fill="#cbd5e1" />
        <rect x="16" y="123" width="2" height="3" fill="#cbd5e1" />
        <rect x="21" y="121" width="2" height="3" fill="#cbd5e1" />

        <rect x="82" y="76" width="12" height="18" fill="#1e293b" />
        <rect x="84" y="78" width="8" height="14" fill="#334155" />
        <rect x="84" y="92" width="14" height="20" fill="#0f172a" />
        <rect x="86" y="94" width="10" height="16" fill="#1e293b" />
        <rect x="88" y="96" width="6" height="10" fill="#475569" />
        <rect x="84" y="110" width="14" height="6" fill="#0f172a" />
        <rect x="87" y="116" width="3" height="8" fill="#ffffff" />
        <rect x="92" y="116" width="3" height="10" fill="#ffffff" />
        <rect x="97" y="116" width="3" height="8" fill="#ffffff" />
        <rect x="88" y="121" width="2" height="3" fill="#cbd5e1" />
        <rect x="93" y="123" width="2" height="3" fill="#cbd5e1" />
        <rect x="98" y="121" width="2" height="3" fill="#cbd5e1" />
      </g>

      {/* Orejas lupinas puntiagudas con pelaje plateado */}
      <g className="pixel-wolf-ears">
        <rect x="26" y="10" width="6" height="6" fill="#0f172a" />
        <rect x="24" y="16" width="10" height="8" fill="#0f172a" />
        <rect x="22" y="24" width="14" height="16" fill="#0f172a" />
        <rect x="26" y="18" width="6" height="20" fill="#334155" />
        <rect x="28" y="22" width="4" height="12" fill="#1e293b" />
        <rect x="29" y="24" width="2" height="8" fill="#94a3b8" />

        <rect x="78" y="10" width="6" height="6" fill="#0f172a" />
        <rect x="76" y="16" width="10" height="8" fill="#0f172a" />
        <rect x="74" y="24" width="14" height="16" fill="#0f172a" />
        <rect x="78" y="18" width="6" height="20" fill="#334155" />
        <rect x="78" y="22" width="4" height="12" fill="#1e293b" />
        <rect x="79" y="24" width="2" height="8" fill="#94a3b8" />
      </g>

      {/* Cabeza y mechones de las mejillas */}
      <g className="pixel-wolf-head">
        <rect x="34" y="24" width="42" height="16" fill="#1e293b" />
        <rect x="36" y="26" width="38" height="14" fill="#334155" />
        <rect x="50" y="18" width="10" height="8" fill="#475569" />
        <rect x="52" y="14" width="6" height="6" fill="#334155" />

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

        <rect x="30" y="38" width="50" height="24" fill="#334155" />
      </g>

      {/* Cejas amenazantes y Ojos feroces */}
      <g className="pixel-wolf-eyes">
        <rect x="34" y="36" width="16" height="4" fill="#0f172a" />
        <rect x="46" y="38" width="6" height="4" fill="#0f172a" />
        <rect x="60" y="36" width="16" height="4" fill="#0f172a" />
        <rect x="58" y="38" width="6" height="4" fill="#0f172a" />

        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="36" y="42" width="3" height="3" fill="#0f172a" />
              <rect x="40" y="45" width="3" height="3" fill="#0f172a" />
              <rect x="44" y="48" width="3" height="3" fill="#0f172a" />
              <rect x="44" y="42" width="3" height="3" fill="#0f172a" />
              <rect x="36" y="48" width="3" height="3" fill="#0f172a" />

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
              <rect x="36" y="40" width="11" height="9" fill="#ca8a04" />
              <rect x="37" y="41" width="9" height="7" fill="#fde047" />
              <rect x="41" y="41" width="3" height="7" fill="#0f172a" />
              <rect x="38" y="42" width="2" height="2" fill="#ffffff" />

              <rect x="63" y="40" width="11" height="9" fill="#ca8a04" />
              <rect x="64" y="41" width="9" height="7" fill="#fde047" />
              <rect x="66" y="41" width="3" height="7" fill="#0f172a" />
              <rect x="65" y="42" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>
      </g>

      {/* Hocico de lobo, nariz canina y fauces con colmillos */}
      <g className="pixel-wolf-snout">
        <rect x="48" y="42" width="14" height="8" fill="#1e293b" />
        <rect x="51" y="44" width="8" height="6" fill="#334155" />

        <rect x="40" y="50" width="30" height="12" fill="#1e293b" />
        <rect x="42" y="52" width="26" height="8" fill="#334155" />

        <rect x="48" y="50" width="14" height="6" fill="#090d16" />
        <rect x="50" y="51" width="10" height="2" fill="#475569" />
        <rect x="50" y="53" width="3" height="2" fill="#000000" />
        <rect x="57" y="53" width="3" height="2" fill="#000000" />

        <rect x="42" y="58" width="26" height="4" fill="#1e293b" />
        <rect x="44" y="59" width="2" height="2" fill="#0f172a" />
        <rect x="48" y="59" width="2" height="2" fill="#0f172a" />
        <rect x="60" y="59" width="2" height="2" fill="#0f172a" />
        <rect x="64" y="59" width="2" height="2" fill="#0f172a" />

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

              <rect x="42" y="62" width="4" height="7" fill="#ffffff" />
              <rect x="43" y="68" width="2" height="2" fill="#ffffff" />
              <rect x="64" y="62" width="4" height="7" fill="#ffffff" />
              <rect x="65" y="68" width="2" height="2" fill="#ffffff" />
              <rect x="48" y="62" width="14" height="2" fill="#f1f5f9" />

              <rect x="44" y="68" width="3" height="4" fill="#ffffff" />
              <rect x="63" y="68" width="3" height="4" fill="#ffffff" />
            </>
          ) : (
            <>
              <rect x="42" y="62" width="26" height="8" fill="#0f172a" />
              <rect x="44" y="63" width="22" height="6" fill="#500724" />
              <rect x="50" y="65" width="10" height="3" fill="#e11d48" />

              <rect x="43" y="62" width="4" height="6" fill="#ffffff" />
              <rect x="44" y="67" width="2" height="2" fill="#ffffff" />
              <rect x="63" y="62" width="4" height="6" fill="#ffffff" />
              <rect x="64" y="67" width="2" height="2" fill="#ffffff" />
              <rect x="48" y="62" width="14" height="2" fill="#e2e8f0" />

              <rect x="46" y="65" width="3" height="4" fill="#ffffff" />
              <rect x="61" y="65" width="3" height="4" fill="#ffffff" />
            </>
          )}
        </g>

        <rect x="44" y="70" width="22" height="6" fill="#1e293b" />
        <rect x="46" y="72" width="18" height="4" fill="#334155" />
        <rect x="50" y="76" width="10" height="5" fill="#1e293b" />
        <rect x="52" y="80" width="6" height="4" fill="#0f172a" />
      </g>
    </g>
  );
};

/* 3. GOBLIN (Duende pícaro con orejas largas horizontales, aros, daga y jubón) */
const PixelGoblin = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-goblin" shapeRendering="crispEdges">
      {/* Orejas horizontales puntiagudas con aros dorados */}
      <g className="pixel-goblin-ears">
        <rect x="4" y="44" width="8" height="4" fill="#365314" />
        <rect x="10" y="42" width="14" height="8" fill="#65a30d" />
        <rect x="14" y="44" width="12" height="6" fill="#84cc16" />
        <rect x="18" y="46" width="8" height="4" fill="#fbcfe8" />
        <rect x="6" y="48" width="4" height="5" fill="#fef08a" />
        <rect x="7" y="49" width="2" height="3" fill="#ca8a04" />

        <rect x="98" y="44" width="8" height="4" fill="#365314" />
        <rect x="86" y="42" width="14" height="8" fill="#65a30d" />
        <rect x="84" y="44" width="12" height="6" fill="#84cc16" />
        <rect x="84" y="46" width="8" height="4" fill="#fbcfe8" />
        <rect x="100" y="48" width="4" height="5" fill="#fef08a" />
        <rect x="101" y="49" width="2" height="3" fill="#ca8a04" />
      </g>

      {/* Piernas y botas puntiagudas de cuero */}
      <g className="pixel-goblin-legs">
        <rect x="34" y="112" width="10" height="14" fill="#365314" />
        <rect x="66" y="112" width="10" height="14" fill="#365314" />
        <rect x="30" y="124" width="14" height="14" fill="#78350f" />
        <rect x="26" y="132" width="18" height="6" fill="#451a03" />
        <rect x="22" y="135" width="6" height="3" fill="#78350f" />

        <rect x="66" y="124" width="14" height="14" fill="#78350f" />
        <rect x="66" y="132" width="18" height="6" fill="#451a03" />
        <rect x="82" y="135" width="6" height="3" fill="#78350f" />
      </g>

      {/* Torso con jubón andrajoso, costuras y cinturón */}
      <g className="pixel-goblin-torso">
        <rect x="34" y="74" width="42" height="38" fill="#78350f" />
        <rect x="36" y="76" width="38" height="34" fill="#92400e" />
        <rect x="46" y="70" width="18" height="6" fill="#84cc16" />
        <rect x="40" y="82" width="10" height="12" fill="#b45309" />
        <rect x="52" y="80" width="2" height="6" fill="#fef08a" />
        <rect x="32" y="104" width="46" height="8" fill="#451a03" />
        <rect x="50" y="103" width="10" height="10" fill="#facc15" />
        <rect x="52" y="105" width="6" height="6" fill="#78350f" />
      </g>

      {/* Brazos: garra izquierda y daga curva derecha */}
      <g className="pixel-goblin-arms">
        <rect x="22" y="76" width="12" height="16" fill="#65a30d" />
        <rect x="20" y="92" width="12" height="16" fill="#84cc16" />
        <rect x="18" y="108" width="12" height="8" fill="#65a30d" />
        <rect x="16" y="114" width="3" height="4" fill="#fef08a" />
        <rect x="20" y="115" width="3" height="4" fill="#fef08a" />
        <rect x="24" y="114" width="3" height="4" fill="#fef08a" />

        <rect x="76" y="76" width="12" height="16" fill="#65a30d" />
        <rect x="78" y="92" width="12" height="16" fill="#84cc16" />
        <rect x="80" y="104" width="12" height="8" fill="#65a30d" />
        <rect x="84" y="110" width="4" height="8" fill="#78350f" />
        <rect x="80" y="112" width="12" height="3" fill="#facc15" />
        <rect x="83" y="118" width="6" height="18" fill="#94a3b8" />
        <rect x="85" y="120" width="4" height="18" fill="#cbd5e1" />
        <rect x="86" y="136" width="3" height="4" fill="#ffffff" />
      </g>

      {/* Cabeza con verruga, frente arrugada y nariz ganchuda */}
      <g className="pixel-goblin-head">
        <rect x="32" y="28" width="46" height="44" fill="#65a30d" />
        <rect x="34" y="30" width="42" height="40" fill="#84cc16" />
        <rect x="42" y="32" width="3" height="3" fill="#365314" />
        <rect x="40" y="36" width="30" height="2" fill="#4d7c0f" />
        <rect x="44" y="40" width="22" height="2" fill="#4d7c0f" />

        {/* Ojos amarillos astutos */}
        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="38" y="44" width="3" height="3" fill="#365314" />
              <rect x="41" y="47" width="3" height="3" fill="#365314" />
              <rect x="44" y="50" width="3" height="3" fill="#365314" />
              <rect x="44" y="44" width="3" height="3" fill="#365314" />
              <rect x="38" y="50" width="3" height="3" fill="#365314" />

              <rect x="63" y="44" width="3" height="3" fill="#365314" />
              <rect x="66" y="47" width="3" height="3" fill="#365314" />
              <rect x="69" y="50" width="3" height="3" fill="#365314" />
              <rect x="69" y="44" width="3" height="3" fill="#365314" />
              <rect x="63" y="50" width="3" height="3" fill="#365314" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="38" y="46" width="10" height="3" fill="#365314" />
              <rect x="36" y="48" width="3" height="3" fill="#365314" />
              <rect x="47" y="48" width="3" height="3" fill="#365314" />

              <rect x="62" y="46" width="10" height="3" fill="#365314" />
              <rect x="60" y="48" width="3" height="3" fill="#365314" />
              <rect x="71" y="48" width="3" height="3" fill="#365314" />
            </>
          ) : (
            <>
              <rect x="38" y="44" width="10" height="10" fill="#fef08a" />
              <rect x="42" y="45" width="4" height="8" fill="#1e293b" />
              <rect x="43" y="46" width="2" height="2" fill="#ffffff" />

              <rect x="62" y="44" width="10" height="10" fill="#fef08a" />
              <rect x="64" y="45" width="4" height="8" fill="#1e293b" />
              <rect x="65" y="46" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Nariz aguileña */}
        <rect x="51" y="48" width="8" height="12" fill="#4d7c0f" />
        <rect x="49" y="56" width="12" height="6" fill="#65a30d" />
        <rect x="48" y="60" width="4" height="3" fill="#365314" />
        <rect x="58" y="60" width="4" height="3" fill="#365314" />

        {/* Boca con colmillos inferiores */}
        <g className="svg-creature-mouth">
          {isDefeated ? (
            <rect x="46" y="64" width="18" height="4" fill="#365314" />
          ) : isLaughing ? (
            <>
              <rect x="40" y="62" width="30" height="10" fill="#365314" />
              <rect x="42" y="64" width="26" height="6" fill="#7f1d1d" />
              <rect x="44" y="62" width="4" height="5" fill="#ffffff" />
              <rect x="62" y="62" width="4" height="5" fill="#ffffff" />
            </>
          ) : (
            <>
              <rect x="44" y="64" width="22" height="6" fill="#365314" />
              <rect x="46" y="61" width="3" height="5" fill="#ffffff" />
              <rect x="61" y="61" width="3" height="5" fill="#ffffff" />
            </>
          )}
        </g>
        <rect x="50" y="70" width="10" height="4" fill="#4d7c0f" />
      </g>
    </g>
  );
};

/* 4. STONE TROLL (Trol de granito con musgo, hombros de peñasco, puños de roca y falla rúnica cian) */
const PixelTroll = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-troll" shapeRendering="crispEdges">
      {/* Hombros de peñasco con musgo */}
      <g className="pixel-troll-shoulders">
        <rect x="14" y="60" width="22" height="24" fill="#0f172a" />
        <rect x="16" y="62" width="18" height="20" fill="#1e293b" />
        <rect x="18" y="64" width="14" height="14" fill="#334155" />
        <rect x="18" y="58" width="10" height="5" fill="#15803d" />
        <rect x="20" y="60" width="8" height="4" fill="#84cc16" />

        <rect x="74" y="60" width="22" height="24" fill="#0f172a" />
        <rect x="76" y="62" width="18" height="20" fill="#1e293b" />
        <rect x="78" y="64" width="14" height="14" fill="#334155" />
        <rect x="82" y="58" width="10" height="5" fill="#15803d" />
        <rect x="84" y="60" width="8" height="4" fill="#84cc16" />
      </g>

      {/* Brazos macizos y grandes puños de roca */}
      <g className="pixel-troll-arms">
        <rect x="10" y="80" width="16" height="24" fill="#0f172a" />
        <rect x="12" y="82" width="12" height="20" fill="#1e293b" />
        <rect x="8" y="104" width="18" height="22" fill="#0f172a" />
        <rect x="10" y="106" width="14" height="18" fill="#334155" />
        <rect x="12" y="108" width="10" height="12" fill="#475569" />
        <rect x="10" y="122" width="14" height="4" fill="#1e293b" />

        <rect x="84" y="80" width="16" height="24" fill="#0f172a" />
        <rect x="86" y="82" width="12" height="20" fill="#1e293b" />
        <rect x="84" y="104" width="18" height="22" fill="#0f172a" />
        <rect x="86" y="106" width="14" height="18" fill="#334155" />
        <rect x="88" y="108" width="10" height="12" fill="#475569" />
        <rect x="86" y="122" width="14" height="4" fill="#1e293b" />
      </g>

      {/* Piernas de pilar y pies de peñasco */}
      <g className="pixel-troll-legs">
        <rect x="28" y="108" width="18" height="24" fill="#0f172a" />
        <rect x="30" y="110" width="14" height="20" fill="#1e293b" />
        <rect x="26" y="130" width="22" height="10" fill="#334155" />

        <rect x="64" y="108" width="18" height="24" fill="#0f172a" />
        <rect x="66" y="110" width="14" height="20" fill="#1e293b" />
        <rect x="62" y="130" width="22" height="10" fill="#334155" />
      </g>

      {/* Torso de granito con grieta de maná cian */}
      <g className="pixel-troll-torso">
        <rect x="26" y="70" width="58" height="42" fill="#0f172a" />
        <rect x="28" y="72" width="54" height="38" fill="#1e293b" />
        <rect x="32" y="74" width="46" height="32" fill="#334155" />

        <rect x="53" y="76" width="4" height="12" fill="#38bdf8" />
        <rect x="49" y="86" width="12" height="3" fill="#38bdf8" />
        <rect x="54" y="88" width="3" height="12" fill="#0284c7" />
        <rect x="52" y="100" width="6" height="3" fill="#e0f2fe" />
      </g>

      {/* Cabeza pétrea con ceño de roca y ojos rúnicos */}
      <g className="pixel-troll-head">
        <rect x="36" y="24" width="12" height="10" fill="#334155" />
        <rect x="62" y="24" width="12" height="10" fill="#334155" />
        <rect x="46" y="20" width="18" height="8" fill="#475569" />

        <rect x="30" y="30" width="50" height="42" fill="#0f172a" />
        <rect x="32" y="32" width="46" height="38" fill="#1e293b" />
        <rect x="34" y="34" width="42" height="32" fill="#334155" />
        <rect x="32" y="42" width="46" height="6" fill="#0f172a" />

        {/* Ojos rúnicos de gema cian */}
        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="38" y="48" width="8" height="3" fill="#0f172a" />
              <rect x="64" y="48" width="8" height="3" fill="#0f172a" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="36" y="48" width="12" height="4" fill="#38bdf8" />
              <rect x="38" y="49" width="8" height="2" fill="#ffffff" />
              <rect x="62" y="48" width="12" height="4" fill="#38bdf8" />
              <rect x="64" y="49" width="8" height="2" fill="#ffffff" />
            </>
          ) : (
            <>
              <rect x="38" y="48" width="10" height="6" fill="#0284c7" />
              <rect x="40" y="49" width="6" height="4" fill="#38bdf8" />
              <rect x="42" y="50" width="2" height="2" fill="#ffffff" />

              <rect x="62" y="48" width="10" height="6" fill="#0284c7" />
              <rect x="64" y="49" width="6" height="4" fill="#38bdf8" />
              <rect x="66" y="50" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Mandíbula de roca con colmillos inferiores de granito */}
        <rect x="36" y="60" width="38" height="14" fill="#0f172a" />
        <rect x="38" y="62" width="34" height="10" fill="#1e293b" />
        <rect x="38" y="56" width="6" height="8" fill="#475569" />
        <rect x="40" y="52" width="3" height="6" fill="#94a3b8" />
        <rect x="66" y="56" width="6" height="8" fill="#475569" />
        <rect x="67" y="52" width="3" height="6" fill="#94a3b8" />

        <g className="svg-creature-mouth">
          <rect x="46" y="62" width="18" height="5" fill="#0f172a" />
          {isLaughing && <rect x="48" y="63" width="14" height="3" fill="#38bdf8" opacity="0.7" />}
        </g>
      </g>
    </g>
  );
};

/* 5. FIRE DRAGON (Dragón alado con cuernos, vientre acorazado de oro, cola espinada y fauces de fuego) */
const PixelDragon = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-dragon" shapeRendering="crispEdges">
      {/* Alas membranosas extendidas a los lados */}
      <g className="pixel-dragon-wings">
        <rect x="4" y="48" width="28" height="6" fill="#450a0a" />
        <rect x="8" y="42" width="20" height="6" fill="#7f1d1d" />
        <rect x="12" y="36" width="12" height="6" fill="#991b1b" />
        <rect x="2" y="54" width="28" height="24" fill="#7f1d1d" />
        <rect x="6" y="58" width="22" height="18" fill="#991b1b" />
        <rect x="4" y="78" width="24" height="10" fill="#450a0a" />
        <rect x="10" y="34" width="4" height="4" fill="#fef08a" />

        <rect x="78" y="48" width="28" height="6" fill="#450a0a" />
        <rect x="82" y="42" width="20" height="6" fill="#7f1d1d" />
        <rect x="86" y="36" width="12" height="6" fill="#991b1b" />
        <rect x="80" y="54" width="28" height="24" fill="#7f1d1d" />
        <rect x="82" y="58" width="22" height="18" fill="#991b1b" />
        <rect x="82" y="78" width="24" height="10" fill="#450a0a" />
        <rect x="96" y="34" width="4" height="4" fill="#fef08a" />
      </g>

      {/* Cola de dragón con punta de arpón de fuego */}
      <g className="pixel-dragon-tail">
        <rect x="78" y="104" width="12" height="8" fill="#7f1d1d" />
        <rect x="88" y="100" width="12" height="8" fill="#7f1d1d" />
        <rect x="96" y="94" width="10" height="10" fill="#450a0a" />
        <rect x="102" y="88" width="6" height="8" fill="#dc2626" />
        <rect x="100" y="96" width="8" height="6" fill="#f97316" />
        <rect x="104" y="92" width="4" height="4" fill="#fef08a" />
      </g>

      {/* Patas escamadas y garras afiladas */}
      <g className="pixel-dragon-legs">
        <rect x="30" y="112" width="14" height="16" fill="#450a0a" />
        <rect x="32" y="114" width="10" height="12" fill="#7f1d1d" />
        <rect x="28" y="128" width="16" height="8" fill="#450a0a" />
        <rect x="26" y="134" width="3" height="5" fill="#ffffff" />
        <rect x="31" y="135" width="3" height="4" fill="#ffffff" />
        <rect x="36" y="135" width="3" height="4" fill="#ffffff" />
        <rect x="41" y="134" width="3" height="5" fill="#ffffff" />

        <rect x="66" y="112" width="14" height="16" fill="#450a0a" />
        <rect x="68" y="114" width="10" height="12" fill="#7f1d1d" />
        <rect x="66" y="128" width="16" height="8" fill="#450a0a" />
        <rect x="66" y="134" width="3" height="5" fill="#ffffff" />
        <rect x="71" y="135" width="3" height="4" fill="#ffffff" />
        <rect x="76" y="135" width="3" height="4" fill="#ffffff" />
        <rect x="81" y="134" width="3" height="5" fill="#ffffff" />
      </g>

      {/* Torso con placas ventrales doradas */}
      <g className="pixel-dragon-torso">
        <rect x="32" y="74" width="46" height="42" fill="#450a0a" />
        <rect x="34" y="76" width="42" height="38" fill="#7f1d1d" />

        <rect x="44" y="76" width="22" height="8" fill="#f59e0b" />
        <rect x="46" y="78" width="18" height="4" fill="#fef08a" />
        <rect x="42" y="86" width="26" height="8" fill="#f59e0b" />
        <rect x="44" y="88" width="22" height="4" fill="#fef08a" />
        <rect x="44" y="96" width="22" height="8" fill="#f59e0b" />
        <rect x="46" y="98" width="18" height="4" fill="#fef08a" />
        <rect x="48" y="106" width="14" height="6" fill="#d97706" />

        {/* Garras delanteras en guardia */}
        <rect x="24" y="84" width="10" height="12" fill="#7f1d1d" />
        <rect x="22" y="94" width="3" height="6" fill="#ffffff" />
        <rect x="26" y="95" width="3" height="6" fill="#ffffff" />
        <rect x="76" y="84" width="10" height="12" fill="#7f1d1d" />
        <rect x="81" y="94" width="3" height="6" fill="#ffffff" />
        <rect x="85" y="95" width="3" height="6" fill="#ffffff" />
      </g>

      {/* Cabeza con cuernos dorados y hocico humeante */}
      <g className="pixel-dragon-head">
        <rect x="24" y="16" width="8" height="14" fill="#d97706" />
        <rect x="20" y="12" width="8" height="8" fill="#f59e0b" />
        <rect x="18" y="8" width="6" height="6" fill="#fef08a" />

        <rect x="78" y="16" width="8" height="14" fill="#d97706" />
        <rect x="82" y="12" width="8" height="8" fill="#f59e0b" />
        <rect x="86" y="8" width="6" height="6" fill="#fef08a" />

        <rect x="52" y="20" width="6" height="10" fill="#f59e0b" />
        <rect x="50" y="28" width="10" height="8" fill="#b91c1c" />

        <rect x="32" y="28" width="46" height="42" fill="#450a0a" />
        <rect x="34" y="30" width="42" height="38" fill="#7f1d1d" />

        {/* Ojos reptilianos con pupila vertical */}
        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="38" y="40" width="3" height="3" fill="#450a0a" />
              <rect x="41" y="43" width="3" height="3" fill="#450a0a" />
              <rect x="44" y="46" width="3" height="3" fill="#450a0a" />
              <rect x="44" y="40" width="3" height="3" fill="#450a0a" />
              <rect x="38" y="46" width="3" height="3" fill="#450a0a" />

              <rect x="63" y="40" width="3" height="3" fill="#450a0a" />
              <rect x="66" y="43" width="3" height="3" fill="#450a0a" />
              <rect x="69" y="46" width="3" height="3" fill="#450a0a" />
              <rect x="69" y="40" width="3" height="3" fill="#450a0a" />
              <rect x="63" y="46" width="3" height="3" fill="#450a0a" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="36" y="42" width="11" height="3" fill="#450a0a" />
              <rect x="38" y="44" width="7" height="2" fill="#fde047" />

              <rect x="63" y="42" width="11" height="3" fill="#450a0a" />
              <rect x="65" y="44" width="7" height="2" fill="#fde047" />
            </>
          ) : (
            <>
              <rect x="38" y="40" width="10" height="8" fill="#facc15" />
              <rect x="42" y="40" width="2" height="8" fill="#450a0a" />
              <rect x="39" y="41" width="2" height="2" fill="#ffffff" />

              <rect x="62" y="40" width="10" height="8" fill="#facc15" />
              <rect x="66" y="40" width="2" height="8" fill="#450a0a" />
              <rect x="63" y="41" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Fosas nasales humeantes */}
        <rect x="42" y="48" width="26" height="10" fill="#450a0a" />
        <rect x="44" y="50" width="22" height="6" fill="#991b1b" />
        <rect x="46" y="52" width="3" height="3" fill="#000000" />
        <rect x="61" y="52" width="3" height="3" fill="#000000" />
        <rect x="47" y="50" width="2" height="2" fill="#f97316" />
        <rect x="61" y="50" width="2" height="2" fill="#f97316" />

        {/* Fauces de dragón con fuego y colmillos */}
        <g className="svg-creature-mouth">
          {isDefeated ? (
            <rect x="46" y="60" width="18" height="4" fill="#450a0a" />
          ) : isLaughing ? (
            <>
              <rect x="40" y="58" width="30" height="12" fill="#450a0a" />
              <rect x="42" y="60" width="26" height="8" fill="#ea580c" />
              <rect x="46" y="62" width="18" height="4" fill="#fde047" />
              <rect x="42" y="58" width="3" height="5" fill="#ffffff" />
              <rect x="65" y="58" width="3" height="5" fill="#ffffff" />
              <rect x="44" y="65" width="3" height="5" fill="#ffffff" />
              <rect x="63" y="65" width="3" height="5" fill="#ffffff" />
            </>
          ) : (
            <>
              <rect x="44" y="60" width="22" height="6" fill="#450a0a" />
              <rect x="48" y="62" width="14" height="2" fill="#ea580c" />
              <rect x="46" y="59" width="3" height="4" fill="#ffffff" />
              <rect x="61" y="59" width="3" height="4" fill="#ffffff" />
            </>
          )}
        </g>
      </g>
    </g>
  );
};

/* 6. CYCLOPS (Titán de un ojo con cuerno craneal, hombrera blindada y arnés de combate) */
const PixelCyclops = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-cyclops" shapeRendering="crispEdges">
      {/* Hombrera blindada de hierro remachada en el hombro izquierdo */}
      <g className="pixel-cyclops-armor">
        <rect x="14" y="64" width="20" height="20" fill="#1e293b" />
        <rect x="16" y="66" width="16" height="16" fill="#334155" />
        <rect x="18" y="68" width="12" height="12" fill="#475569" />
        <rect x="10" y="68" width="6" height="8" fill="#94a3b8" />
        <rect x="8" y="70" width="4" height="4" fill="#f1f5f9" />
      </g>

      {/* Brazos descomunales y maza de combate */}
      <g className="pixel-cyclops-arms">
        <rect x="16" y="82" width="14" height="22" fill="#7c2d12" />
        <rect x="18" y="84" width="10" height="18" fill="#c2410c" />
        <rect x="14" y="104" width="16" height="16" fill="#7c2d12" />
        <rect x="16" y="106" width="12" height="12" fill="#c2410c" />

        <rect x="80" y="72" width="16" height="26" fill="#7c2d12" />
        <rect x="82" y="74" width="12" height="22" fill="#c2410c" />
        <rect x="80" y="98" width="18" height="22" fill="#1e293b" />
        <rect x="82" y="100" width="14" height="18" fill="#475569" />
        <rect x="96" y="102" width="6" height="4" fill="#94a3b8" />
        <rect x="96" y="112" width="6" height="4" fill="#94a3b8" />
      </g>

      {/* Piernas de titán y sandalias */}
      <g className="pixel-cyclops-legs">
        <rect x="30" y="112" width="16" height="20" fill="#7c2d12" />
        <rect x="32" y="114" width="12" height="16" fill="#c2410c" />
        <rect x="28" y="130" width="18" height="8" fill="#451a03" />

        <rect x="64" y="112" width="16" height="20" fill="#7c2d12" />
        <rect x="66" y="114" width="12" height="16" fill="#c2410c" />
        <rect x="64" y="130" width="18" height="8" fill="#451a03" />
      </g>

      {/* Torso con correa de combate cruzada */}
      <g className="pixel-cyclops-torso">
        <rect x="28" y="72" width="54" height="42" fill="#7c2d12" />
        <rect x="30" y="74" width="50" height="38" fill="#c2410c" />
        <rect x="34" y="76" width="42" height="30" fill="#ea580c" />

        <rect x="32" y="72" width="10" height="8" fill="#451a03" />
        <rect x="40" y="80" width="10" height="8" fill="#451a03" />
        <rect x="48" y="88" width="10" height="8" fill="#451a03" />
        <rect x="56" y="96" width="10" height="8" fill="#451a03" />
        <rect x="64" y="104" width="10" height="8" fill="#451a03" />
        <rect x="36" y="74" width="3" height="3" fill="#facc15" />
        <rect x="52" y="90" width="3" height="3" fill="#facc15" />
      </g>

      {/* Cabeza con cuerno frontal y el colosal ojo único */}
      <g className="pixel-cyclops-head">
        <rect x="52" y="16" width="6" height="10" fill="#d97706" />
        <rect x="53" y="10" width="4" height="8" fill="#facc15" />
        <rect x="54" y="6" width="2" height="6" fill="#fef08a" />

        <rect x="32" y="26" width="46" height="46" fill="#7c2d12" />
        <rect x="34" y="28" width="42" height="42" fill="#c2410c" />
        <rect x="40" y="36" width="30" height="6" fill="#7c2d12" />

        {/* EL GRAN OJO ÚNICO CENTRAL */}
        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="46" y="44" width="4" height="4" fill="#7c2d12" />
              <rect x="50" y="48" width="4" height="4" fill="#7c2d12" />
              <rect x="54" y="52" width="4" height="4" fill="#7c2d12" />
              <rect x="58" y="56" width="4" height="4" fill="#7c2d12" />
              <rect x="58" y="44" width="4" height="4" fill="#7c2d12" />
              <rect x="46" y="56" width="4" height="4" fill="#7c2d12" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="42" y="48" width="26" height="5" fill="#7c2d12" />
              <rect x="44" y="50" width="22" height="4" fill="#facc15" />
              <rect x="48" y="51" width="14" height="2" fill="#7c2d12" />
            </>
          ) : (
            <>
              <rect x="42" y="42" width="26" height="22" fill="#fed7aa" />
              <rect x="44" y="40" width="22" height="26" fill="#fed7aa" />
              <rect x="44" y="44" width="22" height="18" fill="#ffffff" />
              <rect x="48" y="46" width="14" height="14" fill="#d97706" />
              <rect x="50" y="48" width="10" height="10" fill="#f59e0b" />
              <rect x="52" y="50" width="6" height="6" fill="#0f172a" />
              <rect x="50" y="48" width="3" height="3" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Mandíbula pesada con colmillos inferiores */}
        <rect x="38" y="64" width="34" height="10" fill="#7c2d12" />
        <rect x="40" y="66" width="30" height="8" fill="#ea580c" />
        <rect x="42" y="62" width="4" height="6" fill="#ffffff" />
        <rect x="64" y="62" width="4" height="6" fill="#ffffff" />

        <g className="svg-creature-mouth">
          {isDefeated ? (
            <rect x="48" y="68" width="14" height="3" fill="#7c2d12" />
          ) : isLaughing ? (
            <>
              <rect x="44" y="66" width="22" height="8" fill="#7c2d12" />
              <rect x="46" y="68" width="18" height="4" fill="#991b1b" />
            </>
          ) : (
            <rect x="46" y="68" width="18" height="4" fill="#7c2d12" />
          )}
        </g>
      </g>
    </g>
  );
};

/* 7. GRIFFIN (Grifo con alas emplumadas, pico ganchudo dorado, pecho níveo y patas de león/águila) */
const PixelGriffin = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-griffin" shapeRendering="crispEdges">
      {/* Alas plumadas extendidas a los lados */}
      <g className="pixel-griffin-wings">
        <rect x="8" y="46" width="22" height="6" fill="#475569" />
        <rect x="6" y="52" width="26" height="8" fill="#94a3b8" />
        <rect x="4" y="60" width="26" height="14" fill="#cbd5e1" />
        <rect x="6" y="74" width="22" height="14" fill="#e2e8f0" />
        <rect x="10" y="88" width="16" height="8" fill="#f8fafc" />

        <rect x="80" y="46" width="22" height="6" fill="#475569" />
        <rect x="78" y="52" width="26" height="8" fill="#94a3b8" />
        <rect x="80" y="60" width="26" height="14" fill="#cbd5e1" />
        <rect x="82" y="74" width="22" height="14" fill="#e2e8f0" />
        <rect x="84" y="88" width="16" height="8" fill="#f8fafc" />
      </g>

      {/* Cuartos traseros de león y cola leonina */}
      <g className="pixel-griffin-hindquarters">
        <rect x="80" y="102" width="14" height="6" fill="#b45309" />
        <rect x="90" y="96" width="8" height="12" fill="#d97706" />
        <rect x="94" y="90" width="8" height="10" fill="#f59e0b" />
        <rect x="96" y="86" width="8" height="8" fill="#92400e" />

        <rect x="68" y="112" width="14" height="20" fill="#b45309" />
        <rect x="70" y="114" width="10" height="16" fill="#d97706" />
        <rect x="68" y="132" width="16" height="6" fill="#92400e" />
      </g>

      {/* Patas delanteras de rapaz águila con garras doradas */}
      <g className="pixel-griffin-forelegs">
        <rect x="26" y="110" width="12" height="18" fill="#d97706" />
        <rect x="28" y="112" width="8" height="14" fill="#f59e0b" />
        <rect x="24" y="128" width="18" height="6" fill="#f59e0b" />
        <rect x="22" y="134" width="3" height="5" fill="#fef08a" />
        <rect x="27" y="135" width="3" height="4" fill="#fef08a" />
        <rect x="32" y="135" width="3" height="4" fill="#fef08a" />
        <rect x="37" y="134" width="3" height="5" fill="#fef08a" />

        <rect x="52" y="128" width="16" height="6" fill="#f59e0b" />
        <rect x="50" y="134" width="3" height="5" fill="#fef08a" />
        <rect x="55" y="135" width="3" height="4" fill="#fef08a" />
        <rect x="60" y="135" width="3" height="4" fill="#fef08a" />
      </g>

      {/* Torso con pechera nívea de águila */}
      <g className="pixel-griffin-torso">
        <rect x="32" y="74" width="46" height="40" fill="#b45309" />
        <rect x="48" y="76" width="30" height="36" fill="#d97706" />

        <rect x="32" y="72" width="28" height="34" fill="#94a3b8" />
        <rect x="34" y="74" width="24" height="30" fill="#e2e8f0" />
        <rect x="36" y="76" width="20" height="26" fill="#ffffff" />
        <rect x="34" y="104" width="6" height="6" fill="#e2e8f0" />
        <rect x="42" y="104" width="6" height="8" fill="#e2e8f0" />
        <rect x="50" y="102" width="6" height="6" fill="#e2e8f0" />
      </g>

      {/* Cabeza de águila con cresta y pico ganchudo */}
      <g className="pixel-griffin-head">
        <rect x="28" y="18" width="8" height="12" fill="#475569" />
        <rect x="26" y="12" width="6" height="8" fill="#94a3b8" />
        <rect x="74" y="18" width="8" height="12" fill="#475569" />
        <rect x="78" y="12" width="6" height="8" fill="#94a3b8" />

        <rect x="34" y="24" width="42" height="44" fill="#94a3b8" />
        <rect x="36" y="26" width="38" height="40" fill="#e2e8f0" />
        <rect x="38" y="28" width="34" height="36" fill="#f8fafc" />

        {/* Ojos de águila dorados */}
        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="38" y="38" width="3" height="3" fill="#475569" />
              <rect x="41" y="41" width="3" height="3" fill="#475569" />
              <rect x="44" y="44" width="3" height="3" fill="#475569" />
              <rect x="44" y="38" width="3" height="3" fill="#475569" />
              <rect x="38" y="44" width="3" height="3" fill="#475569" />

              <rect x="63" y="38" width="3" height="3" fill="#475569" />
              <rect x="66" y="41" width="3" height="3" fill="#475569" />
              <rect x="69" y="44" width="3" height="3" fill="#475569" />
              <rect x="69" y="38" width="3" height="3" fill="#475569" />
              <rect x="63" y="44" width="3" height="3" fill="#475569" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="38" y="40" width="10" height="3" fill="#475569" />
              <rect x="39" y="42" width="6" height="2" fill="#fde047" />

              <rect x="62" y="40" width="10" height="3" fill="#475569" />
              <rect x="65" y="42" width="6" height="2" fill="#fde047" />
            </>
          ) : (
            <>
              <rect x="38" y="38" width="10" height="8" fill="#f59e0b" />
              <rect x="40" y="39" width="6" height="6" fill="#fde047" />
              <rect x="42" y="40" width="3" height="4" fill="#0f172a" />
              <rect x="40" y="39" width="2" height="2" fill="#ffffff" />

              <rect x="62" y="38" width="10" height="8" fill="#f59e0b" />
              <rect x="64" y="39" width="6" height="6" fill="#fde047" />
              <rect x="65" y="40" width="3" height="4" fill="#0f172a" />
              <rect x="64" y="39" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Pico de rapaz águila */}
        <g className="svg-creature-mouth">
          <rect x="48" y="48" width="14" height="14" fill="#b45309" />
          <rect x="50" y="49" width="10" height="12" fill="#f59e0b" />
          <rect x="52" y="60" width="6" height="6" fill="#f59e0b" />
          <rect x="54" y="65" width="3" height="4" fill="#d97706" />
          <rect x="50" y="50" width="2" height="2" fill="#78350f" />
          <rect x="58" y="50" width="2" height="2" fill="#78350f" />

          {isLaughing && (
            <>
              <rect x="48" y="54" width="14" height="5" fill="#450a0a" />
              <rect x="52" y="55" width="6" height="3" fill="#f43f5e" />
            </>
          )}
        </g>
      </g>
    </g>
  );
};

/* 8. MINOTAUR (Guerrero toro con cuernos anillados de oro, aro nasal, faldón y pezuñas) */
const PixelMinotaur = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-minotaur" shapeRendering="crispEdges">
      {/* Cuernos recurvados con aros dorados */}
      <g className="pixel-minotaur-horns">
        <rect x="22" y="24" width="12" height="8" fill="#44403c" />
        <rect x="14" y="20" width="10" height="8" fill="#78716c" />
        <rect x="10" y="12" width="6" height="12" fill="#a8a29e" />
        <rect x="8" y="6" width="6" height="10" fill="#d6d3d1" />
        <rect x="10" y="2" width="4" height="6" fill="#f5f5f4" />
        <rect x="16" y="20" width="4" height="8" fill="#facc15" />

        <rect x="76" y="24" width="12" height="8" fill="#44403c" />
        <rect x="86" y="20" width="10" height="8" fill="#78716c" />
        <rect x="94" y="12" width="6" height="12" fill="#a8a29e" />
        <rect x="96" y="6" width="6" height="10" fill="#d6d3d1" />
        <rect x="96" y="2" width="4" height="6" fill="#f5f5f4" />
        <rect x="90" y="20" width="4" height="8" fill="#facc15" />

        <rect x="16" y="32" width="10" height="6" fill="#291609" />
        <rect x="84" y="32" width="10" height="6" fill="#291609" />
      </g>

      {/* Piernas y pezuñas hendidas de toro */}
      <g className="pixel-minotaur-legs">
        <rect x="30" y="110" width="16" height="18" fill="#140a04" />
        <rect x="32" y="112" width="12" height="14" fill="#291609" />
        <rect x="28" y="128" width="18" height="10" fill="#0c0a09" />
        <rect x="36" y="130" width="2" height="8" fill="#44403c" />

        <rect x="64" y="110" width="16" height="18" fill="#140a04" />
        <rect x="66" y="112" width="12" height="14" fill="#291609" />
        <rect x="64" y="128" width="18" height="10" fill="#0c0a09" />
        <rect x="72" y="130" width="2" height="8" fill="#44403c" />
      </g>

      {/* Torso de toro con faldellín de combate y brazaletes */}
      <g className="pixel-minotaur-torso">
        <rect x="26" y="70" width="58" height="42" fill="#140a04" />
        <rect x="28" y="72" width="54" height="38" fill="#291609" />
        <rect x="32" y="74" width="46" height="30" fill="#451a03" />

        <rect x="14" y="74" width="14" height="24" fill="#291609" />
        <rect x="12" y="98" width="16" height="16" fill="#1e293b" />
        <rect x="10" y="114" width="16" height="12" fill="#291609" />

        <rect x="82" y="74" width="14" height="24" fill="#291609" />
        <rect x="82" y="98" width="16" height="16" fill="#1e293b" />
        <rect x="84" y="114" width="16" height="12" fill="#291609" />

        <rect x="30" y="100" width="50" height="14" fill="#991b1b" />
        <rect x="32" y="98" width="46" height="6" fill="#451a03" />
        <rect x="49" y="96" width="12" height="10" fill="#facc15" />
        <rect x="52" y="99" width="6" height="4" fill="#78350f" />
      </g>

      {/* Cabeza de toro con morro, fosas nasales y argolla dorada */}
      <g className="pixel-minotaur-head">
        <rect x="32" y="28" width="46" height="44" fill="#140a04" />
        <rect x="34" y="30" width="42" height="40" fill="#291609" />
        <rect x="44" y="26" width="22" height="6" fill="#451a03" />

        {/* Ojos feroces de toro */}
        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="38" y="38" width="3" height="3" fill="#140a04" />
              <rect x="41" y="41" width="3" height="3" fill="#140a04" />
              <rect x="44" y="44" width="3" height="3" fill="#140a04" />
              <rect x="44" y="38" width="3" height="3" fill="#140a04" />
              <rect x="38" y="44" width="3" height="3" fill="#140a04" />

              <rect x="63" y="38" width="3" height="3" fill="#140a04" />
              <rect x="66" y="41" width="3" height="3" fill="#140a04" />
              <rect x="69" y="44" width="3" height="3" fill="#140a04" />
              <rect x="69" y="38" width="3" height="3" fill="#140a04" />
              <rect x="63" y="44" width="3" height="3" fill="#140a04" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="36" y="40" width="10" height="3" fill="#140a04" />
              <rect x="38" y="42" width="6" height="2" fill="#ef4444" />

              <rect x="64" y="40" width="10" height="3" fill="#140a04" />
              <rect x="66" y="42" width="6" height="2" fill="#ef4444" />
            </>
          ) : (
            <>
              <rect x="36" y="38" width="11" height="8" fill="#dc2626" />
              <rect x="38" y="39" width="7" height="6" fill="#f87171" />
              <rect x="41" y="40" width="3" height="4" fill="#140a04" />
              <rect x="38" y="39" width="2" height="2" fill="#ffffff" />

              <rect x="63" y="38" width="11" height="8" fill="#dc2626" />
              <rect x="65" y="39" width="7" height="6" fill="#f87171" />
              <rect x="66" y="40" width="3" height="4" fill="#140a04" />
              <rect x="65" y="39" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Morro de toro con argolla dorada */}
        <rect x="40" y="48" width="30" height="18" fill="#44403c" />
        <rect x="42" y="50" width="26" height="14" fill="#78716c" />
        <rect x="44" y="54" width="5" height="4" fill="#1c1917" />
        <rect x="61" y="54" width="5" height="4" fill="#1c1917" />
        <rect x="40" y="56" width="3" height="3" fill="#e7e5e4" opacity="0.6" />
        <rect x="67" y="56" width="3" height="3" fill="#e7e5e4" opacity="0.6" />

        <rect x="51" y="56" width="8" height="10" fill="#facc15" />
        <rect x="53" y="58" width="4" height="6" fill="#78716c" />

        <g className="svg-creature-mouth">
          {isDefeated ? (
            <rect x="46" y="66" width="18" height="3" fill="#140a04" />
          ) : isLaughing ? (
            <>
              <rect x="44" y="64" width="22" height="6" fill="#140a04" />
              <rect x="46" y="65" width="18" height="4" fill="#7f1d1d" />
            </>
          ) : (
            <rect x="46" y="64" width="18" height="4" fill="#140a04" />
          )}
        </g>
      </g>
    </g>
  );
};

/* 9. KRAKEN (Leviatán de aguas profundas con manto alienígena, ojos abisales, pico y tentáculos con ventosas) */
const PixelKraken = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-kraken" shapeRendering="crispEdges">
      {/* Oleaje y espuma marina arremolinada en la base */}
      <g className="pixel-kraken-sea">
        <rect x="10" y="132" width="90" height="8" fill="#0369a1" />
        <rect x="6" y="136" width="98" height="6" fill="#0284c7" />
        <rect x="14" y="130" width="12" height="3" fill="#e0f2fe" />
        <rect x="36" y="132" width="16" height="3" fill="#e0f2fe" />
        <rect x="62" y="130" width="14" height="3" fill="#e0f2fe" />
        <rect x="84" y="132" width="12" height="3" fill="#e0f2fe" />
      </g>

      {/* Tentáculos exteriores que se alzan y retuercen */}
      <g className="pixel-kraken-tentacles-back">
        <rect x="8" y="74" width="10" height="46" fill="#2e1065" />
        <rect x="10" y="76" width="6" height="42" fill="#4c1d95" />
        <rect x="12" y="62" width="10" height="16" fill="#2e1065" />
        <rect x="18" y="54" width="10" height="12" fill="#4c1d95" />
        <rect x="24" y="50" width="8" height="8" fill="#6d28d9" />
        <rect x="6" y="82" width="4" height="4" fill="#f43f5e" />
        <rect x="6" y="94" width="4" height="4" fill="#f43f5e" />
        <rect x="6" y="106" width="4" height="4" fill="#f43f5e" />
        <rect x="10" y="66" width="4" height="4" fill="#fda4af" />
        <rect x="16" y="58" width="4" height="4" fill="#fda4af" />

        <rect x="92" y="74" width="10" height="46" fill="#2e1065" />
        <rect x="94" y="76" width="6" height="42" fill="#4c1d95" />
        <rect x="88" y="62" width="10" height="16" fill="#2e1065" />
        <rect x="82" y="54" width="10" height="12" fill="#4c1d95" />
        <rect x="78" y="50" width="8" height="8" fill="#6d28d9" />
        <rect x="100" y="82" width="4" height="4" fill="#f43f5e" />
        <rect x="100" y="94" width="4" height="4" fill="#f43f5e" />
        <rect x="100" y="106" width="4" height="4" fill="#f43f5e" />
        <rect x="96" y="66" width="4" height="4" fill="#fda4af" />
        <rect x="90" y="58" width="4" height="4" fill="#fda4af" />
      </g>

      {/* Manto de calamar gigante con aletas laterales */}
      <g className="pixel-kraken-mantle">
        <rect x="28" y="34" width="10" height="18" fill="#581c87" />
        <rect x="72" y="34" width="10" height="18" fill="#581c87" />

        <rect x="46" y="14" width="18" height="10" fill="#2e1065" />
        <rect x="42" y="22" width="26" height="14" fill="#4c1d95" />
        <rect x="36" y="34" width="38" height="24" fill="#4c1d95" />
        <rect x="34" y="54" width="42" height="24" fill="#581c87" />

        <rect x="48" y="26" width="3" height="3" fill="#38bdf8" />
        <rect x="58" y="30" width="3" height="3" fill="#38bdf8" />
        <rect x="42" y="44" width="4" height="4" fill="#f43f5e" />
        <rect x="64" y="44" width="4" height="4" fill="#f43f5e" />
        <rect x="52" y="50" width="5" height="5" fill="#fda4af" />
      </g>

      {/* Ojos abisales y pico córneo */}
      <g className="pixel-kraken-face">
        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="36" y="58" width="3" height="3" fill="#2e1065" />
              <rect x="39" y="61" width="3" height="3" fill="#2e1065" />
              <rect x="42" y="64" width="3" height="3" fill="#2e1065" />
              <rect x="42" y="58" width="3" height="3" fill="#2e1065" />
              <rect x="36" y="64" width="3" height="3" fill="#2e1065" />

              <rect x="65" y="58" width="3" height="3" fill="#2e1065" />
              <rect x="68" y="61" width="3" height="3" fill="#2e1065" />
              <rect x="71" y="64" width="3" height="3" fill="#2e1065" />
              <rect x="71" y="58" width="3" height="3" fill="#2e1065" />
              <rect x="65" y="64" width="3" height="3" fill="#2e1065" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="36" y="60" width="10" height="3" fill="#2e1065" />
              <rect x="38" y="61" width="6" height="2" fill="#38bdf8" />

              <rect x="64" y="60" width="10" height="3" fill="#2e1065" />
              <rect x="66" y="61" width="6" height="2" fill="#38bdf8" />
            </>
          ) : (
            <>
              <rect x="36" y="58" width="10" height="8" fill="#0284c7" />
              <rect x="37" y="59" width="8" height="6" fill="#38bdf8" />
              <rect x="40" y="59" width="2" height="6" fill="#0f172a" />
              <rect x="38" y="60" width="2" height="2" fill="#ffffff" />

              <rect x="64" y="58" width="10" height="8" fill="#0284c7" />
              <rect x="65" y="59" width="8" height="6" fill="#38bdf8" />
              <rect x="68" y="59" width="2" height="6" fill="#0f172a" />
              <rect x="66" y="60" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>

        <g className="svg-creature-mouth">
          <rect x="50" y="68" width="10" height="10" fill="#0f172a" />
          <rect x="52" y="70" width="6" height="6" fill="#2e1065" />
          <rect x="54" y="75" width="2" height="3" fill="#ffffff" />
          {isLaughing && <rect x="52" y="72" width="6" height="3" fill="#f43f5e" />}
        </g>
      </g>

      {/* Tentáculos frontales retorciéndose en el agua */}
      <g className="pixel-kraken-tentacles-front">
        <rect x="28" y="80" width="10" height="38" fill="#4c1d95" />
        <rect x="24" y="104" width="10" height="20" fill="#581c87" />
        <rect x="22" y="118" width="12" height="10" fill="#6d28d9" />
        <rect x="36" y="86" width="3" height="4" fill="#fda4af" />
        <rect x="36" y="96" width="3" height="4" fill="#fda4af" />
        <rect x="32" y="108" width="3" height="4" fill="#fda4af" />

        <rect x="42" y="84" width="8" height="40" fill="#581c87" />
        <rect x="40" y="114" width="10" height="16" fill="#6d28d9" />
        <rect x="48" y="88" width="3" height="4" fill="#f43f5e" />
        <rect x="48" y="100" width="3" height="4" fill="#f43f5e" />

        <rect x="58" y="84" width="8" height="40" fill="#581c87" />
        <rect x="60" y="114" width="10" height="16" fill="#6d28d9" />
        <rect x="57" y="88" width="3" height="4" fill="#f43f5e" />
        <rect x="57" y="100" width="3" height="4" fill="#f43f5e" />

        <rect x="72" y="80" width="10" height="38" fill="#4c1d95" />
        <rect x="76" y="104" width="10" height="20" fill="#581c87" />
        <rect x="76" y="118" width="12" height="10" fill="#6d28d9" />
        <rect x="71" y="86" width="3" height="4" fill="#fda4af" />
        <rect x="71" y="96" width="3" height="4" fill="#fda4af" />
        <rect x="75" y="108" width="3" height="4" fill="#fda4af" />
      </g>
    </g>
  );
};

/* 10. PHOENIX (Ave solar inmortal con cresta de tres llamaradas, alas ardientes y cola de fuego) */
const PixelPhoenix = ({ creature, mood }) => {
  const isDefeated = mood === "defeated";
  const isLaughing = mood === "laughing" || mood === "smile";

  return (
    <g className="pixel-phoenix" shapeRendering="crispEdges">
      {/* Plumas de la cola ardiente */}
      <g className="pixel-phoenix-tail">
        <rect x="52" y="102" width="6" height="32" fill="#881337" />
        <rect x="53" y="104" width="4" height="28" fill="#be123c" />
        <rect x="54" y="108" width="2" height="22" fill="#f97316" />
        <rect x="53" y="132" width="4" height="6" fill="#fde047" />

        <rect x="42" y="104" width="6" height="26" fill="#881337" />
        <rect x="44" y="108" width="4" height="20" fill="#e11d48" />
        <rect x="42" y="128" width="6" height="6" fill="#fde047" />
        <rect x="44" y="132" width="3" height="3" fill="#ffffff" />

        <rect x="62" y="104" width="6" height="26" fill="#881337" />
        <rect x="62" y="108" width="4" height="20" fill="#e11d48" />
        <rect x="62" y="128" width="6" height="6" fill="#fde047" />
        <rect x="63" y="132" width="3" height="3" fill="#ffffff" />
      </g>

      {/* Alas flamígeras en abanico ardiente */}
      <g className="pixel-phoenix-wings">
        <rect x="8" y="44" width="24" height="6" fill="#881337" />
        <rect x="6" y="50" width="26" height="8" fill="#be123c" />
        <rect x="4" y="58" width="28" height="12" fill="#e11d48" />
        <rect x="2" y="70" width="30" height="14" fill="#ea580c" />
        <rect x="4" y="84" width="26" height="12" fill="#f97316" />
        <rect x="8" y="96" width="18" height="8" fill="#fde047" />
        <rect x="2" y="74" width="4" height="8" fill="#fde047" />
        <rect x="0" y="78" width="3" height="6" fill="#ffffff" />

        <rect x="78" y="44" width="24" height="6" fill="#881337" />
        <rect x="78" y="50" width="26" height="8" fill="#be123c" />
        <rect x="78" y="58" width="28" height="12" fill="#e11d48" />
        <rect x="78" y="70" width="30" height="14" fill="#ea580c" />
        <rect x="80" y="84" width="26" height="12" fill="#f97316" />
        <rect x="84" y="96" width="18" height="8" fill="#fde047" />
        <rect x="104" y="74" width="4" height="8" fill="#fde047" />
        <rect x="107" y="78" width="3" height="6" fill="#ffffff" />
      </g>

      {/* Garras rapaces doradas */}
      <g className="pixel-phoenix-legs">
        <rect x="38" y="114" width="10" height="14" fill="#d97706" />
        <rect x="36" y="126" width="14" height="6" fill="#f59e0b" />
        <rect x="34" y="130" width="3" height="4" fill="#ffffff" />
        <rect x="39" y="131" width="3" height="4" fill="#ffffff" />
        <rect x="44" y="130" width="3" height="4" fill="#ffffff" />

        <rect x="62" y="114" width="10" height="14" fill="#d97706" />
        <rect x="60" y="126" width="14" height="6" fill="#f59e0b" />
        <rect x="60" y="130" width="3" height="4" fill="#ffffff" />
        <rect x="65" y="131" width="3" height="4" fill="#ffffff" />
        <rect x="70" y="130" width="3" height="4" fill="#ffffff" />
      </g>

      {/* Torso esbelto aviar de fuego incandescente */}
      <g className="pixel-phoenix-torso">
        <rect x="34" y="68" width="42" height="44" fill="#881337" />
        <rect x="36" y="70" width="38" height="40" fill="#be123c" />
        <rect x="40" y="72" width="30" height="34" fill="#e11d48" />

        <rect x="44" y="74" width="22" height="24" fill="#ea580c" />
        <rect x="46" y="76" width="18" height="18" fill="#f97316" />
        <rect x="48" y="78" width="14" height="12" fill="#fde047" />
        <rect x="51" y="80" width="8" height="6" fill="#ffffff" />
      </g>

      {/* Cabeza solar con cresta de tres llamaradas */}
      <g className="pixel-phoenix-head">
        <rect x="52" y="10" width="6" height="18" fill="#f97316" />
        <rect x="53" y="12" width="4" height="14" fill="#fde047" />
        <rect x="54" y="14" width="2" height="8" fill="#ffffff" />
        <rect x="44" y="16" width="6" height="14" fill="#ea580c" />
        <rect x="46" y="18" width="4" height="10" fill="#fde047" />
        <rect x="60" y="16" width="6" height="14" fill="#ea580c" />
        <rect x="60" y="18" width="4" height="10" fill="#fde047" />

        <rect x="36" y="28" width="38" height="38" fill="#881337" />
        <rect x="38" y="30" width="34" height="34" fill="#be123c" />
        <rect x="40" y="32" width="30" height="28" fill="#e11d48" />

        {/* Ojos dorados solares */}
        <g className="svg-creature-eyes">
          {isDefeated ? (
            <>
              <rect x="40" y="40" width="3" height="3" fill="#881337" />
              <rect x="43" y="43" width="3" height="3" fill="#881337" />
              <rect x="46" y="46" width="3" height="3" fill="#881337" />
              <rect x="46" y="40" width="3" height="3" fill="#881337" />
              <rect x="40" y="46" width="3" height="3" fill="#881337" />

              <rect x="61" y="40" width="3" height="3" fill="#881337" />
              <rect x="64" y="43" width="3" height="3" fill="#881337" />
              <rect x="67" y="46" width="3" height="3" fill="#881337" />
              <rect x="67" y="40" width="3" height="3" fill="#881337" />
              <rect x="61" y="46" width="3" height="3" fill="#881337" />
            </>
          ) : isLaughing ? (
            <>
              <rect x="38" y="42" width="10" height="3" fill="#881337" />
              <rect x="40" y="43" width="6" height="2" fill="#fde047" />

              <rect x="62" y="42" width="10" height="3" fill="#881337" />
              <rect x="64" y="43" width="6" height="2" fill="#fde047" />
            </>
          ) : (
            <>
              <rect x="39" y="40" width="9" height="8" fill="#d97706" />
              <rect x="40" y="41" width="7" height="6" fill="#fde047" />
              <rect x="43" y="42" width="2" height="4" fill="#0f172a" />
              <rect x="41" y="41" width="2" height="2" fill="#ffffff" />

              <rect x="62" y="40" width="9" height="8" fill="#d97706" />
              <rect x="63" y="41" width="7" height="6" fill="#fde047" />
              <rect x="65" y="42" width="2" height="4" fill="#0f172a" />
              <rect x="64" y="41" width="2" height="2" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Pico ganchudo de fénix dorado */}
        <g className="svg-creature-mouth">
          <rect x="48" y="50" width="14" height="12" fill="#b45309" />
          <rect x="50" y="52" width="10" height="10" fill="#facc15" />
          <rect x="52" y="60" width="6" height="5" fill="#fde047" />
          <rect x="54" y="64" width="3" height="3" fill="#ca8a04" />
          {isLaughing && <rect x="50" y="56" width="10" height="4" fill="#881337" />}
        </g>
      </g>
    </g>
  );
};

/* =========================================================================
   COMPONENTE PRINCIPAL: CREATURE SVG
   ========================================================================= */

export const CreatureSvg = ({
  levelId,
  mood = "idle",
  action = "idle",
  graphicStyle = "pixel",
}) => {
  const creature = getCreature(levelId);
  const isPixel = graphicStyle === "pixel";
  const isCyclops = creature.id === "cyclops";
  const isSlime = creature.id === "slime";
  const isKraken = creature.id === "kraken";

  if (isPixel) {
    let pixelBody = null;
    switch (creature.id) {
      case "slime":
        pixelBody = <PixelSlime creature={creature} mood={mood} />;
        break;
      case "werewolf":
        pixelBody = <PixelWerewolf creature={creature} mood={mood} />;
        break;
      case "goblin":
        pixelBody = <PixelGoblin creature={creature} mood={mood} />;
        break;
      case "troll":
        pixelBody = <PixelTroll creature={creature} mood={mood} />;
        break;
      case "dragon":
        pixelBody = <PixelDragon creature={creature} mood={mood} />;
        break;
      case "cyclops":
        pixelBody = <PixelCyclops creature={creature} mood={mood} />;
        break;
      case "griffin":
        pixelBody = <PixelGriffin creature={creature} mood={mood} />;
        break;
      case "minotaur":
        pixelBody = <PixelMinotaur creature={creature} mood={mood} />;
        break;
      case "kraken":
        pixelBody = <PixelKraken creature={creature} mood={mood} />;
        break;
      case "phoenix":
        pixelBody = <PixelPhoenix creature={creature} mood={mood} />;
        break;
      default:
        pixelBody = <PixelGoblin creature={creature} mood={mood} />;
        break;
    }

    return (
      <svg
        className={`character-svg creature-svg creature-svg--${creature.id} creature-svg--${mood} creature-svg--${action} creature-svg--pixel`}
        viewBox="0 0 110 150"
        aria-hidden="true"
      >
        <ellipse className="svg-shadow" cx="55" cy="143" rx="28" ry="5" />
        <g className="svg-character-body">{pixelBody}</g>
      </svg>
    );
  }

  return (
    <svg
      className={`character-svg creature-svg creature-svg--${creature.id} creature-svg--${mood} creature-svg--${action} creature-svg--${graphicStyle}`}
      viewBox="0 0 110 150"
      aria-hidden="true"
    >
      <FantasyGradients creature={creature} />
      <ellipse className="svg-shadow" cx="55" cy="143" rx="28" ry="5" />

      <g className="svg-character-body">
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
      </g>
    </svg>
  );
};

