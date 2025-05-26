
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
        className="bg-dark-400 dark:bg-black w-full max-w-sm ml-auto h-full overflow-y-auto shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-dark-300">
          <div className="flex items-center">
            <Filter className="mr-2" size={18} />
            <h2 className="text-xl font-semibold">Filter</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X size={18} />
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
          
          <div className="space-y-3">
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
  
  // For date range picker
  const dateValue = value || [null, null];
  
  if (isDateField) {
    return (
      <div className="rounded-md bg-white text-dark-500">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="w-full justify-between font-normal bg-white hover:bg-gray-100 border-0"
            >
              <span className="text-gray-800">{field}</span>
              <ChevronDown size={16} className={cn("ml-2 transition", isOpen ? "transform rotate-180" : "")} />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="range"
              selected={{
                from: dateValue[0] || undefined,
                to: dateValue[1] || undefined,
              }}
              onSelect={(range) => {
                onChange(range ? [range.from || null, range.to || null] : [null, null]);
              }}
              initialFocus
              className={cn("p-3 pointer-events-auto")}
            />
            <div className="flex justify-end gap-2 p-2 border-t">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  onChange([null, null]);
                  setIsOpen(false);
                }}
              >
                Clear
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsOpen(false)}
              >
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  }
  
  // For numeric or text fields
  return (
    <div className="rounded-md bg-white text-dark-500">
      <Select 
        value={value?.toString() || "_all"}
        onValueChange={(newValue) => onChange(newValue === "_all" ? null : newValue)}
      >
        <SelectTrigger className="w-full bg-white border-0">
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
