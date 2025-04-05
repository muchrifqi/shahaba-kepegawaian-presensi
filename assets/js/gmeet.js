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
                <button class="join-btn" onclick="window.open('${guru.link}', '_blank')">
                    <i class="fas fa-video"></i> Join Meet
                </button>
            </div>
        </div>
    `).join('');
    `<button class="copy-btn" onclick="copyToClipboard('${guru.link}', 'Link Meet ${guru.nama}')">
    <i class="fas fa-copy"></i>
</button>`
}

// Fungsi untuk filter guru
function setupGuruFilter() {
    const filterInput = document.getElementById('guruFilter');
    filterInput.addEventListener('input', function() {
        renderGuruList(this.value);
    });
}

// Inisialisasi saat halaman GMeet dimuat
document.getElementById('gmeet-page').addEventListener('DOMContentLoaded', function() {
    renderGuruList();
    setupGuruFilter();
});

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    
    // Jika halaman GMeet yang aktif, render daftar guru
    if (pageId === 'gmeet-page') {
        renderGuruList();
    }
}