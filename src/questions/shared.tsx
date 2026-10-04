import type { KeyboardEvent } from 'react';
import { Form } from 'react-bootstrap';

export interface QuestionProps<Q, A> {
  question: Q;
  answer: A | undefined;
  onChange: (answer: A) => void;
  disabled: boolean;
  /** Called when Enter is pressed in the last text field of the page. */
  onEnter?: () => void;
}

/** Enter moves to the next text field of the page; on the last one it triggers onEnter. */
export function enterNavigation(e: KeyboardEvent<HTMLElement>, onEnter?: () => void) {
  if (e.key !== 'Enter') return;
  e.preventDefault();
  const fields = Array.from(document.querySelectorAll<HTMLElement>('[data-nav]:not([disabled])'));
  const next = fields[fields.indexOf(e.currentTarget) + 1];
  if (next) next.focus();
  else onEnter?.();
}

interface RadioListProps {
  name: string;
  options: string[];
  value: number | undefined;
  onChange: (i: number) => void;
  disabled: boolean;
  legend: string;
}

export function RadioList({ name, options, value, onChange, disabled, legend }: RadioListProps) {
  return (
    <fieldset>
      <legend className="visually-hidden">{legend}</legend>
      {options.map((o, i) => (
        <Form.Check
          key={i}
          type="radio"
          id={`${name}-${i}`}
          name={name}
          label={o}
          checked={value === i}
          disabled={disabled}
          onChange={() => onChange(i)}
          className="choice-option"
        />
      ))}
    </fieldset>
  );
}
