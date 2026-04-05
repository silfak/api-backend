# 🌿 SILFAK - Backend API

**Web-based Green Campus Facility Analytics & Reporting Management System**  
Repositori ini adalah backend API (RESTful) untuk platform SILFAK. Bertugas mengelola data autentikasi, manajemen laporan keluhan, dan agregasi data analitik fasilitas kampus.

## 🚀 Tech Stack

- **Framework:** Express.js (Node.js)
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Linting & Formatting:** ESLint + Prettier

## 🛠️ Installation & Setup

Pastikan kamu sudah menginstal **Node.js (v18+)** dan **PostgreSQL** di komputermu.

1. **Clone repository**

   ```bash
   git clone https://github.com/silfak/api-backend.git
   cd api-backend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment setup**

   Buat file `.env` di root folder (copy dari `.env.example`):

   ```env
   PORT=8000
   DATABASE_URL=postgresql://user:password@localhost:5432/silfak_db
   ```

4. **Database migration/sync**

   Jalankan perintah berikut untuk mengelola skema database dengan Drizzle:

   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

Server akan berjalan di `http://localhost:8000`.

## 📁 Folder Structure Overview

```plaintext
src/
├── config/           # Konfigurasi environment & eksternal
├── controllers/      # Logic bisnis untuk setiap endpoint API
├── db/               # Instance Drizzle & Schema Database
├── middlewares/      # Error handler, auth guard (jika ditambahkan)
├── routes/           # Mapping URL ke fungsi controller
├── utils/            # Helper functions
└── index.js          # Entry point server
```

## 🌿 Git Branching Strategy

- `main` : Production-ready (no direct push)
- `develop` : Base branch untuk integrasi
- `feature/<nama-task>` : Endpoint baru (contoh: `feature/api-report-submit`)
- `fix/<nama-bug>` : Perbaikan bug (contoh: `fix/auth-token`)
