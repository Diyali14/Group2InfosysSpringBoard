import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from './api';

export default function LandingPage({ setAuth }) {
    // ---- UNIFIED COMPONENT STATES ----
    const [isLogin, setIsLogin] = useState(true); // Toggles between Login and Signup view
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    // ---- LIVE BACKEND FORM SUBMISSION ----
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                // --- PROCESS BACKEND LOGIN ---
                const data = await authAPI.login(emailOrUsername, password);
                if (data.token) {
                    localStorage.setItem('token', data.token); // Securely store JWT token
                    alert('Login Successful!');
                    setAuth(true); // Tells App.jsx to unlock route and push to /dashboard
                } else {
                    alert('Login failed. Check your inputs.');
                }
            } else {
                // --- PROCESS BACKEND SIGNUP ---
                const data = await authAPI.signup(username, firstName, lastName, emailOrUsername, password);
                if (data.token) {
                    alert('Account created successfully! Switching to Login mode.');
                    setIsLogin(true); // Flip view back to login screen
                }
            }
        } catch (err) {
            console.error("Connection error:", err);
            alert(err.message || "Could not connect to backend server. Make sure Spring Boot is running!");
        }
    };

    return (
        <div style={styles.container}>
            {/* Decorative background shapes */}
            <div style={styles.circleLeft}></div>
            <div style={styles.circleRight}></div>

            <div style={styles.contentWrapper}>
                {/* Left Side: Marketing/Hero Info */}
                <div style={styles.heroSection}>
                    <div style={styles.badge}>Carbon Track 🌿</div>
                    <h1 style={styles.mainTitle}>
                        Track what you use.<br />
                        <span style={styles.highlightText}>See what it costs the planet.</span>
                    </h1>
                    <p style={styles.subtitle}>
                        Empowering individuals and teams to measure, understand, and reduce their daily carbon footprint with real-time data insights.
                    </p>
                    <div style={styles.features}>
                        <div style={styles.featureItem}>⚡ Real-time consumption logs</div>
                        <div style={styles.featureItem}>📊 Visual breakdown charts</div>
                        <div style={styles.featureItem}>👥 Team carbon reporting</div>
                    </div>
                </div>

                {/* Right Side: Auth Card */}
                <div style={styles.card}>
                    <h2 style={styles.cardTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
                    <p style={styles.cardSubtitle}>
                        {isLogin ? 'Enter your details to access your dashboard' : 'Sign up to start tracking your footprint'}
                    </p>

                    <form onSubmit={handleSubmit} style={styles.form}>
                        {/* ---- SHOWS ONLY ON SIGNUP / REGISTER CARD ---- */}
                        {!isLogin && (
                            <>
                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Username</label>
                                    <input
                                        type="text"
                                        placeholder="chosen_username"
                                        style={styles.input}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>First Name</label>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        style={styles.input}
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        style={styles.input}
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                </div>
                            </>
                        )}

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>
                                {isLogin ? 'Email Address or Username' : 'Email Address'}
                            </label>
                            <input
                                type="text"
                                placeholder={isLogin ? "you@example.com or xyz123" : "email@gmail.com"}
                                style={styles.input}
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Password</label>
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={styles.input}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />

                            {/* ---- FORGOT PASSWORD LINK ---- */}
                            {isLogin && (
                                <div style={styles.forgotPasswordContainer}>
                                    <button
                                        type="button"
                                        onClick={() => alert("Password reset link sent (Frontend Demo Mode)!")}
                                        style={styles.forgotBtn}
                                    >
                                        Forgot Password?
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button type="submit" style={styles.submitBtn}>
                            {isLogin ? 'Sign In to Dashboard' : 'Get Started Free'}
                        </button>

                        {/* ---- VISUAL DIVIDER ---- */}
                        <div style={styles.dividerContainer}>
                            <div style={styles.line}></div>
                            <span style={styles.dividerText}>or</span>
                            <div style={styles.line}></div>
                        </div>

                        {/* ---- GOOGLE BUTTON ---- */}
                        <div style={styles.googleBtnWrapper}>
                            <GoogleLogin
                                onSuccess={(credentialResponse) => {
                                    console.log("Google JWT Token for Backend:", credentialResponse.credential);
                                    setAuth(true);
                                }}
                                onError={() => {
                                    console.log('Google Sign-In Failed');
                                }}
                                useOneTap
                            />
                        </div>
                    </form>

                    <div style={styles.toggleContainer}>
                        <span style={styles.toggleText}>
                          {isLogin ? "Don't have an account? " : "Already have an account? "}
                        </span>
                        <button onClick={() => setIsLogin(!isLogin)} style={styles.toggleBtn}>
                            {isLogin ? 'Register here' : 'Login here'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Earthy, clean UI design styles
const styles = {
    container: {
        backgroundColor: '#edf1e4',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: '20px',
        position: 'relative',
        overflow: 'hidden',
    },
    circleLeft: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        backgroundColor: '#e1e8d5',
        top: '-100px',
        left: '-100px',
        zIndex: 1,
    },
    circleRight: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        backgroundColor: '#e6edd9',
        bottom: '-150px',
        right: '-100px',
        zIndex: 1,
    },
    contentWrapper: {
        display: 'flex',
        maxWidth: '1050px',
        width: '100%',
        gap: '60px',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 2,
        flexWrap: 'wrap',
    },
    heroSection: {
        flex: '1 1 450px',
        color: '#1e3f20',
    },
    badge: {
        display: 'inline-block',
        backgroundColor: '#dbf5d6',
        color: '#1e3f20',
        padding: '6px 14px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '20px',
    },
    mainTitle: {
        fontSize: '2.8rem',
        fontWeight: '800',
        lineHeight: '1.2',
        margin: '0 0 20px 0',
        color: '#112912',
    },
    highlightText: {
        color: '#3d7a42',
    },
    subtitle: {
        fontSize: '1.1rem',
        lineHeight: '1.6',
        color: '#4f6650',
        marginBottom: '30px',
    },
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
    },
    featureItem: {
        fontSize: '1rem',
        fontWeight: '500',
        color: '#2a4d2c',
        display: 'flex',
        alignItems: 'center',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(27, 49, 28, 0.06)',
        width: '100%',
        maxWidth: '420px',
        flex: '1 1 380px',
        boxSizing: 'border-box',
    },
    cardTitle: {
        fontSize: '1.6rem',
        fontWeight: '700',
        color: '#112912',
        margin: '0 0 8px 0',
    },
    cardSubtitle: {
        fontSize: '0.9rem',
        color: '#768c77',
        margin: '0 0 28px 0',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '6px',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#2a4d2c',
    },
    input: {
        padding: '12px 14px',
        borderRadius: '8px',
        border: '1px solid #d1dbd2',
        fontSize: '0.95rem',
        color: '#112912',
        backgroundColor: '#fcfdfb',
        outline: 'none',
        transition: 'border-color 0.2s',
    },
    submitBtn: {
        backgroundColor: '#1e3f20',
        color: '#ffffff',
        padding: '14px',
        borderRadius: '8px',
        border: 'none',
        fontSize: '1rem',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '10px',
        transition: 'background-color 0.2s',
    },
    toggleContainer: {
        marginTop: '24px',
        textAlign: 'center',
        fontSize: '0.9rem',
    },
    toggleText: {
        color: '#768c77',
    },
    toggleBtn: {
        background: 'none',
        border: 'none',
        color: '#3d7a42',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0',
        textDecoration: 'underline',
    },
    dividerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '10px 0',
        gap: '10px',
    },
    line: {
        flex: 1,
        height: '1px',
        backgroundColor: '#d1dbd2',
    },
    dividerText: {
        fontSize: '0.85rem',
        color: '#768c77',
    },
    googleBtnWrapper: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    forgotPasswordContainer: {
        display: 'flex',
        justifyContent: 'flex-end',
        marginTop: '4px',
    },
    forgotBtn: {
        background: 'none',
        border: 'none',
        color: '#3d7a42',
        fontSize: '0.8rem',
        fontWeight: '500',
        cursor: 'pointer',
        padding: '0',
        textDecoration: 'none',
    }
};