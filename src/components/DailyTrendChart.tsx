import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Order } from '../types/orders';

interface DailyTrendChartProps {
  orders: Order[];
}

export function DailyTrendChart({ orders }: DailyTrendChartProps) {
  const dailyData = orders.reduce((acc, order) => {
    const createdDate = new Date(order.createdAt).toISOString().split('T')[0];
    if (!acc[createdDate]) {
      acc[createdDate] = { date: createdDate, Created: 0, Completed: 0 };
    }
    acc[createdDate].Created++;

    if (order.status === 'Completed' && order.lastUpdatedAt) {
      const completedDate = new Date(order.lastUpdatedAt).toISOString().split('T')[0];
      if (!acc[completedDate]) {
        acc[completedDate] = { date: completedDate, Created: 0, Completed: 0 };
      }
      acc[completedDate].Completed++;
    }

    return acc;
  }, {} as Record<string, { date: string; Created: number; Completed: number }>);

  const chartData = Object.values(dailyData)
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h3 className="text-xs uppercase text-gray-500 mb-4 font-semibold">Daily Orders</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip />
          <Legend />
          <Bar dataKey="Created" fill="#3b82f6" />
          <Bar dataKey="Completed" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
