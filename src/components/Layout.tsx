import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react';
import { Badge, Container, Navbar } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
import { useInstall } from '../hooks/useInstall';
import UpdatePrompt from './UpdatePrompt';

function useOnline() {
  const [online, setOnline] = useState(navigator.onLine);
  useEffect(() => {
    const on = () => setOnline(true);
    const off = () => setOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => {
      window.removeEventListener('online', on);
      window.removeEventListener('offline', off);
    };
  }, []);
  return online;
}

// With HashRouter, href="#main" would change the route: move the focus by hand.
function skipToMain(e: MouseEvent<HTMLAnchorElement>) {
  e.preventDefault();
  const main = document.getElementById('main');
  main?.focus({ preventScroll: true });
  main?.scrollIntoView();
}

// Bootstrap-Icons-style glyphs, inline to avoid a dependency.
const svgProps = { width: 16, height: 16, viewBox: '0 0 16 16', fill: 'currentColor', 'aria-hidden': true, focusable: false } as const;
const QuizIcon = () => (
  <svg {...svgProps}>
    <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
  </svg>
);
const ClockIcon = () => (
  <svg {...svgProps}>
    <path d="M8.515 1.019A7 7 0 0 0 8 1V0a8 8 0 0 1 .589.022zm2.004.45a7 7 0 0 0-.985-.299l.219-.976q.576.129 1.126.342zm1.37.71a7 7 0 0 0-.439-.27l.493-.87a8 8 0 0 1 .979.654l-.615.789a7 7 0 0 0-.418-.302zm1.834 1.79a7 7 0 0 0-.653-.796l.724-.69q.406.429.747.91zm.744 1.352a7 7 0 0 0-.214-.468l.893-.45a8 8 0 0 1 .45 1.088l-.95.313a7 7 0 0 0-.179-.483m.53 2.507a7 7 0 0 0-.1-1.025l.985-.17q.1.58.116 1.17zm-.131 1.538q.05-.254.081-.51l.993.123a8 8 0 0 1-.23 1.155l-.964-.267q.069-.247.12-.501m-.952 2.379q.276-.436.486-.908l.914.405q-.24.54-.555 1.038zm-.964 1.205q.183-.183.35-.378l.758.653a8 8 0 0 1-.401.432z" />
    <path d="M8 1a7 7 0 1 0 4.95 11.95l.707.707A8.001 8.001 0 1 1 8 0z" />
    <path d="M7.5 3a.5.5 0 0 1 .5.5v5.21l3.248 1.856a.5.5 0 0 1-.496.868l-3.5-2A.5.5 0 0 1 7 9V3.5a.5.5 0 0 1 .5-.5" />
  </svg>
);
const InfoIcon = () => (
  <svg {...svgProps}>
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0" />
  </svg>
);
const InstallIcon = () => (
  <svg {...svgProps}>
    <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5" />
    <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708z" />
  </svg>
);

function NavButton({ to, end, icon, children }: { to: string; end?: boolean; icon: ReactNode; children: ReactNode }) {
  return (
    <NavLink to={to} end={end} className={({ isActive }) => `btn btn-sm d-inline-flex align-items-center gap-1 ${isActive ? 'btn-light' : 'btn-outline-light'}`}>
      {icon}
      {children}
    </NavLink>
  );
}

export default function Layout() {
  const online = useOnline();
  const { standalone } = useInstall();
  const navRef = useRef<HTMLElement>(null);

  // Keep --navbar-height in sync so the quiz bar sticks right below the navbar.
  useEffect(() => {
    const el = navRef.current;
    if (!el || typeof ResizeObserver === 'undefined') return;
    const update = () => document.documentElement.style.setProperty('--navbar-height', `${el.offsetHeight}px`);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a href="#main" className="visually-hidden-focusable skip-link position-absolute top-0 start-0 m-2 p-2 bg-body rounded" onClick={skipToMain}>
        Skip to main content
      </a>
      <Navbar ref={navRef} bg="primary" data-bs-theme="dark" sticky="top" className="py-2">
        <Container className="flex-wrap gap-2">
          <Navbar.Brand as={NavLink} to="/" className="d-flex align-items-center gap-2 me-auto">
            <img src="pwa-192.png" alt="" width={32} height={32} className="rounded" />
            <span>English Quiz</span>
            {!online && (
              <Badge bg="warning" text="dark">
                Offline
              </Badge>
            )}
          </Navbar.Brand>
          <nav aria-label="Main" className="d-flex flex-wrap gap-2">
            <NavButton to="/" end icon={<QuizIcon />}>
              Home
            </NavButton>
            <NavButton to="/history" icon={<ClockIcon />}>
              History
            </NavButton>
            <NavButton to="/about" icon={<InfoIcon />}>
              About
            </NavButton>
            {!standalone && (
              <NavButton to="/install" icon={<InstallIcon />}>
                Install
              </NavButton>
            )}
          </nav>
        </Container>
      </Navbar>
      <Container as="main" id="main" tabIndex={-1} className="py-4">
        <Outlet />
      </Container>
      <UpdatePrompt />
    </>
  );
}
