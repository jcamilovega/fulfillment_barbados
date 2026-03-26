import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Order } from '../types/orders';

interface StatusBreakdownTableProps {
  orders: Order[];
}

export function StatusBreakdownTable({ orders }: StatusBreakdownTableProps) {
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<string>('All');

  const sources = ['All', ...Array.from(new Set(orders.map(o => o.source).filter(Boolean)))];

  const filteredOrders = selectedSource === 'All'
    ? orders
    : orders.filter(o => o.source === selectedSource);

  const statusData = filteredOrders.reduce((acc, order) => {
    const status = order.status || 'Unknown';
    const substatus = order.substatus || 'No substatus';
    if (!acc[status]) acc[status] = { count: 0, substatuses: {} };
    acc[status].count++;
    acc[status].substatuses[substatus] = (acc[status].substatuses[substatus] || 0) + 1;
    return acc;
  }, {} as Record<string, { count: number; substatuses: Record<string, number> }>);

  const total = filteredOrders.length;
  const statusRows = Object.entries(statusData)
    .map(([status, data]) => ({
      status,
      count: data.count,
      percentage: ((data.count / total) * 100).toFixed(1),
      substatuses: Object.entries(data.substatuses)
        .map(([substatus, count]) => ({ substatus, count }))
        .sort((a, b) => b.count - a.count),
    }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xs uppercase text-gray-500 font-semibold">Status Breakdown</h2>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          {sources.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Count</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">% of Total</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Top Substatuses</th>
            </tr>
          </thead>
          <tbody>
            {statusRows.map((row, idx) => (
              <>
                <tr
                  key={row.status}
                  className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setExpandedStatus(expandedStatus === row.status ? null : row.status)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {expandedStatus === row.status
                        ? <ChevronDown className="w-4 h-4" />
                        : <ChevronRight className="w-4 h-4" />}
                      {row.status}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.count}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{row.percentage}%</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2 flex-wrap">
                      {row.substatuses.slice(0, 3).map(sub => (
                        <span
                          key={sub.substatus}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700"
                        >
                          {sub.substatus} ({sub.count})
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
                {expandedStatus === row.status && (
                  <tr key={`${row.status}-expanded`}>
                    <td colSpan={4} className="px-4 py-4 bg-gray-50">
                      <div className="ml-8 space-y-2">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase mb-3">All Substatuses</h4>
                        {row.substatuses.map(sub => {
                          const pct = ((sub.count / row.count) * 100).toFixed(1);
                          return (
                            <div key={sub.substatus} className="flex items-center gap-3">
                              <span className="text-xs text-gray-600 w-56 shrink-0 truncate">{sub.substatus}</span>
                              <div className="flex-1 bg-gray-200 rounded-full h-2">
                                <div
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${pct}%` }}
                                />
                              </div>
                              <span className="text-xs text-gray-500 w-16 text-right shrink-0">
                                {sub.count} ({pct}%)
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    </td>
                  </tr>
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}