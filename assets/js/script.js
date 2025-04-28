// Langsung kirim IP ke Apps Script tanpa menampilkan ke user
const buttons = document.querySelectorAll('button');
const statusMessage = document.getElementById('statusMessage');
const confirmation = document.getElementById('confirmation');
const confirmationMessage = document.getElementById('confirmationMessage');
const loading = document.getElementById('loading');
const announcementText = document.getElementById('announcementText');

// Lokasi yang diizinkan
const allowedLocations = [
  { lat: -6.589108056587621, lng: 106.8218295143879 }, // Lokasi 1 (Shahaba Ruko Tanah Baru Residence)
  { lat: -6.592279, lng: 106.822581 } // Lokasi 2 (Shahaba Jl. Swadaya)
];

// Fungsi untuk menghitung jarak antara dua koordinat (dalam meter)
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371e3; // Radius bumi dalam meter
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

// Fungsi untuk memeriksa lokasi pengguna
function checkLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation tidak didukung di browser ini.");
    } else {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLat = position.coords.latitude;
          const userLng = position.coords.longitude;

          // Cek apakah pengguna berada dalam radius 20 meter dari salah satu lokasi yang diizinkan
          const isWithinRadius = allowedLocations.some(
            (loc) => calculateDistance(userLat, userLng, loc.lat, loc.lng) <= 20000
          );

          if (isWithinRadius) {
            resolve();
          } else {
            reject("Anda berada di luar lokasi yang diizinkan.");
          }
        },
        (error) => {
          // Pesan error jika pengguna tidak mengizinkan akses lokasi
          if (error.code === error.PERMISSION_DENIED) {
            reject("Anda tidak mengizinkan akses lokasi. Harap aktifkan izin lokasi.");
          } else {
            reject("Gagal mendapatkan lokasi: " + error.message);
          }
        }
      );
    }
  });
}

// Fungsi untuk mendapatkan alamat IP
async function getIPAddress() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const data = await response.json();
    return data.ip;
  } catch (error) {
    console.error("Gagal mendapatkan alamat IP:", error);
    return null;
  }
}

