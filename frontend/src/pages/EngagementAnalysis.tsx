import React, { useState, useEffect } from 'react';
import { 
  BarChart3, RefreshCw, TrendingUp, AlertTriangle, 
  CheckCircle2, HelpCircle, MessageSquare, Layers, Quote,
  Search, ThumbsUp, ThumbsDown, Lightbulb, Activity, ArrowRight
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
      setErrorMessage(err.response?.data?.detail || err.message || 'Failed to fetch performance insights');
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
      {/* 1. Header Studio Hero */}
      <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                <BarChart3 className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono font-semibold text-neutral-400 uppercase tracking-wider">
                PERFORMANCE INSIGHTS
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Channel Analysis
            </h1>
            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
              SocialPulse analyzed your recent videos, public engagement metrics, and available audience feedback for <strong className="text-white">{brand?.name}</strong> to identify recurring patterns.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => fetchAnalysis(focusQuery)}
              disabled={isLoading}
              className="flex items-center gap-2 bg-white hover:bg-neutral-200 text-black px-5 py-3 rounded-xl text-xs sm:text-sm font-extrabold transition-all disabled:opacity-50 active:scale-95 whitespace-nowrap shadow-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Analyzing Channel...' : 'Refresh Intelligence'}</span>
            </button>
          </div>
        </div>

        {/* Search Query Filter */}
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3 bg-[#080808] p-3 rounded-2xl border border-[#202020]">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={focusQuery}
              onChange={(e) => setFocusQuery(e.target.value)}
              placeholder={`Focus analysis on specific video topics for ${brand?.name} (e.g., thermal tests, comparisons, camera benchmarks)...`}
              className="w-full bg-[#121212] border border-[#252525] rounded-xl pl-9 pr-4 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-neutral-500 outline-none font-mono"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap border border-neutral-700 transition-all"
          >
            Apply Focus
          </button>
        </form>

        {errorMessage && (
          <div className="mt-4 p-3.5 bg-neutral-900 border border-neutral-700 rounded-xl flex items-center gap-2.5 text-xs text-neutral-300 font-mono">
            <AlertTriangle className="w-4 h-4 text-neutral-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center min-h-[350px] gap-3">
          <div className="animate-spin rounded-full h-7 w-7 border-b-2 border-neutral-300"></div>
          <p className="text-xs text-neutral-400 font-mono">Synthesizing channel analysis and viewer feedback...</p>
        </div>
      ) : analysis ? (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* 1. Executive Summary Panel */}
          <div className="bg-[#101010] border border-[#252525] rounded-3xl p-6 sm:p-8">
            <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-neutral-400 mb-3">
              Executive Summary
            </h2>
            <p className="text-base sm:text-lg text-white leading-relaxed font-medium">
              "{analysis.executive_summary}"
            </p>
          </div>

          {/* 2. Content Recommendations Section */}
          {analysis.recommendations && analysis.recommendations.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Content Recommendations</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {analysis.recommendations.map((rec, rIdx) => (
                  <div key={rIdx} className="bg-[#101010] border border-[#252525] rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                    <div className="space-y-2">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 border border-neutral-800 text-neutral-300 uppercase font-semibold">
                        {rec.category}
                      </span>
                      <h3 className="text-sm font-bold text-white leading-snug">{rec.title}</h3>
                      <p className="text-xs text-neutral-300 leading-relaxed bg-[#080808] p-3 rounded-xl border border-[#202020]">
                        {rec.recommendation}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#202020] space-y-1 text-xs">
                      <div>
                        <strong className="text-neutral-400 font-mono text-[10px] uppercase block">Why:</strong>
                        <span className="text-neutral-300">{rec.why}</span>
                      </div>
                      <div>
                        <strong className="text-neutral-400 font-mono text-[10px] uppercase block">Evidence:</strong>
                        <span className="text-neutral-400 italic">{rec.evidence}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 3. Detected Audience Patterns */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                <TrendingUp className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Detected Audience Patterns</h2>
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
                          {isPos ? 'HIGH PERFORMANCE PATTERN' : 'AUDIENCE CONSTRAINT'}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white mb-2 leading-snug">{pat.title}</h3>
                      <p className="text-xs text-neutral-300 mb-4 leading-relaxed bg-[#080808] p-3 rounded-xl border border-[#202020]">
                        {pat.observation}
                      </p>

                      {pat.evidence_points && pat.evidence_points.length > 0 && (
                        <div className="mb-4 space-y-1.5">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                            Evidence & Metrics:
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

                    <div className="pt-3 border-t border-[#202020] bg-[#0A0A0A] -mx-6 -mb-6 p-4 rounded-b-2xl border-b border-[#252525]">
                      <div className="text-xs text-neutral-200">
                        <strong className="text-white font-bold uppercase tracking-wider text-[10px] block mb-0.5">
                          KEY TAKEAWAY:
                        </strong>
                        <p className="text-neutral-300 text-xs leading-relaxed">{pat.learned_insight}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 4. Format Performance Comparison */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                <Layers className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Format Performance Matrix</h2>
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
                  <div key={fIdx} className="bg-[#101010] border border-[#252525] rounded-2xl p-5 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-bold text-white">{fmt.format_name}</span>
                        <span className={`text-[10px] px-2 py-0.5 rounded font-mono uppercase ${badgeColor}`}>
                          {fmt.performance_rating}
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 5. Recurring Audience Questions */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-800 text-white">
                <HelpCircle className="w-4 h-4" />
              </div>
              <h2 className="text-xl font-bold text-white tracking-tight">Recurring Viewer Questions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {analysis.recurring_questions.map((theme, tIdx) => (
                <div key={tIdx} className="bg-[#101010] border border-[#252525] rounded-2xl p-6 space-y-4">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="text-base font-bold text-white">{theme.theme}</h3>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800 uppercase font-semibold">
                      {theme.frequency}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-300 leading-relaxed bg-[#080808] p-3 rounded-xl border border-[#202020]">
                    {theme.audience_pain_point}
                  </p>

                  {theme.sample_quotes && theme.sample_quotes.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                        Viewer Comments:
                      </span>
                      {theme.sample_quotes.map((quote, qIdx) => (
                        <div key={qIdx} className="text-xs text-neutral-300 italic font-mono bg-[#080808] px-3 py-2 rounded-r-xl border-l-2 border-neutral-400">
                          "{quote}"
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default EngagementAnalysis;
