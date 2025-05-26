
import { useState, useRef } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { parseCSV } from '../utils/csvUtils.ts';

const CSVUploader = ({ onDataLoaded, onClose }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFile = (file) => {
    if (file.name.endsWith('.csv')) {
      setFile(file);
    } else {
      toast.error('Please upload a CSV file');
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    setIsLoading(true);
    try {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const csvContent = e.target?.result;
        const parsedData = parseCSV(csvContent);
        
        if (parsedData && parsedData.length > 0) {
          onDataLoaded(parsedData);
          toast.success('CSV file successfully loaded!');
          onClose();
        } else {
          toast.error('Failed to parse CSV file');
        }
        setIsLoading(false);
      };
      
      reader.onerror = () => {
        toast.error('Error reading file');
        setIsLoading(false);
      };
      
      reader.readAsText(file);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('An error occurred while uploading');
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-dark-300 p-8 rounded-lg w-full max-w-2xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-white">Upload CSV File</h2>
      
      <div className="bg-dark-200 rounded-lg p-6">
        <h3 className="text-lg font-medium mb-2 text-white">Upload CSV File</h3>
        <p className="text-gray-400 mb-4">Drag and drop your CSV file or click to browse</p>
        
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging 
              ? 'border-teal-400 bg-dark-100' 
              : 'border-gray-700 hover:border-gray-500'
          } transition-colors cursor-pointer`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
        >
          <div className="flex flex-col items-center justify-center h-32">
            <svg 
              className="w-12 h-12 text-gray-400 mb-4" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="text-sm text-gray-400">Drag and drop your CSV file here</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".csv"
              className="hidden"
            />
          </div>
        </div>
        
        {file && (
          <div className="mt-4 p-3 bg-dark-400 rounded-md flex justify-between items-center">
            <span className="text-sm text-white truncate">{file.name}</span>
            <Button
              size="sm" 
              variant="outline"
              onClick={() => setFile(null)}
            >
              Remove
            </Button>
          </div>
        )}
        
        <p className="mt-4 text-xs text-gray-500">Supports CSV files with comma or semicolon delimiters</p>
      </div>
      
      <div className="mt-8 flex justify-end gap-4">
        <Button 
          variant="outline" 
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="bg-teal-500 hover:bg-teal-600"
        >
          {isLoading ? 'Uploading...' : 'Upload'}
        </Button>
      </div>
    </div>
  );
};

export default CSVUploader;
