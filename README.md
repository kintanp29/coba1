# Transparansi Kas BEM FT

Sistem transparansi kas BEM Fakultas Teknik yang memungkinkan manajemen keuangan yang terbuka dan akuntabel.

## Fitur Utama

### ✅ CRUD Transaksi Kas Lengkap
- **Create**: Tambah transaksi baru dengan validasi
- **Read**: Tampilkan daftar transaksi dengan pagination
- **Update**: Edit transaksi yang sudah ada
- **Delete**: Hapus transaksi dengan konfirmasi

### ✅ Filter Tanggal & Pencarian Real-time
- **Filter Rentang Tanggal**: Filter transaksi berdasarkan tanggal mulai dan akhir
- **Filter Bulan & Tahun**: Filter transaksi berdasarkan bulan dan tahun tertentu
- **Pencarian Real-time**: Cari transaksi berdasarkan deskripsi atau kategori secara langsung
- **Filter Jenis Transaksi**: Filter berdasarkan pemasukan atau pengeluaran

### ✅ Export Excel (xlsx) dengan Format Rapi
- **Export per Bulan & Tahun**: Ekspor data kas berdasarkan filter bulan dan tahun
- **Format Excel Tersusun Rapi**: Data tersusun rapi dengan border dan format yang profesional
- **Header dengan Styling**: Header tabel memiliki background dan border
- **Format Currency**: Kolom jumlah diformat sebagai currency IDR
- **Auto-sizing Columns**: Kolom disesuaikan dengan konten

## Teknologi yang Digunakan

### Backend (Node.js/Express)
- **Express.js**: Framework web server
- **cors**: Cross-origin resource sharing
- **xlsx**: Library untuk export Excel dengan format profesional
- **fs**: File system untuk penyimpanan data

### Frontend (React)
- **React 18**: Library frontend
- **React Router DOM**: Routing aplikasi
- **Axios**: HTTP client untuk komunikasi API
- **Tailwind CSS**: Framework styling dengan desain biru navy modern

## Desain & Tampilan

