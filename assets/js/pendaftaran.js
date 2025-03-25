// Format Rupiah
function formatRupiah(angka) {
    return 'Rp ' + angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// Simpan Data (Updated)
async function simpanData() {
    const formData = {
        ...collectFormData('#formPendaftaran'),
        action: 'saveRegistration'
    };
    
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwpRaxd890JFJMCTgYnBCGdKb6TZUhr96Ij-G2D0YFhfAM4zpEG67ocbVnxBU7HZn6L/exec', {
            method: 'POST',
            mode: 'cors', // Tambahkan ini
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (!response.ok) throw new Error('Network response was not ok');
        
        const result = await response.json();
        if(result.success) {
            Swal.fire('Sukses!', 'Pendaftaran berhasil disimpan', 'success');
            resetForm();
        } else {
            Swal.fire('Error', result.message || 'Gagal menyimpan data', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        Swal.fire('Error', 'Terjadi kesalahan saat menyimpan data: ' + error.message, 'error');
    }
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
async function simpanData() {
    const formData = {
        ...collectFormData('#formPendaftaran'),
        action: 'saveRegistration'
    };
    
    try {
        const response = await fetch('https://script.google.com/macros/s/AKfycbwpRaxd890JFJMCTgYnBCGdKb6TZUhr96Ij-G2D0YFhfAM4zpEG67ocbVnxBU7HZn6L/exec', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        const result = await response.json();
        if(result.success) {
            alert('Pendaftaran berhasil disimpan!');
            resetForm();
        } else {
            alert('Error: ' + result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menyimpan data');
    }
}
function resetForm() {
    document.getElementById('formPendaftaran').reset();
}
async function uploadFiles() {
    const files = [
        document.getElementById('akta_kelahiran').files[0],
        document.getElementById('ktp_ortu').files[0],
        document.getElementById('kk').files[0],
        document.getElementById('foto').files[0]
    ].filter(file => file);
    
    const uploadPromises = files.map(file => {
        const formData = new FormData();
        formData.append('action', 'uploadDocument');
        formData.append('filename', file.name);
        formData.append('mimeType', file.type);
        formData.append('file', file);
        
        return fetch('https://script.google.com/macros/s/AKfycbwpRaxd890JFJMCTgYnBCGdKb6TZUhr96Ij-G2D0YFhfAM4zpEG67ocbVnxBU7HZn6L/exec', {
            method: 'POST',
            body: formData
        });
    });
    
    return Promise.all(uploadPromises);
}
async function handleSubmit() {
    // Validasi form
    if(!document.getElementById('formPendaftaran').checkValidity()) {
        alert('Harap isi semua field yang wajib diisi!');
        return;
    }
    
    try {
        // Upload file terlebih dahulu
        const uploadResponses = await uploadFiles();
        const uploadResults = await Promise.all(uploadResponses.map(r => r.json()));
        
        // Simpan data pendaftaran
        await simpanData();
    } catch (error) {
        console.error('Error:', error);
        alert('Terjadi kesalahan saat menyimpan data');
    }
}