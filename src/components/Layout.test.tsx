import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen, within } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import Layout from './Layout';
import InstallPage from '../pages/InstallPage';

afterEach(cleanup);

const renderAt = (path: string) =>
  render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<p>home</p>} />
          <Route path="install" element={<InstallPage />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );

describe('Layout', () => {
  it('shows all the navigation buttons at once (no collapsing menu) and an Install button when not installed', () => {
    renderAt('/');
    const nav = screen.getByRole('navigation', { name: 'Main' });
    for (const name of ['Home', 'Quiz', 'Test', 'About', 'Install']) expect(within(nav).getByRole('link', { name })).toBeInTheDocument();
    expect(nav).not.toHaveTextContent('Home'); // icons only, no visible text
    expect(screen.getByRole('link', { name: 'Home' }).querySelector('svg')).not.toBeNull();
    expect(document.querySelector('.navbar-toggler')).toBeNull();
  });

  it('has a Share on WhatsApp icon button that links to wa.me with the app address', () => {
    renderAt('/');
    const link = within(screen.getByRole('navigation', { name: 'Main' })).getByRole('link', { name: 'Share on WhatsApp' });
    const href = link.getAttribute('href')!;
    expect(link.querySelector('svg')).not.toBeNull();
    expect(href.startsWith('https://wa.me/?text=')).toBe(true);
    expect(decodeURIComponent(href)).toContain(window.location.href.split('#')[0]);
  });

  it('has no History entry: the history lives in the Quiz page', () => {
    renderAt('/');
    expect(screen.queryByRole('link', { name: 'History' })).not.toBeInTheDocument();
  });

  it('the Install page explains the benefits and what a PWA is', () => {
    renderAt('/install');
    expect(screen.getByRole('heading', { name: 'Install English Quiz' })).toBeInTheDocument();
    expect(screen.getByText(/opens like a normal app/)).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /What is a PWA installation/ })).toBeInTheDocument();
  });

  it('the Install page always shows the Install app button, disabled until the browser offers the installation', () => {
    renderAt('/install');
    const button = screen.getByRole('button', { name: 'Install app' });
    expect(button).toBeDisabled();
    expect(screen.getByText(/has not offered the one-click installation/)).toBeInTheDocument();
  });

  it('the Install page has short instructions for PC, Mac, Android and iOS', () => {
    renderAt('/install');
    for (const name of [/Windows and Linux/, /^Mac/, /Android/, /iPhone and iPad/]) {
      const section = screen.getByRole('region', { name });
      expect(within(section).queryByRole('img')).toBeNull();
      expect(within(section).getAllByRole('listitem').length).toBeGreaterThanOrEqual(2);
    }
  });
});
