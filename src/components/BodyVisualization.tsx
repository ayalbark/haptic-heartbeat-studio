import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import type { RuleConfig } from '@/types/preset';

interface Props {
  frontRule: RuleConfig | null;
  backRule: RuleConfig | null;
  activeSection: 'front' | 'back' | null;
}

export function BodyVisualization({ frontRule, backRule, activeSection }: Props) {
  const [view, setView] = useState<'front' | 'back'>('front');

  const rule = view === 'front' ? frontRule : backRule;
  const isHighlighted = activeSection === view;
  const hasData = rule && rule.data_source.trim() !== '';

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-1">
        <Button
          size="sm"
          variant={view === 'front' ? 'default' : 'outline'}
          onClick={() => setView('front')}
          className="text-xs"
        >
          Front View
        </Button>
        <Button
          size="sm"
          variant={view === 'back' ? 'default' : 'outline'}
          onClick={() => setView('back')}
          className="text-xs"
        >
          Back View
        </Button>
      </div>

      <div className="relative w-40 h-64">
        {/* Silhouette */}
        <svg viewBox="0 0 100 160" className="w-full h-full">
          {/* Head */}
          <circle cx="50" cy="18" r="12" className="fill-muted stroke-border" strokeWidth="1.5" />
          {/* Body */}
          <ellipse cx="50" cy="65" rx="25" ry="35" className="fill-muted stroke-border" strokeWidth="1.5" />
          {/* Left arm */}
          <line x1="25" y1="45" x2="10" y2="85" className="stroke-border" strokeWidth="4" strokeLinecap="round" />
          {/* Right arm */}
          <line x1="75" y1="45" x2="90" y2="85" className="stroke-border" strokeWidth="4" strokeLinecap="round" />
          {/* Left leg */}
          <line x1="38" y1="95" x2="32" y2="145" className="stroke-border" strokeWidth="5" strokeLinecap="round" />
          {/* Right leg */}
          <line x1="62" y1="95" x2="68" y2="145" className="stroke-border" strokeWidth="5" strokeLinecap="round" />

          {/* Motor positions */}
          {[
            { cx: 35, cy: 55 }, // Left
            { cx: 50, cy: 50 }, // Center
            { cx: 65, cy: 55 }, // Right
          ].map((pos, i) => (
            <circle
              key={i}
              cx={pos.cx}
              cy={pos.cy}
              r="6"
              className={cn(
                'transition-all duration-300',
                isHighlighted && hasData
                  ? 'fill-primary stroke-primary/50 animate-pulse'
                  : hasData
                    ? 'fill-primary/40 stroke-primary/30'
                    : 'fill-muted-foreground/20 stroke-muted-foreground/30'
              )}
              strokeWidth="2"
            />
          ))}
        </svg>

        {/* Label */}
        <div className="absolute bottom-0 inset-x-0 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">
          {view} view
        </div>
      </div>
    </div>
  );
}
