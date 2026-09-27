import React from 'react';
import { BarChart3, TrendingUp, Users, Target, FileText, Brain, ArrowUpRight, PlusCircle, CheckCircle2, Info } from 'lucide-react';
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
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Brand Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900/90 to-sky-950/40 border border-slate-800 p-6 sm:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400">
                {brand.industry}
              </span>
              <span className="text-xs font-mono text-slate-400">
                Memory Bank: <strong className="text-sky-300">"{brand.slug}"</strong>
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-pink-500/10 border border-pink-500/20 text-pink-400 flex items-center gap-1">
                <Info className="w-3 h-3" />
                Fictional Demonstration Data
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {brand.name}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <strong className="text-slate-200">Target Audience:</strong> {brand.audience_description}
            </p>
            <p className="text-xs sm:text-sm text-slate-400">
              <strong className="text-slate-300">Goal:</strong> {brand.content_goal}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onNavigateToAnalysis}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-bold px-5 py-3 rounded-xl text-xs sm:text-sm transition-all shadow-lg shadow-sky-500/20 active:scale-95"
            >
              <BarChart3 className="w-4 h-4" />
              View Engagement Intelligence
            </button>
            <button
              onClick={onOpenPostModal}
              className="flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold px-4 py-3 rounded-xl text-xs sm:text-sm border border-slate-700 transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              Add Post & Feedback
            </button>
          </div>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Avg Engagement Rate"
          value={`${stats.average_engagement_rate}%`}
          subtitle="Calculated across recorded posts"
          icon={TrendingUp}
          accent="emerald"
        />
        <StatCard
          title="Top Performing Format"
          value={stats.top_performing_format}
          subtitle="Highest average saves & comments"
          icon={Target}
          accent="blue"
        />
        <StatCard
          title="Total Recorded Posts"
          value={stats.total_posts}
          subtitle={`${stats.total_likes} likes, ${stats.total_comments} comments`}
          icon={FileText}
          accent="blue"
        />
        <StatCard
          title="Hindsight Memories"
          value={stats.recent_memories_count}
          subtitle="Cross-session persistent insights"
          icon={Brain}
          accent="pink"
        />
      </div>

      {/* Recent Posts Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">Recent Posts & Feedback</h2>
            <p className="text-xs text-slate-400">
              Posts saved to SQLite and automatically indexed into Hindsight persistent memory.
            </p>
          </div>
          <button
            onClick={onOpenPostModal}
            className="text-xs font-semibold text-sky-400 hover:text-sky-300 flex items-center gap-1"
          >
            <span>+ Add new post</span>
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
