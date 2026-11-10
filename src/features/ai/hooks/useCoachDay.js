import { useEffect, useState } from 'react';
import { getCoachDay } from '../../../utils/coachDay';

export function useCoachDay(busy = false) {
  const [day, setDay] = useState(getCoachDay);
  useEffect(() => {
    const refresh = () => { if (!busy) setDay(getCoachDay()); };
    refresh();
    const timer = window.setInterval(refresh, 1000);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
    };
  }, [busy]);
  return day;
}
