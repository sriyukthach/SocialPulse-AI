import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { Brand, Post, BrandDashboardStats } from './types';
import { api } from './api/client';
import { Navbar } from './components/Navbar';
import { PostFormModal } from './components/PostFormModal';
import { Dashboard } from './pages/Dashboard';
import { PostHistory } from './pages/PostHistory';
import { EngagementAnalysis } from './pages/EngagementAnalysis';
import { MemoryCenter } from './pages/MemoryCenter';

export const App: React.FC = () => {
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [dashboardStats, setDashboardStats] = useState<BrandDashboardStats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'analysis' | 'memory'>('dashboard');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [apiErrorMessage, setApiErrorMessage] = useState<string | null>(null);

  // Load brand-specific data
  const loadBrandData = async (brandId: number) => {
    try {
      const [stats, brandPosts] = await Promise.all([
        api.getBrandDashboard(brandId),
        api.getPosts(brandId),
      ]);
      setDashboardStats(stats);
      setPosts(brandPosts);
    } catch (err) {
      console.error('Error loading brand dashboard data:', err);
    }
  };

  useEffect(() => {
    if (selectedBrand) {
      loadBrandData(selectedBrand.id);
    }
  }, [selectedBrand]);

  const handleAnalyzeChannel = async (channelInput: string) => {
    if (!channelInput || !channelInput.trim()) return;
    setIsLoading(true);
    setApiErrorMessage(null);

    try {
      const resultStats = await api.analyzeChannel(channelInput);
      setSelectedBrand(resultStats.brand);
      setDashboardStats(resultStats);
      setPosts(resultStats.recent_posts);
      setActiveTab('dashboard');
      setUrlInput('');
    } catch (err: any) {
      console.error('Error analyzing YouTube channel:', err);
      let msg = "Unable to retrieve this channel's public data. Please check the URL and try again.";
      const rawDetail = err.response?.data?.detail || err.message || '';

      if (err.code === 'ERR_NETWORK' || !err.response) {
        msg = 'Cannot reach SocialPulse backend. Make sure the backend server is running on port 8000.';
      } else if (rawDetail.includes('YOUTUBE_API_KEY')) {
        msg = 'YouTube API key is missing or invalid. Please add YOUTUBE_API_KEY to backend/.env.';
      } else if (rawDetail.includes('quota')) {
        msg = 'YouTube API daily quota has been reached. Try again tomorrow or use a different API key.';
      } else if (rawDetail.includes('not found') || rawDetail.includes('Channel not found')) {
        msg = "That YouTube channel could not be found. Check the URL or handle spelling.";
      } else if (typeof rawDetail === 'string' && rawDetail.trim()) {
        msg = rawDetail;
      }

      setApiErrorMessage(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleAnalyzeChannel(urlInput);
  };

  const handleResetChannel = () => {
    setSelectedBrand(null);
    setDashboardStats(null);
    setPosts([]);
    setApiErrorMessage(null);
    setUrlInput('');
  };

  const handlePostCreated = (_newPost: Post) => {
    if (selectedBrand) {
      loadBrandData(selectedBrand.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col antialiased font-sans">
      <Navbar
        selectedBrand={selectedBrand}
        onResetChannel={handleResetChannel}
        onAnalyzeChannel={handleAnalyzeChannel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {!selectedBrand ? (
          /* ─── Landing / Empty State ─── */
          <div className="flex flex-col items-center justify-center min-h-[520px] text-center py-16">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-400 font-mono tracking-wider mb-8">
              <span className="h-1.5 w-1.5 rounded-full bg-neutral-300"></span>
              SOCIALPULSE · YOUTUBE CHANNEL INTELLIGENCE
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-2xl mx-auto mb-5">
              Understand what your<br className="hidden sm:block" /> audience responds to.
            </h1>

            {/* Subheadline */}
            <p className="text-sm sm:text-base text-neutral-400 leading-relaxed max-w-lg mx-auto mb-10">
              Paste any public YouTube channel URL. SocialPulse analyzes video performance, viewer comments, and engagement patterns — then remembers insights for future sessions.
            </p>

            {/* Input Form */}
            <form onSubmit={handleUrlSubmit} className="w-full max-w-xl mx-auto space-y-3">
              {/* Search bar pill */}
              <div className="flex flex-col sm:flex-row gap-2 bg-[#0f0f0f] p-2 rounded-2xl border border-[#222222] shadow-2xl">
                <div className="relative flex-1 min-w-0">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://youtube.com/@mkbhd"
                    disabled={isLoading}
                    className="w-full bg-[#080808] border border-[#1e1e1e] rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-100 placeholder-neutral-600 focus:border-neutral-500 outline-none font-mono disabled:opacity-50 transition-colors"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !urlInput.trim()}
                  className="shrink-0 flex items-center justify-center gap-2 bg-white hover:bg-neutral-100 text-black font-extrabold px-6 py-3 rounded-xl text-sm transition-all disabled:opacity-40 whitespace-nowrap active:scale-95 shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Analyzing…</span>
                    </>
                  ) : (
                    <span>Analyze Channel</span>
                  )}
                </button>
              </div>

              {/* Error message */}
              {apiErrorMessage && (
                <div className="flex items-start gap-2.5 p-3.5 bg-[#0e0e0e] border border-neutral-800 rounded-xl text-xs text-neutral-300 font-mono text-left">
                  <AlertCircle className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{apiErrorMessage}</span>
                </div>
              )}
            </form>

            {/* Data Disclosure */}
            <div className="mt-8 w-full max-w-xl mx-auto bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-4 text-left">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                <span className="text-[11px] font-mono font-semibold text-neutral-300 uppercase tracking-wider">
                  Public Data Only
                </span>
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed">
                SocialPulse only uses publicly available YouTube channel, video, and comment data via the YouTube Data API v3. It does not access YouTube Studio analytics, private data, or authenticated accounts.
              </p>
            </div>

            {/* Example hint */}
            <p className="mt-5 text-xs text-neutral-600 font-mono">
              Try: <button type="button" onClick={() => setUrlInput('https://youtube.com/@mkbhd')} className="text-neutral-500 hover:text-neutral-300 transition-colors underline underline-offset-2">@mkbhd</button>
              {' · '}
              <button type="button" onClick={() => setUrlInput('https://youtube.com/@veritasium')} className="text-neutral-500 hover:text-neutral-300 transition-colors underline underline-offset-2">@veritasium</button>
              {' · '}
              <button type="button" onClick={() => setUrlInput('https://youtube.com/@fireship')} className="text-neutral-500 hover:text-neutral-300 transition-colors underline underline-offset-2">@fireship</button>
            </p>
          </div>
        ) : (
          <>
            {activeTab === 'dashboard' && (
              <Dashboard
                stats={dashboardStats}
                brand={selectedBrand}
                onNavigateToAnalysis={() => setActiveTab('analysis')}
                onOpenPostModal={() => setIsPostModalOpen(true)}
              />
            )}

            {activeTab === 'history' && (
              <PostHistory
                posts={posts}
                brand={selectedBrand}
                onOpenPostModal={() => setIsPostModalOpen(true)}
              />
            )}

            {activeTab === 'analysis' && (
              <EngagementAnalysis brand={selectedBrand} />
            )}

            {activeTab === 'memory' && (
              <MemoryCenter brand={selectedBrand} />
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] bg-[#080808] py-5 text-xs text-neutral-600 font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SocialPulse — YouTube Channel Intelligence</span>
          <span>HackWithHyderabad 3.0 · Powered by Hindsight Persistent Memory</span>
        </div>
      </footer>

      {/* Add Video Data Modal */}
      {selectedBrand && (
        <PostFormModal
          brandId={selectedBrand.id}
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onPostCreated={handlePostCreated}
        />
      )}
    </div>
  );
};

export default App;
