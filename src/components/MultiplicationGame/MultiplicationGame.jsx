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

const createQuestions = (level, count) => {
  const factors = Array.from(
    { length: level.maxFactor - level.minFactor + 1 },
    (_, index) => level.minFactor + index
  );

  return shuffle(factors)
    .slice(0, Math.min(count, factors.length))
    .map((factor) => {
      const answer = level.multiplier * factor;
      return {
        factor,
        answer,
        options: createOptions(answer, level.multiplier),
      };
    });
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
  const [missedQuestions, setMissedQuestions] = useState([]);
  const [slidePhase, setSlidePhase] = useState("shown");
  const [heroId, setHeroId] = useState("warrior");
  const [combat, setCombat] = useState(null);
  const pendingAdvance = useRef(null);

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
        setConfig(gameConfig);
        setLevel(gameConfig.levels?.[0] ?? null);
      })
      .catch(() =>
        setError("Could not load the game configuration.")
      );
  }, []);

  useEffect(() => () => stopCombatMusic(), []);

  const currentQuestion = questions[questionIndex];
  const demonHp = Math.max(0, (config?.questionsPerLevel || 0) - score);
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

      const soundsEnabled = config.sounds !== false;
      const isLastQuestion = questionIndex >= questions.length - 1;

      if (soundsEnabled) {
        if (isLastQuestion) {
          const won = passedChallenge(
            nextScore,
            config.questionsPerLevel,
            config.passPercent
          );
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

    const timer = window.setTimeout(() => setSlidePhase("shown"), slideDuration());
    return () => window.clearTimeout(timer);
  }, [slidePhase]);

  useEffect(() => {
    if (!hasStarted || !level || isFinished || !currentQuestion || slidePhase !== "shown") {
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
  ]);

  const progress = useMemo(() => {
    if (!questions.length) {
      return 0;
    }
    return ((questionIndex + 1) / questions.length) * 100;
  }, [questionIndex, questions.length]);

  const startLevel = () => {
    unlockGameAudio();
    if (config.sounds !== false) {
      startCombatMusic();
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
    setQuestions(createQuestions(level, config.questionsPerLevel));
    setQuestionIndex(0);
    setScore(0);
    setSecondsLeft(config.secondsPerQuestion);
    setIsFinished(false);
    setHasStarted(true);
    setMissedQuestions([]);
    pendingAdvance.current = null;
    setSlidePhase("shown");
    setCombat(null);
  };

  const playSelectMusic = (event) => {
    if (event?.target?.closest?.(".score-card__actions")) {
      return;
    }
    unlockGameAudio();
    if (config.sounds !== false) {
      startSelectMusic();
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

  if (!hasStarted) {
    return (
      <main className="math-game math-game--stage" onPointerDown={playSelectMusic}>
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
          <div className="score-card__actions">
            <button onClick={startLevel}>Start</button>
          </div>
        </section>
      </main>
    );
  }

  if (isFinished) {
    const percentage = Math.round((score / config.questionsPerLevel) * 100);
    const won = passedChallenge(
      score,
      config.questionsPerLevel,
      config.passPercent
    );
    const answersStillHidden = missedQuestions.some((item) => !item.revealed);
    return (
      <main className="math-game math-game--stage">
        <AdventureScene
          mode={won ? "victory" : "defeat"}
          heroId={heroId}
          hp={demonHp}
          maxHp={config.questionsPerLevel}
          levelId={level.multiplier}
        />
        <section className={`score-card slide-panel slide-panel--${slidePhase}`}>
          <div className="score-card__icon" aria-hidden="true">
            {won ? "★" : "♪"}
          </div>
          <span>{won ? "Victory!" : "Try again"}</span>
          <h1>
            {score} / {config.questionsPerLevel}
          </h1>
          <p>Your score was {percentage}%.</p>
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
      <AdventureScene
        mode="battle"
        heroId={heroId}
        hp={demonHp}
        maxHp={config.questionsPerLevel}
        combat={combat}
        levelId={level.multiplier}
      />
      <section className="question-card">
        <div className="question-card__header">
          <span>{level.label}</span>
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
            <div
              className={`timer ${secondsLeft <= 2 ? "timer--urgent" : ""}`}
              aria-label={`${secondsLeft} seconds left`}
            >
              {secondsLeft}
            </div>
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
