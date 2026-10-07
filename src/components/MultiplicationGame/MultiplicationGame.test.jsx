import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.setTimeout(60000);
import { getCreature } from "./CharacterSvg";
import MultiplicationGame, {
  createAdvanceQuestions,
  createOrderedQuestions,
  createQuestions,
  formatRecordStamp,
  formatRoundTime,
  levelFromTableQuery,
  musicPhaseFor,
  nextBestTime,
} from "./MultiplicationGame";

const config = {
  title: "Multiplication Challenge",
  subtitle: "Practice the times tables.",
  questionsPerLevel: 5,
  secondsPerQuestion: 5,
  passPercent: 70,
  slideMs: 400,
  answerChoices: 4,
  practiceAnswerChoices: 2,
  minTable: 1,
  maxTable: 10,
  graphicStyle: "pixel",
  levels: [
    {
      id: 2,
      label: "Times Table 2",
      multiplier: 2,
      minFactor: 1,
      maxFactor: 10,
    },
  ],
};

beforeEach(() => {
  window.history.pushState({}, "", "/");
  window.localStorage.removeItem("multiplication-game-sound");
  window.localStorage.removeItem("multiplication-game-style");
  window.localStorage.removeItem("multiplication-game-best-times");
  window.localStorage.removeItem("multiplication-game-advance-best-times");
  window.scrollTo = jest.fn();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(config),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("opens another times table from the query without editing the configuration", () => {
  expect(levelFromTableQuery(config, "?table=7")).toEqual({
    id: 7,
    label: "Times Table 7",
    multiplier: 7,
    minFactor: 1,
    maxFactor: 10,
  });
  expect(levelFromTableQuery(config, "?tabla=5").multiplier).toBe(5);
  expect(levelFromTableQuery(config, "?table=2")).toBe(config.levels[0]);
  expect(levelFromTableQuery(config, "")).toBe(config.levels[0]);
  expect(levelFromTableQuery(config, "?table=11")).toBe(config.levels[0]);
});

test("keeps a faster winning time and ignores a slower or losing round", () => {
  expect(formatRoundTime(10400)).toBe("10.4s");
  expect(nextBestTime(null, 5000, true)).toEqual({
    bestMs: 5000,
    beatRecord: false,
  });
  expect(nextBestTime(5000, 4000, true)).toEqual({
    bestMs: 4000,
    beatRecord: true,
  });
  expect(nextBestTime(5000, 6000, true)).toEqual({
    bestMs: 5000,
    beatRecord: false,
  });
  expect(nextBestTime(5000, 1000, false)).toEqual({
    bestMs: 5000,
    beatRecord: false,
  });
});

test("shows the total answer time and announces a faster replay", async () => {
  let clock = 1000;
  jest.spyOn(performance, "now").mockImplementation(() => clock);

  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));
  await screen.findByText(/2 × \d+/);

  for (let question = 0; question < 5; question += 1) {
    clock += 2000;
    await answerCurrentQuestion();
  }

  expect(screen.getByText("Time: 10.0s")).toBeInTheDocument();
  expect(screen.getByText("Best: 10.0s")).toBeInTheDocument();
  expect(screen.queryByText(/New best time/)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Play again" }));
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  await screen.findByText(/2 × \d+/);

  for (let question = 0; question < 5; question += 1) {
    clock += 1000;
    await answerCurrentQuestion();
  }

  expect(screen.getByText("Time: 5.0s")).toBeInTheDocument();
  expect(screen.getByText("New best time! You beat 10.0s.")).toBeInTheDocument();
});

test("lists a times table in factor order for practice", () => {
  const questions = createOrderedQuestions(
    config.levels[0],
    config.practiceAnswerChoices
  );

  expect(questions.map((question) => question.factor)).toEqual([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10,
  ]);
  expect(questions.map((question) => question.answer)).toEqual([
    2, 4, 6, 8, 10, 12, 14, 16, 18, 20,
  ]);
  expect(questions.every((question) => question.options.length === 2)).toBe(true);
  expect(
    questions.every((question) => question.options.includes(question.answer))
  ).toBe(true);
});

test("advances practice questions in order after each answer", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Practice" }));

  expect(await screen.findByRole("heading", { name: "2 × 1" })).toBeInTheDocument();
  expect(document.querySelectorAll(".answer-grid button")).toHaveLength(2);
  expect(screen.getByText("Practice · Times Table 2")).toBeInTheDocument();
  expect(screen.queryByLabelText(/seconds left/)).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "2" }));
  await waitForNextArea("2 × 1");
  expect(screen.getByRole("heading", { name: "2 × 2" })).toBeInTheDocument();

  fireEvent.click(
    [...document.querySelectorAll(".answer-grid button")].find(
      (button) => button.textContent !== "4"
    )
  );
  await waitForNextArea("2 × 2");
  expect(screen.getByRole("heading", { name: "2 × 3" })).toBeInTheDocument();
});

