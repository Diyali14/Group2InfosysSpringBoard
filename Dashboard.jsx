import React, { useState, useMemo, useContext, createContext, useEffect } from "react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, BarChart, Bar,
} from "recharts";
import {
    Car, Zap, UtensilsCrossed, Trash2, Leaf, TrendingUp, TrendingDown,
    Trophy, Users, Building2, Plus, ChevronLeft, ChevronRight, Minus,
    Home, TrendingUp as TrendIcon, PlusCircle, Sun, Moon, Flame,
    CheckCircle2, Circle, ArrowRight, Award, Lock, Shield
} from "lucide-react";

/* ---------------------------------------------------------------- */
/* Theme tokens — light (base) + dark variant                        */
/* ---------------------------------------------------------------- */
const LIGHT = {
    paper: "#F6F4EC",
    paperRaised: "#EFEBDC",
    card: "#FFFEF9",
    ink: "#1B2B22",
    charcoal: "#2A2E28",
    subtext: "#6B6A5C",
    moss: "#3F6B4A",
    mossDark: "#2E5138",
    lichen: "#8FAE8B",
    clay: "#C2622B",
    sky: "#6FA8B5",
    olive: "#A98B4E",
    grey: "#9B9A8C",
    line: "#DFDAC6",
    danger: "#B23B3B",
};
const DARK = {
    paper: "#141F19",
    paperRaised: "#1B2921",
    card: "#1C2A22",
    ink: "#EDEAdc",
    charcoal: "#D6D2C0",
    subtext: "#8C9488",
    moss: "#5FA873",
    mossDark: "#3F6B4A",
    lichen: "#8FAE8B",
    clay: "#E08A52",
    sky: "#7FC0CF",
    olive: "#CBA766",
    grey: "#6E756A",
    line: "#2B3A31",
    danger: "#E27676",
};
const DISPLAY = "'Iowan Old Style','Palatino Linotype',Georgia,serif";
const BODY = "'Inter','Segoe UI',ui-sans-serif,system-ui,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,monospace";

const ThemeContext = createContext(LIGHT);
const useTheme = () => useContext(ThemeContext);

/* ---------------------------------------------------------------- */
/* Mock reference data (stands in for backend)                       */
/* ---------------------------------------------------------------- */
const USER_NAME = "";
const STREAK_DAYS = 6;

const CATEGORIES = ["Transport", "Energy", "Food", "Waste"];
const CATEGORY_COLOR = (T) => ({ Transport: T.sky, Energy: T.clay, Food: T.moss, Waste: T.olive });
const CATEGORY_ICON = { Transport: Car, Energy: Zap, Food: UtensilsCrossed, Waste: Trash2 };

const EMISSION_FACTORS = {
    Transport: {
        "Car (petrol)": { factor: 0.192, unit: "km" },
        "Car (diesel)": { factor: 0.171, unit: "km" },
        Bus: { factor: 0.089, unit: "km" },
        Train: { factor: 0.041, unit: "km" },
        "Flight (short-haul)": { factor: 0.255, unit: "km" },
        "Bicycle / Walk": { factor: 0, unit: "km" },
    },
    Energy: {
        "Grid electricity": { factor: 0.233, unit: "kWh" },
        "Natural gas": { factor: 0.184, unit: "kWh" },
        LPG: { factor: 2.983, unit: "kg" },
    },
    Food: {
        "Beef meal": { factor: 6.61, unit: "serving" },
        "Chicken meal": { factor: 1.57, unit: "serving" },
        "Vegetarian meal": { factor: 0.51, unit: "serving" },
        "Dairy milk": { factor: 1.13, unit: "litre" },
    },
    Waste: {
        "Landfill waste": { factor: 0.58, unit: "kg" },
        "Recycled waste": { factor: 0.02, unit: "kg" },
        Compost: { factor: 0.01, unit: "kg" },
    },
};

const QUICK_LOG = [
    { label: "Car commute", category: "Transport", activityType: "Car (petrol)", quantity: 12 },
    { label: "Bus to work", category: "Transport", activityType: "Bus", quantity: 8 },
    { label: "Home power", category: "Energy", activityType: "Grid electricity", quantity: 5 },
    { label: "Chicken lunch", category: "Food", activityType: "Chicken meal", quantity: 1 },
    { label: "Recycling", category: "Waste", activityType: "Recycled waste", quantity: 2 },
    { label: "Train ride", category: "Transport", activityType: "Train", quantity: 15 },
];

const SEED_TODAY = [
    { id: 1, category: "Transport", activityType: "Car (petrol)", quantity: 9, unit: "km", co2e: 9 * 0.192 },
    { id: 2, category: "Food", activityType: "Vegetarian meal", quantity: 2, unit: "serving", co2e: 2 * 0.51 },
    { id: 3, category: "Energy", activityType: "Grid electricity", quantity: 3, unit: "kWh", co2e: 3 * 0.233 },
];

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_INDEX = 3; // Thursday, for the mock
const LAST_WEEK = [6.1, 7.8, 5.2, 8.9, 6.6, 9.4, 4.1];
const THIS_WEEK_SO_FAR = [5.4, 6.9, 4.8]; // Mon-Wed already logged

const MONTHLY_TARGET = 250;
const MONTHLY_BEFORE_TODAY = 168.4;

const LEADERBOARD = [
    { name: "Priya N.", weekly: 21.3 },
    { name: "You", weekly: null },
    { name: "Marcus O.", weekly: 24.8 },
    { name: "Elena V.", weekly: 27.1 },
    { name: "Dev K.", weekly: 31.5 },
    { name: "Sam T.", weekly: 35.9 },
    { name: "Ana R.", weekly: 40.2 },
];

const DEPARTMENTS = [
    { dept: "Engineering", avg: 28.4 },
    { dept: "Sales", avg: 41.2 },
    { dept: "Operations", avg: 33.7 },
    { dept: "Design", avg: 24.1 },
    { dept: "Support", avg: 29.9 },
];

const TEAM_MEMBERS = [
    { name: "Priya N.", dept: "Design", weekly: 21.3, trend: -6 },
    { name: "Marcus O.", dept: "Engineering", weekly: 24.8, trend: -2 },
    { name: "Elena V.", dept: "Engineering", weekly: 27.1, trend: 3 },
    { name: "Dev K.", dept: "Operations", weekly: 31.5, trend: 1 },
    { name: "Sam T.", dept: "Sales", weekly: 35.9, trend: 8 },
    { name: "Ana R.", dept: "Sales", weekly: 40.2, trend: 5 },
];

