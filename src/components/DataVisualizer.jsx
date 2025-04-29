
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

/**
 * DataVisualizer Component
 * 
 * Renders different chart types based on data analysis:
 * 1. Supports bar charts, line charts, and pie charts
 * 2. Automatically selects appropriate chart type based on data structure
 * 3. Provides tooltips and interactive elements for data exploration
 * 
 * @param {Object} chartData - Data for rendering charts
 * @param {string} chartType - Type of chart to render (bar, line, pie)
 */
const DataVisualizer = ({ chartData, chartType = 'bar' }) => {
    // If no chart data is provided, show placeholder
    if (!chartData || !Array.isArray(chartData) || chartData.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Data Visualization</CardTitle>
                    <CardDescription>
                        Ask the AI to generate charts based on your data
                    </CardDescription>
                </CardHeader>
                <CardContent className="h-[300px] flex items-center justify-center">
                    <p className="text-muted-foreground">No visualization data available</p>
                </CardContent>
            </Card>
        );
    }

    // Sample colors for pie chart segments
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    
    // Render different chart types based on the chartType prop
    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="value" fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                );
                
            case 'line':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis 
                                dataKey="name" 
                                angle={-45} 
                                textAnchor="end"
                                height={60}
                            />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="value" stroke="#3b82f6" />
                        </LineChart>
                    </ResponsiveContainer>
                );
                
            case 'pie':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
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
            <CardHeader>
                <CardTitle>
                    {chartType === 'bar' && 'Bar Chart'}
                    {chartType === 'line' && 'Line Chart'}
                    {chartType === 'pie' && 'Pie Chart'}
                </CardTitle>
                <CardDescription>
                    Visual representation of your data
                </CardDescription>
            </CardHeader>
            <CardContent>
                {renderChart()}
            </CardContent>
        </Card>
    );
};

export default DataVisualizer;
