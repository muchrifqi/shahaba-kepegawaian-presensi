class QRScannerManager {
  constructor() {
      this.scanner = null;
      this.cameraAllowed = false;
      this.initElements();
      this.initEventListeners();
  }

  initElements() {
      this.elements = {
          qrReader: document.getElementById('qr-reader'),
          startBtn: document.getElementById('start-scan-btn'),
          stopBtn: document.getElementById('stop-scan-btn'),
          retryBtn: document.getElementById('retry-scan-btn'),
          statusText: document.getElementById('camera-status'),
          resultContainer: document.getElementById('catatan-result'),
          infoSiswa: document.getElementById('info-siswa'),
          listCatatan: document.getElementById('list-catatan'),
          errorDisplay: document.getElementById('scan-error')
      };
  }

  initEventListeners() {
      this.elements.startBtn.addEventListener('click', () => this.startCamera());
      this.elements.stopBtn.addEventListener('click', () => this.stopCamera());
      this.elements.retryBtn.addEventListener('click', () => this.restartScanner());
  }

  async startCamera() {
      try {
          this.showLoading(true);
          
          this.scanner = new Html5Qrcode('qr-reader');
          this.elements.qrReader.style.display = 'block';
          
          await this.scanner.start(
              { facingMode: 'environment' },
              { 
                  fps: 10,
                  qrbox: 250,
                  rememberLastUsedCamera: true
              },
              (decodedText) => this.handleScanSuccess(decodedText),
              (error) => console.warn('QR Scan Error:', error)
          );

          this.updateUI({
              scanning: true,
              statusText: 'Kamera aktif - Arahkan ke QR Code',
              showError: false
          });

      } catch (error) {
          this.handleError(error);
      } finally {
          this.showLoading(false);
      }
  }

  async stopCamera() {
      try {
          if (this.scanner) {
              await this.scanner.stop();
              this.scanner = null;
          }
          this.elements.qrReader.style.display = 'none';
          this.updateUI({
              scanning: false,
              statusText: 'Kamera dimatikan',
              showError: false
          });
      } catch (error) {
          console.error('Error stopping camera:', error);
      }
  }

  async restartScanner() {
      await this.stopCamera();
      this.clearResults();
      await this.startCamera();
  }

  handleScanSuccess(decodedText) {
      this.stopCamera();
      this.fetchStudentData(decodedText);
  }

  async fetchStudentData(studentId) {
      try {
          this.showLoading(true);
          this.updateUI({
              statusText: 'Mengambil data peserta didik...',
              showError: false
          });

          const response = await fetch(`https://script.google.com/macros/s/AKfycbwvEqLysbc20BlLNN4CByvUUZrdXY0IMsyXOYU9j_Bh_b26Xtuk7GSDUCbxqcgeAwwv/exec?id=${studentId}`);
          
          if (!response.ok) {
              throw new Error(`Gagal mengambil data: ${response.status}`);
          }

          const result = await response.json();
          
          if (result.status !== "success") {
              throw new Error(result.message || 'Data tidak ditemukan');
          }

          this.displayStudentData(result);

      } catch (error) {
          this.handleError(error);
      } finally {
          this.showLoading(false);
      }
  }

  displayStudentData(response) {
    if (!response.data || response.data.length === 0) {
        throw new Error('Tidak ada catatan untuk Ananda.');
    }

    const student = response.data[0];
    
    // Info siswa
    this.elements.infoSiswa.innerHTML = `
    <div class="student-info-card">
        <div class="student-avatar">
            <i class="fas fa-user-graduate"></i>
        </div>
        <div class="student-details">
            <h3>${student.nama}</h3>
            <p><i class="fas fa-chalkboard"></i> ${student.kelas}</p>
        </div>
    </div>
    `;

    // Catatan sikap
    this.elements.listCatatan.innerHTML = response.data.map(item => `
    <div class="note-card">
        <div class="note-header">
            <div class="note-date">
                <i class="fas fa-calendar-day"></i>
                ${item.tanggal}
            </div>
            <span class="note-label">Catatan Sikap</span>
        </div>

        <div class="note-grid">
            <div class="note-item prep-note">
                <div class="note-icon">
                    <i class="fas fa-book-open"></i>
                </div>
                <div class="note-content">
                    <p class="note-category">Persiapan Belajar</p>
                    <p class="note-value">${item.persiapan || '-'}</p>
                </div>
            </div>

            <div class="note-item attitude-note">
                <div class="note-icon">
                    <i class="fas fa-user-check"></i>
                </div>
                <div class="note-content">
                    <p class="note-category">Sikap di Kelas</p>
                    <p class="note-value">${item.sikap || '-'}</p>
                </div>
            </div>

            <div class="note-item interact-note">
                <div class="note-icon">
                    <i class="fas fa-comments"></i>
                </div>
                <div class="note-content">
                    <p class="note-category">Interaksi Sosial</p>
                    <p class="note-value">${item.interaksi || '-'}</p>
                </div>
            </div>
        </div>
    </div>
    `).join('');

    this.elements.resultContainer.classList.remove('hidden');
}

  clearResults() {
      this.elements.infoSiswa.innerHTML = '';
      this.elements.listCatatan.innerHTML = '';
      this.elements.resultContainer.classList.add('hidden');
  }

  updateUI({ scanning, statusText, showError, errorMessage }) {
      this.elements.startBtn.classList.toggle('hidden', scanning);
      this.elements.stopBtn.classList.toggle('hidden', !scanning);
      this.elements.retryBtn.classList.toggle('hidden', !scanning);

      if (statusText) {
          this.elements.statusText.textContent = statusText;
          this.elements.statusText.style.color = scanning ? '#4CAF50' : '#9CA3AF';
      }

      this.elements.errorDisplay.classList.toggle('hidden', !showError);
      if (errorMessage) {
          this.elements.errorDisplay.innerHTML = `
              <i class="fas fa-exclamation-circle mr-1"></i> ${errorMessage}
          `;
      }
  }

  showLoading(loading) {
      const btn = loading ? this.elements.stopBtn : this.elements.startBtn;
      if (btn) {
          btn.innerHTML = loading ? 
              '<i class="fas fa-spinner fa-spin"></i> Memproses...' : 
              '<i class="fas fa-camera"></i> Aktifkan Kamera';
          btn.disabled = loading;
      }
  }

  handleError(error) {
      console.error('Error:', error);
      let userMessage = error.message || 'Terjadi kesalahan';
      
      this.updateUI({
          showError: true,
          errorMessage: userMessage,
          statusText: 'Terjadi kesalahan'
      });
  }
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catatan-page')) {
      window.qrScanner = new QRScannerManager();
  }
});