/* ==========================================================================
   SCRIPT.JS - MEDIA PEMBELAJARAN INTERAKTIF: KEAMANAN DATA DAN INFORMASI
   Informatika SMP/MTs (Kelas 8-9) - Vanilla JavaScript Murni
   ========================================================================== */

// ==========================================================================
// 1. STATE MANAJEMEN APLIKASI
// ==========================================================================
const APP_STATE = {
  currentSection: 'beranda',
  progress: {
    visitedSections: new Set(['beranda']),
    act1Completed: false,
    act2Completed: false,
    act3Completed: false,
    act4Completed: false,
    act5Completed: false,
    quizCompleted: false,
    commitmentsCount: 0
  },
  audio: {
    enabled: true
  },
  // Aktivitas 1: Urutkan Alur Tanggap Darurat Akun
  act1Items: [],
  // Aktivitas 2: Jodohkan Istilah Keamanan
  act2SelectedLeft: null,
  act2Matches: {},
  // Aktivitas 3: Kasus Analitis HOTS Audit Keamanan Akun
  act3Answers: { 1: null, 2: null, 3: null },
  // Aktivitas 4: Clash of Champions Memory Battle
  coc: {
    cards: [],
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    streak: 0,
    maxStreak: 0,
    isPlaying: false,
    isBusy: false,
    startTime: 0,
    elapsedMs: 0,
    timerInterval: null,
    bestTimeMs: null,
    audioEnabled: true
  },
  // Aktivitas 5: Battle Regu Kelas Multiplayer
  battle: {
    teamCount: 6,
    scores: { alpha: 0, beta: 0, gamma: 0, delta: 0, epsilon: 0, zeta: 0 },
    wheelAngle: 0,
    isSpinning: false,
    currentChallenge: null,
    usedChallengeIds: [],
    timerSec: 15,
    timerInterval: null
  },
  // Kuis State
  quiz: {
    currentIndex: 0,
    userAnswers: {},
    isFinished: false
  },
  // Komitmen 10 Aturan Emas
  commitments: new Set()
};
// ==========================================================================
// 2. DATA 8 ANCAMAN DATA DAN INFORMASI
// ==========================================================================
const THREATS_DATA = [
  {
    id: 'phishing',
    title: 'Phishing',
    subtitle: 'Umpan Penipuan Tautan Palsu',
    badge: 'Tingkat Bahaya: Tinggi',
    badgeClass: 'badge-high',
    icon: '🎣',
    summary: 'Upaya menjebak korban agar menyerahkan password, kode OTP, atau data pribadi lewat tautan/pesan tiruan.',
    def: 'Phishing adalah kejahatan digital dengan cara membuat pesan, SMS, chat, atau situs web palsu yang menyerupai aslinya demi memancing korban membocorkan informasi rahasia akun.',
    caseExample: 'Budi menerima pesan WhatsApp dari nomor asing yang memberi tautan "Hadiah 1000 Diamond Game Gratis". Saat link dibuka, ada tampilan mirip login game yang meminta password dan email Budi.',
    signs: 'Tautan (URL) aneh dan tidak resmi (misal domain .xyz, bukan domain resmi perusahaan), menggunakan kata-kata mendesak seperti "Akunmu diblokir dalam 1 jam!", dan meminta kode rahasia atau password.',
    prevent: 'Jangan pernah klik link dari orang tak dikenal. Periksa alamat website di address bar browser dengan teliti. Ingat bahwa pihak resmi tidak pernah meminta kata sandimu!'
  },
  {
    id: 'malware',
    title: 'Malware & Virus',
    subtitle: 'Program Perusak & Pengganggu',
    badge: 'Tingkat Bahaya: Tinggi',
    badgeClass: 'badge-high',
    icon: '🦠',
    summary: 'Perangkat lunak berbahaya yang menyusup ke smartphone atau laptop untuk merusak sistem atau mencuri data.',
    def: 'Malware (Malicious Software) adalah istilah umum untuk semua jenis program komputer jahat, termasuk virus perusak file, spyware pemantau ketikan, dan ransomware penyandera data.',
    caseExample: 'Siti mengunduh game Android modifikasi dari situs web bajakan gratisan. Setelah dipasang, ponselnya mendadak sangat panas, baterai cepat habis, dan muncul banyak iklan tidak senonoh.',
    signs: 'Gawai bekerja sangat lambat, baterai terkuras cepat tanpa sebab, memori cepat penuh, muncul jendela iklan secara tiba-tiba, atau aplikasi terbuka sendiri.',
    prevent: 'Hanya unduh dan pasang aplikasi dari toko resmi (Google Play Store / Apple App Store). Jangan membuka lampiran file asing berakhiran .apk atau .exe. Selalu aktifkan fitur keamanan bawaan sistem.'
  },
  {
    id: 'weak_password',
    title: 'Password Lemah',
    subtitle: 'Kata Sandi Gampang Ditebak',
    badge: 'Tingkat Bahaya: Sedang',
    badgeClass: 'badge-med',
    icon: '🔐',
    summary: 'Penggunaan kata sandi sederhana seperti 123456, nama sendiri, atau tanggal lahir yang sangat mudah dibobol.',
    def: 'Password lemah adalah kata sandi yang terlalu pendek, tidak memiliki variasi karakter, atau menggunakan informasi umum tentang pemilik akun yang mudah diketahui orang lain.',
    caseExample: 'Andi menggunakan password "andi2010" untuk akun Instagram-nya. Teman sekelasnya yang iseng berhasil menebak password tersebut hanya dalam 2 kali percobaan saat istirahat sekolah.',
    signs: 'Password hanya terdiri dari angka urut (123456), nama panggilan, tanggal lahir, atau kata umum yang ada di kamus seperti "admin" atau "rahasia".',
    prevent: 'Buat password minimal 8-12 karakter dengan menggabungkan huruf besar, huruf kecil, angka, dan simbol (misal: "Kucing#Lompat88!"). Jangan gunakan tanggal lahir atau nama diri.'
  },
  {
    id: 'account_takeover',
    title: 'Pencurian Akun',
    subtitle: 'Pembajakan Akun (Takeover)',
    badge: 'Tingkat Bahaya: Tinggi',
    badgeClass: 'badge-high',
    icon: '📱',
    summary: 'Kondisi di mana orang lain berhasil masuk dan menguasai akun media sosial, game, atau email milik korban.',
    def: 'Pencurian akun terjadi saat orang tidak berhak memperoleh data login korban lalu mengubah password dan email pemulihan, sehingga korban terkunci dan kehilangan akses seutuhnya.',
    caseExample: 'Akun TikTok milik Rina dibajak orang. Pembajak tersebut mengirim pesan ke teman-teman Rina untuk meminjam uang pulsa dengan alasan darurat.',
    signs: 'Mendapat notifikasi login dari lokasi atau perangkat asing, email atau nomor HP pemulihan tiba-tiba berganti, atau akun memposting hal-hal aneh di luar kendali kita.',
    prevent: 'Aktifkan Verifikasi Dua Langkah (Two-Factor Authentication / 2FA) pada setiap akun. Jangan biarkan akun tetap login di komputer sekolah atau warnet. Segera lakukan logout setelah selesai.'
  },
  {
    id: 'data_leak',
    title: 'Kebocoran Data Pribadi',
    subtitle: 'Data Breach & Doxxing',
    badge: 'Tingkat Bahaya: Tinggi',
    badgeClass: 'badge-high',
    icon: '👤',
    summary: 'Tereksposnya informasi rahasia seperti nomor telepon, kartu keluarga, atau alamat rumah ke ruang publik internet.',
    def: 'Kebocoran data terjadi saat data sensitif tersebar di internet, baik karena sistem aplikasi diretas atau karena kelalaian pengguna yang sembarangan mengunggah foto dokumen penting.',
    caseExample: 'Seorang siswa mengunggah foto kartu rapor dan kartu pelajar ke status WhatsApp untuk pamer nilai. Tanpa disadari, NIK, NISN, dan alamat rumahnya kini bisa dilihat dan disimpan orang lain.',
    signs: 'Menerima banyak telepon penawaran spam atau teror dari nomor tak dikenal, atau melihat data pribadimu diperjualbelikan di grup media sosial.',
    prevent: 'Jangan pernah memposting foto identitas resmi (KK, KTP orang tua, rapor, tiket pesawat, kartu pelajar). Pasang pengaturan akun media sosial sebagai "Akun Privat".'
  },
  {
    id: 'online_scam',
    title: 'Penipuan Online',
    subtitle: 'Online Scam & Iming-iming Palsu',
    badge: 'Tingkat Bahaya: Sedang',
    badgeClass: 'badge-med',
    icon: '📢',
    summary: 'Modus tipu daya dengan iming-iming hadiah gratis, giveaway palsu, atau jual beli barang game fiktif murah meriah.',
    def: 'Penipuan online adalah kejahatan manipulasi psikologis di mana pelaku membujuk korban agar mentransfer uang, pulsa, atau akun dengan janji imbalan berlipat yang sebenarnya tidak ada.',
    caseExample: 'Doni tergiur membeli akun game mahal yang dijual hanya seharga Rp 20.000 di media sosial. Setelah Doni mentransfer pulsa, penjual langsung memblokir kontak Doni dan kabur.',
    signs: 'Harga barang tidak masuk akal murahnya, penjual menolak menggunakan metode resmi, dan mendesak korban untuk segera mentransfer dalam hitungan menit.',
    prevent: 'Selalu ingat pepatah: "Jika sesuatu terdengar terlalu muluk untuk menjadi kenyataan, biasanya itu adalah penipuan." Bicarakan terlebih dahulu dengan orang tua sebelum melakukan transaksi online.'
  },
  {
    id: 'identity_theft',
    title: 'Penyalahgunaan Identitas',
    subtitle: 'Akun Palsu & Tiruan (Impersonation)',
    badge: 'Tingkat Bahaya: Sedang',
    badgeClass: 'badge-med',
    icon: '🕵️',
    summary: 'Pelaku membuat akun media sosial menggunakan foto dan nama orang lain untuk berbuat jahat atau merusak reputasi.',
    def: 'Penyalahgunaan identitas digital terjadi ketika pelaku menyamar sebagai orang lain dengan mencuri foto profil dan biodata korban untuk menipu rekan-rekannya.',
    caseExample: 'Ada akun Instagram baru yang menggunakan foto dan nama Dini. Akun palsu tersebut mem-follow semua teman Dini dan mengirimkan kata-kata kasar untuk menjelekkan nama Dini.',
    signs: 'Teman-teman memberitahu bahwa ada akun dengan nama dan fotomu yang mengirim pesan aneh, padahal kamu tidak pernah membuat akun tersebut.',
    prevent: 'Laporkan (Report) akun palsu tersebut ke pengelola media sosial bersama bantuan teman-teman. Pasang watermark halus pada foto profil dan hindari mengumbar foto pribadi secara publik.'
  },
  {
    id: 'bad_footprint',
    title: 'Jejak Digital Tidak Bijak',
    subtitle: 'Over-sharing & Jejak Buruk',
    badge: 'Tingkat Bahaya: Sedang',
    badgeClass: 'badge-med',
    icon: '🌐',
    summary: 'Komentar kebencian, foto tidak pantas, atau curhatan kemarahan yang dapat mencoreng masa depan dan reputasi diri.',
    def: 'Jejak digital negatif adalah rekaman perkataan kasar, bullying, atau unggahan memalukan yang tertinggal di internet dan dapat ditemukan kembali bertahun-tahun kemudian.',
    caseExample: 'Seorang alumni SMP gagal lolos seleksi beasiswa karena panitia seleksi menemukan jejak komentarnya di masa lalu yang berisi hinaan bernada SARA di forum publik.',
    signs: 'Kebiasaan melampiaskan amarah di media sosial, menghina fisik orang lain di kolom komentar, atau ikut-ikutan menyebarkan gosip yang belum pasti.',
    prevent: 'Terapkan aturan: "Pikirkan sebelum memposting!". Selalu bayangkan apakah orang tua, guru, dan teman-temanmu akan tetap menghargaimu jika mereka membaca apa yang kamu tulis di internet.'
  }
];

// ==========================================================================
// 3. DATA 10 SOAL KUIS EVALUASI PEMAHAMAN SISWA
// ==========================================================================
const QUIZ_QUESTIONS = [
  {
    category: "1. Pengertian Data dan Informasi",
    question: "Manakah di bawah ini yang merupakan contoh perubahan dari DATA mentah menjadi sebuah INFORMASI yang bermakna?",
    options: [
      { letter: "A", text: "Deretan angka 75, 80, 90 diubah menjadi angka 90, 80, 75." },
      { letter: "B", text: "Catatan nilai harian siswa diolah menjadi kesimpulan: 'Sebagian besar siswa tuntas pelajaran Informatika'." },
      { letter: "C", text: "Menyalin nama-nama siswa dari buku catatan ke kertas selembar tanpa dihitung." },
      { letter: "D", text: "Menyebutkan angka 100 berulang kali di depan kelas." }
    ],
    correct: "B",
    explanation: "Data adalah fakta mentah (seperti angka nilai harian), sedangkan informasi adalah hasil olahan data yang memiliki makna dan dapat dipahami manusia (seperti kesimpulan ketuntasan belajar)."
  },
  {
    category: "2. Perlindungan Data Pribadi",
    question: "Mengapa kita harus melindungi data pribadi kita dengan sungguh-sungguh saat menggunakan internet?",
    options: [
      { letter: "A", text: "Agar kuota internet di smartphone kita tidak cepat habis." },
      { letter: "B", text: "Karena data pribadi yang bocor dapat dicuri, disalahgunakan untuk penipuan, atau mengganggu privasi kita." },
      { letter: "C", text: "Agar smartphone kita tidak kehabisan daya baterai saat bermain game." },
      { letter: "D", text: "Supaya kita tidak perlu lagi belajar bersama guru di sekolah." }
    ],
    correct: "B",
    explanation: "Data pribadi sangat berharga. Jika disalahgunakan oleh pihak jahat, mereka bisa melakukan penipuan atas namamu, membobol akun, atau mempermalukan korban."
  },
  {
    category: "3. Membedakan Jenis Data",
    question: "Dari daftar informasi berikut, manakah data yang tergolong SENSITIF dan HARUS DIJAGA kerahasiaannya?",
    options: [
      { letter: "A", text: "Warna sepatu favorit dan makanan kesukaan." },
      { letter: "B", text: "Judul lagu pop kesukaan dan hobi bermain catur." },
      { letter: "C", text: "Kata sandi email, kode OTP, dan alamat rumah lengkap." },
      { letter: "D", text: "Jadwal jam masuk dan jam pulang sekolah." }
    ],
    correct: "C",
    explanation: "Kata sandi, kode OTP, dan alamat rumah adalah data pribadi sensitif yang dapat membahayakan keamanan fisik dan akun jika diketahui orang lain."
  },
  {
    category: "4. Password yang Kuat",
    question: "Manakah di antara pilihan berikut yang merupakan contoh kata sandi (password) paling kuat dan aman?",
    options: [
      { letter: "A", text: "12345678" },
      { letter: "B", text: "budi2010" },
      { letter: "C", text: "password" },
      { letter: "D", text: "Bintang#M4lam!99" }
    ],
    correct: "D",
    explanation: "Password kuat harus terdiri dari minimal 8-12 karakter, menggabungkan huruf besar, huruf kecil, angka, dan simbol unik, serta bukan nama diri atau urutan angka umum."
  },
  {
    category: "5. Kode OTP (One-Time Password)",
    question: "Kamu menerima SMS berisi 6 digit kode OTP login. Beberapa saat kemudian ada seseorang menelepon mengaku dari customer service aplikasi dan meminta kode tersebut. Apa tindakan paling tepat?",
    options: [
      { letter: "A", text: "Memberikan kode tersebut karena penelpon terdengar ramah dan meyakinkan." },
      { letter: "B", text: "Menolak memberikan kode OTP dan segera memutus sambungan telepon." },
      { letter: "C", text: "Mengirimkan screenshot SMS tersebut melalui WhatsApp." },
      { letter: "D", text: "Meminta bantuan adik untuk membacakan kode tersebut ke penelpon." }
    ],
    correct: "B",
    explanation: "Aturan emas OTP: JANGAN PERNAH bagikan kode OTP kepada siapa pun! Petugas resmi dari perusahaan manapun tidak akan pernah meminta kode OTP pengguna."
  },
  {
    category: "6. Mengenali Phishing",
    question: "Sebuah pesan di WhatsApp berbunyi: 'Selamat! Akun kamu menang giveaway iPhone 15, klik tautan: klaim-hadiah-gratis.xyz dan masukkan password emailmu sekarang!'. Ciri phishing apa saja yang ada pada pesan ini?",
    options: [
      { letter: "A", text: "Menawarkan hadiah tidak masuk akal, tautan situs tidak resmi (.xyz), dan meminta password rahasia." },
      { letter: "B", text: "Pesan tersebut menggunakan bahasa Indonesia yang baik dan benar." },
      { letter: "C", text: "Pesan tersebut dikirim pada pagi hari saat jam sekolah." },
      { letter: "D", text: "Pesan tersebut tidak memiliki ciri mencurigakan sama sekali." }
    ],
    correct: "A",
    explanation: "Pesan tersebut memiliki 3 tanda bahaya klasik phishing: iming-iming hadiah absurd, URL tidak lazim (.xyz), dan memancing password email korban."
  },
  {
    category: "7. Pemahaman Malware dan Virus",
    question: "Apa perbedaan paling mendasar antara virus komputer biasa dengan ransomware?",
    options: [
      { letter: "A", text: "Virus membuat gawai dingin, sedangkan ransomware membuat gawai panas." },
      { letter: "B", text: "Virus merusak file/sistem, sedangkan ransomware mengunci data dan memeras korban dengan meminta uang tebusan." },
      { letter: "C", text: "Ransomware hanya menyerang kalkulator, sedangkan virus menyerang printer." },
      { letter: "D", text: "Virus dan ransomware sama sekali tidak berbahaya bagi pengguna." }
    ],
    correct: "B",
    explanation: "Ransomware adalah jenis malware khusus yang mengenkripsi atau mengunci akses ke file korban, lalu pelakunya menuntut tebusan uang untuk membuka kunci tersebut."
  },
  {
    category: "8. Privasi di Media Sosial",
    question: "Andi baru saja mengambil foto lucu temannya yang sedang tidur pulas dengan mulut terbuka di kelas. Apa yang seharusnya dilakukan Andi jika ingin mengunggah foto tersebut ke media sosial?",
    options: [
      { letter: "A", text: "Langsung mengunggahnya agar mendapatkan banyak 'likes' dari teman-teman." },
      { letter: "B", text: "Meminta izin terlebih dahulu kepada temannya dan menghargai keputusannya jika ia tidak setuju." },
      { letter: "C", text: "Menandai seluruh guru dan kepala sekolah pada foto tersebut." },
      { letter: "D", text: "Mengirimkannya ke grup umum tanpa memberitahu temannya." }
    ],
    correct: "B",
    explanation: "Menghormati privasi orang lain adalah etika penting di era digital. Jangan pernah mengunggah foto orang lain tanpa izin, terutama foto yang berpotensi mempermalukan dirinya."
  },
  {
    category: "9. Jejak Digital (Digital Footprint)",
    question: "Mengapa kita harus berhati-hati dan berpikir sebelum menulis komentar atau mengunggah sesuatu di internet?",
    options: [
      { letter: "A", text: "Karena kuota internet akan berkurang dua kali lipat setiap kali memposting komentar." },
      { letter: "B", text: "Karena jejak digital bersifat permanen dan sulit dihapus sepenuhnya serta bisa berdampak pada reputasi di masa depan." },
      { letter: "C", text: "Karena handphone kita bisa langsung rusak jika terlalu sering mengunggah video." },
      { letter: "D", text: "Supaya memori ponsel tidak cepat panas." }
    ],
    correct: "B",
    explanation: "Jejak digital (unggahan, komentar, foto) bisa disimpan oleh orang lain melalui screenshot. Rekam jejak buruk di masa muda bisa berdampak buruk saat mendaftar sekolah lanjutan atau pekerjaan."
  },
  {
    category: "10. Pencadangan Data (Backup)",
    question: "Siti rajin menyimpan salinan dokumen tugas makalahnya di flashdisk dan akun Google Drive miliknya. Tindakan yang dilakukan Siti disebut...",
    options: [
      { letter: "A", text: "Phishing data" },
      { letter: "B", text: "Backup data" },
      { letter: "C", text: "Infeksi malware" },
      { letter: "D", text: "Pembajakan akun" }
    ],
    correct: "B",
    explanation: "Backup data adalah proses membuat salinan cadangan dari berkas penting ke media lain (seperti flashdisk atau cloud storage) agar data aman jika gawai utama mengalami kerusakan."
  }
];

