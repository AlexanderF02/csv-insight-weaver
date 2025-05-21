import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import DataTable from '../components/DataTable';
import AIInsights from '../components/AIInsights';
import DataVisualizer from '../components/DataVisualizer';
import FileUpload from '../components/FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import Navbar from "../components/Navbar";
import { Calendar } from "@/components/Calendar";

const Index = () => {
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [allCsvFiles, setAllCsvFiles] = useState([]);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [chartData, setChartData] = useState({ bar: [], pie: [], line: [] });
    const [keyInfo, setKeyInfo] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [uniqueCompanies, setUniqueCompanies] = useState(0);
    const { toast } = useToast();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [isSelectingStartDate, setIsSelectingStartDate] = useState(true);

    const handleSwitchChange = (checked) => {
    setIsFeatureEnabled(checked);
    setEditMode(checked);
    if (checked) {
        navigate("/editdashboard");
    }
};

    const handleDataLoaded = (csvData) => {
        setData(csvData);

        setAllCsvFiles(prevFiles => [...prevFiles, csvData]);

        if (csvData && csvData.headers && csvData.rows && csvData.rows.length > 0) {
            // Extract key columns
            const companyColumn = 'mottagare';
            const amountColumn = 'totalbelopp';
            const dateColumn = 'fakturadatum';

            // Process data for charts
            const barChartData = csvData.rows.reduce((acc, row) => {
                const company = row[companyColumn] || 'Unknown Company';
                const amount = parseFloat(row[amountColumn]) || 0;
                acc[company] = (acc[company] || 0) + amount;
                return acc;
            }, {});

            const pieChartData = Object.entries(barChartData).map(([company, amount]) => ({
                name: company,
                value: amount,
            }));

            const lineChartData = csvData.rows.reduce((acc, row) => {
                const date = row[dateColumn];
                const amount = parseFloat(row[amountColumn]) || 0;
                if (date) {
                    acc[date] = (acc[date] || 0) + amount;
                }
                return acc;
            }, {});

            const lineChartFormattedData = Object.entries(lineChartData).map(([date, amount]) => ({
                date,
                value: amount,
            }));

            // Set chart data
            setChartData({
                bar: Object.entries(barChartData).map(([name, value]) => ({ name, value })),
                pie: pieChartData,
                line: lineChartFormattedData,
            });

            // Extract key information (e.g., company names, IDs)
            const keyInfo = csvData.rows.slice(0, 5).map(row => ({
                company: row[companyColumn] || 'Unknown Company',
                id: row['fakturanummer'] || 'N/A',
            }));

            setKeyInfo(keyInfo);

            // Calculate total amount and unique companies
            const totalAmount = csvData.rows.reduce((sum, row) => {
                const amount = parseFloat(row[amountColumn]);
                return sum + (isNaN(amount) ? 0 : amount);
            }, 0);

            const uniqueCompanies = new Set(csvData.rows.map(row => row[companyColumn])).size;

            setTotalAmount(totalAmount);
            setUniqueCompanies(uniqueCompanies);
        }

        setIsModalOpen(false);
        setActiveTab('dashboard');

        toast({
            title: "CSV Loaded Successfully",
            description: `Loaded ${csvData.rows.length} rows with ${csvData.headers.length} columns`
        });
    };

    const navigateToDashboard = () => {
        setActiveTab('dashboard');
    };

    return (
        <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
            <Navbar navigateToDashboard={navigateToDashboard} setIsModalOpen={setIsModalOpen} />

            {/* Switch positioned below the Navbar */}
            <div className="flex items-center space-x-2 mt-4 ml-4">
                <span className="text-sm text-black dark:text-white">Dashboard</span>
                <Switch
                    id="feature-switch"
                    checked={isFeatureEnabled}
                    onCheckedChange={handleSwitchChange}
                />
                <span className="text-sm text-black dark:text-white">Redigering</span>
            </div>

            <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow flex">
                <section className="w-full">
                    {data && (
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                            <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
                                <TabsTrigger value="data">Data Table</TabsTrigger>
                                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                            </TabsList>

                            <TabsContent value="data" className="space-y-6">
                                <DataTable data={data} />
                            </TabsContent>

                            <TabsContent value="insights" className="space-y-6">
                                <AIInsights data={data} />
                            </TabsContent>

                            {/* Dashboard Content */}
                            <TabsContent value="dashboard" className="space-y-6">

                                <div className="dashboard-card flex justify-between items-center p-6 rounded-lg shadow-lg bg-gradient-to-r from bg-[#26A69A] text-white mb-6">

                                    <div className="flex items-center">
                                        <img src="/esyn.png" alt="Logo" className="h-12 w-auto mr-4" />
                                        <div>
                                            <h1 className="text-2xl font-bold">Välkommen!</h1>
                                            <p className="text-sm">Till din dashboard</p>
                                        </div>
                                    </div>

                                    {/* Key Statistics */}
                                    <div className="flex items-center space-x-8">
                                        <div className="text-center">
                                            <h2 className="text-xl font-bold">Totalt belopp</h2>
                                            <p className="text-lg">SEK {totalAmount.toFixed(2)}</p>
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-xl font-bold">Fakturor</h2>
                                            <p className="text-lg">{data?.rows.length || 0}</p>
                                        </div>
                                        <div className="text-center">
                                            <h2 className="text-xl font-bold">Unika Företag</h2>
                                            <p className="text-lg">{uniqueCompanies}</p>
                                        </div>
                                    </div>

                                    {/* Calendar Dropdown */}
                                    <div className="relative">
                                        <div
                                            className="bg-white text-black p-2 rounded-lg shadow-md cursor-pointer mb-2"
                                            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
                                        >
                                            <h2 className="text-sm font-bold">Välj datum</h2>
                                            <p className="text-sm">
                                                {startDate.toLocaleDateString()} - {endDate.toLocaleDateString()}
                                            </p>
                                        </div>

                                        {isCalendarOpen && (
                                            <div className="absolute z-10 bg-white dark:bg-gray-800 border rounded-lg shadow-lg mt-2">
                                                <Calendar
                                                    mode="single"
                                                    selected={isSelectingStartDate ? startDate : endDate}
                                                    onSelect={(selectedDate) => {
                                                        if (isSelectingStartDate) {
                                                            setStartDate(selectedDate);
                                                            setIsSelectingStartDate(false);
                                                        } else {
                                                            setEndDate(selectedDate);
                                                            setIsCalendarOpen(false);
                                                        }
                                                    }}
                                                    modifiers={{
                                                        start: startDate,
                                                        end: endDate,
                                                    }}
                                                    modifiersClassNames={{
                                                        start: "bg-blue-500 text-white rounded-full",
                                                        end: "bg-blue-500 text-white rounded-full",
                                                    }}
                                                    className="rounded-md border bg-white text-gray-800 dark:bg-gray-800 dark:text-white"
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Existing Dashboard Content */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div
                                        className={`dashboard-card col-span-1 h-[320px] cursor-pointer hover:shadow-lg transition-shadow ${
                                            editMode ? 'border-2 border-dashed border-blue-400' : ''
                                        }`}
                                    >
                                        <DataVisualizer chartData={chartData.bar} chartType="bar" />
                                        {editMode && (
                                            <div className="absolute bottom-2 right-2 text-xs text-blue-500">
                                                Klicka för att redigera
                                            </div>
                                        )}
                                    </div>

                                    <div
                                        className={`dashboard-card col-span-1 h-[320px] cursor-pointer hover:shadow-lg transition-shadow ${
                                            editMode ? 'border-2 border-dashed border-blue-400' : ''
                                        }`}
                                    >
                                        <DataVisualizer chartData={chartData.pie} chartType="pie" />
                                        {editMode && (
                                            <div className="absolute bottom-2 right-2 text-xs text-blue-500">
                                                Klicka för att redigera
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <DataVisualizer chartData={chartData.line} chartType="line" />
                            </TabsContent>
                        </Tabs>
                    )}
                </section>
            </main>

            {/* REMOVE the floating Ny analys button here */}

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


