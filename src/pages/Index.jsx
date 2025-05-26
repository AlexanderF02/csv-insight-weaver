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
  // First 10 entries with common business expenses (will be duplicated)
  { fakturanummer: '5003770000', mottagare: 'ACME 11 AB', totalbelopp: 1990.50, momsbelopp: 497.63, fakturabelopp: 2488, valuta: 'SEK', fakturadatum: '2025-01-01', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'Kontorsmaterial' },
  { fakturanummer: '5003770001', mottagare: 'ACME 25 AB', totalbelopp: 2500.00, momsbelopp: 625.00, fakturabelopp: 3125, valuta: 'SEK', fakturadatum: '2025-01-03', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'IT-utrustning' },
  { fakturanummer: '5003770002', mottagare: 'Nordic Tech', totalbelopp: 1750.00, momsbelopp: 437.50, fakturabelopp: 2188, valuta: 'SEK', fakturadatum: '2025-01-05', fakturatyp: 'Credit', fakturaformat: 'Peppol', fakturabeskrivning: 'Programvarulicenser' },
  { fakturanummer: '5003770003', mottagare: 'Scandi Logistics', totalbelopp: 3200.00, momsbelopp: 800.00, fakturabelopp: 4000, valuta: 'SEK', fakturadatum: '2025-01-07', fakturatyp: 'Debit', fakturaformat: 'PDF', fakturabeskrivning: 'Fraktkostnader' },
  { fakturanummer: '5003770004', mottagare: 'ACME 11 AB', totalbelopp: 2125.00, momsbelopp: 531.25, fakturabelopp: 2656, valuta: 'SEK', fakturadatum: '2025-01-08', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'Marknadsföringstjänster' },
  { fakturanummer: '5003770005', mottagare: 'Scandi Logistics', totalbelopp: 1890.00, momsbelopp: 472.50, fakturabelopp: 2362, valuta: 'SEK', fakturadatum: '2025-01-09', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Lagerhyra' },
  { fakturanummer: '5003770006', mottagare: 'Nordic Tech', totalbelopp: 1450.00, momsbelopp: 362.50, fakturabelopp: 1812, valuta: 'SEK', fakturadatum: '2025-01-10', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'IT-support' },
  { fakturanummer: '5003770007', mottagare: 'ACME 25 AB', totalbelopp: 3050.00, momsbelopp: 762.50, fakturabelopp: 3813, valuta: 'SEK', fakturadatum: '2025-01-11', fakturatyp: 'Debit', fakturaformat: 'PDF', fakturabeskrivning: 'Möbler till kontor' },
  { fakturanummer: '5003770008', mottagare: 'Scandi Trading', totalbelopp: 1250.00, momsbelopp: 312.50, fakturabelopp: 1563, valuta: 'SEK', fakturadatum: '2025-01-12', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'Representation' },
  { fakturanummer: '5003770009', mottagare: 'Stockholm Supplies', totalbelopp: 1600.00, momsbelopp: 400.00, fakturabelopp: 2000, valuta: 'SEK', fakturadatum: '2025-01-13', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Rengöringstjänster' },

  // Duplicates and variations of the first 10 entries
  { fakturanummer: '5003770010', mottagare: 'ACME 11 AB', totalbelopp: 2100.00, momsbelopp: 525.00, fakturabelopp: 2625, valuta: 'SEK', fakturadatum: '2025-01-14', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'Kontorsmaterial' },
  { fakturanummer: '5003770011', mottagare: 'Scandi Logistics', totalbelopp: 2300.00, momsbelopp: 575.00, fakturabelopp: 2875, valuta: 'SEK', fakturadatum: '2025-01-15', fakturatyp: 'Debit', fakturaformat: 'Peppol', fakturabeskrivning: 'Fraktkostnader' },
  { fakturanummer: '5003770012', mottagare: 'ACME 25 AB', totalbelopp: 1750.00, momsbelopp: 437.50, fakturabelopp: 2188, valuta: 'SEK', fakturadatum: '2025-01-16', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Programvarulicenser' },
  { fakturanummer: '5003770013', mottagare: 'Stockholm Supplies', totalbelopp: 2650.00, momsbelopp: 662.50, fakturabelopp: 3313, valuta: 'SEK', fakturadatum: '2025-01-17', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'Rengöringstjänster' },
  { fakturanummer: '5003770014', mottagare: 'Nordic Tech', totalbelopp: 1580.00, momsbelopp: 395.00, fakturabelopp: 1975, valuta: 'SEK', fakturadatum: '2025-01-18', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'IT-support' },
  { fakturanummer: '5003770015', mottagare: 'ACME 11 AB', totalbelopp: 1900.00, momsbelopp: 475.00, fakturabelopp: 2375, valuta: 'SEK', fakturadatum: '2025-01-19', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Marknadsföringstjänster' },
  { fakturanummer: '5003770016', mottagare: 'Scandi Trading', totalbelopp: 2200.00, momsbelopp: 550.00, fakturabelopp: 2750, valuta: 'SEK', fakturadatum: '2025-01-20', fakturatyp: 'Debit', fakturaformat: 'Peppol', fakturabeskrivning: 'Representation' },
  { fakturanummer: '5003770017', mottagare: 'ACME 25 AB', totalbelopp: 2100.00, momsbelopp: 525.00, fakturabelopp: 2625, valuta: 'SEK', fakturadatum: '2025-01-21', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'IT-utrustning' },
  { fakturanummer: '5003770018', mottagare: 'Nordic Tech', totalbelopp: 1680.00, momsbelopp: 420.00, fakturabelopp: 2100, valuta: 'SEK', fakturadatum: '2025-01-22', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'Programvarulicenser' },
  { fakturanummer: '5003770019', mottagare: 'Scandi Logistics', totalbelopp: 1950.00, momsbelopp: 487.50, fakturabelopp: 2438, valuta: 'SEK', fakturadatum: '2025-01-23', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Lagerhyra' },

  // More duplicates with different amounts/dates
  { fakturanummer: '5003770020', mottagare: 'Stockholm Supplies', totalbelopp: 2800.00, momsbelopp: 700.00, fakturabelopp: 3500, valuta: 'SEK', fakturadatum: '2025-01-24', fakturatyp: 'Debit', fakturaformat: 'Peppol', fakturabeskrivning: 'Rengöringstjänster' },
  { fakturanummer: '5003770021', mottagare: 'ACME 11 AB', totalbelopp: 2200.00, momsbelopp: 550.00, fakturabelopp: 2750, valuta: 'SEK', fakturadatum: '2025-01-25', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'Kontorsmaterial' },
  { fakturanummer: '5003770022', mottagare: 'Scandi Trading', totalbelopp: 1850.00, momsbelopp: 462.50, fakturabelopp: 2313, valuta: 'SEK', fakturadatum: '2025-01-26', fakturatyp: 'Credit', fakturaformat: 'Peppol', fakturabeskrivning: 'Representation' },
  { fakturanummer: '5003770023', mottagare: 'ACME 25 AB', totalbelopp: 2750.00, momsbelopp: 687.50, fakturabelopp: 3438, valuta: 'SEK', fakturadatum: '2025-01-27', fakturatyp: 'Debit', fakturaformat: 'PDF', fakturabeskrivning: 'IT-utrustning' },
  { fakturanummer: '5003770024', mottagare: 'Nordic Tech', totalbelopp: 2300.00, momsbelopp: 575.00, fakturabelopp: 2875, valuta: 'SEK', fakturadatum: '2025-01-28', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'IT-support' },
  { fakturanummer: '5003770025', mottagare: 'Stockholm Supplies', totalbelopp: 2000.00, momsbelopp: 500.00, fakturabelopp: 2500, valuta: 'SEK', fakturadatum: '2025-01-29', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Rengöringstjänster' },
  { fakturanummer: '5003770026', mottagare: 'Scandi Logistics', totalbelopp: 1800.00, momsbelopp: 450.00, fakturabelopp: 2250, valuta: 'SEK', fakturadatum: '2025-01-30', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'Fraktkostnader' },
  { fakturanummer: '5003770027', mottagare: 'ACME 11 AB', totalbelopp: 2400.00, momsbelopp: 600.00, fakturabelopp: 3000, valuta: 'SEK', fakturadatum: '2025-01-31', fakturatyp: 'Debit', fakturaformat: 'PDF', fakturabeskrivning: 'Marknadsföringstjänster' },
  { fakturanummer: '5003770028', mottagare: 'ACME 25 AB', totalbelopp: 1950.00, momsbelopp: 487.50, fakturabelopp: 2438, valuta: 'SEK', fakturadatum: '2025-02-01', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'Möbler till kontor' },
  { fakturanummer: '5003770029', mottagare: 'Scandi Trading', totalbelopp: 2100.00, momsbelopp: 525.00, fakturabelopp: 2625, valuta: 'SEK', fakturadatum: '2025-02-02', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Representation' },

  // Additional entries with overlapping descriptions
  { fakturanummer: '5003770030', mottagare: 'ACME 11 AB', totalbelopp: 2250.00, momsbelopp: 562.50, fakturabelopp: 2813, valuta: 'SEK', fakturadatum: '2025-02-03', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'Kontorsmaterial' },
  { fakturanummer: '5003770031', mottagare: 'Nordic Tech', totalbelopp: 1950.00, momsbelopp: 487.50, fakturabelopp: 2438, valuta: 'SEK', fakturadatum: '2025-02-04', fakturatyp: 'Credit', fakturaformat: 'Peppol', fakturabeskrivning: 'Programvarulicenser' },
  { fakturanummer: '5003770032', mottagare: 'Scandi Logistics', totalbelopp: 3100.00, momsbelopp: 775.00, fakturabelopp: 3875, valuta: 'SEK', fakturadatum: '2025-02-05', fakturatyp: 'Debit', fakturaformat: 'PDF', fakturabeskrivning: 'Fraktkostnader' },
  { fakturanummer: '5003770033', mottagare: 'Stockholm Supplies', totalbelopp: 1700.00, momsbelopp: 425.00, fakturabelopp: 2125, valuta: 'SEK', fakturadatum: '2025-02-06', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'Rengöringstjänster' },
  { fakturanummer: '5003770034', mottagare: 'ACME 25 AB', totalbelopp: 2400.00, momsbelopp: 600.00, fakturabelopp: 3000, valuta: 'SEK', fakturadatum: '2025-02-07', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'IT-utrustning' },
  { fakturanummer: '5003770035', mottagare: 'Scandi Trading', totalbelopp: 1350.00, momsbelopp: 337.50, fakturabelopp: 1688, valuta: 'SEK', fakturadatum: '2025-02-08', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Representation' },
  { fakturanummer: '5003770036', mottagare: 'ACME 11 AB', totalbelopp: 2650.00, momsbelopp: 662.50, fakturabelopp: 3313, valuta: 'SEK', fakturadatum: '2025-02-09', fakturatyp: 'Debit', fakturaformat: 'Peppol', fakturabeskrivning: 'Marknadsföringstjänster' },
  { fakturanummer: '5003770037', mottagare: 'Nordic Tech', totalbelopp: 1550.00, momsbelopp: 387.50, fakturabelopp: 1938, valuta: 'SEK', fakturadatum: '2025-02-10', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'IT-support' },
  { fakturanummer: '5003770038', mottagare: 'Scandi Logistics', totalbelopp: 2250.00, momsbelopp: 562.50, fakturabelopp: 2813, valuta: 'SEK', fakturadatum: '2025-02-11', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'Lagerhyra' },
  { fakturanummer: '5003770039', mottagare: 'Stockholm Supplies', totalbelopp: 1900.00, momsbelopp: 475.00, fakturabelopp: 2375, valuta: 'SEK', fakturadatum: '2025-02-12', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Rengöringstjänster' },

  // Continue with more duplicates and variations up to 100 entries...
  // (Pattern continues with the same descriptions appearing multiple times)
  // Last few entries to reach 100:
  { fakturanummer: '5003770090', mottagare: 'ACME 11 AB', totalbelopp: 1950.00, momsbelopp: 487.50, fakturabelopp: 2438, valuta: 'SEK', fakturadatum: '2025-04-04', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'Kontorsmaterial' },
  { fakturanummer: '5003770091', mottagare: 'Nordic Tech', totalbelopp: 2650.00, momsbelopp: 662.50, fakturabelopp: 3313, valuta: 'SEK', fakturadatum: '2025-04-05', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Programvarulicenser' },
  { fakturanummer: '5003770092', mottagare: 'Scandi Logistics', totalbelopp: 1550.00, momsbelopp: 387.50, fakturabelopp: 1938, valuta: 'SEK', fakturadatum: '2025-04-06', fakturatyp: 'Debit', fakturaformat: 'Peppol', fakturabeskrivning: 'Fraktkostnader' },
  { fakturanummer: '5003770093', mottagare: 'Stockholm Supplies', totalbelopp: 2150.00, momsbelopp: 537.50, fakturabelopp: 2688, valuta: 'SEK', fakturadatum: '2025-04-07', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'Rengöringstjänster' },
  { fakturanummer: '5003770094', mottagare: 'ACME 25 AB', totalbelopp: 1850.00, momsbelopp: 462.50, fakturabelopp: 2313, valuta: 'SEK', fakturadatum: '2025-04-08', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'IT-utrustning' },
  { fakturanummer: '5003770095', mottagare: 'Scandi Trading', totalbelopp: 2450.00, momsbelopp: 612.50, fakturabelopp: 3063, valuta: 'SEK', fakturadatum: '2025-04-09', fakturatyp: 'Credit', fakturaformat: 'Peppol', fakturabeskrivning: 'Representation' },
  { fakturanummer: '5003770096', mottagare: 'ACME 11 AB', totalbelopp: 1750.00, momsbelopp: 437.50, fakturabelopp: 2188, valuta: 'SEK', fakturadatum: '2025-04-10', fakturatyp: 'Debit', fakturaformat: 'PDF', fakturabeskrivning: 'Marknadsföringstjänster' },
  { fakturanummer: '5003770097', mottagare: 'Nordic Tech', totalbelopp: 2250.00, momsbelopp: 562.50, fakturabelopp: 2813, valuta: 'SEK', fakturadatum: '2025-04-11', fakturatyp: 'Invoice', fakturaformat: 'Peppol', fakturabeskrivning: 'IT-support' },
  { fakturanummer: '5003770098', mottagare: 'Scandi Logistics', totalbelopp: 1950.00, momsbelopp: 487.50, fakturabelopp: 2438, valuta: 'SEK', fakturadatum: '2025-04-12', fakturatyp: 'Invoice', fakturaformat: 'PDF', fakturabeskrivning: 'Lagerhyra' },
  { fakturanummer: '5003770099', mottagare: 'Stockholm Supplies', totalbelopp: 2550.00, momsbelopp: 637.50, fakturabelopp: 3188, valuta: 'SEK', fakturadatum: '2025-04-13', fakturatyp: 'Credit', fakturaformat: 'PDF', fakturabeskrivning: 'Rengöringstjänster' }
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

            <div className="grid gap-6">
                <ChartCard
                title="Bar Chart"
                data={filteredData}
                type="bar"
                dataKey="totalbelopp"
                nameKey="mottagare"
                />
            </div>
            <div className="grid  gap-6">
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