test("shows the times table requested in the URL", async () => {
  window.history.pushState({}, "", "/?table=7");
  render(<MultiplicationGame />);

  expect(await screen.findByRole("heading", { name: "Times Table 7" })).toBeInTheDocument();
  expect(screen.getByText(/face the Griffin/)).toBeInTheDocument();
  expect(document.querySelector(".math-game--realm-griffin")).not.toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Start" }));

  expect(await screen.findByText(/7 × \d+/)).toBeInTheDocument();
  expect(document.querySelector(".math-game--realm-griffin")).not.toBeNull();
});

const openGameMenu = async () => {
  fireEvent.click(await screen.findByRole("button", { name: "Open menu" }));
};

test("turns sound off and remembers that choice", async () => {
  render(<MultiplicationGame />);
  await openGameMenu();

  fireEvent.click(await screen.findByRole("button", { name: "Turn sound off" }));

  expect(screen.getByRole("button", { name: "Turn sound on" })).toHaveAttribute(
    "aria-pressed",
    "false"
  );
  expect(window.localStorage.getItem("multiplication-game-sound")).toBe("off");

  fireEvent.click(screen.getByRole("button", { name: "Turn sound on" }));

  expect(screen.getByRole("button", { name: "Turn sound off" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
});

test("waits for Start and then uses the configured times table", async () => {
  render(<MultiplicationGame />);

  expect(await screen.findByRole("button", { name: "Start" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Times Table 2" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: /2 × \d+/ })).not.toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Start" }));

  expect(await screen.findByText(/2 × \d+/)).toBeInTheDocument();
  expect(screen.getByLabelText("5 seconds left")).toBeInTheDocument();
});

test("plays five questions and displays the final score", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));
  await screen.findByText(/2 × \d+/);

  for (let question = 0; question < 5; question += 1) {
    await answerCurrentQuestion();
  }

  expect(screen.getByText("5 / 5")).toBeInTheDocument();
  expect(screen.getByText(/100%/)).toBeInTheDocument();
  expect(screen.getByText("Victory!")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play again" })).toBeEnabled();
  expect(
    document.querySelector("[data-creature-mood='defeated']")
  ).not.toBeNull();
  expect(document.querySelector("[data-pose='jump']")).not.toBeNull();

  fireEvent.click(screen.getByRole("button", { name: "Play again" }));
  expect(screen.getByRole("button", { name: "Knight" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Knight" }));
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  expect(await screen.findByText(/2 × \d+/)).toBeInTheDocument();
  expect(document.querySelector("[data-hero='knight']")).not.toBeNull();
});

const waitForNextArea = async (expression) => {
  await waitFor(
    () => {
      if (screen.queryByText(/Your score was/)) {
        return;
      }
      const next = screen.queryByText(/^\d+ × \d+$/);
      expect(next?.textContent).not.toBe(expression);
      expect(document.querySelector(".slide-panel--shown")).not.toBeNull();
    },
    { timeout: 3000 }
  );
};

const missCurrentQuestion = async () => {
  const expression = screen.getByText(/^\d+ × \d+$/).textContent;
  const [left, right] = expression.split(" × ").map(Number);
  const correct = String(left * right);
  fireEvent.click(
    [...document.querySelectorAll(".answer-grid button")].find(
      (button) => button.textContent !== correct
    )
  );
  await waitForNextArea(expression);
  return { expression, correct };
};

const answerCurrentQuestion = async () => {
  const expression = screen.getByText(/^\d+ × \d+$/).textContent;
  const [left, right] = expression.split(" × ").map(Number);
  fireEvent.click(screen.getByRole("button", { name: String(left * right) }));
  await waitForNextArea(expression);
};

test("lists a missed question on the score screen and reveals its answer", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));
  await screen.findByText(/^\d+ × \d+$/);

  const missed = await missCurrentQuestion();
  for (let question = 0; question < 4; question += 1) {
    await answerCurrentQuestion();
  }

  const playAgain = screen.getByRole("button", { name: "Play again" });
  expect(screen.getByText("4 / 5")).toBeInTheDocument();
  expect(screen.getByText(missed.expression)).toBeInTheDocument();
  expect(screen.queryByText(missed.correct)).not.toBeInTheDocument();
  expect(playAgain).toBeDisabled();

  fireEvent.click(
    screen.getByRole("button", {
      name: `Reveal answer for ${missed.expression}`,
    })
  );

  expect(screen.getByText(missed.correct)).toBeInTheDocument();
  expect(
    screen.queryByRole("button", {
      name: `Reveal answer for ${missed.expression}`,
    })
  ).not.toBeInTheDocument();
  expect(playAgain).toBeEnabled();
});

test("keeps Play again disabled until every missed answer is revealed", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));
  await screen.findByText(/^\d+ × \d+$/);

  const missed = [await missCurrentQuestion(), await missCurrentQuestion()];
  for (let question = 0; question < 3; question += 1) {
    await answerCurrentQuestion();
  }

  const playAgain = screen.getByRole("button", { name: "Play again" });
  expect(screen.getByText("3 / 5")).toBeInTheDocument();
  expect(playAgain).toBeDisabled();

  fireEvent.click(
    screen.getByRole("button", {
      name: `Reveal answer for ${missed[0].expression}`,
    })
  );

  expect(screen.getByText(missed[0].correct)).toBeInTheDocument();
  expect(screen.queryByText(missed[1].correct)).not.toBeInTheDocument();
  expect(playAgain).toBeDisabled();

  fireEvent.click(
    screen.getByRole("button", {
      name: `Reveal answer for ${missed[1].expression}`,
    })
  );

  expect(screen.getByText(missed[1].correct)).toBeInTheDocument();
  expect(playAgain).toBeEnabled();
  expect(
    document.querySelector("[data-creature-mood='laughing']")
  ).not.toBeNull();
  expect(document.querySelector("[data-pose='gone']")).not.toBeNull();
  expect(screen.getByText("Try again", { selector: ".demon-speech" })).toBeInTheDocument();
});

