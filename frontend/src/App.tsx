import React, { useState, useEffect } from 'react';
import { Video, Search, Info, Brain } from 'lucide-react';
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

  // Load Brand Specific Data
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
      const msg = err.response?.data?.detail || err.message || 'Unable to retrieve this channel\'s public data. Please check the URL or try again.';
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
      {/* Top Hackathon Status Bar — Minimal Monochrome */}
      <div className="bg-[#050505] border-b border-[#202020] px-4 py-1 text-center text-[10px] sm:text-[11px] font-mono text-neutral-400 flex items-center justify-center gap-2 flex-wrap">
        <span className="font-semibold text-white">SocialPulse AI</span>
        <span className="text-neutral-700">•</span>
        <span>HackWithHyderabad 3.0</span>
        <span className="text-neutral-700">•</span>
        <span className="text-neutral-300">YouTube Engagement Intelligence & Hindsight Memory Active</span>
      </div>

      <Navbar
        selectedBrand={selectedBrand}
        onResetChannel={handleResetChannel}
        onAnalyzeChannel={handleAnalyzeChannel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {!selectedBrand ? (
          /* Clean Empty State Screen */
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center max-w-2xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-300">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] font-mono text-neutral-300">
                <Video className="w-3.5 h-3.5 text-white" />
                <span>SOCIALPULSE AI</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                YouTube Engagement Intelligence
              </h1>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
                Analyze a YouTube channel's public content history and discover engagement patterns, audience interests, and content recommendations.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleUrlSubmit} className="w-full space-y-3">
              <div className="flex flex-col sm:flex-row gap-2 bg-[#101010] p-2.5 rounded-2xl border border-[#252525]">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://youtube.com/@channelname"
                    className="w-full bg-[#080808] border border-[#202020] rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !urlInput.trim()}
                  className="bg-white hover:bg-neutral-200 text-black font-extrabold px-6 py-3 rounded-xl text-xs sm:text-sm transition-all disabled:opacity-40 whitespace-nowrap active:scale-95 shadow-sm"
                >
                  {isLoading ? 'Analyzing Channel...' : 'Analyze Channel'}
                </button>
              </div>

              {apiErrorMessage && (
                <div className="p-3.5 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-neutral-200 font-mono flex items-center justify-center gap-2 text-left">
                  <Info className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{apiErrorMessage}</span>
                </div>
              )}
            </form>

            {/* Data Transparency Disclosure */}
            <div className="text-[11px] text-neutral-500 font-mono leading-relaxed bg-[#080808] p-4 rounded-xl border border-[#181818] max-w-xl">
              🛡️ <strong>Data Transparency Disclosure:</strong> SocialPulse analyzes publicly accessible YouTube data available through the configured integration. Private YouTube Studio analytics are not accessed.
            </div>
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

      {/* Minimal Footer */}
      <footer className="border-t border-[#181818] bg-[#080808] py-6 text-center text-xs text-neutral-500 font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>SocialPulse AI — Memory-Powered Social Media Engagement Agent</span>
          <span>Persistent Memory powered by <strong className="text-neutral-300 font-semibold">Hindsight by Vectorize</strong></span>
        </div>
      </footer>

      {/* Post & Feedback Creation Modal */}
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
