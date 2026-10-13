export const HISTORY_KEY = "division-game-history";
const HISTORY_LIMIT = 200;

const shuffle = (items, random = Math.random) => {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(random() * (index + 1));
    [result[index], result[swapIndex]] = [result[swapIndex], result[index]];
  }
  return result;
};

const digitSpan = (digits) => {
  const width = Math.max(1, Number(digits) || 1);
  return {
    min: width === 1 ? 1 : 10 ** (width - 1),
    max: 10 ** width - 1,
  };
};

const divisorRange = (level) => {
  const min = Math.max(2, Number(level.divisorMin) || 2);
  const max = Math.min(9, Math.max(min, Number(level.divisorMax) || 9));
  return { min, max };
};

const pickDivisor = (level, random) => {
  const { min, max } = divisorRange(level);
  return min + Math.floor(random() * (max - min + 1));
};

const pickDigitWidth = (minDigits, maxDigits, random) => {
  const min = Math.max(2, Number(minDigits) || 2);
  const max = Math.max(min, Number(maxDigits) || min);
  return min + Math.floor(random() * (max - min + 1));
};

const createFourthGradeProblem = (settings = {}, random) => {
  const divisorMin = Math.max(2, Number(settings.divisorMin) || 2);
  const divisorMax = Math.min(9, Math.max(divisorMin, Number(settings.divisorMax) || 9));
  const divisor =
    divisorMin + Math.floor(random() * (divisorMax - divisorMin + 1));
  const dividendDigits = pickDigitWidth(
    settings.dividendDigitsMin || 2,
    settings.dividendDigitsMax || 4,
    random
  );
  const withRemainder = settings.includeRemainders !== false && random() < 0.5;
  const span = digitSpan(dividendDigits);
  const remainder = withRemainder ? 1 + Math.floor(random() * (divisor - 1)) : 0;
  const quotientMin = Math.max(2, Math.ceil((span.min - remainder) / divisor));
  const quotientMax = Math.floor((span.max - remainder) / divisor);
  if (quotientMax < quotientMin) {
    return null;
  }
  const quotient =
    quotientMin + Math.floor(random() * (quotientMax - quotientMin + 1));
  const dividend = divisor * quotient + remainder;
  if (String(dividend).length !== dividendDigits || divisor < 2 || divisor > 9) {
    return null;
  }
  return { dividend, divisor, quotient, remainder };
};

export const formatAnswer = (quotient, remainder) =>
  remainder > 0 ? `${quotient} R ${remainder}` : String(quotient);

export const usedDividendIndexes = (dividend, steps, stepIndex) => {
  if (!steps?.length || stepIndex < 0 || stepIndex >= steps.length) {
    return { start: -1, end: -1 };
  }
  let end = String(steps[0].into).length - 1;
  for (let index = 1; index <= stepIndex; index += 1) {
    end += 1;
  }
  const last = String(dividend).length - 1;
  return {
    start: Math.max(0, Math.min(stepIndex === 0 ? 0 : end, last)),
    end: Math.max(0, Math.min(end, last)),
  };
};

export const buildSteps = (dividend, divisor) => {
  const digits = String(dividend).split("").map(Number);
  const steps = [];
  let running = 0;
  let started = false;

  digits.forEach((digit, index) => {
    running = running * 10 + digit;
    const isLast = index === digits.length - 1;
    if (!started && running < divisor && !isLast) {
      return;
    }
    started = true;
    const quotientDigit = Math.floor(running / divisor);
    const product = quotientDigit * divisor;
    const remainder = running - product;
    steps.push({
      into: running,
      quotientDigit,
      product,
      remainder,
    });
    running = remainder;
  });

  return steps;
};

export const digitHint = (divisor, into, picked) => {
  const correct = Math.floor(into / divisor);
  const correctProduct = correct * divisor;
  const pickedProduct = picked * divisor;
  const comparison = pickedProduct > into ? "too big" : "too small";
  return `${divisor} × ${picked} = ${pickedProduct} is ${comparison}. ${divisor} × ${correct} = ${correctProduct} fits.`;
};

