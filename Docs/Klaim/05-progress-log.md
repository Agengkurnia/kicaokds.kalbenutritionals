# Modul Klaim — Progress Log (Living Document)

> **TUJUAN DOKUMEN INI**  
> Dokumen ini adalah **sumber kebenaran tunggal** untuk status prototype Form Klaim di repo `kicaokds.kalbenutritionals`.  
> Ditulis sedetail mungkin agar developer **atau AI agent** yang belum pernah melihat codebase bisa melanjutkan pekerjaan tanpa menebak-nebak.

> **Terakhir diperbarui:** 25 Juni 2026  
> **Acuan bisnis enhancement:** `Docs/BRD-KICAO-KDS-Enhancement.md`  
> **Status keseluruhan prototype Klaim:** ✅ Fitur inti + enhancement BRD bagian A & B sudah diimplementasi di HTML mock. ❌ Bagian C (Report) dan D (RFP/RFS merge PDF) **belum** dikerjakan.

---

## 0. Panduan Cepat untuk AI Agent

### 0.1 Apa ini?

Ini **bukan** aplikasi production MVC. Ini **prototype statis HTML + JavaScript** yang meniru UI/UX aplikasi live **KICAO KDS** (`KICAO KDS/KN2022_KCO_KDS.MVC`).

- Tidak ada backend / API nyata.
- Data disimpan di **`sessionStorage`** browser (bukan database).
- Modal, layout sidebar, dan login dipakai bersama lewat `Scripts/layout.js`.

### 0.2 File mana yang harus dibuka?

| File | Peran |
|------|-------|
| `Views/Klaim/Index.html` | **Halaman utama Form Klaim** — semua logika bisnis utama ada di `<script>` inline di file ini |
| `Scripts/customs/prototype/klaim-prototype.js` | Helper shared: `klaimGetData()`, `klaimSetData()`, `klaimCleanNumber()`, storage key |
| `Scripts/layout.js` | Sidebar menu, login guard, `showKlaimModal()` / `hideKlaimModal()`, fix jQuery/bootbox |
| `Views/Klaim/Umbrand.html` | Popup alokasi Umbrand (iframe modal) |
| `Views/Klaim/Brand.html` | Popup alokasi Brand |
| `Views/Klaim/SKU.html` | Popup alokasi SKU |
| `Views/Klaim/ScanFakturPajak.html` | Popup scan faktur pajak |
| `Views/Master/AssOwnerKMMD/Index.html` | **Form master baru** mapping ASS & Owner KMMD (enhancement BRD bagian B) |
| `Docs/BRD-KICAO-KDS-Enhancement.md` | BRD resmi kebutuhan enhancement |
| `Docs/Klaim/01-overview.md` sampai `04-prototype-mapping.md` | Dokumentasi modul asli (pre-enhancement) |

### 0.3 Storage — JANGAN SALAH BACA

- **Session (dokumen aktif):** key `klaimPrototypeData` — `klaimGetData()` / `klaimSetData()` di `klaim-prototype.js`
- **Persistent (registry mock DB):** `localStorage` via `Scripts/customs/prototype/proto-store.js`
  - `kds_proto_klaim_registry` — semua klaim + approval history
  - `kds_proto_ass_owner_registry` — mapping ASS/Owner KMMD
  - `kds_proto_active_claim_id` — id klaim terbuka (resume setelah refresh)
- **Load halaman:** `bootstrapKlaimPageOnLoad()` — **tidak** reset session; resume dari `?claimId=` atau active claim id
- **Sinkronisasi:** `syncToStorage()` → sessionStorage; `persistActiveClaimToRegistry()` → localStorage registry

### 0.4 Penanda visual field baru (PENTING)

Semua kolom/fitur **enhancement BRD Jun 2026** ditandai di UI dengan:

- Badge oranye **`NEW`** — class CSS: `.proto-new-badge`
- Background krem pada sel input — class: `.proto-new-cell`
- Garis oranye di header kolom — class: `.proto-new-header`
- Legenda di atas grid detail Klaim menjelaskan arti badge

**Jangan hapus penanda ini** kecuali user meminta — dipakai untuk review dengan bisnis.

