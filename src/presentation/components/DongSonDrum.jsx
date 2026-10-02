import React from 'react';

/**
 * Authentic Đông Sơn (Ngọc Lũ) Bronze Drum Pattern in SVG.
 * Features:
 * - 14-point central sun star with peacock/triangle motifs between rays
 * - Concentric bands of dotted rings
 * - Traditional tangent circles (vòng tròn đồng tâm có tiếp tuyến)
 * - Sawtooth / triangular bands (họa tiết răng cưa)
 * - Band of flying Chim Lạc (Lạc birds) flying counter-clockwise
 */
export function DongSonDrum({ className, style }) {
  const cx = 500;
  const cy = 500;
  
  // Bronze / Ochre palette inspired by ancient Vietnamese bronze artifacts
  const strokeColor = '#8c5332';
  const lightStroke = '#a66e4a';
  const fillDetail = 'rgba(140, 83, 50, 0.12)';

  // Helper for points on a circle
  const getCirclePoints = (r, count, offset = 0) =>
    Array.from({ length: count }, (_, i) => {
      const angle = (Math.PI * 2 * i) / count + offset;
      return [cx + r * Math.cos(angle), cy + r * Math.sin(angle), angle];
    });

  // 1. Central 14-point star
  const sunPoints = 14;
  const sunOuterR = 120;
  const sunInnerR = 45;
  const starPath = Array.from({ length: sunPoints * 2 }, (_, i) => {
    const angle = (Math.PI * 2 * i) / (sunPoints * 2) - Math.PI / 2;
    const r = i % 2 === 0 ? sunOuterR : sunInnerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return `${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(' ') + ' Z';

  // Triangle patterns between sun rays (lông công / họa tiết kẽ tia sáng)
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

    // Inner line for feather effect
    const xLine = cx + sunOuterR * 0.8 * Math.cos(aMid);
    const yLine = cy + sunOuterR * 0.8 * Math.sin(aMid);

    return (
      <g key={`ray-tri-${i}`}>
        <polygon
          points={`${x1.toFixed(1)},${y1.toFixed(1)} ${xMid.toFixed(1)},${yMid.toFixed(1)} ${x2.toFixed(1)},${y2.toFixed(1)}`}
          fill={fillDetail}
          stroke={lightStroke}
          strokeWidth="1"
        />
        <line
          x1={xMid.toFixed(1)}
          y1={yMid.toFixed(1)}
          x2={xLine.toFixed(1)}
          y2={yLine.toFixed(1)}
          stroke={strokeColor}
          strokeWidth="0.8"
        />
      </g>
    );
  });

  // 2. Ring of tiny dots around sun
  const dotRing1 = getCirclePoints(135, 48).map(([x, y], i) => (
    <circle key={`dr1-${i}`} cx={x.toFixed(1)} cy={y.toFixed(1)} r="2" fill={strokeColor} />
  ));

  // 3. Inner sawteeth / triangles (răng cưa)
  const saw1Count = 56;
  const saw1R1 = 145;
  const saw1R2 = 160;
  const sawteeth1 = Array.from({ length: saw1Count }, (_, i) => {
    const a1 = (Math.PI * 2 * i) / saw1Count;
    const aMid = (Math.PI * 2 * (i + 0.5)) / saw1Count;
    const a2 = (Math.PI * 2 * (i + 1)) / saw1Count;
    return (
      <polygon
        key={`st1-${i}`}
        points={`${(cx + saw1R1 * Math.cos(a1)).toFixed(1)},${(cy + saw1R1 * Math.sin(a1)).toFixed(1)} ${(cx + saw1R2 * Math.cos(aMid)).toFixed(1)},${(cy + saw1R2 * Math.sin(aMid)).toFixed(1)} ${(cx + saw1R1 * Math.cos(a2)).toFixed(1)},${(cy + saw1R1 * Math.sin(a2)).toFixed(1)}`}
        fill={i % 2 === 0 ? fillDetail : 'none'}
        stroke={strokeColor}
        strokeWidth="0.8"
      />
    );
  });

  // 4. Tangent circle band (Vòng tròn tiếp tuyến)
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

    // Tangent line connecting to next circle
    const perpA = a + Math.PI / 2;
    const tx1 = x + tc1CircleR * Math.cos(perpA);
    const ty1 = y + tc1CircleR * Math.sin(perpA);
    const tx2 = nextX - tc1CircleR * Math.cos(perpA);
    const ty2 = nextY - tc1CircleR * Math.sin(perpA);

    return (
      <g key={`tc1-${i}`}>
        <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={tc1CircleR} fill="none" stroke={strokeColor} strokeWidth="1" />
        <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.5" fill={strokeColor} />
        <line x1={tx1.toFixed(1)} y1={ty1.toFixed(1)} x2={tx2.toFixed(1)} y2={ty2.toFixed(1)} stroke={lightStroke} strokeWidth="0.8" />
      </g>
    );
  });

  // 5. Band of Flying Chim Lạc (Lạc Birds)
  // Traditional Dong Son drum depicts birds with long beaks, crests, sweeping wings, flying counter-clockwise
  const birdCount = 10;
  const birdRadius = 265;
  const birds = Array.from({ length: birdCount }, (_, i) => {
    const deg = (360 / birdCount) * i;
    return (
      <g key={`bird-${i}`} transform={`rotate(${deg} ${cx} ${cy})`}>
        <use href="#dongson-chim-lac" transform={`translate(${cx}, ${cy - birdRadius})`} />
      </g>
    );
  });

  // 6. Tangent circles band outer
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
        <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r={tc2CircleR} fill="none" stroke={strokeColor} strokeWidth="1" />
        <circle cx={x.toFixed(1)} cy={y.toFixed(1)} r="1.8" fill={strokeColor} />
        <line x1={tx1.toFixed(1)} y1={ty1.toFixed(1)} x2={tx2.toFixed(1)} y2={ty2.toFixed(1)} stroke={lightStroke} strokeWidth="0.8" />
      </g>
    );
  });

  // 7. Outer sawteeth / triangles
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
        points={`${(cx + saw2R1 * Math.cos(a1)).toFixed(1)},${(cy + saw2R1 * Math.sin(a1)).toFixed(1)} ${(cx + saw2R2 * Math.cos(aMid)).toFixed(1)},${(cy + saw2R2 * Math.sin(aMid)).toFixed(1)} ${(cx + saw2R1 * Math.cos(a2)).toFixed(1)},${(cy + saw2R1 * Math.sin(a2)).toFixed(1)}`}
        fill={i % 2 === 0 ? fillDetail : 'none'}
        stroke={strokeColor}
        strokeWidth="1"
      />
    );
  });

  // 8. Outer radiating sunrays / fringe
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
        x1={x1.toFixed(1)}
        y1={y1.toFixed(1)}
        x2={x2.toFixed(1)}
        y2={y2.toFixed(1)}
        stroke={i % 2 === 0 ? strokeColor : lightStroke}
        strokeWidth={i % 4 === 0 ? '1.5' : '0.8'}
      />
    );
  });

  return (
    <svg
      viewBox="0 0 1000 1000"
      className={className}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Authentic Chim Lạc vector definition */}
        <g id="dongson-chim-lac">
          {/* Main bird body, head, and long beak */}
          {/* Bird flies towards the left (counter-clockwise around drum) */}
          {/* Beak */}
          <path
            d="M -75, -2 L -40, -4 L -38, -1 L -75, -2 Z"
            fill={strokeColor}
          />
          {/* Head & Eye */}
          <path
            d="M -40, -5 C -36, -9 -28, -8 -25, -3 C -23, 2 -27, 6 -32, 5 C -36, 4 -39, 1 -40, -5 Z"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          <circle cx="-33" cy="-2" r="1.5" fill={strokeColor} />

          {/* Crest / Mào chim flowing backwards */}
          <path
            d="M -27, -8 C -15, -16 5, -18 25, -12 C 15, -12 0, -10 -15, -6"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1.3"
          />
          <path
            d="M -25, -5 C -10, -12 12, -14 32, -9 C 20, -9 5, -7 -12, -3"
            fill="none"
            stroke={lightStroke}
            strokeWidth="1"
          />

          {/* Neck & Body */}
          <path
            d="M -30, 4 C -20, 10 -5, 12 10, 10 C 25, 8 40, 0 55, -8 C 45, 12 25, 20 5, 18 C -12, 16 -24, 11 -30, 4 Z"
            fill={fillDetail}
            stroke={strokeColor}
            strokeWidth="1.4"
          />

          {/* Swept Wing (Cánh xòe) */}
          <path
            d="M -5, 8 C 8, -6 22, -22 42, -28 C 36, -18 30, -5 28, 6 Z"
            fill={fillDetail}
            stroke={strokeColor}
            strokeWidth="1.3"
          />
          {/* Feather strokes on wing */}
          <line x1="8" y1="2" x2="25" y2="-18" stroke={strokeColor} strokeWidth="1" />
          <line x1="16" y1="4" x2="33" y2="-15" stroke={strokeColor} strokeWidth="1" />
          <line x1="22" y1="5" x2="38" y2="-10" stroke={strokeColor} strokeWidth="0.8" />

          {/* Long Tail feathers (Đuôi chim dài xòe rộng) */}
          <path
            d="M 40, 2 C 55, -2 72, -1 88, 5 C 75, 8 62, 10 50, 9 Z"
            fill={fillDetail}
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          <path
            d="M 38, 6 C 52, 6 68, 10 82, 18 C 68, 16 55, 15 45, 12 Z"
            fill={fillDetail}
            stroke={strokeColor}
            strokeWidth="1.2"
          />
          {/* Feather striations on tail */}
          <line x1="48" y1="4" x2="80" y2="4" stroke={lightStroke} strokeWidth="0.8" />
          <line x1="45" y1="8" x2="75" y2="14" stroke={lightStroke} strokeWidth="0.8" />

          {/* Legs trailing backwards */}
          <path
            d="M 8, 18 L 22, 25 L 35, 26"
            fill="none"
            stroke={strokeColor}
            strokeWidth="1"
          />
        </g>
      </defs>

      {/* ── Central Sun Motif ── */}
      <circle cx={cx} cy={cy} r="32" fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="18" fill="none" stroke={lightStroke} strokeWidth="1" />
      <circle cx={cx} cy={cy} r="6" fill={strokeColor} />

      {rayTriangles}
      <path d={starPath} fill="none" stroke={strokeColor} strokeWidth="2.2" />

      {/* ── Band 1: Dots around Sun ── */}
      <circle cx={cx} cy={cy} r="126" fill="none" stroke={strokeColor} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="144" fill="none" stroke={strokeColor} strokeWidth="1.2" />
      {dotRing1}

      {/* ── Band 2: Inner Sawteeth ── */}
      <circle cx={cx} cy={cy} r="162" fill="none" stroke={strokeColor} strokeWidth="1.2" />
      {sawteeth1}

      {/* ── Band 3: Tangent Circles Inner ── */}
      <circle cx={cx} cy={cy} r="170" fill="none" stroke={strokeColor} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="194" fill="none" stroke={strokeColor} strokeWidth="1.2" />
      {tangentCircles1}

      {/* ── Band 4: Chim Lạc (Birds) Band ── */}
      {/* Dividing rings before bird band */}
      <circle cx={cx} cy={cy} r="202" fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="207" fill="none" stroke={lightStroke} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="212" fill="none" stroke={strokeColor} strokeWidth="1.5" />

      {/* The Chim Lạc flock */}
      {birds}

      {/* Dividing rings after bird band */}
      <circle cx={cx} cy={cy} r="318" fill="none" stroke={strokeColor} strokeWidth="1.5" />
      <circle cx={cx} cy={cy} r="323" fill="none" stroke={lightStroke} strokeWidth="0.8" />
      <circle cx={cx} cy={cy} r="328" fill="none" stroke={strokeColor} strokeWidth="1.5" />

      {/* ── Band 5: Outer Tangent Circles ── */}
      <circle cx={cx} cy={cy} r="362" fill="none" stroke={strokeColor} strokeWidth="1.2" />
      {tangentCircles2}

      {/* ── Band 6: Outer Sawteeth ── */}
      <circle cx={cx} cy={cy} r="392" fill="none" stroke={strokeColor} strokeWidth="1.5" />
      {sawteeth2}

      {/* ── Band 7: Radial Fringe / Sunrays ── */}
      <circle cx={cx} cy={cy} r="412" fill="none" stroke={strokeColor} strokeWidth="1.8" />
      <circle cx={cx} cy={cy} r="452" fill="none" stroke={strokeColor} strokeWidth="1.8" />
      {fringeLines}

      {/* ── Band 8: Outer Rim Borders ── */}
      <circle cx={cx} cy={cy} r="460" fill="none" stroke={strokeColor} strokeWidth="2.5" />
      <circle cx={cx} cy={cy} r="472" fill="none" stroke={lightStroke} strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="484" fill="none" stroke={strokeColor} strokeWidth="3" />
    </svg>
  );
}
