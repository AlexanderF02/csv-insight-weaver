
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { Search, AlertCircle } from "lucide-react";
import { getInsights } from '../api/insights';

/**
 * AIInsights Component
 * 
 * This component provides AI-powered data analysis:
 * 1. Allows users to ask questions about their data
 * 2. Sends data and queries to OpenAI API via our API function
 * 3. Displays AI-generated insights as text and structured data
 * 4. Maintains a history of previous queries and results
 * 
 * @param {Object} data - The parsed CSV data to analyze
 */
const AIInsights = ({ data }) => {
    const [query, setQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [insights, setInsights] = useState(null);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState(null);

    /**
     * Sends the user query and data to our API function for AI processing
     * @param {Event} e - Form submit event
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!query.trim()) {
            toast.error("Please enter a question about your data");
            return;
        }

        if (!data || !data.rows || data.rows.length === 0) {
            toast.error("No data available for analysis");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Call our API function instead of making a direct fetch request
            const result = await getInsights(query, {
                headers: data.headers,
                // Limit the amount of data sent to the API for performance
                rows: data.rows.slice(0, 100)
            });
            
            // Add to history and set as current insight
            const newInsight = {
                id: Date.now(),
                query,
                result: result.insight,
                tableData: result.tableData || null,
                chartData: result.chartData || null,
                timestamp: new Date().toLocaleString()
            };
            
            setInsights(newInsight);
            setHistory(prev => [newInsight, ...prev]);
            toast.success("AI insights generated successfully");
            
        } catch (error) {
            console.error('Error fetching AI insights:', error);
            setError(error.message);
            toast.error(`Failed to get insights: ${error.message}`);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Loads a previous insight from history
     * @param {Object} item - The history item to load
     */
    const loadFromHistory = (item) => {
        setInsights(item);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>AI Insights</CardTitle>
                    <CardDescription>
                        Ask questions about your data to get AI-powered insights
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="flex gap-2">
                        <div className="relative flex-grow">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Ask a question about your data..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="pl-8"
                            />
                        </div>
                        <Button type="submit" disabled={isLoading || !data}>
                            {isLoading ? "Analyzing..." : "Get Insights"}
                        </Button>
                    </form>
                    
                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
                            <AlertCircle className="text-red-500 mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-medium text-red-800">Error</p>
                                <p className="text-red-600 text-sm">{error}</p>
                                <p className="text-red-600 text-sm mt-1">
                                    Please check that your OpenAI API key is correctly set in the .env file with the VITE_OPENAI_API_KEY variable.
                                </p>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            {insights && (
                <Card className="mt-6">
                    <CardHeader>
                        <CardTitle>Results for: {insights.query}</CardTitle>
                        <CardDescription>
                            {insights.timestamp}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="text" className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="text">Text Insights</TabsTrigger>
                                <TabsTrigger value="table">Table View</TabsTrigger>
                                <TabsTrigger value="chart">Chart View</TabsTrigger>
                            </TabsList>

                            <TabsContent value="text" className="pt-4">
                                <Textarea
                                    value={insights.result}
                                    readOnly
                                    className="min-h-[200px]"
                                />
                            </TabsContent>

                            <TabsContent value="table" className="pt-4">
                                {insights.tableData ? (
                                    <div className="border rounded-md overflow-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="border-b bg-muted">
                                                    {insights.tableData.headers.map((header, i) => (
                                                        <th key={i} className="p-2 text-left font-medium">{header}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {insights.tableData.rows.map((row, i) => (
                                                    <tr key={i} className="border-b">
                                                        {row.map((cell, j) => (
                                                            <td key={j} className="p-2">{cell}</td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground p-4">
                                        No table data available for this query
                                    </p>
                                )}
                            </TabsContent>

                            <TabsContent value="chart" className="pt-4">
                                {insights.chartData ? (
                                    <div className="h-[300px] w-full">
                                        <p className="text-center text-muted-foreground">
                                            Chart visualization would be displayed here
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-center text-muted-foreground p-4">
                                        No chart data available for this query
                                    </p>
                                )}
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                </Card>
            )}

            {history.length > 0 && (
                <Card>
                    <CardHeader>
                        <CardTitle>Query History</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-2">
                            {history.map((item) => (
                                <div 
                                    key={item.id}
                                    onClick={() => loadFromHistory(item)}
                                    className="p-3 border rounded-md cursor-pointer hover:bg-appGray-light flex justify-between"
                                >
                                    <div>
                                        <p className="font-medium">{item.query}</p>
                                        <p className="text-sm text-appGray-dark">{item.timestamp}</p>
                                    </div>
                                    <Button variant="ghost" size="sm">View</Button>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default AIInsights;
