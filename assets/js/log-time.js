// Fungsi utama presensi (tetap menggunakan GET request)
async function handlePresensi(nama) {
    try {
        const mode = getPresensiMode();
        const isPulang = mode === 'pulang';
        
        // Konfirmasi awal
        const { isConfirmed } = await Swal.fire({
            title: `Presensi ${isPulang ? 'Pulang' : 'Masuk'}`,
            text: `Konfirmasi ${nama} untuk ${isPulang ? 'kepulangan' : 'kedatangan'}`,
            icon: "question",
            showCancelButton: true,
            confirmButtonText: `Ya, Presensi ${isPulang ? 'Pulang' : 'Masuk'}`,
            cancelButtonText: "Batal"
        });

        if (!isConfirmed) return;

        // Validasi waktu khusus untuk presensi masuk
        if (!isPulang && !checkWaktuMasuk()) {
            await Swal.fire({
                icon: 'error',
                title: 'Waktu Habis',
                text: 'Presensi masuk hanya sampai pukul 07.00'
            });
            return;
        }

        const buttonId = `btn-${nama.replace(/ /g, '-')}`;
        const button = document.getElementById(buttonId);
        if (!button) throw new Error('Tombol tidak ditemukan');

        // Tambahkan feedback visual memproses
        button.disabled = true;
        button.innerHTML = `${nama} <span class="spinner"></span>`;
        button.classList.add('processing');

        // 1. Dapatkan lokasi (wajib)
        const position = await checkLocation();
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        
        // 2. Dapatkan IP Address (opsional)
        const ip = await getIPAddress().catch(() => 'unknown');
        
        // 3. Kirim data presensi via GET (tetap seperti sebelumnya)
        const url = `https://script.google.com/macros/s/AKfycbx905NCryDB-xr0gn9KTNVmyeO7X2dt6foZd30bqC-cwkyO8CARPTVHiJFEg9lVheBf/exec?action=presensi&nama=${encodeURIComponent(nama)}&ip=${encodeURIComponent(ip)}&type=${isPulang ? 'pulang' : 'masuk'}&lat=${lat}&long=${long}`;
        
        const response = await fetch(url, {
            redirect: 'follow',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8',
            }
        });

        // Handle response khusus untuk Google Apps Script
        const result = await response.text();
        if (!response.ok || result.includes("error")) {
            throw new Error(result || 'Presensi gagal');
        }

        // Update UI setelah sukses
        const waktu = new Date().toLocaleTimeString('id-ID', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        
        button.innerHTML = `${nama} ${isPulang ? '⏏️' : '✓'}`;
        button.classList.remove('processing');
        button.classList.add(isPulang ? 'presensi-pulang' : 'presensi-masuk');
        
        await Swal.fire({
            icon: 'success',
            title: 'Berhasil',
            text: `Presensi ${isPulang ? 'pulang' : 'masuk'} pukul ${waktu}`
        });

    } catch (error) {
        console.error('Error presensi:', error);
        const buttonId = `btn-${nama.replace(/ /g, '-')}`;
        const button = document.getElementById(buttonId);
        if (button) {
            button.disabled = false;
            button.innerHTML = nama;
            button.classList.remove('processing');
        }
        
        await Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: error.message || 'Terjadi kesalahan saat presensi'
        });
    }
}

// Fungsi cek lokasi yang lebih baik
function checkLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error('Browser tidak mendukung geolokasi'));
            return;
        }
        
        navigator.geolocation.getCurrentPosition(
            resolve, 
            (err) => {
                let message = 'Gagal mendapatkan lokasi';
                switch(err.code) {
                    case 1: message = 'Izin lokasi ditolak'; break;
                    case 2: message = 'Lokasi tidak tersedia'; break;
                    case 3: message = 'Timeout mendapatkan lokasi'; break;
                }
                reject(new Error(message));
            },
            { 
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    });
}

// Fungsi get IP Address dengan fallback
async function getIPAddress() {
    try {
        const response = await fetch('https://api.ipify.org?format=json', {
            timeout: 5000
        });
        const data = await response.json();
        return data.ip || 'unknown';
    } catch {
        return 'unknown';
    }
}

// Fungsi cek waktu masuk
function checkWaktuMasuk() {
    const now = new Date();
    const jamMasuk = new Date();
    jamMasuk.setHours(7, 0, 0, 0);
    return now < jamMasuk;
}

// Fungsi menentukan mode presensi
function getPresensiMode() {
    const now = new Date();
    return now.getHours() >= 12 ? 'pulang' : 'masuk';
}

// Fungsi proses presensi (sama untuk masuk/pulang)
async function processPresensi(nama, isPulang) {
    const button = document.getElementById(`btn-${nama.replace(' ', '-')}`);
    button.disabled = true;
    
    try {
        await checkLocation();
        const ip = await getIPAddress();
        
        const response = await fetch(
            `https://script.google.com/macros/s/AKfycbx905NCryDB-xr0gn9KTNVmyeO7X2dt6foZd30bqC-cwkyO8CARPTVHiJFEg9lVheBf/exec?action=presensi&nama=${encodeURIComponent(nama)}&ip=${encodeURIComponent(ip)}&type=${isPulang ? 'pulang' : 'masuk'}`
        );
        
        const result = await response.text();
        const waktu = new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
        
        // Update tombol
        const statusIcon = isPulang ? '⏏️' : '✓';
        button.innerHTML = `${nama} ${statusIcon}`;
        button.classList.add(isPulang ? 'presensi-pulang' : 'presensi-masuk');
        
        await Swal.fire({
            icon: 'success',
            title: `Presensi ${isPulang ? 'Pulang' : 'Masuk'} Berhasil`,
            text: `${nama} - ${isPulang ? 'Pulang' : 'Masuk'} pukul ${waktu}`
        });
        
    } catch (error) {
        button.disabled = false;
        await Swal.fire({
            icon: 'error',
            title: 'Gagal',
            text: error.message || 'Terjadi kesalahan saat presensi'
        });
    }
}

// Update tampilan tombol secara real-time
function updateButtonStates() {
    const buttons = document.querySelectorAll('.button-container button');
    const mode = getPresensiMode();
    
    buttons.forEach(button => {
        const sudahPresensi = button.textContent.includes('✓') || button.textContent.includes('⏏️');
        
        if (mode === 'pulang') {
            // Mode pulang (siang hari)
            button.disabled = sudahPresensi && button.textContent.includes('⏏️');
            if (!sudahPresensi) {
                button.style.backgroundColor = ''; // Warna oranye untuk pulang
            }
        } else {
            // Mode masuk (pagi hari)
            button.disabled = sudahPresensi || !checkWaktuMasuk();
        }
    });
}

// Jalankan setiap menit
setInterval(updateButtonStates, 60000);
updateButtonStates(); // Jalankan saat pertama load