### 0.5 Yang SUDAH selesai vs BELUM

| ID BRD | Fitur | Status | Lokasi implementasi |
|--------|-------|--------|---------------------|
| A.1 | Kolom payment + DPP+PPN di grid detail | ✅ Selesai | `Index.html` — kolom setelah **Include** |
| A.2 | Tombol E-Materai + generate PDF mock | ✅ Selesai (mock jsPDF, bukan Excel template asli) | `Index.html` — `handleEMaterai()` |
| A.3 | Approval upgrade (Owner KMMD, ASS auto) | ✅ Simulasi UI + registry history | `handleOwnerApprove()`, `handleApprovalHistory()` |
| A.4 | Validasi silang PPN ↔ Faktur Pajak | ✅ Selesai | `validateKlaimInput()` |
| A.5 | BosNet period quartal | ✅ Selesai (mock Find) | `loadClaimFromFind()`, `getBosnetQuarterPeriod()` |
| B | Form Master ASS/Owner KMMD | ✅ Selesai | `Views/Master/AssOwnerKMMD/Index.html` |
| C.1 | Report Claim Outstanding | ❌ Belum | — |
| C.2 | Report Claim to Payment | ❌ Belum | — |
| D | RFP/RFS merge PDF ke SMART | ❌ Belum | — |

---

## 1. Arsitektur Runtime (Alur saat halaman dibuka)

```
User buka Index.html
    → layout.js init() cek login (localStorage kds_logged_in)
    → render sidebar + content
    → dispatch event 'layoutReady'
    → Index.html listener:
         $('.modal').appendTo('body')
         bootstrapKlaimPageOnLoad()   // resume active claim / ?claimId= / session / blank
```

### 1.1 Variabel state penting di `Index.html`

```javascript
let detailRows = [];           // Array objek baris detail — sumber kebenaran grid
let claimFormState = {         // Mirror flag production BIT_APPLY dll.
    BIT_APPLY: 'N',
    BIT_APPROVED: 'N',
    BIT_REJECTED: 'N',
    BIT_CLOSED: 'N',
    TXT_STATUSFLOW: 'NEW'      // Ditampilkan di #lblStatusFlow
};
let claimLoadedFromFind = false;  // true setelah pilih dari Find LOV
let validationErrorRows = [];     // Index baris yang gagal validasi PPN (border merah)
```

### 1.2 Objek satu baris detail (`detailRows[i]`)

| Property JS | Field DB (production) | Keterangan |
|-------------|----------------------|------------|
| `activity` | `TXT_ACTIVITY` | Kosong saat Add Detail (bukan default ACT-KCO-01) |
| `programDesc` | `TXT_PROGRAM_DESC` | |
| `periodFrom` | `DTM_PERIOD_FROM` | Format tampilan: `DD-MMM-YYYY` |
| `periodTo` | `DTM_PERIOD_TO` | |
| `invoiceNo` | `TXT_INVOICE_NO` | |
| `invoiceDate` | `DTM_INVOICE` | |
| `fakturNo` | `TXT_FKT_PJK_NO` | |
| `fakturDate` | `DTM_FKT_PJK` | |
| `invoiceAmount` | `DEC_INVOICE_AMT` | Number |
| `pphType` | `TXT_PPH_JENIS` | |
| `pphTarif` | `DEC_PERSEN_PPH` | |
| `ppnType` | `TXT_PPNTAXRATE_CODE` | Contoh: `NON PPN`, `PPN 11%` |
| `ppnTarif` | `DEC_PPN_PERCENTAGE` | |
| `ppnAmount` | `DEC_PPN` | |
| `allBrand` | `BIT_ALLBRAND` | Boolean |
| `umbrandData` | `XXSHP_KDS_T_KLAIM_UMB` | Array alokasi |
| `status` | `TXT_STATUSKLAIM` | |
| `description` | `TXT_STATUS_DESC` | |
| `include` | `BIT_INCLUDE` | Boolean — dipakai hitung grand total & E-Materai |
| `attachmentName` | `XXSHP_KDS_T_KLAIM_DTL_ATT` | Nama file mock |
| **`paymentStatus`** | **`TXT_PAYMENT_STATUS`** | **BARU** — `PENDING` / `PAID` / `CANCELLED` |
| **`paidDate`** | **`DTM_PAID_DATE`** | **BARU** |
| **`bank`** | **`TXT_BANK_NAME`** | **BARU** — dari `paymentBankOptions` |
| *(kalkulasi)* | *(tidak disimpan terpisah)* | **DPP+PPN** = `invoiceAmount + ppnAmount` — hanya tampilan |

