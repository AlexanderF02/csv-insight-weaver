import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';


export default function ProfileDropdown() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative inline-block text-left bg-[#262C2E]" ref={dropdownRef}>
      {/* Nav Icon */}
      <div
        className="flex items-center space-x-2 cursor-pointer p-2 hover:bg-gray-700 rounded-md"
        onClick={() => setOpen(!open)}
      >
        <span className="text-white font-medium">Profil </span>
        <FontAwesomeIcon icon={faUser} className="text-white" />

      </div>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 w-64 bg-[#262C2E] text-white rounded-xl shadow-lg z-50">
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div>
              <div className="font-semibold">Jacob Jacobsson</div>
              <div className="text-sm text-gray-400">Stengrund AB</div>
            </div>
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
              {/* You can replace this with an <img> if you have a real logo */}
              <span className="text-black text-xs font-bold text-center"><br/>AB</span>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <button className="w-full text-center hover:text-teal-300">Kontoinställningar</button>
            <button className="w-full text-center hover:text-teal-300">Sparade analyser</button>
            <button className="w-full text-center hover:text-red-400">Logga ut</button>
          </div>
        </div>
      )}
    </div>
  );
}
