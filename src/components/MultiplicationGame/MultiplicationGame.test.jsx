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

test("starts the configured level without a level menu", async () => {
  render(<MultiplicationGame />);

  expect(await screen.findByText(/2 × \d+/)).toBeInTheDocument();
  expect(screen.getByLabelText("5 seconds left")).toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /Increase seconds/i })
  ).not.toBeInTheDocument();
  expect(
    screen.queryByRole("button", { name: /Choose another level/i })
  ).not.toBeInTheDocument();
});

test("plays five questions and displays the final score", async () => {
  render(<MultiplicationGame />);
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
});