export const factOptions = (answer, count, random = Math.random) => {
  const options = [answer];
  for (let delta = 1; options.length < count && delta <= 12; delta += 1) {
    if (answer + delta <= 12) {
      options.push(answer + delta);
    }
    if (options.length >= count) {
      break;
    }
    if (answer - delta >= 0) {
      options.push(answer - delta);
    }
  }
  return shuffle(options, random);
};

export const remainderOptions = (remainder, divisor, count, random = Math.random) => {
  const options = [remainder];
  for (let value = 1; value < divisor && options.length < count; value += 1) {
    if (!options.includes(value)) {
      options.push(value);
    }
  }
  if (options.length < count) {
    options.push(0);
  }
  return shuffle(options.slice(0, count), random);
};

export const digitOptions = (correct, count, random = Math.random) => {
  const options = [correct];
  for (let delta = 1; options.length < count && delta <= 9; delta += 1) {
    if (correct + delta <= 9) {
      options.push(correct + delta);
    }
    if (options.length >= count) {
      break;
    }
    if (correct - delta >= 0) {
      options.push(correct - delta);
    }
  }
  return shuffle(options, random);
};

export const answerOptions = (problem, count, random = Math.random) => {
  const correct = formatAnswer(problem.quotient, problem.remainder);
  const options = [correct];
  const deltas = [1, -1, 2, -2, 10, -10, 3, -3, 4, -4];
  deltas.forEach((delta) => {
    if (options.length >= count) {
      return;
    }
    const quotient = problem.quotient + delta;
    if (quotient >= 0) {
      const label = formatAnswer(quotient, problem.remainder);
      if (!options.includes(label)) {
        options.push(label);
      }
    }
    if (options.length >= count || problem.remainder <= 0) {
      return;
    }
    const remainder = problem.remainder + delta;
    if (remainder > 0 && remainder < problem.divisor) {
      const label = formatAnswer(problem.quotient, remainder);
      if (!options.includes(label)) {
        options.push(label);
      }
    }
  });
  return shuffle(options.slice(0, count), random);
};

const createFactsProblem = (level, random) => {
  const divisor = pickDivisor(level, random);
  const quotientMin = Math.max(1, Number(level.quotientMin) || 1);
  const quotientMax = Math.max(quotientMin, Number(level.quotientMax) || 10);
  const quotient =
    quotientMin + Math.floor(random() * (quotientMax - quotientMin + 1));
  return {
    dividend: divisor * quotient,
    divisor,
    quotient,
    remainder: 0,
  };
};

const createExactProblem = (level, random) => {
  const divisor = pickDivisor(level, random);
  const { min, max } = digitSpan(level.dividendDigits);
  const quotientMin = Math.max(1, Math.ceil(min / divisor));
  const quotientMax = Math.floor(max / divisor);
  if (quotientMax < quotientMin) {
    return null;
  }
  const quotient =
    quotientMin + Math.floor(random() * (quotientMax - quotientMin + 1));
  return {
    dividend: divisor * quotient,
    divisor,
    quotient,
    remainder: 0,
  };
};

const createRemainderProblem = (level, random) => {
  const divisor = pickDivisor(level, random);
  const remainder = 1 + Math.floor(random() * (divisor - 1));
  const { min, max } = digitSpan(level.dividendDigits);
  const quotientMin = Math.max(1, Math.ceil((min - remainder) / divisor));
  const quotientMax = Math.floor((max - remainder) / divisor);
  if (quotientMax < quotientMin) {
    return null;
  }
  const quotient =
    quotientMin + Math.floor(random() * (quotientMax - quotientMin + 1));
  return {
    dividend: divisor * quotient + remainder,
    divisor,
    quotient,
    remainder,
  };
};

