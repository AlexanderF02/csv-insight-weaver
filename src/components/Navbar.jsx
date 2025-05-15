import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBorderAll } from '@fortawesome/free-solid-svg-icons';
import { ModeToggle } from "./ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";

const Navbar = ({ navigateToDashboard }) => {
    const navigate = useNavigate();
    const location = useLocation(); // Get the current route
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [loggedInUserCompany, setLoggedInUserCompany] = useState(null);

    // Check if the user is logged in
    useEffect(() => {
        const user = localStorage.getItem('loggedInUser');
        const company = localStorage.getItem('loggedInUserCompany');
        setLoggedInUser(user); // Set the logged-in user
        setLoggedInUserCompany(company); // Set the logged-in user's company
    }, [location.pathname]);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser'); // Clear logged-in user
        localStorage.removeItem('loggedInUserCompany'); // Clear logged-in user's company
        setLoggedInUser(null); // Update state to trigger re-render
        setLoggedInUserCompany(null); // Update state to trigger re-render
        navigate('/login'); // Redirect to login page
    };

    const handleProfileClick = () => {
        if (loggedInUser) {
            setIsDropdownOpen((prev) => !prev); // Toggle dropdown menu
        } else {
            navigate('/login'); // Redirect to login page if not logged in
        }
    };

    return (
        <header className="text-white py-4 px-6 shadow-md flex items-center justify-between dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
            <div className="flex items-center">
                <img src="/esyn.png" alt="Logo" className="h-8 w-auto" />
            </div>

            <div className="flex items-center space-x-4 relative">
                {/* Dashboard Button */}
                <button
                    className="flex items-center bg-white text-gray-800 py-2 px-4 rounded-md shadow hover:bg-gray-100 dark:bg-gray-800 dark:text-white"
                    onClick={navigateToDashboard}
                >
                    Dashboard
                    <FontAwesomeIcon icon={faBorderAll} className="h-5 w-5 ml-2" />
                </button>

                {/* Dark Mode/Light Mode Toggle */}
                <ModeToggle />

                {/* User Profile Icon */}
                <div className="relative">
                    <button
                        className="p-2 rounded-full hover:bg-opacity-80 text-white"
                        onClick={handleProfileClick}
                    >
                        <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
                    </button>

                    {/* Dropdown Menu (only visible when logged in) */}
                    {loggedInUser && (
                        <div
                            className={`absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg z-50 transition-all duration-300 transform ${
                                isDropdownOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                            }`}
                        >
                            {/* Avatar and Name */}
                            <div className="flex items-center p-4 border-b border-gray-200 dark:border-gray-700">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                                    <AvatarFallback>{loggedInUser?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                                </Avatar>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-gray-900 dark:text-white">{loggedInUser}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{loggedInUserCompany || "No Company"}</p>
                                </div>
                            </div>

                            {/* Menu Options */}
                            <div className="py-2">
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    onClick={() => navigate('/profile')}
                                >
                                    Kontoinställningar
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    onClick={() => navigate('/settings')}
                                >
                                    Sparade analyser
                                </button>
                                <button
                                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
                                    onClick={handleLogout}
                                >
                                    Logga ut
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
};

export default Navbar;