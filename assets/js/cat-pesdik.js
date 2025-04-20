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
          refreshBtn: document.getElementById('refresh-scan-btn'),
          statusText: document.getElementById('camera-status'),
          resultContainer: document.getElementById('catatan-result'),
          infoSiswa: document.getElementById('info-siswa'),
          listCatatan: document.getElementById('list-catatan'),
          errorDisplay: document.getElementById('scan-error'),
          loadingIndicator: document.getElementById('loading-indicator')
      };
  }

  initEventListeners() {
      this.elements.startBtn.addEventListener('click', () => this.startCamera());
      this.elements.stopBtn.addEventListener('click', () => this.stopCamera());
  }

  async startCamera() {
    try {
        this.clearResults();
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

          const response = await fetch(`https://script.google.com/macros/s/AKfycbz5sG92n77GcsPUJFn1PB-ZpHGpQORTznPCzUNZvt2NPtRKJWrs7jesYmclYaKp1rX6/exec?id=${studentId}`);
          
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
        <div class="note-card" data-expanded="false">
            <div class="note-header">
                <div class="note-date">
                    <i class="fas fa-calendar-day"></i>
                    ${item.tanggal}
                </div>
                <span class="note-label">${item.pr.length > 1 ? item.pr.length + ' PR' : 'Catatan Harian'}</span>
            </div>
        
            <div class="note-grid">
                <!-- Kolom Persiapan -->
                <div class="note-item prep-note">
                    <div class="note-icon">
                        <i class="fas fa-book-open"></i>
                    </div>
                    <div class="note-content">
                        <p class="note-category">Persiapan Belajar</p>
                        <p class="note-value">${item.persiapan}</p>
                    </div>
                </div>
        
                <!-- Kolom Sikap -->
                <div class="note-item attitude-note">
                    <div class="note-icon">
                        <i class="fas fa-user-check"></i>
                    </div>
                    <div class="note-content">
                        <p class="note-category">Sikap di kelas</p>
                        <p class="note-value">${item.sikap}</p>
                    </div>
                </div>
        
                <!-- Kolom Interaksi -->
                <div class="note-item interact-note">
                    <div class="note-icon">
                        <i class="fas fa-comments"></i>
                    </div>
                    <div class="note-content">
                        <p class="note-category">Interaksi Sosial</p>
                        <p class="note-value">${item.interaksi}</p>
                    </div>
                </div>
        
                <!-- Kolom PR dengan Toggle -->
                <div class="note-item pr-note ${item.pr.length > 1 ? 'clickable-pr' : ''}">
                    <div class="note-icon">
                        <i class="fas fa-tasks"></i>
                        ${item.pr.length > 1 ? `<span class="pr-badge">${item.pr.length}</span>` : ''}
                    </div>
                    <div class="note-content">
                        <p class="note-category">PR/Tugas</p>
                        <p class="note-value">${item.pr[0]}</p>
                        ${item.pr.length > 1 ? `<p class="pr-more">+${item.pr.length - 1} lainnya</p>` : ''}
                    </div>
                </div>
            </div>
        
            <!-- Daftar PR Lengkap (Toggle) -->
            <div class="pr-expanded">
                <h4><i class="fas fa-clipboard-list"></i> Daftar PR Lengkap</h4>
                <ul class="pr-list">
                    ${item.pr.map((pr, index) => `
                    <li>
                        <span class="pr-number">${index + 1}.</span>
                        ${pr}
                    </li>
                    `).join('')}
                </ul>
            </div>
        </div>
        `).join('');
        
        // Event listener untuk toggle PR di mobile
        document.querySelectorAll('.clickable-pr').forEach(item => {
            item.addEventListener('click', function(e) {
                if (window.innerWidth <= 768) {
                    e.stopPropagation();
                    const card = this.closest('.note-card');
                    const isExpanded = card.getAttribute('data-expanded') === 'true';
                    card.setAttribute('data-expanded', !isExpanded);
                    card.classList.toggle('expanded', !isExpanded);
                    
                    // Scroll ke card yang dibuka
                    if (!isExpanded) {
                        setTimeout(() => {
                            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                        }, 50);
                    }
                }
            });
        });

    this.elements.resultContainer.classList.remove('hidden');
}

  clearResults() {
    this.elements.infoSiswa.innerHTML = '';
    this.elements.listCatatan.innerHTML = '';
    this.elements.resultContainer.classList.add('hidden');
    this.elements.loadingIndicator.classList.add('hidden');
    this.elements.refreshBtn.classList.add('hidden');
  }

  updateUI({ scanning, statusText, showError, errorMessage }) {
      this.elements.startBtn.classList.toggle('hidden', scanning);
      this.elements.stopBtn.classList.toggle('hidden', !scanning);

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
    if (loading) {
        this.elements.loadingIndicator.classList.remove('hidden');
        this.elements.statusText.textContent = 'Memproses data peserta didik...';
    } else {
        this.elements.loadingIndicator.classList.add('hidden');
    }
    
    // Update tombol seperti sebelumnya
    const btn = loading ? this.elements.stopBtn : this.elements.startBtn;
    if (btn) {
        btn.innerHTML = loading ? 
            '<i class="fas fa-spinner fa-spin"></i> Menunggu kode QR...' : 
            '<i class="fas fa-camera"></i> Scan QR lainnya';
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
    
    // Tampilkan tombol refresh dan sembunyikan tombol lainnya
    this.elements.refreshBtn.classList.remove('hidden');
    this.elements.startBtn.classList.add('hidden');
    this.elements.stopBtn.classList.add('hidden');
    this.elements.retryBtn.classList.add('hidden');
    
    // Sembunyikan loading indicator jika ada
    this.showLoading(false);
}
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('catatan-page')) {
      window.qrScanner = new QRScannerManager();
  }
});
function resetScannerPage() {
    showPage('catatan-page');
    if (window.qrScanner) {
        window.qrScanner.clearResults();
        window.qrScanner.stopCamera().then(() => {
            window.qrScanner.startCamera().catch(console.error);
        }).catch(console.error);
    }
}