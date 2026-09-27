import React, { useState, useEffect } from 'react';
import { Brand, Post, BrandDashboardStats } from './types';
import { api } from './api/client';
import { Navbar } from './components/Navbar';
import { PostFormModal } from './components/PostFormModal';
import { Dashboard } from './pages/Dashboard';
import { PostHistory } from './pages/PostHistory';
import { EngagementAnalysis } from './pages/EngagementAnalysis';
import { MemoryCenter } from './pages/MemoryCenter';
import { Brain } from 'lucide-react';

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

  const handlePostCreated = (newPost: Post) => {
    if (selectedBrand) {
      loadBrandData(selectedBrand.id);
    }
  };

  return (
    <div className="min-h-screen bg-[#080C14] text-slate-100 flex flex-col">
      {/* Top Banner Notice for HackwithHyderabad 3.0 Demo */}
      <div className="bg-gradient-to-r from-sky-950/80 via-slate-900 to-pink-950/80 border-b border-slate-800/80 px-4 py-1.5 text-center text-[11px] text-slate-300 flex items-center justify-center gap-2">
        <span className="font-semibold text-sky-400">SocialPulse AI</span>
        <span className="text-slate-600">|</span>
        <span>HackwithHyderabad 3.0 Engagement Agent</span>
        <span className="text-slate-600">|</span>
        <span className="flex items-center gap-1 text-pink-400 font-mono">
          <Brain className="w-3 h-3 text-pink-400" />
          Hindsight Vectorize Memory Active
        </span>
      </div>

      <Navbar
        brands={brands}
        selectedBrand={selectedBrand}
        onSelectBrand={setSelectedBrand}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenPostModal={() => setIsPostModalOpen(true)}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
            <p className="text-xs text-slate-400 font-mono">Initializing SocialPulse Agent & Memory Bank...</p>
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
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 font-mono">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>SocialPulse AI — Memory-Powered Social Media Engagement Agent</span>
          <span>Persistent Memory powered by <strong className="text-sky-400">Hindsight by Vectorize</strong></span>
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
