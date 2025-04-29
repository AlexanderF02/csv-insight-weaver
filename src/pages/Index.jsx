
import React, { useState } from 'react';
import FileUpload from '../components/FileUpload';
import DataTable from '../components/DataTable';
import AIInsights from '../components/AIInsights';
import DataVisualizer from '../components/DataVisualizer';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "../hooks/use-toast";

/**
 * Index Page - Main Application Page
 * 
 * This is the main page of the application that:
 * 1. Provides file upload functionality
 * 2. Shows the data table view of uploaded CSV
 * 3. Offers AI-driven insights and visualization tools
 * 4. Handles the main state and data flow between components
 */
const Index = () => {
    // State to store the parsed CSV data
    const [data, setData] = useState(null);
    // State for the selected tab
    const [activeTab, setActiveTab] = useState('data');
    // Sample chart data
    const [chartData, setChartData] = useState(null);
    // Toast for notifications
    const { toast } = useToast();
    
    /**
     * Handles data received from the FileUpload component
     * @param {Object} csvData - Parsed CSV data with headers and rows
     */
    const handleDataLoaded = (csvData) => {
        setData(csvData);
        
        // Automatically generate a simple chart from the first numeric column
        if (csvData && csvData.headers && csvData.rows && csvData.rows.length > 0) {
            // Find the first numeric column
            const numericColumn = csvData.headers.find(header => {
                return csvData.rows.some(row => !isNaN(parseFloat(row[header])));
            });
            
            if (numericColumn) {
                // Generate chart data from the first 5-10 rows
                const sampleSize = Math.min(csvData.rows.length, 8);
                const sampleData = csvData.rows.slice(0, sampleSize).map(row => ({
                    name: row[csvData.headers[0]] || 'Item',
                    value: parseFloat(row[numericColumn]) || 0
                }));
                
                setChartData(sampleData);
            }
        }
        
        // Switch to data tab after upload
        setActiveTab('data');
        
        toast({
            title: "CSV Loaded Successfully",
            description: `Loaded ${csvData.rows.length} rows with ${csvData.headers.length} columns`
        });
    };

    return (
        <div className="min-h-screen bg-appGray-light">
            <header className="bg-appBlue-dark text-white py-6 px-4 sm:px-6">
                <div className="container mx-auto">
                    <h1 className="text-2xl sm:text-3xl font-bold">CSV Insight Weaver</h1>
                    <p className="text-appBlue-light">Upload, analyze, and visualize your CSV data with AI assistance</p>
                </div>
            </header>
            
            <main className="container mx-auto px-4 sm:px-6 py-8">
                {/* File Upload Section */}
                <section className="mb-10">
                    <FileUpload onDataLoaded={handleDataLoaded} />
                </section>
                
                {data && (
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
                            <TabsTrigger value="data">Data Table</TabsTrigger>
                            <TabsTrigger value="insights">AI Insights</TabsTrigger>
                            <TabsTrigger value="visualize">Visualize</TabsTrigger>
                        </TabsList>
                        
                        {/* Data Table View */}
                        <TabsContent value="data" className="space-y-6">
                            <DataTable data={data} />
                        </TabsContent>
                        
                        {/* AI Insights View */}
                        <TabsContent value="insights" className="space-y-6">
                            <AIInsights data={data} />
                        </TabsContent>
                        
                        {/* Data Visualization View */}
                        <TabsContent value="visualize" className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <DataVisualizer chartData={chartData} chartType="bar" />
                                <DataVisualizer chartData={chartData} chartType="pie" />
                            </div>
                            <DataVisualizer chartData={chartData} chartType="line" />
                        </TabsContent>
                    </Tabs>
                )}
            </main>
            
            <footer className="bg-appBlue-dark text-white py-4 mt-10">
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} CSV Insight Weaver</p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
