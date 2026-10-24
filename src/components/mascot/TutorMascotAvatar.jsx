import { BuffaloMascot } from './BuffaloMascot';
export function TutorMascotAvatar({ state='idle', size='small', className='' }) {
  const variants={ idle:'idle',listening:'listening',thinking:'thinking',speaking:'speaking',success:'happy',correction:'correction',error:'error' };
  return <span className={`nghe-tutor-avatar is-${state} ${className}`}><BuffaloMascot variant={variants[state] || 'idle'} size={size} animated accessibilityLabel={`Nghé AI Tutor: ${state}`} /><i aria-hidden="true" /></span>;
}
export default TutorMascotAvatar;
