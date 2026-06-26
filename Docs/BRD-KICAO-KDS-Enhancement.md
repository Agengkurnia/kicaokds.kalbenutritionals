# Business Requirements Document (BRD)
## KICAO KDS — Enhancement Release

---

| Atribut          | Detail                                               |
|------------------|------------------------------------------------------|
| **Dokumen**      | Business Requirements Document                       |
| **Proyek**       | KICAO KDS — Enhancement Modul Klaim, Master, Report, RFP/RFS |
| **Dibuat oleh**  | Tim IT — PT Kalbe Nutritionals                       |
| **Tanggal**      | 26 Juni 2026                                         |
| **Versi**        | 1.0 — Draft Awal                                     |
| **Status**       | Menunggu Review dan Persetujuan                      |

---

## 1. Latar Belakang

Sistem **KICAO KDS** (Kalbe Nutritionals — Klaim Distributor System) adalah platform internal yang digunakan untuk mengelola klaim reimbursement aktivitas promosi dari jaringan distributor. Sistem ini melibatkan alur kerja mulai dari pengajuan klaim oleh Admin KMMD, proses approval bertingkat, hingga payment dan penerbitan laporan keuangan.

Seiring perkembangan kebutuhan operasional, terdapat beberapa kebutuhan enhancement yang mencakup:

1. Penambahan kolom informasi payment pada detail transaksi klaim
2. Fitur E-Materai untuk klaim di atas ambang batas nominal tertentu
3. Pembaruan alur approval dengan penambahan level Owner KMMD dan ASS
4. Validasi tambahan untuk integritas data PPN dan Faktur Pajak
5. Penyesuaian periode BosNet dari quartal menjadi bulanan
6. Form Master baru untuk mapping Supplier Subdistributor dengan ASS dan KMMD Owner
7. Penambahan menu Report untuk Outstanding Invoice dan Claim to Payment
8. Fitur merge PDF pada proses push ke SMART di menu RFP/RFS

---

## 2. Ruang Lingkup

### 2.1 Modul yang Terpengaruh

| No | Modul                          | Jenis Perubahan           |
|----|--------------------------------|---------------------------|
| A  | Menu Klaim                     | Enhancement / New Feature |
| B  | Form Master ASS/Owner KMMD     | New Feature               |
| C  | Menu Report                    | New Feature               |
| D  | Menu RFP/RFS                   | Enhancement               |

### 2.2 Yang Tidak Termasuk dalam Scope

- Perubahan pada sistem BosNet (pihak ketiga) — hanya penyesuaian di sisi KICAO KDS
- Perubahan pada sistem SMART (pihak ketiga) — hanya penyesuaian format dokumen output
- Modul selain yang disebutkan (mis. CMA, KKP, MKPP, ONO)
- Infrastruktur server dan database administration

---

## 3. Pemangku Kepentingan (Stakeholders)

| Peran                       | Tanggung Jawab dalam Sistem                                    |
|-----------------------------|----------------------------------------------------------------|
| Admin KMMD                  | Membuat dan menyimpan dokumen klaim (status: Draft)            |
| Owner KMMD                  | Level approval 1 — menerima email notifikasi, approve/reject   |
| ASS (Area Sales Supervisor) | Level approval 2 — auto-approve (pelengkap administratif)      |
| RSM (Regional Sales Manager)| Menyatakan "Ready to Submit"                                   |
| CF (Credit and Finance)     | Melakukan Submit final untuk proses payment                    |
| Tim IT                      | Developer dan maintainer sistem KICAO KDS                      |

---

## 4. Kebutuhan Bisnis Detail

---

### A. Menu Klaim

#### A.1 Penambahan Kolom di Grid Detail Klaim

**Latar Belakang:**
Grid detail klaim saat ini tidak menampilkan informasi payment seperti status pembayaran, tanggal bayar, dan nama bank. Informasi ini dibutuhkan tim keuangan untuk melacak realisasi klaim. Selain itu, kolom DPP+PPN dibutuhkan untuk kalkulasi dan pelaporan pajak.

**Kolom Baru yang Diperlukan:**

| Kolom Baru     | Keterangan                                              | Sumber Data / Kalkulasi                       |
|----------------|---------------------------------------------------------|-----------------------------------------------|
| Status Payment | Status apakah klaim sudah dibayar atau belum            | Diisi manual atau sinkron dari sistem payment |
| Paid Date      | Tanggal realisasi pembayaran                            | Input manual atau sinkron dari sistem payment |
| Bank           | Nama bank yang digunakan untuk pembayaran               | Input manual atau LOV bank                    |
| DPP+PPN        | Nilai Invoice Amount + PPN Amount                       | DEC_INVOICE_AMT + DEC_PPN (otomatis)          |

