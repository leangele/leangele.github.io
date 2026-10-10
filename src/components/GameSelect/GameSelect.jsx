import React from "react";
import "../MultiplicationGame/MultiplicationGame.css";
import "./GameSelect.css";

const GameSelect = ({ onSelect }) => (
  <main className="math-game math-game--centered game-select">
    <section className="score-card">
      <span>Choose a game</span>
      <h1>Math Adventure</h1>
      <p>Practice multiplication or learn division one step at a time.</p>
      <div className="score-card__actions game-select__actions">
        <button type="button" onClick={() => onSelect("multiplication")}>
          Multiplication
        </button>
        <button
          type="button"
          className="secondary-button"
          onClick={() => onSelect("division")}
        >
          Division
        </button>
      </div>
    </section>
  </main>
);

export default GameSelect;
