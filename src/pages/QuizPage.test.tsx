import { StrictMode } from 'react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { cleanup, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import type { Question } from '../types';

const pool: Question[] = [
  {
    id: 't-mc-1',
    type: 'multiple-choice',
    level: 'A1',
    topic: 'to-be',
    prompt: 'They ___ my friends.',
    options: ['is', 'am', 'are'],
    correct: 2,
    explanation: "Use 'are' with you, we and they.",
    wrongReasons: { 0: "'is' is used with he, she and it." },
  },
  {
    id: 't-fb-1',
    type: 'fill-blank',
    level: 'A1',
    topic: 'to-be',
    prompt: 'Complete the sentence.',
    text: 'I ___ a student.',
    answers: [['am']],
    explanation: "Use 'am' with I.",
  },
];

vi.mock('../data', () => ({ loadLevel: () => Promise.resolve(pool) }));

import QuizPage from './QuizPage';

function renderQuiz(strict = false) {
  const Wrapper = strict ? StrictMode : ({ children }: { children: React.ReactNode }) => <>{children}</>;
  return render(
    <Wrapper>
    <MemoryRouter initialEntries={['/quiz/A1?n=5']}>
      <Routes>
        <Route path="/" element={<p>home</p>} />
        <Route path="/quiz/:level" element={<QuizPage />} />
      </Routes>
    </MemoryRouter>
    </Wrapper>,
  );
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('QuizPage', () => {
  it('has a sticky progress bar with a button that scrolls to the end of the page', async () => {
    const user = userEvent.setup();
    const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
    renderQuiz();
    await screen.findByRole('button', { name: 'Check answers' });

    expect(screen.getByText('0 / 2 answered').closest('.quiz-bar')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Go to the end of the page' }));
    expect(scrollTo).toHaveBeenCalledWith(expect.objectContaining({ behavior: 'smooth' }));

    await user.click(screen.getByLabelText('are'));
    expect(screen.getByText('1 / 2 answered')).toBeInTheDocument();
    scrollTo.mockRestore();
  });

  it('scores the answers and explains a wrong one in English', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await screen.findByRole('button', { name: 'Check answers' });

    await user.click(screen.getByLabelText('is')); // wrong
    await user.type(screen.getByLabelText('Gap 1'), 'am'); // right
    await user.click(screen.getByRole('button', { name: 'Check answers' }));

    const score = await screen.findByRole('status');
    expect(score).toHaveTextContent('1 / 2 correct – 50%');

    expect(screen.getByText('✓ Correct')).toBeInTheDocument();
    expect(screen.getByText('✗ Incorrect')).toBeInTheDocument();
    const feedback = screen.getByText(/Why it's wrong:/).closest('.feedback') as HTMLElement;
    expect(within(feedback).getByText(/'is' is used with he, she and it\./)).toBeInTheDocument();
    expect(within(feedback).getByText(/Use 'are' with you, we and they\./)).toBeInTheDocument();
    expect(within(feedback).getByText(/Correct answer:/).parentElement).toHaveTextContent('are');

    // The correct answer of the right question appears only after "Show correct answers"
    expect(screen.queryAllByText(/Rule:/)).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: 'Show correct answers' }));
    expect(screen.getAllByText(/Rule:/)).toHaveLength(2);
    expect(screen.getByRole('button', { name: 'Hide correct answers' })).toBeInTheDocument();
  });

  it('asks for confirmation when questions are unanswered and marks them wrong', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await screen.findByRole('button', { name: 'Check answers' });

    await user.click(screen.getByRole('button', { name: 'Check answers' }));
    expect(await screen.findByText(/You left 2 questions unanswered/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Submit anyway' }));

    expect(await screen.findByRole('status')).toHaveTextContent('0 / 2 correct – 0%');
    expect(screen.getAllByText('No answer')).toHaveLength(2);
  });

  it('lets the user retry and saves the result in the history', async () => {
    const user = userEvent.setup();
    renderQuiz();
    await screen.findByRole('button', { name: 'Check answers' });
    await user.click(screen.getByLabelText('are'));
    await user.type(screen.getByLabelText('Gap 1'), 'am');
    await user.click(screen.getByRole('button', { name: 'Check answers' }));
    expect(await screen.findByRole('status')).toHaveTextContent('2 / 2 correct – 100%');

    const history = JSON.parse(localStorage.getItem('eq.history') ?? '[]');
    expect(history).toHaveLength(1);
    expect(history[0]).toMatchObject({ level: 'A1', total: 2, correct: 2, percent: 100 });

    await user.click(screen.getByRole('button', { name: 'Try again' }));
    expect(screen.queryByRole('region', { name: /correct –/ })).not.toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Answers cleared. Try again.');
    expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
    expect(screen.getByLabelText('Gap 1')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Check answers' })).toBeInTheDocument();
  });

  it('saves a quiz in the history only once, even in StrictMode and on double click', async () => {
    const user = userEvent.setup();
    renderQuiz(true);
    await screen.findByRole('button', { name: 'Check answers' });
    await user.click(screen.getByLabelText('are'));
    await user.type(screen.getByLabelText('Gap 1'), 'am');
    await user.dblClick(screen.getByRole('button', { name: 'Check answers' }));
    await screen.findByRole('status');
    expect(JSON.parse(localStorage.getItem('eq.history') ?? '[]')).toHaveLength(1);
  });

  describe('accessibility', () => {
    it('moves the focus to the actions with the "↓ End" button', async () => {
      const user = userEvent.setup();
      const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      renderQuiz();
      await screen.findByRole('button', { name: 'Check answers' });
      await user.click(screen.getByRole('button', { name: 'Go to the end of the page' }));
      expect(screen.getByRole('button', { name: 'Check answers' })).toHaveFocus();
      scrollTo.mockRestore();
    });

    it('announces the result, focuses the score and names each question with its result', async () => {
      const user = userEvent.setup();
      renderQuiz();
      await screen.findByRole('button', { name: 'Check answers' });
      expect(screen.getByRole('status')).toBeEmptyDOMElement();

      await user.click(screen.getByLabelText('is')); // wrong
      await user.type(screen.getByLabelText('Gap 1'), 'am'); // right
      await user.click(screen.getByRole('button', { name: 'Check answers' }));

      expect(await screen.findByRole('status')).toHaveTextContent('Answers checked. 1 / 2 correct – 50%. Pass.');
      expect(screen.getByRole('region', { name: '1 / 2 correct – 50%' })).toHaveFocus();
      expect(screen.getByRole('region', { name: /Multiple choice ✗ Incorrect$/ })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: /Fill in the gap ✓ Correct$/ })).toBeInTheDocument();

      const toggle = screen.getByRole('button', { name: 'Show correct answers' });
      expect(toggle).not.toHaveAttribute('aria-pressed');
      await user.click(toggle);
      expect(screen.getByRole('status')).toHaveTextContent('Correct answers shown.');
      await user.click(screen.getByRole('button', { name: 'Hide correct answers' }));
      expect(screen.getByRole('status')).toHaveTextContent('Correct answers hidden.');
    });

    it('focuses the title and announces a new quiz when it is ready', async () => {
      const user = userEvent.setup();
      const scrollTo = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
      renderQuiz();
      await screen.findByRole('button', { name: 'Check answers' });
      await user.click(screen.getByRole('button', { name: 'Check answers' }));
      await user.click(await screen.findByRole('button', { name: 'Submit anyway' }));
      await user.click(await screen.findByRole('button', { name: 'New quiz' }));

      await screen.findByRole('button', { name: 'Check answers' });
      await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('New quiz ready: 2 questions.'));
      expect(screen.getByRole('heading', { level: 1 })).toHaveFocus();
      expect(scrollTo).toHaveBeenCalledWith({ top: 0 });
      scrollTo.mockRestore();
    });
  });
});
