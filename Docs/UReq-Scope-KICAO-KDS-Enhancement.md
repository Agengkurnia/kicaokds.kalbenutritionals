# User Requirement Scope (UReq Scope)
## KICAO KDS — Enhancement Release

---

| Atribut          | Detail                                               |
|------------------|------------------------------------------------------|
| **Dokumen**      | User Requirement Scope                               |
| **Proyek**       | KICAO KDS — Enhancement Modul Klaim, Master, Report, RFP/RFS |
| **Dibuat oleh**  | Tim IT — PT Kalbe Nutritionals                       |
| **Tanggal**      | 26 Juni 2026                                         |
| **Versi**        | 1.0 — Draft Awal                                     |
| **Referensi BRD**| BRD-KICAO-KDS-Enhancement.md v1.0                   |

---

## Ringkasan Scope

Dokumen ini mendefinisikan scope pekerjaan pengembangan secara teknis dan terinci per fitur, sebagai turunan dari BRD. Setiap fitur dilengkapi dengan:

- **Deskripsi kebutuhan pengguna** — apa yang diminta
- **Acceptance Criteria** — kondisi yang harus terpenuhi agar fitur dianggap selesai
- **In Scope** — pekerjaan yang termasuk
- **Out of Scope** — pekerjaan yang tidak termasuk dalam iterasi ini
- **Dependensi** — prasyarat yang harus ada sebelum fitur dapat dikerjakan

---

## FITUR A — Menu Klaim

---

### A.1 Penambahan Kolom di Grid Detail Klaim

**UReq ID:** KDS-KLAIM-001

**Deskripsi:**
Sebagai pengguna tim keuangan (CF), saya ingin melihat informasi payment langsung di grid detail klaim agar saya dapat memantau status realisasi pembayaran tanpa harus berpindah ke sistem lain. Selain itu, saya ingin kolom DPP+PPN tampil otomatis agar tidak perlu menghitung manual.

**Acceptance Criteria:**

| ID  | Kriteria                                                                         | Jenis       |
|-----|----------------------------------------------------------------------------------|-------------|
| AC-01 | Kolom "Status Payment" tampil di grid detail setelah kolom "Include"           | Functional  |
| AC-02 | Kolom "Paid Date" tampil di grid detail setelah "Status Payment"               | Functional  |
| AC-03 | Kolom "Bank" tampil di grid detail setelah "Paid Date"                         | Functional  |
| AC-04 | Kolom "DPP+PPN" tampil dan berisi nilai = Invoice Amount + PPN Amount          | Functional  |
| AC-05 | DPP+PPN diperbarui otomatis ketika Invoice Amount atau PPN Amount berubah      | Functional  |
| AC-06 | Kolom Status Payment, Paid Date, Bank dapat diedit hanya oleh role CF          | Security    |
| AC-07 | Role selain CF melihat kolom Status Payment, Paid Date, Bank sebagai read-only | Security    |
| AC-08 | Nilai DPP+PPN tidak dapat diedit secara manual (read-only, hasil kalkulasi)    | Functional  |

**In Scope:**
- Menambahkan 3 kolom baru (Status Payment, Paid Date, Bank) di grid detail `dtDetail`
- Menambahkan kolom kalkulasi DPP+PPN (computed column, tidak disimpan ke DB)
- Script migrasi database: ALTER TABLE untuk tambah 3 field baru di `XXSHP_KDS_T_KLAIM_DTL`
- Update logic parse/serialize JSON di Controller dan Business Logic
- Update tampilan grid (lebar kolom, header, alignment)

**Out of Scope:**
- Sinkronisasi otomatis dengan sistem payment eksternal (fase berikutnya)
- LOV bank dari master data bank (fase berikutnya — sementara input text bebas)

**Dependensi:**
- Script DDL untuk tambah column di tabel `XXSHP_KDS_T_KLAIM_DTL`
- Konfirmasi role ID untuk role CF dari tabel `XXSHP_KDS_M_ROLE`

---

### A.2 Fitur Generate Report E-Materai

**UReq ID:** KDS-KLAIM-002

