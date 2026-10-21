import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Volume2, MapPin } from 'lucide-react';
import { useTranslation } from 'react-i18next';

/**
 * Hub of quick shortcuts to main edtech modules.
 * Bilingual labels (EN primary, VI secondary) for foreign learners.
 */
export function LearningModulesHub() {
  const { t } = useTranslation('learner');
  const modules = [
    {
      to: '/ai-tutor',
      icon: MessageCircle,
      iconBg: 'bg-[#FFF0DC]',
      iconColor: 'text-[#EA580C]',
      title: t('modules.conversationTitle'), titleVi: t('modules.conversationVi'),
      desc: t('modules.conversationDescription'),
    },
    {
      to: '/vocabulary',
      icon: Volume2,
      iconBg: 'bg-[#EDF0E5]',
      iconColor: 'text-[#24382B]',
      title: t('modules.vocabularyTitle'), titleVi: t('modules.vocabularyVi'),
      desc: t('modules.vocabularyDescription'),
    },
    {
      to: '/culture',
      icon: MapPin,
      iconBg: 'bg-[#F8E6B7]',
      iconColor: 'text-[#253044]',
      title: t('modules.cultureTitle'), titleVi: t('modules.cultureVi'),
      desc: t('modules.cultureDescription'),
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
      {modules.map((m, idx) => {
        const Icon = m.icon;
        return (
          <Link
            key={idx}
            to={m.to}
            className="p-5 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#E8E5DF]/70 hover:border-[#EA580C] shadow-2xs hover:shadow-md transition-all space-y-1.5 group"
          >
            <div className={`w-10 h-10 rounded-xl ${m.iconBg} ${m.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon size={20} />
            </div>
            <h3 className="text-sm font-black text-[#253044] group-hover:text-[#EA580C] transition-colors">
              {m.title}
            </h3>
            <p className="text-[10px] font-semibold text-[#EA580C]/60">{m.titleVi}</p>
            <p className="text-[11px] text-[#64748B]">{m.desc}</p>
          </Link>
        );
      })}
    </div>
  );
}

export default LearningModulesHub;
