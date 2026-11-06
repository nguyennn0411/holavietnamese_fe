import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useReducedMotion } from 'motion/react';
import { useTranslation } from 'react-i18next';

function AnimatedMetric({ target, suffix, label, detail }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-30px' });
  const reducedMotion = useReducedMotion();
  const [value, setValue] = useState(reducedMotion ? target : 0);

  useEffect(() => {
    if (!inView || reducedMotion) { if (reducedMotion) setValue(target); return undefined; }
    let frame;
    const startedAt = performance.now();
    const tick = (now) => {
      const ratio = Math.min(1, (now - startedAt) / 850);
      setValue(Math.round(target * (1 - Math.pow(1 - ratio, 3))));
      if (ratio < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [inView, reducedMotion, target]);

  return <motion.div ref={ref} initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="space-y-1 px-4">
    <strong className="block text-2xl sm:text-4xl font-black text-[#FF7A00]">{value}{suffix}</strong>
    <span className="block text-xs sm:text-sm text-[#253044] font-bold">{label}</span>
    <small className="block text-[10px] text-[#887568]">{detail}</small>
  </motion.div>;
}

/**
 * Key Metrics Ribbon banner displaying social proof and platform statistics.
 */
export function MetricsRibbon() {
  const { t } = useTranslation('home');
  const metrics = [
    { target: 6, suffix: '', label: t('metrics.tones'), detail: t('metrics.tonesDetail') },
    { target: 4, suffix: '', label: t('metrics.skills'), detail: t('metrics.skillsDetail') },
    { target: 10, suffix: ` ${t('learner:minutes')}`, label: t('metrics.goal'), detail: t('metrics.goalDetail') },
    { target: 1, suffix: '', label: t('metrics.lesson'), detail: t('metrics.lessonDetail') },
  ];

  return (
    <section className="w-full bg-white/95 backdrop-blur-md border-b border-[#E8E5DF]/70 py-10 px-4 sm:px-8 lg:px-14 shadow-[0_4px_20px_rgba(67,25,20,0.02)]">
      <div className="max-w-[1560px] 2xl:max-w-[1680px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x md:divide-[#E8E5DF]/60">
        {metrics.map((item) => <AnimatedMetric key={item.label} {...item} />)}
      </div>
    </section>
  );
}

export default MetricsRibbon;
