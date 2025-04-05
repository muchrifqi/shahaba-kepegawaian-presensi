// konsultasi.js
document.addEventListener('DOMContentLoaded', function() {
    // URL Google Apps Script (Ganti dengan URL deploy Anda)
    const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbyrH7xTGYSjSkhwXe5lxRzCZFo-5OOMr8qpiUOJOygAEXM-SNq8Z_YjZ6G4JCnjOLTnlg/exec";
    
    // Inisialisasi Form
    initForm();
    
    // Setup karakter counter
    setupCharCounter();
});

function initForm() {
    const form = document.getElementById('konsultasiForm');
    if (!form) return;
    
    // Set nilai default tanggal dan jam
    setDefaultDateTime();
    
    // Handle form submission
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        await submitFormData(this);
    });
}

function setDefaultDateTime() {
    // Set tanggal hari ini
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('tanggal').value = today;
    
    // Set jam default (09:00)
    document.getElementById('jam').value = '09:00';
}

function setupCharCounter() {
    const textarea = document.getElementById('deskripsi');
    const counter = document.getElementById('charCount');
    
    if (!textarea || !counter) return;
    
    textarea.addEventListener('input', function() {
        counter.textContent = this.value.length;
    });
}

async function submitFormData(form) {
    const formData = new FormData(form);
    
    // Tampilkan loading
    showLoading();
    
    try {
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        
        if (result.status === 'success') {
            showSuccessMessage(result.refId);
            form.reset();
            document.getElementById('charCount').textContent = '0';
        } else {
            throw new Error(result.message || 'Unknown error occurred');
        }
    } catch (error) {
        showErrorMessage(error);
    }
}

function showLoading() {
    Swal.fire({
        title: 'Mengirim Konsultasi',
        html: 'Harap tunggu sebentar...',
        allowOutsideClick: false,
        didOpen: () => {
            Swal.showLoading();
        },
        background: 'var(--primary-color)',
        color: 'white'
    });
}

function showSuccessMessage(refId) {
    Swal.fire({
        title: 'Berhasil Dikirim!',
        html: `
            <div style="text-align:left;line-height:1.6">
                <p>Konsultasi Anda telah terkirim ke tim Shahaba.</p>
                <p><strong>Nomor Referensi:</strong> ${refId}</p>
                <p>Anda akan menerima balasan via email dalam 1-2 hari kerja.</p>
            </div>
        `,
        icon: 'success',
        confirmButtonText: 'Mengerti',
        background: 'var(--primary-color)',
        color: 'white',
        customClass: {
            title: 'swal2-title-custom',
            content: 'swal2-content-custom'
        }
    });
}

function showErrorMessage(error) {
    console.error('Error:', error);
    
    Swal.fire({
        title: 'Gagal Mengirim',
        html: `
            <div style="text-align:left">
                <p>Terjadi kesalahan saat mengirim form:</p>
                <p><em>${error.message}</em></p>
                <p>Silakan coba lagi atau hubungi admin sekolah.</p>
            </div>
        `,
        icon: 'error',
        confirmButtonText: 'Coba Lagi',
        background: 'var(--primary-color)',
        color: 'white'
    });
}

// Pastikan fungsi ini tersedia di global scope
window.handleSubmit = async function(e) {
    e.preventDefault();
    await submitFormData(e.target);
};