test("lets the player choose a hero and damages the creature on a correct answer", async () => {
  render(<MultiplicationGame />);

  expect(await screen.findByRole("button", { name: "Hunter" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Knight" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Mage" })).toBeInTheDocument();
  expect(screen.getByText("Werewolf")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Mage" }));
  expect(screen.getByRole("button", { name: "Mage" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );
  expect(document.querySelector(".hero-svg--hunter")).toHaveAttribute(
    "src",
    expect.stringContaining("/assets/pixel-hunter.svg")
  );
  expect(document.querySelector(".hero-svg--knight")).toHaveAttribute(
    "src",
    expect.stringContaining("/assets/pixel-knight.svg")
  );
  expect(document.querySelector(".hero-svg--mage.hero-svg--selected")).toHaveAttribute(
    "src",
    expect.stringContaining("/assets/pixel-mage.svg")
  );

  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  await screen.findByText(/2 × \d+/);

  const health = screen.getByRole("meter", { name: "Werewolf health" });
  expect(health).toHaveAttribute("aria-valuenow", "5");
  expect(document.querySelector("[data-hero='mage']")).not.toBeNull();

  const expression = screen.getByText(/2 × \d+/).textContent;
  const [left, right] = expression.split(" × ").map(Number);
  fireEvent.click(screen.getByRole("button", { name: String(left * right) }));

  expect(document.querySelector(".hero-slot--cast.attacking")).not.toBeNull();
  expect(document.querySelector(".demon-figure.damaged")).not.toBeNull();
  expect(document.querySelector(".magic-bolt")).not.toBeNull();
  expect(document.querySelector(".hero-slot--attack")).toBeNull();

  await waitForNextArea(expression);
  expect(screen.getByRole("meter", { name: "Werewolf health" })).toHaveAttribute(
    "aria-valuenow",
    "4"
  );
});

test("shows Miss and dodges when the answer is wrong", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));
  const expression = (await screen.findByText(/^\d+ × \d+$/)).textContent;
  const [left, right] = expression.split(" × ").map(Number);
  const correct = String(left * right);
  fireEvent.click(
    [...document.querySelectorAll(".answer-grid button")].find(
      (button) => button.textContent !== correct
    )
  );

  expect(screen.getByText("Miss")).toHaveClass("floating-miss");
  expect(document.querySelector(".answer-button--wrong")).not.toBeNull();
  expect(document.querySelector(".answer-button--correct")).not.toBeNull();
  expect(document.querySelector(".demon-figure--dodge")).not.toBeNull();
  expect(document.querySelector(".arrow-shot--miss")).not.toBeNull();
  expect(document.querySelector(".hero-slot--shoot")).not.toBeNull();
  expect(document.querySelector(".hero-slot--attack")).toBeNull();
});

