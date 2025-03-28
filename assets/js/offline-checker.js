// Fungsi untuk memeriksa status koneksi
function checkConnection() {
    if (!navigator.onLine) {
      // Jika offline, redirect ke halaman offline.html
      window.location.href = 'offline.html';
    }
  }
  
  // Event listener untuk perubahan status koneksi
  window.addEventListener('online', function() {
    console.log('Anda kembali online');
  });
  
  window.addEventListener('offline', function() {
    // Ketika status berubah menjadi offline, redirect
    window.location.href = 'offline.html';
  });
  
  // Periksa status koneksi saat halaman pertama kali dimuat
  window.addEventListener('load', function() {
    checkConnection();
    
    // Periksa juga secara berkala (setiap 5 detik) untuk memastikan
    setInterval(checkConnection, 5000);
  });