**Deskripsi:**
Sebagai Admin KMMD atau CF, saya ingin dapat men-generate dokumen E-Materai langsung dari form klaim — berupa PDF gabungan antara Kwitansi Standar dan Surat Pengantar Klaim — agar proses pengajuan klaim di atas Rp 5 juta memenuhi persyaratan regulasi e-Materai dari Peruri.

**Acceptance Criteria:**

| ID  | Kriteria                                                                                    | Jenis       |
|-----|---------------------------------------------------------------------------------------------|-------------|
| AC-01 | Tombol "E-Materai" muncul di toolbar header form klaim                                    | UI          |
| AC-02 | Tombol "E-Materai" dinonaktifkan (disabled) jika total klaim < Rp 5.000.000               | Functional  |
| AC-03 | Tombol "E-Materai" aktif jika total klaim >= Rp 5.000.000                                 | Functional  |
| AC-04 | Klik tombol "E-Materai" menghasilkan PDF yang berisi Kwitansi Standar + Surat Pengantar   | Functional  |
| AC-05 | PDF yang dihasilkan adalah 1 file gabungan (merge), bukan 2 file terpisah                 | Functional  |
| AC-06 | Total yang dihitung untuk trigger adalah jumlah Invoice Amount baris dengan BIT_INCLUDE=Y | Functional  |
| AC-07 | PDF dapat didownload oleh user yang meng-generate                                         | Functional  |
| AC-08 | Tombol "E-Materai" hanya tampil pada status klaim minimal DRAFT (bukan NEW)               | Functional  |
| AC-09 | Data pada Kwitansi Standar mencerminkan data header dan detail klaim yang aktif           | Data        |
| AC-10 | Generate PDF selesai dalam waktu maksimal 30 detik                                        | Performance |

**Mapping Data Template — Kwitansi Standar:**

| Field di Template     | Sumber Data Klaim                           |
|-----------------------|---------------------------------------------|
| No. Kwitansi / Doc No | TXT_DOC_NO                                  |
| Tanggal               | CREATION_DATE                               |
| Nama Supplier         | TXT_SUPPLIER_NAME                           |
| Group Account         | TXT_GROUP_ACCOUNT                           |
| Jumlah (Total)        | SUM(DEC_INVOICE_AMT) where BIT_INCLUDE = Y  |
| Terbilang             | Kalkulasi text dari total                   |
| Rincian Aktivitas     | Daftar TXT_ACTIVITY + DEC_INVOICE_AMT       |

**In Scope:**
- Tombol "E-Materai" di header form
- Logic pengecekan threshold Rp 5.000.000
- Generate PDF dari template Kwitansi Standar
- Generate PDF dari template Surat Pengantar Klaim
- Merge 2 PDF menjadi 1 file
- Download PDF hasil generate

**Out of Scope:**
- Integrasi langsung dengan API Peruri untuk affix e-Materai digital (di luar scope teknis ini)
- Penyimpanan permanen file PDF di document management system

**Dependensi:**
- Template Kwitansi Standar (Excel) sudah dikonfirmasi final oleh bisnis
- Template Surat Pengantar Klaim (Excel) sudah tersedia dan dikonfirmasi
- Library PDF di server (contoh: iTextSharp, EPPlus untuk Excel-to-PDF, atau RDLC report)

---

### A.3 Pembaruan Alur Approval

**UReq ID:** KDS-KLAIM-003

**Deskripsi:**
Sebagai Admin KMMD, setelah menyimpan klaim (status Draft), saya ingin sistem secara otomatis mengirimkan notifikasi email kepada Owner KMMD yang terkait agar Owner KMMD dapat melakukan approval. Setelah Owner KMMD approve, sistem otomatis melanjutkan ke ASS (auto-approve) sebelum masuk ke alur RSM dan CF yang sudah ada.

**Acceptance Criteria:**

