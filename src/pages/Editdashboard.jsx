import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const availableWidgets = [
    { id: 'dataTable', name: 'Data Table' },
    { id: 'aiInsights', name: 'AI Insights' },
    { id: 'barChart', name: 'Bar Chart' },
    { id: 'pieChart', name: 'Pie Chart' },
    { id: 'lineChart', name: 'Line Chart' },
];

const Editdashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve existing selected widgets from location.state or initialize as empty
    const [selectedWidgets, setSelectedWidgets] = useState(location.state?.selectedWidgets || []);

    const handleWidgetToggle = (widgetId) => {
        setSelectedWidgets((prevWidgets) => {
            const isSelected = prevWidgets.includes(widgetId);
            return isSelected
                ? prevWidgets.filter((id) => id !== widgetId)
                : [...prevWidgets, widgetId];
        });
    };

    const handleSave = () => {
        // Navigate back to the dashboard with the updated selected widgets
        navigate('/dashboard', { state: { selectedWidgets } });
    };

    return (
        <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
            <header className="text-white py-4 px-6 shadow-md flex items-center justify-between dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                <h1 className="text-xl font-bold">Edit Dashboard</h1>
                <button
                    className="bg-white text-gray-800 py-2 px-4 rounded-md shadow hover:bg-gray-100 dark:bg-gray-700 dark:text-white"
                    onClick={handleSave}
                >
                    Save & Exit
                </button>
            </header>

            <main className="container mx-auto px-4 sm:px-6 py-8 flex-grow">
                <h2 className="text-lg font-bold mb-4">Select Widgets to Display</h2>
                <ul className="space-y-4">
                    {availableWidgets.map((widget) => (
                        <li key={widget.id} className="flex items-center justify-between bg-white dark:bg-gray-800 p-4 rounded-md shadow">
                            <span>{widget.name}</span>
                            <input
                                type="checkbox"
                                checked={selectedWidgets.includes(widget.id)}
                                onChange={() => handleWidgetToggle(widget.id)}
                                className="form-checkbox h-5 w-5 text-[#26A69A] rounded"
                            />
                        </li>
                    ))}
                </ul>
            </main>

            <footer className="text-white py-4 dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} eSyn Cloud. All Rights Reserved. Powered by Sitea</p>
                </div>
            </footer>
        </div>
    );
};

export default Editdashboard;