import React, { useEffect, useRef, useState } from "react";
import { audioEngine } from "../../audioEngine";
import SpaceScene from "./SpaceScene";
import { getAlien } from "./SpaceCharacterSvg";
import {
  passedChallenge,
  playBetweenQuestions,
  startCombatMusic,
  startSelectMusic,
  stopCombatMusic,
  unlockGameAudio,
} from "../MultiplicationGame/gameAudio";
import "../MultiplicationGame/MultiplicationGame.css";
import "../../adventure-game.css";
import "./DivisionGame.css";
import {
  HISTORY_KEY,
  appendDivisionGame,
  createAdvanceDivisionQuestions,
  createDivisionQuestions,
  digitHint,
  digitOptions,
  factOptions,
  levelFromSearch,
  practicePrompts,
  remainderMeaning,
  remainderOptions,
  topDivisionScores,
} from "./divisionProblems";

const SOUND_KEY = "division-game-sound";
const STYLE_KEY = "division-game-style";
const BEST_TIME_KEY = "division-game-best-times";
const ADVANCE_BEST_TIME_KEY = "division-game-advance-best-times";

const SCORE_CATEGORIES = [
  { id: "score", label: "Highest score" },
  { id: "time", label: "Best time" },
  { id: "both", label: "Best overall" },
];

const formatRoundTime = (milliseconds) =>
  `${(Math.max(0, Number(milliseconds) || 0) / 1000).toFixed(1)}s`;

const formatStamp = (date) =>
  date.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });

const slideDuration = (slideMs) => {
  if (typeof window.matchMedia !== "function") {
    return slideMs;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : slideMs;
};

const readJson = (key, fallback) => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "");
    return parsed ?? fallback;
  } catch (error) {
    return fallback;
  }
};

const writeJson = (key, value) => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // The round still finishes when storage is blocked.
  }
};

const readSound = (configSounds) => {
  try {
    const saved = window.localStorage.getItem(SOUND_KEY);
    if (saved === "on") return true;
    if (saved === "off") return false;
  } catch (error) {
    // Private browsing can block storage.
  }
  return configSounds !== false;
};

const readStyle = (configuredStyle) => {
  try {
    const styleParam = new URLSearchParams(window.location.search).get("style");
    if (styleParam === "pixel" || styleParam === "fantasy") return styleParam;
    const saved = window.localStorage.getItem(STYLE_KEY);
    if (saved === "pixel" || saved === "fantasy") return saved;
  } catch (error) {
    // Private browsing can block storage.
  }
  return configuredStyle;
};

let gameSeq = 0;

