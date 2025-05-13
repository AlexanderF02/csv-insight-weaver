import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DataItem {
  name: string;
  jul: number;
  aug: number;
}

interface BarChartProps {
  data: DataItem[];
  colors: { jul: string; aug: string };
}

const BarChart: React.FC<BarChartProps> = ({ data, colors }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <RechartsBarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 12 }} />
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
        <Bar
          dataKey="jul"
          fill={colors.jul}
          name="Jul"
          barSize={20}
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="aug"
          fill={colors.aug}
          name="Aug"
          barSize={20}
          radius={[4, 4, 0, 0]}
        />
      </RechartsBarChart>
    </ResponsiveContainer>
  );
};

export default BarChart;