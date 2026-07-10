const BASE_URL = 'http://localhost:8080';

// Helper function to get auth headers with JWT token
const getAuthHeaders = () => {
    const token = localStorage.getItem('auth_token');
    return {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

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
        if (data.token) localStorage.setItem('auth_token', data.token);
        return data;
    }
};

// 📁 Replace this section in api.js:
export const activityAPI = {
    getUserActivities: async () => {
        const todayStr = new Date().toISOString().split('T')[0];

        // Let's explicitly pass it clean to the endpoint path matching your repository structure
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