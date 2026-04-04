"use client";

export default function OfflinePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-display text-6xl sm:text-7xl text-amber-400 mb-4">
        ÇEVRİMDIŞI
      </h1>
      <p className="text-neutral-400 text-lg max-w-md mb-8">
        İnternet bağlantınız kesildi. Bağlantı yeniden sağlandığında sayfayı yenileyin.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-3 bg-amber-400 text-black font-semibold rounded-lg hover:bg-amber-300 transition-colors"
      >
        Tekrar Dene
      </button>
    </div>
  );
}
