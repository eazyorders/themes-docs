export type SearchIndexEntry = {
  title: string;
  path: string;
  description: string;
  body: string;
};

export type SearchResult = {
  title: string;
  path: string;
  description: string;
};

export function searchDocs(entries: SearchIndexEntry[], rawQuery: string): SearchResult[] {
  const query = rawQuery.trim().toLowerCase();
  if (query.length < 2) {
    return [];
  }

  const tokens = query.split(/\s+/).filter((token) => token.length >= 2);
  if (tokens.length === 0) {
    return [];
  }

  return entries
    .map((entry) => {
      const title = entry.title.toLowerCase();
      const description = entry.description.toLowerCase();
      const path = entry.path.toLowerCase();
      const body = entry.body.toLowerCase();
      const haystack = `${title}\n${description}\n${path}\n${body}`;

      if (!tokens.every((token) => haystack.includes(token))) {
        return null;
      }

      let score = 0;
      for (const token of tokens) {
        if (title.includes(token)) {
          score += 80;
        }
        if (description.includes(token)) {
          score += 30;
        }
        if (path.includes(token)) {
          score += 15;
        }
        const bodyIndex = body.indexOf(token);
        if (bodyIndex >= 0) {
          score += Math.max(1, 12 - Math.floor(bodyIndex / 400));
        }
      }
      if (haystack.includes(query)) {
        score += 25;
      }
      if (title === query) {
        score += 200;
      }

      return {entry, score};
    })
    .filter((item): item is {entry: SearchIndexEntry; score: number} => item !== null)
    .sort((a, b) => b.score - a.score || a.entry.title.localeCompare(b.entry.title))
    .slice(0, 12)
    .map(({entry}) => ({
      title: entry.title,
      path: entry.path,
      description: entry.description,
    }));
}