| ID  | Kriteria                                                                                         | Jenis       |
|-----|--------------------------------------------------------------------------------------------------|-------------|
| AC-01 | Setelah Save klaim (status Draft), sistem mengirim notifikasi email ke Owner KMMD terkait     | Functional  |
| AC-02 | Owner KMMD dapat approve melalui link di email atau melalui halaman approval di sistem         | Functional  |
| AC-03 | Jika Owner KMMD reject, status klaim kembali ke Draft dan notifikasi dikirim ke Admin KMMD    | Functional  |
| AC-04 | Setelah Owner KMMD approve, ASS secara otomatis approve (tidak perlu aksi manual)             | Functional  |
| AC-05 | Setelah ASS auto-approve, alur berlanjut ke RSM (Ready to Submit) seperti sebelumnya          | Functional  |
| AC-06 | Email notifikasi ke Owner KMMD berisi: Doc No, Supplier, Total Amount, dan link aksi           | UI          |
| AC-07 | Riwayat approval (Owner KMMD + ASS) tercatat di halaman Approval History                      | Functional  |
| AC-08 | Jika mapping Owner KMMD tidak ditemukan untuk supplier tersebut, sistem menampilkan error       | Validation  |

**Alur Status Lengkap:**

```
[Admin KMMD] Save
        |
        v
     DRAFT ──────────────────────> Email notifikasi ke Owner KMMD
        |
        v (Owner KMMD Approve)
   APPROVE 1 - DRAFT ──────────> Auto trigger ASS
        |
        v (ASS Auto-Approve)
   APPROVE 2 - DRAFT ──────────> Lanjut ke RSM
        |
        v (RSM: Ready to Submit)
   DRAFT (ready)
        |
        v (CF: Submit)
   APPROVED (Final)
```

**In Scope:**
- Konfigurasi step approval baru (Owner KMMD + ASS) di engine approval
- Logika pengambilan Owner KMMD dari tabel mapping (Fitur B)
- Pengiriman email notifikasi ke Owner KMMD
- Auto-approve untuk ASS
- Pencatatan riwayat di approval history
- Validasi mapping Owner KMMD saat Save

**Out of Scope:**
- Perubahan alur approval untuk modul selain Klaim
- Approval via mobile application
- Eskalasi otomatis jika Owner KMMD tidak merespons dalam X hari (fase berikutnya)

**Dependensi:**
- Fitur B (Form Master ASS/Owner KMMD) harus selesai terlebih dahulu
- Konfigurasi SMTP untuk pengiriman email
- Data pegawai Owner KMMD dan ASS tersedia di sistem

---

### A.4 Validasi Faktur Pajak dan PPN

**UReq ID:** KDS-KLAIM-004

**Deskripsi:**
Sebagai Admin KMMD, saya ingin sistem mencegah saya menyimpan atau mengsubmit klaim jika ada ketidakkonsistenan antara data Faktur Pajak dan PPN di baris detail, agar data pajak yang masuk ke sistem selalu valid dan konsisten.

**Acceptance Criteria:**

| ID  | Kriteria                                                                                          | Jenis      |
|-----|---------------------------------------------------------------------------------------------------|------------|
| AC-01 | Saat Save atau Submit: jika tarif PPN dipilih (tidak 0%), maka Faktur Pajak No wajib ada       | Validation |
| AC-02 | Saat Save atau Submit: jika tarif PPN dipilih (tidak 0%), maka Faktur Pajak Date wajib ada     | Validation |
| AC-03 | Saat Save atau Submit: jika Faktur Pajak No diisi, maka tarif PPN harus dipilih (tidak 0%)     | Validation |
| AC-04 | Saat Save atau Submit: jika Faktur Pajak Date diisi, maka tarif PPN harus dipilih (tidak 0%)   | Validation |
| AC-05 | Pesan error ditampilkan dengan menyebut nomor baris yang bermasalah                             | UI         |
| AC-06 | Baris yang gagal validasi ditandai dengan highlight/border merah di grid                        | UI         |
| AC-07 | Jika validasi gagal, proses Save atau Submit dibatalkan sampai data diperbaiki                  | Functional |
| AC-08 | Baris dengan PPN = 0% dan Faktur Pajak kosong tidak dianggap error (kondisi valid)              | Validation |

**In Scope:**
- Validasi sisi client (JavaScript) di grid detail sebelum request ke server
- Validasi sisi server (Controller/BL) sebagai double-check
- Pesan error yang informatif per baris

**Out of Scope:**
- Validasi nomor faktur pajak ke API DJP (e-Faktur) secara real-time

**Dependensi:**
- Tidak ada dependensi spesifik — dapat dikerjakan independen

---

### A.5 Penyesuaian Periode BosNet

**UReq ID:** KDS-KLAIM-005

