import React from 'react';
import { useLocation } from 'react-router-dom'; // Import useLocation
import DataVisualizer from '../components/DataVisualizer'; // Import the DataVisualizer component

/**
 * Dashboard Page
 * 
 * Displays visualizations using the DataVisualizer component.
 */
const Dashboard = () => {
    const location = useLocation(); // Access the location object
    const chartData = location.state?.chartData; // Retrieve chartData from state

    if (!chartData || chartData.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-appGray-light dark:bg-gray-900 dark:text-white">
                <p className="text-xl font-bold">No data available. Please upload a CSV file.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-appGray-light dark:bg-gray-900 dark:text-white">
            <header className="text-white py-4 px-6 shadow-md flex items-center justify-between dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                <img src="/esyn.png" alt="Logo" className="h-8 w-auto" />
            </header>

            <main className="container mx-auto px-4 sm:px-6 py-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <DataVisualizer chartData={chartData} chartType="bar" />
                    <DataVisualizer chartData={chartData} chartType="pie" />
                </div>
                <div className="mt-6">
                    <DataVisualizer chartData={chartData} chartType="line" />
                </div>
            </main>
        </div>
    );
};

export default Dashboard;