import React, { useState } from 'react';
import { Brain, LayoutDashboard, History, BarChart3, PlusCircle, Video, Search, RotateCcw } from 'lucide-react';
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
        <div className="flex items-center justify-between h-16 gap-3">
          {/* Brand Logo & Title */}
          <div
            onClick={onResetChannel}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
            title="Return to Channel Analyzer Home"
          >
            <div className="h-9 w-9 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center group-hover:border-neutral-600 transition-all">
              <Video className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm sm:text-base font-bold tracking-tight text-white">SocialPulse</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-400 font-mono tracking-wider uppercase">
                  YOUTUBE AGENT
                </span>
              </div>
              <p className="text-[10px] text-neutral-400 hidden sm:flex items-center gap-1 font-mono">
                <Brain className="w-3 h-3 text-neutral-400" />
                <span>Hindsight Memory Active</span>
              </p>
            </div>
          </div>

          {/* Center: YouTube Channel Input & Quick Switcher */}
          <div className="flex items-center gap-2 flex-1 max-w-lg mx-2">
            <form onSubmit={handleAnalyzeSubmit} className="flex-1 relative flex items-center">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 pointer-events-none" />
              <input
                type="text"
                value={channelInput}
                onChange={(e) => setChannelInput(e.target.value)}
                placeholder="Analyze another YouTube URL (e.g. youtube.com/@channelname)..."
                className="w-full bg-[#121212] border border-[#252525] rounded-xl pl-8 pr-20 py-1.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none"
              />
              <button
                type="submit"
                disabled={isAnalyzing || !channelInput.trim()}
                className="absolute right-1 px-2.5 py-1 bg-white text-black font-bold text-[10px] rounded-lg hover:bg-neutral-200 transition-all disabled:opacity-40"
              >
                {isAnalyzing ? '...' : 'Analyze'}
              </button>
            </form>

            {selectedBrand && (
              <button
                onClick={onResetChannel}
                className="hidden lg:flex items-center gap-1 bg-[#121212] hover:bg-neutral-900 border border-[#252525] text-neutral-300 text-xs rounded-xl px-3 py-1.5 transition-all shrink-0 font-medium"
                title="Switch channel / Return to URL input home"
              >
                <RotateCcw className="w-3 h-3 text-neutral-400" />
                <span>Analyze Another</span>
              </button>
            )}
          </div>

          {/* Primary Action Button */}
          {selectedBrand && (
            <button
              onClick={onOpenPostModal}
              className="flex items-center gap-1.5 bg-neutral-100 hover:bg-white text-neutral-950 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold transition-all shrink-0 active:scale-95 shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5 text-neutral-950" />
              <span className="hidden xs:inline">Add Video & Feedback</span>
              <span className="xs:hidden">+ Video</span>
            </button>
          )}
        </div>

        {/* Navigation Tabs Bar — Only visible when channel is selected */}
        {selectedBrand && (
          <div className="flex items-center justify-between border-t border-[#202020] py-2 gap-1 overflow-x-auto">
            <div className="flex items-center gap-1 bg-[#121212] p-1 rounded-xl border border-[#222222]">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs transition-all ${
                  activeTab === 'dashboard'
                    ? 'bg-neutral-800 text-white font-semibold border border-neutral-700'
                    : 'text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                Channel Overview
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
                Content History
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
            </div>

            {/* Active Channel Handle Tag */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-neutral-400 bg-neutral-900 px-3 py-1 rounded-xl border border-neutral-800">
              <span className="text-neutral-500">Active Channel:</span>
              <strong className="text-white font-semibold">{selectedBrand.name}</strong>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};