**Deskripsi:**
Sebagai tim IT, saya ingin data klaim yang di-push dari BosNet menggunakan periode quartal sesuai periode asli BosNet, agar tidak terjadi mismatch data antara periode di BosNet dan di KICAO KDS.

**Acceptance Criteria:**

| ID  | Kriteria                                                                                              | Jenis       |
|-----|-------------------------------------------------------------------------------------------------------|-------------|
| AC-01 | Klaim dengan source doc = BOSNET: Period From diisi dengan tanggal awal quartal dari BosNet       | Functional  |
| AC-02 | Klaim dengan source doc = BOSNET: Period To diisi dengan tanggal akhir quartal dari BosNet        | Functional  |
| AC-03 | Klaim dengan source doc = PORTAL KDS: Period From dan Period To tidak berubah (perilaku existing) | Functional  |
| AC-04 | Data historis klaim BosNet yang sudah ada tidak terpengaruh (perubahan hanya untuk data baru)     | Data        |

**In Scope:**
- Modifikasi logic parsing Period From/To pada proses penerimaan push dari BosNet
- Mapping periode quartal BosNet ke tanggal awal/akhir quartal

**Out of Scope:**
- Perubahan API atau sistem BosNet
- Migrasi/koreksi data historis

**Dependensi:**
- Konfirmasi format data periode yang dikirim BosNet (field name dan format tanggal)

---

## FITUR B — Menu Form Master ASS/Owner KMMD

**UReq ID:** KDS-MASTER-001

**Deskripsi:**
Sebagai Admin Sistem, saya ingin memiliki form master untuk mendefinisikan mapping antara Supplier Subdistributor (berdasarkan Group Account dan Supplier) dengan ASS dan Owner KMMD per site/branch, agar sistem approval klaim dapat menemukan pihak yang tepat untuk dinotifikasi dan melakukan approval.

**Acceptance Criteria:**

| ID  | Kriteria                                                                                              | Jenis       |
|-----|-------------------------------------------------------------------------------------------------------|-------------|
| AC-01 | Form master menampilkan header: Group Account, Supplier, Owner KMMD                                | UI          |
| AC-02 | Form master menampilkan detail grid: Site, Branch, ASS, Region, Tipe Distributor                   | UI          |
| AC-03 | User dapat menambahkan baris detail dengan tombol "Add Row"                                        | Functional  |
| AC-04 | User dapat menyimpan data dengan tombol "Save"                                                     | Functional  |
| AC-05 | User dapat menghapus baris detail dengan tombol "Delete"                                           | Functional  |
| AC-06 | User dapat mencari data dengan filter Group Account atau Supplier                                  | Functional  |
| AC-07 | Kombinasi Group Account + Supplier harus unik (tidak boleh duplikat di header)                     | Validation  |
| AC-08 | Field Owner KMMD dan ASS menggunakan LOV pegawai dari master user                                 | UI          |
| AC-09 | Data yang tersimpan dapat diambil oleh fitur A.3 (approval) untuk notifikasi email               | Integration |

**In Scope:**
- Form master baru dengan layout Header + Detail (mengacu UI KAM Supplier)
- CRUD: Create, Read, Update, Delete
- Fitur pencarian (Find)
- LOV untuk Owner KMMD dan ASS dari master user/pegawai
- Validasi uniqueness Group Account + Supplier

**Out of Scope:**
- Import bulk data dari Excel (fase berikutnya)
- Riwayat perubahan data (audit log per record) — menggunakan audit standard sistem

**Dependensi:**
- Data user/pegawai Owner KMMD dan ASS tersedia di tabel master user (XXSHP_KDS_M_USER atau HRESS)
- Desain tabel baru atau perluasan tabel existing dikonfirmasi DBA

---

## FITUR C — Menu Report

### C.1 Report Claim Outstanding (Aging Invoice)

**UReq ID:** KDS-REPORT-001

**Deskripsi:**
Sebagai RSM atau CF, saya ingin melihat laporan klaim yang belum dilengkapi nomor invoice beserta informasi aging-nya, agar saya dapat melakukan follow-up kepada distributor yang data klaimnya masih belum lengkap.

**Acceptance Criteria:**

