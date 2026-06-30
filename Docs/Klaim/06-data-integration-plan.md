# Prototype Data Integration — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` (recommended) or `superpowers:executing-plans` to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Membuat data prototype KICAO KDS **persisten, saling terhubung, dan konsisten** antar Form Klaim, Find LOV, popup detail, Master ASS/Owner KMMD, dan workflow RBAC — tanpa backend ASP.NET (tetap static HTML/JS).

**Architecture:** Satu lapisan **Prototype Store** (`localStorage`) sebagai “database mock” + `sessionStorage` hanya untuk **dokumen aktif sedang diedit** dan sinkron popup iframe. Semua Save/Submit/workflow menulis ke registry; Find membaca registry; approval Owner lookup dari Master ASS/Owner.

**Tech Stack:** Vanilla JS, `localStorage` / `sessionStorage`, existing `klaim-prototype.js`, `rbac-prototype.js`, `layout.js`, Bootstrap modals, bootbox.

## Global Constraints

- Tetap **tanpa backend** — tidak menambah API MVC ke production dalam fase ini.
- **Jangan hapus** badge `.proto-new-badge` dan kolom enhancement BRD tanpa permintaan eksplisit.
- Status workflow mengikuti mapping terbaru: `DRAFT` → `DRAFT WITH 2 APPROVE` → `DRAFT WITH 3 APPROVE` → `APPROVED`.
- RBAC tetap via `localStorage kds_active_role` + `rbac-prototype.js`.
- Pola modal LOV **harus tetap di dalam** `#app-content` (pitfall layout.js).
- Seed data awal harus tetap tersedia setelah first load (migrate dari `findData` hardcoded).

---

## Ringkasan Masalah Saat Ini

| Masalah | Dampak |
|---------|--------|
| `sessionStorage` di-reset tiap buka halaman Klaim | Save hilang setelah refresh |
| `findData[]` hardcoded di `Index.html` | Find tidak menampilkan klaim yang baru disimpan |
| Master ASS/Owner storage terpisah | Owner approve tidak pakai mapping nyata |
| Approval history hanya `bootbox` mock | Tidak ada jejak audit antar role |
| Workflow tidak update registry | Ganti role / Find tidak melihat perubahan status |

---

## Target Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                    proto-store.js                           │
│  localStorage:                                              │
│    kds_proto_klaim_registry      → ClaimRecord[]            │
│    kds_proto_ass_owner_registry  → AssOwnerRecord[]         │
│    kds_proto_meta                → { seeded, schemaVersion }  │
│  sessionStorage:                                            │
│    klaimPrototypeData            → dokumen aktif (editing)  │
│    kds_proto_active_claim_id     → id klaim terbuka         │
└─────────────────────────────────────────────────────────────┘
         ▲                    ▲                    ▲
         │                    │                    │
   Index.html          AssOwnerKMMD/Index    Umbrand/Brand/SKU
   Save/Find/Workflow      Save/Find         (popup via session)
```

### Skema `ClaimRecord`

```javascript
{
  id: '5196',                          // INT_KLAIM_HDR_ID
  dokNo: '26.03/KLAIM-MIM/007',
  updatedAt: '2026-06-29T10:00:00.000Z',
  findSummary: {
    site: '...',
    description: '...',
    period: '01-MAR-26 - 31-MAR-26',
    invoiceNo: 'INV-001',
    invoiceAmount: 100000,
    status: 'DRAFT',                   // TXT_STATUSFLOW
    attachment: 'Yes',
    readyToSubmit: 'No',
    source: 'PORTAL KDS',
    bosnetQuarter: null,
    bosnetYear: null
  },
  header: { /* objek penuh dari syncToStorage / klaimGetData */ },
  approvalHistory: [
    {
      at: '2026-06-29T10:05:00.000Z',
      roleId: 'ADMIN_KMMD',
      roleLabel: 'Admin KMMD',
      action: 'Save',
      fromStatus: 'NEW',
      toStatus: 'DRAFT',
      username: 'ageng.sugianto'
    }
  ]
}
```

### Skema `AssOwnerRecord`

```javascript
{
  id: '1001',
  groupAccount: 'ENSEVAL',
  supplierId: '2201',
  supplierName: 'PT BRAVO HUSADA',
  ownerId: 'EMP-001',
  ownerName: 'Budi Owner KMMD',
  status: 'ACTIVE',
  detailRows: [
    { site: '...', assId: '...', assName: '...', branch: '...' }
  ],
  updatedAt: '...'
}
```

---

## File Map

| Aksi | File |
|------|------|
| **Create** | `Scripts/customs/prototype/proto-store.js` |
| **Modify** | `Scripts/customs/prototype/klaim-prototype.js` |
| **Modify** | `Scripts/layout.js` (load proto-store.js) |
| **Modify** | `Views/Klaim/Index.html` |
| **Modify** | `Views/Master/AssOwnerKMMD/Index.html` |
| **Modify** | `Views/Klaim/Umbrand.html`, `Brand.html`, `SKU.html` (minor — pastikan load store) |
| **Modify** | `Docs/Klaim/05-progress-log.md` |
| **Modify** | `Docs/Klaim/04-prototype-mapping.md` |

---

### Task 1: Prototype Store (foundation) ✅ Selesai 29 Jun 2026

- `Scripts/customs/prototype/proto-store.js` — CRUD klaim + ASS/Owner, seed, lookup Owner/ASS
- `Scripts/layout.js` — load proto-store sebelum rbac-prototype + `protoEnsureSeeded()` on init


**Interfaces — Produces:**

```javascript
// Constants
window.KDS_PROTO_KEYS = {
  KLAIM_REGISTRY: 'kds_proto_klaim_registry',
  ASS_OWNER_REGISTRY: 'kds_proto_ass_owner_registry',
  META: 'kds_proto_meta',
  ACTIVE_CLAIM_ID: 'kds_proto_active_claim_id'
};

