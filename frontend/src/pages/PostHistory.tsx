import React, { useState } from 'react';
import { History, PlusCircle, Search, Filter } from 'lucide-react';
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

    const matchesFormat = selectedFormat === 'all' || post.format === selectedFormat;

    return matchesSearch && matchesFormat;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight">Post & Feedback History</h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {posts.length} records
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Browse all posts, engagement numbers, and audience comments retained into {brand?.name}'s memory bank.
          </p>
        </div>

        <button
          onClick={onOpenPostModal}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl text-xs transition-all shadow-md shadow-sky-500/20"
        >
          <PlusCircle className="w-4 h-4" />
          Add Post & Feedback
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-slate-900/60 p-3 rounded-2xl border border-slate-800">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by topic, caption, or audience comments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-sky-500 outline-none"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 hidden sm:block" />
          <select
            value={selectedFormat}
            onChange={(e) => setSelectedFormat(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded-xl px-3 py-2 focus:ring-1 focus:ring-sky-500 outline-none"
          >
            <option value="all">All Formats</option>
            <option value="Carousel">Carousel</option>
            <option value="Video Reel">Video Reel</option>
            <option value="Static Image">Static Image</option>
            <option value="Story/Thread">Story/Thread</option>
          </select>
        </div>
      </div>

      {/* Posts Grid */}
      {filteredPosts.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center">
          <History className="w-8 h-8 text-slate-600 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-slate-300 mb-1">No posts found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or add a new post with audience engagement data.
          </p>
          <button
            onClick={onOpenPostModal}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold"
          >
            Add First Post
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