test("slides the current question out before showing the next one", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));

  const expression = (await screen.findByText(/^\d+ × \d+$/)).textContent;
  const [left, right] = expression.split(" × ").map(Number);
  fireEvent.click(screen.getByRole("button", { name: String(left * right) }));

  expect(document.querySelector(".slide-panel--exit")).not.toBeNull();
  expect(document.querySelector(".hero-slot--shoot.attacking")).not.toBeNull();
  expect(document.querySelector(".demon-figure.damaged")).not.toBeNull();
  expect(document.querySelector(".arrow-shot")).not.toBeNull();
  expect(document.querySelector(".hero-slot--attack")).toBeNull();
  expect(document.querySelector(".demon-figure--hit")).not.toBeNull();
  expect(screen.getByText(expression)).toBeInTheDocument();

  await waitFor(
    () => {
      expect(screen.getByText(/^\d+ × \d+$/).textContent).not.toBe(expression);
    },
    { timeout: 2000 }
  );
  expect(document.querySelector(".slide-panel--enter")).not.toBeNull();
});

test("assigns a different fantasy creature to each times table", () => {
  const creatures = Array.from({ length: 10 }, (_, index) =>
    getCreature(index + 1)
  );

  expect(new Set(creatures.map((creature) => creature.id)).size).toBe(10);
  expect(getCreature(2).name).toBe("Werewolf");
  expect(getCreature(10).name).toBe("Phoenix");
});

test("chooses the music bed for the phase that is already playing", () => {
  expect(
    musicPhaseFor({
      hasStarted: false,
      playMode: "battle",
      isFinished: false,
      won: false,
    })
  ).toBe("select");
  expect(
    musicPhaseFor({
      hasStarted: true,
      playMode: "practice",
      isFinished: false,
      won: false,
    })
  ).toBe("select");
  expect(
    musicPhaseFor({
      hasStarted: true,
      playMode: "battle",
      isFinished: false,
      won: false,
    })
  ).toBe("combat");
  expect(
    musicPhaseFor({
      hasStarted: true,
      playMode: "advance",
      isFinished: false,
      won: false,
    })
  ).toBe("combat");
  expect(
    musicPhaseFor({
      hasStarted: true,
      playMode: "battle",
      isFinished: true,
      won: true,
    })
  ).toBe("victory");
  expect(
    musicPhaseFor({
      hasStarted: true,
      playMode: "battle",
      isFinished: true,
      won: false,
    })
  ).toBe("defeat");
});

