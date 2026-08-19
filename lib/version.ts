export const APP_VERSION = "v1.1.0";

export const PATCH_NOTES = [
  {
    version: "v1.1.0",
    date: "2026-08-19",
    changes: [
      "Menambahkan fitur Multi-halaman untuk pengalaman yang lebih kaya.",
      "Menambahkan buku Love Letter interaktif ('Story').",
      "Menambahkan galeri Memories dengan grid masonry dan pop-up Lightbox.",
      "Membuat Navigation Bar melayang global di bagian bawah aplikasi.",
      "Memperbaiki konfigurasi Next.js (Static Export 'output: export') agar deployment di GitHub Pages berjalan dengan benar dan memunculkan antarmuka, bukan hanya README.",
    ],
    type: "minor"
  },
  {
    version: "v1.0.1",
    date: "2026-08-19",
    changes: [
      "Menambahkan Admin Dashboard untuk melihat versi dan patch notes.",
      "Migrasi dan perbaikan struktur file proyek agar berjalan dengan baik di AI Studio.",
    ],
    type: "patch"
  },
  {
    version: "v1.0.0",
    date: "2026-08-19",
    changes: [
      "Rilis Pertama: Valentine Days Interactive Flow.",
      "Fitur Love Mode Toggle.",
      "Fitur Interactive Tic-Tac-Toe.",
      "Fitur Love Meter.",
      "Fitur Typewriter Message.",
      "Fitur 3D Dome Gallery untuk menampilkan memori foto.",
    ],
    type: "major"
  }
];
