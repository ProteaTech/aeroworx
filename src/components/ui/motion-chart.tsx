'use client'

import { AnimateNumber, Cursor } from 'motion-plus/react'
import { AnimatePresence, motion, MotionConfig } from 'motion/react'
import { useState } from 'react'

export interface ChartDataPoint {
  label: string
  value: number
}

interface MotionChartProps {
  data: ChartDataPoint[]
  title?: string
  valuePrefix?: string
  valueSuffix?: string
  height?: number
  width?: number
  color?: string
  className?: string
}

export default function MotionChart({
  data,
  title,
  valuePrefix = '',
  valueSuffix = '',
  height = 300,
  width = 600,
  color = 'hsl(var(--primary))',
  className = '',
}: MotionChartProps) {
  const values = data.map((d) => d.value)
  const maxValue = Math.max(...values)
  const minValue = Math.min(...values)
  const range = maxValue - minValue || 1

  // Calculate points for the SVG path
  const points = values.map((value, index) => ({
    x: 50 + index * ((width - 100) / (values.length - 1)),
    y: height - 50 - ((value - minValue) / range) * (height - 100),
    value,
    label: data[index].label,
  }))

  const pathD = points.reduce(buildPath, '')

  const [hoveredPoint, setHoveredPoint] = useState<number | null>(null)
  const [percentageChange, setPercentageChange] = useState<number | null>(null)

  const startHover = (index: number) => {
    setHoveredPoint(index)
    if (index > 0) {
      const currentValue = values[index]
      const previousValue = values[index - 1]
      const percentageChange =
        previousValue !== 0
          ? ((currentValue - previousValue) / previousValue) * 100
          : 0
      setPercentageChange(percentageChange)
    } else {
      setPercentageChange(null)
    }
  }

  const endHover = () => {
    setHoveredPoint(null)
    setPercentageChange(null)
  }

  // Generate grid lines
  const gridLines = Array.from({ length: 5 }, (_, i) => {
    const y = 50 + (i * (height - 100)) / 4
    return y
  })

  return (
    <div
      className={`bg-card rounded-lg border-none p-2 md:border md:p-4 ${className}`}
      onPointerLeave={endHover}
    >
      {title && (
        <h3 className="text-card-foreground mb-4 text-center text-lg font-semibold">
          {title}
        </h3>
      )}

      <svg width={width} height={height} className="overflow-visible">
        <defs>
          <linearGradient id={`areaGradient`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Background grid lines */}
        {gridLines.map((y, index) => (
          <motion.line
            key={index}
            x1="50"
            y1={y}
            x2={width - 50}
            y2={y}
            stroke="var(--muted-foreground)"
            strokeWidth="1"
            strokeDasharray="5,5"
            className="opacity-30"
          />
        ))}

        {/* Area fill under the line */}
        <motion.path
          d={`${pathD} L ${width - 50},${height - 50} L 50,${height - 50} Z`}
          fill={`url(#areaGradient)`}
        />

        {/* Main graph line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />

        {/* Points */}
        <motion.g
          initial="hidden"
          animate="visible"
          variants={{
            visible: {
              transition: {
                delayChildren: 0.1,
                staggerChildren: 1.5 / values.length,
              },
            },
          }}
        >
          {points.map((point, index) => (
            <g key={index}>
              {/* Hit area */}
              <motion.rect
                x={point.x - 25}
                y={0}
                width={50}
                height={height}
                fill="transparent"
                onHoverStart={() => startHover(index)}
                className="cursor-pointer"
              />

              {/* Dot */}
              <motion.circle
                cx={point.x}
                cy={point.y}
                r="4"
                fill="hsl(var(--card))"
                stroke={color}
                strokeWidth="2"
                animate={hoveredPoint === index ? { scale: 1.5 } : { scale: 1 }}
                variants={{
                  hidden: { scale: 0.5, opacity: 0 },
                  visible: { scale: 1, opacity: 1 },
                }}
                className="drop-shadow-sm"
              />

              {/* Value label on hover */}
              {hoveredPoint === index && (
                <motion.g
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                >
                  <rect
                    x={point.x - 30}
                    y={point.y - 35}
                    fill="hsl(var(--popover))"
                    stroke="hsl(var(--border))"
                    rx={4}
                    className="h-5 w-fit drop-shadow-md"
                  />
                  <text
                    x={point.x}
                    y={point.y - 22}
                    textAnchor="middle"
                    className="fill-popover-foreground text-xs font-medium"
                  >
                    {valuePrefix}
                    {point.value.toLocaleString()}
                    {valueSuffix}
                  </text>
                </motion.g>
              )}
            </g>
          ))}
        </motion.g>
      </svg>

      <AnimatePresence>
        {percentageChange !== null && (
          <Cursor
            follow
            initial={{ opacity: 0, scale: 0.5 }}
            offset={{ x: 20, y: 20 }}
            key="cursor"
          >
            <div className="bg-popover flex items-center gap-2 rounded-full border px-3 py-1.5 shadow-lg">
              <MotionConfig
                transition={{
                  type: 'spring',
                  visualDuration: 0.6,
                  bounce: 0.2,
                }}
              >
                <motion.div
                  initial={false}
                  animate={{
                    rotate: percentageChange < 0 ? 180 : 0,
                    color:
                      percentageChange < 0
                        ? 'hsl(var(--destructive))'
                        : 'hsl(var(--primary))',
                  }}
                  className="text-lg font-bold"
                >
                  ↑
                </motion.div>
                <AnimateNumber
                  initial={false}
                  animate={{
                    color:
                      percentageChange < 0
                        ? 'hsl(var(--destructive))'
                        : 'hsl(var(--primary))',
                  }}
                  className="text-sm font-semibold"
                  format={{
                    notation: 'compact',
                    compactDisplay: 'short',
                  }}
                  suffix="%"
                >
                  {Math.abs(percentageChange)}
                </AnimateNumber>
              </MotionConfig>
            </div>
          </Cursor>
        )}
      </AnimatePresence>
    </div>
  )
}

function buildPath(path: string, point: { x: number; y: number }, i: number) {
  if (i === 0) return `M ${point.x},${point.y}`
  return `${path} L ${point.x},${point.y}`
}
