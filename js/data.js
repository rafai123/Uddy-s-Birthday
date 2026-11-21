// Data Kenangan, Lokasi Spesial & Konfigurasi Retro Map
// Berdasarkan Dokumen Desain UX & Layar Infografis: a_detailed_infographic_ux_design_document_layout_o.png

export const LOCATIONS_DATA = [
  {
    id: 1,
    name: "Samosir",
    subtitle: "Danau, Dermaga & Perahu",
    dateText: "09 Juli 2026",
    description: "Keindahan Danau Toba yang tenang dari Pulau Samosir. Angin sejuk, perahu yang bersandar di dermaga, dan tawa kita yang tak pernah habis di setiap langkah perjalanan ini.",
    quote: "\"Di antara tenangnya riak air dan sejuknya angin danau, ada hatiku yang selalu menemukan kedamaian bersamamu.\"",
    folder: "Samosir",
    icon: "⛵",
    coords: { x: 420, y: 350 }, // Lokasi pulau/dermaga Danau Toba (kiri atas)
    themeColor: "#38bdf8",
    photos: [
      { file: "P_20260709_134413.jpg", caption: "Awal perjalanan kita menyeberang menuju Samosir." },
      { file: "P_20260709_150446.jpg", caption: "Senyum manis favoritku di tepi danau." },
      { file: "P_20260709_150501.jpg", caption: "Momen tenang menatap birunya air bersama." },
      { file: "P_20260709_150507.jpg", caption: "Tawa lepas yang membuat hariku selalu cerah." },
      { file: "P_20260709_165826.jpg", caption: "Dermaga kayu dan panorama alam yang luar biasa." },
      { file: "P_20260709_171410.jpg", caption: "Langkah-langkah kecil kita mengitari pulau." },
      { file: "P_20260709_171514.jpg", caption: "Cahaya sore yang menyinari wajahmu dengan indah." },
      { file: "P_20260709_175440.jpg", caption: "Menikmati hembusan angin menjelang matahari terbenam." },
      { file: "P_20260709_182114.jpg", caption: "Senja keemasan yang tak akan pernah kulupakan." },
      { file: "P_20260709_182220.jpg", caption: "Penutup hari terindah di pulau penuh kenangan ini." }
    ]
  },
  {
    id: 2,
    name: "Sinabung",
    subtitle: "Bukit, Pemandangan & Langit Senja",
    dateText: "11 Mei 2026",
    description: "Ketinggian bukit dengan latar Gunung Sinabung yang megah. Tempat kita saling menghangatkan tangan di tengah dinginnya udara pegunungan.",
    quote: "\"Setinggi apa pun puncak yang kita tatap, aku tahu perjalanan hidup akan selalu terasa ringan karena ada kamu di sampingku.\"",
    folder: "Gunung",
    icon: "🏔️",
    coords: { x: 260, y: 640 }, // Lereng perbukitan Sinabung (kiri tengah)
    themeColor: "#f59e0b",
    photos: [
      { file: "P_20260511_152727.jpg", caption: "Perjalanan mendaki bukit dengan semangat kita berdua." },
      { file: "P_20260511_164123.jpg", caption: "Kabut tipis dan udara dingin yang menyegarkan." },
      { file: "P_20260511_165419.jpg", caption: "Pemandangan megah dari atas ketinggian." },
      { file: "P_20260511_165426.jpg", caption: "Foto berdua dengan latar alam yang menakjubkan." },
      { file: "P_20260511_165434.jpg", caption: "Momen ketika angin bertiup kencang dan kita tertawa." },
      { file: "P_20260511_165436.jpg", caption: "Sudut pandang lain dari keindahan perbukitan." },
      { file: "P_20260511_165455.jpg", caption: "Kehangatan di tengah sejuknya angin pegunungan." },
      { file: "P_20260511_165517.jpg", caption: "Kamu yang selalu tampak bersinar di mana pun berada." },
      { file: "P_20260511_165529.jpg", caption: "Detik-detik berharga sebelum langit berganti jingga." },
      { file: "P_20260511_172625.jpg", caption: "Senja pegunungan yang mengunci momen manis ini." }
    ]
  },
  {
    id: 3,
    name: "Pantai",
    subtitle: "Pasir, Ombak & Matahari Terbenam",
    dateText: "17 - 22 Juni 2026",
    description: "Hamparan pasir, riak ombak yang berkejar-kejaran, dan warna jingga senja yang melukis langit. Tempat jejak kaki kita beriringan tanpa henti.",
    quote: "\"Seperti ombak yang selalu setia kembali memeluk pantai, begitu pula perasaanku yang tak pernah berhenti pulang kepadamu.\"",
    folder: "Pantai",
    icon: "🏖️",
    coords: { x: 960, y: 380 }, // Garis pantai pasir keemasan (kanan atas)
    themeColor: "#ec4899",
    photos: [
      { file: "P_20260617_181343.jpg", caption: "Suara ombak pertama yang menyambut kita di pantai." },
      { file: "P_20260617_181350.jpg", caption: "Langkah santai di atas pasir yang hangat." },
      { file: "P_20260617_181358.jpg", caption: "Cahaya matahari sore yang mulai meredup keemasan." },
      { file: "P_20260617_181411.jpg", caption: "Senyum lepas saat angin laut menyapa rambutmu." },
      { file: "P_20260617_181425.jpg", caption: "Siluet kita berdua menghadap luasnya cakrawala." },
      { file: "P_20260622_173605.jpg", caption: "Kembali lagi ke pantai favorit dengan rasa bahagia yang sama." },
      { file: "P_20260622_173831.jpg", caption: "Bercanda di bibir pantai dan bermain dengan buih ombak." },
      { file: "P_20260622_174433.jpg", caption: "Momen candid yang selalu membuatku tersenyum melihatnya." },
      { file: "P_20260622_175610.jpg", caption: "Langit mulai melukis gradasi warna ungu dan jingga." },
      { file: "P_20260622_180352.jpg", caption: "Detik-detik magis saat matahari perlahan tenggelam." },
      { file: "P_20260622_181324.jpg", caption: "Nuansa senja yang begitu romantis dan tenang." },
      { file: "P_20260622_181339.jpg", caption: "Genggaman tangan yang tak ingin kulepaskan." },
      { file: "P_20260622_181343.jpg", caption: "Kilau air laut memantulkan cahaya jingga sempurna." },
      { file: "P_20260622_181347.jpg", caption: "Salah satu foto favoritku di perjalanan kita." },
      { file: "P_20260622_181549.jpg", caption: "Langit petang yang menemani obrolan hangat kita." },
      { file: "P_20260622_182417.jpg", caption: "Malam mulai tiba, menutup hari pantai yang sempurna." }
    ]
  },
  {
    id: 4,
    name: "Meat",
    subtitle: "Desa, Pepohonan & Suasana Alami",
    dateText: "28 Mei 2026",
    description: "Keasrian desa Meat dengan lembah hijau, pepohonan rindang, dan angin sejuk pedesaan. Kesederhanaan yang menghadirkan kebahagiaan paling murni.",
    quote: "\"Bahagia itu sederhana: berjalan berdua di tempat yang tenang, membicarakan hal-hal kecil, dan tertawa bersama.\"",
    folder: "Meat",
    icon: "🌾",
    coords: { x: 580, y: 1040 }, // Lembah pedesaan hijau (tengah bawah)
    themeColor: "#10b981",
    photos: [
      { file: "P_20260528_170422.jpg", caption: "Suasana tenang di sudut desa Meat yang asri." },
      { file: "P_20260528_170539.jpg", caption: "Pepohonan hijau dan jalan setapak yang damai." },
      { file: "P_20260528_170817.jpg", caption: "Senyum manis di tengah hamparan alam yang hijau." },
      { file: "P_20260528_170855.jpg", caption: "Menikmati semilir angin pedesaan yang menyegarkan." },
      { file: "P_20260528_171009.jpg", caption: "Momen santai tanpa beban, hanya ada kita dan alam." },
      { file: "P_20260528_171049.jpg", caption: "Kehangatan canda tawa di setiap sudut langkah kita." },
      { file: "P_20260528_172035.jpg", caption: "Pemandangan sore yang meneduhkan hati di desa Meat." }
    ]
  },
  {
    id: 5,
    name: "Tongging",
    subtitle: "Tebing, Danau & Panorama Indah",
    dateText: "28 Okt - 04 Nov 2026",
    description: "Tebing tinggi Tongging yang menghadap langsung ke lautan Danau Toba. Titik tertinggi di mana kita bisa melihat luasnya cakrawala tak berujung.",
    quote: "\"Melihat dunia seluas ini dari atas tebing membuatku sadar, di antara jutaan manusia, aku paling bersyukur menemukanmu.\"",
    folder: "Tongging",
    icon: "🏞️",
    coords: { x: 960, y: 780 }, // Puncak tebing menghadap danau (kanan tengah)
    themeColor: "#8b5cf6",
    photos: [
      { file: "P_20261028_130503.jpg", caption: "Tiba di tebing Tongging dengan panorama luas memukau." },
      { file: "P_20261028_133605.jpg", caption: "Birunya danau dari ketinggian yang begitu menakjubkan." },
      { file: "P_20261028_134409.jpg", caption: "Foto dengan latar belakang tebing megah dan danau." },
      { file: "P_20261028_142907.jpg", caption: "Momen berkesan di tepi tebing yang spektakuler." },
      { file: "P_20261104_154500.jpg", caption: "Kunjungan kembali ke Tongging dengan udara segar." },
      { file: "P_20261104_154930.jpg", caption: "Gaya favoritmu yang selalu menggemaskan." },
      { file: "P_20261104_155550.jpg", caption: "Menatap ke bawah tebing sambil bercerita seru." },
      { file: "P_20261104_160830.jpg", caption: "Panorama hijau perbukitan yang membingkai danau." },
      { file: "P_20261104_171859.jpg", caption: "Langit sore mulai memancarkan cahaya keemasan." },
      { file: "P_20261104_172233.jpg", caption: "Pemandangan dramatis dari puncak tebing Tongging." },
      { file: "P_20261104_172256.jpg", caption: "Momen romantis tak terlupakan di tebing danau." },
      { file: "P_20261104_172418.jpg", caption: "Kabut lembut yang mulai turun perlahan di lembah." },
      { file: "P_20261104_172420.jpg", caption: "Kehangatan pelukan di tengah dinginnya angin sore." },
      { file: "P_20261104_173340.jpg", caption: "Senja magis yang melukis langit di atas danau." },
      { file: "P_20261104_173409.jpg", caption: "Kenangan indah terakhir sebelum perjalanan ulang tahunmu tiba." }
    ]
  }
];

