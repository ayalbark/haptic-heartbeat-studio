import { cn } from '@/lib/utils';
import type { RuleConfig } from '@/types/preset';

interface Props {
  rule: RuleConfig | null;
  direction?: 'up' | 'down' | null;
}

/** 9 motors in a 3x3 grid on the torso */
const MOTOR_POSITIONS = [
  { cx: 35, cy: 42 },
  { cx: 50, cy: 42 },
  { cx: 65, cy: 42 },
  { cx: 35, cy: 55 },
  { cx: 50, cy: 55 },
  { cx: 65, cy: 55 },
  { cx: 35, cy: 68 },
  { cx: 50, cy: 68 },
  { cx: 65, cy: 68 },
];

export function BodyVisualization({ rule, direction }: Props) {
  const hasData = rule && rule.data_source.trim() !== '';
  const showGlow = hasData && direction;

  return (
    <div className="flex flex-col items-center gap-3">
      <svg
        viewBox="0 0 100 110"
        className="w-[22rem] h-[28rem]"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Simple outline: rounded head, oval torso, stick arms & legs */}
        <ellipse cx="50" cy="12" rx="9" ry="10" className="stroke-white/40" />
        <ellipse cx="50" cy="55" rx="20" ry="25" className="stroke-white/40" />
        <path d="M 30 42 Q 15 48 12 58" className="stroke-white/40" />
        <path d="M 70 42 Q 85 48 88 58" className="stroke-white/40" />
        <path d="M 38 78 Q 32 95 30 108" className="stroke-white/40" />
        <path d="M 62 78 Q 68 95 70 108" className="stroke-white/40" />

        {/* 9 motor dots - purple with subtle glow when active */}
        {MOTOR_POSITIONS.map((pos, i) => (
          <circle
            key={i}
            cx={pos.cx}
            cy={pos.cy}
            r="5"
            className={cn(
              'transition-all duration-300 drop-shadow-sm',
              showGlow && direction === 'up' && 'fill-emerald-400 stroke-emerald-300/50 animate-motor-pulse',
              showGlow && direction === 'down' && 'fill-red-400 stroke-red-300/50 animate-motor-pulse',
              hasData && !showGlow && 'fill-violet-500 stroke-violet-400/60',
              !hasData && 'fill-white/25 stroke-white/40'
            )}
            strokeWidth="2"
          />
        ))}
      </svg>
      <span className="text-xs font-medium uppercase tracking-wider text-white/50">
        9 motors
      </span>
    </div>
  );
}
