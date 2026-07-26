import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from './api';
import {
    Leaf, Zap, PieChart, Users, Trophy, Building2, ArrowRight,
    Eye, EyeOff, CheckCircle2, TrendingDown, Flame, Menu, X,
} from 'lucide-react';

/* ---------------------------------------------------------------- */
/* Design tokens — matches the CarbonTrack dashboard palette         */
/* ---------------------------------------------------------------- */
const C = {
    paper: '#F6F4EC',
    paperRaised: '#EFEBDC',
    card: '#FFFEF9',
    ink: '#1B2B22',
    charcoal: '#2A2E28',
    subtext: '#6B6A5C',
    moss: '#3F6B4A',
    mossDark: '#2E5138',
    lichen: '#8FAE8B',
    clay: '#C2622B',
    sky: '#6FA8B5',
    olive: '#A98B4E',
    grey: '#9B9A8C',
    line: '#DFDAC6',
    danger: '#B23B3B',
};
const DISPLAY = "'Iowan Old Style','Palatino Linotype',Georgia,serif";
const BODY = "'Inter','Segoe UI',ui-sans-serif,system-ui,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,monospace";

const NAV_LINKS = [
    { id: 'home', label: 'Home' },
    { id: 'features', label: 'Features' },
    { id: 'how', label: 'How it works' },
    { id: 'about', label: 'About' },
];

const FEATURES = [
    { icon: Zap, title: 'Log activity in seconds', desc: 'Category tabs, quick-log presets, and a live CO₂e preview as you type — no spreadsheets.', color: C.clay },
    { icon: PieChart, title: 'See it broken down', desc: 'A daily footprint card, category pie chart, and week-over-week trend line, all in one glance.', color: C.sky },
    { icon: Trophy, title: 'Community leaderboard', desc: 'Compare your weekly footprint against friends or the wider CarbonTrack community.', color: C.olive },
    { icon: Building2, title: 'Team reporting', desc: 'Give organisations a department-level view of emissions, so sustainability goals aren\u2019t just personal.', color: C.moss },
];

const STEPS = [
    { n: '01', title: 'Log what you use', desc: 'A commute, a meal, a kWh of power — log it in one tap and see its footprint instantly.' },
    { n: '02', title: 'Watch your dashboard update', desc: 'Your daily total, weekly trend, and monthly budget update live as you log.' },
    { n: '03', title: 'Improve, together', desc: 'Track streaks, earn badges, and see how your habits compare with your team or community.' },
];

// Deterministic "floating leaf" positions for the live background
const LEAVES = [
    { left: '6%', delay: '0s', duration: '14s', size: 18 },
    { left: '16%', delay: '3s', duration: '18s', size: 14 },
    { left: '28%', delay: '1.5s', duration: '16s', size: 20 },
    { left: '42%', delay: '5s', duration: '15s', size: 12 },
    { left: '58%', delay: '2s', duration: '19s', size: 16 },
    { left: '70%', delay: '6.5s', duration: '13s', size: 18 },
    { left: '82%', delay: '0.8s', duration: '17s', size: 14 },
    { left: '92%', delay: '4s', duration: '16s', size: 20 },
];

