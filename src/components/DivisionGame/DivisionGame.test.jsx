import { fireEvent, render, screen } from "@testing-library/react";
import DivisionGame from "./DivisionGame";

const config = {
  title: "Division Challenge",
  subtitle: "Divide one step at a time.",
  questionsPerLevel: 1,
  secondsPerQuestion: 20,
  passPercent: 70,
  slideMs: 0,
  answerChoices: 4,
  practiceAnswerChoices: 2,
  minLevel: 1,
  maxLevel: 1,
  graphicStyle: "pixel",
  sounds: false,
  levels: [
    {
      id: 1,
      label: "Three-Digit Dividends",
      facts: false,
      dividendDigits: 3,
      divisorMin: 2,
      divisorMax: 9,
      remainders: false,
    },
  ],
};

beforeEach(() => {
  window.history.pushState({}, "", "/?game=division");
  window.localStorage.removeItem("division-game-sound");
  window.localStorage.removeItem("division-game-style");
  window.localStorage.removeItem("division-game-history");
  global.fetch = jest.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(config),
  });
});

test("explains a wrong long-division step and keeps the problem moving", async () => {
  render(<DivisionGame />);
  fireEvent.click(await screen.findByRole("button", { name: "Practice" }));

  const prompt = await screen.findByText(/How many times does (\d+) go into (\d+)\?/);
  const divisor = Number(prompt.textContent.match(/does (\d+)/)[1]);
  const into = Number(prompt.textContent.match(/into (\d+)/)[1]);
  const correct = String(Math.floor(into / divisor));
  fireEvent.click(
    [...document.querySelectorAll(".answer-grid button")].find(
      (button) => button.textContent !== correct
    )
  );

  expect(await screen.findByText(/fits/)).toHaveTextContent(
    `${divisor} × ${correct} = ${correct * divisor} fits.`
  );
});

test("returns home from the Home button", async () => {
  const onExit = jest.fn();
  render(<DivisionGame onExit={onExit} />);
  fireEvent.click(await screen.findByRole("button", { name: "Home" }));
  expect(onExit).toHaveBeenCalledTimes(1);
});

test("walks Advance through divide, multiply, and subtract without a timer", async () => {
  render(<DivisionGame />);
  expect(
    await screen.findByText(
      "Advance teaches fourth-grade division, up to 4 digits divided by 1 digit."
    )
  ).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Advance" }));

  const divide = await screen.findByText(/How many times does (\d+) go into (\d+)\?/);
  expect(screen.getByText(/Step 1 of \d+: Divide/)).toBeInTheDocument();
  const divisor = Number(divide.textContent.match(/does (\d+)/)[1]);
  const into = Number(divide.textContent.match(/into (\d+)/)[1]);
  const highlighted = [...document.querySelectorAll(".division-digit--active")].map(
    (digit) => digit.textContent
  );
  expect(highlighted.join("")).toContain(String(divisor));
  expect(highlighted.join("")).toContain(String(into));
  fireEvent.click(screen.getByRole("button", { name: String(Math.floor(into / divisor)) }));

  const multiply = await screen.findByText(
    new RegExp(`Multiply ${divisor} × \\d+\\. What is the product\\?`)
  );
  const digit = Number(multiply.textContent.match(/× (\d+)/)[1]);
  const product = String(divisor * digit);
  fireEvent.click(await screen.findByRole("button", { name: product }));

  expect(
    await screen.findByText(new RegExp(`Subtract ${into} − ${divisor * digit}`))
  ).toBeInTheDocument();
  expect(screen.getByText(/Step 3 of \d+: Subtract/)).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Steps already done" })).toHaveTextContent(
    `Divide: ${divisor} goes into ${into}`
  );
  expect(screen.getByRole("region", { name: "Steps already done" })).toHaveTextContent(
    `Multiply: ${divisor} × ${digit} = ${product}.`
  );
  expect(screen.queryByLabelText(/seconds left/)).not.toBeInTheDocument();
});
