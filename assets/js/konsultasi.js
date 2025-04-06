// Configuration
const CONFIG = {
    scriptUrl: "https://script.google.com/macros/s/AKfycbxd1hoFgltmOrityjQPPqbXNRVxZkWSpZfy9Mco48A3PTouv0oJU__fs_U7MJ-kLENLtA/exec",
    maxDescLength: 500,
    defaultTime: "09:00"
  };
  
  // Main initialization
  document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('konsultasiForm');
    if (!form) return;
  
    // Convert radio buttons to checkboxes if any
    document.querySelectorAll('.topik-options input[type="radio"]').forEach(radio => {
      radio.type = 'checkbox';
      radio.removeAttribute('required');
    });
  
    // Set default date and time
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
    document.getElementById('jam').value = CONFIG.defaultTime;
  
    // Setup character counter
    const textarea = document.getElementById('deskripsi');
    const counter = document.getElementById('charCount');
    if (textarea && counter) {
      textarea.addEventListener('input', () => {
        counter.textContent = textarea.value.length;
        counter.style.color = textarea.value.length > CONFIG.maxDescLength ? 'red' : '';
      });
      counter.textContent = textarea.value.length; // Initialize counter
    }
  });
  
  // Form submission handler
  window.handleSubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const submitBtn = form.querySelector('button[type="submit"]');
    
    try {
      // Validate form
      const requiredFields = ['orangtuaDari', 'deskripsi', 'tanggal', 'jam'];
      const missingFields = requiredFields.filter(id => !form[id]?.value?.trim());
      
      if (missingFields.length > 0) {
        throw new Error(`Harap isi semua field wajib: ${missingFields.join(', ')}`);
      }
      
      if (form.deskripsi.value.length > CONFIG.maxDescLength) {
        throw new Error(`Deskripsi terlalu panjang (maks ${CONFIG.maxDescLength} karakter)`);
      }
  
      // Disable button during submission
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
  
      // Prepare form data
      const formData = {
        orangtuaDari: form.orangtuaDari.value.trim(),
        topics: Array.from(document.querySelectorAll('.topik-options input[type="checkbox"]:checked'))
                .map(cb => cb.value)
                .join("; ") || "Tidak ada topik dipilih",
        deskripsi: form.deskripsi.value.trim(),
        tanggal: form.tanggal.value,
        jam: form.jam.value
      };
  
      // Show loading indicator
      const swalInstance = Swal.fire({
        title: 'Mengirim data...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
        background: 'var(--primary-color)',
        color: 'white'
      });
  
      // Send data to Google Apps Script
      const response = await fetch(CONFIG.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData)
      });
  
      // Handle JSON parsing carefully
      let result;
      try {
        result = await response.json();
      } catch (jsonError) {
        console.error('JSON parsing error:', jsonError);
        throw new Error('Invalid response from server');
      }
  
      if (!response.ok || result.status !== 'success') {
        throw new Error(result?.message || 'Gagal mengirim formulir');
      }
  
      // Show success message
      await Swal.fire({
        title: 'Berhasil!',
        html: `
          <div style="text-align:left">
            <p>Konsultasi Anda telah terkirim.</p>
            <p><strong>Nomor Referensi:</strong> ${result.refId}</p>
            <p>Anda akan menerima balasan via email dalam 1-2 hari kerja.</p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Mengerti',
        background: 'var(--primary-color)',
        color: 'white'
      });
  
      // Reset form
      form.reset();
      document.getElementById('tanggal').value = new Date().toISOString().split('T')[0];
      document.getElementById('jam').value = CONFIG.defaultTime;
      document.getElementById('charCount').textContent = '0';
      document.querySelectorAll('.topik-options input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
      });
  
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        title: 'Gagal Mengirim',
        text: error.message || 'Terjadi kesalahan saat mengirim formulir',
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        background: 'var(--primary-color)',
        color: 'white'
      });
    } finally {
      // Re-enable button
      const submitBtn = document.querySelector('#konsultasiForm button[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Konsultasi';
      }
    }
  };