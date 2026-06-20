import React from "react";
import { Shield, Settings, Zap, Compass, Users } from "lucide-react";

interface PlayerPosition {
  id: string;
  name: string;
  role: "GK" | "DEF" | "MID" | "ATT";
  x: number; // percentage from left
  y: number; // percentage from top
}

interface TacticalPitchProps {
  formation: string;
  teamName: string;
  colorTheme: "blue" | "red" | "orange" | "purple" | "emerald";
  onPositionClick?: (role: "GK" | "DEF" | "MID" | "ATT") => void;
  activeRole?: string;
  ratings?: {
    defense: number;
    midfield: number;
    attack: number;
    goalkeeper: number;
  };
}

// Map formations to typical player positions
export const getPlayerPositions = (formation: string): PlayerPosition[] => {
  const norm = formation.trim().replace(/\s+/g, "");
  
  // Default fallback is 4-3-3 if not mapped
  const positions: PlayerPosition[] = [{ id: "gk", name: "KL", role: "GK", x: 50, y: 88 }];

  if (norm === "4-3-3") {
    positions.push(
      // Defense
      { id: "lb", name: "SLB", role: "DEF", x: 15, y: 70 },
      { id: "lcb", name: "ST-S", role: "DEF", x: 38, y: 72 },
      { id: "rcb", name: "ST-D", role: "DEF", x: 62, y: 72 },
      { id: "rb", name: "SĞB", role: "DEF", x: 85, y: 70 },
      // Midfield
      { id: "dm", name: "DOS", role: "MID", x: 50, y: 50 },
      { id: "lcm", name: "M-SL", role: "MID", x: 30, y: 38 },
      { id: "rcm", name: "M-SĞ", role: "MID", x: 70, y: 38 },
      // Attack
      { id: "lw", name: "SLA", role: "ATT", x: 20, y: 15 },
      { id: "st", name: "FOR", role: "ATT", x: 50, y: 12 },
      { id: "rw", name: "SĞA", role: "ATT", x: 80, y: 15 }
    );
  } else if (norm === "4-2-3-1") {
    positions.push(
      // Defense
      { id: "lb", name: "SLB", role: "DEF", x: 15, y: 70 },
      { id: "lcb", name: "ST-S", role: "DEF", x: 38, y: 72 },
      { id: "rcb", name: "ST-D", role: "DEF", x: 62, y: 72 },
      { id: "rb", name: "SĞB", role: "DEF", x: 85, y: 70 },
      // Midfield Defensive
      { id: "ldm", name: "ÖN-S", role: "MID", x: 35, y: 52 },
      { id: "rdm", name: "ÖN-D", role: "MID", x: 65, y: 52 },
      // Midfield Offensive
      { id: "lam", name: "O-SL", role: "MID", x: 20, y: 34 },
      { id: "cam", name: "OOS", role: "MID", x: 50, y: 32 },
      { id: "ram", name: "O-SĞ", role: "MID", x: 80, y: 34 },
      // Attack
      { id: "st", name: "FOR", role: "ATT", x: 50, y: 12 }
    );
  } else if (norm === "3-5-2") {
    positions.push(
      // Defense
      { id: "lcb", name: "ST-S", role: "DEF", x: 28, y: 72 },
      { id: "cb", name: "ST-O", role: "DEF", x: 50, y: 74 },
      { id: "rcb", name: "ST-D", role: "DEF", x: 72, y: 72 },
      // Midfield
      { id: "lwb", name: "SLK", role: "MID", x: 12, y: 46 },
      { id: "ldm", name: "ÖN-S", role: "MID", x: 35, y: 52 },
      { id: "rdm", name: "ÖN-D", role: "MID", x: 65, y: 52 },
      { id: "rwb", name: "SĞK", role: "MID", x: 88, y: 46 },
      { id: "am", name: "OOS", role: "MID", x: 50, y: 32 },
      // Attack
      { id: "ls", name: "FO-S", role: "ATT", x: 38, y: 14 },
      { id: "rs", name: "FO-D", role: "ATT", x: 62, y: 14 }
    );
  } else if (norm === "4-4-2") {
    positions.push(
      // Defense
      { id: "lb", name: "SLB", role: "DEF", x: 15, y: 70 },
      { id: "lcb", name: "ST-S", role: "DEF", x: 38, y: 72 },
      { id: "rcb", name: "ST-D", role: "DEF", x: 62, y: 72 },
      { id: "rb", name: "SĞB", role: "DEF", x: 85, y: 70 },
      // Midfield
      { id: "lm", name: "SLO", role: "MID", x: 15, y: 42 },
      { id: "lcm", name: "M-SL", role: "MID", x: 38, y: 44 },
      { id: "rcm", name: "M-SĞ", role: "MID", x: 62, y: 44 },
      { id: "rm", name: "SĞO", role: "MID", x: 85, y: 42 },
      // Attack
      { id: "ls", name: "FO-S", role: "ATT", x: 38, y: 14 },
      { id: "rs", name: "FO-D", role: "ATT", x: 62, y: 14 }
    );
  } else if (norm === "3-4-3") {
    positions.push(
      // Defense
      { id: "lcb", name: "ST-S", role: "DEF", x: 28, y: 72 },
      { id: "cb", name: "ST-O", role: "DEF", x: 50, y: 74 },
      { id: "rcb", name: "ST-D", role: "DEF", x: 72, y: 72 },
      // Midfield
      { id: "lm", name: "SLO", role: "MID", x: 15, y: 46 },
      { id: "lcm", name: "M-SL", role: "MID", x: 38, y: 48 },
      { id: "rcm", name: "M-SĞ", role: "MID", x: 62, y: 48 },
      { id: "rm", name: "SĞO", role: "MID", x: 85, y: 46 },
      // Attack
      { id: "lw", name: "SLA", role: "ATT", x: 20, y: 15 },
      { id: "st", name: "FOR", role: "ATT", x: 50, y: 12 },
      { id: "rw", name: "SĞA", role: "ATT", x: 80, y: 15 }
    );
  } else {
    // Custom fallback simple parser (4-3-3 fallback but translated codes)
    positions.push(
      { id: "lb", name: "SLB", role: "DEF", x: 15, y: 70 },
      { id: "lcb", name: "ST-S", role: "DEF", x: 38, y: 72 },
      { id: "rcb", name: "ST-D", role: "DEF", x: 62, y: 72 },
      { id: "rb", name: "SĞB", role: "DEF", x: 85, y: 70 },
      { id: "dm", name: "DOS", role: "MID", x: 50, y: 50 },
      { id: "lcm", name: "M-SL", role: "MID", x: 30, y: 38 },
      { id: "rcm", name: "M-SĞ", role: "MID", x: 70, y: 38 },
      { id: "lw", name: "SLA", role: "ATT", x: 20, y: 15 },
      { id: "st", name: "FOR", role: "ATT", x: 50, y: 12 },
      { id: "rw", name: "SĞA", role: "ATT", x: 80, y: 15 }
    );
  }

  return positions;
};

