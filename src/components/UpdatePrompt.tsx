import { Button, Toast, ToastContainer } from 'react-bootstrap';
import { useRegisterSW } from 'virtual:pwa-register/react';

/** Shows a toast when a new version of the app is available. */
export default function UpdatePrompt() {
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW();
  return (
    <ToastContainer position="bottom-end" className="p-3 position-fixed">
      <Toast show={needRefresh} onClose={() => setNeedRefresh(false)}>
        <Toast.Header>
          <strong className="me-auto">English Quiz</strong>
        </Toast.Header>
        <Toast.Body className="d-flex justify-content-between align-items-center gap-3">
          New version available
          <Button size="sm" onClick={() => updateServiceWorker(true)}>
            Update
          </Button>
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
}