**Aturan Bisnis:**
- Kolom Status Payment, Paid Date, dan Bank bersifat read-only kecuali untuk role CF (tim keuangan)
- DPP+PPN dihitung otomatis: Invoice Amount + PPN Amount
- Kolom baru ditempatkan setelah kolom "Include" di grid detail

**Perubahan Database — Tabel XXSHP_KDS_T_KLAIM_DTL:**

| Field Baru           | Tipe Data          | Nullable |
|----------------------|--------------------|----------|
| TXT_PAYMENT_STATUS   | VARCHAR2(50)       | Yes      |
| DTM_PAID_DATE        | DATE               | Yes      |
| TXT_BANK_NAME        | VARCHAR2(100)      | Yes      |

---

#### A.2 Fitur Generate Report E-Materai

**Latar Belakang:**
Sesuai regulasi, transaksi di atas Rp 5.000.000 wajib dilengkapi materai elektronik. Saat ini proses ini dilakukan manual. Dibutuhkan fitur generate PDF terintegrasi langsung dari sistem klaim.

**Kebutuhan:**
- Tombol **"E-Materai"** ditambahkan di area header form klaim
- Tombol aktif jika total klaim >= Rp 5.000.000
- Generate PDF terdiri dari 2 dokumen yang digabung menjadi 1 file:
  1. Kwitansi Standar — template: `170914 Kwitansi Standard SHP Sep 17.xlsx`
  2. Surat Pengantar Klaim — template Excel terpisah (dikonfirmasi bisnis)

**Aturan Bisnis:**
- Ambang batas nominal trigger E-Materai: >= Rp 5.000.000
- Total dihitung dari semua baris detail dengan BIT_INCLUDE = 'Y'
- PDF dihasilkan dalam satu file gabungan (merge)
- File tersimpan dan dapat di-download ulang
- Tombol E-Materai tampil setelah status minimal DRAFT

**Template Dokumen:**

| Dokumen                  | Template                                    | Keterangan                       |
|--------------------------|---------------------------------------------|----------------------------------|
| Kwitansi Standar         | 170914 Kwitansi Standard SHP Sep 17.xlsx   | Data header + detail klaim       |
| Surat Pengantar Klaim    | Template Excel terpisah                     | Summary klaim per aktivitas      |

---

#### A.3 Pembaruan Alur Approval

**Latar Belakang:**
Alur approval klaim saat ini hanya melibatkan RSM dan CF. Kebutuhan bisnis menuntut penambahan 2 level approval baru sebelum RSM, yaitu Owner KMMD (approval manual via email) dan ASS (auto-approve).

**Alur Approval Baru (Future State):**

| Urutan | User / Role         | Aksi               | Status Setelah Aksi | Keterangan                           |
|--------|---------------------|--------------------|---------------------|--------------------------------------|
| 1      | Admin KMMD          | Save               | Draft               | Status awal                          |
| 2      | Owner KMMD (Baru)   | Email / Approve    | Approve 1 - Draft   | Notifikasi email, approve/reject     |
| 3      | ASS (Baru)          | Auto Approve       | Approve 2 - Draft   | Otomatis, kelengkapan administratif  |
| 4      | RSM                 | Ready To Submit    | Draft (siap submit) | Pernyataan kesiapan                  |
| 5      | CF                  | Submit             | Approved            | Final submission untuk payment       |

**Kebutuhan Teknis:**
- Penambahan step approval di engine K2 (atau mekanisme approval yang digunakan)
- Notifikasi email otomatis ke Owner KMMD ketika status berubah ke "Approve 1 - Draft"
- ASS di-trigger secara otomatis (tidak perlu aksi manual)
- Mapping Supplier Subdistributor ke ASS dan Owner KMMD diperlukan (lihat Bagian B)

**Entitas Database yang Terpengaruh:**
- XXSHP_KDS_M_APP_HDR dan XXSHP_KDS_M_APP_DTL (tabel approval hierarchy)
- Konfigurasi K2 Process (jika digunakan)

---

#### A.4 Validasi Faktur Pajak dan PPN

**Latar Belakang:**
Saat ini tidak ada validasi silang antara Faktur Pajak dan PPN. Diperlukan validasi agar data konsisten.

**Aturan Validasi:**

| Kondisi                          | Validasi yang Berlaku                               |
|----------------------------------|-----------------------------------------------------|
| PPN tidak 0% (ada tarif PPN)     | Faktur Pajak No wajib diisi                         |
| PPN tidak 0% (ada tarif PPN)     | Faktur Pajak Date wajib diisi                       |
| Faktur Pajak No diisi            | PPN harus tidak 0% (ada tarif PPN yang dipilih)     |
| Faktur Pajak Date diisi          | PPN harus tidak 0% (ada tarif PPN yang dipilih)     |

