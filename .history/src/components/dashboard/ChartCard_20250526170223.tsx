
import { useState } from 'react';
import { 
  PieChart, Pie, BarChart, Bar, XAxis, YAxis, Tooltip, 
  CartesianGrid, ResponsiveContainer, Cell, Legend
} from 'recharts';
import { DataItem } from '@/types';
import { Button } from '@/components/ui/button';
import { SlidersHorizontal, ArrowDownUp } from 'lucide-react';

interface ChartCardProps {
  title: string;
  data: DataItem[];
  type: 'pie' | 'bar' |;
  dataKey: string;
  nameKey: string;
  filterKey?: string;
  filterValue?: string;
}

const COLORS = ['#38b2ac', '#4fd1c5', '#81e6d9', '#9866ef', '#7e69ab', '#d946ef', '#ec4899', '#f43f5e', '#fb7185', '#f97316'];

const ChartCard = ({ 
  title, 
  data, 
  type, 
  dataKey, 
  nameKey,
  filterKey, 
  filterValue 
}: ChartCardProps) => {
  const [showFilters, setShowFilters] = useState(false);

  // Filter data if filter is provided
  const filteredData = filterKey && filterValue
    ? data.filter(item => String(item[filterKey]) === filterValue)
    : data;

  // Format data for the chart - aggregate by nameKey for better visualization
  const aggregatedData = filteredData.reduce((acc, item) => {
    // Get name and value, accounting for case sensitivity in field names
    const name = item[nameKey] || item[nameKey.toLowerCase()] || item[nameKey.charAt(0).toUpperCase() + nameKey.slice(1)];
    const rawValue = item[dataKey] || item[dataKey.toLowerCase()] || item[dataKey.charAt(0).toUpperCase() + dataKey.slice(1)];
    
    if (name === undefined || rawValue === undefined) {
      return acc;
    }

    const nameStr = String(name || 'Unknown');
    const value = typeof rawValue === 'number' ? rawValue : parseFloat(String(rawValue)) || 0;
    
    if (!acc[nameStr]) {
      acc[nameStr] = { name: nameStr, value: 0 };
    }
    
    acc[nameStr].value += value;
    return acc;
  }, {} as Record<string, { name: string, value: number }>);
  
  const chartData = Object.values(aggregatedData)
    .filter(item => item.value > 0) // Filter out zero values
    .sort((a, b) => b.value - a.value); // Sort by value descending
  
  // Limit to top 10 for better visualization
  const limitedChartData = chartData.slice(0, 10);
  
  // Debug info
  console.log('Chart data for', title, { 
    dataLength: data.length,
    filteredLength: filteredData.length,
    chartDataLength: chartData.length, 
    limitedDataLength: limitedChartData.length,
    dataKey, 
    nameKey,
    sampleData: data.length > 0 ? data[0] : null
  });

  return (
    <div className="bg-dark-400 rounded-lg p-6 shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-medium text-white">{title}</h3>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal size={16} />
          </Button>
          <Button
            variant="ghost"
            size="sm"
          >
            <ArrowDownUp size={16} />
          </Button>
        </div>
      </div>

      <div className="h-64">
        {limitedChartData.length > 0 ? (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'pie' ? (
              <PieChart>
                <Pie
                  data={limitedChartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  fill="#38b2ac"
                  dataKey="value"
                  nameKey="name"
                  paddingAngle={2}
                  label={({ name, percent }) => `${name.substring(0, 10)}${name.length > 10 ? '...' : ''}: ${(percent * 100).toFixed(0)}%`}
                >
                  {limitedChartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('sv-SE').format(value)}
                  labelFormatter={(name) => `${name}`}
                />
                <Legend layout="vertical" verticalAlign="bottom" align="center" />
              </PieChart>
            ) : (
              <BarChart data={limitedChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value} 
                />
                <YAxis />
                <Tooltip 
                  formatter={(value: number) => new Intl.NumberFormat('sv-SE').format(value)}
                  labelFormatter={(name) => `${name}`}
                />
                <Legend />
                <Bar 
                  dataKey="value" 
                  fill="#38b2ac" 
                  radius={[4, 4, 0, 0]}
                >
                  {limitedChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            )}
          </ResponsiveContainer>
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No data available to display
          </div>
        )}
      </div>

      <div className="mt-4 text-right text-xs text-gray-500">
        {limitedChartData.length} of {chartData.length} items shown
      </div>
    </div>
  );
};

export default ChartCard;
