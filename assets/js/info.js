// Fungsi untuk tombol aksi
function openMaps() {
    const address = encodeURIComponent("Jl. Pendidikan No. 123, Kota Bandung");
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`, '_blank');
}

function makeCall(phoneNumber) {
    if (confirm(`Hubungi ${phoneNumber}?`)) {
        window.location.href = `tel:${phoneNumber}`;
    }
}

function showAbout() {
    Swal.fire({
        title: 'Tentang Aplikasi',
        html: `
            <div style="text-align:left">
                <p><strong>Shahaba Hub v1.0</strong></p>
                <p>Aplikasi portal orang tua SD Shahaba</p>
                <p>Dikembangkan oleh Tim IT SD Shahaba</p>
                <hr>
                <p>© 2025 - All Rights Reserved</p>
            </div>
        `,
        icon: 'info',
        confirmButtonColor: 172e69
    });
}

// Animasi scroll
document.addEventListener('DOMContentLoaded', function() {
    const sections = document.querySelectorAll('.info-section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = 1;
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => {
        section.style.opacity = 0;
        section.style.transform = 'translateY(20px)';
        section.style.transition = 'all 0.6s ease-out';
        observer.observe(section);
    });
});

// Jika menggunakan Firebase untuk data dinamis
function loadSchoolInfo() {
    // Contoh: Ambil data dari Firebase
    /*
    const db = getDatabase();
    const infoRef = ref(db, 'schoolInfo');
    
    onValue(infoRef, (snapshot) => {
        const data = snapshot.val();
        // Update DOM dengan data terbaru
    });
    */
}