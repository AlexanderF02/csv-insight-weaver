import React, { useState } from 'react';
import { useNavigate } from "react-router-dom"; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'; 
import { faUser, faPlus, faFloppyDisk, faArrowUp, faBorderAll } from '@fortawesome/free-solid-svg-icons'; 
import DataTable from '../components/DataTable';
import AIInsights from '../components/AIInsights';
import DataVisualizer from '../components/DataVisualizer';
import FileUpload from '../components/FileUpload'; 
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"; // Adjusted path
import { useToast } from "../hooks/use-toast";
import { ModeToggle } from "../components/ModeToggle"; // Correct import path

const Index = () => {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [allCsvFiles, setAllCsvFiles] = useState([]); 
    const [activeTab, setActiveTab] = useState('data');
    const [chartData, setChartData] = useState(null);
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleDataLoaded = (csvData) => {
        setData(csvData);

        // Append the new CSV data to the array of all CSV files
        setAllCsvFiles(prevFiles => [...prevFiles, csvData]);

        if (csvData && csvData.headers && csvData.rows && csvData.rows.length > 0) {
            const numericColumn = csvData.headers.find(header => {
                return csvData.rows.some(row => !isNaN(parseFloat(row[header])));
            });

            if (numericColumn) {
                const sampleSize = Math.min(csvData.rows.length, 8);
                const sampleData = csvData.rows.slice(0, sampleSize).map(row => ({
                    name: row[csvData.headers[0]] || 'Item',
                    value: parseFloat(row[numericColumn]) || 0
                }));

                setChartData(sampleData);
            }
        }

        setIsModalOpen(false);
        setActiveTab('data');

        toast({
            title: "CSV Loaded Successfully",
            description: `Loaded ${csvData.rows.length} rows with ${csvData.headers.length} columns`
        });
    };

    return (
        <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
            <header className="text-white py-4 px-6 shadow-md flex items-center justify-between dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                <div className="flex items-center">
                    <img src="/esyn.png" alt="Logo" className="h-8 w-auto" />
                </div>

                <div className="flex items-center space-x-4">
                    <ModeToggle />
                    <button
                        className="p-2 rounded-full hover:bg-opacity-80 text-white"
                        onClick={() => navigate("/login")}
                    >
                        <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
                    </button>
                </div>
            </header>

            <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow flex">
                <aside className="w-1/4 pr-4">
                    <div className="flex flex-col space-y-4 ml-[-40px]">
                        <button
                            className="flex items-center justify-between bg-[#26A69A] text-white py-2 px-4 rounded-md shadow hover:bg-opacity-90"
                            onClick={() => setIsModalOpen(true)} 
                        >
                            Ny analys
                            <FontAwesomeIcon icon={faPlus} className="h-6 w-6 ml-2" />
                        </button>
                        <button
                            className="flex items-center justify-between bg-white text-gray-800 py-2 px-4 rounded-md shadow hover:bg-gray-100 dark:bg-gray-700 dark:text-white"
                            onClick={() => navigate("/dashboard", { state: { chartData } })} 
                        >
                            Dashboard
                            <FontAwesomeIcon icon={faBorderAll} className="h-6 w-6 ml-2" />
                        </button>
                        <button
                            className="flex items-center justify-between bg-white text-gray-800 py-2 px-4 rounded-md shadow hover:bg-gray-100 dark:bg-gray-700 dark:text-white"
                            onClick={() => navigate("/editdashboard", { state: { selectedWidgets: [] } })} // Pass initial selected widgets
                        >
                            Redigera Dashboard
                            <FontAwesomeIcon icon={faArrowUp} className="h-6 w-6 ml-2" />
                        </button>
                        <button
                            className="flex items-center justify-between bg-white text-gray-800 py-2 px-4 rounded-md shadow hover:bg-gray-100 dark:bg-gray-700 dark:text-white"
                            onClick={() => navigate("/savedcsv", { state: { allCsvFiles } })} 
                        >
                            Sparade analyser
                            <FontAwesomeIcon icon={faFloppyDisk} className="h-6 w-6 ml-2" />
                        </button>
                    </div>
                </aside>

                <section className="w-3/4">
                    {data && (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
                                <TabsTrigger value="data">Data Table</TabsTrigger>
                                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                                <TabsTrigger value="visualize">Visualize</TabsTrigger>
                            </TabsList>

                            <TabsContent value="data" className="space-y-6">
                                <DataTable data={data} />
                            </TabsContent>

                            <TabsContent value="insights" className="space-y-6">
                                <AIInsights data={data} />
                            </TabsContent>

                            <TabsContent value="visualize" className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <DataVisualizer chartData={chartData} chartType="bar" />
                                    <DataVisualizer chartData={chartData} chartType="pie" />
                                </div>
                                <DataVisualizer chartData={chartData} chartType="line" />
                            </TabsContent>
                        </Tabs>
                    )}
                </section>
            </main>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h2 className="text-xl font-bold mb-4">Upload CSV File</h2>
                        <FileUpload onDataLoaded={handleDataLoaded} />
                        <button
                            className="mt-4 w-full bg-[#26A69A] text-white py-2 px-4 rounded-md shadow hover:bg-[#26a699de]"
                            onClick={() => setIsModalOpen(false)} 
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}

            <footer className="text-white py-4 dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} eSyn Cloud. All Rights Reserved. Powered by Sitea</p>
                </div>
            </footer>
        </div>
    );
};

export default Index;