// Fungsi untuk memeriksa status tombol dari spreadsheet
async function getButtonStatus() {
  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbx905NCryDB-xr0gn9KTNVmyeO7X2dt6foZd30bqC-cwkyO8CARPTVHiJFEg9lVheBf/exec?action=getStatus`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Gagal memeriksa status tombol:", error);
    return {};
  }
}

// Fungsi untuk menonaktifkan tombol berdasarkan status
async function updateButtonStatus() {
  const status = await getButtonStatus();
  const buttons = document.querySelectorAll("button[data-nama]");

  buttons.forEach(button => {
    const nama = button.dataset.nama;
    if (status[nama] === "Nonaktif") {
      button.disabled = true;
      button.innerHTML = `${nama} <i class="fas fa-check"></i>`;
    }
  });
}

// Jalankan saat halaman dimuat
document.addEventListener("DOMContentLoaded", () => {
  updateButtonStatus();              // Jalankan pertama kali
  setInterval(updateButtonStatus, 2000);  // Ulangi setiap 2 detik
});


// Fungsi presensi
async function presensi(nama) {
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
    // script sebelumnya const waktu = new Date().toLocaleTimeString();
    const waktu = new Date().toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false // Gunakan format 24-jam
    }); //script baru format waktu Indonesia
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

  // Fungsi untuk menghapus cache dan mendapatkan lokasi terbaru
  function clearCacheAndGetLocation() {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation tidak didukung di browser ini.");
      } else {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLat = position.coords.latitude;
            const userLng = position.coords.longitude;
            const accuracy = position.coords.accuracy; // Akurasi dalam meter
            console.log(`Lokasi terbaru: ${userLat}, ${userLng}, Akurasi: ${accuracy} meter`);
            resolve({ userLat, userLng });
          },
          (error) => {
            reject("Gagal mendapatkan lokasi: " + error.message);
          },
          {
            enableHighAccuracy: true, // Aktifkan akurasi tinggi
            timeout: 5000, // Batas waktu permintaan (5 detik)
            maximumAge: 0 // Tidak menggunakan cache lama
          }
        );
      }
    });
  }
  //Hash
    function hashPassword(password) {
      return CryptoJS.SHA256(password).toString(CryptoJS.enc.Hex);
  }
      // Fungsi untuk mengontrol tombol melayang dan menu
    const floatingMenuButton = document.getElementById('floatingMenuButton');
    const floatingMenu = document.getElementById('floatingMenu');

    // Tampilkan/sembunyikan menu saat tombol diklik
    floatingMenuButton.addEventListener('click', () => {
      floatingMenu.classList.toggle('active');
    });

    // Sembunyikan menu saat mengklik di luar menu
    document.addEventListener('click', (event) => {
      if (!floatingMenu.contains(event.target) && !floatingMenuButton.contains(event.target)) {
        floatingMenu.classList.remove('active');
      }
    });

    // Event listener untuk tombol "Lokasi Presisi" di dalam menu
    const floatingLocationButton = document.getElementById('floatingLocationButton');
    floatingLocationButton.addEventListener('click', async () => {
      try {
        loading.style.display = 'block'; // Tampilkan loading indicator
        const { userLat, userLng } = await clearCacheAndGetLocation();
        statusMessage.innerText = `Lokasi terbaru: ${userLat}, ${userLng}`;
        statusMessage.style.color = getComputedStyle(document.documentElement).getPropertyValue('--success-color');
      } catch (error) {
        statusMessage.innerText = error;
        statusMessage.style.color = getComputedStyle(document.documentElement).getPropertyValue('--error-color');
      } finally {
        loading.style.display = 'none'; // Sembunyikan loading indicator
      }
    });

    // Di bagian event listeners floating menu
    document.getElementById('adminReportButton').addEventListener('click', async () => {
          window.location.href = "laporan.html";
          });
    
    // Fungsi-fungsi Pengumuman
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbx4zfI-4mYrQ5Wx5u6qYoJ4Z0bt2848P4pDh_MeufnwxPNi-1TBZNJjR7b02d3c9piK/exec';
    //const ADMIN_PASSWORD_HASH = "b251b590aa7474295b09b586463278ef3032e9c75f1500d34458afb96b2fc7e1"; // Ganti dengan password admin Anda

    // Fungsi untuk mengambil pengumuman
    async function getAnnouncement() {
      try {
        const response = await fetch(`${scriptUrl}?action=getAnnouncement`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Cek header Content-Type untuk menentukan cara mem-parsing respons
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json(); // Parsing sebagai JSON
          updateAnnouncement(data.pengumuman); // Update teks pengumuman
        } else {
          const text = await response.text(); // Parsing sebagai teks biasa
          updateAnnouncement(text); // Update teks pengumuman
        }
      } catch (error) {
        console.error("Gagal mengambil pengumuman:", error);
        updateAnnouncement("Gagal memuat pengumuman.");
      }
    }

    // Fungsi untuk menyimpan pengumuman
    async function setAnnouncement(announcement) {
      try {
        const response = await fetch(
          `${scriptUrl}?action=setAnnouncement&announcement=${encodeURIComponent(announcement)}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.text();
        console.log(result); // "Pengumuman berhasil disimpan."
      } catch (error) {
        console.error("Gagal menyimpan pengumuman:", error);
      }
    }

    // Fungsi untuk memperbarui teks pengumuman di UI
    function updateAnnouncement(announcement) {
      const announcementText = document.getElementById('announcementText');
      if (announcement && announcement.trim() !== "") {
        announcementText.textContent = announcement;
      } else {
        announcementText.textContent = "Tidak ada pengumuman saat ini.";
      }
    }

    // Perbarui pengumuman setiap 5 detik
    setInterval(getAnnouncement, 5000);

    // Event listener untuk tombol admin
    const ADMIN_PASSWORD_HASH = "b251b590aa7474295b09b586463278ef3032e9c75f1500d34458afb96b2fc7e1"; // Hash SHA-256

    document.getElementById('adminAnnouncementButton').addEventListener('click', async () => {
        const { value: password } = await Swal.fire({
            title: 'Masukkan Password Admin',
            input: 'password',
            inputPlaceholder: 'Ketik password...',
            showCancelButton: true,
            confirmButtonText: 'Masuk',
            cancelButtonText: 'Batal',
            inputValidator: (value) => {
                if (!value) {
                    return 'Password tidak boleh kosong!';
                }
            }
        });
    
        if (password) {
            const enteredPasswordHash = hashPassword(password);
            if (enteredPasswordHash === ADMIN_PASSWORD_HASH) {
                const { value: newAnnouncement } = await Swal.fire({
                    title: 'Edit Pengumuman',
                    input: 'text',
                    inputPlaceholder: 'Masukkan pengumuman baru...',
                    showCancelButton: true,
                    confirmButtonText: 'Simpan',
                    cancelButtonText: 'Batal',
                    inputValidator: (value) => {
                        if (!value) {
                            return 'Pengumuman tidak boleh kosong!';
                        }
                    }
                });
    
                if (newAnnouncement) {
                    await setAnnouncement(newAnnouncement);
                    Swal.fire('Berhasil!', 'Pengumuman telah diperbarui.', 'success');
                }
            } else {
                Swal.fire('Gagal!', 'Password salah.', 'error');
            }
        }
    });

    // Ambil pengumuman saat halaman dimuat
    window.onload = () => {
      getAnnouncement(); // Ambil pengumuman pertama kali
    };

    // Periksa status tombol saat halaman dimuat
    window.onload = async () => {
      await updateButtonStatus();
      getAnnouncement(); // Ambil pengumuman saat halaman dimuat
      setInterval(updateButtonStatus, 3000); // Periksa status tombol setiap 3 detik
    };
        // FUNGSI INI KONFLIK DENGAN  FUNGSI UTAMA UPDATE STATUS TOMBOL DAN DISABLE TOMBOL SETELAH MELAKUKAN PRESENSI!!!!
        // Fungsi untuk memeriksa waktu dan menonaktifkan tombol
        //function disableButtonAfterTime() {
          // Ambil elemen tombol
          //var button = document.getElementById("Disable645");
  
          // Buat objek Date untuk waktu saat ini
          //var now = new Date();
  
          // Set waktu batas (06:45)
          //var limitTime = new Date();
          //limitTime.setHours(6);
          //limitTime.setMinutes(45);
          //limitTime.setSeconds(0);
  
          // Periksa apakah waktu saat ini sudah melewati batas waktu
          //if (now > limitTime) {
              // Nonaktifkan tombol
              //button.disabled = true;
              // Tambahkan kelas khusus untuk mengubah gaya tombol
              //button.classList.add("disabled-after-time");
              //button.textContent = "Tombol Dinonaktifkan";
          //}
      //}
  
      // Panggil fungsi saat halaman dimuat
      //window.onload = disableButtonAfterTime;

    //ganti password, buka halaman - console
    //const newPassword = "passwordBaru"; // Ganti dengan password baru
    //const newPasswordHash = CryptoJS.SHA256(newPassword).toString(CryptoJS.enc.Hex);
    //console.log(newPasswordHash); // Salin hash ini ke ADMIN_PASSWORD_HASH
    const CustomSwal = Swal.mixin({
      width: 600, // Atur lebar default
      customClass: {
        popup: 'custom-popup', // Kelas CSS untuk modal
        confirmButton: 'custom-confirm-button', // Kelas CSS untuk tombol konfirmasi
        cancelButton: 'custom-cancel-button', // Kelas CSS untuk tombol cancel
        input: 'custom-input' // Kelas CSS untuk input
      },
      buttonsStyling: false, // Nonaktifkan styling default tombol
      heightAuto: false // Nonaktifkan penyesuaian tinggi otomatis
    });
    
    //PEMBAYARAN
    function filterStudents() {
      const jenjangFilter = document.getElementById('filterJenjang').value;
      const input = document.getElementById('nama');
      
      // Trigger event input untuk refresh hasil pencarian
      if (input.value.length > 1) {
          const event = new Event('input');
          input.dispatchEvent(event);
      }
  }
  
  // Modifikasi fungsi autocompleteName():
  function autocompleteName() {
      const input = document.getElementById('nama');
      const jenjangFilter = document.getElementById('filterJenjang').value;
      
      input.addEventListener('input', function() {
          // ... kode sebelumnya ...
          
          // Tambahkan filter jenjang
          let matches = studentsData.filter(student => 
              (student.nama.toLowerCase().includes(val) || 
              student.nis.toLowerCase().includes(val)) &&
              (jenjangFilter === '' || student.jenjang === jenjangFilter)
          );
          
          // ... tampilkan hasil ...
      });
  }

