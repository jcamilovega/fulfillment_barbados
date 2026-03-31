import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LabelList } from 'recharts';
import { Order } from '../types/orders';

interface DailyTrendChartProps {
  orders: Order[];
}

export function DailyTrendChart({ orders }: DailyTrendChartProps) {
  const dailyData = orders.reduce((acc, order) => {
    const date = new Date((order as any).createdAt).toISOString().split('T')[0];
    if (!acc[date]) {
      acc[date] = { date, Completed: 0, Cancelled: 0, Pending: 0, Other: 0, total: 0 };
    }
    const s = order.status;
    if (s === 'Completed') acc[date].Completed++;
    else if (s === 'Cancelled') acc[date].Cancelled++;
    else if (s === 'BB-Pending' || s === 'Pending') acc[date].Pending++;
    else acc[date].Other++;
    acc[date].total++;
    return acc;
  }, {} as Record<string, { date: string; Completed: number; Cancelled: number; Pending: number; Other: number; total: number }>);

  const chartData = Object.values(dailyData).sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xs uppercase text-gray-500 font-semibold">Daily Orders</h3>
        <span className="text-xs text-gray-400">{orders.length} orders</span>
      </div>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Completed" stackId="a" fill="#3B6D11" />
          <Bar dataKey="Cancelled" stackId="a" fill="#E24B4A" />
          <Bar dataKey="Pending"   stackId="a" fill="#EF9F27" />
          <Bar dataKey="Other"     stackId="a" fill="#888780">
            <LabelList dataKey="total" position="top" style={{ fontSize: 10, fill: '#6b7280' }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
