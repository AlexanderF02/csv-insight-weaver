import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Upload } from "lucide-react";

/**
 * FileUpload Component
 * 
 * This component handles CSV file uploads. It:
 * 1. Accepts a CSV file through a drag-drop area or file browser
 * 2. Validates that the file is a CSV
 * 3. Parses the CSV content to JSON format, handling both comma and semicolon delimiters
 * 4. Passes the parsed data to the parent component
 * 
 * @param {function} onDataLoaded - Callback function to pass the parsed JSON data to parent
 */
const FileUpload = ({ onDataLoaded }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [fileName, setFileName] = useState("");

    /**
     * Handles the file drop or selection event
     * @param {Event} e - The event from the file input or drop 
     */
    const handleFile = async (e) => {
        e.preventDefault();
        setIsDragging(false);
        setIsLoading(true);

        let file;
        if (e.dataTransfer) {
            file = e.dataTransfer.files[0];
        } else if (e.target.files) {
            file = e.target.files[0];
        }

        if (!file) {
            toast.error("No file selected");
            setIsLoading(false);
            return;
        }

        // Check if file is a CSV
        if (!file.name.endsWith('.csv')) {
            toast.error("Please upload a CSV file");
            setIsLoading(false);
            return;
        }

        setFileName(file.name);

        try {
            // Read the file content
            const text = await file.text();
            
            // Parse CSV to JSON
            const result = parseCSV(text);
            
            // Call the callback with the parsed data
            onDataLoaded(result);
            toast.success("CSV file successfully loaded!");
        } catch (error) {
            console.error("Error parsing CSV:", error);
            toast.error("Error parsing CSV file");
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Detects the delimiter used in the CSV file (comma or semicolon)
     * @param {string} csvText - The CSV content as a string
     * @returns {string} - The detected delimiter
     */
    const detectDelimiter = (csvText) => {
        // Get the first line to analyze
        const firstLine = csvText.split('\n')[0];
        
        // Count occurrences of potential delimiters
        const semicolonCount = (firstLine.match(/;/g) || []).length;
        const commaCount = (firstLine.match(/,/g) || []).length;
        
        // Return the most frequently occurring delimiter, default to comma
        return semicolonCount > commaCount ? ';' : ',';
    };

    /**
     * Parses CSV text content to JSON, handling both comma and semicolon delimiters
     * @param {string} csvText - The CSV content as a string
     * @returns {Object} - Object containing headers and rows from CSV
     */
    const parseCSV = (csvText) => {
        // Split by new line and filter out empty rows
        const lines = csvText.split("\n").filter(line => line.trim() !== "");
        
        if (lines.length === 0) {
            throw new Error("Empty CSV file");
        }
        
        // Detect the delimiter used in the file
        const delimiter = detectDelimiter(csvText);
        console.log(`Detected delimiter: "${delimiter}"`);
        
        // Get headers from first line
        const headers = lines[0].split(delimiter).map(header => header.trim());
        
        // Parse rows
        const rows = lines.slice(1).map(line => {
            const values = line.split(delimiter).map(value => value.trim());
            // Create an object where keys are headers and values are the corresponding CSV values
            return headers.reduce((obj, header, index) => {
                obj[header] = values[index] || "";
                return obj;
            }, {});
        });
        
        return {
            headers,
            rows
        };
    };

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Upload CSV File</CardTitle>
                <CardDescription>
                    Drag and drop your CSV file or click to browse
                </CardDescription>
            </CardHeader>
            
            <CardContent>
                <div
                    className={`border-2 border-dashed rounded-lg p-10 text-center ${
                        isDragging ? "border-appBlue bg-appBlue-light" : "border-appGray"
                    }`}
                    onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleFile}
                >
                    <Upload className="mx-auto h-12 w-12 text-appGray-dark" />
                    <p className="mt-2 text-sm text-appGray-dark">
                        {fileName ? `Selected file: ${fileName}` : "Drag and drop your CSV file here"}
                    </p>
                    
                    <Button 
                        variant="outline" 
                        className="mt-4"
                        disabled={isLoading}
                        onClick={() => document.getElementById("csv-upload").click()}
                    >
                        {isLoading ? "Processing..." : "Browse Files"}
                    </Button>
                    
                    <input
                        id="csv-upload"
                        type="file"
                        accept=".csv"
                        className="hidden"
                        onChange={handleFile}
                    />
                </div>
            </CardContent>
            
            <CardFooter className="text-sm text-appGray-dark">
                <p>Supports CSV files with comma or semicolon delimiters</p>
            </CardFooter>
        </Card>
    );
};

export default FileUpload;

