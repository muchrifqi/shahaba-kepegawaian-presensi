// Load Data Transaksi
function loadTransaksi() {
  const siswaId = document.getElementById('siswa-id').value.trim();
  if (!siswaId) {
    alert("Harap masukkan ID Siswa");
    return;
  }

  fetch(`https://script.google.com/macros/s/AKfycbwuZ-2d8pqrIqoIuhAVOhY-KioaFDWYz0FuXdEef1rJRZMFySTjCWfLkJzE2bmxDRvdQQ/exec?id=${encodeURIComponent(siswaId)}`)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "success") {
        throw new Error(data.message || "Data tidak ditemukan");
      }

      // Tampilkan info siswa
      const siswa = data.data.siswa;
      document.getElementById('siswa-nama').textContent = siswa.nama;
      document.getElementById('siswa-jenjang-text').textContent = siswa.jenjang;
      document.getElementById('siswa-kelas-text').textContent = siswa.kelas;

      // Update judul transaksi
      document.getElementById('transaksi-title').textContent =
        `Riwayat Transaksi (${data.meta.total} ditemukan)`;

      // Render transaksi
      const container = document.getElementById('transaksi-list');
      container.innerHTML = "";

      data.data.transaksi.forEach(transaksi => {
        const template = document.getElementById('transaksi-template').innerHTML;
        const html = template
          .replace(/#ID_TRANSAKSI#/g, transaksi.id_transaksi)
          .replace(/#NOMINAL#/g, formatRupiah(transaksi.nominal))
          .replace(/#TANGGAL#/g, transaksi.tanggal)
          .replace(/#KETERANGAN#/g, transaksi.keterangan)
          .replace(/#STATUS#/g, transaksi.status.toLowerCase());

        container.innerHTML += html;
      });

      document.getElementById('transaksi-result').classList.remove('hidden');
    })
    .catch(err => {
      alert(`Error: ${err.message}`);
      console.error(err);
    });
}

// Format Rupiah
function formatRupiah(nominal) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0
  }).format(nominal);
}

// // Download Kwitansi (PDF)
// function downloadKwitansi(idTransaksi) {
//   const siswaId = document.getElementById('siswa-id').value.trim();

//   if (!siswaId || !idTransaksi) {
//     alert("Gagal mengunduh. Data tidak lengkap.");
//     return;
//   }

//   const url = `https://script.google.com/macros/s/AKfycbwuZ-2d8pqrIqoIuhAVOhY-KioaFDWYz0FuXdEef1rJRZMFySTjCWfLkJzE2bmxDRvdQQ/exec` +
//               `?action=kwitansi&id=${encodeURIComponent(idTransaksi)}&siswa=${encodeURIComponent(siswaId)}`;

//   const newWindow = window.open(url, '_blank');

//   if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
//     // Fallback jika popup diblokir
//     const fallbackLink = document.createElement('a');
//     fallbackLink.href = url;
//     fallbackLink.download = `Kwitansi-${idTransaksi}.pdf`;
//     document.body.appendChild(fallbackLink);
//     fallbackLink.click();
//     document.body.removeChild(fallbackLink);
//   }
// }

// Download Semua Kwitansi (ZIP)
// function downloadAll() {
//   const siswaId = document.getElementById('siswa-id').value.trim();
//   if (!siswaId) {
//     alert("Harap masukkan ID Siswa terlebih dahulu.");
//     return;
//   }

//   const url = `https://script.google.com/macros/s/AKfycbwuZ-2d8pqrIqoIuhAVOhY-KioaFDWYz0FuXdEef1rJRZMFySTjCWfLkJzE2bmxDRvdQQ/exec` +
//               `?action=download_all&siswa=${encodeURIComponent(siswaId)}`;

//   const newWindow = window.open(url, '_blank');

//   if (!newWindow || newWindow.closed || typeof newWindow.closed === 'undefined') {
//     // Fallback jika popup diblokir
//     const fallbackLink = document.createElement('a');
//     fallbackLink.href = url;
//     fallbackLink.download = `Semua-Kwitansi-${siswaId}.zip`;
//     document.body.appendChild(fallbackLink);
//     fallbackLink.click();
//     document.body.removeChild(fallbackLink);
//   }
// }

// Auto load dari parameter URL (jika ada)
document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const siswaId = params.get("id");

  if (siswaId) {
    document.getElementById('siswa-id').value = siswaId;
    loadTransaksi();
  }
});