// ==========================================================================
// 4. PENGATURAN NAVIGASI SPA & PROGRES
// ==========================================================================
function navigateTo(sectionId) {
  const sections = document.querySelectorAll('.content-section');
  const targetSection = document.getElementById(sectionId);
  if (!targetSection) return;

  sections.forEach(sec => sec.classList.remove('active'));
  targetSection.classList.add('active');

  // Perbarui tombol navbar
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(link => {
    if (link.getAttribute('data-target') === sectionId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

  APP_STATE.currentSection = sectionId;
  APP_STATE.progress.visitedSections.add(sectionId);

  // Tutup menu mobile jika sedang terbuka
  const mainNav = document.getElementById('mainNavbar');
  if (mainNav && mainNav.classList.contains('open')) {
    mainNav.classList.remove('open');
  }

  // Scroll ke atas dengan halus
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Update progres belajar
  updateGlobalProgress();
}

function toggleMobileNav() {
  const mainNav = document.getElementById('mainNavbar');
  if (mainNav) {
    mainNav.classList.toggle('open');
  }
}

function switchMateriTab(modNum) {
  const tabs = document.querySelectorAll('.materi-tab-btn');
  const panes = document.querySelectorAll('.materi-pane');
  tabs.forEach((tab, i) => {
    if (i + 1 === modNum) tab.classList.add('active');
    else tab.classList.remove('active');
  });
  panes.forEach((pane, i) => {
    if (i + 1 === modNum) pane.classList.add('active');
    else pane.classList.remove('active');
  });
  // Smooth scroll ke atas materi
  const materiHeader = document.querySelector('#materi .section-heading');
  if (materiHeader) {
    const yOffset = -70;
    const y = materiHeader.getBoundingClientRect().top + window.pageYOffset + yOffset;
    window.scrollTo({ top: y, behavior: 'smooth' });
  }
}

function confirmResetProgress() {
  if (confirm('Apakah kamu yakin ingin mereset seluruh progres pembelajaran, skor aktivitas, dan kuis dari awal?')) {
    APP_STATE.progress = {
      visitedSections: new Set(['beranda']),
      act1Completed: false,
      act2Completed: false,
      act3Completed: false,
      act4Completed: false,
      act5Completed: false,
      quizCompleted: false,
      commitmentsCount: 0
    };
    if (typeof resetActivity1 === 'function') resetActivity1();
    if (typeof resetActivity2 === 'function') resetActivity2();
    if (typeof resetActivity3 === 'function') resetActivity3();
    if (typeof resetCocBestRecord === 'function') resetCocBestRecord();
    if (typeof resetBattleScores === 'function') resetBattleScores();
    if (typeof resetCommitments === 'function') resetCommitments();
    if (typeof quizRestart === 'function') quizRestart();
    updateGlobalProgress();
    alert('Progres belajar telah berhasil direset ke awal!');
  }
}

function updateGlobalProgress() {
  // Hitung poin progres
  // 6 menu dikunjungi: max 30 poin (5 poin tiap menu)
  const visitedPoints = Math.min(APP_STATE.progress.visitedSections.size * 5, 30);

  // 5 Aktivitas selesai: max 40 poin (8 poin per aktivitas)
  let actCount = 0;
  if (APP_STATE.progress.act1Completed) actCount++;
  if (APP_STATE.progress.act2Completed) actCount++;
  if (APP_STATE.progress.act3Completed) actCount++;
  if (APP_STATE.progress.act4Completed) actCount++;
  if (APP_STATE.progress.act5Completed) actCount++;
  const actPoints = Math.round((actCount / 5) * 40);

  // Kuis selesai: max 20 poin
  const quizPoints = APP_STATE.progress.quizCompleted ? 20 : 0;

  // Komitmen dicentang: max 10 poin
  const commitPoints = Math.min(Math.round((APP_STATE.commitments.size / 10) * 10), 10);

  const total = Math.min(visitedPoints + actPoints + quizPoints + commitPoints, 100);

  const fillEl = document.getElementById('globalProgressBar');
  const textEl = document.getElementById('globalProgressText');

  if (fillEl) fillEl.style.width = total + '%';
  if (textEl) textEl.textContent = total + '%';
}

// ==========================================================================
// 5. INTERAKSI MENU MATERI (SUB-MATERI D & E)
// ==========================================================================

// Simulator Password Fiktif (Modul D)
function testSimPassword(pwd) {
  const input = document.getElementById('simPasswordInput');
  if (input) {
    input.value = pwd;
    evaluateSimPassword(pwd);
  }
}

function evaluateSimPassword(pwd) {
  const fill = document.getElementById('simStrengthFill');
  const label = document.getElementById('simStrengthLabel');
  const scoreEl = document.getElementById('simStrengthScore');
  const feedback = document.getElementById('simStrengthFeedback');

  if (!pwd || pwd.trim() === '') {
    fill.style.width = '0%';
    fill.style.backgroundColor = '#cbd5e1';
    label.textContent = 'Tingkat Kekuatan: Belum diisi';
    label.style.color = 'var(--color-text-main)';
    scoreEl.textContent = '0 / 100';
    feedback.textContent = 'Masukkan minimal 8 karakter dengan campuran huruf besar, kecil, angka, dan simbol.';
    return;
  }

  let score = 0;
  const tips = [];

  // Evaluasi Panjang
  if (pwd.length >= 12) {
    score += 35;
  } else if (pwd.length >= 8) {
    score += 20;
  } else {
    tips.push('Terlalu pendek (minimal 8-12 karakter)');
  }

  // Evaluasi Karakter
  if (/[a-z]/.test(pwd)) score += 15;
  else tips.push('Tambahkan huruf kecil');

  if (/[A-Z]/.test(pwd)) score += 20;
  else tips.push('Tambahkan huruf besar');

  if (/[0-9]/.test(pwd)) score += 15;
  else tips.push('Tambahkan angka');

  if (/[^A-Za-z0-9]/.test(pwd)) score += 15;
  else tips.push('Tambahkan simbol (@, #, $, !)');

  // Kurangi jika kata umum
  const lower = pwd.toLowerCase();
  if (lower.includes('123456') || lower === 'password' || lower === 'admin' || lower === 'smpbisa') {
    score = Math.min(score, 25);
    tips.push('Pola kata ini terlalu umum dan mudah ditebak kamus hacker');
  }

  score = Math.min(Math.max(score, 5), 100);
  scoreEl.textContent = score + ' / 100';
  fill.style.width = score + '%';

  if (score < 40) {
    fill.style.backgroundColor = 'var(--color-danger)';
    label.textContent = 'Tingkat Kekuatan: 🔴 LEMAH';
    label.style.color = 'var(--color-danger)';
  } else if (score < 75) {
    fill.style.backgroundColor = 'var(--color-warning)';
    label.textContent = 'Tingkat Kekuatan: 🟡 SEDANG';
    label.style.color = '#d97706';
  } else {
    fill.style.backgroundColor = 'var(--color-success)';
    label.textContent = 'Tingkat Kekuatan: 🟢 KUAT & AMAN';
    label.style.color = 'var(--color-success)';
  }

  if (tips.length > 0) {
    feedback.innerHTML = '<strong>Saran Perbaikan:</strong> ' + tips.join(' • ');
  } else {
    feedback.innerHTML = '<strong>Sempurna!</strong> Kata sandi ini memiliki panjang ideal dan kombinasi karakter yang sangat sulit dibobol.';
  }
}

// Studi Kasus OTP (Modul E)
function checkCaseOtp(button, choice) {
  const buttons = document.querySelectorAll('#caseOtpOptions .case-btn');
  const explanation = document.getElementById('caseOtpExplanation');

  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('correct', 'wrong');
  });

  if (choice === 'C') {
    button.classList.add('correct');
    explanation.style.display = 'block';
    explanation.style.background = 'var(--color-success-bg)';
    explanation.style.color = '#047857';
    explanation.style.border = '1px solid var(--color-success-border)';
    explanation.innerHTML = '<strong>✅ TEPAT SEKALI!</strong> Kode OTP adalah rahasia mutlak. Menolak memberikan kode OTP dan memblokir nomor penipu adalah cara terbaik menyelamatkan akun game dan datamu.';
  } else {
    button.classList.add('wrong');
    // Tandai pilihan C
    buttons[2].classList.add('correct');
    explanation.style.display = 'block';
    explanation.style.background = 'var(--color-danger-bg)';
    explanation.style.color = '#b91c1c';
    explanation.style.border = '1px solid var(--color-danger-border)';
    explanation.innerHTML = '<strong>❌ KURANG TEPAT!</strong> Jika kamu memberikan kode OTP atau mengirimkan screenshot SMS, penipu tersebut akan langsung mengambil alih akunmu dan kamu akan kehilangan akun tersebut!';
  }
}

// ==========================================================================
// 6. MENU KENALI ANCAMAN & MODAL POP-UP
// ==========================================================================
function renderThreatsGrid() {
  const container = document.getElementById('threatsGridContainer');
  if (!container) return;

  container.innerHTML = THREATS_DATA.map(threat => `
    <div class="threat-card" onclick="openThreatModal('${threat.id}')" title="Klik untuk membaca detail ${threat.title}">
      <span class="threat-badge ${threat.badgeClass}">${threat.badge}</span>
      <div class="threat-icon">${threat.icon}</div>
      <h3>${threat.title}</h3>
      <p class="threat-summary">${threat.summary}</p>
      <div class="threat-btn">
        <span>🔍 Pelajari Selengkapnya</span>
      </div>
    </div>
  `).join('');
}

function openThreatModal(threatId) {
  const threat = THREATS_DATA.find(t => t.id === threatId);
  if (!threat) return;

  document.getElementById('modalThreatIcon').textContent = threat.icon;
  document.getElementById('modalThreatTitle').textContent = threat.title + ` (${threat.subtitle})`;
  const badgeEl = document.getElementById('modalThreatBadge');
  badgeEl.textContent = threat.badge;
  badgeEl.className = `threat-badge ${threat.badgeClass}`;

  document.getElementById('modalThreatDef').textContent = threat.def;
  document.getElementById('modalThreatCase').textContent = threat.caseExample;
  document.getElementById('modalThreatSigns').textContent = threat.signs;
  document.getElementById('modalThreatPrevent').textContent = threat.prevent;

  const modal = document.getElementById('threatModal');
  if (modal) {
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeThreatModal() {
  const modal = document.getElementById('threatModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

function handleModalBackdropClick(e) {
  if (e.target.id === 'threatModal') {
    closeThreatModal();
  }
}

// ==========================================================================
// 7. SINTESIS AUDIO WEB AUDIO API (TANPA FILE EKSTERNAL)
// ==========================================================================
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
}

function playTone(freq, type = 'sine', duration = 0.15, startTimeOffset = 0, gainLevel = 0.15) {
  if (APP_STATE.coc && !APP_STATE.coc.audioEnabled) return;
  try {
    initAudio();
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, audioCtx.currentTime + startTimeOffset);

    gain.gain.setValueAtTime(gainLevel, audioCtx.currentTime + startTimeOffset);
    gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + startTimeOffset + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(audioCtx.currentTime + startTimeOffset);
    osc.stop(audioCtx.currentTime + startTimeOffset + duration);
  } catch (err) {}
}

function playFlipSound() {
  playTone(480, 'sine', 0.08, 0, 0.1);
}

function playMatchSound() {
  playTone(523.25, 'triangle', 0.12, 0, 0.2);     // C5
  playTone(659.25, 'triangle', 0.12, 0.08, 0.2);  // E5
  playTone(783.99, 'triangle', 0.25, 0.16, 0.25); // G5
}

function playWrongSound() {
  playTone(220, 'sawtooth', 0.18, 0, 0.15);
  playTone(185, 'sawtooth', 0.2, 0.1, 0.15);
}

function playStreakSound(streak) {
  const baseFreq = 500 + (streak * 80);
  playTone(baseFreq, 'square', 0.15, 0, 0.12);
  playTone(baseFreq * 1.25, 'square', 0.2, 0.08, 0.15);
}

function playVictoryFanfare() {
  playTone(523.25, 'triangle', 0.18, 0, 0.25);    // C5
  playTone(659.25, 'triangle', 0.18, 0.12, 0.25); // E5
  playTone(783.99, 'triangle', 0.18, 0.24, 0.25); // G5
  playTone(1046.50, 'triangle', 0.5, 0.36, 0.3);  // C6
}

// ==========================================================================
// 8. TAB SWITCHER AKTIVITAS (5 AKTIVITAS DENGAN COC & BATTLE REGU)
// ==========================================================================
function selectActivityTab(actNum) {
  const tabs = document.querySelectorAll('.act-tab');
  tabs.forEach(t => {
    if (parseInt(t.getAttribute('data-act'), 10) === actNum) {
      t.classList.add('active');
    } else {
      t.classList.remove('active');
    }
  });

  const blocks = [
    document.getElementById('actBlock1'),
    document.getElementById('actBlock2'),
    document.getElementById('actBlock3'),
    document.getElementById('actBlock4'),
    document.getElementById('actBlock5')
  ];

  blocks.forEach((b, idx) => {
    if (b) {
      if (idx + 1 === actNum) {
        b.classList.add('active');
      } else {
        b.classList.remove('active');
      }
    }
  });

  if (actNum === 3) {
    setTimeout(drawChartAct3, 50);
  } else if (actNum === 5) {
    setTimeout(drawBattleWheel, 50);
  }
}

// ==========================================================================
// AKTIVITAS 1: URUTKAN ALUR TANGGAP DARURAT AKUN (DRAG & DROP + TOUCH)
// ==========================================================================
const CORRECT_ACT1_ORDER = [
  "1. Sadari Gejala & Kejanggalan Akun",
  "2. Putuskan Koneksi & Jangan Klik Tautan Asing",
  "3. Segera Ganti Kata Sandi Utama",
  "4. Aktifkan Verifikasi Dua Langkah (2FA / OTP)",
  "5. Periksa Perangkat Terhubung & Keluarkan",
  "6. Lakukan Backup Data & Laporkan ke Pihak Tepercaya"
];

function initActivity1() {
  APP_STATE.act1Items = [
    "3. Segera Ganti Kata Sandi Utama",
    "6. Lakukan Backup Data & Laporkan ke Pihak Tepercaya",
    "1. Sadari Gejala & Kejanggalan Akun",
    "5. Periksa Perangkat Terhubung & Keluarkan",
    "2. Putuskan Koneksi & Jangan Klik Tautan Asing",
    "4. Aktifkan Verifikasi Dua Langkah (2FA / OTP)"
  ];
  renderActivity1List();
}

function renderActivity1List() {
  const container = document.getElementById('dragList');
  if (!container) return;
  container.innerHTML = '';

  APP_STATE.act1Items.forEach((itemText, index) => {
    const itemEl = document.createElement('div');
    itemEl.className = 'drag-item';
    itemEl.setAttribute('draggable', 'true');
    itemEl.setAttribute('data-index', index);

    itemEl.innerHTML = `
      <div class="drag-left">
        <span class="drag-handle" title="Tahan dan seret">☰</span>
        <span class="drag-number">${index + 1}</span>
        <span class="drag-text">${itemText}</span>
      </div>
      <div class="drag-arrows">
        <button class="btn-arrow" onclick="moveAct1Item(${index}, -1)" title="Pindah ke Atas" ${index === 0 ? 'disabled' : ''}>⬆</button>
        <button class="btn-arrow" onclick="moveAct1Item(${index}, 1)" title="Pindah ke Bawah" ${index === APP_STATE.act1Items.length - 1 ? 'disabled' : ''}>⬇</button>
      </div>
    `;

    itemEl.addEventListener('dragstart', handleDragStart);
    itemEl.addEventListener('dragover', handleDragOver);
    itemEl.addEventListener('drop', handleDrop);
    itemEl.addEventListener('dragend', handleDragEnd);

    container.appendChild(itemEl);
  });
}

let draggedItemIndex = null;

function handleDragStart(e) {
  draggedItemIndex = parseInt(this.getAttribute('data-index'), 10);
  this.classList.add('dragging');
  if (e.dataTransfer) e.dataTransfer.effectAllowed = 'move';
}

function handleDragOver(e) {
  e.preventDefault();
  if (e.dataTransfer) e.dataTransfer.dropEffect = 'move';
  this.classList.add('drag-over');
}

function handleDrop(e) {
  e.preventDefault();
  this.classList.remove('drag-over');
  const targetIndex = parseInt(this.getAttribute('data-index'), 10);

  if (draggedItemIndex !== null && draggedItemIndex !== targetIndex) {
    const moved = APP_STATE.act1Items.splice(draggedItemIndex, 1)[0];
    APP_STATE.act1Items.splice(targetIndex, 0, moved);
    renderActivity1List();
  }
}

function handleDragEnd() {
  this.classList.remove('dragging');
  document.querySelectorAll('.drag-item').forEach(el => el.classList.remove('drag-over'));
}

function moveAct1Item(index, direction) {
  const newIndex = index + direction;
  if (newIndex >= 0 && newIndex < APP_STATE.act1Items.length) {
    const temp = APP_STATE.act1Items[index];
    APP_STATE.act1Items[index] = APP_STATE.act1Items[newIndex];
    APP_STATE.act1Items[newIndex] = temp;
    renderActivity1List();
  }
}

function checkActivity1() {
  const isCorrect = APP_STATE.act1Items.every((item, idx) => item === CORRECT_ACT1_ORDER[idx]);
  const alertEl = document.getElementById('act1Alert');
  const badgeEl = document.getElementById('act1BadgeStatus');
  if (!alertEl || !badgeEl) return;

  alertEl.style.display = 'block';

  if (isCorrect) {
    alertEl.className = 'feedback-alert success';
    alertEl.innerHTML = '🎉 <strong>Hebat & Tepat Sekali!</strong> Urutan 6 langkah tanggap darurat akun siber sudah benar secara logis.';
    badgeEl.textContent = 'Skor: 100 / 100';
    badgeEl.style.color = 'var(--color-accent-green)';
    APP_STATE.progress.act1Completed = true;
    updateGlobalProgress();
    playMatchSound();
  } else {
    alertEl.className = 'feedback-alert error';
    alertEl.innerHTML = '⚠️ <strong>Urutan belum tepat.</strong> Pikirkan urutan logisnya: Sadari kejanggalan lebih dulu ➔ Putuskan koneksi / jangan klik tautan ➔ Ganti kata sandi ➔ Pasang 2FA ➔ Cek perangkat aktif ➔ Backup & lapor!';
    badgeEl.textContent = 'Skor: Coba Lagi';
    badgeEl.style.color = 'var(--color-accent-red)';
    playWrongSound();
  }
}

function resetActivity1() {
  initActivity1();
  const alertEl = document.getElementById('act1Alert');
  if (alertEl) alertEl.style.display = 'none';
  const badgeEl = document.getElementById('act1BadgeStatus');
  if (badgeEl) {
    badgeEl.textContent = 'Skor: - / 100';
    badgeEl.style.color = 'var(--color-primary-navy)';
  }
}

// ==========================================================================
// AKTIVITAS 2: JODOHKAN ISTILAH KEAMANAN DATA
// ==========================================================================
const MATCH_PAIRS_DEF = [
  { id: 'phishing', label: 'A. Phishing', funcId: 'f5' },
  { id: 'ransomware', label: 'B. Ransomware', funcId: 'f3' },
  { id: 'otp', label: 'C. Kode OTP', funcId: 'f4' },
  { id: 'digital_footprint', label: 'D. Jejak Digital', funcId: 'f2' },
  { id: 'backup', label: 'E. Backup Data', funcId: 'f1' }
];

const MATCH_FUNCTIONS_DEF = [
  { id: 'f1', text: '1. Salinan file cadangan untuk mencegah kehilangan data berharga saat gawai rusak/hilang.' },
  { id: 'f2', text: '2. Rekam jejak seluruh aktivitas, postingan, dan foto yang ditinggalkan saat berselancar di internet.' },
  { id: 'f3', text: '3. Program jahat yang mengunci/menyandera berkas penting dan memeras uang tebusan.' },
  { id: 'f4', text: '4. Kode sandi sekali pakai yang sangat rahasia untuk memverifikasi pemilik sah akun.' },
  { id: 'f5', text: '5. Penipuan digital lewat tautan/pesan palsu untuk memancing korban membocorkan password.' }
];

function initActivity2() {
  APP_STATE.act2SelectedLeft = null;
  APP_STATE.act2Matches = {};

  const leftContainer = document.getElementById('matchLeftContainer');
  const rightContainer = document.getElementById('matchRightContainer');
  if (!leftContainer || !rightContainer) return;

  leftContainer.innerHTML = '';
  rightContainer.innerHTML = '';

  MATCH_PAIRS_DEF.forEach(item => {
    const el = document.createElement('div');
    el.className = 'match-card-item';
    el.id = `left-${item.id}`;
    el.textContent = item.label;
    el.onclick = () => selectLeftMatch(item.id);
    leftContainer.appendChild(el);
  });

  MATCH_FUNCTIONS_DEF.forEach(item => {
    const el = document.createElement('div');
    el.className = 'match-card-item';
    el.id = `right-${item.id}`;
    el.textContent = item.text;
    el.onclick = () => selectRightMatch(item.id);
    rightContainer.appendChild(el);
  });

  updateAct2Badge();
}

function selectLeftMatch(leftId) {
  if (APP_STATE.act2Matches[leftId]) return;

  APP_STATE.act2SelectedLeft = leftId;
  document.querySelectorAll('#matchLeftContainer .match-card-item').forEach(el => {
    el.classList.remove('selected');
  });

  const activeEl = document.getElementById(`left-${leftId}`);
  if (activeEl) activeEl.classList.add('selected');
  playTone(520, 'sine', 0.08);
}

function selectRightMatch(rightId) {
  if (!APP_STATE.act2SelectedLeft) {
    const alertEl = document.getElementById('act2Alert');
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.className = 'feedback-alert error';
      alertEl.textContent = 'Silakan klik salah satu kartu istilah siber di sisi kiri terlebih dahulu!';
    }
    return;
  }

  const leftId = APP_STATE.act2SelectedLeft;
  const targetPair = MATCH_PAIRS_DEF.find(p => p.id === leftId);
  const leftEl = document.getElementById(`left-${leftId}`);
  const rightEl = document.getElementById(`right-${rightId}`);

  if (targetPair && targetPair.funcId === rightId) {
    APP_STATE.act2Matches[leftId] = rightId;
    leftEl.classList.remove('selected');
    leftEl.classList.add('matched-correct');
    rightEl.classList.add('matched-correct');

    APP_STATE.act2SelectedLeft = null;
    updateAct2Badge();
    playMatchSound();

    const alertEl = document.getElementById('act2Alert');
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.className = 'feedback-alert success';
      alertEl.textContent = `✅ Tepat sekali! Istilah ${targetPair.label} berhasil dijodohkan.`;

      if (Object.keys(APP_STATE.act2Matches).length === 5) {
        alertEl.innerHTML = '🎉 <strong>Luar biasa sempurna!</strong> Semua 5 istilah keamanan data berhasil kamu jodohkan dengan tepat!';
        APP_STATE.progress.act2Completed = true;
        updateGlobalProgress();
      }
    }
  } else {
    leftEl.classList.add('matched-wrong');
    rightEl.classList.add('matched-wrong');
    playWrongSound();

    setTimeout(() => {
      leftEl.classList.remove('matched-wrong');
      rightEl.classList.remove('matched-wrong');
    }, 500);

    const alertEl = document.getElementById('act2Alert');
    if (alertEl) {
      alertEl.style.display = 'block';
      alertEl.className = 'feedback-alert error';
      alertEl.textContent = '❌ Pasangan belum cocok. Coba baca kembali definisi fungsi di sisi kanan!';
    }
  }
}

function updateAct2Badge() {
  const count = Object.keys(APP_STATE.act2Matches).length;
  const badge = document.getElementById('act2PairCount');
  if (badge) badge.textContent = `Pasangan Benar: ${count} / 5`;
}

function checkActivity2() {
  const count = Object.keys(APP_STATE.act2Matches).length;
  const alertEl = document.getElementById('act2Alert');
  if (!alertEl) return;
  alertEl.style.display = 'block';

  if (count === 5) {
    alertEl.className = 'feedback-alert success';
    alertEl.innerHTML = '🎉 <strong>Sempurna!</strong> Kamu sudah berhasil mencocokkan seluruh 5 istilah keamanan data.';
    APP_STATE.progress.act2Completed = true;
    updateGlobalProgress();
  } else {
    alertEl.className = 'feedback-alert error';
    alertEl.innerHTML = `Kamu baru mencocokkan <strong>${count} dari 5</strong> istilah. Lanjutkan hingga lengkap!`;
  }
}

function resetActivity2() {
  initActivity2();
  const alertEl = document.getElementById('act2Alert');
  if (alertEl) alertEl.style.display = 'none';
}

// ==========================================================================
// AKTIVITAS 3: AUDIT KEAMANAN AKUN SISWA (HOTS) - VANILLA CANVAS BAR CHART
// ==========================================================================
function drawChartAct3() {
  const canvas = document.getElementById('chartAct3');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width > 0 ? rect.width : 460;
  const height = 260;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  ctx.scale(dpr, dpr);

  ctx.clearRect(0, 0, width, height);

  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 30;
  const paddingBottom = 40;
  const chartW = width - paddingLeft - paddingRight;
  const chartH = height - paddingTop - paddingBottom;
  const maxVal = 30;

  // Grid lines
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#64748b';
  ctx.font = '10px Poppins, sans-serif';
  ctx.textAlign = 'right';
  ctx.textBaseline = 'middle';

  for (let v = 0; v <= maxVal; v += 10) {
    const y = paddingTop + chartH - (v / maxVal) * chartH;
    ctx.beginPath();
    ctx.moveTo(paddingLeft, y);
    ctx.lineTo(width - paddingRight, y);
    ctx.stroke();
    ctx.fillText(v, paddingLeft - 6, y);
  }

  // Data 5 Kelas
  const classes = ['8A', '8B', '8C', '9A', '9B'];
  const passData = [12, 26, 8, 24, 15]; // Password Kuat
  const phishData = [18, 5, 20, 7, 15]; // Klik Phishing

  const groupW = chartW / classes.length;
  const barW = Math.min(22, (groupW - 16) / 2);

  classes.forEach((cls, i) => {
    const groupCenter = paddingLeft + (i + 0.5) * groupW;

    // Bar 1: Password Kuat (Biru #2563eb)
    const val1 = passData[i];
    const h1 = (val1 / maxVal) * chartH;
    const x1 = groupCenter - barW - 2;
    const y1 = paddingTop + chartH - h1;

    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x1, y1, barW, h1, [4, 4, 0, 0]);
    } else {
      ctx.rect(x1, y1, barW, h1);
    }
    ctx.fill();

    // Bar 2: Klik Phishing (Merah #ef4444)
    const val2 = phishData[i];
    const h2 = (val2 / maxVal) * chartH;
    const x2 = groupCenter + 2;
    const y2 = paddingTop + chartH - h2;

    ctx.fillStyle = '#ef4444';
    ctx.beginPath();
    if (ctx.roundRect) {
      ctx.roundRect(x2, y2, barW, h2, [4, 4, 0, 0]);
    } else {
      ctx.rect(x2, y2, barW, h2);
    }
    ctx.fill();

    // Label Kelas
    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 11px Poppins, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(cls, groupCenter, height - paddingBottom + 16);
  });

  // Legend at top
  ctx.textAlign = 'left';
  ctx.fillStyle = '#2563eb';
  ctx.fillRect(paddingLeft + 10, 10, 12, 12);
  ctx.fillStyle = '#334155';
  ctx.font = '600 11px Poppins, sans-serif';
  ctx.fillText('Password Kuat', paddingLeft + 28, 19);

  ctx.fillStyle = '#ef4444';
  ctx.fillRect(paddingLeft + 140, 10, 12, 12);
  ctx.fillStyle = '#334155';
  ctx.fillText('Klik Phishing', paddingLeft + 158, 19);
}

