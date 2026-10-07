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

const SOUND_STORAGE_KEY = "multiplication-game-sound";
const GRAPHIC_STYLE_KEY = "multiplication-game-style";
const BEST_TIME_KEY = "multiplication-game-best-times";
const ADVANCE_BEST_TIME_KEY = "multiplication-game-advance-best-times";
export const HISTORY_KEY = "multiplication-game-history";
const HISTORY_LIMIT = 200;

export const SCORE_CATEGORIES = [
  { id: "score", label: "Highest score" },
  { id: "time", label: "Best time" },
  { id: "both", label: "Best overall" },
];

const MODE_LABELS = {
  battle: "Start",
  advance: "Advance",
  practice: "Practice",
};

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
  return configuredStyle;
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

const scoreRatio = (game) => (game.total > 0 ? game.score / game.total : 0);

const compareByScore = (a, b) =>
  b.score - a.score || scoreRatio(b) - scoreRatio(a) || a.timeMs - b.timeMs;

const compareByTime = (a, b) =>
  a.timeMs - b.timeMs || b.score - a.score || scoreRatio(b) - scoreRatio(a);

const isPlayedGame = (game) =>
  Boolean(game) &&
  typeof game.id === "string" &&
  (game.mode === "battle" || game.mode === "advance" || game.mode === "practice") &&
  Number.isInteger(game.table) &&
  Number.isFinite(Number(game.score)) &&
  Number.isFinite(Number(game.total)) &&
  Number(game.total) > 0 &&
  Number.isFinite(Number(game.timeMs)) &&
  Number(game.timeMs) >= 0;

export const rankGames = (games, category) => {
  const list = (Array.isArray(games) ? games : []).filter(isPlayedGame);
  if (category === "both") {
    const maxTime = Math.max(...list.map((game) => game.timeMs), 1);
    const bothValue = (game) => scoreRatio(game) + (1 - game.timeMs / maxTime);
    return [...list].sort(
      (a, b) => bothValue(b) - bothValue(a) || compareByScore(a, b)
    );
  }
  return [...list].sort(category === "time" ? compareByTime : compareByScore);
};

export const withBestFlags = (games) => {
  const list = (Array.isArray(games) ? games : []).filter(isPlayedGame);
  const bestScoreId = rankGames(list, "score")[0]?.id ?? null;
  const bestTimeId = rankGames(list, "time")[0]?.id ?? null;
  const bestBothId = rankGames(list, "both")[0]?.id ?? null;
  return list.map((game) => ({
    ...game,
    score: Number(game.score),
    total: Number(game.total),
    timeMs: Number(game.timeMs),
    bestScore: game.id === bestScoreId,
    bestTime: game.id === bestTimeId,
    bestBoth: game.id === bestBothId,
  }));
};

export const topScores = (games, category, limit = 10) =>
  rankGames(withBestFlags(games), category).slice(0, limit);

export const appendPlayedGame = (games, game) => {
  if (!isPlayedGame(game)) {
    return withBestFlags(games);
  }
  return withBestFlags([...withBestFlags(games), game].slice(-HISTORY_LIMIT));
};

const readHistory = () => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(HISTORY_KEY) || "[]");
    return withBestFlags(parsed);
  } catch (error) {
    return [];
  }
};

const writeHistory = (games) => {
  try {
    window.localStorage.setItem(HISTORY_KEY, JSON.stringify(games));
  } catch (error) {
    // The score screen still shows this round when storage is blocked.
  }
};

let playedGameSeq = 0;

