// Fungsi untuk memeriksa waktu
function checkTime() {
    const now = new Date(); // Waktu saat ini
    const limitTime = new Date(); // Waktu batas (06:45)

    // Set waktu batas ke 06:45
    limitTime.setHours(7);
    limitTime.setMinutes(30);
    limitTime.setSeconds(0);

    // Jika waktu saat ini sudah melewati 06:45
    if (now > limitTime) {
        return true; // Sudah melewati 06:45
    }
    return false; // Belum melewati 06:45
}

// Fungsi presensi
async function presensichecktime(nama) {
    const { isConfirmed } = await Swal.fire({
        title: `Apakah Anda ${nama}?`,
        text: "Pendataan presensi tidak dapat diwakilkan.",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `Ya, Saya ${nama}`,
        cancelButtonText: "Kembali",
    });

    if (!isConfirmed) {
        return; // Batalkan jika pengguna memilih "Kembali"
    }

    // Periksa apakah waktu sudah melewati 06:45
    if (checkTime()) {
        await Swal.fire({
            icon: 'error',
            title: 'Waktu Presensi Habis',
            text: 'Mohon maaf, waktu pendataan presensi telah berakhir pada pukul 07.30.',
        });
        return; // Hentikan proses jika waktu sudah melewati 06:45
    }

    const button = Array.from(buttons).find(btn => btn.innerText === nama);
    button.disabled = true;
    loading.style.display = 'block'; // Tampilkan loading indicator

    try {
        // Periksa lokasi pengguna
        await checkLocation();

        // Kirim data ke Google Apps Script
        const ip = await getIPAddress();
        const response = await fetch(
            `https://script.google.com/macros/s/AKfycbx905NCryDB-xr0gn9KTNVmyeO7X2dt6foZd30bqC-cwkyO8CARPTVHiJFEg9lVheBf/exec?action=presensi&nama=${encodeURIComponent(nama)}&ip=${encodeURIComponent(ip)}`
        );
        const result = await response.text();

        // Tampilkan pesan sukses dengan SweetAlert2
        await Swal.fire({
            icon: 'success',
            title: 'Presensi Berhasil',
            text: `Presensi ${nama} telah dicatat.`,
        });

        // Update tampilan tombol
        const waktu = new Date().toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false // Gunakan format 24-jam
        });
        button.innerText = `${nama} ✓`;
        confirmationMessage.innerText = `${nama} pukul ${waktu}`;
        confirmation.style.display = 'block';
        statusMessage.innerText = "";
    } catch (error) {
        // Tampilkan pesan error
        statusMessage.innerText = error;
        statusMessage.style.color = getComputedStyle(document.documentElement).getPropertyValue('--error-color');
        button.disabled = false;
    } finally {
        loading.style.display = 'none'; // Sembunyikan loading indicator
    }
}