**Perilaku UI:**
- Validasi dilakukan saat user klik Save atau Submit
- Pesan error ditampilkan spesifik per baris: contoh "Baris 1: Faktur Pajak No wajib diisi jika PPN tidak 0%"
- Highlight baris yang gagal validasi dengan border merah

---

#### A.5 Penyesuaian Periode BosNet (Quartal ke Bulanan)

**Latar Belakang:**
Data klaim yang di-push dari BosNet menggunakan periode quartal, sedangkan KICAO KDS menggunakan periode bulanan. Hal ini menyebabkan mismatch data periode.

**Solusi:**
Ketika data klaim di-push dari BosNet, kolom Period From dan Period To diisi dengan periode quartal asli dari BosNet, tidak dikonversi ke bulan.

**Aturan Bisnis:**
- Jika source doc = BOSNET, Period From dan Period To diisi sesuai periode quartal BosNet
- Contoh: jika BosNet push Q1 2026, maka Period From = 01-Jan-2026, Period To = 31-Mar-2026
- Data klaim dengan source PORTAL KDS (input manual) tidak terpengaruh

---

### B. Menu Form Master ASS/Owner KMMD

**Latar Belakang:**
Alur approval baru (A.3) memerlukan mapping antara Supplier Subdistributor dengan ASS dan Owner KMMD. Dibutuhkan form master baru untuk mengelola mapping tersebut.

**Referensi UI:**
Mengikuti desain form KAM Supplier yang sudah ada di sistem (Master > KAM Supplier).

**Header Master:**

| Field         | Keterangan                                          |
|---------------|-----------------------------------------------------|
| Group Account | Nama group account distributor                      |
| Supplier ID   | ID supplier dari Oracle                             |
| Supplier Name | Nama supplier                                       |
| Owner KMMD    | Nama / ID pegawai Owner KMMD yang bertanggung jawab |

**Detail Master (per site/branch):**

| Field            | Keterangan                                          |
|------------------|-----------------------------------------------------|
| Site             | Kode site supplier                                  |
| Branch ID        | ID branch                                           |
| Branch Name      | Nama branch                                         |
| ASS              | Nama / ID pegawai ASS yang bertanggung jawab        |
| Region ID        | Kode region                                         |
| Region Name      | Nama region                                         |
| Tipe Distributor | Tipe distributor (Subdist, Direct, dll.)             |

**Entitas Database:**

| Opsi | Pendekatan                                                                      |
|------|---------------------------------------------------------------------------------|
| 1    | Memperluas XXSHP_KDS_M_KSUP_HDR (tambah ASS ID/Name) dan XXSHP_KDS_M_KSUP_DTL |
| 2    | Membuat tabel baru XXSHP_KDS_M_ASS_OWNER_HDR dan XXSHP_KDS_M_ASS_OWNER_DTL    |

**Aksi yang Tersedia:** Add Row, Save, Edit, Delete, Find

---

### C. Menu Report

**Lokasi Menu:** Reporting > Transaction

#### C.1 Report Claim Outstanding (Aging Invoice)

**Deskripsi:**
Report klaim yang nomor invoice-nya masih kosong. Berguna untuk monitoring progress pengisian data oleh distributor.

**Kriteria Data:**
- Baris detail dengan TXT_INVOICE_NO kosong atau NULL
- Status klaim bukan CLOSED atau REJECTED

**Kolom Output:**

| Kolom          | Sumber Data                              |
|----------------|------------------------------------------|
| Doc No         | TXT_DOC_NO                               |
| Supplier       | TXT_SUPPLIER_NAME                        |
| Group Account  | TXT_GROUP_ACCOUNT                        |
| Activity       | TXT_ACTIVITY                             |
| Program Desc   | TXT_PROGRAM_DESC                         |
| Period From/To | DTM_PERIOD_FROM, DTM_PERIOD_TO           |
| Invoice No     | TXT_INVOICE_NO (kosong)                  |
| Invoice Amount | DEC_INVOICE_AMT                          |
| Aging (hari)   | CREATION_DATE hingga tanggal hari ini    |
| Status Klaim   | TXT_STATUSKLAIM                          |

**Filter:** Periode pembuatan, Group Account, Supplier

#### C.2 Report Claim to Payment

**Deskripsi:**
Report klaim yang sudah dalam status payment — invoice sudah ada dan telah diproses.

**Kriteria Data:**
- Baris detail dengan TXT_INVOICE_NO tidak kosong
- Status Payment telah diisi

**Kolom Output:**

