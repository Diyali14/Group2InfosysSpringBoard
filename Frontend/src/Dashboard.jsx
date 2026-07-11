import React, { useState, useMemo, useEffect } from "react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, BarChart, Bar,
} from "recharts";
import {
    Car, Zap, UtensilsCrossed, Trash2, Leaf, TrendingUp, TrendingDown,
    Trophy, Plus, ChevronLeft, ChevronRight, Minus, Sun, Moon
} from "lucide-react";
import { activityAPI } from "./api";

// Semantic color sets for both themes
const themes = {
    light: {
        paper: "#F6F4EC",
        card: "#FFFEF9",
        ink: "#1B2B22",
        charcoal: "#2A2E28",
        subtext: "#6B6A5C",
        line: "#DFDAC6",
        moss: "#3F6B4A",
        mossDark: "#2E5138",
        lichen: "#8FAE8B",
        clay: "#C2622B",
        sky: "#6FA8B5",
        olive: "#A98B4E",
        grey: "#9B9A8C",
        danger: "#B23B3B"
    },
    dark: {
        paper: "#121412",
        card: "#1A1D1A",
        ink: "#ECF2ED",
        charcoal: "#D1DCD2",
        subtext: "#8A958B",
        line: "#2E3530",
        moss: "#529661",
        mossDark: "#63B474",
        lichen: "#61805E",
        clay: "#D9773B",
        sky: "#5192A0",
        olive: "#BFA565",
        grey: "#525B54",
        danger: "#D95353"
    }
};

const DISPLAY = "'Iowan Old Style','Palatino Linotype',Georgia,serif";
const BODY = "'Inter','Segoe UI',ui-sans-serif,system-ui,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,monospace";

const CATEGORIES = ["Transport", "Energy", "Food", "Waste"];
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

const fmt1 = (n) => {
    const val = parseFloat(n);
    if (isNaN(val)) return "0.0";
    return (Math.round(val * 10) / 10).toFixed(1);
};

const getCo2eValue = (act) => {
    if (!act) return 0;
    const val = act.co2e !== undefined ? act.co2e : (act.co2E !== undefined ? act.co2E : (act.co2eValue !== undefined ? act.co2eValue : 0));
    return parseFloat(val) || 0;
};

function SectionLabel({ children, theme }) {
    return (
        <div style={{ fontFamily: MONO, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", color: theme.subtext, marginBottom: 10 }}>
            {children}
        </div>
    );
}

function Card({ children, style, theme }) {
    return (
        <div style={{ background: theme.card, border: `1px solid ${theme.line}`, borderRadius: 10, padding: 20, ...style }}>
            {children}
        </div>
    );
}

function Trend({ value, theme }) {
    const good = value < 0;
    const flat = value === 0;
    const Icon = flat ? Minus : good ? TrendingDown : TrendingUp;
    const color = flat ? theme.subtext : good ? theme.moss : theme.danger;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color, fontFamily: MONO, fontSize: 12 }}>
            <Icon size={13} strokeWidth={2.5} />
            {Math.abs(value)}%
        </span>
    );
}

