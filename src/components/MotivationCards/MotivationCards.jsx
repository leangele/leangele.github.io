import React, { useState } from "react";
import {
  MOTIVATIONAL_PHRASES,
  pickPhrases,
} from "./motivationalPhrases";
import "./MotivationCards.css";

const MotivationCards = ({ onExit }) => {
  const [phrases, setPhrases] = useState(() =>
    pickPhrases(MOTIVATIONAL_PHRASES)
  );

  const refreshPhrases = () => {
    setPhrases(pickPhrases(MOTIVATIONAL_PHRASES));
  };

  return (
    <main className="motivation-page">
      <button
        type="button"
        className="motivation-page__home"
        aria-label="Home"
        onClick={onExit}
      >
        <span aria-hidden="true">⌂</span>
      </button>

      <header className="motivation-page__header">
        <span>A reminder for you</span>
        <h1>You are amazing!</h1>
        <p>Read these phrases out loud and remember what you can do.</p>
      </header>

      <section className="motivation-grid" aria-label="Motivational phrases">
        {phrases.map((phrase, index) => (
          <article className="motivation-card" key={phrase}>
            <span className="motivation-card__number" aria-hidden="true">
              {index + 1}
            </span>
            <p>{phrase}</p>
          </article>
        ))}
      </section>

      <button
        type="button"
        className="motivation-page__refresh"
        onClick={refreshPhrases}
      >
        Show 10 new phrases
      </button>
    </main>
  );
};

export default MotivationCards;
