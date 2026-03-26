import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Order } from '../types/orders';

interface StatusBarChartProps {
  orders: Order[];
}

export function StatusBarChart({ orders }: StatusBarChartProps) {
  const [selectedSource, setSelectedSource] = useState<string>('All');

  const sources = ['All', ...Array.from(new Set(orders.map(o => o.source).filter(Boolean)))];

  const filteredOrders = selectedSource === 'All'
    ? orders
    : orders.filter(o => o.source === selectedSource);

  const statusCounts = filteredOrders.reduce((acc, order) => {
    const status = order.status || 'Unknown';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const chartData = Object.entries(statusCounts)
    .map(([status, count]) => ({ status, count }))
    .sort((a, b) => b.count - a.count);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs uppercase text-gray-500 font-semibold">Status Distribution</h3>
        <select
          className="text-sm border border-gray-300 rounded px-2 py-1"
          value={selectedSource}
          onChange={(e) => setSelectedSource(e.target.value)}
        >
          {sources.map(source => (
            <option key={source} value={source}>{source}</option>
          ))}
        </select>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" tick={{ fontSize: 11 }} />
          <YAxis dataKey="status" type="category" width={100} tick={{ fontSize: 11 }} />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
