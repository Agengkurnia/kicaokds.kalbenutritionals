# Dokumentasi KICAO KDS Prototype

Dokumentasi teknis untuk prototype HTML `kicaokds.kalbenutritionals`, diturunkan dari project production `KICAO KDS`.

## Modul

| Modul | Dokumentasi | Halaman Prototype |
|-------|-------------|-------------------|
| **Klaim** | [Klaim/README.md](./Klaim/README.md) · [Workflow RBAC](./Klaim/07-workflow-rbac-external-approval.md) · [Uji & Reset](./Klaim/08-testing-and-reset-guide.md) | `Views/Klaim/` |
| **ASS/Owner KMMD** | [AssOwnerKMMD/README.md](./AssOwnerKMMD/README.md) · [Spesifikasi Lengkap](./AssOwnerKMMD/01-complete-specification.md) | `Views/Master/AssOwnerKMMD/` |
| Budget | _(belum didokumentasikan)_ | `Views/Budget/Index.html` |
| RFA | _(belum didokumentasikan)_ | `Views/RFA/Index.html` |

## Struktur Project Prototype

```
kicaokds.kalbenutritionals/
├── Docs/                    # Dokumentasi modul
├── Views/                   # Halaman HTML per modul
├── Scripts/
│   ├── layout.js            # Shell AdminLTE + menu
│   └── customs/prototype/   # proto-store, rbac-prototype, klaim-prototype
├── Content/                 # CSS, plugins AdminLTE
└── index.html               # Beranda
```

## Cara Menjalankan

Buka `index.html` di browser (atau serve via static file server). Login default prototype: klik login tanpa validasi backend — session disimpan di `localStorage.kds_logged_in`. Setelah login, pilih **role** (Admin KMMD, Owner, RSM, CF, dll.) di halaman Choose Role.

Reset data demo: lihat [Klaim/08-testing-and-reset-guide.md](./Klaim/08-testing-and-reset-guide.md).
