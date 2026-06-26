# Modul Klaim — Progress Log & Integrasi Data

Dokumen ini mencatat seluruh kemajuan pengerjaan prototype **Form Klaim**, regulasi bisnis yang diimplementasikan, serta detail data LOV yang diperkaya dan distandardisasi.

---

## 1. Kemajuan & Pembaruan Sistem (Progress Summary)

Kami telah menyelesaikan beberapa pembaruan utama pada prototype `kicaokds.kalbenutritionals` di folder `Views/Klaim/Index.html`:

1. **Standardisasi Tampilan LOV (List Of Value) Modals**:
   - **Ukuran Lebar & Tinggi Modal (Fancybox Match)**: Mengubah ukuran lebar dialog modal pencarian LOV menjadi lebar (`width: 90%` dengan batas maksimal `1100px`) serta menetapkan tinggi minimum (`min-height: 550px`) pada `.modal-content` untuk meniru layout popup iframe Fancybox secara persis.
   - **Posisi Modal (Margin Atas)**: Menyesuaikan margin modal (`margin: 15px auto !important`) agar posisinya terangkat ke atas, sesuai dengan layout iframe popup pada aplikasi live.
   - **Header Baru**: Menyamakan header modal dengan sistem live menggunakan warna hijau Kalbe (`background-color: #00a65a`), teks tebal berwarna putih dengan judul `"List Of Value"`, serta tombol tutup (close `x`) putih yang presisi.
   - **Casing Header Table ("Pilih")**: Mengubah tag header tabel LOV dari `<th>` menjadi `<td>`. Perubahan ini menghindari aturan CSS `.table tr > th { text-transform: uppercase; }` pada `styles.css` agar tulisan `"Pilih"` tetap berformat mixed-case, sementara label kolom basis data lainnya (seperti `SITE`, `SUPPLIER ID`, `SUPPLIER NAME`, `BRANCH`) tetap tampil kapital.
   - **Kolom Pilih di Kiri**: Memindahkan tombol seleksi (**Pilih**) ke kolom paling kiri (kolom pertama) di semua tabel modal (Group Account, Partner, dan Outlet) sesuai standar UI produksi.
   - **Tombol Standard**: Mengganti tombol hijau `"Select"` dengan tombol standard abu-abu berlabel `"Pilih"` (`class="btn btn-default btn-xs"`).
   - **Fitur Live Pencarian & Pagination Mock**: Menambahkan input pencarian dinamis (live-search via jQuery keyup) serta label pagination DataTable seperti `"Showing 1 to N of N entries"`.

2. **Resolusi Konflik jQuery**:
   - Memperbaiki isu di mana library `complete.min.js` (yang memuat jQuery v1.6.4 lawas) menimpa plugin `modal` dan `datepicker` dari jQuery utama (v3.2.1) di `layout.js`.
   - Menambahkan pengaman untuk mencegah injeksi ganda jQuery dengan memindahkan properti `.fn` (selain properti inti seperti `init`, `constructor`, `selector`, `jquery`) dari jQuery lama ke jQuery utama, lalu memulihkan instance jQuery utama.

3. **Perbaikan Tampilan Modal (Z-Index Backdrop)**:
   - Memindahkan semua elemen modal secara dinamis ke `body` menggunakan event listener `layoutReady` (`$('.modal').appendTo('body')`) untuk mencegah penumpukan overlay/backdrop yang memblokir interaksi user.
   - Menghapus kelas `fade` dari Bootstrap modal untuk menghindari transisi macet (hanging).

4. **Sinkronisasi Input Header**:
   - Memperbarui fungsi `syncToStorage` dan `syncFromStorage` agar tidak hanya menyimpan detail baris klaim (`detailRows`), melainkan juga semua field di header form (seperti *Group Account*, *Partner*, *Outlet*, *Supplier Site ID/Name*, *Branch*, *Remark*, dan status *Ready to Submit*).

---

## 2. Regulasi & Logika Bisnis (Business Rules)

