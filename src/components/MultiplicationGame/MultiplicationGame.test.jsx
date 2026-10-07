import { fireEvent, render, screen, waitFor } from "@testing-library/react";

jest.setTimeout(20000);
import MultiplicationGame from "./MultiplicationGame";

const config = {
  title: "Multiplication Challenge",
  subtitle: "Practice the times tables.",
  questionsPerLevel: 5,
  secondsPerQuestion: 5,
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
  window.scrollTo = jest.fn();
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(config),
  });
});

afterEach(() => {
  jest.restoreAllMocks();
});

test("waits for Start and then uses the configured times table", async () => {
  render(<MultiplicationGame />);

  expect(await screen.findByRole("button", { name: "Start" })).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "Times Table 2" })).toBeInTheDocument();
  expect(screen.queryByText(/2 × \d+/)).not.toBeInTheDocument();

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
  expect(document.querySelector("[data-demon='defeated']")).not.toBeNull();
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
    screen
      .getAllByRole("button")
      .find((button) => button.textContent !== correct)
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
  expect(document.querySelector("[data-demon='laughing']")).not.toBeNull();
  expect(document.querySelector("[data-pose='gone']")).not.toBeNull();
  expect(screen.getByText("Try again", { selector: ".demon-speech" })).toBeInTheDocument();
});

test("lets the player choose a hero and damages the demon on a correct answer", async () => {
  render(<MultiplicationGame />);

  expect(await screen.findByRole("button", { name: "Warrior" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Knight" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Mage" })).toBeInTheDocument();
  expect(screen.getByText("Werewolf")).toBeInTheDocument();

  fireEvent.click(screen.getByRole("button", { name: "Mage" }));
  expect(screen.getByRole("button", { name: "Mage" })).toHaveAttribute(
    "aria-pressed",
    "true"
  );

  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  await screen.findByText(/2 × \d+/);

  const health = screen.getByRole("meter", { name: "Werewolf health" });
  expect(health).toHaveAttribute("aria-valuenow", "5");
  expect(document.querySelector("[data-hero='mage']")).not.toBeNull();

  await answerCurrentQuestion();
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
    screen.getAllByRole("button").find((button) => button.textContent !== correct)
  );

  expect(screen.getByText("Miss")).toBeInTheDocument();
  expect(document.querySelector(".demon-figure--dodge")).not.toBeNull();
  expect(document.querySelector(".hero-slot--attack")).toBeNull();
});

test("slides the current question out before showing the next one", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));

  const expression = (await screen.findByText(/^\d+ × \d+$/)).textContent;
  const [left, right] = expression.split(" × ").map(Number);
  fireEvent.click(screen.getByRole("button", { name: String(left * right) }));

  expect(document.querySelector(".slide-panel--exit")).not.toBeNull();
  expect(document.querySelector(".hero-slot--attack")).not.toBeNull();
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
