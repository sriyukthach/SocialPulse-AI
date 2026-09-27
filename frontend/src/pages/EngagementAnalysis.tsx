import React, { useState, useEffect } from 'react';
import { 
  BarChart3, Brain, Sparkles, RefreshCw, TrendingUp, AlertTriangle, 
  CheckCircle2, HelpCircle, MessageSquare, Layers, ShieldCheck, Quote,
  ArrowRight, Search, ThumbsUp, ThumbsDown, Zap
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
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Intelligence Studio Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-sky-950/40 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-semibold text-sky-400 uppercase tracking-wider">
                Memory-Powered Engagement Intelligence
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Agent Engagement Analysis
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Synthesizing historical post metrics, audience comments, and community sentiment retained in <strong className="text-white">{brand?.name}</strong>'s Hindsight memory bank (<span className="text-sky-300 font-mono">"{brand?.slug}"</span>).
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchAnalysis(focusQuery)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-400 hover:to-sky-500 text-slate-950 px-5 py-3 rounded-xl text-xs font-bold transition-all shadow-lg shadow-sky-500/20 disabled:opacity-50 active:scale-95 whitespace-nowrap"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Recalling & Analyzing...' : 'Refresh Intelligence'}</span>
            </button>
          </div>
        </div>

        {/* Custom Focus Query Filter */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-slate-950/70 p-3 rounded-2xl border border-slate-800">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={focusQuery}
              onChange={(e) => setFocusQuery(e.target.value)}
              placeholder={`Focus agent analysis on specific topics for ${brand?.name} (e.g. cleansers, sizing, promo feedback)...`}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-4 py-2 text-xs text-slate-100 placeholder-slate-500 focus:ring-1 focus:ring-sky-500 outline-none"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap"
          >
            Apply Focus Query
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3 bg-red-950/40 border border-red-800/60 rounded-xl flex items-center gap-2 text-xs text-red-300">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-sky-400"></div>
          <p className="text-xs text-slate-400 font-mono">Recalling Hindsight memories and evaluating engagement patterns...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-8 animate-in fade-in duration-500">
          {/* Executive Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950/20 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
                <Brain className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-pink-400">
                Agent Executive Learning Summary
              </h3>
            </div>
            <p className="text-sm sm:text-base text-slate-100 leading-relaxed font-medium">
              "{analysis.executive_summary}"
            </p>
            <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400 font-mono">
              <span className="flex items-center gap-1.5 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                Hindsight Memory Bank: <strong className="text-sky-300">"{analysis.memory_bank_id}"</strong>
              </span>
              <span>
                Engine: <strong className="text-slate-300">{analysis.model_used}</strong>
              </span>
            </div>
          </div>

          {/* Section 1: Audience Engagement Patterns */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Audience Engagement Patterns
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analysis.engagement_patterns.map((pat, idx) => {
                const isPos = pat.pattern_type === 'positive';
                return (
                  <div
                    key={idx}
                    className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-6 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span
                          className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border font-mono flex items-center gap-1.5 ${
                            isPos
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                          }`}
                        >
                          {isPos ? <ThumbsUp className="w-3 h-3" /> : <ThumbsDown className="w-3 h-3" />}
                          {isPos ? 'High Performance Pattern' : 'Fatigue / Low Performance Pattern'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 leading-snug">{pat.title}</h3>
                      <p className="text-xs text-slate-300 mb-4 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                        {pat.observation}
                      </p>

                      {/* Evidence points */}
                      {pat.evidence_points && pat.evidence_points.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                            Historical Data & Metric Evidence:
                          </span>
                          <ul className="space-y-1">
                            {pat.evidence_points.map((ev, eIdx) => (
                              <li key={eIdx} className="text-xs text-slate-300 flex items-start gap-2">
                                <span className="text-sky-400 font-bold">•</span>
                                <span>{ev}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>

                    {/* Learned Insight Footer */}
                    <div className="pt-3 border-t border-slate-800/80 bg-sky-950/10 -mx-6 -mb-6 p-4 rounded-b-2xl">
                      <div className="flex items-start gap-2 text-xs">
                        <Zap className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                        <p className="text-slate-300 text-[11px] leading-relaxed">
                          <strong className="text-sky-300 font-bold">What the Agent Learned: </strong>
                          {pat.learned_insight}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Section 2: Content Format Efficacy Matrix */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-purple-500/10 text-purple-400">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Content Format Efficacy Matrix
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {analysis.format_performance.map((fmt, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-slate-900/70 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-bold text-white">{fmt.format_name}</span>
                      <span
                        className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border font-mono ${
                          fmt.performance_rating === 'High'
                            ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                            : fmt.performance_rating === 'Moderate'
                            ? 'bg-sky-500/10 text-sky-400 border-sky-500/30'
                            : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {fmt.performance_rating} Efficacy
                      </span>
                    </div>

                    <div className="mb-4 bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mb-0.5">
                        Average Engagement Rate Index
                      </div>
                      <div className="text-xl font-extrabold text-white font-mono">
                        {fmt.avg_engagement_rate}%
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-4 italic bg-slate-950/40 p-2.5 rounded-lg">
                      "{fmt.audience_reaction_summary}"
                    </p>

                    <div className="space-y-2 mb-3 text-xs">
                      <div>
                        <strong className="text-[10px] uppercase tracking-wider text-emerald-400 block mb-1">
                          Key Strengths:
                        </strong>
                        <ul className="space-y-0.5 text-slate-300 text-[11px]">
                          {fmt.strengths.map((s, sIdx) => (
                            <li key={sIdx} className="flex items-center gap-1.5">
                              <span className="text-emerald-400">✓</span> {s}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {fmt.weaknesses && fmt.weaknesses.length > 0 && (
                        <div>
                          <strong className="text-[10px] uppercase tracking-wider text-amber-400 block mb-1">
                            Audience Constraints:
                          </strong>
                          <ul className="space-y-0.5 text-slate-400 text-[11px]">
                            {fmt.weaknesses.map((w, wIdx) => (
                              <li key={wIdx} className="flex items-center gap-1.5">
                                <span className="text-amber-400">⚠</span> {w}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Recurring Audience Questions & Feedback Themes */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                Recurring Community Questions & Feedback Themes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analysis.recurring_questions.map((theme, tIdx) => (
                <div
                  key={tIdx}
                  className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-lg"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white">{theme.theme}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pink-500/10 text-pink-400 border border-pink-500/30 uppercase font-semibold">
                      {theme.frequency}
                    </span>
                  </div>

                  <div className="bg-slate-950/70 p-3 rounded-xl border border-slate-800/80">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                      Identified Audience Pain Point:
                    </span>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {theme.audience_pain_point}
                    </p>
                  </div>

                  {/* Sample Quotes */}
                  {theme.sample_quotes && theme.sample_quotes.length > 0 && (
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                        Sample Community Comments / Queries:
                      </span>
                      <div className="space-y-1.5">
                        {theme.sample_quotes.map((quote, qIdx) => (
                          <div
                            key={qIdx}
                            className="text-xs text-slate-300 italic font-mono bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800/60"
                          >
                            "{quote}"
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Hindsight Memory Citation */}
                  <div className="pt-2 border-t border-slate-800/80 text-[11px] text-pink-300 font-mono flex items-start gap-2">
                    <Quote className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
                    <span>{theme.hindsight_memory_citation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Sentiment Evolution & Comparative Insights */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sentiment Evolution */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Audience Sentiment Dynamics</h3>
              </div>

              <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Overall Sentiment Classification:
                </div>
                <div className="text-sm font-bold text-emerald-400 mb-2">
                  {analysis.sentiment_evolution.overall_sentiment}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {analysis.sentiment_evolution.sentiment_shift_summary}
                </p>
              </div>

              {analysis.sentiment_evolution.key_drivers && (
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-2">
                    Key Drivers of Community Trust:
                  </span>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {analysis.sentiment_evolution.key_drivers.map((kd, kdIdx) => (
                      <li key={kdIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>{kd}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Comparative Post Analysis */}
            <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400">
                  <Sparkles className="w-4 h-4" />
                </div>
                <h3 className="text-base font-bold text-white">Comparative Post Performance</h3>
              </div>

              {analysis.comparative_insights.map((comp, cIdx) => (
                <div key={cIdx} className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 space-y-2">
                  <h4 className="text-xs font-bold text-sky-300 uppercase tracking-wider">
                    {comp.comparison_title}
                  </h4>
                  <p className="text-xs text-slate-200 leading-relaxed font-mono bg-slate-900/60 p-2.5 rounded-lg">
                    {comp.metrics_comparison}
                  </p>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {comp.analysis}
                  </p>
                  <div className="pt-2 border-t border-slate-800/60 text-[11px] text-emerald-300 font-medium">
                    🎯 <strong>Agent Conclusion:</strong> {comp.agent_takeaway}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 5: Recalled Hindsight Memories Drawer */}
          {analysis.recalled_memories.length > 0 && (
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 rounded-lg bg-pink-500/10 border border-pink-500/20 text-pink-400">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Recalled Hindsight Memories Supporting This Analysis ({analysis.recalled_memories.length})
                  </h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded-md flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified Hindsight Recall
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {analysis.recalled_memories.slice(0, 9).map((mem, mIdx) => (
                  <div
                    key={mIdx}
                    className="bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 text-[11px] text-slate-300 leading-relaxed font-mono"
                  >
                    <Quote className="w-3 h-3 text-sky-400 mb-1" />
                    {mem.text}
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
