import React, { useState } from 'react';
import { ThumbsUp, MessageSquare, Eye, Calendar, Video, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { Post } from '../types';

interface PostCardProps {
  post: Post;
}

export const PostCard: React.FC<PostCardProps> = ({ post }) => {
  const [showFeedback, setShowFeedback] = useState(false);

  const formatViews = (num: number) => {
    if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M views`;
    if (num >= 1_000) return `${(num / 1_000).toFixed(0)}K views`;
    return `${num} views`;
  };

  return (
    <div className="bg-[#101010] border border-[#252525] hover:border-[#333333] rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-sm">
      <div>
        {/* Header: Format Badge & Posted Date */}
        <div className="flex items-center justify-between gap-2 mb-3 flex-wrap">
          <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-md bg-neutral-900 text-neutral-300 border border-neutral-800 flex items-center gap-1.5">
            <Video className="w-3.5 h-3.5 text-neutral-400" />
            {post.format}
          </span>
          {post.posted_date && (
            <span className="text-xs text-neutral-500 flex items-center gap-1 font-mono">
              <Calendar className="w-3.5 h-3.5 text-neutral-600" />
              {post.posted_date}
            </span>
          )}
        </div>

        {/* Video Title / Topic */}
        <h3 className="text-base font-bold text-white mb-2 leading-snug">{post.topic}</h3>
        <p className="text-xs text-neutral-300 mb-4 bg-[#080808] p-3 rounded-xl border border-[#202020] leading-relaxed font-normal">
          {post.caption}
        </p>

        {/* Expandable Audience Feedback */}
        <div className="mb-4">
          <button
            onClick={() => setShowFeedback(!showFeedback)}
            className="w-full flex items-center justify-between bg-[#080808] hover:bg-[#121212] border border-[#202020] rounded-xl px-3 py-2 text-xs text-neutral-300 font-medium transition-colors"
          >
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
              <span>Audience feedback</span>
            </span>
            {showFeedback ? (
              <ChevronUp className="w-4 h-4 text-neutral-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-neutral-500" />
            )}
          </button>

          {showFeedback && (
            <div className="mt-2 bg-[#0D0D0D] border border-[#222222] rounded-xl p-3 text-xs text-neutral-300 leading-relaxed font-mono">
              {post.audience_feedback ? (
                <p className="italic">"{post.audience_feedback}"</p>
              ) : (
                <p className="text-neutral-500 not-italic">Comments unavailable for this video.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Engagement Footer — YouTube Metrics */}
      <div className="pt-3 border-t border-[#202020] flex items-center justify-between text-xs text-neutral-400 font-mono">
        <div className="flex items-center gap-3.5">
          <span className="flex items-center gap-1 text-neutral-300 font-semibold" title="Views">
            <Eye className="w-3.5 h-3.5 text-neutral-400" />
            {formatViews(post.shares_count)}
          </span>
          <span className="flex items-center gap-1 text-neutral-300" title="Likes">
            <ThumbsUp className="w-3.5 h-3.5 text-neutral-400" />
            {post.likes >= 1000 ? `${(post.likes / 1000).toFixed(1)}k` : post.likes}
          </span>
          <span className="flex items-center gap-1 text-neutral-300" title="Comments">
            <MessageSquare className="w-3.5 h-3.5 text-neutral-400" />
            {post.comments_count >= 1000 ? `${(post.comments_count / 1000).toFixed(1)}k` : post.comments_count}
          </span>
        </div>

        {post.engagement_rate !== undefined && (
          <div className="text-[11px] font-semibold text-white bg-neutral-900 px-2.5 py-0.5 rounded-md border border-neutral-800">
            {post.engagement_rate}% ER
          </div>
        )}
      </div>
    </div>
  );
};

export default PostCard;
