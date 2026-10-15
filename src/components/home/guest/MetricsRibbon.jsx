import React from 'react';

/**
 * Key Metrics Ribbon banner displaying social proof and platform statistics.
 */
export function MetricsRibbon() {
  const metrics = [
    { value: '15,000+', label: 'Expats & Du khách' },
    { value: '50+', label: 'Tình huống đời thực' },
    { value: '6 Thanh', label: 'Chuẩn IPA âm học' },
    { value: '100%', label: 'Giọng phát âm bản xứ' },
  ];

  return (
    <section className="w-full bg-white/95 backdrop-blur-md border-b border-[#DECBB4]/70 py-10 px-4 sm:px-8 lg:px-14 shadow-[0_4px_20px_rgba(67,25,20,0.02)]">
      <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center divide-x-0 md:divide-x md:divide-[#DECBB4]/60">
        {metrics.map((item, idx) => (
          <div key={idx} className="space-y-1 px-4">
            <strong className="block text-2xl sm:text-4xl font-black text-[#A62A24]">
              {item.value}
            </strong>
            <span className="text-xs sm:text-sm text-[#78685B] font-semibold">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

export default MetricsRibbon;
