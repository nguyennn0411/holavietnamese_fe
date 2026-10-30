export function getAiSessionKind(session) {
  const types = [session.kind, session.sessionType, session.type, session.mode]
    .map(value => String(value || '').toLowerCase());
  if (types.some(value => ['coach', 'course_coach', 'ai_coach'].includes(value))) return 'coach';
  if (session.lessonId || session.courseId) return 'coach';

  // Older Coach sessions may have been saved with the default Tutor mode.
  const titles = [session.title, session.titleEn, session.titleVi];
  if (titles.some(title => /^\s*(?:hola\s+)?ai\s+coach\b/i.test(title || ''))) return 'coach';
  return 'tutor';
}

export function getAiSessionMode(session) {
  if (getAiSessionKind(session) === 'coach') return 'coach';
  return String(session.mode || 'tutor').toLowerCase();
}
