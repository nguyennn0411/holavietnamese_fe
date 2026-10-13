import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Volume2, MapPin } from 'lucide-react';

/**
 * Hub of quick shortcuts to main edtech modules
 */
export function LearningModulesHub() {
  const modules = [
    {
      to: '/ai-tutor',
      icon: MessageCircle,
      iconBg: 'bg-[#F5E1D8]',
      iconColor: 'text-[#A62A24]',
      title: 'AI Gia sư đàm thoại',
      desc: 'Luyện phản xạ từng câu hỏi đáp',
    },
    {
      to: '/edtech/vocabulary',
      icon: Volume2,
      iconBg: 'bg-[#EDF0E5]',
      iconColor: 'text-[#24382B]',
      title: 'Kho từ & Thanh điệu',
      desc: 'So sánh cặp từ Minimal Pairs',
    },
    {
      to: '/culture',
      icon: MapPin,
      iconBg: 'bg-[#F8E6B7]',
      iconColor: 'text-[#431914]',
      title: 'Văn hóa & Điểm đến',
      desc: 'Phong tục, món ngon & con người',
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
            className="p-5 rounded-2xl bg-white/92 backdrop-blur-xs border border-[#DECBB4]/70 hover:border-[#A62A24] shadow-2xs hover:shadow-md transition-all space-y-2 group"
          >
            <div className={`w-10 h-10 rounded-xl ${m.iconBg} ${m.iconColor} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <Icon size={20} />
            </div>
            <h3 className="text-sm font-black text-[#431914] group-hover:text-[#A62A24] transition-colors">
              {m.title}
            </h3>
            <p className="text-[11px] text-[#78685B]">{m.desc}</p>
          </Link>
        );
      })}
    </div>
  );
}

export default LearningModulesHub;
