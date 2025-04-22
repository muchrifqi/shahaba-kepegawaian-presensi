function submitFeedback(event) {
    event.preventDefault();

    const nama = document.getElementById("namaFeedback").value;
    const kategori = document.getElementById("kategoriFeedback").value;
    const pesan = document.getElementById("isiFeedback").value;
    const submitBtn = event.submitter;
    const statusEl = document.getElementById("feedback-status");

    // Validasi
    if (!pesan.trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Pesan kosong!',
            text: 'Silakan isi masukan Anda terlebih dahulu.',
            background: 'var(--primary-color)',
            color: 'white'
        });
        return;
    }

    // Tombol loading
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';

    // Tampilkan status
    if (statusEl) {
        statusEl.classList.remove('hidden');
        statusEl.classList.add('form-status');
        statusEl.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim masukan...';
    }

    const data = new URLSearchParams();
    data.append("nama", nama);
    data.append("kategori", kategori);
    data.append("pesan", pesan);

    fetch('https://script.google.com/macros/s/AKfycby9CzE6fcev_xPJ-A3kZK-6OeyQ7wIVYByvg6TDU1qBD1uHqYHCTUyh4HxbQb9qQ7hOOQ/exec', {
        method: 'POST',
        body: data
    })
    .then(res => res.json())
    .then(response => {
        if (response.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Terima kasih!',
                html: `
                    <div style="text-align:left">
                      <p>Masukan Anda telah terkirim.</p>
                      <p><strong>Nama:</strong> ${nama || '-'}</p>
                      <p><strong>Kategori:</strong> ${kategori}</p>
                    </div>
                `,
                confirmButtonText: 'OK',
                background: 'var(--primary-color)',
                color: 'white'
            });
            document.getElementById("feedbackForm").reset();
        } else {
            throw new Error(response.message || 'Terjadi kesalahan.');
        }
    })
    .catch(err => {
        Swal.fire({
            icon: 'error',
            title: 'Gagal Mengirim!',
            text: err.message || 'Gagal mengirim masukan.',
            background: 'var(--primary-color)',
            color: 'white'
        });
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Masukan';

        if (statusEl) {
            statusEl.classList.add('hidden');
            statusEl.innerHTML = '';
        }
    });
}
