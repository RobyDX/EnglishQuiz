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
const svgProps = { width: 20, height: 20, viewBox: '0 0 16 16', fill: 'currentColor', 'aria-hidden': true, focusable: false } as const;
const QuizIcon = () => (
  <svg {...svgProps}>
    <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14m0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16" />
    <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94" />
  </svg>
);
const HomeIcon = () => (
  <svg {...svgProps}>
    <path d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293zM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5z" />
  </svg>
);
const TestIcon = () => (
  <svg {...svgProps}>
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
    <path d="M8 13A5 5 0 1 1 8 3a5 5 0 0 1 0 10m0 1A6 6 0 1 0 8 2a6 6 0 0 0 0 12" />
    <path d="M8 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6m0 1a4 4 0 1 0 0-8 4 4 0 0 0 0 8" />
    <path d="M9.5 8a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" />
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

const WhatsAppIcon = () => (
  <svg {...svgProps}>
    <path d="M13.601 2.326A7.85 7.85 0 0 0 7.994 0C3.627 0 .068 3.558.064 7.926c0 1.399.366 2.76 1.057 3.965L0 16l4.204-1.102a7.9 7.9 0 0 0 3.79.965h.004c4.368 0 7.926-3.558 7.93-7.93A7.9 7.9 0 0 0 13.6 2.326zM7.994 14.521a6.6 6.6 0 0 1-3.356-.92l-.24-.144-2.494.654.666-2.433-.156-.251a6.56 6.56 0 0 1-1.007-3.505c0-3.626 2.957-6.584 6.591-6.584a6.56 6.56 0 0 1 4.66 1.931 6.56 6.56 0 0 1 1.928 4.66c-.004 3.639-2.961 6.592-6.592 6.592m3.615-4.934c-.197-.099-1.17-.578-1.353-.646-.182-.065-.315-.099-.445.099-.133.197-.513.646-.627.775-.114.133-.232.148-.43.05-.197-.1-.836-.308-1.592-.985-.59-.525-.985-1.175-1.103-1.372-.114-.198-.011-.304.088-.403.087-.088.197-.232.296-.346.1-.114.133-.198.198-.33.065-.134.034-.248-.015-.347-.05-.099-.445-1.076-.612-1.47-.16-.389-.323-.335-.445-.34-.114-.007-.247-.007-.38-.007a.73.73 0 0 0-.529.247c-.182.198-.691.677-.691 1.654s.71 1.916.81 2.049c.098.133 1.394 2.132 3.383 2.992.47.205.84.326 1.129.418.475.152.904.129 1.246.08.38-.058 1.171-.48 1.338-.943.164-.464.164-.86.114-.943-.049-.084-.182-.133-.38-.232" />
  </svg>
);

/** WhatsApp "share a link" URL; the app address is the current page without the hash route. */
export function whatsappShareUrl(appUrl: string): string {
  return `https://wa.me/?text=${encodeURIComponent(`Practise English by CEFR level (A1–C2) with English Quiz: ${appUrl}`)}`;
}

// Icon-only button: the name goes in aria-label and in the tooltip.
function NavButton({ to, end, icon, label }: { to: string; end?: boolean; icon: ReactNode; label: string }) {
  return (
    <NavLink to={to} end={end} aria-label={label} title={label} className={({ isActive }) => `btn d-inline-flex align-items-center ${isActive ? 'btn-light' : 'btn-outline-light'}`}>
      {icon}
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
            <NavButton to="/" end icon={<HomeIcon />} label="Home" />
            <NavButton to="/quiz" icon={<QuizIcon />} label="Quiz" />
            <NavButton to="/test" icon={<TestIcon />} label="Test" />
            <NavButton to="/about" icon={<InfoIcon />} label="About" />
            {!standalone && (
              <NavButton to="/install" icon={<InstallIcon />} label="Install" />
            )}
            <a
              href={whatsappShareUrl(window.location.href.split('#')[0])}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on WhatsApp"
              title="Share on WhatsApp"
              className="btn btn-outline-light d-inline-flex align-items-center"
            >
              <WhatsAppIcon />
            </a>
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