---

## 2. Grid Detail — Struktur Kolom (urutan kiri ke kanan)

Total **28 kolom** (empty state `colspan="28"`).

| # | Kolom | Baru? | Catatan |
|---|-------|-------|---------|
| 1 | No | | |
| 2 | Activity | | LOV merah, default kosong |
| 3 | Program Desc | | |
| 4 | Period From | | |
| 5 | Period To | | BosNet = quartal jika source BOSNET |
| 6 | Invoice No | | |
| 7 | Invoice Date | | |
| 8 | Faktur Pajak No | | + tombol scan barcode |
| 9 | Faktur Pajak Date | | |
| 10 | Invoice Amount | | |
| 11 | PPH Type | | LOV |
| 12 | Tarif PPH(%) | | Readonly |
| 13 | PPH Amount | | Readonly |
| 14 | Final Amount | | Readonly = Invoice - PPH |
| 15 | PPN Type | | Dropdown |
| 16 | PPN Amount | | |
| 17 | Total Amount | | Readonly = Final + PPN |
| 18 | All Brand | | Checkbox |
| 19 | Umbrand | | Tombol jika All Brand unchecked |
| 20 | Attachment | | Upload mock |
| 21 | Delete | | |
| 22 | Status | | Dropdown detail |
| 23 | Description | | |
| 24 | Include | | Checkbox — mempengaruhi grand total |
| **25** | **Status Payment** | **✅ NEW** | Dropdown, editable jika `canEditPaymentFields()` |
| **26** | **Paid Date** | **✅ NEW** | Datepicker |
| **27** | **Bank** | **✅ NEW** | Dropdown: BCA, MANDIRI, BNI, BRI, CIMB |
| **28** | **DPP+PPN** | **✅ NEW** | Readonly, badge NEW |

### 2.1 Kapan kolom payment bisa diedit?

Fungsi: `canEditPaymentFields()`

```javascript
return claimFormState.BIT_APPROVED === 'Y' && claimFormState.BIT_CLOSED !== 'Y';
```

Artinya: **simulasi role CF** — setelah klaim status APPROVED (bukan CLOSED), kolom payment aktif.  
`setDetailFieldsDisabled(true)` tetap mengunci kolom lain, tapi **mengecualikan** `.ddlPaymentStatus`, `.txtPaidDate`, `.ddlBank`.

---

## 3. Tombol Header Form Klaim

| Tombol | ID | Fungsi | Catatan |
|--------|-----|--------|---------|
| Find | `btnFind` | `handleFind()` | Buka `#lovFindModal`, isi dari array `findData` |
| Save | `btnSave` | `handleSave()` | Panggil `validateKlaimInput(false)` dulu |
| New | `btnNew` | `handleNew()` | Konfirmasi → `initiateBlankForm()` |
| Submit | `btnSubmit` | `handleSubmit()` | Panggil `validateKlaimInput(true)` + simulasi approval upgrade |
| **E-Materai** | **`btnEMaterai`** | **`handleEMaterai()`** | **BARU** — badge NEW |
| Print | `btnPrintout` | `handlePrint()` | Mock |
| View Memo | `btnViewMemo` | `handleViewMemo()` | Mock preview |
| Approval History | `btnApprovalHistory` | `handleApprovalHistory()` | Tampil jika sudah apply/approved |
| Close / Reject / Copy | | | Hidden kecuali kondisi tertentu |

### 3.1 Tombol E-Materai — aturan aktif

Konstanta: `EMATERAI_THRESHOLD = 5000000` (Rp 5 juta)

Fungsi: `updateEMateraiButton()` — dipanggil dari `renderTable()` dan `enableKlaimControls()`

**Tombol ENABLED jika:**
1. Total grand dari baris `include === true` >= 5.000.000  
   (rumus per baris: `(invoiceAmount - PPH) + ppnAmount`, sama seperti label grand total)
