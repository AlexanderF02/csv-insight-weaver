import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Savedcsv = () => {
    const location = useLocation();
    const [allCsvFiles, setAllCsvFiles] = useState([]);

    // Load CSV files from location.state or localStorage
    useEffect(() => {
        if (location.state && location.state.allCsvFiles) {
            setAllCsvFiles(location.state.allCsvFiles);
        } else {
            const savedFiles = localStorage.getItem('allCsvFiles');
            if (savedFiles) {
                setAllCsvFiles(JSON.parse(savedFiles));
            }
        }
    }, [location.state]);

    return (
        <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
            <header className="text-white py-4 px-6 shadow-md flex items-center justify-between dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                <h1 className="text-xl font-bold">Saved CSV Files</h1>
            </header>

            <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow">
                {allCsvFiles.length > 0 ? (
                    <ul className="space-y-4">
                        {allCsvFiles.map((file, index) => (
                            <li key={index} className="bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                                <h2 className="text-lg font-bold">File {index + 1}</h2>
                                <p>{file.rows.length} rows, {file.headers.length} columns</p>
                                <table className="table-auto w-full mt-4 border-collapse border border-gray-300 dark:border-gray-700">
                                    <thead>
                                        <tr>
                                            {file.headers.map((header, i) => (
                                                <th key={i} className="border border-gray-300 dark:border-gray-700 px-2 py-1">{header}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {file.rows.slice(0, 5).map((row, i) => ( 
                                            <tr key={i}>
                                                {file.headers.map((header, j) => (
                                                    <td key={j} className="border border-gray-300 dark:border-gray-700 px-2 py-1">{row[header]}</td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">No saved CSV files available.</p>
                )}
            </main>

            <footer className="text-white py-4 dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} eSyn Cloud. All Rights Reserved. Powered by Sitea</p>
                </div>
            </footer>
        </div>
    );
};

export default Savedcsv;