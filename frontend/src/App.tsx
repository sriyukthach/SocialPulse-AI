import React, { useState, useEffect } from 'react';
import { Search, ShieldCheck, AlertCircle, Loader2, Video, MessageSquare, TrendingUp } from 'lucide-react';
import { Brand, Post, BrandDashboardStats } from './types';
import { api } from './api/client';
import { Navbar } from './components/Navbar';
import { PostFormModal } from './components/PostFormModal';
import { Dashboard } from './pages/Dashboard';
import { PostHistory } from './pages/PostHistory';
import { EngagementAnalysis } from './pages/EngagementAnalysis';
import { MemoryCenter } from './pages/MemoryCenter';

const Hyperspeed = React.lazy(() => import('./components/HyperspeedSafe'));

const hyperspeedOptions = {
  distortion: 'turbulentDistortion',
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 120,
  speedUp: 1.8,
  carLightsFade: 0.4,
  totalSideLightSticks: 30,
  lightPairsPerRoadWay: 50,
  shoulderLinesWidthPercentage: 0.05,
  brokenLinesWidthPercentage: 0.12,
  brokenLinesLengthPercentage: 0.5,
  lightStickWidth: [0.12, 0.5] as [number, number],
  lightStickHeight: [1.3, 1.7] as [number, number],
  movingAwaySpeed: [60, 80] as [number, number],
  movingCloserSpeed: [-120, -160] as [number, number],
  carLightsLength: [400 * 0.05, 400 * 0.2] as [number, number],
  carLightsRadius: [0.08, 0.18] as [number, number],
  carWidthPercentage: [0.3, 0.5] as [number, number],
  carShiftX: [-0.8, 0.8] as [number, number],
  carFloorSeparation: [0, 5] as [number, number],
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0x1a1a24,
    brokenLines: 0x1a1a24,
    // left cars: vivid purples/magentas
    leftCars: [0xe060d0, 0x9b59d0, 0xd43fc0],
    // right cars: vivid cyan/blue (no near-black colours)
    rightCars: [0x00d4e8, 0x1a7fe0, 0x4ab8ff],
    sticks: 0x00d4e8
  }
};

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
        msg = 'YouTube API service is temporarily unavailable. Please check configuration.';
      } else if (rawDetail.includes('quota')) {
        msg = 'YouTube API daily quota has been reached. Try again later.';
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

      <main className="flex-1 w-full flex flex-col">
        {!selectedBrand ? (
          isLoading ? (
            /* ─── Analyzing In-Progress State (Hyperspeed removed completely) ─── */
            <div className="flex-1 flex flex-col items-center justify-center min-h-[520px] text-center px-4 py-20 animate-in fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-[11px] text-neutral-300 font-mono tracking-wider mb-6">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-white" />
                <span>ANALYZING CHANNEL DATA</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
                Gathering Channel Intelligence
              </h2>
              <p className="text-sm text-neutral-400 max-w-md mx-auto leading-relaxed">
                Retrieving recent public videos, interaction metrics, and audience discussions. This may take a few moments.
              </p>
            </div>
          ) : (
            /* ─── Pre-Analysis Landing Page ─── */
            <div className="flex-1 flex flex-col">
              {/* Hero Area with Hyperspeed Visual Background */}
              <section className="relative w-full overflow-hidden border-b border-[#181818] min-h-[580px] sm:min-h-[620px] flex items-center justify-center">
                {/* Background Hyperspeed Effect */}
                <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                  <React.Suspense fallback={<div className="w-full h-full bg-[#050505]" />}>
                    <Hyperspeed effectOptions={hyperspeedOptions} />
                  </React.Suspense>
                  {/* Subtle darkening tint to keep text crisp and highly readable */}
                  <div className="absolute inset-0 bg-black/25 pointer-events-none" />
                  <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/40 via-transparent to-[#050505] pointer-events-none" />
                </div>

                {/* Hero Content Layered Cleanly Above */}
                <div className="relative z-10 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center">
                  {/* Badge */}
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-neutral-800 text-[11px] text-neutral-400 font-mono tracking-wider mb-6 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 rounded-full bg-neutral-300"></span>
                    SOCIALPULSE · YOUTUBE CHANNEL INTELLIGENCE
                  </div>

                  {/* Headline */}
                  <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.1] max-w-3xl mx-auto mb-5 drop-shadow-[0_2px_24px_rgba(0,0,0,0.9)]">
                    Understand what your YouTube audience responds to.
                  </h1>

                  {/* Subheadline */}
                  <p className="text-sm sm:text-base text-neutral-300 leading-relaxed max-w-xl mx-auto mb-9">
                    Analyze any public YouTube channel to uncover viewer engagement patterns, top-performing video themes, and community feedback.
                  </p>

                  {/* Input Form */}
                  <form onSubmit={handleUrlSubmit} className="w-full max-w-xl mx-auto space-y-3">
                    <div className="flex flex-col sm:flex-row gap-2 bg-[#0d0d0d]/90 p-2 rounded-2xl border border-[#222222] shadow-2xl backdrop-blur-md">
                      <div className="relative flex-1 min-w-0">
                        <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        <input
                          type="text"
                          required
                          value={urlInput}
                          onChange={(e) => setUrlInput(e.target.value)}
                          placeholder="https://youtube.com/@channel or @handle"
                          disabled={isLoading}
                          className="w-full bg-[#080808] border border-[#1e1e1e] rounded-xl pl-10 pr-4 py-3 text-sm text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none font-mono disabled:opacity-50 transition-colors"
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
                </div>
              </section>

              {/* Informational Sections Below Hero */}
              <div className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
                {/* Concise How It Works Section */}
                <section>
                  <div className="text-center mb-8">
                    <h2 className="text-xs font-mono font-semibold tracking-wider text-neutral-500 uppercase">
                      How It Works
                    </h2>
                    <p className="text-xl font-bold text-white mt-1">
                      Three simple steps to audience clarity
                    </p>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 text-left">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-neutral-300 mb-3.5">
                        01
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1.5">Enter Any Channel</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Paste any public YouTube channel URL or @handle. No account logins or studio credentials required.
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 text-left">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-neutral-300 mb-3.5">
                        02
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1.5">Scan Public Activity</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        SocialPulse retrieves recent uploads, view counts, audience interaction rates, and community discussions.
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 text-left">
                      <div className="w-7 h-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center text-xs font-mono font-bold text-neutral-300 mb-3.5">
                        03
                      </div>
                      <h3 className="text-sm font-bold text-white mb-1.5">Uncover Actionable Insights</h3>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Review key takeaways on what viewers care about, what sparks debate, and what content to create next.
                      </p>
                    </div>
                  </div>
                </section>

                {/* Clear Explanation of What SocialPulse Analyzes */}
                <section>
                  <div className="text-center mb-8">
                    <h2 className="text-xs font-mono font-semibold tracking-wider text-neutral-500 uppercase">
                      What SocialPulse Analyzes
                    </h2>
                    <p className="text-xl font-bold text-white mt-1">
                      Comprehensive signals from public channel activity
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <Video className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-sm font-bold text-white">Video Performance Signals</h3>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Evaluates views, likes, and comment volume across recent public video uploads to identify standout content formats.
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <MessageSquare className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-sm font-bold text-white">Viewer Feedback &amp; Sentiments</h3>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Reviews viewer comments to capture recurring audience questions, positive reactions, and constructive critiques.
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <TrendingUp className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-sm font-bold text-white">Content Topic Resonance</h3>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        Highlights which topics and presentation angles consistently generate meaningful engagement and conversation.
                      </p>
                    </div>

                    <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-2xl p-5 text-left">
                      <div className="flex items-center gap-2 mb-2">
                        <ShieldCheck className="w-4 h-4 text-neutral-400" />
                        <h3 className="text-sm font-bold text-white">100% Public Data Privacy</h3>
                      </div>
                      <p className="text-xs text-neutral-400 leading-relaxed">
                        SocialPulse strictly utilizes publicly available YouTube data. It never accesses private YouTube Studio metrics, passwords, or account controls.
                      </p>
                    </div>
                  </div>
                </section>
              </div>
            </div>
          )
        ) : (
          /* ─── Post-Analysis Views (Hyperspeed never rendered here) ─── */
          <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 flex-1">
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
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#141414] bg-[#080808] py-5 text-xs text-neutral-600 font-mono mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SocialPulse — YouTube Channel Intelligence</span>
          <span>Public YouTube Audience &amp; Content Insights</span>
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