const decorateProblem = (problem, level, optionCount, random) => ({
  ...problem,
  facts: Boolean(level.facts),
  prompt: `${problem.dividend} ÷ ${problem.divisor}`,
  answer: formatAnswer(problem.quotient, problem.remainder),
  steps: buildSteps(problem.dividend, problem.divisor),
  options: answerOptions(problem, optionCount, random),
});

const makeProblem = (level, random) => {
  if (level.facts) {
    return createFactsProblem(level, random);
  }
  if (level.remainders) {
    return createRemainderProblem(level, random);
  }
  return createExactProblem(level, random);
};

export const createDivisionQuestions = (
  level,
  count,
  optionCount,
  random = Math.random
) => {
  const questions = [];
  const seen = new Set();
  let guard = 0;
  while (questions.length < count && guard < count * 40) {
    guard += 1;
    const problem = makeProblem(level, random);
    if (!problem) {
      continue;
    }
    const key = `${problem.dividend}÷${problem.divisor}`;
    if (
      seen.has(key) ||
      problem.divisor < 2 ||
      problem.divisor > 9 ||
      problem.dividend < problem.divisor
    ) {
      continue;
    }
    seen.add(key);
    questions.push(decorateProblem(problem, level, optionCount, random));
  }
  return questions;
};

export const createAdvanceDivisionQuestions = (
  settings,
  count,
  optionCount,
  random = Math.random
) => {
  const questions = [];
  const seen = new Set();
  let guard = 0;
  while (questions.length < count && guard < count * 40) {
    guard += 1;
    const problem = createFourthGradeProblem(settings, random);
    if (!problem) {
      continue;
    }
    const key = `${problem.dividend}÷${problem.divisor}`;
    if (seen.has(key) || problem.dividend < problem.divisor) {
      continue;
    }
    seen.add(key);
    questions.push(
      decorateProblem(problem, { facts: false, remainders: false }, optionCount, random)
    );
  }
  return questions;
};

export const levelFromSearch = (gameConfig, search = "") => {
  const configured = gameConfig.levels?.[0] ?? null;
  const raw = new URLSearchParams(search).get("level");
  const levelId = Number(raw);
  if (!raw || !Number.isInteger(levelId)) {
    return configured;
  }
  if (levelId < gameConfig.minLevel || levelId > gameConfig.maxLevel) {
    return configured;
  }
  return gameConfig.levels.find((item) => item.id === levelId) || configured;
};

export const practicePrompts = (problem) => {
  if (problem.facts) {
    return [
      {
        kind: "fact",
        prompt: `${problem.divisor} × ? = ${problem.dividend}`,
        answer: problem.quotient,
      },
    ];
  }
  const prompts = problem.steps.map((step) => ({
    kind: "digit",
    into: step.into,
    prompt: `How many times does ${problem.divisor} go into ${step.into}?`,
    answer: step.quotientDigit,
  }));
  if (problem.remainder > 0) {
    prompts.push({
      kind: "remainder",
      prompt: "What is left over?",
      answer: problem.remainder,
    });
  }
  return prompts;
};

export const nearbyOptions = (answer, count, random = Math.random) => {
  const options = [answer];
  [1, -1, 2, -2, 10, -10, 3, -3].forEach((delta) => {
    if (options.length >= count) {
      return;
    }
    const value = answer + delta;
    if (value >= 0 && !options.includes(value)) {
      options.push(value);
    }
  });
  return shuffle(options.slice(0, count), random);
};

