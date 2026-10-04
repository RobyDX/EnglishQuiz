import { afterEach, describe, expect, it } from 'vitest';
import { useState } from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import type { TrueFalseQuestion, WordBankQuestion, WordOrderQuestion } from '../types';
import GapQuestion from './GapQuestion';
import TrueFalse from './TrueFalse';
import WordOrder from './WordOrder';
import HomePage from '../pages/HomePage';
import HistoryPage from '../pages/HistoryPage';
import Layout from '../components/Layout';

afterEach(() => {
  cleanup();
  localStorage.clear();
});

const base = { level: 'A1', topic: 't', prompt: 'p', explanation: 'e' } as const;

/** Renders a question component with its own answer state. */
function Controlled<A>({ render: r }: { render: (answer: A | undefined, onChange: (a: A) => void) => React.ReactNode }) {
  const [answer, setAnswer] = useState<A>();
  return <>{r(answer, setAnswer)}</>;
}

describe('word-order keyboard focus', () => {
  const q: WordOrderQuestion = { ...base, id: 'wo', type: 'word-order', words: ['I', 'am', 'here'], solutions: [['I', 'am', 'here']] };

  it('keeps the focus in place when a word moves to the other list', async () => {
    const user = userEvent.setup();
    render(<Controlled<string[]> render={(a, on) => <WordOrder question={q} answer={a} onChange={on} disabled={false} />} />);
    const words = () => within(screen.getByRole('group', { name: 'Words to use' }));
    const sentence = () => within(screen.getByRole('group', { name: 'Your sentence' }));

    await user.click(words().getByRole('button', { name: 'am' }));
    // "am" left the list: the focus goes to the word that took its place.
    expect(words().getByRole('button', { name: 'here' })).toHaveFocus();
    await user.keyboard('{Enter}');
    // Last word of the list: the focus goes to the previous one.
    expect(words().getByRole('button', { name: 'I' })).toHaveFocus();
    await user.keyboard('{Enter}');
    // The list is empty: the focus goes to the sentence.
    expect(sentence().getAllByRole('button')[0]).toHaveFocus();

    await user.keyboard('{Enter}'); // remove "am" again
    expect(sentence().getByRole('button', { name: 'here' })).toHaveFocus();
  });
});

describe('labels and non-colour signals', () => {
  it('names each True/False group with its statement', () => {
    const q: TrueFalseQuestion = {
      ...base,
      id: 'tf',
      type: 'true-false',
      passage: 'Tom has a dog.',
      statements: [
        { text: 'Tom has a dog.', answer: true },
        { text: 'Tom has a cat.', answer: false },
      ],
    };
    render(<TrueFalse question={q} answer={undefined} onChange={() => {}} disabled={false} />);
    const group = screen.getByRole('group', { name: 'Tom has a cat.' });
    expect(within(group).getByRole('button', { name: 'False' })).toBeInTheDocument();
  });

  it('marks the used words of a word bank with text, not only colour', () => {
    const q: WordBankQuestion = { ...base, id: 'wb', type: 'word-bank', bank: ['a', 'the'], text: 'I have ___ cat.', answers: ['a'] };
    const { container } = render(<GapQuestion question={q} answer={['the']} onChange={() => {}} disabled={false} />);
    const [a, the] = Array.from(container.querySelectorAll('.badge'));
    expect(the).toHaveTextContent('the (used)');
    expect(the).toHaveClass('text-decoration-line-through');
    expect(a).toHaveTextContent(/^a$/);
  });
});

describe('pages', () => {
  it('moves between levels with the arrow keys, with one Tab stop', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const radios = screen.getAllByRole('radio');
    expect(radios.filter((r) => r.tabIndex === 0)).toHaveLength(1);

    await user.tab();
    expect(screen.getByRole('radio', { name: /^A1/ })).toHaveFocus();
    await user.keyboard('{ArrowRight}');
    const a2 = screen.getByRole('radio', { name: /^A2/ });
    expect(a2).toHaveFocus();
    expect(a2).toHaveAttribute('aria-checked', 'true');
    await user.keyboard('{End}');
    expect(screen.getByRole('radio', { name: /^C2/ })).toHaveFocus();
    await user.keyboard('{ArrowRight}'); // wraps around
    expect(screen.getByRole('radio', { name: /^A1/ })).toHaveAttribute('aria-checked', 'true');
    expect(screen.getByRole('button', { name: 'Start' })).toBeEnabled();
  });

  it('has a skip link to the main content', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    );
    await user.tab();
    const skip = screen.getByRole('link', { name: 'Skip to main content' });
    expect(skip).toHaveFocus();
    await user.keyboard('{Enter}');
    expect(screen.getByRole('main')).toHaveFocus();
  });

  it('keeps the focus on the page after clearing the history', async () => {
    const user = userEvent.setup();
    localStorage.setItem('eq.history', JSON.stringify([{ date: '2026-10-04T10:00:00Z', level: 'A1', total: 5, correct: 4, percent: 80 }]));
    render(<HistoryPage />);
    await user.click(screen.getByRole('button', { name: 'Clear history' }));
    expect(screen.getByRole('heading', { name: 'History' })).toHaveFocus();
  });
});
