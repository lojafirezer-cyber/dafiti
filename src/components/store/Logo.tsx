export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 72"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <defs>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#C9A84C" />
          <stop offset="40%" stopColor="#F0D080" />
          <stop offset="70%" stopColor="#C9A84C" />
          <stop offset="100%" stopColor="#A07830" />
        </linearGradient>
        <linearGradient id="goldGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#F0D080" />
          <stop offset="100%" stopColor="#A07830" />
        </linearGradient>
      </defs>

      {/* Central dome - main */}
      <ellipse cx="80" cy="22" rx="10" ry="12" fill="url(#goldGrad)" />
      <rect x="70" y="22" width="20" height="14" fill="url(#goldGrad)" />

      {/* Central dome finial */}
      <line x1="80" y1="10" x2="80" y2="6" stroke="url(#goldGrad)" strokeWidth="1.5" />
      <circle cx="80" cy="5.5" r="1.5" fill="url(#goldGrad)" />

      {/* Left dome */}
      <ellipse cx="58" cy="27" rx="7" ry="9" fill="url(#goldGrad)" />
      <rect x="51" y="27" width="14" height="9" fill="url(#goldGrad)" />
      <line x1="58" y1="18" x2="58" y2="15" stroke="url(#goldGrad)" strokeWidth="1.2" />
      <circle cx="58" cy="14.5" r="1.2" fill="url(#goldGrad)" />

      {/* Right dome */}
      <ellipse cx="102" cy="27" rx="7" ry="9" fill="url(#goldGrad)" />
      <rect x="95" y="27" width="14" height="9" fill="url(#goldGrad)" />
      <line x1="102" y1="18" x2="102" y2="15" stroke="url(#goldGrad)" strokeWidth="1.2" />
      <circle cx="102" cy="14.5" r="1.2" fill="url(#goldGrad)" />

      {/* Left small tower */}
      <rect x="38" y="28" width="8" height="8" fill="url(#goldGrad)" />
      <path d="M38 28 Q42 23 46 28" fill="url(#goldGrad)" />
      <line x1="42" y1="23" x2="42" y2="20" stroke="url(#goldGrad)" strokeWidth="1" />
      <circle cx="42" cy="19.5" r="1" fill="url(#goldGrad)" />

      {/* Right small tower */}
      <rect x="114" y="28" width="8" height="8" fill="url(#goldGrad)" />
      <path d="M114 28 Q118 23 122 28" fill="url(#goldGrad)" />
      <line x1="118" y1="23" x2="118" y2="20" stroke="url(#goldGrad)" strokeWidth="1" />
      <circle cx="118" cy="19.5" r="1" fill="url(#goldGrad)" />

      {/* Main building body */}
      <rect x="36" y="36" width="88" height="14" fill="url(#goldGrad)" />

      {/* Arched windows/doors on main body */}
      {/* Central arch */}
      <rect x="74" y="38" width="12" height="12" rx="6" fill="#1a0e00" />
      {/* Left arch */}
      <rect x="56" y="39" width="9" height="10" rx="4.5" fill="#1a0e00" />
      {/* Right arch */}
      <rect x="95" y="39" width="9" height="10" rx="4.5" fill="#1a0e00" />
      {/* Far left arch */}
      <rect x="40" y="40" width="7" height="9" rx="3.5" fill="#1a0e00" />
      {/* Far right arch */}
      <rect x="113" y="40" width="7" height="9" rx="3.5" fill="#1a0e00" />

      {/* Base/foundation */}
      <rect x="32" y="50" width="96" height="3" fill="url(#goldGrad)" />

      {/* Decorative line above text */}
      <line x1="20" y1="56" x2="140" y2="56" stroke="url(#goldGrad)" strokeWidth="0.6" />

      {/* DIREITA text */}
      <text
        x="80"
        y="64"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="11"
        fontWeight="700"
        fill="url(#goldGrad)"
        letterSpacing="4"
      >
        DIREITA
      </text>

      {/* RAIZ text */}
      <text
        x="80"
        y="72"
        textAnchor="middle"
        fontFamily="Georgia, 'Times New Roman', serif"
        fontSize="8"
        fontWeight="400"
        fill="url(#goldGrad)"
        letterSpacing="6"
      >
        RAIZ
      </text>
    </svg>
  );
}
