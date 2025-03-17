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
            (loc) => calculateDistance(userLat, userLng, loc.lat, loc.lng) <= 20
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
  buttons.forEach(button => {
    const nama = button.innerText;
    if (status[nama] === "Nonaktif") {
      button.disabled = true;
      button.innerText = `${nama} ✓`;
    }
  });
}

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
    const waktu = new Date().toLocaleTimeString();
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

    // Fungsi-fungsi Pengumuman
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbx4zfI-4mYrQ5Wx5u6qYoJ4Z0bt2848P4pDh_MeufnwxPNi-1TBZNJjR7b02d3c9piK/exec';
    const ADMIN_PASSWORD = "151951"; // Ganti dengan password admin Anda

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
    document.getElementById('adminAnnouncementButton').addEventListener('click', () => {
      const password = prompt("Masukkan password admin:");
      if (password === ADMIN_PASSWORD) {
        const newAnnouncement = prompt("Masukkan pengumuman baru:");
        if (newAnnouncement) {
          setAnnouncement(newAnnouncement);
          alert("Pengumuman berhasil diperbarui!");
        }
      } else {
        alert("Password salah!");
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
      setInterval(updateButtonStatus, 3000); // Periksa status tombol setiap 5 detik
    };