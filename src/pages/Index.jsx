import React, { useState, useEffect, useMemo } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { Plus, Filter, X } from 'lucide-react';

import Navbar from "../components/Navbar";
import CSVUploader from '../components/CSVUploader.jsx';
import DataTable from '../components/DataTable';
import AIInsights from '../components/AIInsights';
import DataVisualizer from '../components/DataVisualizer';
<<<<<<< Updated upstream
import FileUpload from '../components/FileUpload';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { useToast } from "../hooks/use-toast";
import { Switch } from "@/components/ui/switch"; // Import the Switch component
import Navbar from "../components/Navbar";
import { Calendar } from "@/components/Calendar"; // Import the custom ShadCN Calendar component

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
=======
import FilterPanel from '../components/FilterPanel.jsx';

// Sample dummy data
const sampleData = [
    { fakturanummer: '5003774819', mottagare: 'ACME 11 AB', totalbelopp: 1951.31, momsbelopp: 487.83, fakturabelopp: 2439, valuta: 'SEK', fakturadatum: '2025-01-01', fakturatyp: 'Invoice', fakturaformat: 'PDF' },
    { fakturanummer: '5003787411', mottagare: 'ACME 25 AB', totalbelopp: 2174.58, momsbelopp: 284.25, fakturabelopp: 1421, valuta: 'SEK', fakturadatum: '2025-01-01', fakturatyp: 'Invoice', fakturaformat: 'PDF' },
    { fakturanummer: '5003778225', mottagare: 'ACME 52 AB', totalbelopp: 4440.9, momsbelopp: 944.08, fakturabelopp: 4720, valuta: 'SEK', fakturadatum: '2025-01-01', fakturatyp: 'Invoice', fakturaformat: 'PDF' },
    { fakturanummer: '5003774821', mottagare: 'ACME 11 AB', totalbelopp: 2150.31, momsbelopp: 456.83, fakturabelopp: 2607, valuta: 'SEK', fakturadatum: '2025-02-15', fakturatyp: 'Invoice', fakturaformat: 'PDF' },
    { fakturanummer: '5003787415', mottagare: 'ACME 25 AB', totalbelopp: 3264.58, momsbelopp: 652.25, fakturabelopp: 3917, valuta: 'SEK', fakturadatum: '2025-02-28', fakturatyp: 'Invoice', fakturaformat: 'Peppol' },
    { fakturanummer: '7003787415', mottagare: 'Test AB', totalbelopp: 123264.58, momsbelopp: 123652.25, fakturabelopp: 323917, valuta: 'SEK', fakturadatum: '2025-05-26', fakturatyp: 'Debit', fakturaformat: 'Peppol' },
];

const ActiveFilters = ({ filters, removeFilter }) => {
const activeFilters = Object.entries(filters).filter(([_, value]) => value !== null && value !== '' && !(Array.isArray(value) && value[0] === null && value[1] === null));
if (activeFilters.length === 0) return null;

return (
    <div className="mb-6 bg-dark-300 rounded-lg p-4">
    <div className="flex items-center mb-2">
        <Filter size={16} className="mr-2 text-teal-500" />
        <h3 className="text-sm font-medium text-white">Active filters</h3>
    </div>
    <div className="flex flex-wrap gap-2 mt-2">
        {activeFilters.map(([key, value]) => (
        <Badge key={key} variant="outline" className="flex items-center gap-1 bg-dark-200 text-white border-teal-500/30 pl-2">
            <span className="text-xs font-normal">
            {key}:&nbsp;
            {Array.isArray(value)
                ? `${value[0] ? format(value[0], 'yyyy-MM-dd') : 'any'} to ${value[1] ? format(value[1], 'yyyy-MM-dd') : 'any'}`
                : String(value)}
            </span>
            <button className="ml-1 hover:bg-teal-500/20 rounded-full p-0.5" onClick={() => removeFilter(key)}>
            <X size={12} className="text-teal-400" />
            </button>
        </Badge>
        ))}
    </div>
    </div>
);
};

