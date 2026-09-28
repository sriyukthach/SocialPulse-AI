import React, { useState, useEffect } from 'react';
import { Brain, Search, Sparkles, RefreshCw, Send, ShieldCheck, Plus } from 'lucide-react';
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

  // Reflection states
  const [reflectionQuery, setReflectionQuery] = useState('What are the recurring audience pain points and preferred formats?');
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
  }, [brand]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchMemories();
  };

  const handleRetainInsight = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!brand || !newInsightText.trim()) return;

    setIsRetaining(true);
    setRetainMessage('Retaining observation into Hindsight Memory Bank...');

    try {
      await api.retainInsight(brand.id, newInsightText);
      setRetainMessage('Observation successfully retained in Hindsight!');
      setNewInsightText('');
      setTimeout(() => {
        setRetainMessage(null);
        fetchMemories();
      }, 1000);
    } catch (err: any) {
      setRetainMessage('Error retaining insight: ' + (err.response?.data?.detail || err.message));
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
      setReflectionResult('Unable to synthesize reflection at this time.');
    } finally {
      setIsReflecting(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header Studio Hero — Technical Monochrome */}
      <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-[0.15em]">
                HINDSIGHT PERSISTENT MEMORY WORKBENCH
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Agent Memory & Audience Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Explore the persistent mental models and extracted facts stored in Hindsight memory bank <strong className="text-neutral-200 font-mono">"{brand?.slug}"</strong>. Memories persist across sessions to guide future content recommendations.
            </p>
          </div>

          <div className="bg-[#080808] p-4 rounded-2xl border border-[#202020] font-mono text-xs text-neutral-300 space-y-1.5 shrink-0">
            <div className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Memory Bank Status</div>
            <div className="text-white flex items-center gap-1.5 font-bold">
              <span className="h-2 w-2 rounded-full bg-white animate-pulse"></span>
              ACTIVE & SYNCED
            </div>
            <div className="text-[11px] text-neutral-400">
              Total Memory Units: <strong className="text-white">{memories.length} facts</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Control Panels: RETAIN & REFLECT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* RETAIN Control Panel */}
        <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  <Plus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">RETAIN: Add Observation / Insight</h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                hindsight.retain()
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Record viewer observations, live Q&A comments, or community feedback. Hindsight will extract facts and integrate them into future channel recommendation context.
            </p>

            <form onSubmit={handleRetainInsight} className="space-y-3">
              <textarea
                required
                rows={3}
                value={newInsightText}
                onChange={(e) => setNewInsightText(e.target.value)}
                placeholder="e.g., Viewer feedback from live livestream Q&A: 80% of subscribers requested side-by-side battery drain tests and timestamps in tech reviews."
                className="w-full bg-[#080808] border border-[#202020] rounded-xl p-3 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none resize-none"
              />

              <div className="flex items-center justify-between flex-wrap gap-2 pt-1">
                {retainMessage ? (
                  <span className="text-xs font-mono text-neutral-300 animate-pulse">{retainMessage}</span>
                ) : (
                  <span className="text-[10px] text-neutral-500 font-mono">Retained instantly into Hindsight</span>
                )}

                <button
                  type="submit"
                  disabled={isRetaining || !newInsightText.trim()}
                  className="flex items-center gap-1.5 bg-[#F5F5F5] hover:bg-white text-[#080808] px-4 py-2 rounded-xl text-xs font-bold transition-all disabled:opacity-50"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isRetaining ? 'Retaining...' : 'Retain Insight'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* REFLECT Control Panel */}
        <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-white">REFLECT: Synthesize Memories</h3>
              </div>
              <span className="text-[10px] font-mono text-neutral-400 bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                hindsight.reflect()
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">
              Hindsight reflects over accumulated memories to form overarching behavioral models and audience disposition summaries.
            </p>

            <div className="space-y-3">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={reflectionQuery}
                  onChange={(e) => setReflectionQuery(e.target.value)}
                  className="flex-1 bg-[#080808] border border-[#202020] rounded-xl px-3 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none"
                />
                <button
                  onClick={handleReflect}
                  disabled={isReflecting}
                  className="bg-neutral-800 hover:bg-neutral-700 text-white font-semibold px-4 py-2 rounded-xl text-xs border border-neutral-700 whitespace-nowrap transition-all"
                >
                  {isReflecting ? 'Synthesizing...' : 'Reflect'}
                </button>
              </div>

              {reflectionResult && (
                <div className="bg-[#080808] p-3.5 rounded-xl border border-[#202020] text-xs text-neutral-300 leading-relaxed italic">
                  <strong className="text-white not-italic block mb-1 text-[10px] font-mono uppercase">
                    SYNTHESIZED HINDSIGHT REFLECTION:
                  </strong>
                  "{reflectionResult}"
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* RECALL Memory Search & Inspection Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              RECALL: Memory Units ({memories.length})
            </h2>
            <p className="text-xs text-neutral-400">
              Semantic, graph, and keyword memories indexed for {brand?.name}.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Recall query..."
                className="bg-[#080808] border border-[#202020] rounded-xl pl-8 pr-3 py-1.5 text-xs text-neutral-100 focus:border-neutral-500 outline-none w-48 sm:w-64 font-mono"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border border-neutral-700 transition-all"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Recall</span>
            </button>
          </form>
        </div>

        {memories.length === 0 ? (
          <div className="bg-[#101010] border border-[#252525] rounded-2xl p-8 text-center text-xs text-neutral-500">
            No memories found matching this recall query.
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