2. Status dokumen minimal DRAFT (termasuk `APPROVE 1 - DRAFT`, `APPROVE 2 - DRAFT`, `SUBMITTED`, `APPROVED`)

**Saat diklik:** `handleEMaterai()`
- Load jsPDF dari CDN: `cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js`
- Generate **1 file PDF 2 halaman:**
  - Halaman 1: **Kwitansi Standar** (mock — referensi template Excel `170914 Kwitansi Standard SHP Sep 17.xlsx`)
  - Halaman 2: **Surat Pengantar Klaim** (tabel activity + invoice + DPP+PPN)
- Nama file: `EMaterai_{DocNo}_{YYYYMMDD}.pdf`
- **Batasan prototype:** Bukan render Excel asli; hanya teks mock di PDF.

**Data uji Find yang memenuhi threshold:**
- `5192` — `26.03/KLAIM-BOS/001` — Rp 6.500.000 — BOSNET DRAFT
- `5187` — Rp 2.500.002 — E-Materai aktif jika include (perlu cek total dengan PPN)
- `5186` — Rp 6.000.000 — APPROVED + payment data

---

## 4. Lifecycle Form (mirror production `klaimscript.js`)

### 4.1 Fungsi-fungsi inti

| Fungsi prototype | Production equivalent | Deskripsi |
|------------------|----------------------|-----------|
| `initiateBlankForm()` | `p_initiateData()` / `p_showBlank()` | Reset semua field, `detailRows=[]`, status NEW |
| `loadClaimFromFind(item)` | `p_txtID_TextChanged()` → `p_DataToUI()` | Isi form dari objek `findData[i]` |
| `selectFindByIndex(index)` | LOV callback | Tutup modal → `loadClaimFromFind(findData[index])` |
| `enableKlaimControls()` | `p_EnableControl()` | Show/hide Save, Submit, LOV, Add Detail |
| `handleAddDetail()` | `p_AddRow()` | Push baris baru; **activity kosong** |
| `validateKlaimInput(isSubmit)` | `ValidateInput` di BL | Validasi Save/Submit |
| `hideModal()` | — | Wrapper ke `hideKlaimModal()` + cleanup backdrop |

### 4.2 State machine `TXT_STATUSFLOW`

```
NEW  →  (Save)  →  DRAFT
DRAFT  →  (Submit + validasi)  →  APPROVE 1 - DRAFT  →  (simulasi alert)  →  APPROVE 2 - DRAFT
Find load APPROVED  →  BIT_APPROVED=Y, field read-only kecuali payment
Find load CLOSED  →  BIT_CLOSED=Y
```

Flag `claimFormState` mengontrol tombol:

- `BIT_APPLY='Y'` → sudah pernah submit/apply → LOV header disembunyikan
- `BIT_APPROVED='Y'` → Save disembunyikan, detail read-only, **payment editable**
- `BIT_REJECTED='Y'` → Save/Submit disembunyikan
- `BIT_CLOSED='Y'` → tampilkan `#divClose`

### 4.3 Bug yang pernah diperbaiki (jangan regressi)

1. **Tombol Find/Save/New mati setelah Find** — penyebab: backdrop modal tidak dibersihkan. Fix: `hideKlaimModal()` + `cleanupModalBackdrops()` di `layout.js`.
2. **Bootbox transparan** — penyebab: jQuery lama timpa `$.fn.modal`. Fix: proteksi plugin Bootstrap di `layout.js`.
3. **Find modal tertutup backdrop** — penyebab: z-index backdrop global terlalu tinggi. Fix: z-index scoped untuk LOV modal.

---

## 5. Enhancement BRD — Detail Implementasi

### 5.1 A.1 Kolom Payment (SELESAI)

**BRD:** Tambah `TXT_PAYMENT_STATUS`, `DTM_PAID_DATE`, `TXT_BANK_NAME`, kolom kalkulasi DPP+PPN.

