
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter, ArrowUp, ArrowDown } from "lucide-react";

/**
 * DataVisualizer Component
 * 
 * Renders different chart types based on data analysis:
 * 1. Supports bar charts, line charts, and pie charts
 * 2. Automatically selects appropriate chart type based on data structure
 * 3. Provides tooltips and interactive elements for data exploration
 * 4. Allows filtering by data values and ranges
 * 
 * @param {Object} chartData - Data for rendering charts
 * @param {string} chartType - Type of chart to render (bar, line, pie)
 */
const DataVisualizer = ({ chartData, chartType = 'bar' }) => {
    // State for filtered chart data
    const [filteredData, setFilteredData] = useState([]);
    // State for filter settings
    const [filterField, setFilterField] = useState('');
    const [filterValue, setFilterValue] = useState('');
    const [filterType, setFilterType] = useState('equals');
    // State for showing filter panel
    const [showFilters, setShowFilters] = useState(false);
    // State for sorting
    const [sortDirection, setSortDirection] = useState('desc');
    
    // Available fields from chart data
    const [availableFields, setAvailableFields] = useState([]);
    
    // Initialize filtered data and available fields when chart data changes
    useEffect(() => {
        if (chartData && chartData.length > 0) {
            setFilteredData(chartData);
            
            // Extract all available fields from the first data item
            const firstItem = chartData[0];
            const fields = Object.keys(firstItem).filter(key => key !== 'name' && key !== 'value');
            setAvailableFields(['name', 'value', ...fields]);
            
            // Set default filter field to the first available field
            if (!filterField && fields.length > 0) {
                setFilterField('value');
            }
        } else {
            setFilteredData([]);
            setAvailableFields([]);
        }
    }, [chartData]);
    
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

    /**
     * Apply filters to chart data
     */
    const applyFilters = () => {
        if (!filterField || !filterValue) {
            // If no filter criteria, reset to original data
            setFilteredData(chartData);
            return;
        }
        
        const filtered = chartData.filter(item => {
            const itemValue = item[filterField];
            const compareValue = !isNaN(parseFloat(filterValue)) ? parseFloat(filterValue) : filterValue;
            
            switch (filterType) {
                case 'equals':
                    return String(itemValue).toLowerCase() === String(compareValue).toLowerCase();
                case 'contains':
                    return String(itemValue).toLowerCase().includes(String(compareValue).toLowerCase());
                case 'greater':
                    return Number(itemValue) > Number(compareValue);
                case 'less':
                    return Number(itemValue) < Number(compareValue);
                default:
                    return true;
            }
        });
        
        setFilteredData(filtered);
    };
    
    /**
     * Reset filters to original data
     */
    const resetFilters = () => {
        setFilterField('value');
        setFilterValue('');
        setFilterType('equals');
        setFilteredData(chartData);
    };
    
    /**
     * Sort data by value
     */
    const sortData = () => {
        const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
        setSortDirection(newDirection);
        
        const sorted = [...filteredData].sort((a, b) => {
            return newDirection === 'asc' 
                ? a.value - b.value 
                : b.value - a.value;
        });
        
        setFilteredData(sorted);
    };

    // Sample colors for pie chart segments
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];
    
    // Render different chart types based on the chartType prop
    const renderChart = () => {
        switch (chartType) {
            case 'bar':
                return (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                        <LineChart data={filteredData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
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
                                data={filteredData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={100}
                                fill="#8884d8"
                                dataKey="value"
                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                            >
                                {filteredData.map((entry, index) => (
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
                <div className="flex justify-between items-center">
                    <div>
                        <CardTitle>
                            {chartType === 'bar' && 'Bar Chart'}
                            {chartType === 'line' && 'Line Chart'}
                            {chartType === 'pie' && 'Pie Chart'}
                        </CardTitle>
                        <CardDescription>
                            Visual representation of your data
                        </CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setShowFilters(!showFilters)}
                            className="flex items-center gap-1"
                        >
                            <Filter className="h-4 w-4" />
                            {showFilters ? 'Hide Filters' : 'Show Filters'}
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={sortData}
                            className="flex items-center gap-1"
                        >
                            {sortDirection === 'asc' ? (
                                <ArrowUp className="h-4 w-4" />
                            ) : (
                                <ArrowDown className="h-4 w-4" />
                            )}
                            Sort
                        </Button>
                    </div>
                </div>
                
                {showFilters && (
                    <div className="mt-4 p-4 bg-muted/50 rounded-md space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            <div>
                                <Select 
                                    value={filterField}
                                    onValueChange={setFilterField}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select field" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {availableFields.map(field => (
                                            <SelectItem key={field} value={field}>
                                                {field}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Select 
                                    value={filterType}
                                    onValueChange={setFilterType}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter type" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="equals">Equals</SelectItem>
                                        <SelectItem value="contains">Contains</SelectItem>
                                        <SelectItem value="greater">Greater than</SelectItem>
                                        <SelectItem value="less">Less than</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            
                            <div>
                                <Input
                                    placeholder="Filter value..."
                                    value={filterValue}
                                    onChange={(e) => setFilterValue(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <div className="flex justify-end gap-2">
                            <Button variant="outline" size="sm" onClick={resetFilters}>
                                Reset
                            </Button>
                            <Button size="sm" onClick={applyFilters}>
                                Apply Filter
                            </Button>
                        </div>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {renderChart()}
                <div className="mt-2 text-sm text-muted-foreground text-right">
                    {filteredData.length} of {chartData.length} items shown
                </div>
            </CardContent>
        </Card>
    );
};

export default DataVisualizer;
