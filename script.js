// ===== 1. DATA =====
// Setiap tugas: { id, teks, selesai }
let todoArray = [];

// Filter yang sedang aktif: "semua" | "aktif" | "selesai"
// Ini hanya mengatur apa yang DITAMPILKAN, bukan isi todoArray.
let filterAktif = "semua";

// ===== 2. AMBIL ELEMEN =====
const tombolTambah = document.getElementById("btnTambah");
const kolomInput = document.getElementById("inputTugas");
const areaArray = document.getElementById("areaArray");
const teksHitung = document.getElementById("teksHitung");
const tombolHapusSelesai = document.getElementById("btnHapusSelesai");
const tombolFilter = document.querySelectorAll("[data-filter]");

// ===== 3. PENYIMPANAN =====
function simpanData() {
  localStorage.setItem("todoArray", JSON.stringify(todoArray));
}

function muatData() {
  try {
    const dataTersimpan = localStorage.getItem("todoArray");
    if (dataTersimpan !== null) {
      todoArray = JSON.parse(dataTersimpan);
    }
  } catch (error) {
    // data rusak: mulai dari array kosong
    todoArray = [];
  }
}

// ===== 4. FILTER =====
// Mengembalikan array BARU sesuai filter, todoArray tidak berubah.
function filterTugas(namaFilter) {
  if (namaFilter === "aktif") {
    return todoArray.filter((tugas) => !tugas.selesai);
  }
  if (namaFilter === "selesai") {
    return todoArray.filter((tugas) => tugas.selesai);
  }
  return todoArray; // "semua"
}

// Pesan saat daftar kosong, disesuaikan dengan filter
function pesanKosong() {
  if (todoArray.length === 0) return "Belum ada tugas buat hari ini yaa";
  if (filterAktif === "aktif") return "Tidak ada tugas yang belum selesai";
  if (filterAktif === "selesai") return "Belum ada tugas yang selesai";
  return "";
}

// ===== 5. RENDER =====
function render() {
  areaArray.innerHTML = "";

  // Gambar hasil filter, bukan todoArray langsung
  const daftarTampil = filterTugas(filterAktif);

  if (daftarTampil.length === 0) {
    const pesan = document.createElement("p");
    pesan.className = "text-center text-muted";
    pesan.textContent = pesanKosong();
    areaArray.appendChild(pesan);
  } else {
    const ul = document.createElement("ul");
    ul.className = "list-group";

    daftarTampil.forEach((tugas) => {
      const li = document.createElement("li");
      li.className = "list-group-item list-group-item-primary mb-2 rounded-2 d-flex justify-content-between align-items-center";

      // kiri: checkbox + teks
      const kiri = document.createElement("div");
      kiri.className = "d-flex align-items-center gap-2";

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.className = "form-check-input mt-0";
      checkbox.checked = tugas.selesai;
      checkbox.addEventListener("change", () => ceklisTugas(tugas.id));

      const teks = document.createElement("span");
      teks.textContent = tugas.teks;
      if (tugas.selesai) {
        teks.classList.add("text-decoration-line-through", "text-muted");
      }

      kiri.appendChild(checkbox);
      kiri.appendChild(teks);

      // kanan: tombol hapus
      const tombolHapus = document.createElement("button");
      tombolHapus.className = "btn btn-danger btn-sm";
      tombolHapus.textContent = "Hapus";
      tombolHapus.addEventListener("click", () => hapusTugas(tugas.id));

      li.appendChild(kiri);
      li.appendChild(tombolHapus);
      ul.appendChild(li);
    });

    areaArray.appendChild(ul);
  }

  renderInfo();
}

// Penghitung dan tombol filter ikut diperbarui tiap render
function renderInfo() {
  const jumlahAktif = todoArray.filter((tugas) => !tugas.selesai).length;
  const jumlahSelesai = todoArray.length - jumlahAktif;

  teksHitung.textContent = `${jumlahAktif} tugas belum selesai`;
  tombolHapusSelesai.disabled = jumlahSelesai === 0;

  // tandai tombol filter yang sedang aktif
  tombolFilter.forEach((tombol) => {
    const aktif = tombol.dataset.filter === filterAktif;
    tombol.classList.toggle("btn-primary", aktif);
    tombol.classList.toggle("btn-outline-primary", !aktif);
  });
}

// ===== 6. AKSI =====
function tambahTugas() {
  const tugasBaru = kolomInput.value.trim();

  if (tugasBaru === "") {
    alert("Tugas tidak boleh kosong yaa");
    return;
  }

  todoArray.push({
    id: Date.now(),
    teks: tugasBaru,
    selesai: false,
  });

  kolomInput.value = "";
  kolomInput.focus();

  simpanData();
  render();
}

function hapusTugas(id) {
  if (!confirm("Yakin mau hapus tugas ini?")) return;

  todoArray = todoArray.filter((tugas) => tugas.id !== id);
  simpanData();
  render();
}

function ceklisTugas(id) {
  const tugas = todoArray.find((item) => item.id === id);
  if (tugas) {
    tugas.selesai = !tugas.selesai;
    simpanData();
    render();
  }
}

function hapusSelesai() {
  if (!confirm("Hapus semua tugas yang sudah selesai?")) return;

  // pertahankan hanya yang BELUM selesai
  todoArray = todoArray.filter((tugas) => !tugas.selesai);
  simpanData();
  render();
}

function ubahFilter(namaFilter) {
  filterAktif = namaFilter;
  render(); // filter tidak mengubah data, jadi tidak perlu simpanData()
}

// ===== 7. EVENT =====
tombolTambah.addEventListener("click", tambahTugas);

kolomInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    tambahTugas();
  }
});

tombolHapusSelesai.addEventListener("click", hapusSelesai);

tombolFilter.forEach((tombol) => {
  tombol.addEventListener("click", () => ubahFilter(tombol.dataset.filter));
});

// ===== 8. TAMPILAN AWAL =====
muatData(); // isi todoArray dulu
render(); // baru gambar
