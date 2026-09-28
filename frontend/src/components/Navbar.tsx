import React, { useState } from 'react';
import { LayoutDashboard, History, BarChart3, Brain, Search, RotateCcw, PlusCircle, X } from 'lucide-react';
import { Brand } from '../types';

interface NavbarProps {
  selectedBrand: Brand | null;
  onResetChannel: () => void;
  onAnalyzeChannel: (handleOrUrl: string) => void;
  activeTab: 'dashboard' | 'history' | 'analysis' | 'memory';
  setActiveTab: (tab: 'dashboard' | 'history' | 'analysis' | 'memory') => void;
  onOpenPostModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  selectedBrand,
  onResetChannel,
  onAnalyzeChannel,
  activeTab,
  setActiveTab,
  onOpenPostModal
}) => {
  const [channelInput, setChannelInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [mobileInputOpen, setMobileInputOpen] = useState(false);

  const handleAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await onAnalyzeChannel(channelInput.trim());
      setChannelInput('');
      setMobileInputOpen(false);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#202020] bg-[#0A0A0A]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main Row ── */}
        <div className="flex items-center h-14 gap-3 min-w-0">

          {/* LEFT: Logo — always shrink-0 so it never disappears */}
          <div
            onClick={onResetChannel}
            className="flex items-center gap-2.5 shrink-0 cursor-pointer group"
            title="Return to SocialPulse Home"
          >
            <div className="h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center font-black text-xs group-hover:bg-neutral-200 transition-all shadow-sm select-none">
              SP
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-extrabold tracking-tight text-white leading-none">SocialPulse</div>
              <p className="text-[10px] text-neutral-400 font-medium leading-none mt-0.5">YouTube Intelligence</p>
            </div>
          </div>

          {/* CENTER: URL Form — flex-1 with min-w-0 so it shrinks properly */}
          <form
            onSubmit={handleAnalyzeSubmit}
            className="hidden md:flex items-center gap-2 flex-1 min-w-0"
          >
            {/* Input wrapper — relative + min-w-0 so it never overflows */}
            <div className="relative flex-1 min-w-0">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none shrink-0" />
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="Paste a YouTube channel URL or handle…"
                className="w-full min-w-0 bg-[#121212] border border-[#252525] rounded-xl pl-8 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none transition-all font-mono"
              />
            </div>

            {/* Button is OUTSIDE the input — never overlaps */}
            <button
              type="submit"
              disabled={isAnalyzing || !channelInput.trim()}
              className="shrink-0 px-3.5 py-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs rounded-xl transition-all disabled:opacity-40 whitespace-nowrap active:scale-95"
            >
              {isAnalyzing ? 'Analyzing…' : 'Analyze Channel'}
            </button>

            {selectedBrand && (
              <button
                type="button"
                onClick={onResetChannel}
                className="shrink-0 hidden lg:flex items-center gap-1.5 bg-[#141414] hover:bg-neutral-800 border border-[#262626] text-neutral-300 text-xs rounded-xl px-3 py-2 transition-all font-medium"
                title="Analyze another channel"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                <span>Switch</span>
              </button>
            )}
          </form>

          {/* RIGHT: Actions */}
          <div className="flex items-center gap-2 ml-auto shrink-0">
            {/* Mobile: toggle search */}
            <button
              onClick={() => setMobileInputOpen(!mobileInputOpen)}
              className="md:hidden p-2 rounded-xl bg-[#141414] border border-[#262626] text-neutral-300 hover:bg-neutral-800 transition-all"
              title="Search channel"
            >
              {mobileInputOpen ? <X className="w-4 h-4" /> : <Search className="w-4 h-4" />}
            </button>

            {selectedBrand && (
              <button
                onClick={onOpenPostModal}
                className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">Add Video Data</span>
              </button>
            )}
          </div>
        </div>

        {/* ── Mobile Search Row (slide-down) ── */}
        {mobileInputOpen && (
          <div className="md:hidden py-2 border-t border-[#1a1a1a]">
            <form onSubmit={handleAnalyzeSubmit} className="flex items-center gap-2 min-w-0">
              <div className="relative flex-1 min-w-0">
                <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  autoFocus
                  value={channelInput}
                  onChange={(e) => setChannelInput(e.target.value)}
                  placeholder="YouTube channel URL or @handle"
                  className="w-full min-w-0 bg-[#121212] border border-[#252525] rounded-xl pl-8 pr-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none font-mono"
                />
              </div>
              <button
                type="submit"
                disabled={isAnalyzing || !channelInput.trim()}
                className="shrink-0 px-3.5 py-2 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs rounded-xl transition-all disabled:opacity-40 whitespace-nowrap"
              >
                {isAnalyzing ? 'Analyzing…' : 'Analyze'}
              </button>
            </form>
          </div>
        )}

        {/* ── Navigation Tabs Row — only when a channel is loaded ── */}
        {selectedBrand && (
          <div className="flex items-center justify-between border-t border-[#1e1e1e] py-1.5 gap-2 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-0.5 bg-[#121212] p-0.5 rounded-xl border border-[#222222] shrink-0">
              {(
                [
                  { key: 'dashboard', icon: LayoutDashboard, label: 'Overview' },
                  { key: 'history',   icon: History,         label: 'Content History' },
                  { key: 'analysis',  icon: BarChart3,        label: 'Insights' },
                  { key: 'memory',    icon: Brain,            label: 'Channel Memory' },
                ] as const
              ).map(({ key, icon: Icon, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-all whitespace-nowrap ${
                    activeTab === key
                      ? 'bg-neutral-800 text-white font-semibold border border-neutral-700 shadow-sm'
                      : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Active Channel pill */}
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-neutral-300 bg-neutral-900 px-2.5 py-1 rounded-xl border border-neutral-800 shrink-0 min-w-0">
              <span className="text-neutral-500">@</span>
              <strong className="text-white font-semibold truncate max-w-[140px]">{selectedBrand.slug}</strong>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
