function submitFeedback(event) {
    event.preventDefault();

    const data = {
        nama: document.getElementById("namaFeedback").value,
        kategori: document.getElementById("kategoriFeedback").value,
        pesan: document.getElementById("isiFeedback").value
    };

    // Validasi pesan tidak kosong
    if (!data.pesan.trim()) {
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

    fetch('https://script.google.com/macros/s/AKfycbwoRgL2OTiNMboB1Y379sQcO2LWZTGCTdEsNVHrgMevLNjFGNAxPrGwryVH9V0vWLtEpA/exec', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
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
