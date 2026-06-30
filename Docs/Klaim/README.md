# Modul Klaim — KICAO KDS

Dokumentasi ini merangkum modul **Form Klaim** dari project asli `KICAO KDS` (`KN2022_KCO_KDS.MVC`) dan pemetaannya ke prototype HTML di `kicaokds.kalbenutritionals`.

## Daftar Dokumen

| Dokumen | Isi |
|---------|-----|
| [01-overview.md](./01-overview.md) | Ringkasan bisnis, layar, alur kerja, tombol aksi |
| [02-data-model.md](./02-data-model.md) | Struktur entitas database & relasi hierarki |
| [03-api-endpoints.md](./03-api-endpoints.md) | Controller actions & API yang dipanggil frontend |
| [04-prototype-mapping.md](./04-prototype-mapping.md) | Pemetaan ke file HTML prototype |
| [05-progress-log.md](./05-progress-log.md) | Log kemajuan prototype — LOV, business rules, data riil, uji coba |
| [06-data-integration-plan.md](./06-data-integration-plan.md) | Rencana integrasi `proto-store` & registry persisten |
| **[07-workflow-rbac-external-approval.md](./07-workflow-rbac-external-approval.md)** | **Workflow status, RBAC, approval eksternal (email/OTP)** |
| **[08-testing-and-reset-guide.md](./08-testing-and-reset-guide.md)** | **Skenario uji end-to-end & reset data demo** |

> Untuk **alur klaim terbaru** (DRAFT → Draft With Approve → Ready to Submit → APPROVED), rujuk **[07-workflow-rbac-external-approval.md](./07-workflow-rbac-external-approval.md)**.  
> Untuk status pengerjaan teknis prototype, rujuk **[05-progress-log.md](./05-progress-log.md)** sebagai living document.

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
    ├── ApprovalEmail.html      # Simulasi email approval eksternal (Owner)
    ├── ApprovalOtp.html          # Landing page OTP eksternal
    ├── Umbrand.html
    ├── Brand.html
    ├── SKU.html
    └── ScanFakturPajak.html
```

Script pendukung workflow & data:

```
Scripts/customs/prototype/
├── proto-store.js       # Registry klaim & ASS/Owner (localStorage)
├── rbac-prototype.js    # Role, permission, workflow matrix
└── klaim-prototype.js   # Session helper klaimPrototypeData
```

## Akses di Prototype

Menu: **Transaksi → Form Klaim**  
URL: `Views/Klaim/Index.html`
