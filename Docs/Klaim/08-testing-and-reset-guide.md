# Modul Klaim — Panduan Uji Coba & Reset Data

> **Terakhir diperbarui:** 30 Juni 2026

Panduan langkah demi langkah untuk menguji alur klaim lengkap di prototype, serta cara mereset data demo.

---

## 1. Prasyarat

1. Buka prototype via static server (mis. Live Server di VS Code) — URL contoh: `http://127.0.0.1:5500/index.html`
2. Login (klik login tanpa backend)
3. Pilih role di halaman **Choose Role** (`Views/Account/ChooseRole.html`)

**Tip:** Gunakan **satu browser** untuk seluruh skenario agar `localStorage` konsisten. Tab email OTP boleh dibuka di tab baru (origin sama).

---

## 2. Reset Data Demo

### 2.1 Reset registry klaim & master (disarankan)

Buka Console browser (`F12`) di halaman aplikasi, jalankan:

```javascript
protoResetDemoData();
location.reload();
```

Yang ter-reset:
- Registry klaim → seed default (semua status **DRAFT**)
- Registry ASS/Owner KMMD → seed default
- Klaim aktif di `sessionStorage`

Yang **tidak** ter-reset: login (`kds_logged_in`) dan role (`kds_active_role`).

### 2.2 Reset total (login + role)

```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### 2.3 Reset manual per key

```javascript
localStorage.removeItem('kds_proto_klaim_registry');
localStorage.removeItem('kds_proto_ass_owner_registry');
localStorage.removeItem('kds_proto_meta');
sessionStorage.removeItem('kds_proto_active_claim_id');
sessionStorage.removeItem('klaimPrototypeData');
location.reload();
```

---

## 3. Skenario Uji End-to-End

### Skenario A — Alur lengkap via OTP eksternal

| # | Role | Langkah | Hasil yang diharapkan |
|---|------|---------|----------------------|
| 1 | Admin KMMD | Login → Form Klaim → Find atau buat baru → lengkapi form → **Save** | Status `DRAFT`; tab email Owner terbuka |
| 2 | — | Di tab email: klik link OTP → masukkan OTP apa pun → **Submit** | Status registry `DRAFT WITH APPROVE`; history Owner + ASS auto |
| 3 | RSM | Ganti role → Find | Hanya klaim `DRAFT WITH APPROVE` |
| 4 | RSM | Buka klaim → edit remark/detail → set Ready to Submit = **Yes** → **Ready To Submit** → OK | Dialog konfirmasi teks **"Ready To Submit"**; status `Ready to Submit` |
| 5 | CF | Ganti role → Find | Hanya klaim `Ready to Submit` |
| 6 | CF | Buka klaim → **Submit** → OK | Status `APPROVED`; tombol Submit hilang |

### Skenario B — Owner approve in-app (tanpa email)

| # | Role | Langkah | Hasil |
|---|------|---------|-------|
| 1 | Admin KMMD | Save klaim baru | Status `DRAFT` |
| 2 | Owner KMMD | Find → pilih klaim DRAFT → **Email / Approve** → konfirmasi | Status `DRAFT WITH APPROVE` + ASS auto di history |

### Skenario C — Filter Find per role

Setelah reset, seed default punya beberapa klaim `DRAFT`. Lakukan Skenario A langkah 1–2 pada satu klaim (mis. ID `5195`), lalu Skenario A langkah 4 pada klaim yang sama.

| Role | Find menampilkan |
|------|------------------|
| Owner KMMD | Klaim `DRAFT` saja |
| RSM | Klaim `DRAFT WITH APPROVE` saja |
| CF | Klaim `Ready to Submit` saja |
| IT Admin | Semua status |

### Skenario D — RSM edit data

| # | Langkah | Hasil |
|---|---------|-------|
| 1 | Login RSM, buka klaim `DRAFT WITH APPROVE` | Remark & detail **editable** |
| 2 | Coba ubah Group Account / Outlet | Field header **readonly** (tanpa LOV) |
| 3 | Tambah baris detail | Tombol Add Detail tampil |
| 4 | Ready To Submit tanpa validasi lengkap | Alert validasi (jika field wajib kosong) |

### Skenario E — Sinkronisasi setelah OTP

| # | Langkah | Hasil |
|---|---------|-------|
| 1 | Admin Save → biarkan tab Form Klaim terbuka | Status label `DRAFT` |
| 2 | Di tab lain: selesaikan OTP Owner | — |
| 3 | Kembali ke tab Form Klaim (focus) | Status label berubah ke `DRAFT WITH APPROVE` |

### Skenario F — Partner ENSEVAL

Klaim seed dengan `groupAccount: ENSEVAL` (mis. ID `5195`) harus punya Partner terisi saat dibuka dari Find. Validasi Partner wajib jika Group Account = ENSEVAL.

---

## 4. Checklist Regresi Cepat

- [ ] Tombol Save bisa diklik setelah `layout.js` render ulang body
- [ ] Find menampilkan data dari registry (bukan hardcoded)
- [ ] Save klaim baru muncul di urutan teratas Find
- [ ] OTP email tidak menyebut SMS/HP
- [ ] Link `step=ass` menampilkan pesan ASS sudah auto-approve
- [ ] Approval History menampilkan baris Owner + ASS
- [ ] CF tidak melihat klaim DRAFT atau DRAFT WITH APPROVE di Find
- [ ] RSM tidak melihat klaim Ready to Submit di Find (kecuali sudah di-submit balik — tidak berlaku di prototype)

---

## 5. Troubleshooting

| Gejala | Kemungkinan penyebab | Solusi |
|--------|---------------------|--------|
| Find semua DRAFT padahal sudah di-approve | Registry stale | `protoResetDemoData(); location.reload()` |
| OTP tidak mengubah status | `claimId` tidak ada di registry | Save dulu dari Form Klaim (browser/tab sama) |
| Partner kosong + error ENSEVAL | Seed lama | Reset data demo |
| Tombol Save tidak bisa diklik | Handler hilang setelah layout render | Refresh halaman (sudah diperbaiki via `bindKlaimToolbarHandlers`) |
| Data klaim hilang setelah refresh | Normal jika tidak pernah Save/Find | Find → pilih klaim, atau Save untuk persist |

---

## 6. Data Seed Default (setelah reset)

Seed klaim ada di `Scripts/customs/prototype/proto-store.js` → `KDS_PROTO_SEED_KLAIM`.

Contoh record untuk uji RBAC:

| ID | Deskripsi | Group Account | Status awal |
|----|-----------|---------------|-------------|
| 5195 | BONUS SUBDIST | ENSEVAL | DRAFT |
| 5194 | PROGRAM GOAL | ENSEVAL | DRAFT |
| 5193 | BONUS SUBDIST (owner test) | ENSEVAL | DRAFT |
| 5192 | MEMO PENETRATION (BOSNET) | KMMD | DRAFT |

Naikkan `KLAIM_SEED_REVISION` di `proto-store.js` jika mengubah isi seed agar browser memaksa re-seed.

---

## 7. Dokumen Terkait

- [07-workflow-rbac-external-approval.md](./07-workflow-rbac-external-approval.md) — spesifikasi workflow & RBAC
- [06-data-integration-plan.md](./06-data-integration-plan.md) — rencana integrasi data
- [05-progress-log.md](./05-progress-log.md) — log perubahan prototype
