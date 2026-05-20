// =========================================================================
// 1. KONFIGURASI SUPABASE (Isi dengan data yang sama seperti di admin.html)
// =========================================================================
const SUPABASE_URL = 'https://psetlxotcksmchwwpgyp.supabase.co/rest/v1/'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXRseG90Y2tzbWNod3dwZ3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzYwNDksImV4cCI6MjA5NDgxMjA0OX0.4kXyq8RxXAhDtRTjL1JUYVO5sVZ0nvnlnmCpUNTrpfM'; 
const supabase = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const tutorialContainer = document.getElementById('tutorialContainer');
const searchInput = document.getElementById('searchInput');

// Kita siapkan variabel kosong untuk menampung data dari database cloud
let megaBizTutorials = [];

// =========================================================================
// 2. FUNGSI UNTUK MENGAMBIL DATA DARI DATABASE CLOUD (SUPABASE)
// =========================================================================
async function ambilDataDariSupabase() {
    try {
        // Memanggil tabel 'modul_tutorial' dan mengambil semua baris datanya
        const { data, error } = await supabase
            .from('modul_tutorial')
            .select('*');

        if (error) throw error;

        // Simpan data dari database ke variabel lokal kita
        megaBizTutorials = data;

        // Render data tersebut ke layar website
        renderTutorials(megaBizTutorials);

    } catch (error) {
        console.error("Gagal mengambil data database:", error.message);
        tutorialContainer.innerHTML = `
            <p class="col-span-full text-center text-red-500 py-10 font-bold">
                ❌ Gagal memuat modul dari database cloud. Periksa konsol browser Anda.
            </p>`;
    }
}

// =========================================================================
// 3. FUNGSI UNTUK MENGGAMBAR KARTU-KARTU UI DI LAYAR
// =========================================================================
function renderTutorials(data) {
    tutorialContainer.innerHTML = ''; 

    if (data.length === 0) {
        tutorialContainer.innerHTML = `<p class="col-span-full text-center text-gray-500 py-10">Modul tidak ditemukan.</p>`;
        return;
    }

    data.forEach((item, index) => {
        const nomorUrut = index + 1; 

        // Sesuai dengan nama kolom yang kita buat di database Supabase sebelumnya
        const cardHTML = `
            <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col hover:shadow-md transition-shadow relative">
                <div class="absolute -top-3 -left-3 bg-orange-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-sm">
                    ${nomorUrut}
                </div>
                
                <span class="text-xs font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded w-max mb-3 uppercase tracking-wider">
                    ${item.kategori}
                </span>
                <h2 class="text-lg font-bold text-gray-800 mb-2 leading-tight">${item.judul}</h2>
                <p class="text-sm text-gray-600 mb-6 flex-grow">${item.deskripsi}</p>
                
                <div class="flex flex-col gap-2 mt-auto">
                    <a href="${item.link_pdf}" target="_blank" class="w-full text-center bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 rounded transition-colors text-sm">
                        Download PDF
                    </a>
                    <a href="${item.link_interaktif}" class="w-full text-center border border-orange-500 text-orange-500 hover:bg-orange-50 font-medium py-2 rounded transition-colors text-sm">
                        Buka Panduan Interaktif
                    </a>
                </div>
            </div>
        `;
        tutorialContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// =========================================================================
// 4. FITUR PENCARIAN OTOMATIS
// =========================================================================
searchInput.addEventListener('input', (e) => {
    const kataKunci = e.target.value.toLowerCase();
    const hasilFilter = megaBizTutorials.filter(tutorial => {
        return tutorial.judul.toLowerCase().includes(kataKunci) || 
               tutorial.deskripsi.toLowerCase().includes(kataKunci);
    });
    renderTutorials(hasilFilter);
});

// =========================================================================
// 5. EKSEKUSI PENGAMBILAN DATA SAAT WEB PERTAMA KALI DIBUKA
// =========================================================================
ambilDataDariSupabase();