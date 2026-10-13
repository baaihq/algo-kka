import { Level } from '../types/game';

export const DAFTAR_LEVEL: Level[] = [
  // ==========================================
  // STASIUN 1: PERCABANGAN 1-ARAH (JIKA-MAKA)
  // ==========================================
  {
    id: 'gerbang-tamu',
    nama: 'Gerbang Tamu — Mudah',
    cerita: 'ALGO ditugaskan sebagai penjaga gerbang pos stasiun luar angkasa. Bantu ALGO memeriksa data yang masuk sebelum menentukan akses!',
    tujuan: 'Selesaikan misi sesuai ATURAN yang tampil di layar: hanya data yang memenuhi ketentuan yang diproses.',
    ikon: 'ShieldCheck',
    palet: ['jika_maka', 'izinkan', 'buka', 'tolak'],
    petunjuk: [
      'Gunakan struktur JIKA [data …] MAKA untuk membuat keputusan satu arah.',
      'Nama data dan nilai pembanding mengikuti varian misi yang kamu dapatkan — perhatikan ATURAN di layar.',
      'Pilih operator perbandingan yang sesuai ATURAN varian (waspadai jebakan = vs !=).',
      'Pasang blok aksi yang tepat ke dalam rongga MAKA. Jika data tidak memenuhi ketentuan, robot ALGO tidak boleh melakukan aksi apa pun.'
    ],
    varian: [
      {
        id: 1,
        ringkasan: 'Pintu Gerbang Utama',
        aturan: [
          { jika: 'kartu = "berlaku"', maka: 'Izinkan masuk' }
        ],
        konteks: 'Pintu Gerbang Utama Stasiun: Pengunjung diizinkan masuk hanya jika kartu identitas berstatus "berlaku".',
        namaData: 'kartu',
        pembandingDefault: 'berlaku',
        pesanTersedia: [],
        operatorBenar: '=',
        dataUji: [
          {
            data: { kartu: 'berlaku' },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Kartu "berlaku" (tepat berstatus berlaku) → Robot mengizinkan masuk.'
          },
          {
            data: { kartu: 'rusak' },
            harapan: [],
            keterangan: 'Kartu "rusak" (bukan berlaku) → Tidak ada tindakan.'
          },
          {
            data: { kartu: 'asing' },
            harapan: [],
            keterangan: 'Kartu "asing" (bukan berlaku) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 2,
        ringkasan: 'Pintu Dermaga Kargo',
        aturan: [
          { jika: 'kartu != "diblokir"', maka: 'Buka gerbang kargo' }
        ],
        konteks: 'Pintu Dermaga Kargo: Buka gerbang kargo untuk semua kontainer selain yang berstatus "diblokir".',
        namaData: 'kartu',
        pembandingDefault: 'diblokir',
        pesanTersedia: [],
        operatorBenar: '!=',
        dataUji: [
          {
            data: { kartu: 'diblokir' },
            harapan: [],
            keterangan: 'Kartu "diblokir" (tepat status larangan) → Gerbang kargo tidak dibuka.'
          },
          {
            data: { kartu: 'resmi' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Kartu "resmi" (selain diblokir) → Robot membuka gerbang kargo.'
          },
          {
            data: { kartu: 'aktif' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Kartu "aktif" (selain diblokir) → Robot membuka gerbang kargo.'
          }
        ]
      },
      {
        id: 3,
        ringkasan: 'Pintu Perpustakaan',
        aturan: [
          { jika: 'kartu = "mahasiswa"', maka: 'Izinkan masuk' }
        ],
        konteks: 'Akses Pintu Perpustakaan: Pengunjung diizinkan masuk ruang baca jika kartu identitas berstatus "mahasiswa".',
        namaData: 'kartu',
        pembandingDefault: 'mahasiswa',
        pesanTersedia: [],
        operatorBenar: '=',
        dataUji: [
          {
            data: { kartu: 'mahasiswa' },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Kartu "mahasiswa" (berstatus mahasiswa) → Robot mengizinkan masuk.'
          },
          {
            data: { kartu: 'umum' },
            harapan: [],
            keterangan: 'Kartu "umum" (bukan mahasiswa) → Tidak ada tindakan.'
          },
          {
            data: { kartu: 'alumni' },
            harapan: [],
            keterangan: 'Kartu "alumni" (bukan mahasiswa) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 4,
        ringkasan: 'Bengkel Mesin',
        aturan: [
          { jika: 'lisensi != "kedaluwarsa"', maka: 'Buka gerbang' }
        ],
        konteks: 'Akses Bengkel Mesin: Buka gerbang bengkel mesin untuk teknisi dengan lisensi bukan "kedaluwarsa".',
        namaData: 'lisensi',
        pembandingDefault: 'kedaluwarsa',
        pesanTersedia: [],
        operatorBenar: '!=',
        dataUji: [
          {
            data: { lisensi: 'kedaluwarsa' },
            harapan: [],
            keterangan: 'Lisensi "kedaluwarsa" (status terlarang) → Gerbang tidak dibuka.'
          },
          {
            data: { lisensi: 'valid' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Lisensi "valid" (bukan kedaluwarsa) → Robot membuka gerbang.'
          },
          {
            data: { lisensi: 'ahli' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Lisensi "ahli" (bukan kedaluwarsa) → Robot membuka gerbang.'
          }
        ]
      },
      {
        id: 5,
        ringkasan: 'Pos Medis',
        aturan: [
          { jika: 'surat = "sehat"', maka: 'Izinkan masuk' }
        ],
        konteks: 'Pemeriksaan Pos Medis: Pasien diizinkan masuk ruang karantina hanya jika surat keterangan berstatus "sehat".',
        namaData: 'surat',
        pembandingDefault: 'sehat',
        pesanTersedia: [],
        operatorBenar: '=',
        dataUji: [
          {
            data: { surat: 'sehat' },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Surat "sehat" (berstatus sehat) → Robot mengizinkan masuk.'
          },
          {
            data: { surat: 'suspek' },
            harapan: [],
            keterangan: 'Surat "suspek" (tidak sesuai) → Tidak ada tindakan.'
          },
          {
            data: { surat: 'gejala' },
            harapan: [],
            keterangan: 'Surat "gejala" (tidak sesuai) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 6,
        ringkasan: 'Dermaga Selatan',
        aturan: [
          { jika: 'tiket != "bekas"', maka: 'Buka gerbang' }
        ],
        konteks: 'Akses Dermaga Selatan: Buka gerbang pelabuhan untuk penumpang yang membawa tiket selain "bekas".',
        namaData: 'tiket',
        pembandingDefault: 'bekas',
        pesanTersedia: [],
        operatorBenar: '!=',
        dataUji: [
          {
            data: { tiket: 'bekas' },
            harapan: [],
            keterangan: 'Tiket "bekas" (status tiket terlarang) → Gerbang tetap terkunci.'
          },
          {
            data: { tiket: 'resmi' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Tiket "resmi" (selain bekas) → Robot membuka gerbang.'
          },
          {
            data: { tiket: 'asli' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Tiket "asli" (selain bekas) → Robot membuka gerbang.'
          }
        ]
      },
      {
        id: 7,
        ringkasan: 'Lab Kimia',
        aturan: [
          { jika: 'izin = "aman"', maka: 'Izinkan masuk' }
        ],
        konteks: 'Laboratorium Kimia: Peneliti diizinkan masuk ruang reagen berbahaya hanya jika surat izin berstatus "aman".',
        namaData: 'izin',
        pembandingDefault: 'aman',
        pesanTersedia: [],
        operatorBenar: '=',
        dataUji: [
          {
            data: { izin: 'aman' },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Izin "aman" (berstatus aman) → Robot mengizinkan masuk.'
          },
          {
            data: { izin: 'bahaya' },
            harapan: [],
            keterangan: 'Izin "bahaya" (tidak memenuhi) → Tidak ada tindakan.'
          },
          {
            data: { izin: 'abai' },
            harapan: [],
            keterangan: 'Izin "abai" (tidak memenuhi) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 8,
        ringkasan: 'Gudang Pangan',
        aturan: [
          { jika: 'segel != "rusak"', maka: 'Buka gerbang' }
        ],
        konteks: 'Akses Gudang Pangan: Buka gerbang ruang logistik jika segel peti pasokan bukan "rusak".',
        namaData: 'segel',
        pembandingDefault: 'rusak',
        pesanTersedia: [],
        operatorBenar: '!=',
        dataUji: [
          {
            data: { segel: 'rusak' },
            harapan: [],
            keterangan: 'Segel "rusak" (kondisi terlarang) → Gerbang tidak dibuka.'
          },
          {
            data: { segel: 'utuh' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Segel "utuh" (bukan rusak) → Robot membuka gerbang.'
          },
          {
            data: { segel: 'asli' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Segel "asli" (bukan rusak) → Robot membuka gerbang.'
          }
        ]
      },
      {
        id: 9,
        ringkasan: 'Ruang Kendali',
        aturan: [
          { jika: 'akses = "kadet"', maka: 'Izinkan masuk' }
        ],
        konteks: 'Akses Ruang Kendali: Operator diizinkan masuk ruang monitor pusat jika tanda pengenal berstatus "kadet".',
        namaData: 'akses',
        pembandingDefault: 'kadet',
        pesanTersedia: [],
        operatorBenar: '=',
        dataUji: [
          {
            data: { akses: 'kadet' },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Akses "kadet" (berstatus kadet) → Robot mengizinkan masuk.'
          },
          {
            data: { akses: 'tamu' },
            harapan: [],
            keterangan: 'Akses "tamu" (bukan kadet) → Tidak ada tindakan.'
          },
          {
            data: { akses: 'asing' },
            harapan: [],
            keterangan: 'Akses "asing" (bukan kadet) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 10,
        ringkasan: 'Gerbang Evakuasi',
        aturan: [
          { jika: 'rute != "tertutup"', maka: 'Buka gerbang' }
        ],
        konteks: 'Gerbang Evakuasi Darurat: Buka gerbang jalur penyelamatan selain rute yang berstatus "tertutup".',
        namaData: 'rute',
        pembandingDefault: 'tertutup',
        pesanTersedia: [],
        operatorBenar: '!=',
        dataUji: [
          {
            data: { rute: 'tertutup' },
            harapan: [],
            keterangan: 'Rute "tertutup" (jalur terlarang) → Gerbang evakuasi tidak dibuka.'
          },
          {
            data: { rute: 'utama' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Rute "utama" (selain tertutup) → Robot membuka gerbang.'
          },
          {
            data: { rute: 'aman' },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Rute "aman" (selain tertutup) → Robot membuka gerbang.'
          }
        ]
      }
    ]
  },
  {
    id: 'gerbang-tamu-menengah',
    nama: 'Gerbang Tamu — Menengah',
    cerita: 'Zona gerbang stasiun menerapkan verifikasi kuantitatif numerik. Lengkapi kerangka blok percabangan untuk menyaring batas angka yang diizinkan!',
    tujuan: 'Lengkapi kondisi dan masukkan blok aksi ke dalam rongga MAKA agar hanya data yang memenuhi syarat yang diproses.',
    ikon: 'ShieldCheck',
    palet: ['jika_maka', 'izinkan', 'buka', 'tolak'],
    petunjuk: [
      'Kerangka blok JIKA sudah tersedia, namun rongga kondisi dan aksinya perlu kamu lengkapi.',
      'Perhatikan data numerik yang diuji dan gunakan operator perbandingan yang tepat (seperti >=).',
      'Pasang blok aksi (Izinkan Masuk / Buka Gerbang) ke dalam rongga MAKA.',
      'Bila data uji tidak memenuhi kriteria minimal, ALGO tidak boleh melakukan aksi apa pun.'
    ],
    varian: [
      {
        id: 1,
        ringkasan: 'Usia Pengunjung',
        aturan: [
          { jika: 'usia >= 17', maka: 'Izinkan masuk' }
        ],
        konteks: 'Dek Utama Stasiun: Pengunjung wajib memiliki usia minimal 17 tahun untuk diizinkan masuk ke dek utama.',
        namaData: 'usia',
        pembandingDefault: 17,
        pesanTersedia: [],
        operatorBenar: '>=',
        dataUji: [
          {
            data: { usia: 17 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Usia 17 tahun (tepat ambang batas minimal >= 17) → Robot mengizinkan masuk.'
          },
          {
            data: { usia: 22 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Usia 22 tahun (> 17) → Robot mengizinkan masuk.'
          },
          {
            data: { usia: 15 },
            harapan: [],
            keterangan: 'Usia 15 tahun (< 17) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 2,
        ringkasan: 'Berat Kargo',
        aturan: [
          { jika: 'berat > 50', maka: 'Buka gerbang kargo' }
        ],
        konteks: 'Muatan Kargo Masuk: Buka gerbang kargo hanya jika berat muatan kontainer lebih dari 50 ton (tepat 50 ton belum cukup!).',
        namaData: 'berat',
        pembandingDefault: 50,
        pesanTersedia: [],
        operatorBenar: '>',
        dataUji: [
          {
            data: { berat: 50 },
            harapan: [],
            keterangan: 'Berat 50 ton (tepat di ambang batas, belum > 50) → Tidak ada tindakan!'
          },
          {
            data: { berat: 65 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Berat 65 ton (> 50 ton) → Robot membuka gerbang kargo.'
          },
          {
            data: { berat: 35 },
            harapan: [],
            keterangan: 'Berat 35 ton (< 50 ton) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 3,
        ringkasan: 'Suhu Kabin',
        aturan: [
          { jika: 'suhu <= 30', maka: 'Izinkan masuk' }
        ],
        konteks: 'Pemeriksaan Suhu Kabin: Izinkan masuk jika sensor mendeteksi suhu ruangan maksimal 30°C.',
        namaData: 'suhu',
        pembandingDefault: 30,
        pesanTersedia: [],
        operatorBenar: '<=',
        dataUji: [
          {
            data: { suhu: 30 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Suhu 30°C (tepat batas maksimal <= 30) → Robot mengizinkan masuk.'
          },
          {
            data: { suhu: 24 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Suhu 24°C (< 30°C) → Robot mengizinkan masuk.'
          },
          {
            data: { suhu: 35 },
            harapan: [],
            keterangan: 'Suhu 35°C (> 30°C) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 4,
        ringkasan: 'Kadar Debu',
        aturan: [
          { jika: 'debu < 15', maka: 'Buka gerbang' }
        ],
        konteks: 'Ruang Steril Laboratorium: Buka gerbang ruang steril hanya jika kadar debu kurang dari 15 ppm (tepat 15 ppm belum steril!).',
        namaData: 'debu',
        pembandingDefault: 15,
        pesanTersedia: [],
        operatorBenar: '<',
        dataUji: [
          {
            data: { debu: 15 },
            harapan: [],
            keterangan: 'Kadar debu 15 ppm (tepat di ambang batas, belum < 15) → Tidak ada tindakan!'
          },
          {
            data: { debu: 8 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Kadar debu 8 ppm (< 15 ppm) → Robot membuka gerbang.'
          },
          {
            data: { debu: 22 },
            harapan: [],
            keterangan: 'Kadar debu 22 ppm (> 15 ppm) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 5,
        ringkasan: 'Skor Kebugaran',
        aturan: [
          { jika: 'skor >= 60', maka: 'Izinkan masuk' }
        ],
        konteks: 'Uji Kebugaran Kadet: Kadet diizinkan masuk arena simulasi gravitasi jika skor kebugaran minimal 60 poin.',
        namaData: 'skor',
        pembandingDefault: 60,
        pesanTersedia: [],
        operatorBenar: '>=',
        dataUji: [
          {
            data: { skor: 60 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Skor 60 poin (tepat batas minimal >= 60) → Robot mengizinkan masuk.'
          },
          {
            data: { skor: 85 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Skor 85 poin (> 60) → Robot mengizinkan masuk.'
          },
          {
            data: { skor: 45 },
            harapan: [],
            keterangan: 'Skor 45 poin (< 60) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 6,
        ringkasan: 'Jam Terbang',
        aturan: [
          { jika: 'jamTerbang > 50', maka: 'Izinkan masuk' }
        ],
        konteks: 'Kokpit Pesawat Ulang-Alik: Pilot diizinkan masuk kokpit utama jika memiliki jam terbang lebih dari 50 jam (tepat 50 jam belum diizinkan!).',
        namaData: 'jamTerbang',
        pembandingDefault: 50,
        pesanTersedia: [],
        operatorBenar: '>',
        dataUji: [
          {
            data: { jamTerbang: 50 },
            harapan: [],
            keterangan: 'Jam terbang 50 jam (tepat di ambang batas, belum > 50) → Tidak ada tindakan!'
          },
          {
            data: { jamTerbang: 75 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Jam terbang 75 jam (> 50 jam) → Robot mengizinkan masuk.'
          },
          {
            data: { jamTerbang: 30 },
            harapan: [],
            keterangan: 'Jam terbang 30 jam (< 50 jam) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 7,
        ringkasan: 'Beban Lift',
        aturan: [
          { jika: 'beban <= 300', maka: 'Buka gerbang' }
        ],
        konteks: 'Pemeriksaan Lift Vertikal: Buka gerbang lift kapsul jika total beban muatan maksimal 300 kg.',
        namaData: 'beban',
        pembandingDefault: 300,
        pesanTersedia: [],
        operatorBenar: '<=',
        dataUji: [
          {
            data: { beban: 300 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Beban 300 kg (tepat batas maksimal <= 300) → Robot membuka gerbang.'
          },
          {
            data: { beban: 180 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Beban 180 kg (< 300 kg) → Robot membuka gerbang.'
          },
          {
            data: { beban: 350 },
            harapan: [],
            keterangan: 'Beban 350 kg (> 300 kg) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 8,
        ringkasan: 'Tekanan Ban',
        aturan: [
          { jika: 'tekanan < 40', maka: 'Buka gerbang' }
        ],
        konteks: 'Jalur Kendaraan Rover: Buka gerbang bengkel servis hanya jika tekanan ban rover kurang dari 40 psi (tepat 40 psi belum butuh servis!).',
        namaData: 'tekanan',
        pembandingDefault: 40,
        pesanTersedia: [],
        operatorBenar: '<',
        dataUji: [
          {
            data: { tekanan: 40 },
            harapan: [],
            keterangan: 'Tekanan 40 psi (tepat di ambang batas, belum < 40) → Tidak ada tindakan!'
          },
          {
            data: { tekanan: 28 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Tekanan 28 psi (< 40 psi) → Robot membuka gerbang.'
          },
          {
            data: { tekanan: 45 },
            harapan: [],
            keterangan: 'Tekanan 45 psi (> 40 psi) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 9,
        ringkasan: 'Kru Terlatih',
        aturan: [
          { jika: 'kru >= 4', maka: 'Izinkan masuk' }
        ],
        konteks: 'Regu Ekspedisi Luar Stasiun: Tim ekspedisi diizinkan masuk ruang airlock jika memiliki kru terlatih minimal 4 orang.',
        namaData: 'kru',
        pembandingDefault: 4,
        pesanTersedia: [],
        operatorBenar: '>=',
        dataUji: [
          {
            data: { kru: 4 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Kru 4 orang (tepat batas minimal >= 4) → Robot mengizinkan masuk.'
          },
          {
            data: { kru: 6 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Kru 6 orang (> 4 orang) → Robot mengizinkan masuk.'
          },
          {
            data: { kru: 2 },
            harapan: [],
            keterangan: 'Kru 2 orang (< 4 orang) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 10,
        ringkasan: 'Stok Makanan',
        aturan: [
          { jika: 'stok > 100', maka: 'Buka gerbang' }
        ],
        konteks: 'Distribusi Logistik Makanan: Buka gerbang distribusi hanya jika stok ransum lebih dari 100 paket (tepat 100 paket cadangan tidak boleh dibuka!).',
        namaData: 'stok',
        pembandingDefault: 100,
        pesanTersedia: [],
        operatorBenar: '>',
        dataUji: [
          {
            data: { stok: 100 },
            harapan: [],
            keterangan: 'Stok 100 paket (tepat di ambang batas, belum > 100) → Tidak ada tindakan!'
          },
          {
            data: { stok: 160 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Stok 160 paket (> 100 paket) → Robot membuka gerbang.'
          },
          {
            data: { stok: 70 },
            harapan: [],
            keterangan: 'Stok 70 paket (< 100 paket) → Tidak ada tindakan.'
          }
        ]
      }
    ]
  },
  {
    id: 'gerbang-tamu-sulit',
    nama: 'Gerbang Tamu — Sulit',
    cerita: 'Sistem gerbang otomatis mengalami reset total! Susun blok dari awal dan waspadai jebakan batas angka ambang kritis stasiun.',
    tujuan: 'Susun seluruh struktur JIKA-MAKA dari nol dengan operator perbandingan yang teliti terhadap jebakan batas.',
    ikon: 'ShieldCheck',
    palet: ['jika_maka', 'izinkan', 'buka', 'tolak'],
    petunjuk: [
      'Level ini dimulai tanpa template: tambahkan blok "JIKA ... MAKA" dari palet perintah.',
      'Perhatikan baik-baik apakah batas ambang menggunakan strictly greater (>) atau greater-equal (>=).',
      'Pasang blok aksi yang sesuai ke dalam rongga MAKA.',
      'Uji semua kasus untuk memastikan nilai tepat di ambang batas dievaluasi dengan benar.'
    ],
    varian: [
      {
        id: 1,
        ringkasan: 'Tekanan Udara',
        aturan: [
          { jika: 'tekanan > 100', maka: 'Buka gerbang' }
        ],
        konteks: 'Gerbang Tekanan Udara: Buka gerbang kompresi hanya jika tekanan udara ruang dekompresi lebih dari 100 kPa (tepat 100 kPa belum aman!).',
        namaData: 'tekanan',
        pembandingDefault: 100,
        pesanTersedia: [],
        operatorBenar: '>',
        dataUji: [
          {
            data: { tekanan: 100 },
            harapan: [],
            keterangan: 'Tekanan 100 kPa (tepat di ambang batas, belum > 100) → Tidak ada tindakan!'
          },
          {
            data: { tekanan: 125 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Tekanan 125 kPa (> 100 kPa) → Robot membuka gerbang.'
          },
          {
            data: { tekanan: 80 },
            harapan: [],
            keterangan: 'Tekanan 80 kPa (< 100 kPa) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 2,
        ringkasan: 'Oksigen Tabung',
        aturan: [
          { jika: 'oksigen >= 90', maka: 'Izinkan masuk' }
        ],
        konteks: 'Pemeriksaan Oksigen Tabung: Tamu diizinkan masuk sektor eksplorasi jika kadar oksigen tabung minimal 90%.',
        namaData: 'oksigen',
        pembandingDefault: 90,
        pesanTersedia: [],
        operatorBenar: '>=',
        dataUji: [
          {
            data: { oksigen: 90 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Oksigen 90% (tepat batas minimal >= 90) → Robot mengizinkan masuk.'
          },
          {
            data: { oksigen: 96 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Oksigen 96% (> 90%) → Robot mengizinkan masuk.'
          },
          {
            data: { oksigen: 75 },
            harapan: [],
            keterangan: 'Oksigen 75% (< 90%) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 3,
        ringkasan: 'Suhu Inti',
        aturan: [
          { jika: 'suhu < 200', maka: 'Buka gerbang' }
        ],
        konteks: 'Ruang Inti Pembangkit: Buka gerbang pendingin jika suhu inti reaktor kurang dari 200°C (tepat 200°C masih terlalu panas!).',
        namaData: 'suhu',
        pembandingDefault: 200,
        pesanTersedia: [],
        operatorBenar: '<',
        dataUji: [
          {
            data: { suhu: 200 },
            harapan: [],
            keterangan: 'Suhu 200°C (tepat di ambang batas, belum < 200) → Tidak ada tindakan!'
          },
          {
            data: { suhu: 140 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Suhu 140°C (< 200°C) → Robot membuka gerbang.'
          },
          {
            data: { suhu: 260 },
            harapan: [],
            keterangan: 'Suhu 260°C (> 200°C) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 4,
        ringkasan: 'Radiasi Reaktor',
        aturan: [
          { jika: 'radiasi <= 4', maka: 'Izinkan masuk' }
        ],
        konteks: 'Pemeriksaan Radiasi Reaktor: Teknisi diizinkan masuk ruang mesin hanya jika tingkat radiasi maksimal 4 mSv.',
        namaData: 'radiasi',
        pembandingDefault: 4,
        pesanTersedia: [],
        operatorBenar: '<=',
        dataUji: [
          {
            data: { radiasi: 4 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Radiasi 4 mSv (tepat batas maksimal <= 4) → Robot mengizinkan masuk.'
          },
          {
            data: { radiasi: 2 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Radiasi 2 mSv (< 4 mSv) → Robot mengizinkan masuk.'
          },
          {
            data: { radiasi: 7 },
            harapan: [],
            keterangan: 'Radiasi 7 mSv (> 4 mSv) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 5,
        ringkasan: 'Kecepatan Rotor',
        aturan: [
          { jika: 'rotor > 300', maka: 'Buka gerbang' }
        ],
        konteks: 'Turbin Generator Utama: Buka gerbang katup daya hanya jika kecepatan rotor lebih dari 300 rpm (tepat 300 rpm daya belum stabil!).',
        namaData: 'rotor',
        pembandingDefault: 300,
        pesanTersedia: [],
        operatorBenar: '>',
        dataUji: [
          {
            data: { rotor: 300 },
            harapan: [],
            keterangan: 'Rotor 300 rpm (tepat di ambang batas, belum > 300) → Tidak ada tindakan!'
          },
          {
            data: { rotor: 380 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Rotor 380 rpm (> 300 rpm) → Robot membuka gerbang.'
          },
          {
            data: { rotor: 210 },
            harapan: [],
            keterangan: 'Rotor 210 rpm (< 300 rpm) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 6,
        ringkasan: 'Pelindung Radiasi',
        aturan: [
          { jika: 'pelindung >= 70', maka: 'Izinkan masuk' }
        ],
        konteks: 'Perisai Magnetik Stasiun: Awak stasiun diizinkan masuk sektor luar jika integritas pelindung minimal 70%.',
        namaData: 'pelindung',
        pembandingDefault: 70,
        pesanTersedia: [],
        operatorBenar: '>=',
        dataUji: [
          {
            data: { pelindung: 70 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Pelindung 70% (tepat batas minimal >= 70) → Robot mengizinkan masuk.'
          },
          {
            data: { pelindung: 88 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Pelindung 88% (> 70%) → Robot mengizinkan masuk.'
          },
          {
            data: { pelindung: 52 },
            harapan: [],
            keterangan: 'Pelindung 52% (< 70%) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 7,
        ringkasan: 'Ketinggian Aman',
        aturan: [
          { jika: 'ketinggian < 120', maka: 'Buka gerbang' }
        ],
        konteks: 'Dermaga Pendaratan Pesawat: Buka gerbang dok pendaratan jika jarak ketinggian pesawat kurang dari 120 meter (tepat 120 m belum aman mendarat!).',
        namaData: 'ketinggian',
        pembandingDefault: 120,
        pesanTersedia: [],
        operatorBenar: '<',
        dataUji: [
          {
            data: { ketinggian: 120 },
            harapan: [],
            keterangan: 'Ketinggian 120 m (tepat di ambang batas, belum < 120) → Tidak ada tindakan!'
          },
          {
            data: { ketinggian: 85 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Ketinggian 85 m (< 120 m) → Robot membuka gerbang.'
          },
          {
            data: { ketinggian: 160 },
            harapan: [],
            keterangan: 'Ketinggian 160 m (> 120 m) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 8,
        ringkasan: 'Getaran Mesin',
        aturan: [
          { jika: 'getaran <= 5', maka: 'Izinkan masuk' }
        ],
        konteks: 'Uji Kestabilan Turbin: Teknisi diizinkan masuk ruang kontrol baling-baling jika getaran mesin maksimal 5 mm/s.',
        namaData: 'getaran',
        pembandingDefault: 5,
        pesanTersedia: [],
        operatorBenar: '<=',
        dataUji: [
          {
            data: { getaran: 5 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Getaran 5 mm/s (tepat batas maksimal <= 5) → Robot mengizinkan masuk.'
          },
          {
            data: { getaran: 3 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Getaran 3 mm/s (< 5 mm/s) → Robot mengizinkan masuk.'
          },
          {
            data: { getaran: 9 },
            harapan: [],
            keterangan: 'Getaran 9 mm/s (> 5 mm/s) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 9,
        ringkasan: 'Kekuatan Magnet',
        aturan: [
          { jika: 'magnet > 40', maka: 'Buka gerbang' }
        ],
        konteks: 'Rel Peluncur Magnetik: Buka gerbang akselerator hanya jika kekuatan medan magnet lebih dari 40 Tesla (tepat 40 Tesla daya belum cukup!).',
        namaData: 'magnet',
        pembandingDefault: 40,
        pesanTersedia: [],
        operatorBenar: '>',
        dataUji: [
          {
            data: { magnet: 40 },
            harapan: [],
            keterangan: 'Magnet 40 Tesla (tepat di ambang batas, belum > 40) → Tidak ada tindakan!'
          },
          {
            data: { magnet: 58 },
            harapan: [{ tipe: 'buka' }],
            keterangan: 'Magnet 58 Tesla (> 40 Tesla) → Robot membuka gerbang.'
          },
          {
            data: { magnet: 25 },
            harapan: [],
            keterangan: 'Magnet 25 Tesla (< 40 Tesla) → Tidak ada tindakan.'
          }
        ]
      },
      {
        id: 10,
        ringkasan: 'Cadangan Energi',
        aturan: [
          { jika: 'energi >= 500', maka: 'Izinkan masuk' }
        ],
        konteks: 'Stasiun Baterai Utama: Wahana eksplorasi diizinkan masuk stasiun pengisian jika sisa cadangan energi minimal 500 kWh.',
        namaData: 'energi',
        pembandingDefault: 500,
        pesanTersedia: [],
        operatorBenar: '>=',
        dataUji: [
          {
            data: { energi: 500 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Energi 500 kWh (tepat batas minimal >= 500) → Robot mengizinkan masuk.'
          },
          {
            data: { energi: 720 },
            harapan: [{ tipe: 'izinkan' }],
            keterangan: 'Energi 720 kWh (> 500 kWh) → Robot mengizinkan masuk.'
          },
          {
            data: { energi: 380 },
            harapan: [],
            keterangan: 'Energi 380 kWh (< 500 kWh) → Tidak ada tindakan.'
          }
        ]
      }
    ]
  },

  // ==========================================
  // STASIUN 2: PERCABANGAN 2-ARAH (JIKA-MAKA-SELAIN ITU)
  // ==========================================
  {
    id: 'lulus-atau-remidi',
    nama: 'Lulus atau Remidi — Mudah',
    cerita: 'Sistem evaluasi otomatis Stasiun Logika memerlukan logika keputusan dua arah untuk mengklasifikasikan data.',
    tujuan: 'Tampilkan pesan yang tepat untuk kondisi memenuhi syarat (MAKA) maupun yang tidak memenuhi syarat (SELAIN ITU).',
    ikon: 'Cpu',
    palet: ['jika_maka_selain_itu', 'izinkan', 'tolak', 'buka', 'pesan'],
    petunjuk: [
      'Gunakan struktur dua arah: JIKA [...] MAKA [...] SELAIN ITU [...].',
      'Pilih operator perbandingan angka yang tepat (misalnya >= untuk nilai batas minimal).',
      'Pasang blok "Tampilkan Pesan" di dalam rongga MAKA dan pilih pesan yang sesuai.',
      'Pasang blok "Tampilkan Pesan" kedua di dalam rongga SELAIN ITU untuk menangani kondisi sebaliknya.'
    ],
    varian: [
      {
            id: 1,
            ringkasan: "Evaluasi Ujian",
            aturan: [
                  {
                        jika: "nilai >= 75",
                        maka: "\"LULUS\"",
                        selainItu: "\"REMIDI\""
                  }
            ],
            konteks: "Evaluasi Ujian Akademi: Nilai kelulusan minimal 75. Jika nilai >= 75 tampilkan \"LULUS\", selain itu tampilkan \"REMIDI\".",
            namaData: "nilai",
            pembandingDefault: 75,
            pesanTersedia: [
                  "LULUS",
                  "REMIDI"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              nilai: 85
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              }
                        ],
                        keterangan: "Nilai 85 (>= 75) → Robot menampilkan pesan \"LULUS\"."
                  },
                  {
                        data: {
                              nilai: 75
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              }
                        ],
                        keterangan: "Nilai 75 (tepat ambang minimal >= 75) → Robot menampilkan pesan \"LULUS\"."
                  },
                  {
                        data: {
                              nilai: 74
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "REMIDI"
                              }
                        ],
                        keterangan: "Nilai 74 (< 75, tepat di bawah ambang) → Robot menampilkan pesan \"REMIDI\"."
                  },
                  {
                        data: {
                              nilai: 55
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "REMIDI"
                              }
                        ],
                        keterangan: "Nilai 55 (< 75) → Robot menampilkan pesan \"REMIDI\"."
                  }
            ]
      },
      {
            id: 2,
            ringkasan: "Suhu Ruang Server",
            aturan: [
                  {
                        jika: "suhu <= 30",
                        maka: "\"NORMAL\"",
                        selainItu: "\"PANAS\""
                  }
            ],
            konteks: "Suhu Ruang Server: Suhu operasional aman maksimal 30°C. Jika suhu <= 30 tampilkan \"NORMAL\", selain itu tampilkan \"PANAS\".",
            namaData: "suhu",
            pembandingDefault: 30,
            pesanTersedia: [
                  "NORMAL",
                  "PANAS"
            ],
            operatorBenar: "<=",
            dataUji: [
                  {
                        data: {
                              suhu: 25
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Suhu 25°C (<= 30) → Robot menampilkan pesan \"NORMAL\"."
                  },
                  {
                        data: {
                              suhu: 30
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Suhu 30°C (tepat ambang batas maksimal <= 30) → Robot menampilkan pesan \"NORMAL\"."
                  },
                  {
                        data: {
                              suhu: 31
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PANAS"
                              }
                        ],
                        keterangan: "Suhu 31°C (> 30, tepat di atas batas) → Robot menampilkan pesan \"PANAS\"."
                  },
                  {
                        data: {
                              suhu: 38
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PANAS"
                              }
                        ],
                        keterangan: "Suhu 38°C (> 30) → Robot menampilkan pesan \"PANAS\"."
                  }
            ]
      },
      {
            id: 3,
            ringkasan: "Simulasi Terbang",
            aturan: [
                  {
                        jika: "skor > 70",
                        maka: "\"LULUS\"",
                        selainItu: "\"ULANG\""
                  }
            ],
            konteks: "Simulasi Terbang Antariksa: Skor kualifikasi pilot harus lebih dari 70 poin. Jika skor > 70 tampilkan \"LULUS\", selain itu tampilkan \"ULANG\".",
            namaData: "skor",
            pembandingDefault: 70,
            pesanTersedia: [
                  "LULUS",
                  "ULANG"
            ],
            operatorBenar: ">",
            dataUji: [
                  {
                        data: {
                              skor: 70
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ULANG"
                              }
                        ],
                        keterangan: "Skor 70 poin (tepat ambang batas, belum > 70) → Robot menampilkan pesan \"ULANG\"."
                  },
                  {
                        data: {
                              skor: 71
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              }
                        ],
                        keterangan: "Skor 71 poin (tepat di atas ambang > 70) → Robot menampilkan pesan \"LULUS\"."
                  },
                  {
                        data: {
                              skor: 85
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              }
                        ],
                        keterangan: "Skor 85 poin (> 70) → Robot menampilkan pesan \"LULUS\"."
                  },
                  {
                        data: {
                              skor: 50
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ULANG"
                              }
                        ],
                        keterangan: "Skor 50 poin (< 70) → Robot menampilkan pesan \"ULANG\"."
                  }
            ]
      },
      {
            id: 4,
            ringkasan: "Deteksi Asap",
            aturan: [
                  {
                        jika: "asap < 20",
                        maka: "\"AMAN\"",
                        selainItu: "\"WASPADA\""
                  }
            ],
            konteks: "Deteksi Asap Modul: Kerapatan partikel asap ruangan aman jika kurang dari 20 ppm. Jika asap < 20 tampilkan \"AMAN\", selain itu tampilkan \"WASPADA\".",
            namaData: "asap",
            pembandingDefault: 20,
            pesanTersedia: [
                  "AMAN",
                  "WASPADA"
            ],
            operatorBenar: "<",
            dataUji: [
                  {
                        data: {
                              asap: 20
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "WASPADA"
                              }
                        ],
                        keterangan: "Asap 20 ppm (tepat ambang batas, belum < 20) → Robot menampilkan pesan \"WASPADA\"."
                  },
                  {
                        data: {
                              asap: 19
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "AMAN"
                              }
                        ],
                        keterangan: "Asap 19 ppm (tepat di bawah ambang < 20) → Robot menampilkan pesan \"AMAN\"."
                  },
                  {
                        data: {
                              asap: 10
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "AMAN"
                              }
                        ],
                        keterangan: "Asap 10 ppm (< 20) → Robot menampilkan pesan \"AMAN\"."
                  },
                  {
                        data: {
                              asap: 35
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "WASPADA"
                              }
                        ],
                        keterangan: "Asap 35 ppm (> 20) → Robot menampilkan pesan \"WASPADA\"."
                  }
            ]
      },
      {
            id: 5,
            ringkasan: "Kapasitas Baterai",
            aturan: [
                  {
                        jika: "baterai >= 50",
                        maka: "\"SIAP\"",
                        selainItu: "\"ISI_ULANG\""
                  }
            ],
            konteks: "Kapasitas Baterai ALGO: Robot siap beroperasi jika baterai minimal 50%. Jika baterai >= 50 tampilkan \"SIAP\", selain itu tampilkan \"ISI_ULANG\".",
            namaData: "baterai",
            pembandingDefault: 50,
            pesanTersedia: [
                  "SIAP",
                  "ISI_ULANG"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              baterai: 80
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SIAP"
                              }
                        ],
                        keterangan: "Baterai 80% (>= 50) → Robot menampilkan pesan \"SIAP\"."
                  },
                  {
                        data: {
                              baterai: 50
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SIAP"
                              }
                        ],
                        keterangan: "Baterai 50% (tepat ambang batas minimal >= 50) → Robot menampilkan pesan \"SIAP\"."
                  },
                  {
                        data: {
                              baterai: 49
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ISI_ULANG"
                              }
                        ],
                        keterangan: "Baterai 49% (< 50, tepat di bawah ambang) → Robot menampilkan pesan \"ISI_ULANG\"."
                  },
                  {
                        data: {
                              baterai: 25
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ISI_ULANG"
                              }
                        ],
                        keterangan: "Baterai 25% (< 50) → Robot menampilkan pesan \"ISI_ULANG\"."
                  }
            ]
      },
      {
            id: 6,
            ringkasan: "Kelembapan Gudang",
            aturan: [
                  {
                        jika: "kelembapan <= 60",
                        maka: "\"KERING\"",
                        selainItu: "\"LEMBAP\""
                  }
            ],
            konteks: "Kelembapan Gudang Logistik: Logistik pangan aman jika kelembapan maksimal 60%. Jika kelembapan <= 60 tampilkan \"KERING\", selain itu tampilkan \"LEMBAP\".",
            namaData: "kelembapan",
            pembandingDefault: 60,
            pesanTersedia: [
                  "KERING",
                  "LEMBAP"
            ],
            operatorBenar: "<=",
            dataUji: [
                  {
                        data: {
                              kelembapan: 45
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KERING"
                              }
                        ],
                        keterangan: "Kelembapan 45% (<= 60) → Robot menampilkan pesan \"KERING\"."
                  },
                  {
                        data: {
                              kelembapan: 60
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KERING"
                              }
                        ],
                        keterangan: "Kelembapan 60% (tepat ambang batas maksimal <= 60) → Robot menampilkan pesan \"KERING\"."
                  },
                  {
                        data: {
                              kelembapan: 61
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LEMBAP"
                              }
                        ],
                        keterangan: "Kelembapan 61% (> 60, tepat di atas ambang) → Robot menampilkan pesan \"LEMBAP\"."
                  },
                  {
                        data: {
                              kelembapan: 78
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LEMBAP"
                              }
                        ],
                        keterangan: "Kelembapan 78% (> 60) → Robot menampilkan pesan \"LEMBAP\"."
                  }
            ]
      },
      {
            id: 7,
            ringkasan: "Tekanan Ban",
            aturan: [
                  {
                        jika: "tekanan > 30",
                        maka: "\"NORMAL\"",
                        selainItu: "\"KURANG\""
                  }
            ],
            konteks: "Tekanan Ban Rover: Tekanan ban rover memadai jika lebih dari 30 psi. Jika tekanan > 30 tampilkan \"NORMAL\", selain itu tampilkan \"KURANG\".",
            namaData: "tekanan",
            pembandingDefault: 30,
            pesanTersedia: [
                  "NORMAL",
                  "KURANG"
            ],
            operatorBenar: ">",
            dataUji: [
                  {
                        data: {
                              tekanan: 30
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KURANG"
                              }
                        ],
                        keterangan: "Tekanan 30 psi (tepat di ambang batas, belum > 30) → Robot menampilkan pesan \"KURANG\"."
                  },
                  {
                        data: {
                              tekanan: 31
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Tekanan 31 psi (tepat di atas ambang > 30) → Robot menampilkan pesan \"NORMAL\"."
                  },
                  {
                        data: {
                              tekanan: 42
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Tekanan 42 psi (> 30) → Robot menampilkan pesan \"NORMAL\"."
                  },
                  {
                        data: {
                              tekanan: 20
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KURANG"
                              }
                        ],
                        keterangan: "Tekanan 20 psi (< 30) → Robot menampilkan pesan \"KURANG\"."
                  }
            ]
      },
      {
            id: 8,
            ringkasan: "Tingkat Kebisingan",
            aturan: [
                  {
                        jika: "desibel < 80",
                        maka: "\"SENYAP\"",
                        selainItu: "\"BISING\""
                  }
            ],
            konteks: "Tingkat Kebisingan Dek: Lingkungan stasiun nyaman jika kebisingan kurang dari 80 dB. Jika desibel < 80 tampilkan \"SENYAP\", selain itu tampilkan \"BISING\".",
            namaData: "desibel",
            pembandingDefault: 80,
            pesanTersedia: [
                  "SENYAP",
                  "BISING"
            ],
            operatorBenar: "<",
            dataUji: [
                  {
                        data: {
                              desibel: 80
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BISING"
                              }
                        ],
                        keterangan: "Desibel 80 dB (tepat di ambang batas, belum < 80) → Robot menampilkan pesan \"BISING\"."
                  },
                  {
                        data: {
                              desibel: 79
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SENYAP"
                              }
                        ],
                        keterangan: "Desibel 79 dB (tepat di bawah ambang < 80) → Robot menampilkan pesan \"SENYAP\"."
                  },
                  {
                        data: {
                              desibel: 55
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SENYAP"
                              }
                        ],
                        keterangan: "Desibel 55 dB (< 80) → Robot menampilkan pesan \"SENYAP\"."
                  },
                  {
                        data: {
                              desibel: 92
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BISING"
                              }
                        ],
                        keterangan: "Desibel 92 dB (> 80) → Robot menampilkan pesan \"BISING\"."
                  }
            ]
      },
      {
            id: 9,
            ringkasan: "Ketersediaan Air",
            aturan: [
                  {
                        jika: "air >= 200",
                        maka: "\"CUKUP\"",
                        selainItu: "\"HEMAT\""
                  }
            ],
            konteks: "Ketersediaan Air Bersih: Pasokan air stasiun aman jika minimal 200 liter. Jika air >= 200 tampilkan \"CUKUP\", selain itu tampilkan \"HEMAT\".",
            namaData: "air",
            pembandingDefault: 200,
            pesanTersedia: [
                  "CUKUP",
                  "HEMAT"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              air: 280
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "CUKUP"
                              }
                        ],
                        keterangan: "Air 280 liter (>= 200) → Robot menampilkan pesan \"CUKUP\"."
                  },
                  {
                        data: {
                              air: 200
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "CUKUP"
                              }
                        ],
                        keterangan: "Air 200 liter (tepat ambang batas minimal >= 200) → Robot menampilkan pesan \"CUKUP\"."
                  },
                  {
                        data: {
                              air: 199
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "HEMAT"
                              }
                        ],
                        keterangan: "Air 199 liter (< 200, tepat di bawah ambang) → Robot menampilkan pesan \"HEMAT\"."
                  },
                  {
                        data: {
                              air: 120
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "HEMAT"
                              }
                        ],
                        keterangan: "Air 120 liter (< 200) → Robot menampilkan pesan \"HEMAT\"."
                  }
            ]
      },
      {
            id: 10,
            ringkasan: "Kesalahan Sistem",
            aturan: [
                  {
                        jika: "error <= 1",
                        maka: "\"STABIL\"",
                        selainItu: "\"BERMASALAH\""
                  }
            ],
            konteks: "Kesalahan Sistem Komputer: Sistem stasiun dinilai stabil jika jumlah error maksimal 1 kali. Jika error <= 1 tampilkan \"STABIL\", selain itu tampilkan \"BERMASALAH\".",
            namaData: "error",
            pembandingDefault: 1,
            pesanTersedia: [
                  "STABIL",
                  "BERMASALAH"
            ],
            operatorBenar: "<=",
            dataUji: [
                  {
                        data: {
                              error: 0
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Error 0 (<= 1) → Robot menampilkan pesan \"STABIL\"."
                  },
                  {
                        data: {
                              error: 1
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Error 1 (tepat ambang batas maksimal <= 1) → Robot menampilkan pesan \"STABIL\"."
                  },
                  {
                        data: {
                              error: 2
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BERMASALAH"
                              }
                        ],
                        keterangan: "Error 2 (> 1, tepat di atas ambang batas) → Robot menampilkan pesan \"BERMASALAH\"."
                  },
                  {
                        data: {
                              error: 5
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BERMASALAH"
                              }
                        ],
                        keterangan: "Error 5 (> 1) → Robot menampilkan pesan \"BERMASALAH\"."
                  }
            ]
      }
]
  },
  {
    id: 'lulus-atau-remidi-menengah',
    nama: 'Lulus atau Remidi — Menengah',
    cerita: 'Klasifikasi data stasiun menghadapi jebakan batas kebalikan (operator lebih kecil atau sama dengan <=). Susun logika agar batas ambang tidak bocor!',
    tujuan: 'Gunakan struktur 2-arah dengan operator perbandingan yang cermat untuk 4 kasus uji stasiun.',
    ikon: 'Cpu',
    palet: ['jika_maka_selain_itu', 'izinkan', 'tolak', 'buka', 'pesan'],
    petunjuk: [
      'Gunakan struktur JIKA-MAKA-SELAIN ITU.',
      'Perhatikan arah perbandingan: gunakan operator <= atau < sesuai bunyi ketentuan batas ambang.',
      'Pasang blok pesan yang benar di rongga MAKA dan rongga SELAIN ITU.',
      'Perhatikan kasus uji yang tepat berada di angka batas untuk memastikan operator tidak tertukar.'
    ],
    varian: [
      {
            id: 1,
            ringkasan: "Radiasi Reaktor",
            aturan: [
                  {
                        jika: "radiasi <= 50",
                        maka: "\"AMAN\"",
                        selainItu: "\"BAHAYA\""
                  }
            ],
            konteks: "Sensor Radiasi Reaktor: Batas toleransi aman adalah radiasi maksimal 50 mSv. Jika radiasi <= 50 tampilkan \"AMAN\", selain itu tampilkan \"BAHAYA\".",
            namaData: "radiasi",
            pembandingDefault: 50,
            pesanTersedia: [
                  "AMAN",
                  "BAHAYA"
            ],
            operatorBenar: "<=",
            dataUji: [
                  {
                        data: {
                              radiasi: 30
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "AMAN"
                              }
                        ],
                        keterangan: "Radiasi 30 mSv (<= 50) → Robot menampilkan \"AMAN\"."
                  },
                  {
                        data: {
                              radiasi: 50
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "AMAN"
                              }
                        ],
                        keterangan: "Radiasi 50 mSv (tepat batas ambang maksimal <= 50) → Robot menampilkan \"AMAN\"."
                  },
                  {
                        data: {
                              radiasi: 51
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BAHAYA"
                              }
                        ],
                        keterangan: "Radiasi 51 mSv (> 50, lewat 1 angka di atas ambang batas) → Robot menampilkan \"BAHAYA\"."
                  },
                  {
                        data: {
                              radiasi: 80
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BAHAYA"
                              }
                        ],
                        keterangan: "Radiasi 80 mSv (> 50) → Robot menampilkan \"BAHAYA\"."
                  }
            ]
      },
      {
            id: 2,
            ringkasan: "Latensi Jaringan",
            aturan: [
                  {
                        jika: "latensi >= 40",
                        maka: "\"LAMBAT\"",
                        selainItu: "\"CEPAT\""
                  }
            ],
            konteks: "Pemeriksaan Latensi Jaringan: Batas deteksi jaringan lambat adalah latensi minimal 40 ms. Jika latensi >= 40 tampilkan \"LAMBAT\", selain itu tampilkan \"CEPAT\".",
            namaData: "latensi",
            pembandingDefault: 40,
            pesanTersedia: [
                  "LAMBAT",
                  "CEPAT"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              latensi: 65
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LAMBAT"
                              }
                        ],
                        keterangan: "Latensi 65 ms (>= 40) → Robot menampilkan \"LAMBAT\"."
                  },
                  {
                        data: {
                              latensi: 40
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LAMBAT"
                              }
                        ],
                        keterangan: "Latensi 40 ms (tepat batas ambang minimal >= 40) → Robot menampilkan \"LAMBAT\"."
                  },
                  {
                        data: {
                              latensi: 39
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "CEPAT"
                              }
                        ],
                        keterangan: "Latensi 39 ms (< 40, tepat di bawah ambang batas) → Robot menampilkan \"CEPAT\"."
                  },
                  {
                        data: {
                              latensi: 18
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "CEPAT"
                              }
                        ],
                        keterangan: "Latensi 18 ms (< 40) → Robot menampilkan \"CEPAT\"."
                  }
            ]
      },
      {
            id: 3,
            ringkasan: "Getaran Mesin",
            aturan: [
                  {
                        jika: "getaran < 5",
                        maka: "\"STABIL\"",
                        selainItu: "\"TIDAK_STABIL\""
                  }
            ],
            konteks: "Diagnostik Getaran Mesin: Kondisi mesin stabil jika getaran turbin kurang dari 5 mm/s. Jika getaran < 5 tampilkan \"STABIL\", selain itu tampilkan \"TIDAK_STABIL\".",
            namaData: "getaran",
            pembandingDefault: 5,
            pesanTersedia: [
                  "STABIL",
                  "TIDAK_STABIL"
            ],
            operatorBenar: "<",
            dataUji: [
                  {
                        data: {
                              getaran: 5
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "TIDAK_STABIL"
                              }
                        ],
                        keterangan: "Getaran 5 mm/s (tepat ambang batas, belum < 5) → Robot menampilkan \"TIDAK_STABIL\"."
                  },
                  {
                        data: {
                              getaran: 4
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Getaran 4 mm/s (< 5, tepat di bawah ambang) → Robot menampilkan \"STABIL\"."
                  },
                  {
                        data: {
                              getaran: 2
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Getaran 2 mm/s (< 5) → Robot menampilkan \"STABIL\"."
                  },
                  {
                        data: {
                              getaran: 9
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "TIDAK_STABIL"
                              }
                        ],
                        keterangan: "Getaran 9 mm/s (> 5) → Robot menampilkan \"TIDAK_STABIL\"."
                  }
            ]
      },
      {
            id: 4,
            ringkasan: "Kadar Oksigen",
            aturan: [
                  {
                        jika: "oksigen > 90",
                        maka: "\"SEGAR\"",
                        selainItu: "\"SESAK\""
                  }
            ],
            konteks: "Sirkulasi Udara Stasiun: Ruang bernapas optimal jika kadar oksigen lebih dari 90%. Jika oksigen > 90 tampilkan \"SEGAR\", selain itu tampilkan \"SESAK\".",
            namaData: "oksigen",
            pembandingDefault: 90,
            pesanTersedia: [
                  "SEGAR",
                  "SESAK"
            ],
            operatorBenar: ">",
            dataUji: [
                  {
                        data: {
                              oksigen: 90
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SESAK"
                              }
                        ],
                        keterangan: "Oksigen 90% (tepat ambang batas, belum > 90) → Robot menampilkan \"SESAK\"."
                  },
                  {
                        data: {
                              oksigen: 91
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SEGAR"
                              }
                        ],
                        keterangan: "Oksigen 91% (> 90, tepat di atas ambang) → Robot menampilkan \"SEGAR\"."
                  },
                  {
                        data: {
                              oksigen: 96
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SEGAR"
                              }
                        ],
                        keterangan: "Oksigen 96% (> 90) → Robot menampilkan \"SEGAR\"."
                  },
                  {
                        data: {
                              oksigen: 75
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SESAK"
                              }
                        ],
                        keterangan: "Oksigen 75% (< 90) → Robot menampilkan \"SESAK\"."
                  }
            ]
      },
      {
            id: 5,
            ringkasan: "Suhu Inti Reaktor",
            aturan: [
                  {
                        jika: "suhu <= 80",
                        maka: "\"NORMAL\"",
                        selainItu: "\"PANAS\""
                  }
            ],
            konteks: "Suhu Inti Reaktor: Pembangkit aman beroperasi jika suhu inti maksimal 80°C. Jika suhu <= 80 tampilkan \"NORMAL\", selain itu tampilkan \"PANAS\".",
            namaData: "suhu",
            pembandingDefault: 80,
            pesanTersedia: [
                  "NORMAL",
                  "PANAS"
            ],
            operatorBenar: "<=",
            dataUji: [
                  {
                        data: {
                              suhu: 60
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Suhu 60°C (<= 80) → Robot menampilkan \"NORMAL\"."
                  },
                  {
                        data: {
                              suhu: 80
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Suhu 80°C (tepat batas ambang maksimal <= 80) → Robot menampilkan \"NORMAL\"."
                  },
                  {
                        data: {
                              suhu: 81
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PANAS"
                              }
                        ],
                        keterangan: "Suhu 81°C (> 80, tepat di atas batas) → Robot menampilkan \"PANAS\"."
                  },
                  {
                        data: {
                              suhu: 105
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PANAS"
                              }
                        ],
                        keterangan: "Suhu 105°C (> 80) → Robot menampilkan \"PANAS\"."
                  }
            ]
      },
      {
            id: 6,
            ringkasan: "Cadangan Daya",
            aturan: [
                  {
                        jika: "daya >= 100",
                        maka: "\"CUKUP\"",
                        selainItu: "\"DEFISIT\""
                  }
            ],
            konteks: "Cadangan Daya Cadangan: Sistem stasiun siaga jika pasokan daya minimal 100 kWh. Jika daya >= 100 tampilkan \"CUKUP\", selain itu tampilkan \"DEFISIT\".",
            namaData: "daya",
            pembandingDefault: 100,
            pesanTersedia: [
                  "CUKUP",
                  "DEFISIT"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              daya: 140
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "CUKUP"
                              }
                        ],
                        keterangan: "Daya 140 kWh (>= 100) → Robot menampilkan \"CUKUP\"."
                  },
                  {
                        data: {
                              daya: 100
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "CUKUP"
                              }
                        ],
                        keterangan: "Daya 100 kWh (tepat ambang batas minimal >= 100) → Robot menampilkan \"CUKUP\"."
                  },
                  {
                        data: {
                              daya: 99
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "DEFISIT"
                              }
                        ],
                        keterangan: "Daya 99 kWh (< 100, tepat di bawah ambang) → Robot menampilkan \"DEFISIT\"."
                  },
                  {
                        data: {
                              daya: 55
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "DEFISIT"
                              }
                        ],
                        keterangan: "Daya 55 kWh (< 100) → Robot menampilkan \"DEFISIT\"."
                  }
            ]
      },
      {
            id: 7,
            ringkasan: "Tingkat Polusi",
            aturan: [
                  {
                        jika: "polusi < 25",
                        maka: "\"BERSIH\"",
                        selainItu: "\"KOTOR\""
                  }
            ],
            konteks: "Filter Udara Kubah: Udara dalam kubah bersih jika tingkat polusi partikel kurang dari 25 ppm. Jika polusi < 25 tampilkan \"BERSIH\", selain itu tampilkan \"KOTOR\".",
            namaData: "polusi",
            pembandingDefault: 25,
            pesanTersedia: [
                  "BERSIH",
                  "KOTOR"
            ],
            operatorBenar: "<",
            dataUji: [
                  {
                        data: {
                              polusi: 25
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KOTOR"
                              }
                        ],
                        keterangan: "Polusi 25 ppm (tepat ambang batas, belum < 25) → Robot menampilkan \"KOTOR\"."
                  },
                  {
                        data: {
                              polusi: 24
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BERSIH"
                              }
                        ],
                        keterangan: "Polusi 24 ppm (< 25, tepat di bawah ambang) → Robot menampilkan \"BERSIH\"."
                  },
                  {
                        data: {
                              polusi: 12
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BERSIH"
                              }
                        ],
                        keterangan: "Polusi 12 ppm (< 25) → Robot menampilkan \"BERSIH\"."
                  },
                  {
                        data: {
                              polusi: 45
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KOTOR"
                              }
                        ],
                        keterangan: "Polusi 45 ppm (> 25) → Robot menampilkan \"KOTOR\"."
                  }
            ]
      },
      {
            id: 8,
            ringkasan: "Tekanan Hidrolik",
            aturan: [
                  {
                        jika: "tekanan > 60",
                        maka: "\"KUAT\"",
                        selainItu: "\"LEMAH\""
                  }
            ],
            konteks: "Sistem Hidrolik Pintu: Penguncian dermaga beroperasi jika tekanan hidrolik lebih dari 60 bar. Jika tekanan > 60 tampilkan \"KUAT\", selain itu tampilkan \"LEMAH\".",
            namaData: "tekanan",
            pembandingDefault: 60,
            pesanTersedia: [
                  "KUAT",
                  "LEMAH"
            ],
            operatorBenar: ">",
            dataUji: [
                  {
                        data: {
                              tekanan: 60
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LEMAH"
                              }
                        ],
                        keterangan: "Tekanan 60 bar (tepat di ambang batas, belum > 60) → Robot menampilkan \"LEMAH\"."
                  },
                  {
                        data: {
                              tekanan: 61
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KUAT"
                              }
                        ],
                        keterangan: "Tekanan 61 bar (> 60, tepat di atas ambang batas) → Robot menampilkan \"KUAT\"."
                  },
                  {
                        data: {
                              tekanan: 75
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KUAT"
                              }
                        ],
                        keterangan: "Tekanan 75 bar (> 60) → Robot menampilkan \"KUAT\"."
                  },
                  {
                        data: {
                              tekanan: 40
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LEMAH"
                              }
                        ],
                        keterangan: "Tekanan 40 bar (< 60) → Robot menampilkan \"LEMAH\"."
                  }
            ]
      },
      {
            id: 9,
            ringkasan: "Keausan Roda Rover",
            aturan: [
                  {
                        jika: "aus <= 15",
                        maka: "\"BAIK\"",
                        selainItu: "\"GANTI\""
                  }
            ],
            konteks: "Inspeksi Roda Rover: Roda dinyatakan layak jalan jika tingkat keausan maksimal 15%. Jika aus <= 15 tampilkan \"BAIK\", selain itu tampilkan \"GANTI\".",
            namaData: "aus",
            pembandingDefault: 15,
            pesanTersedia: [
                  "BAIK",
                  "GANTI"
            ],
            operatorBenar: "<=",
            dataUji: [
                  {
                        data: {
                              aus: 8
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BAIK"
                              }
                        ],
                        keterangan: "Keausan 8% (<= 15) → Robot menampilkan \"BAIK\"."
                  },
                  {
                        data: {
                              aus: 15
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BAIK"
                              }
                        ],
                        keterangan: "Keausan 15% (tepat batas ambang maksimal <= 15) → Robot menampilkan \"BAIK\"."
                  },
                  {
                        data: {
                              aus: 16
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "GANTI"
                              }
                        ],
                        keterangan: "Keausan 16% (> 15, tepat di atas batas maksimal) → Robot menampilkan \"GANTI\"."
                  },
                  {
                        data: {
                              aus: 30
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "GANTI"
                              }
                        ],
                        keterangan: "Keausan 30% (> 15) → Robot menampilkan \"GANTI\"."
                  }
            ]
      },
      {
            id: 10,
            ringkasan: "Sinyal Radar",
            aturan: [
                  {
                        jika: "sinyal >= 70",
                        maka: "\"JERNIH\"",
                        selainItu: "\"TERGANGGU\""
                  }
            ],
            konteks: "Penerima Radar Komunikasi: Penerimaan data jernih jika kekuatan sinyal minimal 70 dBm. Jika sinyal >= 70 tampilkan \"JERNIH\", selain itu tampilkan \"TERGANGGU\".",
            namaData: "sinyal",
            pembandingDefault: 70,
            pesanTersedia: [
                  "JERNIH",
                  "TERGANGGU"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              sinyal: 85
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "JERNIH"
                              }
                        ],
                        keterangan: "Sinyal 85 dBm (>= 70) → Robot menampilkan \"JERNIH\"."
                  },
                  {
                        data: {
                              sinyal: 70
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "JERNIH"
                              }
                        ],
                        keterangan: "Sinyal 70 dBm (tepat batas ambang minimal >= 70) → Robot menampilkan \"JERNIH\"."
                  },
                  {
                        data: {
                              sinyal: 69
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "TERGANGGU"
                              }
                        ],
                        keterangan: "Sinyal 69 dBm (< 70, tepat di bawah ambang batas) → Robot menampilkan \"TERGANGGU\"."
                  },
                  {
                        data: {
                              sinyal: 45
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "TERGANGGU"
                              }
                        ],
                        keterangan: "Sinyal 45 dBm (< 70) → Robot menampilkan \"TERGANGGU\"."
                  }
            ]
      }
]
  },
  {
    id: 'lulus-atau-remidi-sulit',
    nama: 'Lulus atau Remidi — Sulit',
    cerita: 'Pusat komando membutuhkan verifikasi berlapis! Susun dua keputusan berurutan dalam satu alur program ALGO untuk memeriksa dua kriteria sekaligus.',
    tujuan: 'Susun dua blok JIKA secara berurutan dalam program untuk menghasilkan keputusan ganda yang tepat pada seluruh kasus uji.',
    ikon: 'Cpu',
    palet: ['jika_maka', 'jika_maka_selain_itu', 'izinkan', 'tolak', 'buka', 'pesan'],
    petunjuk: [
      'Level ini menuntut DUA blok keputusan berturut-turut dalam rel program MULAI…SELESAI.',
      'Blok pertama memeriksa kriteria pertama (misal: nilai ujian kelulusan).',
      'Blok kedua memeriksa kriteria kedua (misal: kehadiran/keaktifan kadet).',
      'Pastikan kedua blok JIKA terpasang di rel utama dan masing-masing rongga terisi pesan yang sesuai.'
    ],
    varian: [
      {
            id: 1,
            ringkasan: "Verifikasi Ganda Kadet",
            aturan: [
                  {
                        jika: "nilai >= 75",
                        maka: "\"LULUS\"",
                        selainItu: "\"REMIDI\""
                  },
                  {
                        jika: "absen <= 3",
                        maka: "\"TERATUR\"",
                        selainItu: "\"DISIPLIN_KURANG\""
                  }
            ],
            konteks: "Verifikasi Ganda Kadet Stasiun: Pertama, jika nilai minimal 75 tampilkan \"LULUS\", selain itu tampilkan \"REMIDI\". Kedua, jika absen maksimal 3 tampilkan \"TERATUR\", selain itu tampilkan \"DISIPLIN_KURANG\".",
            namaData: "nilai",
            pembandingDefault: 75,
            pesanTersedia: [
                  "LULUS",
                  "REMIDI",
                  "TERATUR",
                  "DISIPLIN_KURANG"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              nilai: 85,
                              absen: 1
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "TERATUR"
                              }
                        ],
                        keterangan: "Nilai 85 & Absen 1 → \"LULUS\" dan \"TERATUR\"."
                  },
                  {
                        data: {
                              nilai: 75,
                              absen: 3
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "TERATUR"
                              }
                        ],
                        keterangan: "Nilai 75 & Absen 3 (keduanya tepat di batas) → \"LULUS\" dan \"TERATUR\"."
                  },
                  {
                        data: {
                              nilai: 80,
                              absen: 5
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "DISIPLIN_KURANG"
                              }
                        ],
                        keterangan: "Nilai 80 & Absen 5 → \"LULUS\" dan \"DISIPLIN_KURANG\"."
                  },
                  {
                        data: {
                              nilai: 60,
                              absen: 2
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "REMIDI"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "TERATUR"
                              }
                        ],
                        keterangan: "Nilai 60 & Absen 2 → \"REMIDI\" dan \"TERATUR\"."
                  },
                  {
                        data: {
                              nilai: 50,
                              absen: 7
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "REMIDI"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "DISIPLIN_KURANG"
                              }
                        ],
                        keterangan: "Nilai 50 & Absen 7 → \"REMIDI\" dan \"DISIPLIN_KURANG\"."
                  }
            ]
      },
      {
            id: 2,
            ringkasan: "Diagnostik Reaktor Inti",
            aturan: [
                  {
                        jika: "suhu >= 80",
                        maka: "\"PANAS\"",
                        selainItu: "\"DINGIN\""
                  },
                  {
                        jika: "daya >= 100",
                        maka: "\"OPTIMAL\"",
                        selainItu: "\"HEMAT\""
                  }
            ],
            konteks: "Diagnostik Ganda Reaktor Inti: Pertama, jika suhu minimal 80 tampilkan \"PANAS\", selain itu tampilkan \"DINGIN\". Kedua, jika daya minimal 100 tampilkan \"OPTIMAL\", selain itu tampilkan \"HEMAT\".",
            namaData: "suhu",
            pembandingDefault: 80,
            pesanTersedia: [
                  "PANAS",
                  "DINGIN",
                  "OPTIMAL",
                  "HEMAT"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              suhu: 90,
                              daya: 120
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PANAS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "OPTIMAL"
                              }
                        ],
                        keterangan: "Suhu 90 & Daya 120 → \"PANAS\" dan \"OPTIMAL\"."
                  },
                  {
                        data: {
                              suhu: 80,
                              daya: 100
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PANAS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "OPTIMAL"
                              }
                        ],
                        keterangan: "Suhu 80 & Daya 100 (keduanya tepat batas) → \"PANAS\" dan \"OPTIMAL\"."
                  },
                  {
                        data: {
                              suhu: 85,
                              daya: 70
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PANAS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "HEMAT"
                              }
                        ],
                        keterangan: "Suhu 85 & Daya 70 → \"PANAS\" dan \"HEMAT\"."
                  },
                  {
                        data: {
                              suhu: 65,
                              daya: 110
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "DINGIN"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "OPTIMAL"
                              }
                        ],
                        keterangan: "Suhu 65 & Daya 110 → \"DINGIN\" dan \"OPTIMAL\"."
                  },
                  {
                        data: {
                              suhu: 55,
                              daya: 60
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "DINGIN"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "HEMAT"
                              }
                        ],
                        keterangan: "Suhu 55 & Daya 60 → \"DINGIN\" dan \"HEMAT\"."
                  }
            ]
      },
      {
            id: 3,
            ringkasan: "Kontrol Kabin Stasiun",
            aturan: [
                  {
                        jika: "oksigen >= 90",
                        maka: "\"SEGAR\"",
                        selainItu: "\"SESAK\""
                  },
                  {
                        jika: "tekanan <= 105",
                        maka: "\"STABIL\"",
                        selainItu: "\"TINGGI\""
                  }
            ],
            konteks: "Kontrol Kabin Stasiun: Pertama, jika oksigen minimal 90 tampilkan \"SEGAR\", selain itu tampilkan \"SESAK\". Kedua, jika tekanan maksimal 105 tampilkan \"STABIL\", selain itu tampilkan \"TINGGI\".",
            namaData: "oksigen",
            pembandingDefault: 90,
            pesanTersedia: [
                  "SEGAR",
                  "SESAK",
                  "STABIL",
                  "TINGGI"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              oksigen: 95,
                              tekanan: 100
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SEGAR"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Oksigen 95 & Tekanan 100 → \"SEGAR\" dan \"STABIL\"."
                  },
                  {
                        data: {
                              oksigen: 90,
                              tekanan: 105
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SEGAR"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Oksigen 90 & Tekanan 105 (keduanya tepat batas) → \"SEGAR\" dan \"STABIL\"."
                  },
                  {
                        data: {
                              oksigen: 92,
                              tekanan: 120
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SEGAR"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "TINGGI"
                              }
                        ],
                        keterangan: "Oksigen 92 & Tekanan 120 → \"SEGAR\" dan \"TINGGI\"."
                  },
                  {
                        data: {
                              oksigen: 80,
                              tekanan: 98
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SESAK"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Oksigen 80 & Tekanan 98 → \"SESAK\" dan \"STABIL\"."
                  },
                  {
                        data: {
                              oksigen: 70,
                              tekanan: 115
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "SESAK"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "TINGGI"
                              }
                        ],
                        keterangan: "Oksigen 70 & Tekanan 115 → \"SESAK\" dan \"TINGGI\"."
                  }
            ]
      },
      {
            id: 4,
            ringkasan: "Kebugaran Kru Ekspedisi",
            aturan: [
                  {
                        jika: "skor >= 70",
                        maka: "\"LULUS\"",
                        selainItu: "\"ULANG\""
                  },
                  {
                        jika: "detak <= 100",
                        maka: "\"NORMAL\"",
                        selainItu: "\"CEPAT\""
                  }
            ],
            konteks: "Kebugaran Kru Ekspedisi: Pertama, jika skor minimal 70 tampilkan \"LULUS\", selain itu tampilkan \"ULANG\". Kedua, jika detak maksimal 100 tampilkan \"NORMAL\", selain itu tampilkan \"CEPAT\".",
            namaData: "skor",
            pembandingDefault: 70,
            pesanTersedia: [
                  "LULUS",
                  "ULANG",
                  "NORMAL",
                  "CEPAT"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              skor: 88,
                              detak: 80
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Skor 88 & Detak 80 → \"LULUS\" dan \"NORMAL\"."
                  },
                  {
                        data: {
                              skor: 70,
                              detak: 100
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Skor 70 & Detak 100 (keduanya tepat batas) → \"LULUS\" dan \"NORMAL\"."
                  },
                  {
                        data: {
                              skor: 85,
                              detak: 125
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LULUS"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "CEPAT"
                              }
                        ],
                        keterangan: "Skor 85 & Detak 125 → \"LULUS\" dan \"CEPAT\"."
                  },
                  {
                        data: {
                              skor: 55,
                              detak: 75
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ULANG"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "NORMAL"
                              }
                        ],
                        keterangan: "Skor 55 & Detak 75 → \"ULANG\" dan \"NORMAL\"."
                  },
                  {
                        data: {
                              skor: 40,
                              detak: 110
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ULANG"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "CEPAT"
                              }
                        ],
                        keterangan: "Skor 40 & Detak 110 → \"ULANG\" dan \"CEPAT\"."
                  }
            ]
      },
      {
            id: 5,
            ringkasan: "Audit Kargo Pesawat",
            aturan: [
                  {
                        jika: "muatan <= 500",
                        maka: "\"AMAN\"",
                        selainItu: "\"BERLEBIH\""
                  },
                  {
                        jika: "bakar >= 80",
                        maka: "\"CUKUP\"",
                        selainItu: "\"KURANG\""
                  }
            ],
            konteks: "Audit Kargo Pesawat: Pertama, jika muatan maksimal 500 tampilkan \"AMAN\", selain itu tampilkan \"BERLEBIH\". Kedua, jika bakar minimal 80 tampilkan \"CUKUP\", selain itu tampilkan \"KURANG\".",
            namaData: "muatan",
            pembandingDefault: 500,
            pesanTersedia: [
                  "AMAN",
                  "BERLEBIH",
                  "CUKUP",
                  "KURANG"
            ],
            operatorBenar: "<=",
            dataUji: [
                  {
                        data: {
                              muatan: 420,
                              bakar: 95
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "AMAN"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "CUKUP"
                              }
                        ],
                        keterangan: "Muatan 420 & Bakar 95 → \"AMAN\" dan \"CUKUP\"."
                  },
                  {
                        data: {
                              muatan: 500,
                              bakar: 80
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "AMAN"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "CUKUP"
                              }
                        ],
                        keterangan: "Muatan 500 & Bakar 80 (keduanya tepat batas) → \"AMAN\" dan \"CUKUP\"."
                  },
                  {
                        data: {
                              muatan: 450,
                              bakar: 60
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "AMAN"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "KURANG"
                              }
                        ],
                        keterangan: "Muatan 450 & Bakar 60 → \"AMAN\" dan \"KURANG\"."
                  },
                  {
                        data: {
                              muatan: 620,
                              bakar: 90
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BERLEBIH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "CUKUP"
                              }
                        ],
                        keterangan: "Muatan 620 & Bakar 90 → \"BERLEBIH\" dan \"CUKUP\"."
                  },
                  {
                        data: {
                              muatan: 700,
                              bakar: 50
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "BERLEBIH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "KURANG"
                              }
                        ],
                        keterangan: "Muatan 700 & Bakar 50 → \"BERLEBIH\" dan \"KURANG\"."
                  }
            ]
      },
      {
            id: 6,
            ringkasan: "Laboratorium Biologi",
            aturan: [
                  {
                        jika: "steril >= 95",
                        maka: "\"MURNI\"",
                        selainItu: "\"KONTAMINASI\""
                  },
                  {
                        jika: "suhu <= 25",
                        maka: "\"SEJUK\"",
                        selainItu: "\"HANGAT\""
                  }
            ],
            konteks: "Laboratorium Biologi: Pertama, jika steril minimal 95 tampilkan \"MURNI\", selain itu tampilkan \"KONTAMINASI\". Kedua, jika suhu maksimal 25 tampilkan \"SEJUK\", selain itu tampilkan \"HANGAT\".",
            namaData: "steril",
            pembandingDefault: 95,
            pesanTersedia: [
                  "MURNI",
                  "KONTAMINASI",
                  "SEJUK",
                  "HANGAT"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              steril: 99,
                              suhu: 20
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "MURNI"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "SEJUK"
                              }
                        ],
                        keterangan: "Steril 99 & Suhu 20 → \"MURNI\" dan \"SEJUK\"."
                  },
                  {
                        data: {
                              steril: 95,
                              suhu: 25
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "MURNI"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "SEJUK"
                              }
                        ],
                        keterangan: "Steril 95 & Suhu 25 (keduanya tepat batas) → \"MURNI\" dan \"SEJUK\"."
                  },
                  {
                        data: {
                              steril: 98,
                              suhu: 32
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "MURNI"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "HANGAT"
                              }
                        ],
                        keterangan: "Steril 98 & Suhu 32 → \"MURNI\" dan \"HANGAT\"."
                  },
                  {
                        data: {
                              steril: 85,
                              suhu: 18
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KONTAMINASI"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "SEJUK"
                              }
                        ],
                        keterangan: "Steril 85 & Suhu 18 → \"KONTAMINASI\" dan \"SEJUK\"."
                  },
                  {
                        data: {
                              steril: 70,
                              suhu: 35
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KONTAMINASI"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "HANGAT"
                              }
                        ],
                        keterangan: "Steril 70 & Suhu 35 → \"KONTAMINASI\" dan \"HANGAT\"."
                  }
            ]
      },
      {
            id: 7,
            ringkasan: "Keamanan Server Stasiun",
            aturan: [
                  {
                        jika: "enkripsi >= 64",
                        maka: "\"KUAT\"",
                        selainItu: "\"RENTAN\""
                  },
                  {
                        jika: "intrusi <= 0",
                        maka: "\"BERSIH\"",
                        selainItu: "\"ANCAMAN\""
                  }
            ],
            konteks: "Keamanan Server Stasiun: Pertama, jika enkripsi minimal 64 tampilkan \"KUAT\", selain itu tampilkan \"RENTAN\". Kedua, jika intrusi maksimal 0 tampilkan \"BERSIH\", selain itu tampilkan \"ANCAMAN\".",
            namaData: "enkripsi",
            pembandingDefault: 64,
            pesanTersedia: [
                  "KUAT",
                  "RENTAN",
                  "BERSIH",
                  "ANCAMAN"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              enkripsi: 128,
                              intrusi: 0
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KUAT"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "BERSIH"
                              }
                        ],
                        keterangan: "Enkripsi 128 & Intrusi 0 → \"KUAT\" dan \"BERSIH\"."
                  },
                  {
                        data: {
                              enkripsi: 64,
                              intrusi: 0
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KUAT"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "BERSIH"
                              }
                        ],
                        keterangan: "Enkripsi 64 & Intrusi 0 (keduanya tepat batas) → \"KUAT\" dan \"BERSIH\"."
                  },
                  {
                        data: {
                              enkripsi: 128,
                              intrusi: 2
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "KUAT"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "ANCAMAN"
                              }
                        ],
                        keterangan: "Enkripsi 128 & Intrusi 2 → \"KUAT\" dan \"ANCAMAN\"."
                  },
                  {
                        data: {
                              enkripsi: 32,
                              intrusi: 0
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "RENTAN"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "BERSIH"
                              }
                        ],
                        keterangan: "Enkripsi 32 & Intrusi 0 → \"RENTAN\" dan \"BERSIH\"."
                  },
                  {
                        data: {
                              enkripsi: 16,
                              intrusi: 4
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "RENTAN"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "ANCAMAN"
                              }
                        ],
                        keterangan: "Enkripsi 16 & Intrusi 4 → \"RENTAN\" dan \"ANCAMAN\"."
                  }
            ]
      },
      {
            id: 8,
            ringkasan: "Navigasi Orbit Satelit",
            aturan: [
                  {
                        jika: "ketinggian >= 300",
                        maka: "\"ORBIT\"",
                        selainItu: "\"JATUH\""
                  },
                  {
                        jika: "kecepatan <= 28000",
                        maka: "\"TERKENDALI\"",
                        selainItu: "\"BAHAYA\""
                  }
            ],
            konteks: "Navigasi Orbit Satelit: Pertama, jika ketinggian minimal 300 tampilkan \"ORBIT\", selain itu tampilkan \"JATUH\". Kedua, jika kecepatan maksimal 28000 tampilkan \"TERKENDALI\", selain itu tampilkan \"BAHAYA\".",
            namaData: "ketinggian",
            pembandingDefault: 300,
            pesanTersedia: [
                  "ORBIT",
                  "JATUH",
                  "TERKENDALI",
                  "BAHAYA"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              ketinggian: 350,
                              kecepatan: 27000
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ORBIT"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "TERKENDALI"
                              }
                        ],
                        keterangan: "Ketinggian 350 & Kecepatan 27000 → \"ORBIT\" dan \"TERKENDALI\"."
                  },
                  {
                        data: {
                              ketinggian: 300,
                              kecepatan: 28000
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ORBIT"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "TERKENDALI"
                              }
                        ],
                        keterangan: "Ketinggian 300 & Kecepatan 28000 (keduanya tepat batas) → \"ORBIT\" dan \"TERKENDALI\"."
                  },
                  {
                        data: {
                              ketinggian: 400,
                              kecepatan: 31000
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "ORBIT"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "BAHAYA"
                              }
                        ],
                        keterangan: "Ketinggian 400 & Kecepatan 31000 → \"ORBIT\" dan \"BAHAYA\"."
                  },
                  {
                        data: {
                              ketinggian: 220,
                              kecepatan: 26000
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "JATUH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "TERKENDALI"
                              }
                        ],
                        keterangan: "Ketinggian 220 & Kecepatan 26000 → \"JATUH\" dan \"TERKENDALI\"."
                  },
                  {
                        data: {
                              ketinggian: 180,
                              kecepatan: 32000
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "JATUH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "BAHAYA"
                              }
                        ],
                        keterangan: "Ketinggian 180 & Kecepatan 32000 → \"JATUH\" dan \"BAHAYA\"."
                  }
            ]
      },
      {
            id: 9,
            ringkasan: "Pengisian Baterai Rover",
            aturan: [
                  {
                        jika: "tegangan >= 48",
                        maka: "\"PENUH\"",
                        selainItu: "\"RENDAH\""
                  },
                  {
                        jika: "arus <= 10",
                        maka: "\"STABIL\"",
                        selainItu: "\"LONJAKAN\""
                  }
            ],
            konteks: "Pengisian Baterai Rover: Pertama, jika tegangan minimal 48 tampilkan \"PENUH\", selain itu tampilkan \"RENDAH\". Kedua, jika arus maksimal 10 tampilkan \"STABIL\", selain itu tampilkan \"LONJAKAN\".",
            namaData: "tegangan",
            pembandingDefault: 48,
            pesanTersedia: [
                  "PENUH",
                  "RENDAH",
                  "STABIL",
                  "LONJAKAN"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              tegangan: 52,
                              arus: 8
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PENUH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Tegangan 52 & Arus 8 → \"PENUH\" dan \"STABIL\"."
                  },
                  {
                        data: {
                              tegangan: 48,
                              arus: 10
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PENUH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Tegangan 48 & Arus 10 (keduanya tepat batas) → \"PENUH\" dan \"STABIL\"."
                  },
                  {
                        data: {
                              tegangan: 50,
                              arus: 14
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "PENUH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "LONJAKAN"
                              }
                        ],
                        keterangan: "Tegangan 50 & Arus 14 → \"PENUH\" dan \"LONJAKAN\"."
                  },
                  {
                        data: {
                              tegangan: 36,
                              arus: 6
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "RENDAH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "STABIL"
                              }
                        ],
                        keterangan: "Tegangan 36 & Arus 6 → \"RENDAH\" dan \"STABIL\"."
                  },
                  {
                        data: {
                              tegangan: 24,
                              arus: 16
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "RENDAH"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "LONJAKAN"
                              }
                        ],
                        keterangan: "Tegangan 24 & Arus 16 → \"RENDAH\" dan \"LONJAKAN\"."
                  }
            ]
      },
      {
            id: 10,
            ringkasan: "Ventilasi Kubah Stasiun",
            aturan: [
                  {
                        jika: "aliran >= 80",
                        maka: "\"LANCAR\"",
                        selainItu: "\"MAMPET\""
                  },
                  {
                        jika: "debu <= 15",
                        maka: "\"BERSIH\"",
                        selainItu: "\"KOTOR\""
                  }
            ],
            konteks: "Ventilasi Kubah Stasiun: Pertama, jika aliran minimal 80 tampilkan \"LANCAR\", selain itu tampilkan \"MAMPET\". Kedua, jika debu maksimal 15 tampilkan \"BERSIH\", selain itu tampilkan \"KOTOR\".",
            namaData: "aliran",
            pembandingDefault: 80,
            pesanTersedia: [
                  "LANCAR",
                  "MAMPET",
                  "BERSIH",
                  "KOTOR"
            ],
            operatorBenar: ">=",
            dataUji: [
                  {
                        data: {
                              aliran: 100,
                              debu: 8
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LANCAR"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "BERSIH"
                              }
                        ],
                        keterangan: "Aliran 100 & Debu 8 → \"LANCAR\" dan \"BERSIH\"."
                  },
                  {
                        data: {
                              aliran: 80,
                              debu: 15
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LANCAR"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "BERSIH"
                              }
                        ],
                        keterangan: "Aliran 80 & Debu 15 (keduanya tepat batas) → \"LANCAR\" dan \"BERSIH\"."
                  },
                  {
                        data: {
                              aliran: 90,
                              debu: 22
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "LANCAR"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "KOTOR"
                              }
                        ],
                        keterangan: "Aliran 90 & Debu 22 → \"LANCAR\" dan \"KOTOR\"."
                  },
                  {
                        data: {
                              aliran: 60,
                              debu: 10
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "MAMPET"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "BERSIH"
                              }
                        ],
                        keterangan: "Aliran 60 & Debu 10 → \"MAMPET\" dan \"BERSIH\"."
                  },
                  {
                        data: {
                              aliran: 40,
                              debu: 30
                        },
                        harapan: [
                              {
                                    tipe: "pesan",
                                    nilai: "MAMPET"
                              },
                              {
                                    tipe: "pesan",
                                    nilai: "KOTOR"
                              }
                        ],
                        keterangan: "Aliran 40 & Debu 30 → \"MAMPET\" dan \"KOTOR\"."
                  }
            ]
      }
]
  }
];

export function ambilLevelBerdasarkanId(id: string): Level | undefined {
  return DAFTAR_LEVEL.find((l) => l.id === id);
}
