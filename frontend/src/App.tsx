import React, { useState, useEffect } from 'react';
import { Brand, Post, BrandDashboardStats } from './types';
import { api } from './api/client';
import { Navbar } from './components/Navbar';
import { PostFormModal } from './components/PostFormModal';
import { Dashboard } from './pages/Dashboard';
import { PostHistory } from './pages/PostHistory';
import { EngagementAnalysis } from './pages/EngagementAnalysis';
import { MemoryCenter } from './pages/MemoryCenter';

export const App: React.FC = () => {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<Brand | null>(null);
  const [dashboardStats, setDashboardStats] = useState<BrandDashboardStats | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'analysis' | 'memory'>('dashboard');
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Initial Data Fetch
  const loadInitialData = async () => {
    setIsLoading(true);
    try {
      let fetchedBrands = await api.getBrands();
      if (fetchedBrands.length === 0) {
        // Auto seed demo
        await api.seedDemo();
        fetchedBrands = await api.getBrands();
      }
      setBrands(fetchedBrands);
      if (fetchedBrands.length > 0) {
        setSelectedBrand(fetchedBrands[0]);
      }
    } catch (err) {
      console.error('Error loading initial data:', err);
    } finally {
      setIsLoading(false);
    }
  };

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
    loadInitialData();
  }, []);

  useEffect(() => {
    if (selectedBrand) {
      loadBrandData(selectedBrand.id);
    }
  }, [selectedBrand]);

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
        <span className="text-neutral-300">Hindsight Persistent Memory Active</span>
      </div>

      <Navbar
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-neutral-300"></div>
            <p className="text-xs text-neutral-500 font-mono">Initializing SocialPulse Agent & Hindsight Memory...</p>
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
