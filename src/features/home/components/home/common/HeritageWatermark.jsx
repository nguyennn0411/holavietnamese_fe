import React from 'react';

/**
 * Fixed fullscreen Dong Son bronze drum background watermark.
 * Renders subtly behind content to create traditional Vietnamese heritage ambiance.
 */
export function FixedHeritageBackdrop() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center overflow-hidden select-none"
      aria-hidden="true"
    >
      <div
        className="w-[min(96vw,1000px)] h-[min(96vw,1000px)] sm:w-[920px] sm:h-[920px] lg:w-[1100px] lg:h-[1100px] aspect-square opacity-[0.06] bg-contain bg-center bg-no-repeat transform-gpu"
        style={{
          backgroundImage: `url('/design/dong-son-drum.webp')`,
        }}
      />
    </div>
  );
}

/**
 * Ambient positioned Dong Son watermark medallion.
 */
export function AmbientWatermark({ className = '', style = {}, ariaHidden = true }) {
  return (
    <div
      className={`pointer-events-none select-none -z-10 ${className}`}
      style={{
        backgroundImage: `url('/design/dong-son-drum.webp')`,
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundSize: 'contain',
        ...style,
      }}
      aria-hidden={ariaHidden}
    />
  );
}

export default FixedHeritageBackdrop;
