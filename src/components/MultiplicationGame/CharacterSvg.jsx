import React from "react";

export const HEROES = [
  { id: "hunter", name: "Hunter" },
  { id: "knight", name: "Knight" },
  { id: "mage", name: "Mage" },
];

export const CREATURES = {
  1: { id: "slime", name: "Forest Slime", color: "#65a30d", accent: "#bef264" },
  2: { id: "werewolf", name: "Werewolf", color: "#8a6a52", accent: "#c4a484" },
  3: { id: "goblin", name: "Goblin", color: "#4d7c0f", accent: "#a3e635" },
  4: { id: "troll", name: "Stone Troll", color: "#64748b", accent: "#cbd5e1" },
  5: { id: "dragon", name: "Fire Dragon", color: "#b91c1c", accent: "#fb923c" },
  6: { id: "cyclops", name: "Cyclops", color: "#7c3aed", accent: "#c4b5fd" },
  7: { id: "griffin", name: "Griffin", color: "#a16207", accent: "#fde68a" },
  8: { id: "minotaur", name: "Minotaur", color: "#78350f", accent: "#d6d3d1" },
  9: { id: "kraken", name: "Kraken", color: "#0f766e", accent: "#5eead4" },
  10: { id: "phoenix", name: "Phoenix", color: "#ea580c", accent: "#fde047" },
};

export const getCreature = (levelId) =>
  CREATURES[Number(levelId)] || {
    id: "ancient-beast",
    name: `Ancient Beast ${levelId}`,
    color: "#6d28d9",
    accent: "#ddd6fe",
  };

const heroArt = {
  hunter: "hunter.svg",
  knight: "knight.svg",
  mage: "mage.svg",
};

export const HeroSvg = ({ id, action = "idle" }) => (
  <img
    className={`character-svg hero-svg hero-svg--${id} hero-svg--${action}`}
    src={`${process.env.PUBLIC_URL || ""}/assets/${heroArt[id] || heroArt.hunter}`}
    alt=""
    draggable="false"
  />
);

const CreatureEyes = ({ mood, single = false }) => {
  if (mood === "defeated") {
    return (
      <g className="svg-creature-eyes" stroke="#1c0a0a" strokeWidth="2.4" strokeLinecap="round">
        <path d={single ? "M50 52l10 10M60 52L50 62" : "M38 52l10 10M48 52L38 62"} />
        {!single && <path d="M62 52l10 10M72 52L62 62" />}
      </g>
    );
  }

  if (mood === "laughing" || mood === "smile") {
    return (
      <g className="svg-creature-eyes" fill="none" stroke="#1c0a0a" strokeWidth="2.4" strokeLinecap="round">
        <path d={single ? "M48 58c5-9 13-9 18 0" : "M36 58c4-8 12-8 16 0"} />
        {!single && <path d="M58 58c4-8 12-8 16 0" />}
      </g>
    );
  }

  return (
    <g className="svg-creature-eyes">
      {single ? (
        <>
          <ellipse cx="57" cy="58" rx="11" ry="12" fill="#fde68a" />
          <circle cx="57" cy="59" r="4" fill="#1c0a0a" />
        </>
      ) : (
        <>
          <ellipse cx="44" cy="58" rx="6" ry="7" fill="#fde68a" />
          <ellipse cx="68" cy="58" rx="6" ry="7" fill="#fde68a" />
          <circle cx="44" cy="59" r="2.4" fill="#1c0a0a" />
          <circle cx="68" cy="59" r="2.4" fill="#1c0a0a" />
        </>
      )}
    </g>
  );
};