export default function LandingPage({ setAuth }) {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [focusedInput, setFocusedInput] = useState('');
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [scrolled, setScrolled] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    useEffect(() => {
        const handleMouseMove = (e) => setMousePos({ x: e.clientX, y: e.clientY });
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const getGreeting = () => {
        const hrs = new Date().getHours();
        if (hrs < 12) return 'Good morning';
        if (hrs < 18) return 'Good afternoon';
        return 'Good evening';
    };

    const scrollTo = (id) => {
        setMobileNavOpen(false);
        document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isLogin) {
                const data = await authAPI.login(emailOrUsername, password);
                if (data.token) {
                    localStorage.setItem('token', data.token);
                    setAuth(true);
                } else {
                    alert('Login failed. Check your inputs.');
                }
            } else {
                const data = await authAPI.signup(username, firstName, lastName, emailOrUsername, password);
                if (data.token) {
                    alert('Account created! Switching to login.');
                    setIsLogin(true);
                }
            }
        } catch (err) {
            console.error('Connection error:', err);
            alert(err.message || 'Could not connect to the server. Make sure the backend is running!');
        }
    };

    return (
        <div style={styles.page}>
            <style>{`
        @keyframes blobDrift {
          0% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px,-40px) scale(1.08); }
          100% { transform: translate(0,0) scale(1); }
        }
        @keyframes leafDrift {
          0% { transform: translateY(0) translateX(0) rotate(0deg); opacity: 0; }
          8% { opacity: 0.55; }
          92% { opacity: 0.35; }
          100% { transform: translateY(-90vh) translateX(30px) rotate(200deg); opacity: 0; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(14px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .ct-fade { animation: fadeInUp 0.6s ease both; }
        .ct-btn { transition: transform 0.15s ease, box-shadow 0.15s ease, background-color 0.15s ease; }
        .ct-btn:hover { transform: translateY(-1px); }
        .ct-btn:active { transform: translateY(0); }
        .ct-navlink { transition: color 0.15s ease, background-color 0.15s ease; }
        .ct-input { transition: border-color 0.15s ease, box-shadow 0.15s ease; }
        .ct-card-hover { transition: transform 0.2s ease, box-shadow 0.2s ease; }
        .ct-card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(27,43,34,0.08); }
        .ct-nav-desktop { display: flex; }
        .ct-nav-mobile-toggle { display: none; }
        @media (max-width: 820px) {
          .ct-nav-desktop { display: none; }
          .ct-nav-mobile-toggle { display: flex; }
        }
      `}</style>

            {/* Live background: drifting gradient blobs + rising leaves + cursor glow */}
            <div style={styles.bgLayer} aria-hidden="true">
                <div style={{ ...styles.blob, width: 420, height: 420, background: C.lichen, top: '-8%', left: '-6%', animationDuration: '22s' }} />
                <div style={{ ...styles.blob, width: 360, height: 360, background: C.sky, top: '30%', right: '-8%', animationDuration: '26s', animationDelay: '2s' }} />
                <div style={{ ...styles.blob, width: 300, height: 300, background: C.olive, bottom: '-6%', left: '20%', animationDuration: '20s', animationDelay: '4s' }} />
                {LEAVES.map((leaf, i) => (
                    <span
                        key={i}
                        style={{
                            position: 'absolute',
                            bottom: '-40px',
                            left: leaf.left,
                            fontSize: leaf.size,
                            animation: `leafDrift ${leaf.duration} linear infinite`,
                            animationDelay: leaf.delay,
                        }}
                    >
            🍃
          </span>
                ))}
                <div style={{ ...styles.spotlight, left: mousePos.x - 220, top: mousePos.y - 220 }} />
            </div>

            {/* Nav */}
            <div style={{ ...styles.nav, boxShadow: scrolled ? '0 2px 12px rgba(27,43,34,0.06)' : 'none' }}>
                <div style={styles.navInner}>
                    <div style={styles.navLogo}>
                        <Leaf size={20} color={C.moss} />
                        <span style={{ fontFamily: DISPLAY, fontSize: 20, color: C.ink }}>CarbonTrack</span>
                    </div>

                    <div className="ct-nav-desktop" style={styles.navLinksDesktop}>
                        {NAV_LINKS.map((link) => (
                            <button key={link.id} className="ct-navlink" onClick={() => scrollTo(link.id)} style={styles.navLinkBtn}>
                                {link.label}
                            </button>
                        ))}
                    </div>

                    <div className="ct-nav-desktop" style={styles.navActionsDesktop}>
                        <button className="ct-navlink" onClick={() => { setIsLogin(true); scrollTo('login'); }} style={styles.navGhostBtn}>
                            Log in
                        </button>
                        <button
                            className="ct-btn"
                            onClick={() => { setIsLogin(false); scrollTo('login'); }}
                            style={styles.navSolidBtn}
                        >
                            Get started <ArrowRight size={14} style={{ verticalAlign: -2, marginLeft: 4 }} />
                        </button>
                    </div>

                    <button className="ct-nav-mobile-toggle" style={styles.navMobileToggle} onClick={() => setMobileNavOpen((v) => !v)} aria-label="Toggle menu">
                        {mobileNavOpen ? <X size={20} color={C.ink} /> : <Menu size={20} color={C.ink} />}
                    </button>
                </div>

                {mobileNavOpen && (
                    <div style={styles.navMobilePanel}>
                        {NAV_LINKS.map((link) => (
                            <button key={link.id} onClick={() => scrollTo(link.id)} style={styles.navMobileLink}>{link.label}</button>
                        ))}
                        <button onClick={() => { setIsLogin(true); scrollTo('login'); }} style={{ ...styles.navMobileLink, color: C.moss, fontWeight: 700 }}>Log in</button>
                    </div>
                )}
            </div>

            {/* Hero + Auth */}
            <section id="home" style={styles.hero}>
                <div style={styles.heroInner}>
                    <div className="ct-fade" style={styles.heroLeft}>
                        <div style={styles.badge}>CarbonTrack</div>
                        <h1 style={styles.title}>
                            Track what you use.<br />
                            <span style={{ color: C.moss }}>See what it costs the planet.</span>
                        </h1>
                        <p style={styles.subtitle}>
                            CarbonTrack is a daily climate companion for individuals and teams. Log your commute,
                            meals, and energy use in seconds, watch your footprint take shape on a live dashboard,
                            and see how small habits add up against your goals — and your community.
                        </p>

                        <div style={styles.heroBullets}>
                            <div style={styles.heroBullet}>
                                <Zap size={16} color={C.clay} />
                                <span>Live habit logging with instant CO₂e feedback</span>
                            </div>
                            <div style={styles.heroBullet}>
                                <PieChart size={16} color={C.sky} />
                                <span>Clear footprint breakdowns, not spreadsheets</span>
                            </div>
                            <div style={styles.heroBullet}>
                                <Users size={16} color={C.moss} />
                                <span>Leaderboards and team reports that keep it social</span>
                            </div>
                        </div>

                        {/* Mini live dashboard preview */}
                        <div style={styles.previewCard}>
                            <div style={styles.previewHeader}>
                <span style={{ fontFamily: MONO, fontSize: 11, letterSpacing: '0.1em', color: C.subtext, textTransform: 'uppercase' }}>
                  Your dashboard, from day one
                </span>
                            </div>
                            <div style={styles.previewStats}>
                                <div>
                                    <div style={{ fontFamily: DISPLAY, fontSize: 22, color: C.ink }}>3.4 <span style={{ fontFamily: BODY, fontSize: 12, color: C.subtext }}>kg today</span></div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, color: C.moss, fontFamily: MONO, fontSize: 11 }}>
                                        <TrendingDown size={12} /> 58% vs. average
                                    </div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Flame size={16} color={C.clay} />
                                        <span style={{ fontFamily: DISPLAY, fontSize: 22, color: C.ink }}>6</span>
                                    </div>
                                    <div style={{ fontFamily: MONO, fontSize: 11, color: C.subtext }}>day streak</div>
                                </div>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                        <Trophy size={16} color={C.olive} />
                                        <span style={{ fontFamily: DISPLAY, fontSize: 22, color: C.ink }}>#1</span>
                                    </div>
                                    <div style={{ fontFamily: MONO, fontSize: 11, color: C.subtext }}>community rank</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Auth card */}
                    <div id="login" className="ct-fade" style={{ ...styles.authCard, animationDelay: '0.1s' }}>
                        <div style={styles.authAccentBar} />
                        <div style={styles.authCardInner}>
                            <h2 style={styles.authTitle}>{isLogin ? `${getGreeting()}!` : 'Create your account'}</h2>
                            <p style={styles.authSubtitle}>
                                {isLogin ? 'Sign in to pick up your streak where you left off.' : 'Start logging your footprint in under a minute.'}
                            </p>

                            <form onSubmit={handleSubmit} style={styles.form}>
                                {!isLogin && (
                                    <>
                                        <div style={styles.inputGroup}>
                                            <label style={styles.label}>Username</label>
                                            <input
                                                type="text" placeholder="chosen_username" className="ct-input"
                                                style={{ ...styles.input, ...(focusedInput === 'username' ? styles.inputActive : {}) }}
                                                value={username} onChange={(e) => setUsername(e.target.value)}
                                                onFocus={() => setFocusedInput('username')} onBlur={() => setFocusedInput('')}
                                                required
                                            />
                                        </div>
                                        <div style={styles.inputRow}>
                                            <div style={{ ...styles.inputGroup, flex: 1 }}>
                                                <label style={styles.label}>First name</label>
                                                <input
                                                    type="text" placeholder="First name" className="ct-input"
                                                    style={{ ...styles.input, ...(focusedInput === 'first' ? styles.inputActive : {}) }}
                                                    value={firstName} onChange={(e) => setFirstName(e.target.value)}
                                                    onFocus={() => setFocusedInput('first')} onBlur={() => setFocusedInput('')}
                                                    required
                                                />
                                            </div>
                                            <div style={{ ...styles.inputGroup, flex: 1 }}>
                                                <label style={styles.label}>Last name</label>
                                                <input
                                                    type="text" placeholder="Last name" className="ct-input"
                                                    style={{ ...styles.input, ...(focusedInput === 'last' ? styles.inputActive : {}) }}
                                                    value={lastName} onChange={(e) => setLastName(e.target.value)}
                                                    onFocus={() => setFocusedInput('last')} onBlur={() => setFocusedInput('')}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </>
                                )}

                                <div style={styles.inputGroup}>
                                    <label style={styles.label}>{isLogin ? 'Email address or username' : 'Email address'}</label>
                                    <input
                                        type="text" placeholder={isLogin ? 'you@example.com or username' : 'you@example.com'} className="ct-input"
                                        style={{ ...styles.input, ...(focusedInput === 'email' ? styles.inputActive : {}) }}
                                        value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)}
                                        onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput('')}
                                        required
                                    />
                                </div>

                                <div style={styles.inputGroup}>
                                    <div style={styles.rowBetween}>
                                        <label style={styles.label}>Password</label>
                                        {isLogin && (
                                            <button type="button" onClick={() => alert('Password reset link sent (demo mode).')} style={styles.forgotBtn}>
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <input
                                            type={showPassword ? 'text' : 'password'} placeholder="••••••••" className="ct-input"
                                            style={{ ...styles.input, ...(focusedInput === 'password' ? styles.inputActive : {}), paddingRight: 40 }}
                                            value={password} onChange={(e) => setPassword(e.target.value)}
                                            onFocus={() => setFocusedInput('password')} onBlur={() => setFocusedInput('')}
                                            required
                                        />
                                        <button
                                            type="button" onClick={() => setShowPassword((v) => !v)}
                                            style={styles.eyeBtn} aria-label="Toggle password visibility"
                                        >
                                            {showPassword ? <EyeOff size={16} color={C.subtext} /> : <Eye size={16} color={C.subtext} />}
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="ct-btn" style={styles.submitBtn}>
                                    {isLogin ? 'Sign in to dashboard' : 'Create account'}
                                </button>

                                <div style={styles.dividerRow}>
                                    <div style={styles.dividerLine} />
                                    <span style={styles.dividerText}>or</span>
                                    <div style={styles.dividerLine} />
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center' }}>
                                    <GoogleLogin
                                        onSuccess={(credentialResponse) => {
                                            console.log('Google JWT for backend:', credentialResponse.credential);
                                            setAuth(true);
                                        }}
                                        onError={() => console.log('Google sign-in failed')}
                                        useOneTap
                                    />
                                </div>
                            </form>

                            <div style={styles.toggleRow}>
                                <span style={{ color: C.subtext }}>{isLogin ? "Don't have an account? " : 'Already have an account? '}</span>
                                <button onClick={() => setIsLogin(!isLogin)} style={styles.toggleBtn}>
                                    {isLogin ? 'Register here' : 'Log in here'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={styles.section}>
                <div style={styles.sectionInner}>
                    <div style={styles.sectionLabel}>What you get</div>
                    <h2 style={styles.sectionTitle}>Everything a footprint needs, in one place</h2>
                    <div style={styles.featureGrid}>
                        {FEATURES.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div key={f.title} className="ct-card-hover" style={styles.featureCard}>
                                    <div style={{ ...styles.featureIconWrap, background: `${f.color}1A` }}>
                                        <Icon size={20} color={f.color} />
                                    </div>
                                    <div style={styles.featureTitle}>{f.title}</div>
                                    <div style={styles.featureDesc}>{f.desc}</div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* How it works */}
            <section id="how" style={{ ...styles.section, background: C.paperRaised }}>
                <div style={styles.sectionInner}>
                    <div style={styles.sectionLabel}>How it works</div>
                    <h2 style={styles.sectionTitle}>From a logged commute to a lower footprint</h2>
                    <div style={styles.stepsRow}>
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s.n}>
                                <div style={styles.stepCard}>
                                    <div style={styles.stepNumber}>{s.n}</div>
                                    <div style={styles.featureTitle}>{s.title}</div>
                                    <div style={styles.featureDesc}>{s.desc}</div>
                                </div>
                                {i < STEPS.length - 1 && <ArrowRight size={20} color={C.grey} style={styles.stepArrow} />}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="about" style={styles.section}>
                <div style={{ ...styles.sectionInner, maxWidth: 760 }}>
                    <div style={styles.sectionLabel}>About CarbonTrack</div>
                    <h2 style={styles.sectionTitle}> Built so sustainability doesn't feel like homework </h2>
                    <p style={styles.aboutText}>
                        Most footprint trackers ask for too much and show too little.
                        CarbonTrack keeps logging fast enough for a daily habit,
                        and turns that data into a dashboard you'd actually want to
                        check — streaks, quests, and a leaderboard included.
                        Whether you're tracking your own habits or reporting for a team,
                        the goal is the same: make the invisible cost of everyday
                        choices easy to see, and easier to improve.
                    </p>
                    <div style={styles.aboutChecks}>
                        {['Free to start', 'No spreadsheets, ever', 'Built for individuals and teams'].map((t) => (
                            <div key={t} style={styles.aboutCheckItem}>
                                <CheckCircle2 size={16} color={C.moss} /> {t}
                            </div>
                        ))}
                    </div>
                    <button className="ct-btn" onClick={() => { setIsLogin(false); scrollTo('login'); }} style={{ ...styles.navSolidBtn, marginTop: 24 }}>
                        Get started free <ArrowRight size={14} style={{ verticalAlign: -2, marginLeft: 4 }} />
                    </button>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.navLogo}>
                    <Leaf size={16} color={C.moss} />
                    <span style={{ fontFamily: DISPLAY, fontSize: 15, color: C.ink }}>CarbonTrack</span>
                </div>
                <span style={{ fontFamily: BODY, fontSize: 12, color: C.subtext }}>
          Track what you use. See what it costs the planet.
        </span>
            </footer>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* Styles                                                             */
/* ---------------------------------------------------------------- */
const styles = {
    page: {
        background: C.paper,
        minHeight: '100vh',
        fontFamily: BODY,
        position: 'relative',
        overflowX: 'hidden',
    },
    bgLayer: {
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
    },
    blob: {
        position: 'absolute',
        borderRadius: '50%',
        filter: 'blur(90px)',
        opacity: 0.16,
        animationName: 'blobDrift',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
    },
    spotlight: {
        position: 'fixed',
        width: 440,
        height: 440,
        borderRadius: '50%',
        background: `radial-gradient(circle, rgba(63,107,74,0.06) 0%, transparent 70%)`,
        transition: 'left 0.15s linear, top 0.15s linear',
    },
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 20,
        background: 'rgba(255,254,249,0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${C.line}`,
    },
    navInner: {
        maxWidth: 1160,
        margin: '0 auto',
        padding: '14px 28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    navLogo: { display: 'flex', alignItems: 'center', gap: 8 },
    navLinksDesktop: { display: 'flex', gap: 4 },
    navLinkBtn: {
        fontFamily: BODY, fontSize: 13, fontWeight: 600, color: C.subtext,
        background: 'transparent', border: 'none', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
    },
    navActionsDesktop: { display: 'flex', alignItems: 'center', gap: 10 },
    navGhostBtn: {
        fontFamily: BODY, fontSize: 13, fontWeight: 600, color: C.ink,
        background: 'transparent', border: 'none', padding: '9px 12px', cursor: 'pointer',
    },
    navSolidBtn: {
        fontFamily: BODY, fontSize: 13, fontWeight: 700, color: C.paper,
        background: C.moss, border: 'none', padding: '10px 18px', borderRadius: 999, cursor: 'pointer',
    },
    navMobileToggle: { background: 'none', border: 'none', cursor: 'pointer', alignItems: 'center' },
    navMobilePanel: {
        display: 'flex', flexDirection: 'column', padding: '8px 28px 16px', gap: 4,
        borderTop: `1px solid ${C.line}`,
    },
    navMobileLink: {
        textAlign: 'left', fontFamily: BODY, fontSize: 14, fontWeight: 600, color: C.ink,
        background: 'transparent', border: 'none', padding: '10px 4px', cursor: 'pointer',
    },
    hero: { position: 'relative', zIndex: 2, padding: '64px 28px 40px' },
    heroInner: {
        maxWidth: 1160, margin: '0 auto', display: 'flex', gap: 48,
        alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between',
    },
    heroLeft: { flex: '1 1 480px', maxWidth: 580 },
    badge: {
        display: 'inline-block', background: `${C.moss}15`, color: C.mossDark,
        border: `1px solid ${C.moss}40`, padding: '6px 14px', borderRadius: 999,
        fontSize: 13, fontWeight: 700, marginBottom: 22, fontFamily: BODY,
    },
    title: { fontFamily: DISPLAY, fontSize: 44, lineHeight: 1.15, color: C.ink, margin: '0 0 18px 0' },
    subtitle: { fontFamily: BODY, fontSize: 15.5, lineHeight: 1.65, color: C.subtext, margin: '0 0 28px 0', maxWidth: 520 },
    heroBullets: { display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 },
    heroBullet: { display: 'flex', alignItems: 'center', gap: 10, fontFamily: BODY, fontSize: 14, fontWeight: 500, color: C.charcoal },
    previewCard: {
        background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 18,
        maxWidth: 460, boxShadow: '0 8px 24px rgba(27,43,34,0.06)',
    },
    previewHeader: { marginBottom: 12 },
    previewStats: { display: 'flex', justifyContent: 'space-between', gap: 12 },

    authCard: {
        flex: '1 1 380px', maxWidth: 420, background: C.card, borderRadius: 16,
        border: `1px solid ${C.line}`, boxShadow: '0 16px 40px rgba(27,43,34,0.10)',
        overflow: 'hidden', boxSizing: 'border-box',
    },
    authAccentBar: { height: 5, background: `linear-gradient(90deg, ${C.mossDark}, ${C.moss}, ${C.lichen})` },
    authCardInner: { padding: '32px 30px' },
    authTitle: { fontFamily: DISPLAY, fontSize: 22, color: C.ink, margin: '0 0 6px 0', textAlign: 'center' },
    authSubtitle: { fontFamily: BODY, fontSize: 13, color: C.subtext, margin: '0 0 26px 0', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: 18 },
    inputRow: { display: 'flex', gap: 12 },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: 6 },
    rowBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontFamily: BODY, fontSize: 12.5, fontWeight: 600, color: C.charcoal },
    input: {
        padding: '11px 12px', borderRadius: 8, border: `1px solid ${C.line}`,
        fontSize: 14, fontFamily: BODY, color: C.ink, background: C.paper,
        outline: 'none', boxSizing: 'border-box', width: '100%',
    },
    inputActive: { border: `1px solid ${C.moss}`, boxShadow: `0 0 0 3px ${C.moss}1A` },
    eyeBtn: {
        position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex',
    },
    forgotBtn: { background: 'none', border: 'none', color: C.moss, fontSize: 12, fontWeight: 600, cursor: 'pointer' },
    submitBtn: {
        background: C.moss, color: C.paper, padding: '12px', borderRadius: 8, border: 'none',
        fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: BODY, marginTop: 4,
    },
    dividerRow: { display: 'flex', alignItems: 'center', gap: 10, margin: '2px 0' },
    dividerLine: { flex: 1, height: 1, background: C.line },
    dividerText: { fontFamily: MONO, fontSize: 11, color: C.subtext, textTransform: 'uppercase' },
    toggleRow: { marginTop: 22, textAlign: 'center', fontSize: 13, fontFamily: BODY },
    toggleBtn: { background: 'none', border: 'none', color: C.moss, fontWeight: 700, cursor: 'pointer', fontSize: 13 },

    section: { position: 'relative', zIndex: 2, padding: '72px 28px' },
    sectionInner: { maxWidth: 1160, margin: '0 auto' },
    sectionLabel: { fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.subtext, marginBottom: 8 },
    sectionTitle: { fontFamily: DISPLAY, fontSize: 30, color: C.ink, margin: '0 0 36px 0', maxWidth: 640 },

    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 },
    featureCard: { background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 22 },
    featureIconWrap: { width: 40, height: 40, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    featureTitle: { fontFamily: BODY, fontSize: 15, fontWeight: 700, color: C.ink, marginBottom: 6 },
    featureDesc: { fontFamily: BODY, fontSize: 13, lineHeight: 1.55, color: C.subtext },

    stepsRow: { display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' },
    stepCard: { background: C.card, border: `1px solid ${C.line}`, borderRadius: 12, padding: 22, flex: '1 1 240px' },
    stepNumber: { fontFamily: DISPLAY, fontSize: 26, color: C.lichen, marginBottom: 10 },
    stepArrow: { alignSelf: 'center', marginTop: 40, flex: '0 0 auto' },

    aboutText: { fontFamily: BODY, fontSize: 15.5, lineHeight: 1.75, color: C.charcoal, marginBottom: 24 },
    aboutChecks: { display: 'flex', flexDirection: 'column', gap: 10 },
    aboutCheckItem: { display: 'flex', alignItems: 'center', gap: 8, fontFamily: BODY, fontSize: 14, color: C.charcoal },

    footer: {
        position: 'relative', zIndex: 2, borderTop: `1px solid ${C.line}`, padding: '28px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
    },
};