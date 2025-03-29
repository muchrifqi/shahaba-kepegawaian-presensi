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
document.addEventListener('DOMContentLoaded', function() {
    // Simulasi data pengumuman
    const announcements = [
        {
            title: "Pembayaran SPP bulan Juni sudah dapat dilakukan via transfer",
            time: "2 hari lalu"
        },
        {
            title: "Libur semester ganjil dimulai 15 Desember 2025",
            time: "1 minggu lalu"
        }
    ];
    
    // Render pengumuman
    renderAnnouncements(announcements);
    
    // Cek koneksi
    checkConnection();
    
    // Event listener untuk offline/online
    window.addEventListener('offline', showOfflineStatus);
    window.addEventListener('online', showOnlineStatus);
});

function renderAnnouncements(announcements) {
    const container = document.querySelector('.announcement-card');
    if (!container) return;
    
    // Kosongkan konten setelah judul
    const existingItems = container.querySelectorAll('.announcement-item');
    existingItems.forEach(item => item.remove());
    
    // Tambahkan pengumuman baru
    announcements.forEach(announcement => {
        const item = document.createElement('div');
        item.className = 'announcement-item';
        item.innerHTML = `
            <p>${announcement.title}</p>
            <small>${announcement.time}</small>
        `;
        container.appendChild(item);
    });
}

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
                <div class="bank-item" style="border-left-color: #47974a;">
                    <div class="bank-icon" style="background-color: #e8f5e9;">
                        <i class="fas fa-university" style="color: #47974a;"></i>
                    </div>
                    <div class="bank-details">
                        <h4>Bank Syariah Indonesia</h4>
                        <p><strong>No. Rek:</strong> <span class="account-number">1234567890</span></p>
                        <p><strong>a.n:</strong> SD Shahaba</p>
                        <p><strong>Kode Bank:</strong> 451</p>
                        <button class="copy-btn" data-account="1234567890">
                            <i class="fas fa-copy"></i> Salin No. Rekening
                        </button>
                    </div>
                </div>
                
                <div class="bank-item" style="border-left-color: #2196f3;">
                    <div class="bank-icon" style="background-color: #e3f2fd;">
                        <i class="fas fa-university" style="color: #2196f3;"></i>
                    </div>
                    <div class="bank-details">
                        <h4>Bank Mandiri</h4>
                        <p><strong>No. Rek:</strong> <span class="account-number">0987654321</span></p>
                        <p><strong>a.n:</strong> SD Shahaba</p>
                        <p><strong>Kode Bank:</strong> 008</p>
                        <button class="copy-btn" data-account="0987654321">
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
// =============================================
// CONFIGURASI AWAL
// =============================================
const whatsappConfig = {
    defaultRecipient: '6281234567890', // Nomor admin default
    maxChars: 500, // Batas karakter pesan
    recipients: { // Daftar penerima
      '6281234567890': 'Admin Sekolah (Bpk. Ahmad)',
      '6289876543210': 'Wali Kelas (Ibu Siti)',
      '6281122334455': 'Bendahara (Ibu Rina)'
    }
  };
  
  // =============================================
  // INISIALISASI ELEMEN
  // =============================================
  const elements = {
    modal: document.getElementById('whatsappModal'),
    content: document.querySelector('.modal-content'),
    messageInput: document.getElementById('whatsappMessage'),
    charCount: document.getElementById('charCount'),
    recipientSelect: document.getElementById('recipient'),
    cancelBtn: document.getElementById('cancelButton'),
    sendBtn: document.getElementById('sendWhatsAppButton'),
    chatBtn: document.getElementById('whatsappChatButton'),
    closeBtn: document.querySelector('.close-modal')
  };
  
  // =============================================
  // FUNGSI UTAMA
  // =============================================
  
  /**
   * Inisialisasi semua event listeners
   */
  function initWhatsAppModal() {
    // Buka modal saat tombol chat diklik
    elements.chatBtn.addEventListener('click', openModal);
    
    // Tutup modal
    elements.closeBtn.addEventListener('click', closeModal);
    elements.cancelBtn.addEventListener('click', closeModal);
    
    // Kirim pesan
    elements.sendBtn.addEventListener('click', sendMessage);
    
    // Hitung karakter
    elements.messageInput.addEventListener('input', updateCharCount);
    
    // Tutup modal saat klik di luar konten
    elements.modal.addEventListener('click', (e) => {
      if (e.target === elements.modal) closeModal();
    });
    
    // Isi dropdown penerima
    populateRecipients();
    
    // Load draft terakhir jika ada
    loadDraft();
  }
  
  /**
   * Buka modal dengan animasi
   */
  function openModal(e) {
    e.preventDefault();
    
    elements.modal.style.display = 'flex';
    setTimeout(() => {
      elements.modal.classList.add('show');
      elements.messageInput.focus();
    }, 10);
    
    // Track event analytics (optional)
    console.log('WhatsApp modal opened');
  }
  
  /**
   * Tutup modal dengan animasi
   */
  function closeModal() {
    // Simpan draft sebelum ditutup
    saveDraft();
    
    elements.modal.classList.remove('show');
    setTimeout(() => {
      elements.modal.style.display = 'none';
    }, 300);
  }
  
  /**
   * Kirim pesan ke WhatsApp
   */
  function sendMessage() {
    const message = elements.messageInput.value.trim();
    const recipient = elements.recipientSelect.value;
    
    // Validasi
    if (!message) {
      showAlert('Silakan tulis pesan terlebih dahulu', 'error');
      elements.messageInput.focus();
      return;
    }
    
    if (message.length > whatsappConfig.maxChars) {
      showAlert(`Pesan terlalu panjang (maksimal ${whatsappConfig.maxChars} karakter)`, 'error');
      return;
    }
    
    // Encode pesan untuk URL
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${recipient}?text=${encodedMessage}`;
    
    // Buka WhatsApp
    window.open(whatsappUrl, '_blank');
    
    // Reset dan tutup
    resetForm();
    closeModal();
    
    // Track event (optional)
    console.log('Message sent to:', recipient);
  }
  
  // =============================================
  // FUNGSI PENDUKUNG
  // =============================================
  
  /**
   * Update karakter counter
   */
  function updateCharCount() {
    const count = elements.messageInput.value.length;
    elements.charCount.textContent = count;
    
    // Ubah warna jika melebihi batas
    if (count > whatsappConfig.maxChars) {
      elements.charCount.style.color = '#ff4444';
      elements.messageInput.style.borderColor = '#ff4444';
    } else {
      elements.charCount.style.color = '#777';
      elements.messageInput.style.borderColor = '#25D366';
    }
    
    // Auto-save draft setiap ketik
    saveDraft();
  }
  
  /**
   * Isi dropdown penerima
   */
  function populateRecipients() {
    let options = '';
    for (const [number, label] of Object.entries(whatsappConfig.recipients)) {
      options += `<option value="${number}">${label}</option>`;
    }
    elements.recipientSelect.innerHTML = options;
  }
  
  /**
   * Simpan pesan ke localStorage sebagai draft
   */
  function saveDraft() {
    const draft = {
      message: elements.messageInput.value,
      recipient: elements.recipientSelect.value,
      timestamp: new Date().getTime()
    };
    localStorage.setItem('whatsappDraft', JSON.stringify(draft));
  }
  
  /**
   * Load draft dari localStorage
   */
  function loadDraft() {
    const saved = localStorage.getItem('whatsappDraft');
    if (saved) {
      const draft = JSON.parse(saved);
      
      // Hanya load jika kurang dari 1 jam yang lalu
      const oneHourAgo = Date.now() - (60 * 60 * 1000);
      if (draft.timestamp > oneHourAgo) {
        elements.messageInput.value = draft.message;
        elements.recipientSelect.value = draft.recipient;
        updateCharCount();
      } else {
        localStorage.removeItem('whatsappDraft');
      }
    }
  }
  
  /**
   * Reset form ke keadaan awal
   */
  function resetForm() {
    elements.messageInput.value = '';
    elements.recipientSelect.value = whatsappConfig.defaultRecipient;
    updateCharCount();
  }
  
  /**
   * Tampilkan alert (bisa diganti dengan SweetAlert)
   */
  function showAlert(message, type = 'info') {
    alert(message); // Ganti dengan library notifikasi jika perlu
  }
  
  // =============================================
  // INISIALISASI SAAT HALAMAN DIMUAT
  // =============================================
  document.addEventListener('DOMContentLoaded', initWhatsAppModal);
  
  // =============================================
  // FUNGSI TAMBAHAN UNTUK PENGEMBANGAN
  // =============================================
  
  /**
   * Contoh fungsi untuk analytics (optional)
   */
  function trackEvent(eventName, payload = {}) {
    if (typeof gtag !== 'undefined') {
      gtag('event', eventName, payload);
    }
    console.log('Event tracked:', eventName, payload);
  }
  
  /**
   * Contoh validasi nomor WhatsApp
   */
  function isValidWhatsAppNumber(number) {
    return /^[1-9][0-9]{9,14}$/.test(number);
  }