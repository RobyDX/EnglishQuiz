import type { Level, Question, QuestionFile } from '../types';

// One JSON per level and type: src/data/<level>/<type>.json (see specs/07-contenuti.md).
const modules = import.meta.glob<QuestionFile>('./*/*.json', { import: 'default' });

/** Loads (lazily) all the questions of a level. */
export async function loadLevel(level: Level): Promise<Question[]> {
  const prefix = `./${level.toLowerCase()}/`;
  const files = await Promise.all(
    Object.entries(modules)
      .filter(([path]) => path.startsWith(prefix))
      .map(([, load]) => load()),
  );
  return files.flatMap((f) => f.questions);
}
