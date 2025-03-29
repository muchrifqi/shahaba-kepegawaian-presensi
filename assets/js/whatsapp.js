// =============================================
// CONFIGURASI AWAL
// =============================================
const whatsappConfig = {
    defaultRecipient: '6285951589760', // Nomor admin default
    maxChars: 500, // Batas karakter pesan
    recipients: { // Daftar penerima
      '6285951589760': 'Admin',
      '6285921101260': 'Admin Keuangan',
      '6285710006577': 'Prasekolah (Ibu Nurhayati)',
      '6281227122410': 'SD (Pak Dwi Indo)'
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