import type { ReactNode } from 'react';

/** Highlights the key part of an example sentence. */
export function Key({ children }: { children: ReactNode }) {
  return <strong className="text-primary">{children}</strong>;
}

/** "Rule in brief": the rule in two or three lines, at the top of a page. */
export function Rule({ children }: { children: ReactNode }) {
  return (
    <section className="alert alert-primary" aria-label="Rule in brief">
      <h2 className="h6 alert-heading">Rule in brief</h2>
      {children}
    </section>
  );
}

/** A titled part of the page (Form, Use, …). */
export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mb-4">
      <h2 className="h5">{title}</h2>
      {children}
    </section>
  );
}

/** Table of forms; the first column is the row header. */
export function FormTable({ caption, head, rows }: { caption: string; head: string[]; rows: ReactNode[][] }) {
  return (
    <div className="table-responsive">
      <table className="table table-bordered align-middle">
        <caption>{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {cell}
                  </th>
                ) : (
                  <td key={j}>{cell}</td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Example sentences, one per line. */
export function Examples({ items }: { items: ReactNode[] }) {
  return (
    <ul className="list-group mb-3">
      {items.map((item, i) => (
        <li key={i} className="list-group-item">
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Common mistakes: ✗ wrong / ✓ right pairs. Never colour alone: the words and symbols carry the meaning. */
export function Mistakes({ items }: { items: { wrong: ReactNode; right: ReactNode; why?: ReactNode }[] }) {
  return (
    <ul className="list-group mb-3">
      {items.map((m, i) => (
        <li key={i} className="list-group-item">
          <div className="text-danger-emphasis">
            <span aria-hidden="true">✗ </span>
            <span className="fw-semibold">Wrong:</span> {m.wrong}
          </div>
          <div className="text-success-emphasis">
            <span aria-hidden="true">✓ </span>
            <span className="fw-semibold">Right:</span> {m.right}
          </div>
          {m.why && <div className="text-secondary small mt-1">{m.why}</div>}
        </li>
      ))}
    </ul>
  );
}
