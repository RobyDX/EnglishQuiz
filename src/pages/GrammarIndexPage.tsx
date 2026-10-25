import { useState } from 'react';
import { Card, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { filterTopics, groupByArea } from '../engine/grammar';
import { GRAMMAR_TOPICS } from '../grammar/registry';

export default function GrammarIndexPage() {
  // Not saved: every visit starts with "All" and an empty search.
  const [query, setQuery] = useState('');
  const groups = groupByArea(filterTopics(GRAMMAR_TOPICS, query));

  return (
    <div className="col-12 col-lg-8 mx-auto">
      <h1 className="h3">Grammar</h1>
      <p>Short pages to review the rules of English. No exercises, no score.</p>

      <Form.Group controlId="grammar-search" className="mb-3">
        <Form.Label>Search topics</Form.Label>
        <Form.Control type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="e.g. present perfect, articles, since" />
      </Form.Group>

      <div role="status">{groups.length === 0 && <p>No topics match your search.</p>}</div>

      {groups.map((g) => (
        <section key={g.area} className="mb-4">
          <h2 className="h5">{g.area}</h2>
          <Row xs={1} md={2} className="g-3">
            {g.topics.map((t) => (
              <Col key={t.id}>
                <Card className="h-100 nav-tile">
                  <Card.Body>
                    <Card.Title as="h3" className="h6">
                      <Link to={`/grammar/${t.id}`} className="stretched-link text-decoration-none">
                        {t.title}
                      </Link>
                    </Card.Title>
                    <Card.Text className="text-secondary small mb-0">{t.summary}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      ))}
    </div>
  );
}