// Kunci Jawaban & Penjelasan HOTS Mendalam
const ACT3_HOTS_ANSWERS = {
  1: {
    val: 'C',
    correctText: 'C. Kelas 8C — Defisit 12 siswa (hanya 8 password kuat vs 20 klik phishing)',
    explanation: 'Analisis HOTS Sangat Tajam! Kelas 8C memiliki disparitas bahaya paling mengkhawatirkan: 20 siswa pernah terjebak link phishing dan hanya 8 siswa yang menggunakan password kuat (defisit keamanan sebesar 12 siswa).'
  },
  2: {
    val: 'A',
    correctText: 'A. Kelas 8B lebih unggul secara proporsi (81,25% password kuat & 68,75% backup)',
    explanation: 'Analisis Proporsi HOTS Cemerlang! Meskipun Kelas 9A memiliki 24 siswa ber-password kuat dari 30 siswa (80,0%), Kelas 8B memiliki 26 dari 32 siswa (81,25%) ber-password kuat dan 22 dari 32 siswa (68,75%) rutin backup. Secara proporsi rasio, budaya keamanan 8B paling unggul!'
  },
  3: {
    val: 'A',
    correctText: 'A. Memprioritaskan workshop untuk Kelas 8C dan menunjuk tutor sebaya dari Kelas 8B',
    explanation: 'Keputusan Solutif Berbasis Data Sempurna! Data membuktikan Kelas 8C membutuhkan intervensi edukasi paling darurat, sementara Kelas 8B memiliki literasi dan kebiasaan backup terbaik untuk dijadikan tutor sebaya yang inspiratif.'
  }
};

function chooseAct3(qId, selectedVal, btnEl) {
  const card = document.getElementById(`act3Q${qId}Card`);
  if (!card) return;
  const buttons = card.querySelectorAll('.btn-choice');
  const msgEl = document.getElementById(`act3Msg${qId}`);

  buttons.forEach(b => {
    b.classList.remove('correct', 'wrong');
    b.disabled = true;
  });

  const correctInfo = ACT3_HOTS_ANSWERS[qId];
  if (selectedVal === correctInfo.val) {
    btnEl.classList.add('correct');
    msgEl.className = 'q-status-msg correct';
    msgEl.innerHTML = `✅ <strong>Analisis Tepat!</strong> ${correctInfo.explanation}`;
    APP_STATE.act3Answers[qId] = true;
    playMatchSound();
  } else {
    btnEl.classList.add('wrong');
    buttons.forEach(b => {
      if (b.innerText.trim().startsWith(correctInfo.val)) {
        b.classList.add('correct');
      }
    });
    msgEl.className = 'q-status-msg wrong';
    msgEl.innerHTML = `❌ <strong>Analisis Belum Tepat.</strong> Pilihan yang benar adalah <strong>${correctInfo.correctText}</strong>.<br><em>${correctInfo.explanation}</em>`;
    APP_STATE.act3Answers[qId] = false;
    playWrongSound();
  }

  msgEl.style.display = 'block';
  updateAct3Score();
}

function updateAct3Score() {
  let score = 0;
  Object.values(APP_STATE.act3Answers).forEach(ans => {
    if (ans === true) score++;
  });

  const badge = document.getElementById('act3BadgeScore');
  if (badge) badge.textContent = `Skor: ${score} / 3`;

  if (score === 3) {
    APP_STATE.progress.act3Completed = true;
    updateGlobalProgress();
  }
}

function resetActivity3() {
  APP_STATE.act3Answers = { 1: null, 2: null, 3: null };
  for (let qId = 1; qId <= 3; qId++) {
    const card = document.getElementById(`act3Q${qId}Card`);
    if (card) {
      const buttons = card.querySelectorAll('.btn-choice');
      buttons.forEach(b => {
        b.classList.remove('correct', 'wrong');
        b.disabled = false;
      });
      const msgEl = document.getElementById(`act3Msg${qId}`);
      if (msgEl) msgEl.style.display = 'none';
    }
  }
  updateAct3Score();
}

// ==========================================================================
// AKTIVITAS 4: CLASH OF CHAMPIONS (COC RUANG GURU) - CYBER MEMORY BATTLE
// ==========================================================================
const COC_PAIRS_DATA = [
  {
    pairId: 'phishing',
    cardA: { icon: '🎣', title: 'Phishing', subtitle: 'Jebakan Tautan Palsu' },
    cardB: { icon: '🛑', title: 'Ciri Phishing', subtitle: 'Memancing Password & Data Rahasia' }
  },
  {
    pairId: 'password',
    cardA: { icon: '🔐', title: 'Password Kuat', subtitle: 'Kombinasi Karakter Kompleks' },
    cardB: { icon: '🛡️', title: 'Fungsi Sandi', subtitle: 'Membentengi Akun dari Tebakan' }
  },
  {
    pairId: 'otp',
    cardA: { icon: '🔢', title: 'Kode OTP', subtitle: 'Sandi Sekali Pakai' },
    cardB: { icon: '🚨', title: 'Aturan OTP', subtitle: 'Rahasia Mutlak, Jangan Berikan ke Siapa Pun' }
  },
  {
    pairId: 'ransomware',
    cardA: { icon: '🦠', title: 'Ransomware', subtitle: 'Malware Penyandera Berkas' },
    cardB: { icon: '🔒', title: 'Bahaya Ransom', subtitle: 'Kunci Berkas & Peras Uang Tebusan' }
  },
  {
    pairId: 'backup',
    cardA: { icon: '💾', title: 'Backup Data', subtitle: 'Pencadangan Berkas' },
    cardB: { icon: '☁️', title: 'Tujuan Backup', subtitle: 'Pulihkan Data Saat Gawai Rusak' }
  },
  {
    pairId: 'digital_footprint',
    cardA: { icon: '👣', title: 'Jejak Digital', subtitle: 'Rekaman Aktivitas Online' },
    cardB: { icon: '🌐', title: 'Sifat Jejak', subtitle: 'Abadi & Sangat Sulit Dihapus' }
  }
];

function initCocArena() {
  updateCocBestUI();
  renderCocBoardPreview();
}

function updateCocBestUI() {
  const el = document.getElementById('cocBestText');
  if (el) {
    if (APP_STATE.coc.bestTimeMs) {
      el.textContent = formatMs(APP_STATE.coc.bestTimeMs);
    } else {
      el.textContent = '-';
    }
  }
}

function formatMs(ms) {
  const totalSeconds = ms / 1000;
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  const tenths = Math.floor((ms % 1000) / 100);
  const mStr = String(minutes).padStart(2, '0');
  const sStr = String(seconds).padStart(2, '0');
  return `${mStr}:${sStr}.${tenths}`;
}

function renderCocBoardPreview() {
  const container = document.getElementById('cocGridContainer');
  if (!container) return;
  container.innerHTML = '';

  for (let i = 0; i < 12; i++) {
    const cardEl = document.createElement('div');
    cardEl.className = 'coc-card';
    cardEl.innerHTML = `
      <div class="coc-card-front">
        <div class="coc-front-logo">⚡</div>
        <div class="coc-front-text">CYBER ARENA</div>
      </div>
      <div class="coc-card-back">
        <div class="coc-card-icon">❓</div>
        <div class="coc-card-title">Kartu Siber #${i + 1}</div>
      </div>
    `;
    container.appendChild(cardEl);
  }
}

function startCocGame() {
  initAudio();
  const victoryModal = document.getElementById('cocVictoryModal');
  if (victoryModal) victoryModal.style.display = 'none';

  if (APP_STATE.coc.timerInterval) {
    clearInterval(APP_STATE.coc.timerInterval);
  }

  let deck = [];
  COC_PAIRS_DATA.forEach(pair => {
    deck.push({
      id: `${pair.pairId}_A`,
      pairId: pair.pairId,
      icon: pair.cardA.icon,
      title: pair.cardA.title,
      subtitle: pair.cardA.subtitle
    });
    deck.push({
      id: `${pair.pairId}_B`,
      pairId: pair.pairId,
      icon: pair.cardB.icon,
      title: pair.cardB.title,
      subtitle: pair.cardB.subtitle
    });
  });

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  APP_STATE.coc.cards = deck;
  APP_STATE.coc.flippedCards = [];
  APP_STATE.coc.matchedPairs = 0;
  APP_STATE.coc.moves = 0;
  APP_STATE.coc.streak = 0;
  APP_STATE.coc.maxStreak = 0;
  APP_STATE.coc.isPlaying = false;
  APP_STATE.coc.isBusy = true;

  document.getElementById('cocMovesText').textContent = '0';
  document.getElementById('cocStreakText').textContent = 'x0';
  document.getElementById('cocTimerText').textContent = '00:00.0';

  const container = document.getElementById('cocGridContainer');
  container.innerHTML = '';

  deck.forEach((cardData, idx) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'coc-card flipped';
    cardEl.id = `cocCard_${idx}`;
    cardEl.setAttribute('data-index', idx);

    cardEl.innerHTML = `
      <div class="coc-card-front">
        <div class="coc-front-logo">⚡</div>
        <div class="coc-front-text">CYBER ARENA</div>
      </div>
      <div class="coc-card-back">
        <div class="coc-card-icon">${cardData.icon}</div>
        <div class="coc-card-title">${cardData.title}</div>
        <div class="coc-card-subtitle">${cardData.subtitle}</div>
      </div>
    `;

    cardEl.onclick = () => onCocCardClick(idx);
    container.appendChild(cardEl);
  });

  const countdownBanner = document.getElementById('cocCountdownBanner');
  const countdownNum = document.getElementById('cocCountdownNumber');
  const countdownLabel = document.getElementById('cocCountdownLabel');

  countdownBanner.style.display = 'block';
  let countdownSec = 5;
  countdownNum.textContent = countdownSec;
  countdownLabel.textContent = 'HAFALKAN SELURUH KARTU SEBELUM DITUTUP! (5 DETIK)';
  playTone(550, 'sine', 0.15);

  const countInterval = setInterval(() => {
    countdownSec--;
    if (countdownSec > 0) {
      countdownNum.textContent = countdownSec;
      playTone(550, 'sine', 0.15);
    } else {
      clearInterval(countInterval);
      countdownNum.textContent = '🔒 MEMORY LOCKED!';
      playTone(750, 'square', 0.3);

      setTimeout(() => {
        countdownBanner.style.display = 'none';

        document.querySelectorAll('.coc-card').forEach(el => {
          el.classList.remove('flipped');
        });

        APP_STATE.coc.isPlaying = true;
        APP_STATE.coc.isBusy = false;
        APP_STATE.coc.startTime = performance.now();

        APP_STATE.coc.timerInterval = setInterval(() => {
          const now = performance.now();
          APP_STATE.coc.elapsedMs = now - APP_STATE.coc.startTime;
          document.getElementById('cocTimerText').textContent = formatMs(APP_STATE.coc.elapsedMs);
        }, 80);
      }, 700);
    }
  }, 1000);
}

function onCocCardClick(index) {
  if (!APP_STATE.coc.isPlaying || APP_STATE.coc.isBusy) return;

  const cardData = APP_STATE.coc.cards[index];
  const cardEl = document.getElementById(`cocCard_${index}`);

  if (cardEl.classList.contains('flipped') || cardEl.classList.contains('matched')) {
    return;
  }

  cardEl.classList.add('flipped');
  playFlipSound();
  APP_STATE.coc.flippedCards.push({ index, data: cardData, el: cardEl });

  if (APP_STATE.coc.flippedCards.length === 2) {
    APP_STATE.coc.moves++;
    document.getElementById('cocMovesText').textContent = APP_STATE.coc.moves;
    APP_STATE.coc.isBusy = true;

    const [first, second] = APP_STATE.coc.flippedCards;

    if (first.data.pairId === second.data.pairId) {
      APP_STATE.coc.matchedPairs++;
      APP_STATE.coc.streak++;
      if (APP_STATE.coc.streak > APP_STATE.coc.maxStreak) {
        APP_STATE.coc.maxStreak = APP_STATE.coc.streak;
      }

      document.getElementById('cocStreakText').textContent = `x${APP_STATE.coc.streak} 🔥`;

      first.el.classList.add('matched');
      second.el.classList.add('matched');

      if (APP_STATE.coc.streak >= 2) {
        playStreakSound(APP_STATE.coc.streak);
      } else {
        playMatchSound();
      }

      APP_STATE.coc.flippedCards = [];
      APP_STATE.coc.isBusy = false;

      if (APP_STATE.coc.matchedPairs === 6) {
        clearInterval(APP_STATE.coc.timerInterval);
        APP_STATE.coc.isPlaying = false;
        setTimeout(() => {
          showCocVictory();
        }, 500);
      }
    } else {
      APP_STATE.coc.streak = 0;
      document.getElementById('cocStreakText').textContent = 'x0';

      first.el.classList.add('wrong-shake');
      second.el.classList.add('wrong-shake');
      playWrongSound();

      setTimeout(() => {
        first.el.classList.remove('flipped', 'wrong-shake');
        second.el.classList.remove('flipped', 'wrong-shake');
        APP_STATE.coc.flippedCards = [];
        APP_STATE.coc.isBusy = false;
      }, 900);
    }
  }
}

function showCocVictory() {
  const timeMs = APP_STATE.coc.elapsedMs;
  const timeFormatted = formatMs(timeMs);
  const moves = APP_STATE.coc.moves;
  const maxCombo = APP_STATE.coc.maxStreak;

  if (!APP_STATE.coc.bestTimeMs || timeMs < APP_STATE.coc.bestTimeMs) {
    APP_STATE.coc.bestTimeMs = timeMs;
    updateCocBestUI();
  }

  let rankBadge = 'GRAND CHAMPION 🏆';
  let rankDesc = 'Kecepatan & ketajaman memorimu setara juara Clash of Champions!';
  if (timeMs > 38000) {
    rankBadge = 'GUARDIAN HERO 🎖️';
    rankDesc = 'Pertahanan siber kokoh! Terus asah refleks memorimu untuk predikat Grand Champion!';
  } else if (timeMs > 24000) {
    rankBadge = 'CYBER MASTER 🥇';
    rankDesc = 'Luar biasa cepat! Kamu mengenali seluruh konsep keamanan siber dengan sangat baik!';
  }

  document.getElementById('cocRankBadge').textContent = rankBadge;
  document.getElementById('cocRankDesc').textContent = rankDesc;
  document.getElementById('cocFinishTime').textContent = timeFormatted;
  document.getElementById('cocFinishMoves').textContent = `${moves} Kali`;
  document.getElementById('cocFinishCombo').textContent = `x${maxCombo} 🔥`;

  document.getElementById('cocVictoryModal').style.display = 'flex';
  playVictoryFanfare();

  APP_STATE.progress.act4Completed = true;
  updateGlobalProgress();
}

function resetCocBestRecord() {
  if (confirm('Reset rekor waktu terbaik Clash of Champions?')) {
    APP_STATE.coc.bestTimeMs = null;
    updateCocBestUI();
  }
}

function toggleCocAudio() {
  APP_STATE.coc.audioEnabled = !APP_STATE.coc.audioEnabled;
  const badge = document.getElementById('cocAudioStatus');
  if (badge) {
    badge.textContent = APP_STATE.coc.audioEnabled ? 'ON' : 'OFF';
    badge.style.color = APP_STATE.coc.audioEnabled ? '#38bdf8' : '#94a3b8';
  }
  if (APP_STATE.coc.audioEnabled) {
    initAudio();
    playTone(600, 'sine', 0.1);
  }
}

// ==========================================================================
// AKTIVITAS 5: BATTLE REGU KELAS (DUEL CERDAS CERMAT KEAMANAN DATA)
// ==========================================================================
const WHEEL_SECTORS = [
  { label: '🎣 Jebakan Phishing', pts: 100, color: '#3b82f6', textColor: '#ffffff' },
  { label: '🔐 Kunci Akun', pts: 150, color: '#10b981', textColor: '#ffffff' },
  { label: '⚡ Duel Rebutan', pts: 200, color: '#f59e0b', textColor: '#ffffff' },
  { label: '🛡️ Tanggap Bahaya', pts: 100, color: '#8b5cf6', textColor: '#ffffff' },
  { label: '💎 Super Bonus', pts: 300, color: '#06b6d4', textColor: '#ffffff' },
  { label: '🦠 Waspada Malware', pts: 250, color: '#ef4444', textColor: '#ffffff' },
  { label: '🔄 Rebut Poin', pts: 150, color: '#ec4899', textColor: '#ffffff' },
  { label: '🧠 Kritis Privasi', pts: 200, color: '#f97316', textColor: '#ffffff' }
];

