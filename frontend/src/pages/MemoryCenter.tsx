import React, { useState, useEffect } from 'react';
import { Brain, Search, Sparkles, RefreshCw, Send, Plus } from 'lucide-react';
import { Brand, RecalledMemoryItem } from '../types';
import { api } from '../api/client';
import { MemoryInsightCard } from '../components/MemoryInsightCard';

interface MemoryCenterProps {
  brand: Brand | null;
}

export const MemoryCenter: React.FC<MemoryCenterProps> = ({ brand }) => {
  const [memories, setMemories] = useState<RecalledMemoryItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('audience preferences feedback formats engagement topics');
  const [isLoading, setIsLoading] = useState(false);
  const [newInsightText, setNewInsightText] = useState('');
  const [isRetaining, setIsRetaining] = useState(false);
  const [retainMessage, setRetainMessage] = useState<string | null>(null);

  // Synthesis / Reflection states
  const [reflectionQuery, setReflectionQuery] = useState('What are the recurring audience preferences and preferred formats?');
  const [reflectionResult, setReflectionResult] = useState<string | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);

  const fetchMemories = async (queryToUse?: string) => {
    if (!brand) return;
    setIsLoading(true);
    try {
      const results = await api.getMemories(brand.id, queryToUse || searchQuery);
      setMemories(results);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (brand) {
      fetchMemories();
    }
  }, [brand?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMemories();
  };

  const handleRetainInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !newInsightText.trim()) return;

    setIsRetaining(true);
    setRetainMessage('Saving channel observation...');

    try {
      await api.retainInsight(brand.id, newInsightText);
      setRetainMessage('Observation saved successfully!');
      setNewInsightText('');
      setTimeout(() => {
        setRetainMessage(null);
        fetchMemories();
      }, 1000);
    } catch (err: any) {
      setRetainMessage('Error saving insight: ' + (err.response?.data?.detail || err.message));
    } finally {
      setIsRetaining(false);
    }
  };

  const handleReflect = async () => {
    if (!brand) return;
    setIsReflecting(true);
    try {
      const res = await api.reflectMemories(brand.id, reflectionQuery);
      setReflectionResult(res.reflection);
    } catch (err: any) {
      console.error(err);
      setReflectionResult('Unable to synthesize channel reflection at this time.');
    } finally {
      setIsReflecting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Studio Hero */}
      <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                CHANNEL MEMORY
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Insights for @{brand?.slug}
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Insights SocialPulse has remembered about <strong className="text-white">{brand?.name}</strong>. Memories persist across sessions to guide future content recommendations.
            </p>
          </div>

          <div className="bg-[#080808] p-4 rounded-2xl border border-[#202020] text-xs text-neutral-300 space-y-1 shrink-0 font-mono">
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Channel Status</div>
            <div className="text-white flex items-center gap-1.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
              INSIGHTS ACTIVE
            </div>
            <div className="text-[11px] text-neutral-400">
              Saved Observations: <strong className="text-white">{memories.length} items</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Control Panels: Add Note & Synthesize */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Add Channel Observation */}
        <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Add Channel Note</h3>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Record viewer observations, livestream notes, or audience feedback. SocialPulse will save these insights for future recommendations.
            </p>

            <form onSubmit={handleRetainInsight} className="space-y-3">
              <textarea
                required
                rows={3}
                value={newInsightText}
                onChange={(e) => setNewInsightText(e.target.value)}
                placeholder="e.g., Viewer feedback from Q&A: Subscribers requested side-by-side battery drain tests and timestamps in tech reviews."
                className="w-full bg-[#080808] border border-[#202020] rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none resize-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                {retainMessage ? (
                  <span className="text-xs font-mono text-neutral-300 animate-pulse">{retainMessage}</span>
                ) : (
                  <span className="text-[11px] text-neutral-500 font-mono">Saved into channel memory</span>
                )}

                <button
                  type="submit"
                  disabled={isRetaining || !newInsightText.trim()}
                  className="flex items-center gap-1.5 bg-white hover:bg-neutral-200 text-black px-4 py-2 rounded-xl text-xs font-extrabold transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isRetaining ? 'Saving...' : 'Save Observation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Synthesize Insights */}
        <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">Synthesize Channel Insights</h3>
              </div>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Synthesize overall audience preferences and recurring patterns across all saved channel memories.
            </p>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reflectionQuery}
                  onChange={(e) => setReflectionQuery(e.target.value)}
                  className="flex-1 bg-[#080808] border border-[#202020] rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none font-mono"
                />
                <button
                  onClick={handleReflect}
                  disabled={isReflecting}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-4 py-2 rounded-xl text-xs border border-neutral-700 whitespace-nowrap transition-all"
                >
                  {isReflecting ? 'Synthesizing...' : 'Synthesize'}
                </button>
              </div>

              {reflectionResult && (
                <div className="bg-[#080808] p-3.5 rounded-xl border border-[#202020] text-xs text-neutral-300 leading-relaxed italic">
                  <strong className="text-white not-italic block mb-1 text-[10px] font-mono uppercase">
                    Synthesized Insight:
                  </strong>
                  "{reflectionResult}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Saved Insights List */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Remembered Audience Insights ({memories.length})
            </h2>
            <p className="text-xs text-neutral-400">
              Persistent audience observations and performance patterns recorded for {brand?.name}.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter saved insights..."
                className="bg-[#080808] border border-[#202020] rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-100 focus:border-neutral-500 outline-none w-48 sm:w-64 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Search</span>
            </button>
          </form>
        </div>

        {memories.length === 0 ? (
          <div className="bg-[#101010] border border-[#252525] rounded-2xl p-12 text-center text-xs text-neutral-400">
            No channel insights have been saved yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memories.map((mem, idx) => (
              <MemoryInsightCard key={idx} memory={mem} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MemoryCenter;
