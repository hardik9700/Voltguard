import React from 'react';
import { Circle, ArrowUpRight } from 'lucide-react';

interface ActionListProps {
  actions: string[];
}

const ActionList: React.FC<ActionListProps> = ({ actions }) => {
  return (
    <div className="space-y-4">
      {actions.map((action, idx) => (
        <div key={idx} className="group flex items-start gap-4 p-5 rounded-xl border border-ink-100 bg-white hover:border-ink-300 transition-all cursor-pointer shadow-sm hover:shadow-md">
          <Circle className="text-ink-300 mt-1 flex-shrink-0 group-hover:text-safe transition-colors" size={20} />
          <div className="flex-1">
             <p className="text-ink-900 leading-relaxed font-medium">{action}</p>
             <p className="text-xs text-ink-400 mt-1">Tap to mark as done</p>
          </div>
          <ArrowUpRight size={16} className="text-ink-200 group-hover:text-ink-400 opacity-0 group-hover:opacity-100 transition-all" />
        </div>
      ))}
      {actions.length === 0 && (
         <div className="p-8 text-center text-ink-400 italic border border-dashed border-ink-200 rounded-xl">
           Analyzing latest data for recommendations...
         </div>
      )}
    </div>
  );
};
export default ActionList;