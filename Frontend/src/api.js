import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

// Helper function to extract auth headers with JWT token
const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

/* ---------------------------------------------------------------- */
/* Auth Endpoints                                                   */
/* ---------------------------------------------------------------- */
export const authAPI = {
    signup: async (username, firstName, lastName, email, password) => {
        const response = await fetch(`${BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, firstName, lastName, email, password }),
        });
        const data = await response.json();
        if (data.token) localStorage.setItem('auth_token', data.token);
        return data;
    },

    login: async (emailOrUsername, password) => {
        const response = await fetch(`${BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emailOrUsername, password }),
        });
        const data = await response.json();

        if (data.token) {
            localStorage.setItem('auth_token', data.token);
            localStorage.setItem('firstName', data.firstName || '');
            localStorage.setItem('lastName', data.lastName || '');
            localStorage.setItem('email', data.email || emailOrUsername);
        }
        return data;
    }
};

/* ---------------------------------------------------------------- */
/* Activity Endpoints                                               */
/* ---------------------------------------------------------------- */
export const activityAPI = {
    getUserActivities: async () => {
        const todayStr = new Date().toISOString().split('T')[0];
        const response = await fetch(`${BASE_URL}/activities?logDate=${todayStr}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    },

    logActivity: async (activityData) => {
        const response = await fetch(`${BASE_URL}/activities`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(activityData),
        });
        if (!response.ok) {
            throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
    }
};

/* ---------------------------------------------------------------- */
/* Footprint Analytics Endpoints (Axios)                            */
/* ---------------------------------------------------------------- */
export const getDailyEmission = (userId) =>
    axios.get(`${BASE_URL}/analytics/daily/${userId}`, { headers: getAuthHeaders() });

export const getWeeklyEmission = (userId) =>
    axios.get(`${BASE_URL}/analytics/weekly/${userId}`, { headers: getAuthHeaders() });

export const getMonthlyEmission = (userId) =>
    axios.get(`${BASE_URL}/analytics/monthly/${userId}`, { headers: getAuthHeaders() });

export const getCategoryEmissions = (userId) =>
    axios.get(`${BASE_URL}/analytics/categories/${userId}`, { headers: getAuthHeaders() });

/* ---------------------------------------------------------------- */
/* Goals & Progress Endpoints                                       */
/* ---------------------------------------------------------------- */
export const goalsAPI = {
    createGoal: async (goalData) => {
        const res = await fetch(`${BASE_URL}/goals`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(goalData),
        });
        return res.json();
    },
    getUserGoal: async (userId) => {
        const res = await fetch(`${BASE_URL}/goals/user/${userId}`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return res.json();
    },
    getGoalProgress: async (goalId) => {
        const res = await fetch(`${BASE_URL}/goals/${goalId}/progress`, {
            method: 'GET',
            headers: getAuthHeaders(),
        });
        return res.json();
    },
    deleteGoal: async (goalId) => {
        const res = await fetch(`${BASE_URL}/goals/${goalId}`, {
            method: 'DELETE',
            headers: getAuthHeaders(),
        });
        return res.json();
    }
};