import { useEffect, useState } from 'react';
import { supabase } from './lib/supabase';
import { Order } from './types/orders';
import { KPIBar } from './components/KPIBar';
import { DailyTrendChart } from './components/DailyTrendChart';
import { StatusBarChart } from './components/StatusBarChart';
import { SourceDonutChart } from './components/SourceDonutChart';
import { StatusBreakdownTable } from './components/StatusBreakdownTable';
import { AgentPerformanceTable } from './components/AgentPerformanceTable';
import { FulfillmentTypeChart } from './components/FulfillmentTypeChart';
import { CancellationByFulfillmentChart } from './components/CancellationByFulfillmentChart';

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSource, setSelectedSource] = useState<string>('All');
  const [dateFrom, setDateFrom] = useState<string>('');
  const [dateTo, setDateTo] = useState<string>('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase.from('orders').select('*');
      if (error) console.error('Error fetching orders:', error);
      else {
        const sorted = (data || []);
        setOrders(sorted);
        if (sorted.length > 0) {
          const dates = sorted
            .map((o: any) => o.createdAt)
            .filter(Boolean)
            .map((d: string) => new Date(d).toISOString().split('T')[0])
            .sort();
          setDateFrom(dates[0]);
          setDateTo(dates[dates.length - 1]);
        }
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sources = ['All', ...Array.from(new Set(orders.map((o: any) => o.source).filter(Boolean)))];

  const filteredOrders = orders.filter((o: any) => {
    const matchSource = selectedSource === 'All' || o.source === selectedSource;
    const orderDate = o.createdAt ? new Date(o.createdAt).toISOString().split('T')[0] : '';
    const matchFrom = !dateFrom || orderDate >= dateFrom;
    const matchTo = !dateTo || orderDate <= dateTo;
    return matchSource && matchFrom && matchTo;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Orders Dashboard — Barbados</h1>
          <div className="flex items-center gap-3">
            <select
              className="text-sm border border-gray-300 rounded px-3 py-2 bg-white"
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              {sources.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <input
              type="date"
              className="text-sm border border-gray-300 rounded px-3 py-2 bg-white"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
            />
            <span className="text-gray-400 text-sm">→</span>
            <input
              type="date"
              className="text-sm border border-gray-300 rounded px-3 py-2 bg-white"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
            />
            <button
              className="text-sm text-blue-600 hover:underline"
              onClick={() => {
                setSelectedSource('All');
                const dates = orders
                  .map((o: any) => o.createdAt)
                  .filter(Boolean)
                  .map((d: string) => new Date(d).toISOString().split('T')[0])
                  .sort();
                setDateFrom(dates[0] || '');
                setDateTo(dates[dates.length - 1] || '');
              }}
            >
              Reset
            </button>
          </div>
        </div>

        <KPIBar orders={filteredOrders} />

        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xs uppercase text-gray-500 mb-4 font-semibold">Analytics</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatusBarChart orders={filteredOrders} />
            <SourceDonutChart orders={filteredOrders} />
          </div>
          <DailyTrendChart orders={filteredOrders} />
        </div>

        <FulfillmentTypeChart orders={filteredOrders} />

        <CancellationByFulfillmentChart orders={filteredOrders} />

        <StatusBreakdownTable orders={filteredOrders} />

        <AgentPerformanceTable orders={filteredOrders} />
      </div>
    </div>
  );
}

export default App;
