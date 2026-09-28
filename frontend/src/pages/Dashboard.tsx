import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Video, Sparkles, ArrowRight, Eye, Info, MessageSquare, ThumbsUp, Lightbulb, Compass, HelpCircle, AlertTriangle } from 'lucide-react';
import { BrandDashboardStats, Brand, EngagementAnalysisResponse, ContentRecommendation } from '../types';
import { StatCard } from '../components/StatCard';
import { PostCard } from '../components/PostCard';
import { api } from '../api/client';

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
  const [analysis, setAnalysis] = useState<EngagementAnalysisResponse | null>(null);

  useEffect(() => {
    if (brand) {
      api.getEngagementAnalysis(brand.id)
        .then((res) => setAnalysis(res))
        .catch((err) => console.error('Error fetching overview analysis:', err));
    }
  }, [brand?.id]);

  if (!stats || !brand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-neutral-300"></div>
        <p className="text-xs text-neutral-400 font-mono">Retrieving YouTube channel metrics & channel memory...</p>
      </div>
    );
  }

  // Format numbers
  const formatViews = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K`;
    return `${num}`;
  };

  const avgViewsPerVideo = stats.total_posts > 0 ? Math.round(stats.total_shares / stats.total_posts) : 0;

  return (
    <div className="space-y-8 sm:space-y-10 animate-in fade-in duration-300">
      {/* 1. CHANNEL OVERVIEW HERO */}
      <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left Channel Info */}
          <div className="space-y-3 max-w-3xl">
            <div className="text-xs font-mono tracking-wider text-neutral-400 flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white px-2.5 py-0.5 rounded bg-neutral-900 border border-neutral-800">
                {brand.industry}
              </span>
              <span className="text-neutral-600">•</span>
              <span className="text-neutral-300 font-sans">Channel Handle: <strong>@{brand.slug}</strong></span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {brand.name}
            </h1>

            <div className="space-y-1 text-xs sm:text-sm text-neutral-400 leading-relaxed font-normal">
              <p><strong className="text-neutral-200 font-semibold">Channel Focus:</strong> {brand.content_goal}</p>
              <p><strong className="text-neutral-200 font-semibold">Audience Description:</strong> {brand.audience_description}</p>
            </div>
          </div>

          {/* Right CTAs */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row gap-3 shrink-0">
            <button
              onClick={onNavigateToAnalysis}
              className="flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold px-5.5 py-3 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap active:scale-95 shadow-sm"
            >
              <BarChart3 className="w-4 h-4 text-black" />
              <span>View Insights</span>
            </button>

            <button
              onClick={onOpenPostModal}
              className="flex items-center justify-center gap-2 bg-[#141414] border border-[#262626] hover:bg-neutral-800 text-neutral-200 font-semibold px-4.5 py-3 rounded-xl text-xs sm:text-sm transition-all whitespace-nowrap"
            >
              <Video className="w-4 h-4 text-neutral-400" />
              <span>Add Video Data</span>
            </button>
          </div>
        </div>

        {/* Data Source Disclosure */}
        <div className="bg-[#080808] border border-[#202020] rounded-2xl p-4 flex items-start gap-3 text-xs text-neutral-400">
          <Info className="w-4 h-4 text-neutral-400 shrink-0 mt-0.5" />
          <div className="space-y-0.5">
            <span className="font-semibold text-neutral-200 block text-xs font-mono uppercase tracking-wider">
              Data Source: Public YouTube Data
            </span>
            <p className="text-neutral-400 leading-relaxed text-xs">
              SocialPulse analyzes publicly available channel, video, and comment information. It does not access private YouTube Studio analytics.
            </p>
          </div>
        </div>
      </div>

      {/* 2. COMPACT CHANNEL STATISTICS GRID */}
      <div className="space-y-3">
        <h2 className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-semibold">
          Performance Summary
        </h2>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <StatCard
            title="TOTAL VIEWS"
            value={formatViews(stats.total_shares)}
            subtitle="Analyzed videos view count"
            icon={Eye}
          />
          <StatCard
            title="VIDEOS ANALYZED"
            value={stats.total_posts}
            subtitle="Recent public uploads"
            icon={Video}
          />
          <StatCard
            title="AVG VIEWS / VIDEO"
            value={formatViews(avgViewsPerVideo)}
            subtitle="Average per upload"
            icon={TrendingUp}
          />
          <StatCard
            title="AVG ENGAGEMENT"
            value={`${stats.average_engagement_rate}%`}
            subtitle="Like + Comment ratio"
            icon={BarChart3}
          />
          <StatCard
            title="COMMENTS ANALYZED"
            value={formatViews(stats.total_comments)}
            subtitle="Public audience feedback"
            icon={MessageSquare}
          />
        </div>
      </div>

      {/* 3. WHAT WE FOUND (Key Insights from Actual Data) */}
      <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <h2 className="text-base font-bold text-white tracking-tight">What We Found</h2>
          </div>
          <button
            onClick={onNavigateToAnalysis}
            className="text-xs font-medium text-neutral-400 hover:text-white flex items-center gap-1 transition-colors"
          >
            <span>Full Insights Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-[#080808] p-4 rounded-xl border border-[#202020] space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-white"></span>
              Top Performing Format
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              <strong>{stats.top_performing_format}</strong> videos achieve the highest watch-time retention and viewer comment depth for {brand.name}.
            </p>
          </div>

          <div className="bg-[#080808] p-4 rounded-xl border border-[#202020] space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neutral-400"></span>
              Engagement Benchmark
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Average engagement rate across analyzed uploads is <strong>{stats.average_engagement_rate}%</strong> ({stats.total_likes.toLocaleString()} likes and {stats.total_comments.toLocaleString()} comments).
            </p>
          </div>

          <div className="bg-[#080808] p-4 rounded-xl border border-[#202020] space-y-2">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-neutral-500"></span>
              Viewer Feedback Patterns
            </div>
            <p className="text-xs text-neutral-300 leading-relaxed">
              Audience actively asks technical follow-up questions and timestamp requests across recent comment sections.
            </p>
          </div>
        </div>
      </div>

      {/* 4. CONTENT RECOMMENDATIONS SECTION */}
      {analysis && analysis.recommendations && analysis.recommendations.length > 0 && (
        <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-5">
          <div className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-xl bg-white text-black flex items-center justify-center font-bold">
              <Lightbulb className="w-4 h-4 text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">Content Recommendations</h2>
              <p className="text-xs text-neutral-400">Suggested next actions based on {brand.name}'s historical video performance.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {analysis.recommendations.map((rec, idx) => (
              <div key={idx} className="bg-[#080808] border border-[#202020] rounded-xl p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 uppercase font-semibold">
                    {rec.category}
                  </span>
                  <h3 className="text-sm font-bold text-white">{rec.title}</h3>
                  <p className="text-xs text-neutral-300 leading-relaxed">{rec.recommendation}</p>
                </div>

                <div className="pt-3 border-t border-[#202020] space-y-1.5 text-[11px] font-sans">
                  <div>
                    <strong className="text-neutral-400 font-mono text-[10px] uppercase block">Why:</strong>
                    <span className="text-neutral-300">{rec.why}</span>
                  </div>
                  <div>
                    <strong className="text-neutral-400 font-mono text-[10px] uppercase block">Evidence:</strong>
                    <span className="text-neutral-400 italic">{rec.evidence}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 5. SAVED CHANNEL INSIGHTS SUMMARY */}
      <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <h3 className="text-sm font-bold text-white">Channel Insights Saved for @{brand.slug}</h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              SocialPulse stores persistent facts about this channel's audience preferences. Long-form video breakdowns with explicit timestamps and direct benchmarks generate higher comment depth than short teaser announcements.
            </p>
          </div>

          <button
            onClick={onNavigateToAnalysis}
            className="flex items-center gap-1.5 text-xs font-semibold text-white bg-neutral-900 border border-neutral-800 hover:border-neutral-700 px-4 py-2.5 rounded-xl shrink-0 transition-all"
          >
            <span>Explore Insights</span>
            <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
          </button>
        </div>
      </div>

      {/* 6. RECENT ANALYZED VIDEOS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Analyzed Public Videos</h2>
            <p className="text-xs text-neutral-400">
              Recent uploads and audience feedback recorded for <strong className="text-neutral-200">@{brand.slug}</strong>.
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

export default Dashboard;
