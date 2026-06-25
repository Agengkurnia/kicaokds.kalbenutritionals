# Dokumentasi KICAO KDS Prototype

Dokumentasi teknis untuk prototype HTML `kicaokds.kalbenutritionals`, diturunkan dari project production `KICAO KDS`.

## Modul

| Modul | Dokumentasi | Halaman Prototype |
|-------|-------------|-------------------|
| **Klaim** | [Klaim/README.md](./Klaim/README.md) | `Views/Klaim/` |
| Budget | _(belum didokumentasikan)_ | `Views/Budget/Index.html` |
| RFA | _(belum didokumentasikan)_ | `Views/RFA/Index.html` |

## Struktur Project Prototype

```
kicaokds.kalbenutritionals/
├── Docs/                    # Dokumentasi modul
├── Views/                   # Halaman HTML per modul
├── Scripts/
│   ├── layout.js            # Shell AdminLTE + menu
│   └── customs/prototype/   # Helper script prototype
├── Content/                 # CSS, plugins AdminLTE
└── index.html               # Beranda
```

## Cara Menjalankan

Buka `index.html` di browser (atau serve via static file server). Login default prototype: klik login tanpa validasi backend — session disimpan di `localStorage.kds_logged_in`.