| Kolom          | Sumber Data                              |
|----------------|------------------------------------------|
| Doc No         | TXT_DOC_NO                               |
| Supplier       | TXT_SUPPLIER_NAME                        |
| Group Account  | TXT_GROUP_ACCOUNT                        |
| Activity       | TXT_ACTIVITY                             |
| Invoice No     | TXT_INVOICE_NO                           |
| Invoice Amount | DEC_INVOICE_AMT                          |
| PPN Amount     | DEC_PPN                                  |
| DPP+PPN        | DEC_INVOICE_AMT + DEC_PPN               |
| Status Payment | TXT_PAYMENT_STATUS                       |
| Paid Date      | DTM_PAID_DATE                            |
| Bank           | TXT_BANK_NAME                            |

**Filter:** Periode payment atau klaim, Group Account, Supplier, Status Payment

---

### D. Menu RFP/RFS — Merge PDF Lampiran

**Latar Belakang:**
Saat ini lampiran dikirim secara terpisah saat push ke SMART. Kebutuhan baru adalah semua lampiran digabung menjadi satu file PDF sebelum dikirim.

**Lampiran yang Di-merge:**

| No | Lampiran                         | Sumber                  |
|----|----------------------------------|-------------------------|
| 1  | Kwitansi Standar                 | Generate dari sistem    |
| 2  | Surat Pengantar Klaim            | Generate dari sistem    |
| 3  | Laporan Klaim BosNet dan Memo    | Generate dari sistem    |

**Aturan Bisnis:**
- Merge PDF dilakukan otomatis saat user klik "Push to SMART"
- Urutan lampiran: Lampiran 1 -> Lampiran 2 -> Lampiran 3
- Nama file: [DocNo]_Lampiran_SMART_[tanggal].pdf
- File disimpan di server dan dapat di-download ulang

---

## 5. Kebutuhan Non-Fungsional

| Kategori        | Kebutuhan                                                    |
|-----------------|--------------------------------------------------------------|
| Performa        | Generate PDF tidak melebihi 30 detik                         |
| Keamanan        | Akses tombol E-Materai dan Push SMART dibatasi sesuai role   |
| Ketersediaan    | Enhancement dilakukan bertahap tanpa downtime khusus         |
| Kompatibilitas  | Mendukung browser Chrome dan Edge versi terkini              |
| Audit Trail     | Setiap aksi approval direkam dengan timestamp dan user ID    |

---

## 6. Asumsi dan Ketergantungan

| Asumsi / Ketergantungan      | Keterangan                                                         |
|------------------------------|--------------------------------------------------------------------|
| Template Kwitansi Standar    | File Excel yang ada adalah template final                          |
| Template Surat Pengantar     | Template Excel akan dikonfirmasi oleh bisnis                       |
| Sistem SMART                 | API push SMART mendukung single PDF file (tidak multi-attachment)  |
| BosNet API                   | Field periode BosNet dapat diidentifikasi sebagai quartal          |
| Engine Approval K2           | Step approval dapat dikonfigurasi tanpa rebuild engine             |
| Data User ASS dan Owner KMMD | Data pegawai tersedia di HRESS atau master user sistem             |

---

## 7. Risiko

| Risiko                                            | Dampak           | Mitigasi                                        |
|---------------------------------------------------|------------------|-------------------------------------------------|
| Template Excel belum final                        | Delay E-Materai  | Konfirmasi template sebelum development dimulai |
| API SMART tidak support single file merge         | Fitur D terhambat| Koordinasi awal dengan tim SMART                |
| Mapping ASS/Owner KMMD tidak lengkap              | Approval stuck   | Validasi data mapping sebelum go-live           |
| Perubahan engine approval mempengaruhi modul lain | Regresi          | Regression testing menyeluruh sebelum release   |

---

## 8. Glosarium

| Istilah   | Definisi                                                            |
|-----------|---------------------------------------------------------------------|
| KICAO KDS | Kalbe Nutritionals — Klaim Distributor System                       |
| KMMD      | Distributor Modern Trade                                            |
| ASS       | Area Sales Supervisor                                               |
| RSM       | Regional Sales Manager                                              |
| CF        | Credit and Finance                                                  |
| E-Materai | Materai elektronik sesuai regulasi Peruri                           |
| DPP       | Dasar Pengenaan Pajak                                               |
| PPN       | Pajak Pertambahan Nilai                                             |
| PPH       | Pajak Penghasilan                                                   |
| BosNet    | Sistem distribusi pihak ketiga terintegrasi dengan KICAO KDS        |
| SMART     | Sistem pembayaran/finance pihak ketiga                              |
| RFP/RFS   | Request For Payment / Request For Settlement                        |

---

## 9. Tanda Tangan Persetujuan

| Peran                        | Nama | Tanggal | Tanda Tangan |
|------------------------------|------|---------|--------------|
| Business Owner               |      |         |              |
| IT Project Manager           |      |         |              |
| Business Analyst             |      |         |              |
| QA Lead                      |      |         |              |

---

*Dokumen ini adalah draft awal dan memerlukan review serta persetujuan dari semua pemangku kepentingan sebelum development dimulai.*