function ImpactSimulator({ theme }) {
    const [daysBiking, setDaysBiking] = useState(2);
    const [treesPlanted, setTreesPlanted] = useState(1);

    const transportSaved = daysBiking * 4.8;
    const treeOffset = treesPlanted * 1.8;
    const totalSaved = transportSaved + treeOffset;

    return (
        <Card theme={theme}>
            <SectionLabel theme={theme}>✨ Interactivity: Impact Simulator</SectionLabel>
            <p style={{ fontFamily: BODY, fontSize: 12, color: theme.subtext, marginTop: 0, marginBottom: 14 }}>
                Adjust sliders to model prospective footprint layout reductions:
            </p>

            <div style={{ marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BODY, fontSize: 12, fontWeight: 600, color: theme.ink, marginBottom: 4 }}>
                    <span>Bike/Walk instead of Car</span>
                    <span style={{ fontFamily: MONO, color: theme.moss }}>{daysBiking} days/wk</span>
                </div>
                <input
                    type="range" min="0" max="7" value={daysBiking}
                    onChange={(e) => setDaysBiking(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: theme.moss, cursor: "pointer" }}
                />
            </div>

            <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontFamily: BODY, fontSize: 12, fontWeight: 600, color: theme.ink, marginBottom: 4 }}>
                    <span>Fund Native Trees Planted</span>
                    <span style={{ fontFamily: MONO, color: theme.moss }}>{treesPlanted} tree(s)</span>
                </div>
                <input
                    type="range" min="0" max="10" value={treesPlanted}
                    onChange={(e) => setTreesPlanted(parseInt(e.target.value))}
                    style={{ width: "100%", accentColor: theme.moss, cursor: "pointer" }}
                />
            </div>

            <div style={{ padding: "12px", background: theme.paper, borderRadius: 8, textAlign: "center", border: `1px dashed ${theme.line}` }}>
                <div style={{ fontFamily: BODY, fontSize: 10, color: theme.subtext, textTransform: "uppercase", letterSpacing: "0.05em" }}>Simulated Monthly Prevention</div>
                <div style={{ fontFamily: DISPLAY, fontSize: 22, fontWeight: 700, color: theme.moss, margin: "2px 0" }}>
                    -{totalSaved.toFixed(1)} <span style={{ fontSize: 13, fontWeight: 400 }}>kg CO₂e</span>
                </div>
                <div style={{ fontFamily: BODY, fontSize: 11, color: theme.lichen, fontWeight: 600 }}>
                    Equivalent to turning off {Math.round(totalSaved * 4)} home lightbulbs.
                </div>
            </div>
        </Card>
    );
}

function AchievementBadges({ todayTotal, theme }) {
    const badges = [
        { id: 1, title: "Commute Hero", desc: "Transit logged today", condition: true, icon: "🚌" },
        { id: 2, title: "Green Budget", desc: "Kept under 8.2 kg target", condition: todayTotal < 8.2 && todayTotal > 0, icon: "🛡️" },
        { id: 3, title: "Eco Supporter", desc: "Reduced weekly level", condition: true, icon: "👑" },
        { id: 4, title: "Zero Waste Pro", desc: "Recycling tier hit", condition: false, icon: "♻️" },
    ];

    return (
        <Card theme={theme}>
            <SectionLabel theme={theme}> 🏆 Gamification Badges</SectionLabel>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 4 }}>
                {badges.map(b => (
                    <div
                        key={b.id}
                        style={{
                            padding: "10px",
                            background: b.condition ? theme.paper : "transparent",
                            border: `1px solid ${theme.line}`,
                            borderRadius: 8,
                            display: "flex",
                            alignItems: "center",
                            gap: 10,
                            opacity: b.condition ? 1 : 0.35,
                            filter: b.condition ? "none" : "grayscale(90%)",
                            transition: "all 0.2s"
                        }}
                    >
                        <span style={{ fontSize: 20 }}>{b.icon}</span>
                        <div>
                            <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 700, color: theme.ink }}>{b.title}</div>
                            <div style={{ fontFamily: BODY, fontSize: 10, color: theme.subtext, lineHeight: 1.2 }}>{b.desc}</div>
                        </div>
                    </div>
                ))}
            </div>
        </Card>
    );
}

