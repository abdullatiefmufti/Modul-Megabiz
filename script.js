// 1. Data Schema JavaScript
const megaBizTutorials = [
    {
        judul: "Panduan Penambahan Rekening MegaBiz",
        deskripsi: "Walkthrough langkah demi langkah melakukan penambahan rekening melalui User ID SYSADMIN hingga proses otorisasi Pending Task.",
        kategori: "Account Management",
        // Sesuaikan dengan nama file PDF di folder 'files'
        linkDownload: "files/Modul_Penambahan_Rekening.pdf" 
    },
    {
        judul: "International Transfer By MegaBiz",
        deskripsi: "Panduan komprehensif untuk menginisiasi transfer internasional, pengisian detail penerima, tujuan transaksi, hingga deklarasi kepatuhan.",
        kategori: "Transfer Management",
        // Sesuaikan dengan nama file PDF di folder 'files'
        linkDownload: "files/Modul_International_Transfer.pdf"
    }
];

const tutorialContainer = document.getElementById('tutorialContainer');
const searchInput = document.getElementById('searchInput');

// 2. Fungsi Render Kartu ke HTML (Hanya ada tombol Download)
function renderTutorials(data) {
    tutorialContainer.innerHTML = ''; // Kosongkan kontainer sebelum render

    if (data.length === 0) {
        tutorialContainer.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Tutorial tidak ditemukan.</p>`;
        return;
    }

    data.forEach((item, index) => {
        // Auto-numbering
        const nomorUrut = index + 1; 

        const cardHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow relative">
                <div class="absolute -top-3 -left-3 bg-mega text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">
                    ${nomorUrut}
                </div>
                
                <span class="text-xs font-semibold text-mega bg-orange-50 px-2 py-1 rounded w-max mb-3 uppercase tracking-wider">
                    ${item.kategori}
                </span>
                <h2 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${item.judul}</h2>
                <p class="text-sm text-gray-600 mb-6 flex-grow">${item.deskripsi}</p>
                
                <div class="flex flex-col mt-auto">
                    <a href="${item.linkDownload}" download class="text-center bg-mega hover:bg-orange-600 text-white font-medium py-2 px-4 rounded transition-colors text-sm">
                        Download PDF
                    </a>
                </div>
            </div>
        `;
        tutorialContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// 3. Fitur Pencarian Otomatis (Live Search Filter)
searchInput.addEventListener('input', (e) => {
    const kataKunci = e.target.value.toLowerCase();
    
    // Menyaring berdasarkan Judul ATAU Deskripsi
    const hasilFilter = megaBizTutorials.filter(tutorial => {
        return tutorial.judul.toLowerCase().includes(kataKunci) || 
               tutorial.deskripsi.toLowerCase().includes(kataKunci);
    });
    
    renderTutorials(hasilFilter);
});

// 4. Render pertama kali saat halaman dimuat
renderTutorials(megaBizTutorials);