import { useRef, useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { bandOf } from '../engine/score';
import { clearPlacementHistory, loadPlacementHistory } from '../hooks/store';
import { LEVELS } from '../types';

export default function PlacementHistorySection({ onClear }: { onClear?: () => void }) {
  const [entries, setEntries] = useState(loadPlacementHistory);
  const titleRef = useRef<HTMLHeadingElement>(null);
  return (
    <section aria-labelledby="test-history-title" className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 id="test-history-title" ref={titleRef} tabIndex={-1} className="h5 mb-0">
          Test history
        </h2>
        {entries.length > 0 && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              clearPlacementHistory();
              setEntries([]);
              onClear?.();
              // The button disappears with the entries: keep the focus on the page.
              titleRef.current?.focus();
            }}
          >
            Clear history
          </Button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-secondary">No tests yet. Your results will appear here.</p>
      ) : (
        <Table responsive hover>
          <thead>
            <tr>
              <th>Date</th>
              <th>Level</th>
              <th>Score</th>
              <th>%</th>
            </tr>
          </thead>
          <tbody>
            {entries.map((e, i) => {
              const answered = LEVELS.reduce((n, l) => n + (e.perLevel[l]?.answered ?? 0), 0);
              const correct = LEVELS.reduce((n, l) => n + (e.perLevel[l]?.correct ?? 0), 0);
              const percent = answered ? Math.round((correct / answered) * 100) : 0;
              return (
                <tr key={`${e.date}-${i}`}>
                  <td>{new Date(e.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                  <td>{e.level}</td>
                  <td>
                    {correct} / {answered}
                  </td>
                  <td>
                    <Badge bg={bandOf(percent).variant}>{percent}%</Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </section>
  );
}
