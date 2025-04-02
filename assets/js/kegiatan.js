let currentGallery = [];
let currentIndex = 0;

// Data Kegiatan
const kegiatanData = {
    prasekolah: [
        {
            id: 1,
            image: '../assets/images/prasekolah1.jpg',
            caption: 'Kegiatan seni kreatif dengan finger painting'
        },
        {
            id: 2,
            image: '../assets/images/prasekolah2.jpg',
            caption: 'Bermain peran profesi di area bermain'
        },
        {
            id: 3,
            image: '../assets/images/prasekolah_belajar1.jpg',
            caption: 'Belajar berhitung dengan media konkret'
        },
        {
            id: 4,
            image: '../assets/images/prasekolah_outing1.jpg',
            caption: 'Outdoor activity to Kuntum Farm Field'
        },
        {
            id: 5,
            image: '../assets/images/prasekolah5.jpg',
            caption: 'Story telling dengan guru'
        }
    ],
    sd: [
        {
            id: 6,
            image: '../assets/images/sd_outing1.jpg',
            caption: 'Outdoor activity to Museum'
        },
        {
            id: 7,
            image: '../assets/images/sd2.jpg',
            caption: 'Presentasi proyek kelompok'
        },
        {
            id: 8,
            image: '../assets/images/sd3.jpg',
            caption: 'Kegiatan ekstrakurikuler pramuka'
        },
        {
            id: 9,
            image: '../assets/images/sd4.jpg',
            caption: 'Lomba cerdas cermat antar kelas'
        },
        {
            id: 10,
            image: '../assets/images/sd_karya1.jpg',
            caption: 'Karya seni siswa kelas 4'
        }
    ]
};

// Inisialisasi Galeri
function initGalleries() {
    renderGallery('prasekolah');
    renderGallery('sd');
    setupLightbox();
    startAutoScroll();
}

// Render Gallery
function renderGallery(type) {
    const gallery = document.getElementById(`${type}Gallery`);
    const track = gallery.querySelector('.gallery-track');
    
    // Duplikasi item untuk efek scroll tak terbatas
    const items = [...kegiatanData[type], ...kegiatanData[type]];
    
    track.innerHTML = items.map(item => `
        <div class="gallery-item" data-id="${item.id}">
            <img src="${item.image}" alt="${item.caption}" class="gallery-image">
            <div class="gallery-caption">${item.caption}</div>
        </div>
    `).join('');
    
    // Set lebar track berdasarkan jumlah item
    track.style.width = `calc(${350 * items.length}px + ${1.5 * (items.length - 1)}rem)`;
}

// Setup Lightbox
function setupLightbox() {
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImage');
    const caption = document.querySelector('.lightbox-caption');
    const downloadBtn = document.getElementById('downloadBtn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');

    // Gabungkan semua gambar dari kedua galeri
    currentGallery = [...kegiatanData.prasekolah, ...kegiatanData.sd];
    
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const imgId = parseInt(this.dataset.id);
            currentIndex = currentGallery.findIndex(img => img.id === imgId);
            updateLightbox();
            
            lightbox.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Navigasi gambar
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'ArrowLeft') {
                showPrevImage();
            } else if (e.key === 'ArrowRight') {
                showNextImage();
            } else if (e.key === 'Escape') {
                closeLightbox();
            }
        }
    });
    
    // Close lightbox
    document.querySelector('.close-btn').addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', function(e) {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
}

// Auto Scroll Animation
function startAutoScroll() {
    const galleries = document.querySelectorAll('.gallery-track');
    let scrollPos = 0;
    
    function animate() {
        scrollPos -= 0.5;
        
        galleries.forEach(track => {
            const trackWidth = track.scrollWidth / 2;
            
            if (Math.abs(scrollPos) >= trackWidth) {
                scrollPos = 0;
            }
            
            track.style.transform = `translateX(${scrollPos}px)`;
        });
        
        requestAnimationFrame(animate);
    }
    
    animate();
}

// Lightbox Functions
function updateLightbox() {
    const lightboxImg = document.getElementById('lightboxImage');
    const caption = document.querySelector('.lightbox-caption');
    const downloadBtn = document.getElementById('downloadBtn');
    
    // Handle circular navigation
    if (currentIndex < 0) currentIndex = currentGallery.length - 1;
    if (currentIndex >= currentGallery.length) currentIndex = 0;
    
    const currentImage = currentGallery[currentIndex];
    const today = new Date();
    const formattedDate = `${today.getDate()}-${today.getMonth()+1}-${today.getFullYear()}`;
    const downloadFileName = `kegiatan_shahaba_${formattedDate}.jpg`;
    
    // Update lightbox content
    lightboxImg.src = currentImage.image;
    lightboxImg.alt = currentImage.caption;
    caption.textContent = currentImage.caption;
    
    downloadBtn.onclick = function(e) {
        e.preventDefault();
        const link = document.createElement('a');
        link.href = currentImage.image;
        link.download = downloadFileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    
    // Preload adjacent images
    preloadImages();
}

function showPrevImage() {
    currentIndex--;
    updateLightbox();
}

function showNextImage() {
    currentIndex++;
    updateLightbox();
}

function closeLightbox() {
    document.getElementById('lightbox').style.display = 'none';
    document.body.style.overflow = 'auto';
}

function preloadImages() {
    // Preload 2 images before and after current
    for (let i = 1; i <= 2; i++) {
        const prevIndex = (currentIndex - i + currentGallery.length) % currentGallery.length;
        const nextIndex = (currentIndex + i) % currentGallery.length;
        
        new Image().src = currentGallery[prevIndex].image;
        new Image().src = currentGallery[nextIndex].image;
    }
}

// Panggil saat halaman dimuat
document.addEventListener('DOMContentLoaded', initGalleries);

/* Uncomment jika menggunakan API
async function loadGalleryFromAPI() {
    try {
        const response = await fetch('API_ENDPOINT');
        const data = await response.json();
        kegiatanData.prasekolah = data.prasekolah || [];
        kegiatanData.sd = data.sd || [];
        initGalleries();
    } catch (error) {
        console.error('Error loading gallery data:', error);
    }
}
*/