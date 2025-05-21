import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = (e) => {
        e.preventDefault();

        // Retrieve users from localStorage
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find((u) => u.email === email && u.password === password);

        if (user) {
            // Set logged-in user details in localStorage
            localStorage.setItem('loggedInUser', user.email);
            localStorage.setItem('loggedInUserName', user.name);
            localStorage.setItem('loggedInUserCompany', user.company);

            navigate('/profile'); // Redirect to profile page
        } else {
            setError('Invalid email or password');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 dark:text-white">Log In</h1>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form onSubmit={handleLogin} className="space-y-4">
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
                        Log In
                    </button>
                </form>
                <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
                    Don't have an account?{' '}
                    <button
                        onClick={() => navigate('/register')}
                        className="text-black dark:text-white hover:underline"
                    >
                        Register
                    </button>
                </p>
                <div className="text-center mt-6">
                    <button
                        onClick={() => navigate('/')}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:underline"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Login;
