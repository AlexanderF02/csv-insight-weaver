import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [company, setCompany] = useState('');
    const [showSuccess, setShowSuccess] = useState(false); 

    const handleRegister = (e) => {
        e.preventDefault();

        // Save user details in localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        users.push({ email, password, name, company });
        localStorage.setItem('users', JSON.stringify(users));

        
        setShowSuccess(true);

        
        setTimeout(() => { 
            setShowSuccess(false); 
            navigate('/login');
        }, 1000); 
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Register</h1>
                <form onSubmit={handleRegister} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Company
                        </label>
                        <input
                            type="text"
                            id="company"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-black dark:text-white dark:bg-gray-700 dark:border-gray-600"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full bg-[#26A69A] text-white py-2 px-4 rounded-md shadow hover:bg-[#26a699b1]"
                    >
                        Register
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Already have an account?{' '}
                    <button
                        onClick={() => navigate('/login')}
                        className="text-black dark:text-white hover:underline"
                    >
                        Log In
                    </button>
                </p>
            </div>

            {/* Success Popup */}
            {showSuccess && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white dark:bg-gray-800 text-center p-6 rounded-lg shadow-lg">
                        <h2 className="text-xl font-bold text-black dark:text-white">Registration Successful!</h2>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                            Redirecting to the login page...
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;