test("toggles between pixel art and fantasy styles and updates the arena", async () => {
  render(<MultiplicationGame />);
  await openGameMenu();

  const toggleBtn = await screen.findByRole("button", {
    name: /Graphic style:/,
  });
  expect(document.querySelector(".math-game--style-pixel")).not.toBeNull();
  expect(document.querySelector(".battle-arena-stage")).toBeNull();

  fireEvent.click(toggleBtn);
  expect(document.querySelector(".math-game--style-fantasy")).not.toBeNull();
  expect(window.localStorage.getItem("multiplication-game-style")).toBe("fantasy");

  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  expect(document.querySelector(".battle-arena-stage")).not.toBeNull();
  expect(document.querySelector(".math-game--style-fantasy")).not.toBeNull();

  await openGameMenu();
  fireEvent.click(screen.getByRole("button", { name: /Graphic style:/ }));
  expect(document.querySelector(".math-game--style-pixel")).not.toBeNull();
  expect(window.localStorage.getItem("multiplication-game-style")).toBe("pixel");
});

test("switches graphic style during a question without resetting the round", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));

  const expression = (await screen.findByText(/^\d+ × \d+$/)).textContent;
  const secondsLeft = screen.getByLabelText(/seconds left/).textContent;
  expect(screen.getByText("0 correct")).toBeInTheDocument();
  expect(document.querySelector(".hero-svg").getAttribute("src")).toContain(
    "pixel-hunter.svg"
  );

  await openGameMenu();
  fireEvent.click(
    screen.getByRole("button", { name: /Graphic style: Pixel art/ })
  );

  expect(document.querySelector(".math-game--style-fantasy")).not.toBeNull();
  expect(screen.getByText(expression)).toBeInTheDocument();
  expect(screen.getByLabelText(/seconds left/).textContent).toBe(secondsLeft);
  expect(screen.getByText("0 correct")).toBeInTheDocument();
  expect(screen.getByText(/Question 1 of/)).toBeInTheDocument();
  expect(document.querySelector(".hero-svg").getAttribute("src")).toContain(
    "hunter.svg"
  );
  expect(document.querySelector(".hero-svg").getAttribute("src")).not.toContain(
    "pixel-hunter.svg"
  );
  expect(window.localStorage.getItem("multiplication-game-style")).toBe("fantasy");
});

test("keeps questions and wrong answers unique", () => {
  const level = {
    multiplier: 3,
    minFactor: 1,
    maxFactor: 10,
  };
  const questions = createQuestions(level, 8, 4);
  const prompts = questions.map(
    (question) => `${question.multiplier}×${question.factor}`
  );

  expect(questions).toHaveLength(8);
  expect(new Set(prompts).size).toBe(prompts.length);
  questions.forEach((question) => {
    expect(new Set(question.options).size).toBe(question.options.length);
    expect(question.options.filter((option) => option === question.answer)).toHaveLength(1);
  });

  const advance = createAdvanceQuestions({ ...level, id: 3 }, 8, 4, 1);
  const advancePrompts = advance.map(
    (question) => `${question.multiplier}×${question.factor}`
  );
  expect(new Set(advancePrompts).size).toBe(advancePrompts.length);
});

