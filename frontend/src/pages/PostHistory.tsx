import React, { useState } from 'react';
import { Video, PlusCircle, Search, Filter } from 'lucide-react';
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

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (post.audience_feedback && post.audience_feedback.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFormat = selectedFormat === 'all' || post.format.toLowerCase().includes(selectedFormat.toLowerCase());

    return matchesSearch && matchesFormat;
  });

  return (
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-300">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Channel Video & Content History</h1>
            <span className="text-[10px] px-2.5 py-0.5 rounded bg-neutral-900 text-neutral-300 font-mono border border-neutral-800">
              {posts.length} videos analyzed
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Browse all public video uploads, view counts, likes, and viewer comments retained in <strong className="text-neutral-200">{brand?.name}</strong>'s Hindsight memory bank.
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="flex items-center justify-center gap-2 bg-[#F5F5F5] hover:bg-white text-[#080808] font-bold px-4.5 py-2.5 rounded-xl text-xs transition-all shrink-0 shadow-sm"
        >
          <PlusCircle className="w-4 h-4 text-[#080808]" />
          <span>Add Video & Feedback</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-[#101010] p-3 rounded-2xl border border-[#252525]">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by video title, description, or viewer feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080808] border border-[#202020] rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-neutral-500 hidden sm:block" />
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-[#080808] border border-[#202020] text-neutral-300 text-xs rounded-xl px-3 py-2 focus:border-neutral-500 outline-none cursor-pointer font-mono"
          >
            <option value="all">All Video Formats</option>
            <option value="Review">Long-form Review</option>
            <option value="Short">YouTube Short</option>
            <option value="Tutorial">Hands-on Tutorial</option>
            <option value="Deep Dive">Deep Dive Essay</option>
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-[#101010] border border-[#252525] rounded-2xl p-12 text-center">
          <Video className="w-8 h-8 text-neutral-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-neutral-300 mb-1">No videos found</h3>
          <p className="text-xs text-neutral-500 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or add new video performance metrics.
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
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
};

