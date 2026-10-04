import { useLayoutEffect, useRef } from 'react';
import { Button } from 'react-bootstrap';
import type { WordOrderQuestion as Q } from '../types';
import type { QuestionProps } from './shared';

type List = 'chosen' | 'remaining';

export default function WordOrder({ question: q, answer, onChange, disabled }: QuestionProps<Q, string[]>) {
  const chosen = answer ?? [];
  const remaining = [...q.words];
  for (const c of chosen) {
    const i = remaining.indexOf(c);
    if (i >= 0) remaining.splice(i, 1);
  }

  // The clicked button disappears from its list: keep the keyboard focus in the same place.
  const lists = useRef<Record<List, HTMLDivElement | null>>({ chosen: null, remaining: null });
  const pendingFocus = useRef<{ list: List; index: number } | null>(null);
  useLayoutEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    const other: List = target.list === 'chosen' ? 'remaining' : 'chosen';
    const buttons = lists.current[target.list]?.querySelectorAll('button') ?? [];
    const next = buttons[Math.min(target.index, buttons.length - 1)] ?? lists.current[other]?.querySelector('button');
    next?.focus();
  }, [answer]);

  const move = (list: List, index: number, value: string[]) => {
    pendingFocus.current = { list, index };
    onChange(value);
  };

  return (
    <>
      <div
        ref={(el) => {
          lists.current.chosen = el;
        }}
        className="answer-area d-flex flex-wrap gap-2 mb-3"
        role="group"
        aria-label="Your sentence"
      >
        {chosen.length === 0 && <span className="text-secondary">Tap the words below to build the sentence.</span>}
        {chosen.map((w, i) => (
          <Button
            key={`${w}-${i}`}
            variant="primary"
            disabled={disabled}
            onClick={() => move('chosen', i, chosen.filter((_, k) => k !== i))}
          >
            {w}
          </Button>
        ))}
      </div>
      <div
        ref={(el) => {
          lists.current.remaining = el;
        }}
        className="d-flex flex-wrap gap-2"
        role="group"
        aria-label="Words to use"
      >
        {remaining.map((w, i) => (
          <Button key={`${w}-${i}`} variant="outline-primary" disabled={disabled} onClick={() => move('remaining', i, [...chosen, w])}>
            {w}
          </Button>
        ))}
      </div>
    </>
  );
}
