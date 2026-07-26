import React, { useState, useMemo, useContext, createContext, useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, BarChart, Bar, ReferenceLine,
} from "recharts";
import {
    Car, Zap, UtensilsCrossed, Trash2, Leaf, TrendingUp, TrendingDown,
    Trophy, Users, Building2, Plus, ChevronLeft, ChevronRight, Minus,
    Home, TrendingUp as TrendIcon, PlusCircle, Sun, Moon, Flame,
    CheckCircle2, Circle, ArrowRight, Award, Lock, Shield,
    Target, Sparkles, Calendar, MessageSquare, X, Send, AlertCircle, RotateCcw
} from "lucide-react";

/* ---------------------------------------------------------------- */
/* Current User ID Constant for API Endpoint Mapping                */
/* ---------------------------------------------------------------- */
const DEFAULT_USER_ID = "user123";

/* ---------------------------------------------------------------- */
/* Lottie Animation CDN Sources                                     */
/* ---------------------------------------------------------------- */
const LOTTIE_ANIMS = {
    heroPlanet: "https://lottie.host/3400df31-9759-4b63-9f5b-16d4e55e8c20/vNf1uWq0mF.lottie",
    growingPlant: "https://lottie.host/8040d890-4820-4a85-9831-7e87b7a66710/A2OQfXvE4Q.lottie",
    trophyUnlock: "https://lottie.host/5a2d04a6-7788-4663-8d63-548d9be958a0/30i2L9Z82S.lottie",
};

/* ---------------------------------------------------------------- */
/* Theme tokens — light (base) + dark variant                       */
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
/* Mock reference data & Benchmarks                                 */
/* ---------------------------------------------------------------- */
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

/* Peer benchmarking averages (Weekly in kg CO2e) */
const PLATFORM_CATEGORY_AVG = { Transport: 14.2, Energy: 9.8, Food: 11.5, Waste: 3.4 };
const TOTAL_COMMUNITY_WEEKLY_AVG = Object.values(PLATFORM_CATEGORY_AVG).reduce((a, b) => a + b, 0);

function buildPeerDistribution(avg) {
    const vals = [];
    for (let i = 0; i < 40; i++) {
        const factor = 0.55 + ((i * 7) % 40) / 40 * 0.9;
        vals.push(+(avg * factor).toFixed(2));
    }
    return vals;
}
const PEER_DIST = Object.fromEntries(CATEGORIES.map((c) => [c, buildPeerDistribution(PLATFORM_CATEGORY_AVG[c])]));
function computePercentile(value, distribution) {
    const betterOrEqual = distribution.filter((v) => v >= value).length;
    return Math.round((betterOrEqual / distribution.length) * 100);
}

/* ---------------------------------------------------------------- */
/* Recommendation Cards Data Definition                             */
/* ---------------------------------------------------------------- */
const RECOMMENDATION_ITEMS = [
    {
        id: "rec_1",
        title: "Switch to Green Power Tariff",
        category: "Energy",
        impact: "High Impact",
        savingsKgYear: 320,
        difficulty: "Easy (10 mins)",
        description: "Switching your electricity plan to 100% renewable sources dramatically lowers daily standby footprint.",
        actionText: "Pledge Action",
    },
    {
        id: "rec_2",
        title: "Swap 2 Car Commutes for Transit",
        category: "Transport",
        impact: "High Impact",
        savingsKgYear: 240,
        difficulty: "Moderate",
        description: "Replacing short solo drives with bus or train twice weekly reduces annual fuel combustion emissions.",
        actionText: "Pledge Action",
    },
    {
        id: "rec_3",
        title: "Meat-Free Weekday Dinners",
        category: "Food",
        impact: "Medium Impact",
        savingsKgYear: 180,
        difficulty: "Easy",
        description: "Substituting beef and dairy for plant-based meals on weekdays slashes overall dietary footprint.",
        actionText: "Pledge Action",
    },
    {
        id: "rec_4",
        title: "Smart Waste Separation & Compost",
        category: "Waste",
        impact: "Quick Win",
        savingsKgYear: 75,
        difficulty: "Easy",
        description: "Diverting organic food waste from landfills reduces methane creation at regional processing sites.",
        actionText: "Pledge Action",
    }
];

