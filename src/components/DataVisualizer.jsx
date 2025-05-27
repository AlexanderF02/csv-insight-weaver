import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardDescription, CardHeader, CardTitle 
} from "@/components/ui/card";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  LineChart, Line, PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const DataVisualizer = ({
  chartData,
  chartType = 'bar',
  dataKey = 'value',
  nameKey = 'name'
}) => {
  const [filteredData, setFilteredData] = useState([]);
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  useEffect(() => {
    if (Array.isArray(chartData) && chartData.length) {
      setFilteredData(chartData);
    } else {
      setFilteredData([]);
    }
  }, [chartData]);

  if (!Array.isArray(chartData) || chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Data Visualization</CardTitle>
          <CardDescription>No data available</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-muted-foreground">Upload or pass valid data</p>
        </CardContent>
      </Card>
    );
  }

  const renderChart = () => {
    switch (chartType) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              <Bar dataKey={dataKey} fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        );

      case 'line':
      case 'lineByDescription':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={nameKey} angle={-45} textAnchor="end" height={60} tick={{ fontSize: 12 }} />
              <YAxis />
              <Tooltip />
              {chartType === 'lineByDescription' && <Legend />}
              <Line
                type="monotone"
                dataKey={dataKey}
                stroke="#3b82f6"
                name={chartType === 'lineByDescription' ? 'Total Amount' : undefined}
                activeDot={{ r: 6 }}
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={filteredData}
                cx="50%"
                cy="50%"
                outerRadius={100}
                dataKey={dataKey}
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {filteredData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        );

      default:
        return (
          <div className="h-[300px] flex items-center justify-center">
            <p>Unsupported chart type: {chartType}</p>
          </div>
        );
    }
  };

  return (
    <Card>
      <CardHeader className="flex justify-between items-center">
        <div>
          <CardTitle>
            {chartType === 'bar' && 'Bar Chart'}
            {chartType === 'line' && 'Line Chart'}
            {chartType === 'pie' && 'Pie Chart'}
            {chartType === 'lineByDescription' && 'Expenses by Category'}
          </CardTitle>
          <CardDescription>
            {chartType === 'lineByDescription'
              ? 'Grouped by description'
              : 'Visual representation of your data'}
          </CardDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {}}
          className="flex items-center gap-1"
        >
          <Filter className="h-4 w-4" />
          Filters
        </Button>
      </CardHeader>
      <CardContent>
        {renderChart()}
        <div className="mt-2 text-sm text-muted-foreground text-right">
          {filteredData.length} of {chartData.length} items
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualizer;