const BATTLE_CHALLENGES = [
  {
    "id": "jp-1",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Tautan Hadiah Diamond Game Gratis",
    "desc": "Pesan WhatsApp dari nomor asing mengatasnamakan pengembang game populer membagikan link login berhadiah 1.000 diamond gratis.",
    "visual": "📱 Pesan: <em>'SELAMAT! Klik http://game-diamond-gratis.xyz dan login dengan email & password-mu untuk klaim!'</em><br><strong>Pertanyaan:</strong> Sebutkan 2 ciri mencurigakan mengapa pesan ini dipastikan adalah jebakan phishing!",
    "answer": "<strong>1. Alamat tautan bukan situs resmi (.xyz mencurigakan). 2. Meminta korban memasukkan password email/akun demi iming-iming hadiah gratis tidak masuk akal!</strong>"
  },
  {
    "id": "jp-2",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Pesan Mendesak: Akun Medsos Akan Dihapus",
    "desc": "Email masuk mengaku dari admin Instagram memperingatkan bahwa akun siswa akan ditutup permanen dalam waktu 2 jam.",
    "visual": "⚠️ Isi Email: <em>'Peringatan Hak Cipta! Klik tombol verifikasi ini dalam 2 jam atau akun Anda dihapus selamanya!'</em><br><strong>Pertanyaan:</strong> Trik manipulasi psikologis apa yang sedang digunakan penipu tersebut?",
    "answer": "<strong>Menciptakan kepanikan & urgensi waktu palsu (Sense of Urgency)!</strong> Tujuannya agar korban panik dan langsung mengklik link tanpa sempat berpikir jernih atau memeriksa kebenarannya."
  },
  {
    "id": "jp-3",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Broadcast Kuota Internet 50GB Kemendikbud",
    "desc": "Pesan berantai beredar di grup WhatsApp kelas membagikan link pembagian kuota internet belajar 50GB dengan syarat membagikan pesan ke 10 grup lain.",
    "visual": "📲 Pesan: <em>'Klaim subsidi kuota 50GB Kemendikbud. Bagikan ke 10 grup WA lalu masukkan no HP & sandi.'</em><br><strong>Pertanyaan:</strong> Mengapa pesan berantai ini berbahaya dan apa tindakan yang tepat?",
    "answer": "<strong>Pesan ini adalah hoaks dan phishing berantai!</strong> Tujuannya mencuri nomor telepon dan data akun. Tindakan tepat: Jangan diklik, jangan dibagikan ke teman, dan segera beri tahu teman sekelas bahwa pesan itu hoaks!"
  },
  {
    "id": "jp-4",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Formulir Pendaftaran Turnamen E-Sport Fiktif",
    "desc": "Sebuah Google Form turnamen Mobile Legends meminta data: Nama Lengkap, Nomor WhatsApp, ID Game, dan Kata Sandi Akun Google.",
    "visual": "📋 Formulir: [Nama Siswa] [No HP] [ID Game] <strong>[Kata Sandi Akun Google Anda]</strong>.<br><strong>Pertanyaan:</strong> Kolom formulir mana yang paling fatal dan tidak boleh diisi?",
    "answer": "<strong>Kata Sandi Akun Google!</strong> Panitia resmi turnamen apa pun tidak pernah membutuhkan kata sandi akun peserta. Membagikan sandi sama dengan menyerahkan akun secara sukarela."
  },
  {
    "id": "jp-5",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "SMS Hadiah Undian Berhadiah Mobil Mewah",
    "desc": "Siswa menerima SMS dari nomor ponsel biasa (+62812xxxx) yang menyatakan ia memenangkan undian Rp 150 juta dari sebuah bank BUMN.",
    "visual": "📩 SMS: <em>'SELAMAT! No Anda terpilih memenangkan hadiah 150jt. Buka link: http://undian-berkah-bumn.weebly.com'</em><br><strong>Pertanyaan:</strong> Mengapa SMS dari nomor seluler biasa ini pasti penipuan?",
    "answer": "<strong>Instansi resmi atau bank terpercaya selalu menggunakan SMS Sender ID resmi (nama perusahaan, bukan nomor GSM biasa) dan menggunakan domain situs web resmi perusahaan berbayar, bukan web gratisan seperti weebly/blogspot!</strong>"
  },
  {
    "id": "jp-6",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Tautan Typo Menyerupai Situs Asli (Typosquatting)",
    "desc": "Penipu membuat alamat situs web palsu yang sekilas sangat mirip dengan nama situs asli untuk mengecoh mata pengguna.",
    "visual": "🌐 Alamat Asli: <code>https://www.instagram.com</code><br>🌐 Alamat Tiruan: <code>https://www.instagr-am.login.com</code><br><strong>Pertanyaan:</strong> Apa nama teknik penipuan alamat web mirip ini dan bagaimana cara menghindarinya?",
    "answer": "<strong>Teknik Typosquatting / URL Spoofing!</strong> Cara menghindari: Selalu periksa ejaan huruf pada address bar browser secara teliti sebelum memasukkan nama pengguna dan kata sandi."
  },
  {
    "id": "jp-7",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Email Mengaku Kepala Sekolah Minta Data Rapor",
    "desc": "Siswa menerima email mengatasnamakan Kepala Sekolah yang meminta siswa mengirimkan foto KK dan NISN ke email pribadi.",
    "visual": "📧 Pengirim: <code>kepala.sekolah.smp.juara@gmail.com</code>.<br><strong>Pertanyaan:</strong> Kejanggalan apa yang terlihat dari alamat email pengirim tersebut?",
    "answer": "<strong>Menggunakan domain email gratisan (@gmail.com)!</strong> Komunikasi resmi sekolah negeri/swasta umumnya menggunakan domain resmi institusi pendidikan (seperti @smp1.sch.id), dan pihak sekolah tidak meminta dokumen sensitif via email dadakan."
  },
  {
    "id": "jp-8",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Notifikasi 'Ponsel Anda Terinfeksi 13 Virus!'",
    "desc": "Saat membaca berita di internet, tiba-tiba muncul jendela pop-up merah berkedip memperingatkan baterai ponsel rusak karena terkena 13 virus ganas.",
    "visual": "🚨 Pop-up: <em>'PERINGATAN! Ponsel Anda terkena 13 virus! Klik Install Pembersih ini dalam 30 detik untuk menyelamatkan sistem!'</em><br><strong>Pertanyaan:</strong> Apa jenis jebakan ini (Scareware) dan tindakan apa yang harus diambil?",
    "answer": "<strong>Scareware (Phishing Berkedok Menakut-nakuti)!</strong> Tujuannya memancing korban menginstal malware pembersih palsu. Tindakan tepat: Tutup tab browser tersebut segera, jangan mengklik tombol apa pun di pop-up!"
  },
  {
    "id": "jp-9",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Login WiFi Gratis Meminta Akun Media Sosial",
    "desc": "Saat berada di kafe, siswa ingin mengakses WiFi gratisan. Halaman login portal meminta siswa menginput username dan password akun Instagram.",
    "visual": "📶 Halaman Portal WiFi: <em>'Login dengan akun Instagram & masukkan kata sandi Anda untuk mendapatkan akses internet 2 jam.'</em><br><strong>Pertanyaan:</strong> Mengapa portal WiFi semacam ini sangat mencurigakan?",
    "answer": "<strong>Karena penyedia WiFi yang aman tidak pernah meminta kata sandi media sosial pengunjung!</strong> Portal palsu semacam ini dirancang oleh peretas (Evil Twin) untuk merekam dan mencuri password akun medsos siswa."
  },
  {
    "id": "jp-10",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Akun Centang Biru Palsu di Media Sosial",
    "desc": "Sebuah akun media sosial menghubungi siswa dan mengaku sebagai Tim Bantuan Keamanan TikTok. Akun tersebut memasang gambar centang biru pada foto profilnya.",
    "visual": "👤 Profil: Nama 'Customer Care TikTok', foto profil bergambar centang biru buatan sendiri.<br><strong>Pertanyaan:</strong> Bagaimana membedakan akun resmi bercentang biru asli dengan penipu?",
    "answer": "<strong>Centang biru asli berada di samping nama akun (sebelah teks), bukan ditempel di dalam lingkaran foto profil!</strong> Selain itu, tim resmi tidak pernah mengirim pesan pribadi untuk meminta kata sandi."
  },
  {
    "id": "jp-11",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Tautan Undangan Grup Belajar Online Palsu",
    "desc": "Siswa menerima pesan DM berisi link yang katanya adalah tautan grup bimbingan belajar gratis untuk persiapan ujian sekolah.",
    "visual": "🔗 Link: <code>http://grup-belajar-smp-sukses.freehost.cc/login</code>.<br><strong>Pertanyaan:</strong> Apa yang harus diwaspadai jika link grup belajar menyuruh login akun email?",
    "answer": "<strong>Tautan grup resmi (seperti WhatsApp/Telegram) tidak pernah meminta verifikasi password email!</strong> Jika diarahkan ke formulir login, itu adalah web tiruan pemancing password (phishing)."
  },
  {
    "id": "jp-12",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Penipuan Voucher Makanan Cepat Saji Gratis",
    "desc": "Beredar iklan di medsos mengklaim restoran pizza ternama membagikan voucher makan gratis senilai Rp 500.000 dalam rangka ulang tahun ke-50.",
    "visual": "🍕 Syarat Voucher: Isi kuesioner, masukkan data alamat rumah, tanggal lahir, dan nomor kartu ATM orang tua.<br><strong>Pertanyaan:</strong> Mengapa survei berhadiah ini berbahaya bagi keamanan finansial keluarga?",
    "answer": "<strong>Karena meminta data sensitif kartu ATM dan tanggal lahir!</strong> Penipu memanfaatkan data tersebut untuk membobol rekening tabungan orang tua korban."
  },
  {
    "id": "jp-13",
    "category": "🎣 Jebakan Phishing",
    "points": 100,
    "title": "Tautan 'Vote Teman' Lomba Sahabat Berprestasi",
    "desc": "Teman mengirim chat: <em>'Tolong vote aku di link ini ya supaya menang lomba duta pelajar, butuh 5 vote lagi!'</em>.",
    "visual": "🗳️ Halaman Web: Meminta masukkan nomor telepon dan kode verifikasi 6 digit yang baru saja masuk lewat SMS.<br><strong>Pertanyaan:</strong> Mengapa modus 'minta vote' ini sangat marak dan apa bahayanya?",
    "answer": "<strong>Modus pencurian akun WhatsApp/medsos!</strong> Kode 6 digit tersebut sebenarnya adalah kode OTP untuk mengambil alih akun WA siswa. Akun teman yang mengirim chat tersebut kemungkinan besar sudah dibajak sebelumnya!"
  },
  {
    "id": "ka-1",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Memilih Kata Sandi Paling Kokoh",
    "desc": "Diberikan 3 contoh kata sandi yang dibuat oleh tiga orang siswa:",
    "visual": "🔑 Pilihan Sandi:<br>1. <code>budi2010</code><br>2. <code>BudiJuaraSatu</code><br>3. <code>B@k5o_Ped4s#88</code><br><strong>Pertanyaan:</strong> Kata sandi mana yang paling kuat dan jelaskan kombinasi apa saja yang terkandung di dalamnya!",
    "answer": "<strong>Kata sandi nomor 3 (<code>B@k5o_Ped4s#88</code>)!</strong> Mengandung panjang >12 karakter, kombinasi huruf kapital, huruf kecil, angka, dan karakter simbol khusus (@, _, #) serta bukan kata umum di kamus."
  },
  {
    "id": "ka-2",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Bahaya Satu Password untuk Seluruh Akun",
    "desc": "Fajar memakai kata sandi yang sama persis untuk akun email, media sosial, game, dan akun tugas sekolahnya.",
    "visual": "🔓 Skenario: Akun game fiktif Fajar dibobol oleh penjahat siber.<br><strong>Pertanyaan:</strong> Ancaman apa yang langsung mengintai seluruh akun digital Fajar lainnya?",
    "answer": "<strong>Efek Domino (Credential Stuffing)!</strong> Karena sandinya sama persis, pelaku kejahatan siber dapat dengan mudah membobol akun email penting, media sosial, dan akun tugas Fajar menggunakan kata sandi bocor yang sama."
  },
  {
    "id": "ka-3",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Fungsi Rahasia Kode OTP",
    "desc": "Seseorang menelepon mengaku sebagai pihak kurir paket dan meminta 6 angka SMS yang baru saja masuk ke smartphone siswa.",
    "visual": "📩 SMS Masuk: <em>'Kode OTP verifikasi akun Anda adalah 839201. JANGAN BAGIKAN KEPADA SIAPA PUN TERMASUK KAMI.'</em><br><strong>Pertanyaan:</strong> Mengapa kode OTP tidak boleh diberikan dan apa kepanjangan OTP?",
    "answer": "<strong>OTP = One-Time Password (Sandi Sekali Pakai).</strong> OTP adalah kunci otentikasi rahasia lapis akhir. Jika diberikan, penelepon dapat mengambil alih akun dan mencuri uang/data di dalamnya!"
  },
  {
    "id": "ka-4",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Autentikasi Dua Langkah (2FA)",
    "desc": "Siswa mencoba login ke akun Google-nya di komputer perpustakaan sekolah. Sistem meminta konfirmasi persetujuan di smartphone siswa.",
    "visual": "📱 Notifikasi: <em>'Apakah ini Anda yang mencoba login dari Chrome Windows? [Ya, Ini Saya] / [Bukan, Tolak]'</em><br><strong>Pertanyaan:</strong> Apa nama sistem keamanan ini dan mengapa jauh lebih aman daripada sekadar password biasa?",
    "answer": "<strong>Verifikasi Dua Langkah / Two-Factor Authentication (2FA)!</strong> Lebih aman karena meskipun orang lain berhasil menebak kata sandi kita, mereka tetap tidak bisa masuk tanpa izin persetujuan fisik dari smartphone kita."
  },
  {
    "id": "ka-5",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Password Berisi Tanggal Lahir dan Nama Panggilan",
    "desc": "Dina menggunakan kata sandi <code>dina12042010</code> untuk akun media sosialnya. Dina lahir tanggal 12 April 2010.",
    "visual": "🎂 Profil Dina: Mencantumkan tanggal lahir lengkap dan nama panggilan di biodata publik.<br><strong>Pertanyaan:</strong> Mengapa kata sandi ini sangat rapuh terhadap tebakan orang lain?",
    "answer": "<strong>Sangat mudah ditebak melalui teknik Social Profiling!</strong> Siapa pun yang melihat tanggal lahir di bio media sosial atau kartu pelajar Dina dapat langsung mencoba kombinasi tersebut untuk membobol akunnya."
  },
  {
    "id": "ka-6",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Penggunaan Aplikasi Pengelola Sandi (Password Manager)",
    "desc": "Seorang ahli keamanan digital menyarankan siswa menggunakan aplikasi Password Manager daripada menghafal puluhan sandi di kepala.",
    "visual": "🔐 Fitur: Menyimpan seluruh kata sandi kompleks dalam brankas digital terenkripsi dengan 1 Master Password.<br><strong>Pertanyaan:</strong> Apa keuntungan utama menggunakan Password Manager?",
    "answer": "<strong>Dapat membuat dan menyimpan kata sandi unik, panjang, dan acak untuk setiap akun tanpa takut lupa, sehingga jika satu akun bocor akun lainnya tetap aman terlindungi!</strong>"
  },
  {
    "id": "ka-7",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Menulis Kata Sandi di Kertas Catatan Tempel",
    "desc": "Seorang siswa menuliskan kata sandi email sekolahnya pada kertas sticky note kuning lalu menempelkannya di bingkai monitor laptop.",
    "visual": "📝 Catatan Tempel: <em>'Password Email: Belajar#Informatika2026'</em> tertempel di laptop.<br><strong>Pertanyaan:</strong> Risiko keamanan fisik apa yang ditimbulkan dari kebiasaan ini?",
    "answer": "<strong>Risiko Shoulder Surfing / Pencurian Fisik!</strong> Siapa pun yang lewat atau berada di dekat laptop (teman, orang asing) dapat dengan mudah membaca dan mencatat kata sandi tersebut tanpa perlu keahlian komputer."
  },
  {
    "id": "ka-8",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Mengganti Kata Sandi Secara Berkala",
    "desc": "Guru menyarankan siswa mengganti kata sandi akun penting setidaknya setiap 3 hingga 6 bulan sekali.",
    "visual": "⏳ Kebijakan: Reset sandi rutin 3-6 bulan sekali.<br><strong>Pertanyaan:</strong> Apa manfaat dari mengganti kata sandi secara berkala?",
    "answer": "<strong>Mencegah akun disalahgunakan jika data sandi lama pernah bocor dalam kebocoran data (data breach) di internet tanpa kita sadari.</strong>"
  },
  {
    "id": "ka-9",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Kunci Layar Biometrik pada Smartphone",
    "desc": "Smartphone masa kini dilengkapi fitur keamanan biometrik seperti sensor sidik jari (Fingerprint) dan pengenal wajah (Face Unlock).",
    "visual": "🤳 Fitur: Kunci PIN vs Sidik Jari / Pemindai Wajah.<br><strong>Pertanyaan:</strong> Mengapa kunci biometrik sangat sulit ditiru orang lain dibanding pola garis (Pattern)?",
    "answer": "<strong>Karena ciri fisik biometrik (sidik jari & struktur wajah) unik bagi setiap individu manusia dan tidak meninggalkan bekas jejak garis minyak di layar seperti kunci pola!</strong>"
  },
  {
    "id": "ka-10",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Bahaya Meminjamkan Akun Game Online",
    "desc": "Doni meminjamkan akun game Mobile Legends miliknya kepada teman online yang baru dikenalnya di media sosial untuk 'dinaikkan rank-nya'.",
    "visual": "🎮 Janji Teman Online: <em>'Pinjam akunmu 2 hari, aku joki sampai rank Mythic gratis!'</em>.<br><strong>Pertanyaan:</strong> Apa risiko paling umum yang dialami pemain saat meminjamkan akun?",
    "answer": "<strong>Akun dibajak dan dicuri!</strong> Peminjam dapat langsung mengubah email pemulihan, mengganti password, atau menjual akun tersebut kepada orang lain tanpa izin."
  },
  {
    "id": "ka-11",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Perbandingan Kekuatan PIN 4 Digit vs 6 Digit",
    "desc": "Sistem dompet digital mewajibkan pengguna membuat PIN keamanan minimal 6 digit angka.",
    "visual": "🔢 PIN 4 Angka (10.000 kemungkinan) vs PIN 6 Angka (1.000.000 kemungkinan).<br><strong>Pertanyaan:</strong> Berapa kali lipat peningkatan keamanan kombinasi PIN 6 digit dibanding 4 digit?",
    "answer": "<strong>100 kali lipat lebih aman!</strong> PIN 4 angka hanya memiliki 10.000 kombinasi, sedangkan PIN 6 angka memiliki 1.000.000 (satu juta) kemungkinan sehingga jauh lebih sulit ditebak."
  },
  {
    "id": "ka-12",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Notifikasi Percobaan Login Gagal Berkali-kali",
    "desc": "Siswa menerima notifikasi bahwa akunnya dikunci sementara karena ada 5 kali percobaan memasukkan kata sandi yang salah secara berturut-turut.",
    "visual": "🔒 Peringatan: <em>'Akun dikunci 15 menit karena 5 kali salah password dari IP tidak dikenal.'</em><br><strong>Pertanyaan:</strong> Jenis serangan apa yang sedang dialami akun siswa tersebut?",
    "answer": "<strong>Serangan Brute Force (Tebakan Kata Sandi Otomatis)!</strong> Pelaku mencoba berbagai kata sandi secara berulang-ulang untuk membobol akun korban."
  },
  {
    "id": "ka-13",
    "category": "🔐 Kunci Akun",
    "points": 150,
    "title": "Menautkan Nomor Pemulihan & Email Cadangan",
    "desc": "Saat membuat akun Google atau media sosial, platform selalu meminta nomor telepon pemulihan dan email sekunder.",
    "visual": "🛡️ Pengaturan: [Nomor HP Pemulihan Aktif] & [Email Cadangan Terverifikasi].<br><strong>Pertanyaan:</strong> Mengapa fitur ini wajib diisi dengan kontak yang benar-benar aktif?",
    "answer": "<strong>Sebagai pintu darurat resmi untuk mereset dan memulihkan akun ketika kita lupa kata sandi atau akun diretas oleh pihak lain!</strong>"
  },
  {
    "id": "dr-1",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Akun Masih Terbuka di Komputer Sekolah",
    "desc": "Selesai jam praktikum di lab komputer, seorang siswa lupa menekan tombol 'Keluar/Log Out' pada akun email sekolahnya dan langsung pulang.",
    "visual": "💻 Status Komputer: Browser ditutup tanda silang [X], tetapi sesi login akun masih aktif.<br><strong>Pertanyaan:</strong> Apa bahayanya bagi siswa berikutnya yang menggunakan komputer tersebut?",
    "answer": "<strong>Siswa berikutnya dapat membuka kembali email tersebut tanpa password (sesi login belum berakhir)!</strong> Akun dapat disalahgunakan untuk mengirim pesan palsu, menghapus tugas, atau mencuri data pribadi."
  },
  {
    "id": "dr-2",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Bahaya WiFi Publik Terbuka Tanpa Sandi",
    "desc": "Saat berada di taman kota, siswa menghubungkan ponselnya ke jaringan WiFi gratis bernama <code>Free_Public_WiFi</code> untuk membuka akun perbankan.",
    "visual": "📶 Jaringan: WiFi gratis terbuka tanpa enkripsi password.<br><strong>Pertanyaan:</strong> Mengapa jaringan WiFi publik terbuka sangat berisiko untuk transaksi rahasia?",
    "answer": "<strong>Data yang dikirim rawan disadap oleh pihak ketiga (Man-in-the-Middle Attack)!</strong> Peretas di jaringan yang sama dapat merekam lalu lintas data yang tidak terenkripsi, termasuk username dan sandi yang dimasukkan."
  },
  {
    "id": "dr-3",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Jual Beli Akun & Permintaan Foto Identitas",
    "desc": "Siswa ingin menjual akun game lamanya secara daring. Calon pembeli meminta foto Kartu Pelajar dan selfie memegang kartu sebagai 'jaminan kepercayaan'.",
    "visual": "🪪 Permintaan: Foto Kartu Pelajar depan-belakang + Swafoto (selfie).<br><strong>Pertanyaan:</strong> Bahaya kejahatan siber besar apa yang mengancam jika foto identitas resmi ini dikirimkan?",
    "answer": "<strong>Pencurian Identitas (Identity Theft)!</strong> Data foto kartu dan wajah korban dapat disalahgunakan untuk pinjaman online ilegal, pendaftaran rekening penipuan, atau kejahatan siber atas nama korban."
  },
  {
    "id": "dr-4",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Membagikan Tangkapan Layar Chat Pribadi",
    "desc": "Seorang siswa bertengkar dengan temannya, lalu membagikan screenshot percakapan pesan pribadi dan nomor HP temannya ke media sosial publik.",
    "visual": "📸 Postingan: Tangkapan layar chat pribadi memuat nama lengkap dan nomor telepon teman.<br><strong>Pertanyaan:</strong> Pelanggaran etika dan keamanan apa yang terjadi dalam kasus ini?",
    "answer": "<strong>Pelanggaran Privasi dan Penyebaran Data Pribadi Tanpa Izin (Doxxing)!</strong> Percakapan pribadi bukan untuk konsumsi publik, dan menyebarkan nomor orang lain dapat memicu teror siber (cyberbullying)."
  },
  {
    "id": "dr-5",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Akun Kloning Menyamar Menjadi Teman Kelas",
    "desc": "Muncul akun Instagram baru yang memakai foto profil dan nama teman sekelas, lalu mengirim pesan DM meminjam uang pulsa.",
    "visual": "👥 Akun Tiruan: Foto & nama sama persis, tetapi jumlah pengikut hanya 3 orang dan akun baru dibuat kemarin.<br><strong>Pertanyaan:</strong> Apa istilah untuk modus pembuatan akun tiruan ini?",
    "answer": "<strong>Impersonation (Penyamaran Identitas)!</strong> Pelaku mengkloning akun korban untuk menipu teman-teman korban agar mengirimkan uang atau pulsa."
  },
  {
    "id": "dr-6",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Kuis Berantai Media Sosial (Challenge Profil)",
    "desc": "Tren video mengajak pengguna menjawab: 'Warna favorit', 'Nama hewan pertama', 'Nama gadis ibu kandung', dan 'Kota tempat lahir'.",
    "visual": "📱 Challenge: <em>'Yuk saling kenal! Jawab 5 fakta tentang dirimu ini di story!'</em>.<br><strong>Pertanyaan:</strong> Mengapa informasi ini sering diincar oleh pembobol akun?",
    "answer": "<strong>Karena merupakan pertanyaan pemulihan keamanan (Security Questions)!</strong> Pertanyaan seperti 'nama hewan pertama' dan 'nama gadis ibu' adalah pertanyaan standar pemulihan akun perbankan dan email."
  },
  {
    "id": "dr-7",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Mitos Mode Incognito / Private Window",
    "desc": "Siswa percaya bahwa dengan menggunakan mode Incognito pada browser, keberadaannya di internet 100% tidak terlihat oleh siapa pun.",
    "visual": "🕶️ Mode Incognito: Menghapus riwayat browsing dan cookie lokal setelah jendela ditutup.<br><strong>Pertanyaan:</strong> Siapa sajakah yang tetap dapat melihat aktivitas online siswa meski memakai Incognito?",
    "answer": "<strong>Penyedia Layanan Internet (ISP), administrator jaringan sekolah/WiFi, dan pemilik situs web yang dikunjungi tetap dapat melihat aktivitas online!</strong> Incognito hanya tidak mencatat histori di perangkat lokal."
  },
  {
    "id": "dr-8",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Menyimpan Sandi di Komputer Warnet / Rental",
    "desc": "Saat login di komputer rental warnet, muncul kotak dialog browser: <em>'Simpan kata sandi ini untuk situs ini? [Simpan] / [Jangan Pernah]'</em>.",
    "visual": "🖥️ Opsi Browser: Tombol 'Simpan Kata Sandi' (Save Password).<br><strong>Pertanyaan:</strong> Tombol mana yang wajib diklik siswa dan mengapa?",
    "answer": "<strong>Wajib klik 'JANGAN PERNAH' (Never)!</strong> Jika disimpan, kata sandi akan tersimpan di memory browser komputer warnet dan dapat dilihat oleh pengguna berikutnya."
  },
  {
    "id": "dr-9",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Tombol 'Download' Palsu yang Berlipat Ganda",
    "desc": "Di sebuah situs download tugas, terdapat 5 tombol hijau bertuliskan 'DOWNLOAD' besar, padahal tombol download file asli tersembunyi di bawah.",
    "visual": "🖱️ Halaman Web: Penuh tombol 'Download Now', 'Start Download', dan banner bergerak.<br><strong>Pertanyaan:</strong> Mengapa tombol download palsu ini dibuat dan apa bahayanya?",
    "answer": "<strong>Itu adalah iklan tipuan (Malvertising)!</strong> Mengkliknya akan mengunduh malware, adware, atau mengarahkan ke situs judi online yang berbahaya."
  },
  {
    "id": "dr-10",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Manipulasi Psikologis: Social Engineering",
    "desc": "Seorang penelepon gelap berbicara sangat ramah, memuji siswa, lalu dengan halus meminta siswa membacakan nomor kartu debit orang tua.",
    "visual": "🎭 Metode: Memanipulasi emosi, rasa percaya, atau ketakutan manusia untuk mendapatkan data rahasia.<br><strong>Pertanyaan:</strong> Apa istilah keamanan untuk teknik manipulasi psikologis ini?",
    "answer": "<strong>Social Engineering (Rekayasa Sosial)!</strong> Kejahatan ini tidak meretas sistem komputer, melainkan memperdaya kelengahan pikiran manusia."
  },
  {
    "id": "dr-11",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Menerima File Format .EXE dari Teman Discord",
    "desc": "Teman baru di server Discord mengirim file bernama <code>Game_Minecraft_Skin_Custom.exe</code> dan menyuruh siswa menjalankannya.",
    "visual": "📁 Berkas: Ekstensi <code>.exe</code> (Executable program pada sistem operasi Windows).<br><strong>Pertanyaan:</strong> Mengapa file skin game tidak boleh berformat .exe?",
    "answer": "<strong>Skin game seharusnya berformat gambar (.png), bukan .exe!</strong> File .exe adalah program yang dapat langsung mengeksekusi virus, trojan, atau pencuri token Discord di komputer korban."
  },
  {
    "id": "dr-12",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Bahaya Pengisian Daya USB Asing (Juice Jacking)",
    "desc": "Di stasiun umum, tersedia kabel charger USB tak bertuan yang sudah tertancap di dinding kios. Siswa langsung mencolokkan ponselnya.",
    "visual": "🔌 Port USB: Kabel data USB publik tanpa adaptor charger resmi.<br><strong>Pertanyaan:</strong> Kejahatan siber apa yang bisa terjadi melalui kabel data USB publik?",
    "answer": "<strong>Juice Jacking!</strong> Kabel data USB dapat digunakan peretas untuk mentransfer malware atau menyedot data di dalam smartphone saat ponsel sedang diisi daya."
  },
  {
    "id": "dr-13",
    "category": "⚡ Duel Rebutan",
    "points": 200,
    "title": "Bluetooth Selalu Menyala di Tempat Ramai",
    "desc": "Siswa selalu membiarkan fitur Bluetooth ponselnya dalam keadaan aktif dan 'Visible to All Devices' saat berada di mall atau stasiun.",
    "visual": "📶 Status Bluetooth: Aktif dan dapat ditemukan oleh semua perangkat asing di sekitar.<br><strong>Pertanyaan:</strong> Ancaman apa yang dapat terjadi (Bluebugging / Bluesnarfing)?",
    "answer": "<strong>Penyusupan nirkabel (Bluesnarfing / Bluebugging)!</strong> Peretas di dekatnya dapat mengirim file virus tanpa izin atau mengakses kontak telepon secara diam-diam."
  },
  {
    "id": "tb-1",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Aktivitas Login dari Kota Lain",
    "desc": "Pukul 01.00 malam, siswa menerima notifikasi email bahwa ada perangkat di kota lain yang baru saja berhasil masuk ke akunnya.",
    "visual": "🚨 Notifikasi: <em>'Login baru terdeteksi dari Perangkat Android, Lokasi: Samarinda (IP 182.25.xx.xx).'</em><br><strong>Pertanyaan:</strong> Apa 2 tindakan pertolongan pertama yang harus dilakukan saat itu juga?",
    "answer": "<strong>1. Segera ubah kata sandi utama saat itu juga. 2. Pilih menu 'Keluar dari semua perangkat lain' (Log out of all other sessions) pada pengaturan keamanan akun!</strong>"
  },
  {
    "id": "tb-2",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Teman Mengirim Pesan Pinjam Uang",
    "desc": "Akun WhatsApp teman sekelas mengirim pesan meminjam uang Rp 100.000 secara mendesak dengan rekening atas nama orang tidak dikenal.",
    "visual": "💬 Chat WA: <em>'Bro, pinjam 100rb mendesak banget, transfer ke norek ini ya. Jangan telepon, lagi di jalan.'</em><br><strong>Pertanyaan:</strong> Apa tindakan konfirmasi paling bijak sebelum memutuskan mengirim uang?",
    "answer": "<strong>Hubungi teman tersebut melalui panggilan suara langsung, video call, atau tanyakan langsung di sekolah!</strong> Akun WA teman kemungkinan besar sedang dibajak (di-takeover) oleh penipu."
  },
  {
    "id": "tb-3",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Flashdisk Berubah Menjadi Shortcut",
    "desc": "Setelah dicolokkan ke laptop rental, seluruh file tugas di flashdisk siswa tiba-tiba hilang dan hanya menyisakan icon shortcut (.lnk).",
    "visual": "📁 Tampilan Flashdisk: Folder Tugas_Informatika.lnk (ukuran 1 KB).<br><strong>Pertanyaan:</strong> Apa yang dilarang dilakukan dan apa status file tugas aslinya?",
    "answer": "<strong>Jangan klik ganda file shortcut tersebut!</strong> Mengklik shortcut akan menjalankan virus/malware. File asli sebenarnya disembunyikan (hidden) oleh virus dan dapat dipulihkan dengan pemindaian antivirus."
  },
  {
    "id": "tb-4",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Gawai Panas dan Pulsa Berkurang Sendiri",
    "desc": "Setelah mengunduh game modifikasi gratis dari situs asing, baterai smartphone menjadi boros, gawai panas, dan kuota cepat habis.",
    "visual": "🔋 Gejala Gawai: Panas saat layar mati, muncul iklan tiba-tiba, pulsa tersedot.<br><strong>Pertanyaan:</strong> Gejala infeksi program apa ini dan bagaimana langkah mengatasinya?",
    "answer": "<strong>Infeksi Malware / Spyware (Trojan)!</strong> Langkah penanganan: Masuk ke Safe Mode, segera copot (uninstall) aplikasi yang mencurigakan, putuskan koneksi internet, dan bersihkan dengan pemindai antivirus."
  },
  {
    "id": "tb-5",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Akun Medsos Memposting Iklan Sendiri",
    "desc": "Akun Instagram siswa tiba-tiba memposting foto promosi investasi bodong atau obat pelangsing tanpa pernah dibuat oleh siswa.",
    "visual": "📢 Feed Medsos: Terisi postingan spam otomatis secara berkala.<br><strong>Pertanyaan:</strong> Apa penyebabnya dan bagaimana menghentikannya?",
    "answer": "<strong>Aplikasi pihak ketiga (Third-party app) memiliki akses izin posting ke akun!</strong> Solusi: Buka Pengaturan Akun ➔ Keamanan ➔ 'Aplikasi dan Situs Web' ➔ Hapus (Revoke Access) semua aplikasi pihak ketiga yang mencurigakan."
  },
  {
    "id": "tb-6",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Tidak Sengaja Memasukkan Sandi di Situs Phishing",
    "desc": "Seorang siswa baru sadar 1 menit setelah memasukkan password di sebuah link palsu bahwa tautan tersebut ternyata phishing.",
    "visual": "⏳ Kondisi: Password baru saja di-submit ke formulir penipu.<br><strong>Pertanyaan:</strong> Tindakan darurat apa yang harus dilakukan secepat kilat?",
    "answer": "<strong>Buka situs web resmi asli saat itu juga dan ganti kata sandi sebelum peretas sempat menggunakannya, lalu aktifkan verifikasi dua langkah (2FA)!</strong>"
  },
  {
    "id": "tb-7",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Layar Laptop Terkunci Pesan Pemerasan",
    "desc": "Laptop lab komputer mendadak terkunci dengan pesan merah menyatakan semua dokumen terenkripsi dan meminta tebusan uang.",
    "visual": "☠️ Layar: Ransomware terdeteksi aktif menyandera berkas.<br><strong>Pertanyaan:</strong> Tindakan fisik pertama apa yang wajib dilakukan pada komputer tersebut?",
    "answer": "<strong>Segera cabut kabel LAN internet atau matikan koneksi Wi-Fi komputer seketika!</strong> Tujuannya memutus komunikasi malware agar tidak menyebar ke komputer lain di jaringan sekolah."
  },
  {
    "id": "tb-8",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Muncul Notifikasi Transaksi Liar di Dompet Digital",
    "desc": "Siswa menerima notifikasi transfer saldo keluar sebesar Rp 50.000 dari akun GoPay/DANA miliknya padahal ia sedang tidur.",
    "visual": "💳 Riwayat: Pengeluaran dana misterius ke rekening orang lain.<br><strong>Pertanyaan:</strong> Apa langkah tanggap darurat yang harus diambil?",
    "answer": "<strong>Segera ubah PIN dompet digital, lakukan 'Keluar dari semua sesi', dan laporkan segera ke pusat bantuan resmi aplikasi untuk membekukan akun!</strong>"
  },
  {
    "id": "tb-9",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Diteror Pesan Ancaman dari Nomor Tak Dikenal",
    "desc": "Siswa mendapatkan pesan chat intimidasi dan cemoohan dari nomor tak dikenal yang terus-menerus mengganggu kenyamanan belajarnya.",
    "visual": "📱 Chat Intimidasi: Pesan kasar berulang dari nomor asing.<br><strong>Pertanyaan:</strong> Sikap apa yang harus diambil dan jangan diambil?",
    "answer": "<strong>JANGAN membalas pesan cemoohan tersebut! Simpan bukti screenshot, blokir nomor tersebut, dan ceritakan kejadian ini kepada orang tua atau guru bimbingan konseling (BK).</strong>"
  },
  {
    "id": "tb-10",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Menemukan Flashdisk Tercecer di Lantai Lab",
    "desc": "Siswa menemukan sebuah USB Flashdisk tergeletak di koridor sekolah dengan label bertuliskan 'Kumpulan Kunci Jawaban Ujian'.",
    "visual": "💾 Flashdisk Misterius: Tergeletak tanpa pemilik jelas.<br><strong>Pertanyaan:</strong> Mengapa siswa tidak boleh mencolokkan flashdisk itu ke laptop pribadi?",
    "answer": "<strong>Bisa merupakan jebakan USB Baiting / Drop Attack!</strong> Flashdisk tersebut sengaja dijatuhkan peretas untuk memancing rasa penasaran agar dicolokkan ke laptop sehingga malware otomatis terpasang."
  },
  {
    "id": "tb-11",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Foto Siswa Dipakai Akun Palsu di Medsos",
    "desc": "Teman memberi tahu bahwa ada akun media sosial yang memakai foto wajah siswa dan memposting hal-hal negatif.",
    "visual": "👤 Akun Palsu: Menggunakan foto profil siswa tanpa izin.<br><strong>Pertanyaan:</strong> Tindakan apa yang tepat untuk menindak akun tiruan tersebut?",
    "answer": "<strong>Gunakan fitur 'Report / Laporkan Akun' dengan memilih kategori 'Meniru Saya' (Impersonating Me), serta ajak teman-teman untuk ikut me-report akun tersebut agar cepat ditutup oleh platform.</strong>"
  },
  {
    "id": "tb-12",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Email Menerima Ratusan Pesan Spam Sekaligus",
    "desc": "Dalam waktu 5 menit, kotak masuk email siswa dibanjiri 500 email pendaftaran newsletter yang tidak pernah didaftarkannya.",
    "visual": "📧 Kotak Masuk: Ratusan email spam masuk beruntun (Email Bombing).<br><strong>Pertanyaan:</strong> Mengapa peretas melakukan serangan Email Bombing ini?",
    "answer": "<strong>Sebagai taktik pengalih perhatian (Distraction Attack)!</strong> Tujuannya agar korban tidak menyadari ada 1 email peringatan penting (misal notifikasi transaksi atau ganti password akun penting) yang tenggelam di antara ratusan spam."
  },
  {
    "id": "tb-13",
    "category": "🛡️ Tanggap Bahaya",
    "points": 100,
    "title": "Lampu Indikator Kamera Gawai Menyala Sendiri",
    "desc": "Lampu titik hijau di sudut layar ponsel atau lampu webcam laptop menyala sendiri padahal siswa tidak sedang membuka aplikasi kamera.",
    "visual": "🟢 Indikator: Titik hijau (Privacy Indicator) aktif di layar gawai.<br><strong>Pertanyaan:</strong> Tanda bahaya apa yang sedang terjadi dan apa yang harus dilakukan?",
    "answer": "<strong>Ada aplikasi latar belakang (kemungkinan Spyware) yang sedang mengakses kamera diam-diam!</strong> Buka pengaturan izin aplikasi (Permissions) dan cabut izin kamera dari aplikasi yang mencurigakan."
  },
  {
    "id": "sb-1",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Aturan Emas Pencadangan Data 3-2-1",
    "desc": "Dalam bidang keamanan teknologi informasi, para ahli merekomendasikan strategi backup dengan rumus 3-2-1.",
    "visual": "💾 Rumus: 3 Salinan — 2 Media Berbeda — 1 Salinan Terpisah.<br><strong>Pertanyaan:</strong> Jelaskan secara rinci makna dari masing-masing angka dalam aturan 3-2-1 tersebut!",
    "answer": "<strong>3: Miliki minimal 3 salinan data penting.<br>2: Simpan dalam 2 jenis media berbeda (misal: harddisk laptop & flashdisk).<br>1: Simpan minimal 1 salinan di lokasi terpisah (misal: Cloud Storage seperti Google Drive)!</strong>"
  },
  {
    "id": "sb-2",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Mitos Menghapus Postingan di Internet",
    "desc": "Seorang siswa mengunggah video aib temannya di media sosial, lalu 10 menit kemudian menghapusnya (Delete Post).",
    "visual": "🌐 Skenario: Tombol hapus sudah ditekan, postingan tidak muncul lagi di profil.<br><strong>Pertanyaan:</strong> Mengapa jejak digital tersebut tetap bisa abadi dan berisiko di kemudian hari?",
    "answer": "<strong>Karena siapapun bisa mengunduh atau melakukan tangkapan layar (screenshot) selama 10 menit tersebut, serta mesin pencari/server arsip web dapat menyimpannya di cache! Jejak digital di internet bersifat permanen.</strong>"
  },
  {
    "id": "sb-3",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Membedakan Data Mentah vs Informasi Bermanfaat",
    "desc": "Jelaskan dengan analogi kehidupan siswa sehari-hari perbedaan antara data dan informasi!",
    "visual": "🔢 Data Mentah: [36.5°C, 38.8°C, 39.5°C, 36.2°C].<br><strong>Pertanyaan:</strong> Bagaimana kumpulan data mentah di atas diubah menjadi sebuah informasi yang bermakna bagi petugas UKS?",
    "answer": "<strong>Data adalah fakta mentah (angka suhu). Informasi adalah hasil olahan yang bermakna: 'Dua siswa mengalami demam tinggi dan memerlukan obat penurun panas segera!'</strong>"
  },
  {
    "id": "sb-4",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Bahaya Ransomware & Cara Membentengi Diri",
    "desc": "Ransomware adalah salah satu ancaman malware paling ditakuti oleh perusahaan, sekolah, maupun rumah sakit.",
    "visual": "🔒 Tampilan Layar: <em>'Semua file Anda telah dienkripsi. Bayar tebusan uang untuk mendapatkan kuncinya.'</em><br><strong>Pertanyaan:</strong> Bagaimana cara kerja ransomware dan benteng pertahanan terbaik melawannya?",
    "answer": "<strong>Cara kerja: Mengunci seluruh file dengan enkripsi rumit. Benteng pertahanan terbaik: Rutin melakukan BACKUP DATA secara teratur ke media offline yang terputus dari jaringan internet!</strong>"
  },
  {
    "id": "sb-5",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Konsep Enkripsi Data Sederhana",
    "desc": "Aplikasi WhatsApp menuliskan: <em>'Pesan ke obrolan ini diamankan dengan enkripsi ujung-ke-ujung (End-to-End Encryption)'</em>.",
    "visual": "🔐 Konsep: Teks Asli ('Halo') ➔ Kode Acak ('#8x!9q') ➔ Teks Asli ('Halo').<br><strong>Pertanyaan:</strong> Apa tujuan dari enkripsi data dalam komunikasi internet?",
    "answer": "<strong>Mengacak data sehingga hanya pengirim dan penerima yang sah yang dapat membaca pesan tersebut, sedangkan pihak ketiga atau penyadap di tengah jalan hanya melihat kode acak yang tidak bermakna!</strong>"
  },
  {
    "id": "sb-6",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Perbedaan Data Kuantitatif vs Kualitatif",
    "desc": "Guru menyuruh siswa mengumpulkan data hasil pengamatan tanaman di kebun sekolah.",
    "visual": "🌿 Data 1: Tinggi tanaman (15 cm, 18 cm, 22 cm).<br>🌿 Data 2: Kondisi daun ('Hijau Segar', 'Kekuningan', 'Layu').<br><strong>Pertanyaan:</strong> Manakah data kuantitatif dan manakah data kualitatif?",
    "answer": "<strong>Data 1 adalah Kuantitatif (berupa angka/bilangan yang dapat dihitung). Data 2 adalah Kualitatif (berupa sifat, deskripsi, atau kategori non-angka).</strong>"
  },
  {
    "id": "sb-7",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Oversharing Tiket Pesawat / Kereta Api",
    "desc": "Siswa bepergian liburan dan memposting foto boarding pass tiket kereta api ke media sosial dengan barcode terlihat jelas.",
    "visual": "🎫 Tiket: Memuat kode QR/Barcode dan kode booking (PNR).<br><strong>Pertanyaan:</strong> Bahaya apa yang dapat timbul jika barcode tiket dibaca oleh orang lain?",
    "answer": "<strong>Barcode menyimpan informasi lengkap: nama lengkap, nomor KTP, tanggal lahir, dan kode booking yang dapat digunakan orang lain untuk membatalkan atau mengubah jadwal perjalanan korban!</strong>"
  },
  {
    "id": "sb-8",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Data Primer vs Data Sekunder dalam Tugas Sekolah",
    "desc": "Dua kelompok siswa mengumpulkan data tentang kebiasaan sarapan pagi di madrasah.",
    "visual": "Kelompok A membagikan angket kuesioner ke 40 siswa. Kelompok B membaca artikel laporan penelitian dari internet.<br><strong>Pertanyaan:</strong> Kelompok manakah yang menghasilkan data primer?",
    "answer": "<strong>Kelompok A menghasilkan Data Primer (dikumpulkan langsung dari tangan pertama/sumber asli). Kelompok B menggunakan Data Sekunder (data yang telah dihimpun pihak lain sebelumnya).</strong>"
  },
  {
    "id": "sb-9",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Undang-Undang Perlindungan Data Pribadi (UU PDP)",
    "desc": "Indonesia telah mengesahkan Undang-Undang Perlindungan Data Pribadi untuk menjamin hak-hak privasi masyarakat.",
    "visual": "⚖️ Hukum: Setiap orang berhak atas perlindungan diri pribadi dan data rahasianya.<br><strong>Pertanyaan:</strong> Apa sanksi bagi pihak yang secara sengaja dan melawan hukum menyebarkan data pribadi orang lain?",
    "answer": "<strong>Dapat dikenai sanksi pidana penjara dan denda uang yang sangat besar sesuai ketentuan hukum UU Perlindungan Data Pribadi dan UU ITE!</strong>"
  },
  {
    "id": "sb-10",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Mengapa Antivirus Wajib Diperbarui Database-nya?",
    "desc": "Program antivirus di laptop sering meminta pembaruan basis data virus (Virus Definition Update).",
    "visual": "🛡️ Pembaruan Database: Memperbarui daftar 'sidik jari' virus baru.<br><strong>Pertanyaan:</strong> Apa yang terjadi jika database antivirus tidak pernah di-update selama 1 tahun?",
    "answer": "<strong>Antivirus menjadi tidak mengenali varian virus dan malware baru yang diciptakan dalam 1 tahun terakhir, sehingga komputer tetap bisa tertular malware baru tanpa terdeteksi!</strong>"
  },
  {
    "id": "sb-11",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Keuntungan dan Syarat Keamanan Cloud Storage",
    "desc": "Menyimpan file tugas di Google Drive atau Microsoft OneDrive memiliki banyak keunggulan dibanding hanya di flashdisk.",
    "visual": "☁️ Penyimpanan Cloud: Data dapat diakses dari mana saja saat gawai rusak/hilang.<br><strong>Pertanyaan:</strong> Syarat keamanan utama apa yang wajib diterapkan agar file di cloud tetap aman?",
    "answer": "<strong>Akun cloud wajib dilindungi dengan kata sandi yang kuat dan verifikasi dua langkah (2FA), serta tidak sembarangan mengatur izin berbagi file menjadi 'Siapa saja yang memiliki tautan dapat mengedit'!</strong>"
  },
  {
    "id": "sb-12",
    "category": "💎 Super Bonus",
    "points": 300,
    "title": "Arti Ikon Gembok (HTTPS) pada Alamat Browser",
    "desc": "Ketika membuka situs web resmi sekolah, di sebelah kiri alamat web terdapat ikon gembok kecil dan awalan <code>https://</code>.",
    "visual": "🔒 Tampilan Browser: Gembok Terkunci + <code>https://</code>.<br><strong>Pertanyaan:</strong> Huruf 'S' pada HTTPS merupakan singkatan dari apa dan apa maknanya?",
    "answer": "<strong>'S' = Secure (Aman)! Maknanya seluruh data yang dikirim antara komputer kita dan situs web tersebut dienkripsi (dilindungi SSL/TLS) sehingga tidak bisa disadap di tengah jalan.</strong>"
  },
  {
    "id": "wm-1",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Pesan Berkas Format .APK di WhatsApp",
    "desc": "Siswa menerima pesan WhatsApp dari kurir paket tak dikenal yang melampirkan berkas bernama <code>Foto_Paket_JNE.apk</code>.",
    "visual": "📦 Lampiran File: <code>Foto_Paket_JNE.apk</code> (Ekstensi .apk untuk sistem Android).<br><strong>Pertanyaan:</strong> Mengapa berkas .apk sangat berbahaya jika diinstal pada smartphone?",
    "answer": "<strong>Karena .apk adalah file instalasi aplikasi (bukan gambar/foto)! Jika dipasang, aplikasi jahat ini dapat menyusup, membaca seluruh SMS, dan mencuri kode OTP perbankan/aplikasi penting.</strong>"
  },
  {
    "id": "wm-2",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Bahaya Mengunduh Game Bajakan (Mod / Crack)",
    "desc": "Banyak situs web menawarkan game berbayar secara gratis dengan label 'Crack' atau 'MOD APK Unlimited Money'.",
    "visual": "🎮 Tawaran: Game mahal menjadi gratis 100%.<br><strong>Pertanyaan:</strong> Mengapa peretas mau membagikan game gratis? Apa motif tersembunyi yang membahayakan gawai?",
    "answer": "<strong>File bajakan sering disusupi malware/trojan tersembunyi! Tujuannya mencuri data akun, kata sandi, atau mengubah gawai korban menjadi sarana penambang kripto tanpa disadari.</strong>"
  },
  {
    "id": "wm-3",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Pembaruan Sistem (System Update) Berkala",
    "desc": "Smartphone siswa memunculkan notifikasi pembaruan patch keamanan sistem (Security Patch Update), namun siswa selalu menundanya.",
    "visual": "🔄 Notifikasi: <em>'Pembaruan Keamanan Sistem Tersedia (Ukuran: 250 MB).'</em><br><strong>Pertanyaan:</strong> Mengapa menunda pembaruan sistem berbahaya bagi keamanan gawai?",
    "answer": "<strong>Karena pembaruan menutup celah kerentanan keamanan (security bugs) yang ditemukan oleh pembuat sistem. Jika ditunda, celah tersebut dapat dieksploitasi oleh malware baru untuk membobol gawai!</strong>"
  },
  {
    "id": "wm-4",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Perbedaan Virus Komputer vs Spyware",
    "desc": "Keduanya merupakan jenis malware, tetapi memiliki tujuan operasi yang berbeda.",
    "visual": "🦠 Program A (Merusak sistem/menggandakan diri) vs Program B (Memantau ketikan & kamera diam-diam).<br><strong>Pertanyaan:</strong> Manakah yang disebut Virus dan manakah yang disebut Spyware?",
    "answer": "<strong>Program A adalah Virus (fokus merusak sistem/menggandakan diri). Program B adalah Spyware (bekerja senyap seperti mata-mata untuk mencuri data pribadi dan rekam ketikan keyboard).</strong>"
  },
  {
    "id": "wm-5",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Kuda Troya (Trojan Horse) Digital",
    "desc": "Mengambil nama dari kisah perang Yunani kuno, jenis malware ini menyamar sebagai aplikasi bermanfaat untuk mengecoh pengguna.",
    "visual": "🐴 Skenario: Mengunduh aplikasi kalkulator keren, namun di dalamnya tersembunyi program pencuri sandi.<br><strong>Pertanyaan:</strong> Mengapa jenis malware ini dinamakan Trojan Horse?",
    "answer": "<strong>Karena seperti Kuda Troya Yunani, program ini tampak menarik di luar tetapi membawa muatan berbahaya di dalamnya yang merusak sistem setelah berhasil masuk.</strong>"
  },
  {
    "id": "wm-6",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Adware: Serangan Iklan Pop-Up Agresif",
    "desc": "Setelah menginstal aplikasi wallpaper gratis, smartphone siswa mendadak memunculkan iklan video layar penuh setiap 2 menit sekali.",
    "visual": "📺 Gejala: Iklan terus bermunculan bahkan saat berada di menu layar utama (Home Screen).<br><strong>Pertanyaan:</strong> Apa nama jenis malware ini dan apa dampak utamanya?",
    "answer": "<strong>Adware (Advertising Malware)!</strong> Dampaknya menguras kuota internet, memperlambat kinerja gawai, membuat baterai panas, dan merusak kenyamanan penggunaan."
  },
  {
    "id": "wm-7",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Bahaya Program Keylogger",
    "desc": "Sebuah program spyware jenis Keylogger berhasil terpasang di komputer perpustakaan sekolah.",
    "visual": "⌨️ Cara Kerja: Merekam setiap ketukan tombol keyboard yang ditekan pengguna.<br><strong>Pertanyaan:</strong> Mengapa Keylogger sangat berbahaya bagi keamanan kata sandi?",
    "answer": "<strong>Karena setiap huruf dan angka kata sandi yang diketikkan pengguna akan terekam secara persis dan dikirimkan ke peretas, meskipun di layar hanya terlihat tanda bintang (•••••)!</strong>"
  },
  {
    "id": "wm-8",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Bahaya Membuka Kunci Root / Jailbreak Smartphone",
    "desc": "Seorang siswa melakukan 'Root' pada ponsel Android miliknya agar bisa memasang cheat game ilegal.",
    "visual": "⚙️ Kondisi: Proteksi keamanan tingkat administrator (Root/Jailbreak) telah dibuka.<br><strong>Pertanyaan:</strong> Mengapa smartphone yang di-root jauh lebih rentan terhadap serangan malware?",
    "answer": "<strong>Karena dinding pembatas keamanan sistem telah dihancurkan!</strong> Malware dapat langsung mengambil kendali penuh atas sistem operasi tanpa perlu meminta izin lagi kepada pengguna."
  },
  {
    "id": "wm-9",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Worm Komputer yang Menggandakan Diri",
    "desc": "Berbeda dengan virus biasa yang butuh bantuan manusia untuk dijalankan, malware jenis Worm dapat menyebar secara otomatis melalui jaringan.",
    "visual": "🐛 Karakteristik: Menyebar sendiri dari satu komputer ke komputer lain di jaringan Wi-Fi sekolah.<br><strong>Pertanyaan:</strong> Apa perbedaan utama Worm dibanding Virus komputer?",
    "answer": "<strong>Worm dapat menggandakan diri dan menular sendiri secara otomatis tanpa memerlukan interaksi atau bantuan tindakan manusia (seperti mengklik file)!</strong>"
  },
  {
    "id": "wm-10",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Ekstensi Browser (Add-On) Bajakan",
    "desc": "Siswa memasang ekstensi Chrome bajakan dari situs tidak resmi untuk mengunduh video berbayar.",
    "visual": "🧩 Ekstensi: Berasal dari file .crx liar bukan dari Chrome Web Store resmi.<br><strong>Pertanyaan:</strong> Bahaya apa yang dapat ditimbulkan oleh ekstensi browser berbahaya?",
    "answer": "<strong>Ekstensi dapat menyuntikkan iklan palsu, merekam riwayat penjelajahan, membaca data formulir login, dan mencuri cookie sesi akun online siswa!</strong>"
  },
  {
    "id": "wm-11",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Dokumen Pembawa Makro Berbahaya (.docm / .xlsm)",
    "desc": "Saat membuka file Word dari email asing, muncul bilah peringatan kuning: <em>'Macros have been disabled. [Enable Content]'</em>.",
    "visual": "⚠️ Peringatan Office: Menanyakan apakah pengguna ingin mengaktifkan Makro.<br><strong>Pertanyaan:</strong> Mengapa tombol 'Enable Content' tidak boleh diklik sembarangan pada file asing?",
    "answer": "<strong>Makro dapat berisi script kode program berbahaya (Macro Virus)!</strong> Mengaktifkannya dapat membuat script malware langsung berjalan otomatis dan menginfeksi sistem komputer."
  },
  {
    "id": "wm-12",
    "category": "🦠 Waspada Malware",
    "points": 250,
    "title": "Fitur Google Play Protect pada Android",
    "desc": "Pada aplikasi Google Play Store, terdapat fitur pemindai keamanan bawaan bernama Play Protect.",
    "visual": "🛡️ Layar Play Store: <em>'No harmful apps found. Play Protect scanned yesterday.'</em><br><strong>Pertanyaan:</strong> Apa fungsi utama dari Google Play Protect?",
    "answer": "<strong>Secara otomatis memindai seluruh aplikasi di perangkat smartphone untuk mendeteksi, memperingatkan, dan memblokir aplikasi berbahaya sebelum sempat merusak gawai.</strong>"
  },
  {
    "id": "rp-1",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Mengenali Alamat Website Resmi vs Tiruan",
    "desc": "Diberikan dua alamat situs pendaftaran beasiswa siswa:",
    "visual": "🌐 Alamat A: <code>https://beasiswa.kemdikbud.go.id</code><br>🌐 Alamat B: <code>http://kemdikbud.beasiswa-pelajar-gratis.xyz</code><br><strong>Pertanyaan:</strong> Manakah alamat resmi pemerintah dan sebutkan 2 ciri pembedanya!",
    "answer": "<strong>Alamat A resmi! Pembeda: 1. Menggunakan domain resmi pemerintah (.go.id), 2. Menggunakan protokol aman berenkripsi (HTTPS dengan ikon gembok).</strong>"
  },
  {
    "id": "rp-2",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Klasifikasi Data: Sensitif vs Umum",
    "desc": "Berikut daftar informasi: 1. NIK KTP, 2. Judul Lagu Favorit, 3. PIN ATM, 4. Makanan Kesukaan.",
    "visual": "📋 Daftar: [NIK KTP] [Judul Lagu] [PIN ATM] [Makanan Kesukaan].<br><strong>Pertanyaan:</strong> Sebutkan 2 data yang termasuk DATA SENSITIF RAHASIA yang pantang dibagikan!",
    "answer": "<strong>NIK KTP dan PIN ATM! Keduanya adalah data rahasia pribadi yang jika bocor dapat memicu kejahatan finansial, penipuan, dan pencurian identitas.</strong>"
  },
  {
    "id": "rp-3",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Kuis Tebak Kepribadian Viral di Media Sosial",
    "desc": "Sebuah kuis daring mengajak siswa mengisi: 'Nama Ibu Kandung', 'Nama Hewan Pertama', dan 'Bulan Kelahiran' untuk melihat zodiak masa depan.",
    "visual": "🔮 Kuis Viral: 'Cari Tahu Karakter Aslimu Berdasarkan Nama Ibu & Tempat Lahir!'<br><strong>Pertanyaan:</strong> Bahaya tersembunyi apa di balik kuis viral pengumpul data semacam ini?",
    "answer": "<strong>Data tersebut adalah pertanyaan keamanan pemulihan akun (Security Questions)! Peretas memanfaatkannya untuk menebak jawaban keamanan saat mencoba mereset password akun email/bank korban.</strong>"
  },
  {
    "id": "rp-4",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Izin Akses Aplikasi yang Berlebihan",
    "desc": "Sebuah aplikasi senter (Flashlight) di Play Store meminta izin akses: Kontak Telepon, Kamera, dan Lokasi GPS.",
    "visual": "🔦 Izin Aplikasi: <em>'Izinkan Aplikasi Senter membaca Kontak & Lokasi GPS Anda?'</em><br><strong>Pertanyaan:</strong> Mengapa izin akses ini sangat mencurigakan dan apa tindakan yang benar?",
    "answer": "<strong>Sangat mencurigakan karena senter hanya butuh akses lampu flash, tidak butuh kontak maupun GPS! Tindakan benar: Tolak izin akses dan segera hapus aplikasi tersebut karena berpotensi spyware.</strong>"
  },
  {
    "id": "rp-5",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Membagikan Lokasi Rumah di Kontribusi Peta Online",
    "desc": "Siswa menambahkan titik pin lokasi baru di Google Maps dengan label: <em>'Kamar Tidur Pribadi Arya'</em> lengkap dengan foto rumah.",
    "visual": "📍 Peta Publik: Lokasi rumah dan nama pemilik terpampang bebas di peta dunia.<br><strong>Pertanyaan:</strong> Ancaman privasi apa yang timbul dari tindakan ini?",
    "answer": "<strong>Mengancam privasi dan keselamatan fisik keluarga! Siapa pun di internet dapat mengetahui lokasi persis tempat tinggal dan mengidentifikasi anggota keluarga secara terbuka.</strong>"
  },
  {
    "id": "rp-6",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Apa itu 'Phishing Kit'?",
    "desc": "Dalam kejahatan siber, banyak penipu pemula yang bisa membuat halaman login tiruan hanya dalam hitungan menit.",
    "visual": "🧰 Paket Siap Pakai: Kumpulan kode HTML/CSS tiruan halaman login bank/medsos yang dijual di forum gelap.<br><strong>Pertanyaan:</strong> Apa nama paket alat pembuat situs tiruan ini?",
    "answer": "<strong>Phishing Kit!</strong> Paket template siap pakai yang memudahkan penipu membuat website tiruan untuk menjebak korban."
  },
  {
    "id": "rp-7",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Membedakan Email Resmi Bank vs Email Penipu",
    "desc": "Diberikan dua alamat pengirim email terkait verifikasi rekening:",
    "visual": "📧 Pengirim A: <code>layanan-nasabah@bankmandiri.co.id</code><br>📧 Pengirim B: <code>bankmandiri.pusatbantuan@gmail.com</code><br><strong>Pertanyaan:</strong> Manakah pengirim resmi dan apa ciri pembeda utamanya?",
    "answer": "<strong>Pengirim A resmi! Perusahaan perbankan resmi selalu menggunakan domain institusi resmi berbayar (@bankmandiri.co.id), bukan domain gratisan publik (@gmail.com).</strong>"
  },
  {
    "id": "rp-8",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Transaksi Keuangan di Komputer Publik",
    "desc": "Siswa membeli barang online di komputer rental warnet dan membayar menggunakan internet banking.",
    "visual": "🖥️ Lingkungan: Komputer umum yang digunakan bergantian oleh ratusan orang asing.<br><strong>Pertanyaan:</strong> Mengapa transaksi keuangan sangat dilarang dilakukan di komputer publik?",
    "answer": "<strong>Karena rawan terpasang program Keylogger atau hardware penyadap yang dapat merekam nomor kartu, username, dan password perbankan korban!</strong>"
  },
  {
    "id": "rp-9",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Menghapus Riwayat Pencarian (Clear Browsing Data)",
    "desc": "Setelah meminjam laptop teman untuk mencari materi tugas dan login email, apa saja data lokal yang wajib dibersihkan?",
    "visual": "🧹 Opsi Pembersihan Browser: Histori, Cookies, dan Cache.<br><strong>Pertanyaan:</strong> Mengapa Cookies wajib dibersihkan setelah selesai meminjam laptop teman?",
    "answer": "<strong>Karena Cookies menyimpan data sesi login aktif! Jika tidak dibersihkan, pemilik laptop berikutnya bisa membuka kembali akun siswa tanpa perlu memasukkan kata sandi.</strong>"
  },
  {
    "id": "rp-10",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Mengunggah Foto Kartu Keluarga (KK) ke Media Sosial",
    "desc": "Orang tua merasa bangga anggota keluarganya lengkap dan memposting foto lembar Kartu Keluarga asli ke status WhatsApp.",
    "visual": "📄 Dokumen: Kartu Keluarga lengkap memuat NIK, nama ibu kandung, tanggal lahir, dan alamat.<br><strong>Pertanyaan:</strong> Mengapa memposting dokumen Kartu Keluarga adalah bahaya fatal?",
    "answer": "<strong>Kartu Keluarga memuat seluruh data induk identitas kependudukan yang paling sering dipakai syarat pendaftaran pinjaman online ilegal dan kejahatan perbankan!</strong>"
  },
  {
    "id": "rp-11",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Undangan Pernikahan Digital Palsu vs Asli",
    "desc": "Beredar dua model undangan pernikahan digital di WhatsApp:",
    "visual": "Undangan 1: Berupa tautan situs web resmi <code>https://pernikahan-andi-siti.com</code>.<br>Undangan 2: Berupa kiriman berkas lampiran <code>Undangan_Pernikahan.apk</code>.<br><strong>Pertanyaan:</strong> Manakah yang merupakan modus malware berbahaya?",
    "answer": "<strong>Undangan nomor 2 (.apk)! Undangan digital asli berupa halaman web (link), sedangkan file .apk adalah aplikasi malware yang akan mencuri data SMS jika diinstal.</strong>"
  },
  {
    "id": "rp-12",
    "category": "🔄 Rebut Poin",
    "points": 150,
    "title": "Etika Menghapus Data Sebelum Menjual Ponsel Bekas",
    "desc": "Siswa ingin menjual smartphone lamanya untuk membeli gawai baru yang lebih canggih.",
    "visual": "📱 Persiapan: Ponsel lama akan berpindah tangan ke orang asing.<br><strong>Pertanyaan:</strong> Tindakan pembersihan apa yang wajib dilakukan agar data lama tidak bisa dipulihkan pembeli?",
    "answer": "<strong>Keluarkan semua akun digital (Sign Out), lakukan Factory Reset (Kembalikan ke Setelan Pabrik), dan lakukan format memori enkripsi secara tuntas!</strong>"
  },
  {
    "id": "kp-1",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Kebiasaan Oversharing Tiket & Kartu Pelajar",
    "desc": "Siswa merasa bangga mendapatkan kartu ujian dan tiket konser, lalu memposting fotonya dengan barcode terlihat sangat jelas.",
    "visual": "📸 Foto Story: Memperlihatkan barcode tiket konser dan Nomor Induk Siswa Nasional (NISN).<br><strong>Pertanyaan:</strong> Kerugian langsung apa yang bisa menimpa siswa tersebut?",
    "answer": "<strong>Barcode tiket dapat disalin atau dicuri orang lain sehingga tiket hangus saat dipakai masuk, serta data identitas kartu dapat disalahgunakan oleh pihak tidak bertanggung jawab!</strong>"
  },
  {
    "id": "kp-2",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Berbagi Lokasi Real-Time (Share Live Location)",
    "desc": "Siswa selalu mengunggah status media sosial dengan menyalakan tag lokasi tepat di depan gerbang rumahnya setiap kali pulang sekolah.",
    "visual": "📍 Status: <em>'Home sweet home! Lagi sendirian di rumah nih sampai malam.' + Pin Lokasi GPS.</em><br><strong>Pertanyaan:</strong> Ancaman keamanan fisik apa yang bisa ditimbulkan dari kebiasaan ini?",
    "answer": "<strong>Mengundang kejahatan fisik, penguntitan (stalking), dan pencurian rumah! Pelaku kejahatan dapat mengetahui lokasi persis dan jadwal kapan rumah korban dalam keadaan sepi.</strong>"
  },
  {
    "id": "kp-3",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Jejak Digital dan Masa Depan Siswa",
    "desc": "Seorang siswa gemar meninggalkan komentar kasar dan hoaks di media sosial dengan akun tanpa foto profil (anonim).",
    "visual": "💬 Komentar: Ujaran kebencian & cemoohan di postingan publik.<br><strong>Pertanyaan:</strong> Mengapa jejak digital ini tetap dapat membahayakan masa depan pendidikan dan karirnya?",
    "answer": "<strong>Akun anonim tetap bisa dilacak melalui alamat IP dan jejak digital dapat disimpan orang lain. Saat melamar sekolah kedinasan, beasiswa, atau pekerjaan, institusi kerap memeriksa rekam jejak digital calon siswa!</strong>"
  },
  {
    "id": "kp-4",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Etika Privasi Teman dalam Foto Bersama",
    "desc": "Sebelum mengunggah foto candid teman yang sedang tertidur dengan pose lucu di dalam kelas ke grup publik internet.",
    "visual": "📷 Foto Teman: Tertidur di meja kelas dengan mulut terbuka.<br><strong>Pertanyaan:</strong> Prinsip etika dan perlindungan privasi apa yang wajib dipatuhi sebelum mengunggahnya?",
    "answer": "<strong>Wajib meminta izin (Consent) teman yang bersangkutan terlebih dahulu! Jika teman tidak berkenan, jangan pernah membagikannya demi menghargai martabat dan privasi orang lain.</strong>"
  },
  {
    "id": "kp-5",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Pengaturan Akun Media Sosial: Publik vs Privat",
    "desc": "Siswa baru membuat akun Instagram dan dihadapkan pada pilihan jenis akun.",
    "visual": "🔒 Akun Privat (Hanya pengikut disetujui yang dapat melihat) vs 🌐 Akun Publik (Bebas dilihat 8 miliar orang).<br><strong>Pertanyaan:</strong> Mengapa bagi siswa usia SMP/MTs sangat disarankan mengunci akun ke mode privat?",
    "answer": "<strong>Untuk menyaring siapa saja yang dapat melihat foto, video, dan cerita pribadi siswa, sehingga terhindar dari penguntitan orang asing yang berniat jahat!</strong>"
  },
  {
    "id": "kp-6",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Bahaya Tren 'Drop Foto Masa Kecil & Tempat Lahir'",
    "desc": "Tren stiker 'Add Yours' di Instagram Story mengajak pengguna mengunggah foto akta kelahiran, tanda tangan, atau nama gadis ibu.",
    "visual": "📸 Stiker Tren: Diikuti oleh ribuan pengguna secara serentak.<br><strong>Pertanyaan:</strong> Mengapa tidak semua tren stiker media sosial aman untuk diikuti?",
    "answer": "<strong>Karena banyak tren yang sengaja dirancang untuk memancing data pribadi rahasia (Data Harvesting) yang bisa disalahgunakan untuk rekayasa sosial dan pembobolan akun!</strong>"
  },
  {
    "id": "kp-7",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Mengunggah Foto Rumah Tampak Nomor dan Plat Kendaraan",
    "desc": "Siswa memposting video 'Room Tour' yang diawali dari depan gerbang rumah memperlihatkan plat nomor motor dan nomor rumah secara jelas.",
    "visual": "📹 Video: Menyorot jelas plat kendaraan keluarga (misal: B 1234 XYZ) dan nomor RT/RW rumah.<br><strong>Pertanyaan:</strong> Informasi apa yang bisa digali orang asing dari plat kendaraan dan nomor rumah tersebut?",
    "answer": "<strong>Data domisili tempat tinggal, nama pemilik kendaraan, dan rute rutinitas harian keluarga yang dapat memicu tindak pencurian atau pemerasan!</strong>"
  },
  {
    "id": "kp-8",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Etika Merekam Orang Asing di Tempat Umum",
    "desc": "Siswa melihat orang yang berpakaian unik di halte bus, lalu diam-diam merekam videonya dan mengunggahnya ke TikTok dengan nada mengejek.",
    "visual": "📱 Video Candid: Merekam orang tanpa izin lalu mempostingnya ke publik untuk lelucon.<br><strong>Pertanyaan:</strong> Pelanggaran apa yang terjadi dan bagaimana dampak psikologis bagi korban?",
    "answer": "<strong>Pelanggaran hak privasi dan perundungan siber (Cyberbullying)! Korban dapat mengalami rasa malu mendalam, trauma psikologis, dan tekanan sosial di dunia nyata.</strong>"
  },
  {
    "id": "kp-9",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Fitur 'Close Friends' / Teman Dekat",
    "desc": "Banyak media sosial menyediakan fitur daftar 'Close Friends' untuk membatasi siapa saja yang melihat postingan personal.",
    "visual": "🟢 Fitur Close Friends: Konten hanya muncul bagi lingkaran teman terpercaya pilihan siswa.<br><strong>Pertanyaan:</strong> Apakah postingan di Close Friends dijamin 100% aman dari kebocoran ke publik?",
    "answer": "<strong>Tidak 100% aman! Teman di Close Friends tetap bisa melakukan tangkapan layar (screenshot) atau rekaman layar dan menyebarkannya keluar. Tetap berhati-hati dalam memposting hal sensitif!</strong>"
  },
  {
    "id": "kp-10",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Mencegah Cyberbullying di Kolom Komentar",
    "desc": "Melihat video karya teman sekelas di YouTube yang masih sederhana, beberapa netizen mulai melontarkan kata-kata makian kasar.",
    "visual": "💬 Kolom Komentar: Ujaran kebencian yang menyerang pribadi teman.<br><strong>Pertanyaan:</strong> Sikap positif apa yang harus ditunjukkan siswa yang berliterasi digital baik?",
    "answer": "<strong>Memberikan dukungan komentar positif yang membangun, tidak ikut memperkeruh suasana, dan membantu me-report komentar kasar yang melanggar pedoman komunitas!</strong>"
  },
  {
    "id": "kp-11",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Mencabut Izin Aplikasi Lama yang Sudah Tidak Dipakai",
    "desc": "Siswa memeriksa pengaturan privasi smartphone dan menemukan ada aplikasi game lama yang sudah tidak pernah dimainkan sejak 1 tahun lalu namun masih memiliki izin kontak.",
    "visual": "⚙️ Pengaturan: Game lama masih aktif membaca Kontak Telepon dan Lokasi.<br><strong>Pertanyaan:</strong> Apa tindakan terbaik terhadap aplikasi yang sudah tidak terpakai?",
    "answer": "<strong>Cabut izin aksesnya (Revoke Permissions) atau langsung hapus/uninstall aplikasi tersebut agar tidak membebani memori dan tidak menyedot data di latar belakang!</strong>"
  },
  {
    "id": "kp-12",
    "category": "🧠 Kritis Privasi",
    "points": 200,
    "title": "Prinsip Emas 'Think Before You Post'",
    "desc": "Sebelum menekan tombol bagikan (Share / Post) di akun media sosial apa pun.",
    "visual": "🧠 Prinsip THINK: T (True?), H (Helpful?), I (Inspiring?), N (Necessary?), K (Kind?).<br><strong>Pertanyaan:</strong> Mengapa pertanyaan reflektif 'Apakah postingan ini benar, bermanfaat, dan tidak merugikan orang lain?' wajib diajukan ke diri sendiri?",
    "answer": "<strong>Karena sekali sesuatu dibagikan ke internet, kendali penyebarannya sudah lepas dari tangan kita dan jejak digital tersebut akan menjadi cerminan reputasi pribadi kita selamanya!</strong>"
  }
];

