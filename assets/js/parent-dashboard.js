// Tambahkan fungsi ini untuk menangani klik menu rekening
function setupMenuActions() {
    document.querySelectorAll('.menu-item').forEach(item => {
        item.addEventListener('click', function(e) {
            if (this.querySelector('i').classList.contains('fas fa-landmark')) {
                e.preventDefault();
                showBankAccountInfo();
            }
        });
    });
}

// Panggil fungsi setup di DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    setupMenuActions();
    // ... fungsi lainnya
});

function checkConnection() {
    if (!navigator.onLine) {
        showOfflineStatus();
    }
}

function showOfflineStatus() {
    // Buat elemen status offline jika belum ada
    let offlineBar = document.getElementById('offline-bar');
    
    if (!offlineBar) {
        offlineBar = document.createElement('div');
        offlineBar.id = 'offline-bar';
        offlineBar.innerHTML = `
            <i class="fas fa-wifi-slash"></i>
            <span>Anda sedang offline</span>
        `;
        document.body.prepend(offlineBar);
    }
    
    offlineBar.style.display = 'flex';
}

function showOnlineStatus() {
    const offlineBar = document.getElementById('offline-bar');
    if (offlineBar) {
        offlineBar.style.display = 'none';
        
        // Tampilkan notifikasi koneksi pulih
        const toast = document.createElement('div');
        toast.className = 'online-toast';
        toast.innerHTML = `
            <i class="fas fa-wifi"></i>
            <span>Koneksi internet pulih</span>
        `;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

function showBankAccountInfo() {
    Swal.fire({
        title: '<span style="color: var(--swal-text-color)">Rekening Sekolah</span>',
        html: `
            <div class="bank-info">
                <div class="bank-item" style="border-left-color:rgb(253, 169, 0);">
                    <div class="bank-icon" style="background-color: #e8f5e9;">
                        <i class="fas fa-university" style="color: rgb(253, 169, 0);"></i>
                    </div>
                    <div class="bank-details">
                        <h4>Bank Syariah Indonesia</h4>
                        <p><strong>No. Rek:</strong> <span class="account-number">8338228113</span></p>
                        <p><strong>a.n:</strong> CV KLINIK EDUKASI SHAHABA</p>
                        <p><strong>Kode Bank:</strong> 451</p>
                        <button class="copy-btn" data-account="8338228113">
                            <i class="fas fa-copy"></i> Salin No. Rekening
                        </button>
                    </div>
                </div>
                
                <div class="bank-item" style="border-left-color:rgb(95, 50, 153);">
                    <div class="bank-icon" style="background-color: #e3f2fd;">
                        <i class="fas fa-university" style="color: rgb(95, 50, 153);"></i>
                    </div>
                    <div class="bank-details">
                        <h4>Bank Muamalat</h4>
                        <p><strong>No. Rek:</strong> <span class="account-number">1210092234</span></p>
                        <p><strong>a.n:</strong> CV KLINIK EDUKASI SHAHABA</p>
                        <p><strong>Kode Bank:</strong> 147</p>
                        <button class="copy-btn" data-account="1210092234">
                            <i class="fas fa-copy"></i> Salin No. Rekening
                        </button>
                    </div>
                </div>
            </div>
        `,
        confirmButtonColor: '#47974a',
        background: 'var(--swal-background-color)',
        customClass: {
            htmlContainer: 'bank-info-container'
        },
        didOpen: () => {
            // Tambahkan event listener untuk tombol salin
            document.querySelectorAll('.copy-btn').forEach(btn => {
                btn.addEventListener('click', function() {
                    const accountNumber = this.getAttribute('data-account');
                    copyToClipboard(accountNumber);
                    
                    // Ubah sementara teks tombol
                    const originalText = this.innerHTML;
                    this.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
                    
                    // Kembalikan setelah 2 detik
                    setTimeout(() => {
                        this.innerHTML = originalText;
                    }, 2000);
                });
            });
        }
    });
}

// Fungsi untuk menyalin teks ke clipboard
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Text copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy text: ', err);
        // Fallback untuk browser lama
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
    });
}
// Dalam file parent-dashboard.js
document.addEventListener('DOMContentLoaded', function() {
    // Temukan semua menu item
    const menuItems = document.querySelectorAll('.menu-item');
    
    // Tambahkan event listener untuk menu rekening
    menuItems.forEach(item => {
        if (item.textContent.includes('Rekening')) {
            item.addEventListener('click', function(e) {
                e.preventDefault(); // Mencegah perilaku default link
                showBankAccountInfo();
            });
        }
    });
});
// INPUT MANUAL DATA PENGUMUMAN DASHBOARD ORANG TUA
const announcements = [
    {
        id: 1,
        title: "Pembayaran SPP bulan April 2025 sudah dapat dilakukan via transfer",
        timestamp: "2025-03-31T10:00:00" // Format ISO 8601
    },
    {
        id: 2,
        title: "Kegiatan Belajar dimulai kembali pada Rabu, 09 April 2025",
        timestamp: "2025-03-30T12:30:00"
    }
];

// Fungsi menghitung waktu lalu
function timeAgo(timestamp) {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    
    const intervals = {
        tahun: 31536000,
        bulan: 2592000,
        minggu: 604800,
        hari: 86400,
        jam: 3600,
        menit: 60
    };
    
    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
            return `${interval} ${unit}${interval === 1 ? '' : ''} lalu`;
        }
    }
    
    return "Baru saja";
}

// Fungsi render pengumuman
function renderAnnouncements() {
    const container = document.getElementById('announcementContainer');
    container.innerHTML = '';
    
    announcements.forEach(announcement => {
        const announcementEl = document.createElement('div');
        announcementEl.className = 'announcement-item';
        announcementEl.innerHTML = `
            <p>${announcement.title}</p>
            <small>${timeAgo(announcement.timestamp)}</small>
        `;
        container.appendChild(announcementEl);
    });
}

// Auto-update setiap 1 jam
function setupAnnouncementAutoUpdate() {
    renderAnnouncements();
    setInterval(renderAnnouncements, 3600000); // Update setiap jam
}

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', setupAnnouncementAutoUpdate);

