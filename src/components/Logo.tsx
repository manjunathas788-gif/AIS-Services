import React from 'react';

interface LogoProps {
  className?: string;
  light?: boolean;
}

export function Logo({ className = "h-10", light = false }: LogoProps) {
  const primaryColor = light ? "#ffffff" : "#dc2626";
  const secondaryColor = light ? "rgba(255,255,255,0.8)" : "#991b1b";

  return (
    <div className={className}>
      <svg viewBox="0 0 240 100" className="h-full w-auto" xmlns="http://www.w3.org/2000/svg">
        <text 
          x="10" 
          y="65" 
          fill={primaryColor} 
          style={{ 
            fontFamily: 'system-ui, -apple-system, sans-serif', 
            fontWeight: 900, 
            fontStyle: 'italic',
            fontSize: '72px'
          }}
        >
          AIS
        </text>
        
        {/* Swoosh */}
        <path 
          d="M5 75 Q 100 85 220 35" 
          stroke={primaryColor} 
          strokeWidth="6" 
          fill="none" 
          strokeLinecap="round" 
        />
        
        {/* Pixels */}
        <rect x="210" y="30" width="8" height="8" fill={primaryColor} />
        <rect x="225" y="15" width="12" height="12" fill={primaryColor} />
        <rect x="200" y="10" width="5" height="5" fill={primaryColor} />
        
        {/* SOLUTIONS */}
        <text 
          x="15" 
          y="90" 
          fill={secondaryColor} 
          style={{ 
            fontSize: '22px', 
            fontWeight: 700, 
            letterSpacing: '0.4em', 
            fontFamily: 'system-ui, sans-serif' 
          }}
        >
          SOLUTIONS
        </text>
      </svg>
    </div>
  );
}