function initBattleArena() {
  updateScoreboardUI();
  updateAwardButtons();
  drawBattleWheel();
}

function setTeamCount(count) {
  APP_STATE.battle.teamCount = count;

  document.querySelectorAll('.btn-team-count').forEach(btn => btn.classList.remove('active'));
  const activeBtn = document.getElementById(`btnTeam${count}`);
  if (activeBtn) activeBtn.classList.add('active');

  const cardGamma = document.getElementById('cardTeamGamma');
  const cardDelta = document.getElementById('cardTeamDelta');
  const cardEpsilon = document.getElementById('cardTeamEpsilon');
  const cardZeta = document.getElementById('cardTeamZeta');

  if (cardGamma) cardGamma.style.display = (count >= 3) ? 'flex' : 'none';
  if (cardDelta) cardDelta.style.display = (count >= 4) ? 'flex' : 'none';
  if (cardEpsilon) cardEpsilon.style.display = (count >= 5) ? 'flex' : 'none';
  if (cardZeta) cardZeta.style.display = (count >= 6) ? 'flex' : 'none';

  updateAwardButtons();
  playTone(500, 'sine', 0.1);
}

function adjustTeamScore(teamKey, delta) {
  APP_STATE.battle.scores[teamKey] = Math.max(0, APP_STATE.battle.scores[teamKey] + delta);
  updateScoreboardUI();

  if (delta > 0) {
    playTone(600, 'triangle', 0.1);
    playTone(800, 'triangle', 0.15, 0.08);
  } else {
    playTone(250, 'sawtooth', 0.15);
  }
}

