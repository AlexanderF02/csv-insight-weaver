import React from 'react';
import { useLocation } from 'react-router-dom';
import DataVisualizer from '../components/DataVisualizer';

const Dashboard = () => {
    const location = useLocation();
    const chartData = location.state?.chartData || [];

    // Process data for line chart by fakturabeskrivning
    const processLineChartData = () => {
        const groupedData = {};
        
        chartData.forEach(item => {
            const description = item.fakturabeskrivning || 'Other';
            if (!groupedData[description]) {
                groupedData[description] = {
                    name: description,
                    value: 0,
                    count: 0
                };
            }
            groupedData[description].value += item.totalbelopp || 0;
            groupedData[description].count += 1;
        });

        return Object.values(groupedData);
    };

    const lineChartData = processLineChartData();

    if (chartData.length === 0) {
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
                    <DataVisualizer 
                        chartData={chartData} 
                        chartType="bar" 
                        dataKey="totalbelopp"
                        nameKey="mottagare"
                    />
                    <DataVisualizer 
                        chartData={chartData} 
                        chartType="pie" 
                        dataKey="fakturabelopp"
                        nameKey="mottagare"
                    />
                </div>
<div className="mt-6">
    <DataVisualizer 
        chartData={lineChartData} 
        chartType="lineByDescription" 
        dataKey="value"
        nameKey="name"
    />
</div>
            </main>
        </div>
    );
};

export default Dashboard;