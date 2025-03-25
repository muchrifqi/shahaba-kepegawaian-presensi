// Format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Simpan Data (Updated)
async function simpanData() {
    const formData = {
        // Data peserta didik dan orang tua
        ...collectFormData('#formPendaftaran'),
        
        // Data tagihan
        tagihan: collectTagihanData()
    };
    
    // Kirim ke server
    console.log('Data yang akan dikirim:', formData);
    // ... implementasi fetch ke server
}

function collectFormData(selector) {
    const data = {};
    const elements = document.querySelectorAll(`${selector} input, ${selector} select, ${selector} textarea`);
    
    elements.forEach(el => {
        if (el.id && !el.classList.contains('nominal-tagihan') && !el.classList.contains('jenis-tagihan')) {
            data[el.id] = el.value;
        }
    });
    
    return data;
}

function collectTagihanData() {
    const tagihan = [];
    document.querySelectorAll('.tagihan-item').forEach(item => {
        const jenis = item.querySelector('.jenis-tagihan').value;
        tagihan.push({
            jenis: jenis === 'Lainnya' ? item.querySelector('.nama-tagihan').value : jenis,
            nominal: parseFloat(item.querySelector('.nominal-tagihan').value) || 0
        });
    });
    return tagihan;
}