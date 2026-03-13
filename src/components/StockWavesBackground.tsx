/**
 * Subtle animated stock-chart-like waves in the background.
 * Soft, translucent, overlapping waves suggesting market movement.
 */
export function StockWavesBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden>
      <svg
        viewBox="0 0 1200 800"
        className="absolute -inset-[20%] h-[140%] w-[140%] opacity-[0.07]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="wave-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00D9FF" />
            <stop offset="100%" stopColor="#00D9FF" stopOpacity="0.2" />
          </linearGradient>
        </defs>
        <path
          d="M0 400 Q 150 350 300 400 T 600 380 T 900 400 T 1200 420 V 900 H 0 Z"
          fill="url(#wave-grad)"
          className="animate-wave-slow"
        />
        <path
          d="M0 500 Q 200 450 400 500 T 700 480 T 1000 500 T 1200 520 V 900 H 0 Z"
          fill="url(#wave-grad)"
          className="animate-wave-medium"
        />
        <path
          d="M0 600 Q 100 550 250 600 T 500 580 T 750 600 T 1000 620 T 1200 600 V 900 H 0 Z"
          fill="url(#wave-grad)"
          className="animate-wave-slow"
        />
        <path
          d="M0 300 Q 180 250 360 300 T 720 280 T 1200 300 V 900 H 0 Z"
          fill="url(#wave-grad)"
          className="animate-wave-fast"
        />
      </svg>
    </div>
  );
}
