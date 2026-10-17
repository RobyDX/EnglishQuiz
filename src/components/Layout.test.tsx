import { afterEach, describe, expect, it } from 'vitest';
import { cleanup, render, screen } from '@testing-library/react';
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
    for (const name of ['Home', 'History', 'About', 'Install']) expect(nav).toHaveTextContent(name);
    expect(screen.getByRole('link', { name: 'Home' }).querySelector('svg')).not.toBeNull();
    expect(document.querySelector('.navbar-toggler')).toBeNull();
  });

  it('the Install page explains the benefits', () => {
    renderAt('/install');
    expect(screen.getByRole('heading', { name: 'Install English Quiz' })).toBeInTheDocument();
    expect(screen.getByText(/opens like a normal app/)).toBeInTheDocument();
  });
});
