import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LEVELS, type Level, type Question } from '../types';

// 60 questions per level. In 'choice' mode they are single-tap ("right" is always the correct option,
// the order is shuffled); in 'gap' mode they need typing "right" in a field and pressing Next.
let mode: 'choice' | 'gap' = 'choice';
const poolOf = (level: Level): Question[] =>
  Array.from<unknown, unknown>({ length: 60 }, (_, i) =>
    mode === 'choice'
      ? {
          id: `${level}-${i}`,
          type: 'multiple-choice',
          level,
          topic: i % 2 ? 'topic-odd' : 'topic-even',
          prompt: `Question ${level} ${i} ___`,
          explanation: 'The rule is simple here.',
          options: ['right', 'wrong one', 'wrong two'],
          correct: 0,
          wrongReasons: { 1: 'one', 2: 'two' },
        }
      : {
          id: `${level}-${i}`,
          type: 'fill-blank',
          level,
          topic: 'topic-gap',
          prompt: `Question ${level} ${i}`,
          explanation: 'The rule is simple here.',
          text: 'The answer is ___.',
          answers: [['right']],
          wrongReasons: { nope: 'no' },
        },
  ) as Question[];

vi.mock('../data', () => ({ loadLevel: (level: Level) => Promise.resolve(poolOf(level)) }));

import HomePage from './HomePage';
import PlacementPage from './PlacementPage';

type User = ReturnType<typeof userEvent.setup>;

function renderApp(strict = false, start = '/placement') {
  const Wrapper = strict ? StrictMode : ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return render(
    <Wrapper>
      <MemoryRouter initialEntries={[start]}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/placement" element={<PlacementPage />} />
          <Route path="/quiz/:level" element={<p>quiz page</p>} />
        </Routes>
      </MemoryRouter>
    </Wrapper>,
  );
}

const startTest = async (user: User) => {
  renderApp();
  await user.click(screen.getByRole('button', { name: 'Start the test' }));
  await screen.findByText('Question 1 / 40');
};

/** The level of the question on screen (the mock puts it in the prompt). */
const levelOnScreen = () => /Question (A1|A2|B1|B2|C1|C2) /.exec(document.querySelector('.question-prompt')!.textContent!)![1];

/** Answers the question on screen (single-tap mode) and waits for the next one. */
const tap = async (user: User, right: boolean, n: number) => {
  await user.click(screen.getByLabelText(right ? 'right' : 'wrong one'));
  if (n < 40) await screen.findByText(`Question ${n + 1} / 40`);
};
const skip = async (user: User, n: number) => {
  await user.click(screen.getByRole('button', { name: 'Skip' }));
  if (n < 40) await screen.findByText(`Question ${n + 1} / 40`);
};
const finish = (user: User) => user.click(screen.getByRole('button', { name: 'Finish test' }));

beforeEach(() => {
  localStorage.clear();
  mode = 'choice';
});
afterEach(cleanup);

