import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './LandingPage';
import Dashboard from './Dashboard';

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <BrowserRouter>
            <Routes>
                {/* Landing Page Route */}
                <Route
                    path="/"
                    element={isAuthenticated ? <Navigate to="/dashboard" /> : <LandingPage setAuth={setIsAuthenticated} />}
                />

                {/* Protected Dashboard Route */}
                <Route
                    path="/dashboard"
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/" />}
                />
            </Routes>
        </BrowserRouter>
    );
}