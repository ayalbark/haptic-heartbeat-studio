import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Trash2, Play } from 'lucide-react';
import type { RuleConfig, HapticPattern } from '@/types/preset';
import { PATTERN_LABELS, EMPTY_RULE } from '@/types/preset';

interface Props {
  title: string;
  rule: RuleConfig;
  onChange: (rule: RuleConfig) => void;
  onFocus: () => void;
  onTestPattern?: () => void | Promise<void>;
  variant?: 'default' | 'design';
}

const SIMPLE_PATTERNS: HapticPattern[] = ['rising', 'falling', 'pulse_all'];

const designCard =
  'border-[#00D9FF]/20 bg-[#0d2137]/80 backdrop-blur-sm text-white [&_input]:bg-white/5 [&_input]:border-[#00D9FF]/30 [&_input]:text-white [&_input]:placeholder:text-white/40 [&_label]:text-white/90 [&_button]:border-[#00D9FF]/40 [&_button]:bg-white/5 [&_button]:text-[#00D9FF] [&_button:hover]:bg-[#00D9FF]/10 [&_.bg-secondary]:!bg-white/10 [&_.bg-primary]:!bg-[#00D9FF]';

export function RuleSection({ title, rule, onChange, onFocus, onTestPattern, variant = 'default' }: Props) {
  const update = <K extends keyof RuleConfig>(key: K, value: RuleConfig[K]) => {
    onChange({ ...rule, [key]: value });
  };

  const pattern = SIMPLE_PATTERNS.includes(rule.pattern) ? rule.pattern : 'pulse_all';

  return (
    <Card
      className={variant === 'design' ? designCard : 'border-primary/20'}
      onFocus={onFocus}
      onClick={onFocus}
    >
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <Label>Stock Ticker</Label>
          <Input
            placeholder="e.g. TSLA"
            value={rule.data_source}
            onChange={(e) => update('data_source', e.target.value.toUpperCase())}
            className="uppercase"
          />
        </div>

        <div className="space-y-2">
          <Label>Pattern — how you feel direction</Label>
          <Select
            value={pattern}
            onValueChange={(v) => update('pattern', v as HapticPattern)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {SIMPLE_PATTERNS.map((p) => (
                <SelectItem key={p} value={p}>{PATTERN_LABELS[p]}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Intensity: {rule.intensity}</Label>
          <Slider
            min={1}
            max={10}
            step={1}
            value={[rule.intensity]}
            onValueChange={([v]) => update('intensity', v)}
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onTestPattern?.()}
            disabled={!onTestPattern}
            className={variant === 'design' ? 'border-[#00D9FF]/50 text-[#00D9FF] hover:bg-[#00D9FF]/15' : undefined}
          >
            <Play className="mr-1 h-3 w-3" /> Test Pattern
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onChange({ ...EMPTY_RULE })}
            className={variant === 'design' ? 'text-white/70 hover:text-white hover:bg-white/10' : undefined}
          >
            <Trash2 className="mr-1 h-3 w-3" /> Clear Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
