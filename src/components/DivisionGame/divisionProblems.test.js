const fs = require("fs");
const path = require("path");
const {
  buildSteps,
  createAdvanceDivisionQuestions,
  createDivisionQuestions,
  digitHint,
  lessonSteps,
  lessonLogEntry,
  levelFromSearch,
  practicePrompts,
  usedDividendIndexes,
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

test("teaches advance one digit through divide, multiply, and subtract", () => {
  const problem = {
    dividend: 774,
    divisor: 18,
    steps: buildSteps(774, 18),
  };
  const steps = lessonSteps(problem);

  expect(steps.map((step) => step.phase)).toEqual([
    "Divide",
    "Multiply",
    "Subtract",
    "Divide",
    "Multiply",
    "Subtract",
  ]);
  expect(steps[0]).toMatchObject({
    answer: 4,
    prompt: "18 does not fit until you reach 77. How many times does 18 go into 77?",
  });
  expect(steps[1]).toMatchObject({
    prompt: "Multiply 18 × 4. What is the product?",
    answer: 72,
  });
  expect(steps[2]).toMatchObject({
    prompt: "Subtract 77 − 72. What is left?",
    answer: 5,
  });
  expect(steps[3].prompt).toBe(
    "Bring down the next digit. Now you have 54. How many times does 18 go into 54?"
  );
  expect(lessonLogEntry(problem, steps[0])).toBe("Divide: 18 goes into 77 4 times.");
  expect(lessonLogEntry(problem, steps[1])).toBe("Multiply: 18 × 4 = 72.");
  expect(lessonLogEntry(problem, steps[2])).toBe("Subtract: 77 − 72 = 5.");
});

test("highlights the dividend digits used by each long-division step", () => {
  const steps = buildSteps(4158, 6);
  expect(usedDividendIndexes(4158, steps, 0)).toEqual({ start: 0, end: 1 });
  expect(usedDividendIndexes(4158, steps, 1)).toEqual({ start: 2, end: 2 });
  expect(usedDividendIndexes(4158, steps, 2)).toEqual({ start: 3, end: 3 });
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

test("advance creates fourth-grade divisions by a one-digit divisor", () => {
  const questions = createAdvanceDivisionQuestions(config.advance, 40, 4);
  const dividendDigits = new Set();
  const remainders = questions.filter((question) => question.remainder > 0);

  expect(questions).toHaveLength(40);
  expect(remainders.length).toBeGreaterThan(0);
  questions.forEach((question) => {
    dividendDigits.add(digitsOf(question.dividend));
    expect(question.divisor).toBeGreaterThanOrEqual(2);
    expect(question.divisor).toBeLessThanOrEqual(9);
    expect(question.dividend % question.divisor).toBe(question.remainder);
    expect(question.remainder).toBeLessThan(question.divisor);
    expect(question.options).toContain(question.answer);
    expect(new Set(question.options).size).toBe(question.options.length);
    if (question.remainder > 0) {
      expect(lessonSteps(question).at(-1)).toMatchObject({
        phase: "Left over",
        answer: question.remainder,
      });
    }
  });
  expect([...dividendDigits].sort()).toEqual([2, 3, 4]);
  expect(levelFromSearch(config, "?level=4").label).toBe("Four-Digit Dividends");
  expect(levelFromSearch(config, "?level=9")).toBe(config.levels[0]);
  expect(levelFromSearch(config, "")).toBe(config.levels[0]);
});
