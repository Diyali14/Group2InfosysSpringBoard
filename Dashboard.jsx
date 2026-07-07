import React, { useState, useMemo } from "react";
import {
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, BarChart, Bar,
} from "recharts";
import {
    Car, Zap, UtensilsCrossed, Trash2, Leaf, TrendingUp, TrendingDown,
    Trophy, Users, Building2, Plus, ChevronLeft, ChevronRight, Minus,
} from "lucide-react";

/* ---------------------------------------------------------------- */
/* Palette + typography styles                                      */
/* ---------------------------------------------------------------- */
const C = {
    paper: "#F6F4EC",
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
const DISPLAY = "'Iowan Old Style','Palatino Linotype',Georgia,serif";
const BODY = "'Inter','Segoe UI',ui-sans-serif,system-ui,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,monospace";

/* ---------------------------------------------------------------- */
/* Mock reference data (stands in for backend)                       */
/* ---------------------------------------------------------------- */
const CATEGORIES = ["Transport", "Energy", "Food", "Waste"];
const CATEGORY_COLOR = { Transport: C.sky, Energy: C.clay, Food: C.moss, Waste: C.olive };
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
    { name: "You", weekly: null }, // filled dynamically
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

const fmt1 = (n) => (Math.round(n * 10) / 10).toFixed(1);

/* ---------------------------------------------------------------- */
/* Small building blocks                                             */
/* ---------------------------------------------------------------- */
function SectionLabel({ children }) {
    return (
        <div
            style={{
                fontFamily: MONO,
                fontSize: 11,
                letterSpacing: "0.14em",
                textTransform: "uppercase",
                color: C.subtext,
                marginBottom: 10,
            }}
        >
            {children}
        </div>
    );
}

function Card({ children, style }) {
    return (
        <div
            style={{
                background: C.card,
                border: `1px solid ${C.line}`,
                borderRadius: 10,
                padding: 20,
                ...style,
            }}
        >
            {children}
        </div>
    );
}

function Trend({ value }) {
    const good = value < 0;
    const flat = value === 0;
    const Icon = flat ? Minus : good ? TrendingDown : TrendingUp;
    const color = flat ? C.subtext : good ? C.moss : C.danger;
    return (
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4, color, fontFamily: MONO, fontSize: 12 }}>
            <Icon size={13} strokeWidth={2.5} />
            {Math.abs(value)}%
        </span>
    );
}

