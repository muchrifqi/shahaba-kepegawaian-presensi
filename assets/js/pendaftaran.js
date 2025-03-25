// Data Default Tagihan Berdasarkan Tahun Ajaran dan Jenjang
const defaultTagihan = {
    "2024/2025": {
        "Prasekolah": [
            { jenis: "Uang Pangkal", nominal: 5000000, wajib: true },
            { jenis: "SPP Bulanan", nominal: 750000, wajib: true }
        ],
        "SD": [
            { jenis: "Uang Pangkal", nominal: 3500000, wajib: true },
            { jenis: "SPP Bulanan", nominal: 650000, wajib: true }
        ]
    },
    "2025/2026": {
        "Prasekolah": [
            { jenis: "Uang Pangkal", nominal: 5500000, wajib: true },
            { jenis: "SPP Bulanan", nominal: 800000, wajib: true }
        ],
        "SD": [
            { jenis: "Uang Pangkal", nominal: 4000000, wajib: true },
            { jenis: "SPP Bulanan", nominal: 700000, wajib: true }
        ]
    }
};

// Inisialisasi Tagihan Saat Jenjang/Tahun Ajaran Berubah
document.getElementById('jenjang').addEventListener('change', updateTagihan);
document.getElementById('tahun_ajaran').addEventListener('change', updateTagihan);

function updateTagihan() {
    const jenjang = document.getElementById('jenjang').value;
    const tahunAjaran = document.getElementById('tahun_ajaran').value;
    const container = document.getElementById('tagihan-list');
    container.innerHTML = '';

    if (jenjang && tahunAjaran && defaultTagihan[tahunAjaran]?.[jenjang]) {
        defaultTagihan[tahunAjaran][jenjang].forEach((tagihan, index) => {
            tambahTagihan({
                jenis: tagihan.jenis,
                nominal: tagihan.nominal,
                isDefault: tagihan.wajib,
                index: index
            });
        });
    }
    hitungTotal();
}

// Fungsi Tambah Tagihan
function tambahTagihan(data = {}) {
    const container = document.getElementById('tagihan-list');
    const id = Date.now();
    
    const div = document.createElement('div');
    div.className = 'tagihan-item';
    div.dataset.id = id;
    div.innerHTML = `
        ${data.isDefault ? '' : '<span class="remove-tagihan" onclick="hapusTagihan(this)"><i class="fas fa-times"></i></span>'}
        <select class="jenis-tagihan" required>
            <option value="">Pilih Jenis Tagihan</option>
            <option value="Uang Pangkal" ${data.jenis === 'Uang Pangkal' ? 'selected' : ''}>Uang Pangkal</option>
            <option value="SPP Bulanan" ${data.jenis === 'SPP Bulanan' ? 'selected' : ''}>SPP Bulanan</option>
            <option value="Seragam" ${data.jenis === 'Seragam' ? 'selected' : ''}>Seragam</option>
            <option value="Buku Paket" ${data.jenis === 'Buku Paket' ? 'selected' : ''}>Buku Paket</option>
            <option value="Lainnya">Lainnya</option>
        </select>
        <input type="text" class="nama-tagihan" placeholder="Nama Tagihan Khusus" style="${data.jenis === 'Lainnya' ? '' : 'display: none;'}">
        <input type="number" class="nominal-tagihan" placeholder="Nominal" value="${data.nominal || ''}" required>
    `;

    container.appendChild(div);
    
    // Event listener untuk jenis tagihan
    div.querySelector('.jenis-tagihan').addEventListener('change', function() {
        const namaTagihanInput = div.querySelector('.nama-tagihan');
        namaTagihanInput.style.display = this.value === 'Lainnya' ? 'block' : 'none';
        hitungTotal();
    });
    
    // Event listener untuk nominal
    div.querySelector('.nominal-tagihan').addEventListener('input', hitungTotal);
}

// Fungsi Hapus Tagihan
function hapusTagihan(element) {
    element.parentElement.remove();
    hitungTotal();
}

// Fungsi Hitung Total
function hitungTotal() {
    const items = document.querySelectorAll('.tagihan-item');
    let total = 0;
    
    items.forEach(item => {
        const nominal = parseFloat(item.querySelector('.nominal-tagihan').value) || 0;
        total += nominal;
    });
    
    document.getElementById('total-tagihan').textContent = formatRupiah(total);
}

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