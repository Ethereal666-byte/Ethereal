
import React from 'react';

interface PetStats {
  hunger: number;
  happiness: number;
  cleanliness: number;
  isSleeping: boolean;
}

const MiuMiuAvatar: React.FC<{ stats: PetStats }> = ({ stats }) => {
  const isHappy = stats.happiness > 80;
  const isHungry = stats.hunger < 30;
  const isSleeping = stats.isSleeping;

  return (
    <div className={`relative w-64 h-64 flex items-center justify-center transition-all duration-1000 ${isSleeping ? 'opacity-80 scale-95 rotate-[-5deg]' : 'animate-[float_4s_easeInOutSine_infinite]'}`}>
      <svg viewBox="0 0 200 200" className="w-full h-full drop-shadow-2xl">
        <path d="M160 140 Q180 140 185 110 Q190 80 165 85 Q145 90 150 120" fill="#8B735B" className={isSleeping ? "" : "animate-[tailWag_3s_ease-in-out_infinite]"} style={{ transformOrigin: '160px 140px' }} />
        <path d="M40 100 Q40 50 100 50 Q160 50 160 100 Q160 150 100 150 Q40 150 40 100" fill="white" stroke="#D1B094" strokeWidth="2" />
        <path d="M100 50 Q130 50 145 70 Q155 90 140 110 L100 110 Z" fill="#FFD580" opacity="0.9" />
        <path d="M40 100 Q40 60 70 55 L90 85 Q75 110 55 120 Z" fill="#8B735B" opacity="0.9" />
        <circle cx="145" cy="125" r="12" fill="#FFD580" opacity="0.8" />
        <path d="M60 55 L50 30 L80 50 Z" fill="#8B735B" />
        <path d="M140 55 L150 30 L120 50 Z" fill="#FFD580" />
        <g className="translate-y-2">
          {isSleeping ? (
            <>
              <path d="M85 95 Q92 98 100 95" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" />
              <path d="M110 95 Q118 98 125 95" fill="none" stroke="#444" strokeWidth="2" strokeLinecap="round" />
            </>
          ) : isHappy ? (
            <>
              <path d="M85 100 L95 92 L105 100" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M115 100 L125 92 L135 100" fill="none" stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
            </>
          ) : isHungry ? (
            <>
              <circle cx="95" cy="100" r="3" fill="#222" />
              <circle cx="125" cy="100" r="3" fill="#222" />
              <path d="M105 115 Q110 110 115 115" fill="none" stroke="#222" strokeWidth="1.5" />
            </>
          ) : (
            <>
              <circle cx="95" cy="100" r="4" fill="#222" className="animate-[blink_5s_infinite]" />
              <circle cx="125" cy="100" r="4" fill="#222" className="animate-[blink_5s_infinite]" />
            </>
          )}
          <circle cx="110" cy="106" r="1.5" fill="#FFB6C1" />
        </g>
      </svg>
    </div>
  );
};

export default MiuMiuAvatar;
