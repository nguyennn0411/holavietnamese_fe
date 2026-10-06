import React from 'react';

/**
 * Standardized Dong Son Drum Vector Component (Trống Đồng Đông Sơn)
 * Specifications:
 * - Format: Pure SVG Vector (crisp on Retina/High-DPI displays)
 * - Color: Monochrome #B57C6E
 * - Stroke-width: Uniform 0.75px crisp geometry
 * - Organized in semantic layer groups (<g id="star">, <g id="birds">, <g id="circles">, etc.)
 */
export function DongSonDrum({ className, style }) {
  const cx = 500;
  const cy = 500;
  const strokeColor = '#B57C6E';

  // 1. Central 14-point star polygon
  const sunPoints = 14;
  const sunOuterR = 120;
  const sunInnerR = 45;
  const starPointsString = Array.from({ length: sunPoints * 2 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / (sunPoints * 2) - Math.PI / 2;
    const r = i % 2 === 0 ? sunOuterR : sunInnerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(' ');

  // Triangles between star rays
  const rayTriangles = Array.from({ length: sunPoints }, (_, i) => {
    const a1 = (Math.PI * 2 * i) / sunPoints - Math.PI / 2;
    const a2 = (Math.PI * 2 * (i + 1)) / sunPoints - Math.PI / 2;
    const aMid = (a1 + a2) / 2;

    const x1 = cx + sunOuterR * 0.96 * Math.cos(a1);
    const y1 = cy + sunOuterR * 0.96 * Math.sin(a1);
    const x2 = cx + sunOuterR * 0.96 * Math.cos(a2);
    const y2 = cy + sunOuterR * 0.96 * Math.sin(a2);
    const xMid = cx + sunInnerR * 1.15 * Math.cos(aMid);
    const yMid = cy + sunInnerR * 1.15 * Math.sin(aMid);

    const xLine = cx + sunOuterR * 0.82 * Math.cos(aMid);
    const yLine = cy + sunOuterR * 0.82 * Math.sin(aMid);

    return (
      <g key={`ray-tri-${i}`}>
        <polygon
          points={`${x1.toFixed(2)},${y1.toFixed(2)} ${xMid.toFixed(2)},${yMid.toFixed(2)} ${x2.toFixed(2)},${y2.toFixed(2)}`}
          fill="none"
          stroke={strokeColor}
          strokeWidth="0.75"
        />
        <line
          x1={xMid.toFixed(2)}
          y1={yMid.toFixed(2)}
          x2={xLine.toFixed(2)}
          y2={yLine.toFixed(2)}
          stroke={strokeColor}
          strokeWidth="0.75"
        />
      </g>
    );
  });

  // 2. Dot Ring
  const dotRing = Array.from({ length: 56 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / 56;
    const x = cx + 135 * Math.cos(angle);
    const y = cy + 135 * Math.sin(angle);
    return <circle key={`dot-${i}`} cx={x.toFixed(2)} cy={y.toFixed(2)} r="1.5" fill={strokeColor} />;
  });

  // 3. Inner Sawteeth
  const saw1Count = 56;
  const saw1R1 = 146;
  const saw1R2 = 160;
  const sawteeth1 = Array.from({ length: saw1Count }, (_, i) => {
    const a1 = (Math.PI * 2 * i) / saw1Count;
    const aMid = (Math.PI * 2 * (i + 0.5)) / saw1Count;
    const a2 = (Math.PI * 2 * (i + 1)) / saw1Count;
    return (
      <polygon
        key={`st1-${i}`}
        points={`${(cx + saw1R1 * Math.cos(a1)).toFixed(2)},${(cy + saw1R1 * Math.sin(a1)).toFixed(2)} ${(cx + saw1R2 * Math.cos(aMid)).toFixed(2)},${(cy + saw1R2 * Math.sin(aMid)).toFixed(2)} ${(cx + saw1R1 * Math.cos(a2)).toFixed(2)},${(cy + saw1R1 * Math.sin(a2)).toFixed(2)}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.75"
      />
    );
  });

  // 4. Tangent Circles Inner
  const tc1Count = 36;
  const tc1R = 182;
  const tc1CircleR = 4.5;
  const tangentCircles1 = Array.from({ length: tc1Count }, (_, i) => {
    const a = (Math.PI * 2 * i) / tc1Count;
    const nextA = (Math.PI * 2 * (i + 1)) / tc1Count;
    const x = cx + tc1R * Math.cos(a);
    const y = cy + tc1R * Math.sin(a);
    const nextX = cx + tc1R * Math.cos(nextA);
    const nextY = cy + tc1R * Math.sin(nextA);

    const perpA = a + Math.PI / 2;
    const tx1 = x + tc1CircleR * Math.cos(perpA);
    const ty1 = y + tc1CircleR * Math.sin(perpA);
    const tx2 = nextX - tc1CircleR * Math.cos(perpA);
    const ty2 = nextY - tc1CircleR * Math.sin(perpA);

    return (
      <g key={`tc1-${i}`}>
        <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r={tc1CircleR} fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="1.2" fill={strokeColor} />
        <line x1={tx1.toFixed(2)} y1={ty1.toFixed(2)} x2={tx2.toFixed(2)} y2={ty2.toFixed(2)} stroke={strokeColor} strokeWidth="0.75" />
      </g>
    );
  });

  // 5. Flying Chim Lạc Band (10 birds)
  const birdCount = 10;
  const birdRadius = 265;
  const birds = Array.from({ length: birdCount }, (_, i) => {
    const deg = (360 / birdCount) * i;
    return (
      <g key={`bird-${i}`} transform={`rotate(${deg} ${cx} ${cy})`}>
        <use href="#ds-bird-spec" transform={`translate(${cx}, ${cy - birdRadius})`} />
      </g>
    );
  });

  // 6. Tangent Circles Outer
  const tc2Count = 64;
  const tc2R = 345;
  const tc2CircleR = 5;
  const tangentCircles2 = Array.from({ length: tc2Count }, (_, i) => {
    const a = (Math.PI * 2 * i) / tc2Count;
    const nextA = (Math.PI * 2 * (i + 1)) / tc2Count;
    const x = cx + tc2R * Math.cos(a);
    const y = cy + tc2R * Math.sin(a);
    const nextX = cx + tc2R * Math.cos(nextA);
    const nextY = cy + tc2R * Math.sin(nextA);

    const perpA = a + Math.PI / 2;
    const tx1 = x + tc2CircleR * Math.cos(perpA);
    const ty1 = y + tc2CircleR * Math.sin(perpA);
    const tx2 = nextX - tc2CircleR * Math.cos(perpA);
    const ty2 = nextY - tc2CircleR * Math.sin(perpA);

    return (
      <g key={`tc2-${i}`}>
        <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r={tc2CircleR} fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={x.toFixed(2)} cy={y.toFixed(2)} r="1.5" fill={strokeColor} />
        <line x1={tx1.toFixed(2)} y1={ty1.toFixed(2)} x2={tx2.toFixed(2)} y2={ty2.toFixed(2)} stroke={strokeColor} strokeWidth="0.75" />
      </g>
    );
  });

  // 7. Outer Sawteeth
  const saw2Count = 80;
  const saw2R1 = 370;
  const saw2R2 = 390;
  const sawteeth2 = Array.from({ length: saw2Count }, (_, i) => {
    const a1 = (Math.PI * 2 * i) / saw2Count;
    const aMid = (Math.PI * 2 * (i + 0.5)) / saw2Count;
    const a2 = (Math.PI * 2 * (i + 1)) / saw2Count;
    return (
      <polygon
        key={`st2-${i}`}
        points={`${(cx + saw2R1 * Math.cos(a1)).toFixed(2)},${(cy + saw2R1 * Math.sin(a1)).toFixed(2)} ${(cx + saw2R2 * Math.cos(aMid)).toFixed(2)},${(cy + saw2R2 * Math.sin(aMid)).toFixed(2)} ${(cx + saw2R1 * Math.cos(a2)).toFixed(2)},${(cy + saw2R1 * Math.sin(a2)).toFixed(2)}`}
        fill="none"
        stroke={strokeColor}
        strokeWidth="0.75"
      />
    );
  });

  // 8. Outer Radial Lines
  const fringeCount = 120;
  const fringeR1 = 415;
  const fringeR2 = 450;
  const fringeLines = Array.from({ length: fringeCount }, (_, i) => {
    const a = (Math.PI * 2 * i) / fringeCount;
    const x1 = cx + fringeR1 * Math.cos(a);
    const y1 = cy + fringeR1 * Math.sin(a);
    const x2 = cx + fringeR2 * Math.cos(a);
    const y2 = cy + fringeR2 * Math.sin(a);
    return (
      <line
        key={`fr-${i}`}
        x1={x1.toFixed(2)}
        y1={y1.toFixed(2)}
        x2={x2.toFixed(2)}
        y2={y2.toFixed(2)}
        stroke={strokeColor}
        strokeWidth="0.75"
      />
    );
  });

  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      shapeRendering="geometricPrecision"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        {/* Precise Vector Chim Lạc Definition */}
        <g id="ds-bird-spec">
          {/* Beak */}
          <path
            d="M -75, -2 L -40, -5 L -38, 0 L -75, -2 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.75"
          />
          {/* Head */}
          <circle cx="-33" cy="-2" r="6" fill="none" stroke={strokeColor} strokeWidth="0.75" />
          <circle cx="-33" cy="-2" r="1.5" fill={strokeColor} />

          {/* Long Crest (Mào chim) */}
          <path
            d="M -27, -8 C -15, -16 5, -18 25, -12 C 12, -12 -2, -9 -15, -5"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.75"
          />
          <path
            d="M -25, -5 C -10, -12 12, -14 32, -9 C 18, -9 3, -7 -12, -3"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.75"
          />

          {/* Neck & Body */}
          <path
            d="M -30, 4 C -20, 10 -5, 12 10, 10 C 25, 8 40, 0 55, -8 C 45, 12 25, 20 5, 18 C -12, 16 -24, 11 -30, 4 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.75"
          />

          {/* Swept Wing */}
          <path
            d="M -5, 8 C 8, -6 22, -22 42, -28 C 36, -18 30, -5 28, 6 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.75"
          />
          {/* Feather striations on wing */}
          <line x1="8" y1="2" x2="25" y2="-18" stroke={strokeColor} strokeWidth="0.75" />
          <line x1="16" y1="4" x2="33" y2="-15" stroke={strokeColor} strokeWidth="0.75" />
          <line x1="22" y1="5" x2="38" y2="-10" stroke={strokeColor} strokeWidth="0.75" />

          {/* Long Tail feathers */}
          <path
            d="M 40, 2 C 55, -2 72, -1 88, 5 C 75, 8 62, 10 50, 9 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.75"
          />
          <path
            d="M 38, 6 C 52, 6 68, 10 82, 18 C 68, 16 55, 15 45, 12 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.75"
          />
          <line x1="48" y1="4" x2="80" y2="4" stroke={strokeColor} strokeWidth="0.75" />
          <line x1="45" y1="8" x2="75" y2="14" stroke={strokeColor} strokeWidth="0.75" />

          {/* Legs */}
          <path
            d="M 8, 18 L 22, 25 L 35, 26"
            fill="none"
            stroke={strokeColor}
            strokeWidth="0.75"
          />
        </g>
      </defs>

      {/* Group: Concentric Border Circles */}
      <g id="circles">
        <circle cx={cx} cy={cy} r="32" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="18" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="126" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="144" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="162" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="170" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="194" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="202" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="207" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="212" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="318" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="323" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="328" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="362" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="392" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="412" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="452" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="460" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="472" fill="none" stroke={strokeColor} strokeWidth="0.75" />
        <circle cx={cx} cy={cy} r="484" fill="none" stroke={strokeColor} strokeWidth="0.75" />
      </g>

      {/* Group: Central Sun Star */}
      <g id="star">
        <circle cx={cx} cy={cy} r="5" fill={strokeColor} />
        {rayTriangles}
        <polygon points={starPointsString} fill="none" stroke={strokeColor} strokeWidth="0.75" />
      </g>

      {/* Group: Dot Ring */}
      <g id="dots">
        {dotRing}
      </g>

      {/* Group: Sawtooth Triangles */}
      <g id="triangles">
        {sawteeth1}
        {sawteeth2}
      </g>

      {/* Group: Tangent Circles */}
      <g id="tangent-circles">
        {tangentCircles1}
        {tangentCircles2}
      </g>

      {/* Group: Flying Chim Lạc Birds */}
      <g id="birds">
        {birds}
      </g>

      {/* Group: Radial Fringe Lines */}
      <g id="radial-fringe">
        {fringeLines}
      </g>
    </svg>
  );
}

