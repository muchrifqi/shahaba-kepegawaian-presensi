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
          throw new Error('Tidak ada data untuk siswa ini');
      }

      const student = response.data[0];
      
      // Tampilkan info dasar siswa
      this.elements.infoSiswa.innerHTML = `
          <p><strong>Nama:</strong> ${student.nama}</p>
          <p><strong>Kelas:</strong> ${student.kelas}</p>
      `;

      // Tampilkan catatan sikap
      this.elements.listCatatan.innerHTML = response.data.map(item => `
      <div class="bg-opacity-10 border border-white/20 backdrop-blur rounded-xl p-4 mb-4 shadow-md">
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2 text-base text-yellow-300 font-bold">
            <i class="fas fa-calendar-alt"></i>
            <span>${item.tanggal}</span>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-white mt-3">
          <div class="flex items-start gap-2">
            <i class="fas fa-book-open text-yellow-400 mt-1"></i>
            <div>
              <p class="font-semibold text-gray-200">Persiapan</p>
              <p>${item.persiapan}</p>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <i class="fas fa-user-check text-green-400 mt-1"></i>
            <div>
              <p class="font-semibold text-gray-200">Sikap</p>
              <p>${item.sikap}</p>
            </div>
          </div>

          <div class="flex items-start gap-2">
            <i class="fas fa-comments text-blue-400 mt-1"></i>
            <div>
              <p class="font-semibold text-gray-200">Interaksi</p>
              <p>${item.interaksi}</p>
            </div>
          </div>
        </div>
      </div>


      `).join('');

      this.elements.resultContainer.classList.remove('hidden');
      this.updateUI({
          statusText: 'Data berhasil dimuat',
          showError: false
      });
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