describe('PlacementPage: the staircase', () => {
  it('explains the test and starts on a button, without a certification disclaimer', async () => {
    const user = userEvent.setup();
    renderApp();
    expect(screen.getByRole('heading', { name: 'Find your level' })).toBeInTheDocument();
    expect(screen.getByText(/40 questions in 40 minutes, one at a time/)).toBeInTheDocument();
    expect(screen.getByText(/a right answer makes the next question harder, a wrong answer or a skip makes it easier/)).toBeInTheDocument();
    expect(screen.queryByText(/certification/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    expect(await screen.findByText('Question 1 / 40')).toBeInTheDocument();
  });

  it('starts at A1; a right answer makes the next question harder, a wrong one or a skip easier', async () => {
    const user = userEvent.setup();
    await startTest(user);
    expect(levelOnScreen()).toBe('A1');
    await tap(user, true, 1);
    expect(levelOnScreen()).toBe('A2');
    await tap(user, true, 2);
    expect(levelOnScreen()).toBe('B1');
    await tap(user, false, 3);
    expect(levelOnScreen()).toBe('A2');
    await skip(user, 4);
    expect(levelOnScreen()).toBe('A1');
    await tap(user, false, 5);
    expect(levelOnScreen()).toBe('A1'); // never below A1
  });

  it('never goes above C2', async () => {
    const user = userEvent.setup();
    await startTest(user);
    for (let n = 1; n <= 8; n++) await tap(user, true, n);
    expect(levelOnScreen()).toBe('C2');
  });

  it('never asks the same question twice in a test', async () => {
    const user = userEvent.setup();
    await startTest(user);
    const seen = new Set<string>();
    for (let n = 1; n <= 40; n++) {
      const prompt = document.querySelector('.question-prompt')!.textContent!;
      expect(seen.has(prompt), prompt).toBe(false);
      seen.add(prompt);
      if (n < 40) await skip(user, n);
    }
  });
});

describe('PlacementPage: sequence, skip and tiles', () => {
  it('has 40 tiles; only the ones already reached can be opened', async () => {
    const user = userEvent.setup();
    await startTest(user);
    const nav = within(screen.getByRole('navigation', { name: 'Questions' }));
    expect(nav.getAllByRole('button')).toHaveLength(40);
    expect(screen.getByRole('button', { name: 'Question 1, current' })).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('button', { name: 'Question 1, current' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Question 2, not reached yet' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Question 40, not reached yet' })).toBeDisabled();
    await tap(user, true, 1);
    expect(screen.getByRole('button', { name: 'Question 1, answered' })).toHaveTextContent('✓');
    expect(screen.getByRole('button', { name: 'Question 2, current' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Question 3, not reached yet' })).toBeDisabled();
  });

  it('marks a skipped question with a dash', async () => {
    const user = userEvent.setup();
    await startTest(user);
    await skip(user, 1);
    expect(screen.getByRole('button', { name: 'Question 1, skipped' })).toHaveTextContent('–');
    expect(screen.queryByText('✓')).not.toBeInTheDocument();
  });

  it('lets you look at an earlier question read-only and go back to the one in progress', async () => {
    const user = userEvent.setup();
    await startTest(user);
    await tap(user, false, 1); // wrong -> A1 again
    await tap(user, true, 2);
    const firstPrompt = (await screen.findByText('Question 3 / 40')) && null;
    void firstPrompt;
    const current = document.querySelector('.question-prompt')!.textContent;

    await user.click(screen.getByRole('button', { name: 'Question 1, answered' }));
    expect(screen.getByText('Question 1 / 40')).toBeInTheDocument();
    expect(screen.getByText(/You are reviewing question 1\. Your answer cannot be changed\./)).toBeInTheDocument();
    expect(screen.getByLabelText('wrong one')).toBeChecked();
    expect(screen.getByLabelText('wrong one')).toBeDisabled();
    expect(screen.getByLabelText('right')).toBeDisabled();
    // no feedback during the test
    expect(screen.queryByText(/Correct answer/)).not.toBeInTheDocument();
    expect(screen.queryByText('✗ Incorrect')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Skip' })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Back to question 3' }));
    expect(screen.getByText('Question 3 / 40')).toBeInTheDocument();
    expect(document.querySelector('.question-prompt')!.textContent).toBe(current);
    expect(screen.queryByText(/You are reviewing/)).not.toBeInTheDocument();
    expect(screen.getByLabelText('right')).toBeEnabled();
  });

  it('shows a skipped question as skipped when reviewed', async () => {
    const user = userEvent.setup();
    await startTest(user);
    await skip(user, 1);
    await user.click(screen.getByRole('button', { name: 'Question 1, skipped' }));
    expect(screen.getByRole('heading', { name: /Question 1.*\(skipped\)/ })).toBeInTheDocument();
    expect(screen.getByLabelText('right')).not.toBeChecked();
  });

  it('announces each new question to screen readers', async () => {
    const user = userEvent.setup();
    await startTest(user);
    await tap(user, true, 1);
    expect(screen.getByRole('status')).toHaveTextContent('Question 2 of 40');
  });
});

describe('PlacementPage: any type of question', () => {
  it('multi-field questions need "Next", enabled only when the answer is complete; Skip is always there', async () => {
    mode = 'gap';
    const user = userEvent.setup();
    await startTest(user);
    expect(screen.getByRole('button', { name: 'Skip' })).toBeEnabled();
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
    await user.type(screen.getByLabelText('Gap 1'), 'right');
    expect(screen.getByRole('button', { name: 'Next' })).toBeEnabled();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    await screen.findByText('Question 2 / 40');
    expect(levelOnScreen()).toBe('A2'); // typed the right answer: harder
  });

  it('pressing Enter in the last field works like Next; a wrong answer makes the next one easier', async () => {
    mode = 'gap';
    const user = userEvent.setup();
    await startTest(user);
    await user.type(screen.getByLabelText('Gap 1'), 'right{Enter}');
    await screen.findByText('Question 2 / 40');
    expect(levelOnScreen()).toBe('A2');
    await user.type(screen.getByLabelText('Gap 1'), 'nope{Enter}');
    await screen.findByText('Question 3 / 40');
    expect(levelOnScreen()).toBe('A1');
  });

  it('single-tap questions have no Next button: choosing moves on', async () => {
    const user = userEvent.setup();
    await startTest(user);
    expect(screen.queryByRole('button', { name: 'Next' })).not.toBeInTheDocument();
    expect(screen.getByText(/Tap an answer to continue/)).toBeInTheDocument();
  });
});

describe('PlacementPage: finishing', () => {
  it('finishes on a button, counting only the questions done', async () => {
    const user = userEvent.setup();
    await startTest(user);
    expect(screen.getByRole('button', { name: 'Finish test' })).toBeDisabled();
    await tap(user, true, 1);
    await finish(user);
    await screen.findByRole('heading', { name: 'Your level' });
    const saved = JSON.parse(localStorage.getItem('eq.placement')!);
    expect(LEVELS.reduce((n: number, l) => n + saved.perLevel[l].answered, 0)).toBe(1);
  });

  it('counts the question in progress only if its answer is complete', async () => {
    mode = 'gap';
    const user = userEvent.setup();
    await startTest(user);
    await user.type(screen.getByLabelText('Gap 1'), 'right{Enter}');
    await screen.findByText('Question 2 / 40');
    await finish(user); // question 2 has no answer: it does not count
    await screen.findByRole('heading', { name: 'Your level' });
    const count = () => LEVELS.reduce((n: number, l) => n + JSON.parse(localStorage.getItem('eq.placement')!).perLevel[l].answered, 0);
    expect(count()).toBe(1);
  });

  it('counts the question in progress when its answer is complete', async () => {
    mode = 'gap';
    const user = userEvent.setup();
    await startTest(user);
    await user.type(screen.getByLabelText('Gap 1'), 'right{Enter}');
    await screen.findByText('Question 2 / 40');
    await user.type(screen.getByLabelText('Gap 1'), 'nope'); // typed but not confirmed with Next
    await finish(user);
    await screen.findByRole('heading', { name: 'Your level' });
    const saved = JSON.parse(localStorage.getItem('eq.placement')!);
    expect(LEVELS.reduce((n: number, l) => n + saved.perLevel[l].answered, 0)).toBe(2);
  });

  it('an all-correct run ends at C2 and saves the result', async () => {
    const user = userEvent.setup();
    await startTest(user);
    for (let n = 1; n <= 40; n++) await tap(user, true, n);
    // the last question stays on screen until "Finish test"
    expect(screen.getByText('Question 40 / 40')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Skip' })).toBeInTheDocument();
    await finish(user);
    expect(await screen.findByRole('heading', { name: 'Your level' })).toBeInTheDocument();
    expect(document.querySelector('.display-3')).toHaveTextContent('C2');
    expect(screen.getByText('Proficiency')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Practise C2' })).toBeInTheDocument();
    const saved = JSON.parse(localStorage.getItem('eq.placement')!);
    expect(saved.level).toBe('C2');
    expect(LEVELS.reduce((n, l) => n + saved.perLevel[l].answered, 0)).toBe(40);
    expect(screen.queryByText('Topics to review')).not.toBeInTheDocument();
  });

  it('an all-wrong run (or all skipped) ends at A1 and lists the weak topics', async () => {
    const user = userEvent.setup();
    await startTest(user);
    for (let n = 1; n <= 40; n++) await tap(user, false, n);
    await finish(user);
    await screen.findByRole('heading', { name: 'Your level' });
    expect(screen.getByRole('button', { name: 'Practise A1' })).toBeInTheDocument();
    expect(screen.getByText('Topics to review')).toBeInTheDocument();
    expect(screen.getAllByText(/mistakes/).length).toBeGreaterThan(0);
    // the adaptive test never leaves A1 here: the other levels are not tested
    expect(screen.getAllByText('Not tested')).toHaveLength(5);
  });

  it('answering the 40th question and pressing Finish test ends the test', async () => {
    const user = userEvent.setup();
    await startTest(user);
    for (let n = 1; n <= 39; n++) await skip(user, n);
    await user.click(screen.getByLabelText('right'));
    expect(screen.getByText('Question 40 / 40')).toBeInTheDocument(); // stays here
    await finish(user);
    await screen.findByRole('heading', { name: 'Review your answers' });
    expect(screen.getAllByText('✓ Correct')).toHaveLength(1);
  });

  it('skipping the 40th question closes the test', async () => {
    const user = userEvent.setup();
    await startTest(user);
    for (let n = 1; n <= 39; n++) await skip(user, n);
    await user.click(screen.getByRole('button', { name: 'Skip' }));
    expect(await screen.findByRole('heading', { name: 'Your level' })).toBeInTheDocument();
  });

  it('reviews the questions done, with the corrections; skipped ones show "No answer"', async () => {
    const user = userEvent.setup();
    await startTest(user);
    await tap(user, true, 1);
    await tap(user, false, 2);
    await skip(user, 3);
    await finish(user); // question 4 was never answered: it does not count
    await screen.findByRole('heading', { name: 'Review your answers' });
    expect(screen.getAllByText('✓ Correct')).toHaveLength(1);
    expect(screen.getAllByText('✗ Incorrect')).toHaveLength(2);
    expect(screen.getAllByText('Your answer:')).toHaveLength(2);
    expect(screen.getAllByText('No answer')).toHaveLength(1);
    expect(screen.getAllByText(/Why it's wrong:/)).toHaveLength(1);
    expect(screen.getAllByText('Correct answer:')).toHaveLength(2);
    await user.click(screen.getByRole('button', { name: 'Show correct answers' }));
    expect(screen.getAllByText('Correct answer:')).toHaveLength(3);
  });

  it('"Practise" opens a normal quiz of the estimated level', async () => {
    const user = userEvent.setup();
    await startTest(user);
    for (let n = 1; n <= 40; n++) await tap(user, true, n);
    await finish(user);
    await user.click(await screen.findByRole('button', { name: 'Practise C2' }));
    expect(await screen.findByText('quiz page')).toBeInTheDocument();
  });

  it('"Retake the test" goes back to the intro', async () => {
    const user = userEvent.setup();
    await startTest(user);
    await tap(user, true, 1);
    await finish(user);
    await user.click(await screen.findByRole('button', { name: 'Retake the test' }));
    expect(screen.getByRole('button', { name: 'Start the test' })).toBeInTheDocument();
  });

  it('works in StrictMode and quits back to the home page without saving', async () => {
    const user = userEvent.setup();
    renderApp(true);
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await screen.findByText('Question 1 / 40');
    await user.click(screen.getByLabelText('right'));
    await screen.findByText('Question 2 / 40');
    expect(levelOnScreen()).toBe('A2'); // one step only, even in StrictMode
    await user.click(screen.getByRole('button', { name: 'Quit test' }));
    expect(await screen.findByRole('heading', { name: 'Practise your English' })).toBeInTheDocument();
    expect(localStorage.getItem('eq.placement')).toBeNull();
  });
});

describe('PlacementPage: the time limit', () => {
  it('stops the test when the time runs out and scores the questions done', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderApp();
      await user.click(screen.getByRole('button', { name: 'Start the test' }));
      await screen.findByText('Question 1 / 40');
      expect(screen.getByRole('timer')).toHaveTextContent('40:00');
      await user.click(screen.getByLabelText('right'));
      await act(async () => {
        vi.advanceTimersByTime(41 * 60 * 1000);
      });
      expect(await screen.findByRole('heading', { name: 'Your level' })).toBeInTheDocument();
      expect(JSON.parse(localStorage.getItem('eq.placement')!).level).toBeDefined();
    } finally {
      vi.useRealTimers();
    }
  });

  it('goes back to the intro, saving nothing, if time runs out before any question is done', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    try {
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderApp();
      await user.click(screen.getByRole('button', { name: 'Start the test' }));
      await screen.findByText('Question 1 / 40');
      await act(async () => {
        vi.advanceTimersByTime(41 * 60 * 1000);
      });
      expect(await screen.findByText(/Time is up/)).toBeInTheDocument();
      expect(localStorage.getItem('eq.placement')).toBeNull();
    } finally {
      vi.useRealTimers();
    }
  });
});

describe('HomePage placement box', () => {
  it('invites to find the level, then shows the last result', async () => {
    const user = userEvent.setup();
    renderApp(false, '/');
    expect(screen.getByText('Not sure about your level?')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Find your level' }));
    expect(await screen.findByRole('heading', { name: 'Find your level' })).toBeInTheDocument();
    cleanup();

    localStorage.setItem('eq.placement', JSON.stringify({ date: '2026-10-04T10:00:00.000Z', level: 'B2', perLevel: {} }));
    renderApp(false, '/');
    expect(screen.getByText('Your level: B2')).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Retake the test' })).toBeInTheDocument());
  });

  it('starts the quiz straight from a question-count tile (5/10/20/40), with no Start button', async () => {
    const user = userEvent.setup();
    renderApp(false, '/');
    expect(screen.queryByRole('button', { name: 'Start' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /Start with/ })).not.toBeInTheDocument();
    await user.click(screen.getByRole('radio', { name: /A2/ }));
    for (const n of [5, 10, 20, 40]) expect(screen.getByRole('button', { name: `Start with ${n} questions` })).toBeEnabled();
    for (const b of screen.getAllByRole('button', { name: /Start with/ })) expect(b).not.toHaveClass('active', 'btn-primary');
    await user.click(screen.getByRole('button', { name: 'Start with 40 questions' }));
    expect(await screen.findByText('quiz page')).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem('eq.prefs')!)).toMatchObject({ lastLevel: 'A2', questionCount: 40 });
  });
});
