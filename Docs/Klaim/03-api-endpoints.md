# Modul Klaim — API & Controller Endpoints

Base controller: `KlaimController`  
Route prefix MVC: `/Transaksi/Klaim/`  
API controller: `API_KDSKlaimController` → `/api/{version}/ApiKlaim/`

## MVC Actions (dipanggil dari JavaScript)

### Header Operations

| Action | Method | Dipanggil dari | Keterangan |
|--------|--------|----------------|------------|
| `Index` | GET | — | Render halaman utama |
| `InitiateData` | POST | `klaimscript.js` | Buat objek header kosong + role login |
| `GetData` | POST | `klaimscript.js` | Ambil klaim by ID atau doc no terenkripsi |
| `GetSupplierSite` | POST | `klaimscript.js` | Set supplier site setelah pilih outlet |
| `CheckKlaimAllowUpdate` | POST | `klaimscript.js` | Cek apakah klaim boleh diedit |
| `CekGroupAccountIsEnseval` | POST | `klaimscript.js` | Validasi group account Enseval |
| `SaveData` | POST | `klaimscript.js` | Simpan header + detail (multipart untuk attachment) |
| `UpdateIncludeData` | POST | `klaimscript.js` | Update flag BIT_INCLUDE detail |
| `SubmitData` | POST | `klaimscript.js` | Submit untuk approval |
| `CloseData` | POST | `klaimscript.js` | Close dokumen + alasan |
| `RejectData` | POST | `klaimscript.js` | Reject dokumen + alasan |
| `CopyData` | POST | `klaimscript.js` | Duplikasi klaim |
| `PrintoutToPDF` | POST | `klaimscript.js` | Generate PDF klaim |
| `PrintoutPDFMKPP` | POST | `klaimscript.js` | Generate PDF MKPP |

### Detail Operations

| Action | Method | Dipanggil dari | Keterangan |
|--------|--------|----------------|------------|
| `AddRow` | POST | `klaimscript.js` | Tambah baris detail kosong |
| `SetStatusKlaim` | POST | `klaimscript.js` | Set status per baris detail |
| `SetStatusDesc` | POST | `klaimscript.js` | Set deskripsi status per baris |
| `DownloadAttachment` | POST | `klaimscript.js` | Download file lampiran |
| `RemoveAttachment` | POST | `klaimscript.js` | Hapus lampiran |
| `UpdateAttachmentData` | POST | `klaimscript.js` | Upload/update lampiran |

### Umbrand / Brand / SKU Popups

| Action | Method | View | Script |
|--------|--------|------|--------|
| `Umbrand` | GET | `Umbrand.cshtml` | `umbrandscript.js` |
| `AddRowUmbrand` | POST | — | `umbrandscript.js` |
| `Brand` | GET | `Brand.cshtml` | `brandscript.js` |
| `AddRowBrand` | POST | — | `brandscript.js` |
| `SKU` | GET | `SKU.cshtml` | `skuscript.js` |
| `AddRowSKU` | POST | — | `skuscript.js` |

**Query string popup:**

```
/Transaksi/Klaim/Umbrand?intIndex={detailRowIndex}
/Transaksi/Klaim/Brand?intIndex={umbIndex}&intDetailIndex={detailRowIndex}
/Transaksi/Klaim/SKU?intIndex={detailRowIndex}&intDetailIndex={umbIndex}&intBrandIndex={brandIndex}
/Transaksi/Klaim/ScanFakturPajak?intIndex={detailRowIndex}
```

### Scan Faktur Pajak

| Action | Method | Keterangan |
|--------|--------|------------|
| `ScanFakturPajak` | GET | Render popup scan |
| `ScanFakturPajakDetail` | POST | Parse URL faktur, return data ke parent |

## LOV (List of Values)

Didefinisikan di `LOVController`, module name: `clsTrKlaimConstant.MODULE_NAME`

| LOV Key | Digunakan untuk |
|---------|-----------------|
| `LOV_OUTLET` | Pilih outlet |
| `LOV_OUTLET_BY_SUP_SITE` | Outlet by supplier site |
| Program Activity Klaim | Activity + program desc |
| PPH (`MODULE_PERSEN_PPH`) | Tipe & tarif PPH |
| Umbrand / Brand / Subbrand | Alokasi produk |
| Item/SKU | Detail SKU |

## REST API (`API_KDSKlaimController`)

Endpoint untuk integrasi eksternal (BosNet, dll):

| Route | Keterangan |
|-------|------------|
| `SaveData` | Simpan klaim via API |
| `SubmitData` | Submit klaim |
| `GetData` | Ambil data klaim |
| `SetStatusKlaim` | Update status detail |
| `SetStatusDesc` | Update deskripsi status |
| `CheckKlaimAllowUpdate` | Cek editable |
| `UpdateAttachment` | Upload attachment via API |
| `PrintActivity` | Print activity report |

## Payload Pattern

Frontend menyimpan seluruh objek klaim di hidden field `txtHiddenObject` (JSON serialized `XXSHP_KDS_T_KLAIM_HDR` beserta nested collections).

Setiap AJAX call mengirim:
- `data`: JSON string dari `txtHiddenObject`
- `txtGUID`: concurrency token
- `__RequestVerificationToken`: anti-forgery token

Response format (`clsAPI.CreateResult`):
```json
{
  "bitSuccess": true,
  "objData": { /* XXSHP_KDS_T_KLAIM_HDR */ },
  "txtMessage": ""
}
```

## Master Data Dependencies

| Master | Digunakan untuk |
|--------|-----------------|
| `PopulateTipePPN` (`/Main/PopulateTipePPN`) | Dropdown PPN di grid detail |
| `XXSHP_KDS_M_KLAIM_DESC_HDR` | LOV program activity |
| `XXSHP_KPP_VENDOR_SITE_ALL_V` | Supplier site |
| `XXSHP_KCO_M_SYSCONFIG` | Konfigurasi faktur pajak, Enseval, K2 approval |
