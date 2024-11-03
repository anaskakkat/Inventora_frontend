// frontend/src/components/EarningsGraph.tsx
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const EarningsGraph: React.FC<any> = ({ data }) => {
    const formattedData = data.map((item: { _id: string | number | Date; totalSales: any; }) => ({
        date:item._id,
        amount: item.totalSales, 
      }));

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 h-96">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Earnings Over Time</h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fontSize: 12 }}
            tickFormatter={(value: string | number | Date) => {
              const date = new Date(value);
              return `${date.getMonth() + 1}/${date.getDate()}`;
            }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            tickFormatter={(value: { toLocaleString: () => any; }) => `₹${value.toLocaleString()}`}
          />
          <Tooltip 
            formatter={(value: number) => [`    ${value.toLocaleString()}`, 'Earnings']}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#2563eb" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EarningsGraph;