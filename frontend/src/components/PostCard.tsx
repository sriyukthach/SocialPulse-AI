import React from 'react';
import { Heart, MessageSquare, Share2, Calendar, Brain, Sparkles } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  return (
    <div className="bg-[#101010] border border-[#252525] hover:border-[#3A3A3A] rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-sm">
      <div>
        {/* Header: Format Badge & Hindsight Memory Badge */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <span className="text-[11px] font-mono font-medium px-2.5 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800">
            {post.format}
          </span>
          <div className="flex items-center gap-2">
            {post.hindsight_retained && (
              <span className="flex items-center gap-1.5 text-[10px] font-mono font-medium text-neutral-300 bg-white/5 border border-white/10 px-2.5 py-0.5 rounded-md">
                <Brain className="w-3 h-3 text-neutral-400" />
                Hindsight Memory
              </span>
            )}
            {post.posted_date && (
              <span className="text-[10px] text-neutral-500 flex items-center gap-1 font-mono">
                <Calendar className="w-3 h-3 text-neutral-600" />
                {post.posted_date}
              </span>
            )}
          </div>
        </div>

        {/* Topic & Caption */}
        <h4 className="text-base font-bold text-white mb-2 leading-snug">{post.topic}</h4>
        <p className="text-xs text-neutral-300 mb-4 bg-[#080808] p-3 rounded-xl border border-[#202020] leading-relaxed font-normal">
          "{post.caption}"
        </p>

        {/* Audience Feedback & Reactions */}
        {post.audience_feedback && (
          <div className="mb-4 bg-[#0D0D0D] border border-[#222222] rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-neutral-300 mb-1">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              Audience Feedback & Sentiment:
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed italic">
              "{post.audience_feedback}"
            </p>
          </div>
        )}
      </div>

      {/* Engagement Footer — Monochrome Metrics */}
      <div className="pt-3 border-t border-[#202020] flex items-center justify-between text-xs text-neutral-400 font-mono">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5 text-neutral-300" title="Likes">
            <Heart className="w-3.5 h-3.5 text-neutral-400" />
            {post.likes}
          </span>
          <span className="flex items-center gap-1.5 text-neutral-300" title="Comments">
            <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
            {post.comments_count}
          </span>
          <span className="flex items-center gap-1.5 text-neutral-300" title="Shares / Saves">
            <Share2 className="w-3.5 h-3.5 text-neutral-400" />
            {post.shares_count}
          </span>
        </div>

        {post.engagement_rate !== undefined && (
          <div className="text-[11px] font-semibold text-neutral-200 bg-neutral-900 px-2.5 py-0.5 rounded-md border border-neutral-800">
            ER: {post.engagement_rate}%
          </div>
        )}
      </div>
    </div>
  );
};
