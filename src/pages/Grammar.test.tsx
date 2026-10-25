import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import GrammarIndexPage from './GrammarIndexPage';
import GrammarTopicPage from './GrammarTopicPage';

afterEach(cleanup);

function renderAt(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route path="/grammar" element={<GrammarIndexPage />} />
        <Route path="/grammar/:topicId" element={<GrammarTopicPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('GrammarIndexPage', () => {
  it('lists the topics grouped by area, each linking to its page', () => {
    renderAt('/grammar');
    expect(screen.getByRole('heading', { level: 1, name: 'Grammar' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 2, name: 'Tenses' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Present perfect' })).toHaveAttribute('href', '/grammar/present-perfect');
  });

  it('searches and says when nothing matches', async () => {
    const user = userEvent.setup();
    renderAt('/grammar');
    await user.type(screen.getByLabelText('Search topics'), 'since');
    expect(screen.getByRole('link', { name: 'Present perfect' })).toBeInTheDocument();
    await user.clear(screen.getByLabelText('Search topics'));
    await user.type(screen.getByLabelText('Search topics'), 'zzzz');
    expect(screen.queryByRole('link', { name: 'Present perfect' })).not.toBeInTheDocument();
    expect(screen.getByText('No topics match your search.')).toBeInTheDocument();
  });
});

describe('GrammarTopicPage', () => {
  it('shows the page with title, rule and a link back to the index', async () => {
    renderAt('/grammar/present-perfect');
    const h1 = screen.getByRole('heading', { level: 1, name: 'Present perfect' });
    expect(h1).toBeInTheDocument();
    expect(await screen.findByRole('heading', { name: 'Rule in brief' })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Common mistakes' })).toBeInTheDocument();
    expect(screen.getByRole('table', { name: /Present perfect of work and go/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '← All topics' })).toHaveAttribute('href', '/grammar');
    expect(h1).toHaveFocus();
  });

  it('says so for an unknown topic and links to the index', () => {
    renderAt('/grammar/nope');
    expect(screen.getByRole('heading', { level: 1, name: 'Topic not found' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'See all topics' })).toHaveAttribute('href', '/grammar');
  });
});