/* ---------------------------------------------------------------- */
/* Gamification Badges Milestones Definition                        */
/* ---------------------------------------------------------------- */
const BADGES = [
    {
        id: "streak_7",
        name: "Consistent Carver",
        desc: "Maintained a logging streak of 7 days or more.",
        sub: "7-day logging streak completed",
        icon: Flame,
        color: (T) => T.clay,
        requirement: "7-day logging streak"
    },
    {
        id: "first_goal",
        name: "Green Budgeter",
        desc: "First daily quest achieved. Keep up the clean routines!",
        sub: "First daily quest achieved",
        icon: CheckCircle2,
        color: (T) => T.moss,
        requirement: "Complete 1 daily quest"
    },
    {
        id: "reduction_10",
        name: "Carbon Cutter",
        desc: "Reduced your cumulative CO₂e emissions by 10 kg.",
        sub: "CO₂e reduction tier 1 hit",
        icon: Leaf,
        color: (T) => T.sky,
        requirement: "Reduce 10 kg CO₂e"
    },
    {
        id: "reduction_25",
        name: "Eco Supporter",
        desc: "Reduced your cumulative CO₂e emissions by 25 kg.",
        sub: "CO₂e reduction tier 2 hit",
        icon: Award,
        color: (T) => T.olive,
        requirement: "Reduce 25 kg CO₂e"
    },
    {
        id: "reduction_50",
        name: "Zero Waste Pro",
        desc: "Reduced your cumulative CO₂e emissions by 50 kg.",
        sub: "CO₂e reduction tier 3 hit",
        icon: Trash2,
        color: (T) => T.danger,
        requirement: "Reduce 50 kg CO₂e"
    }
];

// static badges for mock members on the leaderboard
const MOCK_MEMBER_BADGES = {
    "Priya N.": ["streak_7", "reduction_10"],
    "Marcus O.": ["reduction_10"],
    "Elena V.": ["first_goal"],
    "Dev K.": ["streak_7", "first_goal", "reduction_25"],
    "Sam T.": ["reduction_10", "reduction_25", "reduction_50"],
    "Ana R.": ["first_goal", "reduction_10"]
};

const fmt1 = (n) => (Math.round(n * 10) / 10).toFixed(1);
const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

/* ---------------------------------------------------------------- */
/* Small building blocks                                             */
/* ---------------------------------------------------------------- */
function SectionLabel({ children, style }) {
    const T = useTheme();
    return (
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: T.subtext, marginBottom: 10, ...style }}>
            {children}
        </div>
    );
}

function Card({ children, style }) {
    const T = useTheme();
    return (
        <div style={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 10, padding: 20, ...style }}>
            {children}
        </div>
    );
}

function Trend({ value }) {
    const T = useTheme();
    const good = value < 0;
    const flat = value === 0;
    const Icon = flat ? Minus : good ? TrendingDown : TrendingUp;
    const color = flat ? T.subtext : good ? T.moss : T.danger;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color, fontFamily: MONO, fontSize: 12 }}>
      <Icon size={13} strokeWidth={2.5} />
            {Math.abs(value)}%
    </span>
    );
}

/* ---------------------------------------------------------------- */
/* Top navigation                                                    */
/* ---------------------------------------------------------------- */
const TABS = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "log", label: "Log Activity", icon: PlusCircle },
    { key: "trends", label: "Trends", icon: TrendIcon },
    { key: "badges", label: "Badges", icon: Award },
    { key: "leaderboard", label: "Leaderboard", icon: Trophy },
    { key: "team", label: "Team Report", icon: Building2 },
];

function TopNav({ activeTab, onTab, dark, onToggleDark }) {
    const T = useTheme();
    return (
        <div
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                padding: "12px 32px",
                borderBottom: `1px solid ${T.line}`,
                background: T.card,
                flexWrap: "wrap",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginRight: 8 }}>
                <Leaf size={20} color={T.moss} />
                <span style={{ fontFamily: DISPLAY, fontSize: 20, color: T.ink }}> CarbonTrack </span>
            </div>

            <div style={{ display: "flex", gap: 4, flex: 1, flexWrap: "wrap" }}>
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onTab(tab.key)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "8px 14px",
                                fontFamily: BODY,
                                fontSize: 13,
                                fontWeight: active ? 700 : 500,
                                color: active ? T.ink : T.subtext,
                                background: active ? T.paperRaised : "transparent",
                                border: "none",
                                borderRadius: 999,
                                cursor: "pointer",
                            }}
                        >
                            <Icon size={14} strokeWidth={2} color={active ? T.moss : T.subtext} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <button
                onClick={onToggleDark}
                aria-label="Toggle dark mode"
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "6px 10px",
                    borderRadius: 999,
                    border: `1px solid ${T.line}`,
                    background: T.paperRaised,
                    cursor: "pointer",
                }}
            >
                <Sun size={13} color={!dark ? T.olive : T.subtext} />
                <div
                    style={{
                        width: 30,
                        height: 16,
                        borderRadius: 999,
                        background: dark ? T.moss : T.line,
                        position: "relative",
                        transition: "background 0.2s ease",
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            top: 2,
                            left: dark ? 16 : 2,
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            background: T.card,
                            transition: "left 0.2s ease",
                        }}
                    />
                </div>
                <Moon size={13} color={dark ? T.sky : T.subtext} />
            </button>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* Dashboard home — greeting, streak, quests                         */
