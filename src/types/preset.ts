export type ConditionType = 'threshold' | 'rate_of_change' | 'continuous';
export type ThresholdDirection = 'above' | 'below';
export type RateDirection = 'rising' | 'falling';
export type RateSpeed = 'fast' | 'moderate' | 'slow';
export type MappingTarget = 'intensity' | 'direction' | 'rhythm' | 'pattern_shift';

export type HapticPattern =
  | 'wave_left_right'
  | 'wave_right_left'
  | 'inside_out'
  | 'outside_in'
  | 'front_to_back'
  | 'back_to_front'
  | 'pulse_all';

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
  pattern: 'wave_left_right',
  intensity: 5,
  duration: 'medium',
  rhythm: 'steady',
};

export const PATTERN_LABELS: Record<HapticPattern, string> = {
  wave_left_right: 'Wave left-to-right',
  wave_right_left: 'Wave right-to-left',
  inside_out: 'Inside-out',
  outside_in: 'Outside-in',
  front_to_back: 'Front-to-back',
  back_to_front: 'Back-to-front',
  pulse_all: 'Pulse all together',
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
