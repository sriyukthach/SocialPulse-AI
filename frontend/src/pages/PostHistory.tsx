import React, { useState } from 'react';
import { Video, PlusCircle, Search, Filter, ArrowUpDown } from 'lucide-react';
import { Post, Brand } from '../types';
import { PostCard } from '../components/PostCard';

interface PostHistoryProps {
  posts: Post[];
  brand: Brand | null;
  onOpenPostModal: () => void;
}

export const PostHistory: React.FC<PostHistoryProps> = ({
  posts,
  brand,
  onOpenPostModal,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFormat, setSelectedFormat] = useState('all');
  const [sortBy, setSortBy] = useState<'recent' | 'views' | 'engagement' | 'comments'>('views');

  // Filtering
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.audience_feedback && post.audience_feedback.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFormat = selectedFormat === 'all' || post.format.toLowerCase().includes(selectedFormat.toLowerCase());

    return matchesSearch && matchesFormat;
  });

  // Sorting
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    if (sortBy === 'views') return b.shares_count - a.shares_count;
    if (sortBy === 'engagement') return (b.engagement_rate || 0) - (a.engagement_rate || 0);
    if (sortBy === 'comments') return b.comments_count - a.comments_count;
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Content History</h1>
            <span className="text-xs px-2.5 py-0.5 rounded bg-neutral-900 text-neutral-300 font-mono border border-neutral-800 font-semibold">
              {posts.length} videos analyzed
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 mt-1">
            Browse public video uploads, views, likes, and viewer comments for <strong className="text-white">{brand?.name}</strong>.
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="flex items-center justify-center gap-2 bg-white hover:bg-neutral-200 text-black font-extrabold px-4.5 py-2.5 rounded-xl text-xs transition-all shrink-0 shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-black" />
          <span>Add Video Data</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#101010] p-3 rounded-2xl border border-[#252525]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search videos by title, description, or feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080808] border border-[#202020] rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-[#080808] border border-[#202020] px-3 py-1.5 rounded-xl">
            <Filter className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
              className="bg-transparent text-neutral-300 text-xs focus:outline-none cursor-pointer font-mono"
            >
              <option value="all">All Formats</option>
              <option value="Review">Long-form Review</option>
              <option value="Short">YouTube Short</option>
              <option value="Tutorial">Hands-on Tutorial</option>
              <option value="Deep Dive">Deep Dive Essay</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-[#080808] border border-[#202020] px-3 py-1.5 rounded-xl">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-neutral-300 text-xs focus:outline-none cursor-pointer font-mono"
            >
              <option value="views">Highest Views</option>
              <option value="engagement">Highest Engagement</option>
              <option value="comments">Most Comments</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      {sortedPosts.length === 0 ? (
        <div className="bg-[#101010] border border-[#252525] rounded-2xl p-12 text-center">
          <Video className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-300 mb-1">No videos found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            Try adjusting your search query or format filter.
          </p>
          <button
            onClick={onOpenPostModal}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-xl text-xs font-semibold border border-neutral-700"
          >
            Add First Video Data
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sortedPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

export default PostHistory;