export const TacticalPitch: React.FC<TacticalPitchProps> = ({
  formation,
  teamName,
  colorTheme,
  onPositionClick,
  activeRole,
  ratings,
}) => {
  const players = getPlayerPositions(formation);

  const themeColors = {
    blue: {
      playerBg: "bg-white text-[#1A1A1A] border-[#1A1A1A]",
      glowColor: "ring-blue-600/30",
    },
    red: {
      playerBg: "bg-black text-white border-black",
      glowColor: "ring-red-600/30",
    },
    orange: {
      playerBg: "bg-amber-600 text-white border-black",
      glowColor: "ring-amber-500/30",
    },
    purple: {
      playerBg: "bg-purple-600 text-white border-black",
      glowColor: "ring-purple-500/30",
    },
    emerald: {
      playerBg: "bg-emerald-600 text-white border-black",
      glowColor: "ring-emerald-500/30",
    }
  }[colorTheme];

  // Areas to highlight
  const areas = [
    { label: "KL (Kaleci)", role: "GK" as const, top: "88%", height: "12%", color: "bg-amber-500/5 hover:bg-amber-500/15 border-dashed border-amber-900/20" },
    { label: "DEF (Savunma)", role: "DEF" as const, top: "65%", height: "23%", color: "bg-blue-500/5 hover:bg-blue-500/15 border-dashed border-blue-900/20" },
    { label: "MID (Orta Saha)", role: "MID" as const, top: "25%", height: "40%", color: "bg-emerald-500/5 hover:bg-emerald-500/15 border-dashed border-[#1A1A1A]/20" },
    { label: "ATT (Hücum)", role: "ATT" as const, top: "0%", height: "25%", color: "bg-rose-500/5 hover:bg-rose-500/15 border-dashed border-rose-900/20" }
  ];

  return (
    <div id="tactical-pitch-box" className="flex flex-col h-full bg-white border-2 border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] rounded-none">
      
      {/* Pitch Header info */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2 border-b border-[#D4CEBF] pb-3">
        <div>
          <h4 className="serif text-lg font-bold uppercase tracking-tight flex items-center gap-1.5">
            {teamName} ({formation})
          </h4>
          <p className="text-xs text-slate-500 font-serif italic">Sektör veya oyuncular özel analiz hedefleridir.</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {areas.map((a) => {
            const roleKey = a.role.toLowerCase() as "defense" | "midfield" | "attack" | "goalkeeper";
            const ratingValue = ratings ? ratings[roleKey] : null;

            return (
              <button
                key={a.role}
                id={`role-pill-${a.role}`}
                onClick={() => onPositionClick?.(a.role)}
                className={`px-2.5 py-1 text-[10px] font-mono border rounded-none tracking-wider transition-all uppercase font-bold ${
                  activeRole === a.role
                    ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                    : "bg-transparent text-slate-700 border-[#D4CEBF] hover:border-[#1A1A1A]"
                }`}
              >
                <span>{a.role}</span>
                {ratingValue && (
                  <span className="ml-1 px-1 bg-[#D4CEBF] text-[#1A1A1A] text-[9px] font-semibold rounded-none">
                    {ratingValue}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Pitch Graphics (Muted design fitting the Editorial vibe) */}
      <div className="relative flex-1 bg-[#E1DCCF] border-2 border-[#1A1A1A] rounded-none overflow-hidden aspect-[4/3] w-full max-h-[460px] select-none shadow-sm pb-1">
        
        {/* Grass Stripes / Grid Pattern */}
        <div className="absolute inset-0 flex flex-col pointer-events-none opacity-10">
          {Array.from({ length: 8 }).map((_, idx) => (
            <div
              key={idx}
              className={`flex-1 ${idx % 2 === 0 ? "bg-[#1A1A1A]" : "bg-transparent"}`}
            />
          ))}
        </div>

        {/* Outer Court Line */}
        <div className="absolute inset-2.5 border-[1.5px] border-[#1A1A1A]/35 pointer-events-none" />

        {/* Center Line */}
        <div className="absolute left-[10px] right-[10px] top-1/2 -translate-y-1/2 h-[1.5px] bg-[#1A1A1A]/35 pointer-events-none" />

        {/* Center Circle */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[22%] aspect-square border-[1.5px] border-[#1A1A1A]/35 rounded-full pointer-events-none" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-[#1A1A1A]/50 rounded-full pointer-events-none" />

        {/* Penalty Box Top */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[46%] h-[16%] border-b-[1.5px] border-x-[1.5px] border-[#1A1A1A]/35 pointer-events-none">
          {/* Six Yard Box */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 border-b-[1.5px] border-x-[1.5px] border-[#1A1A1A]/35" />
          {/* Penalty Spot */}
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1A1A1A]/55 rounded-full" />
        </div>

        {/* Penalty Box Bottom */}
        <div className="absolute bottom-[10px] left-1/2 -translate-x-1/2 w-[46%] h-[16%] border-t-[1.5px] border-x-[1.5px] border-[#1A1A1A]/35 pointer-events-none">
          {/* Six Yard Box */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 h-1/3 border-t-[1.5px] border-x-[1.5px] border-[#1A1A1A]/35" />
          {/* Penalty Spot */}
          <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#1A1A1A]/55 rounded-full" />
        </div>

        {/* Interactive Highlight overlays for sectors */}
        {areas.map((area) => (
          <button
            key={area.role}
            id={`map-overlay-${area.role}`}
            type="button"
            onClick={() => onPositionClick?.(area.role)}
            className={`absolute left-[10px] right-[10px] border border-transparent transition-all z-10 flex items-center justify-center group cursor-pointer ${area.color} ${
              activeRole === area.role ? "bg-[#1A1A1A]/10 border-[#1A1A1A]/40" : ""
            }`}
            style={{ top: area.top, height: area.height }}
          >
            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-[#1A1A1A] text-[#F4F1EA] text-[10px] px-2 py-1 rounded-none font-mono tracking-wider">
              {area.label} Analizi
            </span>
          </button>
        ))}

        {/* Dynamic Player Dots */}
        {players.map((p) => {
          const isSelected = activeRole === p.role;
          return (
            <button
              key={p.id}
              id={`tactical-dot-${p.id}`}
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onPositionClick?.(p.role);
              }}
              className={`absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center group cursor-pointer`}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {/* Player Dot styling with retro look */}
              <div
                className={`w-7 h-7 rounded-none flex items-center justify-center font-mono text-[10px] font-black transition-all border-2 shadow-sm ${
                  isSelected
                    ? "bg-[#1A1A1A] text-[#F4F1EA] border-[#1A1A1A] scale-125 ring-2 ring-[#1A1A1A]/40 font-bold"
                    : `${themeColors.playerBg} hover:scale-110`
                }`}
              >
                {p.name}
              </div>
              
              {/* Brief Label under player */}
              <span className={`mt-0.5 px-1 rounded-none text-[8px] tracking-tight font-mono whitespace-nowrap border-r border-b ${
                isSelected
                  ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                  : "bg-white text-slate-800 border-slate-300"
              }`}>
                {p.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
