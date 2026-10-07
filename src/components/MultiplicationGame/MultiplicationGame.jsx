import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { audioEngine } from "../../audioEngine";
import {
  passedChallenge,
  playBetweenQuestions,
  startCombatMusic,
  startSelectMusic,
  stopCombatMusic,
  unlockGameAudio,
} from "./gameAudio";
import AdventureScene from "./AdventureScene";
import { getCreature } from "./CharacterSvg";
import "./MultiplicationGame.css";
import "../../adventure-game.css";

const SLIDE_MS = 400;
const SOUND_STORAGE_KEY = "multiplication-game-sound";
const GRAPHIC_STYLE_KEY = "multiplication-game-style";
const BEST_TIME_KEY = "multiplication-game-best-times";
const ADVANCE_BEST_TIME_KEY = "multiplication-game-advance-best-times";

export const readStoredGraphicStyle = (configuredStyle) => {
  try {
    const params = new URLSearchParams(window.location.search);
    const styleParam = params.get("style");
    if (styleParam === "pixel" || styleParam === "fantasy") {
      return styleParam;
    }
    const saved = window.localStorage.getItem(GRAPHIC_STYLE_KEY);
    if (saved === "pixel" || saved === "fantasy") {
      return saved;
    }
  } catch (error) {
    // Private browsing can block storage.
  }
  return configuredStyle === "fantasy" ? "fantasy" : "pixel";
};

export const musicPhaseFor = ({ hasStarted, playMode, isFinished, won }) => {
  if (!hasStarted) {
    return "select";
  }
  if (isFinished) {
    return won ? "victory" : "defeat";
  }
  return playMode === "practice" ? "select" : "combat";
};

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

export const formatRecordStamp = (date) => {
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const hours24 = date.getHours();
  const hours12 = hours24 % 12 || 12;
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const period = hours24 >= 12 ? "PM" : "AM";
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}, ${hours12}:${minutes} ${period}`;
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

const readAdvanceRecords = () => {
  try {
    const parsed = JSON.parse(
      window.localStorage.getItem(ADVANCE_BEST_TIME_KEY) || "{}"
    );
    if (!parsed || typeof parsed !== "object") {
      return {};
    }
    return parsed;
  } catch (error) {
    return {};
  }
};

const readAdvanceRecord = (multiplier) => {
  const record = readAdvanceRecords()[multiplier];
  if (!record || typeof record !== "object") {
    return null;
  }
  const ms = Number(record.ms);
  if (!Number.isFinite(ms)) {
    return null;
  }
  return {
    ms,
    setAt: typeof record.setAt === "string" ? record.setAt : "",
  };
};

const writeAdvanceRecord = (multiplier, record) => {
  const records = readAdvanceRecords();
  records[multiplier] = { ms: record.ms, setAt: record.setAt };
  try {
    window.localStorage.setItem(ADVANCE_BEST_TIME_KEY, JSON.stringify(records));
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

const createOptions = (answer, multiplier, count = 4) => {
  const step = multiplier > 0 ? multiplier : 1;
  const options = new Set([answer]);
  let distance = 1;

  while (options.size < count && distance < 40) {
    const higher = answer + distance * step;
    const lower = answer - distance * step;
    if (options.size < count && higher > 0 && higher !== answer) {
      options.add(higher);
    }
    if (options.size < count && lower > 0 && lower !== answer) {
      options.add(lower);
    }
    distance += 1;
  }

  const unique = [...options];
  if (!unique.includes(answer)) {
    unique.unshift(answer);
  }
  return shuffle(unique.slice(0, count));
};

const levelFactors = (level) =>
  Array.from(
    { length: level.maxFactor - level.minFactor + 1 },
    (_, index) => level.minFactor + index
  );

const questionFromFactor = (level, factor, optionCount = 4) => {
  const answer = level.multiplier * factor;
  return {
    multiplier: level.multiplier,
    factor,
    answer,
    options: createOptions(answer, level.multiplier, optionCount),
  };
};

export const createQuestions = (level, count) => {
  const factors = levelFactors(level);
  const seen = new Set();
  return shuffle(factors)
    .slice(0, Math.min(count, factors.length))
    .map((factor) => questionFromFactor(level, factor))
    .filter((question) => {
      const key = `${question.multiplier}×${question.factor}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};