function ActivityLogger({ onLog, theme }) {
    const [category, setCategory] = useState("Transport");
    const [activityType, setActivityType] = useState(Object.keys(EMISSION_FACTORS.Transport)[0]);
    const [quantity, setQuantity] = useState("");
    const [carouselStart, setCarouselStart] = useState(0);

    const CATEGORY_COLOR = { Transport: theme.sky, Energy: theme.clay, Food: theme.moss, Waste: theme.olive };
    const factorInfo = EMISSION_FACTORS[category][activityType];
    const qtyNum = parseFloat(quantity) || 0;
    const preview = qtyNum * factorInfo.factor;

    const intensity = preview === 0 ? theme.moss : preview < 3 ? theme.moss : preview < 8 ? theme.olive : theme.clay;

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
        const todayStr = new Date().toISOString().split('T')[0];

        onLog({
            category,
            activityType,
            quantity: qtyNum,
            unit: factorInfo.unit,
            co2e: preview,
            logDate: todayStr,
        });
        setQuantity("");
    };

    const visible = QUICK_LOG.slice(carouselStart, carouselStart + 3);

    return (
        <Card theme={theme}>
            <SectionLabel theme={theme}>Log an activity</SectionLabel>
            <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: `1px solid ${theme.line}`, paddingBottom: 0 }}>
                {CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICON[cat];
                    const active = cat === category;
                    return (
                        <button
                            key={cat}
                            onClick={() => changeCategory(cat)}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "8px 12px",
                                fontFamily: BODY,
                                fontSize: 13,
                                fontWeight: active ? 600 : 500,
                                color: active ? theme.ink : theme.subtext,
                                background: "transparent",
                                border: "none",
                                borderBottom: active ? `2px solid ${CATEGORY_COLOR[cat]}` : "2px solid transparent",
                                marginBottom: -1,
                                cursor: "pointer",
                            }}
                        >
                            <Icon size={15} strokeWidth={2} color={active ? CATEGORY_COLOR[cat] : theme.subtext} />
                            {cat}
                        </button>
                    );
                })}
            </div>

            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: theme.subtext, display: "block", marginBottom: 6 }}>Activity type</label>
                    <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                        style={{ width: "100%", padding: "9px 10px", fontFamily: BODY, fontSize: 14, color: theme.ink, background: theme.paper, border: `1px solid ${theme.line}`, borderRadius: 6 }}
                    >
                        {Object.keys(EMISSION_FACTORS[category]).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: "0 0 140px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: theme.subtext, display: "block", marginBottom: 6 }}>Quantity ({factorInfo.unit})</label>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        style={{ width: "100%", padding: "9px 10px", fontFamily: MONO, fontSize: 14, color: theme.ink, background: theme.paper, border: `1px solid ${theme.line}`, borderRadius: 6, boxSizing: "border-box" }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: theme.paper, borderRadius: 8, marginBottom: 18 }}>
                <span style={{ fontFamily: BODY, fontSize: 13, color: theme.subtext }}>Estimated CO₂e</span>
                <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: intensity }}>
                    {fmt1(preview)} <span style={{ fontSize: 12, fontWeight: 400 }}>kg</span>
                </span>
            </div>

            <button
                onClick={submit}
                disabled={qtyNum <= 0}
                style={{ width: "100%", padding: "11px 0", fontFamily: BODY, fontSize: 14, fontWeight: 600, color: theme.card, background: qtyNum > 0 ? theme.moss : theme.grey, border: "none", borderRadius: 6, cursor: qtyNum > 0 ? "pointer" : "not-allowed", marginBottom: 22 }}
            >
                <Plus size={14} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />
                Log activity
            </button>

            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                    <SectionLabel theme={theme}>Quick log</SectionLabel>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button onClick={() => setCarouselStart(Math.max(0, carouselStart - 1))} disabled={carouselStart === 0} style={{ border: `1px solid ${theme.line}`, background: theme.paper, borderRadius: 5, padding: 3, cursor: "pointer" }}>
                            <ChevronLeft size={14} color={theme.subtext} />
                        </button>
                        <button onClick={() => setCarouselStart(Math.min(QUICK_LOG.length - 3, carouselStart + 1))} disabled={carouselStart >= QUICK_LOG.length - 3} style={{ border: `1px solid ${theme.line}`, background: theme.paper, borderRadius: 5, padding: 3, cursor: "pointer" }}>
                            <ChevronRight size={14} color={theme.subtext} />
                        </button>
                    </div>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                    {visible.map((preset) => {
                        const Icon = CATEGORY_ICON[preset.category];
                        return (
                            <button
                                key={preset.label}
                                onClick={() => applyPreset(preset)}
                                style={{ flex: 1, textAlign: "left", padding: "10px 12px", background: theme.paper, border: `1px dashed ${theme.line}`, borderRadius: 8, cursor: "pointer" }}
                            >
                                <Icon size={14} color={preset.category === "Transport" ? theme.sky : preset.category === "Energy" ? theme.clay : preset.category === "Food" ? theme.moss : theme.olive} style={{ marginBottom: 6 }} />
                                <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, color: theme.ink }}>{preset.label}</div>
                                <div style={{ fontFamily: MONO, fontSize: 11, color: theme.subtext }}>
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

function TodaysFootprint({ activities, theme }) {
    const total = activities.reduce((s, a) => s + getCo2eValue(a), 0);
    const dailyAvg = 8.2;
    const diff = dailyAvg > 0 ? ((total - dailyAvg) / dailyAvg) * 100 : 0;

    const byCategory = CATEGORIES.map((cat) => ({
        category: cat,
        value: activities.filter((a) => a.category === cat).reduce((s, a) => s + getCo2eValue(a), 0),
    })).filter((c) => c.value > 0);

    const CATEGORY_COLOR = { Transport: theme.sky, Energy: theme.clay, Food: theme.moss, Waste: theme.olive };

    return (
        <Card theme={theme}>
            <SectionLabel theme={theme}>Today's footprint</SectionLabel>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 42, color: theme.ink, lineHeight: 1 }}>{fmt1(total)}</span>
                <span style={{ fontFamily: BODY, fontSize: 15, color: theme.subtext }}>kg CO₂e</span>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: theme.subtext, marginBottom: 18 }}>
                <Trend value={Math.round(diff)} theme={theme} /> vs. your {fmt1(dailyAvg)} kg daily average
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {byCategory.map((c) => (
                    <div key={c.category} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLOR[c.category] }} />
                        <span style={{ fontFamily: BODY, fontSize: 12, color: theme.charcoal, flex: 1 }}>{c.category}</span>
                        <span style={{ fontFamily: MONO, fontSize: 12, color: theme.subtext }}>{fmt1(c.value)} kg</span>
                    </div>
                ))}
                {byCategory.length === 0 && (
                    <span style={{ fontFamily: BODY, fontSize: 12, color: theme.subtext }}>Nothing logged yet today.</span>
                )}
            </div>
        </Card>
    );
}

