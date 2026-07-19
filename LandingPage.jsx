import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from './api';

export default function LandingPage({ setAuth }) {
    // ---- UNIFIED COMPONENT STATES (PRESERVED) ----
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');

    // ---- NEW INTERACTIVE STATE HANDLERS ----
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [focusedInput, setFocusedInput] = useState(''); // Tracks which input has active focus
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // 1. Premium Ambient Cursor Tracker Effect
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
        };
        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    // 2. Real-Time "Time of Day" Dynamic Greeting Engine
    const getGreeting = () => {
        const hrs = new Date().getHours();
        if (hrs < 12) return "Good Morning, Eco Tracker!";
        if (hrs < 17) return "Good Afternoon, Eco Tracker!";
        return "Good Evening, Eco Tracker!";
    };

    // ---- LIVE BACKEND FORM SUBMISSION (PRESERVED) ----
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const data = await authAPI.login(emailOrUsername, password);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    alert('Login Successful!');
                    setAuth(true);
                } else {
                    alert('Login failed. Check your inputs.');
                }
            } else {
                const data = await authAPI.signup(username, firstName, lastName, emailOrUsername, password);
                if (data.token) {
                    alert('Account created successfully! Switching to Login mode.');
                    setIsLogin(true);
                }
            }
        } catch (err) {
            console.error("Connection error:", err);
            alert(err.message || "Could not connect to backend server. Make sure Spring Boot is running!");
        }
    };

    // 3. Dynamic Mascot Expression State Engine
    const getMascotExpression = () => {
        if (isPasswordFocused) {
            return {
                face: "🙈🌍",
                bubble: "Don't worry, I'm closing my eyes! Your credentials are safe with our ecosystem secure-hashing systems."
            };
        }
        return {
            face: "🌍✨",
            bubble: "Let's team up today. Every single micro-log helps me breathe a bit easier!"
        };
    };

    const mascot = getMascotExpression();

    return (
        <div style={styles.container}>
            {/* 4. Injection of Elastic Buttons, Keyframes, and Micro-Interaction Classes */}
            <style>{`
                @keyframes gentleFloat {
                    0% { transform: translateY(0px) scale(1); }
                    50% { transform: translateY(-8px) scale(1.04); }
                    100% { transform: translateY(0px) scale(1); }
                }
                .mascot-glow {
                    animation: gentleFloat 3.5s ease-in-out infinite;
                    filter: drop-shadow(0 4px 14px rgba(16,185,129,0.4));
                    cursor: pointer;
                    user-select: none;
                    transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .btn-neon-hover {
                    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, background-color 0.2s ease;
                }
                .btn-neon-hover:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 8px 24px rgba(16, 185, 129, 0.5) !important;
                }
                .btn-neon-hover:active {
                    transform: translateY(1px) scale(0.97);
                }
            `}</style>

            {/* 5. Ambient Interactive Spotlight Radial Layer */}
            <div style={{
                ...styles.mouseSpotlight,
                left: `${mousePos.x - 250}px`,
                top: `${mousePos.y - 250}px`,
            }} />

            {/* Background static blur shapes */}
            <div style={styles.circleLeft}></div>
            <div style={styles.circleRight}></div>

            <div style={styles.contentWrapper}>
                {/* Left Side: Marketing/Hero Info & Interactive Mascot */}
                <div style={styles.heroSection}>
                    <div style={styles.badge}>Carbon Track 🌿</div>
                    <h1 style={styles.mainTitle}>
                        Track what you use.<br />
                        <span style={styles.highlightText}>See what it costs the planet.</span>
                    </h1>
                    <p style={styles.subtitle}>
                        Meet your daily climate companion. We make it simple, interactive, and rewarding for teams and individuals to log choices and shrink their footprints together!
                    </p>
                    <div style={styles.features}>
                        <div style={styles.featureItem}>
                            <span style={styles.iconBoxYellow}>⚡</span> Live Habit Loggers
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.iconBoxBlue}>📊</span> Playful Footprint Breakdowns
                        </div>
                        <div style={styles.featureItem}>
                            <span style={styles.iconBoxGreen}>👥</span> Live Co-op Team Metrics
                        </div>
                    </div>

                    {/* The Welcoming Adaptive Earth Mascot Widget */}
                    <div style={styles.mascotWidget}>
                        <div className="mascot-glow" style={styles.mascotEmoji}>
                            {mascot.face}
                        </div>
                        <div style={styles.mascotSpeechBubble}>
                            <strong style={{ color: '#34D399' }}>"Hey there! 👋"</strong><br />
                            {mascot.bubble}
                        </div>
                    </div>
                </div>

                {/* Right Side: Glowing Neon Portal Box */}
                <div style={styles.card}>
                    {/* Integrated Time-of-Day Greeting Dynamic Display */}
                    <h2 style={styles.cardTitle}>{isLogin ? getGreeting() : 'Create Account'}</h2>
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
                                        style={{
                                            ...styles.input,
                                            ...(focusedInput === 'username' ? styles.inputActive : {})
                                        }}
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        onFocus={() => setFocusedInput('username')}
                                        onBlur={() => setFocusedInput('')}
                                        required
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>First Name</label>
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        style={{
                                            ...styles.input,
                                            ...(focusedInput === 'first' ? styles.inputActive : {})
                                        }}
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        onFocus={() => setFocusedInput('first')}
                                        onBlur={() => setFocusedInput('')}
                                        required
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>Last Name</label>
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        style={{
                                            ...styles.input,
                                            ...(focusedInput === 'last' ? styles.inputActive : {})
                                        }}
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        onFocus={() => setFocusedInput('last')}
                                        onBlur={() => setFocusedInput('')}
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
                                style={{
                                    ...styles.input,
                                    ...(focusedInput === 'email' ? styles.inputActive : {})
                                }}
                                value={emailOrUsername}
                                onChange={(e) => setEmailOrUsername(e.target.value)}
                                onFocus={() => setFocusedInput('email')}
                                onBlur={() => setFocusedInput('')}
                                required
                            />
                        </div>

                        <div style={styles.inputGroup}>
                            <div style={styles.forgotPasswordLayoutRow}>
                                <label style={styles.label}>Password</label>
                                {/* ---- FORGOT PASSWORD LINK ---- */}
                                {isLogin && (
                                    <button
                                        type="button"
                                        onClick={() => alert("Password reset link sent (Frontend Demo Mode)!")}
                                        style={styles.forgotBtn}
                                    >
                                        Forgot Password?
                                    </button>
                                )}
                            </div>
                            <input
                                type="password"
                                placeholder="••••••••"
                                style={{
                                    ...styles.input,
                                    ...(focusedInput === 'password' ? styles.inputActive : {})
                                }}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                onFocus={() => {
                                    setFocusedInput('password');
                                    setIsPasswordFocused(true); // Triggers Mascot peek-a-boo
                                }}
                                onBlur={() => {
                                    setFocusedInput('');
                                    setIsPasswordFocused(false);
                                }}
                                required
                            />
                        </div>

                        {/* Submit Button with Custom Transition Properties */}
                        <button type="submit" className="btn-neon-hover" style={styles.submitBtn}>
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