/* ---------------------------------------------------------------- */
/* Activity Logger                                                   */
/* ---------------------------------------------------------------- */
function ActivityLogger({ onLog }) {
    const [category, setCategory] = useState("Transport");
    const [activityType, setActivityType] = useState(Object.keys(EMISSION_FACTORS.Transport)[0]);
    const [quantity, setQuantity] = useState("");
    const [carouselStart, setCarouselStart] = useState(0);

    const factorInfo = EMISSION_FACTORS[category][activityType];
    const qtyNum = parseFloat(quantity) || 0;
    const preview = qtyNum * factorInfo.factor;

    const intensity = preview === 0 ? C.moss : preview < 3 ? C.moss : preview < 8 ? C.olive : C.clay;

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
        onLog({
            id: Date.now(),
            category,
            activityType,
            quantity: qtyNum,
            unit: factorInfo.unit,
            co2e: preview,
        });
        setQuantity("");
    };

    const visible = QUICK_LOG.slice(carouselStart, carouselStart + 3);

    return (
        <Card>
            <SectionLabel>Log an activity</SectionLabel>

            {/* Category tabs */}
            <div style={{ display: "flex", gap: 6, marginBottom: 18, borderBottom: `1px solid ${C.line}`, paddingBottom: 0 }}>
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
                                color: active ? C.ink : C.subtext,
                                background: "transparent",
                                border: "none",
                                borderBottom: active ? `2px solid ${CATEGORY_COLOR[cat]}` : "2px solid transparent",
                                marginBottom: -1,
                                cursor: "pointer",
                            }}
                        >
                            <Icon size={15} strokeWidth={2} color={active ? CATEGORY_COLOR[cat] : C.subtext} />
                            {cat}
                        </button>
                    );
                })}
            </div>

            {/* Activity type + quantity */}
            <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
                <div style={{ flex: "1 1 200px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: C.subtext, display: "block", marginBottom: 6 }}>
                        Activity type
                    </label>
                    <select
                        value={activityType}
                        onChange={(e) => setActivityType(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "9px 10px",
                            fontFamily: BODY,
                            fontSize: 14,
                            color: C.ink,
                            background: C.paper,
                            border: `1px solid ${C.line}`,
                            borderRadius: 6,
                        }}
                    >
                        {Object.keys(EMISSION_FACTORS[category]).map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>
                <div style={{ flex: "0 0 140px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: C.subtext, display: "block", marginBottom: 6 }}>
                        Quantity ({factorInfo.unit})
                    </label>
                    <input
                        type="number"
                        min="0"
                        step="0.1"
                        value={quantity}
                        onChange={(e) => setQuantity(e.target.value)}
                        placeholder="0"
                        style={{
                            width: "100%",
                            padding: "9px 10px",
                            fontFamily: MONO,
                            fontSize: 14,
                            color: C.ink,
                            background: C.paper,
                            border: `1px solid ${C.line}`,
                            borderRadius: 6,
                            boxSizing: "border-box",
                        }}
                    />
                </div>
            </div>

            {/* Real-time preview */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: C.paper,
                    borderRadius: 8,
                    marginBottom: 18,
                }}
            >
                <span style={{ fontFamily: BODY, fontSize: 13, color: C.subtext }}>Estimated CO₂e</span>
                <span style={{ fontFamily: MONO, fontSize: 20, fontWeight: 600, color: intensity }}>
                    {fmt1(preview)} <span style={{ fontSize: 12, fontWeight: 400 }}>kg</span>
                </span>
            </div>

            <button
                onClick={submit}
                disabled={qtyNum <= 0}
                style={{
                    width: "100%",
                    padding: "11px 0",
                    fontFamily: BODY,
                    fontSize: 14,
                    fontWeight: 600,
                    color: C.paper,
                    background: qtyNum > 0 ? C.moss : C.grey,
                    border: "none",
                    borderRadius: 6,
                    cursor: qtyNum > 0 ? "pointer" : "not-allowed",
                    marginBottom: 22,
                }}
            >
                <Plus size={14} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />
                Log activity
            </button>

            {/* Quick-log carousel */}
            <div>
                <div style={{ display: "flex", alignItems: "center", justify盤ntent: "space-between", marginBottom: 10 }}>
                    <SectionLabel>Quick log</SectionLabel>
                    <div style={{ display: "flex", gap: 4 }}>
                        <button
                            onClick={() => setCarouselStart(Math.max(0, carouselStart - 1))}
                            disabled={carouselStart === 0}
                            style={{ border: `1px solid ${C.line}`, background: C.paper, borderRadius: 5, padding: 3, cursor: "pointer" }}
                        >
                            <ChevronLeft size={14} color={C.subtext} />
                        </button>
                        <button
                            onClick={() => setCarouselStart(Math.min(QUICK_LOG.length - 3, carouselStart + 1))}
                            disabled={carouselStart >= QUICK_LOG.length - 3}
                            style={{ border: `1px solid ${C.line}`, background: C.paper, borderRadius: 5, padding: 3, cursor: "pointer" }}
                        >
                            <ChevronRight size={14} color={C.subtext} />
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
                                style={{
                                    flex: 1,
                                    textAlign: "left",
                                    padding: "10px 12px",
                                    background: C.paper,
                                    border: `1px dashed ${C.line}`,
                                    borderRadius: 8,
                                    cursor: "pointer",
                                }}
                            >
                                <Icon size={14} color={CATEGORY_COLOR[preset.category]} style={{ marginBottom: 6 }} />
                                <div style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, color: C.ink }}>{preset.label}</div>
                                <div style={{ fontFamily: MONO, fontSize: 11, color: C.subtext }}>
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
    const total = activities.reduce((s, a) => s + a.co2e, 0);
    const dailyAvg = 8.2;
    const diff = ((total - dailyAvg) / dailyAvg) * 100;

    const byCategory = CATEGORIES.map((cat) => ({
        category: cat,
        value: activities.filter((a) => a.category === cat).reduce((s, a) => s + a.co2e, 0),
    })).filter((c) => c.value > 0);

    return (
        <Card>
            <SectionLabel>Today's footprint</SectionLabel>
            <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 4 }}>
                <span style={{ fontFamily: DISPLAY, fontSize: 42, color: C.ink, lineHeight: 1 }}>{fmt1(total)}</span>
                <span style={{ fontFamily: BODY, fontSize: 15, color: C.subtext }}>kg CO₂e</span>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: C.subtext, marginBottom: 18 }}>
                <Trend value={Math.round(diff)} /> vs. your {fmt1(dailyAvg)} kg daily average
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {byCategory.map((c) => (
                    <div key={c.category} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 8, height: 8, borderRadius: "50%", background: CATEGORY_COLOR[c.category] }} />
                        <span style={{ fontFamily: BODY, fontSize: 12, color: C.charcoal, flex: 1 }}>{c.category}</span>
                        <span style={{ fontFamily: MONO, fontSize: 12, color: C.subtext }}>{fmt1(c.value)} kg</span>
                    </div>
                ))}
                {byCategory.length === 0 && (
                    <span style={{ fontFamily: BODY, fontSize: 12, color: C.subtext }}>Nothing logged yet today.</span>
                )}
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Category breakdown pie chart                                      */
/* ---------------------------------------------------------------- */
function CategoryPie({ activities }) {
    const data = CATEGORIES.map((cat) => ({
        name: cat,
        value: activities.filter((a) => a.category === cat).reduce((s, a) => s + a.co2e, 0),
    })).filter((d) => d.value > 0);
    const total = data.reduce((s, d) => s + d.value, 0);

    return (
        <Card>
            <SectionLabel>Today's breakdown by category</SectionLabel>
            <div style={{ position: "relative", height: 240 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie data={data} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3} stroke="none">
                            {data.map((d) => (
                                <Cell key={d.name} fill={CATEGORY_COLOR[d.name]} />
                            ))}
                        </Pie>
                        <Tooltip
                            contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${C.line}`, borderRadius: 6 }}
                            formatter={(v) => [`${fmt1(v)} kg CO₂e`, ""]}
                        />
                        <Legend
                            iconType="circle"
                            iconSize={8}
                            wrapperStyle={{ fontFamily: BODY, fontSize: 12, color: C.subtext }}
                        />
                    </PieChart>
                </ResponsiveContainer>
                <div
                    style={{
                        position: "absolute",
                        top: "44%",
                        left: "50%",
                        transform: "translate(-50%,-50%)",
                        textAlign: "center",
                        pointerEvents: "none",
                    }}
                >
                    <div style={{ fontFamily: DISPLAY, fontSize: 22, color: C.ink }}>{fmt1(total)}</div>
                    <div style={{ fontFamily: MONO, fontSize: 10, color: C.subtext }}>kg total</div>
                </div>
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Weekly trend line chart                                           */
/* ---------------------------------------------------------------- */
function WeeklyTrend({ todayTotal }) {
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
                        <CartesianGrid stroke={C.line} vertical={false} />
                        <XAxis dataKey="day" tick={{ fontFamily: BODY, fontSize: 11, fill: C.subtext }} axisLine={{ stroke: C.line }} tickLine={false} />
                        <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: C.subtext }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${C.line}`, borderRadius: 6 }}
                            formatter={(v) => (v == null ? ["—", ""] : [`${fmt1(v)} kg`, ""])}
                        />
                        <Legend wrapperStyle={{ fontFamily: BODY, fontSize: 12, color: C.subtext }} />
                        <Line type="monotone" dataKey="Last week" stroke={C.grey} strokeWidth={2} strokeDasharray="4 3" dot={false} />
                        <Line type="monotone" dataKey="This week" stroke={C.moss} strokeWidth={2.5} dot={{ r: 3, fill: C.moss }} connectNulls={false} />
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
    const monthTotal = MONTHLY_BEFORE_TODAY + todayTotal;
    const pct = Math.min(100, (monthTotal / MONTHLY_TARGET) * 100);
    const over = monthTotal > MONTHLY_TARGET;

    return (
        <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                <SectionLabel>Monthly budget</SectionLabel>
                <span style={{ fontFamily: MONO, fontSize: 13, color: C.subtext }}>
                    <span style={{ color: over ? C.danger : C.ink, fontWeight: 600 }}>{fmt1(monthTotal)}</span> / {MONTHLY_TARGET} kg CO₂e
                </span>
            </div>
            <div style={{ position: "relative", height: 14, background: C.paper, borderRadius: 999, border: `1px solid ${C.line}` }}>
                <div
                    style={{
                        position: "absolute",
                        top: -1,
                        left: 0,
                        height: 14,
                        width: `${pct}%`,
                        background: `linear-gradient(90deg, ${C.lichen}, ${over ? C.danger : C.moss})`,
                        borderRadius: 999,
                        transition: "width 0.4s ease",
                    }}
                />
                <div
                    style={{
                        position: "absolute",
                        top: -5,
                        left: `calc(${pct}% - 10px)`,
                        fontSize: 16,
                        transition: "left 0.4s ease",
                    }}
                >
                    🌱
                </div>
            </div>
            <div style={{ fontFamily: BODY, fontSize: 12, color: C.subtext, marginTop: 10 }}>
                {over
                    ? "You've passed this month's budget — small swaps in Transport or Food add up fastest."
                    : `${fmt1(MONTHLY_TARGET - monthTotal)} kg left before you reach your monthly target.`}
            </div>
        </Card>
    );
}