function resetBattleScores() {
  if (confirm('Reset seluruh skor regu menjadi 0?')) {
    APP_STATE.battle.scores = { alpha: 0, beta: 0, gamma: 0, delta: 0, epsilon: 0, zeta: 0 };
    updateScoreboardUI();
  }
}

function updateScoreboardUI() {
  const teams = ['alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta'];
  teams.forEach(t => {
    const el = document.getElementById(`score${t.charAt(0).toUpperCase() + t.slice(1)}`);
    if (el) {
      el.textContent = APP_STATE.battle.scores[t];
    }
  });
}

function updateAwardButtons() {
  const container = document.getElementById('awardBtnGroup');
  if (!container) return;

  const count = APP_STATE.battle.teamCount;
  const teams = [
    { key: 'alpha', name: 'Regu Alpha 🦅', cls: 'award-alpha' },
    { key: 'beta', name: 'Regu Beta 🦁', cls: 'award-beta' }
  ];

  if (count >= 3) teams.push({ key: 'gamma', name: 'Regu Gamma 🐯', cls: 'award-gamma' });
  if (count >= 4) teams.push({ key: 'delta', name: 'Regu Delta ⚡', cls: 'award-delta' });
  if (count >= 5) teams.push({ key: 'epsilon', name: 'Regu Epsilon 🦊', cls: 'award-epsilon' });
  if (count >= 6) teams.push({ key: 'zeta', name: 'Regu Zeta 🐺', cls: 'award-zeta' });

  container.innerHTML = '';
  teams.forEach(tm => {
    const btn = document.createElement('button');
    btn.className = `btn-award-team ${tm.cls}`;
    btn.innerHTML = `+ Poin ke ${tm.name}`;
    btn.onclick = () => awardChallengePoints(tm.key);
    container.appendChild(btn);
  });
}