const createPlayedGameId = () => {
  playedGameSeq += 1;
  return `${Date.now()}-${playedGameSeq}`;
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

  if (
    !raw ||
    !Number.isInteger(table) ||
    table < gameConfig.minTable ||
    table > gameConfig.maxTable
  ) {
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
    minFactor: configured.minFactor,
    maxFactor: configured.maxFactor,
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

const slideDuration = (slideMs) => {
  if (typeof window.matchMedia !== "function") {
    return slideMs;
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? 0
    : slideMs;
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

const createOptions = (answer, multiplier, count) => {
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

const questionFromFactor = (level, factor, optionCount) => {
  const answer = level.multiplier * factor;
  return {
    multiplier: level.multiplier,
    factor,
    answer,
    options: createOptions(answer, level.multiplier, optionCount),
  };
};

export const createQuestions = (level, count, optionCount) => {
  const factors = levelFactors(level);
  const seen = new Set();
  return shuffle(factors)
    .slice(0, Math.min(count, factors.length))
    .map((factor) => questionFromFactor(level, factor, optionCount))
    .filter((question) => {
      const key = `${question.multiplier}×${question.factor}`;
      if (seen.has(key)) {
        return false;
      }
      seen.add(key);
      return true;
    });
};

export const createAdvanceQuestions = (level, count, optionCount, minTable) => {
  const pool = [];
  for (let multiplier = minTable; multiplier < level.multiplier; multiplier += 1) {
    const table = {
      multiplier,
      minFactor: level.minFactor,
      maxFactor: level.maxFactor,
    };
    levelFactors(table).forEach((factor) => {
      const question = questionFromFactor(table, factor, optionCount);
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

export const createOrderedQuestions = (level, optionCount) =>
  levelFactors(level).map((factor) => questionFromFactor(level, factor, optionCount));

const categoryFlag = {
  score: "bestScore",
  time: "bestTime",
  both: "bestBoth",
};

const ScoresPage = ({ history, category, onCategory, onBack }) => {
  const rows = topScores(history, category);
  const flag = categoryFlag[category] || "bestScore";
  return (
    <div className="game-menu__scores">
      <button type="button" className="game-menu__back" onClick={onBack}>
        Back
      </button>
      <h2>Best scores</h2>
      <div className="game-menu__categories" role="tablist" aria-label="Score categories">
        {SCORE_CATEGORIES.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={category === item.id}
            className={`game-menu__category${
              category === item.id ? " game-menu__category--current" : ""
            }`}
            onClick={() => onCategory(item.id)}
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
            <li
              key={game.id}
              className={`game-menu__score${game[flag] ? " game-menu__score--best" : ""}`}
            >
              <span className="game-menu__rank">{index + 1}</span>
              <span className="game-menu__score-copy">
                <strong>
                  {game.score}/{game.total}
                  <span className="game-menu__time"> {formatRoundTime(game.timeMs)}</span>
                </strong>
                <small>
                  Table {game.table} · {MODE_LABELS[game.mode]}
                  {game[flag] ? " · Best" : ""}
                </small>
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};

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
  const [graphicStyle, setGraphicStyle] = useState(null);
  const [roundTimeMs, setRoundTimeMs] = useState(0);
  const [bestTimeMs, setBestTimeMs] = useState(null);
  const [beatRecord, setBeatRecord] = useState(false);
  const [previousBestMs, setPreviousBestMs] = useState(null);
  const [bestSetAt, setBestSetAt] = useState(null);
  const [liveRoundMs, setLiveRoundMs] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPage, setMenuPage] = useState("main");
  const [scoreCategory, setScoreCategory] = useState("score");
  const [history, setHistory] = useState(() => readHistory());
  const soundOnRef = useRef(true);
  const graphicStyleRef = useRef(null);
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

  useEffect(() => {
    if (!menuOpen) {
      return undefined;
    }
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        setMenuPage("main");
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

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
        const played = appendPlayedGame(readHistory(), {
          id: createPlayedGameId(),
          mode: playModeRef.current,
          table: level.multiplier,
          score: nextScore,
          total,
          timeMs: roundMs,
          setAt: formatRecordStamp(new Date()),
        });
        writeHistory(played);
        setHistory(played);
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
    }, slideDuration(config?.slideMs));

    return () => window.clearTimeout(timer);
  }, [slidePhase, finishOrAdvance, config?.slideMs]);

  useEffect(() => {
    if (slidePhase !== "enter") {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      questionShownAtRef.current = performance.now();
      setSlidePhase("shown");
    }, slideDuration(config?.slideMs));
    return () => window.clearTimeout(timer);
  }, [slidePhase, config?.slideMs]);

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
    if (mode === "advance" && level.multiplier <= config.minTable) {
      return;
    }
    setMenuOpen(false);
    setMenuPage("main");
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
        ? createOrderedQuestions(level, config.practiceAnswerChoices)
        : mode === "advance"
          ? createAdvanceQuestions(
              level,
              config.questionsPerLevel,
              config.answerChoices,
              config.minTable
            )
          : createQuestions(level, config.questionsPerLevel, config.answerChoices)
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
    if (event?.target?.closest?.(".score-card__actions, .game-menu")) {
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

  const selectTable = (table) => {
    setMenuOpen(false);
    setMenuPage("main");
    if (table === level.multiplier) {
      return;
    }

    setLevel(levelFromTableQuery(config, `?table=${table}`));
    try {
      const params = new URLSearchParams(window.location.search);
      params.set("table", String(table));
      const query = params.toString();
      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}${query ? `?${query}` : ""}`
      );
    } catch (error) {
      // The chosen table still applies for this visit.
    }

    if (hasStarted) {
      returnToHeroSelect();
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

  const tableNumbers = Array.from(
    { length: config.maxTable - config.minTable + 1 },
    (_, index) => config.minTable + index
  );
  const gameMenu = (
    <div className="game-menu">
      <button
        type="button"
        className="menu-button"
        aria-expanded={menuOpen}
        aria-controls="game-menu-panel"
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
          <div
            id="game-menu-panel"
            className="game-menu__panel"
            role="dialog"
            aria-label="Game menu"
          >
            {menuPage === "scores" ? (
              <ScoresPage
                history={history}
                category={scoreCategory}
                onCategory={setScoreCategory}
                onBack={() => setMenuPage("main")}
              />
            ) : (
              <>
            <h2>Levels</h2>
            <ul className="game-menu__levels">
              {tableNumbers.map((table) => (
                <li key={table}>
                  <button
                    type="button"
                    className={`game-menu__level${
                      level.multiplier === table ? " game-menu__level--current" : ""
                    }`}
                    aria-current={level.multiplier === table ? "true" : undefined}
                    aria-label={`Times Table ${table}`}
                    onClick={() => selectTable(table)}
                  >
                    Table {table}
                  </button>
                </li>
              ))}
            </ul>
            <h2>Settings</h2>
            <div className="game-menu__settings">
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
            <h2>Records</h2>
            <button
              type="button"
              className="game-menu__records"
              onClick={() => setMenuPage("scores")}
            >
              Best scores
            </button>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
  const stageClass = `math-game math-game--stage math-game--style-${graphicStyle} math-game--realm-${creature.id}`;
  const stageStyle = { "--slide-ms": `${config.slideMs}ms` };

  if (!hasStarted) {
    return (
      <main className={stageClass} style={stageStyle} onPointerDown={playSelectMusic}>
        {gameMenu}
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
                disabled={level.multiplier <= config.minTable}
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
      <main className={stageClass} style={stageStyle}>
        {gameMenu}
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
    <main className={stageClass} style={stageStyle}>
      {gameMenu}
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