**Implementasi:**
- Header tabel: 4 kolom setelah Include (lihat §2)
- `renderTable()` render dropdown/input dengan class `proto-new-cell`
- `syncToStorage()` map ke field DB mock di objek `XXSHP_KDS_T_KLAIM_DTL`
- `syncFromStorage()` baca balik `paymentStatus`, `paidDate`, `bank`
- `handleAddDetail()` inisialisasi: `paymentStatus:''`, `paidDate:''`, `bank:''`
- `loadClaimFromFind()` baca `item.paymentStatus`, `item.paidDate`, `item.bank` jika ada di `findData`

### 5.2 A.2 E-Materai (SELESAI — mock)

Lihat §3.1.

### 5.3 A.3 Approval Upgrade (SELESAI — simulasi)

**Alur baru (ditampilkan di `handleApprovalHistory()`):**

| Urutan | Role | Aksi | Status setelah |
|--------|------|------|----------------|
| 1 | Admin KMMD | Save | Draft |
| 2 | **Owner KMMD** (baru) | Email / Approve | Approve 1 - Draft |
| 3 | **ASS** (baru) | Auto Approve | Approve 2 - Draft |
| 4 | RSM | Ready To Submit | Draft siap submit |
| 5 | CF | Submit | Approved |

**`handleSubmit()` saat ini:**
1. Validasi lengkap + Ready to Submit harus Yes
2. Set status `APPROVE 1 - DRAFT`, `BIT_APPLY='Y'`
3. Bootbox menjelaskan rantai approval
4. Setelah user tutup alert → status menjadi `APPROVE 2 - DRAFT` (simulasi ASS auto-approve)

**Ketergantungan:** Mapping Owner/ASS per supplier → Form Master `AssOwnerKMMD/Index.html`

**Belum diimplementasi (production only):** Email notifikasi, engine K2, role-based button per user login.

### 5.4 A.4 Validasi PPN ↔ Faktur Pajak (SELESAI)

Di dalam `validateKlaimInput()`, per baris detail:

Helper: `rowHasPpn(row)` → true jika `ppnTarif > 0` ATAU `ppnType !== 'NON PPN'`

| Kondisi | Error message |
|---------|---------------|
| `hasPpn` && faktur no kosong | `Baris N: Faktur Pajak No wajib diisi jika PPN tidak 0%` |
| `hasPpn` && faktur date kosong | `Baris N: Faktur Pajak Date wajib diisi jika PPN tidak 0%` |
| (faktur no ATAU date diisi) && !hasPpn | `Baris N: PPN harus diisi (tarif > 0%) jika Faktur Pajak No/Date diisi` |

Saat gagal: `validationErrorRows = [index]` lalu `renderTable()` — baris mendapat class `tr-klaim-validation-error` (border merah).

### 5.5 A.5 BosNet Period Quartal (SELESAI — mock)

**Masalah bisnis:** BosNet push per **quartal**, KICAO KDS input manual per **bulan**.

**Solusi prototype:** Jika `item.source === 'BOSNET'`, field `#txtSourceDoc` = `BOSNET` dan period detail diisi quartal via `getBosnetQuarterPeriod(quarter, year)`.

**Mapping quartal:**

| Quarter | Period From | Period To |
|---------|-------------|-----------|
| Q1 | 01-Jan-{year} | 31-Mar-{year} |
| Q2 | 01-Apr-{year} | 30-Jun-{year} |
| Q3 | 01-Jul-{year} | 30-Sep-{year} |
| Q4 | 01-Oct-{year} | 31-Dec-{year} |

**Record uji di `findData`:**
```javascript
{
  id: '5192',
  dokNo: '26.03/KLAIM-BOS/001',
  source: 'BOSNET',
  bosnetQuarter: 'Q1',
  bosnetYear: 2026,
  invoiceAmount: 6500000,
  status: 'DRAFT',
  ...
}
```

**Add Detail manual** (`handleAddDetail`) tetap pakai period bulanan default: hari ini s/d +30 hari — hanya data **push BosNet** yang pakai quartal.

### 5.6 B. Form Master ASS/Owner KMMD (SELESAI)

**File:** `Views/Master/AssOwnerKMMD/Index.html`  
**Menu:** `Scripts/layout.js` → Master Data → **Form ASS/Owner KMMD** (`#menu-master-ass-owner`)  
**Storage:** `localStorage` key `kds_proto_ass_owner_registry` via `protoUpsertAssOwner()` / `protoGetAssOwnerRegistry()`

