import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google'; // 1. Import provider
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        // 2. Wrap app. Replace with your actual Client ID string later
        <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com">
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage setAuth={setIsAuthenticated} />}
                    />
                    <Route
                        path="/dashboard"
                        element={isAuthenticated ? <Dashboard setAuth={setIsAuthenticated} /> : <Navigate to="/" />}
                    />
                </Routes>
            </BrowserRouter>
        </GoogleOAuthProvider>
    );
}