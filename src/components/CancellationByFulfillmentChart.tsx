import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Order } from '../types/orders';

interface CancellationByFulfillmentChartProps {
  orders: Order[];
}

const STATUS_COLORS: Record<string, string> = {
  'Completed':      '#3B6D11',
  'Cancelled':      '#E24B4A',
  'BB-Pending':     '#EF9F27',
  'BB-In Progress': '#378ADD',
  'Duplicated':     '#888780',
  'BB-CX query':    '#534AB7',
  'No Status':      '#B4B2A9',
  'Pending':        '#FAC775',
  'In Progress':    '#1D9E75',
  'BB-Collection':  '#D4537E',
  'BB-Delivery':    '#D85A30',
  'BB-Queued':      '#5DCAA5',
};

export function CancellationByFulfillmentChart({ orders }: CancellationByFulfillmentChartProps) {
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  const allStatuses = ['All', ...Array.from(new Set(orders.map(o => o.status).filter(Boolean)))];

  const filteredOrders = selectedStatus === 'All'
    ? orders
    : orders.filter(o => o.status === selectedStatus);

  const statuses = Array.from(new Set(filteredOrders.map(o => o.status || 'Unknown')));

  const grouped = filteredOrders.reduce((acc, order) => {
    const ft = (order as any).fulfillmentType || 'Unknown';
    const st = order.status || 'Unknown';
    if (!acc[ft]) acc[ft] = { fulfillmentType: ft, total: 0 };
    acc[ft][st] = (acc[ft][st] || 0) + 1;
    acc[ft].total++;
    return acc;
  }, {} as Record<string, Record<string, any>>);

  const chartData = Object.values(grouped).sort((a, b) => b.total - a.total);

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs uppercase text-gray-500 font-semibold">Orders by Fulfillment Type & Status</h3>
          <div className="flex items-center gap-3">
            <span className="text-xs text-gray-400">{filteredOrders.length} orders</span>
            <select
              className="text-sm border border-gray-300 rounded px-2 py-1"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              {allStatuses.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={320}>
          <BarChart data={chartData} layout="vertical" margin={{ right: 48 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="fulfillmentType" type="category" width={120} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            {statuses.map((st, i) => (
              <Bar
                key={st}
                dataKey={st}
                stackId="a"
                fill={STATUS_COLORS[st] || '#B4B2A9'}
              >
                {i === statuses.length - 1 && (
                  <LabelList dataKey="total" position="right" style={{ fontSize: 11, fill: '#6b7280' }} />
                )}
              </Bar>
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