const CreatureFeature = ({ creature }) => {
  switch (creature.id) {
    case "slime":
      return <path d="M27 86c0-26 10-42 28-42s28 16 28 42c0 18-56 18-56 0z" fill={creature.color} />;
    case "werewolf":
      return (
        <>
          <polygon points="28,50 18,14 46,40" fill={creature.color} />
          <polygon points="82,50 92,14 64,40" fill={creature.color} />
          <polygon points="30,46 24,22 42,40" fill="#e7c2b0" />
          <polygon points="80,46 86,22 68,40" fill="#e7c2b0" />
        </>
      );
    case "goblin":
      return (
        <>
          <polygon points="30,54 4,42 32,68" fill={creature.color} />
          <polygon points="80,54 106,42 78,68" fill={creature.color} />
        </>
      );
    case "troll":
      return <path d="M28 45l9-18 8 14 10-19 10 19 9-14 8 18" fill={creature.accent} />;
    case "dragon":
      return (
        <>
          <path d="M30 82L4 58l25 4M80 82l26-24-25 4" fill={creature.accent} />
          <path d="M44 38l11-22 11 22" fill={creature.accent} />
        </>
      );
    case "cyclops":
      return <path d="M36 42l8-20 11 16 11-16 8 20" fill={creature.accent} />;
    case "griffin":
      return (
        <>
          <path d="M32 80L5 58l24 4M78 80l27-22-24 4" fill={creature.accent} />
          <path d="M47 44l16-8-7 14z" fill="#f59e0b" />
        </>
      );
    case "minotaur":
      return (
        <>
          <path d="M36 48C12 42 8 20 20 18c2 15 10 20 22 18" fill={creature.accent} />
          <path d="M74 48c24-6 28-28 16-30-2 15-10 20-22 18" fill={creature.accent} />
        </>
      );
    case "kraken":
      return (
        <g fill="none" stroke={creature.color} strokeWidth="10" strokeLinecap="round">
          <path d="M38 96c-26 8-28 34-14 42" />
          <path d="M50 98c-12 18-8 36 2 42" />
          <path d="M66 98c12 18 8 36-2 42" />
          <path d="M78 96c26 8 28 34 14 42" />
        </g>
      );
    case "phoenix":
      return (
        <>
          <path d="M34 82L4 56l26 5M76 82l30-26-26 5" fill={creature.accent} />
          <path d="M42 42l13-28 13 28-13-8z" fill={creature.accent} />
        </>
      );
    default:
      return <path d="M34 44l10-22 11 17 11-17 10 22" fill={creature.accent} />;
  }
};

export const CreatureSvg = ({ levelId, mood = "idle", action = "idle" }) => {
  const creature = getCreature(levelId);
  const isCyclops = creature.id === "cyclops";
  const isSlime = creature.id === "slime";
  const isKraken = creature.id === "kraken";

  return (
    <svg
      className={`character-svg creature-svg creature-svg--${creature.id} creature-svg--${mood} creature-svg--${action}`}
      viewBox="0 0 110 150"
      aria-hidden="true"
    >
      <ellipse className="svg-shadow" cx="55" cy="143" rx="28" ry="5" />
      <g className="svg-character-body">
        <CreatureFeature creature={creature} />
        {!isSlime && !isKraken && (
          <path d="M35 88c0-12 40-12 40 0v40c0 14-40 14-40 0z" fill={creature.color} />
        )}
        <ellipse
          cx="55"
          cy={isSlime ? 72 : 60}
          rx={isSlime ? 25 : 28}
          ry={isSlime ? 22 : 26}
          fill={creature.color}
        />
        <ellipse cx="55" cy={isSlime ? 84 : 76} rx="16" ry="11" fill={creature.accent} />
        <CreatureEyes mood={mood} single={isCyclops} />
        <path
          className="svg-creature-mouth"
          d={
            mood === "laughing" || mood === "smile"
              ? "M43 78c5 11 18 11 24 0v8c-7 6-18 6-24 0z"
              : "M47 82h6l-3 8zm11 0h6l-3 8z"
          }
          fill="#1c0a0a"
        />
        {!isSlime && !isKraken && (
          <>
            <path d="M34 102c-16 6-18 23-8 31" fill="none" stroke={creature.color} strokeWidth="10" strokeLinecap="round" />
            <path d="M76 102c16 6 18 23 8 31" fill="none" stroke={creature.color} strokeWidth="10" strokeLinecap="round" />
          </>
        )}
      </g>
    </svg>
  );
};
