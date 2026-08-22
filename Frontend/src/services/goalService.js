import API from './axiosInstance'; // Importing the interceptor instance we set up

// 1. Create a Goal -> POST /goals
export const createGoal = async (goalData) => {
    // goalData payload structure depends on backend, e.g., { userId, targetAmount, description, etc. }
    const response = await API.post('/goals', goalData);
    return response.data;
};

// 2. Get Goals by User ID -> GET /goals/user/{userId}
export const getGoalsByUserId = async (userId) => {
    const response = await API.get(`/goals/user/${userId}`);
    return response.data;
};

// 3. Update Goal -> PUT /goals/{goalId}
export const updateGoal = async (goalId, goalData) => {
    const response = await API.put(`/goals/${goalId}`, goalData);
    return response.data;
};

// 4. Delete Goal -> DELETE /goals/{goalId}
export const deleteGoal = async (goalId) => {
    const response = await API.delete(`/goals/${goalId}`);
    return response.data;
};

// 5. Get Goal Progress -> GET /goals/{goalId}/progress
export const getGoalProgress = async (goalId) => {
    const response = await API.get(`/goals/${goalId}/progress`);
    return response.data;
};

// 6. Get Goal Status -> GET /goals/{goalId}/status
export const getGoalStatus = async (goalId) => {
    const response = await API.get(`/goals/${goalId}/status`);
    return response.data;
};