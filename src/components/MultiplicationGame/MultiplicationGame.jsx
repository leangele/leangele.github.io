import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  passedChallenge,
  playBetweenQuestions,
  playDefeat,
  playVictory,
  startCombatMusic,
  startSelectMusic,
  stopCombatMusic,
  unlockGameAudio,
} from "./gameAudio";
import AdventureScene from "./AdventureScene";
import { getCreature } from "./CharacterSvg";
import "./MultiplicationGame.css";

const SLIDE_MS = 800;
const SOUND_STORAGE_KEY = "multiplication-game-sound";
const BEST_TIME_KEY = "multiplication-game-best-times";

export const formatRoundTime = (milliseconds) => {
  const seconds = Math.max(0, Number(milliseconds) || 0) / 1000;
  return `${seconds.toFixed(1)}s`;
};

export const nextBestTime = (previousMs, roundMs, won) => {
  if (!won) {
    return { bestMs: previousMs ?? null, beatRecord: false };
  }
  if (previousMs == null || roundMs < previousMs) {
    return {
      bestMs: roundMs,
      beatRecord: previousMs != null,
    };
  }
  return { bestMs: previousMs, beatRecord: false };
};

const readBestTimes = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(BEST_TIME_KEY) || "{}");
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed;
  } catch (error) {
    return {};
  }
};

const readBestTime = (multiplier) => {
  const value = Number(readBestTimes()[multiplier]);
  return Number.isFinite(value) ? value : null;
};

const writeBestTime = (multiplier, milliseconds) => {
  const times = readBestTimes();
  times[multiplier] = milliseconds;
  try {
    window.localStorage.setItem(BEST_TIME_KEY, JSON.stringify(times));
  } catch (error) {
    // The score still shows this round when storage is blocked.
  }
};

export const levelFromTableQuery = (gameConfig, search = "") => {
  const configured = gameConfig.levels?.[0] ?? null;
  const params = new URLSearchParams(search);
  const raw = params.get("table") ?? params.get("tabla");
  const table = Number(raw);

  if (!raw || !Number.isInteger(table) || table < 1 || table > 10) {
    return configured;
  }

  const match = gameConfig.levels?.find(
    (item) => item.multiplier === table || item.id === table
  );
  if (match) {
    return match;
  }

  return {
    id: table,
    label: `Times Table ${table}`,
    multiplier: table,
    minFactor: configured?.minFactor ?? 1,
    maxFactor: configured?.maxFactor ?? 10,
  };
};

const readStoredSound = (configSounds) => {
  try {
    const saved = window.localStorage.getItem(SOUND_STORAGE_KEY);
    if (saved === "on") {
      return true;
    }
    if (saved === "off") {
      return false;
    }
  } catch (error) {
    // Private browsing can block storage.
  }
  return configSounds !== false;
};

const slideDuration = () => {
  if (typeof window.matchMedia !== "function") {
    return SLIDE_MS;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : SLIDE_MS;
};

const shuffle = (items) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [result[index], result[randomIndex]] = [
      result[randomIndex],
      result[index],
    ];
  }
  return result;
};

const createOptions = (answer, multiplier) => {
  const options = new Set([answer]);
  let distance = 1;

  while (options.size < 4) {
    options.add(answer + distance * multiplier);
    if (answer - distance * multiplier > 0) {
      options.add(answer - distance * multiplier);
    }
    distance += 1;
  }

  return shuffle([...options].slice(0, 4));
};

const levelFactors = (level) =>
  Array.from(
    { length: level.maxFactor - level.minFactor + 1 },
    (_, index) => level.minFactor + index
  );

const questionFromFactor = (level, factor) => {
  const answer = level.multiplier * factor;
  return {
    factor,
    answer,
    options: createOptions(answer, level.multiplier),
  };
};

const createQuestions = (level, count) => {
  const factors = levelFactors(level);
  return shuffle(factors)
    .slice(0, Math.min(count, factors.length))
    .map((factor) => questionFromFactor(level, factor));
};

export const createOrderedQuestions = (level) =>
  levelFactors(level).map((factor) => questionFromFactor(level, factor));

