/**
 * QR Code Scanner untuk Catatan Peserta Didik
 * Versi 2.1 - Optimized
 */

class QRScanner {
    constructor() {
      this.scanner = null;
      this.isScanning = false;
      this.scanButton = document.querySelector('#catatan-page button[onclick="restartScanner()"]');
      this.init();
    }
  
    async init() {
      try {
        // Periksa ketersediaan library
        if (typeof Html5Qrcode === 'undefined') {
          throw new Error('Library QR Scanner tidak ditemukan');
        }
  
        // Periksa ketersediaan kamera
        const cameras = await Html5Qrcode.getCameras();
        if (!cameras || cameras.length === 0) {
          throw new Error('Tidak ada kamera yang tersedia');
        }
  
        // Siapkan UI
        this.updateButtonState('ready');
        this.setupEventListeners();
  
        // Mulai scanner setelah delay kecil
        setTimeout(() => this.start(), 500);
      } catch (error) {
        this.handleError(error);
      }
    }
  
    setupEventListeners() {
      if (this.scanButton) {
        this.scanButton.addEventListener('click', () => this.restart());
      }
    }
  
    async start() {
      if (this.isScanning) return;
  
      try {
        this.isScanning = true;
        this.updateButtonState('scanning');
  
        this.scanner = new Html5Qrcode('qr-reader');
        
        await this.scanner.start(
          { facingMode: 'environment' },
          { 
            fps: 10,
            qrbox: { width: 250, height: 250 }
          },
          (decodedText) => {
            this.handleScanSuccess(decodedText);
          },
          (errorMessage) => {
            console.warn('QR Scan Error:', errorMessage);
          }
        );
  
        this.updateButtonState('active');
      } catch (error) {
        this.handleError(error);
        this.isScanning = false;
      }
    }
  
    async stop() {
      if (!this.scanner || !this.isScanning) return;
      
      try {
        await this.scanner.stop();
        this.scanner = null;
        this.isScanning = false;
        this.updateButtonState('ready');
      } catch (error) {
        console.error('Error stopping scanner:', error);
      }
    }
  
    async restart() {
      await this.stop();
      this.clearResults();
      await this.start();
    }
  
    handleScanSuccess(decodedText) {
      this.stop();
      this.fetchStudentData(decodedText);
    }
  
    async fetchStudentData(studentId) {
      if (!studentId) return;
  
      this.updateButtonState('loading');
      
      try {
        const response = await fetch(`https://script.google.com/macros/s/AKfycbyQGdHrXfYsMRm74o_SodbMzZp9I1IabVL1y-NA_7a4dx7wQKHwoOfhsb-xmcFrLCfs/exec?id=${studentId}`);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
        this.displayStudentData(data);
      } catch (error) {
        this.handleError(error, 'Gagal mengambil data siswa');
      } finally {
        this.updateButtonState('active');
      }
    }
  
    displayStudentData(response) {
      if (!response || response.status !== 'success' || !response.data) {
        throw new Error('Data siswa tidak valid');
      }
  
      const student = response.data[0];
      const infoContainer = document.getElementById('info-siswa');
      const notesContainer = document.getElementById('list-catatan');
      const resultContainer = document.getElementById('catatan-result');
  
      if (infoContainer && notesContainer && resultContainer) {
        // Tampilkan info siswa
        infoContainer.innerHTML = `
          <p><strong>Nama:</strong> ${student.nama}</p>
          <p><strong>Kelas:</strong> ${student.kelas}</p>
        `;
  
        // Tampilkan catatan
        notesContainer.innerHTML = response.data.map(item => `
          <div class="bg-white bg-opacity-10 rounded p-2">
            <p><strong>${item.tanggal}</strong></p>
            <p>${item.catatan}</p>
          </div>
        `).join('');
  
        // Tampilkan container hasil
        resultContainer.classList.remove('hidden');
      }
    }
  
    clearResults() {
      const infoContainer = document.getElementById('info-siswa');
      const notesContainer = document.getElementById('list-catatan');
      const resultContainer = document.getElementById('catatan-result');
  
      if (infoContainer) infoContainer.innerHTML = '';
      if (notesContainer) notesContainer.innerHTML = '';
      if (resultContainer) resultContainer.classList.add('hidden');
    }
  
    updateButtonState(state) {
      if (!this.scanButton) return;
  
      const states = {
        ready: { text: 'Mulai Scan', icon: 'fa-qrcode', disabled: false },
        scanning: { text: 'Memindai...', icon: 'fa-spinner fa-spin', disabled: true },
        active: { text: 'Ulangi Scan', icon: 'fa-sync-alt', disabled: false },
        loading: { text: 'Memuat...', icon: 'fa-spinner fa-spin', disabled: true }
      };
  
      const currentState = states[state] || states.ready;
      this.scanButton.innerHTML = `<i class="fas ${currentState.icon}"></i> ${currentState.text}`;
      this.scanButton.disabled = currentState.disabled;
    }
  
    handleError(error, customMessage = '') {
      console.error('Scanner Error:', error);
      
      const errorMessage = customMessage || 
        (error.message.includes('camera') ? 'Akses kamera ditolak' : 'Terjadi kesalahan');
      
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: errorMessage,
        footer: 'Pastikan Anda mengizinkan akses kamera dan mencoba lagi'
      });
  
      this.updateButtonState('ready');
      this.isScanning = false;
    }
  }
  
  // Inisialisasi scanner saat halaman siap
  document.addEventListener('DOMContentLoaded', () => {
    // Tunggu hingga semua resource selesai dimuat
    if (document.getElementById('catatan-page')) {
      new QRScanner();
    }
  });
  
  // Fungsi global untuk kompatibilitas dengan HTML
  window.restartScanner = function() {
    const scannerInstance = document.qrScannerInstance;
    if (scannerInstance) {
      scannerInstance.restart();
    }
  };