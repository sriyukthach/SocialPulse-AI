import React from 'react';
import { Heart, MessageSquare, Share2, CheckCircle2, Calendar, Sparkles } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const formatBadgeColors: Record<string, string> = {
    Carousel: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    'Video Reel': 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    'Static Image': 'bg-pink-500/10 text-pink-400 border-pink-500/30',
    'Story/Thread': 'bg-amber-500/10 text-amber-400 border-amber-500/30',
  };

  const badgeStyle = formatBadgeColors[post.format] || 'bg-slate-800 text-slate-300 border-slate-700';

  return (
    <div className="bg-slate-900/70 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-5 transition-all flex flex-col justify-between">
      <div>
        {/* Header: Format Badge & Date & Retention status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-lg border ${badgeStyle}`}>
            {post.format}
          </span>
          <div className="flex items-center gap-2">
            {post.hindsight_retained && (
              <span className="flex items-center gap-1 text-[11px] font-mono font-medium text-sky-400 bg-sky-950/60 border border-sky-800/60 px-2 py-0.5 rounded-md">
                <CheckCircle2 className="w-3 h-3 text-sky-400" />
                Hindsight Memory
              </span>
            )}
            {post.posted_date && (
              <span className="text-[11px] text-slate-500 flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {post.posted_date}
              </span>
            )}
          </div>
        </div>

        {/* Topic & Caption */}
        <h4 className="text-base font-bold text-white mb-2 leading-snug">{post.topic}</h4>
        <p className="text-xs text-slate-300 mb-4 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 leading-relaxed font-normal">
          "{post.caption}"
        </p>

        {/* Audience Feedback & Reactions if any */}
        {post.audience_feedback && (
          <div className="mb-4 bg-pink-950/20 border border-pink-900/30 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-pink-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-pink-400" />
              Audience Feedback & Sentiment:
            </div>
            <p className="text-xs text-slate-300 leading-relaxed italic">
              {post.audience_feedback}
            </p>
          </div>
        )}
      </div>

      {/* Engagement Footer */}
      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-slate-300">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <MessageSquare className="w-3.5 h-3.5 text-sky-400" />
            {post.comments_count}
          </span>
          <span className="flex items-center gap-1.5 text-slate-300">
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            {post.shares_count}
          </span>
        </div>

        {post.engagement_rate !== undefined && (
          <div className="text-[11px] font-semibold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-md border border-sky-500/20">
            ER Index: {post.engagement_rate}
          </div>
        )}
      </div>
    </div>
  );
};
