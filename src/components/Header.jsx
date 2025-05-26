
import { useState } from 'react';
import { Sun, Moon, User, Filter } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = ({ toggleTheme, isDarkMode }) => {
  return (
    <header className="bg-teal-600 text-white py-3 px-6 flex justify-between items-center">
      <div className="flex items-center">
        <div className="text-xl font-bold">esyn</div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Button 
          variant="outline" 
          className="border-white text-white hover:bg-teal-700"
        >
          Dashboard
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={toggleTheme} 
          className="text-white hover:bg-teal-700"
        >
          {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </Button>
        <Button 
          variant="ghost" 
          size="icon" 
          className="text-white hover:bg-teal-700"
        >
          <User size={18} />
        </Button>
      </div>
    </header>
  );
};

export default Header;
