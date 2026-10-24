import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom';
import QuizSetupPage from './QuizSetupPage';
import { loadLevel } from '../data';
import { loadPrefs } from '../hooks/store';
import type { Question } from '../types';

const base = { level: 'A1' as const, topic: 't', prompt: 'p', explanation: 'rule' };
const pool: Question[] = [
  { ...base, id: 'a', type: 'multiple-choice', options: ['x', 'y'], correct: 0, topics: ['verb-tenses'] },
  { ...base, id: 'b', type: 'multiple-choice', options: ['x', 'y'], correct: 0, topics: ['verb-tenses', 'prepositions'] },
  { ...base, id: 'c', type: 'multiple-choice', options: ['x', 'y'], correct: 0, topics: ['everyday-life'] },
];

vi.mock('../data', () => ({ loadLevel: vi.fn(async () => pool) }));

function QuizLocation() {
  return <p>quiz{useLocation().search}</p>;
}

function renderHome() {
  return render(
    <MemoryRouter initialEntries={['/']}>
      <Routes>
        <Route path="/" element={<QuizSetupPage />} />
        <Route path="/quiz/:level" element={<QuizLocation />} />
      </Routes>
    </MemoryRouter>,
  );
}

beforeEach(() => localStorage.clear());
afterEach(() => cleanup());

describe('QuizSetupPage topic filter', () => {
  it('shows the topics only after a level is chosen, with the number of questions per topic', async () => {
    renderHome();
    expect(screen.queryByRole('group', { name: 'Topics' })).not.toBeInTheDocument();
    await userEvent.click(screen.getByRole('radio', { name: /A1/ }));
    expect(await screen.findByRole('button', { name: /Verb tenses\s*\(2\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Everyday life\s*\(1\)/ })).toBeInTheDocument();
  });

  it('disables the topics without questions at the level', async () => {
    renderHome();
    await userEvent.click(screen.getByRole('radio', { name: /A1/ }));
    expect(await screen.findByRole('button', { name: /Modal verbs/ })).toBeDisabled();
  });

  it('counts each question once, even when it has several selected topics', async () => {
    renderHome();
    await userEvent.click(screen.getByRole('radio', { name: /A1/ }));
    await userEvent.click(await screen.findByRole('button', { name: /Verb tenses/ }));
    await userEvent.click(screen.getByRole('button', { name: /Prepositions/ }));
    expect(await screen.findByText('2 questions match your selection')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Verb tenses/ })).toHaveAttribute('aria-pressed', 'true');
  });

  it('starts the quiz with the selected topics and saves them', async () => {
    renderHome();
    await userEvent.click(screen.getByRole('radio', { name: /A1/ }));
    await userEvent.click(await screen.findByRole('button', { name: /Everyday life/ }));
    await userEvent.click(screen.getByRole('button', { name: 'Start with 5 questions' }));
    expect(await screen.findByText('quiz?n=5&topics=everyday-life')).toBeInTheDocument();
    expect(loadPrefs().topics).toEqual(['everyday-life']);
  });

  it('starts with all topics when none is selected, and "All topics" clears the selection', async () => {
    renderHome();
    await userEvent.click(screen.getByRole('radio', { name: /A1/ }));
    await userEvent.click(await screen.findByRole('button', { name: /Everyday life/ }));
    await userEvent.click(screen.getByRole('button', { name: 'All topics' }));
    expect(await screen.findByText('3 questions match your selection')).toBeInTheDocument();
    await waitFor(() => expect(screen.queryByRole('button', { name: 'All topics' })).not.toBeInTheDocument());
    expect(loadPrefs().topics).toEqual([]);
  });

  it('explains that the level could not be loaded, instead of showing zero matches', async () => {
    vi.mocked(loadLevel).mockRejectedValueOnce(new Error('offline'));
    renderHome();
    await userEvent.click(screen.getByRole('radio', { name: /A1/ }));
    expect(await screen.findByText(/Could not load this level/)).toBeInTheDocument();
    expect(screen.queryByText(/questions match your selection/)).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Start with 5 questions' })).toBeDisabled();
  });
});