export const createAdvanceQuestions = (level, count) => {
  const pool = [];
  for (let multiplier = 1; multiplier < level.multiplier; multiplier += 1) {
    const table = {
      multiplier,
      minFactor: level.minFactor,
      maxFactor: level.maxFactor,
    };
    levelFactors(table).forEach((factor) => {
      const question = questionFromFactor(table, factor);
      const key = `${question.multiplier}×${question.factor}`;
      if (!pool.some((item) => `${item.multiplier}×${item.factor}` === key)) {
        pool.push(question);
      }
    });
  }
  if (!pool.length) {
    return [];
  }
  return shuffle(pool).slice(0, Math.min(count, pool.length));
};

export const createOrderedQuestions = (level) =>
  levelFactors(level).map((factor) => questionFromFactor(level, factor, 2));

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
  const [chosenOption, setChosenOption] = useState(null);
  const [heroId, setHeroId] = useState("hunter");
  const [combat, setCombat] = useState(null);
  const [soundOn, setSoundOn] = useState(true);
  const [graphicStyle, setGraphicStyle] = useState("pixel");
  const [roundTimeMs, setRoundTimeMs] = useState(0);
  const [bestTimeMs, setBestTimeMs] = useState(null);
  const [beatRecord, setBeatRecord] = useState(false);
  const [previousBestMs, setPreviousBestMs] = useState(null);
  const [bestSetAt, setBestSetAt] = useState(null);
  const [liveRoundMs, setLiveRoundMs] = useState(0);
  const soundOnRef = useRef(true);
  const graphicStyleRef = useRef("pixel");
  const playModeRef = useRef("battle");
  const pendingAdvance = useRef(null);
  const answerElapsedRef = useRef(0);
  const questionShownAtRef = useRef(0);
  soundOnRef.current = soundOn;
  graphicStyleRef.current = graphicStyle;
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
        const style = readStoredGraphicStyle(gameConfig.graphicStyle);
        soundOnRef.current = enabled;
        audioEngine.isMuted = !enabled;
        audioEngine.setGraphicStyle(style);
        setSoundOn(enabled);
        setGraphicStyle(style);
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
    (playMode === "practice" || playMode === "advance") && questions.length
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
            prompt: `${currentQuestion.multiplier} × ${currentQuestion.factor}`,
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
      const advancing = playModeRef.current === "advance";
      const total =
        practicing || advancing ? questions.length : config.questionsPerLevel;
      const isLastQuestion = questionIndex >= questions.length - 1;

      if (soundsEnabled) {
        if (isLastQuestion) {
          const won = passedChallenge(nextScore, total, config.passPercent);
          if (won) {
            audioEngine.playVictoryTheme();
          } else {
            audioEngine.playDefeatTheme();
          }
        } else {
          playBetweenQuestions(graphicStyleRef.current);
        }
      }

      if (isLastQuestion) {
        const roundMs = Math.round(answerElapsedRef.current);
        const won = passedChallenge(nextScore, total, config.passPercent);
        if (practicing) {
          setRoundTimeMs(roundMs);
          setBestTimeMs(null);
          setBeatRecord(false);
          setPreviousBestMs(null);
          setBestSetAt(null);
          setIsFinished(true);
          return;
        }

        if (advancing) {
          const previous = readAdvanceRecord(level.multiplier);
          const previousMs = previous?.ms ?? null;
          const result = nextBestTime(previousMs, roundMs, won);
          const isNewRecord =
            won &&
            result.bestMs === roundMs &&
            (previousMs == null || result.beatRecord);
          const setAt = isNewRecord
            ? formatRecordStamp(new Date())
            : previous?.setAt || null;
          if (isNewRecord) {
            writeAdvanceRecord(level.multiplier, { ms: roundMs, setAt });
          }
          setRoundTimeMs(roundMs);
          setBestTimeMs(result.bestMs);
          setBeatRecord(result.beatRecord);
          setPreviousBestMs(result.beatRecord ? previousMs : null);
          setBestSetAt(setAt);
          setIsFinished(true);
          return;
        }

        const previous = readBestTime(level.multiplier);
        const result = nextBestTime(previous, roundMs, won);
        if (won && result.bestMs === roundMs) {
          writeBestTime(level.multiplier, roundMs);
        }
        setRoundTimeMs(roundMs);
        setBestTimeMs(result.bestMs);
        setBeatRecord(result.beatRecord);
        setPreviousBestMs(result.beatRecord ? previous : null);
        setBestSetAt(null);
        setIsFinished(true);
        return;
      }

      setChosenOption(null);
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
    setLiveRoundMs(answerElapsedRef.current);
    pendingAdvance.current = wasCorrect;
    setCombat(wasCorrect ? "hit" : "miss");
    if (wasCorrect) {
      audioEngine.playAttackHit();
    } else {
      audioEngine.playMissSound();
    }
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
      isFinished ||
      slidePhase !== "shown"
    ) {
      return undefined;
    }

    const tick = () => {
      setLiveRoundMs(
        answerElapsedRef.current + performance.now() - questionShownAtRef.current
      );
    };
    tick();
    const timer = window.setInterval(tick, 100);
    return () => window.clearInterval(timer);
  }, [hasStarted, isFinished, slidePhase, questionIndex, playMode]);

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
    if (mode === "advance" && level.multiplier < 2) {
      return;
    }
    unlockGameAudio();
    if (soundOnRef.current) {
      if (mode === "practice") {
        startSelectMusic();
      } else {
        audioEngine.playBattleTheme();
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
        : mode === "advance"
          ? createAdvanceQuestions(level, config.questionsPerLevel)
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
    setLiveRoundMs(0);
    setChosenOption(null);
    setRoundTimeMs(0);
    setBeatRecord(false);
    setPreviousBestMs(null);
    setBestSetAt(null);
    setSlidePhase("shown");
    setCombat(null);
  };

  const toggleGraphicStyle = () => {
    const nextStyle = graphicStyle === "pixel" ? "fantasy" : "pixel";
    setGraphicStyle(nextStyle);
    audioEngine.setGraphicStyle(nextStyle);
    try {
      window.localStorage.setItem(GRAPHIC_STYLE_KEY, nextStyle);
    } catch (error) {
      // Storage might be blocked
    }
    if (!soundOnRef.current) {
      return;
    }
    const phase = musicPhaseFor({
      hasStarted,
      playMode: playModeRef.current,
      isFinished,
      won: passedChallenge(score, roundTotal, config.passPercent),
    });
    if (phase === "select") {
      startSelectMusic(nextStyle);
    } else if (phase === "combat") {
      startCombatMusic(nextStyle);
    } else if (phase === "victory") {
      audioEngine.playVictoryTheme(nextStyle);
    } else {
      audioEngine.playDefeatTheme(nextStyle);
    }
  };

  const playSelectMusic = (event) => {
    if (event?.target?.closest?.(".score-card__actions, .sound-toggle, .style-toggle")) {
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
    audioEngine.isMuted = !next;
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

    const won = passedChallenge(score, roundTotal, config.passPercent);
    if (won) {
      audioEngine.playVictoryTheme();
    } else {
      audioEngine.playDefeatTheme();
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
    setChosenOption(option);
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
    <div className="sound-bar game-controls-bar">
      <button
        type="button"
        className={`style-toggle style-toggle--${graphicStyle}`}
        aria-label={`Graphic style: ${graphicStyle === "pixel" ? "Pixel art" : "Fantasy"}. Switch to ${graphicStyle === "pixel" ? "fantasy" : "pixel art"}`}
        onClick={toggleGraphicStyle}
      >
        {graphicStyle === "pixel" ? "👾 Pixel Art" : "🛡️ Fantasy"}
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
  );
  const stageClass = `math-game math-game--stage math-game--style-${graphicStyle} math-game--realm-${creature.id}`;

  if (!hasStarted) {
    return (
      <main className={stageClass} onPointerDown={playSelectMusic}>
        {soundToggle}
        <AdventureScene
          mode="select"
          selectedHero={heroId}
          onSelect={setHeroId}
          levelId={level.multiplier}
          graphicStyle={graphicStyle}
        />
        <section className="score-card">
          <span>Level {level.id}</span>
          <h1>{level.label}</h1>
          <p>Choose a hero, then face the {creature.name}.</p>
          <p>
            {config.questionsPerLevel} questions · {config.secondsPerQuestion}{" "}
            seconds
          </p>
          <div className="score-card__actions">
            <div className="mode-row">
              <button
                type="button"
                className="start-button"
                onClick={() => startRound("battle")}
              >
                Start
              </button>
              <button
                type="button"
                className="advance-button"
                onClick={() => startRound("advance")}
                disabled={level.multiplier < 2}
              >
                Advance
              </button>
            </div>
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
      <main className={stageClass}>
        {soundToggle}
        <AdventureScene
          mode={won ? "victory" : "defeat"}
          heroId={heroId}
          hp={demonHp}
          maxHp={roundTotal}
          levelId={level.multiplier}
          graphicStyle={graphicStyle}
        />
        <section className={`score-card slide-panel slide-panel--${slidePhase}`}>
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
          {bestTimeMs != null && (playMode === "advance" || !beatRecord) && (
            <p className="round-time__best">Best: {formatRoundTime(bestTimeMs)}</p>
          )}
          {playMode === "advance" && bestSetAt && (
            <p className="round-time__set">Set {bestSetAt}</p>
          )}
          {missedQuestions.length > 0 && (
            <div className="missed-questions">
              <h2>Missed questions</h2>
              <ul>
                {missedQuestions.map((item, index) => (
                  <li key={item.prompt}>
                    <span>{item.prompt}</span>
                    <div className="reveal-slot">
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
                    </div>
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
    <main className={stageClass}>
      {soundToggle}
      <AdventureScene
        mode="battle"
        heroId={heroId}
        hp={demonHp}
        maxHp={roundTotal}
        combat={combat}
        levelId={level.multiplier}
        graphicStyle={graphicStyle}
      />
      <section className="question-card">
        <div className="question-card__header">
          <span>
            {playMode === "practice"
              ? `Practice · ${level.label}`
              : playMode === "advance"
                ? `Advance · ${level.label}`
                : level.label}
          </span>
        </div>

        <div className="progress-label">
          <span>
            Question {questionIndex + 1} of {questions.length}
          </span>
          <strong>{score} correct</strong>
        </div>
        {playMode !== "practice" && (
          <p className="global-timer" aria-live="polite">
            Total {formatRoundTime(liveRoundMs)}
          </p>
        )}
        <div className="progress-track">
          <div style={{ width: `${progress}%` }} />
        </div>

        <div className={`question-card__body slide-panel slide-panel--${slidePhase}`}>
          <div className="question-card__prompt">
            {playMode !== "practice" && (
              <div
                className={`timer ${secondsLeft <= 2 ? "timer--urgent" : ""}`}
                aria-label={`${secondsLeft} seconds left`}
              >
                {secondsLeft}
              </div>
            )}
            <p>What is</p>
            <h1>
              {currentQuestion.multiplier} × {currentQuestion.factor}
            </h1>
          </div>

          <div className="answer-grid">
          {currentQuestion.options.map((option) => {
            const feedbackClass =
              chosenOption == null
                ? ""
                : option === currentQuestion.answer
                  ? "answer-button--correct"
                  : option === chosenOption
                    ? "answer-button--wrong"
                    : "";
            return (
              <button
                key={option}
                className={feedbackClass}
                onClick={() => answerQuestion(option)}
                disabled={slidePhase !== "shown"}
              >
                {option}
              </button>
            );
          })}
          </div>
        </div>
      </section>
    </main>
  );
};

export default MultiplicationGame;
