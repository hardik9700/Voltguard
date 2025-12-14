import React from 'react';
import { Vehicle } from '../types';
import { Battery, AlertTriangle, Zap, MapPin } from 'lucide-react';

interface FleetTableProps {
  vehicles: Vehicle[];
  onSelect: (id: string) => void;
  selectedId: string | null;
}

const FleetTable: React.FC<FleetTableProps> = ({ vehicles, onSelect, selectedId }) => {
  return (
    <div className="overflow-x-auto bg-white border border-ink-200 rounded-xl shadow-sm">
      <table className="w-full text-left text-sm text-ink-500">
        <thead className="bg-ink-50 text-xs uppercase font-semibold text-ink-500 border-b border-ink-200">
          <tr>
            <th className="px-6 py-4">Vehicle</th>
            <th className="px-6 py-4">Status</th>
            <th className="px-6 py-4 text-right">SoC (%)</th>
            <th className="px-6 py-4 text-right">Confidence (%)</th>
            <th className="px-6 py-4 text-right">Temp (°C)</th>
            <th className="px-6 py-4">Location</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-ink-100">
          {vehicles.map((v) => (
            <tr 
              key={v.id} 
              onClick={() => onSelect(v.id)}
              className={`hover:bg-ink-50 cursor-pointer transition-colors ${selectedId === v.id ? 'bg-ink-100' : ''}`}
            >
              <td className="px-6 py-4 font-medium text-ink-900 flex items-center gap-3">
                <div className={`p-2 rounded-lg ${selectedId === v.id ? 'bg-ink-900 text-white' : 'bg-ink-100 text-ink-500'}`}>
                  <Zap size={16} />
                </div>
                <div>
                  <div className="text-ink-900 font-semibold">{v.name}</div>
                  <div className="text-xs text-ink-500">{v.model}</div>
                </div>
              </td>
              <td className="px-6 py-4">
                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${
                  v.status === 'active' ? 'bg-emerald-50 text-emerald-600 border-emerald-200' :
                  v.status === 'charging' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                  v.status === 'warning' ? 'bg-orange-50 text-orange-600 border-orange-200' :
                  'bg-ink-100 text-ink-500 border-ink-200'
                }`}>
                  {v.status === 'warning' && <AlertTriangle size={12} />}
                  {v.status === 'charging' && <Battery size={12} />}
                  {v.status.charAt(0).toUpperCase() + v.status.slice(1)}
                </span>
              </td>
              <td className="px-6 py-4 text-right font-mono text-ink-900">
                {v.stats.soc.toFixed(3)}
              </td>
              <td className="px-6 py-4 text-right font-mono text-ink-900 font-medium">
                {v.stats.confidenceScore.toFixed(3)}
              </td>
              <td className="px-6 py-4 text-right font-mono">
                <span className={v.stats.temp > 40 ? 'text-risk font-medium' : 'text-ink-600'}>
                  {v.stats.temp.toFixed(3)}
                </span>
              </td>
              <td className="px-6 py-4 truncate max-w-[150px]">
                <div className="flex items-center gap-1 text-ink-500">
                    <MapPin size={12}/> {v.location.address}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default FleetTable;