let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt event triggered');
  event.preventDefault();
  deferredPrompt = event;

  // Tampilkan SweetAlert2 untuk menawarkan instalasi
  Swal.fire({
    title: 'Install Aplikasi?',
    text: 'Install aplikasi ini di perangkat anda untuk pengalaman yang lebih baik.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Install',
    cancelButtonText: 'Nanti',
  }).then((result) => {
    if (result.isConfirmed) {
      // Tampilkan prompt instalasi
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('Pengguna menerima instalasi');
          Swal.fire({
            icon: 'success',
            title: 'Aplikasi Berhasil Diinstall',
            text: 'Syukran, telah menginstall aplikasi!',
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
});

// Event listener untuk menangani setelah aplikasi diinstall
window.addEventListener('appinstalled', (event) => {
  console.log('Aplikasi berhasil diinstall');
  // Anda bisa menambahkan logika tambahan di sini
});