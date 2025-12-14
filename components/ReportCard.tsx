import React from 'react';

interface ReportCardProps {
  grade: string;
  behaviorScore: number;
  riskOutlook: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ grade, behaviorScore, riskOutlook }) => {
  return (
    <div className="w-full max-w-md mx-auto bg-white border border-ink-100 shadow-sm rounded-2xl overflow-hidden animate-fade-in">
      <div className="p-8 text-center border-b border-ink-50">
        <span className="text-xs font-mono text-ink-400 uppercase tracking-widest">Weekly Health Grade</span>
        <div className="mt-4 text-9xl font-light text-ink-900 tracking-tighter">{grade}</div>
      </div>
      
      <div className="grid grid-cols-2 divide-x divide-ink-50">
        <div className="p-6 text-center">
          <div className="text-3xl font-light text-ink-900 mb-1">{behaviorScore}</div>
          <div className="text-xs font-mono text-ink-400 uppercase">Behavior Score</div>
        </div>
        <div className="p-6 text-center">
          <div className={`text-3xl font-light mb-1 ${
            riskOutlook === 'High' ? 'text-risk' : 'text-ink-900'
          }`}>{riskOutlook}</div>
          <div className="text-xs font-mono text-ink-400 uppercase">7-Day Risk</div>
        </div>
      </div>
      
      <div className="bg-ink-50 p-6 text-center">
        <p className="text-sm text-ink-500 italic">
          "Your charging habits are consistent, but thermal exposure is your biggest liability right now."
        </p>
      </div>
    </div>
  );
};

export default ReportCard;