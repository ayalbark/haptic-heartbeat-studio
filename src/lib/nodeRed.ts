/**
 * Node-RED API integration for Haptic Heartbeat Studio.
 * Sends preset config to Node-RED so it can fetch stock data and control the wearable via MQTT.
 */

import type { PresetConfig, RuleConfig } from "@/types/preset";

const NODERED_URL = import.meta.env.VITE_NODERED_URL || "http://localhost:1880";

/**
 * Activate the current preset config in Node-RED.
 * Node-RED will use the ticker(s) and rule logic to fetch stock data and publish to MQTT.
 */
export async function activatePreset(config: PresetConfig): Promise<void> {
  const res = await fetch(`${NODERED_URL}/haptic/activate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(config),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Node-RED responded with ${res.status}`);
  }
}

/** Slider 1–10 → 40–100% (40% is perceptible baseline, below that motor often doesn't buzz) */
function intensityToPercent(slider: number): number {
  return Math.round(40 + ((slider - 1) / 9) * 60);
}

/**
 * Send a test haptic pattern to the wearable.
 * Uses the rule's intensity (1-10) mapped to 40-100%.
 */
export async function testPattern(rule: RuleConfig): Promise<void> {
  const intensity = intensityToPercent(rule.intensity);

  const res = await fetch(`${NODERED_URL}/haptic/test`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      intensity: Math.min(100, Math.max(40, intensity)),
      direction: "up",
      price: 0,
      change: 0,
      pattern: rule.pattern,
      rhythm: rule.rhythm,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Node-RED responded with ${res.status}`);
  }
}
