// Konfigurasi
const SPREADSHEET_ID = '1Wu2xyoJ0uvKNVRvwHTM0qzknHSv0X63B9FebAHzxGbQ';
const SHEET_NAME = 'Peserta Didik';
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzTpxg1_2wztW4LMhm896yRTBkGHgfBdmbkThwIpLkGHsBqEzfsJx9tDVOy08ECtQkl/exec';

let pesertaDidik = [];

// Ambil data peserta didik
async function fetchPesertaDidik() {
  try {
    const response = await fetch(`${SCRIPT_URL}?action=getData`);
    const data = await response.json();

    if (data.error) throw new Error(data.error);
    pesertaDidik = data.data.filter(pd => pd.nama && pd.kelas);
  } catch (error) {
    console.error('Gagal memuat data:', error);
    Swal.fire({
      title: 'Error',
      text: 'Gagal memuat data peserta didik',
      icon: 'error',
      confirmButtonText: 'OK',
      background: 'var(--primary-color)',
      color: 'white'
    });
  }
}

// Autocomplete nama & kelas
function setupAutocomplete() {
  const namaInput = document.getElementById('nama');
  const kelasInput = document.getElementById('kelas');
  const dropdown = document.getElementById('namaDropdown');

  namaInput.addEventListener('input', function () {
    const input = this.value.toLowerCase();
    if (input.length < 2) {
      dropdown.innerHTML = '';
      dropdown.style.display = 'none';
      return;
    }

    const filtered = pesertaDidik.filter(pd => pd.nama.toLowerCase().includes(input));
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

    document.querySelectorAll('.dropdown-item').forEach(item => {
      item.addEventListener('click', function () {
        namaInput.value = this.getAttribute('data-nama');
        kelasInput.value = this.getAttribute('data-kelas');
        dropdown.style.display = 'none';
      });
    });
  });

  document.addEventListener('click', function (e) {
    if (e.target.id !== 'nama') dropdown.style.display = 'none';
  });
}

// Handle form submit
function setupFormSubmission() {
  const form = document.getElementById('keteranganForm');

  form.addEventListener('submit', async function (e) {
    e.preventDefault();

    const tanggal = document.getElementById('tanggal').value;
    const submitBtn = form.querySelector('button[type="submit"]');

    if (!tanggal) {
      Swal.fire({
        title: 'Peringatan!',
        text: 'Harap isi tanggal terlebih dahulu',
        icon: 'warning',
        confirmButtonText: 'OK',
        background: 'var(--primary-color)',
        color: 'white'
      });
      return;
    }

    // Tampilkan loading di tombol
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

    try {
      const formData = new FormData(form);
      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.status === 'success') {
        await Swal.fire({
          title: 'Berhasil!',
          html: `
            <div style="text-align:left">
              <p>Data izin berhasil dikirim.</p>
              <p><strong>Nama:</strong> ${formData.get('nama')}</p>
              <p><strong>Kelas:</strong> ${formData.get('kelas')}</p>
              <p><strong>Tanggal:</strong> ${formData.get('tanggal')}</p>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Mengerti',
          background: 'var(--primary-color)',
          color: 'white'
        });

        form.reset();
        document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
      } else {
        throw new Error(result.message || 'Gagal mengirim data');
      }
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Gagal Mengirim!',
        text: error.message || 'Terjadi kesalahan saat mengirim data',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        background: 'var(--primary-color)',
        color: 'white'
      });
    } finally {
      // Kembalikan tombol seperti semula
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Izin';
    }
  });
}

// Inisialisasi
document.addEventListener('DOMContentLoaded', async function () {
  await fetchPesertaDidik();
  setupAutocomplete();
  setupFormSubmission();

  document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
});
