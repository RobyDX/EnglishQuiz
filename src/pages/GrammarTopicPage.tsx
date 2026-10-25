import { Suspense, useEffect, useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { adjacentTopics } from '../engine/grammar';
import { findTopic, GRAMMAR_TOPICS } from '../grammar/registry';

export default function GrammarTopicPage() {
  const { topicId } = useParams();
  const topic = findTopic(topicId);
  const heading = useRef<HTMLHeadingElement>(null);

  // New page: back to the top and the focus on the title, so keyboard and screen reader users start here.
  useEffect(() => {
    window.scrollTo(0, 0);
    heading.current?.focus({ preventScroll: true });
  }, [topicId]);

  if (!topic) {
    return (
      <div className="col-12 col-lg-8 mx-auto">
        <h1 className="h3" ref={heading} tabIndex={-1}>
          Topic not found
        </h1>
        <p>
          There is no grammar page with this name. <Link to="/grammar">See all topics</Link>.
        </p>
      </div>
    );
  }

  const { prev, next } = adjacentTopics(GRAMMAR_TOPICS, topic.id);
  const related = (topic.related ?? []).map(findTopic).filter((t) => t !== undefined);
  const Body = topic.Component;

  return (
    <div className="col-12 col-lg-8 mx-auto">
      <p className="mb-2">
        <Link to="/grammar">← All topics</Link>
      </p>
      <h1 className="h3" ref={heading} tabIndex={-1}>
        {topic.title}
      </h1>
      <p className="text-secondary">{topic.area}</p>

      <Suspense fallback={<p role="status">Loading…</p>}>
        <Body />
      </Suspense>

      {related.length > 0 && (
        <section className="mb-4">
          <h2 className="h5">Related topics</h2>
          <ul>
            {related.map((t) => (
              <li key={t.id}>
                <Link to={`/grammar/${t.id}`}>{t.title}</Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <nav aria-label="Topics" className="d-flex justify-content-between gap-2 border-top pt-3">
        {prev ? <Link to={`/grammar/${prev.id}`}>← Previous topic: {prev.title}</Link> : <span />}
        {next ? <Link to={`/grammar/${next.id}`}>Next topic: {next.title} →</Link> : <span />}
      </nav>
    </div>
  );
}
