import React from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();
        // Add registration logic here
        console.log('Registration submitted');
        navigate('/'); // Redirect to the home page after successful registration
    };

    return (
        <div className="min-h-screen flex flex-col bg-appGray-light dark:bg-gray-900 dark:text-white">
            {/* Top Bar */}
            <header className="text-white py-4 px-6 shadow-md flex items-center justify-between dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                {/* Logo Section */}
                <div className="flex items-center">
                    <img src="/esyn.png" alt="Logo" className="h-8 w-auto" />
                </div>
            </header>

            {/* Register Form */}
            <main className="flex-grow flex items-center justify-center">
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-8 w-full max-w-md">
                    <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
                    <form onSubmit={handleRegister} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Name
                            </label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#26A69A] focus:border-[#26A69A] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#26A69A] focus:border-[#26A69A] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                required
                                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-[#26A69A] focus:border-[#26A69A] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-[#26A69A] text-white py-2 px-4 rounded-md shadow hover:bg-opacity-90"
                        >
                            Register
                        </button>
                    </form>
                    <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                        Already have an account?{' '}
                        <a href="/login" className="text-[#26A69A] hover:underline">
                            Login
                        </a>
                    </p>
                </div>
            </main>

            {/* Footer */}
            <footer className="text-white py-4 dark:bg-gray-800" style={{ backgroundColor: '#26A69A' }}>
                <div className="container mx-auto px-4 sm:px-6 text-center">
                    <p>&copy; {new Date().getFullYear()} CSV Insight Weaver</p>
                </div>
            </footer>
        </div>
    );
};

export default Register;