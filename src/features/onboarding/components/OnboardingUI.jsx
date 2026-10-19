import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Check, RotateCcw, Volume2, VolumeX, X } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { BuffaloMascot } from '@/components/mascot';
import { useOnboarding } from '../context/OnboardingContext';

const steps = [
  '/onboarding/reason', '/onboarding/level', '/onboarding/benefits',
  '/onboarding/daily-goal', '/onboarding/learning-path',
];

export function Brand({ light = false }) {
  return <Link to="/welcome" className={`ob-brand ${light ? 'is-light' : ''}`} aria-label="HolaVietnamese home"><span className="ob-brand-mark">H</span><span>Hola<span>Vietnamese</span></span></Link>;
}

export function Mascot({ message, compact = false, celebration = false }) {
  return (
    <div className={`ob-mascot-wrap ${compact ? 'is-compact' : ''} ${celebration ? 'is-celebrating' : ''}`}>
      {message && <div className="ob-speech">{message}</div>}
      <BuffaloMascot variant={celebration ? 'happy' : compact ? 'teaching' : 'welcome'} size={compact ? 'medium' : 'large'} animated className="ob-mascot" accessibilityLabel="Nghé, the HolaVietnamese water buffalo mascot" />
    </div>
  );
}

export function OnboardingLayout({ children, title, eyebrow, mascotMessage, wide = false, hideProgress = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const { reset } = useOnboarding();
  const stepIndex = steps.indexOf(location.pathname);
  const previous = stepIndex > 0 ? steps[stepIndex - 1] : '/welcome';

  const restart = () => {
    if (window.confirm('Start over? Your current onboarding progress will be cleared.')) {
      reset();
      navigate('/welcome');
    }
  };

  return (
    <div className="ob-shell">
      <header className="ob-topbar">
        <Brand />
        {!hideProgress && <div className="ob-progress-block" aria-label={`Onboarding step ${stepIndex + 1} of ${steps.length}`}>
          <div className="ob-progress-track"><motion.span initial={reduceMotion ? false : { width: 0 }} animate={{ width: `${((stepIndex + 1) / steps.length) * 100}%` }} /></div>
          <small>{Math.max(stepIndex + 1, 1)} of {steps.length}</small>
        </div>}
        <button className="ob-reset" type="button" onClick={restart}><RotateCcw size={16} /> <span>Start over</span></button>
      </header>
      <main className={`ob-main ${wide ? 'is-wide' : ''}`}>
        {!hideProgress && <button className="ob-back" type="button" onClick={() => navigate(previous)}><ArrowLeft size={19} /> Back</button>}
        <AnimatePresence mode="wait">
          <motion.section key={location.pathname} className="ob-page" initial={reduceMotion ? false : { opacity: 0, x: 22 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} transition={{ duration: 0.28 }}>
            {(eyebrow || title) && <div className="ob-heading"><div><span className="ob-eyebrow">{eyebrow}</span><h1>{title}</h1></div>{mascotMessage && <Mascot compact message={mascotMessage} />}</div>}
            {children}
          </motion.section>
        </AnimatePresence>
      </main>
    </div>
  );
}

export function SelectionCard({ selected, onClick, icon: Icon, title, detail, badge, style }) {
  return (
    <motion.button type="button" className={`ob-selection ${selected ? 'is-selected' : ''}`} onClick={onClick} whileHover={{ y: -4 }} whileTap={{ scale: 0.985 }} aria-pressed={selected} style={style}>
      <span className="ob-selection-icon">{Icon ? <Icon size={27} /> : null}</span>
      <span className="ob-selection-copy"><strong>{title}</strong>{detail && <small>{detail}</small>}</span>
      {badge && <em>{badge}</em>}
      <span className="ob-check"><Check size={17} strokeWidth={3} /></span>
    </motion.button>
  );
}

export function PrimaryButton({ children = 'CONTINUE', disabled, onClick, type = 'button', className = '' }) {
  return <motion.button type={type} className={`ob-primary ${className}`} disabled={disabled} onClick={onClick} whileTap={{ scale: 0.98 }}>{children}<span aria-hidden="true">→</span></motion.button>;
}

export function LessonHeader({ current, total, onExit, sound, onSound }) {
  return <header className="ob-lesson-header"><button type="button" onClick={onExit} aria-label="Exit lesson"><X /></button><div className="ob-lesson-progress"><motion.span animate={{ width: `${(current / total) * 100}%` }} /></div><button type="button" onClick={onSound} aria-label={sound ? 'Mute sound' : 'Turn on sound'}>{sound ? <Volume2 /> : <VolumeX />}</button></header>;
}

export function Confetti() {
  return <div className="ob-confetti" aria-hidden="true">{Array.from({ length: 28 }, (_, index) => <i key={index} style={{ '--i': index }} />)}</div>;
}
