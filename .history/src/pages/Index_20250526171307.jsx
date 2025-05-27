// Merged and cleaned version
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useToast } from "../hooks/use-toast";
import { Dialog } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Filter, X } from 'lucide-react';
import { format } from 'date-fns';

import Navbar from "../components/Navbar";
import { Calendar } from '@/components/Calendar';
import ChartCard from '../components/dashboard/ChartCard.tsx';
import DataTable from '../components/dashboard/DataTable.tsx';
import AIInsights from '@/components/dashboard/AIInsights';
import FilterPanel from '../components/FilterPanel.jsx';
import CSVUploader from '../components/CSVUploader.jsx';
import { Badge } from '@/components/ui/badge';

// Sample data to show initially
const sampleData = [
    { fakturanummer: '5003774819', mottagare: 'ACME 11 AB', totalbelopp: 1951.31, momsbelopp: 487.83, fakturabelopp: 2439, valuta: 'SEK', fakturadatum: '2025-01-01', fakturatyp: 'Invoice', fakturaformat: 'PDF' },
    { fakturanummer: '5003787411', mottagare: 'ACME 25 AB', totalbelopp: 2174.58, momsbelopp: 284.25, fakturabelopp: 1421, valuta: 'SEK', fakturadatum: '2025-01-01', fakturatyp: 'Invoice', fakturaformat: 'PDF' },
    { fakturanummer: '5003778225', mottagare: 'ACME 52 AB', totalbelopp: 4440.9, momsbelopp: 944.08, fakturabelopp: 4720, valuta: 'SEK', fakturadatum: '2025-01-01', fakturatyp: 'Invoice', fakturaformat: 'PDF' },
    { fakturanummer: '5003774821', mottagare: 'ACME 11 AB', totalbelopp: 2150.31, momsbelopp: 456.83, fakturabelopp: 2607, valuta: 'SEK', fakturadatum: '2025-02-15', fakturatyp: 'Invoice', fakturaformat: 'PDF' },
    { fakturanummer: '5003787415', mottagare: 'ACME 25 AB', totalbelopp: 3264.58, momsbelopp: 652.25, fakturabelopp: 3917, valuta: 'SEK', fakturadatum: '2025-02-28', fakturatyp: 'Invoice', fakturaformat: 'Peppol' },
    { fakturanummer: '7003787415', mottagare: 'Test AB', totalbelopp: 123264.58, momsbelopp: 123652.25, fakturabelopp: 323917, valuta: 'SEK', fakturadatum: '2025-05-26', fakturatyp: 'Debit', fakturaformat: 'Peppol' }
    ];

    const Index = () => {
    const [data, setData] = useState(sampleData);
    const [filters, setFilters] = useState({});
    const [activeTab, setActiveTab] = useState('dashboard');
    const [isFeatureEnabled, setIsFeatureEnabled] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());

    const { toast } = useToast();
    const navigate = useNavigate();

    const filteredData = useMemo(() => {
        return data.filter(item => {
        return Object.entries(filters).every(([key, val]) => {
            if (val === null || val === '' || val === undefined) return true;
            if (Array.isArray(val) && val.length === 2) {
            const [start, end] = val;
            const itemDate = new Date(item[key]);
            if (!start && !end) return true;
            if (start && !end) return itemDate >= start;
            if (!start && end) return itemDate <= end;
            return itemDate >= start && itemDate <= end;
            }
            return String(item[key]).toLowerCase() === String(val).toLowerCase();
        });
        });
    }, [data, filters]);

    const handleSwitchChange = (checked) => {
        setIsFeatureEnabled(checked);
        setEditMode(checked);
        if (checked) navigate("/editdashboard");
    };

    const removeFilter = (key) => {
        const newFilters = { ...filters };
        newFilters[key] = null;
        setFilters(newFilters);
        toast.info(`Filter removed: ${key}`);
    };

    return (
        <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
        <Navbar navigateToDashboard={() => setActiveTab('dashboard')} setIsModalOpen={() => {}} />
        <div className="flex items-center justify-between mt-4 px-4">
            <div className="flex items-center space-x-2">
            <span className="text-sm text-black dark:text-white">Dashboard</span>
            <Switch
                id="feature-switch"
                checked={isFeatureEnabled}
                onCheckedChange={handleSwitchChange}
            />
            <span className="text-sm text-black dark:text-white">Redigering</span>
            </div>
            <Button
            onClick={() => setIsCalendarOpen(!isCalendarOpen)}
            className="bg-teal-500 text-white hover:bg-teal-600"
            >
            Filter
            </Button>
        </div>

        {isCalendarOpen && (
            <FilterPanel
            isOpen={isCalendarOpen}
            onClose={() => setIsCalendarOpen(false)}
            data={data}
            onApplyFilters={setFilters}
            activeFilters={filters}
            showClearButton={true}
            />
        )}

        <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow flex">
            <section className="w-full">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid grid-cols-3 w-full max-w-xl mx-auto mb-8">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="data">Data Table</TabsTrigger>
                <TabsTrigger value="insights">AI Insights</TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                <div className="dashboard-card flex justify-between items-center p-6 rounded-lg shadow-lg bg-gradient-to-r from bg-[#26A69A] text-white mb-6">
                    <div className="flex items-center">
                    <img src="/esyn.png" alt="Logo" className="h-12 w-auto mr-4" />
                    <div>
                        <h1 className="text-2xl font-bold">Välkommen!</h1>
                        <p className="text-sm">Till din dashboard</p>
                    </div>
                    </div>

                    <div className="flex items-center space-x-8">
                    <div className="text-center">
                        <h2 className="text-xl font-bold">Totalt belopp</h2>
                        <p className="text-lg">SEK {filteredData.reduce((sum, item) => sum + item.totalbelopp, 0).toFixed(2)}</p>
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold">Fakturor</h2>
                        <p className="text-lg">{filteredData.length}</p>
                    </div>
                    <div className="text-center">
                        <h2 className="text-xl font-bold">Unika Företag</h2>
                        <p className="text-lg">{new Set(filteredData.map(item => item.mottagare)).size}</p>
                    </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ChartCard
                    title="Bar Chart"
                    data={filteredData}
                    type="bar"
                    dataKey="totalbelopp"
                    nameKey="mottagare"
                    />
                    <ChartCard
                    title="Line Chart"
                    data={filteredData}
                    type="line"
                    dataKey="totalbelopp"
                    nameKey="fakturadatum"
                    />
                </div>
                <ChartCard
                    title="Pie Chart"
                    data={filteredData}
                    type="pie"
                    dataKey="fakturabelopp"
                    nameKey="mottagare"
                />
                </TabsContent>

                <TabsContent value="data" className="space-y-6">
                <DataTable data={filteredData} />
                </TabsContent>

                <TabsContent value="insights" className="space-y-6">
                <AIInsights data={filteredData} />
                </TabsContent>
            </Tabs>
            </section>
        </main>
        </div>
    );
};

export default Index;
