import React from 'react';
import { TimelineEvent } from '../types';
import { AlertCircle, CheckCircle2, Circle } from 'lucide-react';

interface BatteryStoryProps {
  events: TimelineEvent[];
}

const BatteryStory: React.FC<BatteryStoryProps> = ({ events }) => {
  return (
    <div className="space-y-8 pl-4 border-l border-ink-200 ml-2 py-2">
      {events.map((event) => (
        <div key={event.id} className="relative pl-6 animate-slide-up">
          {/* Timeline Dot */}
          <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 bg-white flex items-center justify-center
            ${event.type === 'risk' ? 'border-risk text-risk' : 
              event.type === 'improvement' ? 'border-safe text-safe' : 
              'border-ink-300 text-ink-400'}`}
          >
            {event.type === 'risk' && <div className="w-1.5 h-1.5 bg-risk rounded-full" />}
            {event.type === 'improvement' && <div className="w-1.5 h-1.5 bg-safe rounded-full" />}
            {event.type === 'neutral' && <div className="w-1.5 h-1.5 bg-ink-300 rounded-full" />}
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-mono text-ink-400 uppercase tracking-widest">{event.time}</span>
            <p className={`text-lg font-medium leading-tight ${event.type === 'risk' ? 'text-risk' : 'text-ink-900'}`}>
              {event.message}
            </p>
            <p className="text-sm text-ink-500 leading-relaxed max-w-md">
              {event.detail}
            </p>
          </div>
        </div>
      ))}
      
      <div className="relative pl-6 opacity-50">
        <div className="absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 border-dashed border-ink-200 bg-white"></div>
        <span className="text-xs font-mono text-ink-400">YESTERDAY</span>
      </div>
    </div>
  );
};

export default BatteryStory;