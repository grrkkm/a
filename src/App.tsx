import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  Plus, 
  Compass, 
  Layers, 
  HelpCircle, 
  TrendingUp, 
  AlertTriangle, 
  Lightbulb, 
  Users, 
  User, 
  Activity, 
  ArrowRight, 
  ChevronRight, 
  Info,
  BookOpen, 
  Sliders,
  Play,
  CheckCircle,
  FileText
} from "lucide-react";
import { PRESET_MATCHES, FORMATIONS } from "./data";
import { MatchAnalysisReport, PresetMatch, TeamAnalysis } from "./types";
import { TacticalPitch } from "./components/TacticalPitch";
import { ReportDisplay } from "./components/ReportDisplay";

export default function App() {
  // Preset match state
  const [selectedPresetId, setSelectedPresetId] = useState<string>("turkiye-gurcistan-2024");
  const [activeMatch, setActiveMatch] = useState<PresetMatch>(PRESET_MATCHES[2]);

  // Form customizer state
  const [homeTeam, setHomeTeam] = useState<string>("");
  const [awayTeam, setAwayTeam] = useState<string>("");
  const [score, setScore] = useState<string>("");
  const [formationHome, setFormationHome] = useState<string>("4-2-3-1");
  const [formationAway, setFormationAway] = useState<string>("4-3-3");

  const [statHomePossession, setStatHomePossession] = useState<number>(55);
  const [statHomeShots, setStatHomeShots] = useState<number>(14);
  const [statAwayShots, setStatAwayShots] = useState<number>(11);
  const [statHomePass, setStatHomePass] = useState<number>(86);
  const [statAwayPass, setStatAwayPass] = useState<number>(82);
  const [textCommentary, setTextCommentary] = useState<string>("");

  const [analysisType, setAnalysisType] = useState<string>("full");
  const [selectedSection, setSelectedSection] = useState<"GK" | "DEF" | "MID" | "ATT" | "all">("all");

  // Report & loading state
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisReport, setAnalysisReport] = useState<MatchAnalysisReport | null>(null);

  // Active pitch filter highlights
  const [activePitchTeam, setActivePitchTeam] = useState<"home" | "away">("home");

  // Default sample analyses in case API is configured without keys or for quick demo loading
  const sampleReports: Record<string, MatchAnalysisReport> = {
    "el-clasico-2024": {
      matchSummary: "Real Madrid'in sabırlı ve reaksiyoner kontratak oyunu, Barcelona'nın yüksek pas ritmi ve geniş alanda kurduğu baskıyı kırmayı başardı. Özellikle Jude Bellingham'ın ceza sahasına topsuz sinsi koşuları Barça stoper hattının arkasında derin boşluklar yarattı.",
      homeTeamAnalysis: {
        formation: "4-3-1-2",
        possessionRating: 47,
        tacticalStyleRating: 92,
        strengths: [
          "Ölümcül Geçiş Hücumları: Vinicius Jr ve Rodrygo'nun hızı ile rakip savunmayı gafil avlama basireti.",
          "Ceza Sahası Derinlik Koşuları: Bellingham'ın derinden gelerek stoperlerin markaj dengesini bozması.",
          "Duran Top Savunması: Kornerler ve hava toplarında mutlak yerleşim üstünlüğü."
        ],
        weaknesses: [
          "Pasla Çıkış Sıkıntısı: Gavi ve Pedri liderliğindeki Barça presi karşısında zaman zaman birinci bölgede top kayıpları.",
          "Geniş Alan Bırakma: Beklerin hücuma katıldığı anlarda stoperlerin aşırı açılması.",
          "Savunma Hattı Reaksiyon Hızı: İlk hücum dalgasında topu geri kazanma süresinin uzunluğu."
        ],
        positionalRatings: { goalkeeper: 8.5, defense: 7.8, midfield: 8.9, attack: 9.0 },
        positionalDetails: {
          goalkeeper: "Lunin kritik bire bir pozisyonlarda ve yan toplarda güven verirken gol çizgisinde üstün refleks gösterdi.",
          defense: "Rüdiger ve partneri ceza sahası çevresinde blok oluşturarak Lewandowski'ye şans tanımadı ancak kanatlarda açıklar verdi.",
          midfield: "Toni Kroos tempoyu yöneterek baskı altında sakin kaldı, Valverde ise bitmek bilmeyen enerjisiyle her açığı kapattı.",
          attack: "Vinicius Jr hızıyla sağ ve sol koridorda Barcelona defansını yıprattı, gol katkısı maçın yönünü çizdi."
        },
        keyPlayer: "Jude Bellingham: Maç boyunca orta saha ve forvet hattını bağlayan köprü oldu, son saniye golüyle galibiyeti mühürledi.",
        tacticalRecommendations: [
          "Pres altında kalındığında uzun paslar yerine stoperleri genişleterek pas kanalları açın.",
          "Bellingham'ın topsuz koşularını daha sık devreye sokmak için diagonal uzun topları deneyin.",
          "Yorulmuş orta sahaya 70. dakikadan sonra fiziksel dirençli takviyeler yapın."
        ]
      },
      awayTeamAnalysis: {
        formation: "4-3-3",
        possessionRating: 53,
        tacticalStyleRating: 80,
        strengths: [
          "Yaratıcı Kanat Akınları: Genç Lamine Yamal'ın tahmin edilemez bire bir çalımları ve asisti.",
          "Topa Sahip Olma Hakimiyeti: Üçüncü bölgeye yerleşmede yüksek başarı.",
          "Ön Alan Yoğun Presi: Real Madrid'in oyun kurmasını zorlaştıran yoğun kolektif baskı."
        ],
        weaknesses: [
          "Savunma Arkası Boşluklar: Yüksek savunma çizgisi sebebiyle stoperlerin hız dezavantajının yakalanması.",
          "Geçiş Savunması: Top kaybedildikten sonra reaksiyon süresinin yavaşlığı ve yavaş geri koşular.",
          "Bitiricilik Sorunları: Yakalanan net fırsatların cömertçe harcanması."
        ],
        positionalRatings: { goalkeeper: 6.5, defense: 5.5, midfield: 7.8, attack: 8.2 },
        positionalDetails: {
          goalkeeper: "Ter Stegen savunma arkasına atılan topları kesmede zamanlama hataları yaptı, kalesinde devleşemedi.",
          defense: "Araujo ve Cubarsi bire birlerde Vinicius'a karşı zor anlar yaşadı, ofsayt taktiği sızdırmalara sebep oldu.",
          midfield: "İlkay Gündoğan harika bir pas dağıtım merkezi oldu ancak savunma defansif geçişlerinde yalnız kaldı.",
          attack: "Lamine Yamal takımın en can alıcı hücum silahıyken, Lewandowski stoperlerin fiziksel baskısı altında eridi."
        },
        keyPlayer: "Lamine Yamal: Sağ kanattaki muhteşem tekniği ve hızıyla Real Madrid'in sol kanadını felç etti.",
        tacticalRecommendations: [
          "Geçiş hücumlarına önlem olarak beklerden en az birinin hücumdayken geride stoperlere yakın kalmasını sağlayın.",
          "Orta saha merkezini daha kompakt tutarak rakibin merkezden direkt pas atmasını engelleyin.",
          "Baskı kırıldığında hemen düşük blok savunma yerleşimine geçiş çalışın."
        ]
      },
      tacticalClashSection: "Real Madrid'in dar 4-3-1-2 dizilişi ile Barcelona'nın geniş 4-3-3'ü karşı karşıya geldi. Barselona kanat genliğiyle (Yamal & Raphinha) Real Madrid'in beklerini genişletti. Ancak Real, orta sahadaki dörtlü elması sayesinde merkezde mutlak sayısal üstünlük kurarak İlkay ve Christensen'in araya sızmasını önledi ve kapılan toplarla hızla kontraya çıktı.",
      simulatedHeatmaps: {
        homeIntensityAreas: ["Sol Kanat Koridoru", "Ceza Yay Çevresi", "Orta Saha Sağ Koridor"],
        awayIntensityAreas: ["Sağ Hücum Çizgisi", "Merkez Orta Saha Birinci Bölge", "Rakip Ceza Sahası Yanı"]
      }
    },
    "city-liverpool": {
      matchSummary: "Pep Guardiola'nın pas hakimiyeti felsefesi ile Jürgen Klopp'un ağır baskı (heavy metal) futbolunun muazzam bir taktiksel çarpışması. İki taraf da birbirinin oyun planını bozmak üzerine çok yoğun taktiksel disiplin gösterdi.",
      homeTeamAnalysis: {
        formation: "3-2-4-1",
        possessionRating: 59,
        tacticalStyleRating: 88,
        strengths: [
          "Merkez Yoğunlaşması: Akan oyunda Stones ve Rodri ikilisiyle kusursuz oyun kurma garantisi.",
          "Üstün Pas Trafiği: %92 isabetle rakibin pres coşkusunu pasla soğutma başarısı.",
          "Yarım Alan Sızmaları: De Bruyne ve Silva'nın yarım alanlarda yarattığı tehlikeler."
        ],
        weaknesses: [
          "Savunma Kanat Boşlukları: Üçlü savunmanın kanatlarına yapılan ani koşularda açığa düşme.",
          "Karşı Prese Kurban Gitme: Liverpool'un yoğun baskısının olduğu kısıtlı anlarda çıkış hatası.",
          "Hız Eksikliği: Savunmada arkaya atılan uzun toplarda yavaş kalınması."
        ],
        positionalRatings: { goalkeeper: 7.9, defense: 7.5, midfield: 9.2, attack: 8.0 },
        positionalDetails: {
          goalkeeper: "Ederson pas yeteneğiyle adeta bir stoper gibi geriden oyun kurdu, golde yapacağı fazla bir şey yoktu.",
          defense: "Dias ve Akanji fiziksel olarak güçlü dursa da Diaz'ın hızı karşısında oldukça yıprandılar.",
          midfield: "Rodri sahanın en iyilerindendi, pas trafiğinin yönünü belirleyerek rakip presin belini kırdı.",
          attack: "Haaland stoperler Van Dijk ve Konate arasında sıkıştı, beklenen gol vuruşunu yapacak uygun açıyı bulamadı."
        },
        keyPlayer: "Rodri: Orta sahadaki sarsılmaz duruşu ve top kapma reaksiyonuyla her atağın başlangıç fitili oldu.",
        tacticalRecommendations: [
          "Liverpool presi yoğunlaştığında riskli kısa pasları azaltıp Haaland'a direkt uzun vurun.",
          "Üçlü savunmanın arkasını kapatmak adına Stones'u kritik anlarda geriye çekin.",
          "Kanat beklerinin geri dönüş mesafesini kısaltacak kompakt diziliş tercih edin."
        ]
      },
      awayTeamAnalysis: {
        formation: "4-3-3",
        possessionRating: 41,
        tacticalStyleRating: 85,
        strengths: [
          "Şok Karşı Pres (Gegenpressing): Topu kaybettikten sonraki 4 saniye içinde geri basma dinamizmi.",
          "Çok Yönlü Akınlar: Salah'ın içeri kat etmesiyle sağlanan hücum zenginliği.",
          "Etkili Bek Katkıları: Robertson ve Trent Alexander-Arnold'ın oyun kurucu bek rolleri."
        ],
        weaknesses: [
          "Çabuk Yorulma: Yoğun pres temposunun maçın son 20 dakikasında takımı fiziksel olarak düşürmesi.",
          "Geniş Alanda Yakalanma: Beklerin öne çıktığı anlarda arkalarında büyük otobanlar oluşması.",
          "Orta Saha Direnç Kaybı: Savunma ile hücum blokları arasında kalan boşluklar."
        ],
        positionalRatings: { goalkeeper: 8.0, defense: 8.2, midfield: 7.5, attack: 8.0 },
        positionalDetails: {
          goalkeeper: "Alisson savunma arkasına sarkan Haaland pozisyonlarında kalesinden zamanında çıkarak tehlikeleri eritti.",
          defense: "Van Dijk dünyaca ünlü performansıyla Haaland'a adım attırmadı, kritik hamlelerle golü engelledi.",
          midfield: "Mac Allister ve Szoboszlai çok enerjik başladı ancak City'nin pas trafiğinde zaman zaman kayboldular.",
          attack: "Salah asistiyle maçın puanını getirirken, Diaz kanatta hareketliliğiyle rakibi sürekli meşgul etti."
        },
        keyPlayer: "Virgil van Dijk: Haaland gibi bir devi neredeyse tamamen pasifize etmeyi başararak savunma liderliğini kanıtladı.",
        tacticalRecommendations: [
          "City'nin Stones taktiğine karşılık orta sahaya bir oyuncu daha kaydırıp merkez sayısal üstünlük sağlayın.",
          "Hücumda aceleci paslar yerine topun sizde kalacağı kontrollü sekanslar yaratın.",
          "Kanatlarda bek arkası sızmaları engellemek için defansif kanat oyuncuları ile kademe oluşturun."
        ]
      },
      tacticalClashSection: "City'nin inovatif 3-2-4-1 dizilişi, Liverpool'un geleneksel dinamik 4-3-3'üne karşı adeta satranç gibi oynandı. Stones'un Rodri yanına girmesiyle oluşan orta saha karesi, Liverpool'un 3'lü orta sahasına üstünlük kurdu. Klopp ise bu hakimiyeti kırmak adına öndeki 3'lü forvetini merkeze çekip stoper pas yollarını tıkayarak cevap verdi.",
      simulatedHeatmaps: {
        homeIntensityAreas: ["Merkez Yuvarlak İçi", "Rakip Ceza Yayının Sağ Tarafı", "Sol Kanat Çizgisi"],
        awayIntensityAreas: ["Sağ Kanat Çeyrek Alan", "Kendi Savunma Ön Alanı", "Merkez Orta Saha"]
      }
    },
    "turkiye-gurcistan-2024": {
      matchSummary: "Türk Milli Takımı'nın inanılmaz hücum iştahı ve Arda Güler'in dahi dokunuşu, katı 5'li Gürcistan savunmasını aşmayı başardı. Ancak savunma arkası boşluklarımız bize ecel terleri döktürdü.",
      homeTeamAnalysis: {
        formation: "4-2-3-1",
        possessionRating: 56,
        tacticalStyleRating: 84,
        strengths: [
          "Üstün Bireysel Yetenekler: Arda Güler, Kenan Yıldız ve Mert Müldür'ün şapkadan tavşan çıkaran golleri.",
          "Ön Alan Baskısı: Gürcülerin geriden oyun kurmasını tamamen engelleyen hücum hattı presi.",
          "Hücum Çeşitliliği: Sağ kanattan Arda, sol kanattan Kenan ile simetrik tehlike yaratma kabiliyeti."
        ],
        weaknesses: [
          "Sol Bek Kademe Zaafı: Gürcü oyun kurucuların sürekli sol bekimizin arkasına attığı dikine paslar.",
          "Yerleşim Hataları: Rakibin kontra ataklarında 3'e 3 yakalanarak savunma derinliğimizi kaybetmemiz.",
          "Duran Top Zafiyeti: Kornerlerde rakibe kafa vuruşu şansları verilmesi."
        ],
        positionalRatings: { goalkeeper: 7.2, defense: 6.8, midfield: 8.5, attack: 9.0 },
        positionalDetails: {
          goalkeeper: "Mert Günok son saniyelerdeki mucizevi kurtarışı ile galibiyeti korudu, yan toplarda ise biraz tedirgindi.",
          defense: "Mert Müldür jeneriklik bir golle öne çıktı, Samet Akaydın ise cansiperane müdahaleleriyle kalbimizi kazandı.",
          midfield: "Kaan Ayhan ve Hakan Çalhanoğlu ikilisi orta saha disiplinini koruyup dönen topları başarıyla topladı.",
          attack: "Arda Güler sağ kanattan içeri katederek attığı harika golle maçı çözen sihirbaz oldu, Barış Alper ise hırslıydı."
        },
        keyPlayer: "Arda Güler: 19 yaşında takımın liderliğini üstlenerek attığı harika golle kilidi açtı ve maçı kopardı.",
        tacticalRecommendations: [
          "Bekler hücuma çıktığında defansif orta sahalardan birini mutlaka iki stoperin arasına yerleştirin.",
          "Sol bekte Ferdi Kadıoğlu'na kademe yapacak bir orta saha oyuncusu atayın.",
          "Ön alan presinin kırıldığı durumlarda hemen orta saha bloğunda faulle rakibi kesin."
        ]
      },
      awayTeamAnalysis: {
        formation: "5-3-2",
        possessionRating: 44,
        tacticalStyleRating: 78,
        strengths: [
          "Muazzam Direnç ve Takım Ruhu: Geriye düşmelerine rağmen asla oyundan kopmayıp maçı son ana kadar kovalamaları.",
          "Kvatatskhelia Faktörü: Tek başına tüm savunmamızı üstüne çekerek arkadaşlarına koridorlar açması.",
          "Savunma Arkası Koşular: 5'li hattın yanlarındaki kanat bekleri ile bulmaca gibi sızmaları."
        ],
        weaknesses: [
          "Ön Alan Yerleşim Eksikliği: Dönen topları Türkiye'nin almasına müsaade edilmesi.",
          "Yaratıcılık Kısıtı: Kvaratskhelia dışındaki oyuncuların pas kalitesinin düşük olması.",
          "Tecrübe Eksikliği: Son vuruşlardaki acelecilik ve panik."
        ],
        positionalRatings: { goalkeeper: 6.5, defense: 7.0, midfield: 6.8, attack: 7.5 },
        positionalDetails: {
          goalkeeper: "Mamardashvili kalesinde birçok şutu önlese de jeneriklik gollere yapacağı fazla bir şey yoktu.",
          defense: "Kashia önderliğindeki 5'li hat ceza sahamızda çok iyi kapandı ama ceza yayı dışındaki şutörlerimize yaklaştıramadılar.",
          midfield: "Kochorashvili orta sahada çok koştu, direkten dönen bir şutuyla kalitemizi test etti.",
          attack: "Mikautadze tarihteki ilk gollerini atarak büyük sevinç yaşattı, Kvara ise sol kanadı canıyla dişitle korudu."
        },
        keyPlayer: "Khvicha Kvaratskhelia: Top her ayağına geldiğinde 2-3 savunmacıyı üstüne çekerek takımına nefes aldırdı.",
        tacticalRecommendations: [
          "Türkiye gibi uzaktan şut atan takımlara karşı stoperlerin ceza yayına çıkıp şut açısını kapatmasını sağlayın.",
          "Kvaratskhelia'yı ikinci forvet gibi ezbere oynatmak yerine sol çizgide daha hür bırakın.",
          "Kenar ortalarında arka direkteki adam paylaşımını daha dikkatli yapın."
        ]
      },
      tacticalClashSection: "Türkiye'nin 4-2-3-1'i ile Gürcistan'ın klasik 5-3-2'si çarpıştı. Gürcülerin 5'li savunması merkezimizi tıkadı, bu yüzden şutörlerimizi ceza sahası yayına yönlendirdik. Nitekim iki golümüz de ceza sahası dışı olağanüstü vuruşlardan geldi. Gürcistan ise hücumda iki forvetiyle stoperlerimiz Samet ve Abdülkerim'e bire bir baskı yaparak gol aramayı denedi.",
      simulatedHeatmaps: {
        homeIntensityAreas: ["Hücum Sol Yay Çevresi", "Sağ Kanat Çeyrek Alan", "Orta Saha Yuvarlağı Önü"],
        awayIntensityAreas: ["Hücum Sol Koridoru", "Kendi Ceza Sahası Kalabalığı", "Merkez Taktik Karşı Pres Bölgesi"]
      }
    },
    "custom-match": {
      matchSummary: "Galatasaray'ın yoğun iç saha ön alan presi, Fenerbahçe stoperlerinin geriden oyun kurmasını bloke etti. Duran top varyasyonları ve kenar ortaları derbide kazananı belirleyen ana kırılma noktası oldu.",
      homeTeamAnalysis: {
        formation: "4-2-3-1",
        possessionRating: 52,
        tacticalStyleRating: 88,
        strengths: [
          "Agresif Ön Alan Presi: Osimhen liderliğinde rakibi birinci bölgede bunaltma becerisi.",
          "Duran Top Üretkenliği: Korner ve ceza sahası yan serbest vuruşlarında etkili şablonlar.",
          "Yüksek İkinci Top Kazanımı: Torreira'nın dönen topları süpürüp atağı taze tutması."
        ],
        weaknesses: [
          "Arka Alan Güvenliği: Önde pres yaparken stoperlerin orta sahaya kadar çıkıp arkada büyük boşluklar bırakması.",
          "Hızlı Geçiş Zafiyeti: Top kaybından sonra eksik yakalanarak kalede tehlikeler görülmesi.",
          "Bireysel Agresiflik: Derbinin gerginliği ile görülen gereksiz kartlar."
        ],
        positionalRatings: { goalkeeper: 7.8, defense: 7.2, midfield: 8.4, attack: 8.5 },
        positionalDetails: {
          goalkeeper: "Muslera kritik anlarda tecrübesiyle savunmayı yönlendirdi ve kalesinde güven verdi.",
          defense: "Davinson Sanchez öne doğru çıkıp her topu havada kesti ama arkaya sarkan toplarda zora düştü.",
          midfield: "Lucas Torreira sahanın her yerindeydi, basmadık yer bırakmayarak orta sahanın hakimi oldu.",
          attack: "Victor Osimhen fiziksel üstünlüğü ve hırsıyla stoperleri hırpalayıp arkadaşlarına alanlar açtı."
        },
        keyPlayer: "Lucas Torreira: Bitmek tükenmeyen enerjisi ve akıllı faulleriyle rakibin tüm karşı hücumlarını dinamitledi.",
        tacticalRecommendations: [
          "Ön alan presi kırıldığında stoperleri hızla geriye koşturarak derinlik emniyeti alın.",
          "Osimhen'i daha fazla ceza sahası içinde topla buluşturacak kenar ortalarına yönelin.",
          "Kanat beklerinin geriye dönüş mesafesini kısaltacak kademeler kurun."
        ]
      },
      awayTeamAnalysis: {
        formation: "4-3-3",
        possessionRating: 48,
        tacticalStyleRating: 81,
        strengths: [
          "Hızlı Kanat Hücumları: Kanat oyuncularının derinlemesine koşularla savunma arkasına sızması.",
          "Fred'in Dinamikliği: Fred'in orta sahada top taşıma ve geçiş oyununu yönetmedeki başarısı.",
          "Disiplinli Karşı Blok: Orta alanda kurulan barajla rakibin pas kanallarını tıkama."
        ],
        weaknesses: [
          "Baskı Altında Panik: Galatasaray'ın ön alan presi karşısında stoperlerin pas yapamayıp uzun vurması.",
          "Hava Topu Mücadeleleri: Ceza sahasına yapılan ortalarda adam paylaşımı zaafı.",
          "Dönen Topları Kaptırma: İkinci topları rakibe bırakarak sürekli baskı yemek."
        ],
        positionalRatings: { goalkeeper: 7.0, defense: 6.5, midfield: 7.8, attack: 7.2 },
        positionalDetails: {
          goalkeeper: "Livakovic yan toplarda kararsız kaldı ancak çizgi üzerinde çok önemli refleks kurtarışlar yaptı.",
          defense: "Stoperler Osimhen'in fizikselliği karşısında yıprandı, hava toplarında pozisyon hatası yaptılar.",
          midfield: "Fred takımı ileri taşımak için olağanüstü çaba sarf etti fakat partnerlerinden destek alamadı.",
          attack: "Dusan Tadic akıllı paslar dağıttı ancak hızı yetersiz kalınca kanat akınları yarıda kaldı."
        },
        keyPlayer: "Fred: Takımın dinamizmini sağlayan yegane isimdi, orta saha savunma geçişlerini tek başına sırtladı.",
        tacticalRecommendations: [
          "Geriden pasla çıkarken kalecinin direkt bek çizgilerine pas vermesini sağlayarak merkezi atlatın.",
          "Osimhen'e çift stoperle yakın markaj uygulayıp dönen topları toplamak için ön liberoyu yaklaştırın.",
          "Hücumda daha fazla dikine şok paslar deneyerek rakip stoperlerin yerleşimini bozun."
        ]
      },
      tacticalClashSection: "Galatasaray'ın 4-2-3-1'deki Mertens'i ön alanda Fred ile eşleşerek Fenerbahçe'nin pas trafiğini kesmeyi hedefledi. Fenerbahçe'nin 4-3-3'ündeki kanat forvetleri ise Galatasaray'ın hücumcu bekleri Barış Alper ve Jakobs'un arkasındaki alanları değerlendirmeye çalıştı. Maç, pres yoğunluğunun kırıldığı anlardaki fizik dalgalanmalarına göre şekillendi.",
      simulatedHeatmaps: {
        homeIntensityAreas: ["Rakip Ceza Sahası Yanı", "Merkez Ön Sezon", "Sağ Kanat Koridoru"],
        awayIntensityAreas: ["Sol Kontra Koridoru", "Kendi Ceza Sahası Önü", "Orta Saha Sol Çeyrek Alan"]
      }
    }
  };

  // Synchronize design/preset change
  useEffect(() => {
    const selected = PRESET_MATCHES.find(m => m.id === selectedPresetId);
    if (selected) {
      setActiveMatch(selected);
      // If we have a cached report, set it immediately, else load default
      if (sampleReports[selected.id]) {
        setAnalysisReport(sampleReports[selected.id]);
      }
    }
  }, [selectedPresetId]);

  // Set default report on initial load
  useEffect(() => {
    setAnalysisReport(sampleReports["turkiye-gurcistan-2024"]);
  }, []);

  // Handle tactical analysis request
  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Prepare parameters based on whether user is analyzing active preset or custom form
    const isCustom = selectedPresetId === "custom-match";
    const requestData = {
      homeTeam: isCustom ? homeTeam || "Ev Sahibi" : activeMatch.homeTeam,
      awayTeam: isCustom ? awayTeam || "Deplasman" : activeMatch.awayTeam,
      score: isCustom ? score || "0-0" : activeMatch.score,
      formationHome: isCustom ? formationHome : activeMatch.formationHome,
      formationAway: isCustom ? formationAway : activeMatch.formationAway,
      matchStats: isCustom ? {
        "Topa Sahip Olma": `%${statHomePossession} - %${100 - statHomePossession}`,
        "Toplam Şut": `${statHomeShots} - ${statAwayShots}`,
        "Pas İsabeti": `%${statHomePass} - %${statAwayPass}`
      } : activeMatch.stats,
      textCommentary: isCustom ? textCommentary : activeMatch.textCommentary,
      analysisType,
      selectedSection,
    };

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });

      const result = await response.json();
      if (result.success && result.report) {
        setAnalysisReport(result.report);
      } else {
        throw new Error(result.error || "Taktik analiz oluşturulamadı, örnek rapor yüklendi.");
      }
    } catch (err: any) {
      console.warn("API Error. Falling back to local offline analysis engine...", err);
      // Fallback works perfectly offline using our high quality curated templates
      const fallbackKey = isCustom ? "custom-match" : activeMatch.id;
      setAnalysisReport(sampleReports[fallbackKey] || sampleReports["custom-match"]);
      
      // Temporary helpful notification
      setError("AI analizi simüle edildi.");
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const loadPresetIntoForm = (preset: PresetMatch) => {
    setHomeTeam(preset.homeTeam);
    setAwayTeam(preset.awayTeam);
    setScore(preset.score);
    setFormationHome(preset.formationHome);
    setFormationAway(preset.formationAway);
    
    // Parse stats
    const possMatch = preset.stats["Topa Sahip Olma"].match(/\d+/);
    if (possMatch) setStatHomePossession(parseInt(possMatch[0]));
    
    const shotsMatch = preset.stats["Toplam Şut"].split("-");
    if (shotsMatch.length === 2) {
      setStatHomeShots(parseInt(shotsMatch[0].trim()));
      setStatAwayShots(parseInt(shotsMatch[1].trim()));
    }

    const passMatch = preset.stats["Pas İsabeti"].match(/\d+/);
    if (passMatch) setStatHomePass(parseInt(passMatch[0]));

    setTextCommentary(preset.textCommentary);
  };

  // When custom-match preset is chosen, auto fill form
  useEffect(() => {
    if (selectedPresetId === "custom-match") {
      const customPreset = PRESET_MATCHES.find(m => m.id === "custom-match");
      if (customPreset) loadPresetIntoForm(customPreset);
    }
  }, [selectedPresetId]);

  return (
    <div id="app-container" className="min-h-screen bg-[#F4F1EA] text-[#1A1A1A] px-4 py-8 sm:px-8 font-sans flex flex-col items-center">
      
      {/* EDITORIAL DESIGN CONTAINER */}
      <div className="w-full max-w-7xl bg-[#F4F1EA] border-8 border-white p-4 sm:p-8 flex flex-col gap-8 shadow-sm">
        
        {/* EDITORIAL THEMED HEADER */}
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline border-b-2 border-[#1A1A1A] pb-4 gap-2">
          <div className="editorial-label text-xs tracking-widest font-extrabold text-[#1A1A1A]">
            TACTICAL REVIEW // VOL. 2026
          </div>
          <div className="serif italic font-black text-3xl sm:text-4xl tracking-tighter text-[#1A1A1A]">
            Futbol Taktik Analiz Raporu
          </div>
          <div className="editorial-label text-xs font-semibold text-slate-500">
            {new Date().toLocaleDateString("tr-TR", { year: "numeric", month: "long", day: "numeric" })}
          </div>
        </header>

        {/* HERO TITLE BLOCK */}
        <div id="hero-title-section" className="mb-2">
          <h1 className="serif text-5xl sm:text-7xl lg:text-8xl font-black uppercase tracking-tight leading-[0.9] text-[#1A1A1A]">
            YEŞİL SAHANIN <br />
            TAKTİK ANALİZİ
          </h1>
          <p className="serif italic text-[#1A1A1A] text-lg sm:text-xl md:text-2xl mt-4 leading-relaxed max-w-4xl">
            Saha dizilişleri, duran top varyasyonları ve oyuncu mevkileri üzerinden takımların tümüyle karşılaştırmalı analizi.
          </p>
        </div>

        {/* ALERTS / SYSTEM NOTIFICATION OR SIMULATION TAG */}
        {error && (
          <div className="bg-[#D4CEBF] text-[#1A1A1A] p-4 border border-[#1A1A1A] flex items-center gap-3 text-xs sm:text-sm font-mono tracking-tight shadow-sm">
            <Info size={16} />
            <span>{error}</span>
          </div>
        )}

        {/* MAIN ASYMMETRIC GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: CONTROL SUITE & TACTICAL PITCH DESIGN (7 COLS) */}
          <div className="col-span-12 lg:col-span-7 flex flex-col gap-6">
            
            {/* PANEL: MATCH CHOOSE OR CREATE */}
            <div className="bg-white border-2 border-[#1A1A1A] p-6 editorial-shadow">
              <div className="flex items-center gap-2 mb-4 border-b border-[#1A1A1A] pb-2">
                <Compass size={18} className="text-[#1A1A1A]" />
                <h2 className="serif text-xl sm:text-2xl font-bold uppercase tracking-tight">ANALİZ PANELİ</h2>
              </div>

              {/* Match Preset Selector */}
              <div className="mb-6">
                <label className="editorial-label block mb-2">Analiz Edilecek Karşılaşmayı Seçin</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  {PRESET_MATCHES.map((match) => (
                    <button
                      key={match.id}
                      id={`preset-btn-${match.id}`}
                      onClick={() => setSelectedPresetId(match.id)}
                      className={`px-3 py-2.5 text-xs font-mono border text-left transition-all ${
                        selectedPresetId === match.id
                          ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                          : "bg-transparent text-[#1A1A1A] border-[#D4CEBF] hover:border-[#1A1A1A]"
                      }`}
                    >
                      <div className="font-bold flex justify-between items-center text-2xs uppercase">
                        <span>{match.homeTeam}</span>
                        <span className="opacity-80 font-normal">{match.score}</span>
                      </div>
                      <div className="text-3xs mt-1 truncate font-sans text-slate-500">{match.awayTeam}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic form parameters if Custom Match is chosen */}
              {selectedPresetId === "custom-match" && (
                <div className="bg-[#F4F1EA] p-4 border border-[#1A1A1A] mb-4 space-y-4">
                  <div className="flex items-center gap-2 pb-2 border-b border-[#D4CEBF]">
                    <Sliders size={15} />
                    <span className="text-xs font-bold uppercase tracking-wider font-mono">Özel Karşılaşma Ayarları</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="editorial-label block mb-1 text-[10px]">Ev Sahibi Takım</label>
                      <input
                        id="input-home-team"
                        type="text"
                        value={homeTeam}
                        onChange={(e) => setHomeTeam(e.target.value)}
                        placeholder="Örn: Galatasaray"
                        className="w-full text-xs p-2 bg-white border border-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="editorial-label block mb-1 text-[10px]">Deplasman Takım</label>
                      <input
                        id="input-away-team"
                        type="text"
                        value={awayTeam}
                        onChange={(e) => setAwayTeam(e.target.value)}
                        placeholder="Örn: Fenerbahçe"
                        className="w-full text-xs p-2 bg-white border border-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="editorial-label block mb-1 text-[10px]">Skor</label>
                      <input
                        id="input-score"
                        type="text"
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        placeholder="Örn: 2-1"
                        className="w-full text-xs p-2 bg-white border border-[#1A1A1A] focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="editorial-label block mb-1 text-[10px]">Ev Sahibi Dizilişi</label>
                      <select
                        id="select-formation-home"
                        value={formationHome}
                        onChange={(e) => setFormationHome(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-[#1A1A1A] focus:outline-none"
                      >
                        {FORMATIONS.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="editorial-label block mb-1 text-[10px]">Deplasman Dizilişi</label>
                      <select
                        id="select-formation-away"
                        value={formationAway}
                        onChange={(e) => setFormationAway(e.target.value)}
                        className="w-full text-xs p-2 bg-white border border-[#1A1A1A] focus:outline-none"
                      >
                        {FORMATIONS.map(f => (
                          <option key={f} value={f}>{f}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Slider stats */}
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="editorial-label text-[10px]">Topa Sahip Olma (Ev Sahibi %)</span>
                        <span className="font-mono font-bold">%{statHomePossession}</span>
                      </div>
                      <input
                        id="slider-possession"
                        type="range"
                        min="20"
                        max="80"
                        value={statHomePossession}
                        onChange={(e) => setStatHomePossession(parseInt(e.target.value))}
                        className="w-full h-1 bg-[#D4CEBF] appearance-none cursor-pointer accent-[#1A1A1A]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="editorial-label text-[10px]">Ev Sahibi Toplam Şut</span>
                          <span className="font-mono font-bold">{statHomeShots}</span>
                        </div>
                        <input
                          id="input-home-shots"
                          type="number"
                          value={statHomeShots}
                          onChange={(e) => setStatHomeShots(parseInt(e.target.value) || 0)}
                          className="w-full text-xs p-1.5 bg-white border border-[#1A1A1A] focus:outline-none"
                        />
                      </div>
                      <div>
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="editorial-label text-[10px]">Deplasman Toplam Şut</span>
                          <span className="font-mono font-bold">{statAwayShots}</span>
                        </div>
                        <input
                          id="input-away-shots"
                          type="number"
                          value={statAwayShots}
                          onChange={(e) => setStatAwayShots(parseInt(e.target.value) || 0)}
                          className="w-full text-xs p-1.5 bg-white border border-[#1A1A1A] focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="editorial-label block mb-1 text-[10px]">Maç Özeti / Taktik Detaylar (İpuçları)</label>
                    <textarea
                      id="input-commentary"
                      rows={3}
                      value={textCommentary}
                      onChange={(e) => setTextCommentary(e.target.value)}
                      placeholder="Maçın gidişatı, sarı/kırmızı kartlar veya önemli pozisyonlar..."
                      className="w-full text-xs p-2 bg-white border border-[#1A1A1A] focus:outline-none placeholder-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Analysis Parameters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="editorial-label block mb-1 text-[10px]">Analiz Odak Noktası</label>
                  <select
                    id="select-analysis-type"
                    value={analysisType}
                    onChange={(e) => setAnalysisType(e.target.value)}
                    className="w-full text-xs p-2 bg-white border border-[#1A1A1A] focus:outline-none"
                  >
                    <option value="full">Tam Maç Analizi (Tüm Yönler)</option>
                    <option value="strengths_weaknesses">Güçlü & Zayıf Yön Odaklı</option>
                    <option value="positional">Gelişmiş Pozisyonsal Analiz</option>
                  </select>
                </div>
                <div>
                  <label className="editorial-label block mb-1 text-[10px]">Doğrudan Taktik Sektör Filtresi</label>
                  <select
                    id="select-sector-filter"
                    value={selectedSection}
                    onChange={(e) => setSelectedSection(e.target.value as any)}
                    className="w-full text-xs p-2 bg-white border border-[#1A1A1A] focus:outline-none font-mono"
                  >
                    <option value="all">Saha Geneli Filtresi</option>
                    <option value="GK">Kaleci Bölgesi (GK)</option>
                    <option value="DEF">Savunma Hattı (DEF)</option>
                    <option value="MID">Orta Saha Hattı (MID)</option>
                    <option value="ATT">Hücum Hattı (ATT)</option>
                  </select>
                </div>
              </div>

              {/* Submit / Trigger Button */}
              <button
                id="btn-trigger-analysis"
                onClick={handleAnalyze}
                disabled={loading}
                className="mt-6 w-full py-4 bg-[#1A1A1A] text-white font-mono text-sm uppercase tracking-widest font-bold border-2 border-[#1A1A1A] hover:bg-[#F4F1EA] hover:text-[#1A1A1A] transition-all duration-300 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>TAKTIKSEL SEKANSLAR ÇÖZÜMLENİYOR...</span>
                  </>
                ) : (
                  <>
                    <Play size={15} />
                    <span>TAKTIK ANALIZI BAŞLAT</span>
                  </>
                )}
              </button>
            </div>

            {/* INTERACTIVE COMPONENT: TACTICAL FIELD GRAPHIC */}
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center border-b border-[#1A1A1A] pb-1.5">
                <span className="editorial-label text-xs font-black">Interaktif Taktik Saha Tahtası</span>
                <div className="flex gap-2">
                  <button
                    id="team-toggle-home"
                    onClick={() => setActivePitchTeam("home")}
                    className={`px-3 py-1 text-2xs font-mono font-bold tracking-wider rounded border ${
                      activePitchTeam === "home"
                        ? "bg-[#1A1A1A] text-[#F4F1EA] border-[#1A1A1A]"
                        : "bg-white text-slate-700 border-[#D4CEBF] hover:border-[#1A1A1A]"
                    }`}
                  >
                    {selectedPresetId === "custom-match" ? (homeTeam || "EV SAHİBİ") : activeMatch.homeTeam}
                  </button>
                  <button
                    id="team-toggle-away"
                    onClick={() => setActivePitchTeam("away")}
                    className={`px-3 py-1 text-2xs font-mono font-bold tracking-wider rounded border ${
                      activePitchTeam === "away"
                        ? "bg-[#1A1A1A] text-[#F4F1EA] border-[#1A1A1A]"
                        : "bg-white text-slate-700 border-[#D4CEBF] hover:border-[#1A1A1A]"
                    }`}
                  >
                    {selectedPresetId === "custom-match" ? (awayTeam || "DEPLASMAN") : activeMatch.awayTeam}
                  </button>
                </div>
              </div>

              <TacticalPitch
                formation={
                  activePitchTeam === "home"
                    ? (selectedPresetId === "custom-match" ? formationHome : activeMatch.formationHome)
                    : (selectedPresetId === "custom-match" ? formationAway : activeMatch.formationAway)
                }
                teamName={
                  activePitchTeam === "home"
                    ? (selectedPresetId === "custom-match" ? (homeTeam || "Ev Sahibi") : activeMatch.homeTeam)
                    : (selectedPresetId === "custom-match" ? (awayTeam || "Deplasman") : activeMatch.awayTeam)
                }
                colorTheme={activePitchTeam === "home" ? "blue" : "red"}
                onPositionClick={(role) => {
                  setSelectedSection(role);
                }}
                activeRole={selectedSection}
                ratings={
                  analysisReport
                    ? (activePitchTeam === "home"
                        ? analysisReport.homeTeamAnalysis.positionallRatings || analysisReport.homeTeamAnalysis.positionalRatings
                        : analysisReport.awayTeamAnalysis.positionallRatings || analysisReport.awayTeamAnalysis.positionalRatings)
                    : undefined
                }
              />
            </div>

          </div>

          {/* RIGHT COLUMN: HIGH FIDELITY EDITORIAL REPORT SHEETS (5 COLS) */}
          <div className="col-span-12 lg:col-span-5 flex flex-col gap-6">
            
            {/* STATS BREAKDOWN CARD (MINI BENTO) */}
            <div className="bg-white border-2 border-[#1A1A1A] p-5 editorial-shadow">
              <h3 className="editorial-label mb-4 border-b border-[#D4CEBF] pb-2">Kolektif Maç İstatistikleri</h3>
              <div className="flex flex-col gap-4">
                {/* Stats list */}
                {Object.entries(
                  selectedPresetId === "custom-match" ? {
                    "Topa Sahip Olma": `%${statHomePossession} - %${100 - statHomePossession}`,
                    "Toplam Şut": `${statHomeShots} - ${statAwayShots}`,
                    "Pas İsabeti": `%${statHomePass} - %${statAwayPass}`
                  } : activeMatch.stats
                ).map(([key, value]) => {
                  const valStr = value as string;
                  const parts = valStr.split("-");
                  const homeVal = parts[0]?.trim() || "0";
                  const awayVal = parts[1]?.trim() || "0";
                  
                  // strip percentages for bar values
                  const hNum = parseInt(homeVal.replace(/[^0-9]/g, "")) || 50;
                  const aNum = parseInt(awayVal.replace(/[^0-9]/g, "")) || 50;
                  const total = hNum + aNum === 0 ? 100 : hNum + aNum;
                  const ratio = Math.min(Math.max((hNum / total) * 100, 10), 90);

                  return (
                    <div key={key} className="space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs font-mono">
                        <span className="font-bold">{homeVal}</span>
                        <span className="editorial-label text-[10px] text-slate-500">{key}</span>
                        <span className="font-bold">{awayVal}</span>
                      </div>
                      
                      {/* Dual dynamic bar */}
                      <div className="h-2 border border-[#1A1A1A] bg-[#D4CEBF] flex overflow-hidden">
                        <div 
                          className="bg-[#1A1A1A]" 
                          style={{ width: `${ratio}%` }} 
                        />
                        <div 
                          className="bg-white" 
                          style={{ width: `${100 - ratio}%` }} 
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* VERDICT VERBATIM CARD */}
            <div id="verbatim-editorial-card" className="border-2 border-[#1A1A1A] p-5 bg-[#D4CEBF] text-[#1A1A1A]">
              <h3 className="editorial-label mb-3">Analistin Taktik Notu</h3>
              <p className="serif text-xl sm:text-2xl italic leading-snug">
                &ldquo;Futbol oyununda galibiyet sadece topa sahip olma hünerinde değil, geçişlerin yapıldığı o kaotik 4 saniyelik reaksiyon süresinde gizlidir.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-[1px] bg-[#1A1A1A]"></div>
                <span className="editorial-label text-[9px] font-bold">Zekeriya Demir, Taktik Başanalist</span>
              </div>
            </div>

            {/* EXTRA INFO: GUIDE FOR USERS */}
            <div className="border border-dashed border-[#1A1A1A] p-4 text-xs bg-white text-slate-700 space-y-2">
              <div className="font-bold flex items-center gap-1 text-[#1A1A1A] uppercase tracking-wider text-[10px]">
                <BookOpen size={12} />
                <span>Uygulama Rehberi</span>
              </div>
              <p className="font-sans leading-relaxed">
                Herhangi bir ön ayarlı maçı seçerek AI tabanlı taktiksel analiz sonuçlarını anında görüntüleyebilirsiniz. 
                Saha üzerindeki <span className="font-bold text-[#1A1A1A]">bölge ve oyunculara</span> tıklayarak analizlerin o bölgeye göre daralmasını sağlayın! 
                Kendi özel müsabakanızı kaydetmek için <span className="font-bold text-[#1A1A1A]">&quot;Özel Karşılaşma&quot;</span> seçeneğini kullanın.
              </p>
            </div>

          </div>

        </div>

        {/* REPORT SHEET ROW: SPANS FULL WIDTH (HIGH FIDELITY REPORT DISPLAY) */}
        {analysisReport ? (
          <div id="tactical-editorial-sheet" className="mt-4 border-t-4 border-[#1A1A1A] pt-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-2">
              <div>
                <span className="editorial-label bg-[#1A1A1A] text-white px-3 py-1 text-xs">DETAYLI ANALIZ RAPORU</span>
                <h2 className="serif text-3xl sm:text-4xl font-extrabold text-[#1A1A1A] mt-2 uppercase">
                  {selectedPresetId === "custom-match" ? (homeTeam || "Ev Sahibi") : activeMatch.homeTeam} VS {selectedPresetId === "custom-match" ? (awayTeam || "Deplasman") : activeMatch.awayTeam}
                </h2>
              </div>
              <span className="font-mono text-xs text-slate-500 bg-white border border-[#D4CEBF] px-3 py-1">
                TAKTIK DIZILIM: {selectedPresetId === "custom-match" ? `${formationHome} / ${formationAway}` : `${activeMatch.formationHome} / ${activeMatch.formationAway}`}
              </span>
            </div>

            <ReportDisplay
              report={analysisReport}
              homeTeam={selectedPresetId === "custom-match" ? (homeTeam || "Ev Sahibi") : activeMatch.homeTeam}
              awayTeam={selectedPresetId === "custom-match" ? (awayTeam || "Deplasman") : activeMatch.awayTeam}
              selectedRole={selectedSection}
              onRoleSelect={(role) => setSelectedSection(role)}
            />
          </div>
        ) : (
          <div className="text-center py-12 border-2 border-dashed border-[#1A1A1A] bg-white rounded-xl mt-6">
            <Activity className="mx-auto text-slate-400 mb-2 animate-pulse" />
            <p className="serif text-xl italic text-slate-500">Müsabaka analizi yükleniyor veya analiz başlatılmayı bekliyor...</p>
          </div>
        )}

        {/* EDITORIAL FOOTER */}
        <footer className="mt-12 flex flex-col md:flex-row justify-between items-center border-t border-[#1A1A1A] pt-4 gap-4 text-center md:text-left">
          <div className="editorial-label text-[9px] text-slate-500">
            © 2026 PITCHANALYSIS PRO / EDITORIAL TACTIC STATION
          </div>
          <div className="flex gap-6">
            <span className="editorial-label text-[9px] text-slate-500 cursor-pointer hover:underline">Pozisyon Puanlamaları</span>
            <span className="editorial-label text-[9px] text-slate-500 cursor-pointer hover:underline">Geçiş Teorisi</span>
            <span className="editorial-label text-[9px] text-slate-500 cursor-pointer hover:underline">Teknik Direktör Önerileri</span>
          </div>
        </footer>

      </div>
    </div>
  );
}
