// =========================================================================
// 1. KONEKSI KE SUPABASE DENGAN VARIABEL BARU AGAR TIDAK BENTROK
// =========================================================================
const SUPABASE_URL = 'https://psetlxotcksmchwwpgyp.supabase.co'; 
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBzZXRseG90Y2tzbWNod3dwZ3lwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkyMzYwNDksImV4cCI6MjA5NDgxMjA0OX0.4kXyq8RxXAhDtRTjL1JUYVO5sVZ0nvnlnmCpUNTrpfM'; 
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

const tutorialContainer = document.getElementById('tutorialContainer');
const searchInput = document.getElementById('searchInput');

let megaBizTutorials = []; // Wadah penampung data cloud
let kategoriAktif = 'Semua';

// =========================================================================
// 2. AMBIL DATA DARI CLOUD DATABASE
// =========================================================================
async function ambilDataDariSupabase() {
    try {
        const { data, error } = await supabaseClient
            .from('modul_tutorial')
            .select('*')
            .order('created_at', { ascending: true }); // Mengurutkan dari modul terlama ke terbaru

        if (error) throw error;

        megaBizTutorials = data;
        jalankanFilterDanCari();

    } catch (error) {
        console.error("Gagal sinkronisasi data:", error.message);
        tutorialContainer.innerHTML = `
            <div class="col-span-full text-center bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 font-bold">
                ❌ Gangguan Sistem: Gagal menyinkronkan data dari cloud database. (${error.message})
            </div>`;
    }
}

// =========================================================================
// 3. FUNGSI UNTUK MENGGAMBAR KARTU-KARTU UI SECARA PREMIUM
// =========================================================================
function renderTutorials(data) {
    tutorialContainer.innerHTML = ''; 

    if (data.length === 0) {
        tutorialContainer.innerHTML = `
            <div class="col-span-full text-center py-16 bg-white rounded-2xl border border-dashed border-gray-200">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                <p class="text-gray-500 font-medium">Modul panduan tidak ditemukan atau belum diunggah.</p>
            </div>`;
        return;
    }

    data.forEach((item, index) => {
        const nomorUrut = index + 1; 

        const cardHTML = `
            <div class="bg-white rounded-2xl shadow-md hover:shadow-xl border border-gray-100 p-6 flex flex-col hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
                <div class="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-orange-400 to-mega opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <div class="absolute -top-2 -left-2 bg-gradient-to-br from-orange-400 to-mega text-white w-9 h-9 rounded-xl flex items-center justify-center font-extrabold shadow-md transform -rotate-6 group-hover:rotate-0 transition-transform">
                    ${nomorUrut}
                </div>
                
                <div class="mt-2 flex items-center justify-between mb-3">
                    <span class="text-[10px] font-black uppercase tracking-widest text-mega bg-orange-50 px-2.5 py-1 rounded-md">
                        ${item.kategori}
                    </span>
                </div>

                <h2 class="text-lg font-bold text-gray-900 mb-2 leading-snug group-hover:text-mega transition-colors">${item.judul}</h2>
                <p class="text-xs leading-relaxed text-gray-500 mb-6 flex-grow line-clamp-3">${item.deskripsi}</p>
                
                <div class="mt-auto flex flex-col gap-2">
                    <a href="${item.link_pdf}" target="_blank" class="w-full flex items-center justify-center gap-2 bg-gray-900 hover:bg-mega text-white font-bold py-2.5 px-4 rounded-xl transition-all duration-300 shadow-sm text-xs hover:shadow-lg">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                        Download Panduan (PDF)
                    </a>
                    
                    ${item.link_video ? `
                    <a href="${item.link_video}" target="_blank" class="w-full flex items-center justify-center gap-2 border border-red-500 text-red-500 hover:bg-red-50 font-bold py-2.5 px-4 rounded-xl transition-all duration-300 text-xs">
                        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M19.615 3.184c-3.604-.246-11.631-.245-15.23 0-3.897.266-4.356 2.62-4.385 8.816.029 6.185.484 8.549 4.385 8.816 3.6.245 11.626.246 15.23 0 3.897-.266 4.356-2.62 4.385-8.816-.029-6.185-.484-8.549-4.385-8.816zm-10.615 12.816v-8l8 3.993-8 4.007z"/></svg>
                        Tonton Video Tutorial
                    </a>
                    ` : ''}
                </div>
            </div>
        `;
        tutorialContainer.insertAdjacentHTML('beforeend', cardHTML);
    });
}

// =========================================================================
// 4. LOGIKA INTEGRASI FILTER DAN PENCARIAN (GABUNGAN)
// =========================================================================
function jalankanFilterDanCari() {
    const kataKunci = searchInput.value.toLowerCase();
    
    const hasilFilter = megaBizTutorials.filter(tutorial => {
        const cocokKategori = (kategoriAktif === 'Semua') || (tutorial.kategori === kategoriAktif);
        const cocokKataKunci = tutorial.judul.toLowerCase().includes(kataKunci) || 
                              tutorial.deskripsi.toLowerCase().includes(kataKunci);
        return cocokKategori && cocokKataKunci;
    });
    
    renderTutorials(hasilFilter);
}

// Fungsi Trigger Tombol Filter Tab
window.filterKategori = function(namaKategori) {
    kategoriAktif = namaKategori;
    
    // Atur efek aktif pada tombol tab
    const tombolTab = document.querySelectorAll('.tab-btn');
    tombolTab.forEach(btn => {
        if(btn.innerText.includes(namaKategori) || (namaKategori === 'Semua' && btn.innerText.includes('Semua'))) {
            btn.className = "tab-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-mega text-white transition-all shadow-sm";
        } else {
            btn.className = "tab-btn px-3 py-1.5 text-xs font-bold rounded-lg bg-gray-100 text-gray-600 hover:bg-orange-50 hover:text-mega transition-all";
        }
    });

    jalankanFilterDanCari();
}

// Event input kolom pencarian
searchInput.addEventListener('input', jalankanFilterDanCari);

// =========================================================================
// 5. BOOTSTRAP: JALANKAN LOGIKA SAAT HALAMAN DIBUKA
// =========================================================================
ambilDataDariSupabase();