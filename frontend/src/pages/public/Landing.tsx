import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      <section className="relative pt-20 pb-32 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-blue-50 to-slate-50">
        <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none"></div>
        
        
        <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl leading-tight">
          Sewa Mobil Jadi <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Lebih Mudah, Aman, dan Cepat.</span>
        </h1>
        
        <p className="mt-6 text-xl text-slate-600 max-w-2xl leading-relaxed">
          ZenAuto bukan sekadar rental biasa. Kami menghubungkan pemilik armada dengan penyewa melalui teknologi pelacakan *real-time*, akses pintar, dan ekosistem pembayaran yang 100% transparan.
        </p>
        
        <div className="mt-10 flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center z-10">
          <Link to="/borrower/browse" className="px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all transform hover:-translate-y-0.5 text-lg">
            Mulai Menyewa Mobil
          </Link>
          <Link to="/register" className="px-8 py-4 border-2 border-slate-200 bg-white text-slate-700 font-bold rounded-xl hover:border-blue-300 hover:bg-blue-50 transition-all text-lg">
            Daftarkan Armada Anda
          </Link>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900">Kenapa Memilih ZenAuto?</h2>
          <p className="mt-4 text-slate-600">Teknologi yang dirancang untuk keamanan dan kenyamanan kedua belah pihak.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.243-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Live Telemetry</h3>
            <p className="text-slate-600 leading-relaxed">
              Pantau lokasi, kecepatan, dan status mobil secara real-time kapan saja. Pemilik tenang, penyewa aman di jalan.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-indigo-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Manajemen Armada Terpadu</h3>
            <p className="text-slate-600 leading-relaxed">
              Satu dashboard lengkap untuk pemilik mobil. Pantau status ketersediaan, atur jadwal *maintenance*, hingga pencatatan otomatis untuk pengembalian dan kalkulasi denda.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Transaksi Aman</h3>
            <p className="text-slate-600 leading-relaxed">
              Sistem pembayaran integral yang mengelola uang sewa dan jaminan denda secara otomatis, memastikan hak lender dan penyewa terlindungi.
            </p>
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-slate-500 border-t border-slate-200 bg-white">
        <p>© 2026 ZenAuto. Kelompok 21 SBD.</p>
      </footer>
    </div>
  );
}