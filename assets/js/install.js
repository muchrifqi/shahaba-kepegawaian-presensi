window.addEventListener('beforeinstallprompt', (event) => {
    console.log('beforeinstallprompt event triggered');
    event.preventDefault();
    deferredPrompt = event;
  
    Swal.fire({
      title: 'Install App Presensi di smartphone?',
      text: 'Anda dapat menginstall aplikasi ini untuk pengalaman yang lebih baik.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Ya, Install',
      cancelButtonText: 'Nanti',
    }).then((result) => {
      if (result.isConfirmed) {
        document.getElementById('installButton').style.display = 'block';
      }
    });
  });
    
    // Event listener untuk tombol instalasi
    document.getElementById('installButton').addEventListener('click', () => {
      // Tampilkan prompt instalasi
      if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
          if (choiceResult.outcome === 'accepted') {
            console.log('Pengguna menerima instalasi');
            Swal.fire({
              icon: 'success',
              title: 'Aplikasi Berhasil Diinstall',
              text: 'Syukran telah menginstall aplikasi!',
            });
          } else {
            console.log('Pengguna menolak instalasi');
            Swal.fire({
              icon: 'info',
              title: 'Instalasi Dibatalkan',
              text: 'Anda dapat menginstall aplikasi ini nanti.',
            });
          }
          deferredPrompt = null;
        });
      }
    });
    
    // Event listener untuk menangani setelah aplikasi diinstall
    window.addEventListener('appinstalled', (event) => {
      console.log('Aplikasi berhasil diinstall');
      // Anda bisa menambahkan logika tambahan di sini
    });