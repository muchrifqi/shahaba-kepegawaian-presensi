    const kegiatanKalender = [
        { tanggal: "2025-04-15", judul: "Rapat Orang Tua Siswa - SD" },
        { tanggal: "2025-04-20", judul: "Field Trip ke Taman Mini - Prasekolah" },
        { tanggal: "2025-04-25", judul: "Ujian Tengah Semester - SMP" },
        { tanggal: "2025-04-18", judul: "Pelatihan Membangun Karakter Anak - SMP" },
        { tanggal: "2025-04-20", judul: "Kajian Parenting: Menanamkan Nilai-Nilai Islam pada Anak - Prasekolah" },
        { tanggal: "2025-04-23", judul: "Kelas Membaca Al-Qur'an dengan Tajwid yang Benar - SD" },
        { tanggal: "2025-04-25", judul: "Seminar Pendidikan Karakter dalam Islam - SMP" },
        { tanggal: "2025-04-27", judul: "Workshop Mengajarkan Anak tentang Etika Islami - SD" },
        { tanggal: "2025-04-30", judul: "Parenting Islami: Membangun Hubungan Positif dengan Anak - SMP" },
        { tanggal: "2025-05-02", judul: "Kelas Pengenalan Pendidikan Islam untuk Anak Usia Dini - Prasekolah" }
    ];

    function tampilkanKalender() {
        const container = document.getElementById("calendar-list");
        container.innerHTML = ""; // bersihkan
        kegiatanKalender.forEach(event => {
            const item = document.createElement("li");
            item.innerHTML = `
                <div class="bg-white bg-opacity-10 p-3 rounded-md border border-white border-opacity-20">
                    <strong>${formatTanggal(event.tanggal)}</strong><br>
                    <span>${event.judul}</span>
                </div>
            `;
            container.appendChild(item);
        });
    }

    function formatTanggal(tgl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(tgl).toLocaleDateString('id-ID', options);
    }

    // Panggil saat halaman dibuka
    document.addEventListener("DOMContentLoaded", tampilkanKalender);
