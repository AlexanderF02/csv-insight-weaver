import React from 'react';

const AnalysPrompt = ({ prompt, onClick, editMode }) => {
  return (
    <div 
      className={`flex items-center cursor-pointer hover:bg-gray-100 p-3 rounded transition-all ${editMode ? 'border-2 border-dashed border-blue-400' : ''}`}
      onClick={onClick}
    >
      <span className="mr-2 text-gray-600">Prompt:</span>
      <span className="text-sm flex-grow">"{prompt}"</span>
      <div className="ml-2 w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center text-white">
        R
      </div>
      {editMode && (
        <div className="ml-2 text-xs text-blue-500">
          Klicka för att redigera
        </div>
      )}
    </div>
  );
};

export default AnalysPrompt;