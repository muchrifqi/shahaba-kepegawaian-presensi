// Data guru dan link GMeet
const guruData = [
    {
        nama: "Pak Ahmad",
        mapel: "Matematika",
        kelas: "Kelas 1, 2, 3",
        link: "https://meet.google.com/abc-math-123"
    },
    {
        nama: "Bu Siti",
        mapel: "Bahasa Indonesia",
        kelas: "Kelas 1, 4",
        link: "https://meet.google.com/xyz-bindo-456"
    },
    {
        nama: "Bu Rina",
        mapel: "IPA",
        kelas: "Kelas 2, 5",
        link: "https://meet.google.com/def-ipa-789"
    },
    {
        nama: "Pak Yusuf",
        mapel: "Agama Islam",
        kelas: "Semua Kelas",
        link: "https://meet.google.com/ghi-agama-101"
    },
    {
        nama: "Bu Diana",
        mapel: "Bahasa Inggris",
        kelas: "Kelas 3, 6",
        link: "https://meet.google.com/jkl-inggris-112"
    }
];

// Fungsi untuk menampilkan daftar guru
function renderGuruList(filter = '') {
    const container = document.getElementById('guru-list');
    if (!container) return;

    const searchTerm = filter.toLowerCase();
    const filteredGuru = guruData.filter(guru => 
        guru.nama.toLowerCase().includes(searchTerm) ||
        guru.mapel.toLowerCase().includes(searchTerm) ||
        guru.kelas.toLowerCase().includes(searchTerm)
    );

    if (filteredGuru.length === 0) {
        container.innerHTML = '<div class="text-center text-white opacity-70">Tidak ditemukan guru yang sesuai</div>';
        return;
    }

    container.innerHTML = filteredGuru.map(guru => `
        <div class="guru-card">
            <div class="guru-info">
                <div class="guru-nama">${guru.nama}</div>
                <div class="guru-detail">
                    <span class="guru-mapel"><i class="fas fa-book"></i> ${guru.mapel}</span>
                    <span class="guru-kelas"><i class="fas fa-users"></i> ${guru.kelas}</span>
                </div>
            </div>
            <div class="gmeet-actions">
                <div class="gmeet-link" title="${guru.link}">
                    <i class="fas fa-link"></i> ${guru.link}
                </div>
                <button class="copy-btn" onclick="copyToClipboard('${guru.link}', 'Link Meet ${guru.nama}')">
                    <i class="fas fa-copy"></i>
                </button>
                <button class="join-btn" onclick="window.open('${guru.link}', '_blank')">
                    <i class="fas fa-video"></i> Join Meet
                </button>
            </div>
        </div>
    `).join('');
}

// Fungsi untuk filter guru
function setupGuruFilter() {
    const filterInput = document.getElementById('guruFilter');
    if (!filterInput) return;

    let timeout;
    filterInput.addEventListener('input', function() {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            renderGuruList(this.value);
        }, 300);
    });
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', function() {
    if (!guruData || guruData.length === 0) {
        console.error('Data guru kosong!');
        return;
    }

    // Jika halaman GMeet aktif, render daftar
    if (document.getElementById('gmeet-page')?.classList.contains('active')) {
        renderGuruList();
        setupGuruFilter();
    }
});

// Navigasi halaman
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId)?.classList.add('active');

    if (pageId === 'gmeet-page') {
        renderGuruList();
        setupGuruFilter();
    }
}

// Fungsi copy link (pastikan ada di global scope)
window.copyToClipboard = function(text, context) {
    navigator.clipboard.writeText(text)
        .then(() => {
            Swal.fire({
                title: 'Berhasil!',
                text: `${context} telah disalin`,
                icon: 'success',
                timer: 2000
            });
        })
        .catch(err => {
            console.error('Gagal menyalin:', err);
        });
};