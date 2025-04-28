// Konfigurasi
const ALLOWED_LOCATIONS = [
    { lat: -6.589108056587621, lng: 106.8218295143879 }, // Lokasi 1 Ruko Tanah Baru Residence
    { lat: -6.592279, lng: 106.822581 }                 // Lokasi 2 Jl. Swadaya
  ];
  const PRESENSI_ENDPOINT = "https://script.google.com/macros/s/AKfycbx905NCryDB-xr0gn9KTNVmyeO7X2dt6foZd30bqC-cwkyO8CARPTVHiJFEg9lVheBf/exec";
  
  // Fungsi Utama Presensi
  async function handlePresensi(nama) {
    try {
      // 1. Konfirmasi Awal
      const mode = getPresensiMode();
      const isPulang = mode === 'pulang';
      
      const { isConfirmed } = await Swal.fire({
        title: `Presensi ${isPulang ? 'Pulang' : 'Masuk'}`,
        text: `Konfirmasi ${nama} untuk ${isPulang ? 'kepulangan' : 'kedatangan'}`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: `Ya, Presensi ${isPulang ? 'Pulang' : 'Masuk'}`,
        cancelButtonText: "Batal"
      });
      if (!isConfirmed) return;
  
      // 2. Validasi Waktu (Khusus Masuk)
      if (!isPulang && !validateWaktuMasuk()) {
        await Swal.fire({
          icon: 'error',
          title: 'Waktu Habis',
          text: 'Presensi masuk hanya sampai pukul 07.00'
        });
        return;
      }
  
      // 3. Persiapan UI
      const buttonId = `btn-${nama.replace(/ /g, '-')}`;
      const button = document.getElementById(buttonId);
      if (!button) throw new Error('Tombol tidak ditemukan');
      
      button.disabled = true;
      button.innerHTML = `${nama} <span class="spinner"></span>`;
      button.classList.add('processing');
  
      // 4. Validasi Lokasi (Radius 200m)
      const { coords } = await checkLocationWithValidation();
      const { latitude: lat, longitude: long } = coords;
  
      // 5. Kumpulkan Data
      const ip = await getIPAddress().catch(() => 'unknown');
      const tanggal = formatDate(new Date());
  
      // 6. Kirim ke Server
      const url = `${PRESENSI_ENDPOINT}?action=presensi&nama=${encodeURIComponent(nama)}&ip=${encodeURIComponent(ip)}&type=${mode}&lat=${lat}&long=${long}&tanggal=${tanggal}`;
      
      const response = await fetch(url, {
        redirect: 'follow',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' }
      });
  
      // 7. Handle Response
      const result = await response.text();
      if (!response.ok || result.includes("error")) {
        throw new Error(result || 'Presensi gagal');
      }
  
      // 8. Update UI Sukses
      updateUIOnSuccess(button, nama, mode);
  
    } catch (error) {
      handlePresensiError(error, nama);
    }
  }
  
  // Fungsi Validasi Lokasi (200m)
  function checkLocationWithValidation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Browser tidak mendukung geolokasi'));
        return;
      }
  
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: userLat, longitude: userLng } = position.coords;
          const isAllowed = ALLOWED_LOCATIONS.some(loc => 
            calculateDistance(userLat, userLng, loc.lat, loc.lng) <= 20000
          );
  
          isAllowed ? resolve(position) : reject(new Error('Anda di luar lokasi presensi'));
        },
        (err) => {
          const errors = {
            1: 'Izin lokasi ditolak',
            2: 'Lokasi tidak tersedia',
            3: 'Timeout mendapatkan lokasi'
          };
          reject(new Error(errors[err.code] || 'Gagal mendapatkan lokasi'));
        },
        { 
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0 
        }
      );
    });
  }
  
  // Fungsi Pendukung
  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;
  
    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    return 6371e3 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }
  
  function validateWaktuMasuk() {
    const now = new Date();
    const batasMasuk = new Date();
    batasMasuk.setHours(7, 0, 0, 0);
    return now < batasMasuk;
  }
  
  function getPresensiMode() {
    return new Date().getHours() >= 11 ? 'pulang' : 'masuk';
  }
  
  async function getIPAddress() {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  }
  
  function formatDate(date) {
    return date.toLocaleDateString('en-GB'); // DD/MM/YYYY
  }
  
  function updateUIOnSuccess(button, nama, mode) {
    const waktu = new Date().toLocaleTimeString('id-ID', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
    
    button.innerHTML = `${nama} <i class="fas fa-check"></i>`;
    button.classList.remove('processing');
    button.classList.add(`presensi-${mode}`);
    
    Swal.fire({
      icon: 'success',
      title: 'Berhasil',
      text: `Presensi ${mode} pukul ${waktu}`
    });
  }
  
  function handlePresensiError(error, nama) {
    console.error('Presensi error:', error);
    
    const buttonId = `btn-${nama.replace(/ /g, '-')}`;
    const button = document.getElementById(buttonId);
    if (button) {
      button.disabled = false;
      button.innerHTML = nama;
      button.classList.remove('processing');
    }
    
    Swal.fire({
      icon: 'error',
      title: 'Gagal',
      text: error.message || 'Terjadi kesalahan saat presensi'
    });
  }
  
  // Auto-update tombol
  function updateButtonStates() {
    document.querySelectorAll('.button-container button').forEach(button => {
      const sudahPresensi = button.innerHTML.includes('fa-check');
      const mode = getPresensiMode();
      
      if (mode === 'pulang') {
        button.disabled = sudahPresensi;
      } else {
        button.disabled = sudahPresensi || !validateWaktuMasuk();
      }
    });
  }
  
  // Jalankan periodic check
  setInterval(updateButtonStates, 60000);
  document.addEventListener('DOMContentLoaded', updateButtonStates);