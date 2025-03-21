    // Fungsi untuk memeriksa waktu
    function redirectAfterTime(landingPageUrl) {
        const now = new Date();
        const currentHour = now.getHours();
        const currentMinute = now.getMinutes();
        
        // Jika waktu sudah melewati pukul 06:45
        if (currentHour > 6 || (currentHour === 6 && currentMinute >= 45)) {
            window.location.href = landingPageUrl;
        }
      }
  
      // Panggil fungsi dengan URL halaman landing yang diinginkan
      redirectAfterTime("pages/landingpegawai.html");