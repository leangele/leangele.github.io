import { fireEvent, render, screen } from "@testing-library/react";
import MotivationCards from "./MotivationCards";
import {
  MOTIVATIONAL_PHRASES,
  pickPhrases,
} from "./motivationalPhrases";

test("contains 100 unique short phrases", () => {
  expect(MOTIVATIONAL_PHRASES).toHaveLength(100);
  expect(new Set(MOTIVATIONAL_PHRASES).size).toBe(100);
  expect(MOTIVATIONAL_PHRASES.every((phrase) => phrase.length <= 50)).toBe(true);
  expect(MOTIVATIONAL_PHRASES.every((phrase) => phrase.startsWith("I am"))).toBe(
    true
  );
});

test("picks 10 different phrases without changing the source list", () => {
  const original = [...MOTIVATIONAL_PHRASES];
  const picked = pickPhrases(MOTIVATIONAL_PHRASES, 10, () => 0.5);

  expect(picked).toHaveLength(10);
  expect(new Set(picked).size).toBe(10);
  expect(MOTIVATIONAL_PHRASES).toEqual(original);
});

test("shows 10 phrases and returns to the home screen", () => {
  const onExit = jest.fn();
  render(<MotivationCards onExit={onExit} />);

  expect(
    screen.getByRole("region", { name: "Motivational phrases" }).children
  ).toHaveLength(10);
  fireEvent.click(screen.getByRole("button", { name: "Home" }));
  expect(onExit).toHaveBeenCalledTimes(1);
});
