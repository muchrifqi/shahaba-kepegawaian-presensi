// Konfigurasi
const SPREADSHEET_ID = '1Wu2xyoJ0uvKNVRvwHTM0qzknHSv0X63B9FebAHzxGbQ';
const SHEET_NAME = 'Peserta Didik'; // Ganti dengan nama sheet yang berisi data peserta didik
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTpxg1_2wztW4LMhm896yRTBkGHgfBdmbkThwIpLkGHsBqEzfsJx9tDVOy08ECtQkl/exec'; // URL Google Apps Script

// Variabel global untuk menyimpan data peserta didik
let pesertaDidik = [];

// Fungsi untuk mengambil data dari Google Spreadsheet 
async function fetchPesertaDidik() {
    try {
      const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTpxg1_2wztW4LMhm896yRTBkGHgfBdmbkThwIpLkGHsBqEzfsJx9tDVOy08ECtQkl/exec'; // Ganti dengan URL deploy Anda
      const response = await fetch(`${SCRIPT_URL}?action=getData`);
      const data = await response.json();
      
      if (data.error) throw new Error(data.error);
      
      pesertaDidik = data.data.filter(pd => pd.nama && pd.kelas);
      console.log('Data peserta didik:', pesertaDidik);
      
    } catch (error) {
      console.error('Gagal memuat data:', error);
      // [SWAL 1] - Error saat load data peserta didik
      Swal.fire({
        title: 'Error',
        text: 'Gagal memuat data peserta didik',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'swal2-popup',
          title: 'swal2-title',
          confirmButton: 'swal2-confirm'
        }
      });
    }
  }

// Fungsi untuk menangani autocomplete
function setupAutocomplete() {
    const namaInput = document.getElementById('nama');
    const kelasInput = document.getElementById('kelas');
    const dropdown = document.getElementById('namaDropdown');
    
    namaInput.addEventListener('input', function() {
        const input = this.value.toLowerCase();
        
        if (input.length < 2) {
            dropdown.innerHTML = '';
            dropdown.style.display = 'none';
            return;
        }
        
        const filtered = pesertaDidik.filter(pd => 
            pd.nama.toLowerCase().includes(input)
        );
        
        if (filtered.length === 0) {
            dropdown.innerHTML = '<div class="dropdown-item">Tidak ditemukan</div>';
            dropdown.style.display = 'block';
            return;
        }
        
        dropdown.innerHTML = filtered.slice(0, 5).map(pd => 
            `<div class="dropdown-item" data-nama="${pd.nama}" data-kelas="${pd.kelas}">
                ${pd.nama} (Kelas ${pd.kelas})
            </div>`
        ).join('');
        
        dropdown.style.display = 'block';
        
        // Tambahkan event listener untuk setiap item dropdown
        document.querySelectorAll('.dropdown-item').forEach(item => {
            item.addEventListener('click', function() {
                namaInput.value = this.getAttribute('data-nama');
                kelasInput.value = this.getAttribute('data-kelas');
                dropdown.style.display = 'none';
            });
        });
    });
    
    // Sembunyikan dropdown saat klik di luar
    document.addEventListener('click', function(e) {
        if (e.target.id !== 'nama') {
            dropdown.style.display = 'none';
        }
    });
}

// Fungsi untuk mengirim form dengan SweetAlert2 yang ditingkatkan
function setupFormSubmission() {
    const form = document.getElementById('keteranganForm');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Validasi tanggal
        const tanggal = document.getElementById('tanggal').value;
        if (!tanggal) {
            // [SWAL 2] - Validasi tanggal kosong
            Swal.fire({
                title: 'Peringatan!',
                text: 'Harap isi tanggal terlebih dahulu',
                icon: 'warning',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title',
                    confirmButton: 'swal2-confirm'
                }
            });
            return;
        }
        
        // [SWAL 3] - Tampilkan loading saat mengirim data
        Swal.fire({
            title: 'Mengirim data...',
            html: 'Harap tunggu sebentar',
            allowOutsideClick: false,
            didOpen: () => {
                Swal.showLoading();
            },
            customClass: {
                popup: 'swal2-popup'
            }
        });
        
        try {
            const formData = new FormData(form);
            
            const response = await fetch(SCRIPT_URL, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.status === 'success') {
                // [SWAL 4] - Notifikasi sukses
                Swal.fire({
                    title: 'Berhasil!',
                    text: 'Data keterangan berhasil dikirim',
                    icon: 'success',
                    confirmButtonText: 'OK',
                    customClass: {
                        popup: 'swal2-popup',
                        title: 'swal2-title',
                        confirmButton: 'swal2-confirm'
                    }
                });
                form.reset();
            } else {
                throw new Error(result.message || 'Gagal mengirim data');
            }
        } catch (error) {
            console.error('Error:', error);
            // [SWAL 5] - Notifikasi error
            Swal.fire({
                title: 'Gagal!',
                text: error.message || 'Terjadi kesalahan saat mengirim data',
                icon: 'error',
                confirmButtonText: 'OK',
                customClass: {
                    popup: 'swal2-popup',
                    title: 'swal2-title',
                    confirmButton: 'swal2-confirm'
                }
            });
        }
    });
}

// Inisialisasi saat halaman dimuat
document.addEventListener('DOMContentLoaded', async function() {
    await fetchPesertaDidik();
    setupAutocomplete();
    setupFormSubmission();
    
    // Set tanggal default ke hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
});