import React, { useState } from 'react';
import { X, Sparkles, Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { Post } from '../types';

interface PostFormModalProps {
  brandId: number;
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: (newPost: Post) => void;
}

export const PostFormModal: React.FC<PostFormModalProps> = ({
  brandId,
  isOpen,
  onClose,
  onPostCreated,
}) => {
  const [topic, setTopic] = useState('');
  const [format, setFormat] = useState('Carousel');
  const [caption, setCaption] = useState('');
  const [likes, setLikes] = useState<number>(150);
  const [commentsCount, setCommentsCount] = useState<number>(24);
  const [sharesCount, setSharesCount] = useState<number>(35);
  const [audienceFeedback, setAudienceFeedback] = useState('');
  const [postedDate, setPostedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('Saving post and persisting insights in Hindsight...');

    try {
      const created = await api.createPost({
        brand_id: brandId,
        topic,
        format,
        caption,
        likes: Number(likes),
        comments_count: Number(commentsCount),
        shares_count: Number(sharesCount),
        audience_feedback: audienceFeedback || undefined,
        posted_date: postedDate,
      });

      setStatusMessage('Retained in Hindsight successfully!');
      setTimeout(() => {
        onPostCreated(created);
        onClose();
        // Reset form
        setTopic('');
        setCaption('');
        setAudienceFeedback('');
        setStatusMessage(null);
      }, 700);
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Error saving post: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-xl p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-lg font-bold text-white">Add Post & Engagement Feedback</h3>
        </div>
        <p className="text-xs text-slate-400 mb-5">
          New post performance and audience reactions will be automatically analyzed and retained in Hindsight for future recommendation reasoning.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Post Topic / Theme</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Hydrating Barrier Serum Review"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-sky-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Content Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:ring-1 focus:ring-sky-500 outline-none"
              >
                <option value="Carousel">Carousel (Multi-slide breakdown)</option>
                <option value="Video Reel">Video Reel (Short video)</option>
                <option value="Static Image">Static Image (Single photo/graphic)</option>
                <option value="Story/Thread">Story / Discussion Thread</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Caption</label>
            <textarea
              required
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter the caption used on the post..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
            />
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-3 bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Likes</label>
              <input
                type="number"
                min="0"
                value={likes}
                onChange={(e) => setLikes(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Comments</label>
              <input
                type="number"
                min="0"
                value={commentsCount}
                onChange={(e) => setCommentsCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 mb-1">Shares / Saves</label>
              <input
                type="number"
                min="0"
                value={sharesCount}
                onChange={(e) => setSharesCount(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-white outline-none focus:ring-1 focus:ring-sky-500"
              />
            </div>
          </div>

          {/* Audience Feedback / Raw Comments */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-300">
                Audience Feedback, Questions & Comments
              </label>
              <span className="text-[10px] text-pink-400 font-mono">Retained into Hindsight Bank</span>
            </div>
            <textarea
              rows={2}
              value={audienceFeedback}
              onChange={(e) => setAudienceFeedback(e.target.value)}
              placeholder="e.g. Comments: 'Can you show how this works under sunscreen?', 'Does this clog pores for fungal acne?'"
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-2">
            <span className="text-[11px] text-slate-500 font-mono">
              Posting Date: {postedDate}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isSubmitting ? 'Retaining in Memory...' : 'Save & Retain Post'}
              </button>
            </div>
          </div>

          {statusMessage && (
            <p className="text-xs text-center text-sky-400 font-mono animate-pulse">
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};
