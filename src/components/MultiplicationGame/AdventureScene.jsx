import React from "react";
import {
  CreatureSvg,
  getCreature,
  HEROES,
  HeroSvg,
} from "./CharacterSvg";

const HeroSlot = ({ id, pose, combat }) => (
  <div
    className={`hero-slot hero-slot--${pose} ${
      combat === "hit" ? "hero-slot--attack" : ""
    } ${combat === "miss" ? "hero-slot--miss" : ""}`}
    data-pose={pose}
  >
    <HeroSvg
      id={id}
      action={
        combat === "hit"
          ? "attack"
          : combat === "miss"
            ? "miss"
            : pose === "jump"
              ? "celebrate"
              : "idle"
      }
    />
  </div>
);

const CreatureSlot = ({
  levelId,
  mood,
  action,
  hp,
  maxHp,
  showHealth,
}) => {
  const creature = getCreature(levelId);
  return (
  <div className="demon-slot">
    {mood === "laughing" && <p className="demon-speech">Try again</p>}
    {action === "miss" && <p className="combat-callout">Miss</p>}
    <div
      className={`demon-figure demon-figure--${mood} ${
        action === "hit" ? "demon-figure--hit" : ""
      } ${action === "miss" ? "demon-figure--dodge" : ""}`}
      data-creature={creature.id}
      data-creature-mood={mood}
    >
      <CreatureSvg levelId={levelId} mood={mood} action={action || "idle"} />
    </div>
    <p className="adventure-scene__name">{creature.name}</p>
    {showHealth && (
      <div
        className="demon-health"
        role="meter"
        aria-label={`${creature.name} health`}
        aria-valuemin={0}
        aria-valuemax={maxHp}
        aria-valuenow={hp}
      >
        <span style={{ width: `${maxHp ? (hp / maxHp) * 100 : 0}%` }} />
      </div>
    )}
  </div>
  );
};

const AdventureScene = ({
  mode,
  heroId,
  selectedHero,
  onSelect,
  hp = 0,
  maxHp = 1,
  combat = null,
  levelId = 2,
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
              <HeroSvg
                id={hero.id}
                action={selectedHero === hero.id ? "selected" : "idle"}
              />
            </button>
          ))}
        </div>
        <CreatureSlot levelId={levelId} mood="smile" showHealth={false} />
      </section>
    );
  }

  return (
    <section
      className={`adventure-scene adventure-scene--${mode}`}
      data-scene={mode}
      data-hero={heroId}
    >
      <HeroSlot
        id={heroId}
        pose={pose}
        combat={mode === "battle" ? combat : null}
      />
      <CreatureSlot
        levelId={levelId}
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