| ID  | Kriteria                                                                                        | Jenis       |
|-----|-------------------------------------------------------------------------------------------------|-------------|
| AC-01 | Report menampilkan baris detail klaim yang TXT_INVOICE_NO-nya kosong atau NULL              | Functional  |
| AC-02 | Report tidak menampilkan klaim berstatus CLOSED atau REJECTED                               | Functional  |
| AC-03 | Kolom Aging (hari) dihitung dari tanggal pembuatan klaim hingga hari ini                    | Functional  |
| AC-04 | User dapat memfilter report berdasarkan range tanggal pembuatan klaim                       | Functional  |
| AC-05 | User dapat memfilter report berdasarkan Group Account                                       | Functional  |
| AC-06 | User dapat memfilter report berdasarkan Supplier                                            | Functional  |
| AC-07 | Report dapat diekspor ke Excel                                                              | Functional  |
| AC-08 | Report ditampilkan dalam halaman web dengan pagination                                      | UI          |

**In Scope:**
- Halaman report baru di menu Reporting > Transaction
- Query data dengan kriteria invoice kosong dan status aktif
- Kalkulasi aging hari
- Filter parameter
- Export ke Excel

**Out of Scope:**
- Notifikasi otomatis ke distributor (fase berikutnya)
- Dashboard grafik aging (fase berikutnya)

---

### C.2 Report Claim to Payment

**UReq ID:** KDS-REPORT-002

**Deskripsi:**
Sebagai CF, saya ingin melihat laporan klaim yang sudah dalam proses payment, lengkap dengan informasi Status Payment, Paid Date, Bank, dan nilai DPP+PPN, agar saya dapat melakukan rekonsiliasi pembayaran klaim.

**Acceptance Criteria:**

| ID  | Kriteria                                                                                        | Jenis       |
|-----|-------------------------------------------------------------------------------------------------|-------------|
| AC-01 | Report menampilkan baris detail klaim yang TXT_INVOICE_NO-nya sudah terisi                  | Functional  |
| AC-02 | Report menampilkan kolom DPP+PPN = Invoice Amount + PPN Amount                              | Functional  |
| AC-03 | Report menampilkan kolom Status Payment, Paid Date, dan Bank                                | Functional  |
| AC-04 | User dapat memfilter berdasarkan range tanggal payment atau klaim                           | Functional  |
| AC-05 | User dapat memfilter berdasarkan Group Account, Supplier, dan Status Payment               | Functional  |
| AC-06 | Report dapat diekspor ke Excel                                                              | Functional  |
| AC-07 | Report ditampilkan dalam halaman web dengan pagination                                      | UI          |

**In Scope:**
- Halaman report baru di menu Reporting > Transaction
- Query data dengan kriteria invoice sudah terisi
- Kalkulasi DPP+PPN
- Filter parameter
- Export ke Excel

**Out of Scope:**
- Rekonsiliasi otomatis dengan sistem payment eksternal

---

## FITUR D — Menu RFP/RFS: Merge PDF Lampiran

**UReq ID:** KDS-RFPRFS-001

**Deskripsi:**
Sebagai CF, saya ingin semua lampiran klaim digabungkan menjadi satu file PDF secara otomatis ketika saya melakukan push ke SMART, agar proses pengiriman dokumen lebih efisien dan SMART hanya menerima satu file lampiran per transaksi.

**Acceptance Criteria:**

| ID  | Kriteria                                                                                        | Jenis       |
|-----|-------------------------------------------------------------------------------------------------|-------------|
| AC-01 | Saat user klik "Push to SMART", sistem mengambil 3 lampiran: Kwitansi, Surat Pengantar, Laporan BosNet | Functional |
| AC-02 | Sistem menggabungkan 3 lampiran tersebut menjadi 1 file PDF                                 | Functional  |
| AC-03 | Urutan halaman dalam PDF gabungan: Kwitansi -> Surat Pengantar -> Laporan BosNet            | Functional  |
| AC-04 | Nama file PDF gabungan: [DocNo]_Lampiran_SMART_[YYYYMMDD].pdf                              | Functional  |
| AC-05 | File PDF gabungan tersimpan di server dan dapat di-download ulang                           | Functional  |
| AC-06 | Proses merge selesai sebelum dokumen di-push ke SMART                                      | Functional  |
| AC-07 | Jika salah satu lampiran tidak tersedia, sistem menampilkan error dan membatalkan push      | Validation  |
| AC-08 | Merge PDF selesai dalam waktu maksimal 30 detik                                             | Performance |

