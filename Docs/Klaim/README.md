# Modul Klaim — KICAO KDS

Dokumentasi ini merangkum modul **Form Klaim** dari project asli `KICAO KDS` (`KN2022_KCO_KDS.MVC`) dan pemetaannya ke prototype HTML di `kicaokds.kalbenutritionals`.

## Daftar Dokumen

| Dokumen | Isi |
|---------|-----|
| [01-overview.md](./01-overview.md) | Ringkasan bisnis, layar, alur kerja, tombol aksi |
| [02-data-model.md](./02-data-model.md) | Struktur entitas database & relasi hierarki |
| [03-api-endpoints.md](./03-api-endpoints.md) | Controller actions & API yang dipanggil frontend |
| [04-prototype-mapping.md](./04-prototype-mapping.md) | Pemetaan ke file HTML prototype |
| **[05-progress-log.md](./05-progress-log.md)** | **Log kemajuan prototype — LOV, business rules, data riil, uji coba** |

> Untuk status pengerjaan terkini prototype Form Klaim, selalu rujuk **[05-progress-log.md](./05-progress-log.md)** sebagai dokumen hidup (living document).

## Lokasi Source Asli

```
KICAO KDS/
├── KN2022_KCO_KDS.MVC/
│   ├── Views/Klaim/
│   │   ├── Index.cshtml          # Form utama klaim
│   │   ├── Umbrand.cshtml        # Popup alokasi umbrand
│   │   ├── Brand.cshtml          # Popup alokasi subbrand
│   │   ├── SKU.cshtml            # Popup alokasi SKU/item
│   │   └── ScanFakturPajak.cshtml # Scan URL faktur pajak DJP
│   ├── Controllers/Transaksi/Klaim/KlaimController.cs
│   └── Scripts/customs/transactions/klaim/
│       ├── klaimscript.js
│       ├── umbrandscript.js
│       ├── brandscript.js
│       ├── skuscript.js
│       └── scanfakturpajakscript.js
└── KN2022_KCO_KDS.Common/Entity/
    ├── XXSHP_KDS_T_KLAIM_HDR.cs
    ├── XXSHP_KDS_T_KLAIM_DTL.cs
    ├── XXSHP_KDS_T_KLAIM_UMB.cs
    ├── XXSHP_KDS_T_KLAIM_BRAN.cs
    └── XXSHP_KDS_T_KLAIM_SKU.cs
```

## Lokasi Prototype HTML

```
kicaokds.kalbenutritionals/
└── Views/Klaim/
    ├── Index.html
    ├── Umbrand.html
    ├── Brand.html
    ├── SKU.html
    └── ScanFakturPajak.html
```

## Akses di Prototype

Menu: **Transaksi → Form Klaim**  
URL: `Views/Klaim/Index.html`
