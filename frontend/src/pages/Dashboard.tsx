import React from 'react';
import { BarChart3, TrendingUp, Target, Video, Brain, PlusCircle, Sparkles, ArrowRight, Eye, Info } from 'lucide-react';
import { BrandDashboardStats, Brand } from '../types';
import { StatCard } from '../components/StatCard';
import { PostCard } from '../components/PostCard';

interface DashboardProps {
  stats: BrandDashboardStats | null;
  brand: Brand | null;
  onNavigateToAnalysis: () => void;
  onOpenPostModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  stats,
  brand,
  onNavigateToAnalysis,
  onOpenPostModal,
}) => {
  if (!stats || !brand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-neutral-300"></div>
        <p className="text-xs text-neutral-500 font-mono">Loading YouTube channel metrics & Hindsight memory bank...</p>
      </div>
    );
  }

  // Format large views count
  const formatViews = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K views`;
    return `${num} views`;
  };

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {/* 1. HERO PANEL — YouTube Channel Overview */}
      <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Channel Info */}
          <div className="space-y-3 max-w-2xl">
            {/* Context Metadata Line */}
            <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.15em] uppercase text-neutral-400 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                {brand.industry}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Brain className="w-3.5 h-3.5 text-neutral-400" />
                HINDSIGHT BANK: "{brand.slug.toUpperCase()}"
              </span>
            </div>

            {/* Main Channel Title */}
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                {brand.name}
              </h1>
            </div>

            {/* Supporting Channel Goals */}
            <div className="space-y-1.5 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              <p>
                <strong className="text-neutral-200 font-semibold">Target Viewers:</strong> {brand.audience_description}
              </p>
              <p>
                <strong className="text-neutral-200 font-semibold">Content Focus:</strong> {brand.content_goal}
              </p>
            </div>
          </div>

          {/* Right-Side CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
            <button
              onClick={onNavigateToAnalysis}
              className="flex items-center justify-center gap-2 bg-[#F5F5F5] hover:bg-white text-[#080808] font-bold px-5.5 py-3 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap active:scale-95 shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-[#080808]" />
              <span>View Channel Intelligence</span>
            </button>

            <button
              onClick={onOpenPostModal}
              className="flex items-center justify-center gap-2 bg-transparent border border-[#333333] hover:bg-[#171717] text-[#E5E5E5] font-semibold px-4.5 py-3 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-neutral-400" />
              <span>Add Video & Feedback</span>
            </button>
          </div>
        </div>

        {/* Data Transparency Notice Banner */}
        <div className="bg-[#080808] border border-[#202020] rounded-2xl p-4 flex items-start gap-3 text-xs text-neutral-400">
          <Info className="w-4 h-4 text-neutral-300 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-neutral-200 block text-[11px] font-mono uppercase tracking-wider">
              Data Transparency Disclosure
            </span>
            <p className="text-neutral-400 leading-relaxed text-[11px]">
              Analysis is performed using public YouTube channel and video data (views, comments, likes, video titles). SocialPulse AI uses <strong className="text-neutral-200">Hindsight persistent memory</strong> to remember audience preferences across video uploads without needing private YouTube Studio permissions.
            </p>
          </div>
        </div>
      </div>

      {/* 2. KPI / METRIC CARDS GRID */}
      <div className="space-y-3">
        <h2 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-400 font-semibold">
          YouTube Channel Performance & Memory Metrics
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="AVG ENGAGEMENT RATE"
            value={`${stats.average_engagement_rate}%`}
            subtitle="Calculated from public video metrics"
            icon={TrendingUp}
          />
          <StatCard
            title="TOP VIDEO FORMAT"
            value={stats.top_performing_format}
            subtitle="Highest watch-time retention & comments"
            icon={Target}
          />
          <StatCard
            title="ANALYZED PUBLIC VIDEOS"
            value={stats.total_posts}
            subtitle={`${formatViews(stats.total_shares)} (${stats.total_likes} likes)`}
            icon={Video}
          />
          <StatCard
            title="HINDSIGHT MEMORIES"
            value={stats.recent_memories_count}
            subtitle="Persistent cross-session facts"
            icon={Brain}
          />
        </div>
      </div>

      {/* 3. WHAT SOCIALPULSE REMEMBERS ABOUT THIS CHANNEL */}
      <div className="bg-[#101010] border border-[#252525] rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-[0.12em]">
                WHAT SOCIALPULSE REMEMBERS ABOUT THIS CHANNEL
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              SocialPulse AI continuously accumulates persistent memory for <strong>{brand.name}</strong>. Long-form video breakdowns with explicit timestamps and direct side-by-side performance benchmarks generate <strong>8x higher comment depth and watch-time retention</strong> than short teaser announcements.
            </p>
          </div>

          <button
            onClick={onNavigateToAnalysis}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2.5 rounded-xl shrink-0 transition-all"
          >
            <span>Explore Intelligence</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* 4. RECENT ANALYZED VIDEOS FEED */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Analyzed Public Videos & Audience Feedback</h2>
            <p className="text-xs text-neutral-400">
              Video performance and viewer comments indexed into Hindsight memory bank <strong className="text-neutral-200 font-mono">"{brand.slug}"</strong>.
            </p>
          </div>
          <button
            onClick={onOpenPostModal}
            className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl hover:border-neutral-700 transition-all"
          >
            <span>+ Add Video Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {stats.recent_posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};

