import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order } from '../types/orders';

interface FulfillmentTypeChartProps {
  orders: Order[];
}

const PRODUCT_COLORS: Record<string, string> = {
  'Port In':     '#534AB7',
  'Fixed Only':  '#1D9E75',
  'New Line':    '#378ADD',
  'Pre to Post': '#EF9F27',
  'Mobile':      '#D85A30',
  'Bundle':      '#D4537E',
  'Unknown':     '#888780',
};

export function FulfillmentTypeChart({ orders }: FulfillmentTypeChartProps) {
  const [selectedSource, setSelectedSource] = useState<string>('All');

  const sources = ['All', ...Array.from(new Set(orders.map(o => o.source).filter(Boolean)))];

  const filteredOrders = selectedSource === 'All'
    ? orders
    : orders.filter(o => o.source === selectedSource);

  const productTypes = Array.from(
    new Set(filteredOrders.map(o => (o as any).productType || 'Unknown'))
  );

  const grouped = filteredOrders.reduce((acc, order) => {
    const ft = (order as any).fulfillmentType || 'Unknown';
    const pt = (order as any).productType || 'Unknown';
    if (!acc[ft]) acc[ft] = { fulfillmentType: ft };
    acc[ft][pt] = (acc[ft][pt] || 0) + 1;
    return acc;
  }, {} as Record<string, Record<string, any>>);

  const chartData = Object.values(grouped).sort(
    (a, b) =>
      productTypes.reduce((s, pt) => s + (b[pt] || 0), 0) -
      productTypes.reduce((s, pt) => s + (a[pt] || 0), 0)
  );

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs uppercase text-gray-500 font-semibold">Fulfillment Type Distribution</h3>
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
            <YAxis dataKey="fulfillmentType" type="category" width={120} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            {productTypes.map(pt => (
              <Bar
                key={pt}
                dataKey={pt}
                stackId="a"
                fill={PRODUCT_COLORS[pt] || '#B4B2A9'}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}