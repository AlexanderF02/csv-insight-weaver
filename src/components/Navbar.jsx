import React from 'react';
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faBorderAll } from '@fortawesome/free-solid-svg-icons';
import { ModeToggle } from "./ModeToggle";
import ProfileDropdown from './ui/ProfileDropdown';

const Navbar = ({ navigateToDashboard }) => {
    const navigate = useNavigate();

    return (
        <header className="text-white py-4 px-6 shadow-md flex items-center justify-between dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
            <div className="flex items-center">
                <img src="/esyn.png" alt="Logo" className="h-8 w-auto" />
            </div>

            <div className="flex items-center space-x-4">
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

                {/* User Profile Button */}

                {/* lägg till logik: om inloggad visa detta, om utloggad navigera till login */}
                <ProfileDropdown />
                {/* <button
                    className="p-2 rounded-full hover:bg-opacity-80 text-white"
                    onClick={() => navigate("/login")}
                >
                    <FontAwesomeIcon icon={faUser} className="h-6 w-6" />
                </button> */}
            </div>
        </header>
    );
};

export default Navbar;