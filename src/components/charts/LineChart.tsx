import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DataItem {
  name: string;
  [key: string]: number | string; // Allows for dynamic data keys
}

interface LineChartProps {
  data: DataItem[];
  lines: Array<{
    dataKey: string;
    color: string;
    name: string;
  }>;
  xAxisKey?: string; // Optional custom key for X-axis
}

const LineChart: React.FC<LineChartProps> = ({ 
  data, 
  lines, 
  xAxisKey = 'name' 
}) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsLineChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid 
          strokeDasharray="3 3" 
          stroke="#f0f0f0" 
          vertical={false} 
        />
        <XAxis 
          dataKey={xAxisKey} 
          tick={{ fontSize: 12 }} 
        />
        <YAxis 
          tick={{ fontSize: 12 }} 
        />
        <Tooltip
          contentStyle={{
            borderRadius: '8px',
            border: 'none',
            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
            fontSize: '12px'
          }}
        />
        <Legend
          wrapperStyle={{ fontSize: '12px' }}
          formatter={(value) => <span style={{ color: '#333' }}>{value}</span>}
        />
        
        {lines.map((line, index) => (
          <Line
            key={index}
            type="monotone"
            dataKey={line.dataKey}
            stroke={line.color}
            strokeWidth={2}
            name={line.name}
            dot={{ r: 4 }}
            activeDot={{ r: 6 }}
          />
        ))}
      </RechartsLineChart>
    </ResponsiveContainer>
  );
};

export default LineChart;