export function fuzzySearch(query, items, keys = []) {
  if (!query.trim()) return items;

  const q = query.toLowerCase();
  const scores = items.map((item) => {
    let score = 0;
    let found = false;

    for (const key of keys) {
      const value = String(item[key] || '').toLowerCase();
      if (value.includes(q)) {
        found = true;
        const index = value.indexOf(q);
        score += (1 / (index + 1)) * 100;
      }

      for (let i = 0; i < value.length - q.length + 1; i++) {
        let matchScore = 0;
        for (let j = 0; j < q.length; j++) {
          if (value[i + j] === q[j]) {
            matchScore++;
          }
        }
        if (matchScore > q.length * 0.7) {
          score += matchScore;
        }
      }
    }

    return { item, score, found };
  });

  return scores
    .filter((s) => s.found || s.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((s) => s.item);
}
