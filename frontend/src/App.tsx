import React, { useState, useEffect } from 'react';
import { Search, Info, AlertCircle } from 'lucide-react';
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
      let msg = 'Unable to retrieve this channel\'s public data. Please check the URL or try again.';
      const rawDetail = err.response?.data?.detail || err.message || '';

      if (err.code === 'ERR_NETWORK' || !err.response) {
        msg = 'Unable to connect to SocialPulse. Make sure the backend server is running and try again.';
      } else if (rawDetail.includes('YOUTUBE_API_KEY')) {
        msg = 'YouTube API access is not configured. Please check YOUTUBE_API_KEY in backend/.env.';
      } else if (rawDetail.includes('quota')) {
        msg = 'YouTube data could not be retrieved because the API quota has been reached.';
      } else if (rawDetail.includes('not found') || rawDetail.includes('Channel not found')) {
        msg = 'We couldn\'t find that YouTube channel. Please check the URL or handle.';
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

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {!selectedBrand ? (
          /* Empty State Screen — Clean SaaS Landing */
          <div className="flex flex-col items-center justify-center min-h-[500px] text-center max-w-2xl mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-300">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 font-mono">
                <span>SOCIALPULSE</span>
                <span className="text-neutral-600">•</span>
                <span>YOUTUBE CHANNEL INTELLIGENCE</span>
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                Understand what your audience responds to.
              </h1>
              <p className="text-sm sm:text-base text-neutral-400 leading-relaxed font-normal max-w-xl mx-auto">
                Paste any public YouTube channel URL to analyze video performance, viewer comments, and content recommendations.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleUrlSubmit} className="w-full space-y-3">
              <div className="flex flex-col sm:flex-row gap-2.5 bg-[#101010] p-2.5 rounded-2xl border border-[#252525] shadow-xl">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-neutral-500 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="Paste a YouTube channel URL (e.g. https://youtube.com/@mkbhd)"
                    className="w-full bg-[#080808] border border-[#202020] rounded-xl pl-10 pr-4 py-3.5 text-xs sm:text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none font-mono"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !urlInput.trim()}
                  className="bg-white hover:bg-neutral-200 text-black font-extrabold px-7 py-3.5 rounded-xl text-xs sm:text-sm transition-all disabled:opacity-40 whitespace-nowrap active:scale-95 shadow-sm"
                >
                  {isLoading ? 'Analyzing Channel...' : 'Analyze Channel'}
                </button>
              </div>

              {apiErrorMessage && (
                <div className="p-4 bg-neutral-900 border border-neutral-700 rounded-xl text-xs text-neutral-200 font-mono flex items-center justify-center gap-2.5 text-left">
                  <AlertCircle className="w-4 h-4 text-neutral-300 shrink-0" />
                  <span>{apiErrorMessage}</span>
                </div>
              )}
            </form>

            {/* Data Source Disclosure */}
            <div className="text-xs text-neutral-400 leading-relaxed bg-[#0A0A0A] p-4.5 rounded-2xl border border-[#1A1A1A] max-w-xl text-left space-y-1">
              <div className="font-semibold text-neutral-200 text-xs font-mono uppercase tracking-wider flex items-center gap-2">
                <Info className="w-3.5 h-3.5 text-neutral-400" />
                <span>Data Source: Public YouTube Data</span>
              </div>
              <p className="text-neutral-400 text-xs">
                SocialPulse analyzes publicly available channel, video, and comment information. It does not access private YouTube Studio analytics.
              </p>
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

      {/* Footer */}
      <footer className="border-t border-[#181818] bg-[#080808] py-6 text-xs text-neutral-400 font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>SocialPulse — YouTube Channel Intelligence</span>
          <span className="text-neutral-500">HackWithHyderabad 3.0 Project</span>
        </div>
      </footer>

      {/* Post & Feedback Modal */}
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
