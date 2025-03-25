// Fungsi untuk generate ID Transaksi
function generateTransactionId() {
    const timestamp = new Date().getTime().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `TRX-${timestamp}-${random}`;
}

// Validasi form
function validateForm() {
    const requiredFields = ['tanggal', 'nama', 'jenjang', 'metode', 'jenis'];
    return requiredFields.every(field => {
        const value = document.getElementById(field).value.trim();
        if(!value) {
            Swal.fire('Peringatan!', `Field ${field} harus diisi`, 'warning');
            return false;
        }
        return true;
    });
}
// Fungsi format currency
function formatCurrency(input) {
    // Hapus semua karakter selain angka
    let value = input.replace(/\D/g, '');
    
    // Format ke Rupiah
    if(value.length > 0) {
        value = parseInt(value, 10).toLocaleString('id-ID');
    }
    
    return value;
}

// Fungsi parse currency (untuk pengiriman data)
function parseCurrency(value) {
    return parseInt(value.replace(/\D/g, ''), 10);
}

// Event listener untuk input nominal
document.getElementById('nominal').addEventListener('input', function(e) {
    this.value = formatCurrency(this.value);
});

// Modifikasi fungsi submitTransaction
async function submitTransaction() {
    if(!validateForm()) return;

    transactionData = {
        tanggal: document.getElementById('tanggal').value,
        nominal: parseCurrency(document.getElementById('nominal').value),
        nama: document.getElementById('nama').value,
        jenjang: document.getElementById('jenjang').value,
        metode: document.getElementById('metode').value,
        jenis: document.getElementById('jenis').value,
        timestamp: new Date().toISOString()
    };

    // ... kode selanjutnya tetap sama
}

// Modifikasi fungsi showPaymentProof
function showPaymentProof(transactionId) {
    const proofText = `ID Transaksi: ${transactionId}
Tanggal       : ${transactionData.tanggal}
Nama         : ${transactionData.nama}
Jenjang      : ${transactionData.jenjang}
Metode      : ${transactionData.metode}
Jenis        : ${transactionData.jenjang}
Nominal     : Rp ${transactionData.nominal.toLocaleString('id-ID')}`;

    document.getElementById('proofDetails').textContent = proofText;
    document.getElementById('paymentProof').style.display = 'block';
}