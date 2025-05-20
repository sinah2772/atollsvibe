import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { ChartData } from '../../types';

interface PerformanceChartProps {
  data: ChartData[];
  title?: string;
}

const PerformanceChart: React.FC<PerformanceChartProps> = ({ data, title = "Performance Over Time" }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">{title}</h3>
      
      <ResponsiveContainer width="100%" height="85%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <YAxis 
            tick={{ fontSize: 12 }}
            axisLine={{ stroke: '#e0e0e0' }}
            tickLine={{ stroke: '#e0e0e0' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'white', 
              borderRadius: '8px',
              border: '1px solid #e0e0e0',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
            }}
          />
          <Legend wrapperStyle={{ paddingTop: '10px' }} />
          <Line
            type="monotone"
            dataKey="views"
            stroke="#1E40AF"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, stroke: '#1E40AF', strokeWidth: 2, fill: 'white' }}
          />
          <Line
            type="monotone"
            dataKey="likes"
            stroke="#F59E0B"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, stroke: '#F59E0B', strokeWidth: 2, fill: 'white' }}
          />
          <Line
            type="monotone"
            dataKey="comments"
            stroke="#10B981"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 6, stroke: '#10B981', strokeWidth: 2, fill: 'white' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;