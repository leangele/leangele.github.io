import React from "react";

export const HEROES = [
  { id: "warrior", name: "Warrior" },
  { id: "knight", name: "Knight" },
  { id: "mage", name: "Mage" },
];

const Face = ({ happy }) => (
  <g>
    <circle cx="34" cy="36" r="2" fill="#2b2118" />
    <circle cx="46" cy="36" r="2" fill="#2b2118" />
    {happy ? (
      <path d="M34 42c3 4 9 4 12 0" fill="none" stroke="#2b2118" strokeWidth="1.6" strokeLinecap="round" />
    ) : (
      <path d="M36 43h8" stroke="#2b2118" strokeWidth="1.6" strokeLinecap="round" />
    )}
  </g>
);

const HeroArt = ({ id, happy }) => {
  if (id === "knight") {
    return (
      <svg viewBox="0 0 80 120" aria-hidden="true">
        <ellipse cx="40" cy="112" rx="18" ry="4" fill="rgba(0,0,0,0.28)" />
        <path d="M22 50c8-8 28-8 36 0v28H22z" fill="#234e70" />
        <rect x="28" y="78" width="9" height="26" rx="3" fill="#4b5563" />
        <rect x="43" y="78" width="9" height="26" rx="3" fill="#4b5563" />
        <rect x="24" y="46" width="32" height="36" rx="6" fill="#d5dbe3" />
        <path d="M26 40c0-16 28-16 28 0v10H26z" fill="#eef2f6" />
        <rect x="32" y="34" width="16" height="5" rx="1" fill="#1f2937" />
        <path d="M48 16c6 2 8 12 4 18" fill="none" stroke="#9a3412" strokeWidth="4" strokeLinecap="round" />
        <path d="M6 58h20v18L16 88 6 76z" fill="#234e70" stroke="#e8b84a" strokeWidth="2" />
        <path d="M16 62v18M8 72h16" stroke="#e8b84a" strokeWidth="2" />
        <rect x="58" y="28" width="4" height="34" rx="1" fill="#e5e7eb" transform="rotate(18 60 46)" />
        <rect x="54" y="58" width="12" height="3" fill="#e8b84a" />
      </svg>
    );
  }

  if (id === "mage") {
    return (
      <svg viewBox="0 0 80 120" aria-hidden="true">
        <ellipse cx="40" cy="112" rx="18" ry="4" fill="rgba(0,0,0,0.28)" />
        <path d="M24 70c0-16 32-16 32 0v36H24z" fill="#5b2a86" />
        <circle cx="40" cy="40" r="13" fill="#f3c7a1" />
        <polygon points="40,2 54,30 26,30" fill="#4c1d95" />
        <circle cx="40" cy="6" r="3.5" fill="#e8b84a" />
        <Face happy={happy} />
        <path d="M28 46c4 6 20 6 24 0" fill="#f8f1e3" />
        <rect x="12" y="34" width="4" height="58" rx="2" fill="#6b3f24" />
        <circle cx="14" cy="30" r="6" fill="#67e8f9" stroke="#e8b84a" strokeWidth="2" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 80 120" aria-hidden="true">
      <ellipse cx="40" cy="112" rx="18" ry="4" fill="rgba(0,0,0,0.28)" />
      <rect x="30" y="80" width="8" height="24" rx="3" fill="#6b3f24" />
      <rect x="42" y="80" width="8" height="24" rx="3" fill="#6b3f24" />
      <rect x="26" y="50" width="28" height="34" rx="8" fill="#9a3412" />
      <rect x="26" y="66" width="28" height="5" fill="#e8b84a" />
      <circle cx="40" cy="38" r="14" fill="#f3c7a1" />
      <path d="M26 36c2-16 26-18 30-4-6-8-22-8-30 4z" fill="#5c3317" />
      <Face happy={happy} />
      <g transform="rotate(-28 62 50)">
        <rect x="58" y="18" width="5" height="38" rx="1" fill="#e5e7eb" />
        <rect x="53" y="52" width="15" height="4" rx="1" fill="#e8b84a" />
        <rect x="59" y="56" width="3" height="8" fill="#6b3f24" />
      </g>
    </svg>
  );
};

const WerewolfArt = ({ mood }) => (
  <svg viewBox="0 0 110 150" aria-hidden="true">
    <polygon points="28,52 18,16 46,42" fill="#6b5344" />
    <polygon points="82,52 92,16 64,42" fill="#6b5344" />
    <polygon points="30,48 24,24 42,42" fill="#e7c2b0" />
    <polygon points="80,48 86,24 68,42" fill="#e7c2b0" />
    <ellipse cx="55" cy="62" rx="28" ry="26" fill="#8a6a52" />
    <ellipse cx="55" cy="76" rx="16" ry="12" fill="#c4a484" />
    <ellipse cx="55" cy="74" rx="4" ry="3" fill="#2b2118" />
    <path d="M36 92c0-10 38-10 38 0v34c0 12-38 12-38 0z" fill="#6b5344" />
    <path d="M38 94h34l-6 18H44z" fill="#374151" />
    <path d="M34 104c-16 6-18 22-8 30" fill="none" stroke="#6b5344" strokeWidth="10" strokeLinecap="round" />
    <path d="M76 104c16 6 18 22 8 30" fill="none" stroke="#6b5344" strokeWidth="10" strokeLinecap="round" />
    <path d="M20 132l-7 8M26 136l-2 8M32 134l3 8" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
    <path d="M90 132l7 8M84 136l2 8M78 134l-3 8" stroke="#f8fafc" strokeWidth="2" strokeLinecap="round" />
    <rect x="40" y="122" width="10" height="20" rx="4" fill="#5c4638" />
    <rect x="60" y="122" width="10" height="20" rx="4" fill="#5c4638" />
    {mood === "defeated" ? (
      <g stroke="#1c0a0a" strokeWidth="2.4" strokeLinecap="round">
        <path d="M38 56l10 10M48 56L38 66" />
        <path d="M62 56l10 10M72 56L62 66" />
      </g>
    ) : mood === "laughing" ? (
      <g fill="none" stroke="#1c0a0a" strokeWidth="2.4" strokeLinecap="round">
        <path d="M36 60c4-8 12-8 16 0" />
        <path d="M58 60c4-8 12-8 16 0" />
      </g>
    ) : (
      <g>
        <ellipse cx="44" cy="60" rx="6" ry="7" fill="#fde68a" />
        <ellipse cx="68" cy="60" rx="6" ry="7" fill="#fde68a" />
        <circle cx="44" cy="61" r="2.4" fill="#1c0a0a" />
        <circle cx="68" cy="61" r="2.4" fill="#1c0a0a" />
      </g>
    )}
    {mood === "laughing" ? (
      <path d="M42 82c5 10 16 10 22 0v6c-6 5-16 5-22 0z" fill="#1c0a0a" />
    ) : (
      <path d="M46 84h6l-3 7zm12 0h6l-3 7z" fill="#f8fafc" />
    )}
  </svg>
);

const HeroSlot = ({ id, pose, attacking }) => (
  <div
    className={`hero-slot hero-slot--${pose} ${attacking ? "hero-slot--attack" : ""}`}
    data-pose={pose}
  >
    <HeroArt id={id} happy={pose === "jump" || attacking} />
  </div>
);

const DemonSlot = ({ mood, action, hp, maxHp, showHealth }) => (
  <div className="demon-slot">
    {mood === "laughing" && <p className="demon-speech">Try again</p>}
    {action === "miss" && <p className="combat-callout">Miss</p>}
    <div
      className={`demon-figure demon-figure--${mood} ${
        action === "hit" ? "demon-figure--hit" : ""
      } ${action === "miss" ? "demon-figure--dodge" : ""}`}
      data-demon={mood}
    >
      <WerewolfArt mood={mood} />
    </div>
    <p className="adventure-scene__name">Werewolf</p>
    {showHealth && (
      <div
        className="demon-health"
        role="meter"
        aria-label="Werewolf health"
        aria-valuemin={0}
        aria-valuemax={maxHp}
        aria-valuenow={hp}
      >
        <span style={{ width: `${maxHp ? (hp / maxHp) * 100 : 0}%` }} />
      </div>
    )}
  </div>
);

const AdventureScene = ({
  mode,
  heroId,
  selectedHero,
  onSelect,
  hp = 0,
  maxHp = 1,
  combat = null,
}) => {
  const pose = mode === "victory" ? "jump" : mode === "defeat" ? "gone" : "ready";
  const demonMood = mode === "victory" ? "defeated" : mode === "defeat" ? "laughing" : "idle";

  if (mode === "select") {
    return (
      <section className="adventure-scene adventure-scene--select" data-scene="select">
        <div className="hero-choices">
          {HEROES.map((hero) => (
            <button
              key={hero.id}
              type="button"
              className={`hero-choice ${selectedHero === hero.id ? "hero-choice--selected" : ""}`}
              aria-pressed={selectedHero === hero.id}
              onClick={() => onSelect(hero.id)}
            >
              <span>{hero.name}</span>
              <HeroArt id={hero.id} happy={selectedHero === hero.id} />
            </button>
          ))}
        </div>
        <DemonSlot mood="idle" showHealth={false} />
      </section>
    );
  }

  return (
    <section
      className={`adventure-scene adventure-scene--${mode}`}
      data-scene={mode}
      data-hero={heroId}
    >
      <HeroSlot id={heroId} pose={pose} attacking={mode === "battle" && combat === "hit"} />
      <DemonSlot
        mood={demonMood}
        action={mode === "battle" ? combat : null}
        hp={hp}
        maxHp={maxHp}
        showHealth
      />
    </section>
  );
};

export default AdventureScene;