// Complete Enhanced Layout Styling Blueprint
const styles = {
    container: {
        background: 'radial-gradient(circle at top right, #13241A 0%, #080C0A 100%)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
        padding: '40px',
        position: 'relative',
        overflow: 'hidden',
    },
    mouseSpotlight: {
        position: 'fixed',
        width: '500px',
        height: '500px',
        background: 'radial-gradient(circle, rgba(16, 185, 129, 0.05) 0%, transparent 70%)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 1,
        transition: 'transform 0.1s linear',
    },
    circleLeft: {
        position: 'absolute',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        backgroundColor: 'rgba(16, 185, 129, 0.02)',
        filter: 'blur(80px)',
        top: '-100px',
        left: '-100px',
        zIndex: 1,
    },
    circleRight: {
        position: 'absolute',
        width: '500px',
        height: '500px',
        borderRadius: '50%',
        backgroundColor: 'rgba(52, 211, 153, 0.01)',
        filter: 'blur(100px)',
        bottom: '-150px',
        right: '-100px',
        zIndex: 1,
    },
    contentWrapper: {
        display: 'flex',
        maxWidth: '1100px',
        width: '100%',
        gap: '60px',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 2,
        flexWrap: 'wrap',
    },
    heroSection: {
        flex: '1 1 450px',
        color: '#FFFFFF',
    },
    badge: {
        display: 'inline-block',
        backgroundColor: 'rgba(16, 185, 129, 0.12)',
        color: '#34D399',
        border: '1px solid rgba(16, 185, 129, 0.25)',
        padding: '6px 16px',
        borderRadius: '20px',
        fontSize: '0.85rem',
        fontWeight: '600',
        marginBottom: '24px',
    },
    mainTitle: {
        fontSize: '3rem',
        fontWeight: '800',
        lineHeight: '1.15',
        margin: '0 0 20px 0',
        color: '#FFFFFF',
        letterSpacing: '-0.02em',
    },
    highlightText: {
        color: '#10B981',
        textShadow: '0 0 25px rgba(16, 185, 129, 0.25)',
    },
    subtitle: {
        fontSize: '1.05rem',
        lineHeight: '1.6',
        color: '#A3B899',
        marginBottom: '32px',
        maxWidth: '520px',
    },
    features: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        marginBottom: '36px',
    },
    featureItem: {
        fontSize: '0.98rem',
        fontWeight: '500',
        color: '#E6EDE8',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
    },
    iconBoxYellow: {
        background: 'rgba(234, 179, 8, 0.12)',
        border: '1px solid #EAB308',
        padding: '5px 8px',
        borderRadius: '8px',
    },
    iconBoxBlue: {
        background: 'rgba(59, 130, 246, 0.12)',
        border: '1px solid #3B82F6',
        padding: '5px 8px',
        borderRadius: '8px',
    },
    iconBoxGreen: {
        background: 'rgba(16, 185, 129, 0.12)',
        border: '1px solid #10B981',
        padding: '5px 8px',
        borderRadius: '8px',
    },
    mascotWidget: {
        display: 'flex',
        alignItems: 'center',
        gap: '20px',
        background: 'rgba(255, 255, 255, 0.01)',
        border: '1px dashed rgba(52, 211, 153, 0.2)',
        padding: '16px 24px',
        borderRadius: '24px',
        maxWidth: '460px',
    },
    mascotEmoji: {
        fontSize: '44px',
        width: '55px',
        textAlign: 'center'
    },
    mascotSpeechBubble: {
        color: '#C5D1C9',
        fontSize: '0.9rem',
        lineHeight: '1.45',
        flex: 1,
    },
    card: {
        backgroundColor: 'rgba(18, 24, 21, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '2px solid #10B981',
        boxShadow: '0 0 35px rgba(16, 185, 129, 0.2), inset 0 0 15px rgba(16, 185, 129, 0.05)',
        padding: '40px',
        borderRadius: '24px',
        width: '100%',
        maxWidth: '440px',
        flex: '1 1 380px',
        boxSizing: 'border-box',
    },
    cardTitle: {
        fontSize: '1.5rem',
        fontWeight: '800',
        color: '#FFFFFF',
        margin: '0 0 6px 0',
        textAlign: 'center',
        letterSpacing: '-0.02em',
        lineHeight: '1.3'
    },
    cardSubtitle: {
        fontSize: '0.88rem',
        color: '#7E8C83',
        margin: '0 0 32px 0',
        textAlign: 'center',
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '22px',
    },
    inputGroup: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    },
    forgotPasswordLayoutRow: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    label: {
        fontSize: '0.85rem',
        fontWeight: '600',
        color: '#C5D1C9',
    },
    input: {
        padding: '14px',
        borderRadius: '12px',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        fontSize: '0.95rem',
        color: '#FFFFFF',
        backgroundColor: 'rgba(255, 255, 255, 0.04)',
        outline: 'none',
        boxSizing: 'border-box',
        transition: 'all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1)',
    },
    inputActive: {
        border: '1px solid #10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.03)',
        boxShadow: '0 0 12px rgba(16, 185, 129, 0.25)',
    },
    submitBtn: {
        backgroundColor: '#10B981',
        color: '#0C110E',
        padding: '16px',
        borderRadius: '14px',
        border: 'none',
        fontSize: '0.98rem',
        fontWeight: '700',
        cursor: 'pointer',
        marginTop: '8px',
        boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
    },
    toggleContainer: {
        marginTop: '26px',
        textAlign: 'center',
        fontSize: '0.9rem',
    },
    toggleText: {
        color: '#7E8C83',
    },
    toggleBtn: {
        background: 'none',
        border: 'none',
        color: '#34D399',
        fontWeight: '600',
        cursor: 'pointer',
        padding: '0',
        textDecoration: 'none',
    },
    dividerContainer: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '8px 0',
        gap: '12px',
    },
    line: {
        flex: 1,
        height: '1px',
        backgroundColor: 'rgba(255, 255, 255, 0.08)',
    },
    dividerText: {
        fontSize: '0.85rem',
        color: '#526357',
    },
    googleBtnWrapper: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
    },
    forgotBtn: {
        background: 'none',
        border: 'none',
        color: '#10B981',
        fontSize: '0.82rem',
        fontWeight: '500',
        cursor: 'pointer',
        padding: '0',
        textDecoration: 'none',
    }
};