### Tema Biru Navy Modern
- **Warna Dominan**: Biru navy (#1E3A8A) dengan aksen putih dan abu-abu
- **Gradients**: Latar belakang gradient dari biru muda ke putih
- **Shadow & Depth**: Bayangan lembut dan efek 3D untuk elemen penting
- **Transisi Halus**: Animasi hover dan transform yang smooth
- **Ikon Profesional**: SVG icons yang konsisten dan modern
- **Typography**: Font bold untuk judul, medium untuk body text

## Struktur Proyek

```
Transparansi-Kas-BEMFT-React-API/
├── server/                    # Backend API
│   ├── index.js              # Server utama
│   ├── package.json          # Dependencies backend
│   ├── data/                 # Data storage
│   │   ├── transactions.json # Data transaksi
│   │   ├── users.json        # Data pengguna
│   │   └── members.json      # Data anggota
│   ├── routes/               # API routes
│   │   ├── auth.js          # Authentication routes
│   │   ├── members.js       # Members routes
│   │   └── transactions.js  # Transactions CRUD routes
│   └── middleware/          # Middleware
│       └── auth.js          # Authentication middleware
├── client/                   # Frontend React
│   ├── package.json         # Dependencies frontend
│   ├── index.html           # HTML entry point
│   ├── vite.config.js       # Vite configuration
│   └── src/                 # Source code
│       ├── App.js           # App component with routing
│       ├── main.jsx         # React entry point
│       ├── api/             # API configuration
│       │   └── axios.js     # Axios instance
│       ├── context/         # React context
│       │   └── AuthContext.jsx # Authentication context
│       ├── pages/           # Page components
│       │   ├── Login.jsx    # Login page
│       │   └── Dashboard.jsx # Main dashboard
│       └── components/      # Reusable components
│           ├── FilterControls.jsx  # Filter controls
│           ├── SummaryCards.jsx    # Financial summaries
│           ├── TransactionForm.jsx # Create/edit form
│           ├── TransactionList.jsx # Transactions table
│           └── TransactionModal.jsx # Edit modal
└── README.md                # Project documentation
```

## Instalasi & Setup

### 1. Instalasi Dependencies

**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd client
npm install
```

### 2. Menjalankan Aplikasi

**Backend (port 5000):**
```bash
cd server
npm start
```

**Frontend (port 3000):**
```bash
cd client
npm run dev
```

### 3. Akses Aplikasi

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000/api

## API Endpoints

### Transaksi Kas
- `GET /api/transactions` - Dapatkan semua transaksi dengan filter
- `GET /api/transactions/:id` - Dapatkan transaksi berdasarkan ID
- `POST /api/transactions` - Buat transaksi baru
- `PUT /api/transactions/:id` - Update transaksi
- `DELETE /api/transactions/:id` - Hapus transaksi
- `GET /api/transactions/export/excel` - Export Excel dengan filter

### Filter Parameters
- `search`: Pencarian berdasarkan deskripsi/kategori
- `startDate` & `endDate`: Filter rentang tanggal
- `type`: Filter jenis (income/expense)
- `month` & `year`: Filter berdasarkan bulan dan tahun

## Fitur Export Excel

### Format Excel yang Dihasilkan
- **Header**: "No", "Tanggal", "Deskripsi", "Kategori", "Jenis", "Jumlah", "Saldo"
- **Styling**: Border pada semua sel, header dengan background abu-abu
- **Format Currency**: Kolom jumlah menggunakan format IDR
- **Column Width**: Disesuaikan dengan konten
- **Filename**: `Laporan_Kas_YYYY-MM-DD.xlsx`

### Contoh Export
```
No | Tanggal     | Deskripsi           | Kategori  | Jenis      | Jumlah     | Saldo
---|-------------|---------------------|-----------|------------|------------|-------
1  | 15 Jan 2024 | Pembayaran SPP      | Pendapatan| Pemasukan  | Rp500.000  |
2  | 20 Jan 2024 | Pembelian ATK       | Pengeluaran| Pengeluaran| Rp150.000  |
```

## Penggunaan

### 1. Login
Akses http://localhost:3000 dan login dengan kredensial yang valid.

### 2. Dashboard
Setelah login, Anda akan melihat:
- **Summary Cards**: Ringkasan keuangan (total pemasukan, pengeluaran, saldo)
- **Filter Controls**: Kontrol filter dan pencarian
- **Transaction Form**: Formulir untuk menambah transaksi
- **Transaction List**: Tabel daftar transaksi

### 3. Filter & Pencarian
- Gunakan input pencarian untuk mencari transaksi secara real-time
- Gunakan filter tanggal untuk melihat transaksi dalam rentang waktu tertentu
- Gunakan filter bulan/tahun untuk melihat laporan bulanan/tahunan
- Gunakan filter jenis untuk memfilter pemasukan atau pengeluaran

### 4. Export Excel
- Terapkan filter sesuai kebutuhan
- Klik tombol "Export Excel"
- File Excel akan di-download secara otomatis

### 5. CRUD Transaksi
- **Create**: Isi form dan klik "Simpan Transaksi"
- **Read**: Lihat daftar transaksi di tabel
- **Update**: Klik "Edit" pada baris transaksi
- **Delete**: Klik "Hapus" dan konfirmasi penghapusan

## Kontribusi

1. Fork repository ini
2. Buat branch fitur (`git checkout -b fitur/fitur-baru`)
3. Commit perubahan (`git commit -m 'Tambah fitur baru'`)
4. Push ke branch (`git push origin fitur/fitur-baru`)
5. Buka Pull Request

## Lisensi

Proyek ini dilisensikan di bawah MIT License - lihat file [LICENSE](LICENSE) untuk detailnya.

## Kontak

Untuk pertanyaan atau saran, silakan hubungi tim pengembang.