import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Brain, Sparkles, RefreshCw, TrendingUp, AlertTriangle, 
  CheckCircle2, HelpCircle, MessageSquare, Layers, ShieldCheck, Quote,
  Search, ThumbsUp, ThumbsDown, Zap, Activity, ArrowRight
} from 'lucide-react';
import { Brand, EngagementAnalysisResponse } from '../types';
import { api } from '../api/client';

interface EngagementAnalysisProps {
  brand: Brand | null;
}

export const EngagementAnalysis: React.FC<EngagementAnalysisProps> = ({ brand }) => {
  const [analysis, setAnalysis] = useState<EngagementAnalysisResponse | null>(null);
  const [focusQuery, setFocusQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchAnalysis = async (query?: string) => {
    if (!brand) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const res = await api.getEngagementAnalysis(brand.id, query);
      setAnalysis(res);
    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.response?.data?.detail || err.message || 'Failed to fetch engagement analysis');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (brand) {
      setFocusQuery('');
      fetchAnalysis();
    }
  }, [brand?.id]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchAnalysis(focusQuery);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 1. Header Studio Hero — Editorial Monochrome */}
      <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-mono font-semibold text-neutral-400 uppercase tracking-[0.15em]">
                MEMORY-POWERED CHANNEL INTELLIGENCE
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              YouTube Engagement Intelligence
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Synthesizing historical public video metrics, viewer comments, and community sentiment retained in <strong className="text-white">{brand?.name}</strong>'s Hindsight memory bank (<span className="text-neutral-300 font-mono">"{brand?.slug}"</span>).
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => fetchAnalysis(focusQuery)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-[#F5F5F5] hover:bg-white text-[#080808] px-5 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all disabled:opacity-50 active:scale-95 whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Recalling & Analyzing...' : 'Refresh Intelligence'}</span>
            </button>
          </div>
        </div>

        {/* Process Flow Bar */}
        <div className="hidden sm:flex items-center justify-between bg-[#080808] p-3 rounded-2xl border border-[#202020] text-[10px] font-mono text-neutral-400 mb-4">
          <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <span className="h-5 w-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">1</span>
            Public Video Data
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <span className="h-5 w-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">2</span>
            Hindsight Memory
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="flex items-center gap-1.5 text-neutral-300 font-semibold">
            <span className="h-5 w-5 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px]">3</span>
            Gemini Synthesis
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-neutral-600" />
          <span className="flex items-center gap-1.5 text-white font-semibold">
            <span className="h-5 w-5 rounded-full bg-white text-black flex items-center justify-center text-[10px] font-bold">4</span>
            Learned Intelligence
          </span>
        </div>

        {/* Focus Query Input */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-[#080808] p-3 rounded-2xl border border-[#202020]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={focusQuery}
              onChange={(e) => setFocusQuery(e.target.value)}
              placeholder={`Focus agent analysis on specific topics for ${brand?.name} (e.g., battery tests, thermal benchmarks, camera shootout)...`}
              className="w-full bg-[#121212] border border-[#252525] rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border border-neutral-700 transition-all"
          >
            Apply Focus Query
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 bg-neutral-900 border border-neutral-700 rounded-xl flex items-center gap-2 text-xs text-neutral-300">
            <AlertTriangle className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-neutral-300"></div>
          <p className="text-xs text-neutral-500 font-mono">Recalling Hindsight memories & synthesizing engagement analysis...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* 1. Executive Learning Summary Panel */}
          <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                <Brain className="w-4 h-4" />
              </div>
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-neutral-400">
                1. EXECUTIVE LEARNING SUMMARY
              </h3>
            </div>
            <p className="text-sm sm:text-base text-white leading-relaxed font-medium">
              "{analysis.executive_summary}"
            </p>
            <div className="mt-4 pt-4 border-t border-[#202020] flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400 font-mono">
              <span className="flex items-center gap-1.5 text-neutral-300">
                <ShieldCheck className="w-4 h-4 text-neutral-400 shrink-0" />
                Hindsight Memory Bank: <strong className="text-white font-semibold">"{analysis.memory_bank_id}"</strong>
              </span>
              <span>
                Analysis Engine: <strong className="text-neutral-300">{analysis.model_used}</strong>
              </span>
            </div>
          </div>

          {/* 2. Detected Audience Engagement Patterns */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                2. Detected Audience Engagement Patterns
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analysis.engagement_patterns.map((pat, idx) => {
                const isPos = pat.pattern_type === 'positive';
                return (
                  <div
                    key={idx}
                    className="bg-[#101010] border border-[#252525] rounded-2xl p-6 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[10px] font-bold px-2.5 py-1 rounded-md border font-mono flex items-center gap-1.5 ${
                            isPos
                              ? 'bg-white/10 text-white border-white/20'
                              : 'bg-neutral-900 text-neutral-400 border-neutral-800'
                          }`}
                        >
                          {isPos ? <ThumbsUp className="w-3.5 h-3.5" /> : <ThumbsDown className="w-3.5 h-3.5" />}
                          {isPos ? 'HIGH PERFORMANCE PATTERN' : 'AUDIENCE CONSTRAINT / LOW PERFORMANCE'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 leading-snug">{pat.title}</h3>
                      <p className="text-xs text-neutral-300 mb-4 leading-relaxed bg-[#080808] p-3 rounded-xl border border-[#202020]">
                        {pat.observation}
                      </p>

                      {/* Evidence points */}
                      {pat.evidence_points && pat.evidence_points.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 block">
                            Historical Metrics & Evidence:
                          </span>
                          <ul className="space-y-1">
                            {pat.evidence_points.map((ev, eIdx) => (
                              <li key={eIdx} className="text-xs text-neutral-300 flex items-start gap-2">
                                <span className="text-neutral-500 font-bold">•</span>
                                <span>{ev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Visually Distinct "WHAT THE AGENT LEARNED" Callout */}
                    <div className="pt-3 border-t border-[#202020] bg-[#0A0A0A] -mx-6 -mb-6 p-4 rounded-b-2xl border-b border-[#252525]">
                      <div className="flex items-start gap-2 text-xs">
                        <Zap className="w-4 h-4 text-white shrink-0 mt-0.5" />
                        <p className="text-neutral-200 text-[11px] leading-relaxed">
                          <strong className="text-white font-bold uppercase tracking-[0.1em]">WHAT THE AGENT LEARNED: </strong>
                          {pat.learned_insight}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 3. Content Format Efficacy Matrix */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                3. Content Format Efficacy Matrix
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analysis.format_performance.map((fmt, fIdx) => {
                const isHigh = fmt.performance_rating === 'High';
                const isMod = fmt.performance_rating === 'Moderate';
                const badgeColor = isHigh
                  ? 'bg-white text-black font-bold border border-white'
                  : isMod
                  ? 'bg-neutral-800 text-neutral-200 border border-neutral-700'
                  : 'bg-neutral-900 text-neutral-400 border border-neutral-800';

                return (
                  <div
                    key={fIdx}
                    className="bg-[#101010] border border-[#252525] rounded-2xl p-5 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-white">{fmt.format_name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${badgeColor}`}>
                          {fmt.performance_rating} Efficacy
                        </span>
                      </div>

                      <div className="mb-4 bg-[#080808] p-3 rounded-xl border border-[#202020]">
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                            Avg Engagement Index
                          </span>
                          <span className="text-xs font-bold text-white font-mono">
                            {fmt.avg_engagement_rate}%
                          </span>
                        </div>
                        {/* Visual Efficacy Meter: Subtle Monochrome Tones */}
                        <div className="w-full bg-neutral-900 h-1.5 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              isHigh ? 'bg-white' : isMod ? 'bg-neutral-400' : 'bg-neutral-600'
                            }`}
                            style={{ width: `${Math.min(fmt.avg_engagement_rate * 5, 100)}%` }}
                          ></div>
                        </div>
                      </div>

                      <p className="text-xs text-neutral-300 leading-relaxed mb-4 italic bg-[#0A0A0A] p-2.5 rounded-lg border border-[#202020]">
                        "{fmt.audience_reaction_summary}"
                      </p>

                      <div className="space-y-2 mb-3 text-xs">
                        <div>
                          <strong className="text-[10px] uppercase tracking-wider text-neutral-300 block mb-1">
                            Key Strengths:
                          </strong>
                          <ul className="space-y-0.5 text-neutral-400 text-[11px]">
                            {fmt.strengths.map((s, sIdx) => (
                              <li key={sIdx} className="flex items-center gap-1.5">
                                <span className="text-white font-bold">✓</span> {s}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {fmt.weaknesses && fmt.weaknesses.length > 0 && (
                          <div>
                            <strong className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                              Audience Constraints:
                            </strong>
                            <ul className="space-y-0.5 text-neutral-500 text-[11px]">
                              {fmt.weaknesses.map((w, wIdx) => (
                                <li key={wIdx} className="flex items-center gap-1.5">
                                  <span className="text-neutral-400 font-bold">⚠</span> {w}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Recurring Community Questions & Feedback Themes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                4. Recurring Audience Questions & Feedback Themes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analysis.recurring_questions.map((theme, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="text-base font-bold text-white">{theme.theme}</h3>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 uppercase font-semibold">
                        {theme.frequency}
                      </span>
                    </div>

                    <div className="bg-[#080808] p-3 rounded-xl border border-[#202020]">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 block mb-1">
                        Identified Audience Pain Point:
                      </span>
                      <p className="text-xs text-neutral-200 leading-relaxed">
                        {theme.audience_pain_point}
                      </p>
                    </div>

                    {/* Sample Community Quotes — Readable Blockquotes */}
                    {theme.sample_quotes && theme.sample_quotes.length > 0 && (
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 block mb-1.5">
                          Sample Community Comments:
                        </span>
                        <div className="space-y-1.5">
                          {theme.sample_quotes.map((quote, qIdx) => (
                            <div
                              key={qIdx}
                              className="text-xs text-neutral-300 italic font-mono bg-[#080808] px-3 py-2 rounded-r-xl border-l-2 border-neutral-400"
                            >
                              "{quote}"
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Hindsight Citation */}
                  <div className="pt-3 border-t border-[#202020] text-[11px] text-neutral-400 font-mono flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-neutral-400 shrink-0 mt-0.5" />
                    <span>{theme.hindsight_memory_citation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5 & 6. Sentiment Dynamics & Comparative Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 5. Sentiment Dynamics */}
            <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">5. Audience Sentiment Dynamics</h3>
              </div>

              <div className="bg-[#080808] p-4 rounded-xl border border-[#202020]">
                <div className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 mb-1">
                  Overall Sentiment Classification:
                </div>
                <div className="text-sm font-bold text-white mb-2">
                  {analysis.sentiment_evolution.overall_sentiment}
                </div>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  {analysis.sentiment_evolution.sentiment_shift_summary}
                </p>
              </div>

              {analysis.sentiment_evolution.key_drivers && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-neutral-400 block mb-2">
                    Key Drivers of Community Trust:
                  </span>
                  <ul className="space-y-1.5 text-xs text-neutral-300">
                    {analysis.sentiment_evolution.key_drivers.map((kd, kdIdx) => (
                      <li key={kdIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{kd}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 6. Comparative Insights */}
            <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                  <Activity className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">6. Comparative Post Performance</h3>
              </div>

              {analysis.comparative_insights.map((comp, cIdx) => (
                <div key={cIdx} className="bg-[#080808] p-4 rounded-xl border border-[#202020] space-y-2">
                  <h4 className="text-xs font-bold text-neutral-200 uppercase tracking-wider">
                    {comp.comparison_title}
                  </h4>
                  <p className="text-xs text-neutral-300 leading-relaxed font-mono bg-[#121212] p-2.5 rounded-lg border border-[#252525]">
                    {comp.metrics_comparison}
                  </p>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    {comp.analysis}
                  </p>
                  <div className="pt-2 border-t border-[#202020] text-[11px] text-neutral-200 font-medium">
                    🎯 <strong>Agent Conclusion:</strong> {comp.agent_takeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7. Recalled Memories Supporting Intelligence */}
          {analysis.recalled_memories.length > 0 && (
            <div className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-300">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    7. Recalled Hindsight Memories Used in Analysis ({analysis.recalled_memories.length})
                  </h3>
                </div>
                <span className="text-[10px] font-mono text-neutral-300 bg-[#080808] border border-[#252525] px-2.5 py-0.5 rounded flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-neutral-400" />
                  Verified Hindsight Recall
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysis.recalled_memories.slice(0, 9).map((mem, mIdx) => (
                  <div
                    key={mIdx}
                    className="bg-[#080808] p-3 rounded-xl border border-[#202020] text-[11px] text-neutral-300 leading-relaxed font-mono"
                  >
                    <Quote className="w-3 h-3 text-neutral-500 mb-1" />
                    "{mem.text}"
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
};
