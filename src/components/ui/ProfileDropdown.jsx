import React from "react";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";

const ProfileDropdown = ({
  isDropdownOpen,
  loggedInUser,
  loggedInUserCompany,
  handleLogout,
  handleSavedAnalys 
}) => {
  const navigate = useNavigate();

  const getInitials = (name) => {
    if (!name) return "AB";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div
      className={`absolute right-0 mt-2 w-64 bg-[#262C2E] text-white rounded-xl shadow-lg z-50 transition-all duration-300 transform ${
        isDropdownOpen
          ? "opacity-100 scale-100 translate-y-0"
          : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
      }`}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div>
          <div className="font-semibold">{localStorage.getItem("loggedInUserName") || "Användare"}</div>
          
          <div className="text-sm text-gray-400">{loggedInUserCompany || "No Company"}</div>
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
          <AvatarFallback>
            {getInitials(loggedInUserCompany)}
          </AvatarFallback>
        </Avatar>
      </div>
      <div className="p-4 space-y-2">
        <button
          className="w-full text-center hover:bg-[#87D4CE33] rounded-sm py-2 px-[42px] active:bg-[#87D4CE57]"
          onClick={() => navigate("/profile")}
        >
          Kontoinställningar
        </button>
        <button
          className="w-full text-center hover:bg-[#87D4CE33] rounded-sm py-2 px-[42px] active:bg-[#87D4CE57]"
          onClick={handleSavedAnalys} 
        >
          Sparade analyser
        </button>
        <button
          className="w-full text-center hover:bg-[#87D4CE33] rounded-sm py-2 px-[42px] active:bg-[#87D4CE57]"
          onClick={handleLogout}
        >
          Logga ut
        </button>
      </div>
    </div>
  );
};

export default ProfileDropdown;
