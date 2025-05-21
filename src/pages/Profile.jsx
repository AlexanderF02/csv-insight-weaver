import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar"; // Import the Avatar component

const Profile = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const loggedInUser = localStorage.getItem('loggedInUser');
        if (!loggedInUser) {
            navigate('/login'); // Redirect to login if not logged in
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('loggedInUser'); // Clear logged-in user
        localStorage.removeItem('loggedInUserName');
        localStorage.removeItem('loggedInUserCompany');
        navigate('/login'); // Redirect to login page
    };

    const userName = localStorage.getItem('loggedInUserName') || 'Unknown User';
    const userCompany = localStorage.getItem('loggedInUserCompany') || 'Unknown Company';
    const userEmail = localStorage.getItem('loggedInUser') || 'Unknown Email';

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-2xl">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <Avatar className="mx-auto mb-4 h-24 w-24">
                        <AvatarImage src="https://github.com/shadcn.png" alt="User Avatar" />
                        <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{userName}</h1>
                    <p className="text-lg text-gray-600 dark:text-gray-400">{userCompany}</p>
                </div>

                {/* Account Information Section */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Account Information</h2>
                    <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <strong className="font-medium text-gray-800 dark:text-white">Name:</strong> {userName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <strong className="font-medium text-gray-800 dark:text-white">Company:</strong> {userCompany}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            <strong className="font-medium text-gray-800 dark:text-white">Email:</strong> {userEmail}
                        </p>
                    </div>
                </div>

                {/* Buttons Section */}
                <div className="flex justify-between">
                    <button
                        onClick={() => navigate('/')}
                        className="bg-[#26A69A] text-white py-2 px-6 rounded-md shadow hover:bg-[#26a699c1] transition-all duration-300"
                    >
                        Back to Home
                    </button>
                    <button
                        onClick={handleLogout}
                        className="bg-[#26A69A] text-white py-2 px-6 rounded-md shadow hover:bg-[#26a699c2] transition-all duration-300"
                    >
                        Log Out
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;