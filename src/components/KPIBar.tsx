import { useEffect, useState } from 'react';
import { Order } from '../types/orders';
import { supabase } from '../lib/supabase';

interface KPIBarProps {
  orders: Order[];
}

export function KPIBar({ orders }: KPIBarProps) {
  const [avgFulfillmentTime, setAvgFulfillmentTime] = useState<string>('0.0');

  useEffect(() => {
    calculateAvgFulfillmentTime();
  }, [orders]);

  const calculateAvgFulfillmentTime = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('createdAt, lastUpdatedAt')
        .eq('status', 'Completed');

      if (error) {
        console.error('Error fetching fulfillment data:', error);
        return;
      }

      if (!data || data.length === 0) {
        setAvgFulfillmentTime('0.0');
        return;
      }

      let totalDays = 0;
      let count = 0;

      data.forEach((order: any) => {
        try {
          const created = new Date(order.createdAt);
          const updated = new Date(order.lastUpdatedAt);
          const diffMs = updated.getTime() - created.getTime();
          const diffDays = diffMs / (1000 * 60 * 60 * 24);
          totalDays += diffDays;
          count++;
        } catch (e) {
          console.error('Error parsing dates:', e);
        }
      });

      const avg = count > 0 ? (totalDays / count).toFixed(1) : '0.0';
      setAvgFulfillmentTime(avg);
    } catch (err) {
      console.error('Error calculating fulfillment time:', err);
    }
  };

  const total = orders.length;
  const completed = orders.filter(o => o.status === 'Completed').length;
  const cancelled = orders.filter(o => o.status === 'Cancelled').length;
  const bbPending = orders.filter(o => o.status === 'BB-Pending').length;
  const bbInProgress = orders.filter(o => o.status === 'BB-In Progress').length;
  const duplicated = orders.filter(o => o.status === 'Duplicated').length;

  const knownStatuses = completed + cancelled + bbPending + bbInProgress + duplicated;
  const other = total - knownStatuses;

  const getPercentage = (count: number) => total > 0 ? ((count / total) * 100).toFixed(1) : '0.0';

  const kpis = [
    { label: 'Total Orders', value: total.toString(), isTotal: true },
    { label: '% Completed', value: `${getPercentage(completed)}%`, isTotal: false },
    { label: '% Cancelled', value: `${getPercentage(cancelled)}%`, isTotal: false },
    { label: '% BB-Pending', value: `${getPercentage(bbPending)}%`, isTotal: false },
    { label: '% BB-In Progress', value: `${getPercentage(bbInProgress)}%`, isTotal: false },
    { label: '% Duplicated', value: `${getPercentage(duplicated)}%`, isTotal: false },
    { label: '% Other', value: `${getPercentage(other)}%`, isTotal: false },
    { label: 'Avg fulfillment time', value: `${avgFulfillmentTime} days`, isTotal: false },
  ];

  return (
    <div className="border-b border-gray-200 pb-6 mb-6">
      <div className="grid grid-cols-8 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="text-xs text-gray-500 mb-2">{kpi.label}</div>
            <div className={`text-2xl font-semibold ${kpi.isTotal ? 'text-blue-600' : 'text-gray-900'}`}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
