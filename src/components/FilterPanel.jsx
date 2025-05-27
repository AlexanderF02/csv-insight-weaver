
import { useState, useEffect } from 'react';
import { X, ChevronDown, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

const FilterPanel = ({
  isOpen,
  onClose,
  data,
  onApplyFilters,
  activeFilters
}) => {
  const [localFilters, setLocalFilters] = useState(activeFilters);
  
  // Reset local filters when panel opens
  useEffect(() => {
    if (isOpen) {
      setLocalFilters(activeFilters);
    }
  }, [isOpen, activeFilters]);
  
  // Get unique fields from data
  const fields = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== '')
    : [];
  
  // Handle filter change
  const handleFilterChange = (field, value) => {
    setLocalFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Apply filters
  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    toast.success("Filters applied successfully");
    onClose();
  };
  
  // Reset filters
  const handleResetFilters = () => {
    const emptyFilters = Object.fromEntries(
      fields.map(field => [field, null])
    );
    setLocalFilters(emptyFilters);
    onApplyFilters(emptyFilters);
    toast.info("All filters reset");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex bg-black/50" onClick={onClose}>
      <div 
        className="bg-white dark:bg-gray-900 dark:text-white w-full max-w-sm ml-auto h-full overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-300 bg-white dark:bg-gray-900">
          <div className="flex items-center">
            <Filter className="mr-2 text-black dark:text-white" size={18} />	
            <h2 className="text-xl font-semibold text-black dark:text-white">Filter</h2>
          </div>
          <Button className="color-black dark:color-white" variant="ghost" size="icon" onClick={onClose}>
            <X size={18} className="text-black dark:text-white" />
          </Button>
        </div>
        
        <div className="p-4">
          <div className="mb-6">
            <Button
              onClick={handleApplyFilters}
              className="w-full bg-teal-500 hover:bg-teal-600 font-medium"
            >
              Applicera filter
            </Button>
          </div>
          
          <div className="space-y-3 bg">
            {fields.map((field) => (
              <FilterField
                key={field}
                field={field}
                value={localFilters[field] || null}
                onChange={(value) => handleFilterChange(field, value)}
                data={data}
              />
            ))}
          </div>
        </div>
        
        <div className="p-4 border-t border-dark-300 mt-4">
          <Button 
            variant="outline" 
            className="w-full text-white border-white/20"
            onClick={handleResetFilters}
          >
            Reset all filters
          </Button>
        </div>
      </div>
    </div>
  );
};

// Helper component for individual filter fields
const FilterField = ({ field, value, onChange, data }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Get unique values for this field and filter out undefined, null, or empty values
  const uniqueValues = Array.from(new Set(
    data.map(item => {
      const itemValue = item[field];
      // Convert undefined to empty string to make it consistent
      return itemValue === undefined ? '' : itemValue;
    })
  )).filter(val => val !== null && val !== undefined && val !== '').sort();
  
  // Detect if field contains dates
  const isDateField = 
    field.toLowerCase().includes('date') || 
    field.toLowerCase().includes('datum');
  
  
  // For numeric or text fields
  return (
    <div className="rounded-md bg-white dark:bg-gray-900 text-dark-500">
      <Select 
        value={value?.toString() || "_all"}
        onValueChange={(newValue) => onChange(newValue === "_all" ? null : newValue)}
      >
        <SelectTrigger className="w-full bg-white dark:bg-gray-900 dark:text-white border-0">
          <SelectValue placeholder={field} />
        </SelectTrigger>
        <SelectContent className="max-h-72">
          <SelectItem value="_all">All {field}</SelectItem>
          {uniqueValues.length > 0 ? (
            uniqueValues.map((val) => (
              <SelectItem key={`${val}`} value={`${val}`}>
                {val ? `${val}` : "(Empty)"}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="no_data_available" disabled>No data available</SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

export default FilterPanel;
