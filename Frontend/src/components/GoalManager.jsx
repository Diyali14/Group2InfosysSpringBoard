import React, { useEffect, useState } from 'react';
import {
    getGoalsByUserId,
    createGoal,
    deleteGoal,
    getGoalProgress
} from '../services/goalService';

const GoalManager = ({ userId }) => {
    const [goals, setGoals] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load user goals on component load
    useEffect(() => {
        if (userId) {
            fetchUserGoals();
        }
    }, [userId]);

    const fetchUserGoals = async () => {
        setLoading(true);
        try {
            const data = await getGoalsByUserId(userId);
            setGoals(data);
        } catch (error) {
            console.error('Error fetching user goals:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreate = async (newGoalPayload) => {
        try {
            await createGoal(newGoalPayload);
            fetchUserGoals(); // Refresh goal list after adding
        } catch (error) {
            console.error('Error creating goal:', error);
        }
    };

    const handleDelete = async (goalId) => {
        try {
            await deleteGoal(goalId);
            fetchUserGoals(); // Refresh goal list after deleting
        } catch (error) {
            console.error('Error deleting goal:', error);
        }
    };

    return (
        <div>
            <h3>User Goals</h3>
            {loading ? (
                <p>Loading goals...</p>
            ) : (
                <ul>
                    {goals.map((goal) => (
                        <li key={goal.id}>
                            <span>{goal.name || goal.title}</span>
                            <button onClick={() => handleDelete(goal.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default GoalManager;