'use client';

import React, { useState } from 'react';

interface ChartData {
  label: string;
  income: number;
  expense: number;
}

export default function FinanceChart({ data }: { data: ChartData[] }) {
  const [hoveredBar, setHoveredBar] = useState<{
    index: number;
    type: 'income' | 'expense';
    value: number;
    x: number;
    y: number;
  } | null>(null);

  // SVG dimensions
  const width = 800;
  const height = 300;
  const paddingLeft = 75;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  // Find max value for scaling
  const maxVal = Math.max(
    ...data.flatMap(d => [d.income, d.expense]),
    1000 // Minimum top scale
  );

  // Rounded max value for grid labels
  const topScale = Math.ceil(maxVal / 1000) * 1000;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const getBarHeight = (val: number) => {
    return (val / topScale) * chartHeight;
  };

  const colWidth = chartWidth / data.length;
  const barWidth = colWidth * 0.32;
  const gap = colWidth * 0.08;

  return (
    <div className="rounded-xl border border-charcoal bg-deep-charcoal p-6 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-3">
        <div>
          <h3 className="text-base font-semibold text-foreground">Tendencia Financiera</h3>
          <p className="text-xs text-light-gray/50 mt-0.5 font-medium">Balance comparativo (Últimos 6 meses)</p>
        </div>
        
        {/* Legends */}
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <div className="flex items-center space-x-1.5">
            <div className="h-3 w-3 rounded-sm bg-emerald-500"></div>
            <span className="text-light-gray">Ingresos</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <div className="h-3 w-3 rounded-sm bg-red-500"></div>
            <span className="text-light-gray">Egresos</span>
          </div>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full min-w-[650px] overflow-visible"
        >
          {/* Horizontal Grid Lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((tick, i) => {
            const y = paddingTop + chartHeight * (1 - tick);
            const value = topScale * tick;
            return (
              <g key={i} className="opacity-40">
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="var(--color-charcoal)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 10}
                  y={y + 4}
                  fill="var(--color-light-gray)"
                  fontSize={10}
                  textAnchor="end"
                  className="font-medium"
                >
                  {formatCurrency(value)}
                </text>
              </g>
            );
          })}

          {/* Bar Groups */}
          {data.map((d, index) => {
            const colX = paddingLeft + index * colWidth;
            const xCenter = colX + colWidth / 2;

            // X positions for Income and Expense bars
            const xIncome = xCenter - barWidth - gap / 2;
            const xExpense = xCenter + gap / 2;

            // Heights
            const hIncome = getBarHeight(d.income);
            const hExpense = getBarHeight(d.expense);

            // Y positions
            const yIncome = paddingTop + chartHeight - hIncome;
            const yExpense = paddingTop + chartHeight - hExpense;

            return (
              <g key={index}>
                {/* Income Bar */}
                <rect
                  x={xIncome}
                  y={yIncome}
                  width={barWidth}
                  height={Math.max(3, hIncome)}
                  rx={3}
                  className="fill-emerald-500 hover:fill-emerald-400 transition-all duration-200 cursor-pointer"
                  onMouseEnter={(e) => {
                    setHoveredBar({
                      index,
                      type: 'income',
                      value: d.income,
                      x: xIncome + barWidth / 2,
                      y: yIncome,
                    });
                  }}
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Expense Bar */}
                <rect
                  x={xExpense}
                  y={yExpense}
                  width={barWidth}
                  height={Math.max(3, hExpense)}
                  rx={3}
                  className="fill-red-500 hover:fill-red-400 transition-all duration-200 cursor-pointer"
                  onMouseEnter={() => {
                    setHoveredBar({
                      index,
                      type: 'expense',
                      value: d.expense,
                      x: xExpense + barWidth / 2,
                      y: yExpense,
                    });
                  }}
                  onMouseLeave={() => setHoveredBar(null)}
                />

                {/* Month Label */}
                <text
                  x={xCenter}
                  y={height - paddingBottom + 20}
                  fill="var(--color-light-gray)"
                  fontSize={11}
                  fontWeight={600}
                  textAnchor="middle"
                >
                  {d.label}
                </text>
              </g>
            );
          })}

          {/* Tooltip Overlay */}
          {hoveredBar && (
            <g>
              <rect
                x={Math.max(paddingLeft, hoveredBar.x - 75)}
                y={Math.max(5, hoveredBar.y - 45)}
                width={150}
                height={35}
                rx={6}
                fill="var(--color-matte-black, #080808)"
                stroke="var(--color-charcoal)"
                strokeWidth={1}
                className="shadow-xl"
              />
              <text
                x={Math.max(paddingLeft + 75, hoveredBar.x)}
                y={Math.max(22, hoveredBar.y - 23)}
                fill="var(--color-foreground, #FFFFFF)"
                fontSize={10}
                fontWeight={700}
                textAnchor="middle"
              >
                {hoveredBar.type === 'income' ? 'Ingresos: ' : 'Egresos: '}
                {formatCurrency(hoveredBar.value)}
              </text>
            </g>
          )}
        </svg>
      </div>
    </div>
  );
}