// Klaim registry
function protoGetKlaimRegistry() → ClaimRecord[]
function protoGetKlaimById(id) → ClaimRecord | null
function protoUpsertKlaim(record) → ClaimRecord
function protoDeleteKlaim(id) → boolean
function protoBuildFindSummary(header, detailRows) → findSummary object

// Ass/Owner registry
function protoGetAssOwnerRegistry() → AssOwnerRecord[]
function protoUpsertAssOwner(record) → AssOwnerRecord
function protoFindOwnerBySupplier(groupAccount, supplierId) → { ownerId, ownerName } | null
function protoFindAssBySite(groupAccount, site) → { assId, assName } | null

// Seed
function protoEnsureSeeded() → void  // idempotent, runs once

// Approval history helper
function protoAppendApprovalHistory(claimId, entry) → void

// Active document
function protoSetActiveClaimId(id) → void
function protoGetActiveClaimId() → string | null
```

- [ ] **Step 1:** Buat `proto-store.js` dengan helper `readJson(key, fallback)` / `writeJson(key, value)` berbasis `localStorage`.
- [ ] **Step 2:** Implement `protoEnsureSeeded()` — copy isi `findData` + sample AssOwner dari seed constants ke registry jika `kds_proto_meta.seeded !== true`.
- [ ] **Step 3:** Implement CRUD klaim + `protoBuildFindSummary()` — derive `invoiceNo`, `invoiceAmount`, `period`, `attachment` dari `header.XXSHP_KDS_T_KLAIM_DTL`.
- [ ] **Step 4:** Implement CRUD AssOwner + lookup Owner/ASS.
- [ ] **Step 5:** Load script di `layout.js` **sebelum** `klaim-prototype.js` dan `rbac-prototype.js`.

**Verify:**
```javascript
// Di browser console setelah buka halaman:
protoEnsureSeeded();
console.log(protoGetKlaimRegistry().length);  // >= 10
console.log(protoGetAssOwnerRegistry().length); // >= 1
```

---

## Task 2: Hapus reset paksa & dukung resume dokumen aktif ✅ Selesai 25 Jun 2026

**Files:**
- Modify: `Views/Klaim/Index.html` (`layoutReady` listener)
- Modify: `Scripts/customs/prototype/klaim-prototype.js`

- [x] **Step 1:** Hapus `sessionStorage.removeItem('klaimPrototypeData')` pada setiap `layoutReady`.
- [x] **Step 2:** Pada `layoutReady`:
  - Panggil `protoEnsureSeeded()`.
  - Jika `protoGetActiveClaimId()` ada → load klaim dari registry → `loadClaimFromRecord(record)` (refactor dari `loadClaimFromFind`).
  - Jika tidak ada active id → `initiateBlankForm()` (perilaku baru: kosong, bukan reset storage).
- [x] **Step 3:** Tambah `?claimId=5193` di URL sebagai alternatif deep-link (opsional tapi berguna untuk demo).

**Verify:**
1. Find → pilih klaim → refresh halaman → form **tetap** menampilkan klaim yang sama.

---

## Task 3: Find LOV baca dari registry (bukan hardcoded) ✅ Selesai 25 Jun 2026

**Files:**
- Modify: `Views/Klaim/Index.html`

- [x] **Step 1:** Pindahkan `findData` ke `proto-store.js` sebagai `KDS_PROTO_SEED_KLAIM` (hanya untuk seed).
- [x] **Step 2:** Refactor `handleFind()`:

```javascript
function handleFind() {
    const rows = protoGetKlaimRegistry()
        .sort((a, b) => Number(b.id) - Number(a.id));
    // render tbody dari rows[].findSummary + rows[].id
}
```

- [x] **Step 3:** `selectFindByIndex` → terima `claimId` (bukan index array statis) → `protoSetActiveClaimId(id)` → `loadClaimFromRecord(protoGetKlaimById(id))`.
- [x] **Step 4:** (Opsional) Filter Find per role — Owner hanya `DRAFT`, RSM hanya `DRAFT WITH 2 APPROVE`, CF hanya `DRAFT WITH 3 APPROVE`; Admin/IT lihat semua.

**Verify:**
1. Save klaim baru → Find → record **muncul** di urutan teratas.
2. Owner approve → Find sebagai RSM → status record sudah `DRAFT WITH 2 APPROVE`.

---

## Task 4: Save & workflow menulis ke registry ✅ Selesai 25 Jun 2026

**Files:**
- Modify: `Views/Klaim/Index.html` — `syncToStorage`, `handleSave`, `handleOwnerApprove`, `handleRsmReadySubmit`, `handleCfSubmit`

- [x] **Step 1:** Tambah `persistActiveClaimToRegistry()`:

```javascript
function persistActiveClaimToRegistry() {
    syncToStorage();
    const header = klaimGetData();
    const id = String(header.INT_KLAIM_HDR_ID || '');
    if (!id) return null;
    const existing = protoGetKlaimById(id);
    const record = {
        id,
        dokNo: header.TXT_DOC_NO,
        updatedAt: new Date().toISOString(),
        findSummary: protoBuildFindSummary(header, detailRows),
        header: header,
        approvalHistory: existing ? existing.approvalHistory : []
    };
    return protoUpsertKlaim(record);
}
```

- [x] **Step 2:** Panggil `persistActiveClaimToRegistry()` di akhir setiap handler sukses (Save, Owner, RSM, CF).
- [x] **Step 3:** Setiap transisi workflow panggil `protoAppendApprovalHistory(id, { roleId, action, fromStatus, toStatus, ... })`.
- [x] **Step 4:** `initiateBlankForm()` → `protoSetActiveClaimId(null)`.

**Verify:**
1. Admin Save klaim baru ID `5200` → refresh → Find → buka `5200` → data header + detail utuh.
2. Owner approve → registry status `DRAFT WITH 2 APPROVE` + history 2 baris (Owner + ASS auto).

---

## Task 5: Integrasi Master ASS/Owner KMMD ✅ Selesai 25 Jun 2026

**Files:**
- Modify: `Views/Master/AssOwnerKMMD/Index.html`
- Modify: `Views/Klaim/Index.html` — `handleOwnerApprove`, `handleSave` (email simulasi)

- [x] **Step 1:** Ganti `sessionStorage assOwnerKmmdPrototypeData` dengan `protoUpsertAssOwner()` / `protoGetAssOwnerRegistry()` di AssOwner form.
- [x] **Step 2:** Seed minimal 2–3 mapping AssOwner (ENSEVAL, BRAVO, dll.) di `proto-store.js`.
- [x] **Step 3:** Saat Admin Save → lookup Owner:

```javascript
const owner = protoFindOwnerBySupplier(groupAccount, supplierId);
// bootbox: "Email terkirim ke {owner.ownerName} ({owner.ownerId})"
// atau warning jika tidak ditemukan (mirror AC-08 BRD)
```

- [x] **Step 4:** Saat Owner approve → catat history; ASS auto → lookup `protoFindAssBySite(groupAccount, outlet)` untuk nama ASS di alert/history.

**Verify:**
1. Simpan mapping Owner di Master → Save klaim dengan supplier sama → alert menyebut nama Owner dari master.
2. Hapus mapping → Save → alert error "Mapping Owner KMMD tidak ditemukan" (opsional: block save atau warning only — sepakati dengan bisnis; default: **warning**, tidak block, agar demo tetap jalan).

---

## Task 6: Approval History nyata ✅ Selesai 25 Jun 2026

**Files:**
- Modify: `Views/Klaim/Index.html` — `handleApprovalHistory()`
- Optional: tambah modal `#approvalHistoryModal` di `#app-content`

