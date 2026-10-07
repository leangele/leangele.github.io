import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  passedChallenge,
  playBetweenQuestions,
  playDefeat,
  playVictory,
  unlockGameAudio,
} from "./gameAudio";
import "./MultiplicationGame.css";

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
        const selectedLevel = gameConfig.levels?.[0];
        setConfig(gameConfig);
        if (!selectedLevel) {
          return;
        }
        setLevel(selectedLevel);
        setQuestions(
          createQuestions(selectedLevel, gameConfig.questionsPerLevel)
        );
        setSecondsLeft(gameConfig.secondsPerQuestion);
      })
      .catch(() =>
        setError("Could not load the game configuration.")
      );
  }, []);

  const currentQuestion = questions[questionIndex];

  const finishOrAdvance = useCallback(
    (nextScore) => {
      const soundsEnabled = config.sounds !== false;
      const isLastQuestion = questionIndex >= questions.length - 1;

      if (soundsEnabled) {
        if (isLastQuestion) {
          const won = passedChallenge(
            nextScore,
            questions.length,
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
    [config, questionIndex, questions.length]
  );

  useEffect(() => {
    if (!level || isFinished || !currentQuestion) {
      return undefined;
    }

    if (secondsLeft === 0) {
      finishOrAdvance(score);
      return undefined;
    }

    const timer = window.setTimeout(
      () => setSecondsLeft((current) => current - 1),
      1000
    );
    return () => window.clearTimeout(timer);
  }, [
    secondsLeft,
    level,
    isFinished,
    currentQuestion,
    finishOrAdvance,
    score,
  ]);

  const progress = useMemo(() => {
    if (!questions.length) {
      return 0;
    }
    return ((questionIndex + 1) / questions.length) * 100;
  }, [questionIndex, questions.length]);

  const startLevel = (selectedLevel) => {
    unlockGameAudio();
    window.scrollTo({ top: 0, behavior: "smooth" });
    setLevel(selectedLevel);
    setQuestions(
      createQuestions(selectedLevel, config.questionsPerLevel)
    );
    setQuestionIndex(0);
    setScore(0);
    setSecondsLeft(config.secondsPerQuestion);
    setIsFinished(false);
  };

  const answerQuestion = (option) => {
    const nextScore =
      option === currentQuestion.answer ? score + 1 : score;
    if (nextScore !== score) {
      setScore(nextScore);
    }
    finishOrAdvance(nextScore);
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

  if (isFinished) {
    const percentage = Math.round((score / questions.length) * 100);
    const won = passedChallenge(score, questions.length, config.passPercent);
    return (
      <main className="math-game math-game--centered">
        <section className="score-card">
          <div className="score-card__icon" aria-hidden="true">
            {won ? "★" : "♪"}
          </div>
          <span>{won ? "Victory!" : "Try again"}</span>
          <h1>
            {score} / {questions.length}
          </h1>
          <p>Your score was {percentage}%.</p>
          <div className="score-card__actions">
            <button onClick={() => startLevel(level)}>Play again</button>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="math-game math-game--centered">
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

        <div className="question-card__body">
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
            <button key={option} onClick={() => answerQuestion(option)}>
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