test("builds advance questions only from lower tables", () => {
  const table = {
    id: 3,
    label: "Times Table 3",
    multiplier: 3,
    minFactor: 1,
    maxFactor: 10,
  };
  const questions = createAdvanceQuestions(table, 5, 4, 1);

  expect(questions).toHaveLength(5);
  expect(
    questions.every(
      (question) => question.multiplier === 1 || question.multiplier === 2
    )
  ).toBe(true);
  expect(
    questions.every((question) => question.factor >= 1 && question.factor <= 10)
  ).toBe(true);
  expect(questions.every((question) => question.options.length === 4)).toBe(true);
  expect(
    questions.every(
      (question) => question.answer === question.multiplier * question.factor
    )
  ).toBe(true);

  const pool = createAdvanceQuestions(table, 100, 4, 1);
  expect(pool).toHaveLength(20);
  expect(pool.some((question) => question.multiplier === 3)).toBe(false);
  expect(createAdvanceQuestions({ ...table, multiplier: 1 }, 5, 4, 1)).toEqual([]);
  expect(
    createAdvanceQuestions(
      { ...table, multiplier: 2, minFactor: 1, maxFactor: 2 },
      5,
      4,
      1
    )
  ).toHaveLength(2);
  expect(formatRecordStamp(new Date(2026, 9, 7, 8, 9))).toBe(
    "Oct 7, 2026, 8:09 AM"
  );
});

test("places Advance between Start and Practice", async () => {
  render(<MultiplicationGame />);

  const start = await screen.findByRole("button", { name: "Start" });
  const advance = screen.getByRole("button", { name: "Advance" });
  expect(start.parentElement).toBe(advance.parentElement);
  expect(start.parentElement).toHaveClass("mode-row");
  expect(
    [...start.closest(".score-card__actions").querySelectorAll("button")].map(
      (button) => button.textContent
    )
  ).toEqual(["Start", "Advance", "Practice"]);
  expect(advance).toBeEnabled();
});

test("disables Advance on times table 1", async () => {
  window.history.pushState({}, "", "/?table=1");
  render(<MultiplicationGame />);

  const advance = await screen.findByRole("button", { name: "Advance" });
  expect(advance).toBeDisabled();
  expect(screen.getByRole("heading", { name: "Times Table 1" })).toBeInTheDocument();

  fireEvent.click(advance);

  expect(screen.queryByLabelText(/seconds left/)).not.toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Start" })).toBeEnabled();
});

