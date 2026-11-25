const illustrationTypes = new Set([
  'TEXT', 'VOCABULARY', 'FLASHCARD', 'GRAMMAR', 'DIALOGUE', 'AUDIO', 'VIDEO', 'SOUND_PATTERN',
  'PRACTICE', 'MULTIPLE_CHOICE', 'FILL_BLANK', 'MATCHING', 'REORDER_SENTENCE',
  'LISTEN_AND_CHOOSE', 'LISTEN_AND_TYPE', 'LISTENING', 'TRANSLATION',
]);

export const illustrationFileTypes = ['image/jpeg', 'image/png', 'image/webp'];

export function canIllustrateActivity(activity) {
  return Boolean(activity?.id) && activity.status !== 'ARCHIVED' && illustrationTypes.has(activity.activityType);
}

export function isIllustrationFile(file) {
  return illustrationFileTypes.includes(file.type) && file.size > 0 && file.size <= 5 * 1024 * 1024;
}

export function canAppendIllustration(content) {
  return Boolean(content) && typeof content === 'object' && !Array.isArray(content)
    && (content.illustrations == null || Array.isArray(content.illustrations));
}

export function appendInlineIllustration(content, imageUrl) {
  if (!canAppendIllustration(content)) throw new Error('Invalid activity illustrations');
  const illustrations = content.illustrations || [];
  if (illustrations.some(image => image?.placement === 'inline' && image.imageUrl === imageUrl)) return content;
  return { ...content, illustrations: [...illustrations, { imageUrl, placement: 'inline' }] };
}
