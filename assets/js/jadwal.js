document.addEventListener('DOMContentLoaded', function() {
    // Data jadwal per jenjang (using your existing data)
    const scheduleData = {
        prasekolah: {
            name: "Prasekolah",
            days: [
                {
                    dayName: "Senin",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan dzikir pagi" },
                        { time: "08:00 - 09:00", title: "Motorik Halus", description: "Menggambar dan mewarnai" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Bermain Edukatif", description: "Permainan pengembangan kognitif" },
                        { time: "10:30 - 11:00", title: "Cerita Islami", description: "" }
                    ]
                    
                },
                {
                    dayName: "Selasa",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan dzikir pagi" },
                        { time: "08:00 - 09:00", title: "Motorik Halus", description: "Menggambar dan mewarnai" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Bermain Edukatif", description: "Permainan pengembangan kognitif" },
                        { time: "10:30 - 11:00", title: "Cerita Islami", description: "" }
                    ]
                    
                },
                {
                    dayName: "Rabu",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan dzikir pagi" },
                        { time: "08:00 - 09:00", title: "Motorik Halus", description: "Menggambar dan mewarnai" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Bermain Edukatif", description: "Permainan pengembangan kognitif" },
                        { time: "10:30 - 11:00", title: "Cerita Islami", description: "" }
                    ]
                    
                },
                {
                    dayName: "Kamis",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan dzikir pagi" },
                        { time: "08:00 - 09:00", title: "Motorik Halus", description: "Menggambar dan mewarnai" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Bermain Edukatif", description: "Permainan pengembangan kognitif" },
                        { time: "10:30 - 11:00", title: "Cerita Islami", description: "" }
                    ]
                    
                },
                {
                    dayName: "Jum'at",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan dzikir pagi" },
                        { time: "08:00 - 09:00", title: "Motorik Halus", description: "Menggambar dan mewarnai" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Bermain Edukatif", description: "Permainan pengembangan kognitif" },
                        { time: "10:30 - 11:00", title: "Cerita Islami", description: "" }
                    ]
                    
                },
                // ... (other days for prasekolah)
            ]
        },
        sd1: {
            name: "SD Kelas 1",
            days: [
                {
                    dayName: "Senin",
                    activities: [
                        { time: "07:00 - 07:30", title: "Upacara Bendera", description: "" },
                        { time: "07:30 - 09:00", title: "Matematika", description: "Penjumlahan dan pengurangan" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 11:00", title: "Bahasa Indonesia", description: "Membaca dan menulis" },
                        { time: "11:00 - 12:30", title: "PJOK", description: "Permainan tradisional" }
                    ]
                },
                {
                    dayName: "Selasa",
                    activities: [
                        { time: "07:30 - 09:00", title: "Bahasa Inggris", description: "Kosakata dasar" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 11:00", title: "IPA", description: "Pengenalan alam sekitar" },
                        { time: "11:00 - 12:30", title: "Seni Budaya", description: "Menggambar bebas" }
                    ]
                },
                {
                    dayName: "Rabu",
                    activities: [
                        { time: "07:30 - 09:00", title: "Agama Islam", description: "Kisah Nabi" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 11:00", title: "IPS", description: "Keluarga dan lingkungan" },
                        { time: "11:00 - 12:30", title: "Pramuka", description: "Kegiatan kepramukaan" }
                    ]
                },
                {
                    dayName: "Kamis",
                    activities: [
                        { time: "07:30 - 09:00", title: "Matematika", description: "Pengukuran sederhana" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 11:00", title: "Bahasa Indonesia", description: "Membaca cerita pendek" },
                        { time: "11:00 - 12:30", title: "Komputer Dasar", description: "Pengenalan perangkat" }
                    ]
                },
                {
                    dayName: "Jumat",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembacaan Yasin", description: "" },
                        { time: "08:00 - 09:30", title: "Praktik Sholat", description: "Praktik sholat Dhuha" },
                        { time: "09:30 - 10:00", title: "Istirahat", description: "" },
                        { time: "10:00 - 11:30", title: "Kegiatan Jumat", description: "Piket kelas dan kegiatan khusus" }
                    ]
                }
            ]
        }
        // ... (other levels)
    };

    // Data jadwal ujian (using your existing data)
    const examSchedule = {
        prasekolah: {
            name: "Prasekolah",
            exams: [
                { date: "2025-05-10", subject: "Pengembangan Motorik", time: "08:00-09:30" },
                // ... (other exams)
            ]
        },
        sd1: {
            name: "SD Kelas 1",
            exams: [
                { date: "2025-05-13", subject: "Matematika", time: "07:30-09:00" },
                { date: "2025-05-14", subject: "Bahasa Indonesia", time: "07:30-09:00" },
                { date: "2025-05-15", subject: "IPA", time: "07:30-09:00" },
                { date: "2025-05-16", subject: "Bahasa Inggris", time: "07:30-09:00" },
                { date: "2025-05-17", subject: "Agama Islam", time: "07:30-09:00" }
            ]
        }
        // ... (other levels)
    };

    // Data jadwal seragam (using your existing data)
    const uniformSchedule = {
        prasekolah: [
            { day: "Senin", type: "Seragam Putih-Biru", description: "Baju putih dan celana/rok biru" },
            // ... (other uniform days)
        ],
        sd: [
            { day: "Senin", type: "Seragam Merah", description: "Kemeja merah dan celana hitam" },
            // ... (other uniform days)
        ],
        smp: [
            { day: "Senin", type: "Seragam Abu-Hitam", description: "Baju putih dan celana/rok biru" },
            // ... (other uniform days)
        ]
    };

    // Generate all schedules based on selected level
    function generateSchedule(level) {
        const data = scheduleData[level] || scheduleData.prasekolah;
        const examData = examSchedule[level] || examSchedule.prasekolah;
        const uniformData = level.includes('sd') ? uniformSchedule.sd : 
                         level.includes('smp') ? uniformSchedule.smp : 
                         uniformSchedule.prasekolah;
        
        // Daily Schedule
        const dailyContainer = document.getElementById('daily-schedule');
        dailyContainer.innerHTML = data.days.map(day => `
            <div class="schedule-day mb-6">
                <h3 class="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg mb-3">${day.dayName}</h3>
                ${day.activities.map(activity => `
                    <div class="schedule-item">
                        <div class="schedule-time">${activity.time}</div>
                        <div class="schedule-details">
                            <h4>${activity.title}</h4>
                            ${activity.description ? `<p>${activity.description}</p>` : ''}
                        </div>
                    </div>
                `).join('')}
            </div>
        `).join('');
        
        // Exam Schedule
        const examContainer = document.getElementById('exam-schedule');
        examContainer.innerHTML = examData.exams.map(exam => {
            const examDate = new Date(exam.date);
            const formattedDate = examDate.toLocaleDateString('id-ID', { 
                weekday: 'long', 
                day: 'numeric', 
                month: 'long', 
                year: 'numeric' 
            });
            
            return `
                <div class="schedule-item">
                    <div class="schedule-time">${exam.time.replace('-', ' - ')}</div>
                    <div class="schedule-details">
                        <h4>${exam.subject}</h4>
                        <p>${formattedDate}</p>
                    </div>
                </div>
            `;
        }).join('');
        
        // Uniform Schedule
        const uniformContainer = document.getElementById('uniform-schedule');
        uniformContainer.innerHTML = uniformData.map(uniform => `
            <div class="schedule-item">
                <div class="schedule-time">${uniform.day}</div>
                <div class="schedule-details">
                    <h4>${uniform.type}</h4>
                    ${uniform.description ? `<p>${uniform.description}</p>` : ''}
                </div>
            </div>
        `).join('');
    }

    // Initialize
    const levelSelector = document.getElementById('levelSelector');
    
    if (levelSelector) {
        // Generate initial schedule
        generateSchedule(levelSelector.value);
        
        // Update schedule when level changes
        levelSelector.addEventListener('change', function() {
            generateSchedule(this.value);
        });
    }

    // Helper function to format time (if needed)
    function formatTime(timeStr) {
        return timeStr.replace(/(\d{2}:\d{2})-(\d{2}:\d{2})/, '$1 - $2');
    }
});

// Fungsi untuk inisialisasi accordion
function initAccordion() {
    const accordions = document.querySelectorAll('.accordion');
    
    accordions.forEach(accordion => {
        const header = accordion.querySelector('.accordion-header');
        
        header.addEventListener('click', () => {
            // Tutup semua accordion lainnya
            accordions.forEach(otherAccordion => {
                if (otherAccordion !== accordion) {
                    otherAccordion.classList.remove('active');
                }
            });
            
            // Toggle accordion yang diklik
            accordion.classList.toggle('active');
        });
    });
}

// Panggil fungsi initAccordion setelah DOM dimuat
document.addEventListener('DOMContentLoaded', function() {
    initAccordion();
    
    // Set default: buka jadwal harian pertama kali
    document.querySelector('.accordion').classList.add('active');
});