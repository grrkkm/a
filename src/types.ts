export interface PositionalRatings {
  defense: number;
  midfield: number;
  attack: number;
  goalkeeper: number;
}

export interface PositionalDetails {
  defense: string;
  midfield: string;
  attack: string;
  goalkeeper: string;
}

export interface TeamAnalysis {
  formation: string;
  possessionRating: number;
  tacticalStyleRating: number;
  strengths: string[];
  weaknesses: string[];
  positionalRatings: PositionalRatings;
  positionalDetails: PositionalDetails;
  keyPlayer: string;
  tacticalRecommendations: string[];
}

export interface SimulatedHeatmaps {
  homeIntensityAreas: string[];
  awayIntensityAreas: string[];
}

export interface MatchAnalysisReport {
  matchSummary: string;
  homeTeamAnalysis: TeamAnalysis;
  awayTeamAnalysis: TeamAnalysis;
  tacticalClashSection: string;
  simulatedHeatmaps: SimulatedHeatmaps;
}

export interface PresetMatch {
  id: string;
  homeTeam: string;
  awayTeam: string;
  score: string;
  formationHome: string;
  formationAway: string;
  stats: {
    "Topa Sahip Olma": string;
    "Toplam Şut": string;
    "Kaleyi Bulan Şut": string;
    "Pas İsabeti": string;
    "Fauller": string;
    "Kornerler": string;
  };
  textCommentary: string;
}