- [x] **Step 1:** `handleApprovalHistory()` baca `protoGetKlaimById(activeId).approvalHistory`.
- [x] **Step 2:** Render tabel: Waktu | Role | Aksi | Status Dari | Status Ke | User.
- [x] **Step 3:** Jika history kosong → "Belum ada riwayat approval."

**Verify:** Jalankan full workflow Admin → Owner → RSM → CF → Approval History menampilkan 4+ baris.

---

## Task 7: Popup tetap sinkron (Umbrand / Brand / SKU)

**Files:**
- Modify: `Views/Klaim/Umbrand.html`, `Brand.html`, `SKU.html` (jika perlu)
- Modify: `Scripts/customs/prototype/klaim-prototype.js`

- [ ] **Step 1:** Setelah popup `klaimSetData()` + OK → parent `syncFromStorage()` + `persistActiveClaimToRegistry()`.
- [ ] **Step 2:** Pastikan `window.addEventListener('message', klaimUpdated)` di parent memanggil `persistActiveClaimToRegistry()`.

**Verify:** Edit alokasi Umbrand di popup → tutup → refresh → data alokasi masih ada di registry.

---

## Task 8: UX tambahan & reset demo

**Files:**
- Modify: `Views/Klaim/Index.html` atau `layout.js`
- Modify: `proto-store.js`

