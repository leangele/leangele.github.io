const fs = require("fs");
const path = require("path");
const {
  buildSteps,
  createAdvanceDivisionQuestions,
  createDivisionQuestions,
  digitHint,
  levelFromSearch,
  practicePrompts,
} = require("./divisionProblems");

const config = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../../../public/data/division-game.json"), "utf8")
);

const digitsOf = (value) => String(value).length;

test("reads fourth-grade levels from exact facts through remainders", () => {
  expect(config.levels.map((level) => level.label)).toEqual([
    "Division Facts",
    "Two-Digit Dividends",
    "Three-Digit Dividends",
    "Four-Digit Dividends",
    "Remainders",
  ]);
  expect(config.levels.filter((level) => level.remainders).map((level) => level.id)).toEqual([
    5,
  ]);
  expect(config.levels.every((level) => level.divisorMin >= 2 && level.divisorMax <= 9)).toBe(
    true
  );
});

test("builds the long-division steps for 258 divided by 6", () => {
  expect(buildSteps(258, 6)).toEqual([
    { into: 25, quotientDigit: 4, product: 24, remainder: 1 },
    { into: 18, quotientDigit: 3, product: 18, remainder: 0 },
  ]);
  expect(digitHint(6, 25, 5)).toBe(
    "6 × 5 = 30 is too big. 6 × 4 = 24 fits."
  );
  expect(digitHint(6, 25, 3)).toBe(
    "6 × 3 = 18 is too small. 6 × 4 = 24 fits."
  );
});

test("creates unique exact problems and keeps remainders for the last level", () => {
  config.levels.slice(0, 4).forEach((level) => {
    const questions = createDivisionQuestions(level, 8, 4);
    const keys = questions.map((question) => `${question.dividend}÷${question.divisor}`);
    expect(new Set(keys).size).toBe(questions.length);
    questions.forEach((question) => {
      expect(question.divisor).toBeGreaterThanOrEqual(2);
      expect(question.divisor).toBeLessThanOrEqual(9);
      expect(question.remainder).toBe(0);
      expect(question.dividend % question.divisor).toBe(0);
      expect(question.options).toContain(question.answer);
      expect(new Set(question.options).size).toBe(question.options.length);
      if (!level.facts) {
        expect(digitsOf(question.dividend)).toBe(level.dividendDigits);
      }
    });
  });

  const facts = createDivisionQuestions(config.levels[0], 12, 2);
  facts.forEach((question) => {
    expect(question.quotient).toBeGreaterThanOrEqual(1);
    expect(question.quotient).toBeLessThanOrEqual(10);
    expect(practicePrompts(question)).toEqual([
      {
        kind: "fact",
        prompt: `${question.divisor} × ? = ${question.dividend}`,
        answer: question.quotient,
      },
    ]);
  });

  const remainders = createDivisionQuestions(config.levels[4], 8, 4);
  remainders.forEach((question) => {
    expect(question.remainder).toBeGreaterThan(0);
    expect(question.remainder).toBeLessThan(question.divisor);
    expect(question.dividend % question.divisor).toBe(question.remainder);
    expect(digitsOf(question.dividend)).toBe(3);
    expect(practicePrompts(question).at(-1)).toMatchObject({
      kind: "remainder",
      prompt: "What is left over?",
      answer: question.remainder,
    });
  });
});

test("advance uses only lower levels and the query selects a level", () => {
  expect(
    createAdvanceDivisionQuestions(config.levels[0], config.levels, 4, 4)
  ).toEqual([]);
  const advanced = createAdvanceDivisionQuestions(config.levels[2], config.levels, 6, 4);
  expect(advanced.length).toBeGreaterThan(0);
  expect(advanced.every((question) => question.sourceLevelId < 3)).toBe(true);
  expect(levelFromSearch(config, "?level=4").label).toBe("Four-Digit Dividends");
  expect(levelFromSearch(config, "?level=9")).toBe(config.levels[0]);
  expect(levelFromSearch(config, "")).toBe(config.levels[0]);
});