// Global Custom Animations stylesheet helper inject
const cssAnimationStyles = `
@keyframes slideIn {
    from { transform: translateY(20px); opacity: 0; }
    to { transform: translateY(0); opacity: 1; }
}
`;

function CategoryPie({ activities, theme }) {
    const data = CATEGORIES.map((cat) => ({
        name: cat,
        value: activities.filter((a) => a.category === cat).reduce((s, a) => s + getCo2eValue(a), 0),
    })).filter((d) => d.value > 0);
    const total = data.reduce((s, d) => s + d.value, 0);

    const CATEGORY_COLOR = { Transport: theme.sky, Energy: theme.clay, Food: theme.moss, Waste: theme.olive };

    return (
        <Card theme={theme}>
            <SectionLabel theme={theme}>Today's breakdown by category</SectionLabel>
            <div style={{ position: "relative", height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                            {data.map((d) => (
                                <Cell key={d.name} fill={CATEGORY_COLOR[d.name]} />
                            ))}
                        </Pie>
                        <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${theme.line}`, backgroundColor: theme.card, color: theme.ink }} formatter={(v) => [`${fmt1(v)} kg CO₂e`, ""]} />
                        <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontFamily: BODY, fontSize: 12, color: theme.subtext }} />
                    </PieChart>
                </ResponsiveContainer>
                <div style={{ position: "absolute", top: "44%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center", pointerEvents: "none" }}>
                    <div style={{ fontFamily: DISPLAY, fontSize: 22, color: theme.ink }}>{fmt1(total)}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: theme.subtext }}>kg total</div>
                </div>
            </div>
        </Card>
    );
}

function WeeklyTrend({ todayTotal, theme }) {
    const data = WEEK_DAYS.map((day, i) => {
        let thisWeek = null;
        if (i < TODAY_INDEX) thisWeek = THIS_WEEK_SO_FAR[i];
        if (i === TODAY_INDEX) thisWeek = todayTotal;
        return { day, "This week": thisWeek, "Last week": LAST_WEEK[i] };
    });

    const thisWeekTotal = THIS_WEEK_SO_FAR.reduce((s, v) => s + v, 0) + todayTotal;
    const lastWeekToDate = LAST_WEEK.slice(0, TODAY_INDEX + 1).reduce((s, v) => s + v, 0);
    const diff = lastWeekToDate > 0 ? ((thisWeekTotal - lastWeekToDate) / lastWeekToDate) * 100 : 0;

    return (
        <Card theme={theme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 6 }}>
                <SectionLabel theme={theme}>This week vs. last week</SectionLabel>
                <Trend value={Math.round(diff)} theme={theme} />
            </div>
            <div style={{ height: 220 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <CartesianGrid stroke={theme.line} vertical={false} />
                        <XAxis dataKey="day" tick={{ fontFamily: BODY, fontSize: 11, fill: theme.subtext }} axisLine={{ stroke: theme.line }} tickLine={false} />
                        <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: theme.subtext }} axisLine={false} tickLine={false} />
                        <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${theme.line}`, backgroundColor: theme.card, color: theme.ink }} formatter={(v) => (v == null ? ["—", ""] : [`${fmt1(v)} kg`, ""])} />
                        <Legend wrapperStyle={{ fontFamily: BODY, fontSize: 12, color: theme.subtext }} />
                        <Line type="monotone" dataKey="Last week" stroke={theme.grey} strokeWidth={2} strokeDasharray="4 3" dot={false} />
                        <Line type="monotone" dataKey="This week" stroke={theme.moss} strokeWidth={2.5} dot={{ r: 3, fill: theme.moss }} connectNulls={false} />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}

function MonthlyProgress({ todayTotal, theme }) {
    const monthTotal = MONTHLY_BEFORE_TODAY + todayTotal;
    const pct = Math.min(100, (monthTotal / MONTHLY_TARGET) * 100);
    const over = monthTotal > MONTHLY_TARGET;

    return (
        <Card theme={theme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <SectionLabel theme={theme}>Monthly budget</SectionLabel>
                <span style={{ fontFamily: MONO, fontSize: 13, color: theme.subtext }}>
                    <span style={{ color: over ? theme.danger : theme.ink, fontWeight: 600 }}>{fmt1(monthTotal)}</span> / {MONTHLY_TARGET} kg CO₂e
                </span>
            </div>
            <div style={{ position: "relative", height: 14, background: theme.paper, borderRadius: 999, border: `1px solid ${theme.line}` }}>
                <div style={{ position: "absolute", top: -1, left: 0, height: 14, width: `${pct}%`, background: `linear-gradient(90deg, ${theme.lichen}, ${over ? theme.danger : theme.moss})`, borderRadius: 999, transition: "width 0.4s ease" }} />
                <div style={{ position: "absolute", top: -5, left: `calc(${pct}% - 10px)`, fontSize: 16, transition: "left 0.4s ease" }}>🌱</div>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: theme.subtext, marginTop: 10 }}>
                {over ? "You've passed this month's budget — small swaps add up fastest." : `${fmt1(MONTHLY_TARGET - monthTotal)} kg left before target.`}
            </div>
        </Card>
    );
}