- [ ] **Step 1:** Tombol tersembunyi / menu IT Admin: **"Reset Demo Data"** → confirm → clear registry + re-seed (berguna saat presentasi ulang).
- [ ] **Step 2:** Export / import JSON registry (opsional, untuk backup demo antar mesin):

```javascript
function protoExportAll() { return JSON.stringify({ klaim: ..., assOwner: ... }); }
function protoImportAll(json) { ... }
```

**Verify:** Reset → Find kembali ke data seed awal.

---

## Task 9: Dokumentasi

**Files:**
- Modify: `Docs/Klaim/05-progress-log.md` — section storage baru
- Modify: `Docs/Klaim/04-prototype-mapping.md` — diagram proto-store

- [ ] **Step 1:** Update §0.3 Storage — jelaskan `localStorage` registry vs `sessionStorage` active doc.
- [ ] **Step 2:** Tambah skenario uji end-to-end (checklist QA di bawah).

---

## Checklist QA End-to-End

| # | Skenario | Expected |
|---|----------|----------|
| 1 | Admin buat klaim baru + Save | Muncul di Find; status DRAFT; history 1 baris |
| 2 | Refresh halaman | Dokumen aktif tetap terbuka |
| 3 | Ganti role → Owner → Find DRAFT → Approve | Status DRAFT WITH 2 APPROVE di registry |
| 4 | Ganti role → RSM → Ready To Submit | Status DRAFT WITH 3 APPROVE |
| 5 | Ganti role → CF → Submit | Status APPROVED; payment fields editable |
| 6 | Approval History | Semua step tercatat dengan role & timestamp |
| 7 | Master Owner mapping | Email/alert sebut nama Owner dari master |
| 8 | Popup Umbrand | Perubahan persist setelah refresh |
| 9 | Reset Demo Data | Kembali ke seed awal |

---

## Urutan Implementasi (disarankan)

```
Task 1 → Task 2 → Task 3 → Task 4 → Task 6 → Task 5 → Task 7 → Task 8 → Task 9
```

Task 4 adalah inti integrasi; Task 5 bisa paralel setelah Task 1.

---

## Yang Sengaja Out of Scope (fase ini)

- Backend ASP.NET / Oracle persistence
- Upload attachment ke server
- Validasi invoice duplikat ke DB Oracle
- Report C.1 / C.2
- RFP/RFS merge PDF (BRD D)
- Multi-user concurrent edit (last-write-wins cukup untuk prototype)

---

## Risiko & Mitigasi

| Risiko | Mitigasi |
|--------|----------|
| `localStorage` penuh (~5MB) | Simpan hanya data perlu; hindari base64 attachment |
| Schema berubah | `kds_proto_meta.schemaVersion` + migrasi kecil di `protoEnsureSeeded` |
| Tab berbeda tidak sync | Terima last-write-wins; cukup untuk demo |
| Data seed vs user data bercampur | Flag `seed: true` pada record; Reset Demo hanya hapus non-seed atau full reset |

---

## Estimasi Effort

| Task | Estimasi |
|------|----------|
| Task 1 – proto-store | 3–4 jam |
| Task 2 – resume dokumen | 1–2 jam |
| Task 3 – Find registry | 2 jam |
| Task 4 – persist workflow | 3–4 jam |
| Task 5 – AssOwner link | 2–3 jam |
| Task 6 – approval history | 1–2 jam |
| Task 7 – popup sync | 1 jam |
| Task 8 – reset/export | 1–2 jam |
| Task 9 – docs + QA | 1–2 jam |
| **Total** | **~15–22 jam** |

---

## Execution Options

**Plan saved to:** `Docs/Klaim/06-data-integration-plan.md`

**1. Subagent-Driven (recommended)** — satu subagent per Task, review antar task.

**2. Inline Execution** — kerjakan Task 1–4 dulu dalam satu sesi, checkpoint demo ke user, lanjut Task 5–9.

Mau mulai implementasi? Switch ke **Agent mode** dan sebut task mana yang dulu (disarankan **Task 1**).