test("stores an advance best time separately and shows the date", async () => {
  window.history.pushState({}, "", "/?table=3");
  window.localStorage.setItem(
    "multiplication-game-best-times",
    JSON.stringify({ 3: 4000 })
  );

  const originalMatchMedia = window.matchMedia;
  window.matchMedia = () => ({
    matches: true,
    media: "(prefers-reduced-motion: reduce)",
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
  });

  let clock = 1000;
  jest.spyOn(performance, "now").mockImplementation(() => clock);

  try {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Advance" }));

  expect(await screen.findByText(/^[12] × \d+$/)).toBeInTheDocument();
  expect(screen.getByText("Advance · Times Table 3")).toBeInTheDocument();
  expect(screen.getByLabelText("5 seconds left")).toBeInTheDocument();
  expect(document.querySelectorAll(".answer-grid button")).toHaveLength(4);

  for (let question = 0; question < 5; question += 1) {
    const expression = screen.getByText(/^\d+ × \d+$/).textContent;
    expect(expression.startsWith("3")).toBe(false);
    expect(/^[12] × \d+$/.test(expression)).toBe(true);
    clock += 2000;
    await answerCurrentQuestion();
  }

  const stored = JSON.parse(
    window.localStorage.getItem("multiplication-game-advance-best-times")
  );
  expect(stored["3"].ms).toBe(10000);
  expect(stored["3"].setAt).toEqual(expect.any(String));
  expect(stored["3"].setAt.length).toBeGreaterThan(0);
  expect(screen.getByText("Time: 10.0s")).toBeInTheDocument();
  expect(screen.getByText("Best: 10.0s")).toBeInTheDocument();
  expect(screen.getByText(`Set ${stored["3"].setAt}`)).toBeInTheDocument();
  expect(screen.queryByText(/New best time/)).not.toBeInTheDocument();
  expect(
    JSON.parse(window.localStorage.getItem("multiplication-game-best-times"))
  ).toEqual({ 3: 4000 });

  const firstRecord = stored["3"];

  fireEvent.click(screen.getByRole("button", { name: "Play again" }));
  fireEvent.click(screen.getByRole("button", { name: "Advance" }));
  await screen.findByText(/^[12] × \d+$/);

  for (let question = 0; question < 5; question += 1) {
    clock += 1000;
    await answerCurrentQuestion();
  }

  const faster = JSON.parse(
    window.localStorage.getItem("multiplication-game-advance-best-times")
  );
  expect(faster["3"].ms).toBe(5000);
  expect(screen.getByText("Time: 5.0s")).toBeInTheDocument();
  expect(screen.getByText("Best: 5.0s")).toBeInTheDocument();
  expect(screen.getByText("New best time! You beat 10.0s.")).toBeInTheDocument();
  expect(screen.getByText(`Set ${faster["3"].setAt}`)).toBeInTheDocument();
  expect(
    JSON.parse(window.localStorage.getItem("multiplication-game-best-times"))
  ).toEqual({ 3: 4000 });

  fireEvent.click(screen.getByRole("button", { name: "Play again" }));
  fireEvent.click(screen.getByRole("button", { name: "Advance" }));
  await screen.findByText(/^[12] × \d+$/);

  for (let question = 0; question < 5; question += 1) {
    clock += 3000;
    await answerCurrentQuestion();
  }

  expect(screen.getByText("Time: 15.0s")).toBeInTheDocument();
  expect(screen.getByText("Best: 5.0s")).toBeInTheDocument();
  expect(screen.getByText(`Set ${faster["3"].setAt}`)).toBeInTheDocument();
  expect(screen.queryByText(/New best time/)).not.toBeInTheDocument();
  expect(
    JSON.parse(window.localStorage.getItem("multiplication-game-advance-best-times"))
  ).toEqual(faster);
  expect(faster["3"].ms).not.toBe(firstRecord.ms);

  fireEvent.click(screen.getByRole("button", { name: "Play again" }));
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  await screen.findByText(/3 × \d+/);

  for (let question = 0; question < 5; question += 1) {
    clock += 500;
    await answerCurrentQuestion();
  }

  expect(
    JSON.parse(window.localStorage.getItem("multiplication-game-best-times"))
  ).toEqual({ 3: 2500 });
  expect(
    JSON.parse(window.localStorage.getItem("multiplication-game-advance-best-times"))
  ).toEqual(faster);
  expect(screen.queryByText(`Set ${faster["3"].setAt}`)).not.toBeInTheDocument();
  } finally {
    window.matchMedia = originalMatchMedia;
  }
});

test("opens a menu of times tables and switches the creature", async () => {
  render(<MultiplicationGame />);
  await openGameMenu();

  expect(screen.getByRole("dialog", { name: "Game menu" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Times Table 1" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Times Table 10" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Times Table 2" })).toHaveAttribute(
    "aria-current",
    "true"
  );

  fireEvent.click(screen.getByRole("button", { name: "Times Table 7" }));

  expect(screen.getByRole("heading", { name: "Times Table 7" })).toBeInTheDocument();
  expect(screen.getByText(/face the Griffin/)).toBeInTheDocument();
  expect(document.querySelector(".math-game--realm-griffin")).not.toBeNull();
  expect(screen.queryByRole("dialog", { name: "Game menu" })).not.toBeInTheDocument();
  expect(window.location.search).toBe("?table=7");
});

test("returns to hero select when a different table is chosen mid-round", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));
  const expression = (await screen.findByText(/^\d+ × \d+$/)).textContent;

  await openGameMenu();
  fireEvent.click(screen.getByRole("button", { name: "Times Table 5" }));

  expect(screen.queryByText(expression)).not.toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Times Table 5" })).toBeInTheDocument();
  expect(screen.getByText(/face the Fire Dragon/)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Start" })).toBeEnabled();
});

test("supports ?style=fantasy URL query parameter", async () => {
  window.history.pushState({}, "", "/?style=fantasy");
  render(<MultiplicationGame />);

  expect(await screen.findByRole("button", { name: "Start" })).toBeInTheDocument();
  expect(document.querySelector(".math-game--style-fantasy")).not.toBeNull();
});
