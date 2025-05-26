import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faBorderAll, faPlus } from "@fortawesome/free-solid-svg-icons";
import { ModeToggle } from "./ModeToggle";
import ProfileDropdown from "./ui/ProfileDropdown";

const Navbar = ({ navigateToDashboard, setIsModalOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loggedInUser, setLoggedInUser] = useState(null);
  const [loggedInUserCompany, setLoggedInUserCompany] = useState(null);

  useEffect(() => {
    const user = localStorage.getItem("loggedInUser");
    const company = localStorage.getItem("loggedInUserCompany");
    setLoggedInUser(user);
    setLoggedInUserCompany(company);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInUserCompany");
    setLoggedInUser(null);
    setLoggedInUserCompany(null);
    navigate("/login");
  };

  const handleProfileClick = () => {
    if (loggedInUser) {
      setIsDropdownOpen((prev) => !prev);
    } else {
      navigate("/login");
    }
  };

  const handleSavedAnalys = () => {
    setIsDropdownOpen(false);
    navigate("/savedanalys");
  };

  const handleNewAnalysis = () => {
    if (setIsModalOpen) {
      setIsModalOpen(true);
    }
  };

  return (
    <header className="text-white py-4 px-6 shadow-md flex items-center justify-between bg-gray-800 dark:bg-[#26A69A]">
      <div className="flex items-center space-x-4">
        <img src="/EsynLogga.svg" alt="Logo" className="h-8 w-auto" />
        <button
          className="flex items-center bg-gray-800 text-white py-2 px-4 rounded-md shadow hover:bg-gray-900"
          onClick={navigateToDashboard}
        >
          Dashboard
          <FontAwesomeIcon icon={faBorderAll} className="h-5 w-5 ml-2" />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <ModeToggle />

        <div className="relative">
          <button
            onClick={handleProfileClick}
            title={loggedInUser || "Profil"}
            className={`
                group flex items-center gap-2 py-2 px-4 relative transition duration-200
                ${isDropdownOpen ? "text-[#00CEC0]" : "text-white"}
             `}
          >
            <span className="text-base font-medium">Profil</span>
            <FontAwesomeIcon
              icon={faUser}
              className={`h-5 w-5 transition-colors duration-200 ${
                isDropdownOpen ? "text-[#00CEC0]" : "text-white"
              }`}
            />
            {/* underline effekt */}
            <span
              className={`
        absolute bottom-0 left-0 w-full h-[3px] transition-all duration-300
        ${
          isDropdownOpen
            ? "bg-[#00CEC0]"
            : "bg-transparent group-hover:bg-[#00CEC0]"
        }
      `}
            />
          </button>

          {loggedInUser && (
            <ProfileDropdown
              isDropdownOpen={isDropdownOpen}
              loggedInUser={loggedInUser}
              loggedInUserCompany={loggedInUserCompany}
              handleLogout={handleLogout}
              handleSavedAnalys={handleSavedAnalys}
            />
          )}
        </div>

        <button
          className="flex items-center gap-2 bg-[#26A69A] text-white py-2 px-4 rounded-md shadow hover:bg-[#219080] transition dark:bg-gray-800 dark:hover:bg-gray-900"
          onClick={handleNewAnalysis}
        >
          <FontAwesomeIcon icon={faPlus} className="h-5 w-5" />
          <span>Ny analys</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;
