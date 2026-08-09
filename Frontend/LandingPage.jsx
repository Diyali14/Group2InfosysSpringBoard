import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { authAPI } from './api';
import {
    Leaf, Zap, PieChart, Users, Trophy, Building2, ArrowRight,
    Eye, EyeOff, CheckCircle2, TrendingDown, Flame, Menu, X,
    Home, Globe2, Sprout, HeartHandshake, Mail, Lock, Quote,
} from 'lucide-react';
import logo from './assets/carbontrack-logo.png';
import heroBg from './assets/hero-forest.jpg';

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
    mossDark: '#1E4A2C',
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
    { id: 'why', label: 'Why CarbonTrack' },
];

const HERO_POINTS = [
    { icon: Home, label: 'Real-time CO₂e\ntracking' },
    { icon: PieChart, label: 'Insights that\ndrive change' },
    { icon: Users, label: 'Stronger\ntogether' },
];


const WHY = [
    { icon: CheckCircle2, title: 'Instant visibility', desc: 'Track daily activities and see your carbon footprint in real-time.', color: C.mossDark },
    { icon: Sprout, title: 'Actionable insights', desc: 'Get personalized recommendations and simple actions that matter.', color: C.clay },
    { icon: Globe2, title: 'Streaks & motivation', desc: 'Set goals, earn badges, and stay inspired every step of the way.', color: C.sky },
    { icon: HeartHandshake, title: 'Real planetary progress', desc: 'Your small actions today lead to a greener, cleaner tomorrow.', color: C.olive },
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

// Deterministic "floating leaf" positions over the hero photograph
const LEAVES = [
    { left: '3%', top: '22%', delay: '0s', duration: '9s', size: 22, rotate: '-20deg' },
    { left: '50%', top: '10%', delay: '1.4s', duration: '11s', size: 30, rotate: '15deg' },
    { left: '54%', top: '48%', delay: '3s', duration: '10s', size: 24, rotate: '-8deg' },
    { left: '92%', top: '8%', delay: '2.2s', duration: '12s', size: 28, rotate: '25deg' },
    { left: '95%', top: '34%', delay: '4.1s', duration: '10.5s', size: 22, rotate: '-30deg' },
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
    const [scrolled, setScrolled] = useState(false);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);
    const [toast, setToast] = useState(null); // { type: 'success' | 'error', message: string }

    useEffect(() => {
        if (!toast) return;
        const t = setTimeout(() => setToast(null), 4000);
        return () => clearTimeout(t);
    }, [toast]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 12);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const [greeting, setGreeting] = useState('Welcome back');
    useEffect(() => {
        const hrs = new Date().getHours();
        setGreeting(hrs < 12 ? 'Good morning' : hrs < 18 ? 'Good afternoon' : 'Good evening');
    }, []);
    const getGreeting = () => greeting;

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
                    setToast({ type: 'error', message: 'Login failed. Check your inputs.' });
                }
            } else {
                const data = await authAPI.signup(username, firstName, lastName, emailOrUsername, password);
                if (data.token) {
                    setToast({ type: 'success', message: 'Account created! Switching to login.' });
                    setIsLogin(true);
                }
            }
        } catch (err) {
            console.error('Connection error:', err);
            setToast({ type: 'error', message: err.message || 'Could not connect to the server. Make sure the backend is running!' });
        }
    };

    return (
        <div style={styles.page}>
            <style>{`
        @keyframes leafFloat {
          0% { transform: translate(0,0) rotate(0deg); }
          50% { transform: translate(-14px,18px) rotate(18deg); }
          100% { transform: translate(0,0) rotate(0deg); }
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
        .ct-card-hover:hover { transform: translateY(-3px); box-shadow: 0 10px 24px rgba(27,43,34,0.10); }
        .ct-nav-desktop { display: flex; }
        .ct-nav-mobile-toggle { display: none; }
        .ct-leaf-layer { display: block; }
        @media (max-width: 900px) {
          .ct-nav-desktop { display: none; }
          .ct-nav-mobile-toggle { display: flex; }
          .ct-leaf-layer { display: none; }
        }
      `}</style>

            {/* Toast (replaces native alert() for a look consistent with the rest of the UI) */}
            {toast && (
                <div
                    className="ct-fade"
                    style={{
                        ...styles.toast,
                        borderLeft: `4px solid ${toast.type === 'error' ? C.danger : C.moss}`,
                    }}
                    role="status"
                >
                    <span style={{ ...styles.toastDot, background: toast.type === 'error' ? C.danger : C.moss }} />
                    <span style={styles.toastText}>{toast.message}</span>
                    <button onClick={() => setToast(null)} style={styles.toastClose} aria-label="Dismiss">
                        <X size={14} color={C.subtext} />
                    </button>
                </div>
            )}

            {/* Nav */}
            <div style={{ ...styles.nav, boxShadow: scrolled ? '0 2px 12px rgba(27,43,34,0.08)' : 'none' }}>
                <div style={styles.navInner}>
                    <div style={styles.navLogo}>
                        <img src={logo} alt="CarbonTrack logo" width={40} height={46} style={styles.logoImg} />
                        <div>
                            <div style={styles.wordmark}>
                                Carbon<span style={{ color: C.moss }}>Track</span>
                            </div>
                            <div style={styles.tagline}>Leave lighter. Live better.</div>
                        </div>
                    </div>

                    <div className="ct-nav-desktop" style={styles.navLinksDesktop}>
                        {NAV_LINKS.map((link, i) => (
                            <button
                                key={link.id}
                                className="ct-navlink"
                                onClick={() => scrollTo(link.id)}
                                style={{
                                    ...styles.navLinkBtn,
                                    ...(i === 0 ? { color: C.moss, borderBottom: `2px solid ${C.moss}`, borderRadius: 0 } : {}),
                                }}
                            >
                                {link.label}
                            </button>
                        ))}
                    </div>

                    <div className="ct-nav-desktop" style={styles.navActionsDesktop}>
                        <button className="ct-navlink" onClick={() => { setIsLogin(true); scrollTo('login'); }} style={styles.navGhostBtn}>
                            Log in
                        </button>
                        <button className="ct-btn" onClick={() => { setIsLogin(false); scrollTo('login'); }} style={styles.navSolidBtn}>
                            Get started <ArrowRight size={14} style={{ verticalAlign: -2, marginLeft: 6 }} />
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

            {/* Hero + Auth over the forest photograph */}
            <section id="home" style={styles.hero}>
                <div style={styles.heroBgClip} aria-hidden="true">
                    <img src={heroBg} alt="" style={styles.heroImg} width={1920} height={1088} />
                    <div style={styles.heroWash} />
                </div>

                <div className="ct-leaf-layer" style={styles.leafLayer} aria-hidden="true">
                    {LEAVES.map((leaf, i) => (
                        <Leaf
                            key={i}
                            size={leaf.size}
                            color={C.moss}
                            style={{
                                position: 'absolute',
                                left: leaf.left,
                                top: leaf.top,
                                opacity: 0.75,
                                transform: `rotate(${leaf.rotate})`,
                                animation: `leafFloat ${leaf.duration} ease-in-out infinite`,
                                animationDelay: leaf.delay,
                            }}
                        />
                    ))}
                </div>

                <div style={styles.heroInner}>
                    <div className="ct-fade" style={styles.heroLeft}>
                        <div style={styles.badge}>
                            <Leaf size={14} color={C.moss} /> Your everyday actions. A better tomorrow.
                        </div>
                        <h1 style={styles.title}>
                            Track today.<br />
                            <span style={{ color: C.moss }}>Transform</span> tomorrow.
                        </h1>
                        <p style={styles.subtitle}>
                            CarbonTrack helps you measure your carbon footprint, build
                            better habits, and make real impact — every day.
                        </p>

                        <div style={styles.heroPoints}>
                            {HERO_POINTS.map((p) => {
                                const Icon = p.icon;
                                return (
                                    <div key={p.label} style={styles.heroPoint}>
                                        <span style={styles.heroPointIcon}><Icon size={18} color="#FFFFFF" /></span>
                                        <span style={styles.heroPointText}>{p.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Auth card */}
                    <div id="login" className="ct-fade" style={{ ...styles.authCard, animationDelay: '0.1s' }}>
                        <div style={styles.authCardInner}>
                            <div style={styles.authLogoRing}>
                                <img src={logo} alt="" width={40} height={46} style={{ width: 40, height: 46, objectFit: 'contain' }} />
                            </div>
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
                                    <div style={{ position: 'relative' }}>
                                        <Mail size={16} color={C.grey} style={styles.inputIcon} />
                                        <input
                                            type="text" placeholder={isLogin ? 'Enter your email or username' : 'Enter your email'} className="ct-input"
                                            style={{ ...styles.input, ...(focusedInput === 'email' ? styles.inputActive : {}), paddingLeft: 42 }}
                                            value={emailOrUsername} onChange={(e) => setEmailOrUsername(e.target.value)}
                                            onFocus={() => setFocusedInput('email')} onBlur={() => setFocusedInput('')}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={styles.inputGroup}>
                                    <div style={styles.rowBetween}>
                                        <label style={styles.label}>Password</label>
                                        {isLogin && (
                                            <button type="button" onClick={() => setToast({ type: 'success', message: 'Password reset link sent (demo mode).' })} style={styles.forgotBtn}>
                                                Forgot password?
                                            </button>
                                        )}
                                    </div>
                                    <div style={{ position: 'relative' }}>
                                        <Lock size={16} color={C.grey} style={styles.inputIcon} />
                                        <input
                                            type={showPassword ? 'text' : 'password'} placeholder="Enter your password" className="ct-input"
                                            style={{ ...styles.input, ...(focusedInput === 'password' ? styles.inputActive : {}), paddingLeft: 42, paddingRight: 40 }}
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

            {/* Why CarbonTrack + quote banner */}
            <section id="why" style={styles.whySection}>
                <div style={styles.whyInner}>
                    <div style={styles.whyHead}>
                        <span style={styles.pillLabel}>Why CarbonTrack?</span>
                        <h2 style={styles.whyTitle}>Habits that actually move the needle.</h2>
                    </div>
                    <div style={styles.whyGrid}>
                        {WHY.map((w) => {
                            const Icon = w.icon;
                            return (
                                <div key={w.title} className="ct-card-hover" style={{ ...styles.whyCard, borderTop: `3px solid ${w.color}` }}>
                                    <span style={{ ...styles.whyIconWrap, background: w.color, boxShadow: `0 8px 18px ${w.color}55` }}>
                                        <Icon size={19} color="#FFFEF9" />
                                    </span>
                                    <div style={styles.whyCardTitle}>{w.title}</div>
                                    <div style={styles.whyCardDesc}>{w.desc}</div>
                                    <span style={{ ...styles.whyArrow, background: w.color }}><ArrowRight size={14} color="#FFFEF9" /></span>
                                </div>
                            );
                        })}
                    </div>

                    <div style={styles.quoteBanner}>
                        <Quote size={22} color={C.lichen} style={{ flex: '0 0 auto', opacity: 0.85 }} />
                        <p style={styles.quoteText}>
                            The greatest threat to our planet is the belief that someone else will save it.
                        </p>
                        <div style={styles.quoteAuthor}>— Robert Swan</div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section id="features" style={styles.section}>
                <div style={styles.sectionInner}>
                    <span style={styles.pillLabel}>What you get</span>
                    <h2 style={styles.sectionTitle}>     Built for daily life, not spreadsheets.</h2>
                    <div style={styles.featureGrid}>
                        {FEATURES.map((f) => {
                            const Icon = f.icon;
                            return (
                                <div
                                    key={f.title}
                                    className="ct-card-hover"
                                    style={{ ...styles.featureCard, borderLeft: `4px solid ${f.color}` }}
                                >
                                    <div style={{ ...styles.featureIconWrap, background: f.color, boxShadow: `0 8px 18px ${f.color}45` }}>
                                        <Icon size={20} color="#FFFEF9" />
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
                    <span style={styles.pillLabel}>How it works</span>
                    <h2 style={styles.sectionTitle}>From a logged commute to a lower footprint</h2>
                    <div style={styles.stepsRow}>
                        {STEPS.map((s, i) => {
                            const accent = [C.mossDark, C.sky, C.clay][i % 3];
                            return (
                                <React.Fragment key={s.n}>
                                    <div style={{ ...styles.stepCard, borderTop: `3px solid ${accent}` }}>
                                        <div style={{ ...styles.stepNumber, background: accent }}>{s.n}</div>
                                        <div style={styles.featureTitle}>{s.title}</div>
                                        <div style={styles.featureDesc}>{s.desc}</div>
                                    </div>
                                    {i < STEPS.length - 1 && <ArrowRight size={20} color={C.grey} style={styles.stepArrow} />}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* About */}
            <section id="about" style={styles.section}>
                <div style={styles.sectionInner}>
                    <div style={styles.aboutGrid}>
                        <div style={styles.aboutLeft}>
                            <span style={styles.aboutPill}>About CarbonTrack</span>
                            <h2 style={styles.aboutTitle}>Built so sustainability doesn't feel like homework</h2>
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
                        </div>
                        <div style={styles.metricGrid}>
                            {[
                                { icon: TrendingDown, value: '58%', label: 'Average drop in weekly footprint', color: C.mossDark },
                                { icon: Flame, value: '6 Days', label: 'Median logging streak', color: C.clay },
                                { icon: Trophy, value: 'Weekly', label: 'Community leaderboards & quests', color: C.olive },
                            ].map((m) => {
                                const Icon = m.icon;
                                return (
                                    <div key={m.value} style={{ ...styles.metricCard, borderLeft: `3px solid ${m.color}` }}>
                                        <div style={{ ...styles.metricIconWrap, background: m.color }}>
                                            <Icon size={16} color="#FFFEF9" />
                                        </div>
                                        <div>
                                            <div style={{ ...styles.metricValue, color: m.color }}>{m.value}</div>
                                            <div style={styles.metricLabel}>{m.label}</div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    <div style={styles.aboutCta}>
                        <div>
                            <div style={styles.aboutCtaTitle}>Start tracking in under a minute</div>
                            <div style={styles.aboutCtaSub}>No card, no spreadsheets — just your first log.</div>
                        </div>
                        <button className="ct-btn" onClick={() => { setIsLogin(false); scrollTo('login'); }} style={{ ...styles.navSolidBtn, whiteSpace: 'nowrap', padding: '13px 24px', fontSize: 14 }}>

                            Get started free <ArrowRight size={14} style={{ verticalAlign: -2, marginLeft: 6 }} />
                        </button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer style={styles.footer}>
                <div style={styles.navLogo}>
                    <img src={logo} alt="" width={28} height={28} style={{ width: 28, height: 28, objectFit: 'contain' }} />
                    <span style={styles.footerWordmark}>Carbon<span style={{ color: C.lichen }}>Track</span></span>
                </div>
                <span style={styles.footerTagline}>Leave lighter. Live better.</span>
                <div style={styles.footerLinks}>
                    {NAV_LINKS.map((l) => (
                        <button key={l.id} className="ct-btn" onClick={() => scrollTo(l.id)} style={styles.footerLink}>{l.label}</button>
                    ))}
                </div>
                <span style={styles.footerCopy}>© {new Date().getFullYear()} CarbonTrack</span>
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
    nav: {
        position: 'sticky',
        top: 0,
        zIndex: 30,
        background: 'rgba(255,254,249,0.92)',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${C.line}`,
    },
    navInner: {
        maxWidth: 1320,
        margin: '0 auto',
        padding: '12px 34px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
    },
    navLogo: { display: 'flex', alignItems: 'center', gap: 10 },
    logoImg: { width: 40, height: 46, objectFit: 'contain', display: 'block' },
    wordmark: { fontFamily: DISPLAY, fontSize: 25, fontWeight: 700, color: C.ink, lineHeight: 1.05 },
    tagline: { fontFamily: MONO, fontSize: 9.5, letterSpacing: '0.12em', textTransform: 'uppercase', color: C.subtext, marginTop: 2 },
    navLinksDesktop: { display: 'flex', gap: 6, alignItems: 'center' },
    navLinkBtn: {
        fontFamily: BODY, fontSize: 14, fontWeight: 500, color: C.charcoal,
        background: 'transparent', border: 'none', padding: '8px 14px', borderRadius: 999, cursor: 'pointer',
    },
    navActionsDesktop: { display: 'flex', alignItems: 'center', gap: 12 },
    navGhostBtn: {
        fontFamily: BODY, fontSize: 14, fontWeight: 500, color: C.charcoal,
        background: 'transparent', border: 'none', padding: '9px 12px', cursor: 'pointer',
    },
    navSolidBtn: {
        fontFamily: BODY, fontSize: 14, fontWeight: 600, color: C.card,
        background: C.mossDark, border: 'none', padding: '12px 22px', borderRadius: 999, cursor: 'pointer',
        boxShadow: '0 6px 16px rgba(30,74,44,0.25)', whiteSpace: 'nowrap',
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

    toast: {
        position: 'fixed', top: 18, right: 18, zIndex: 100,
        display: 'flex', alignItems: 'center', gap: 10,
        background: C.card, borderRadius: 10, padding: '12px 14px',
        boxShadow: '0 12px 30px rgba(27,43,34,0.18)', maxWidth: 340,
    },
    toastDot: { width: 8, height: 8, borderRadius: '50%', flex: '0 0 auto' },
    toastText: { fontFamily: BODY, fontSize: 13, color: C.charcoal, lineHeight: 1.4 },
    toastClose: { background: 'none', border: 'none', cursor: 'pointer', padding: 2, flex: '0 0 auto', display: 'flex' },

    hero: { position: 'relative', zIndex: 3, padding: '52px 34px 0' },
    heroBgClip: { position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 0 },
    heroImg: {
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center bottom',
    },
    heroWash: {
        position: 'absolute', inset: 0,
        background: `linear-gradient(180deg, ${C.paper} 0%, rgba(246,244,236,0.72) 26%, rgba(246,244,236,0.32) 62%, rgba(246,244,236,0.55) 100%)`,
    },
    leafLayer: { position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1 },
    heroInner: {
        position: 'relative', zIndex: 2,
        maxWidth: 1320, margin: '0 auto', display: 'flex', gap: 56,
        alignItems: 'flex-start', flexWrap: 'wrap', justifyContent: 'space-between',
        paddingBottom: 120,
    },
    heroLeft: { flex: '1 1 520px', maxWidth: 640, paddingTop: 24, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' },
    badge: {
        display: 'inline-flex', alignItems: 'center', gap: 8,
        background: 'rgba(143,174,139,0.22)', color: C.mossDark,
        padding: '9px 18px', borderRadius: 999,
        fontSize: 14, fontWeight: 500, marginBottom: 26, fontFamily: BODY,
    },
    title: { fontFamily: DISPLAY, fontSize: 60, fontWeight: 700, lineHeight: 1.1, color: C.ink, margin: '0 0 20px 0', letterSpacing: '-0.5px', textAlign: 'left' },
    subtitle: { fontFamily: BODY, fontSize: 17, lineHeight: 1.6, color: C.charcoal, margin: '0 0 32px 0', maxWidth: 500, textAlign: 'left' },
    heroPoints: { display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-start', alignItems: 'center' },
    heroPoint: {
        display: 'inline-flex', alignItems: 'center', gap: 10,
        padding: '8px 16px', borderRadius: 999,
        background: 'rgba(27,43,34,0.32)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.22)',
    },
    heroPointIcon: {
        display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto',
    },
    heroPointText: { fontFamily: BODY, fontSize: 13.5, fontWeight: 500, color: '#FFFFFF', whiteSpace: 'nowrap', lineHeight: 1.3 },


    authCard: {
        flex: '1 1 400px', maxWidth: 440, background: C.card, borderRadius: 20,
        border: `1px solid rgba(223,218,198,0.8)`, boxShadow: '0 24px 60px rgba(27,43,34,0.16)',
        overflow: 'hidden', boxSizing: 'border-box',
    },
    authCardInner: { padding: '34px 34px 30px' },
    authLogoRing: {
        width: 70, height: 70, borderRadius: '50%', background: C.card,
        border: `1px solid ${C.line}`, boxShadow: '0 6px 18px rgba(27,43,34,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px',
    },
    authTitle: { fontFamily: DISPLAY, fontSize: 27, fontWeight: 700, color: C.ink, margin: '0 0 6px 0', textAlign: 'center' },
    authSubtitle: { fontFamily: BODY, fontSize: 13.5, color: C.subtext, margin: '0 0 24px 0', textAlign: 'center' },
    form: { display: 'flex', flexDirection: 'column', gap: 16 },
    inputRow: { display: 'flex', gap: 12 },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: 7 },
    rowBetween: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
    label: { fontFamily: BODY, fontSize: 13, fontWeight: 600, color: C.charcoal },
    input: {
        padding: '13px 12px', borderRadius: 10, border: `1px solid ${C.line}`,
        fontSize: 14, fontFamily: BODY, color: C.ink, background: C.card,
        outline: 'none', boxSizing: 'border-box', width: '100%',
    },
    inputIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' },
    inputActive: { border: `1px solid ${C.moss}`, boxShadow: `0 0 0 3px ${C.moss}1A` },
    eyeBtn: {
        position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
        background: 'none', border: 'none', cursor: 'pointer', padding: 2, display: 'flex',
    },
    forgotBtn: { background: 'none', border: 'none', color: C.moss, fontSize: 12.5, fontWeight: 600, cursor: 'pointer' },
    submitBtn: {
        background: C.mossDark, color: C.card, padding: '14px', borderRadius: 10, border: 'none',
        fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: BODY, marginTop: 6,
    },
    dividerRow: { display: 'flex', alignItems: 'center', gap: 12, margin: '4px 0' },
    dividerLine: { flex: 1, height: 1, background: C.line },
    dividerText: { fontFamily: MONO, fontSize: 11, color: C.subtext, textTransform: 'uppercase' },
    toggleRow: { marginTop: 20, textAlign: 'center', fontSize: 13.5, fontFamily: BODY },
    toggleBtn: { background: 'none', border: 'none', color: C.moss, fontWeight: 700, cursor: 'pointer', fontSize: 13.5 },

    statBarWrap: { position: 'relative', zIndex: 3, maxWidth: 1320, margin: '0 auto', transform: 'translateY(34px)' },
    statBar: {
        background: C.mossDark, borderRadius: 999, padding: '20px 46px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
        flexWrap: 'wrap', boxShadow: '0 18px 40px rgba(27,43,34,0.22)', maxWidth: 900,
    },
    statItem: { display: 'flex', alignItems: 'center', gap: 12 },
    statValue: { fontFamily: BODY, fontSize: 19, fontWeight: 700, color: '#FFFEF9', lineHeight: 1.2 },
    statLabel: { fontFamily: BODY, fontSize: 12.5, color: 'rgba(255,254,249,0.72)' },

    whySection: {
        position: 'relative', zIndex: 1,
        background: 'linear-gradient(180deg, #EFEBDC 0%, #F6F4EC 100%)',
        padding: '64px 34px',
    },
    whyInner: { maxWidth: 1320, margin: '0 auto' },
    whyHead: { textAlign: 'center', marginBottom: 26 },
    pillLabel: {
        display: 'inline-block', fontFamily: BODY, fontSize: 11, fontWeight: 800,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mossDark,
        background: 'rgba(30,74,44,0.1)', borderRadius: 999, padding: '4px 14px', marginBottom: 12,
    },
    whyTitle: { fontFamily: DISPLAY, fontSize: 30, fontWeight: 600, color: C.ink, margin: 0, letterSpacing: '-0.01em' },
    whyGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: 18 },
    whyCard: {
        position: 'relative', background: C.card, border: `1px solid ${C.line}`,
        borderRadius: 14, padding: '20px 18px 48px',
        boxShadow: '0 8px 24px rgba(27,43,34,0.06)',
    },
    whyIconWrap: {
        width: 42, height: 42, borderRadius: 12,
        display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    },
    whyCardTitle: { fontFamily: BODY, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 6, letterSpacing: '-0.01em' },
    whyCardDesc: { fontFamily: BODY, fontSize: 12.5, lineHeight: 1.55, color: C.subtext },
    whyArrow: {
        position: 'absolute', right: 16, bottom: 14, width: 26, height: 26, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
    },
    quoteBanner: {
        marginTop: 30, background: C.mossDark, borderRadius: 16, padding: '22px 28px',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14,
        flexWrap: 'wrap', textAlign: 'center', boxShadow: '0 14px 34px rgba(27,43,34,0.16)',
    },
    quoteText: {
        fontFamily: DISPLAY, fontSize: 19, lineHeight: 1.45, color: '#FFFEF9',
        margin: 0, maxWidth: 760, fontStyle: 'italic',
    },
    quoteAuthor: { fontFamily: BODY, fontSize: 12.5, fontWeight: 700, letterSpacing: '0.06em', color: 'rgba(255,254,249,0.72)' },

    section: { position: 'relative', zIndex: 2, padding: '72px 34px' },
    sectionInner: { maxWidth: 1320, margin: '0 auto' },
    sectionLabel: { fontFamily: MONO, fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: C.subtext, marginBottom: 8 },
    sectionTitle: { fontFamily: DISPLAY, fontSize: 32, fontWeight: 600, color: C.ink, margin: '14px 0 36px 0', maxWidth: 640, letterSpacing: '-0.01em' },

    featureGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 18 },
    featureCard: {
        background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 22,
        boxShadow: '0 8px 24px rgba(27,43,34,0.06)',
    },
    featureIconWrap: { width: 42, height: 42, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 },
    featureTitle: { fontFamily: BODY, fontSize: 15, fontWeight: 600, color: C.ink, marginBottom: 6, letterSpacing: '-0.01em' },
    featureDesc: { fontFamily: BODY, fontSize: 13, lineHeight: 1.55, color: C.subtext },

    stepsRow: { display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' },
    stepCard: {
        background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: 22, flex: '1 1 240px',
        boxShadow: '0 8px 24px rgba(27,43,34,0.06)',
    },
    stepNumber: {
        fontFamily: MONO, fontSize: 14, fontWeight: 700, color: '#FFFEF9', marginBottom: 14,
        width: 40, height: 30, borderRadius: 999, display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
        letterSpacing: '0.04em',
    },
    stepArrow: { alignSelf: 'center', marginTop: 40, flex: '0 0 auto' },

    aboutGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 34, alignItems: 'start' },
    aboutLeft: { display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left' },
    aboutPill: {
        display: 'inline-block', fontFamily: BODY, fontSize: 11, fontWeight: 800,
        letterSpacing: '0.12em', textTransform: 'uppercase', color: C.mossDark,
        background: 'rgba(30,74,44,0.1)', borderRadius: 999, padding: '4px 14px',
        margin: '0 0 16px 0', alignSelf: 'flex-start',
    },
    aboutTitle: { fontFamily: DISPLAY, fontSize: 32, fontWeight: 600, color: C.ink, margin: '0 0 24px 0', maxWidth: '100%', letterSpacing: '-0.01em', textAlign: 'left' },
    aboutText: { fontFamily: BODY, fontSize: 15.5, lineHeight: 1.75, color: C.charcoal, marginBottom: 24, marginTop: 0, textAlign: 'left' },
    aboutChecks: { display: 'flex', flexDirection: 'column', gap: 10, textAlign: 'left' },
    aboutCheckItem: { display: 'flex', alignItems: 'left', gap: 8, fontFamily: BODY, fontSize: 14, color: C.charcoal, textAlign: 'left' },

    metricGrid: { display: 'flex', flexDirection: 'column', gap: 14 },
    metricCard: {
        background: C.card, border: `1px solid ${C.line}`, borderRadius: 14, padding: '18px 20px',
        boxShadow: '0 8px 24px rgba(27,43,34,0.06)', display: 'flex', alignItems: 'center', gap: 16,
    },
    metricIconWrap: { width: 38, height: 38, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: '0 0 auto' },
    metricValue: { fontFamily: DISPLAY, fontSize: 30, fontWeight: 700, lineHeight: 1.05 },
    metricLabel: { fontFamily: BODY, fontSize: 13, color: C.subtext, marginTop: 4 },

    aboutCta: {
        marginTop: 34, background: C.ink, borderRadius: 16, padding: '24px 28px',
        display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 18,
    },
    aboutCtaTitle: { fontFamily: DISPLAY, fontSize: 21, fontWeight: 700, color: '#FFFEF9' },
    aboutCtaSub: { fontFamily: BODY, fontSize: 13, color: 'rgba(255,254,249,0.7)', marginTop: 4 },

    footer: {
        position: 'relative', zIndex: 2, background: C.ink, padding: '44px 30px 34px',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12,
    },
    footerWordmark: { fontFamily: DISPLAY, fontSize: 18, fontWeight: 700, color: '#FFFEF9' },
    footerTagline: { fontFamily: BODY, fontSize: 12.5, color: 'rgba(255,254,249,0.66)' },
    footerLinks: { display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 20, marginTop: 6 },
    footerLink: {
        background: 'none', border: 'none', padding: 0, cursor: 'pointer',
        fontFamily: BODY, fontSize: 13, color: 'rgba(255,254,249,0.82)',
    },
    footerCopy: { fontFamily: MONO, fontSize: 11, letterSpacing: '0.08em', color: 'rgba(255,254,249,0.45)', marginTop: 8 },
};