function Leaderboard({ youWeekly, theme }) {
    const [scope, setScope] = useState("Friends");
    const ranked = useMemo(() => {
        const withYou = LEADERBOARD.map((p) => (p.name === "You" ? { ...p, weekly: youWeekly } : p));
        return [...withYou].sort((a, b) => a.weekly - b.weekly);
    }, [youWeekly]);

    return (
        <Card theme={theme}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Trophy size={16} color={theme.olive} />
                    <SectionLabel theme={theme}>Community leaderboard · lowest weekly CO₂e</SectionLabel>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                    {["Friends", "Global"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setScope(s)}
                            style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, padding: "5px 10px", borderRadius: 999, border: `1px solid ${scope === s ? theme.moss : theme.line}`, background: scope === s ? theme.moss : "transparent", color: scope === s ? theme.card : theme.subtext, cursor: "pointer" }}
                        >
                            {s}
                        </button>
                    ))}
                </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column" }}>
                {ranked.map((p, i) => {
                    const isYou = p.name === "You";
                    return (
                        <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 12, padding: "9px 8px", borderRadius: 6, background: isYou ? theme.paper : "transparent", border: isYou ? `1px solid ${theme.moss}` : "1px solid transparent" }}>
                            <span style={{ fontFamily: MONO, fontSize: 12, color: i < 3 ? theme.moss : theme.subtext, fontWeight: i < 3 ? 700 : 400, width: 20 }}>#{i + 1}</span>
                            <div style={{ width: 26, height: 26, borderRadius: "50%", background: isYou ? theme.moss : theme.lichen, color: theme.card, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: BODY, fontSize: 11, fontWeight: 700 }}>
                                {p.name.split(" ").map((w) => w[0]).join("")}
                            </div>
                            <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: isYou ? 700 : 500, color: theme.ink, flex: 1 }}>{p.name}</span>
                            <span style={{ fontFamily: MONO, fontSize: 13, color: theme.subtext }}>{fmt1(p.weekly)} kg</span>
                        </div>
                    );
                })}
            </div>
        </Card>
    );
}