/* ---------------------------------------------------------------- */
function DashboardHome({ activities, todayTotal, rank, quests, onNavigate, earnedIds }) {
    const T = useTheme();
    const dailyAvg = 8.2;
    const monthTotal = MONTHLY_BEFORE_TODAY + todayTotal;
    const monthPct = Math.min(100, Math.round((monthTotal / MONTHLY_TARGET) * 100));
    const completedCount = quests.filter((q) => q.done).length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Greeting banner */}
            <Card style={{ background: `linear-gradient(120deg, ${T.mossDark}, ${T.moss})`, border: "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div>
                        <div style={{ fontFamily: DISPLAY, fontSize: 26, color: T.paper }}>
                            {greeting()}
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: 13, color: T.paper, opacity: 0.85, marginTop: 4 }}>
                            You're on a {earnedIds.includes("streak_7") ? 7 : 6}-day logging streak — every entry keeps your footprint honest.
                        </div>
                    </div>
                    <div style={{ display: "flex", gap: 20 }}>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 4, justifyContent: "center" }}>
                                <Flame size={16} color={T.paper} />
                                <span style={{ fontFamily: DISPLAY, fontSize: 22, color: T.paper }}>{earnedIds.includes("streak_7") ? 7 : 6}</span>
                            </div>
                            <div style={{ fontFamily: MONO, fontSize: 10, color: T.paper, opacity: 0.8 }}>DAY STREAK</div>
                        </div>
                        <div style={{ textAlign: "center" }}>
                            <div style={{ fontFamily: DISPLAY, fontSize: 22, color: T.paper }}>#{rank}</div>
                            <div style={{ fontFamily: MONO, fontSize: 10, color: T.paper, opacity: 0.8 }}>COMMUNITY RANK</div>
                        </div>
                    </div>
                </div>
            </Card>

            {/* Stat row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                <Card>
                    <SectionLabel>Today</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 26, color: T.ink }}>{fmt1(todayTotal)} <span style={{ fontSize: 13, fontFamily: BODY, color: T.subtext }}>kg</span></div>
                    <div style={{ marginTop: 4 }}><Trend value={Math.round(((todayTotal - dailyAvg) / dailyAvg) * 100)} /></div>
                </Card>
                <Card>
                    <SectionLabel>Logged today</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 26, color: T.ink }}>{activities.length} <span style={{ fontSize: 13, fontFamily: BODY, color: T.subtext }}>entries</span></div>
                </Card>
                <Card>
                    <SectionLabel>Monthly budget</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 26, color: T.ink }}>{monthPct}<span style={{ fontSize: 13, fontFamily: BODY, color: T.subtext }}>%</span></div>
                </Card>
                <Card>
                    <SectionLabel>Quests done</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 26, color: T.ink }}>{completedCount} <span style={{ fontSize: 13, fontFamily: BODY, color: T.subtext }}>/ {quests.length}</span></div>
                </Card>
            </div>

            {/* Quests */}
            <Card>
                <SectionLabel>Today's quests</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {quests.map((q) => {
                        const Icon = q.done ? CheckCircle2 : Circle;
                        return (
                            <div
                                key={q.key}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 10,
                                    padding: "10px 4px",
                                    borderTop: `1px solid ${T.line}`,
                                }}
                            >
                                <Icon size={17} color={q.done ? T.moss : T.grey} strokeWidth={2} />
                                <span style={{ flex: 1, fontFamily: BODY, fontSize: 13, color: q.done ? T.subtext : T.ink, textDecoration: q.done ? "line-through" : "none" }}>
                  {q.label}
                </span>
                                <span style={{ fontFamily: MONO, fontSize: 11, color: q.done ? T.moss : T.subtext, textTransform: "uppercase" }}>
                  {q.done ? "Done" : "Pending"}
                </span>
                                {!q.done && q.tab && (
                                    <button
                                        onClick={() => onNavigate(q.tab)}
                                        style={{ border: "none", background: "transparent", cursor: "pointer", color: T.moss, display: "flex", alignItems: "center" }}
                                        aria-label={`Go to ${q.tab}`}
                                    >
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Gamification Badges Panel (Interactive portfolio shortcuts) */}
            <Card>
                <div style={{ display: "flex", alignItems: "center", justifyCOntent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Trophy size={16} color={T.olive} />
                        <SectionLabel style={{ marginBottom: 0 }}>Gamification Badges</SectionLabel>
                    </div>
                    <button
                        onClick={() => onNavigate("badges")}
                        style={{ border: "none", background: "transparent", color: T.moss, fontFamily: BODY, fontSize: 12, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 4 }}
                    >
                        View Details <ArrowRight size={13} />
                    </button>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
                    {BADGES.map((b) => {
                        const isEarned = earnedIds.includes(b.id);
                        const Icon = b.icon;
                        const badgeColor = b.color(T);
                        return (
                            <div
                                key={b.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "12px 14px",
                                    borderRadius: 8,
                                    background: isEarned ? T.paperRaised : "transparent",
                                    border: `1px solid ${isEarned ? T.moss : T.line}`,
                                    opacity: isEarned ? 1 : 0.45,
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
                                }}
                            >
                                <div
                                    style={{
                                        width: 32,
                                        height: 32,
                                        borderRadius: "50%",
                                        background: isEarned ? badgeColor : T.line,
                                        color: isEarned ? T.paper : T.subtext,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        transition: "transform 0.3s ease"
                                    }}
                                >
                                    {isEarned ? <Icon size={16} /> : <Lock size={14} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: T.ink }}>
                                        {b.name}
                                    </div>
                                    <div style={{ fontFamily: BODY, fontSize: 11, color: T.subtext }}>
                                        {isEarned ? b.sub : `Locked · ${b.requirement}`}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            {/* Quick links */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                    { tab: "log", label: "Log an activity", desc: "Add today's commute, meals, or power use.", icon: PlusCircle },
                    { tab: "trends", label: "Check your trend", desc: "This week vs. last week, category breakdown.", icon: TrendIcon },
                    { tab: "badges", label: "View your badges", desc: "Unlock gamified milestone accomplishments.", icon: Award },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.tab}
                            onClick={() => onNavigate(item.tab)}
                            style={{
                                textAlign: "left",
                                background: T.card,
                                border: `1px solid ${T.line}`,
                                borderRadius: 10,
                                padding: 16,
                                cursor: "pointer",
                            }}
                        >
                            <Icon size={18} color={T.moss} />
                            <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 700, color: T.ink, marginTop: 8 }}>{item.label}</div>
                            <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, marginTop: 2 }}>{item.desc}</div>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* Activity Logger                                                   */
/* ---------------------------------------------------------------- */
function ActivityLogger({ onLog }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const [category, setCategory] = useState("Transport");
    const [activityType, setActivityType] = useState(Object.keys(EMISSION_FACTORS.Transport)[0]);
    const [quantity, setQuantity] = useState("");
    const [carouselStart, setCarouselStart] = useState(0);

    const factorInfo = EMISSION_FACTORS[category][activityType];
    const qtyNum = parseFloat(quantity) || 0;
    const preview = qtyNum * factorInfo.factor;
    const intensity = preview < 3 ? T.moss : preview < 8 ? T.olive : T.clay;

    const changeCategory = (cat) => {
        setCategory(cat);
        setActivityType(Object.keys(EMISSION_FACTORS[cat])[0]);
    };

    const applyPreset = (preset) => {
        setCategory(preset.category);
        setActivityType(preset.activityType);
        setQuantity(String(preset.quantity));
    };

    const submit = () => {
        if (qtyNum <= 0) return;
        onLog({ id: Date.now(), category, activityType, quantity: qtyNum, unit: factorInfo.unit, co2e: preview });
        setQuantity("");
    };

    const visible = QUICK_LOG.slice(carouselStart, carouselStart + 3);

    return (
        <Card>
            <SectionLabel>Log an activity</SectionLabel>

            <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: `1px solid ${T.line}` }}>
                {CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICON[cat];
                    const active = cat === category;
                    return (
                        <button
                            key={cat}
                            onClick={() => changeCategory(cat)}
                            style={{
                                display: "flex", alignItems: "center", gap: 6, padding: "8px 12px",
                                fontFamily: BODY, fontSize: 13, fontWeight: active ? 600 : 500,
                                color: active ? T.ink : T.subtext, background: "transparent", border: "none",
                                borderBottom: active ? `2px solid ${CATCOLOR[cat]}` : "2px solid transparent",
                                marginBottom: -1, cursor: "pointer",
                            }}
                        >
                            <Icon size={15} strokeWidth={2} color={active ? CATCOLOR[cat] : T.subtext} />
                            {cat}
                        </button>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, display: "block", marginBottom: 6 }}>Activity type</label>
                    <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                        style={{ width: "100%", padding: "9px 10px", fontFamily: BODY, fontSize: 14, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6 }}
                    >
                        {Object.keys(EMISSION_FACTORS[category]).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: "0 0 140px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, display: "block", marginBottom: 6 }}>Quantity ({factorInfo.unit})</label>
                    <input
                        type="number" min="0" step="0.1" value={quantity}
                        onChange={(e) => setQuantity(e.target.value)} placeholder="0"
                        style={{ width: "100%", padding: "9px 10px", fontFamily: MONO, fontSize: 14, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6, boxSizing: "border-box" }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyCOntent: "space-between", padding: "12px 14px", background: T.paper, borderRadius: 8, marginBottom: 18 }}>
                <span style={{ fontFamily: BODY, fontSize: 13, color: T.subtext }}> Estimated CO₂e </span>
                <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: intensity }}>
          {fmt1(preview)} <span style={{ fontSize: 12, fontWeight: 400 }}>kg</span>
        </span>
            </div>

            <button
                onClick={submit}
                disabled={qtyNum <= 0}
                style={{
                    width: "100%", padding: "11px 0", fontFamily: BODY, fontSize: 14, fontWeight: 600,
                    color: T.paper, background: qtyNum > 0 ? T.moss : T.grey, border: "none", borderRadius: 6,
                    cursor: qtyNum > 0 ? "pointer" : "not-allowed", marginBottom: 22,
                }}
            >
                <Plus size={14} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />
                Log activity
            </button>

            <div>
                <div style={{ display: "flex", alignItems: "center", justifyCOntent: "space-between", marginBottom: 10 }}>
                    <SectionLabel>Quick log</SectionLabel>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setCarouselStart(Math.max(0, carouselStart - 1))} disabled={carouselStart === 0}
                                style={{ border: `1px solid ${T.line}`, background: T.paper, borderRadius: 5, padding: 3, cursor: "pointer" }}>
                            <ChevronLeft size={14} color={T.subtext} />
                        </button>
                        <button onClick={() => setCarouselStart(Math.min(QUICK_LOG.length - 3, carouselStart + 1))} disabled={carouselStart >= QUICK_LOG.length - 3}
                                style={{ border: `1px solid ${T.line}`, background: T.paper, borderRadius: 5, padding: 3, cursor: "pointer" }}>
                            <ChevronRight size={14} color={T.subtext} />
                        </button>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {visible.map((preset) => {
                        const Icon = CATEGORY_ICON[preset.category];
                        return (
                            <button key={preset.label} onClick={() => applyPreset(preset)}
                                    style={{ flex: 1, textAlign: "left", padding: "10px 12px", background: T.paper, border: `1px dashed ${T.line}`, borderRadius: 8, cursor: "pointer" }}>
                                <Icon size={14} color={CATCOLOR[preset.category]} style={{ marginBottom: 6 }} />
                                <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, color: T.ink }}>{preset.label}</div>
                                <div style={{ fontFamily: MONO, fontSize: 11, color: T.subtext }}>
                                    {preset.quantity} {EMISSION_FACTORS[preset.category][preset.activityType].unit}
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Today's footprint card                                            */
/* ---------------------------------------------------------------- */
function TodaysFootprint({ activities }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const total = activities.reduce((s, a) => s + a.co2e, 0);
    const dailyAvg = 8.2;
    const diff = ((total - dailyAvg) / dailyAvg) * 100;
    const byCategory = CATEGORIES.map((cat) => ({
        category: cat, value: activities.filter((a) => a.category === cat).reduce((s, a) => s + a.co2e, 0),
    })).filter((c) => c.value > 0);

    return (
        <Card>
            <SectionLabel>Today's footprint</SectionLabel>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 42, color: T.ink, lineHeight: 1 }}>{fmt1(total)}</span>
                <span style={{ fontFamily: BODY, fontSize: 15, color: T.subtext }}>kg CO₂e</span>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, marginBottom: 18 }}>
                <Trend value={Math.round(diff)} /> vs. your {fmt1(dailyAvg)} kg daily average
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {byCategory.map((c) => (
                    <div key={c.category} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATCOLOR[c.category] }} />
                        <span style={{ fontFamily: BODY, fontSize: 12, color: T.charcoal, flex: 1 }}>{c.category}</span>
                        <span style={{ fontFamily: MONO, fontSize: 12, color: T.subtext }}>{fmt1(c.value)} kg</span>
                    </div>
                ))}
                {byCategory.length === 0 && <span style={{ fontFamily: BODY, fontSize: 12, color: T.subtext }}>Nothing logged yet today.</span>}
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Category breakdown pie chart                                      */
/* ---------------------------------------------------------------- */
function CategoryPie({ activities }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const data = CATEGORIES.map((cat) => ({
        name: cat, value: activities.filter((a) => a.category === cat).reduce((s, a) => s + a.co2e, 0),
    })).filter((d) => d.value > 0);
    const total = data.reduce((s, d) => s + d.value, 0);

    return (
        <Card>
            <SectionLabel>Today's breakdown by category</SectionLabel>
            <div style={{ position: "relative", height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                            {data.map((d) => <Cell key={d.name} fill={CATCOLOR[d.name]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 6, background: T.card }} formatter={(v) => [`${fmt1(v)} kg CO₂e`, ""]} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily: BODY, fontSize: 12, color: T.subtext }} />
                    </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", top: "44%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 22, color: T.ink }}>{fmt1(total)}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: T.subtext }}>kg total</div>
                </div>
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Weekly trend line chart                                           */
/* ---------------------------------------------------------------- */
function WeeklyTrend({ todayTotal }) {
    const T = useTheme();
    const data = WEEK_DAYS.map((day, i) => {
        let thisWeek = null;
        if (i < TODAY_INDEX) thisWeek = THIS_WEEK_SO_FAR[i];
        if (i === TODAY_INDEX) thisWeek = todayTotal;
        return { day, "This week": thisWeek, "Last week": LAST_WEEK[i] };
    });
    const thisWeekTotal = THIS_WEEK_SO_FAR.reduce((s, v) => s + v, 0) + todayTotal;
    const lastWeekToDate = LAST_WEEK.slice(0, TODAY_INDEX + 1).reduce((s, v) => s + v, 0);
    const diff = ((thisWeekTotal - lastWeekToDate) / lastWeekToDate) * 100;

    return (
        <Card>
            <div style={{ display: "flex", justifyCOntent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <SectionLabel>This week vs. last week</SectionLabel>
                <Trend value={Math.round(diff)} />
            </div>
            <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke={T.line} vertical={false} />
                        <XAxis dataKey="day" tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={{ stroke: T.line }} tickLine={false} />
                        <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 6, background: T.card }} formatter={(v) => (v == null ? ["—", ""] : [`${fmt1(v)} kg`, ""])} />
                        <Legend wrapperStyle={{ fontFamily: BODY, fontSize: 12, color: T.subtext }} />
                        <Line type="monotone" dataKey="Last week" stroke={T.grey} strokeWidth={2} strokeDasharray="4 3" dot={false} />
                        <Line type="monotone" dataKey="This week" stroke={T.moss} strokeWidth={2.5} dot={{ r: 3, fill: T.moss }} connectNulls={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Monthly progress "vine"                                           */
/* ---------------------------------------------------------------- */
function MonthlyProgress({ todayTotal }) {
    const T = useTheme();
    const monthTotal = MONTHLY_BEFORE_TODAY + todayTotal;
    const pct = Math.min(100, (monthTotal / MONTHLY_TARGET) * 100);
    const over = monthTotal > MONTHLY_TARGET;

    return (
        <Card>
            <div style={{ display: "flex", justifyCOntent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <SectionLabel>Monthly budget</SectionLabel>
                <span style={{ fontFamily: MONO, fontSize: 13, color: T.subtext }}>
          <span style={{ color: over ? T.danger : T.ink, fontWeight: 600 }}>{fmt1(monthTotal)}</span> / {MONTHLY_TARGET} kg CO₂e
        </span>
            </div>
            <div style={{ position: "relative", height: 14, background: T.paper, borderRadius: 999, border: `1px solid ${T.line}` }}>
                <div style={{ position: "absolute", top: -1, left: 0, height: 14, width: `${pct}%`, background: `linear-gradient(90deg, ${T.lichen}, ${over ? T.danger : T.moss})`, borderRadius: 999, transition: "width 0.4s ease" }} />
                <div style={{ position: "absolute", top: -5, left: `calc(${pct}% - 10px)`, fontSize: 16, transition: "left 0.4s ease" }}>🌱</div>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, marginTop: 10 }}>
                {over ? "You've passed this month's budget — small swaps in Transport or Food add up fastest." : `${fmt1(MONTHLY_TARGET - monthTotal)} kg left before you reach your monthly target.`}
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Badges Tab View                                                   */
/* ---------------------------------------------------------------- */
function BadgesView({ earnedIds, reduction, activeStreak }) {
    const T = useTheme();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Milestones Performance Metric Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                <Card>
                    <SectionLabel>Streak Progress</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 28, color: T.ink, display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <Flame size={24} color={activeStreak >= 7 ? T.clay : T.subtext} />
                        {activeStreak} <span style={{ fontSize: 14, fontFamily: BODY, color: T.subtext }}>/ 7 days completed</span>
                    </div>
                </Card>
                <Card>
                    <SectionLabel>Total CO₂e Saved</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 28, color: T.ink, display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <Leaf size={24} color={T.moss} />
                        {fmt1(reduction)} <span style={{ fontSize: 14, fontFamily: BODY, color: T.subtext }}>kg reduction</span>
                    </div>
                </Card>
                <Card>
                    <SectionLabel>Achievements Unlocked</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 28, color: T.ink, display: "flex", alignItems: "center", gap: 8, marginTop: 4 }}>
                        <Award size={24} color={T.olive} />
                        {earnedIds.length} <span style={{ fontSize: 14, fontFamily: BODY, color: T.subtext }}>/ {BADGES.length} badges</span>
                    </div>
                </Card>
            </div>

            {/* Complete Badges Grid Display */}
            <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 18 }}>
                    <Trophy size={18} color={T.olive} />
                    <SectionLabel style={{ marginBottom: 0 }}>My Gamification Badges Portfolio</SectionLabel>
                </div>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 16 }}>
                    {BADGES.map((b) => {
                        const isEarned = earnedIds.includes(b.id);
                        const Icon = b.icon;
                        const badgeColor = b.color(T);

                        return (
                            <div
                                key={b.id}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 16,
                                    padding: 20,
                                    borderRadius: 10,
                                    border: `1px solid ${isEarned ? T.moss : T.line}`,
                                    background: isEarned ? T.paperRaised : "transparent",
                                    opacity: isEarned ? 1 : 0.5,
                                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                            >
                                <div
                                    style={{
                                        width: 52,
                                        height: 52,
                                        borderRadius: "50%",
                                        background: isEarned ? badgeColor : T.line,
                                        color: isEarned ? T.paper : T.subtext,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        boxShadow: isEarned ? "0 4px 12px rgba(0,0,0,0.12)" : "none",
                                    }}
                                >
                                    {isEarned ? <Icon size={24} /> : <Lock size={20} />}
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: "flex", justifyCOntent: "space-between", alignItems: "baseline" }}>
                                        <span style={{ fontFamily: BODY, fontSize: 15, fontWeight: 700, color: T.ink }}>{b.name}</span>
                                        <span style={{ fontFamily: MONO, fontSize: 10, color: isEarned ? T.moss : T.grey, textTransform: "uppercase", fontWeight: 700 }}>
                                            {isEarned ? "Unlocked ✓" : "Locked"}
                                        </span>
                                    </div>
                                    <p style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, margin: "4px 0 8px 0", lineHeight: "1.4" }}>{b.desc}</p>
                                    <div style={{ fontFamily: MONO, fontSize: 10, color: T.grey, textTransform: "uppercase", letterSpacing: "0.03em" }}>
                                        Requirement: {b.requirement}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* Leaderboard                                                       */
