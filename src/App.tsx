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

function App() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*');

      if (error) {
        console.error('Error fetching orders:', error);
      } else {
        setOrders(data || []);
      }
    } catch (err) {
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

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
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders Dashboard</h1>

        <KPIBar orders={orders} />

        <div className="border-b border-gray-200 pb-6 mb-6">
          <h2 className="text-xs uppercase text-gray-500 mb-4 font-semibold">Analytics</h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            <StatusBarChart orders={orders} />
            <SourceDonutChart orders={orders} />
          </div>
          <DailyTrendChart orders={orders} />
        </div>

        <FulfillmentTypeChart orders={orders} />

        <StatusBreakdownTable orders={orders} />

        <AgentPerformanceTable orders={orders} />
      </div>
    </div>
  );
}

export default App;