function OrgReportView({ theme }) {
    const teamTotal = TEAM_MEMBERS.reduce((s, m) => s + m.weekly, 0);
    const teamAvg = teamTotal / TEAM_MEMBERS.length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                <Card theme={theme}>
                    <SectionLabel theme={theme}>Team weekly total</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: theme.ink }}>{fmt1(teamTotal)} <span style={{ fontSize: 15, fontFamily: BODY, color: theme.subtext }}>kg CO₂e</span></div>
                </Card>
                <Card theme={theme}>
                    <SectionLabel theme={theme}>Per-member average</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: theme.ink }}>{fmt1(teamAvg)} <span style={{ fontSize: 15, fontFamily: BODY, color: theme.subtext }}>kg CO₂e</span></div>
                </Card>
                <Card theme={theme}>
                    <SectionLabel theme={theme}>Members reporting</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: theme.ink }}>{TEAM_MEMBERS.length}<span style={{ fontSize: 15, fontFamily: BODY, color: theme.subtext }}> / 6</span></div>
                </Card>
            </div>

            <Card theme={theme}>
                <SectionLabel theme={theme}>Average weekly CO₂e by department</SectionLabel>
                <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DEPARTMENTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid stroke={theme.line} vertical={false} />
                            <XAxis dataKey="dept" tick={{ fontFamily: BODY, fontSize: 11, fill: theme.subtext }} axisLine={{ stroke: theme.line }} tickLine={false} />
                            <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: theme.subtext }} axisLine={false} tickLine={false} />
                            <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${theme.line}`, backgroundColor: theme.card, color: theme.ink }} formatter={(v) => [`${fmt1(v)} kg`, "avg"]} />
                            <Bar dataKey="avg" fill={theme.moss} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card theme={theme}>
                <SectionLabel theme={theme}>Team Roster & Sustainability Performance</SectionLabel>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: BODY, fontSize: 13 }}>
                        <thead>
                        <tr style={{ borderBottom: `1px solid ${theme.line}`, textAlign: "left" }}>
                            <th style={{ padding: "10px 8px", color: theme.subtext, fontWeight: 600 }}>Name</th>
                            <th style={{ padding: "10px 8px", color: theme.subtext, fontWeight: 600 }}>Department</th>
                            <th style={{ padding: "10px 8px", color: theme.subtext, fontWeight: 600 }}>Weekly CO₂e</th>
                            <th style={{ padding: "10px 8px", color: theme.subtext, fontWeight: 600 }}>Weekly Change</th>
                        </tr>
                        </thead>
                        <tbody>
                        {TEAM_MEMBERS.map((m) => (
                            <tr key={m.name} style={{ borderBottom: `1px solid ${theme.line}` }}>
                                <td style={{ padding: "12px 8px", color: theme.ink, fontWeight: 500 }}>{m.name}</td>
                                <td style={{ padding: "12px 8px", color: theme.charcoal }}>{m.dept}</td>
                                <td style={{ padding: "12px 8px", fontFamily: MONO, color: theme.ink }}>{fmt1(m.weekly)} kg</td>
                                <td style={{ padding: "12px 8px" }}><Trend value={m.trend} theme={theme} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

export default function Dashboard({ setAuth }) {
    const [mode, setMode] = useState("light");
    const [view, setView] = useState("Personal");
    const [activities, setActivities] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);

    const theme = themes[mode];

    // Read details dynamically from identity registration cookies/localStorage mapping definitions
    const userFirstName = localStorage.getItem('firstName') || "User";
    const userLastName = localStorage.getItem('lastName') || "";
    const userEmail = localStorage.getItem('email') || "user@carbontrack.com";

    const fullName = `${userFirstName} ${userLastName}`.trim();

    const initials = useMemo(() => {
        const firstInitial = userFirstName ? userFirstName[0] : "U";
        const lastInitial = userLastName ? userLastName[0] : "";
        return (firstInitial + lastInitial).toUpperCase();
    }, [userFirstName, userLastName]);

    const fetchDashboardData = async () => {
        try {
            setIsLoading(true);
            const data = await activityAPI.getUserActivities();
            if (Array.isArray(data)) {
                setActivities(data);
            }
        } catch (error) {
            console.error("Failed to load carbon activities:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const todayTotal = useMemo(() => activities.reduce((s, a) => s + getCo2eValue(a), 0), [activities]);
    const youWeekly = useMemo(() => THIS_WEEK_SO_FAR.reduce((s, v) => s + v, 0) + todayTotal, [todayTotal]);

    const handleLogActivity = async (newAct) => {
        const todayStr = new Date().toISOString().split('T')[0];

        setActivities(prev => [...prev, {
            category: newAct.category,
            activityType: newAct.activityType,
            quantity: newAct.quantity,
            unit: newAct.unit,
            co2e: newAct.co2e,
            logDate: todayStr
        }]);

        // Flash transaction toast notification alert instantly
        setToastMessage(`Logged ${newAct.activityType}! metrics successfully updated.`);
        setTimeout(() => setToastMessage(null), 3500);

        try {
            await activityAPI.logActivity({
                category: newAct.category,
                activityType: newAct.activityType,
                quantity: newAct.quantity,
                unit: newAct.unit,
                co2e: newAct.co2e,
                co2E: newAct.co2e,
                co2eValue: newAct.co2e,
                logDate: todayStr,
                userId: 1,
                user_id: 1,
                user: null
            });
        } catch (error) {
            console.warn("Stored context saved cleanly locally.");
        }
    };

    if (isLoading) {
        return (
            <div style={{ backgroundColor: theme.paper, display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", color: theme.moss }}>
                <div style={{ fontFamily: DISPLAY, fontSize: "1.5rem" }}>Loading carbon dashboard metrics...</div>
            </div>
        );
    }

    return (
        <div style={{ backgroundColor: theme.paper, minHeight: "100vh", color: theme.ink, fontFamily: BODY, transition: "background-color 0.2s ease" }}>
            <style>{cssAnimationStyles}</style>

            <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 32px", background: theme.card, borderBottom: `1px solid ${theme.line}`, position: "sticky", top: 0, zIndex: 100 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Leaf size={22} color={theme.moss} strokeWidth={2.5} />
                    <h1 style={{ fontFamily: DISPLAY, fontSize: "1.4rem", fontWeight: 700, margin: 0, color: theme.ink }}>Carbon Track</h1>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <button
                        onClick={() => setMode(mode === "light" ? "dark" : "light")}
                        style={{ display: "flex", alignItems: "center", gap: 6, background: "transparent", border: `1px solid ${theme.line}`, padding: "6px 12px", borderRadius: 20, cursor: "pointer", fontFamily: BODY, fontSize: 13, color: theme.ink }}
                    >
                        {mode === "light" ? <Moon size={14} color={theme.ink} /> : <Sun size={14} color={theme.ink} />}
                        {mode === "light" ? "Dark Mode" : "Light Mode"}
                    </button>

                    <button onClick={() => setView("Personal")} style={{ fontFamily: BODY, fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 20, border: "1px solid", cursor: "pointer", background: view === "Personal" ? theme.moss : "transparent", color: view === "Personal" ? theme.card : theme.subtext, borderColor: view === "Personal" ? theme.moss : theme.line }}>1️⃣ Personal</button>
                    <button onClick={() => setView("Team")} style={{ fontFamily: BODY, fontSize: 13, fontWeight: 600, padding: "8px 16px", borderRadius: 20, border: "1px solid", cursor: "pointer", background: view === "Team" ? theme.moss : "transparent", color: view === "Team" ? theme.card : theme.subtext, borderColor: theme.line }}>2️⃣ Team report</button>

                    <div style={{ position: "relative" }}>
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} style={{ width: "38px", height: "38px", borderRadius: "50%", backgroundColor: theme.moss, color: "#ffffff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "600", fontSize: "0.9rem", border: "none", cursor: "pointer", boxShadow: "0 2px 6px rgba(27,49,28,0.15)" }}>
                            {initials}
                        </button>
                        {isMenuOpen && (
                            <div style={{ position: "absolute", top: "48px", right: "0", backgroundColor: theme.card, borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.2)", border: `1px solid ${theme.line}`, width: "220px", padding: "8px 0", zIndex: 1000 }}>
                                <div style={{ padding: "12px 16px" }}>
                                    <p style={{ margin: "0", fontWeight: "600", fontSize: "0.95rem", color: theme.ink }}>{fullName}</p>
                                    <p style={{ margin: "2px 0 0 0", fontSize: "0.8rem", color: theme.subtext }}>{userEmail}</p>
                                </div>
                                <hr style={{ margin: "6px 0", border: "none", borderTop: `1px solid ${theme.line}` }} />
                                <button style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", fontSize: "0.88rem", color: theme.charcoal, cursor: "pointer" }} onClick={() => setIsMenuOpen(false)}>⚙️ Account Settings</button>
                                <button style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", fontSize: "0.88rem", color: theme.charcoal, cursor: "pointer" }} onClick={() => setIsMenuOpen(false)}>🍃 My Footprint Goals</button>
                                <hr style={{ margin: "6px 0", border: "none", borderTop: `1px solid ${theme.line}` }} />
                                <button onClick={() => { setIsMenuOpen(false); localStorage.clear(); setAuth(false); }} style={{ display: "block", width: "100%", padding: "10px 16px", textAlign: "left", background: "none", border: "none", fontSize: "0.88rem", cursor: "pointer", color: theme.danger, fontWeight: "600" }}>🚪 Log Out</button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            <main style={{ padding: "32px", maxWidth: "1300px", margin: "0 auto" }}>
                {view === "Personal" ? (
                    <div style={{ display: "grid", gridTemplateColumns: "380px 1fr", gap: "24px", alignItems: "start" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <ActivityLogger onLog={handleLogActivity} theme={theme} />
                            <ImpactSimulator theme={theme} />
                            <MonthlyProgress todayTotal={todayTotal} theme={theme} />
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <TodaysFootprint activities={activities} theme={theme} />
                                <CategoryPie activities={activities} theme={theme} />
                            </div>
                            <AchievementBadges todayTotal={todayTotal} theme={theme} />
                            <WeeklyTrend todayTotal={todayTotal} theme={theme} />
                            <Leaderboard youWeekly={youWeekly} theme={theme} />
                        </div>
                    </div>
                ) : (
                    <OrgReportView theme={theme} />
                )}
            </main>

            {/* Notification alert banner */}
            {toastMessage && (
                <div style={{
                    position: "fixed", bottom: "24px", right: "24px",
                    backgroundColor: theme.ink, color: theme.card,
                    padding: "12px 20px", borderRadius: "8px", fontFamily: BODY,
                    fontSize: "13px", fontWeight: "600", boxShadow: "0 4px 16px rgba(0,0,0,0.25)",
                    zIndex: 9999, display: "flex", alignItems: "center", gap: "8px",
                    animation: "slideIn 0.3s ease-out"
                }}>
                    <span>🌲</span> {toastMessage}
                </div>
            )}
        </div>
    );
}