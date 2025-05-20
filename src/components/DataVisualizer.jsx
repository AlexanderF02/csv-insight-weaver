
import React, { useState, useEffect } from 'react';
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle
} from "@/components/ui/card";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie
} from 'recharts';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

const DataVisualizer = ({ chartData, chartType = 'bar' }) => {
  const [filteredData, setFilteredData] = useState([]);
  const [showFilters, setShowFilters] = useState(chartType === 'bar');
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    fakturanummer: '',
    referens: '',
    fakturatyp: '',
    fakturaformat: '',
    valuta: '',
    mottagare: '',
    leverantor: ''
  });

  const [kostnadsstalleList, setKostnadsstalleList] = useState([]);
  const [dropdownValues, setDropdownValues] = useState({
    valuta: [],
    mottagare: [],
    leverantor: []
  });

  // Extract dropdown options from CSV data
  useEffect(() => {
    if (chartData && chartData.length > 0) {
      setFilteredData(chartData);

      const getUniqueValues = (key) => [...new Set(chartData.map(item => item[key]).filter(Boolean))];

      const normalizeKey = (label) => {
        const match = Object.keys(chartData[0] || {}).find(k =>
          k.trim().toLowerCase() === label.trim().toLowerCase()
        );
        return match || label;
      };
      
      setDropdownValues({
        valuta: getUniqueValues(normalizeKey("valuta")),
        mottagare: getUniqueValues(normalizeKey("mottagare")),
        leverantor: getUniqueValues(normalizeKey("leverantor"))
      });      
      
    }
  }, [chartData]);

  // Fetch Kostnadsställe from API
  // Mock Kostnadsställe instead of calling API
useEffect(() => {
  async function loadKostnadsstalle() {
    try {
      const mockData = [
        "Marknadsavdelning", "B2B", "Projektledare", "Projekt Crion",
        "Ekonomi & Redovisning", "Inköp", "Region Väst",
        "Produktionsavdelning", "Bygg"
      ];
      setKostnadsstalleList(mockData);
    } catch (err) {
      console.error("Failed to load Kostnadsställe", err);
    }
  }

  loadKostnadsstalle();
}, []);


  const handleApplyFilter = () => {
    let filtered = chartData;

    if (filters.fakturanummer)
      filtered = filtered.filter(d => d.Fakturanummer?.toString().includes(filters.fakturanummer));

    if (filters.referens)
      filtered = filtered.filter(d => d["koparens_referens"]?.toString().includes(filters.referens));
    
    if (filters.fakturatyp)
      filtered = filtered.filter(d => d["fakturatyp"] === filters.fakturatyp);

    if (filters.fakturaformat)
      filtered = filtered.filter(d => d["fakturaformat"] === filters.fakturaformat);

    if (filters.valuta)
      filtered = filtered.filter(d => d.Valuta === filters.valuta);

    if (filters.mottagare)
      filtered = filtered.filter(d => d.Mottagare === filters.mottagare);

    if (filters.leverantor)
      filtered = filtered.filter(d => d["leverantor"] === filters.leverantor);

    setFilteredData(filtered);
  };

  const handleChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
  };

  const renderBasicFilters = () => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-scroll ">
      <Input placeholder="Fakturanummer" onChange={(e) => handleChange("fakturanummer", e.target.value)} />
      <Input placeholder="Köparens referens" onChange={(e) => handleChange("referens", e.target.value)} />

      <Select onValueChange={(val) => handleChange("fakturatyp", val)}>
        <SelectTrigger><SelectValue placeholder="Fakturatyp" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="Debit">Debit</SelectItem>
          <SelectItem value="Kredit">Kredit</SelectItem>
        </SelectContent>
      </Select>

      <Select onValueChange={(val) => handleChange("fakturaformat", val)}>
        <SelectTrigger><SelectValue placeholder="Fakturaformat" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="PDF">PDF</SelectItem>
          <SelectItem value="Peppol">Peppol</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderAdvancedFilters = () => (
    <div className="max-h-[550px] overflow-y-scroll border rounded-md p-4 bg-gray-50 dark:bg-gray-800 mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Select onValueChange={(val) => handleChange("leverantor", val)}>
          <SelectTrigger><SelectValue placeholder="Leverantör" className="bg-gradient-to-r"/></SelectTrigger>
          <SelectContent>
            {dropdownValues.leverantor.map((val, i) => (
              <SelectItem key={i} value={val}>{val}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => handleChange("valuta", val)}>
          <SelectTrigger><SelectValue placeholder="Valuta" className="bg-[#aff7f0]"/></SelectTrigger>
          <SelectContent>
            {dropdownValues.valuta.map((val, i) => (
              <SelectItem key={i} value={val}>{val}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select onValueChange={(val) => handleChange("mottagare", val)}>
          <SelectTrigger><SelectValue placeholder="Mottagare" className="bg-[#aff7f0]" /></SelectTrigger>
          <SelectContent>
            {dropdownValues.mottagare.map((val, i) => (
              <SelectItem key={i} value={val}>{val}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger><SelectValue placeholder="Kostnadsställe" /></SelectTrigger>
          <SelectContent>
            {kostnadsstalleList.map((val, i) => (
              <SelectItem key={i} value={val}>{val}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );

  return (
    <Card className="relative">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>{chartType === 'bar' ? 'Bar Chart' : 'Pie Chart'}</CardTitle>
          <CardDescription>Visual representation of your data</CardDescription>
        </div>
        {chartType === 'bar' && (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
              <Filter className="mr-2 h-4 w-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {showFilters && chartType === 'bar' && (
          <div className="space-y-4 mb-6">
            {renderBasicFilters()}
            <div className="flex justify-between items-center pt-2">
              <Button onClick={handleApplyFilter}>Apply Filter</Button>
              <Button variant="outline" className="text-sm" onClick={() => setShowAdvanced(!showAdvanced)}>
                {showAdvanced ? 'Hide Advanced Filter' : 'Advanced Filter'}
              </Button>
            </div>
            {showAdvanced && renderAdvancedFilters()}
          </div>
        )}
        <div className="w-full h-[400px]">
          {chartType === 'bar' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#26A69A" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={filteredData} dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label />
                {/* <Pie  dataKey="value" nameKey="label" cx="50%" cy="50%" outerRadius={100} fill="#8884d8" label /> */}
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default DataVisualizer;
