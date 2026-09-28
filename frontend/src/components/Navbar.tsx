import React, { useState } from 'react';
import { LayoutDashboard, History, BarChart3, Brain, Search, RotateCcw, PlusCircle } from 'lucide-react';
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

  const handleAnalyzeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelInput.trim()) return;
    setIsAnalyzing(true);
    try {
      await onAnalyzeChannel(channelInput.trim());
      setChannelInput('');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#202020] bg-[#0A0A0A]/95 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* LEFT: Product Brand Logo */}
          <div
            onClick={onResetChannel}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
            title="Return to SocialPulse Home"
          >
            <div className="h-9 w-9 rounded-xl bg-white text-black flex items-center justify-center font-black text-sm group-hover:bg-neutral-200 transition-all shadow-sm">
              SP
            </div>
            <div>
              <div className="text-base font-extrabold tracking-tight text-white flex items-center gap-2">
                SocialPulse
              </div>
              <p className="text-[11px] text-neutral-400 font-medium">
                YouTube Channel Intelligence
              </p>
            </div>
          </div>

          {/* CENTER: YouTube URL Input Form */}
          <div className="flex items-center gap-2 flex-1 max-w-xl mx-2">
            <form onSubmit={handleAnalyzeSubmit} className="flex-1 relative flex items-center">
              <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 pointer-events-none" />
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="Paste a YouTube channel URL (e.g. https://youtube.com/@channel)"
                className="w-full bg-[#121212] border border-[#252525] rounded-xl pl-9 pr-28 py-2 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none transition-all font-mono"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !channelInput.trim()}
                className="absolute right-1 px-3 py-1.5 bg-white hover:bg-neutral-200 text-black font-extrabold text-xs rounded-lg transition-all disabled:opacity-40 whitespace-nowrap active:scale-95"
              >
                {isAnalyzing ? 'Analyzing...' : 'Analyze Channel'}
              </button>
            </form>

            {selectedBrand && (
              <button
                onClick={onResetChannel}
                className="hidden lg:flex items-center gap-1.5 bg-[#141414] hover:bg-neutral-800 border border-[#262626] text-neutral-300 text-xs rounded-xl px-3 py-2 transition-all shrink-0 font-medium"
                title="Analyze another channel"
              >
                <RotateCcw className="w-3.5 h-3.5 text-neutral-400" />
                <span>Analyze Another</span>
              </button>
            )}
          </div>

          {/* RIGHT: Actions */}
          {selectedBrand && (
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={onOpenPostModal}
                className="flex items-center gap-1.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all shrink-0"
              >
                <PlusCircle className="w-3.5 h-3.5 text-neutral-400" />
                <span className="hidden sm:inline">Add Video Data</span>
              </button>
            </div>
          )}
        </div>

        {/* Navigation Tabs Bar — Only visible when channel is analyzed */}
        {selectedBrand && (
          <div className="flex items-center justify-between border-t border-[#202020] py-2 gap-2 overflow-x-auto">
            <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#222222]">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Channel Overview
              </button>

              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === 'history'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                Content History
              </button>

              <button
                onClick={() => setActiveTab('analysis')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === 'analysis'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                Insights
              </button>

              <button
                onClick={() => setActiveTab('memory')}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === 'memory'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700 shadow-sm'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <Brain className="w-3.5 h-3.5" />
                Channel Memory
              </button>
            </div>

            {/* Active Channel Display */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-medium text-neutral-300 bg-neutral-900 px-3 py-1 rounded-xl border border-neutral-800 shrink-0">
              <span className="text-neutral-500">Channel:</span>
              <strong className="text-white font-semibold">{selectedBrand.name}</strong>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
