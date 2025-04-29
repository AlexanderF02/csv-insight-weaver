
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

/**
 * NotFound Page
 * 
 * Displayed when a user navigates to a non-existent route
 */
const NotFound = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-appGray-light">
            <div className="text-center space-y-4">
                <h1 className="text-6xl font-bold text-appBlue-dark">404</h1>
                <h2 className="text-2xl font-semibold">Page Not Found</h2>
                <p className="text-appGray-dark">
                    The page you are looking for doesn't exist or has been moved.
                </p>
                <Button asChild>
                    <Link to="/">Return to Home</Link>
                </Button>
            </div>
        </div>
    );
};

export default NotFound;
