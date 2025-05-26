
import { useState } from 'react';
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

const Navigation = ({ 
  activeView, 
  setActiveView, 
  isRedacted, 
  setIsRedacted 
}) => {
  return (
    <nav className="py-4 px-6 flex items-center">
      <div className="flex space-x-2 items-center">
        <Switch 
          checked={isRedacted} 
          onCheckedChange={setIsRedacted} 
          id="redacted-mode"
        />
        <Label htmlFor="redacted-mode">Redacting</Label>
      </div>

      <div className="ml-auto">
        <div className="flex space-x-1 bg-dark-400 rounded-md p-1">
          <button
            className={`px-4 py-2 rounded ${
              activeView === 'dashboard' 
                ? 'bg-dark-300 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView('dashboard')}
          >
            Dashboard
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeView === 'dataTable' 
                ? 'bg-dark-300 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView('dataTable')}
          >
            Data Table
          </button>
          <button
            className={`px-4 py-2 rounded ${
              activeView === 'aiInsights' 
                ? 'bg-dark-300 text-white' 
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveView('aiInsights')}
          >
            AI Insights
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
