import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import AboutPage from './AboutPage';

afterEach(cleanup);

describe('AboutPage', () => {
  it('names the author, the generative-AI spec-driven method and that the app is free to use', () => {
    render(
      <MemoryRouter>
        <AboutPage />
      </MemoryRouter>,
    );
    expect(screen.getByText('Roberto Nacchia')).toBeInTheDocument();
    expect(screen.getByText('generative AI')).toBeInTheDocument();
    expect(screen.getByText('spec-driven')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Free to use' })).toBeInTheDocument();
  });
});
