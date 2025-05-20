import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { articlesByStatus, topCategories } from '../data/mockData';

const Analytics: React.FC = () => {
  const COLORS = ['#1E40AF', '#60A5FA', '#F59E0B', '#10B981', '#EF4444'];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Analytics</h1>
        <p className="text-gray-600 mt-1">Detailed metrics about your content performance</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Articles by Status</h3>
          <ResponsiveContainer width="100%" height="85%">
            <PieChart>
              <Pie
                data={articlesByStatus}
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                fill="#8884d8"
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {articlesByStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} articles`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-[400px]">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Categories</h3>
          <ResponsiveContainer width="100%" height="85%">
            <BarChart
              data={topCategories}
              layout="vertical"
              margin={{
                top: 5,
                right: 30,
                left: 80,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis 
                type="number"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={{ stroke: '#e0e0e0' }}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                tick={{ fontSize: 12 }}
                axisLine={{ stroke: '#e0e0e0' }}
                tickLine={{ stroke: '#e0e0e0' }}
              />
              <Tooltip 
                formatter={(value) => [`${value} articles`, 'Count']}
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)'
                }}
              />
              <Bar 
                dataKey="value" 
                fill="#1E40AF" 
                radius={[0, 4, 4, 0]}
                animationDuration={1500}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Audience Demographics</h3>
        <div className="h-[300px] flex items-center justify-center">
          <p className="text-gray-500">Detailed audience data coming soon</p>
        </div>
      </div>
    </div>
  );
};

export default Analytics;