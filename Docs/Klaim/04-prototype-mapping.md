# Modul Klaim — Prototype HTML Mapping

## Pendekatan Prototype

Prototype `kicaokds.kalbenutritionals` adalah **HTML statis** tanpa backend ASP.NET MVC. Semua interaksi disimulasikan dengan:

- Data mock di JavaScript
- `sessionStorage` key `klaimPrototypeData` untuk komunikasi parent ↔ popup
- Bootstrap modal + iframe untuk popup (menggantikan fancybox)
- `bootbox` untuk konfirmasi/dialog
- `layout.js` untuk shell AdminLTE (sidebar, header, assets)

## Pemetaan File

| Source (MVC) | Prototype (HTML) | Status |
|--------------|------------------|--------|
| `Views/Klaim/Index.cshtml` | `Views/Klaim/Index.html` | ✅ Lengkap |
| `Views/Klaim/Umbrand.cshtml` | `Views/Klaim/Umbrand.html` | ✅ |
| `Views/Klaim/Brand.cshtml` | `Views/Klaim/Brand.html` | ✅ |
| `Views/Klaim/SKU.cshtml` | `Views/Klaim/SKU.html` | ✅ |
| `Views/Klaim/ScanFakturPajak.cshtml` | `Views/Klaim/ScanFakturPajak.html` | ✅ |
| `klaimscript.js` | Inline script di `Index.html` | Simulasi |
| `umbrandscript.js` | Inline script di `Umbrand.html` | Simulasi |
| `brandscript.js` | Inline script di `Brand.html` | Simulasi |
| `skuscript.js` | Inline script di `SKU.html` | Simulasi |
| `scanfakturpajakscript.js` | Inline script di `ScanFakturPajak.html` | Simulasi |

## Komunikasi Parent ↔ Popup

```javascript
// Parent (Index.html) sebelum buka popup:
sessionStorage.setItem('klaimPrototypeData', JSON.stringify(claimData));

// Popup (Umbrand.html) saat load:
const claimData = JSON.parse(sessionStorage.getItem('klaimPrototypeData'));
const detailIndex = new URLSearchParams(location.search).get('intIndex');

// Popup saat OK:
sessionStorage.setItem('klaimPrototypeData', JSON.stringify(updatedData));
window.parent.postMessage({ type: 'klaimUpdated' }, '*');
```

## Fitur yang Disimulasikan

| Fitur Asli | Simulasi Prototype |
|------------|-------------------|
| LOV Group Account / Partner / Outlet | Bootstrap modal dengan data mock |
| Save / Submit / Close / Reject | `bootbox` + update status label |
| Grid detail editable | Render dinamis dengan `detailRows[]` |
| Perhitungan PPH/PPN | JavaScript `formatCurrency` + kalkulasi |
| Popup Umbrand → Brand → SKU | iframe modal bertingkat |
| Scan Faktur Pajak | Parse URL mock / auto-fill sample |
| Attachment upload | `<input type="file">` (tanpa upload server) |
| Print / View Memo | `bootbox.alert` preview |
| Approval History | `bootbox.alert` mock timeline |

## Data Mock Default

Prototype menyediakan sample data:

**Group Account:**
- KALBE DISTRIBUTOR SYSTEM (SPL-KDS-001)
- MILNA DISTRIBUTOR ACC (SPL-MIL-002)

**Partner:**
- PT ENSVAL PUTRA MEGASURYA
- PT TIGARAKSA SATRIA TBK

**Outlet:**
- APOTEK HIDUP SEHAT JAKARTA (JAKARTA HO)
- GUARDIAN GIANT MALL SURABAYA (SURABAYA BRANCH)

**Produk (Umbrand/Brand/SKU):**
- MILNA → MILNA UHT → Item MILNA-001
- CHILKID → CHILKID GOLD → Item CHK-100G

## Menu Navigasi

Didefinisikan di `Scripts/layout.js`:

```javascript
<li id="menu-tr-klaim">
  <a href="${basePath}Views/Klaim/Index.html">
    <i class="fa fa-circle-o"></i> Form Klaim
  </a>
</li>
```

## Langkah Migrasi ke Production

Saat prototype diintegrasikan ke MVC/backend:

1. Ganti inline script dengan `klaimscript.js` asli
2. Hubungkan AJAX ke endpoint `/Transaksi/Klaim/*`
3. Ganti modal iframe dengan `clsGlobal.generatePopUpIframe()`
4. Implementasi `txtHiddenObject` + anti-forgery token
5. LOV → `clsGlobal.generateLOV()`
6. Attachment → multipart FormData ke `SaveData`/`UpdateAttachmentData`
