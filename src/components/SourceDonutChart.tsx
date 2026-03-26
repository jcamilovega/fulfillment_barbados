import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Order } from '../types/orders';

interface SourceDonutChartProps {
  orders: Order[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export function SourceDonutChart({ orders }: SourceDonutChartProps) {
  const sourceCounts = orders.reduce((acc, order) => {
    const source = order.source || 'Unknown';
    acc[source] = (acc[source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const total = orders.length;
  const chartData = Object.entries(sourceCounts)
    .map(([source, count]) => ({
      name: source,
      value: count,
      percentage: ((count / total) * 100).toFixed(1),
    }))
    .sort((a, b) => b.value - a.value);

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-xs uppercase text-gray-500 mb-4 font-semibold">Source Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percentage }) => `${name}: ${percentage}%`}
          >
            {chartData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
