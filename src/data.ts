import { PresetMatch } from "./types";

export const FORMATIONS = [
  "4-3-3",
  "4-2-3-1",
  "3-4-3",
  "3-5-2",
  "4-4-2",
  "4-1-4-1",
  "4-5-1",
  "5-3-2",
  "4-3-1-2"
];

export const PRESET_MATCHES: PresetMatch[] = [
  {
    id: "el-clasico-2024",
    homeTeam: "Real Madrid",
    awayTeam: "Barcelona",
    score: "3-2",
    formationHome: "4-3-1-2",
    formationAway: "4-3-3",
    stats: {
      "Topa Sahip Olma": "%47 - %53",
      "Toplam Şut": "14 - 15",
      "Kaleyi Bulan Şut": "8 - 6",
      "Pas İsabeti": "%89 - %91",
      "Fauller": "11 - 14",
      "Kornerler": "5 - 4"
    },
    textCommentary: "Real Madrid, Jude Bellingham'ın son dakika golüyle maçı 3-2 kazandı. Barcelona topa sahip olup baskın oynamaya çalışırken, Real Madrid savunma derinliğini koruyarak hızlı geçiş hücumları (kontraatak) ile rakibin bek arkası boşluklarını mükemmel değerlendirdi. Vinicius Jr hızıyla sağ kanadı zorladı, Barcelona ise Lamine Yamal ile yaratıcı pozisyonlar buldu."
  },
  {
    id: "city-liverpool",
    homeTeam: "Manchester City",
    awayTeam: "Liverpool",
    score: "1-1",
    formationHome: "3-2-4-1",
    formationAway: "4-3-3",
    stats: {
      "Topa Sahip Olma": "%59 - %41",
      "Toplam Şut": "16 - 8",
      "Kaleyi Bulan Şut": "5 - 3",
      "Pas İsabeti": "%92 - %84",
      "Fauller": "8 - 11",
      "Kornerler": "9 - 3"
    },
    textCommentary: "Pep Guardiola'nın taktiksel dehası ve John Stones'un orta sahaya kayması Manchester City'e üstün pas kontrolü verdi. Ancak Jürgen Klopp'un yoğun 'Gegenpressing' (karşı pres) sistemi City'nin geriden pasla oyun kurmasını zorlaştırdı. Mohamed Salah'ın asistinde Alexander-Arnold'ın ceza sahası dışından attığı golle Liverpool 1 puanı kurtardı."
  },
  {
    id: "turkiye-gurcistan-2024",
    homeTeam: "Türkiye",
    awayTeam: "Gürcistan",
    score: "3-1",
    formationHome: "4-2-3-1",
    formationAway: "5-3-2",
    stats: {
      "Topa Sahip Olma": "%56 - %44",
      "Toplam Şut": "22 - 14",
      "Kaleyi Bulan Şut": "8 - 5",
      "Pas İsabeti": "%88 - %81",
      "Fauller": "10 - 7",
      "Kornerler": "5 - 5"
    },
    textCommentary: "Milli takımımız muhteşem bir mücadele ile Euro 2024 açılış maçında Gürcistan'ı geçmeyi bildi. Mert Müldür'ün enfes volesi ve Arda Güler'in jeneriklik uzak mesafe golüyle skor üstünlüğü yakalandı. Gürcistan 5'li savunma ile yerleşik kalıp hızlı hücumlar kovaladı ve savunmamızın arkasına attığı toplarla (özellikle sol bek boşluğumuzda) etkili oldu. Kerem Aktürkoğlu son saniyede boş kaleye attığı golle skoru ilan etti."
  },
  {
    id: "custom-match",
    homeTeam: "Galatasaray",
    awayTeam: "Fenerbahçe",
    score: "2-1",
    formationHome: "4-2-3-1",
    formationAway: "4-3-3",
    stats: {
      "Topa Sahip Olma": "%52 - %48",
      "Toplam Şut": "12 - 11",
      "Kaleyi Bulan Şut": "5 - 4",
      "Pas İsabeti": "%85 - %83",
      "Fauller": "15 - 16",
      "Kornerler": "6 - 4"
    },
    textCommentary: "Derbide Galatasaray evinde Fenerbahçe'yi mağlup etti. Galatasaray ön alanda Osimhen ve Mertens ile yoğun baskı kurdu ve rakip stoperleri hataya zorladı. Fenerbahçe ise Fred liderliğinde orta sahada direnç gösterip hızlı kanat hücumları ile karşılık verdi. 2. yarıda duran top organizasyonundan gelen gol maçın kaderini belirledi."
  }
];