**PENTING — bug modal LOV kosong (diperbaiki 26 Jun 2026):**  
Modal `#lovModal` **harus berada di dalam** `<div id="app-content">`. Jika diletakkan di luar, `layout.js` (`renderMainStructure`) hanya mengambil innerHTML `#app-content` sehingga modal hilang dari DOM dan LOV tampil kosong.

**Data LOV yang tersedia (mock, selaras Form Klaim):**

| LOV | Jumlah | Sumber array |
|-----|--------|--------------|
| Group Account | 4 | KMMD, ENSEVAL, BRAVO, RM VI JATENG |
| Supplier | 12 | Filter by group account |
| Owner KMMD | 6 | User ID 2001–2006 |
| ASS | 8 | User ID 3001–3008, filter by region branch |
| Site (detail) | 16 | Filter by supplier ID |
| Find | 6 record | Header + detail mapping lengkap |

**Alur isi form manual:** Group Account → Supplier → Owner KMMD → Add Detail → Site LOV → ASS LOV → Save

---

## 6. Validasi Form Lengkap (`validateKlaimInput`)

Dipanggil sebelum Save (`isSubmit=false`) dan Submit (`isSubmit=true`).

### 6.1 Header

- Group Account wajib
- Supplier Code wajib
- Remark wajib
- Jika Group Account = `ENSEVAL` → Partner wajib
- Jika Ready to Submit = **No** → `txtReasonReadySubmit` wajib
- Minimal 1 baris detail

### 6.2 Per baris detail

- Activity, Program Desc, Invoice No wajib
- Invoice Amount > 0
- Invoice No tidak duplikat (case insensitive)
- Period To >= Period From
- Attachment wajib (mock: `attachmentName` tidak kosong)
- Jika All Brand = false → validasi hierarki Umbrand/Brand/SKU (total amount harus match)
- **Validasi PPN ↔ Faktur** (§5.4)

### 6.3 Khusus Submit (`isSubmit=true`)

- Ready to Submit harus **Yes** (`rdoReadySubmitYes` checked)

---

## 7. Data Mock Find LOV (`findData` array)

Semua record ada di `Index.html` baris ~813. Ringkasan:

| ID | Doc No | Status | Source | Invoice Amt | Payment mock | Kegunaan uji |
|----|--------|--------|--------|-------------|--------------|--------------|
| 5192 | 26.03/KLAIM-BOS/001 | DRAFT | BOSNET | 6.500.000 | — | E-Materai + quartal Q1 |
| 5191 | 26.03/KLAIM-MIM/004 | CLOSED | PORTAL KDS | 80.000 | PAID/BCA | Payment read-only (closed) |
| 5190 | 26.03/KLAIM-MIM/003 | APPROVED | PORTAL KDS | 20.000 | PENDING | Payment editable |
| 5189 | ... | CLOSED | PORTAL KDS | 100.000 | PAID/MANDIRI | |
| 5188 | ... | APPROVED | PORTAL KDS | 100.000 | — | |
| 5187 | ... | APPROVED | PORTAL KDS | 2.500.002 | — | E-Materai threshold |
| 5186 | ... | APPROVED | PORTAL KDS | 6.000.000 | PAID/BNI | E-Materai + payment |

---

## 8. Regulasi Bisnis dari Production (sudah ada sebelum enhancement)

### 8.1 Partner LOV hanya untuk ENSEVAL

- `#btnLOVPartner` tampil **hanya** jika `#txtGroupAccount` = `ENSEVAL`
- Ganti Group Account → reset Partner, Outlet, Branch
- Implementasi: `selectGroupAccount()`, `initiateBlankForm()`

### 8.2 Outlet LOV filter by Group Account

- `openOutletLov()` filter `outletsData` by `group_account`

### 8.3 Ready to Submit UI

- `updateReadySubmitUI()` — jika Yes, sembunyikan & disable `txtReasonReadySubmit`

---

## 9. LOV & Modal — Standar UI

