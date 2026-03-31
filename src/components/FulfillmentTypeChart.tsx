import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
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
  const productTypes = Array.from(
    new Set(orders.map(o => (o as any).productType || 'Unknown'))
  );

  const grouped = orders.reduce((acc, order) => {
    const ft = (order as any).fulfillmentType || 'Unknown';
    const pt = (order as any).productType || 'Unknown';
    if (!acc[ft]) acc[ft] = { fulfillmentType: ft, total: 0 };
    acc[ft][pt] = (acc[ft][pt] || 0) + 1;
    acc[ft].total++;
    return acc;
  }, {} as Record<string, Record<string, any>>);

  const chartData = Object.values(grouped).sort((a, b) => b.total - a.total);

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs uppercase text-gray-500 font-semibold">Fulfillment Type Distribution</h3>
          <span className="text-xs text-gray-400">{orders.length} orders</span>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} layout="vertical" margin={{ right: 48 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="fulfillmentType" type="category" width={120} tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            {productTypes.map((pt, i) => (
              <Bar
                key={pt}
                dataKey={pt}
                stackId="a"
                fill={PRODUCT_COLORS[pt] || '#B4B2A9'}
              >
                {i === productTypes.length - 1 && (
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