/* ---------------------------------------------------------------- */
/* Leaderboard                                                       */
/* ---------------------------------------------------------------- */
function Leaderboard({ youWeekly }) {
    const [scope, setScope] = useState("Friends");
    const ranked = useMemo(() => {
        const withYou = LEADERBOARD.map((p) => (p.name === "You" ? { ...p, weekly: youWeekly } : p));
        return [...withYou].sort((a, b) => a.weekly - b.weekly);
    }, [youWeekly]);

    return (
        <Card>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Trophy size={16} color={C.olive} />
                    <SectionLabel>Community leaderboard · lowest weekly CO₂e</SectionLabel>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                    {["Friends", "Global"].map((s) => (
                        <button
                            key={s}
                            onClick={() => setScope(s)}
                            style={{
                                fontFamily: BODY,
                                fontSize: 12,
                                fontWeight: 600,
                                padding: "5px 10px",
                                borderRadius: 999,
                                border: `1px solid ${scope === s ? C.moss : C.line}`,
                                background: scope === s ? C.moss : "transparent",
                                color: scope === s ? C.paper : C.subtext,
                                cursor: "pointer",
                            }}
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
                        <div
                            key={p.name}
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                padding: "9px 8px",
                                borderRadius: 6,
                                background: isYou ? C.paper : "transparent",
                                border: isYou ? `1px solid ${C.moss}` : "1px solid transparent",
                            }}
                        >
                            <span
                                style={{
                                    fontFamily: MONO,
                                    fontSize: 12,
                                    color: i < 3 ? C.moss : C.subtext,
                                    fontWeight: i < 3 ? 700 : 400,
                                    width: 20,
                                }}
                            >
                                #{i + 1}
                            </span>
                            <div
                                style={{
                                    width: 26,
                                    height: 26,
                                    borderRadius: "50%",
                                    background: isYou ? C.moss : C.lichen,
                                    color: C.paper,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    fontFamily: BODY,
                                    fontSize: 11,
                                    fontWeight: 700,
                                }}
                            >
                                {p.name.split(" ").map((w) => w[0]).join("")}
                            </div>
                            <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: isYou ? 700 : 500, color: C.ink, flex: 1 }}>
                                {p.name}
                            </span>
                            <span style={{ fontFamily: MONO, fontSize: 13, color: C.subtext }}>{fmt1(p.weekly)} kg</span>
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
    const teamTotal = TEAM_MEMBERS.reduce((s, m) => s + m.weekly, 0);
    const teamAvg = teamTotal / TEAM_MEMBERS.length;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20 }}>
                <Card>
                    <SectionLabel>Team weekly total</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: C.ink }}>{fmt1(teamTotal)} <span style={{ fontSize: 15, fontFamily: BODY, color: C.subtext }}>kg CO₂e</span></div>
                </Card>
                <Card>
                    <SectionLabel>Per-member average</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: C.ink }}>{fmt1(teamAvg)} <span style={{ fontSize: 15, fontFamily: BODY, color: C.subtext }}>kg CO₂e</span></div>
                </Card>
                <Card>
                    <SectionLabel>Members reporting</SectionLabel>
                    <div style={{ fontFamily: DISPLAY, fontSize: 32, color: C.ink }}>{TEAM_MEMBERS.length}<span style={{ fontSize: 15, fontFamily: BODY, color: C.subtext }}> / 6</span></div>
                </Card>
            </div>

            <Card>
                <SectionLabel>Average weekly CO₂e by department</SectionLabel>
                <div style={{ height: 220 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={DEPARTMENTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid stroke={C.line} vertical={false} />
                            <XAxis dataKey="dept" tick={{ fontFamily: BODY, fontSize: 11, fill: C.subtext }} axisLine={{ stroke: C.line }} tickLine={false} />
                            <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: C.subtext }} axisLine={false} tickLine={false} />
                            <Tooltip
                                contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${C.line}`, borderRadius: 6 }}
                                formatter={(v) => [`${fmt1(v)} kg`, "avg"]}
                            />
                            <Bar dataKey="avg" fill={C.moss} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </Card>

            <Card>
                <SectionLabel>Team Roster & Sustainability Performance</SectionLabel>
                <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontFamily: BODY, fontSize: 13 }}>
                        <thead>
                        <tr style={{ borderBottom: `1px solid ${C.line}`, textAlign: "left" }}>
                            <th style={{ padding: "10px 8px", color: C.subtext, fontWeight: 600 }}>Name</th>
                            <th style={{ padding: "10px 8px", color: C.subtext, fontWeight: 600 }}>Department</th>
                            <th style={{ padding: "10px 8px", color: C.subtext, fontWeight: 600 }}>Weekly CO₂e</th>
                            <th style={{ padding: "10px 8px", color: C.subtext, fontWeight: 600 }}>Weekly Change</th>
                        </tr>
                        </thead>
                        <tbody>
                        {TEAM_MEMBERS.map((m) => (
                            <tr key={m.name} style={{ borderBottom: `1px solid ${C.paper}` }}>
                                <td style={{ padding: "12px 8px", color: C.ink, fontWeight: 500 }}>{m.name}</td>
                                <td style={{ padding: "12px 8px", color: C.charcoal }}>{m.dept}</td>
                                <td style={{ padding: "12px 8px", fontFamily: MONO }}>{fmt1(m.weekly)} kg</td>
                                <td style={{ padding: "12px 8px" }}><Trend value={m.trend} /></td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* Primary Root Component Layout                                    */
/* ---------------------------------------------------------------- */
export default function Dashboard({ setAuth }) {
    const [view, setView] = useState("Personal"); // "Personal" or "Team"
    const [activities, setActivities] = useState(SEED_TODAY);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const todayTotal = useMemo(() => activities.reduce((s, a) => s + a.co2e, 0), [activities]);
    const youWeekly = useMemo(() => THIS_WEEK_SO_FAR.reduce((s, v) => s + v, 0) + todayTotal, [todayTotal]);

    const handleLogActivity = (newAct) => {
        setActivities((prev) => [newAct, ...prev]);
    };

    return (
        <div style={styles.appContainer}>
            {/* ---- MAIN TOP HEADER ---- */}
            <header style={styles.header}>
                <div style={styles.logoSection}>
                    <Leaf size={22} color={C.moss} strokeWidth={2.5} />
                    <h1 style={styles.logoText}>Carbon Track</h1>
                </div>

                <div style={styles.navActions}>
                    {/* Perspective view toggles */}
                    <button
                        onClick={() => setView("Personal")}
                        style={{
                            ...styles.toggleBtn,
                            background: view === "Personal" ? C.moss : "transparent",
                            color: view === "Personal" ? C.paper : C.subtext,
                            borderColor: view === "Personal" ? C.moss : C.line,
                        }}
                    >
                        👤 Personal
                    </button>
                    <button
                        onClick={() => setView("Team")}
                        style={{
                            ...styles.toggleBtn,
                            background: view === "Team" ? C.moss : "transparent",
                            color: view === "Team" ? C.paper : C.subtext,
                            borderColor: view === "Team" ? C.line : C.line,
                        }}
                    >
                        👥 Team report
                    </button>

                    {/* ---- FLOATING PROFILE AVATAR MENU ---- */}
                    <div style={styles.profileContainer}>
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            style={styles.avatarCircle}
                        >
                            DR
                        </button>

                        {isMenuOpen && (
                            <div style={styles.dropdownMenu}>
                                <div style={styles.menuHeader}>
                                    <p style={styles.menuName}>Diyali Roy</p>
                                    <p style={styles.menuEmail}>diyali@gmail.com</p>
                                </div>
                                <hr style={styles.menuDivider} />
                                <button style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>⚙️ Account Settings</button>
                                <button style={styles.menuItem} onClick={() => setIsMenuOpen(false)}>🍃 My Footprint Goals</button>
                                <hr style={styles.menuDivider} />
                                <button
                                    onClick={() => {
                                        setIsMenuOpen(false);
                                        setAuth(false);
                                    }}
                                    style={{ ...styles.menuItem, ...styles.logoutItem }}
                                >
                                    🚪 Log Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* ---- VIEW CONDITIONAL CONTENT ROUTER ---- */}
            <main style={styles.mainContent}>
                {view === "Personal" ? (
                    <div style={styles.dashboardGrid}>
                        {/* Left column tools */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <ActivityLogger onLog={handleLogActivity} />
                            <MonthlyProgress todayTotal={todayTotal} />
                        </div>

                        {/* Right column visualization summaries */}
                        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                <TodaysFootprint activities={activities} />
                                <CategoryPie activities={activities} />
                            </div>
                            <WeeklyTrend todayTotal={todayTotal} />
                            <Leaderboard youWeekly={youWeekly} />
                        </div>
                    </div>
                ) : (
                    <OrgReportView />
                )}
            </main>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* Shared Inline Sheet CSS Styles                                    */
/* ---------------------------------------------------------------- */
const styles = {
    appContainer: {
        backgroundColor: C.paper,
        minHeight: "100vh",
        color: C.ink,
        fontFamily: BODY,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "16px 32px",
        background: C.card,
        borderBottom: `1px solid ${C.line}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
    },
    logoSection: {
        display: "flex",
        alignItems: "center",
        gap: 10,
    },
    logoText: {
        fontFamily: DISPLAY,
        fontSize: "1.4rem",
        fontWeight: 700,
        margin: 0,
        color: C.ink,
    },
    navActions: {
        display: "flex",
        alignItems: "center",
        gap: 12,
    },
    toggleBtn: {
        fontFamily: BODY,
        fontSize: 13,
        fontWeight: 600,
        padding: "8px 16px",
        borderRadius: 20,
        border: "1px solid",
        cursor: "pointer",
        transition: "all 0.15s ease",
    },
    profileContainer: {
        position: "relative",
    },
    avatarCircle: {
        width: "38px",
        height: "38px",
        borderRadius: "50%",
        backgroundColor: C.moss,
        color: "#ffffff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: "600",
        fontSize: "0.9rem",
        border: "none",
        cursor: "pointer",
        boxShadow: "0 2px 6px rgba(27,49,28,0.15)",
    },
    dropdownMenu: {
        position: "absolute",
        top: "48px",
        right: "0",
        backgroundColor: "#ffffff",
        borderRadius: "12px",
        boxShadow: "0 8px 24px rgba(27, 49, 28, 0.12)",
        border: `1px solid ${C.line}`,
        width: "220px",
        padding: "8px 0",
        zIndex: 1000,
    },
    menuHeader: {
        padding: "12px 16px",
    },
    menuName: {
        margin: "0",
        fontWeight: "600",
        fontSize: "0.95rem",
        color: C.ink,
    },
    menuEmail: {
        margin: "2px 0 0 0",
        fontSize: "0.8rem",
        color: C.subtext,
    },
    menuDivider: {
        margin: "6px 0",
        border: "none",
        borderTop: `1px solid ${C.paper}`,
    },
    menuItem: {
        display: "block",
        width: "100%",
        padding: "10px 16px",
        textAlign: "left",
        background: "none",
        border: "none",
        fontSize: "0.88rem",
        color: C.charcoal,
        cursor: "pointer",
        transition: "background-color 0.15s ease",
    },
    logoutItem: {
        color: C.danger,
        fontWeight: "600",
    },
    mainContent: {
        padding: "32px",
        maxWidth: "1300px",
        margin: "0 auto",
    },
    dashboardGrid: {
        display: "grid",
        gridTemplateColumns: "380px 1fr",
        gap: "24px",
        alignItems: "start",
    },
};