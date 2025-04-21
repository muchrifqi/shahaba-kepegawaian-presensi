// Load Data Transaksi
function loadTransaksi() {
  const siswaId = document.getElementById('siswa-id').value.trim();
  if (!siswaId) {
    alert("Harap masukkan ID Siswa");
    return;
  }
  showStatusMessage('Memproses data...', true);

  fetch(`https://script.google.com/macros/s/AKfycbz0gKU9YFMFg-R9E7EqvWh2CL8LD5ExPA9ZsM65f1RXbaf9z9u10GfYz_TR4BSsNM5sdw/exec?id=${encodeURIComponent(siswaId)}`)
    .then(res => res.json())
    .then(data => {
      if (data.status !== "success") {
        throw new Error(data.message || "Data tidak ditemukan");
      }
      showStatusMessage('', false);

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

      // ✅ Render tunggakan di dalam .then()
      const tunggakan = data.data.tunggakan || [];
      const tunggakanList = document.getElementById('tunggakan-list');
      const tunggakanContainer = document.getElementById('tunggakan-container');

      if (tunggakan.length > 0) {
        tunggakanList.innerHTML = '';
        let total = 0;
        tunggakan.forEach(item => {
          const li = document.createElement('li');
          li.className = 'bg-yellow-500/10 p-3 rounded text-yellow-200 text-sm flex justify-between items-center';
          li.innerHTML = `<span>${item.jenis}</span><span class="font-semibold">${formatRupiah(item.nominal)}</span>`;
          tunggakanList.appendChild(li);
          total += item.nominal;
        });

        // Tambahkan total tunggakan
        const totalEl = document.createElement('li');
        totalEl.className = 'bg-yellow-500/20 p-3 rounded text-yellow-100 text-l flex justify-between items-center font-bold';
        totalEl.innerHTML = `<span>Total Tunggakan</span><span>${formatRupiah(total)}</span>`;
        tunggakanList.appendChild(totalEl);

        tunggakanContainer.classList.remove('hidden');
      } else {
        tunggakanContainer.classList.add('hidden');
      }

      document.getElementById('transaksi-result').classList.remove('hidden');
    })
    .catch(err => {
      alert(`Error: ${err.message}`);
      console.error(err);
      showStatusMessage('', false);
    });
}
function showStatusMessage(text = '', show = true) {
  const statusEl = document.getElementById('transaksi-status');
  if (statusEl) {
    statusEl.textContent = text;
    statusEl.classList.toggle('hidden', !show);
  }
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

//   const url = `https://script.google.com/macros/s/AKfycbz0gKU9YFMFg-R9E7EqvWh2CL8LD5ExPA9ZsM65f1RXbaf9z9u10GfYz_TR4BSsNM5sdw/exec` +
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

//   const url = `https://script.google.com/macros/s/AKfycbz0gKU9YFMFg-R9E7EqvWh2CL8LD5ExPA9ZsM65f1RXbaf9z9u10GfYz_TR4BSsNM5sdw/exec` +
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