// Area Rahasia (Our Little Universe)
export const SECRET_AREA = {
  id: 6,
  name: "Our Little Universe",
  subtitle: "Puncak Bintang & Surat Khusus",
  coords: { x: 580, y: 1420 }, // Pulau kosmik terapung di bagian paling bawah peta
  icon: "🌌",
  letterTitle: "Untuk Kamu yang Paling Berarti ❤️",
  letterBody: `Selamat Ulang Tahun yang ke-24, Sayang...

Hari ini, tanggal 26 November 2026, dunia merayakan hari lahirnya sosok yang paling istimewa dalam hidupku.

Melihat kembali semua jejak perjalanan kita — dari dinginnya perbukitan Sinabung, hangatnya matahari terbenam di Pantai, tenangnya riak air di Samosir, asrinya desa Meat, hingga megahnya tebing Tongging — aku menyadari satu hal yang pasti:

Di setiap tempat yang kita datangi, bukan pemandangannya yang membuatnya begitu indah, melainkan kehadiranmu di sampingku. Senyummu, tawamu, bahkan celoteh manjamu adalah hal paling berharga yang selalu menerangi setiap hariku.

Dunia kecil bergaya retro ini aku persembahkan khusus untuk merangkum momen-momen manis yang telah kita ukir bersama. Semoga di usiamu yang ke-24 ini:
✨ Semua impian dan harapan baikmu dimudahkan dan dikabulkan.
✨ Kamu senantiasa diberikan kesehatan, kebahagiaan, dan kedamaian hati.
✨ Langkahmu selalu dipenuhi cinta dan hal-hal yang membahagiakanmu.

Terima kasih telah menjadi teman perjalanan terbaik, tempat pulang ternyaman, dan cinta terindah bagiku. Aku berjanji akan terus ada di sisimu, merayakan ulang tahun ke-25, ke-30, dan seterusnya hingga kita menua bersama.

Selamat Ulang Tahun ke-24, Sayangku.
I love you to the moon, through all the stars, and back again. ❤️✨`,
  date: "26 November 2026"
};

// Helper untuk mendapatkan URL gambar optimal dan thumbnail
export function getPhotoUrl(folder, filename) {
  return `optimized/${folder}/${filename}`;
}

export function getThumbUrl(folder, filename) {
  return `optimized/${folder}/thumb_${filename}`;
}
