import React from 'react';
import { Brain, LayoutDashboard, History, BarChart3, PlusCircle, Layers } from 'lucide-react';
import { Brand } from '../types';

interface NavbarProps {
  brands: Brand[];
  selectedBrand: Brand | null;
  onSelectBrand: (brand: Brand) => void;
  activeTab: 'dashboard' | 'history' | 'analysis' | 'memory';
  setActiveTab: (tab: 'dashboard' | 'history' | 'analysis' | 'memory') => void;
  onOpenPostModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  brands,
  selectedBrand,
  onSelectBrand,
  activeTab,
  setActiveTab,
  onOpenPostModal
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#202020] bg-[#0A0A0A]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 gap-4">
          {/* Brand Logo & Title */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="h-8 w-8 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center">
              <Layers className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white">SocialPulse</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono tracking-wider uppercase">
                  AGENT
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 hidden sm:flex items-center gap-1 font-mono">
                <Brain className="w-3 h-3 text-neutral-400" />
                <span>Hindsight Memory Active</span>
              </p>
            </div>
          </div>

          {/* Desktop Navigation Tabs — Minimal Monochrome */}
          <nav className="hidden md:flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#222222]">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Dashboard
            </button>

            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'history'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              Post History
            </button>

            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'analysis'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              Engagement Intelligence
            </button>

            <button
              onClick={() => setActiveTab('memory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
                activeTab === 'memory'
                  ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                  : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
              }`}
            >
              <Brain className="w-3.5 h-3.5" />
              Memory Center
            </button>
          </nav>

          {/* Right Controls: Brand Selector & Primary Action */}
          <div className="flex items-center gap-2.5">
            {brands.length > 0 && selectedBrand && (
              <div className="relative">
                <select
                  value={selectedBrand.id}
                  onChange={(e) => {
                    const found = brands.find((b) => b.id === Number(e.target.value));
                    if (found) onSelectBrand(found);
                  }}
                  className="bg-[#121212] border border-[#252525] text-neutral-300 text-xs rounded-xl px-2.5 py-1.5 focus:border-neutral-500 outline-none font-medium cursor-pointer max-w-[130px] sm:max-w-[190px] truncate"
                >
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name} ({b.industry})
                    </option>
                  ))}
                </select>
              </div>
            )}

            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 bg-neutral-100 hover:bg-white text-neutral-950 px-3 py-1.5 sm:px-3.5 sm:py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95"
            >
              <PlusCircle className="w-3.5 h-3.5 text-neutral-950" />
              <span className="hidden xs:inline">Add Post & Feedback</span>
              <span className="xs:hidden">+ Post</span>
            </button>
          </div>
        </div>

        {/* Mobile Navigation Tabs — Minimal Monochrome */}
        <div className="flex md:hidden items-center justify-around border-t border-[#202020] py-2 gap-1 overflow-x-auto">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
              activeTab === 'dashboard'
                ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard
          </button>

          <button
            onClick={() => setActiveTab('history')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
              activeTab === 'history'
                ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            History
          </button>

          <button
            onClick={() => setActiveTab('analysis')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
              activeTab === 'analysis'
                ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            Intelligence
          </button>

          <button
            onClick={() => setActiveTab('memory')}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs whitespace-nowrap transition-all ${
              activeTab === 'memory'
                ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            Memory
          </button>
        </div>
      </div>
    </header>
  );
};
