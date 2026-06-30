# Dokumentasi Form Master ASS/Owner KMMD

Dokumentasi modul **Form Master ASS/Owner KMMD** — mapping Supplier Subdistributor dengan Owner KMMD dan ASS untuk mendukung alur approval klaim (Enhancement KICAO KDS, BRD Jun 2026).

## Tujuan paket dokumen

Paket ini disusun sebagai **sumber referensi tunggal** untuk penyusunan:

- **BRD** (Business Requirements Document) — kebutuhan bisnis, aturan, stakeholder
- **FSD** (Functional Specification Document) — spesifikasi layar, validasi, integrasi, data model produksi

## Daftar dokumen

| No | File | Isi |
|----|------|-----|
| 1 | [01-complete-specification.md](./01-complete-specification.md) | **Spesifikasi lengkap** — bisnis, fungsional, data model, UI/UX, integrasi, gap BRD vs prototype, kriteria uji |
| 2 | [02-sample-data.json](./02-sample-data.json) | Contoh payload record registry (JSON) |

## Artefak terkait di repositori

| Artefak | Path |
|---------|------|
| Halaman prototype | `Views/Master/AssOwnerKMMD/Index.html` |
| Prototype store (CRUD + lookup) | `Scripts/customs/prototype/proto-store.js` |
| RBAC prototype | `Scripts/customs/prototype/rbac-prototype.js` |
| Menu navigasi | `Scripts/layout.js` → Master Data → Form ASS/Owner KMMD |
| BRD enhancement (induk) | `Docs/BRD-KICAO-KDS-Enhancement.md` — Bagian B |
| Integrasi data prototype | `Docs/Klaim/06-data-integration-plan.md` |
| Workflow klaim (Owner/ASS lookup) | `Docs/Klaim/07-workflow-rbac-external-approval.md` |
| Log progress prototype | `Docs/Klaim/05-progress-log.md` |

## Status implementasi

| Lingkungan | Status |
|------------|--------|
| Prototype HTML/JS | ✅ Selesai (Jun 2026) |
| Backend ASP.NET / Oracle | ⏳ Belum — lihat § Produksi di spesifikasi lengkap |
| Email notifikasi Owner | ⏳ Simulasi di Form Klaim |

## Versi dokumen

| Versi | Tanggal | Perubahan |
|-------|---------|-----------|
| 1.0 | 30-Jun-2026 | Rilis awal — dokumentasi lengkap berdasarkan prototype final |
