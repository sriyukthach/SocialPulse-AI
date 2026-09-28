import React from 'react';
import { Sparkles, Bookmark } from 'lucide-react';
import { RecalledMemoryItem } from '../types';

interface MemoryInsightCardProps {
  memory: RecalledMemoryItem;
  index: number;
}

export const MemoryInsightCard: React.FC<MemoryInsightCardProps> = ({ memory, index }) => {
  return (
    <div className="bg-[#101010] border border-[#252525] hover:border-[#333333] rounded-2xl p-5 transition-all duration-200 flex flex-col justify-between shadow-sm">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-neutral-900 border border-neutral-800 flex items-center justify-center shrink-0">
              <Bookmark className="w-3.5 h-3.5 text-neutral-300" />
            </div>
            <span className="text-xs font-mono text-neutral-400">Insight #{index + 1}</span>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-neutral-900 text-neutral-300 border border-neutral-800">
            Saved Insight
          </span>
        </div>

        <p className="text-xs text-neutral-200 leading-relaxed bg-[#080808] p-3.5 rounded-xl border border-[#202020] mb-3 font-sans">
          "{memory.text}"
        </p>
      </div>

      <div className="flex items-center justify-between text-[11px] text-neutral-400 font-sans pt-2.5 border-t border-[#202020]">
        <span className="flex items-center gap-1.5 text-neutral-300 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-neutral-400" />
          Channel Memory
        </span>
        {memory.context && (
          <span className="truncate max-w-[150px] text-neutral-500 font-mono text-[10px]" title={memory.context}>
            {memory.context}
          </span>
        )}
      </div>
    </div>
  );
};

export default MemoryInsightCard;