Semua modal LOV memakai:
- Lebar 90%, max 1100px, min-height 550px
- Header hijau `#00a65a`, judul "List Of Value"
- Tombol **Pilih** di kolom pertama (bukan "Select")
- Header tabel pakai `<td>` bukan `<th>` (hindari uppercase CSS global)
- Live search via jQuery `keyup` pada input search di modal
- Buka: `showKlaimModal('#lovXxxModal')` — Tutup: `hideModal('#lovXxxModal')`

Modal yang ada di Klaim Index:
- `#lovGroupAccountModal`
- `#lovPartnerModal`
- `#lovOutletModal`
- `#lovDetailActivityModal`
- `#lovDetailPphTypeModal`
- `#lovFindModal`
- `#klaimPopupModal` (iframe Umbrand/Brand/SKU/Scan)

---

## 10. Riwayat Perubahan Kronologis

| Tanggal | Item | Ringkasan |
|---------|------|-----------|
| Awal | LOV standardisasi | Fancybox-like modal, live search, tombol Pilih |
| Awal | jQuery conflict fix | `layout.js` merge plugin aman |
| Awal | Grid detail kaya | Activity/PPH LOV, kalkulasi PPH/PPN, Umbrand popup |
| 25 Jun 2026 | Validasi Save/Submit | `validateKlaimInput()` |
| 25 Jun 2026 | Bootbox transparan fix | Proteksi Bootstrap modal |
| 25 Jun 2026 | Find backdrop fix | z-index + `showKlaimModal` |
| 25 Jun 2026 | Lifecycle Find/New/Save | `initiateBlankForm`, `loadClaimFromFind`, `enableKlaimControls` |
| 25 Jun 2026 | Add Detail activity kosong | Fix default `ACT-KCO-01` |
| 26 Jun 2026 | Enhancement BRD A.1–A.5 | Payment cols, E-Materai, approval, PPN validasi, BosNet |
| 26 Jun 2026 | Form Master ASS/Owner | `Views/Master/AssOwnerKMMD/Index.html` |
| 26 Jun 2026 | Badge NEW | Penanda visual field/kolom enhancement |

---

## 11. Cara Pengujian — Step by Step (Copy-Paste untuk QA / AI)

### 11.1 Smoke test dasar

1. Login prototype → buka **Transaksi → Form Klaim**
2. Pastikan form kosong (status NEW, grid "No data available")
3. Klik **Find** → pilih record → data ter-load, backdrop hilang, tombol Find/Save/New masih bisa diklik
4. Klik **New** → konfirmasi → form kosong lagi

### 11.2 Uji kolom payment (NEW)

1. **Find** record `5190` (status APPROVED)
2. Scroll grid ke kanan — lihat 4 kolom dengan badge **NEW** (background krem)
3. Ubah Status Payment → PENDING/PAID, isi Paid Date, pilih Bank
4. **Find** record `5191` (CLOSED) — kolom payment harus **disabled**

### 11.3 Uji E-Materai (NEW)

1. **Find** record `5192` (Rp 6.5 jt, BOSNET)
2. Tombol **E-Materai NEW** harus **enabled** (biru, tidak grey)
3. Klik → konfirmasi → PDF ter-download (perlu internet untuk jsPDF CDN)
4. **Find** record dengan amount < 5 jt → tombol E-Materai **disabled**

### 11.4 Uji validasi PPN (NEW)

1. **New** → isi header (Group Account, Remark) → **Add Detail**
2. Isi Activity, Program Desc, Invoice No, Amount, upload attachment mock
3. Set PPN = `PPN 11%` — **kosongkan** Faktur Pajak No
4. Klik **Save** → error + **baris merah**
5. Isi Faktur No & Date → Save berhasil (jika field lain lengkap)

### 11.5 Uji BosNet quartal (NEW)

1. **Find** `5192` (`26.03/KLAIM-BOS/001`)
2. Cek `#txtSourceDoc` = `BOSNET`
3. Cek kolom Period From = `01-Jun-2026`? — harusnya **01-Jan-2026**, Period To = **31-Mar-2026** (Q1 2026)

### 11.6 Uji approval upgrade (NEW)

