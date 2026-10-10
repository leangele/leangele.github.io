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

test("disables Advance on the first division level", async () => {
  render(<DivisionGame />);
  expect(await screen.findByRole("button", { name: "Advance" })).toBeDisabled();
});