/* ---------------------------------------------------------------- */
/* Date helpers                                                     */
/* ---------------------------------------------------------------- */
const pad2 = (n) => (n < 10 ? "0" + n : "" + n);
const ymd = (d) => `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
const addDays = (date, delta) => { const d = new Date(date); d.setDate(d.getDate() + delta); return d; };
const startOfWeek = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    d.setHours(0, 0, 0, 0);
    return d;
};

const TODAY = new Date();
TODAY.setHours(0, 0, 0, 0);
const TODAY_STR = ymd(TODAY);

const SEED_TODAY = [
    { id: 1, category: "Transport", activityType: "Car (petrol)", quantity: 9, unit: "km", co2e: 9 * 0.192, date: TODAY_STR },
    { id: 2, category: "Food", activityType: "Vegetarian meal", quantity: 2, unit: "serving", co2e: 2 * 0.51, date: TODAY_STR },
    { id: 3, category: "Energy", activityType: "Grid electricity", quantity: 3, unit: "kWh", co2e: 3 * 0.233, date: TODAY_STR },
];

function buildMockHistory() {
    const list = [];
    let idCounter = 900000;
    for (let i = 1; i <= 29; i++) {
        const dateStr = ymd(addDays(TODAY, -i));

        if (i % 3 === 0) {
            const qty = 9 + (i % 5);
            list.push({ id: idCounter++, category: "Transport", activityType: "Car (petrol)", quantity: qty, unit: "km", co2e: qty * EMISSION_FACTORS.Transport["Car (petrol)"].factor, date: dateStr });
        } else if (i % 3 === 1) {
            list.push({ id: idCounter++, category: "Transport", activityType: "Bus", quantity: 7, unit: "km", co2e: 7 * EMISSION_FACTORS.Transport["Bus"].factor, date: dateStr });
        } else {
            list.push({ id: idCounter++, category: "Transport", activityType: "Bicycle / Walk", quantity: 5, unit: "km", co2e: 0, date: dateStr });
        }

        const foodMod = i % 4;
        if (foodMod === 0) {
            list.push({ id: idCounter++, category: "Food", activityType: "Beef meal", quantity: 1, unit: "serving", co2e: EMISSION_FACTORS.Food["Beef meal"].factor, date: dateStr });
        } else if (foodMod === 1) {
            list.push({ id: idCounter++, category: "Food", activityType: "Chicken meal", quantity: 1, unit: "serving", co2e: EMISSION_FACTORS.Food["Chicken meal"].factor, date: dateStr });
        } else if (foodMod === 2) {
            list.push({ id: idCounter++, category: "Food", activityType: "Vegetarian meal", quantity: 2, unit: "serving", co2e: 2 * EMISSION_FACTORS.Food["Vegetarian meal"].factor, date: dateStr });
        } else {
            list.push({ id: idCounter++, category: "Food", activityType: "Dairy milk", quantity: 1, unit: "litre", co2e: EMISSION_FACTORS.Food["Dairy milk"].factor, date: dateStr });
        }

        if (i % 2 === 0) {
            const qty = 5 + (i % 4);
            list.push({ id: idCounter++, category: "Energy", activityType: "Grid electricity", quantity: qty, unit: "kWh", co2e: qty * EMISSION_FACTORS.Energy["Grid electricity"].factor, date: dateStr });
        }

        if (i % 3 === 0) {
            list.push({ id: idCounter++, category: "Waste", activityType: "Landfill waste", quantity: 1.5, unit: "kg", co2e: 1.5 * EMISSION_FACTORS.Waste["Landfill waste"].factor, date: dateStr });
        } else {
            list.push({ id: idCounter++, category: "Waste", activityType: "Recycled waste", quantity: 2, unit: "kg", co2e: 2 * EMISSION_FACTORS.Waste["Recycled waste"].factor, date: dateStr });
        }
    }
    return list;
}
const MOCK_HISTORY = buildMockHistory();

/* ---------------------------------------------------------------- */
/* Aggregation Engine Helper                                        */
/* ---------------------------------------------------------------- */
function makeBucket(label, entries) {
    const byCat = { Transport: 0, Energy: 0, Food: 0, Waste: 0 };
    entries.forEach((e) => { byCat[e.category] = (byCat[e.category] || 0) + e.co2e; });
    const total = Object.values(byCat).reduce((s, v) => s + v, 0);
    return { label, total, ...byCat };
}

function aggregate(entries, granularity, count) {
    const buckets = [];
    if (granularity === "day") {
        for (let i = count - 1; i >= 0; i--) {
            const d = addDays(TODAY, -i);
            const dateStr = ymd(d);
            const label = `${d.toLocaleDateString("en-US", { weekday: "short" })} ${d.getDate()}`;
            buckets.push(makeBucket(label, entries.filter((e) => e.date === dateStr)));
        }
    } else if (granularity === "week") {
        const curWeekStart = startOfWeek(TODAY);
        for (let i = count - 1; i >= 0; i--) {
            const wStart = addDays(curWeekStart, -7 * i);
            const wEnd = addDays(wStart, 6);
            const label = wStart.toLocaleDateString("en-US", { month: "short", day: "numeric" });
            const wEntries = entries.filter((e) => {
                const ed = new Date(e.date + "T00:00:00");
                return ed >= wStart && ed <= wEnd;
            });
            buckets.push(makeBucket(label, wEntries));
        }
    } else if (granularity === "month") {
        for (let i = count - 1; i >= 0; i--) {
            const md = new Date(TODAY.getFullYear(), TODAY.getMonth() - i, 1);
            const label = md.toLocaleDateString("en-US", { month: "short" });
            const mEntries = entries.filter((e) => {
                const ed = new Date(e.date + "T00:00:00");
                return ed.getFullYear() === md.getFullYear() && ed.getMonth() === md.getMonth();
            });
            buckets.push(makeBucket(label, mEntries));
        }
    }
    return buckets;
}

function computeTopEmitters(entries, days = 30) {
    const cutoff = addDays(TODAY, -(days - 1));
    const recent = entries.filter((e) => new Date(e.date + "T00:00:00") >= cutoff);
    const totals = {};
    recent.forEach((e) => {
        if (!totals[e.activityType]) totals[e.activityType] = { activityType: e.activityType, category: e.category, total: 0 };
        totals[e.activityType].total += e.co2e;
    });
    return Object.values(totals).sort((a, b) => b.total - a.total).slice(0, 3);
}

const REDUCTION_TIPS = {
    "Car (petrol)": [
        "Swap two short car trips a week for cycling or walking — most trips under 3km convert easily.",
        "Carpool your regular commute to roughly halve your per-trip footprint.",
    ],
    "Grid electricity": [
        "Check if your provider offers a renewable energy tariff — often a one-click switch.",
        "Unplug idle electronics and switch to LED bulbs to cut standby draw.",
    ],
    "Beef meal": [
        "Swap two beef meals a week for chicken or plant-based — beef runs about 4x chicken's footprint.",
    ],
};
function getTips(activityType, category) {
    return REDUCTION_TIPS[activityType] || ["Small, consistent swaps in this category add up over time."];
}

const WEEK_DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const TODAY_INDEX = 3;
const LAST_WEEK = [6.1, 7.8, 5.2, 8.9, 6.6, 9.4, 4.1];
const THIS_WEEK_SO_FAR = [5.4, 6.9, 4.8];

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

const BADGES = [
    { id: "streak_7", name: "Consistent Carver", desc: "Maintained a logging streak of 7 days or more.", sub: "7-day logging streak completed", icon: Flame, color: (T) => T.clay, requirement: "7-day logging streak" },
    { id: "first_goal", name: "Green Budgeter", desc: "First daily quest achieved. Keep up the clean routines!", sub: "First daily quest achieved", icon: CheckCircle2, color: (T) => T.moss, requirement: "Complete 1 daily quest" },
    { id: "reduction_10", name: "Carbon Cutter", desc: "Reduced your cumulative CO₂e emissions by 10 kg.", sub: "CO₂e reduction tier 1 hit", icon: Leaf, color: (T) => T.sky, requirement: "Reduce 10 kg CO₂e" },
    { id: "reduction_25", name: "Eco Supporter", desc: "Reduced your cumulative CO₂e emissions by 25 kg.", sub: "CO₂e reduction tier 2 hit", icon: Award, color: (T) => T.olive, requirement: "Reduce 25 kg CO₂e" },
    { id: "reduction_50", name: "Zero Waste Pro", desc: "Reduced your cumulative CO₂e emissions by 50 kg.", sub: "CO₂e reduction tier 3 hit", icon: Trash2, color: (T) => T.danger, requirement: "Reduce 50 kg CO₂e" }
];

const MOCK_MEMBER_BADGES = {
    "Priya N.": ["streak_7", "reduction_10"],
    "Marcus O.": ["reduction_10"],
    "Elena V.": ["first_goal"],
    "Dev K.": ["streak_7", "first_goal", "reduction_25"],
    "Sam T.": ["reduction_10", "reduction_25", "reduction_50"],
    "Ana R.": ["first_goal", "reduction_10"]
};

const fmt1 = (n) => (Math.round((n || 0) * 10) / 10).toFixed(1);
const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 18) return "Good afternoon";
    return "Good evening";
};

/* ---------------------------------------------------------------- */
/* Recommendation Cards Component                                   */
/* ---------------------------------------------------------------- */
function RecommendationCards() {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const [applied, setApplied] = useState({});

    const toggleApply = (id) => {
        setApplied((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    return (
        <Card>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Sparkles size={18} color={T.moss} />
                    <SectionLabel style={{ marginBottom: 0 }}>Actionable Carbon Recommendation Cards</SectionLabel>
                </div>
                <span style={{ fontFamily: MONO, fontSize: 11, color: T.subtext, background: T.paper, padding: "3px 8px", borderRadius: 999, border: `1px solid ${T.line}` }}>
                    AI Recommended
                </span>
            </div>
            <p style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, margin: "4px 0 16px 0" }}>
                High-leverage habits personalized for your current footprint profile.
            </p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 16 }}>
                {RECOMMENDATION_ITEMS.map((item) => {
                    const Icon = CATEGORY_ICON[item.category];
                    const isDone = applied[item.id];

                    return (
                        <div
                            key={item.id}
                            style={{
                                border: `1px solid ${isDone ? T.moss : T.line}`,
                                borderRadius: 10,
                                padding: 16,
                                background: isDone ? T.paperRaised : T.card,
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                transition: "all 0.2s ease"
                            }}
                        >
                            <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <Icon size={15} color={CATCOLOR[item.category]} />
                                        <span style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, color: T.subtext }}>{item.category}</span>
                                    </div>
                                    <span style={{
                                        fontFamily: MONO, fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 999,
                                        background: item.impact.includes("High") ? `${T.moss}20` : `${T.sky}20`,
                                        color: item.impact.includes("High") ? T.moss : T.sky
                                    }}>
                                        {item.impact}
                                    </span>
                                </div>

                                <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 700, color: T.ink, marginBottom: 6 }}>
                                    {item.title}
                                </div>

                                <p style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, margin: "0 0 12px 0", lineHeight: 1.4 }}>
                                    {item.description}
                                </p>
                            </div>

                            <div>
                                <div style={{ padding: "8px 10px", background: T.paper, borderRadius: 6, marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div>
                                        <div style={{ fontFamily: MONO, fontSize: 9, color: T.subtext, textTransform: "uppercase" }}>Est. Annual Saving</div>
                                        <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 700, color: T.moss }}>~{item.savingsKgYear} kg CO₂e</div>
                                    </div>
                                    <div style={{ textAlign: "right" }}>
                                        <div style={{ fontFamily: MONO, fontSize: 9, color: T.subtext, textTransform: "uppercase" }}>Difficulty</div>
                                        <div style={{ fontFamily: BODY, fontSize: 11, color: T.ink }}>{item.difficulty}</div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleApply(item.id)}
                                    style={{
                                        width: "100%", padding: "8px 0", borderRadius: 6,
                                        border: isDone ? `1px solid ${T.moss}` : "none",
                                        background: isDone ? "transparent" : T.moss,
                                        color: isDone ? T.moss : T.paper,
                                        fontFamily: BODY, fontSize: 12, fontWeight: 600,
                                        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                                        transition: "all 0.15s ease"
                                    }}
                                >
                                    {isDone ? <CheckCircle2 size={14} /> : <PlusCircle size={14} />}
                                    {isDone ? "Pledged / Active" : item.actionText}
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Sprout Mascot Inline SVG Component                               */
/* ---------------------------------------------------------------- */
function SproutMascot({ size = 32 }) {
    const T = useTheme();
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M32 28C32 16 20 8 10 12C8 24 18 32 32 28Z" fill={T.moss} stroke={T.mossDark} strokeWidth="2" strokeLinejoin="round" />
            <path d="M32 28C32 16 44 8 54 12C56 24 46 32 32 28Z" fill={T.lichen} stroke={T.moss} strokeWidth="2" strokeLinejoin="round" />
            <path d="M32 28V36" stroke={T.mossDark} strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="32" cy="44" r="16" fill={T.card} stroke={T.moss} strokeWidth="3" />
            <circle cx="26" cy="42" r="2.2" fill={T.ink} />
            <circle cx="38" cy="42" r="2.2" fill={T.ink} />
            <circle cx="22" cy="46" r="2" fill={T.clay} opacity="0.6" />
            <circle cx="42" cy="46" r="2" fill={T.clay} opacity="0.6" />
            <path d="M29 47C30.5 49 33.5 49 35 47" stroke={T.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

/* ---------------------------------------------------------------- */
/* Sprout 🌱 Responsive AI Chatbot Component                        */
/* ---------------------------------------------------------------- */
const STARTER_PROMPTS = [
    "How's my footprint trending this week?",
    "Tips to cut my transport emissions",
    "Am I on track for my active reduction goal?",
    "Suggest a quick eco-friendly swap for today"
];

function SproutChat({ allEntries, todayTotal, goal, youWeekly }) {
    const T = useTheme();
    const [isOpen, setIsOpen] = useState(false);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const messagesEndRef = useRef(null);

    const [messages, setMessages] = useState(() => {
        const saved = localStorage.getItem("carbontrack_sprout_messages");
        return saved ? JSON.parse(saved) : [
            {
                id: 1,
                sender: "sprout",
                text: "Hi there! I'm Sprout 🌱, your carbon assistant. How can I help you reduce your footprint today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ];
    });

    useEffect(() => {
        localStorage.setItem("carbontrack_sprout_messages", JSON.stringify(messages));
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        if (isOpen) scrollToBottom();
    }, [messages, isOpen, isLoading]);

    const buildContextPayload = () => {
        const topEmitters = computeTopEmitters(allEntries, 30);
        return {
            todayTotalKg: fmt1(todayTotal),
            thisWeekTotalKg: fmt1(youWeekly),
            activeGoal: goal ? {
                targetPct: goal.targetPct,
                periodWeeks: goal.periodWeeks,
                baselineWeeklyKg: goal.baselineWeekly,
                targetWeeklyKg: fmt1(goal.baselineWeekly * (1 - goal.targetPct / 100))
            } : "No active goal set",
            topEmissionActivitiesLast30Days: topEmitters.map(e => ({
                activity: e.activityType,
                category: e.category,
                co2eKg: fmt1(e.total)
            }))
        };
    };

    const handleSend = async (textToSend) => {
        const query = textToSend || input;
        if (!query.trim() || isLoading) return;

        const userMsg = {
            id: Date.now(),
            sender: "user",
            text: query,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };

        const updatedMessages = [...messages, userMsg];
        setMessages(updatedMessages);
        if (!textToSend) setInput("");
        setIsLoading(true);
        setError(null);

        const contextPayload = buildContextPayload();

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    messages: updatedMessages.map(m => ({ role: m.sender === "user" ? "user" : "assistant", content: m.text })),
                    context: contextPayload
                })
            });

            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }

            const data = await response.json();
            const sproutReply = data.reply || data.message || "I processed your request!";

            setMessages(prev => [
                ...prev,
                {
                    id: Date.now() + 1,
                    sender: "sprout",
                    text: sproutReply,
                    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
            ]);
        } catch (err) {
            setTimeout(() => {
                let reply = `Based on your context (${contextPayload.todayTotalKg} kg CO₂e logged today), `;
                if (query.toLowerCase().includes("trend")) {
                    reply += `your week total stands at ${contextPayload.thisWeekTotalKg} kg. You are doing well maintaining balance!`;
                } else if (query.toLowerCase().includes("transport") || query.toLowerCase().includes("tips")) {
                    reply += `your top emitters show high transport output. Swapping 2 car trips for public transit or walking will cut ~${fmt1(todayTotal * 0.4)} kg CO₂e.`;
                } else if (query.toLowerCase().includes("goal")) {
                    reply += goal ? `your goal is a ${goal.targetPct}% reduction (${contextPayload.activeGoal.targetWeeklyKg} kg/wk target). Keep logging to stay on track!` : "you don't have an active goal yet. Head to the 'Goals' tab to set one!";
                } else {
                    reply += "small daily switches in energy and dietary habits create substantial long-term reduction!";
                }

                setMessages(prev => [
                    ...prev,
                    {
                        id: Date.now() + 1,
                        sender: "sprout",
                        text: reply,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    }
                ]);
                setIsLoading(false);
            }, 800);
            return;
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetHistory = () => {
        const initial = [
            {
                id: Date.now(),
                sender: "sprout",
                text: "Hi there! I'm Sprout 🌱, your carbon assistant. How can I help you reduce your footprint today?",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            }
        ];
        setMessages(initial);
        localStorage.setItem("carbontrack_sprout_messages", JSON.stringify(initial));
    };

    return (
        <>
            <style dangerouslySetInnerHTML={{__html: `
                .sprout-chat-container {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    width: 380px;
                    height: 560px;
                    z-index: 9999;
                    display: flex;
                    flex-direction: column;
                    border-radius: 16px;
                    box-shadow: 0 12px 32px rgba(0,0,0,0.18), 0 2px 6px rgba(0,0,0,0.08);
                    overflow: hidden;
                    animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                @media (max-width: 640px) {
                    .sprout-chat-container {
                        position: fixed;
                        top: 0; left: 0; right: 0; bottom: 0;
                        width: 100vw; height: 100vh; max-width: 100%;
                        border-radius: 0; z-index: 10000;
                    }
                }
                .sprout-fab {
                    position: fixed; bottom: 24px; right: 24px;
                    width: 58px; height: 58px; border-radius: 50%;
                    z-index: 9998; display: flex; align-items: center; justify-content: center;
                    cursor: pointer; box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .sprout-fab:hover { transform: scale(1.08); }
                .typing-dot {
                    width: 6px; height: 6px; border-radius: 50%;
                    display: inline-block; animation: sproutBounce 1.4s infinite ease-in-out both;
                }
                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                @keyframes sproutBounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
            `}} />

            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="sprout-fab"
                    style={{ background: T.card, border: `2px solid ${T.moss}` }}
                    aria-label="Open Sprout AI Assistant"
                >
                    <SproutMascot size={36} />
                    <span style={{ position: "absolute", top: 0, right: 0, width: 14, height: 14, borderRadius: "50%", background: T.moss, border: `2px solid ${T.card}` }} />
                </button>
            )}

            {isOpen && (
                <div className="sprout-chat-container" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                    <div style={{ padding: "12px 16px", background: `linear-gradient(135deg, ${T.paperRaised}, ${T.card})`, borderBottom: `1px solid ${T.line}`, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <SproutMascot size={30} />
                            <div>
                                <div style={{ fontFamily: DISPLAY, fontSize: 16, fontWeight: 700, color: T.ink, display: "flex", alignItems: "center", gap: 6 }}>
                                    Sprout <span style={{ fontSize: 10, fontFamily: MONO, background: T.moss, color: T.paper, padding: "1px 6px", borderRadius: 999 }}>AI</span>
                                </div>
                                <div style={{ fontFamily: BODY, fontSize: 11, color: T.subtext }}>Personal Eco Assistant</div>
                            </div>
                        </div>

                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <button onClick={handleResetHistory} title="Reset Chat History" style={{ background: "transparent", border: "none", color: T.subtext, cursor: "pointer", padding: 6, borderRadius: "50%" }}>
                                <RotateCcw size={15} />
                            </button>
                            <button onClick={() => setIsOpen(false)} title="Close Chat" style={{ background: "transparent", border: "none", color: T.subtext, cursor: "pointer", padding: 6, borderRadius: "50%" }}>
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div style={{ padding: "8px 12px", background: `${T.danger}15`, borderBottom: `1px solid ${T.danger}40`, color: T.danger, fontFamily: BODY, fontSize: 12, display: "flex", alignItems: "center", gap: 8 }}>
                            <AlertCircle size={14} />
                            <span style={{ flex: 1 }}>{error}</span>
                            <button onClick={() => setError(null)} style={{ background: "transparent", border: "none", color: T.danger, cursor: "pointer" }}><X size={12} /></button>
                        </div>
                    )}

                    <div style={{ flex: 1, padding: 16, overflowY: "auto", display: "flex", flexDirection: "column", gap: 12, background: T.paper }}>
                        {messages.map((m) => {
                            const isUser = m.sender === "user";
                            return (
                                <div key={m.id} style={{ display: "flex", flexDirection: isUser ? "row-reverse" : "row", alignItems: "flex-end", gap: 8 }}>
                                    {!isUser && (
                                        <div style={{ width: 28, height: 28, flexShrink: 0, marginBottom: 2 }}>
                                            <SproutMascot size={28} />
                                        </div>
                                    )}
                                    <div style={{
                                        maxWidth: "78%", padding: "10px 14px",
                                        borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                                        background: isUser ? T.moss : T.card, color: isUser ? T.paper : T.ink,
                                        border: isUser ? "none" : `1px solid ${T.line}`,
                                        fontFamily: BODY, fontSize: 13, lineHeight: "1.45",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                    }}>
                                        <div>{m.text}</div>
                                        <div style={{ fontFamily: MONO, fontSize: 9, opacity: 0.7, marginTop: 4, textAlign: isUser ? "right" : "left" }}>
                                            {m.timestamp}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {messages.length <= 1 && (
                            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ fontFamily: MONO, fontSize: 10, color: T.subtext, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Suggested Questions
                                </div>
                                {STARTER_PROMPTS.map((prompt, i) => (
                                    <button key={i} onClick={() => handleSend(prompt)} style={{ textAlign: "left", padding: "8px 12px", borderRadius: 8, background: T.card, border: `1px solid ${T.line}`, fontFamily: BODY, fontSize: 12, color: T.ink, cursor: "pointer", transition: "background 0.15s ease" }}>
                                        💡 {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {isLoading && (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                                <SproutMascot size={28} />
                                <div style={{ padding: "10px 14px", borderRadius: "16px 16px 16px 2px", background: T.card, border: `1px solid ${T.line}`, display: "flex", gap: 4, alignItems: "center" }}>
                                    <span className="typing-dot" style={{ background: T.moss }} />
                                    <span className="typing-dot" style={{ background: T.moss }} />
                                    <span className="typing-dot" style={{ background: T.moss }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} style={{ padding: "10px 12px", background: T.card, borderTop: `1px solid ${T.line}`, display: "flex", gap: 8, alignItems: "center" }}>
                        <input
                            type="text" value={input} onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Sprout anything about your CO₂e..."
                            style={{ flex: 1, padding: "9px 12px", background: T.paper, border: `1px solid ${T.line}`, borderRadius: 999, fontFamily: BODY, fontSize: 13, color: T.ink, outline: "none" }}
                        />
                        <button
                            type="submit" disabled={!input.trim() || isLoading}
                            style={{ width: 36, height: 36, borderRadius: "50%", background: input.trim() && !isLoading ? T.moss : T.grey, border: "none", color: T.paper, display: "flex", alignItems: "center", justifyContent: "center", cursor: input.trim() && !isLoading ? "pointer" : "not-allowed", flexShrink: 0 }}
                        >
                            <Send size={15} />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}

/* ---------------------------------------------------------------- */
/* UI Helper Components                                             */
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

const TABS = [
    { key: "dashboard", label: "Dashboard", icon: Home },
    { key: "log", label: "Log Activity", icon: PlusCircle },
    { key: "trends", label: "Trends", icon: TrendIcon },
    { key: "goals", label: "Goals & Benchmarks", icon: Target },
    { key: "insights", label: "Insights", icon: Sparkles },
    { key: "badges", label: "Badges", icon: Award },
    { key: "leaderboard", label: "Leaderboard", icon: Trophy },
    { key: "team", label: "Team Report", icon: Building2 },
];

function TopNav({ activeTab, onTab, dark, onToggleDark }) {
    const T = useTheme();
    return (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "12px 32px", borderBottom: `1px solid ${T.line}`, background: T.card, flexWrap: "wrap" }}>
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
                            key={tab.key} onClick={() => onTab(tab.key)}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 14px", fontFamily: BODY, fontSize: 13, fontWeight: active ? 700 : 500, color: active ? T.ink : T.subtext, background: active ? T.paperRaised : "transparent", border: "none", borderRadius: 999, cursor: "pointer" }}
                        >
                            <Icon size={14} strokeWidth={2} color={active ? T.moss : T.subtext} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <button onClick={onToggleDark} aria-label="Toggle dark mode" style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", borderRadius: 999, border: `1px solid ${T.line}`, background: T.paperRaised, cursor: "pointer" }}>
                <Sun size={13} color={!dark ? T.olive : T.subtext} />
                <div style={{ width: 30, height: 16, borderRadius: 999, background: dark ? T.moss : T.line, position: "relative", transition: "background 0.2s ease" }}>
                    <div style={{ position: "absolute", top: 2, left: dark ? 16 : 2, width: 12, height: 12, borderRadius: "50%", background: T.card, transition: "left 0.2s ease" }} />
                </div>
                <Moon size={13} color={dark ? T.sky : T.subtext} />
            </button>
        </div>
    );
}

function DashboardHome({ activities, todayTotal, rank, quests, onNavigate, earnedIds }) {
    const T = useTheme();
    const dailyAvg = 8.2;
    const monthTotal = MONTHLY_BEFORE_TODAY + todayTotal;
    const monthPct = Math.min(100, Math.round((monthTotal / MONTHLY_TARGET) * 100));
    const completedCount = quests.filter((q) => q.done).length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Card style={{ background: `linear-gradient(120deg, ${T.mossDark}, ${T.moss})`, border: "none", overflow: "hidden" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 16 }}>
                    <div style={{ flex: "1 1 300px" }}>
                        <div style={{ fontFamily: DISPLAY, fontSize: 26, color: T.paper }}>
                            {greeting()}
                        </div>
                        <div style={{ fontFamily: BODY, fontSize: 13, color: T.paper, opacity: 0.85, marginTop: 4 }}>
                            You're on a {earnedIds.includes("streak_7") ? 7 : 6}-day logging streak — every entry keeps your footprint honest.
                        </div>
                    </div>

                    <div style={{ width: 110, height: 110, margin: "-10px 0" }}>
                        <DotLottieReact src={LOTTIE_ANIMS.heroPlanet} loop autoplay />
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

            <Card>
                <SectionLabel>Today's quests</SectionLabel>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    {quests.map((q) => {
                        const Icon = q.done ? CheckCircle2 : Circle;
                        return (
                            <div key={q.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderTop: `1px solid ${T.line}` }}>
                                <Icon size={17} color={q.done ? T.moss : T.grey} strokeWidth={2} />
                                <span style={{ flex: 1, fontFamily: BODY, fontSize: 13, color: q.done ? T.subtext : T.ink, textDecoration: q.done ? "line-through" : "none" }}>
                                  {q.label}
                                </span>
                                <span style={{ fontFamily: MONO, fontSize: 11, color: q.done ? T.moss : T.subtext, textTransform: "uppercase" }}>
                                  {q.done ? "Done" : "Pending"}
                                </span>
                                {!q.done && q.tab && (
                                    <button onClick={() => onNavigate(q.tab)} style={{ border: "none", background: "transparent", cursor: "pointer", color: T.moss, display: "flex", alignItems: "center" }} aria-label={`Go to ${q.tab}`}>
                                        <ArrowRight size={14} />
                                    </button>
                                )}
                            </div>
                        );
                    })}
                </div>
            </Card>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {[
                    { tab: "log", label: "Log an activity", desc: "Add today's commute, meals, or power use.", icon: PlusCircle },
                    { tab: "goals", label: "Set reduction goals", desc: "Compare against community benchmarks & set targets.", icon: Target },
                    { tab: "badges", label: "View your badges", desc: "Unlock gamified milestone accomplishments.", icon: Award },
                ].map((item) => {
                    const Icon = item.icon;
                    return (
                        <button key={item.tab} onClick={() => onNavigate(item.tab)} style={{ textAlign: "left", background: T.card, border: `1px solid ${T.line}`, borderRadius: 10, padding: 16, cursor: "pointer" }}>
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

function ActivityLogger({ onLog }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const [category, setCategory] = useState("Transport");
    const [activityType, setActivityType] = useState(Object.keys(EMISSION_FACTORS.Transport)[0]);
    const [quantity, setQuantity] = useState("");
    const [logDate, setLogDate] = useState(TODAY_STR);
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
        setLogDate(TODAY_STR);
    };

    const submit = () => {
        if (qtyNum <= 0) return;
        onLog({ id: Date.now(), category, activityType, quantity: qtyNum, unit: factorInfo.unit, co2e: preview, date: logDate });
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
                            key={cat} onClick={() => changeCategory(cat)}
                            style={{ display: "flex", alignItems: "center", gap: 6, padding: "8px 12px", fontFamily: BODY, fontSize: 13, fontWeight: active ? 600 : 500, color: active ? T.ink : T.subtext, background: "transparent", border: "none", borderBottom: active ? `2px solid ${CATCOLOR[cat]}` : "2px solid transparent", marginBottom: -1, cursor: "pointer" }}
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
                    <select value={activityType} onChange={(e) => setActivityType(e.target.value)} style={{ width: "100%", padding: "9px 10px", fontFamily: BODY, fontSize: 14, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6 }}>
                        {Object.keys(EMISSION_FACTORS[category]).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: "0 0 120px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, display: "block", marginBottom: 6 }}>Quantity ({factorInfo.unit})</label>
                    <input type="number" min="0" step="0.1" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="0" style={{ width: "100%", padding: "9px 10px", fontFamily: MONO, fontSize: 14, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6, boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: "0 0 150px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}><Calendar size={11} /> Date</label>
                    <input type="date" value={logDate} max={TODAY_STR} onChange={(e) => setLogDate(e.target.value)} style={{ width: "100%", padding: "9px 10px", fontFamily: MONO, fontSize: 13, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6, boxSizing: "border-box" }} />
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: T.paper, borderRadius: 8, marginBottom: 18 }}>
                <span style={{ fontFamily: BODY, fontSize: 13, color: T.subtext }}> Estimated CO₂e </span>
                <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: intensity }}>
                    {fmt1(preview)} <span style={{ fontSize: 12, fontWeight: 400 }}>kg</span>
                </span>
            </div>

            <button onClick={submit} disabled={qtyNum <= 0} style={{ width: "100%", padding: "11px 0", fontFamily: BODY, fontSize: 14, fontWeight: 600, color: T.paper, background: qtyNum > 0 ? T.moss : T.grey, border: "none", borderRadius: 6, cursor: qtyNum > 0 ? "pointer" : "not-allowed", marginBottom: 22 }}>
                <Plus size={14} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />
                Log activity
            </button>

            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <SectionLabel>Quick log</SectionLabel>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setCarouselStart(Math.max(0, carouselStart - 1))} disabled={carouselStart === 0} style={{ border: `1px solid ${T.line}`, background: T.paper, borderRadius: 5, padding: 3, cursor: "pointer" }}>
                            <ChevronLeft size={14} color={T.subtext} />
                        </button>
                        <button onClick={() => setCarouselStart(Math.min(QUICK_LOG.length - 3, carouselStart + 1))} disabled={carouselStart >= QUICK_LOG.length - 3} style={{ border: `1px solid ${T.line}`, background: T.paper, borderRadius: 5, padding: 3, cursor: "pointer" }}>
                            <ChevronRight size={14} color={T.subtext} />
                        </button>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {visible.map((preset) => {
                        const Icon = CATEGORY_ICON[preset.category];
                        return (
                            <button key={preset.label} onClick={() => applyPreset(preset)} style={{ flex: 1, textAlign: "left", padding: "10px 12px", background: T.paper, border: `1px dashed ${T.line}`, borderRadius: 8, cursor: "pointer" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
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

function MonthlyProgress({ todayTotal }) {
    const T = useTheme();
    const monthTotal = MONTHLY_BEFORE_TODAY + todayTotal;
    const pct = Math.min(100, (monthTotal / MONTHLY_TARGET) * 100);
    const over = monthTotal > MONTHLY_TARGET;

    return (
        <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <SectionLabel>Monthly budget</SectionLabel>
                <span style={{ fontFamily: MONO, fontSize: 13, color: T.subtext }}>
                    <span style={{ color: over ? T.danger : T.ink, fontWeight: 600 }}>{fmt1(monthTotal)}</span> / {MONTHLY_TARGET} kg CO₂e
                </span>
            </div>
            <div style={{ position: "relative", height: 14, background: T.paper, borderRadius: 999, border: `1px solid ${T.line}` }}>
                <div style={{ position: "absolute", top: -1, left: 0, height: 14, width: `${pct}%`, background: `linear-gradient(90deg, ${T.lichen}, ${over ? T.danger : T.moss})`, borderRadius: 999, transition: "width 0.4s ease" }} />
                <div style={{ position: "absolute", top: -22, left: `calc(${pct}% - 16px)`, width: 36, height: 36, transition: "left 0.4s ease", pointerEvents: "none" }}>
                    <DotLottieReact src={LOTTIE_ANIMS.growingPlant} loop autoplay />
                </div>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, marginTop: 18 }}>
                {over ? "You've passed this month's budget — small swaps in Transport or Food add up fastest." : `${fmt1(MONTHLY_TARGET - monthTotal)} kg left before you reach your monthly target.`}
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* FOOTPRINT AGGREGATION ENGINE INTEGRATION                          */
/* Endpoints mapped:                                                 */
/* - GET /analytics/daily/{userId}                                  */
/* - GET /analytics/weekly/{userId}                                 */
/* - GET /analytics/monthly/{userId}                                */
/* - GET /analytics/categories/{userId}                             */
/* ---------------------------------------------------------------- */
function FootprintSummary({ entries, userId = DEFAULT_USER_ID }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const [granularity, setGranularity] = useState("week");
    const countMap = { day: 14, week: 8, month: 6 };

    const [apiBuckets, setApiBuckets] = useState(null);
    const [categoryAnalytics, setCategoryAnalytics] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        let isMounted = true;
        const fetchAggregationData = async () => {
            setLoading(true);
            try {
                let endpoint = `/analytics/weekly/${userId}`;
                if (granularity === "day") endpoint = `/analytics/daily/${userId}`;
                if (granularity === "month") endpoint = `/analytics/monthly/${userId}`;

                const [timeRes, catRes] = await Promise.all([
                    fetch(endpoint),
                    fetch(`/analytics/categories/${userId}`)
                ]);

                if (timeRes.ok) {
                    const data = await timeRes.json();
                    if (isMounted) setApiBuckets(data.buckets || data);
                }
                if (catRes.ok) {
                    const catData = await catRes.json();
                    if (isMounted) setCategoryAnalytics(catData);
                }
            } catch (err) {
                console.warn("Footprint Aggregation backend offline. Using local calculated aggregation:", err);
            } finally {
                if (isMounted) setLoading(false);
            }
        };

        fetchAggregationData();
        return () => { isMounted = false; };
    }, [granularity, userId]);

    const buckets = useMemo(() => {
        if (apiBuckets && Array.isArray(apiBuckets) && apiBuckets.length > 0) {
            return apiBuckets;
        }
        return aggregate(entries, granularity, countMap[granularity]);
    }, [apiBuckets, entries, granularity]);

    const rangeTotal = buckets.reduce((s, b) => s + (b.total || 0), 0);
    const avgPerBucket = buckets.length ? rangeTotal / buckets.length : 0;

    return (
        <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, flexWrap: "wrap", gap: 10 }}>
                <SectionLabel style={{ marginBottom: 0 }}>Footprint summary · grouped by category</SectionLabel>
                <div style={{ display: "flex", gap: 4 }}>
                    {["day", "week", "month"].map((g) => (
                        <button key={g} onClick={() => setGranularity(g)}
                                style={{
                                    fontFamily: BODY, fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 999, textTransform: "capitalize",
                                    border: `1px solid ${granularity === g ? T.moss : T.line}`, background: granularity === g ? T.moss : "transparent",
                                    color: granularity === g ? T.paper : T.subtext, cursor: "pointer",
                                }}>
                            {g}ly
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={buckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke={T.line} vertical={false} />
                        <XAxis dataKey="label" tick={{ fontFamily: BODY, fontSize: 10, fill: T.subtext }} axisLine={{ stroke: T.line }} tickLine={false} />
                        <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 6, background: T.card }} formatter={(v, name) => [`${fmt1(v)} kg`, name]} />
                        <Legend wrapperStyle={{ fontFamily: BODY, fontSize: 12, color: T.subtext }} />
                        {CATEGORIES.map((cat) => (
                            <Bar key={cat} dataKey={cat} stackId="a" fill={CATCOLOR[cat]} />
                        ))}
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div style={{ display: "flex", gap: 24, marginTop: 14, fontFamily: MONO, fontSize: 12, color: T.subtext, flexWrap: "wrap" }}>
                <span>Range total: <b style={{ color: T.ink }}>{fmt1(rangeTotal)} kg</b></span>
                <span>Avg / {granularity}: <b style={{ color: T.ink }}>{fmt1(avgPerBucket)} kg</b></span>
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* GOAL MANAGER COMPONENT & SERVICES INTEGRATION                     */
/* Endpoints mapped:                                                 */
/* - POST /goals                                                    */
/* - GET /goals/user/{userId}                                       */
/* - PUT /goals/{goalId}                                            */
/* - DELETE /goals/{goalId}                                         */
/* - GET /goals/{goalId}/progress                                   */
/* - GET /goals/{goalId}/status                                     */
/* ---------------------------------------------------------------- */
function GoalsView({ goal, onSetGoal, onClearGoal, entries, userId = DEFAULT_USER_ID }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);

    const [targetPct, setTargetPct] = useState(15);
    const [periodWeeks, setPeriodWeeks] = useState(8);
    const [goalProgressData, setGoalProgressData] = useState(null);
    const [goalStatusData, setGoalStatusData] = useState(null);

    // Fetch user goal from backend API GET /goals/user/{userId}
    useEffect(() => {
        const fetchUserGoal = async () => {
            try {
                const res = await fetch(`/goals/user/${userId}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.goalId) {
                        onSetGoal(data);
                    }
                }
            } catch (err) {
                console.warn("Backend API offline for GET /goals/user/{userId}. Using local state.");
            }
        };
        fetchUserGoal();
    }, [userId]);

    // Fetch Goal Progress & Status when active goal exists
    useEffect(() => {
        if (!goal || !goal.goalId) return;
        const fetchProgressAndStatus = async () => {
            try {
                const [progRes, statRes] = await Promise.all([
                    fetch(`/goals/${goal.goalId}/progress`),
                    fetch(`/goals/${goal.goalId}/status`)
                ]);
                if (progRes.ok) {
                    const prog = await progRes.json();
                    setGoalProgressData(prog);
                }
                if (statRes.ok) {
                    const stat = await statRes.json();
                    setGoalStatusData(stat);
                }
            } catch (err) {
                console.warn("Backend API offline for goal progress/status. Using local calculation.");
            }
        };
        fetchProgressAndStatus();
    }, [goal]);

    const weeklyBuckets = useMemo(
        () => aggregate(entries, "week", (goal ? goal.periodWeeks : periodWeeks) + 1),
        [entries, goal, periodWeeks]
    );

    const currentWeekTotal = weeklyBuckets[weeklyBuckets.length - 1]?.total || 0;
    const currentWeekBucket = weeklyBuckets[weeklyBuckets.length - 1] || {};

    const progress = useMemo(() => {
        if (goalProgressData) return goalProgressData;
        if (!goal) return null;

        const startDate = new Date(goal.startDate + "T00:00:00");
        const daysElapsed = Math.max(0, Math.round((TODAY - startDate) / 86400000));
        const weeksElapsedFraction = Math.min(goal.periodWeeks, daysElapsed / 7);
        const requiredPct = goal.targetPct * (weeksElapsedFraction / goal.periodWeeks);
        const actualPct = goal.baselineWeekly > 0 ? ((goal.baselineWeekly - currentWeekTotal) / goal.baselineWeekly) * 100 : 0;
        const onTrack = actualPct >= requiredPct - 3;
        const achieved = actualPct >= goal.targetPct;
        const daysRemaining = Math.max(0, goal.periodWeeks * 7 - daysElapsed);
        const targetWeekly = goal.baselineWeekly * (1 - goal.targetPct / 100);

        return {
            requiredPct,
            actualPct,
            onTrack,
            achieved,
            daysRemaining,
            targetWeekly,
            baselineWeekly: goal.baselineWeekly
        };
    }, [goal, currentWeekTotal, goalProgressData]);

    const handleStartGoal = async () => {
        const priorWeeks = weeklyBuckets.slice(0, -1);
        const baselineWeekly = priorWeeks.length
            ? priorWeeks.reduce((s, b) => s + b.total, 0) / priorWeeks.length
            : currentWeekTotal || 35.0;

        const goalPayload = {
            userId,
            targetPct: Number(targetPct),
            periodWeeks: Number(periodWeeks),
            startDate: TODAY_STR,
            baselineWeekly: +baselineWeekly.toFixed(2),
        };

        try {
            const res = await fetch("/goals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(goalPayload)
            });
            if (res.ok) {
                const createdGoal = await res.json();
                onSetGoal(createdGoal);
                return;
            }
        } catch (err) {
            console.warn("POST /goals endpoint unavailable. Saving goal locally:", err);
        }

        onSetGoal({
            goalId: `goal_${Date.now()}`,
            ...goalPayload
        });
    };

    const handleClearGoal = async () => {
        if (goal && goal.goalId) {
            try {
                await fetch(`/goals/${goal.goalId}`, { method: "DELETE" });
            } catch (err) {
                console.warn("DELETE /goals/{goalId} endpoint unavailable:", err);
            }
        }
        setGoalProgressData(null);
        setGoalStatusData(null);
        onClearGoal();
    };

    const activeBaselineWeekly = goal ? goal.baselineWeekly : (currentWeekTotal || TOTAL_COMMUNITY_WEEKLY_AVG);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {!goal ? (
                <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20 }}>
                    <Card style={{ background: `linear-gradient(135deg, ${T.card}, ${T.paperRaised})` }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                            <Target size={18} color={T.moss} />
                            <SectionLabel style={{ marginBottom: 0 }}>Set a Carbon Reduction Goal</SectionLabel>
                        </div>
                        <p style={{ fontFamily: BODY, fontSize: 13, color: T.subtext, margin: "4px 0 20px 0", lineHeight: 1.5 }}>
                            Select your percentage target reduction and tracking duration. We benchmark your current weekly output to measure real-time weekly performance.
                        </p>

                        <div style={{ display: "flex", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
                            <div style={{ flex: "1 1 140px" }}>
                                <label style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, display: "block", marginBottom: 6 }}>Target Reduction (%)</label>
                                <select
                                    value={targetPct}
                                    onChange={(e) => setTargetPct(e.target.value)}
                                    style={{ width: "100%", padding: "9px 10px", fontFamily: MONO, fontSize: 14, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6 }}
                                >
                                    <option value={10}>10% Reduction</option>
                                    <option value={15}>15% Reduction</option>
                                    <option value={25}>25% Reduction</option>
                                    <option value={35}>35% Reduction</option>
                                    <option value={50}>50% Reduction</option>
                                </select>
                            </div>
                            <div style={{ flex: "1 1 140px" }}>
                                <label style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, display: "block", marginBottom: 6 }}>Time Horizon</label>
                                <select
                                    value={periodWeeks}
                                    onChange={(e) => setPeriodWeeks(e.target.value)}
                                    style={{ width: "100%", padding: "9px 10px", fontFamily: BODY, fontSize: 14, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6 }}
                                >
                                    <option value={4}>4 Weeks</option>
                                    <option value={8}>8 Weeks</option>
                                    <option value={12}>12 Weeks</option>
                                    <option value={26}>26 Weeks</option>
                                </select>
                            </div>
                        </div>

                        <div style={{ padding: "12px 14px", background: T.paper, borderRadius: 8, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontFamily: MONO, fontSize: 11, color: T.subtext, textTransform: "uppercase" }}>Estimated Target Budget</div>
                                <div style={{ fontFamily: DISPLAY, fontSize: 18, color: T.moss, marginTop: 2 }}>
                                    {fmt1(activeBaselineWeekly * (1 - targetPct / 100))} <span style={{ fontSize: 12, fontFamily: BODY, color: T.subtext }}>kg CO₂e / week</span>
                                </div>
                            </div>
                            <div style={{ textAlign: "right" }}>
                                <div style={{ fontFamily: MONO, fontSize: 11, color: T.subtext, textTransform: "uppercase" }}>Baseline Average</div>
                                <div style={{ fontFamily: DISPLAY, fontSize: 18, color: T.ink, marginTop: 2 }}>
                                    {fmt1(activeBaselineWeekly)} <span style={{ fontSize: 12, fontFamily: BODY, color: T.subtext }}>kg / wk</span>
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={handleStartGoal}
                            style={{
                                width: "100%", padding: "12px 0", fontFamily: BODY, fontSize: 14, fontWeight: 600,
                                color: T.paper, background: T.moss, border: "none", borderRadius: 6, cursor: "pointer",
                                transition: "background 0.2s ease"
                            }}
                        >
                            Commit to Reduction Goal
                        </button>
                    </Card>

                    <Card style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                        <div>
                            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                                <Users size={18} color={T.sky} />
                                <SectionLabel style={{ marginBottom: 0 }}>Community Benchmark Snapshot</SectionLabel>
                            </div>
                            <p style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, margin: "4px 0 16px 0" }}>
                                Platform-wide average emissions across all active users.
                            </p>

                            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 12 }}>
                                <span style={{ fontFamily: DISPLAY, fontSize: 32, color: T.ink }}>{fmt1(TOTAL_COMMUNITY_WEEKLY_AVG)}</span>
                                <span style={{ fontFamily: BODY, fontSize: 13, color: T.subtext }}>kg CO₂e / week peer average</span>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                                {CATEGORIES.map((cat) => {
                                    const avgVal = PLATFORM_CATEGORY_AVG[cat];
                                    const Icon = CATEGORY_ICON[cat];
                                    return (
                                        <div key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderTop: `1px solid ${T.line}`, paddingTop: 8 }}>
                                            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                                <Icon size={14} color={CATCOLOR[cat]} />
                                                <span style={{ fontFamily: BODY, fontSize: 12, color: T.ink }}>{cat}</span>
                                            </div>
                                            <span style={{ fontFamily: MONO, fontSize: 12, color: T.subtext }}>{avgVal} kg/wk</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </Card>
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
                        <Card style={{ background: T.paperRaised }}>
                            <SectionLabel>Target Reduction</SectionLabel>
                            <div style={{ fontFamily: DISPLAY, fontSize: 28, color: T.ink }}>{goal.targetPct}<span style={{ fontSize: 14, fontFamily: BODY, color: T.subtext }}>%</span></div>
                            <div style={{ fontFamily: MONO, fontSize: 11, color: T.moss, marginTop: 4 }}>
                                Target: {fmt1(progress.targetWeekly)} kg/wk
                            </div>
                        </Card>
                        <Card style={{ background: T.paperRaised }}>
                            <SectionLabel>Baseline Weekly</SectionLabel>
                            <div style={{ fontFamily: DISPLAY, fontSize: 28, color: T.ink }}>{fmt1(goal.baselineWeekly)}<span style={{ fontSize: 14, fontFamily: BODY, color: T.subtext }}> kg</span></div>
                            <div style={{ fontFamily: MONO, fontSize: 11, color: T.subtext, marginTop: 4 }}>Pre-goal baseline</div>
                        </Card>
                        <Card style={{ background: T.paperRaised }}>
                            <SectionLabel>Current Weekly</SectionLabel>
                            <div style={{ fontFamily: DISPLAY, fontSize: 28, color: T.ink }}>{fmt1(currentWeekTotal)}<span style={{ fontSize: 14, fontFamily: BODY, color: T.subtext }}> kg</span></div>
                            <div style={{ fontFamily: MONO, fontSize: 11, color: progress.actualPct >= 0 ? T.moss : T.danger, marginTop: 4 }}>
                                {progress.actualPct >= 0 ? `-${fmt1(progress.actualPct)}% vs baseline` : `+${fmt1(Math.abs(progress.actualPct))}% vs baseline`}
                            </div>
                        </Card>
                        <Card style={{ background: T.paperRaised }}>
                            <SectionLabel>Days Remaining</SectionLabel>
                            <div style={{ fontFamily: DISPLAY, fontSize: 28, color: T.ink }}>{progress.daysRemaining}<span style={{ fontSize: 14, fontFamily: BODY, color: T.subtext }}> days</span></div>
                            <div style={{ fontFamily: MONO, fontSize: 11, color: T.subtext, marginTop: 4 }}>{goal.periodWeeks} week period</div>
                        </Card>
                    </div>

                    <Card>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                            <div>
                                <SectionLabel style={{ marginBottom: 2 }}>Goal Progress & Weekly Benchmark</SectionLabel>
                                <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext }}>
                                    Tracking weekly emissions vs. goal target threshold and peer average benchmark.
                                </div>
                            </div>
                            <span style={{
                                fontFamily: MONO, fontSize: 11, fontWeight: 700, padding: "4px 10px", borderRadius: 999,
                                background: progress.achieved ? T.moss : progress.onTrack ? T.sky : T.danger,
                                color: T.paper, textTransform: "uppercase"
                            }}>
                                {progress.achieved ? "GOAL ACHIEVED 🎉" : progress.onTrack ? "ON TRACK ✓" : "BEHIND PACE ⚠️"}
                            </span>
                        </div>

                        <div style={{ position: "relative", height: 12, background: T.paper, borderRadius: 999, border: `1px solid ${T.line}`, marginBottom: 12 }}>
                            <div style={{
                                position: "absolute", top: -1, left: 0, height: 12,
                                width: `${Math.max(0, Math.min(100, (progress.actualPct / goal.targetPct) * 100))}%`,
                                background: `linear-gradient(90deg, ${T.lichen}, ${progress.onTrack ? T.moss : T.clay})`,
                                borderRadius: 999, transition: "width 0.4s ease"
                            }} />
                        </div>

                        <div style={{ height: 220, marginTop: 20 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={weeklyBuckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid stroke={T.line} vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={{ stroke: T.line }} tickLine={false} />
                                    <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 6, background: T.card }} formatter={(v) => [`${fmt1(v)} kg`, "Weekly Total"]} />
                                    <ReferenceLine y={progress.targetWeekly} stroke={T.moss} strokeDasharray="4 3" label={{ value: `Target (${fmt1(progress.targetWeekly)}kg)`, fontSize: 10, fill: T.moss, position: "top" }} />
                                    <ReferenceLine y={TOTAL_COMMUNITY_WEEKLY_AVG} stroke={T.clay} strokeDasharray="3 3" label={{ value: `Peer Avg (${fmt1(TOTAL_COMMUNITY_WEEKLY_AVG)}kg)`, fontSize: 10, fill: T.clay, position: "bottom" }} />
                                    <Line type="monotone" dataKey="total" stroke={T.sky} strokeWidth={2.5} dot={{ r: 4, fill: T.sky }} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                            <button
                                onClick={handleClearGoal}
                                style={{ background: "transparent", border: `1px solid ${T.line}`, color: T.subtext, fontFamily: BODY, fontSize: 12, fontWeight: 600, padding: "7px 14px", borderRadius: 999, cursor: "pointer" }}
                            >
                                Reset / Cancel Goal
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            <Card>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div>
                        <SectionLabel style={{ marginBottom: 2 }}>Category Benchmarks & Target Allocation</SectionLabel>
                        <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext }}>
                            Compare your current output in each category against platform peer averages and targeted budget thresholds.
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
                    {CATEGORIES.map((cat) => {
                        const Icon = CATEGORY_ICON[cat];
                        const userVal = (currentWeekBucket && currentWeekBucket[cat]) || 0;
                        const peerAvg = PLATFORM_CATEGORY_AVG[cat];
                        const percentile = computePercentile(userVal, PEER_DIST[cat]);
                        const isBetter = userVal <= peerAvg;

                        return (
                            <div key={cat} style={{ border: `1px solid ${T.line}`, borderRadius: 8, padding: 14, background: T.paper }}>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                                        <Icon size={16} color={CATCOLOR[cat]} />
                                        <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: T.ink }}>{cat}</span>
                                    </div>
                                    <span style={{ fontFamily: MONO, fontSize: 10, padding: "2px 6px", borderRadius: 4, background: isBetter ? T.moss : T.clay, color: T.paper }}>
                                        {isBetter ? "Below Avg" : "Above Avg"}
                                    </span>
                                </div>

                                <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginBottom: 6 }}>
                                    <span style={{ fontFamily: DISPLAY, fontSize: 22, color: T.ink }}>{fmt1(userVal)}</span>
                                    <span style={{ fontFamily: BODY, fontSize: 11, color: T.subtext }}>kg CO₂e</span>
                                </div>

                                <div style={{ position: "relative", height: 6, background: T.paperRaised, borderRadius: 999, border: `1px solid ${T.line}`, marginBottom: 8 }}>
                                    <div style={{
                                        position: "absolute", top: -1, left: 0, height: 6,
                                        width: `${Math.min(100, (userVal / (peerAvg * 1.5)) * 100)}%`,
                                        background: CATCOLOR[cat], borderRadius: 999
                                    }} />
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 11, color: T.subtext }}>
                                    <span>Peer Avg: {peerAvg}kg</span>
                                    <span>Top {percentile}%</span>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}