export const lessonSteps = (problem) => {
  const steps = problem.steps.flatMap((step, index) => {
    const opener =
      index === 0
        ? String(step.into).length === 1
          ? `Look at ${step.into}.`
          : `${problem.divisor} does not fit until you reach ${step.into}.`
        : `Bring down the next digit. Now you have ${step.into}.`;
    return [
      {
        kind: "divide",
        phase: "Divide",
        into: step.into,
        step,
        stepIndex: index,
        prompt: `${opener} How many times does ${problem.divisor} go into ${step.into}?`,
        answer: step.quotientDigit,
      },
      {
        kind: "multiply",
        phase: "Multiply",
        step,
        stepIndex: index,
        prompt: `Multiply ${problem.divisor} × ${step.quotientDigit}. What is the product?`,
        answer: step.product,
      },
      {
        kind: "subtract",
        phase: "Subtract",
        step,
        stepIndex: index,
        prompt: `Subtract ${step.into} − ${step.product}. What is left?`,
        answer: step.remainder,
      },
    ];
  });
  if (problem.remainder > 0) {
    steps.push({
      kind: "remainder",
      phase: "Left over",
      stepIndex: problem.steps.length - 1,
      prompt: `${problem.quotient} groups were made. How many are left over?`,
      answer: problem.remainder,
    });
  }
  return steps;
};

export const lessonLogEntry = (problem, prompt) => {
  if (prompt.kind === "remainder") {
    return `Left over: ${problem.quotient} groups, ${problem.remainder} left over.`;
  }
  const step = prompt.step;
  if (prompt.kind === "divide") {
    const times = step.quotientDigit === 1 ? "time" : "times";
    return `Divide: ${problem.divisor} goes into ${step.into} ${step.quotientDigit} ${times}.`;
  }
  if (prompt.kind === "multiply") {
    return `Multiply: ${problem.divisor} × ${step.quotientDigit} = ${step.product}.`;
  }
  return `Subtract: ${step.into} − ${step.product} = ${step.remainder}.`;
};

export const remainderMeaning = (problem) =>
  `${problem.quotient} groups, ${problem.remainder} left over.`;

const scoreRatio = (game) => (game.total > 0 ? game.score / game.total : 0);

const compareByScore = (a, b) =>
  b.score - a.score || scoreRatio(b) - scoreRatio(a) || a.timeMs - b.timeMs;

const compareByTime = (a, b) =>
  a.timeMs - b.timeMs || b.score - a.score || scoreRatio(b) - scoreRatio(a);

const isRecord = (game) =>
  Boolean(game) &&
  typeof game.id === "string" &&
  Number.isFinite(Number(game.score)) &&
  Number.isFinite(Number(game.total)) &&
  Number(game.total) > 0 &&
  Number.isFinite(Number(game.timeMs));

export const rankDivisionGames = (games, category) => {
  const list = (Array.isArray(games) ? games : []).filter(isRecord);
  if (category === "both") {
    const maxTime = Math.max(...list.map((game) => Number(game.timeMs)), 1);
    const bothValue = (game) =>
      scoreRatio(game) + (1 - Number(game.timeMs) / maxTime);
    return [...list].sort(
      (a, b) => bothValue(b) - bothValue(a) || compareByScore(a, b)
    );
  }
  return [...list].sort(category === "time" ? compareByTime : compareByScore);
};

export const withDivisionBests = (games) => {
  const list = (Array.isArray(games) ? games : []).filter(isRecord);
  const bestScoreId = rankDivisionGames(list, "score")[0]?.id ?? null;
  const bestTimeId = rankDivisionGames(list, "time")[0]?.id ?? null;
  const bestBothId = rankDivisionGames(list, "both")[0]?.id ?? null;
  return list.map((game) => ({
    ...game,
    score: Number(game.score),
    total: Number(game.total),
    timeMs: Number(game.timeMs),
    bestScore: game.id === bestScoreId,
    bestTime: game.id === bestTimeId,
    bestBoth: game.id === bestBothId,
  }));
};

export const topDivisionScores = (games, category, limit = 10) =>
  rankDivisionGames(withDivisionBests(games), category).slice(0, limit);

export const appendDivisionGame = (games, game) => {
  if (!isRecord(game)) {
    return withDivisionBests(games);
  }
  return withDivisionBests([...withDivisionBests(games), game].slice(-HISTORY_LIMIT));
};
