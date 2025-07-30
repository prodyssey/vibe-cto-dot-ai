import { cn } from "@/lib/utils";

interface SpaceStationLobbyProps {
  className?: string;
}

export const SpaceStationLobby = ({ className }: SpaceStationLobbyProps) => {
  return (
    <svg
      viewBox="0 0 800 600"
      className={cn("w-full h-full", className)}
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        {/* Pixel grid effect */}
        <pattern
          id="pixelGrid"
          x="0"
          y="0"
          width="4"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <rect width="3" height="3" fill="rgba(0, 255, 255, 0.05)" />
        </pattern>

        {/* Scanline effect */}
        <pattern
          id="scanlines"
          x="0"
          y="0"
          width="100"
          height="4"
          patternUnits="userSpaceOnUse"
        >
          <line
            x1="0"
            y1="0"
            x2="100"
            y2="0"
            stroke="rgba(0, 255, 255, 0.1)"
            strokeWidth="1"
          />
        </pattern>

        {/* Neon glow filter */}
        <filter id="neonGlow">
          <feGaussianBlur stdDeviation="3" />
          <feMerge>
            <feMergeNode />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Terminal screen gradient */}
        <linearGradient id="terminalGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#001a1a" />
          <stop offset="100%" stopColor="#003333" />
        </linearGradient>
      </defs>

      {/* Background */}
      <rect width="800" height="600" fill="#0a0a0f" />
      <rect width="800" height="600" fill="url(#pixelGrid)" />

      {/* Floor grid */}
      <g opacity="0.3">
        {[...Array(20)].map((_, i) => (
          <line
            key={`h-${i}`}
            x1="0"
            y1={400 + i * 10}
            x2="800"
            y2={400 + i * 10}
            stroke="#00ffff"
            strokeWidth="1"
            transform={`perspective(600) rotateX(60deg)`}
          />
        ))}
        {[...Array(40)].map((_, i) => (
          <line
            key={`v-${i}`}
            x1={i * 20}
            y1="400"
            x2={i * 20}
            y2="600"
            stroke="#00ffff"
            strokeWidth="1"
          />
        ))}
      </g>

      {/* Back wall */}
      <rect x="0" y="0" width="800" height="400" fill="#1a1a2e" opacity="0.8" />

      {/* Large display screens */}
      <g>
        {/* Left screen */}
        <rect
          x="50"
          y="50"
          width="200"
          height="150"
          fill="url(#terminalGradient)"
          stroke="#00ffff"
          strokeWidth="2"
        />
        <rect
          x="50"
          y="50"
          width="200"
          height="150"
          fill="url(#scanlines)"
          opacity="0.5"
        />

        {/* Center screen */}
        <rect
          x="300"
          y="30"
          width="200"
          height="200"
          fill="url(#terminalGradient)"
          stroke="#ff00ff"
          strokeWidth="2"
        />
        <rect
          x="300"
          y="30"
          width="200"
          height="200"
          fill="url(#scanlines)"
          opacity="0.5"
        />

        {/* Right screen */}
        <rect
          x="550"
          y="50"
          width="200"
          height="150"
          fill="url(#terminalGradient)"
          stroke="#00ffff"
          strokeWidth="2"
        />
        <rect
          x="550"
          y="50"
          width="200"
          height="150"
          fill="url(#scanlines)"
          opacity="0.5"
        />
      </g>

      {/* Holographic projections */}
      <g opacity="0.7">
        {/* Left hologram */}
        <g transform="translate(150, 300)">
          <polygon
            points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
            fill="none"
            stroke="#00ff88"
            strokeWidth="2"
            filter="url(#neonGlow)"
          />
          <polygon
            points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10"
            fill="rgba(0, 255, 136, 0.2)"
          />
        </g>

        {/* Right hologram */}
        <g transform="translate(650, 300)">
          <polygon
            points="0,-30 26,-15 26,15 0,30 -26,15 -26,-15"
            fill="none"
            stroke="#ff0088"
            strokeWidth="2"
            filter="url(#neonGlow)"
          />
          <polygon
            points="0,-20 17,-10 17,10 0,20 -17,10 -17,-10"
            fill="rgba(255, 0, 136, 0.2)"
          />
        </g>
      </g>

      {/* VibeCTO neon sign */}
      <g transform="translate(400, 100)">
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontSize="32"
          fontFamily="monospace"
          fill="none"
          stroke="#ff00ff"
          strokeWidth="2"
          filter="url(#neonGlow)"
        >
          VIBECTO STATION
        </text>
        <text
          x="0"
          y="0"
          textAnchor="middle"
          fontSize="32"
          fontFamily="monospace"
          fill="#ff88ff"
        >
          VIBECTO STATION
        </text>
      </g>

      {/* Animated metrics display on screens */}
      <g fontSize="12" fontFamily="monospace" fill="#00ff00">
        {/* Left screen content */}
        <text x="60" y="80">
          STARTUPS LAUNCHED
        </text>
        <text x="60" y="100" fontSize="24">
          1,337
        </text>
        <text x="60" y="130">
          VELOCITY: +42%
        </text>

        {/* Center screen content */}
        <text x="310" y="60" fill="#ff00ff">
          SYSTEM STATUS
        </text>
        <text x="310" y="80" fill="#00ff00">
          PORTALS: ONLINE
        </text>
        <text x="310" y="100" fill="#00ff00">
          FORGE: ACTIVE
        </text>
        <text x="310" y="120" fill="#00ff00">
          MISSION: READY
        </text>
        <text x="310" y="140" fill="#00ff00">
          OBSERVATORY: OPEN
        </text>

        {/* Right screen content */}
        <text x="560" y="80">
          BUILDERS ACTIVE
        </text>
        <text x="560" y="100" fontSize="24">
          247
        </text>
        <text x="560" y="130">
          CAPACITY: 82%
        </text>
      </g>

      {/* Pixel art style pillars */}
      <g>
        {/* Left pillar */}
        <rect x="100" y="200" width="40" height="400" fill="#2a2a3e" />
        <rect x="100" y="200" width="40" height="400" fill="url(#pixelGrid)" />
        <line
          x1="100"
          y1="200"
          x2="100"
          y2="600"
          stroke="#00ffff"
          strokeWidth="2"
          opacity="0.5"
        />
        <line
          x1="140"
          y1="200"
          x2="140"
          y2="600"
          stroke="#00ffff"
          strokeWidth="2"
          opacity="0.5"
        />

        {/* Right pillar */}
        <rect x="660" y="200" width="40" height="400" fill="#2a2a3e" />
        <rect x="660" y="200" width="40" height="400" fill="url(#pixelGrid)" />
        <line
          x1="660"
          y1="200"
          x2="660"
          y2="600"
          stroke="#00ffff"
          strokeWidth="2"
          opacity="0.5"
        />
        <line
          x1="700"
          y1="200"
          x2="700"
          y2="600"
          stroke="#00ffff"
          strokeWidth="2"
          opacity="0.5"
        />
      </g>

      {/* Ambient particle effects */}
      <g opacity="0.6">
        {[...Array(20)].map((_, i) => (
          <circle
            key={i}
            cx={Math.random() * 800}
            cy={Math.random() * 300}
            r="1"
            fill="#00ffff"
            className="animate-pulse"
            style={{
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </g>

      {/* Scanline overlay */}
      <rect width="800" height="600" fill="url(#scanlines)" opacity="0.3" />
    </svg>
  );
};
