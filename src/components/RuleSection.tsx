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
import { toast } from 'sonner';
import type {
  RuleConfig,
  ConditionType,
  HapticPattern,
  Duration,
  Rhythm,
  PATTERN_LABELS,
  DURATION_LABELS,
  RHYTHM_LABELS,
} from '@/types/preset';
import {
  PATTERN_LABELS as patternLabels,
  DURATION_LABELS as durationLabels,
  RHYTHM_LABELS as rhythmLabels,
  EMPTY_RULE,
} from '@/types/preset';

interface Props {
  title: string;
  rule: RuleConfig;
  onChange: (rule: RuleConfig) => void;
  onFocus: () => void;
}

export function RuleSection({ title, rule, onChange, onFocus }: Props) {
  const update = <K extends keyof RuleConfig>(key: K, value: RuleConfig[K]) => {
    onChange({ ...rule, [key]: value });
  };

  return (
    <Card className="border-primary/20" onFocus={onFocus} onClick={onFocus}>
      <CardHeader className="pb-4">
        <CardTitle className="text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Data Source */}
        <div className="space-y-2">
          <Label>Stock Ticker</Label>
          <Input
            placeholder="e.g. AAPL"
            value={rule.data_source}
            onChange={(e) => update('data_source', e.target.value.toUpperCase())}
            className="uppercase"
          />
        </div>

        {/* Condition Type */}
        <div className="space-y-2">
          <Label>Condition Type</Label>
          <Select
            value={rule.condition_type}
            onValueChange={(v) => update('condition_type', v as ConditionType)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="threshold">Threshold</SelectItem>
              <SelectItem value="rate_of_change">Rate of Change</SelectItem>
              <SelectItem value="continuous">Continuous Mapping</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conditional fields */}
        {rule.condition_type === 'threshold' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select
                value={rule.threshold_direction || 'above'}
                onValueChange={(v) => update('threshold_direction', v as any)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="above">Above</SelectItem>
                  <SelectItem value="below">Below</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Threshold Value</Label>
              <Input
                type="number"
                value={rule.threshold_value ?? ''}
                onChange={(e) => update('threshold_value', parseFloat(e.target.value) || 0)}
              />
            </div>
          </div>
        )}

        {rule.condition_type === 'rate_of_change' && (
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label>Direction</Label>
              <Select
                value={rule.rate_direction || 'rising'}
                onValueChange={(v) => update('rate_direction', v as any)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="rising">Rising</SelectItem>
                  <SelectItem value="falling">Falling</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Speed</Label>
              <Select
                value={rule.rate_speed || 'fast'}
                onValueChange={(v) => update('rate_speed', v as any)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="fast">Fast</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="slow">Slow</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {rule.condition_type === 'continuous' && (
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Map to</Label>
              <Select
                value={rule.mapping_target || 'intensity'}
                onValueChange={(v) => update('mapping_target', v as any)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="intensity">Intensity</SelectItem>
                  <SelectItem value="direction">Direction</SelectItem>
                  <SelectItem value="rhythm">Rhythm</SelectItem>
                  <SelectItem value="pattern_shift">Pattern Shift</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Min Price (optional)</Label>
                <Input
                  type="number"
                  value={rule.price_range_min ?? ''}
                  onChange={(e) => update('price_range_min', parseFloat(e.target.value) || undefined)}
                />
              </div>
              <div className="space-y-2">
                <Label>Max Price (optional)</Label>
                <Input
                  type="number"
                  value={rule.price_range_max ?? ''}
                  onChange={(e) => update('price_range_max', parseFloat(e.target.value) || undefined)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Haptic Response */}
        <div className="space-y-2">
          <Label>Pattern</Label>
          <Select
            value={rule.pattern}
            onValueChange={(v) => update('pattern', v as HapticPattern)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(patternLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
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

        {rule.condition_type !== 'continuous' && (
          <div className="space-y-2">
            <Label>Duration</Label>
            <Select
              value={rule.duration || 'medium'}
              onValueChange={(v) => update('duration', v as Duration)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {Object.entries(durationLabels).map(([k, v]) => (
                  <SelectItem key={k} value={k}>{v}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label>Rhythm</Label>
          <Select
            value={rule.rhythm}
            onValueChange={(v) => update('rhythm', v as Rhythm)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {Object.entries(rhythmLabels).map(([k, v]) => (
                <SelectItem key={k} value={k}>{v}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 pt-2">
          <Button variant="outline" size="sm" onClick={() => toast.info('Test pattern coming soon!')}>
            <Play className="mr-1 h-3 w-3" /> Test Pattern
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onChange({ ...EMPTY_RULE })}>
            <Trash2 className="mr-1 h-3 w-3" /> Clear Rule
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