Kami telah menyerap regulasi bisnis dari aplikasi live `KICAO KDS` (`klaimscript.js`) ke dalam prototype:

### **Aturan Tampilan Pencarian Partner (Partner LOV)**
* **Regulasi**: Tombol pencarian partner (`#btnLOVPartner`) **hanya akan muncul** jika kolom **Group Account** bernilai **"ENSEVAL"**. 
* Jika memilih Group Account lain (seperti `BRAVO`, `KMMD`, atau `RM VI JATENG`), tombol pencarian partner akan **disembunyikan** (`display: none;`).
* **Reset Kolom Dependen**: Jika Group Account diubah, kolom **Partner**, **Outlet**, dan **Branch** otomatis dikosongkan untuk menjaga konsistensi data.
* **Nilai Default**: Pada saat pembuatan form baru (`handleNew` / load awal), tombol pencarian partner disembunyikan secara default.

---

## 3. Integrasi Data LOV yang Diperkaya (Enriched Data)

Data LOV (List of Values) berikut disalin dari data transaksi riil yang discrape dari lingkungan live dan ditanam langsung ke dalam `Index.html`:

### **A. Group Account**
Diambil langsung dari sistem riil (1 halaman berisi 4 entri):
* `BRAVO` (Supplier Code: `SPL-BRAVO-001`)
* `ENSEVAL` (Supplier Code: `SPL-ENSEVAL-002`)
* `KMMD` (Supplier Code: `SPL-KMMD-003`)
* `RM VI JATENG` (Supplier Code: `SPL-RM6-004`)

### **B. Partner (Semua Group Account/Khusus ENSEVAL)**
Diambil dari hasil scraping data partner riil. Menampilkan partner yang sesuai saat tombol pencarian partner di-klik. Kolom tabel modal disesuaikan agar menampilkan data berkolom: `Pilih`, `SITE`, `BRANCH NAME`, `SUPPLIER NAME`, dan `GROUP ACCOUNT` sesuai dengan screenshot terbaru.
* **ENSEVAL PUTERA MEGATRADING, TBK PT** (Branch: `JAKARTA 1`)
* **ENSEVAL PUTERA MEGATRADING, TBK PT ACEH** (Branch: `ACEH`)
* **ENSEVAL PUTERA MEGATRADING, TBK PT BEKASI** (Branch: `BEKASI`)

*Catatan: Kolom data Partner di atas otomatis memetakan Supplier Code, Supplier Name, Supplier Site ID/Name, dan nama Branch secara otomatis saat dipilih.*

### **C. Outlet (Disaring berdasarkan Group Account)**
Untuk mensimulasikan pencarian outlet yang relevan dengan supplier site, data modal Outlet kini disaring dinamis berdasarkan Group Account yang sedang terpilih:

* **ENSEVAL Outlets**:
  * `OUT-ENS-001` - APOTEK ENSEVAL HUSADA JAKARTA (Branch: `JAKARTA 1`)
  * `OUT-ENS-002` - APOTEK ENSEVAL ACEH HULU (Branch: `ACEH`)
  * `OUT-ENS-003` - KORAN ENSEVAL BEKASI BARAT (Branch: `BEKASI`)
* **KMMD Outlets**:
  * `OUT-KMMD-001` - UD AJEKA DISTRIBUSINDO OUTLET (Branch: `JAKARTA 1`)
  * `OUT-KMMD-002` - PERMATA BUNDA MART SHOP (Branch: `JAKARTA 1`)
  * `OUT-KMMD-003` - ANEKA KARYA UNGGUL RETAIL (Branch: `JAKARTA 1`)
  * `OUT-KMMD-004` - ATJEH MITRA MANDIRI MART (Branch: `BANDA ACEH`)
  * `OUT-KMMD-005` - BINTANG LIMA IMADA STORE (Branch: `BATAM`)
  * ... *(Dan data lainnya dari hasil pemetaan KMMD)*
