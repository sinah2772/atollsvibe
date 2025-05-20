import React from 'react';
import { getTrendColor, getTrendIcon, formatNumber } from '../../utils/formatters';
import { Metric } from '../../types';

interface StatCardProps {
  metric: Metric;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ metric, icon }) => {
  const trendColor = getTrendColor(metric.change);
  const trendIcon = getTrendIcon(metric.change);
  
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 transform hover:scale-[1.02] transition-transform duration-300">
      <div className="flex items-center">
        <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
          {icon}
        </div>
        <div className="ml-4">
          <h3 className="text-sm font-medium text-gray-500">{metric.name}</h3>
          <div className="mt-1 flex items-baseline">
            <p className="text-2xl font-semibold text-gray-900">
              {formatNumber(metric.value)}
            </p>
            <span className={`ml-2 text-sm font-medium flex items-center ${trendColor}`}>
              {trendIcon} {Math.abs(metric.change)}%
            </span>
          </div>
          <span className="text-xs text-gray-400 block mt-1">{metric.timeframe}</span>
        </div>
      </div>
    </div>
  );
};

export default StatCard;