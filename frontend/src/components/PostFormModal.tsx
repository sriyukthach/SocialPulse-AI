import React, { useState } from 'react';
import { X, Sparkles, Send, Brain, Video } from 'lucide-react';
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
  const [format, setFormat] = useState('Long-form Review');
  const [caption, setCaption] = useState('');
  const [likes, setLikes] = useState<number>(12500);
  const [commentsCount, setCommentsCount] = useState<number>(1850);
  const [sharesCount, setSharesCount] = useState<number>(450000); // Mapped to YouTube Views
  const [audienceFeedback, setAudienceFeedback] = useState('');
  const [postedDate, setPostedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatusMessage('Saving video metrics and persisting observations in Hindsight memory...');

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
      setStatusMessage('Error saving video data: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-[#101010] border border-[#252525] rounded-3xl w-full max-w-xl p-6 sm:p-8 shadow-2xl relative my-auto max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-neutral-400 hover:text-white p-1.5 rounded-xl hover:bg-neutral-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5 mb-1">
          <div className="p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white">
            <Video className="w-4 h-4 text-white" />
          </div>
          <h3 className="text-lg font-bold text-white tracking-tight">Add Video & Viewer Feedback</h3>
        </div>
        <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
          Public YouTube video metrics and viewer comments will be automatically analyzed and retained in Hindsight for persistent channel learning.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Video Title / Topic</label>
              <input
                type="text"
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Ultimate M3 Max Laptop Thermal Throttle Test"
                className="w-full bg-[#080808] border border-[#202020] rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Video Format</label>
              <select
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                className="w-full bg-[#080808] border border-[#202020] rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 focus:border-neutral-500 outline-none font-mono"
              >
                <option value="Long-form Review">Long-form Review (Full breakdown)</option>
                <option value="YouTube Short">YouTube Short (60s Vertical)</option>
                <option value="Deep Dive Essay">Deep Dive Essay / Documentary</option>
                <option value="Hands-on Tutorial">Hands-on Tutorial / Guide</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">Video Description / Summary</label>
            <textarea
              required
              rows={2}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Enter the main description or key takeaway of the video..."
              className="w-full bg-[#080808] border border-[#202020] rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none resize-none"
            />
          </div>

          {/* Metrics Row */}
          <div className="grid grid-cols-3 gap-3 bg-[#080808] p-3.5 rounded-2xl border border-[#202020]">
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Public Views</label>
              <input
                type="number"
                min="0"
                value={sharesCount}
                onChange={(e) => setSharesCount(Number(e.target.value))}
                placeholder="450000"
                className="w-full bg-[#121212] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-neutral-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Likes</label>
              <input
                type="number"
                min="0"
                value={likes}
                onChange={(e) => setLikes(Number(e.target.value))}
                className="w-full bg-[#121212] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-neutral-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Comments</label>
              <input
                type="number"
                min="0"
                value={commentsCount}
                onChange={(e) => setCommentsCount(Number(e.target.value))}
                className="w-full bg-[#121212] border border-[#252525] rounded-xl px-2.5 py-2 text-xs text-white outline-none focus:border-neutral-500 font-mono"
              />
            </div>
          </div>

          {/* Viewer Feedback */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-neutral-300">
                Viewer Comments & Feedback
              </label>
              <span className="text-[10px] text-neutral-400 font-mono flex items-center gap-1">
                <Brain className="w-3 h-3 text-neutral-400" />
                Retained into Hindsight
              </span>
            </div>
            <textarea
              rows={2}
              value={audienceFeedback}
              onChange={(e) => setAudienceFeedback(e.target.value)}
              placeholder="e.g., Top Comments: 'Please do a battery drain test after 6 months!', 'Timestamps saved so much time!'"
              className="w-full bg-[#080808] border border-[#202020] rounded-xl px-3.5 py-2.5 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#202020] flex-wrap gap-2">
            <span className="text-[11px] text-neutral-400 font-mono">
              Date: {postedDate}
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-semibold text-neutral-400 hover:text-white rounded-xl hover:bg-neutral-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-2 bg-[#F5F5F5] hover:bg-white text-[#080808] px-4.5 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Retaining in Memory...' : 'Save & Retain Video'}</span>
              </button>
            </div>
          </div>

          {statusMessage && (
            <p className="text-xs text-center text-neutral-300 font-mono animate-pulse pt-1">
              {statusMessage}
            </p>
          )}
        </form>
      </div>
    </div>
  );
};