1. Buat klaim baru, lengkapi, set Ready to Submit = **Yes**
2. **Save** → DRAFT
3. **Submit** → lihat dialog simulasi Owner KMMD + ASS
4. Status berubah ke `APPROVE 2 - DRAFT`
5. Klik **Approval History** (jika tampil) → lihat tabel 5 langkah

### 11.7 Uji Form Master ASS/Owner KMMD (NEW)

1. Menu **Master Data → Form ASS/Owner KMMD**
2. Legenda NEW tampil di atas
3. **Find** → pilih record → header + detail terisi
4. **Add Detail** → pilih Site LOV → ASS LOV → **Save**

### 11.8 Uji ENSEVAL Partner rule (legacy)

1. Group Account = ENSEVAL → tombol Partner muncul
2. Ganti ke KMMD → Partner hilang & ter-reset

---

## 12. Keterbatasan Prototype (JANGAN dikira sudah production)

1. **Tidak ada API backend** — data persisten di `localStorage` (`proto-store.js`), bukan database
2. **sessionStorage** hanya untuk dokumen aktif sedang diedit; registry di `localStorage` bertahan setelah refresh
3. **E-Materai** = PDF mock jsPDF, **bukan** render template Excel asli
4. **Role** via `localStorage kds_active_role` + RBAC prototype — bukan login production
5. **Email / K2 approval** tidak ada — hanya bootbox alert + approval history di registry
6. **Report** Outstanding & Claim to Payment belum ada
7. **RFP/RFS merge PDF ke SMART** belum ada
8. **Attachment** upload tidak benar-benar menyimpan file ke server
9. jsPDF membutuhkan **koneksi internet** saat pertama generate
10. **Master ASS/Owner** form terhubung ke `proto-store` (`kds_proto_ass_owner_registry`) — perubahan Save di Master langsung dipakai lookup Owner/ASS di Form Klaim

---

## 13. Jika AI Agent Diminta Melanjutkan Pekerjaan

### 13.1 Tambah kolom detail baru

1. Tambah `<td>` header di `#dtDetail` thead (setelah kolom yang relevan)
2. Tambah property di `handleAddDetail()`, `loadClaimFromFind()`, `syncToStorage()`, `syncFromStorage()`
3. Render di `renderTable()` — update `colspan` empty state
4. Tambah badge `.proto-new-badge` jika kolom enhancement
5. Update dokumen ini

### 13.2 Tambah record Find mock

Edit seed `KDS_PROTO_SEED_KLAIM` di `Scripts/customs/prototype/proto-store.js`, atau Save klaim baru lewat form (otomatis masuk registry).

### 13.3 Jangan rusak

- `hideKlaimModal` / backdrop cleanup
- `validateKlaimInput` harus tetap dipanggil di Save/Submit
- Activity kosong saat Add Detail
- `selectFindByClaimId` (bukan index array statis)
- `persistActiveClaimToRegistry()` setelah workflow Save/Approve/Submit

### 13.4 Production reference (repo KICAO KDS)

| Topik | File production |
|-------|-----------------|
| Script klaim | `KN2022_KCO_KDS.MVC/Scripts/customs/transactions/klaim/klaimscript.js` |
| View Index | `KN2022_KCO_KDS.MVC/Views/Klaim/Index.cshtml` |
| Validasi BL | `clsXXSHP_KCO_T_KLAIM_HDRBL.cs` |
| KAM Supplier (referensi UI master) | `Views/KAMSupplier/Index.cshtml` |
| Assign Supplier KAM (referensi layout) | `Views/AssignSupplier/Index.cshtml` |

---

## 14. Dokumen Terkait

- `Docs/Klaim/README.md` — index dokumentasi modul
- `Docs/Klaim/01-overview.md` — overview layar & workflow asli
- `Docs/Klaim/02-data-model.md` — entitas HDR/DTL/UMB (belum di-update untuk field payment — **perlu update terpisah jika AI menyentuh data model**)
- `Docs/Klaim/04-prototype-mapping.md` — pemetaan MVC → HTML
- `Docs/Klaim/06-data-integration-plan.md` — rencana integrasi data persisten (Task 1–9)

---

*Akhir dokumen. Perbarui bagian §0.5, §10, dan §11 setiap ada perubahan signifikan pada prototype.*
