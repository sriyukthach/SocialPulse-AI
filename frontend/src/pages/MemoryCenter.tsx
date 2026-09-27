import React, { useState, useEffect } from 'react';
import { Brain, Search, Sparkles, RefreshCw, Send, ShieldCheck, Plus, MessageSquare, Layers } from 'lucide-react';
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-pink-950/30 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-semibold text-pink-400 uppercase tracking-wider">
                Hindsight Persistent Memory Center
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Agent Memory & Audience Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Explore the persistent mental models and extracted facts stored in Hindsight memory bank <strong className="text-sky-300">"{brand?.slug}"</strong>. Memories persist across sessions to guide future content generation.
            </p>
          </div>

          <div className="bg-slate-950/70 p-4 rounded-2xl border border-slate-800/80 font-mono text-xs text-slate-300 space-y-1.5">
            <div className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">Memory Bank Status</div>
            <div className="text-emerald-400 flex items-center gap-1.5 font-bold">
              <ShieldCheck className="w-4 h-4" />
              Active & Connected
            </div>
            <div className="text-[11px] text-slate-400">
              Total Units: <strong className="text-white">{memories.length} facts</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Retain Tool & Reflection Tool */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Retain Manual Insight Tool */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Plus className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Add Audience Observation / Insight</h3>
            </div>
            <span className="text-[10px] font-mono text-sky-400 bg-sky-950/40 px-2 py-0.5 rounded border border-sky-800/40">
              client.retain()
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Record direct feedback from DMs, customer service tickets, or focus groups. Hindsight will extract facts and integrate them into future recommendation context.
          </p>

          <form onSubmit={handleRetainInsight} className="space-y-3">
            <textarea
              required
              rows={3}
              value={newInsightText}
              onChange={(e) => setNewInsightText(e.target.value)}
              placeholder="e.g., Community feedback from live Q&A: 70% of viewers struggle with finding sunscreens that don't leave a white cast or sting eyes."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-sky-500 outline-none resize-none"
            />

            <div className="flex items-center justify-between">
              {retainMessage ? (
                <span className="text-xs font-mono text-emerald-400 animate-pulse">{retainMessage}</span>
              ) : (
                <span className="text-[11px] text-slate-500 font-mono">Persisted instantly into Hindsight</span>
              )}

              <button
                type="submit"
                disabled={isRetaining || !newInsightText.trim()}
                className="flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md shadow-sky-500/20 disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                {isRetaining ? 'Retaining...' : 'Retain Insight'}
              </button>
            </div>
          </form>
        </div>

        {/* Reflection Synthesis Tool */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Synthesize Memory (Reflection)</h3>
            </div>
            <span className="text-[10px] font-mono text-pink-400 bg-pink-950/40 px-2 py-0.5 rounded border border-pink-800/40">
              client.reflect()
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Hindsight reflects over accumulated memories to form overarching behavioral models and audience disposition summaries.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={reflectionQuery}
              onChange={(e) => setReflectionQuery(e.target.value)}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-sky-500 outline-none"
            />
            <button
              onClick={handleReflect}
              disabled={isReflecting}
              className="bg-slate-800 hover:bg-slate-700 text-pink-300 font-semibold px-4 py-2 rounded-xl text-xs border border-pink-500/30 whitespace-nowrap transition-all"
            >
              {isReflecting ? 'Synthesizing...' : 'Reflect'}
            </button>
          </div>

          {reflectionResult && (
            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-pink-900/30 text-xs text-slate-200 leading-relaxed italic">
              <strong className="text-pink-400 not-italic block mb-1 text-[11px] font-mono">
                Synthesized Agent Reflection:
              </strong>
              "{reflectionResult}"
            </div>
          )}
        </div>
      </div>

      {/* Memory Query & Inspection Grid */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              Recalled Memory Units ({memories.length})
            </h2>
            <p className="text-xs text-slate-400">
              Semantic, graph, and keyword memories currently indexed for {brand?.name}.
            </p>
          </div>

          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Recall query..."
                className="bg-slate-950 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:ring-1 focus:ring-sky-500 outline-none w-48 sm:w-64"
              />
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>Recall</span>
            </button>
          </form>
        </div>

        {memories.length === 0 ? (
          <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-8 text-center text-xs text-slate-500">
            No memories found matching this query.
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
