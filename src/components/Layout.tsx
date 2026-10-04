import { useEffect, useRef, useState } from 'react';
import { Badge, Container, Nav, Navbar } from 'react-bootstrap';
import { NavLink, Outlet } from 'react-router-dom';
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

export default function Layout() {
  const online = useOnline();
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
      <Navbar ref={navRef} expand="sm" bg="primary" data-bs-theme="dark" sticky="top">
        <Container>
          <Navbar.Brand as={NavLink} to="/">
            English Quiz {!online && <Badge bg="warning" text="dark" className="ms-1">Offline</Badge>}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="ms-auto">
              <Nav.Link as={NavLink} to="/" end>
                Home
              </Nav.Link>
              <Nav.Link as={NavLink} to="/history">
                History
              </Nav.Link>
              <Nav.Link as={NavLink} to="/about">
                About
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container as="main" className="py-4">
        <Outlet />
      </Container>
      <UpdatePrompt />
    </>
  );
}