const Index = () => {
const [isUploadOpen, setIsUploadOpen] = useState(false);
const [activeTab, setActiveTab] = useState('dashboard');
const [dashboardState, setDashboardState] = useState({
    data: sampleData,
    filters: {
    isOpen: false,
    activeFilters: {}
    }
});

useEffect(() => {
    if (dashboardState.data.length > 0) {
    const fields = Object.keys(dashboardState.data[0]);
    const initialFilters = Object.fromEntries(fields.map(field => [field, null]));
    setDashboardState(prev => ({
        ...prev,
        filters: {
        ...prev.filters,
        activeFilters: initialFilters
>>>>>>> Stashed changes
        }
    }));
    }
}, [dashboardState.data]);

<<<<<<< Updated upstream
        setIsModalOpen(false);
        setActiveTab('dashboard'); 
=======
const filteredData = useMemo(() => {
    return dashboardState.data.filter(item => {
    return Object.entries(dashboardState.filters.activeFilters).every(([field, filterValue]) => {
        if (filterValue === null || filterValue === '' || filterValue === undefined) return true;
        const itemValue = item[field];
        if (Array.isArray(filterValue) && filterValue.length === 2) {
        const [start, end] = filterValue;
        if (!start && !end) return true;
        const itemDate = new Date(itemValue);
        if (start && !end) return itemDate >= start;
        if (!start && end) return itemDate <= end;
        return itemDate >= start && itemDate <= end;
        }
        return String(itemValue).toLowerCase() === String(filterValue).toLowerCase();
    });
    });
}, [dashboardState]);
>>>>>>> Stashed changes

const removeFilter = (key) => {
    setDashboardState(prev => {
    const updated = { ...prev.filters.activeFilters };
    updated[key] = null;
    return {
        ...prev,
        filters: {
        ...prev.filters,
        activeFilters: updated
        }
    };
<<<<<<< Updated upstream

    const navigateToDashboard = () => {
        setActiveTab('dashboard'); 
    };

    return (
        <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
            <Navbar navigateToDashboard={navigateToDashboard} />

            {/* Switch positioned below the Navbar */}
            <div className="flex items-center space-x-2 mt-4 ml-4">
                <span className="text-sm text-black dark:text-white">Dashboard</span>
                <Switch
                    id="feature-switch"
                    checked={isFeatureEnabled}
                    onChange={handleSwitchChange}
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
                                        className={`dashboard-card col-span-1 h-[520px] cursor-pointer hover:shadow-lg transition-shadow ${
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

            {/* Ny analys button positioned slightly above the footer */}
            <button
                className="fixed bottom-16 right-4 bg-[#26A69A] text-white p-4 rounded-full shadow hover:bg-opacity-90 flex items-center justify-center group transform transition-transform duration-500 hover:scale-110"
                onClick={() => setIsModalOpen(true)}
            >
                <span className="hidden group-hover:inline-block mr-2 text-sm">Ny analys</span>
                <FontAwesomeIcon icon={faPlus} className="h-6 w-6" />
            </button>

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
=======
    });
    toast.info(`Filter removed: ${key}`);
};

const applyFilters = (filters) => {
    setDashboardState(prev => ({
    ...prev,
    filters: {
        ...prev.filters,
        activeFilters: filters
    }
    }));
    const count = Object.values(filters).filter(val => val !== null && val !== '' && !(Array.isArray(val) && val[0] === null && val[1] === null)).length;
    count > 0 ? toast.success(`Filters applied: ${count}`) : toast.info("All filters cleared");
};

const lineChartData = useMemo(() => {
    const grouped = {};
    filteredData.forEach(item => {
    const date = item.fakturadatum;
    const amount = parseFloat(item.totalbelopp);
    if (date) {
        if (!grouped[date]) grouped[date] = 0;
        grouped[date] += amount;
    }
    });
    return Object.entries(grouped).map(([date, value]) => ({ name: date, value }));
}, [filteredData]);

return (
    <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
    <Navbar setIsModalOpen={setIsUploadOpen} />
    <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow flex">
        <section className="w-full">
        {/* Filter Button */}
        <div className="flex justify-end mb-4">
            <button
            onClick={() => setDashboardState(prev => ({
                ...prev,
                filters: { ...prev.filters, isOpen: true }
            }))}
            className="flex items-center bg-teal-500 hover:bg-teal-600 text-white px-4 py-2 rounded-md shadow"
            >
            <Filter className="mr-2 h-4 w-4" />
            Filter
            </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
            <TabsTrigger value="data">Data Table</TabsTrigger>
            <TabsTrigger value="insights">AI Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
            <ActiveFilters filters={dashboardState.filters.activeFilters} removeFilter={removeFilter} />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DataVisualizer chartData={filteredData.map(d => ({ name: d.mottagare, value: d.totalbelopp }))} chartType="bar" />
                <DataVisualizer chartData={filteredData.map(d => ({ name: d.mottagare, value: d.fakturabelopp }))} chartType="pie" />
            </div>
            <DataVisualizer chartData={lineChartData} chartType="line" />
            </TabsContent>

            <TabsContent value="data" className="space-y-6">
            <ActiveFilters filters={dashboardState.filters.activeFilters} removeFilter={removeFilter} />
            <DataTable data={filteredData} />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
            <ActiveFilters filters={dashboardState.filters.activeFilters} removeFilter={removeFilter} />
            <AIInsights data={filteredData} />
            </TabsContent>
        </Tabs>
        </section>
    </main>

    <FilterPanel
        isOpen={dashboardState.filters.isOpen}
        onClose={() => setDashboardState(prev => ({
        ...prev,
        filters: { ...prev.filters, isOpen: false }
        }))}
        data={dashboardState.data}
        onApplyFilters={applyFilters}
        activeFilters={dashboardState.filters.activeFilters}
    />
    </div>
);
};

export default Index;
>>>>>>> Stashed changes
