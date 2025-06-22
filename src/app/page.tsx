'use client';

import GoogLMLogo from '@/components/GoogLMLogo';
import SearchBox from '@/components/SearchBox';

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="flex justify-end items-center p-4">
        <nav className="flex items-center space-x-4 text-sm">
          <button className="w-6 h-6 grid grid-cols-3 gap-0.5">
            {Array.from({length: 9}).map((_, i) => (
              <div key={i} className="w-1 h-1 bg-gray-600 rounded-full" />
            ))}
          </button>
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-medium">
            R
          </div>
        </nav>
      </header>

      {/* Main content */}
      <main className="flex flex-col items-center justify-center min-h-[60vh] px-4">
        <GoogLMLogo />
        <SearchBox />
      </main>

      {/* Footer */}
      <footer className="absolute bottom-0 w-full bg-gray-100">
        <div className="px-8 py-3 text-sm text-gray-600 border-b border-gray-300">
          Japan
        </div>
        <div className="flex justify-between px-8 py-3">
          <div className="flex space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:underline">
              About
            </a>
            <a href="#" className="hover:underline">
              Advertising
            </a>
            <a href="#" className="hover:underline">
              Business
            </a>
            <a href="#" className="hover:underline">
              How Search works
            </a>
          </div>
          <div className="flex space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:underline">
              Privacy
            </a>
            <a href="#" className="hover:underline">
              Terms
            </a>
            <a href="#" className="hover:underline">
              Settings
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
