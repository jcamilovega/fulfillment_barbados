import { Order } from '../types/orders';

interface AgentPerformanceTableProps {
  orders: Order[];
}

export function AgentPerformanceTable({ orders }: AgentPerformanceTableProps) {
  const agentData = orders.reduce((acc, order) => {
    const agent = (order as any).assignedTo || order.agent || 'Unassigned';
    const status = order.status || 'Unknown';

    if (!acc[agent]) {
      acc[agent] = { total: 0, completed: 0, cancelled: 0, bbPending: 0, bbInProgress: 0, other: 0 };
    }

    acc[agent].total++;
    if (status === 'Completed') acc[agent].completed++;
    else if (status === 'Cancelled') acc[agent].cancelled++;
    else if (status === 'BB-Pending' || status === 'Pending') acc[agent].bbPending++;
    else if (status === 'BB-In Progress' || status === 'In Progress') acc[agent].bbInProgress++;
    else acc[agent].other++;

    return acc;
  }, {} as Record<string, { total: number; completed: number; cancelled: number; bbPending: number; bbInProgress: number; other: number }>);

  const agentRows = Object.entries(agentData)
    .map(([agent, data]) => ({
      agent,
      ...data,
      completionRate: data.total > 0 ? ((data.completed / data.total) * 100).toFixed(1) : '0.0',
    }))
    .sort((a, b) => b.total - a.total);

  const getCompletionColor = (rate: string) => {
    const r = parseFloat(rate);
    if (r >= 50) return 'text-green-700 bg-green-50';
    if (r >= 25) return 'text-yellow-700 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  return (
    <div className="pb-6">
      <h2 className="text-xs uppercase text-gray-500 mb-4 font-semibold">Performance por agente</h2>
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Agent</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Total Assigned</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Completed</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Cancelled</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">BB-Pending</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">BB-In Progress</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Other</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-gray-700">Completion Rate</th>
            </tr>
          </thead>
          <tbody>
            {agentRows.map((row, idx) => (
              <tr
                key={row.agent}
                className={`border-t border-gray-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.agent}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.total}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.completed}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.cancelled}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.bbPending}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.bbInProgress}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{row.other}</td>
                <td className="px-4 py-3">
                  <span className={`inline-block px-2 py-1 rounded text-sm font-semibold ${getCompletionColor(row.completionRate)}`}>
                    {row.completionRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}