const MultiplicationGame = () => {
  const [config, setConfig] = useState(null);
  const [error, setError] = useState("");
  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [playMode, setPlayMode] = useState("battle");
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [slidePhase, setSlidePhase] = useState("shown");
  const [heroId, setHeroId] = useState("warrior");
  const [combat, setCombat] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [roundTimeMs, setRoundTimeMs] = useState(0);
  const [bestTimeMs, setBestTimeMs] = useState(null);
  const [beatRecord, setBeatRecord] = useState(false);
  const [previousBestMs, setPreviousBestMs] = useState(null);
  const soundOnRef = useRef(true);
  const playModeRef = useRef("battle");
  const pendingAdvance = useRef(null);
  const answerElapsedRef = useRef(0);
  const questionShownAtRef = useRef(0);
  soundOnRef.current = soundOn;
  playModeRef.current = playMode;

  useEffect(() => {
    const configUrl = `${
      process.env.PUBLIC_URL || ""
    }/data/multiplication-game.json`;

    fetch(configUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Could not load the game configuration.");
        }
        return response.json();
      })
      .then((gameConfig) => {
        const enabled = readStoredSound(gameConfig.sounds);
        soundOnRef.current = enabled;
        setSoundOn(enabled);
        setConfig(gameConfig);
        setLevel(levelFromTableQuery(gameConfig, window.location.search));
      })
      .catch(() =>
        setError("Could not load the game configuration.")
      );
  }, []);

  useEffect(() => () => stopCombatMusic(), []);

  const currentQuestion = questions[questionIndex];
  const roundTotal =
    playMode === "practice" && questions.length
      ? questions.length
      : config?.questionsPerLevel || 0;
  const demonHp = Math.max(0, roundTotal - score);
  const creature = getCreature(level?.multiplier || level?.id || 1);

  const finishOrAdvance = useCallback(
    (wasCorrect) => {
      if (!wasCorrect) {
        setMissedQuestions((current) => [
          ...current,
          {
            prompt: `${level.multiplier} × ${currentQuestion.factor}`,
            answer: currentQuestion.answer,
            revealed: false,
          },
        ]);
      }

      const nextScore = wasCorrect ? score + 1 : score;
      if (wasCorrect) {
        setScore(nextScore);
      }

      const soundsEnabled = soundOnRef.current;
      const practicing = playModeRef.current === "practice";
      const total = practicing ? questions.length : config.questionsPerLevel;
      const isLastQuestion = questionIndex >= questions.length - 1;

      if (soundsEnabled) {
        if (isLastQuestion) {
          const won = passedChallenge(nextScore, total, config.passPercent);
          if (won) {
            playVictory();
          } else {
            playDefeat();
          }
        } else {
          playBetweenQuestions();
        }
      }

      if (isLastQuestion) {
        const roundMs = Math.round(answerElapsedRef.current);
        const won = passedChallenge(nextScore, total, config.passPercent);
        const previous = practicing ? null : readBestTime(level.multiplier);
        const result = nextBestTime(previous, roundMs, won && !practicing);
        if (!practicing && won && result.bestMs === roundMs) {
          writeBestTime(level.multiplier, roundMs);
        }
        setRoundTimeMs(roundMs);
        setBestTimeMs(practicing ? null : result.bestMs);
        setBeatRecord(!practicing && result.beatRecord);
        setPreviousBestMs(!practicing && result.beatRecord ? previous : null);
        setIsFinished(true);
        return;
      }

      setQuestionIndex((current) => current + 1);
      setSecondsLeft(config.secondsPerQuestion);
    },
    [config, currentQuestion, level, questionIndex, questions.length, score]
  );

  const beginAdvance = useCallback((wasCorrect) => {
    if (pendingAdvance.current !== null) {
      return;
    }
    answerElapsedRef.current += performance.now() - questionShownAtRef.current;
    pendingAdvance.current = wasCorrect;
    setCombat(wasCorrect ? "hit" : "miss");
    setSlidePhase("exit");
  }, []);

  useEffect(() => {
    if (slidePhase !== "exit") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const wasCorrect = pendingAdvance.current;
      pendingAdvance.current = null;
      finishOrAdvance(wasCorrect);
      setCombat(null);
      setSlidePhase("enter");
    }, slideDuration());

    return () => window.clearTimeout(timer);
  }, [slidePhase, finishOrAdvance]);

  useEffect(() => {
    if (slidePhase !== "enter") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      questionShownAtRef.current = performance.now();
      setSlidePhase("shown");
    }, slideDuration());
    return () => window.clearTimeout(timer);
  }, [slidePhase]);

  useEffect(() => {
    if (
      playMode === "practice" ||
      !hasStarted ||
      !level ||
      isFinished ||
      !currentQuestion ||
      slidePhase !== "shown"
    ) {
      return undefined;
    }

    if (secondsLeft === 0) {
      beginAdvance(false);
      return undefined;
    }

    const timer = window.setTimeout(
      () => setSecondsLeft((current) => current - 1),
      1000
    );
    return () => window.clearTimeout(timer);
  }, [
    secondsLeft,
    hasStarted,
    level,
    isFinished,
    currentQuestion,
    slidePhase,
    beginAdvance,
    playMode,
  ]);

  const progress = useMemo(() => {
    if (!questions.length) {
      return 0;
    }
    return ((questionIndex + 1) / questions.length) * 100;
  }, [questionIndex, questions.length]);

  const startRound = (mode) => {
    unlockGameAudio();
    if (soundOnRef.current) {
      if (mode === "practice") {
        startSelectMusic();
      } else {
        startCombatMusic();
      }
    } else {
      stopCombatMusic();
    }
    playModeRef.current = mode;
    setPlayMode(mode);
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuestions(
      mode === "practice"
        ? createOrderedQuestions(level)
        : createQuestions(level, config.questionsPerLevel)
    );
    setQuestionIndex(0);
    setScore(0);
    setSecondsLeft(config.secondsPerQuestion);
    setIsFinished(false);
    setHasStarted(true);
    setMissedQuestions([]);
    pendingAdvance.current = null;
    answerElapsedRef.current = 0;
    questionShownAtRef.current = performance.now();
    setRoundTimeMs(0);
    setBeatRecord(false);
    setPreviousBestMs(null);
    setSlidePhase("shown");
    setCombat(null);
  };

  const playSelectMusic = (event) => {
    if (event?.target?.closest?.(".score-card__actions, .sound-toggle")) {
      return;
    }
    unlockGameAudio();
    if (soundOnRef.current) {
      startSelectMusic();
    }
  };

  const toggleSound = () => {
    const next = !soundOnRef.current;
    soundOnRef.current = next;
    setSoundOn(next);
    try {
      window.localStorage.setItem(SOUND_STORAGE_KEY, next ? "on" : "off");
    } catch (error) {
      // The button still works when storage is blocked.
    }

    if (!next) {
      stopCombatMusic();
      return;
    }

    unlockGameAudio();
    if (!hasStarted || playModeRef.current === "practice") {
      startSelectMusic();
      return;
    }
    if (!isFinished) {
      startCombatMusic();
      return;
    }

    const won = passedChallenge(
      score,
      config.questionsPerLevel,
      config.passPercent
    );
    if (won) {
      playVictory();
    } else {
      playDefeat();
    }
  };

  const returnToHeroSelect = () => {
    playSelectMusic();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuestions([]);
    setQuestionIndex(0);
    setScore(0);
    setSecondsLeft(0);
    setIsFinished(false);
    setHasStarted(false);
    playModeRef.current = "battle";
    setPlayMode("battle");
    setMissedQuestions([]);
    pendingAdvance.current = null;
    setSlidePhase("shown");
    setCombat(null);
  };

  const revealMissedAnswer = (index) => {
    setMissedQuestions((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index ? { ...item, revealed: true } : item
      )
    );
  };

  const answerQuestion = (option) => {
    beginAdvance(option === currentQuestion.answer);
  };

  if (error) {
    return <main className="math-game math-game--centered">{error}</main>;
  }

  if (!config) {
    return (
      <main className="math-game math-game--centered">Loading game...</main>
    );
  }

  if (!level) {
    return (
      <main className="math-game math-game--centered">
        No level is configured.
      </main>
    );
  }

  const soundToggle = (
    <div className="sound-bar">
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
  );

  if (!hasStarted) {
    return (
      <main className="math-game math-game--stage" onPointerDown={playSelectMusic}>
        {soundToggle}
        <AdventureScene
          mode="select"
          selectedHero={heroId}
          onSelect={setHeroId}
          levelId={level.multiplier}
        />
        <section className="score-card">
          <span>Level {level.id}</span>
          <h1>{level.label}</h1>
          <p>Choose a hero, then face the {creature.name}.</p>
          <p>
            {config.questionsPerLevel} questions · {config.secondsPerQuestion}{" "}
            seconds
          </p>
          <p className="practice-note">
            Or practice in order: {level.multiplier} × {level.minFactor},{" "}
            {level.multiplier} × {level.minFactor + 1}, {level.multiplier} ×{" "}
            {level.minFactor + 2}.
          </p>
          <div className="score-card__actions">
            <button onClick={() => startRound("battle")}>Start</button>
            <button
              type="button"
              className="secondary-button"
              onClick={() => startRound("practice")}
            >
              Practice
            </button>
          </div>
        </section>
      </main>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / roundTotal) * 100);
    const won = passedChallenge(score, roundTotal, config.passPercent);
    const practicing = playMode === "practice";
    const answersStillHidden = missedQuestions.some((item) => !item.revealed);
    return (
      <main className="math-game math-game--stage">
        {soundToggle}
        <AdventureScene
          mode={won ? "victory" : "defeat"}
          heroId={heroId}
          hp={demonHp}
          maxHp={roundTotal}
          levelId={level.multiplier}
        />
        <section className={`score-card slide-panel slide-panel--${slidePhase}`}>
          <div className="score-card__icon" aria-hidden="true">
            {won ? "★" : "♪"}
          </div>
          <span>
            {practicing
              ? won
                ? "Practice complete"
                : "Keep practicing"
              : won
                ? "Victory!"
                : "Try again"}
          </span>
          <h1>
            {score} / {roundTotal}
          </h1>
          <p>Your score was {percentage}%.</p>
          <p className="round-time">Time: {formatRoundTime(roundTimeMs)}</p>
          {beatRecord && (
            <p className="round-time__record">
              New best time! You beat {formatRoundTime(previousBestMs)}.
            </p>
          )}
          {bestTimeMs != null && !beatRecord && (
            <p className="round-time__best">Best: {formatRoundTime(bestTimeMs)}</p>
          )}
          {missedQuestions.length > 0 && (
            <div className="missed-questions">
              <h2>Missed questions</h2>
              <ul>
                {missedQuestions.map((item, index) => (
                  <li key={item.prompt}>
                    <span>{item.prompt}</span>
                    {item.revealed ? (
                      <strong>{item.answer}</strong>
                    ) : (
                      <button
                        type="button"
                        className="reveal-button"
                        aria-label={`Reveal answer for ${item.prompt}`}
                        onClick={() => revealMissedAnswer(index)}
                      >
                        Reveal answer
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          <div className="score-card__actions">
            <button onClick={returnToHeroSelect} disabled={answersStillHidden}>
              Play again
            </button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="math-game math-game--stage">
      {soundToggle}
      <AdventureScene
        mode="battle"
        heroId={heroId}
        hp={demonHp}
        maxHp={roundTotal}
        combat={combat}
        levelId={level.multiplier}
      />
      <section className="question-card">
        <div className="question-card__header">
          <span>
            {playMode === "practice" ? `Practice · ${level.label}` : level.label}
          </span>
        </div>

        <div className="progress-label">
          <span>
            Question {questionIndex + 1} of {questions.length}
          </span>
          <strong>{score} correct</strong>
        </div>
        <div className="progress-track">
          <div style={{ width: `${progress}%` }} />
        </div>

        <div className={`question-card__body slide-panel slide-panel--${slidePhase}`}>
          <div className="question-card__prompt">
            {playMode === "battle" && (
              <div
                className={`timer ${secondsLeft <= 2 ? "timer--urgent" : ""}`}
                aria-label={`${secondsLeft} seconds left`}
              >
                {secondsLeft}
              </div>
            )}
            <p>What is</p>
            <h1>
              {level.multiplier} × {currentQuestion.factor}
            </h1>
          </div>

          <div className="answer-grid">
          {currentQuestion.options.map((option) => (
            <button
              key={option}
              onClick={() => answerQuestion(option)}
              disabled={slidePhase !== "shown"}
            >
              {option}
            </button>
          ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MultiplicationGame;
