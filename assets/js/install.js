let deferredPrompt;

window.addEventListener('beforeinstallprompt', (event) => {
  console.log('beforeinstallprompt event triggered');
  event.preventDefault();
  deferredPrompt = event;

  // Tampilkan SweetAlert2 untuk menawarkan instalasi
  Swal.fire({
    title: 'Tambahkan ke Layar Utama?',
    text: 'Anda dapat menambahkan aplikasi ini ke layar utama untuk pengalaman yang lebih baik.',
    icon: 'question',
    showCancelButton: true,
    confirmButtonText: 'Ya, Tambahkan',
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
            title: 'Aplikasi Berhasil Ditambahkan',
            text: 'Syukran telah menambahkan aplikasi ke layar utama!',
          });
        } else {
          console.log('Pengguna menolak instalasi');
          Swal.fire({
            icon: 'info',
            title: 'Instalasi Dibatalkan',
            text: 'Anda dapat menambahkan aplikasi ini nanti.',
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