const DivisionGame = ({ onExit } = {}) => {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");
  const [level, setLevel] = useState(null);
  const [heroId, setHeroId] = useState("ranger");
  const [graphicStyle, setGraphicStyle] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPage, setMenuPage] = useState("main");
  const [scoreCategory, setScoreCategory] = useState("score");
  const [history, setHistory] = useState([]);
  const [playMode, setPlayMode] = useState("battle");
  const [hasStarted, setHasStarted] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [choices, setChoices] = useState([]);
  const [hint, setHint] = useState("");
  const [chosen, setChosen] = useState(null);
  const [locked, setLocked] = useState(false);
  const [doneSteps, setDoneSteps] = useState([]);
  const [meaning, setMeaning] = useState("");
  const [combat, setCombat] = useState(null);
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [roundTimeMs, setRoundTimeMs] = useState(0);
  const [liveMs, setLiveMs] = useState(0);
  const [bestTimeMs, setBestTimeMs] = useState(null);
  const [beatRecord, setBeatRecord] = useState(false);
  const [bestSetAt, setBestSetAt] = useState("");
  const soundRef = useRef(true);
  const missedRef = useRef(false);
  const lockedRef = useRef(false);
  const startedAtRef = useRef(0);
  const answerRef = useRef(() => {});
  soundRef.current = soundOn;

  useEffect(() => {
    const configUrl = `${process.env.PUBLIC_URL || ""}/data/division-game.json`;
    fetch(configUrl)
      .then((response) => {
        if (!response.ok) throw new Error("Could not load the game configuration.");
        return response.json();
      })
      .then((gameConfig) => {
        const enabled = readSound(gameConfig.sounds);
        const style = readStyle(gameConfig.graphicStyle);
        soundRef.current = enabled;
        audioEngine.isMuted = !enabled;
        audioEngine.setGraphicStyle(style);
        setSoundOn(enabled);
        setGraphicStyle(style);
        setConfig(gameConfig);
        setLevel(levelFromSearch(gameConfig, window.location.search));
        setHistory(readJson(HISTORY_KEY, []));
      })
      .catch(() => setError("Could not load the game configuration."));
  }, []);

  useEffect(() => () => stopCombatMusic(), []);

  const question = questions[questionIndex];
  const prompts = question ? practicePrompts(question) : [];
  const prompt = playMode === "practice" ? prompts[stepIndex] : null;
  const roundTotal = questions.length || config?.questionsPerLevel || 0;
  const isAdvanceMode = playMode === "advance";
  const alien = getAlien(level?.id || 1, isAdvanceMode);

  useEffect(() => {
    const current = questions[questionIndex];
    if (!current || !config) {
      return;
    }
    if (playMode !== "practice") {
      setChoices(current.options || []);
      return;
    }
    const currentPrompt = practicePrompts(current)[stepIndex];
    if (!currentPrompt) {
      return;
    }
    const count = config.practiceAnswerChoices;
    if (currentPrompt.kind === "digit") {
      setChoices(digitOptions(currentPrompt.answer, count).map(String));
    } else if (currentPrompt.kind === "remainder") {
      setChoices(
        remainderOptions(currentPrompt.answer, current.divisor, count).map(String)
      );
    } else {
      setChoices(factOptions(currentPrompt.answer, count).map(String));
    }
  }, [config, playMode, questionIndex, questions, stepIndex]);

  const finishRound = (nextScore, total) => {
    const roundMs = Math.round(performance.now() - startedAtRef.current);
    const won = passedChallenge(nextScore, total, config.passPercent);
    const mode = playMode;
    if (mode !== "practice" && won) {
      const key = mode === "advance" ? ADVANCE_BEST_TIME_KEY : BEST_TIME_KEY;
      const records = readJson(key, {});
      const previous = Number(records[level.id]);
      const previousMs = Number.isFinite(previous) ? previous : null;
      const faster = previousMs == null || roundMs < previousMs;
      if (faster) {
        const setAt = formatStamp(new Date());
        records[level.id] = roundMs;
        writeJson(key, records);
        if (mode === "advance") writeJson(`${key}-set`, { ...(readJson(`${key}-set`, {})), [level.id]: setAt });
        setBestSetAt(mode === "advance" ? setAt : "");
        setBeatRecord(previousMs != null);
      } else {
        setBeatRecord(false);
        setBestSetAt(mode === "advance" ? readJson(`${ADVANCE_BEST_TIME_KEY}-set`, {})[level.id] || "" : "");
      }
      setBestTimeMs(faster ? roundMs : previousMs);
    } else {
      setBestTimeMs(null);
      setBeatRecord(false);
      setBestSetAt("");
    }
    const played = appendDivisionGame(readJson(HISTORY_KEY, []), {
      id: `${Date.now()}-${(gameSeq += 1)}`,
      mode,
      table: level.id,
      score: nextScore,
      total,
      timeMs: roundMs,
      setAt: formatStamp(new Date()),
    });
    writeJson(HISTORY_KEY, played);
    setHistory(played);
    setRoundTimeMs(roundMs);
    setIsFinished(true);
    if (soundRef.current) {
      if (won) audioEngine.playVictoryTheme();
      else audioEngine.playDefeatTheme();
    }
  };

  const goToNext = (nextScore) => {
    const total = questions.length;
    if (questionIndex >= total - 1) {
      finishRound(nextScore, total);
      return;
    }
    if (soundRef.current && playMode !== "practice") {
      playBetweenQuestions(graphicStyle);
    }
    setQuestionIndex((current) => current + 1);
    setStepIndex(0);
    setDoneSteps([]);
    setHint("");
    setChosen(null);
    setMeaning("");
    lockedRef.current = false;
    setLocked(false);
    setCombat(null);
    setSecondsLeft(config.secondsPerQuestion);
    missedRef.current = false;
  };

  const resolveAnswer = (wasCorrect, label) => {
    if (lockedRef.current || !question) return;
    lockedRef.current = true;
    setLocked(true);
    setChosen(label ?? null);
    setCombat(wasCorrect ? "hit" : "miss");
    if (wasCorrect) audioEngine.playAttackHit();
    else audioEngine.playMissSound();

    if (playMode !== "practice") {
      const nextScore = wasCorrect ? score + 1 : score;
      if (wasCorrect) setScore(nextScore);
      else {
        setMissedQuestions((current) => [
          ...current,
          { prompt: question.prompt, answer: question.answer, revealed: false },
        ]);
      }
      window.setTimeout(() => goToNext(nextScore), slideDuration(config.slideMs));
      return;
    }

    if (!wasCorrect) {
      missedRef.current = true;
      if (prompt?.kind === "digit") {
        setHint(digitHint(question.divisor, prompt.into, Number(label)));
      } else if (prompt?.kind === "fact") {
        setHint(
          digitHint(question.divisor, question.dividend, Number(label))
        );
      } else {
        setHint(`${question.quotient} groups, ${question.remainder} left over.`);
      }
    } else {
      setHint("");
    }

    window.setTimeout(() => {
      const step = question.steps[stepIndex];
      if (prompt?.kind === "digit" && step) {
        setDoneSteps((current) => [...current, step]);
      }
      if (prompt?.kind === "remainder") {
        setMeaning(remainderMeaning(question));
      }
      const lastPrompt = stepIndex >= prompts.length - 1;
      if (!lastPrompt) {
        setHint("");
        setStepIndex((current) => current + 1);
        setChosen(null);
        lockedRef.current = false;
        setLocked(false);
        setCombat(null);
        return;
      }
      const nextScore = missedRef.current ? score : score + 1;
      if (!missedRef.current) setScore(nextScore);
      else {
        setMissedQuestions((current) => [
          ...current,
          { prompt: question.prompt, answer: question.answer, revealed: false },
        ]);
      }
      goToNext(nextScore);
    }, slideDuration(config.slideMs));
  };

  answerRef.current = () => resolveAnswer(false, null);

  useEffect(() => {
    if (playMode === "practice" || !hasStarted || isFinished || locked) {
      return undefined;
    }
    if (secondsLeft === 0) {
      answerRef.current();
      return undefined;
    }
    const timer = window.setTimeout(() => setSecondsLeft((current) => current - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [secondsLeft, hasStarted, isFinished, playMode, locked, questionIndex]);

  useEffect(() => {
    if (!hasStarted || isFinished || playMode === "practice") return undefined;
    const timer = window.setInterval(() => {
      setLiveMs(performance.now() - startedAtRef.current);
    }, 200);
    return () => window.clearInterval(timer);
  }, [hasStarted, isFinished, playMode]);

  const startRound = (mode) => {
    if (mode === "advance" && level.id <= config.minLevel) return;
    setMenuOpen(false);
    setMenuPage("main");
    unlockGameAudio();
    if (soundRef.current) {
      if (mode === "practice") startSelectMusic();
      else audioEngine.playBattleTheme();
    } else {
      stopCombatMusic();
    }
    const nextQuestions =
      mode === "advance"
        ? createAdvanceDivisionQuestions(
            level,
            config.levels,
            config.questionsPerLevel,
            config.answerChoices
          )
        : createDivisionQuestions(
            level,
            config.questionsPerLevel,
            mode === "practice" ? config.practiceAnswerChoices : config.answerChoices
          );
    setPlayMode(mode);
    setQuestions(nextQuestions);
    setQuestionIndex(0);
    setScore(0);
    setSecondsLeft(config.secondsPerQuestion);
    setIsFinished(false);
    setHasStarted(true);
    setMissedQuestions([]);
    setStepIndex(0);
    setDoneSteps([]);
    setHint("");
    setChosen(null);
    lockedRef.current = false;
    setLocked(false);
    setMeaning("");
    setCombat(null);
    setRoundTimeMs(0);
    setLiveMs(0);
    setBeatRecord(false);
    setBestTimeMs(null);
    setBestSetAt("");
    missedRef.current = false;
    startedAtRef.current = performance.now();
  };

  const toggleSound = () => {
    const next = !soundRef.current;
    soundRef.current = next;
    audioEngine.isMuted = !next;
    setSoundOn(next);
    try {
      window.localStorage.setItem(SOUND_KEY, next ? "on" : "off");
    } catch (error) {
      // The button still works when storage is blocked.
    }
    if (!next) {
      stopCombatMusic();
      return;
    }
    unlockGameAudio();
    if (!hasStarted || playMode === "practice") startSelectMusic();
    else if (!isFinished) startCombatMusic();
    else if (passedChallenge(score, roundTotal, config.passPercent)) audioEngine.playVictoryTheme();
    else audioEngine.playDefeatTheme();
  };

  const toggleStyle = () => {
    const next = graphicStyle === "pixel" ? "fantasy" : "pixel";
    setGraphicStyle(next);
    audioEngine.setGraphicStyle(next);
    try {
      window.localStorage.setItem(STYLE_KEY, next);
    } catch (error) {
      // Storage might be blocked.
    }
    if (!soundRef.current) return;
    if (!hasStarted || playMode === "practice") startSelectMusic(next);
    else if (!isFinished) startCombatMusic(next);
    else if (passedChallenge(score, roundTotal, config.passPercent)) audioEngine.playVictoryTheme(next);
    else audioEngine.playDefeatTheme(next);
  };

  const selectLevel = (nextLevel) => {
    setMenuOpen(false);
    setMenuPage("main");
    if (nextLevel.id === level.id) return;
    setLevel(nextLevel);
    const params = new URLSearchParams(window.location.search);
    params.set("level", String(nextLevel.id));
    const query = params.toString();
    window.history.replaceState({}, "", `${window.location.pathname}?${query}`);
    if (hasStarted) {
      stopCombatMusic();
      if (soundRef.current) startSelectMusic();
      setHasStarted(false);
      setIsFinished(false);
      setQuestions([]);
      setPlayMode("battle");
    }
  };

  if (error) return <main className="math-game math-game--centered">{error}</main>;
  if (!config || !level || !graphicStyle) {
    return <main className="math-game math-game--centered">Loading game...</main>;
  }

  const stageClass = `math-game math-game--stage math-game--division math-game--style-${graphicStyle} math-game--realm-${alien.baseId || alien.id}`;
  const rows = topDivisionScores(history, scoreCategory);
  const menu = (
    <div className="game-menu">
      <button
        type="button"
        className="menu-button"
        aria-expanded={menuOpen}
        aria-label={menuOpen ? "Close menu" : "Open menu"}
        onClick={() => {
          setMenuOpen((open) => !open);
          setMenuPage("main");
        }}
      >
        <span className="menu-button__bars" aria-hidden="true" />
      </button>
      {menuOpen && (
        <>
          <button
            type="button"
            className="game-menu__backdrop"
            aria-label="Dismiss menu"
            onClick={() => {
              setMenuOpen(false);
              setMenuPage("main");
            }}
          />
          <div className="game-menu__panel" role="dialog" aria-label="Game menu">
            {menuPage === "scores" ? (
              <div>
                <button type="button" className="game-menu__back" onClick={() => setMenuPage("main")}>
                  Back
                </button>
                <h2>Best scores</h2>
                <div className="game-menu__categories" role="tablist" aria-label="Score categories">
                  {SCORE_CATEGORIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="tab"
                      aria-selected={scoreCategory === item.id}
                      className={`game-menu__category${scoreCategory === item.id ? " game-menu__category--current" : ""}`}
                      onClick={() => setScoreCategory(item.id)}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
                {rows.length === 0 ? (
                  <p className="game-menu__empty">No games yet.</p>
                ) : (
                  <ol className="game-menu__score-list">
                    {rows.map((game, index) => (
                      <li key={game.id} className="game-menu__score">
                        <span className="game-menu__rank">{index + 1}</span>
                        <span className="game-menu__score-copy">
                          <strong>
                            {game.score}/{game.total}
                            <span className="game-menu__time"> {formatRoundTime(game.timeMs)}</span>
                          </strong>
                          <small>Level {game.table}</small>
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            ) : (
              <>
                <h2>Mission Levels</h2>
                <ul className="game-menu__levels">
                  {config.levels.map((item) => (
                    <li key={item.id}>
                      <button
                        type="button"
                        className={`game-menu__level${level.id === item.id ? " game-menu__level--current" : ""}`}
                        aria-current={level.id === item.id ? "true" : undefined}
                        aria-label={item.label}
                        onClick={() => selectLevel(item)}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <h2>Settings</h2>
                <div className="game-menu__settings">
                  <button type="button" className={`style-toggle style-toggle--${graphicStyle}`} onClick={toggleStyle}>
                    {graphicStyle === "pixel" ? "Pixel Art" : "Sci-Fi Vector"}
                  </button>
                  <button
                    type="button"
                    className={`sound-toggle ${soundOn ? "sound-toggle--on" : "sound-toggle--off"}`}
                    aria-pressed={soundOn}
                    aria-label={soundOn ? "Turn sound off" : "Turn sound on"}
                    onClick={toggleSound}
                  >
                    {soundOn ? "Sound on" : "Sound off"}
                  </button>
                </div>
                <h2>Records</h2>
                <button type="button" className="game-menu__records" onClick={() => setMenuPage("scores")}>
                  Best scores
                </button>
                {onExit && (
                  <button type="button" className="game-menu__records" onClick={onExit}>
                    Games
                  </button>
                )}
              </>
            )}
          </div>
        </>
      )}
    </div>
  );

  if (!hasStarted) {
    return (
      <main className={stageClass} style={{ "--slide-ms": `${config.slideMs}ms` }}>
        {menu}
        <SpaceScene
          mode="select"
          selectedHero={heroId}
          onSelect={setHeroId}
          levelId={level.id}
          graphicStyle={graphicStyle}
          playMode={playMode}
          isAdvance={isAdvanceMode}
        />
        <section className="score-card">
          <span>Sector Level {level.id}</span>
          <h1>{level.label}</h1>
          <p>Choose a space warrior, then face the {alien.name}.</p>
          <p>
            {config.questionsPerLevel} questions · {config.secondsPerQuestion} seconds
          </p>
          <div className="score-card__actions">
            <div className="mode-row">
              <button type="button" className="start-button" onClick={() => startRound("battle")}>
                Start
              </button>
              <button
                type="button"
                className="advance-button"
                onClick={() => startRound("advance")}
                disabled={level.id <= config.minLevel}
              >
                Advance
              </button>
            </div>
            <button type="button" className="secondary-button" onClick={() => startRound("practice")}>
              Practice
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (isFinished) {
    const won = passedChallenge(score, roundTotal, config.passPercent);
    const hidden = missedQuestions.some((item) => !item.revealed);
    return (
      <main className={stageClass}>
        {menu}
        <SpaceScene
          mode={won ? "victory" : "defeat"}
          heroId={heroId}
          hp={Math.max(0, roundTotal - score)}
          maxHp={roundTotal}
          levelId={level.id}
          graphicStyle={graphicStyle}
          playMode={playMode}
          isAdvance={isAdvanceMode}
        />
        <section className="score-card">
          <span>{won ? "Mission Accomplished!" : "Hull Breach - Try again"}</span>
          <h1>
            {score} / {roundTotal}
          </h1>
          <p>Your combat score was {Math.round((score / roundTotal) * 100)}%.</p>
          <p className="round-time">Time: {formatRoundTime(roundTimeMs)}</p>
          {beatRecord && <p className="round-time__record">New galaxy record!</p>}
          {bestTimeMs != null && <p className="round-time__best">Best: {formatRoundTime(bestTimeMs)}</p>}
          {playMode === "advance" && bestSetAt && <p className="round-time__set">Set {bestSetAt}</p>}
          {missedQuestions.length > 0 && (
            <div className="missed-questions">
              <h2>Missed questions</h2>
              <ul>
                {missedQuestions.map((item, index) => (
                  <li key={`${item.prompt}-${index}`}>
                    <span>{item.prompt}</span>
                    <div className="reveal-slot">
                      {item.revealed ? (
                        <strong>{item.answer}</strong>
                      ) : (
                        <button
                          type="button"
                          className="reveal-button"
                          aria-label={`Reveal answer for ${item.prompt}`}
                          onClick={() =>
                            setMissedQuestions((current) =>
                              current.map((entry, entryIndex) =>
                                entryIndex === index ? { ...entry, revealed: true } : entry
                              )
                            )
                          }
                        >
                          Reveal answer
                        </button>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="score-card__actions">
            <button
              type="button"
              disabled={hidden}
              onClick={() => {
                if (soundRef.current) startSelectMusic();
                setHasStarted(false);
                setIsFinished(false);
                setQuestions([]);
              }}
            >
              Play again
            </button>
          </div>
        </section>
      </main>
    );
  }

  const quotientDigits = [
    ...doneSteps.map((step) => step.quotientDigit),
    prompt?.kind === "digit" ? "?" : "",
  ].join(" ");

  return (
    <main className={stageClass} style={{ "--slide-ms": `${config.slideMs}ms` }}>
      {menu}
      <SpaceScene
        mode="battle"
        heroId={heroId}
        hp={Math.max(0, roundTotal - score)}
        maxHp={roundTotal}
        combat={combat}
        levelId={level.id}
        graphicStyle={graphicStyle}
        playMode={playMode}
        isAdvance={isAdvanceMode}
      />
      <section className="question-card">
        <div className="question-card__header">
          <span>
            {playMode === "practice" ? "Practice" : playMode === "advance" ? "Advance" : "Battle"} · {level.label}
          </span>
        </div>
        <div className="progress-label">
          <span>
            Question {questionIndex + 1} of {questions.length}
          </span>
          <strong>{score} correct</strong>
        </div>
        {playMode !== "practice" && (
          <>
            <p className="global-timer">Total {formatRoundTime(liveMs)}</p>
            <div
              className={`timer ${secondsLeft <= 5 ? "timer--urgent" : ""}`}
              aria-label={`${secondsLeft} seconds left`}
            >
              {secondsLeft}
            </div>
          </>
        )}
        {question && (
          <>
            {playMode === "practice" && !question.facts ? (
              <div className="division-work">
                <div className="division-work__quotient">{quotientDigits}</div>
                <div className="division-work__bracket">
                  <span className="division-work__divisor">{question.divisor}</span>
                  <span className="division-work__dividend">{question.dividend}</span>
                </div>
                <div className="division-work__steps">
                  {doneSteps.map((step) => (
                    <p key={`${step.into}-${step.quotientDigit}`}>
                      {question.divisor} × {step.quotientDigit} = {step.product}. {step.into} − {step.product} = {step.remainder}.
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <div className="question-card__prompt">
                <h1>{question.prompt}</h1>
              </div>
            )}
            <p>{prompt ? prompt.prompt : "What is the quotient?"}</p>
            {hint && <p className="division-hint">{hint}</p>}
            {meaning && <p className="division-meaning">{meaning}</p>}
            <div className="answer-grid">
              {choices.map((choice) => (
                <button
                  key={choice}
                  type="button"
                  disabled={locked}
                  className={
                    chosen === choice
                      ? choice === String(prompt ? prompt.answer : question.answer)
                        ? "answer-button--correct"
                        : "answer-button--wrong"
                      : ""
                  }
                  onClick={() =>
                    resolveAnswer(
                      choice === String(prompt ? prompt.answer : question.answer),
                      choice
                    )
                  }
                >
                  {choice}
                </button>
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
};

export default DivisionGame;
