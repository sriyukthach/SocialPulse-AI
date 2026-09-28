import React from 'react';
import { BarChart3, TrendingUp, Target, FileText, Brain, PlusCircle, Sparkles, ArrowRight } from 'lucide-react';
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
        <p className="text-xs text-neutral-500 font-mono">Loading brand dashboard & Hindsight memory stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {/* 1. HERO PANEL — Editorial Dark Monochrome */}
      <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Content */}
          <div className="space-y-3 max-w-2xl">
            {/* Context Metadata Line */}
            <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.15em] uppercase text-neutral-400 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-neutral-200">{brand.industry}</span>
              <span className="text-neutral-600">•</span>
              <span className="flex items-center gap-1.5 text-neutral-300">
                <Brain className="w-3.5 h-3.5 text-neutral-400" />
                HINDSIGHT MEMORY BANK: "{brand.slug.toUpperCase()}"
              </span>
            </div>

            {/* Main Title */}
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {brand.name}
            </h1>

            {/* Supporting Content */}
            <div className="space-y-1.5 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              <p>
                <strong className="text-neutral-200 font-semibold">Target Audience:</strong> {brand.audience_description}
              </p>
              <p>
                <strong className="text-neutral-200 font-semibold">Core Content Goal:</strong> {brand.content_goal}
              </p>
            </div>
          </div>

          {/* Right-Side Action Area — Monochrome CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
            {/* Primary CTA: Premium White Button */}
            <button
              onClick={onNavigateToAnalysis}
              className="flex items-center justify-center gap-2 bg-[#F5F5F5] hover:bg-white text-[#080808] font-bold px-5.5 py-3 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap active:scale-95 shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-[#080808]" />
              <span>View Engagement Intelligence</span>
            </button>

            {/* Secondary CTA: Dark Outline Button */}
            <button
              onClick={onOpenPostModal}
              className="flex items-center justify-center gap-2 bg-transparent border border-[#333333] hover:bg-[#171717] text-[#E5E5E5] font-semibold px-4.5 py-3 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4 text-neutral-400" />
              <span>Add Post & Feedback</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. KPI / METRIC CARDS GRID */}
      <div className="space-y-3">
        <h2 className="text-[10px] sm:text-[11px] font-mono uppercase tracking-[0.15em] text-neutral-400 font-semibold">
          Performance Baseline & Memory Stats
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          <StatCard
            title="AVG ENGAGEMENT RATE"
            value={`${stats.average_engagement_rate}%`}
            subtitle="Calculated across recorded posts"
            icon={TrendingUp}
          />
          <StatCard
            title="TOP PERFORMING FORMAT"
            value={stats.top_performing_format}
            subtitle="Highest save & comment volume"
            icon={Target}
          />
          <StatCard
            title="TOTAL RECORDED POSTS"
            value={stats.total_posts}
            subtitle={`${stats.total_likes} likes, ${stats.total_comments} comments`}
            icon={FileText}
          />
          <StatCard
            title="HINDSIGHT MEMORIES"
            value={stats.recent_memories_count}
            subtitle="Persistent cross-session facts"
            icon={Brain}
          />
        </div>
      </div>

      {/* 3. AGENT LEARNING SPOTLIGHT */}
      <div className="bg-[#101010] border border-[#252525] rounded-2xl p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-[10px] font-mono font-bold text-neutral-300 uppercase tracking-[0.12em]">
                HINDSIGHT PERSISTENT MEMORY TAKEAWAY
              </span>
            </div>
            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed font-normal">
              SocialPulse AI continuously learns from audience reactions. For <strong>{brand.name}</strong>, educational routine breakdowns and mistimed cleansers generate <strong>10x higher saves & shares</strong> than standalone discount sales banners.
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

      {/* 4. RECENT POSTS & FEEDBACK FEED */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Posts & Feedback</h2>
            <p className="text-xs text-neutral-400">
              Post performance saved in SQLite and retained in Hindsight persistent memory bank <strong className="text-neutral-200 font-mono">"{brand.slug}"</strong>.
            </p>
          </div>
          <button
            onClick={onOpenPostModal}
            className="text-xs font-semibold text-neutral-300 hover:text-white flex items-center gap-1 bg-neutral-900 border border-neutral-800 px-3 py-1.5 rounded-xl hover:border-neutral-700 transition-all"
          >
            <span>+ Add New Post</span>
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
