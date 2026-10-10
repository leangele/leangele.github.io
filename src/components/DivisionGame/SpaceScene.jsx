import React from "react";
import {
  SPACE_WARRIORS,
  SpaceHeroSvg,
  AlienSvg,
  getAlien,
} from "./SpaceCharacterSvg";

const SpaceHeroSlot = ({ id, pose, combat, graphicStyle = "pixel" }) => (
  <div className={`hero-slot hero-slot--${id} hero-slot--${pose}`}>
    <SpaceHeroSvg id={id} pose={pose} combat={combat} graphicStyle={graphicStyle} />
  </div>
);

const AlienSlot = ({
  levelId,
  mood,
  action,
  hp,
  maxHp,
  showHealth,
  graphicStyle = "pixel",
  isAdvance = false,
}) => {
  const alien = getAlien(levelId, isAdvance);
  const isWounded = Boolean(showHealth && maxHp > 0 && hp < maxHp && hp > 0);
  const isCritical = Boolean(isWounded && hp / maxHp <= 0.4);
  const healthClass = isCritical
    ? "demon-figure--critical demon-figure--wounded"
    : isWounded
      ? "demon-figure--wounded"
      : "";

  return (
    <div className="demon-slot alien-slot">
      {mood === "laughing" && <p className="demon-speech alien-speech">BZZZT!</p>}
      {action === "miss" && <p className="combat-callout floating-miss">Evaded</p>}
      <div
        className={`demon-figure alien-figure demon-figure--${mood} ${alien.evolved ? "demon-figure--evolved" : ""} ${healthClass} ${
          action === "hit" ? "demon-figure--hit damaged" : ""
        } ${action === "miss" ? "demon-figure--dodge" : ""}`}
        data-creature={alien.baseId || alien.id}
        data-creature-mood={mood}
        data-creature-evolved={alien.evolved ? "true" : undefined}
        data-health-state={isCritical ? "critical" : isWounded ? "wounded" : "full"}
      >
        <AlienSvg
          levelId={levelId}
          mood={mood}
          action={action || "idle"}
          graphicStyle={graphicStyle}
          isAdvance={isAdvance}
        />
      </div>
      <p className="adventure-scene__name alien-name">
        {alien.name}
        {alien.evolved && (
          <span className="creature-badge creature-badge--evolved alien-badge--evolved">
            PRIME
          </span>
        )}
      </p>
      {showHealth && (
        <div
          className="demon-health alien-health"
          role="meter"
          aria-label={`${alien.name} health`}
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

const SpaceScene = ({
  mode,
  heroId = "ranger",
  selectedHero,
  onSelect,
  hp = 0,
  maxHp = 1,
  combat = null,
  levelId = 1,
  graphicStyle = "pixel",
  playMode = "battle",
  isAdvance = false,
}) => {
  const isEvolved = isAdvance || playMode === "advance";
  const pose = mode === "victory" ? "jump" : mode === "defeat" ? "gone" : "ready";
  const alienMood = mode === "victory" ? "defeated" : mode === "defeat" ? "laughing" : "idle";

  if (mode === "select") {
    return (
      <section
        className={`adventure-scene space-scene space-scene--select space-scene--${graphicStyle}`}
        data-scene="select"
        data-style={graphicStyle}
      >
        {/* Fondo de estrellas animadas */}
        <div className="space-starfield" aria-hidden="true" />
        <div className="hero-choices space-warrior-choices">
          {SPACE_WARRIORS.map((hero) => (
            <button
              key={hero.id}
              type="button"
              className={`hero-choice space-choice ${selectedHero === hero.id ? "hero-choice--selected space-choice--selected" : ""}`}
              aria-pressed={selectedHero === hero.id}
              onClick={() => onSelect(hero.id)}
            >
              <span className="space-choice__title">{hero.name}</span>
              <SpaceHeroSvg
                id={hero.id}
                graphicStyle={graphicStyle}
                pose={selectedHero === hero.id ? "selected" : "idle"}
              />
              <small className="space-choice__role">{hero.role}</small>
            </button>
          ))}
        </div>
        <AlienSlot
          levelId={levelId}
          mood="smile"
          showHealth={false}
          graphicStyle={graphicStyle}
          isAdvance={isEvolved}
        />
      </section>
    );
  }

  return (
    <section
      className={`adventure-scene space-scene space-scene--${mode} space-scene--${graphicStyle}`}
      data-scene={mode}
      data-hero={heroId}
      data-style={graphicStyle}
    >
      {/* Fondo espacial y plataforma holo-escénica */}
      <div className="space-starfield" aria-hidden="true" />
      <div className="battle-arena-stage space-arena-stage" aria-hidden="true" />

      <SpaceHeroSlot
        id={heroId}
        pose={pose}
        combat={mode === "battle" ? combat : null}
        graphicStyle={graphicStyle}
      />

      {/* Efectos de combate de ciencia ficción */}
      {mode === "battle" && heroId === "ranger" && (combat === "hit" || combat === "miss") && (
        <span
          className={`space-laser-bolt ${combat === "miss" ? "space-laser-bolt--miss" : ""}`}
          aria-hidden="true"
        />
      )}
      {mode === "battle" && heroId === "guardian" && combat === "hit" && (
        <span className="space-plasma-slash" aria-hidden="true" />
      )}
      {mode === "battle" && heroId === "psionic" && combat === "hit" && (
        <span className="space-quantum-burst" aria-hidden="true" />
      )}

      <AlienSlot
        levelId={levelId}
        mood={alienMood}
        action={mode === "battle" ? combat : null}
        hp={hp}
        maxHp={maxHp}
        showHealth
        graphicStyle={graphicStyle}
        isAdvance={isEvolved}
      />
    </section>
  );
};

export default SpaceScene;
