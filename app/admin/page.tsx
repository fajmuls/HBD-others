'use client';

import { useState } from 'react';
import { APP_VERSION, PATCH_NOTES } from '@/lib/version';
import Link from 'next/link';
import { ArrowLeft, History, Info } from 'lucide-react';

export default function AdminDashboard() {
  const [showNotes, setShowNotes] = useState(false);

  return (
    <div className="min-h-screen bg-[#060010] text-white p-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-8">
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="text-3xl font-bold font-playfair tracking-wide text-red-400">Admin Dashboard</h1>
            <p className="text-white/60 mt-2">Manage and view application status.</p>
          </div>
          <Link href="/" className="flex items-center gap-2 text-white/60 hover:text-white transition-colors">
            <ArrowLeft size={20} />
            Back to App
          </Link>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center">
              <Info className="text-red-400" size={32} />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Current Version</h2>
              <div className="mt-2">
                <button 
                  onClick={() => setShowNotes(!showNotes)}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-mono tracking-wider transition-colors shadow-lg shadow-red-500/20"
                >
                  {APP_VERSION}
                </button>
              </div>
            </div>
          </div>
          
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 md:col-span-2">
            <h2 className="text-xl font-semibold mb-2">Suggestions & Improvements</h2>
            <div className="text-left space-y-4 w-full">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="font-semibold text-yellow-400 flex items-center gap-2">
                  <span className="text-xl">💡</span> UI/UX & QoL Suggestions
                </h3>
                <ul className="list-disc list-inside mt-2 text-sm text-white/70 space-y-1">
                  <li>Tambahkan tombol "Skip" atau navigasi langsung ke galeri jika pengguna ingin langsung melihat foto tanpa melewati game lagi.</li>
                  <li>Beri transisi audio fade-in/fade-out untuk musik background agar lebih mulus saat pindah flow.</li>
                  <li>Tambahkan fitur upload foto dinamis dari Admin Dashboard agar tidak perlu mengubah file kode (`public/1.jpeg` dsb).</li>
                </ul>
              </div>
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <h3 className="font-semibold text-blue-400 flex items-center gap-2">
                  <span className="text-xl">🔧</span> Bug Fixes Needed
                </h3>
                <ul className="list-disc list-inside mt-2 text-sm text-white/70 space-y-1">
                  <li>Terkadang animasi 3D Dome Gallery kurang mulus di perangkat mobile dengan spesifikasi rendah (optimasi jumlah segmen dianjurkan).</li>
                  <li>Jika pengguna merefresh halaman di tengah game, state akan kembali ke awal. Tambahkan localStorage untuk menyimpan progress sementara.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {showNotes && (
          <section className="bg-white/5 border border-white/10 rounded-2xl p-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
              <History className="text-red-400" />
              Patch Notes
            </h2>
            <div className="space-y-8">
              {PATCH_NOTES.map((note) => (
                <div key={note.version} className="relative pl-6 border-l-2 border-white/10">
                  <div className="absolute w-3 h-3 bg-red-500 rounded-full -left-[7px] top-1.5 shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold font-mono text-white">{note.version}</h3>
                    <span className="text-sm text-white/40">{note.date}</span>
                    <span className={`text-xs px-2 py-1 rounded-full uppercase tracking-widest ${
                      note.type === 'major' ? 'bg-red-500/20 text-red-400' : 
                      note.type === 'minor' ? 'bg-blue-500/20 text-blue-400' : 
                      'bg-green-500/20 text-green-400'
                    }`}>
                      {note.type}
                    </span>
                  </div>
                  <ul className="list-disc list-inside text-white/70 space-y-1">
                    {note.changes.map((change, i) => (
                      <li key={i}>{change}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
