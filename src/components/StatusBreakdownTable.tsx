import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { Order } from '../types/orders';

interface StatusBreakdownTableProps {
  orders: Order[];
}

export function StatusBreakdownTable({ orders }: StatusBreakdownTableProps) {
  const [expandedStatus, setExpandedStatus] = useState<string | null>(null);

  const statusData = orders.reduce((acc, order) => {
    const status = order.status || 'Unknown';
    const substatus = order.substatus || 'No substatus';

    if (!acc[status]) {
      acc[status] = { count: 0, substatuses: {} };
    }
    acc[status].count++;
    acc[status].substatuses[substatus] = (acc[status].substatuses[substatus] || 0) + 1;
    return acc;
  }, {} as Record<string, { count: number; substatuses: Record<string, number> }>);

  const total = orders.length;
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
      <h2 className="text-xs uppercase text-gray-500 mb-4 font-semibold">Status Breakdown</h2>
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
                <tr key={row.status} className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setExpandedStatus(expandedStatus === row.status ? null : row.status)}
                      className="flex items-center gap-2 text-sm font-medium text-gray-900 hover:text-blue-600"
                    >
                      {expandedStatus === row.status ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
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
                    <td colSpan={4} className="px-4 py-3 bg-gray-100">
                      <div className="ml-8">
                        <h4 className="text-xs font-semibold text-gray-700 mb-2">All Substatuses:</h4>
                        <div className="grid grid-cols-3 gap-2">
                          {row.substatuses.map(sub => (
                            <div key={sub.substatus} className="text-sm text-gray-600">
                              {sub.substatus}: <span className="font-semibold">{sub.count}</span>
                            </div>
                          ))}
                        </div>
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
