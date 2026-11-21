// Data Kenangan 5 Lokasi & Area Rahasia
// Konsep: Judul Lokasi - Spot, Tanggal Foto Asli, "Lucu juga kita ya wkwk", dan Anime Quotes yang relate & kocak!

export function formatPhotoDate(filename) {
  // Format nama file: P_YYYYMMDD_HHMMSS.jpg
  const match = filename.match(/P_(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})/);
  if (!match) return "2026";
  const months = [
    "", "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const [_, y, m, d, hh, mm] = match;
  const monthName = months[parseInt(m, 10)] || m;
  return `${parseInt(d, 10)} ${monthName} ${y} • ${hh}:${mm} WIB`;
}

export const LOCATIONS_DATA = [
  {
    id: 1,
    name: "Samosir",
    subtitle: "Dermaga & Danau Toba",
    dateText: "09 Juli 2026",
    quote: "Tenangnya danau, tapi yang paling bikin tenang tetap kamu.",
    folder: "Samosir",
    icon: "⛵",
    crystalColor: "#38bdf8",
    coords: { x: 420, y: 350 },
    photos: [
      {
        file: "P_20260709_134413.jpg",
        spot: "Dermaga Awal",
        animeQuote: { quote: "Aku tidak akan pernah menarik kembali kata-kataku, itulah jalan ninjaku!", by: "Naruto Uzumaki" }
      },
      {
        file: "P_20260709_150446.jpg",
        spot: "Tepi Danau Toba",
        animeQuote: { quote: "Kalau lapar ya makan, kalau capek ya istirahat, kalau ngambek ya harus dibujuk.", by: "Monkey D. Luffy" }
      },
      {
        file: "P_20260709_150501.jpg",
        spot: "Duduk Berdua",
        animeQuote: { quote: "Mendengarkan cewek ngedumel itu lebih merepotkan dari misi rank-S, tapi ya gimana, sayang.", by: "Shikamaru Nara" }
      },
      {
        file: "P_20260709_150507.jpg",
        spot: "Tawa Lepas",
        animeQuote: { quote: "Waku Waku! Hari ini seru banget keliling bareng kamu!", by: "Anya Forger" }
      },
      {
        file: "P_20260709_165826.jpg",
        spot: "Dermaga Kayu",
        animeQuote: { quote: "Tersesat di jalan yang benar itu wajar, apalagi jalannya bareng kamu.", by: "Roronoa Zoro" }
      },
      {
        file: "P_20260709_171410.jpg",
        spot: "Pesisir Samosir",
        animeQuote: { quote: "Menolak menyerah walau harus jalan kaki keliling pulau bareng kamu!", by: "Rock Lee" }
      },
      {
        file: "P_20260709_171514.jpg",
        spot: "Cahaya Sore",
        animeQuote: { quote: "Kekuatan sejati bukanlah memenangkan argumen, melainkan ngalah demi kedamaian.", by: "Kakashi Hatake" }
      },
      {
        file: "P_20260709_175440.jpg",
        spot: "Angin Senja",
        animeQuote: { quote: "Biar badai datang, selama ada bekal dan ada kamu, semua aman.", by: "Sanji" }
      },
      {
        file: "P_20260709_182114.jpg",
        spot: "Golden Hour",
        animeQuote: { quote: "Menatap senja bareng kamu rasanya langsung dapet buff EXP 200%.", by: "Kirito" }
      },
      {
        file: "P_20260709_182220.jpg",
        spot: "Senja Samosir",
        animeQuote: { quote: "Waktu yang dihabiskan bersama orang tersayang tidak pernah sia-sia.", by: "Frieren" }
      }
    ]
  },
  {
    id: 2,
    name: "Sinabung",
    subtitle: "Perbukitan & Langit Senja",
    dateText: "11 Mei 2026",
    quote: "Dinginnya angin bukit, tapi hati selalu hangat di dekatmu.",
    folder: "Gunung",
    icon: "🏔️",
    crystalColor: "#f59e0b",
    coords: { x: 260, y: 640 },
    photos: [
      {
        file: "P_20260511_152727.jpg",
        spot: "Lereng Bukit",
        animeQuote: { quote: "Mendaki bukit aja sanggup, masa sabar ngadepin kamu gak sanggup?", by: "Tanjiro Kamado" }
      },
      {
        file: "P_20260511_164123.jpg",
        spot: "Kabut Pegunungan",
        animeQuote: { quote: "Dinginnya kabut gak berasa kalau ada di dekatmu.", by: "Giyu Tomioka" }
      },
      {
        file: "P_20260511_165419.jpg",
        spot: "Puncak Ketinggian",
        animeQuote: { quote: "Dari puncak sini, yang paling kelihatan bersinar cuma senyummu.", by: "Gojo Satoru" }
      },
      {
        file: "P_20260511_165426.jpg",
        spot: "Panorama Sinabung",
        animeQuote: { quote: "Pertandingan bahkan baru dimulai, jangan nyerah dulu!", by: "Coach Anzai (Slam Dunk)" }
      },
      {
        file: "P_20260511_165434.jpg",
        spot: "Angin Kencang",
        animeQuote: { quote: "Rambut boleh berantakan kena angin, yang penting pose tetap on-point.", by: "Nobara Kugisaki" }
      },
      {
        file: "P_20260511_165436.jpg",
        spot: "Sudut Lembah",
        animeQuote: { quote: "Kenapa harus pusing mikirin hal berat? Yang penting hari ini kita happy.", by: "Gintoki Sakata" }
      },
      {
        file: "P_20260511_165455.jpg",
        spot: "Genggaman Hangat",
        animeQuote: { quote: "Bahkan jutsu terkuat pun kalah sama hangatnya genggaman tangan.", by: "Minato Namikaze" }
      },
      {
        file: "P_20260511_165517.jpg",
        spot: "Pesona Bukit",
        animeQuote: { quote: "Mau seberapa sering kamu ngambek, ujung-ujungnya tetap aku bujuk.", by: "Sasuke Uchiha" }
      },
      {
        file: "P_20260511_165529.jpg",
        spot: "Cakrawala Awan",
        animeQuote: { quote: "Aku hanya ingin hidup santai seperti awan... bareng kamu.", by: "Shikamaru Nara" }
      },
      {
        file: "P_20260511_172625.jpg",
        spot: "Senja Sinabung",
        animeQuote: { quote: "Hari ini ditutup dengan pemandangan indah dan tawa yang gak ada habisnya.", by: "Gon Freecss" }
      }
    ]
  },
  {
    id: 3,
    name: "Pantai",
    subtitle: "Pasir & Matahari Terbenam",
    dateText: "17 - 22 Juni 2026",
    quote: "Seperti ombak pulang ke pantai, hatiku selalu pulang ke kamu.",
    folder: "Pantai",
    icon: "🏖️",
    crystalColor: "#ec4899",
    coords: { x: 960, y: 380 },
    photos: [
      {
        file: "P_20260617_181343.jpg",
        spot: "Buih Ombak",
        animeQuote: { quote: "Laut itu luas, tapi tempat berlabuhku cuma satu: kamu.", by: "Monkey D. Luffy" }
      },
      {
        file: "P_20260617_181350.jpg",
        spot: "Langkah Pasir",
        animeQuote: { quote: "Jalan santai di pantai itu obat paling ampuh buat ngilangin penat.", by: "Chopper" }
      },
      {
        file: "P_20260617_181358.jpg",
        spot: "Matahari Sore",
        animeQuote: { quote: "Matahari terbenam memang cantik, tapi jangan lupa jajan es kelapa.", by: "Usopp" }
      },
      {
        file: "P_20260617_181411.jpg",
        spot: "Angin Pesisir",
        animeQuote: { quote: "Angin laut berhembus kencang, tapi perasaanku ke kamu tetap tenang.", by: "Portgas D. Ace" }
      },
      {
        file: "P_20260617_181425.jpg",
        spot: "Siluet Pantai",
        animeQuote: { quote: "Siluet berdua di tepi pantai, vibes-nya kayak opening anime romcom.", by: "Loid Forger" }
      },
      {
        file: "P_20260622_173605.jpg",
        spot: "Pesisir Kedua",
        animeQuote: { quote: "Balik lagi ke pantai, bahagia yang dirasa tetap 100% sama.", by: "Hinata Shoyo" }
      },
      {
        file: "P_20260622_173831.jpg",
        spot: "Main Ombak",
        animeQuote: { quote: "Hati-hati kena basah ombak, nanti kalau flu siapa yang manjain?", by: "Trafalgar Law" }
      },
      {
        file: "P_20260622_174433.jpg",
        spot: "Momen Candid",
        animeQuote: { quote: "Pose candid tapi hasilnya gemes, ini pasti pake cheat code.", by: "Saitama" }
      },
      {
        file: "P_20260622_175610.jpg",
        spot: "Langit Gradasi",
        animeQuote: { quote: "Langit sore ungu-jingga, pemandangan level SSR!", by: "Megumi Fushiguro" }
      },
      {
        file: "P_20260622_180352.jpg",
        spot: "Detik Matahari Turun",
        animeQuote: { quote: "Waktu jangan cepet-cepet berlalu dong, momen ini lagi seru-serunya.", by: "Doraemon" }
      },
      {
        file: "P_20260622_181324.jpg",
        spot: "Senja Tenang",
        animeQuote: { quote: "Matahari terbenam itu indah, tapi lebih indah kalau gak ada yang ngambek.", by: "Kakashi Hatake" }
      },
      {
        file: "P_20260622_181339.jpg",
        spot: "Genggaman Pantai",
        animeQuote: { quote: "Genggaman tangan ini segel terkuat yang gak bakal lepas.", by: "Gaara" }
      },
      {
        file: "P_20260622_181343.jpg",
        spot: "Kilau Air Laut",
        animeQuote: { quote: "Kilauan air laut kalah terang dibanding matamu yang berbinar.", by: "Sanji" }
      },
      {
        file: "P_20260622_181347.jpg",
        spot: "Foto Favorit",
        animeQuote: { quote: "Satu foto seribu cerita, dan semuanya tentang ketawa bareng.", by: "Killua Zoldyck" }
      },
      {
        file: "P_20260622_181549.jpg",
        spot: "Ngobrol Petang",
        animeQuote: { quote: "Ngobrol receh tapi bikin ketawa sampai perut mules, resep bahagia.", by: "Kageyama Tobio" }
      },
      {
        file: "P_20260622_182417.jpg",
        spot: "Malam Pesisir",
        animeQuote: { quote: "Malam tiba, misi liburan pantai hari ini sukses besar!", by: "Naruto Uzumaki" }
      }
    ]
  },
  {
    id: 4,
    name: "Meat",
    subtitle: "Lembah Hijau Pedesaan",
    dateText: "28 Mei 2026",
    quote: "Bahagia itu sederhana: jalan berdua dan ketawa bareng kamu.",
    folder: "Meat",
    icon: "🌾",
    crystalColor: "#10b981",
    coords: { x: 580, y: 1040 },
    photos: [
      {
        file: "P_20260528_170422.jpg",
        spot: "Desa Asri Meat",
        animeQuote: { quote: "Suasana desa yang tenang, pas banget buat healing dari rutinitas.", by: "Tanjiro Kamado" }
      },
      {
        file: "P_20260528_170539.jpg",
        spot: "Pematang Lembah",
        animeQuote: { quote: "Jalan di pematang sawah, serasa masuk ke film Ghibli.", by: "Totoro" }
      },
      {
        file: "P_20260528_170817.jpg",
        spot: "Senyum Manis",
        animeQuote: { quote: "Senyuman manis yang sanggup mengalahkan jurus terkuat sekalipun.", by: "All Might" }
      },
      {
        file: "P_20260528_170855.jpg",
        spot: "Semilir Angin Sawah",
        animeQuote: { quote: "Angin desa yang sejuk, bikin pengen leyeh-leyeh terus.", by: "Shikamaru Nara" }
      },
      {
        file: "P_20260528_171009.jpg",
        spot: "Jalan Santai",
        animeQuote: { quote: "Gak perlu buru-buru, nikmati setiap langkah kecil kita.", by: "Frieren" }
      },
      {
        file: "P_20260528_171049.jpg",
        spot: "Canda Tawa",
        animeQuote: { quote: "Ketawa bareng kamu itu obat paling mujarab di dunia.", by: "Chopper" }
      },
      {
        file: "P_20260528_172035.jpg",
        spot: "Sore Tenang Meat",
        animeQuote: { quote: "Hari yang damai di Meat, kenangan manis yang tersimpan rapi.", by: "Haku" }
      }
    ]
  },
  {
    id: 5,
    name: "Tongging",
    subtitle: "Tebing Tinggi Danau Toba",
    dateText: "28 Okt - 04 Nov 2026",
    quote: "Dari atas tebing seluas ini, aku bersyukur menemukan kamu.",
    folder: "Tongging",
    icon: "🏞️",
    crystalColor: "#a855f7",
    coords: { x: 960, y: 780 },
    photos: [
      {
        file: "P_20261028_130503.jpg",
        spot: "Puncak Tebing",
        animeQuote: { quote: "Dari atas tebing ini, dunia berasa luas banget, tapi hatiku cuma buat kamu.", by: "Monkey D. Luffy" }
      },
      {
        file: "P_20261028_133605.jpg",
        spot: "Panorama Danau",
        animeQuote: { quote: "Birunya Danau Toba dari atas sini bener-bener luar biasa!", by: "Roronoa Zoro" }
      },
      {
        file: "P_20261028_134409.jpg",
        spot: "Spot Tebing Megah",
        animeQuote: { quote: "Kekuatan terbesar ada pada mereka yang berani jalan berdua sampai ke puncak.", by: "Son Goku" }
      },
      {
        file: "P_20261028_142907.jpg",
        spot: "Tepi Tebing",
        animeQuote: { quote: "Tinggi banget tebingnya, untung ada yang bisa dipegangin tangannya.", by: "Usopp" }
      },
      {
        file: "P_20261104_154500.jpg",
        spot: "Kunjungan Kedua",
        animeQuote: { quote: "Balik lagi ke tempat yang sama, tapi rasa sayangnya nambah terus.", by: "Edward Elric" }
      },
      {
        file: "P_20261104_154930.jpg",
        spot: "Pose Gemas",
        animeQuote: { quote: "Gaya fotomu selalu juara, gak ada tandingannya di semesta anime!", by: "Anya Forger" }
      },
      {
        file: "P_20261104_155550.jpg",
        spot: "Ngobrol Ketinggian",
        animeQuote: { quote: "Ngobrol di pinggir tebing sambil liatin danau, syahdu pol.", by: "Kakashi Hatake" }
      },
      {
        file: "P_20261104_160830.jpg",
        spot: "Perbukitan Hijau",
        animeQuote: { quote: "Pemandangan hijau yang bikin adem mata dan pikiran.", by: "Jiraiya" }
      },
      {
        file: "P_20261104_171859.jpg",
        spot: "Cahaya Emas",
        animeQuote: { quote: "Golden hour di Tongging, momen cinematic yang wajib diabadikan.", by: "Levi Ackerman" }
      },
      {
        file: "P_20261104_172233.jpg",
        spot: "Puncak Tongging",
        animeQuote: { quote: "Semua perjuangan naik bukit langsung lunas pas liat pemandangan ini.", by: "Eren Yeager" }
      },
      {
        file: "P_20261104_172256.jpg",
        spot: "Momen Manis",
        animeQuote: { quote: "Senyummu itu seperti senjutsu, memberi energi positif tak terbatas.", by: "Naruto Uzumaki" }
      },
      {
        file: "P_20261104_172418.jpg",
        spot: "Kabut Lembah",
        animeQuote: { quote: "Kabut mulai turun, tapi kehangatan kita gak pernah pudar.", by: "Tomioka Giyu" }
      },
      {
        file: "P_20261104_172420.jpg",
        spot: "Duduk Sore",
        animeQuote: { quote: "Duduk berdua di udara dingin, rasanya damai banget.", by: "Kirito" }
      },
      {
        file: "P_20261104_173340.jpg",
        spot: "Senja Magis",
        animeQuote: { quote: "Senja magis di Danau Toba, momen yang bakal selalu kuingat.", by: "Frieren" }
      },
      {
        file: "P_20261104_173409.jpg",
        spot: "Kenangan Terakhir",
        animeQuote: { quote: "Perjalanan indah ini baru permulaan, petualangan kita masih panjang!", by: "Monkey D. Luffy" }
      }
    ]
  }
];

