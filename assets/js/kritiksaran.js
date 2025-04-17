function submitFeedback(event) {
    event.preventDefault();

    const data = new URLSearchParams();
    data.append("nama", document.getElementById("namaFeedback").value);
    data.append("kategori", document.getElementById("kategoriFeedback").value);
    data.append("pesan", document.getElementById("isiFeedback").value);

    // Validasi pesan tidak kosong
    if (!data.get("pesan").trim()) {
        Swal.fire({
            icon: 'warning',
            title: 'Pesan kosong!',
            text: 'Silakan isi masukan Anda terlebih dahulu.'
        });
        return;
    }

    const submitBtn = event.submitter;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
    
          // Show loading indicator
          const swalInstance = Swal.fire({
            title: 'Mengirim data...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
            background: 'var(--primary-color)',
            color: 'white'
          });

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
                text: 'Masukan Anda telah dikirim.',
                confirmButtonText: 'OK'
            });
            document.getElementById("feedbackForm").reset();
        } else {
            throw new Error(response.message || 'Terjadi kesalahan.');
        }
    })
    .catch(err => {
        Swal.fire({
            icon: 'error',
            title: 'Gagal!',
            text: err.message || 'Gagal mengirim masukan.',
        });
    })
    .finally(() => {
        submitBtn.disabled = false;
        submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Kirim Masukan';
    });
}