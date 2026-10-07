import React from "react";

export const HEROES = [
  { id: "hunter", name: "Hunter" },
  { id: "knight", name: "Knight" },
  { id: "mage", name: "Mage" },
];

export const CREATURES = {
  1: { id: "slime", name: "Forest Slime", color: "#65a30d", accent: "#bef264", dark: "#3f6212" },
  2: { id: "werewolf", name: "Werewolf", color: "#8a6a52", accent: "#c4a484", dark: "#4a3525" },
  3: { id: "goblin", name: "Goblin", color: "#4d7c0f", accent: "#a3e635", dark: "#274005" },
  4: { id: "troll", name: "Stone Troll", color: "#64748b", accent: "#cbd5e1", dark: "#334155" },
  5: { id: "dragon", name: "Fire Dragon", color: "#b91c1c", accent: "#fb923c", dark: "#7f1d1d" },
  6: { id: "cyclops", name: "Cyclops", color: "#7c3aed", accent: "#c4b5fd", dark: "#4c1d95" },
  7: { id: "griffin", name: "Griffin", color: "#a16207", accent: "#fde68a", dark: "#603b03" },
  8: { id: "minotaur", name: "Minotaur", color: "#78350f", accent: "#d6d3d1", dark: "#451a03" },
  9: { id: "kraken", name: "Kraken", color: "#0f766e", accent: "#5eead4", dark: "#093d39" },
  10: { id: "phoenix", name: "Phoenix", color: "#ea580c", accent: "#fde047", dark: "#9a3412" },
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
          <polygon points="26,50 16,10 46,38" fill={creature.dark} />
          <polygon points="28,46 22,18 42,38" fill="#fbcfe8" />
          <polygon points="84,50 94,10 64,38" fill={creature.dark} />
          <polygon points="82,46 88,18 68,38" fill="#fbcfe8" />
          <path d="M22 68l-8 10 9 2M88 68l8 10-9 2" stroke={creature.dark} strokeWidth="3" fill="none" />
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
