import { useState } from 'react';
import { Badge, Button, Table } from 'react-bootstrap';
import { bandOf } from '../engine/score';
import { clearHistory, loadHistory } from '../hooks/store';

export default function HistoryPage() {
  const [entries, setEntries] = useState(loadHistory);
  return (
    <div className="col-12 col-lg-8 mx-auto">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h3 mb-0">History</h1>
        {entries.length > 0 && (
          <Button
            variant="outline-danger"
            size="sm"
            onClick={() => {
              clearHistory();
              setEntries([]);
            }}
          >
            Clear history
          </Button>
        )}
      </div>
      {entries.length === 0 ? (
        <p className="text-secondary">No quizzes yet. Your results will appear here.</p>
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
            {entries.map((e) => (
              <tr key={e.date}>
                <td>{new Date(e.date).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                <td>{e.level}</td>
                <td>
                  {e.correct} / {e.total}
                </td>
                <td>
                  <Badge bg={bandOf(e.percent).variant}>{e.percent}%</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
}
