import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with telemetry User-Agent header
const apiKey = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Football Match Analysis Endpoint
app.post("/api/analyze", async (req, res) => {
  try {
    const {
      homeTeam = "Ev Sahibi Takım",
      awayTeam = "Deplasman Takım",
      score = "0-0",
      formationHome = "4-3-3",
      formationAway = "4-2-3-1",
      matchStats = {},
      textCommentary = "",
      analysisType = "full", // "full" | "positional" | "tactical" | "strengths_weaknesses"
      selectedSection = "all", // "all" | "defense" | "midfield" | "attack" | "gk"
    } = req.body;

    // Build stats string
    const statsStr = Object.entries(matchStats)
      .map(([key, val]) => `${key}: ${val}`)
      .join(", ");

    const systemPrompt = `Sen profesyonel bir futbol taktik analistisin. Gelen maç verilerini detaylıca inceleyip yüksek kalitede, gerçekçi ve derinlemesine taktik analizler yaparsın. Lütfen tüm analizleri her yaşa uygun ancak uzman derinliğinde, akıcı Türkçe ile yap.`;

    const userPrompt = `Aşağıdaki karşılaşmanın taktiksel analizini bana sun:
---
KARIŞLAŞMA: ${homeTeam} ${score} ${awayTeam}
DİZİLİŞLER: ${homeTeam} -> ${formationHome}, ${awayTeam} -> ${formationAway}
İSTATİSTİKLER: ${statsStr}
MAÇ ÖZETİ/OLAYLAR/YORUMLAR: ${textCommentary}
ANALİZ TÜRÜ: ${analysisType} (Pozisyon seçimi: ${selectedSection})
---
Senden bu verileri futbol jargonuna uygun, gerçekçi, fantezi veya uydurma olmayan profesyonel bir üslupla analiz etmeni istiyorum.
Sonucu tam olarak belirtilen JSON şeması yapısında dönmelisin.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: userPrompt,
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "matchSummary",
            "homeTeamAnalysis",
            "awayTeamAnalysis",
            "tacticalClashSection",
            "simulatedHeatmaps"
          ],
          properties: {
            matchSummary: {
              type: Type.STRING,
              description: "Maçın taktiksel özeti, genel ritmi ve kader anlarının anlatımı."
            },
            homeTeamAnalysis: {
              type: Type.OBJECT,
              required: [
                "formation",
                "possessionRating",
                "tacticalStyleRating",
                "strengths",
                "weaknesses",
                "positionalRatings",
                "positionalDetails",
                "keyPlayer",
                "tacticalRecommendations"
              ],
              properties: {
                formation: { type: Type.STRING },
                possessionRating: { type: Type.INTEGER, description: "Topa sahip olma veya kontrol etkinliği derecesi (0-100)" },
                tacticalStyleRating: { type: Type.INTEGER, description: "Taktiksel plana sadakat ve organizasyonel başarı derecesi (0-100)" },
                strengths: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Bu maçta öne çıkan en belirgin 3 güçlü yön"
                },
                weaknesses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Bu maçta aksayan en net 3 zayıf yön/eksiklik"
                },
                positionalRatings: {
                  type: Type.OBJECT,
                  required: ["defense", "midfield", "attack", "goalkeeper"],
                  properties: {
                    defense: { type: Type.NUMBER, description: "Savunma hattı puanı (1-10)" },
                    midfield: { type: Type.NUMBER, description: "Orta saha hattı puanı (1-10)" },
                    attack: { type: Type.NUMBER, description: "Hücum hattı puanı (1-10)" },
                    goalkeeper: { type: Type.NUMBER, description: "Kaleci performansı puanı (1-10)" }
                  }
                },
                positionalDetails: {
                  type: Type.OBJECT,
                  required: ["defense", "midfield", "attack", "goalkeeper"],
                  properties: {
                    defense: { type: Type.STRING, description: "Savunma performansının ve savunma yerleşiminin detaylı analizi." },
                    midfield: { type: Type.STRING, description: "Orta sahadaki pas trafiği, pres gücü ve geçiş oyunu detaylı analizi." },
                    attack: { type: Type.STRING, description: "Hücum hattındaki üretkenlik, bitiricilik ve kanat/merkez organizasyonu detaylı analizi." },
                    goalkeeper: { type: Type.STRING, description: "Kalecinin kurtarış yüzdesi, yan topları ve oyun kurma becerisi analizi." }
                  }
                },
                keyPlayer: { type: Type.STRING, description: "Maçın takım adına taktiksel anahtar oyuncusu ve kısa gerekçesi." },
                tacticalRecommendations: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Bir sonraki maç için teknik direktöre verilecek 3 hayati taktiksel öneri."
                }
              }
            },
            awayTeamAnalysis: {
              type: Type.OBJECT,
              required: [
                "formation",
                "possessionRating",
                "tacticalStyleRating",
                "strengths",
                "weaknesses",
                "positionalRatings",
                "positionalDetails",
                "keyPlayer",
                "tacticalRecommendations"
              ],
              properties: {
                formation: { type: Type.STRING },
                possessionRating: { type: Type.INTEGER },
                tacticalStyleRating: { type: Type.INTEGER },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                positionalRatings: {
                  type: Type.OBJECT,
                  required: ["defense", "midfield", "attack", "goalkeeper"],
                  properties: {
                    defense: { type: Type.NUMBER },
                    midfield: { type: Type.NUMBER },
                    attack: { type: Type.NUMBER },
                    goalkeeper: { type: Type.NUMBER }
                  }
                },
                positionalDetails: {
                  type: Type.OBJECT,
                  required: ["defense", "midfield", "attack", "goalkeeper"],
                  properties: {
                    defense: { type: Type.STRING },
                    midfield: { type: Type.STRING },
                    attack: { type: Type.STRING },
                    goalkeeper: { type: Type.STRING }
                  }
                },
                keyPlayer: { type: Type.STRING },
                tacticalRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
              }
            },
            tacticalClashSection: {
              type: Type.STRING,
              description: "İki takım dizilişinin ve oyun tarzının sahada doğrudan nasıl çakıştığına dair derinlemesine analiz (örn. 4-3-3'ün kanat bekleri ile 4-2-3-1'in bek-açık eşleşmesi)."
            },
            simulatedHeatmaps: {
              type: Type.OBJECT,
              required: ["homeIntensityAreas", "awayIntensityAreas"],
              properties: {
                homeIntensityAreas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Ev sahibinin en aktif olduğu 3-4 alan (örn. ['Sol Kanat', 'Ceza Sahası Yay', 'Merkez'])"
                },
                awayIntensityAreas: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "Deplasmanın en aktif olduğu 3-4 alan"
                }
              }
            }
          }
        }
      }
    });

    const report = JSON.parse(response.text || "{}");
    res.json({ success: true, report });
  } catch (error: any) {
    console.error("Analysis API Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Taktiksel analiz oluşturulurken bir hata oluştu."
    });
  }
});

// Configure Vite integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Futbol Analiz Sunucusu] running on http://localhost:${PORT}`);
  });
}

startServer();
