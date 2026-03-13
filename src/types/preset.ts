export type ConditionType = 'threshold' | 'rate_of_change' | 'continuous';
export type ThresholdDirection = 'above' | 'below';
export type RateDirection = 'rising' | 'falling';
export type RateSpeed = 'fast' | 'moderate' | 'slow';
export type MappingTarget = 'intensity' | 'direction' | 'rhythm' | 'pattern_shift';

export type HapticPattern = 'rising' | 'falling' | 'pulse_all';

export type Duration = 'quick_pulse' | 'short' | 'medium' | 'long' | 'sustained';

export type Rhythm = 'steady' | 'pulsing' | 'heartbeat' | 'accelerating' | 'decelerating';

export interface RuleConfig {
  data_source: string;
  condition_type: ConditionType;
  // Threshold
  threshold_direction?: ThresholdDirection;
  threshold_value?: number;
  // Rate of Change
  rate_direction?: RateDirection;
  rate_speed?: RateSpeed;
  // Continuous Mapping
  mapping_target?: MappingTarget;
  price_range_min?: number;
  price_range_max?: number;
  // Haptic response
  pattern: HapticPattern;
  intensity: number;
  duration?: Duration;
  rhythm: Rhythm;
}

export interface PresetConfig {
  rule_front: RuleConfig | null;
  rule_back: RuleConfig | null;
}

export const EMPTY_RULE: RuleConfig = {
  data_source: '',
  condition_type: 'threshold',
  threshold_direction: 'above',
  threshold_value: 0,
  pattern: 'pulse_all',
  intensity: 5,
  duration: 'medium',
  rhythm: 'steady',
};

export const PATTERN_LABELS: Record<HapticPattern, string> = {
  rising: 'Rising — wave when stock goes up',
  falling: 'Falling — wave when stock goes down',
  pulse_all: 'All together — simple buzz',
};

export const DURATION_LABELS: Record<Duration, string> = {
  quick_pulse: 'Quick pulse (0.3s)',
  short: 'Short (1s)',
  medium: 'Medium (3s)',
  long: 'Long (5s)',
  sustained: 'Sustained',
};

export const RHYTHM_LABELS: Record<Rhythm, string> = {
  steady: 'Steady',
  pulsing: 'Pulsing',
  heartbeat: 'Heartbeat',
  accelerating: 'Accelerating beeps',
  decelerating: 'Decelerating beeps',
};
