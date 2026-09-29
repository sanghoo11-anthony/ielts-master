'use client';

import React from 'react';

interface ScoreRadarChartProps {
  scores: {
    task_response: number;
    coherence_cohesion: number;
    lexical_resource: number;
    grammatical_range_accuracy: number;
  };
  areaNames?: {
    task_response: string;
    coherence_cohesion: string;
    lexical_resource: string;
    grammatical_range_accuracy: string;
  };
}

export default function ScoreRadarChart({
  scores,
  areaNames = {
    task_response: 'Task Response',
    coherence_cohesion: 'Coherence & Cohesion',
    lexical_resource: 'Lexical Resource',
    grammatical_range_accuracy: 'Grammar Accuracy',
  },
}: ScoreRadarChartProps) {
  // SVG 중심 및 반지름 설정
  const size = 300;
  const center = size / 2;
  const maxRadius = 95; // 9.0 점에 대응
  const maxScore = 9.0;

  // 4개 축 각도: Top (0°/ -90° in standard SVG), Right (90°), Bottom (180°), Left (270°)
  const axes = [
    { key: 'task_response', label: areaNames.task_response, score: scores.task_response, angle: -Math.PI / 2 },
    { key: 'coherence_cohesion', label: areaNames.coherence_cohesion, score: scores.coherence_cohesion, angle: 0 },
    { key: 'grammatical_range_accuracy', label: areaNames.grammatical_range_accuracy, score: scores.grammatical_range_accuracy, angle: Math.PI / 2 },
    { key: 'lexical_resource', label: areaNames.lexical_resource, score: scores.lexical_resource, angle: Math.PI },
  ];

  // 점수를 좌표로 변환
  const getCoordinates = (angle: number, score: number) => {
    const r = (Math.min(score, maxScore) / maxScore) * maxRadius;
    const x = center + r * Math.cos(angle);
    const y = center + r * Math.sin(angle);
    return { x, y };
  };

  // 학생 점수 다각형 path
  const userPolygonPoints = axes
    .map((axis) => {
      const { x, y } = getCoordinates(axis.angle, axis.score);
      return `${x},${y}`;
    })
    .join(' ');

  // Band 7.0 목표 기준선 다각형 path
  const target7PolygonPoints = axes
    .map((axis) => {
      const { x, y } = getCoordinates(axis.angle, 7.0);
      return `${x},${y}`;
    })
    .join(' ');

  // 동심원 단계 (Band 3, 5, 7, 9)
  const gridBands = [3.0, 5.0, 7.0, 9.0];

  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between w-full mb-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          IELTS 4대 영역 밸런스 레이더 차트
        </h4>
        <div className="flex items-center gap-3 text-[11px] font-semibold">
          <span className="flex items-center gap-1 text-blue-600">
            <span className="inline-block h-2 w-2 rounded-full bg-blue-600" />
            내 점수
          </span>
          <span className="flex items-center gap-1 text-emerald-600">
            <span className="inline-block h-2 w-2 rounded-full border border-emerald-500 border-dashed" />
            Band 7.0 목표선
          </span>
        </div>
      </div>

      <div className="relative flex justify-center w-full">
        <svg
          viewBox="-95 -25 490 350"
          className="w-full max-w-[320px] sm:max-w-[360px] h-auto"
        >
          {/* 1. 배경 동심원 그리드 */}
          {gridBands.map((band) => {
            const r = (band / maxScore) * maxRadius;
            return (
              <g key={band}>
                <circle
                  cx={center}
                  cy={center}
                  r={r}
                  fill="none"
                  stroke="#e2e8f0"
                  strokeWidth="1"
                  strokeDasharray={band === 7.0 ? '3 3' : undefined}
                />
                <text
                  x={center + 3}
                  y={center - r + 9}
                  fill="#94a3b8"
                  fontSize="9"
                  fontFamily="monospace"
                >
                  {band.toFixed(0)}
                </text>
              </g>
            );
          })}

          {/* 2. 4방향 축 선 (Grid Spokes) */}
          {axes.map((axis) => {
            const endX = center + maxRadius * Math.cos(axis.angle);
            const endY = center + maxRadius * Math.sin(axis.angle);
            return (
              <line
                key={axis.key}
                x1={center}
                y1={center}
                x2={endX}
                y2={endY}
                stroke="#cbd5e1"
                strokeWidth="1"
              />
            );
          })}

          {/* 3. Band 7.0 기준선 (골드/초록 점선) */}
          <polygon
            points={target7PolygonPoints}
            fill="none"
            stroke="#10b981"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            className="opacity-70"
          />

          {/* 4. 수험생 점수 영역 폴리곤 */}
          <polygon
            points={userPolygonPoints}
            fill="rgba(59, 130, 246, 0.25)"
            stroke="#2563eb"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />

          {/* 5. 각 축 점수 꼭짓점 포인트 */}
          {axes.map((axis) => {
            const { x, y } = getCoordinates(axis.angle, axis.score);
            return (
              <g key={axis.key}>
                <circle
                  cx={x}
                  cy={y}
                  r={4.5}
                  fill="#2563eb"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="shadow-sm"
                />
              </g>
            );
          })}

          {/* 6. 레이블 표시 */}
          {axes.map((axis) => {
            const labelDistance = maxRadius + 22;
            const lx = center + labelDistance * Math.cos(axis.angle);
            const ly = center + labelDistance * Math.sin(axis.angle);

            const isTop = axis.angle === -Math.PI / 2;
            const isBottom = axis.angle === Math.PI / 2;
            const isRight = axis.angle === 0;
            const isLeft = axis.angle === Math.PI;

            const textAnchor = isRight ? 'start' : isLeft ? 'end' : 'middle';
            const dy = isTop ? -4 : isBottom ? 12 : 4;

            return (
              <text
                key={`label-${axis.key}`}
                x={lx}
                y={ly + dy}
                textAnchor={textAnchor}
                className="fill-slate-800 text-[11px] font-bold"
              >
                {axis.label} ({axis.score.toFixed(1)})
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
