import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { Suspense } from 'react';
import { GRAMMAR_TOPICS } from './registry';

afterEach(cleanup);

describe.each(GRAMMAR_TOPICS.map((t) => [t.id, t] as const))('grammar page %s', (_id, topic) => {
  it('has the rule, at least one example list and common mistakes, and is in English', async () => {
    const Body = topic.Component;
    const { container } = render(
      <Suspense fallback={null}>
        <Body />
      </Suspense>,
    );
    expect(await screen.findByRole('heading', { name: 'Rule in brief' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Common mistakes' })).toBeInTheDocument();
    // Every page shows at least one wrong / right pair and an example or a table.
    expect(container.textContent).toMatch(/Wrong:/);
    expect(container.textContent).toMatch(/Right:/);
    expect(container.querySelectorAll('li, table').length).toBeGreaterThan(3);
    // No page may use headings above h2 (the page title is the h1 of the page shell).
    expect(container.querySelector('h1')).toBeNull();
    // The app is English only: no Italian accented vowels.
    expect(container.textContent).not.toMatch(/[àèìòù]/i);
    // No empty row headers.
    for (const th of container.querySelectorAll('th[scope="row"]')) expect(th.textContent?.trim(), 'empty row header').not.toBe('');
    // Every table has a caption.
    for (const table of container.querySelectorAll('table')) expect(table.querySelector('caption')).not.toBeNull();
  });
});
