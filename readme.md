# 🧠 Adversarial Search: Connect Four AI

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Repositori ini memuat implementasi sistem Kecerdasan Buatan (AI) pada permainan papan *Connect Four* (7x6) sebagai bagian dari simulasi **Adversarial Search**. Mesin inferensi AI dibangun menggunakan algoritma dasar **Minimax** yang kemudian dioptimasi secara ekstensif menggunakan teknik **Alpha-Beta Pruning** untuk menangani ledakan kombinatorial (*combinatorial explosion*).

Aplikasi ini dikembangkan menggunakan arsitektur *Decoupled Client-Server*, memisahkan logika komputasi berat di sisi peladen (Flask/Python) dan visualisasi antarmuka di sisi klien (HTML/CSS/Vanilla JS) untuk menjaga responsivitas interaksi secara *real-time*.

🔗 **Live Deployment: https://www.sigit-connect4.my.id/

---

## ✨ Sorotan Fitur Utama

* **🤖 Competitive AI Agent:** Algoritma mampu menganalisis status papan dan mengambil keputusan langkah matematis optimal untuk memaksimalkan utilitas (*maximizing the minimum possible payoff*).
* **✂️ Alpha-Beta Pruning Optimization:** Pemangkasan dinamis pada *game tree* yang dieksekusi bersamaan dengan *Move Ordering* (prioritas kolom tengah), mampu mereduksi lebih dari 80% evaluasi *node* pada kedalaman menengah.
* **⚖️ Sistem Dual Counter:** Panel komparasi analitik waktu-nyata yang mendemonstrasikan perbandingan langsung antara jumlah eksekusi Minimax Murni melawan Alpha-Beta Pruning.
* **🌳 Explainable AI (Visualisasi Game Tree):** Terintegrasi dengan pustaka `Mermaid.js` untuk merender graf pohon keputusan (*decision tree*) dari logika internal agen secara visual dan interaktif.
* **🎨 UI/UX Cyberpunk Glassmorphism:** Antarmuka responsif dengan efek visual tingkat lanjut, termasuk animasi kinematika jatuhnya pion dan kilatan cahaya merah (*pruning highlight*) saat algoritma membuang cabang komputasi sub-optimal.
* **🎮 Fleksibilitas Mode Permainan:** Mendukung peralihan mulus antara mode *Player vs AI* dan lokal *Player vs Player*.

---

## ⚙️ Petunjuk Instalasi (Local Development)

Jika ingin menjalankan atau mengembangkan proyek ini di lingkungan lokal (komputer), ikuti langkah-langkah berikut:

1. **Kloning Repositori:**
   git clone # 🧠 Adversarial Search: Connect Four AI

![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![NumPy](https://img.shields.io/badge/NumPy-013243?style=for-the-badge&logo=numpy&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

Repositori ini memuat implementasi sistem Kecerdasan Buatan (AI) pada permainan papan *Connect Four* (7x6) sebagai bagian dari simulasi **Adversarial Search**. Mesin inferensi AI dibangun menggunakan algoritma dasar **Minimax** yang kemudian dioptimasi secara ekstensif menggunakan teknik **Alpha-Beta Pruning** untuk menangani ledakan kombinatorial (*combinatorial explosion*).

Aplikasi ini dikembangkan menggunakan arsitektur *Decoupled Client-Server*, memisahkan logika komputasi berat di sisi peladen (Flask/Python) dan visualisasi antarmuka di sisi klien (HTML/CSS/Vanilla JS) untuk menjaga responsivitas interaksi secara *real-time*.

🔗 **Live Deployment:https://www.sigit-connect4.my.id/

--
## ✨ Sorotan Fitur Utama

* **🤖 Competitive AI Agent:** Algoritma mampu menganalisis status papan dan mengambil keputusan langkah matematis optimal untuk memaksimalkan utilitas (*maximizing the minimum possible payoff*).
* **✂️ Alpha-Beta Pruning Optimization:** Pemangkasan dinamis pada *game tree* yang dieksekusi bersamaan dengan *Move Ordering* (prioritas kolom tengah), mampu mereduksi lebih dari 80% evaluasi *node* pada kedalaman menengah.
* **⚖️ Sistem Dual Counter:** Panel komparasi analitik waktu-nyata yang mendemonstrasikan perbandingan langsung antara jumlah eksekusi Minimax Murni melawan Alpha-Beta Pruning.
* **🌳 Explainable AI (Visualisasi Game Tree):** Terintegrasi dengan pustaka `Mermaid.js` untuk merender graf pohon keputusan (*decision tree*) dari logika internal agen secara visual dan interaktif.
* **🎨 UI/UX Cyberpunk Glassmorphism:** Antarmuka responsif dengan efek visual tingkat lanjut, termasuk animasi kinematika jatuhnya pion dan kilatan cahaya merah (*pruning highlight*) saat algoritma membuang cabang komputasi sub-optimal.
* **🎮 Fleksibilitas Mode Permainan:** Mendukung peralihan mulus antara mode *Player vs AI* dan lokal *Player vs Player*.

---

## ⚙️ Petunjuk Instalasi (Local Development)

Jika ingin menjalankan atau mengembangkan proyek ini di lingkungan lokal (komputer), ikuti langkah-langkah berikut:

1. Kloning Repositori:
```bash
   git clone (https://github.com/permana191/adversarial-search-connect4)
   cd adversarial-search-connect4
Siapkan Lingkungan Virtual (Direkomendasikan):

Bash
   python -m venv venv
   # Di Windows:
   venv\Scripts\activate
   # Di macOS/Linux:
   source venv/bin/activate
Instal Dependensi Sistem:

Bash
   pip install -r requirements.txt
Jalankan Peladen Flask:

Bash
   python app.py
Akses aplikasi melalui browser pada alamat: http://127.0.0.1:5000

📂 Struktur Direktori Proyek
Plaintext
/
├── app.py                 # Titik masuk utama (Routing Flask & Endpoint REST API)
├── ai_logic.py            # Logika Inti AI (Matriks NumPy, Minimax, Pruning, Heuristik)
├── requirements.txt       # Daftar pustaka Python yang dibutuhkan
├── vercel.json            # Konfigurasi Serverless untuk deployment ke Vercel
├── /templates
│   └── index.html         # Struktur kerangka DOM utama
└── /static
    ├── /css
    │   └── style.css      # Aturan gaya visual (Desain Cyberpunk)
    └── /js
        └── script.js      # Pengendali DOM, Timer, Logging, dan Fetch API Asinkronus

---

## 👨‍💻 Pengembang

Sigit Miraj Permana S1 Teknik Informatika

Fakultas Teknologi Informasi (FTI)

Universitas Bale Bandung (UNIBBA)

Proyek ini disusun dan dipublikasikan untuk memenuhi kualifikasi evaluasi praktikum komputasi Kecerdasan Buatan.
