import { afterEach, describe, expect, it } from 'vitest';
import { act, cleanup, render, screen } from '@testing-library/react';
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

describe('HomePage install button', () => {
  it('shows an Install app button only when the browser offers the installation', () => {
    const { unmount } = render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.queryByRole('button', { name: 'Install app' })).not.toBeInTheDocument();
    unmount();
    const e = Object.assign(new Event('beforeinstallprompt', { cancelable: true }), { prompt: () => Promise.resolve() });
    act(() => {
      window.dispatchEvent(e);
    });
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    expect(screen.getByRole('button', { name: 'Install app' })).toBeInTheDocument();
  });
});

describe('HomePage WhatsApp share', () => {
  it('has a Share on WhatsApp button that links to wa.me with the app address', () => {
    render(
      <MemoryRouter>
        <HomePage />
      </MemoryRouter>,
    );
    const href = screen.getByText('Share on WhatsApp').getAttribute('href')!;
    expect(href.startsWith('https://wa.me/?text=')).toBe(true);
    expect(decodeURIComponent(href)).toContain(window.location.href.split('#')[0]);
  });
});