/* ---------------------------------------------------------------- */
function Leaderboard({ youWeekly, earnedIds, onSelectMember }) {
    const T = useTheme();
    const [scope, setScope] = useState("Friends");
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const ranked = useMemo(() => {
        const withYou = LEADERBOARD.map((p) => (p.name === "You" ? { ...p, weekly: youWeekly } : p));
        return [...withYou].sort((a, b) => a.weekly - b.weekly);
    }, [youWeekly]);

    return (
        <Card>
            <div style={{ display: "flex", justifyCOntent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Trophy size={16} color={T.olive} />
                    <SectionLabel style={{ marginBottom: 0 }}>Community leaderboard · lowest weekly CO₂e</SectionLabel>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                    {["Friends", "Global"].map((s) => (
                        <button key={s} onClick={() => setScope(s)}
                                style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 999, border: `1px solid ${scope === s ? T.moss : T.line}`, background: scope === s ? T.moss : "transparent", color: scope === s ? T.paper : T.subtext, cursor: "pointer" }}>
                            {s}
                        </button>
                    ))}
                </div>
            </div>

            <div style={{ fontFamily: BODY, fontSize: 11, color: T.subtext, marginBottom: 10, paddingLeft: 8 }}>
                💡 Click on any community member to view their complete earned badges portfolio!
            </div>

            <div style={{ display: "flex", flexDirection: "column" }}>
                {ranked.map((p, i) => {
                    const isYou = p.name === "You";
                    const teamInfo = TEAM_MEMBERS.find((m) => m.name === p.name);
                    const badges = isYou ? earnedIds : (MOCK_MEMBER_BADGES[p.name] || []);

                    return (
                        <div
                            key={p.name}
                            onMouseEnter={() => setHoveredIdx(i)}
                            onMouseLeave={() => setHoveredIdx(null)}
                            onClick={() => onSelectMember({
                                name: p.name,
                                weekly: isYou ? youWeekly : p.weekly,
                                dept: teamInfo ? teamInfo.dept : null,
                                badges: badges
                            })}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "10px 12px",
                                borderRadius: 8,
                                background: isYou ? T.paper : (hoveredIdx === i ? T.paperRaised : "transparent"),
                                border: isYou ? `1.5px solid ${T.moss}` : "1.5px solid transparent",
                                cursor: "pointer",
                                transform: hoveredIdx === i ? "translateX(6px)" : "none",
                                transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
                            }}
                        >
                            <span style={{ fontFamily: MONO, fontSize: 12, color: i < 3 ? T.moss : T.subtext, fontWeight: i < 3 ? 700 : 400, width: 20 }}>#{i + 1}</span>
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: isYou ? T.moss : T.lichen, color: T.paper, display: "flex", alignItems: "center", justifyCOntent: "center", fontFamily: BODY, fontSize: 11, fontWeight: 700 }}>
                                {p.name.split(" ").map((w) => w[0]).join("")}
                            </div>
                            <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: isYou ? 700 : 500, color: T.ink, flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                                {p.name}
                                {/* Live and dynamically earned portfolio badges */}
                                {badges.map((id) => {
                                    const b = BADGES.find((x) => x.id === id);
                                    if (!b) return null;
                                    const Icon = b.icon;
                                    return (
                                        <span key={id} title={b.name} style={{ display: "inline-flex", alignItems: "center", justifyCOntent: "center", width: 18, height: 18, borderRadius: "50%", background: b.color(T), color: T.paper }}>
                                            <Icon size={10} />
                                        </span>
                                    );
                                })}
                            </span>
                            <span style={{ fontFamily: MONO, fontSize: 13, color: T.subtext }}>{fmt1(isYou ? youWeekly : p.weekly)} kg</span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Organization report view                                          */
/* ---------------------------------------------------------------- */
function OrgReportView() {
    const T = useTheme();
    const teamTotal = TEAM_MEMBERS.reduce((s, m) => s + m.weekly, 0);
    const teamAvg = teamTotal / TEAM_MEMBERS.length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                <Card>
                    <SectionLabel>Team weekly total</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: T.ink }}>{fmt1(teamTotal)} <span style={{ fontSize: 15, fontFamily: BODY, color: T.subtext }}>kg CO₂e</span></div>
                </Card>
                <Card>
                    <SectionLabel>Per-member average</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: T.ink }}>{fmt1(teamAvg)} <span style={{ fontSize: 15, fontFamily: BODY, color: T.subtext }}>kg CO₂e</span></div>
                </Card>
                <Card>
                    <SectionLabel>Members reporting</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: T.ink }}>{TEAM_MEMBERS.length}<span style={{ fontSize: 15, fontFamily: BODY, color: T.subtext }}> / 6</span></div>
                </Card>
            </div>

            <Card>
                <SectionLabel>Average weekly CO₂e by department</SectionLabel>
                <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DEPARTMENTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid stroke={T.line} vertical={false} />
                            <XAxis dataKey="dept" tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={{ stroke: T.line }} tickLine={false} />
                            <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 6, background: T.card }} formatter={(v) => [`${fmt1(v)} kg`, "avg"]} />
                            <Bar dataKey="avg" radius={[4, 4, 0, 0]}>
                                {DEPARTMENTS.map((d) => <Cell key={d.dept} fill={d.avg > teamAvg ? T.clay : T.moss} />)}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card>
                <SectionLabel>Team members</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <div style={{ display: "flex", padding: "6px 8px", fontFamily: MONO, fontSize: 11, color: T.subtext, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                        <span style={{ flex: 2 }}>Name</span>
                        <span style={{ flex: 1 }}>Department</span>
                        <span style={{ flex: 1, textAlign: "right" }}>Weekly CO₂e</span>
                        <span style={{ flex: 1, textAlign: "right" }}>Trend</span>
                    </div>
                    {TEAM_MEMBERS.map((m) => (
                        <div key={m.name} style={{ display: "flex", alignItems: "center", padding: "10px 8px", borderTop: `1px solid ${T.line}` }}>
                            <span style={{ flex: 2, fontFamily: BODY, fontSize: 13, color: T.ink, fontWeight: 500 }}>{m.name}</span>
                            <span style={{ flex: 1, fontFamily: BODY, fontSize: 13, color: T.subtext }}>{m.dept}</span>
                            <span style={{ flex: 1, textAlign: "right", fontFamily: MONO, fontSize: 13, color: T.ink }}>{fmt1(m.weekly)} kg</span>
                            <span style={{ flex: 1, textAlign: "right" }}><Trend value={m.trend} /></span>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* App                                                                */
/* ---------------------------------------------------------------- */
export default function Dashboard() {
    const [dark, setDark] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [visited, setVisited] = useState(new Set(["dashboard"]));

    // --- Persisted states ---
    const [activities, setActivities] = useState(() => {
        const saved = localStorage.getItem("carbontrack_activities");
        return saved ? JSON.parse(saved) : SEED_TODAY;
    });

    const [reduction, setReduction] = useState(() => {
        const saved = localStorage.getItem("carbontrack_reduction");
        return saved ? parseFloat(saved) : 8.5; // Starts near 10kg milestone for quick demo unlocks
    });

    // Tracking which badges have been toasted to prevent repeat notifications on page reloads
    const [acknowledgedBadges, setAcknowledgedBadges] = useState(() => {
        const saved = localStorage.getItem("carbontrack_acknowledged_badges");
        return saved ? JSON.parse(saved) : [];
    });

    const [toast, setToast] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        localStorage.setItem("carbontrack_activities", JSON.stringify(activities));
    }, [activities]);

    useEffect(() => {
        localStorage.setItem("carbontrack_reduction", reduction);
    }, [reduction]);

    const T = dark ? DARK : LIGHT;
    const todayTotal = activities.reduce((s, a) => s + a.co2e, 0);
    const dailyAvg = 8.2;
    const youWeekly = THIS_WEEK_SO_FAR.reduce((s, v) => s + v, 0) + todayTotal;

    const rank = useMemo(() => {
        const withYou = LEADERBOARD.map((p) => (p.name === "You" ? { ...p, weekly: youWeekly } : p));
        const sorted = [...withYou].sort((a, b) => a.weekly - b.weekly);
        return sorted.findIndex((p) => p.name === "You") + 1;
    }, [youWeekly]);

    const goTo = (tab) => {
        setActiveTab(tab);
        setVisited((prev) => new Set(prev).add(tab));
    };

    const quests = useMemo(() => ([
        { key: "log", label: "Log at least one activity today", done: activities.length > SEED_TODAY.length, tab: "log" },
        { key: "under-avg", label: `Stay under your ${fmt1(dailyAvg)} kg daily average`, done: todayTotal < dailyAvg, tab: "log" },
        { key: "trend", label: "Review this week's trend", done: visited.has("trends"), tab: "trends" },
        { key: "leaderboard", label: "Check the community leaderboard", done: visited.has("leaderboard"), tab: "leaderboard" },
    ]), [activities.length, todayTotal, visited]);

    // Streak status
    const activeStreak = useMemo(() => {
        return activities.length > SEED_TODAY.length ? 7 : 6;
    }, [activities.length]);

    // Live list of all dynamic badge achievements
    const earnedBadgeIds = useMemo(() => {
        const list = [];
        if (activeStreak >= 7) list.push("streak_7");
        const completedQuests = quests.filter((q) => q.done).length;
        if (completedQuests > 0) list.push("first_goal");
        if (reduction >= 10) list.push("reduction_10");
        if (reduction >= 25) list.push("reduction_25");
        if (reduction >= 50) list.push("reduction_50");
        return list;
    }, [activeStreak, quests, reduction]);

    // --- Toast Engine Effect ---
    useEffect(() => {
        const newUnlocks = earnedBadgeIds.filter(id => !acknowledgedBadges.includes(id));
        if (newUnlocks.length > 0) {
            const badgeToToast = BADGES.find(b => b.id === newUnlocks[0]);
            if (badgeToToast) {
                setToast({
                    id: badgeToToast.id,
                    name: badgeToToast.name,
                    sub: badgeToToast.sub,
                    icon: badgeToToast.icon,
                    color: badgeToToast.color(T)
                });
            }
            const updated = [...acknowledgedBadges, ...newUnlocks];
            setAcknowledgedBadges(updated);
            localStorage.setItem("carbontrack_acknowledged_badges", JSON.stringify(updated));
        }
    }, [earnedBadgeIds, acknowledgedBadges, T]);

    // Auto-dismiss active toasts
    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleLogActivity = (entry) => {
        setActivities((prev) => [...prev, entry]);

        // Evaluate comparative savings relative to baselines (incentivizing climate action)
        let saving = 0.5;
        if (entry.category === "Transport") {
            const worstEmissions = entry.quantity * 0.192; // Car baseline
            saving += Math.max(0, worstEmissions - entry.co2e);
        } else if (entry.category === "Food") {
            const worstEmissions = entry.quantity * 6.61; // Beef baseline
            saving += Math.max(0, worstEmissions - entry.co2e);
        } else if (entry.category === "Waste") {
            const worstEmissions = entry.quantity * 0.58; // Landfill baseline
            saving += Math.max(0, worstEmissions - entry.co2e);
        }
        setReduction((prev) => prev + saving);
    };

    // Body background dark mode wrapper (Resolves background gap contrast issues)
    useEffect(() => {
        document.body.style.backgroundColor = T.paper;
        document.body.style.margin = "0";
        document.body.style.padding = "0";
    }, [T.paper]);

    return (
        <ThemeContext.Provider value={T}>
            {/* CSS Animation Keyframes Injector */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slideIn {
                    from { transform: translateY(120px) scale(0.9); opacity: 0; }
                    to { transform: translateY(0) scale(1); opacity: 1; }
                }
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                @keyframes scaleUp {
                    from { transform: scale(0.95); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `}} />

            <div style={{ background: T.paper, minHeight: "100vh", fontFamily: BODY, transition: "background-color 0.25s ease" }}>
                <TopNav activeTab={activeTab} onTab={goTo} dark={dark} onToggleDark={() => setDark((d) => !d)} />

                <div style={{ padding: "28px 32px" }}>
                    {activeTab === "dashboard" && (
                        <DashboardHome
                            activities={activities}
                            todayTotal={todayTotal}
                            rank={rank}
                            quests={quests}
                            onNavigate={goTo}
                            earnedIds={earnedBadgeIds}
                        />
                    )}

                    {activeTab === "log" && (
                        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, alignItems: "start" }}>
                            <ActivityLogger onLog={handleLogActivity} />
                            <TodaysFootprint activities={activities} />
                        </div>
                    )}

                    {activeTab === "trends" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <CategoryPie activities={activities} />
                                <WeeklyTrend todayTotal={todayTotal} />
                            </div>
                            <MonthlyProgress todayTotal={todayTotal} />
                        </div>
                    )}

                    {activeTab === "badges" && (
                        <BadgesView
                            earnedIds={earnedBadgeIds}
                            reduction={reduction}
                            activeStreak={activeStreak}
                        />
                    )}

                    {activeTab === "leaderboard" && (
                        <Leaderboard
                            youWeekly={youWeekly}
                            earnedIds={earnedBadgeIds}
                            onSelectMember={setSelectedMember}
                        />
                    )}

                    {activeTab === "team" && <OrgReportView />}
                </div>

                {/* ---------------------------------------------------------------- */}
                {/* 1. Celeb Toast Notification Overlay                               */}
                {/* ---------------------------------------------------------------- */}
                {toast && (
                    <div style={{
                        position: "fixed",
                        bottom: 24,
                        right: 24,
                        background: T.card,
                        border: `1.5px solid ${T.moss}`,
                        borderRadius: 12,
                        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.15)",
                        padding: "14px 18px",
                        display: "flex",
                        alignItems: "center",
                        gap: 14,
                        zIndex: 1000,
                        maxWidth: 350,
                        animation: "slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    }}>
                        <div style={{
                            width: 42,
                            height: 42,
                            borderRadius: "50%",
                            background: toast.color,
                            color: T.paper,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                        }}>
                            <toast.icon size={20} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <span style={{ fontFamily: MONO, fontSize: 9, color: T.moss, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                                Achievement Unlocked! 🎉
                            </span>
                            <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: T.ink, marginTop: 1 }}>
                                {toast.name}
                            </div>
                            <div style={{ fontFamily: BODY, fontSize: 11, color: T.subtext }}>
                                {toast.sub}
                            </div>
                        </div>
                        <button
                            onClick={() => setToast(null)}
                            style={{
                                background: "transparent",
                                border: "none",
                                color: T.subtext,
                                cursor: "pointer",
                                padding: 4,
                                display: "flex",
                                alignItems: "center"
                            }}
                        >
                            <Minus size={16} />
                        </button>
                    </div>
                )}

                {/* ---------------------------------------------------------------- */}
                {/* 2. Interactive Leaderboard Profile Modals                       */}
                {/* ---------------------------------------------------------------- */}
                {selectedMember && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        background: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(3px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 999,
                        animation: "fadeIn 0.2s ease forwards"
                    }}>
                        <Card style={{
                            width: "90%",
                            maxWidth: 480,
                            maxHeight: "85vh",
                            overflowY: "auto",
                            border: `1px solid ${T.line}`,
                            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                            padding: 24,
                            position: "relative",
                            animation: "scaleUp 0.30s cubic-bezier(0.34, 1.56, 0.64, 1) forwards"
                        }}>
                            {/* Close overlay trigger button */}
                            <button
                                onClick={() => setSelectedMember(null)}
                                style={{
                                    position: "absolute",
                                    top: 16,
                                    right: 16,
                                    background: "transparent",
                                    border: "none",
                                    color: T.subtext,
                                    cursor: "pointer",
                                    padding: 4
                                }}
                            >
                                <Minus size={20} />
                            </button>

                            {/* Modal identity head section */}
                            <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
                                <div style={{
                                    width: 48,
                                    height: 48,
                                    borderRadius: "50%",
                                    background: selectedMember.name === "You" ? T.moss : T.lichen,
                                    color: T.paper,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: DISPLAY,
                                    fontSize: 18,
                                    fontWeight: 700
                                }}>
                                    {selectedMember.name.split(" ").map((w) => w[0]).join("")}
                                </div>
                                <div>
                                    <h3 style={{ fontFamily: DISPLAY, fontSize: 18, color: T.ink, margin: 0 }}>
                                        {selectedMember.name === "You" ? "My Badges Portfolio" : `${selectedMember.name}'s Profile`}
                                    </h3>
                                    <p style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, margin: "2px 0 0 0" }}>
                                        {selectedMember.dept ? `${selectedMember.dept} Department` : "Global Eco Tracker"}
                                    </p>
                                </div>
                            </div>

                            {/* Summary tracker row */}
                            <div style={{ display: "flex", gap: 12, marginBottom: 20, borderBottom: `1px solid ${T.line}`, paddingBottom: 16 }}>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontFamily: MONO, fontSize: 10, color: T.subtext, textTransform: "uppercase" }}>Weekly Output</span>
                                    <div style={{ fontFamily: DISPLAY, fontSize: 20, color: T.ink, marginTop: 2 }}>
                                        {fmt1(selectedMember.weekly)} <span style={{ fontSize: 11, fontFamily: BODY, color: T.subtext }}>kg CO₂e</span>
                                    </div>
                                </div>
                                <div style={{ flex: 1 }}>
                                    <span style={{ fontFamily: MONO, fontSize: 10, color: T.subtext, textTransform: "uppercase" }}>Unlocked badges</span>
                                    <div style={{ fontFamily: DISPLAY, fontSize: 20, color: T.moss, marginTop: 2 }}>
                                        {selectedMember.badges.length} <span style={{ fontSize: 11, fontFamily: BODY, color: T.subtext }}>/ {BADGES.length}</span>
                                    </div>
                                </div>
                            </div>

                            <SectionLabel>Badges unlocked</SectionLabel>
                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {BADGES.map((b) => {
                                    const unlocked = selectedMember.badges.includes(b.id);
                                    const Icon = b.icon;
                                    return (
                                        <div
                                            key={b.id}
                                            style={{
                                                display: "flex",
                                                alignItems: "center",
                                                gap: 12,
                                                padding: "10px 12px",
                                                borderRadius: 8,
                                                border: `1px solid ${unlocked ? T.moss : T.line}`,
                                                background: unlocked ? T.paperRaised : "transparent",
                                                opacity: unlocked ? 1 : 0.45
                                            }}
                                        >
                                            <div style={{
                                                width: 32,
                                                height: 32,
                                                borderRadius: "50%",
                                                background: unlocked ? b.color(T) : T.line,
                                                color: unlocked ? T.paper : T.subtext,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                flexShrink: 0
                                            }}>
                                                {unlocked ? <Icon size={15} /> : <Lock size={13} />}
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: T.ink }}>
                                                    {b.name}
                                                </div>
                                                <div style={{ fontFamily: BODY, fontSize: 11, color: T.subtext }}>
                                                    {unlocked ? b.desc : `Locked · ${b.requirement}`}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </ThemeContext.Provider>
    );
}