// Area Rahasia (Our Little Universe)
export const SECRET_AREA = {
  id: 6,
  name: "Our Little Universe",
  subtitle: "Pulau Bintang & Kristal Abadi",
  coords: { x: 580, y: 1420 },
  icon: "🌌",
  letterTitle: "Untuk Udy, Kekasihku Tercinta ❤️",
  letterBody: `Selamat Ulang Tahun yang ke-24, Sayang...

Hari ini, 26 November 2026, adalah hari lahirnya seseorang yang paling berharga dalam hidupku.

Melihat kembali semua jejak perjalanan kita — dari dinginnya bukit Sinabung, hangatnya senja di Pantai, tenangnya danau di Samosir, asrinya desa Meat, hingga megahnya tebing Tongging — aku makin yakin: tempat mana pun terasa indah karena ada kamu di sisiku.

Semoga di umur 24 tahun ini:
✨ Semua doa dan impian baikmu dikabulkan Tuhan.
✨ Kamu selalu sehat, bahagia, dan tenang hatinya.
✨ Jangan tukang emosian, kalo diajak tukar pikiran jangan ngambek terus yaa! 😜

Terima kasih sudah jadi teman hidup terbaik dan cinta ternyamanku. Aku berjanji akan terus ada buat kamu, merayakan ulang tahun ke-25, ke-30, dan seterusnya.

Selamat ulang tahun, Sayang. I love you so much. ❤️✨`,
  date: "26 November 2026"
};

export function getPhotoUrl(folder, filename) {
  return `/optimized/${folder}/${filename}`;
}

export function getThumbUrl(folder, filename) {
  return `/optimized/${folder}/thumb_${filename}`;
}
