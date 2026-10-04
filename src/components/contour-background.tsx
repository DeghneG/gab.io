import React from "react";

interface ContourBackgroundProps {
  variant?: "a" | "b" | "c";
  className?: string;
  maskType?: "hero" | "center" | "bottom-fade";
}

export default function ContourBackground({
  variant = "a",
  className = "",
  maskType = "hero",
}: ContourBackgroundProps) {
  let transform = "";
  if (variant === "b") {
    // Flip horizontally
    transform = "scale(-1, 1) translate(-1440, 0)";
  } else if (variant === "c") {
    // Flip vertically
    transform = "scale(1, -1) translate(0, -900)";
  }

  // Define mask gradients based on the section's needs
  let maskImage = "";
  if (maskType === "hero") {
    // Fade out heavily on the left/center (where text is), and completely at the bottom for mountains
    maskImage =
      "radial-gradient(ellipse at 30% 40%, transparent 25%, black 60%, transparent 95%)";
  } else if (maskType === "center") {
    maskImage =
      "radial-gradient(ellipse at center, transparent 30%, black 70%, transparent 95%)";
  } else if (maskType === "bottom-fade") {
    maskImage = "linear-gradient(to bottom, black 0%, black 70%, transparent 100%)";
  }

  return (
    <div
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
      style={{
        maskImage,
        WebkitMaskImage: maskImage,
      }}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        focusable="false"
        className="w-full h-full opacity-10" // 10% opacity, adjust down if too distracting
      >
        <g
          transform={transform}
          stroke="var(--color-wine)" // #8C0027
          strokeWidth="1.5"
          fill="none"
          strokeLinejoin="round"
          strokeLinecap="round"
        >
          {/* Hill 1 (Top Left) */}
          <path d="M280,180 C290,170 310,170 320,180 C330,190 330,210 320,220 C310,230 290,230 280,220 C270,210 270,190 280,180 Z" />
          <path d="M250,150 C280,120 330,120 350,150 C380,190 380,240 350,270 C310,310 260,290 240,260 C210,220 220,180 250,150 Z" />
          <path d="M200,100 C260,60 380,70 420,130 C470,200 440,300 380,340 C300,390 180,360 150,280 C110,190 130,150 200,100 Z" />
          <path d="M120,40 C230,-30 450,10 520,100 C600,210 540,370 440,430 C310,500 120,450 70,320 C10,170 10,100 120,40 Z" />
          <path d="M30,-40 C190,-110 520,-40 620,80 C740,230 650,450 500,530 C320,630 20,550 -40,380 C-110,190 -100,40 30,-40 Z" />
          <path d="M-50,-120 C140,-200 600,-100 730,50 C880,250 780,550 580,650 C340,780 -80,680 -160,450 C-260,200 -240,-30 -50,-120 Z" />

          {/* Hill 2 (Bottom Right) */}
          <path d="M1080,680 C1090,670 1110,670 1120,680 C1130,690 1130,710 1120,720 C1110,730 1090,730 1080,720 C1070,710 1070,690 1080,680 Z" />
          <path d="M1040,640 C1080,600 1150,610 1170,650 C1200,700 1170,760 1130,780 C1070,810 1010,760 1000,710 C980,670 1000,670 1040,640 Z" />
          <path d="M970,580 C1050,510 1210,530 1260,610 C1320,700 1250,820 1150,860 C1020,910 910,810 890,720 C860,610 890,640 970,580 Z" />
          <path d="M880,500 C1010,400 1300,450 1370,570 C1460,710 1350,910 1190,960 C1000,1020 780,880 750,730 C710,560 760,590 880,500 Z" />

          {/* Hill 3 (Center Right) */}
          <path d="M880,280 C890,270 910,270 920,280 C930,290 930,310 920,320 C910,330 890,330 880,320 C870,310 870,290 880,280 Z" />
          <path d="M840,240 C880,190 950,210 970,250 C1000,310 950,370 910,380 C850,400 790,340 790,290 C780,250 800,280 840,240 Z" />
          <path d="M780,180 C850,100 1010,130 1050,210 C1100,310 1020,440 930,460 C810,490 700,390 690,300 C670,190 700,250 780,180 Z" />
          <path d="M700,100 C810,-10 1100,50 1160,160 C1240,310 1110,520 970,560 C790,610 590,460 560,310 C520,120 590,200 700,100 Z" />

          {/* Spanning connective lines */}
          <path d="M-100,600 C100,550 300,700 500,650 C700,600 800,400 1100,350 C1300,320 1400,150 1500,100" />
          <path d="M-100,700 C150,640 350,850 580,750 C810,650 900,450 1180,420 C1380,390 1450,250 1500,200" />
          <path d="M-100,800 C200,730 400,1000 660,850 C920,700 1000,500 1260,490 C1460,470 1500,350 1550,300" />
          <path d="M-100,900 C300,850 450,1100 750,950 C1050,800 1100,600 1350,580 C1500,560 1550,450 1600,400" />
        </g>
      </svg>
    </div>
  );
}