function InsightsView({ entries }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const topEmitters = useMemo(() => computeTopEmitters(entries, 30), [entries]);
    const currentWeek = useMemo(() => aggregate(entries, "week", 1)[0], [entries]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Added Recommendation Cards UI Component */}
            <RecommendationCards />

            <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Sparkles size={16} color={T.olive} />
                    <SectionLabel style={{ marginBottom: 0 }}>Your Personalised Weekly Insights</SectionLabel>
                </div>
                <p style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, margin: "4px 0 18px 0" }}>
                    Based on your top 3 highest-emission activities over the last 30 days.
                </p>
                {topEmitters.length === 0 ? (
                    <div style={{ fontFamily: BODY, fontSize: 13, color: T.subtext }}>Log a few more activities to unlock personalised insights.</div>
                ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14 }}>
                        {topEmitters.map((item, i) => {
                            const Icon = CATEGORY_ICON[item.category];
                            const tips = getTips(item.activityType, item.category);
                            return (
                                <div key={item.activityType} style={{ border: `1px solid ${T.line}`, borderRadius: 10, padding: 16, background: T.paperRaised }}>
                                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: CATCOLOR[item.category], display: "flex", alignItems: "center", justifyContent: "center" }}>
                                                <Icon size={14} color={T.paper} />
                                            </div>
                                            <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: T.ink }}>{item.activityType}</span>
                                        </div>
                                        <span style={{ fontFamily: MONO, fontSize: 10, color: T.subtext }}>#{i + 1}</span>
                                    </div>
                                    <div style={{ fontFamily: DISPLAY, fontSize: 20, color: T.ink, marginBottom: 10 }}>
                                        {fmt1(item.total)} <span style={{ fontFamily: BODY, fontSize: 11, color: T.subtext }}>kg over 30 days</span>
                                    </div>
                                    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                                        {tips.slice(0, 2).map((tip, ti) => (
                                            <div key={ti} style={{ display: "flex", gap: 6, fontFamily: BODY, fontSize: 12, color: T.charcoal, lineHeight: 1.4 }}>
                                                <CheckCircle2 size={13} color={T.moss} style={{ flexShrink: 0, marginTop: 2 }} />
                                                <span>{tip}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </Card>

            <Card>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <Users size={16} color={T.sky} />
                    <SectionLabel style={{ marginBottom: 0 }}>Peer Benchmarking · This Week</SectionLabel>
                </div>
                <p style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, margin: "4px 0 18px 0" }}>
                    Anonymous, platform-wide averages — no individual peer data is ever shown.
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {CATEGORIES.map((cat) => {
                        const userVal = (currentWeek && currentWeek[cat]) || 0;
                        const platformAvg = PLATFORM_CATEGORY_AVG[cat];
                        const percentile = computePercentile(userVal, PEER_DIST[cat]);
                        const Icon = CATEGORY_ICON[cat];
                        const better = userVal <= platformAvg;
                        return (
                            <div key={cat}>
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <Icon size={14} color={CATCOLOR[cat]} />
                                        <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: 600, color: T.ink }}>{cat}</span>
                                    </div>
                                    <span style={{ fontFamily: MONO, fontSize: 12, color: T.subtext }}>
                                        {fmt1(userVal)} kg vs {fmt1(platformAvg)} kg avg
                                    </span>
                                </div>
                                <div style={{ position: "relative", height: 8, background: T.paper, borderRadius: 999, border: `1px solid ${T.line}` }}>
                                    <div style={{ position: "absolute", top: -1, left: 0, height: 8, width: `${Math.min(100, percentile)}%`, background: better ? T.moss : T.clay, borderRadius: 999 }} />
                                </div>
                                <div style={{ fontFamily: BODY, fontSize: 11, color: T.subtext, marginTop: 4 }}>
                                    You emit less than <b style={{ color: T.ink }}>{percentile}%</b> of the community in {cat.toLowerCase()}.
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>
        </div>
    );
}

function BadgesView({ earnedIds, reduction, activeStreak }) {
    const T = useTheme();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
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

            <Card>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 18 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <Trophy size={18} color={T.olive} />
                        <SectionLabel style={{ marginBottom: 0 }}>My Gamification Badges Portfolio</SectionLabel>
                    </div>

                    <div style={{ width: 48, height: 48, marginTop: -10, marginBottom: -10 }}>
                        <DotLottieReact src={LOTTIE_ANIMS.trophyUnlock} loop autoplay />
                    </div>
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
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Trophy size={16} color={T.olive} />
                    <SectionLabel style={{ marginBottom: 0 }}>Community Leaderboard · Lowest Weekly CO₂e</SectionLabel>
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
                            <div style={{ width: 28, height: 28, borderRadius: "50%", background: isYou ? T.moss : T.lichen, color: T.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BODY, fontSize: 11, fontWeight: 700 }}>
                                {p.name.split(" ").map((w) => w[0]).join("")}
                            </div>
                            <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: isYou ? 700 : 500, color: T.ink, flex: 1, display: "flex", alignItems: "center", gap: 8 }}>
                                {p.name}
                                {badges.map((id) => {
                                    const b = BADGES.find((x) => x.id === id);
                                    if (!b) return null;
                                    const Icon = b.icon;
                                    return (
                                        <span key={id} title={b.name} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: b.color(T), color: T.paper }}>
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

function OrgReportView() {
    const T = useTheme();
    const teamTotal = TEAM_MEMBERS.reduce((s, m) => s + m.weekly, 0);
    const teamAvg = teamTotal / TEAM_MEMBERS.length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                <Card>
                    <SectionLabel>Team Weekly Total</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: T.ink }}>{fmt1(teamTotal)} <span style={{ fontSize: 15, fontFamily: BODY, color: T.subtext }}>kg CO₂e</span></div>
                </Card>
                <Card>
                    <SectionLabel>Per-Member Average</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: T.ink }}>{fmt1(teamAvg)} <span style={{ fontSize: 15, fontFamily: BODY, color: T.subtext }}>kg CO₂e</span></div>
                </Card>
                <Card>
                    <SectionLabel>Members Reporting</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: T.ink }}>{TEAM_MEMBERS.length}<span style={{ fontSize: 15, fontFamily: BODY, color: T.subtext }}> / 6</span></div>
                </Card>
            </div>

            <Card>
                <SectionLabel>Average Weekly CO₂e by Department</SectionLabel>
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
                <SectionLabel>Team Members</SectionLabel>
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
/* Main Dashboard App                                               */
/* ---------------------------------------------------------------- */
export default function Dashboard() {
    const [dark, setDark] = useState(false);
    const [activeTab, setActiveTab] = useState("dashboard");
    const [visited, setVisited] = useState(new Set(["dashboard"]));

    const [activities, setActivities] = useState(() => {
        const saved = localStorage.getItem("carbontrack_activities");
        return saved ? JSON.parse(saved) : SEED_TODAY;
    });

    const [reduction, setReduction] = useState(() => {
        const saved = localStorage.getItem("carbontrack_reduction");
        return saved ? parseFloat(saved) : 8.5;
    });

    const [acknowledgedBadges, setAcknowledgedBadges] = useState(() => {
        const saved = localStorage.getItem("carbontrack_acknowledged_badges");
        return saved ? JSON.parse(saved) : [];
    });

    const [goal, setGoal] = useState(() => {
        const saved = localStorage.getItem("carbontrack_goal");
        return saved ? JSON.parse(saved) : null;
    });

    const [toast, setToast] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null);

    useEffect(() => {
        localStorage.setItem("carbontrack_activities", JSON.stringify(activities));
    }, [activities]);

    useEffect(() => {
        localStorage.setItem("carbontrack_reduction", reduction);
    }, [reduction]);

    useEffect(() => {
        if (goal) localStorage.setItem("carbontrack_goal", JSON.stringify(goal));
        else localStorage.removeItem("carbontrack_goal");
    }, [goal]);

    const T = dark ? DARK : LIGHT;

    const todaysActivities = useMemo(() => activities.filter((a) => a.date === TODAY_STR), [activities]);
    const todayTotal = todaysActivities.reduce((s, a) => s + a.co2e, 0);
    const dailyAvg = 8.2;
    const youWeekly = THIS_WEEK_SO_FAR.reduce((s, v) => s + v, 0) + todayTotal;

    const allEntries = useMemo(() => [...MOCK_HISTORY, ...activities], [activities]);

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
        { key: "log", label: "Log at least one activity today", done: todaysActivities.length > SEED_TODAY.length, tab: "log" },
        { key: "under-avg", label: `Stay under your ${fmt1(dailyAvg)} kg daily average`, done: todayTotal < dailyAvg, tab: "log" },
        { key: "trend", label: "Review this week's trend", done: visited.has("trends"), tab: "trends" },
        { key: "leaderboard", label: "Check the community leaderboard", done: visited.has("leaderboard"), tab: "leaderboard" },
    ]), [todaysActivities.length, todayTotal, visited]);

    const activeStreak = useMemo(() => {
        return todaysActivities.length > SEED_TODAY.length ? 7 : 6;
    }, [todaysActivities.length]);

    const goalAchieved = useMemo(() => {
        if (!goal) return false;
        const currentWeekTotal = aggregate(allEntries, "week", 1)[0]?.total || 0;
        const actualPct = goal.baselineWeekly > 0 ? ((goal.baselineWeekly - currentWeekTotal) / goal.baselineWeekly) * 100 : 0;
        return actualPct >= goal.targetPct;
    }, [goal, allEntries]);

    const earnedBadgeIds = useMemo(() => {
        const list = [];
        if (activeStreak >= 7) list.push("streak_7");
        const completedQuests = quests.filter((q) => q.done).length;
        if (completedQuests > 0 || goalAchieved) list.push("first_goal");
        if (reduction >= 10) list.push("reduction_10");
        if (reduction >= 25) list.push("reduction_25");
        if (reduction >= 50) list.push("reduction_50");
        return list;
    }, [activeStreak, quests, reduction, goalAchieved]);

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

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => setToast(null), 5000);
            return () => clearTimeout(timer);
        }
    }, [toast]);

    const handleLogActivity = (entry) => {
        setActivities((prev) => [...prev, entry]);

        let saving = 0.5;
        if (entry.category === "Transport") {
            const worstEmissions = entry.quantity * 0.192;
            saving += Math.max(0, worstEmissions - entry.co2e);
        } else if (entry.category === "Food") {
            const worstEmissions = entry.quantity * 6.61;
            saving += Math.max(0, worstEmissions - entry.co2e);
        } else if (entry.category === "Waste") {
            const worstEmissions = entry.quantity * 0.58;
            saving += Math.max(0, worstEmissions - entry.co2e);
        }
        setReduction((prev) => prev + saving);
    };

    useEffect(() => {
        document.body.style.backgroundColor = T.paper;
        document.body.style.margin = "0";
        document.body.style.padding = "0";
    }, [T.paper]);

    return (
        <ThemeContext.Provider value={T}>
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
                            activities={todaysActivities}
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
                            <TodaysFootprint activities={todaysActivities} />
                        </div>
                    )}

                    {activeTab === "trends" && (
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <FootprintSummary entries={allEntries} userId={DEFAULT_USER_ID} />
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <CategoryPie activities={todaysActivities} />
                                <WeeklyTrend todayTotal={todayTotal} />
                            </div>
                            <MonthlyProgress todayTotal={todayTotal} />
                        </div>
                    )}

                    {activeTab === "goals" && (
                        <GoalsView
                            goal={goal}
                            onSetGoal={setGoal}
                            onClearGoal={() => setGoal(null)}
                            entries={allEntries}
                            userId={DEFAULT_USER_ID}
                        />
                    )}

                    {activeTab === "insights" && <InsightsView entries={allEntries} />}

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

                {/* Floating "Sprout" 🌱 Chatbot Component */}
                <SproutChat
                    allEntries={allEntries}
                    todayTotal={todayTotal}
                    goal={goal}
                    youWeekly={youWeekly}
                />

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
                        maxWidth: 360,
                        animation: "slideIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards",
                    }}>
                        <div style={{ width: 44, height: 44, flexShrink: 0 }}>
                            <DotLottieReact src={LOTTIE_ANIMS.trophyUnlock} loop autoplay />
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

                {selectedMember && (
                    <div style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 10000,
                        backdropFilter: "blur(4px)"
                    }}>
                        <Card style={{ width: 360, maxWidth: "90vw", position: "relative" }}>
                            <button
                                onClick={() => setSelectedMember(null)}
                                style={{ position: "absolute", top: 14, right: 14, background: "transparent", border: "none", color: T.subtext, cursor: "pointer" }}
                            >
                                <X size={18} />
                            </button>
                            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                                <div style={{ width: 44, height: 44, borderRadius: "50%", background: T.moss, color: T.paper, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: DISPLAY, fontSize: 18, fontWeight: 700 }}>
                                    {selectedMember.name.split(" ").map(w => w[0]).join("")}
                                </div>
                                <div>
                                    <div style={{ fontFamily: BODY, fontSize: 16, fontWeight: 700, color: T.ink }}>{selectedMember.name}</div>
                                    <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext }}>{selectedMember.dept || "Community Member"}</div>
                                </div>
                            </div>
                            <div style={{ padding: "12px", background: T.paper, borderRadius: 8, marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                <span style={{ fontFamily: BODY, fontSize: 12, color: T.subtext }}>Weekly Output</span>
                                <span style={{ fontFamily: MONO, fontSize: 14, fontWeight: 700, color: T.ink }}>{fmt1(selectedMember.weekly)} kg CO₂e</span>
                            </div>
                            <SectionLabel>Earned Badges Portfolio</SectionLabel>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                                {selectedMember.badges.map(bId => {
                                    const b = BADGES.find(x => x.id === bId);
                                    if (!b) return null;
                                    const Icon = b.icon;
                                    return (
                                        <div key={bId} style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: T.paperRaised, border: `1px solid ${T.line}`, borderRadius: 999 }}>
                                            <Icon size={14} color={b.color(T)} />
                                            <span style={{ fontFamily: BODY, fontSize: 12, color: T.ink, fontWeight: 600 }}>{b.name}</span>
                                        </div>
                                    );
                                })}
                                {selectedMember.badges.length === 0 && (
                                    <span style={{ fontFamily: BODY, fontSize: 12, color: T.subtext }}>No badges unlocked yet.</span>
                                )}
                            </div>
                        </Card>
                    </div>
                )}
            </div>
        </ThemeContext.Provider>
    );
}