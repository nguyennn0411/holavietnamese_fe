import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Sparkles,
  MapPin,
  Clock,
  Target,
  Play,
  Lightbulb,
  CheckCircle2,
  Bookmark,
} from 'lucide-react';
import { BilingualText } from '@/components/common/BilingualText';
import { ContentImage } from '@/components/common/ContentImage';
import { aiRoleplayService } from '@/services/aiRoleplayService';

export function ScenarioDetailPage() {
  const { id } = useParams();
  const scenario = aiRoleplayService.getScenario(id);

  if (!scenario) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-4xl">🎭</p>
        <h2 className="text-xl font-black text-[#202124]">
          Không tìm thấy kịch bản này
        </h2>
        <p className="text-sm text-[#78685B]">
          Kịch bản này không tồn tại hoặc đã được cập nhật.
        </p>
        <Link
          to="/ai-scenarios"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#DA251D] text-white text-xs font-bold shadow-md hover:bg-[#89221E] transition-all"
        >
          <span>Quay lại Danh sách kịch bản</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-[calc(100vh-80px)] overflow-hidden">
      {/* Subtle Heritage Dong Son Bronze Drum Background Watermark */}
      <div
        className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
        aria-hidden="true"
      >
        <div
          className="w-[min(96vw,1000px)] h-[min(96vw,1000px)] sm:w-[920px] sm:h-[920px] lg:w-[1100px] lg:h-[1100px] aspect-square opacity-[0.05] bg-contain bg-center bg-no-repeat transform-gpu"
          style={{
            backgroundImage: `url('/design/dong-son-drum.webp')`,
          }}
        />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 text-left">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-bold text-[#78685B]">
          <Link
            to="/ai-scenarios"
            className="text-[#DA251D] hover:underline flex items-center gap-1"
          >
            <ArrowLeft size={14} />
            <span>Danh sách kịch bản</span>
          </Link>
          <span>/</span>
          <span>{scenario.topicLabel}</span>
          <span>/</span>
          <span className="text-[#202124] font-black truncate max-w-xs">
            {scenario.titleVi || scenario.title}
          </span>
        </nav>

        {/* Hero Header Section */}
        <section className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#DECBB4]/80 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Info Column (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              {/* Badges Ribbon */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[#DA251D] text-white text-[10px] font-black uppercase tracking-wider shadow-2xs">
                  {scenario.levelLabel}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#431914] text-white text-[10px] font-bold uppercase tracking-wider">
                  {scenario.topicLabel}
                </span>
                <span className="px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#DECBB4] text-[#202124] text-[11px] font-bold flex items-center gap-1">
                  <MapPin size={12} className="text-[#DA251D]" />
                  <span>{scenario.destination}</span>
                </span>
                <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-[11px] font-bold">
                  ⚡ Độ khó: {scenario.difficulty}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-4xl font-black text-[#202124] tracking-tight leading-tight">
                {scenario.titleVi || scenario.title}
              </h1>

              {/* Overview */}
              <p className="text-sm sm:text-base text-[#78685B] leading-relaxed">
                {scenario.overview}
              </p>

              {/* Primary Action Button */}
              <div className="pt-2">
                <Link
                  to={`/ai-roleplay/${scenario.id}`}
                  className="inline-flex items-center gap-2.5 px-8 py-4 rounded-2xl bg-[#DA251D] hover:bg-[#89221E] text-white font-black text-sm shadow-[0_4px_0_#89221E] active:translate-y-1 active:shadow-none transition-all hover:scale-102"
                >
                  <Play size={16} fill="currentColor" />
                  <span>Bắt đầu phiên Roleplay ngay</span>
                </Link>
              </div>
            </div>

            {/* Right Media Preview (5 cols) */}
            <div className="lg:col-span-5 aspect-[16/10] lg:aspect-auto h-full min-h-[240px] rounded-2xl sm:rounded-3xl overflow-hidden border border-[#DECBB4]/80 shadow-md">
              <ContentImage
                src={scenario.coverImage}
                alt={scenario.title}
                loading="eager"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* 2-Column Detail Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column (7 cols): Roles & Objectives */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Character Roles Split Box */}
            <section className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#DECBB4]/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#202124] flex items-center gap-2">
                <span>👥 Phân vai trong kịch bản</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* AI Role Card */}
                <div className="p-4 rounded-2xl bg-[#FFF9EE] border border-[#DECBB4] space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl shrink-0">
                      {scenario.aiRole.avatar}
                    </span>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#DA251D] tracking-wider block">
                        Nhân vật AI
                      </span>
                      <h3 className="text-sm font-black text-[#202124]">
                        {scenario.aiRole.name}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-[#78685B] leading-relaxed pt-1 border-t border-[#DECBB4]/40">
                    {scenario.aiRole.tone}
                  </p>
                </div>

                {/* Learner Role Card */}
                <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4] space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl shrink-0">🎓</span>
                    <div>
                      <span className="text-[10px] font-black uppercase text-[#202124] tracking-wider block">
                        Bạn đóng vai
                      </span>
                      <h3 className="text-sm font-black text-[#202124]">
                        {scenario.learnerRole.role}
                      </h3>
                    </div>
                  </div>
                  <p className="text-xs text-[#78685B] leading-relaxed pt-1 border-t border-[#DECBB4]/40">
                    {scenario.learnerRole.context}
                  </p>
                </div>
              </div>
            </section>

            {/* 2. Mission Objectives Checklist */}
            <section className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#DECBB4]/80 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-black text-[#202124] flex items-center gap-2">
                  <Target size={18} className="text-[#DA251D]" />
                  <span>Mục tiêu cần hoàn thành</span>
                </h2>
                <span className="text-xs font-bold text-[#DA251D] bg-[#F5E1D8] px-2.5 py-0.5 rounded-full">
                  {scenario.objectives.length} nhiệm vụ
                </span>
              </div>

              <div className="space-y-2.5">
                {scenario.objectives.map((task, i) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#FAF8F5] border border-[#DECBB4]/70"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#DA251D] text-white flex items-center justify-center text-xs font-black shrink-0 shadow-2xs">
                      {i + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-[#202124]">
                      {task.label}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Right Column (5 cols): Vocabulary & Culture Hints */}
          <div className="lg:col-span-5 space-y-6">
            {/* Vocabulary & Phrase Hints */}
            <section className="bg-white/95 backdrop-blur-md rounded-3xl border border-[#DECBB4]/80 p-6 shadow-xs space-y-4">
              <h2 className="text-base font-black text-[#202124] flex items-center gap-2">
                <Lightbulb size={18} className="text-[#FFCD00]" />
                <span>Mẫu câu & Từ vựng gợi ý</span>
              </h2>

              <div className="space-y-2">
                {scenario.vocabularyHints.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-2xl bg-[#FFF9EE] border border-[#DECBB4]/70 space-y-0.5"
                  >
                    <div className="text-xs sm:text-sm font-black text-[#DA251D]">
                      “{item.word}”
                    </div>
                    <div className="text-xs text-[#78685B]">
                      {item.meaning}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Cultural Tip Card */}
            {scenario.culturalTip && (
              <section className="bg-gradient-to-br from-[#FFF9EE] to-[#FAF8F5] rounded-3xl border border-[#DECBB4] p-6 shadow-xs space-y-2">
                <div className="flex items-center gap-2 text-xs font-black uppercase text-[#DA251D] tracking-wider">
                  <span>🏮 Mẹo văn hóa thực tế:</span>
                </div>
                <p className="text-xs sm:text-sm text-[#202124] leading-relaxed">
                  {scenario.culturalTip}
                </p>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