**In Scope:**
- Modifikasi proses Push to SMART di modul RFP/RFS
- Logic merge 3 PDF menjadi 1 file
- Penyimpanan file PDF di server
- Download ulang file PDF

**Out of Scope:**
- Perubahan pada sistem SMART
- Merge lebih dari 3 lampiran (jika ada lampiran tambahan, diurus di iterasi berikutnya)

**Dependensi:**
- Library PDF merge di server (contoh: iTextSharp atau PdfSharp)
- Ketiga lampiran (Kwitansi, Surat Pengantar, Laporan BosNet) sudah tersedia dalam format PDF sebelum push
- Konfirmasi bahwa API SMART menerima single PDF file

---

## Ringkasan Scope per Fitur

| UReq ID          | Fitur                                    | Kompleksitas | Estimasi Scope |
|------------------|------------------------------------------|--------------|----------------|
| KDS-KLAIM-001    | Tambah kolom payment di detail klaim     | Medium       | 3-5 hari       |
| KDS-KLAIM-002    | Generate E-Materai PDF                   | High         | 7-10 hari      |
| KDS-KLAIM-003    | Pembaruan alur approval                  | High         | 7-10 hari      |
| KDS-KLAIM-004    | Validasi Faktur Pajak dan PPN            | Low          | 2-3 hari       |
| KDS-KLAIM-005    | Penyesuaian periode BosNet               | Low          | 1-2 hari       |
| KDS-MASTER-001   | Form Master ASS/Owner KMMD               | Medium       | 5-7 hari       |
| KDS-REPORT-001   | Report Claim Outstanding                 | Medium       | 3-5 hari       |
| KDS-REPORT-002   | Report Claim to Payment                  | Medium       | 3-5 hari       |
| KDS-RFPRFS-001   | Merge PDF Push to SMART                  | Medium       | 3-5 hari       |

> **Total Estimasi:** 34–52 hari kerja (belum termasuk UAT dan bug fixing)

---

## Urutan Prioritas Pengerjaan

Berdasarkan dependensi antar fitur, urutan pengerjaan yang direkomendasikan:

```
Fase 1 (Fondasi):
  [1] KDS-KLAIM-004 — Validasi PPN/Faktur Pajak (tanpa dependensi)
  [2] KDS-KLAIM-005 — Penyesuaian periode BosNet (tanpa dependensi)
  [3] KDS-MASTER-001 — Form Master ASS/Owner KMMD (diperlukan oleh A.3)

Fase 2 (Core Feature):
  [4] KDS-KLAIM-001 — Tambah kolom payment (diperlukan oleh Report C.2)
  [5] KDS-KLAIM-003 — Pembaruan alur approval (memerlukan Master B)
  [6] KDS-KLAIM-002 — Generate E-Materai PDF (diperlukan oleh D)

Fase 3 (Report dan Integrasi):
  [7] KDS-REPORT-001 — Report Claim Outstanding
  [8] KDS-REPORT-002 — Report Claim to Payment (memerlukan kolom payment dari A.1)
  [9] KDS-RFPRFS-001 — Merge PDF Push to SMART (memerlukan PDF dari A.2)
```

---

## Definisi Selesai (Definition of Done)

Sebuah fitur dinyatakan **selesai** jika memenuhi semua kondisi berikut:

1. Semua Acceptance Criteria terpenuhi dan diverifikasi oleh QA
2. Tidak ada bug dengan severity Critical atau High yang belum tertutup
3. Unit test telah dibuat dan passed untuk logic bisnis utama
4. Kode telah di-review dan di-merge ke branch development
5. Dokumentasi teknis (data model, API endpoint, flow) telah diperbarui
6. User Acceptance Testing (UAT) telah dilakukan dan sign-off diterima dari business owner

---

*Dokumen ini adalah draft awal. Setiap Acceptance Criteria dapat direvisi berdasarkan hasil diskusi lebih lanjut dengan pemangku kepentingan bisnis.*

