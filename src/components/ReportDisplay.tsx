import React, { useState } from "react";
import { MatchAnalysisReport } from "../types";
import { Shield, Sparkles, TrendingUp, AlertTriangle, Lightbulb, User, RefreshCw, LayoutGrid, Radio, CheckSquare, XOctagon } from "lucide-react";

interface ReportDisplayProps {
  report: MatchAnalysisReport;
  homeTeam: string;
  awayTeam: string;
  selectedRole?: "GK" | "DEF" | "MID" | "ATT" | "all";
  onRoleSelect?: (role: "GK" | "DEF" | "MID" | "ATT" | "all") => void;
}

export const ReportDisplay: React.FC<ReportDisplayProps> = ({
  report,
  homeTeam,
  awayTeam,
  selectedRole = "all",
  onRoleSelect,
}) => {
  const [activeTab, setActiveTab] = useState<"bento" | "tactical" | "strengths_weaknesses">("bento");

  const home = report.homeTeamAnalysis || {};
  const away = report.awayTeamAnalysis || {};

  const getRoleLabel = (role: string) => {
    switch (role) {
      case "GK": return "Kaleci Performansı (Goalkeeper)";
      case "DEF": return "Savunma Hattı Taktik Analizi (Defense)";
      case "MID": return "Orta Saha Mücadele Gücü (Midfield)";
      case "ATT": return "Hücum & Bitiricilik Hattı (Attack)";
      default: return "Tüm Sektörlerin Dağılımı";
    }
  };

  const getRoleRating = (team: "home" | "away", role: "GK" | "DEF" | "MID" | "ATT") => {
    const analysis = team === "home" ? home : away;
    if (!analysis.positionalRatings) return 7.5;
    switch (role) {
      case "GK": return analysis.positionalRatings.goalkeeper || 7.5;
      case "DEF": return analysis.positionalRatings.defense || 7.5;
      case "MID": return analysis.positionalRatings.midfield || 7.5;
      case "ATT": return analysis.positionalRatings.attack || 7.5;
    }
  };

  const getRoleDetails = (team: "home" | "away", role: "GK" | "DEF" | "MID" | "ATT") => {
    const analysis = team === "home" ? home : away;
    if (!analysis.positionalDetails) return "Detay analiz yükleniyor...";
    switch (role) {
      case "GK": return analysis.positionalDetails.goalkeeper;
      case "DEF": return analysis.positionalDetails.defense;
      case "MID": return analysis.positionalDetails.midfield;
      case "ATT": return analysis.positionalDetails.attack;
    }
  };

  return (
    <div id="report-view-container" className="flex flex-col gap-6">
      
      {/* TABS (EDITORIAL STYLED TABS WITH retro selection box) */}
      <div className="flex border-b border-[#1A1A1A] pb-px gap-2 overflow-x-auto">
        <button
          id="btn-tab-bento"
          onClick={() => setActiveTab("bento")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "bento"
              ? "border-[#1A1A1A] text-[#1A1A1A] bg-white border-t border-x border-[#1A1A1A] translate-y-px"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <LayoutGrid size={13} />
            01. Bento Genel Raporu
          </span>
        </button>
        <button
          id="btn-tab-strengths"
          onClick={() => setActiveTab("strengths_weaknesses")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "strengths_weaknesses"
              ? "border-[#1A1A1A] text-[#1A1A1A] bg-white border-t border-x border-[#1A1A1A] translate-y-px"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <TrendingUp size={13} />
            02. Eksik & Güçlü Yönler
          </span>
        </button>
        <button
          id="btn-tab-tactical"
          onClick={() => setActiveTab("tactical")}
          className={`px-4 py-2.5 text-xs font-mono font-bold uppercase tracking-wider transition-all border-b-2 ${
            activeTab === "tactical"
              ? "border-[#1A1A1A] text-[#1A1A1A] bg-white border-t border-x border-[#1A1A1A] translate-y-px"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          <span className="flex items-center gap-1.5">
            <Radio size={13} />
            03. Taktik Çakışma & Öneriler
          </span>
        </button>
      </div>

      {/* DETAILED SUMMARY SHEET */}
      <div className="bg-[#FFFFFF] border border-[#1A1A1A] p-6 shadow-[4px_4px_0px_#1A1A1A]">
        <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2 mb-4">
          <div className="flex items-center gap-1.5">
            <Sparkles size={16} />
            <h3 className="editorial-label text-xs">Müsabaka Seyir Defteri</h3>
          </div>
          <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400 font-mono">Maç Özeti</span>
        </div>
        <p className="serif text-xl sm:text-2xl text-justify text-[#1A1A1A] leading-relaxed">
          {report.matchSummary}
        </p>
      </div>

      {/* FILTER CONTROLLERS */}
      <div className="bg-[#D4CEBF]/45 border border-[#1A1A1A] p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h4 className="editorial-label text-[10px] font-black">Pozisyonsal Büyüteç</h4>
          <p className="text-xs text-slate-700 font-serif italic">Bölgesel reyting ve detaylar için filtreleyin.</p>
        </div>
        <div className="flex flex-wrap gap-1">
          {(["all", "GK", "DEF", "MID", "ATT"] as const).map((role) => (
            <button
              key={role}
              id={`role-btn-${role}`}
              onClick={() => onRoleSelect?.(role)}
              className={`px-2.5 py-1 text-2xs font-mono transition-all border ${
                selectedRole === role
                  ? "bg-[#1A1A1A] text-[#F4F1EA] border-[#1A1A1A] font-bold"
                  : "bg-white text-[#1A1A1A] border-[#D4CEBF] hover:border-[#1A1A1A]"
              }`}
            >
              {role === "all" ? "TÜMÜ" : role}
            </button>
          ))}
        </div>
      </div>

      {/* ACTIVE VIEW CONTENT */}
      {activeTab === "bento" && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          
          {/* BENTO BLOCK 1: INDEPTH POSITIONAL RATINGS SHEET */}
          <div className="col-span-12 bg-white border border-[#1A1A1A] p-6 shadow-[4px_4px_0px_#1A1A1A] flex flex-col gap-4">
            <div className="border-b border-[#1A1A1A] pb-2 flex justify-between items-center mb-2">
              <h4 className="serif text-xl sm:text-2xl font-bold uppercase">{getRoleLabel(selectedRole)}</h4>
              <span className="editorial-label text-[10px]">Taktik Yerleşim Değerlendirmesi</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Home Team Analysis */}
              <div className="border border-[#1A1A1A] p-4 bg-[#F4F1EA]">
                <div className="flex justify-between items-center border-b border-[#D4CEBF] pb-2 mb-3">
                  <span className="editorial-label text-[10px] font-black">{homeTeam}</span>
                  {selectedRole !== "all" && (
                    <span className="font-mono text-xs font-extrabold bg-white border border-[#1A1A1A] px-2 py-0.5">
                      Reyting: {getRoleRating("home", selectedRole as any)}/10
                    </span>
                  )}
                </div>

                {selectedRole === "all" ? (
                  <div className="space-y-3">
                    {Object.entries(home.positionalRatings || {}).map(([key, rating]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs font-mono">
                          <span className="capitalize">{key === 'goalkeeper' ? 'Kaleci' : key === 'defense' ? 'Savunma' : key === 'midfield' ? 'Orta Saha' : 'Hücum'}</span>
                          <span className="font-bold">{rating}/10</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#D4CEBF] overflow-hidden border border-[#1A1A1A]/30">
                          <div className="h-full bg-[#1A1A1A]" style={{ width: `${(rating as number) * 10}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-slate-800 leading-relaxed text-justify font-sans">
                    {getRoleDetails("home", selectedRole as any)}
                  </p>
                )}
              </div>

              {/* Away Team Analysis */}
              <div className="border border-[#1A1A1A] p-4 bg-[#F4F1EA]">
                <div className="flex justify-between items-center border-b border-[#D4CEBF] pb-2 mb-3">
                  <span className="editorial-label text-[10px] font-black">{awayTeam}</span>
                  {selectedRole !== "all" && (
                    <span className="font-mono text-xs font-extrabold bg-white border border-[#1A1A1A] px-2 py-0.5">
                      Reyting: {getRoleRating("away", selectedRole as any)}/10
                    </span>
                  )}
                </div>

                {selectedRole === "all" ? (
                  <div className="space-y-3">
                    {Object.entries(away.positionalRatings || {}).map(([key, rating]) => (
                      <div key={key} className="space-y-1">
                        <div className="flex justify-between items-baseline text-xs font-mono">
                          <span className="capitalize">{key === 'goalkeeper' ? 'Kaleci' : key === 'defense' ? 'Savunma' : key === 'midfield' ? 'Orta Saha' : 'Hücum'}</span>
                          <span className="font-bold">{rating}/10</span>
                        </div>
                        <div className="h-1.5 w-full bg-[#D4CEBF] overflow-hidden border border-[#1A1A1A]/30">
                          <div className="h-full bg-[#1A1A1A]" style={{ width: `${(rating as number) * 10}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs sm:text-sm text-[#1A1A1A] leading-relaxed text-justify font-sans">
                    {getRoleDetails("away", selectedRole as any)}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* BENTO BLOCK 2: KEY PLAYERS (SIDE BY SIDE IN MATCH WRAP) */}
          <div className="col-span-12 lg:col-span-6 bg-[#FFFFFF] border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#1A1A1A]">
                <User size={15} />
                <h4 className="editorial-label text-[10px] font-bold">{homeTeam} Anahtar Oyuncu</h4>
              </div>
              <p className="font-serif italic text-lg text-slate-800 mb-4 leading-relaxed">
                {home.keyPlayer || "Veriler analiz ediliyor..."}
              </p>
            </div>
          </div>

          <div className="col-span-12 lg:col-span-6 bg-[#FFFFFF] border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-1.5 mb-2 pb-1.5 border-b border-[#1A1A1A]">
                <User size={15} />
                <h4 className="editorial-label text-[10px] font-bold">{awayTeam} Anahtar Oyuncu</h4>
              </div>
              <p className="font-serif italic text-lg text-slate-800 mb-4 leading-relaxed">
                {away.keyPlayer || "Veriler analiz ediliyor..."}
              </p>
            </div>
          </div>

          {/* BENTO BLOCK 3: INTENSITY AREAS */}
          <div className="col-span-12 bg-white border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A] flex flex-col gap-4">
            <div className="flex justify-between items-center border-b border-[#D4CEBF] pb-2">
              <h5 className="editorial-label text-[10px] font-black">Müsabaka Boyunca En Aktif Sektörler (Isı Dağılım Temsili)</h5>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase">{homeTeam} Sektörleri:</span>
                <div className="flex flex-wrap gap-1.5">
                  {report.simulatedHeatmaps?.homeIntensityAreas?.map((area, idx) => (
                    <span key={idx} className="bg-[#F4F1EA] text-[#1A1A1A] border border-[#1A1A1A] px-2.5 py-1 text-2xs font-mono font-bold shadow-sm">
                      {area}
                    </span>
                  )) || <span className="text-xs">Çözümleniyor...</span>}
                </div>
              </div>

              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase">{awayTeam} Sektörleri:</span>
                <div className="flex flex-wrap gap-1.5">
                  {report.simulatedHeatmaps?.awayIntensityAreas?.map((area, idx) => (
                    <span key={idx} className="bg-[#F4F1EA] text-[#1A1A1A] border border-[#1A1A1A] px-2.5 py-1 text-2xs font-mono font-bold shadow-sm">
                      {area}
                    </span>
                  )) || <span className="text-xs">Çözümleniyor...</span>}
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* STRENGTHS AND WEAKNESSES TAB */}
      {activeTab === "strengths_weaknesses" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Home Team */}
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-[4px_4px_0px_#1A1A1A] flex flex-col gap-5">
            <div className="border-b border-[#1A1A1A] pb-3">
              <h3 className="serif text-2xl font-black">{homeTeam}</h3>
              <p className="editorial-label text-[10px] text-slate-500 mt-1">Saha Formasyonu: {home.formation}</p>
            </div>

            {/* Strengths */}
            <div>
              <span className="editorial-label text-emerald-700 text-[10px] font-black block mb-2 tracking-widest uppercase">
                ✓ Güçlü Taktik Çözümler
              </span>
              <ul className="space-y-2">
                {home.strengths?.map((str, idx) => (
                  <li key={idx} className="bg-[#F4F1EA]/50 border border-[#D4CEBF] p-3 text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
                    <span className="font-bold">{idx + 1}. </span>{str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <span className="editorial-label text-rose-700 text-[10px] font-black block mb-2 tracking-widest uppercase">
                ⚠️ Taktiksel Eksiklikler & Gedikler
              </span>
              <ul className="space-y-2">
                {home.weaknesses?.map((weak, idx) => (
                  <li key={idx} className="bg-[#F4F1EA]/50 border border-[#D4CEBF] p-3 text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
                    <span className="font-bold">{idx + 1}. </span>{weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Away Team */}
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-[4px_4px_0px_#1A1A1A] flex flex-col gap-5">
            <div className="border-b border-[#1A1A1A] pb-3">
              <h3 className="serif text-2xl font-black">{awayTeam}</h3>
              <p className="editorial-label text-[10px] text-slate-500 mt-1">Saha Formasyonu: {away.formation}</p>
            </div>

            {/* Strengths */}
            <div>
              <span className="editorial-label text-emerald-700 text-[10px] font-black block mb-2 tracking-widest uppercase">
                ✓ Güçlü Taktik Çözümler
              </span>
              <ul className="space-y-2">
                {away.strengths?.map((str, idx) => (
                  <li key={idx} className="bg-[#F4F1EA]/50 border border-[#D4CEBF] p-3 text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
                    <span className="font-bold">{idx + 1}. </span>{str}
                  </li>
                ))}
              </ul>
            </div>

            {/* Weaknesses */}
            <div>
              <span className="editorial-label text-rose-700 text-[10px] font-black block mb-2 tracking-widest uppercase">
                ⚠️ Taktiksel Eksiklikler & Gedikler
              </span>
              <ul className="space-y-2">
                {away.weaknesses?.map((weak, idx) => (
                  <li key={idx} className="bg-[#F4F1EA]/50 border border-[#D4CEBF] p-3 text-xs sm:text-sm text-[#1A1A1A] leading-relaxed">
                    <span className="font-bold">{idx + 1}. </span>{weak}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* TACTICAL CLASH AND RECOMMENDATIONS */}
      {activeTab === "tactical" && (
        <div className="flex flex-col gap-6">
          
          <div className="bg-white border border-[#1A1A1A] p-6 shadow-[4px_4px_0px_#1A1A1A]">
            <h3 className="serif text-2xl font-bold uppercase mb-3 border-b border-[#1A1A1A] pb-2">
              Saha Çatışması: Karşılıklı Blok Eşleşmeleri
            </h3>
            <p className="sans text-sm sm:text-base text-justify leading-relaxed text-[#1A1A1A]">
              {report.tacticalClashSection}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Recommendations Home */}
            <div className="bg-white border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A]">
              <span className="editorial-label text-[10px] font-black block mb-3">{homeTeam} Takımına Reçeteler</span>
              <ul className="space-y-3 font-sans">
                {home.tacticalRecommendations?.map((rec, idx) => (
                  <li key={idx} className="bg-[#F4F1EA]/40 p-3 border border-[#D4CEBF] text-xs sm:text-sm flex items-start gap-2 text-justify">
                    <span className="font-bold font-mono text-xs">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Recommendations Away */}
            <div className="bg-white border border-[#1A1A1A] p-5 shadow-[4px_4px_0px_#1A1A1A]">
              <span className="editorial-label text-[10px] font-black block mb-3">{awayTeam} Takımına Reçeteler</span>
              <ul className="space-y-3 font-sans">
                {away.tacticalRecommendations?.map((rec, idx) => (
                  <li key={idx} className="bg-[#F4F1EA]/40 p-3 border border-[#D4CEBF] text-xs sm:text-sm flex items-start gap-2 text-justify">
                    <span className="font-bold font-mono text-xs">{idx + 1}.</span>
                    <span>{rec}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