function drawBattleWheel() {
  const canvas = document.getElementById('battleWheelCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  const center = width / 2;
  const radius = center - 8;
  const totalSectors = WHEEL_SECTORS.length;
  const arc = (2 * Math.PI) / totalSectors;

  ctx.clearRect(0, 0, width, height);

  ctx.save();
  ctx.translate(center, center);
  ctx.rotate(APP_STATE.battle.wheelAngle);

  for (let i = 0; i < totalSectors; i++) {
    const sector = WHEEL_SECTORS[i];
    const angle = i * arc;

    ctx.beginPath();
    ctx.fillStyle = sector.color;
    ctx.moveTo(0, 0);
    ctx.arc(0, 0, radius, angle, angle + arc);
    ctx.lineTo(0, 0);
    ctx.fill();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5;
    ctx.stroke();

    ctx.save();
    ctx.fillStyle = sector.textColor;
    ctx.font = 'bold 11px Poppins, sans-serif';
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    ctx.rotate(angle + arc / 2);
    ctx.fillText(`${sector.label} (${sector.pts})`, radius - 14, 0);
    ctx.restore();
  }

  ctx.restore();

  // Border cincin luar emas
  ctx.beginPath();
  ctx.arc(center, center, radius, 0, 2 * Math.PI);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 5;
  ctx.stroke();
}

function spinBattleWheel() {
  if (APP_STATE.battle.isSpinning) return;
  initAudio();

  APP_STATE.battle.isSpinning = true;
  const spinBtn = document.getElementById('btnSpinWheel');
  if (spinBtn) spinBtn.disabled = true;

  stopChallengeCountdown();

  const totalSectors = WHEEL_SECTORS.length;
  const arc = (2 * Math.PI) / totalSectors;
  const targetSectorIndex = Math.floor(Math.random() * totalSectors);

  const extraRotations = (5 + Math.floor(Math.random() * 3)) * 2 * Math.PI;
  const targetAngle = extraRotations + (3 * Math.PI / 2) - (targetSectorIndex * arc + arc / 2);

  const startAngle = APP_STATE.battle.wheelAngle % (2 * Math.PI);
  const totalDelta = targetAngle - startAngle;
  const duration = 4000;
  const startTime = performance.now();

  let lastTickSoundSector = -1;

  function animateWheel(now) {
    const elapsed = now - startTime;
    const progress = Math.min(1, elapsed / duration);

    const easeOut = 1 - Math.pow(1 - progress, 3);
    APP_STATE.battle.wheelAngle = startAngle + totalDelta * easeOut;

    drawBattleWheel();

    const currentNormAngle = (APP_STATE.battle.wheelAngle % (2 * Math.PI) + 2 * Math.PI) % (2 * Math.PI);
    const curSector = Math.floor(currentNormAngle / arc);
    if (curSector !== lastTickSoundSector) {
      lastTickSoundSector = curSector;
      playTone(700, 'sine', 0.04, 0, 0.08);
    }

    if (progress < 1) {
      requestAnimationFrame(animateWheel);
    } else {
      APP_STATE.battle.isSpinning = false;
      if (spinBtn) spinBtn.disabled = false;

      playTone(523.25, 'triangle', 0.4, 0, 0.3);
      playTone(659.25, 'triangle', 0.5, 0.1, 0.3);

      const winningSector = WHEEL_SECTORS[targetSectorIndex];
      onWheelResultSelected(winningSector);
    }
  }

  requestAnimationFrame(animateWheel);
}

function onWheelResultSelected(sector) {
  if (!APP_STATE.battle.usedChallengeIds) {
    APP_STATE.battle.usedChallengeIds = [];
  }

  let matching = BATTLE_CHALLENGES.filter(c => c.category === sector.label);
  if (matching.length === 0) {
    matching = BATTLE_CHALLENGES;
  }

  let unused = matching.filter(c => !APP_STATE.battle.usedChallengeIds.includes(c.id));
  if (unused.length === 0) {
    APP_STATE.battle.usedChallengeIds = APP_STATE.battle.usedChallengeIds.filter(id => !matching.some(m => m.id === id));
    unused = matching;
  }

  const selectedTemplate = unused[Math.floor(Math.random() * unused.length)];
  APP_STATE.battle.usedChallengeIds.push(selectedTemplate.id);

  const challenge = Object.assign({}, selectedTemplate, { points: sector.pts, category: sector.label });
  APP_STATE.battle.currentChallenge = challenge;

  displayChallengeCard(challenge);
}

function nextChallengeInCategory() {
  const cur = APP_STATE.battle.currentChallenge;
  const cat = cur ? cur.category : '🎣 Jebakan Phishing';
  const pts = cur ? cur.points : 100;

  const sector = { label: cat, pts: pts };
  onWheelResultSelected(sector);
  playTone(587.33, 'triangle', 0.15);
}

function displayChallengeCard(ch) {
  const placeholder = document.getElementById('challengePlaceholder');
  const activeCard = document.getElementById('challengeActiveCard');
  if (placeholder) placeholder.style.display = 'none';
  if (activeCard) activeCard.style.display = 'block';

  document.getElementById('challengeCategoryPill').textContent = `Kategori: ${ch.category}`;
  document.getElementById('challengePointsPill').textContent = `+${ch.points} Poin Rebutan`;
  document.getElementById('challengeTitle').textContent = ch.title;
  document.getElementById('challengeDesc').textContent = ch.desc;
  document.getElementById('challengeVisualBox').innerHTML = ch.visual;
  document.getElementById('challengeAnswerText').innerHTML = ch.answer;

  const ansBox = document.getElementById('challengeRevealedAns');
  const toggleBtn = document.getElementById('btnToggleRevealAnswer');
  if (ansBox) ansBox.style.display = 'none';
  if (toggleBtn) toggleBtn.innerHTML = '👁️ Buka Kunci Jawaban & Pembahasan';

  startChallengeCountdown(15);
}

function nextRandomChallengeDirect() {
  const ch = BATTLE_CHALLENGES[Math.floor(Math.random() * BATTLE_CHALLENGES.length)];
  APP_STATE.battle.currentChallenge = ch;
  displayChallengeCard(ch);
}

function startChallengeCountdown(seconds) {
  stopChallengeCountdown();
  APP_STATE.battle.timerSec = seconds;

  const badge = document.getElementById('challengeTimerBadge');
  if (badge) badge.textContent = `⏱️ Waktu Rebutan: ${APP_STATE.battle.timerSec}s`;

  APP_STATE.battle.timerInterval = setInterval(() => {
    APP_STATE.battle.timerSec--;
    if (badge) badge.textContent = `⏱️ Waktu Rebutan: ${APP_STATE.battle.timerSec}s`;

    if (APP_STATE.battle.timerSec > 0) {
      playTone(650, 'sine', 0.05, 0, 0.05);
    } else {
      stopChallengeCountdown();
      if (badge) badge.textContent = `⏰ WAKTU HABIS! REBUTAN SELESAI!`;
      playTone(220, 'sawtooth', 0.4, 0, 0.25);
    }
  }, 1000);
}

function stopChallengeCountdown() {
  if (APP_STATE.battle.timerInterval) {
    clearInterval(APP_STATE.battle.timerInterval);
    APP_STATE.battle.timerInterval = null;
  }
}

function toggleChallengeAnswer() {
  const ansBox = document.getElementById('challengeRevealedAns');
  const btn = document.getElementById('btnToggleRevealAnswer');
  if (!ansBox || !btn) return;

  if (ansBox.style.display === 'none') {
    ansBox.style.display = 'block';
    btn.innerHTML = '🙈 Sembunyikan Kunci Jawaban';
  } else {
    ansBox.style.display = 'none';
    btn.innerHTML = '👁️ Buka Kunci Jawaban & Pembahasan';
  }
}

function awardChallengePoints(teamKey) {
  const pts = APP_STATE.battle.currentChallenge ? APP_STATE.battle.currentChallenge.points : 100;
  adjustTeamScore(teamKey, pts);

  playTone(523.25, 'triangle', 0.2, 0, 0.25);
  playTone(659.25, 'triangle', 0.2, 0.1, 0.25);
  playTone(783.99, 'triangle', 0.3, 0.2, 0.3);

  const card = document.getElementById(`cardTeam${teamKey.charAt(0).toUpperCase() + teamKey.slice(1)}`);
  const teamName = card ? card.querySelector('.team-name').innerText.trim() : `Regu ${teamKey}`;

  alert(`🎉 POIN MASUK! ${pts} Poin berhasil diraih oleh ${teamName}!`);

  APP_STATE.progress.act5Completed = true;
  updateGlobalProgress();
}

function coronateClassroomWinner() {
  const scores = APP_STATE.battle.scores;
  const count = APP_STATE.battle.teamCount;

  const teamList = [
    { key: 'alpha', name: 'Regu Alpha 🦅', score: scores.alpha },
    { key: 'beta', name: 'Regu Beta 🦁', score: scores.beta }
  ];

  if (count >= 3) teamList.push({ key: 'gamma', name: 'Regu Gamma 🐯', score: scores.gamma });
  if (count >= 4) teamList.push({ key: 'delta', name: 'Regu Delta ⚡', score: scores.delta });
  if (count >= 5) teamList.push({ key: 'epsilon', name: 'Regu Epsilon 🦊', score: scores.epsilon || 0 });
  if (count >= 6) teamList.push({ key: 'zeta', name: 'Regu Zeta 🐺', score: scores.zeta || 0 });

  teamList.sort((a, b) => b.score - a.score);

  const winner = teamList[0];
  document.getElementById('winnerTeamBanner').textContent = `${winner.name} JUARA 1 SIBER! 🏆`;
  document.getElementById('winnerCongratsText').textContent = `Hebat sekali! Memperoleh skor tertinggi ${winner.score} Poin dalam duel cerdas cermat keamanan data di kelas!`;

  const podiumContainer = document.getElementById('podiumScoresList');
  podiumContainer.innerHTML = '';

  const rankBadges = ['🥇 Juara 1', '🥈 Juara 2', '🥉 Juara 3', '🎖️ Peringkat 4', '🎖️ Peringkat 5', '🎖️ Peringkat 6'];
  teamList.forEach((tm, idx) => {
    const item = document.createElement('div');
    item.className = `podium-item ${idx === 0 ? 'podium-first' : ''}`;
    item.innerHTML = `
      <span>${rankBadges[idx]}: <strong>${tm.name}</strong></span>
      <span>${tm.score} Poin</span>
    `;
    podiumContainer.appendChild(item);
  });

  document.getElementById('classroomVictoryModal').style.display = 'flex';
  playVictoryFanfare();
}

function closeClassroomVictory() {
  const modal = document.getElementById('classroomVictoryModal');
  if (modal) modal.style.display = 'none';
}

// ==========================================================================
// PETUNJUK CARA BERMAIN UNTUK SETIAP AKTIVITAS (1 SAMPAI 5)
// ==========================================================================
const HOW_TO_PLAY_DATA = {
  1: {
    icon: '🧩',
    title: 'Cara Bermain: Aktivitas 1 — Urutkan Alur Darurat',
    category: 'Panduan Drag & Drop Tanggap Darurat Akun',
    steps: [
      {
        num: 1,
        title: 'Tujuan Permainan',
        text: 'Menyusun 6 langkah darurat ketika akun dicurigai dibobol dari langkah awal (Sadari Kejanggalan) hingga langkah akhir (Backup & Lapor).'
      },
      {
        num: 2,
        title: 'Menggunakan Komputer / Laptop',
        text: 'Klik dan tahan (Drag) kartu langkah pada simbol ☰, lalu geser ke atas atau ke bawah ke posisi urutan yang tepat (Drop).'
      },
      {
        num: 3,
        title: 'Menggunakan Smartphone / Tablet / Layar Sentuh',
        text: 'Tekan tombol panah ⬆ (Pindah ke Atas) atau ⬇ (Pindah ke Bawah) di sisi kanan setiap kartu untuk menaikkan atau menurunkan posisi.'
      },
      {
        num: 4,
        title: 'Periksa & Dapatkan Skor',
        text: 'Setelah urutan menurutmu sudah tepat dari langkah 1 sampai 6, tekan tombol "Periksa Jawaban". Kamu akan mendapat skor 100 jika berhasil!'
      }
    ],
    tip: '💡 Tips Siber: Urutan logisnya: Sadari kejanggalan ➔ Putuskan koneksi / jangan klik link ➔ Ganti password utama ➔ Pasang verifikasi dua langkah (2FA) ➔ Keluarkan perangkat aktif lain ➔ Lakukan backup data & lapor!'
  },
  2: {
    icon: '🔗',
    title: 'Cara Bermain: Aktivitas 2 — Jodohkan Istilah',
    category: 'Panduan Menjodohkan Istilah & Definisi',
    steps: [
      {
        num: 1,
        title: 'Pilih Istilah Siber (Sisi Kiri)',
        text: 'Klik salah satu kartu istilah siber di sisi kiri (kartu akan aktif dengan highlight warna biru).'
      },
      {
        num: 2,
        title: 'Pilih Fungsi yang Sesuai (Sisi Kanan)',
        text: 'Klik kartu pengertian/fungsi di sisi kanan yang menurutmu merupakan makna yang tepat dari istilah tersebut.'
      },
      {
        num: 3,
        title: 'Perhatikan Respon Kartu',
        text: 'Jika pasangan BENAR, kedua kartu akan berubah warna hijau dan terkunci. Jika SALAH, kartu akan bergetar merah dan kamu bisa mencoba kembali.'
      },
      {
        num: 4,
        title: 'Tuntaskan Seluruh Pasangan',
        text: 'Cocokkan seluruh 5 pasangan istilah (Phishing, Ransomware, Kode OTP, Jejak Digital, Backup Data) untuk menyelesaikan aktivitas ini!'
      }
    ],
    tip: '💡 Tips Siber: Ingat kata kuncinya! Phishing = umpan pancingan palsu, Ransomware = sandera file tebusan, OTP = sandi sekali pakai, Jejak Digital = rekaman online abadi, Backup = salinan cadangan.'
  },
  3: {
    icon: '📊',
    title: 'Cara Bermain: Aktivitas 3 — Audit Keamanan HOTS',
    category: 'Panduan Analisis Kritis Tingkat Tinggi',
    steps: [
      {
        num: 1,
        title: 'Cermati Tabel & Diagram Batang',
        text: 'Amati batang biru (Password Kuat) dan merah (Pernah Klik Phishing) untuk 5 kelas (8A, 8B, 8C, 9A, 9B) beserta data total siswa dan kebiasaan backup.'
      },
      {
        num: 2,
        title: 'Pahami Tantangan Soal HOTS',
        text: 'Soal tidak hanya sekadar membaca angka, melainkan menguji analisis disparitas kerentanan akun, perbandingan proporsi rasio kesadaran siber, dan evaluasi pemecahan masalah solutif.'
      },
      {
        num: 3,
        title: 'Pilih Jawaban Terbaik',
        text: 'Klik salah satu opsi pilihan A, B, C, atau D pada setiap nomor pertanyaan.'
      },
      {
        num: 4,
        title: 'Pelajari Pembahasan Analitis',
        text: 'Setelah memilih, feedback penjelasan ilmiah akan langsung muncul seketika untuk membimbing pemahaman analisismu.'
      }
    ],
    tip: '💡 Tips HOTS: Jangan hanya melihat angka nominal mentah! Perhatikan perbandingan persentase terhadap total masing-masing kelas dan selisih kerentanannya.'
  },
  4: {
    icon: '⚡',
    title: 'Cara Bermain: Aktivitas 4 — Clash of Champions (COC)',
    category: 'Panduan Ujian Memori Kilat Juara Siber',
    steps: [
      {
        num: 1,
        title: 'Fase 1: Hafalan Kilat 5 Detik',
        text: 'Saat tombol "Mulai Battle Champion Baru" ditekan, seluruh 12 kartu akan terbuka selama 5 DETIK PENUH dengan countdown 5... 4... 3... 2... 1...! Fokuskan mata dan hafalkan letak kartu secepat mungkin!'
      },
      {
        num: 2,
        title: 'Fase 2: Kartu Terkunci & Stopwatch Berjalan',
        text: 'Kartu otomatis tertutup dan stopwatch mulai berdetak. Klik 2 kartu untuk membukanya.'
      },
      {
        num: 3,
        title: 'Cocokkan Pasangan & Bangun Combo',
        text: 'Jika 2 kartu yang kamu buka merupakan pasangan konsep & fungsi yang cocok, kartu akan terkunci hijau dan kamu mendapat Combo Streak (+ efek suara juara)! Jika salah, kartu akan menutup kembali.'
      },
      {
        num: 4,
        title: 'Raih Gelar Grand Champion',
        text: 'Selesaikan 6 pasangan kartu secepat mungkin. Waktu di bawah 24 detik akan menganugerahkan gelar prestisius GRAND CHAMPION!'
      }
    ],
    tip: '💡 Tips COC: Bagi area pandang memorimu menjadi sisi kiri dan kanan saat hitungan mundur 5 detik berlangsung!'
  },
  5: {
    icon: '🔥',
    title: 'Cara Bermain: Aktivitas 5 — Battle Regu Kelas',
    category: 'Panduan Duel Multiplayer Bersama di Kelas',
    steps: [
      {
        num: 1,
        title: 'Bagi Kelas Menjadi 2 Sampai 6 Regu',
        text: 'Pilih jumlah regu (2 sampai 6 tim: Alpha 🦅, Beta 🦁, Gamma 🐯, Delta ⚡, Epsilon 🦊, Zeta 🐺). Guru atau ketua regu dapat mengedit nama regu langsung di layar.'
      },
      {
        num: 2,
        title: 'Putar Roda Tantangan Keberuntungan',
        text: 'Tekan tombol besar "PUTAR RODA TANTANGAN!". Roda berputar dengan animasi fisika dan mendarat pada kategori tantangan siber serta nominal poin (100 - 300 Poin).'
      },
      {
        num: 3,
        title: 'Tantangan Rebutan 15 Detik',
        text: 'Studi kasus keamanan siber akan muncul di layar. Jalankan timer hitung mundur 15 detik. Anggota regu berdiskusi cepat dan berebut mengacungkan tangan untuk menjawab!'
      },
      {
        num: 4,
        title: 'Buka Kunci Jawaban & Beri Poin',
        text: 'Guru membuka tombol "Buka Kunci Jawaban" untuk memvalidasi. Jika benar, klik tombol "+ Poin ke Regu..." yang menang. Skor di papan live akan otomatis bertambah!'
      },
      {
        num: 5,
        title: 'Nobatkan Juara Kelas',
        text: 'Di akhir pelajaran, tekan tombol "👑 Nobatkan Regu Juara Kelas!" untuk menampilkan podium pemenang, mahkota emas, dan lagu selebrasi kemenangan!'
      }
    ],
    tip: '💡 Tips Guru / Moderator Kelas: Sambungkan laptop ke LCD Proyektor dan aktifkan speaker agar suara efek gong roda dan detak timer ketegangan terdengar seru oleh seluruh siswa di kelas!'
  }
};

function showHowToPlay(actNum) {
  initAudio();
  const data = HOW_TO_PLAY_DATA[actNum];
  if (!data) return;

  const iconEl = document.getElementById('htpIcon');
  const titleEl = document.getElementById('htpTitle');
  const catEl = document.getElementById('htpCategory');
  const bodyEl = document.getElementById('htpContentBody');

  if (iconEl) iconEl.textContent = data.icon;
  if (titleEl) titleEl.textContent = data.title;
  if (catEl) catEl.textContent = data.category;

  if (bodyEl) {
    bodyEl.innerHTML = '';
    data.steps.forEach(step => {
      const stepCard = document.createElement('div');
      stepCard.className = 'htp-step-card';
      stepCard.innerHTML = `
        <div class="htp-step-num">${step.num}</div>
        <div class="htp-step-content">
          <strong>${step.title}</strong>
          <p>${step.text}</p>
        </div>
      `;
      bodyEl.appendChild(stepCard);
    });

    if (data.tip) {
      const tipEl = document.createElement('div');
      tipEl.className = 'htp-pro-tip';
      tipEl.innerHTML = data.tip;
      bodyEl.appendChild(tipEl);
    }
  }

  const modal = document.getElementById('howToPlayModal');
  if (modal) modal.classList.add('open');
  playTone(550, 'triangle', 0.15);
}

function closeHowToPlayModal(event) {
  if (event && event.target !== event.currentTarget && !event.target.classList.contains('modal-close-btn')) {
    return;
  }
  const modal = document.getElementById('howToPlayModal');
  if (modal) modal.classList.remove('open');
}

// ==========================================================================
// 8. MENU KUIS PEMAHAMAN (10 SOAL LENGKAP)
// ==========================================================================
function renderQuizQuestion() {
  const q = QUIZ_QUESTIONS[APP_STATE.quiz.currentIndex];
  if (!q) return;

  document.getElementById('quizQuestionTracker').textContent = `Soal ${APP_STATE.quiz.currentIndex + 1} dari ${QUIZ_QUESTIONS.length}`;
  document.getElementById('quizQuestionCategory').textContent = q.category;
  document.getElementById('quizQuestionText').textContent = q.question;

  const answeredCount = Object.keys(APP_STATE.quiz.userAnswers).length;
  document.getElementById('quizAnsweredTracker').textContent = `${answeredCount} / ${QUIZ_QUESTIONS.length} Terjawab`;

  // Render opsi jawaban
  const optionsList = document.getElementById('quizOptionsList');
  const currentSaved = APP_STATE.quiz.userAnswers[APP_STATE.quiz.currentIndex];

  optionsList.innerHTML = q.options.map(opt => `
    <button class="quiz-opt-btn ${currentSaved === opt.letter ? 'selected' : ''}" onclick="quizSelectAnswer('${opt.letter}')">
      <span class="opt-letter">${opt.letter}</span>
      <span style="flex: 1;">${opt.text}</span>
    </button>
  `).join('');

  // Perbarui tombol navigasi
  const prevBtn = document.getElementById('quizPrevBtn');
  const nextBtn = document.getElementById('quizNextBtn');

  prevBtn.disabled = (APP_STATE.quiz.currentIndex === 0);

  if (APP_STATE.quiz.currentIndex === QUIZ_QUESTIONS.length - 1) {
    nextBtn.textContent = '🏁 Kumpulkan Jawaban Kuis';
    nextBtn.className = 'btn btn-success';
  } else {
    nextBtn.textContent = 'Soal Berikutnya ➔';
    nextBtn.className = 'btn btn-primary';
  }
}

function quizSelectAnswer(letter) {
  APP_STATE.quiz.userAnswers[APP_STATE.quiz.currentIndex] = letter;
  renderQuizQuestion();
}

function quizNavPrev() {
  if (APP_STATE.quiz.currentIndex > 0) {
    APP_STATE.quiz.currentIndex--;
    renderQuizQuestion();
  }
}

function quizNavNext() {
  if (APP_STATE.quiz.currentIndex < QUIZ_QUESTIONS.length - 1) {
    APP_STATE.quiz.currentIndex++;
    renderQuizQuestion();
  } else {
    // Selesai Kuis
    quizSubmit();
  }
}

function quizSubmit() {
  const answeredCount = Object.keys(APP_STATE.quiz.userAnswers).length;
  if (answeredCount < QUIZ_QUESTIONS.length) {
    const confirmFinish = confirm(`Kamu baru menjawab ${answeredCount} dari ${QUIZ_QUESTIONS.length} soal. Apakah kamu yakin ingin mengumpulkan sekarang?`);
    if (!confirmFinish) return;
  }

  // Hitung Skor
  let correctCount = 0;
  QUIZ_QUESTIONS.forEach((q, idx) => {
    if (APP_STATE.quiz.userAnswers[idx] === q.correct) {
      correctCount++;
    }
  });

  const finalScore = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  // Tampilkan layar hasil
  document.getElementById('quizActiveCard').style.display = 'none';
  const resultCard = document.getElementById('quizResultCard');
  resultCard.style.display = 'block';

  document.getElementById('quizFinalScore').textContent = finalScore;

  // Lencana & Feedback
  const badgeEl = document.getElementById('quizRewardBadge');
  const titleEl = document.getElementById('quizFeedbackTitle');
  const descEl = document.getElementById('quizFeedbackDesc');

  if (finalScore === 100) {
    badgeEl.textContent = '🏆 Master Penjaga Keamanan Siber Junior!';
    titleEl.textContent = 'Luar Biasa Sempurna! (Nilai 100)';
    descEl.textContent = 'Kamu telah memahami seluruh konsep keamanan data dan siap menjadi pelopor literasi digital di sekolahmu!';
  } else if (finalScore >= 80) {
    badgeEl.textContent = '🌟 Detektif Keamanan Digital Handal';
    titleEl.textContent = 'Sangat Bagus!';
    descEl.textContent = 'Kamu memiliki pemahaman yang kuat tentang cara melindungi akun, perangkat, dan data pribadimu.';
  } else if (finalScore >= 60) {
    badgeEl.textContent = '👍 Pelajar Waspada Digital';
    titleEl.textContent = 'Cukup Baik!';
    descEl.textContent = 'Kamu sudah memahami dasar-dasar keamanan data. Perhatikan ulasan pembahasan untuk memperkuat pengetahuanmu.';
  } else {
    badgeEl.textContent = '📚 Perlu Belajar Lagi';
    titleEl.textContent = 'Tetap Semangat Belajar!';
    descEl.textContent = 'Jangan berkecil hati! Baca kembali materi pembelajaran dan coba ulangi kuis untuk hasil yang lebih baik.';
  }

  // Render Pembahasan
  const reviewList = document.getElementById('quizReviewList');
  reviewList.innerHTML = QUIZ_QUESTIONS.map((q, idx) => {
    const userChoice = APP_STATE.quiz.userAnswers[idx] || 'Belum Dijawab';
    const isCorrect = (userChoice === q.correct);

    return `
      <div class="review-card ${isCorrect ? 'is-correct' : 'is-wrong'}">
        <div style="font-weight: 800; font-size: 0.95rem; margin-bottom: 0.35rem;">
          ${idx + 1}. ${q.question}
        </div>
        <div style="font-size: 0.88rem; margin-bottom: 0.35rem;">
          Jawaban Kamu: <strong>${userChoice}</strong> ${isCorrect ? '✅ (Benar)' : `❌ (Salah, Kunci Jawaban: ${q.correct})`}
        </div>
        <div style="font-size: 0.85rem; color: var(--color-text-muted); padding-top: 0.35rem; border-top: 1px dashed rgba(0,0,0,0.1);">
          💡 <em>Pembahasan:</em> ${q.explanation}
        </div>
      </div>
    `;
  }).join('');

  APP_STATE.progress.quizCompleted = true;
  updateGlobalProgress();
  window.scrollTo({ top: resultCard.offsetTop - 80, behavior: 'smooth' });
}

function quizRestart() {
  APP_STATE.quiz.currentIndex = 0;
  APP_STATE.quiz.userAnswers = {};
  APP_STATE.quiz.isFinished = false;

  document.getElementById('quizResultCard').style.display = 'none';
  document.getElementById('quizActiveCard').style.display = 'block';

  renderQuizQuestion();
  window.scrollTo({ top: document.getElementById('kuis').offsetTop - 80, behavior: 'smooth' });
}

// ==========================================================================
// 9. MENU RANGKUMAN (CHECKLIST 10 ATURAN EMAS)
// ==========================================================================
const GOLDEN_RULES_CHECKLIST = [
  'Saya berjanji tidak akan pernah membagikan kata sandi akun kepada siapa pun.',
  'Saya berjanji tidak akan pernah memberikan kode rahasia OTP kepada orang lain.',
  'Saya selalu berhati-hati dan memeriksa alamat tautan (link) sebelum mengkliknya.',
  'Saya tidak mudah percaya pada tawaran hadiah gratis yang tidak masuk akal.',
  'Saya menjaga kerahasiaan data pribadi (alamat, nomor telepon, foto rahasia).',
  'Saya menggunakan kata sandi yang kuat dengan kombinasi huruf, angka, dan simbol.',
  'Saya menyaring informasi terlebih dahulu sebelum menyebarkannya ke teman.',
  'Saya akan segera melapor ke guru atau orang tua bila melihat ancaman mencurigakan.',
  'Saya hanya mengunduh aplikasi dan berkas dari penyedia sumber yang terpercaya.',
  'Saya selalu berpikir matang sebelum mengunggah sesuatu demi menjaga jejak digital.'
];

function initCommitments() {
  const list = document.getElementById('commitmentsList');
  if (!list) return;

  list.innerHTML = GOLDEN_RULES_CHECKLIST.map((rule, idx) => `
    <li class="checklist-item" id="commitItem-${idx}" onclick="toggleCommitment(${idx})">
      <div class="custom-checkbox" id="commitBox-${idx}"></div>
      <span style="font-size: 0.9rem; font-weight: 600;">${idx + 1}. ${rule}</span>
    </li>
  `).join('');

  updateCommitmentDisplay();
}

function toggleCommitment(idx) {
  if (APP_STATE.commitments.has(idx)) {
    APP_STATE.commitments.delete(idx);
  } else {
    APP_STATE.commitments.add(idx);
  }
  updateCommitmentDisplay();
  updateGlobalProgress();
}

function updateCommitmentDisplay() {
  GOLDEN_RULES_CHECKLIST.forEach((_, idx) => {
    const item = document.getElementById(`commitItem-${idx}`);
    const box = document.getElementById(`commitBox-${idx}`);
    if (APP_STATE.commitments.has(idx)) {
      item.classList.add('checked');
      box.textContent = '✓';
    } else {
      item.classList.remove('checked');
      box.textContent = '';
    }
  });

  const countEl = document.getElementById('commitmentProgressText');
  if (countEl) {
    countEl.textContent = `${APP_STATE.commitments.size} dari ${GOLDEN_RULES_CHECKLIST.length} Dicentang`;
  }
}

function resetCommitments() {
  APP_STATE.commitments.clear();
  updateCommitmentDisplay();
  updateGlobalProgress();
}

// ==========================================================================
// 10. INISIALISASI SAAT HALAMAN SELESAI DIMUAT
// ==========================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Render Komponen Utama
  renderThreatsGrid();
  initActivity1();
  initActivity2();
  drawChartAct3();
  initCocArena();
  initBattleArena();
  renderQuizQuestion();
  initCommitments();

  // Update indikator awal
  updateGlobalProgress();
});
