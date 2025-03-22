// Fungsi untuk memeriksa waktu
function checkTime() {
    const now = new Date(); // Waktu saat ini
    const limitTime = new Date(); // Waktu batas (06:45)

    // Set waktu batas ke 06:45
    limitTime.setHours(6);
    limitTime.setMinutes(45);
    limitTime.setSeconds(0);

    // Jika waktu saat ini sudah melewati 06:45
    if (now > limitTime) {
        // Tampilkan pesan
        document.getElementById('timeCheckMessage').innerHTML = `
            <p>Mohon maaf, waktu pendataan presensi sudah berakhir pada pukul 06:45.</p>
            <p>Silakan hubungi admin untuk pendataan presensi manual.</p>
        `;
        // Sembunyikan tombol presensi
        document.querySelector('.button-container').style.display = 'none';
    }
}

// Jalankan pengecekan waktu setiap 2 detik
setInterval(checkTime, 2000);