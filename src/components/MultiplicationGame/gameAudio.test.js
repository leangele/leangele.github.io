import { passedChallenge } from "./gameAudio";

test("counts a score above 70 percent as a win", () => {
  expect(passedChallenge(4, 5, 70)).toBe(true);
  expect(passedChallenge(71, 100, 70)).toBe(true);
});

test("counts 70 percent and below as a loss", () => {
  expect(passedChallenge(3, 5, 70)).toBe(false);
  expect(passedChallenge(70, 100, 70)).toBe(false);
  expect(passedChallenge(0, 5, 70)).toBe(false);
});
