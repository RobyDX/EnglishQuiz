import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HomePage from './HomePage';

afterEach(cleanup);

describe('HomePage', () => {
  it('introduces the app and links to the installation page', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('heading', { level: 1, name: 'English Quiz' })).toBeInTheDocument();
    expect(screen.getByText(/can also be/)).toHaveTextContent(/installed/);
    expect(screen.getByRole('link', { name: 'Learn how to install it' })).toHaveAttribute('href', '/install');
  });

  it('has a descriptive navigation tile for Quiz, Level test, About and Installation', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const targets: Record<string, string> = { Quiz: '/quiz', 'Level test': '/test', About: '/about', Installation: '/install' };
    for (const [name, href] of Object.entries(targets)) {
      expect(screen.getByRole('link', { name })).toHaveAttribute('href', href);
      expect(screen.getByRole('heading', { level: 2, name })).toBeInTheDocument();
    }
    expect(screen.getByText(/find out your CEFR level/)).toBeInTheDocument();
  });
});
