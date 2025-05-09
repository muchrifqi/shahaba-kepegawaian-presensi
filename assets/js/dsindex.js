// Page Navigation
function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
}

// WhatsApp Modal
function showWhatsAppModal() {
    document.getElementById('whatsapp-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

function hideWhatsAppModal() {
    document.getElementById('whatsapp-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Character Count for WhatsApp Message
document.getElementById('whatsapp-message').addEventListener('input', function() {
    const count = this.value.length;
    document.getElementById('char-count').textContent = count;
    
    if (count > 500) {
        this.value = this.value.substring(0, 500);
        document.getElementById('char-count').textContent = 500;
    }
});

// Send WhatsApp Message
function sendWhatsAppMessage() {
    const message = document.getElementById('whatsapp-message').value;
    const recipient = document.getElementById('recipient').value;
    
    if (!message.trim()) {
        Swal.fire({
            title: 'Pesan Kosong',
            text: 'Mohon isi pesan terlebih dahulu',
            icon: 'warning',
            confirmButtonColor: '#25bfd3'
        });
        return;
    }
    
    const whatsappUrl = `https://wa.me/${recipient}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    hideWhatsAppModal();
    
    Swal.fire({
        title: 'Berhasil!',
        text: 'Sedang membuka WhatsApp...',
        icon: 'success',
        timer: 2000,
        showConfirmButton: false
    });
}

// Bank Account Info
function showBankAccountInfo() {
    Swal.fire({
        title: 'Informasi Rekening Shahaba',
        html: `
            <div class="bank-info">
                <div class="bank-card" onclick="copyToClipboard('1234567890', 'Muamalat')">
                   <img src="https://www.bankmuamalat.co.id/assets/frontend/images/logo.jpg" alt="Bank Muamalat" class="bank-logo">
                    <div class="bank-details">
                        <p class="account-number">1234567890</p>
                        <p class="account-name">CV Klinik Edukasi Shahaba</p>
                        <span class="copy-hint"><i class="fas fa-copy"></i> Klik untuk menyalin</span>
                    </div>
                </div>
                <div class="bank-card" onclick="copyToClipboard('9876543210', 'BSI')">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a0/Bank_Syariah_Indonesia.svg/2560px-Bank_Syariah_Indonesia.svg.png" alt="BSI" class="bank-logo">
                    <div class="bank-details">
                        <p class="account-number">9876543210</p>
                        <p class="account-name">CV Klinik Edukasi Shahaba</p>
                        <span class="copy-hint"><i class="fas fa-copy"></i> Klik untuk menyalin</span>
                    </div>
                </div>
            </div>
        `,
        showConfirmButton: false,
        showCloseButton: true
    });
}

// Copy to Clipboard
function copyToClipboard(text, context) {
    navigator.clipboard.writeText(text).then(() => {
        Swal.fire({
            title: 'Berhasil Disalin!',
            text: `${context} telah disalin ke clipboard`,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
        });
    }).catch(() => {
        Swal.fire({
            title: 'Gagal Menyalin',
            text: 'Mohon salin secara manual',
            icon: 'error',
            timer: 2000,
            showConfirmButton: false
        });
    });
}

// Submit Attendance
function submitAttendance() {
    const studentName = document.getElementById('student-name').value;
    const studentClass = document.getElementById('student-class').value;
    const attendanceDate = document.getElementById('tanggal').value;
    const attendanceStatus = document.getElementById('attendance-status').value;
    
    if (!studentName || !studentClass || !attendanceDate) {
        Swal.fire({
            title: 'Form Tidak Lengkap',
            text: 'Harap isi semua field yang wajib diisi',
            icon: 'warning',
            confirmButtonColor: '#25bfd3'
        });
        return;
    }
    
    Swal.fire({
        title: 'Konfirmasi',
        html: `Apakah Anda yakin ingin mengirim absensi untuk:<br><b>${studentName}</b>?`,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya, Kirim',
        cancelButtonText: 'Batal',
        confirmButtonColor: '#25bfd3'
    }).then((result) => {
        if (result.isConfirmed) {
            // Simulate API call
            setTimeout(() => {
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Absensi telah dikirim',
                    icon: 'success',
                    timer: 2000,
                    showConfirmButton: false
                }).then(() => {
                    showPage('dashboard-page');
                });
            }, 1000);
        }
    });
}

// Load Announcements
function loadAnnouncements() {
    // Simulate API call delay
    setTimeout(() => {
        const container = document.getElementById('announcement-container');
        container.classList.remove('shimmer');
        container.innerHTML = `
            <div class="announcement-item">
                <h4 class="text-yellow-300">
                    <i class="fas fa-exclamation-circle"></i> Pengumuman Penting!
                </h4>
                <p>Jadwal Ujian Tengah Semester akan dimulai minggu depan. Mohon persiapkan putra/putri Anda.</p>
                <small>20 Maret 2024</small>
            </div>
            <div class="announcement-item">
                <h4>
                    <i class="fas fa-info-circle"></i> Info Kegiatan
                </h4>
                <p>Kegiatan ekstrakurikuler akan diliburkan selama masa ujian.</p>
                <small>19 Maret 2024</small>
            </div>
            <div class="announcement-item">
                <h4>
                    <i class="fas fa-calendar-day"></i> Parent's Day
                </h4>
                <p>Pertemuan orang tua dengan wali kelas akan dilaksanakan pada tanggal 25 Maret 2024.</p>
                <small>18 Maret 2024</small>
            </div>
        `;
    }, 1500);
}

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    loadAnnouncements();
    
    // Set default date for attendance form
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
});

// Inisialisasi EmailJS
emailjs.init('XCyDgWPI6c1YEq8Hg'); // Ganti dengan User ID EmailJS Anda

// Fungsi Handle Submit
function handleSubmit(event) {
    event.preventDefault();
    
    const form = event.target;
    const submitBtn = document.getElementById('submitBtn');
    const deskripsiField = document.getElementById('deskripsi');
    
    // 1. Validasi Form
    const checkedTopics = Array.from(form.elements['topik'])
    .filter(checkbox => checkbox.checked)
    .map(checkbox => checkbox.value);
    
    if(checkedTopics.length === 0) {
    Swal.fire({
        title: 'Peringatan!',
        text: 'Pilih minimal 1 topik konsultasi',
        icon: 'warning'
    });
    return;
    }
    
    // Validasi khusus jika memilih "Lainnya"
    const isLainnyaSelected = checkedTopics.includes('Lainnya');
    if(isLainnyaSelected && !deskripsiField.value.trim()) {
    Swal.fire({
        title: 'Peringatan!',
        text: 'Harap isi deskripsi untuk opsi "Lainnya"',
        icon: 'warning'
    });
    deskripsiField.focus();
    return;
    }

    // 2. Siapkan Data Email
    const templateParams = {
    orangtuaDari: document.getElementById('orangtuaDari').value,
    topik: "• " + checkedTopics.join('\n• '),
    deskripsi: isLainnyaSelected ? deskripsiField.value : '',
    tanggal: new Date(document.getElementById('tanggal').value).toLocaleDateString('id-ID', { 
        weekday: 'long', 
        day: 'numeric', 
        month: 'long', 
        year: 'numeric' 
    }),
    jam: document.getElementById('jam').value + ' WIB',
    current_year: new Date().getFullYear().toString()
};

    // 3. Kirim Email
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fas fa-spinner fa-spin"></i> Mengirim...`;

    emailjs.send('service_wnjhl7q', 'template_egp0vsz', templateParams)
    .then(() => {
        Swal.fire({
        title: 'Berhasil!',
        text: 'Penjadwalan Konsultasi telah dikirim ke Shahaba',
        icon: 'success'
        });
        form.reset();
        document.getElementById('charCount').textContent = 0;
    })
    .catch((error) => {
        Swal.fire({
        title: 'Gagal!',
        text: `Error: ${error.text || 'Gagal mengirim email'}`,
        icon: 'error'
        });
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<i class="fas fa-paper-plane"></i> Kirim`;
    });
}

// Fungsi untuk toggle required pada deskripsi
document.querySelectorAll('input[name="topik"]').forEach(checkbox => {
    checkbox.addEventListener('change', function() {
    const deskripsiGroup = document.getElementById('deskripsi').closest('.form-group');
    const isLainnyaChecked = document.querySelector('input[name="topik"][value="Lainnya"]:checked');
    
    if(isLainnyaChecked) {
        deskripsiGroup.style.display = 'block';
        document.getElementById('deskripsi').setAttribute('required', '');
    } else {
        deskripsiGroup.style.display = 'none';
        document.getElementById('deskripsi').removeAttribute('required');
    }
    });
});

// Hitung karakter deskripsi
document.getElementById('deskripsi').addEventListener('input', function() {
    const count = this.value.length;
    document.getElementById('charCount').textContent = count;
    if(count > 500) {
    this.value = this.value.substring(0, 500);
    document.getElementById('charCount').textContent = 500;
    }
});

// Sembunyikan deskripsi saat load
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('deskripsi').closest('.form-group').style.display = 'none';
});

// Slider Otomatis untuk Foto Besar
let currentSlide = 0;
const slides = document.querySelectorAll('.featured-slide');
const activityTexts = [
    "Field Trip ke Museum Nasional",
    "Lomba Olahraga Antar Kelas", 
    "Praktikum Sains Kelas 5"
];

function showSlide(n) {
    slides.forEach(slide => slide.classList.remove('active'));
    currentSlide = (n + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    document.getElementById('current-activity').textContent = activityTexts[currentSlide];
}

function nextSlide() {
    showSlide(currentSlide + 1);
}

// Mulai slider otomatis (berganti setiap 5 detik)
let slideInterval = setInterval(nextSlide, 5000);

// Hentikan slider saat hover
document.querySelector('.featured-slider').addEventListener('mouseenter', () => {
    clearInterval(slideInterval);
});

// Lanjutkan slider saat mouse leave
document.querySelector('.featured-slider').addEventListener('mouseleave', () => {
    slideInterval = setInterval(nextSlide, 3000);
});

// Inisialisasi slider pertama
showSlide(0);

// Slider foto kecil
document.addEventListener('DOMContentLoaded', function() {
    const slider = document.querySelector('.small-photos-slider');
    
    // Clone foto untuk efek loop tanpa jeda
    const photos = document.querySelectorAll('.small-photo:not(:nth-child(n+3)');
    photos.forEach(photo => {
        const clone = photo.cloneNode(true);
        slider.appendChild(clone);
    });
    
    // Reset animasi saat selesai untuk loop mulus
    slider.addEventListener('animationiteration', () => {
        slider.style.transition = 'none';
        slider.style.transform = 'translateX(0)';
        setTimeout(() => {
            slider.style.transition = 'transform 50s linear';
        }, 10);
    });
});

// Filter Album
document.querySelectorAll('.album-filter-btn').forEach(btn => {
btn.addEventListener('click', function() {
    // Hapus active state dari semua button
    document.querySelectorAll('.album-filter-btn').forEach(b => b.classList.remove('active'));
    // Tambahkan active state ke button yang diklik
    this.classList.add('active');
    
    const category = this.dataset.category;
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
    if (category === 'all' || item.dataset.category === category) {
        item.style.display = 'block';
    } else {
        item.style.display = 'none';
    }
    });
});
});

document.addEventListener('DOMContentLoaded', function() {
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    const img = item.querySelector('img');
    
    img.onload = function() {
    const aspectRatio = img.naturalWidth / img.naturalHeight;
    
    // Sesuaikan grid span berdasarkan rasio aspek
    if (aspectRatio > 1.5) {
        item.style.gridColumn = 'span 2'; // Gambar landscape (lebar)
    } else if (aspectRatio < 0.8) {
        item.style.gridRow = 'span 2'; // Gambar portrait (tinggi)
    }
    };
});
});

// Float
const floatBtn = document.getElementById('announcement-float-btn');

// Step 1: Initial attention grab
floatBtn.classList.add('animate');
setTimeout(() => {
  floatBtn.classList.remove('animate');
  
  // Step 2: Show text after animation
  setTimeout(() => {
    floatBtn.classList.add('show-text');
    
    // Step 3: Hide text after 3 seconds
    setTimeout(() => {
      floatBtn.classList.remove('show-text');
      floatBtn.classList.add('hide-text');
      
      // Reset for hover state
      setTimeout(() => {
        floatBtn.classList.remove('hide-text');
      }, 300);
    }, 3000);
  }, 500);
}, 1000);

// Scroll function
floatBtn.addEventListener('click', () => {
  document.getElementById('announcement-container').scrollIntoView({ 
    behavior: 'smooth' 
  });
});

// Fungsi untuk mengecek dan menyembunyikan floating button
function updateButtonVisibility() {
    const floatBtn = document.getElementById('announcement-float-btn');
    const currentPage = document.querySelector('.page.active').id;
    
    // Sembunyikan jika bukan di halaman dashboard
    if (currentPage !== 'dashboard-page') {
      floatBtn.classList.add('hidden');
    } else {
      floatBtn.classList.remove('hidden');
    }
  }
  
  // Panggil fungsi saat:
  // 1. Halaman pertama kali load
  document.addEventListener('DOMContentLoaded', updateButtonVisibility);
  
  // 2. Setiap kali berpindah halaman
  function showPage(pageId) {
    // Kode existing Anda untuk berpindah halaman...
    
    // Tambahkan ini di akhir fungsi
    updateButtonVisibility();
  }
  // Jaga posisi konstan
function setFixedPosition() {
    const btn = document.getElementById('announcement-float-btn');
    const viewportHeight = window.innerHeight;
    btn.style.bottom = (viewportHeight * 0.85) + 'px'; // Selalu % dari viewport
  }
  
  window.addEventListener('load', setFixedPosition);
  window.addEventListener('resize', setFixedPosition);

  //lazy loading menu item
  document.addEventListener('DOMContentLoaded', () => {
    const menuItems = document.querySelectorAll('.menu-item');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1
    });
  
    menuItems.forEach((item, i) => {
      item.style.transitionDelay = `${i * 100}ms`;
      observer.observe(item);
    });
  });
  
// Fungsi untuk mendeteksi iOS
function isIOSDevice() {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  ) && !window.MSStream;
}

// Fungsi untuk mengatur background khusus iOS
function setIOSBackground() {
  if (isIOSDevice()) {
    document.documentElement.classList.add('ios-device');
  }
}

// Fungsi khusus untuk iOS
function iOSSpecificFunction() {
  console.log('Perangkat iOS terdeteksi, menjalankan fungsi khusus...');
  // Tambahkan kode khusus iOS Anda di sini
  
  // Contoh: Tampilkan instruksi instalasi
  const prompt = document.createElement('div');
  prompt.innerHTML = `
   <div id="ios-install-prompt" class="ios-prompt">
  <div class="prompt-container">
    <div class="prompt-header">
      <h2 class="prompt-title">Tambahkan ke Layar Utama</h2>
      <p class="prompt-subtitle">Untuk pengalaman seperti aplikasi native dengan akses instan</p>
    </div>
    
    <div class="icon-flow">
      <!-- Ikon Share Safari iOS 18-style -->
      <svg viewBox="0 0 24 24" class="ios-share-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24">
      <!-- Panah naik -->
      <path d="M12 12V4" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
      <path d="M8 8l4-4 4 4" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
      
      <!-- Kotak terbuka -->
      <path d="M5 12v6a2 2 0 002 2h10a2 2 0 002-2v-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" fill="none"/>
      </svg>
      <span class="ios-arrow">→</span>
      <!-- Ikon Add iOS 18 style -->
      <svg viewBox="0 0 24 24" class="ios-add-icon" xmlns="http://www.w3.org/2000/svg">
        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" fill="none" stroke="currentColor" stroke-width="2"/>
        <line x1="12" y1="7" x2="12" y2="17" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
        <line x1="7" y1="12" x2="17" y2="12" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
      </svg>
    </div>
    
    <div class="steps-container">
      <div class="step">
        <div class="step-number">1</div>
        <div class="step-content">
          <div class="step-text">Tekan ikon <strong>Bagikan</strong> di bilah menu</div>
          <div class="step-note">Di bagian bawah layar Safari</div>
        </div>
      </div>
      
      <div class="step">
        <div class="step-number">2</div>
        <div class="step-content">
          <div class="step-text">Pilih <strong>"Tambahkan ke Layar Utama"</strong></div>
        </div>
      </div>
      
      <div class="step">
        <div class="step-number">3</div>
        <div class="step-content">
          <div class="step-text">Konfirmasi dengan menekan <strong>Tambah</strong></div>
        </div>
      </div>
    </div>
    
    <button id="understand-btn" class="understand-btn">
      <svg class="check-icon" viewBox="0 0 24 24">
        <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/>
      </svg>
      Mengerti
    </button>
  </div>
</div>

<style>
:root {
  --ios-blue: #0A84FF;
  --ios-dark-blue: #007AFF;
  --ios-gray: #8E8E93;
  --ios-light-gray: #E5E5EA;
  --ios-dark-bg: #1C1C1E;
  --ios-dark-text: #F2F2F7;
}

.ios-prompt {
  position: fixed;
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  background-color: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
  padding: 24px;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', sans-serif;
  z-index: 10000;
  animation: slideUp 0.4s cubic-bezier(0.22, 1, 0.36, 1);
  max-width: 380px;
  width: calc(100% - 40px);
  margin-bottom: 20px;
  border: 1px solid var(--ios-light-gray);
}

@keyframes slideUp {
  from {
    transform: translate(-50%, 100%);
    opacity: 0;
  }
  to {
    transform: translate(-50%, 0);
    opacity: 1;
  }
}

.prompt-header {
  text-align: center;
  margin-bottom: 20px;
}

.prompt-title {
  font-size: 20px;
  font-weight: 600;
  color: #000;
  margin: 0 0 4px 0;
  letter-spacing: -0.2px;
}

.prompt-subtitle {
  font-size: 14px;
  color: var(--ios-gray);
  margin: 0;
  line-height: 1.4;
}

.icon-flow {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin: 20px 0;
  padding: 12px 0;
}

.ios-share-icon, .ios-add-icon {
  width: 44px;
  height: 44px;
  padding: 10px;
  background-color: var(--ios-light-gray);
  border-radius: 12px;
}

.ios-share-icon {
  color: var(--ios-blue);
}

.ios-add-icon {
  color: #34C759;
}

.ios-arrow {
  font-size: 24px;
  color: var(--ios-gray);
  margin: 0 8px;
}

.steps-container {
  margin-bottom: 20px;
}

.step {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
  align-items: flex-start;
}

.step-number {
  background-color: var(--ios-blue);
  color: white;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 500;
  flex-shrink: 0;
}

.step-content {
  flex-grow: 1;
}

.step-text {
  font-size: 15px;
  color: #000;
  line-height: 1.4;
}

.step-note {
  font-size: 13px;
  color: var(--ios-gray);
  margin-top: 4px;
}

.understand-btn {
  width: 100%;
  background-color: var(--ios-blue);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.understand-btn:hover {
  background-color: var(--ios-dark-blue);
}

.check-icon {
  width: 20px;
  height: 20px;
}

/* Dark Mode */
@media (prefers-color-scheme: dark) {
  .ios-prompt {
    background-color: var(--ios-dark-bg);
    border-color: #2C2C2E;
  }

  .prompt-title, .step-text {
    color: var(--ios-dark-text);
  }

  .prompt-subtitle, .step-note {
    color: #AEAEB2;
  }

  .icon-flow {
    background-color: transparent;
  }

  .ios-share-icon, .ios-add-icon {
    background-color: #2C2C2E;
  }

  .understand-btn {
    background-color: var(--ios-blue);
  }
}
</style>
  `;
  
  document.body.appendChild(prompt);
  
  // ✅ Pasang event listener di sini, setelah tombol sudah ada di DOM
  document.getElementById('understand-btn').addEventListener('click', function () {
    document.getElementById('ios-install-prompt').remove();
  });
}

// Menambahkan pengaturan background iOS saat perangkat terdeteksi
setIOSBackground();

  // Jalankan saat DOM sudah siap
  window.addEventListener('DOMContentLoaded', () => {
    if (isIOSDevice()) {
      setTimeout(() => {
        setIOSBackground();  // Mengatur background untuk iOS
        iOSSpecificFunction();  // Menampilkan popup
      }, 3000);
    }
  });
  
// Navbar
function navigateToPage(pageId, button) {
  // Sembunyikan semua halaman
  document.querySelectorAll('.page').forEach(page => {
    page.classList.remove('active');
  });

  // Tampilkan halaman yang dituju
  const targetPage = document.getElementById(pageId);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Reset semua tombol navbar
  document.querySelectorAll('.navbar-button').forEach(btn => {
    btn.classList.remove('active');
  });

  // Tandai tombol aktif
  button.classList.add('active');
}
