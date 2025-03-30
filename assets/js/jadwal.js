document.addEventListener('DOMContentLoaded', function() {
    // Data jadwal per jenjang
    const scheduleData = {
        prasekolah: {
            name: "Prasekolah",
            days: [
                {
                    dayName: "Senin",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan menyanyi" },
                        { time: "08:00 - 09:00", title: "Motorik Halus", description: "Menggambar dan mewarnai" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Bermain Edukatif", description: "Permainan pengembangan kognitif" },
                        { time: "10:30 - 11:00", title: "Cerita Islami", description: "" }
                    ]
                },
                {
                    dayName: "Selasa",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan menyanyi" },
                        { time: "08:00 - 09:00", title: "Motorik Kasar", description: "Olahraga dan permainan luar" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Seni dan Kreativitas", description: "Membuat karya seni sederhana" }
                    ]
                },
                {
                    dayName: "Rabu",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan menyanyi" },
                        { time: "08:00 - 09:00", title: "Bahasa", description: "Pengenalan huruf dan kata" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Matematika Dasar", description: "Pengenalan angka dan bentuk" }
                    ]
                },
                {
                    dayName: "Kamis",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan menyanyi" },
                        { time: "08:00 - 09:00", title: "Sains Dasar", description: "Eksperimen sederhana" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Musik dan Gerak", description: "Bernyanyi dan menari" }
                    ]
                },
                {
                    dayName: "Jumat",
                    activities: [
                        { time: "07:30 - 08:00", title: "Pembukaan", description: "Doa pagi dan menyanyi" },
                        { time: "08:00 - 09:00", title: "Agama Islam", description: "Kisah Nabi dan doa-doa" },
                        { time: "09:00 - 09:30", title: "Istirahat", description: "" },
                        { time: "09:30 - 10:30", title: "Kegiatan Akhir Pekan", description: "Review mingguan dan permainan" }
                    ]
                }
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
                // Hari lainnya untuk SD Kelas 1...
            ]
        },
        // Data jenjang lainnya (sd2, sd3, sd5, sd6, smp9)...
    };

    // Data jadwal ujian
    const examSchedule = {
        prasekolah: {
            name: "Prasekolah",
            exams: [
                { date: "2025-05-10", subject: "Pengembangan Motorik", time: "08:00-09:30" },
                { date: "2025-05-11", subject: "Kognitif Dasar", time: "08:00-09:30" },
                { date: "2025-05-12", subject: "Bahasa dan Komunikasi", time: "08:00-09:00" }
            ]
        },
        sd1: {
            name: "SD Kelas 1",
            exams: [
                { date: "2025-05-13", subject: "Matematika", time: "07:30-09:00" },
                { date: "2025-05-14", subject: "Bahasa Indonesia", time: "07:30-09:00" },
                { date: "2025-05-15", subject: "IPA", time: "07:30-09:00" }
            ]
        },
        // Data ujian jenjang lainnya...
    };

    // Data jadwal seragam
    const uniformSchedule = {
        prasekolah: [
            { day: "Senin", type: "Seragam Putih-Biru", description: "Baju putih dan celana/rok biru" },
            { day: "Selasa", type: "Seragam Olahraga", description: "Kaos olahraga sekolah" },
            { day: "Rabu", type: "Seragam Batik", description: "Batik sekolah" },
            { day: "Kamis", type: "Seragam Pramuka", description: "Seragam lengkap pramuka" },
            { day: "Jumat", type: "Seragam Muslim", description: "Baju putih dan celana/rok hitam" }
        ],
        sd: [
            { day: "Senin", type: "Seragam Putih-Merah", description: "Baju putih dan celana/rok merah" },
            { day: "Selasa", type: "Seragam Olahraga", description: "Kaos olahraga sekolah" },
            { day: "Rabu", type: "Seragam Batik", description: "Batik sekolah" },
            { day: "Kamis", type: "Seragam Pramuka", description: "Seragam lengkap pramuka" },
            { day: "Jumat", type: "Seragam Muslim", description: "Baju putih dan celana/rok hitam" }
        ],
        smp: [
            { day: "Senin", type: "Seragam Putih-Biru", description: "Baju putih dan celana/rok biru tua" },
            { day: "Selasa", type: "Seragam Olahraga", description: "Kaos olahraga sekolah" },
            { day: "Rabu", type: "Seragam Batik", description: "Batik sekolah" },
            { day: "Kamis", type: "Seragam Pramuka", description: "Seragam lengkap pramuka" },
            { day: "Jumat", type: "Seragam Muslim", description: "Baju putih dan celana/rok hitam" }
        ]
    };

    // Render jadwal berdasarkan jenjang
    function renderScheduleByLevel(level) {
        const schedule = scheduleData[level];
        if (!schedule) return;
        
        const container = document.querySelector('.schedule-container');
        container.innerHTML = '';

        schedule.days.forEach(day => {
            const dayElement = document.createElement('div');
            dayElement.className = 'schedule-day';
            
            let activitiesHTML = '';
            day.activities.forEach(activity => {
                activitiesHTML += `
                    <div class="schedule-item">
                        <div class="time-badge">${activity.time}</div>
                        <div class="activity-details">
                            <h4 class="activity-title">${activity.title}</h4>
                            ${activity.description ? `<p class="activity-description">${activity.description}</p>` : ''}
                        </div>
                    </div>
                `;
            });
            
            dayElement.innerHTML = `
                <div class="schedule-header">
                    <h3 class="day-name">${day.dayName}</h3>
                </div>
                ${activitiesHTML}
            `;
            
            container.appendChild(dayElement);
        });
    }

    // Render jadwal ujian
    function renderExamSchedule(level) {
        const exams = examSchedule[level];
        if (!exams) return;
        
        const container = document.querySelector('.exam-container');
        container.innerHTML = '';

        exams.exams.forEach(exam => {
            const examElement = document.createElement('div');
            examElement.className = 'exam-item';
            examElement.innerHTML = `
                <div class="exam-date">${formatDate(exam.date)}</div>
                <div class="exam-details">
                    <h4 class="exam-subject">${exam.subject}</h4>
                    <div class="exam-time">${exam.time}</div>
                </div>
            `;
            container.appendChild(examElement);
        });
    }

    // Render jadwal seragam
    function renderUniformSchedule(level) {
        let uniforms;
        if (level === 'smp9') {
            uniforms = uniformSchedule.smp;
        } else if (['prasekolah'].includes(level)) {
            uniforms = uniformSchedule.prasekolah;
        } else {
            uniforms = uniformSchedule.sd;
        }
        
        const container = document.querySelector('.uniform-container');
        container.innerHTML = '';

        uniforms.forEach(item => {
            const uniformElement = document.createElement('div');
            uniformElement.className = 'uniform-day';
            uniformElement.innerHTML = `
                <div class="uniform-day-name">${item.day}</div>
                <div class="uniform-details">
                    <div class="uniform-type">${item.type}</div>
                    <div class="uniform-description">${item.description}</div>
                </div>
            `;
            container.appendChild(uniformElement);
        });
    }

    // Format tanggal
    function formatDate(dateString) {
        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('id-ID', options);
    }

    // Inisialisasi
    const levelSelector = document.getElementById('levelSelector');
    if (levelSelector) {
        levelSelector.addEventListener('change', function() {
            const selectedLevel = this.value;
            renderScheduleByLevel(selectedLevel);
            renderExamSchedule(selectedLevel);
            renderUniformSchedule(selectedLevel);
        });

        // Render awal
        renderScheduleByLevel('prasekolah');
        renderExamSchedule('prasekolah');
        renderUniformSchedule('prasekolah');
    }
});