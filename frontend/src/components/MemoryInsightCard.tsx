import React from 'react';
import { Brain, Sparkles, Tag, ShieldCheck } from 'lucide-react';
import { RecalledMemoryItem } from '../types';

interface MemoryInsightCardProps {
  memory: RecalledMemoryItem;
  index: number;
}

export const MemoryInsightCard: React.FC<MemoryInsightCardProps> = ({ memory, index }) => {
  return (
    <div className="bg-slate-900/60 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-lg bg-pink-500/10 border border-pink-500/30 flex items-center justify-center">
              <Brain className="w-3.5 h-3.5 text-pink-400" />
            </div>
            <span className="text-[11px] font-mono text-slate-400">Memory Unit #{index + 1}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-sky-300 border border-slate-700">
            {memory.type || 'persistent_fact'}
          </span>
        </div>

        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950/70 p-3 rounded-xl border border-slate-800/70 mb-3">
          {memory.text}
        </p>
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-2 border-t border-slate-800/60">
        <span className="flex items-center gap-1 text-emerald-400">
          <ShieldCheck className="w-3 h-3" />
          Retained in Hindsight Bank
        </span>
        {memory.context && (
          <span className="truncate max-w-[200px] text-slate-400" title={memory.context}>
            {memory.context}
          </span>
        )}
      </div>
    </div>
  );
};
