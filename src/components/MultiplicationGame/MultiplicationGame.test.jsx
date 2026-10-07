import { fireEvent, render, screen } from "@testing-library/react";
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
    const expression = screen.getByText(/^\d+ × \d+$/).textContent;
    const [left, right] = expression.split(" × ").map(Number);
    fireEvent.click(
      screen.getByRole("button", { name: String(left * right) })
    );
  }

  expect(screen.getByText("5 / 5")).toBeInTheDocument();
  expect(screen.getByText(/100%/)).toBeInTheDocument();
  expect(screen.getByText("Victory!")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Play again" })).toBeEnabled();
});

const missCurrentQuestion = () => {
  const expression = screen.getByText(/^\d+ × \d+$/).textContent;
  const [left, right] = expression.split(" × ").map(Number);
  const correct = String(left * right);
  fireEvent.click(
    screen
      .getAllByRole("button")
      .find((button) => button.textContent !== correct)
  );
  return { expression, correct };
};

const answerCurrentQuestion = () => {
  const expression = screen.getByText(/^\d+ × \d+$/).textContent;
  const [left, right] = expression.split(" × ").map(Number);
  fireEvent.click(screen.getByRole("button", { name: String(left * right) }));
};

test("lists a missed question on the score screen and reveals its answer", async () => {
  render(<MultiplicationGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Start" }));
  await screen.findByText(/^\d+ × \d+$/);

  const missed = missCurrentQuestion();
  for (let question = 0; question < 4; question += 1) {
    answerCurrentQuestion();
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

  const missed = [missCurrentQuestion(), missCurrentQuestion()];
  for (let question = 0; question < 3; question += 1) {
    answerCurrentQuestion();
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
});
