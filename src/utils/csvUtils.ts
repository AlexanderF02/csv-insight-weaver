
import { DataItem } from '@/types';

/**
 * Parse CSV string into array of objects
 */
export const parseCSV = (csvContent: string): DataItem[] => {
  try {
    // Determine delimiter (comma or semicolon)
    const delimiter = csvContent.includes(';') ? ';' : ',';
    
    // Split into rows
    const rows = csvContent
      .trim()
      .split('\n')
      .map(row => row.split(delimiter));
    
    // Extract headers from first row
    const headers = rows[0].map(header => 
      header.trim().replace(/^["']|["']$/g, '') // Remove quotes
    );
    
    // Convert data rows to objects
    const data = rows.slice(1).map(row => {
      const rowData: DataItem = {};
      
      headers.forEach((header, index) => {
        // Make sure the header is not empty
        if (!header) return;
        
        // Clean the cell value
        let cellValue = row[index] ? row[index].trim().replace(/^["']|["']$/g, '') : '';
        
        // Convert "None" strings to empty string
        if (cellValue === 'None' || cellValue === 'n/a') {
          cellValue = '';
        }
        
        // Try to convert to number if it looks like a number
        if (/^-?\d+(\.\d+)?$/.test(cellValue)) {
          rowData[header] = parseFloat(cellValue);
        } else {
          rowData[header] = cellValue;
        }
      });
      
      return rowData;
    });
    
    // Log some info about the parsed data
    console.log(`Parsed ${data.length} rows with ${headers.length} columns`);
    if (data.length > 0) {
      console.log('Sample data row:', data[0]);
      console.log('Available fields:', Object.keys(data[0]));
    }
    
    return data;
  } catch (error) {
    console.error('Error parsing CSV:', error);
    return [];
  }
};

/**
 * Convert object array to CSV string
 */
export const objectsToCSV = (data: DataItem[]): string => {
  if (!data || data.length === 0) return '';
  
  // Get all unique headers
  const headers = Array.from(
    new Set(data.flatMap(item => Object.keys(item)))
  );
  
  // Create CSV header row
  let csv = headers.join(',') + '\n';
  
  // Add data rows
  data.forEach(item => {
    const row = headers.map(header => {
      const value = item[header];
      // Handle values that need quotes (strings with commas, quotes, etc.)
      if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value !== undefined ? value : '';
    });
    csv += row.join(',') + '\n';
  });
  
  return csv;
};
