import { useReducedMotion } from 'motion/react';
import welcomeImg from '@/assets/mascot/nghe-welcome.webp';
import teachingImg from '@/assets/mascot/nghe-teaching.webp';
import thinkingImg from '@/assets/mascot/nghe-thinking.webp';
import speakingImg from '@/assets/mascot/nghe-speaking.webp';
import happyImg from '@/assets/mascot/nghe-happy.webp';
import encouragingImg from '@/assets/mascot/nghe-encouraging.webp';
import correctionImg from '@/assets/mascot/nghe-correction.webp';
import idleImg from '@/assets/mascot/nghe-idle.webp';
import '@/shared/components/mascot/mascot.css';

const mascotImages = {
  welcome: welcomeImg,
  teaching: teachingImg,
  thinking: thinkingImg,
  speaking: speakingImg,
  happy: happyImg,
  encouraging: encouragingImg,
  correction: correctionImg,
  idle: idleImg,
  // Alias mappings
  error: correctionImg,
  loading: thinkingImg,
  listening: thinkingImg,
  success: happyImg,
};

/**
 * Nghé - Vietnamese Buffalo Mascot Component
 * Displays a single, centered, authentic Nghé character pose with zero clipping or ghosting.
 */
export function BuffaloMascot({
  variant = 'idle',
  size = 'medium',
  animated = true,
  className = '',
  accessibilityLabel = 'Nghé, the HolaVietnamese learning companion',
}) {
  const reduceMotion = useReducedMotion();
  const imageSrc = mascotImages[variant] || mascotImages.idle;

  return (
    <span
      role="img"
      aria-label={accessibilityLabel}
      className={`nghe-mascot nghe-mascot--${size} nghe-mascot--${variant} ${
        animated && !reduceMotion ? 'is-animated' : ''
      } ${className}`}
    >
      <img
        src={imageSrc}
        alt=""
        aria-hidden="true"
        className="nghe-mascot__img"
        loading="lazy"
        decoding="async"
        draggable="false"
      />
    </span>
  );
}

/**
 * Speech Bubble for Nghé Mascot
 */
export function MascotSpeechBubble({
  children,
  className = '',
  arrow = 'bottom',
}) {
  if (!children) return null;
  return (
    <div
      className={`nghe-speech nghe-speech--arrow-${arrow} ${className}`}
      role="status"
    >
      {children}
    </div>
  );
}

export default BuffaloMascot;
