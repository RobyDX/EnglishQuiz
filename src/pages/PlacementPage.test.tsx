import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
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

/** Answers `n` questions, always right or always wrong. */
async function answer(user: ReturnType<typeof userEvent.setup>, n: number, right: boolean) {
  for (let i = 0; i < n; i++) {
    await screen.findByText(`Question ${i + 1} / 40`);
    await user.click(screen.getByLabelText(right ? 'right' : 'wrong one'));
  }
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('PlacementPage', () => {
  it('explains the test and starts on a button, without a certification disclaimer', async () => {
    const user = userEvent.setup();
    renderApp();
    expect(screen.getByRole('heading', { name: 'Find your level' })).toBeInTheDocument();
    expect(screen.getByText(/40 questions, one at a time/)).toBeInTheDocument();
    expect(screen.queryByText(/certification/i)).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    expect(await screen.findByText('Question 1 / 40')).toBeInTheDocument();
  });

  it('moves on by itself as soon as an answer is chosen (no confirm button, no going back)', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await screen.findByText('Question 1 / 40');
    expect(screen.queryByRole('button', { name: /check answers|next|back|previous/i })).not.toBeInTheDocument();
    await user.click(screen.getByLabelText('right'));
    expect(await screen.findByText('Question 2 / 40')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Question 2 of 40');
  });

  it('an all-correct run ends at C2 and saves the result', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await answer(user, 40, true);
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
      await user.click(screen.getByLabelText('right'));
    }
  });

  it('works in StrictMode and quits back to the home page without saving', async () => {
    const user = userEvent.setup();
    renderApp(true);
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await screen.findByText('Question 1 / 40');
    await user.click(screen.getByLabelText('right'));
    await screen.findByText('Question 2 / 40');
    await user.click(screen.getByRole('button', { name: 'Quit test' }));
    expect(await screen.findByRole('heading', { name: 'Practise your English' })).toBeInTheDocument();
    expect(localStorage.getItem('eq.placement')).toBeNull();
  });

  it('"Practise" opens a normal quiz of the estimated level', async () => {
    const user = userEvent.setup();
    renderApp();
    await user.click(screen.getByRole('button', { name: 'Start the test' }));
    await answer(user, 40, true);
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
});
