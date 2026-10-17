import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LEVELS, type Level, type Question } from '../types';

// 60 single-tap questions per level: "right" is always the correct option (the order is shuffled).
const poolOf = (level: Level): Question[] =>
  Array.from({ length: 60 }, (_, i) => ({
    id: `${level}-${i}`,
    type: 'multiple-choice',
    level,
    topic: i % 2 ? 'topic-odd' : 'topic-even',
    prompt: `Question ${level} ${i} ___`,
    explanation: 'The rule is simple here.',
    options: ['right', 'wrong one', 'wrong two'],
    correct: 0,
    wrongReasons: { 1: 'one', 2: 'two' },
  }));

vi.mock('../data', () => ({ loadLevel: (level: Level) => Promise.resolve(poolOf(level)) }));

import HomePage from './HomePage';
import PlacementPage from './PlacementPage';

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

/** Answers the first `n` questions, always right or always wrong, moving on with "Next". */
async function answer(user: ReturnType<typeof userEvent.setup>, n: number, right: boolean) {
  for (let i = 0; i < n; i++) {
    await screen.findByText(`Question ${i + 1} / 40`);
    await user.click(screen.getByLabelText(right ? 'right' : 'wrong one'));
    if (i < n - 1) await user.click(screen.getByRole('button', { name: 'Next' }));
  }
}

const finish = (user: ReturnType<typeof userEvent.setup>) => user.click(screen.getByRole('button', { name: 'Finish test' }));

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('PlacementPage', () => {
  it('explains the test and starts on a button, without a certification disclaimer', async () => {
    const user = userEvent.setup();
    renderApp();
    expect(screen.getByRole('heading', { name: 'Find your level' })).toBeInTheDocument();
    expect(screen.getByText(/40 questions in 40 minutes, one at a time/)).toBeInTheDocument();
    expect(screen.queryByText(/certification/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    expect(await screen.findByText('Question 1 / 40')).toBeInTheDocument();
  });

  it('does not advance by itself and lets you go back and change an answer', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await screen.findByText('Question 1 / 40');
    expect(screen.getByRole('button', { name: 'Previous' })).toBeDisabled();
    await user.click(screen.getByLabelText('wrong one'));
    expect(screen.getByText('Question 1 / 40')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByText('Question 2 / 40')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Question 2 of 40');
    await user.click(screen.getByRole('button', { name: 'Previous' }));
    expect(screen.getByLabelText('wrong one')).toBeChecked();
    await user.click(screen.getByLabelText('right'));
    expect(screen.getByLabelText('right')).toBeChecked();
  });

  it('shows 40 tiles that jump to a question and get a green check once answered', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await screen.findByText('Question 1 / 40');
    const tiles = within(screen.getByRole('navigation', { name: 'Questions' })).getAllByRole('button');
    expect(tiles).toHaveLength(40);
    expect(screen.queryByText('✓')).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('right'));
    expect(screen.getByRole('button', { name: 'Question 1, answered' })).toHaveTextContent('✓');
    expect(screen.getByRole('button', { name: 'Question 2, not answered' })).not.toHaveTextContent('✓');
    await user.click(screen.getByRole('button', { name: 'Question 25, not answered' }));
    expect(await screen.findByText('Question 25 / 40')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Question 25, not answered' })).toHaveAttribute('aria-current', 'step');
  });

  it('finishes on a button, scoring only the answered questions', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await screen.findByText('Question 1 / 40');
    expect(screen.getByRole('button', { name: 'Finish test' })).toBeDisabled();
    await user.click(screen.getByLabelText('right'));
    await finish(user);
    await screen.findByRole('heading', { name: 'Your level' });
    const saved = JSON.parse(localStorage.getItem('eq.placement')!);
    expect(LEVELS.reduce((n: number, l) => n + saved.perLevel[l].answered, 0)).toBe(1);
  });

  it('stops the test when the time runs out and scores the answers given', async () => {
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

  it('goes back to the intro, saving nothing, if time runs out before any answer', async () => {
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

  it('an all-correct run ends at C2 and saves the result', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await answer(user, 40, true);
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

  it('an all-wrong run ends at A1 and lists the weak topics', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await answer(user, 40, false);
    await finish(user);
    await screen.findByRole('heading', { name: 'Your level' });
    expect(screen.getByRole('button', { name: 'Practise A1' })).toBeInTheDocument();
    expect(screen.getByText('Topics to review')).toBeInTheDocument();
    expect(screen.getAllByText(/mistakes/).length).toBeGreaterThan(0);
  });

  it('never asks the same question twice in a test', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    const seen = new Set<string>();
    for (let i = 0; i < 40; i++) {
      await screen.findByText(`Question ${i + 1} / 40`);
      const prompt = document.querySelector('.question-prompt')!.textContent!;
      expect(seen.has(prompt), prompt).toBe(false);
      seen.add(prompt);
      if (i < 39) await user.click(screen.getByRole('button', { name: 'Next' }));
    }
  });

  it('works in StrictMode and quits back to the home page without saving', async () => {
    const user = userEvent.setup();
    renderApp(true);
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await screen.findByText('Question 1 / 40');
    await user.click(screen.getByLabelText('right'));
    await user.click(screen.getByRole('button', { name: 'Quit test' }));
    expect(await screen.findByRole('heading', { name: 'Practise your English' })).toBeInTheDocument();
    expect(localStorage.getItem('eq.placement')).toBeNull();
  });

  it('"Practise" opens a normal quiz of the estimated level', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await answer(user, 40, true);
    await finish(user);
    await user.click(await screen.findByRole('button', { name: 'Practise C2' }));
    expect(await screen.findByText('quiz page')).toBeInTheDocument();
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
