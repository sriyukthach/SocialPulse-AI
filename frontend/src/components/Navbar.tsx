import React from 'react';
import { Sparkles, Brain, LayoutDashboard, History, BarChart3, PlusCircle } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-sky-500 to-pink-500 p-0.5 shadow-lg shadow-sky-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-sky-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-white">SocialPulse</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-semibold tracking-wide">
                  ENGAGEMENT AGENT
                </span>
              </div>
              <p className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                Powered by <span className="text-sky-300 font-medium">Hindsight</span> Persistent Memory
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'dashboard'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'history'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <History className="w-4 h-4" />
              Post History
            </button>
            <button
              onClick={() => setActiveTab('analysis')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'analysis'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              Engagement Intelligence
            </button>
            <button
              onClick={() => setActiveTab('memory')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'memory'
                  ? 'bg-sky-500 text-slate-950 shadow-md font-semibold'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Brain className="w-4 h-4 text-pink-400" />
              Memory Center
            </button>
          </nav>

          {/* Right Action: Brand Selector & New Post Button */}
          <div className="flex items-center gap-3">
            {brands.length > 0 && selectedBrand && (
              <div className="relative">
                <select
                  value={selectedBrand.id}
                  onChange={(e) => {
                    const found = brands.find((b) => b.id === Number(e.target.value));
                    if (found) onSelectBrand(found);
                  }}
                  className="bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none font-medium cursor-pointer"
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
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 px-3.5 py-2 rounded-lg text-xs font-bold transition-all shadow-md shadow-sky-500/20 active:scale-95"
            >
              <PlusCircle className="w-4 h-4 text-slate-950" />
              <span>Add Post & Feedback</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
