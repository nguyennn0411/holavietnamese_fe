export function reviewSessionEntries(session) {
  const seen = new Set();
  return [...(session.reviewedEntries ?? []), ...(session.entries ?? [])].filter(entry => {
    if (seen.has(entry.id)) return false;
    seen.add(entry.id);
    return true;
  });
}

export function difficultReviewEntries(entries, results) {
  const difficultIds = new Set(
    (results ?? [])
      .filter(result => result.rating === 'AGAIN' || result.rating === 'HARD')
      .map(result => result.entryId)
  );
  return entries.filter(entry => difficultIds.has(entry.id));
}