* **BRAVO Outlets**:
  * `OUT-BRV-001` - APOTEK BRAVO HUSADA BANDUNG (Branch: `BANDUNG`)
  * `OUT-BRV-002` - APOTEK BRAVO FARMA TANGERANG (Branch: `TANGERANG`)
* **RM VI JATENG Outlets**:
  * `OUT-RM6-001` - APOTEK RM JATENG SEMARANG (Branch: `SEMARANG`)
  * `OUT-RM6-002` - APOTEK RM JATENG TEGAL (Branch: `TEGAL`)

---

5. **Standardisasi Grid Detail & Detail LOV**:
   - **Tampilan Input Baru**: Mengubah kolom detail tabel (`#dtDetail`) untuk memunculkan tombol pencarian merah pada kolom *Activity* dan *PPH Type*, tombol scan abu-abu (`fa-barcode`) pada kolom *Faktur Pajak No*, input PPN Amount dinamis yang aktif hanya jika PPN rate > 0, tombol *Umbrand* biru yang muncul jika `All Brand` tidak dicentang, serta tombol *Delete* kuning block level.
   - **Interactive Pop-up Detail Modals**: Menambahkan `#lovDetailActivityModal` (Activity) dan `#lovDetailPphTypeModal` (PPH Type) ke bagian bawah body. Format tampilan, ukuran (90% width, min-height 550px), header hijau gelap, list data baris hijau muda, dan fungsionalitas pencarian langsung (live filtering keyup) disamakan persis dengan modal header.
   - **Logika Kalkulasi & Storage**: Melakukan perhitungan matematis secara dynamic (PPH Tarif %, PPH Amount, Final Amount, PPN Amount, dan Total Amount) serta menyimpan data ini termasuk `DEC_PPN` dan array lampiran attachment (`XXSHP_KDS_T_KLAIM_DTL_ATT`) ke dalam `localStorage` via `syncToStorage` & `syncFromStorage`.

---

## 4. Cara Pengujian di Prototype

1. Buka halaman utama prototype: `Views/Klaim/Index.html`.
2. Klik tombol pencarian **Group Account** (tombol merah berlambang kaca pembesar di samping input Group Account).
3. Pilih **ENSEVAL** dengan mengklik tombol **Pilih** di sebelah kiri:
   * Amati bahwa tombol pencarian **Partner** akan muncul secara otomatis.
   * Klik tombol pencarian partner tersebut, lalu pilih salah satu partner (misal: `ENSEVAL PUTERA MEGATRADING, TBK PT ACEH`). 
   * Amati bahwa kolom **Branch**, **Supplier Name**, **Supplier Code**, **Supplier ID**, dan **Supplier Site** otomatis terisi dengan data yang tepat.
4. Klik tombol pencarian **Group Account** lagi, lalu ubah ke **KMMD**:
   * Amati bahwa tombol pencarian **Partner** langsung menghilang.
   * Kolom **Partner**, **Outlet**, dan **Branch** otomatis ter-reset/kosong.
5. Klik tombol pencarian **Outlet**:
   * Amati bahwa daftar outlet yang muncul di dalam modal disaring secara dinamis sehingga hanya menampilkan outlet yang termasuk ke dalam group account `KMMD` (misal: *UD AJEKA DISTRIBUSINDO OUTLET*, *PERMATA BUNDA MART SHOP*, dsb).
6. Pada tabel detail:
   * Klik tombol cari merah di kolom **Activity** baris 1. Pilih salah satu activity (misal: `ACT-KCO-02`).
   * Klik tombol cari merah di kolom **PPH Type**. Pilih tipe PPH. Cek bahwa Tarif PPH, PPH Amount, dan Final Amount otomatis menghitung berdasarkan *Invoice Amount*.
   * Centang/uncentang kolom **All Brand**. Amati tombol **Umbrand** biru yang muncul/hilang secara dinamis.
   * Klik tombol **Delete** kuning untuk memicu hapus baris.
   * Klik tombol **Save** di header untuk menyimpan *Draft* form klaim ke localStorage, lalu muat ulang halaman untuk memverifikasi seluruh state ter-restore secara otomatis.