// Fungsi tampilkan presensi hari ini

  const endpoint = "https://script.google.com/macros/s/AKfycbwqj-P2HF0iS6qymkLZfbDI2w_aGZmSYkeob064uknEXSw5oG9ZckRRyybQlYB3slwY/exec"; // Ganti dengan URL kamu

  function formatTanggalHariIni() {
    const tanggal = new Date();
    const hari = ["Ahad", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const bulan = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli",
                   "Agustus", "September", "Oktober", "November", "Desember"];
    return `${hari[tanggal.getDay()]}, ${tanggal.getDate()}-${bulan[tanggal.getMonth()]}-${tanggal.getFullYear()}`;
  }

/*
 * Memuat data presensi hari ini dari Google Apps Script endpoint
 * dan menampilkannya di bawah tombol pegawai terkait.
 */
let presensiInterval; // Variabel untuk menyimpan interval

function loadPresensiHariIni() {
  const endpoint = "https://script.google.com/macros/s/AKfycbwqj-P2HF0iS6qymkLZfbDI2w_aGZmSYkeob064uknEXSw5oG9ZckRRyybQlYB3slwY/exec";
  
  fetch(endpoint)
    .then((response) => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.json();
    })
    .then(data => {
      data.forEach(pegawai => {
        const namaNormalized = pegawai.nama.replace(/\s+/g, "-");
        const badge = document.getElementById(`presensi-${namaNormalized}`);
        
        if (badge) {
          // Reset class dan konten
          badge.className = "presensi-badge";
          badge.innerHTML = `${pegawai.jam || "--:--"}`;

          // Kriteria 3-level
          if (pegawai.jam) {
            const [hours, minutes] = pegawai.jam.split(':').map(Number);
            
            if (hours < 6 || (hours === 6 && minutes < 30)) {
              // BEFORE 6:30
              badge.innerHTML = `${pegawai.jam} - <span class="keterangan">Sebelum 6:30</span>`;
              badge.classList.add("sebelum-630");
            } 
            else if (hours < 6 || (hours === 6 && minutes < 45)) {
              // BEFORE 6:45
              badge.innerHTML = `${pegawai.jam} - <span class="keterangan">Sebelum 6:45</span>`;
              badge.classList.add("sebelum-645");
            }
            else if (hours < 7 || (hours === 7 && minutes === 0)) {
              // BEFORE 7:00
              badge.innerHTML = `${pegawai.jam} - <span class="keterangan">Sebelum 7:00</span>`;
              badge.classList.add("sebelum-700");
            }
            else if (hours > 11 || (hours === 11 && minutes === 0)) {
              // BEFORE 7:00
              badge.innerHTML = `${pegawai.jam} - <span class="keterangan">Tercatat pulang</span>`;
              badge.classList.add("pulang");
            }
            else {
              // AFTER 7:00 (default case)
              badge.innerHTML = `${pegawai.jam} - <span class="keterangan">Setelah 7:00</span>`;
              badge.classList.add("setelah-700");
            }
          }
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching presensi:", error);
      document.querySelectorAll(".presensi-badge").forEach((div) => {
        div.textContent = "Gagal memuat data";
        div.className = "presensi-badge error";
      });
    });
}

// Fungsi untuk memulai auto-refresh
function startAutoRefresh() {
  loadPresensiHariIni(); // Langsung eksekusi pertama kali
  presensiInterval = setInterval(loadPresensiHariIni, 2000); // Set interval 2 detik
}

// Fungsi untuk menghentikan auto-refresh
function stopAutoRefresh() {
  clearInterval(presensiInterval);
}

// Mulai auto-refresh saat halaman dimuat
document.addEventListener('DOMContentLoaded', () => {
  startAutoRefresh();
  
  // Optional: Hentikan saat tab tidak aktif
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAutoRefresh();
    } else {
      startAutoRefresh();
    }
  });
});

// Panggil fungsi saat halaman dimuat
document.addEventListener("DOMContentLoaded", loadPresensiHariIni);

  function toggleAccordion() {
    document.getElementById("accordionContent").classList.toggle("open");
  }

  window.addEventListener("DOMContentLoaded", loadPresensiHariIni);
