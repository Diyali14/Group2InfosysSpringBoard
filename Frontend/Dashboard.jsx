import React, { useState, useMemo, useContext, createContext, useEffect, useRef } from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import ctLogo from "./assets/carbontrack-logo.png";
import {
    PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis,
    CartesianGrid, Tooltip, Legend, BarChart, Bar, ReferenceLine, AreaChart, Area,
} from "recharts";
import {
    Car, Zap, UtensilsCrossed, Trash2, Leaf, TrendingUp, TrendingDown,
    Trophy, Users, Building2, Plus, ChevronLeft, ChevronRight, ChevronDown, Minus,
    Home, TrendingUp as TrendIcon, PlusCircle, Sun, Moon, Flame,
    CheckCircle2, Circle, ArrowRight, Award, Lock, Shield, Globe2,
    Target, Sparkles, Calendar, MessageSquare, X, Send, AlertCircle, RotateCcw,
    Settings as SettingsIcon, LogOut, Pencil, Download,
    Crown, Bike, TrainFront, Droplet, TreePine, Star,
} from "lucide-react";

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
    line: "#E2DDCB",
    danger: "#B23B3B",
    glass: "rgba(255,254,249,0.78)",
    navGlass: "rgba(250,248,241,0.72)",
    railBg: "rgba(31,58,42,0.05)",
    mist: "linear-gradient(120deg, rgba(63,107,74,0.09), rgba(111,168,181,0.07))",
    shadow: "0 1px 2px rgba(27,43,34,0.04), 0 10px 26px -18px rgba(27,43,34,0.35)",
    shadowLg: "0 24px 60px -28px rgba(27,43,34,0.55)",
};
const DARK = {
    paper: "#101A15",
    paperRaised: "#1B2921",
    card: "#1C2A22",
    ink: "#EDEADC",
    charcoal: "#D6D2C0",
    subtext: "#8C9488",
    moss: "#5FA873",
    mossDark: "#3F6B4A",
    lichen: "#8FAE8B",
    clay: "#E08A52",
    sky: "#7FC0CF",
    olive: "#CBA766",
    grey: "#6E756A",
    line: "rgba(255,255,255,0.09)",
    danger: "#E27676",
    glass: "rgba(28,42,34,0.72)",
    navGlass: "rgba(16,26,21,0.7)",
    railBg: "rgba(255,255,255,0.06)",
    mist: "linear-gradient(120deg, rgba(95,168,115,0.14), rgba(127,192,207,0.08))",
    shadow: "0 1px 2px rgba(0,0,0,0.3), 0 12px 30px -20px rgba(0,0,0,0.8)",
    shadowLg: "0 28px 70px -30px rgba(0,0,0,0.85)",
};
const DISPLAY = "'Iowan Old Style','Palatino Linotype',Georgia,serif";
const BODY = "'Inter','Segoe UI',ui-sans-serif,system-ui,sans-serif";
const MONO = "'IBM Plex Mono',ui-monospace,'SFMono-Regular',Menlo,monospace";

const ThemeContext = createContext(LIGHT);
const useTheme = () => useContext(ThemeContext);

/* ---------------------------------------------------------------- */
/* Localization — language switcher for key dashboard strings only.  */
/* Scope is intentionally narrow per the brief: greeting, Log        */
/* Activity, Today's footprint, the streak banner, Today's Quests.   */
/* No calculation, state, or backend logic is affected.              */
/* ---------------------------------------------------------------- */
const LANGUAGES = [
    { code: "en", label: "English" },
    { code: "hi", label: "हिंदी" },
    { code: "bn", label: "বাংলা" },
    { code: "ta", label: "தமிழ்" },
    { code: "te", label: "తెలుగు" },
    { code: "mr", label: "मराठी" },
];

const STRINGS = {
    greetingMorning: { en: "Good morning", hi: "शुभ प्रभात", bn: "শুভ সকাল", ta: "காலை வணக்கம்", te: "శుభోదయం", mr: "शुभ सकाळ" },
    greetingAfternoon: { en: "Good afternoon", hi: "शुभ दोपहर", bn: "শুভ অপরাহ্ন", ta: "மதிய வணக்கம்", te: "శుభ మధ్యాహ్నం", mr: "शुभ दुपार" },
    greetingEvening: { en: "Good evening", hi: "शुभ संध्या", bn: "শুভ সন্ধ্যা", ta: "மாலை வணக்கம்", te: "శుభ సాయంత్రం", mr: "शुभ संध्याकाळ" },
    logActivity: { en: "Log Activity", hi: "गतिविधि दर्ज करें", bn: "কার্যকলাপ লগ করুন", ta: "செயல்பாட்டைப் பதிவு செய்யவும்", te: "కార్యకలాపాన్ని లాగ్ చేయండి", mr: "क्रियाकलाप नोंदवा" },
    todaysFootprint: { en: "Today's footprint", hi: "आज का कार्बन पदचिह्न", bn: "আজকের কার্বন পদচিহ্ন", ta: "இன்றைய கார்பன் தடம்", te: "నేటి కార్బన్ పాదముద్ర", mr: "आजचा कार्बन ठसा" },
    todaysQuests: { en: "Today's Quests", hi: "आज के क्वेस्ट", bn: "আজকের কোয়েস্ট", ta: "இன்றைய பணிகள்", te: "నేటి క్వెస్ట్‌లు", mr: "आजचे क्वेस्ट" },
    streakBanner: {
        en: (n) => `You're on a ${n}-day logging streak — every entry keeps your footprint honest.`,
        hi: (n) => `आप ${n} दिनों की लॉगिंग स्ट्रीक पर हैं — हर एंट्री आपके पदचिह्न को ईमानदार रखती है।`,
        bn: (n) => `আপনি ${n}-দিনের লগিং স্ট্রিকে আছেন — প্রতিটি এন্ট্রি আপনার পদচিহ্নকে সৎ রাখে।`,
        ta: (n) => `நீங்கள் ${n}-நாள் பதிவுத் தொடரில் உள்ளீர்கள் — ஒவ்வொரு பதிவும் உங்கள் தடத்தை நேர்மையாக வைத்திருக்கும்.`,
        te: (n) => `మీరు ${n}-రోజుల లాగింగ్ స్ట్రీక్‌లో ఉన్నారు — ప్రతి ఎంట్రీ మీ పాదముద్రను నిజాయితీగా ఉంచుతుంది.`,
        mr: (n) => `तुम्ही ${n}-दिवसांच्या लॉगिंग स्ट्रीकवर आहात — प्रत्येक नोंद तुमचा ठसा प्रामाणिक ठेवते.`,
    },
};

const LocalizationContext = createContext({ lang: "en", setLang: () => {}, t: (k) => STRINGS[k]?.en ?? k });
const useLocalization = () => useContext(LocalizationContext);

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
/* Aggregation Engine                                               */
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

/* ---------------------------------------------------------------- */
/* Multi-tenancy — every org-scoped query filters on orgId           */
/* ---------------------------------------------------------------- */
const ORGS = [
    { id: "org_northwind", name: "Northwind Labs", plan: "Business" },
    { id: "org_verdant", name: "Infosys SpringBoard", plan: "Tech" },
];
const DEFAULT_ORG_ID = ORGS[0].id;

const TEAM_MEMBERS = [
    { id: "u_priya", orgId: "org_northwind", name: "Priya N.", dept: "Design", weekly: 21.3, trend: -6, targetWeekly: 24, goalPct: 92, lastActive: "2h ago" },
    { id: "u_marcus", orgId: "org_northwind", name: "Marcus O.", dept: "Engineering", weekly: 24.8, trend: -2, targetWeekly: 26, goalPct: 74, lastActive: "5h ago" },
    { id: "u_elena", orgId: "org_northwind", name: "Elena V.", dept: "Engineering", weekly: 27.1, trend: 3, targetWeekly: 25, goalPct: 48, lastActive: "1d ago" },
    { id: "u_dev", orgId: "org_northwind", name: "Dev K.", dept: "Operations", weekly: 31.5, trend: 1, targetWeekly: 30, goalPct: 61, lastActive: "3h ago" },
    { id: "u_sam", orgId: "org_verdant", name: "Sam T.", dept: "Sales", weekly: 35.9, trend: 8, targetWeekly: 30, goalPct: 22, lastActive: "2d ago" },
    { id: "u_ana", orgId: "org_verdant", name: "Ana R.", dept: "Sales", weekly: 40.2, trend: 5, targetWeekly: 34, goalPct: 35, lastActive: "6h ago" },
];

/* Org-scoped selectors — never read the raw arrays in a view */
const membersForOrg = (orgId) => TEAM_MEMBERS.filter((m) => m.orgId === orgId);

const ORG_ACTIVITY_LOG = [
    { id: "l1", orgId: "org_northwind", user: "Priya N.", category: "Transport", activityType: "Train", quantity: 24, unit: "km", co2e: 0.98, when: "Today · 09:12", onGoal: true },
    { id: "l2", orgId: "org_northwind", user: "Marcus O.", category: "Energy", activityType: "Grid electricity", quantity: 11, unit: "kWh", co2e: 2.56, when: "Today · 08:40", onGoal: true },
    { id: "l3", orgId: "org_northwind", user: "Elena V.", category: "Food", activityType: "Beef meal", quantity: 1, unit: "serving", co2e: 6.61, when: "Today · 13:05", onGoal: false },
    { id: "l4", orgId: "org_northwind", user: "Dev K.", category: "Transport", activityType: "Car (petrol)", quantity: 32, unit: "km", co2e: 6.14, when: "Yesterday · 18:22", onGoal: false },
    { id: "l5", orgId: "org_northwind", user: "Priya N.", category: "Waste", activityType: "Recycled waste", quantity: 3, unit: "kg", co2e: 0.06, when: "Yesterday · 17:00", onGoal: true },
    { id: "l6", orgId: "org_northwind", user: "Marcus O.", category: "Food", activityType: "Vegetarian meal", quantity: 2, unit: "serving", co2e: 1.02, when: "Yesterday · 12:30", onGoal: true },
    { id: "l7", orgId: "org_verdant", user: "Sam T.", category: "Transport", activityType: "Flight (short-haul)", quantity: 420, unit: "km", co2e: 107.1, when: "Today · 07:15", onGoal: false },
    { id: "l8", orgId: "org_verdant", user: "Ana R.", category: "Energy", activityType: "Natural gas", quantity: 14, unit: "kWh", co2e: 2.58, when: "Today · 10:48", onGoal: true },
    { id: "l9", orgId: "org_verdant", user: "Ana R.", category: "Waste", activityType: "Landfill waste", quantity: 4, unit: "kg", co2e: 2.32, when: "Yesterday · 20:10", onGoal: false },
];
const logsForOrg = (orgId) => ORG_ACTIVITY_LOG.filter((l) => l.orgId === orgId);

const ORG_CATEGORY_AVG = {
    org_northwind: { Transport: 12.4, Energy: 8.1, Food: 9.6, Waste: 2.7 },
    org_verdant: { Transport: 18.9, Energy: 10.4, Food: 13.2, Waste: 4.1 },
};



const BADGES = [
    { id: "streak_7", name: "Consistent Carver", desc: "Maintained a logging streak of 7 days or more.", sub: "7-day logging streak completed", icon: Flame, color: (T) => T.clay, requirement: "7-day logging streak", tag: "HABIT" },
    { id: "first_goal", name: "Green Budgeter", desc: "First daily quest achieved. Keep up the clean routines!", sub: "First daily quest achieved", icon: CheckCircle2, color: (T) => T.moss, requirement: "Complete 1 daily quest", tag: "STARTER" },
    { id: "reduction_10", name: "Carbon Cutter", desc: "Reduced your cumulative CO₂e emissions by 10 kg.", sub: "CO₂e reduction tier 1 hit", icon: Leaf, color: (T) => T.sky, requirement: "Reduce 10 kg CO₂e", tag: "BRONZE" },
    { id: "reduction_25", name: "Eco Supporter", desc: "Reduced your cumulative CO₂e emissions by 25 kg.", sub: "CO₂e reduction tier 2 hit", icon: Award, color: (T) => T.olive, requirement: "Reduce 25 kg CO₂e", tag: "SILVER" },
    { id: "reduction_50", name: "Zero Waste Pro", desc: "Reduced your cumulative CO₂e emissions by 50 kg.", sub: "CO₂e reduction tier 3 hit", icon: Trash2, color: (T) => T.danger, requirement: "Reduce 50 kg CO₂e", tag: "WASTE" },

    /* Catalog-only badges — no unlock condition wired up yet, so these       */
    /* stay locked until real tracking exists for them. Purely additive to   */
    /* the visual catalog per the redesign brief; the 5 badges above and     */
    /* their unlock math in earnedBadgeIds are completely untouched.         */
    { id: "climate_champion", name: "Climate Champion", desc: "Reached the highest cumulative CO₂e reduction tier — 100 kg and counting.", sub: "Ultimate emissions milestone", icon: Crown, color: (T) => T.mossDark, requirement: "Reduce 100 kg CO₂e", tag: "GOLD" },
    { id: "car_free_commuter", name: "Car-Free Commuter", desc: "Logged five commutes by bike, foot or transit in a week.", sub: "Sustainable commuting streak", icon: Bike, color: (T) => T.sky, requirement: "5 car-free commutes", tag: "TRANSPORT" },
    { id: "rail_rider", name: "Rail Rider", desc: "Chose the train over a flight or long drive.", sub: "Rail over road or air", icon: TrainFront, color: (T) => T.olive, requirement: "Log 3 train journeys", tag: "TRANSPORT" },
    { id: "plant_plate", name: "Plant Plate", desc: "Ten plant-based meals logged — your lowest-impact food choice.", sub: "Plant-forward eating", icon: UtensilsCrossed, color: (T) => T.moss, requirement: "10 vegetarian meals", tag: "FOOD" },
    { id: "watt_watcher", name: "Watt Watcher", desc: "Cut weekly household electricity use by 15%.", sub: "Energy-conscious habits", icon: Zap, color: (T) => T.olive, requirement: "-15% weekly kWh", tag: "ENERGY" },
    { id: "water_wise", name: "Water Wise", desc: "Kept hot-water heating emissions below the community average.", sub: "Efficient water use", icon: Droplet, color: (T) => T.sky, requirement: "Below-average heating", tag: "WATER" },
    { id: "forest_friend", name: "Forest Friend", desc: "Your reductions equal a year of carbon capture by 5 trees.", sub: "Equivalent tree impact", icon: TreePine, color: (T) => T.moss, requirement: "Save 100 kg CO₂e", tag: "IMPACT" },
    { id: "planet_pacesetter", name: "Planet Pacesetter", desc: "Stayed under the 1.5°C-aligned weekly budget for a month.", sub: "Climate-aligned pace", icon: Globe2, color: (T) => T.clay, requirement: "4-week budget streak", tag: "GOAL" },
    { id: "team_star", name: "Team Star", desc: "Finished top three on your team leaderboard.", sub: "Leaderboard recognition", icon: Star, color: (T) => T.olive, requirement: "Top 3 team rank", tag: "TEAM" },
];

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
    if (h < 12) return "greetingMorning";
    if (h < 18) return "greetingAfternoon";
    return "greetingEvening";
};

/* ---------------------------------------------------------------- */
/* Sprout Mascot Inline SVG Component                               */
/* ---------------------------------------------------------------- */
function SproutMascot({ size = 32 }) {
    const T = useTheme();
    return (
        <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Left Leaf */}
            <path
                d="M32 28C32 16 20 8 10 12C8 24 18 32 32 28Z"
                fill={T.moss}
                stroke={T.mossDark}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            {/* Right Leaf */}
            <path
                d="M32 28C32 16 44 8 54 12C56 24 46 32 32 28Z"
                fill={T.lichen}
                stroke={T.moss}
                strokeWidth="2"
                strokeLinejoin="round"
            />
            {/* Stem */}
            <path d="M32 28V36" stroke={T.mossDark} strokeWidth="3.5" strokeLinecap="round" />
            {/* Sprout Face Body */}
            <circle cx="32" cy="44" r="16" fill={T.card} stroke={T.moss} strokeWidth="3" />
            {/* Eyes */}
            <circle cx="26" cy="42" r="2.2" fill={T.ink} />
            <circle cx="38" cy="42" r="2.2" fill={T.ink} />
            {/* Blush cheeks */}
            <circle cx="22" cy="46" r="2" fill={T.clay} opacity="0.6" />
            <circle cx="42" cy="46" r="2" fill={T.clay} opacity="0.6" />
            {/* Happy Smile */}
            <path d="M29 47C30.5 49 33.5 49 35 47" stroke={T.ink} strokeWidth="2" strokeLinecap="round" fill="none" />
        </svg>
    );
}

/* ---------------------------------------------------------------- */
/* Sprout 🌱 Responsive AI Chatbot Component                        */
/* ---------------------------------------------------------------- */
const Tech_PROMPTS = [
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

    // Persisted messages via localStorage
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

    // Build context payload from user data
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
            /*
               Calls backend LLM API endpoint.
               Replace '/api/chat' with backend URL if needed.
            */
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
            console.warn("Backend call failed or missing. Generates tailored response:", err);

            // Fallback response simulating API answer if route is offline
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
            {/* Inject Mobile Responsive Styles for Sprout Chat Window */}
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
                        top: 0;
                        left: 0;
                        right: 0;
                        bottom: 0;
                        width: 100vw;
                        height: 100vh;
                        max-width: 100%;
                        border-radius: 0;
                        z-index: 10000;
                    }
                }
                .sprout-fab {
                    position: fixed;
                    bottom: 24px;
                    right: 24px;
                    width: 58px;
                    height: 58px;
                    border-radius: 50%;
                    z-index: 9998;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    box-shadow: 0 6px 16px rgba(0,0,0,0.2);
                    transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
                }
                .sprout-fab:hover {
                    transform: scale(1.08);
                }
                .typing-dot {
                    width: 6px;
                    height: 6px;
                    border-radius: 50%;
                    display: inline-block;
                    animation: sproutBounce 1.4s infinite ease-in-out both;
                }
                .typing-dot:nth-child(1) { animation-delay: -0.32s; }
                .typing-dot:nth-child(2) { animation-delay: -0.16s; }
                @keyframes sproutBounce {
                    0%, 80%, 100% { transform: scale(0); }
                    40% { transform: scale(1.0); }
                }
            `}} />

            {/* Launcher Floating Action Button (FAB) */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="sprout-fab"
                    style={{
                        background: T.card,
                        border: `2px solid ${T.moss}`,
                    }}
                    aria-label="Open Sprout AI Assistant"
                >
                    <SproutMascot size={36} />
                    <span style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: 14,
                        height: 14,
                        borderRadius: "50%",
                        background: T.moss,
                        border: `2px solid ${T.card}`
                    }} />
                </button>
            )}

            {/* Chat Panel Sheet */}
            {isOpen && (
                <div className="sprout-chat-container" style={{ background: T.card, border: `1px solid ${T.line}` }}>
                    {/* Header */}
                    <div style={{
                        padding: "12px 16px",
                        background: `linear-gradient(135deg, ${T.paperRaised}, ${T.card})`,
                        borderBottom: `1px solid ${T.line}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between"
                    }}>
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
                            <button
                                onClick={handleResetHistory}
                                title="Reset Chat History"
                                style={{ background: "transparent", border: "none", color: T.subtext, cursor: "pointer", padding: 6, borderRadius: "50%" }}
                            >
                                <RotateCcw size={15} />
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                title="Close Chat"
                                style={{ background: "transparent", border: "none", color: T.subtext, cursor: "pointer", padding: 6, borderRadius: "50%" }}
                            >
                                <X size={18} />
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div style={{
                            padding: "8px 12px",
                            background: `${T.danger}15`,
                            borderBottom: `1px solid ${T.danger}40`,
                            color: T.danger,
                            fontFamily: BODY,
                            fontSize: 12,
                            display: "flex",
                            alignItems: "center",
                            gap: 8
                        }}>
                            <AlertCircle size={14} />
                            <span style={{ flex: 1 }}>{error}</span>
                            <button onClick={() => setError(null)} style={{ background: "transparent", border: "none", color: T.danger, cursor: "pointer" }}><X size={12} /></button>
                        </div>
                    )}

                    {/* Messages Body */}
                    <div style={{
                        flex: 1,
                        padding: 16,
                        overflowY: "auto",
                        display: "flex",
                        flexDirection: "column",
                        gap: 12,
                        background: T.paper
                    }}>
                        {messages.map((m) => {
                            const isUser = m.sender === "user";
                            return (
                                <div
                                    key={m.id}
                                    style={{
                                        display: "flex",
                                        flexDirection: isUser ? "row-reverse" : "row",
                                        alignItems: "flex-end",
                                        gap: 8,
                                    }}
                                >
                                    {!isUser && (
                                        <div style={{ width: 28, height: 28, flexShrink: 0, marginBottom: 2 }}>
                                            <SproutMascot size={28} />
                                        </div>
                                    )}
                                    <div style={{
                                        maxWidth: "78%",
                                        padding: "10px 14px",
                                        borderRadius: isUser ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                                        background: isUser ? T.moss : T.card,
                                        color: isUser ? T.paper : T.ink,
                                        border: isUser ? "none" : `1px solid ${T.line}`,
                                        fontFamily: BODY,
                                        fontSize: 13,
                                        lineHeight: "1.45",
                                        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
                                    }}>
                                        <div>{m.text}</div>
                                        <div style={{
                                            fontFamily: MONO,
                                            fontSize: 9,
                                            opacity: 0.7,
                                            marginTop: 4,
                                            textAlign: isUser ? "right" : "left"
                                        }}>
                                            {m.timestamp}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}

                        {/* Tech Suggestions on First/Empty Open */}
                        {messages.length <= 1 && (
                            <div style={{ marginTop: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                                <div style={{ fontFamily: MONO, fontSize: 10, color: T.subtext, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                                    Suggested Questions
                                </div>
                                {Tech_PROMPTS.map((prompt, i) => (
                                    <button
                                        key={i}
                                        onClick={() => handleSend(prompt)}
                                        style={{
                                            textAlign: "left",
                                            padding: "8px 12px",
                                            borderRadius: 8,
                                            background: T.card,
                                            border: `1px solid ${T.line}`,
                                            fontFamily: BODY,
                                            fontSize: 12,
                                            color: T.ink,
                                            cursor: "pointer",
                                            transition: "background 0.15s ease"
                                        }}
                                    >
                                        💡 {prompt}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Typing / Thinking Animation */}
                        {isLoading && (
                            <div style={{ display: "flex", alignItems: "flex-end", gap: 8 }}>
                                <SproutMascot size={28} />
                                <div style={{
                                    padding: "10px 14px",
                                    borderRadius: "16px 16px 16px 2px",
                                    background: T.card,
                                    border: `1px solid ${T.line}`,
                                    display: "flex",
                                    gap: 4,
                                    alignItems: "center"
                                }}>
                                    <span className="typing-dot" style={{ background: T.moss }} />
                                    <span className="typing-dot" style={{ background: T.moss }} />
                                    <span className="typing-dot" style={{ background: T.moss }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Chat Input Bar */}
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        style={{
                            padding: "10px 12px",
                            background: T.card,
                            borderTop: `1px solid ${T.line}`,
                            display: "flex",
                            gap: 8,
                            alignItems: "center"
                        }}
                    >
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask Sprout anything about your CO₂e..."
                            style={{
                                flex: 1,
                                padding: "9px 12px",
                                background: T.paper,
                                border: `1px solid ${T.line}`,
                                borderRadius: 999,
                                fontFamily: BODY,
                                fontSize: 13,
                                color: T.ink,
                                outline: "none"
                            }}
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isLoading}
                            style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: input.trim() && !isLoading ? T.moss : T.grey,
                                border: "none",
                                color: T.paper,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                cursor: input.trim() && !isLoading ? "pointer" : "not-allowed",
                                flexShrink: 0
                            }}
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
        <div
            className="ct-card"
            style={{
                background: T.card,
                border: `1px solid ${T.line}`,
                borderRadius: 16,
                padding: 20,
                boxShadow: T.shadow,
                transition: "box-shadow 260ms ease, transform 260ms cubic-bezier(.22,1,.36,1)",
                ...style,
            }}
        >
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

/* ---------------------------------------------------------------- */
/* Premium motion + surface primitives                              */
/* ---------------------------------------------------------------- */
function Reveal({ children, delay = 0, style, y = 14 }) {
    return (
        <div
            style={{
                animation: `ctRise 700ms cubic-bezier(.22,1,.36,1) ${delay}ms both`,
                ["--ct-y"]: `${y}px`,
                ...style,
            }}
        >
            {children}
        </div>
    );
}

function useCountUp(value, duration = 1100) {
    const [display, setDisplay] = useState(0);
    const fromRef = useRef(0);
    useEffect(() => {
        const from = fromRef.current;
        const start = performance.now();
        let raf;
        const tick = (t) => {
            const p = Math.min(1, (t - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            const cur = from + (value - from) * eased;
            fromRef.current = cur;
            setDisplay(cur);
            if (p < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(raf);
    }, [value, duration]);
    return display;
}

function Counter({ value, decimals = 1, style }) {
    const v = useCountUp(Number(value) || 0);
    return <span style={style}>{v.toFixed(decimals)}</span>;
}

function useTilt(max = 6) {
    const ref = useRef(null);
    const onMove = (e) => {
        const el = ref.current;
        if (!el) return;
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(1000px) rotateX(${(-py * max).toFixed(2)}deg) rotateY(${(px * max).toFixed(2)}deg) translateY(-3px)`;
        el.style.setProperty("--gx", `${((e.clientX - r.left) / r.width) * 100}%`);
        el.style.setProperty("--gy", `${((e.clientY - r.top) / r.height) * 100}%`);
    };
    const onLeave = () => {
        const el = ref.current;
        if (el) el.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
    };
    return { ref, onMouseMove: onMove, onMouseLeave: onLeave };
}

function GlassCard({ children, style, tilt = false, pad = 20, className = "" }) {
    const T = useTheme();
    const t = useTilt(tilt ? 5 : 0);
    return (
        <div
            ref={tilt ? t.ref : undefined}
            onMouseMove={tilt ? t.onMouseMove : undefined}
            onMouseLeave={tilt ? t.onMouseLeave : undefined}
            className={`ct-card ${className}`}
            style={{
                background: T.glass,
                border: `1px solid ${T.line}`,
                borderRadius: 18,
                padding: pad,
                boxShadow: T.shadow,
                backdropFilter: "blur(14px)",
                transition: "transform 260ms cubic-bezier(.22,1,.36,1), box-shadow 260ms ease, border-color 260ms ease",
                willChange: "transform",
                ...style,
            }}
        >
            {children}
        </div>
    );
}

function IconChip({ icon: Icon, color, bg, size = 34 }) {
    return (
        <div
            style={{
                width: size,
                height: size,
                borderRadius: 12,
                display: "grid",
                placeItems: "center",
                background: bg,
                flexShrink: 0,
            }}
        >
            <Icon size={size * 0.48} color={color} strokeWidth={2} />
        </div>
    );
}

function Sparkline({ points, color, height = 34, fill = true }) {
    const id = useRef(`sp${Math.random().toString(36).slice(2, 8)}`).current;
    const max = Math.max(...points), min = Math.min(...points);
    const span = max - min || 1;
    const W = 100;
    const coords = points.map((p, i) => [
        (i / (points.length - 1)) * W,
        height - 4 - ((p - min) / span) * (height - 10),
    ]);
    const d = coords.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
    return (
        <svg viewBox={`0 0 ${W} ${height}`} preserveAspectRatio="none" style={{ width: "100%", height, display: "block", overflow: "visible" }}>
            <defs>
                <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                </linearGradient>
            </defs>
            {fill && <path d={`${d} L${W},${height} L0,${height} Z`} fill={`url(#${id})`} />}
            <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ct-draw" />
            <circle cx={coords[coords.length - 1][0]} cy={coords[coords.length - 1][1]} r="2.6" fill={color} />
        </svg>
    );
}

function ProgressBar({ pct, color, track }) {
    return (
        <div style={{ height: 6, borderRadius: 999, background: track, overflow: "hidden" }}>
            <div
                style={{
                    height: "100%",
                    width: `${Math.min(100, pct)}%`,
                    borderRadius: 999,
                    background: color,
                    transition: "width 1.1s cubic-bezier(.22,1,.36,1)",
                }}
            />
        </div>
    );
}

function StreakRing({ value, max = 7, size = 92, color, track }) {
    const r = (size - 10) / 2;
    const c = 2 * Math.PI * r;
    const pct = Math.min(1, value / max);
    return (
        <div style={{ position: "relative", width: size, height: size, flexShrink: 0 }}>
            <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
                <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={track} strokeWidth="5" />
                <circle
                    cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth="5" strokeLinecap="round"
                    strokeDasharray={c}
                    strokeDashoffset={c * (1 - pct)}
                    style={{ transition: "stroke-dashoffset 1.4s cubic-bezier(.22,1,.36,1)" }}
                />
            </svg>
            <div style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", textAlign: "center" }}>
                <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 3 }}>
                        <Flame size={14} color="#FFF7E6" />
                        <span style={{ fontFamily: DISPLAY, fontSize: 24, color: "#FFFDF6", lineHeight: 1 }}>{value}</span>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.12em", color: "#FFFDF6", opacity: 0.78, marginTop: 3 }}>DAY STREAK</div>
                </div>
            </div>
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* Filters, CSV export, skeletons, empty states                      */
/* ---------------------------------------------------------------- */
const RANGES = [
    { key: "7d", label: "7 days", days: 7 },
    { key: "30d", label: "30 days", days: 30 },
    { key: "90d", label: "90 days", days: 90 },
    { key: "all", label: "All time", days: null },
];
const DEFAULT_FILTERS = { rangeKey: "30d", from: "", to: "", cats: [] };

function rangeBounds(f) {
    if (f.rangeKey === "custom") {
        return { from: f.from || null, to: f.to || null };
    }
    const r = RANGES.find((x) => x.key === f.rangeKey);
    if (!r || !r.days) return { from: null, to: null };
    return { from: ymd(addDays(TODAY, -(r.days - 1))), to: ymd(TODAY) };
}

function filterEntries(entries, f) {
    const { from, to } = rangeBounds(f);
    return entries.filter((e) => {
        if (f.cats.length && !f.cats.includes(e.category)) return false;
        if (from && e.date < from) return false;
        if (to && e.date > to) return false;
        return true;
    });
}

function filterLogs(logs, f) {
    return logs.filter((l) => {
        if (f.cats.length && !f.cats.includes(l.category)) return false;
        if (f.rangeKey === "custom" && (f.from || f.to)) {
            // demo logs carry relative timestamps; map them onto real dates
            const d = l.when.startsWith("Today") ? ymd(TODAY) : ymd(addDays(TODAY, -1));
            if (f.from && d < f.from) return false;
            if (f.to && d > f.to) return false;
        }
        return true;
    });
}

function filterLabel(f) {
    const r = RANGES.find((x) => x.key === f.rangeKey);
    const range = f.rangeKey === "custom" ? `${f.from || "…"} → ${f.to || "…"}` : (r ? r.label : "");
    return `${range}${f.cats.length ? " · " + f.cats.join(", ") : " · All categories"}`;
}

function downloadCSV(filename, columns, rows) {
    const esc = (v) => {
        const s = v === null || v === undefined ? "" : String(v);
        return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
    };
    const csv = [columns.map(esc).join(","), ...rows.map((r) => r.map(esc).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 500);
}

function ExportButton({ onClick, label = "Export CSV" }) {
    const T = useTheme();
    return (
        <button
            onClick={onClick}
            className="ct-cta"
            style={{ display: "inline-flex", alignItems: "center", gap: 7, fontFamily: BODY, fontSize: 12, fontWeight: 600, padding: "8px 14px", borderRadius: 999, border: `1px solid ${T.line}`, background: T.card, color: T.ink, cursor: "pointer" }}
        >
            <Download size={13} color={T.moss} /> {label}
        </button>
    );
}

function Chip({ active, onClick, children }) {
    const T = useTheme();
    return (
        <button
            onClick={onClick}
            style={{
                fontFamily: BODY, fontSize: 11.5, fontWeight: 600, padding: "6px 12px", borderRadius: 999,
                border: `1px solid ${active ? T.moss : T.line}`,
                background: active ? `linear-gradient(140deg, ${T.moss}, ${T.mossDark})` : "transparent",
                color: active ? "#F5FBF6" : T.subtext, cursor: "pointer",
                transition: "all 200ms cubic-bezier(.22,1,.36,1)", whiteSpace: "nowrap",
            }}
        >
            {children}
        </button>
    );
}

function FilterBar({ filters, onChange, actions }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const set = (patch) => onChange({ ...filters, ...patch });
    const toggleCat = (c) =>
        set({ cats: filters.cats.includes(c) ? filters.cats.filter((x) => x !== c) : [...filters.cats, c] });
    const dirty = filters.rangeKey !== DEFAULT_FILTERS.rangeKey || filters.cats.length > 0;

    return (
        <Reveal>
            <div style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap", padding: "12px 14px", borderRadius: 14, background: T.glass || T.card, border: `1px solid ${T.line}`, marginBottom: 18, backdropFilter: "blur(10px)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Calendar size={14} color={T.moss} />
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.subtext }}>Range</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {RANGES.map((r) => (
                        <Chip key={r.key} active={filters.rangeKey === r.key} onClick={() => set({ rangeKey: r.key })}>{r.label}</Chip>
                    ))}
                    <Chip active={filters.rangeKey === "custom"} onClick={() => set({ rangeKey: "custom" })}>Custom</Chip>
                </div>

                {filters.rangeKey === "custom" && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                        <input type="date" className="ct-input" value={filters.from} max={filters.to || undefined} onChange={(e) => set({ from: e.target.value })}
                               style={{ fontFamily: BODY, fontSize: 12, padding: "6px 9px", borderRadius: 9, border: `1px solid ${T.line}`, background: T.card, color: T.ink }} />
                        <span style={{ color: T.subtext, fontFamily: BODY, fontSize: 12 }}>→</span>
                        <input type="date" className="ct-input" value={filters.to} min={filters.from || undefined} onChange={(e) => set({ to: e.target.value })}
                               style={{ fontFamily: BODY, fontSize: 12, padding: "6px 9px", borderRadius: 9, border: `1px solid ${T.line}`, background: T.card, color: T.ink }} />
                    </div>
                )}

                <div style={{ width: 1, height: 22, background: T.line }} />

                <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                    <Sparkles size={14} color={T.olive} />
                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.subtext }}>Category</span>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                    {CATEGORIES.map((c) => {
                        const on = filters.cats.includes(c);
                        const Icon = CATEGORY_ICON[c];
                        return (
                            <button key={c} onClick={() => toggleCat(c)}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: BODY, fontSize: 11.5, fontWeight: 600, padding: "6px 12px", borderRadius: 999, border: `1px solid ${on ? CATCOLOR[c] : T.line}`, background: on ? `${CATCOLOR[c]}1f` : "transparent", color: on ? CATCOLOR[c] : T.subtext, cursor: "pointer", transition: "all 200ms cubic-bezier(.22,1,.36,1)" }}>
                                <Icon size={12} /> {c}
                            </button>
                        );
                    })}
                </div>

                <div style={{ flex: 1 }} />
                {dirty && (
                    <button onClick={() => onChange({ ...DEFAULT_FILTERS })}
                            style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: BODY, fontSize: 11.5, fontWeight: 600, padding: "6px 11px", borderRadius: 999, border: `1px solid ${T.line}`, background: "transparent", color: T.subtext, cursor: "pointer" }}>
                        <RotateCcw size={12} /> Reset
                    </button>
                )}
                {actions}
            </div>
        </Reveal>
    );
}

/* Loading skeletons */
function Skeleton({ w = "100%", h = 14, r = 8, style }) {
    const T = useTheme();
    return <div className="ct-skel" style={{ width: w, height: h, borderRadius: r, backgroundColor: T.railBg || T.paperRaised, ...style }} />;
}

function SkeletonCard({ lines = 3, chart = false, height }) {
    const T = useTheme();
    return (
        <div style={{ padding: 20, borderRadius: 16, background: T.card, border: `1px solid ${T.line}`, minHeight: height }}>
            <Skeleton w="42%" h={11} />
            <div style={{ height: 14 }} />
            {chart ? (
                <Skeleton h={height ? height - 80 : 160} r={12} />
            ) : (
                Array.from({ length: lines }).map((_, i) => (
                    <div key={i} style={{ marginBottom: 10 }}>
                        <Skeleton w={`${92 - i * 14}%`} h={12} />
                    </div>
                ))
            )}
        </div>
    );
}

function PanelSkeleton({ variant = "dashboard" }) {
    const stats = (
        <div className="ct-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16 }}>
            {[0, 1, 2, 3].map((i) => <SkeletonCard key={i} lines={2} />)}
        </div>
    );
    if (variant === "log") {
        return (
            <div className="ct-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20 }}>
                <SkeletonCard lines={6} />
                <SkeletonCard chart height={280} />
            </div>
        );
    }
    if (variant === "leaderboard" || variant === "badges") {
        return <div style={{ display: "grid", gap: 16 }}><SkeletonCard lines={6} /><SkeletonCard lines={4} /></div>;
    }
    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {stats}
            <div className="ct-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                <SkeletonCard chart height={300} />
                <SkeletonCard chart height={300} />
            </div>
            <SkeletonCard lines={4} />
        </div>
    );
}

function useReady(delay = 620, deps = []) {
    const [ready, setReady] = useState(false);
    useEffect(() => {
        setReady(false);
        const t = setTimeout(() => setReady(true), delay);
        return () => clearTimeout(t);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, deps);
    return ready;
}

/* Empty states */
function EmptyState({ icon: Icon = Leaf, title, body, actionLabel, onAction, compact = false }) {
    const T = useTheme();
    return (
        <div style={{ display: "grid", placeItems: "center", textAlign: "center", padding: compact ? "26px 18px" : "46px 24px" }}>
            <div style={{ width: 54, height: 54, borderRadius: "50%", background: `${T.moss}18`, display: "grid", placeItems: "center", marginBottom: 14 }}>
                <Icon size={22} color={T.moss} />
            </div>
            <div style={{ fontFamily: DISPLAY, fontSize: 17, color: T.ink, letterSpacing: "-0.01em" }}>{title}</div>
            {body && <p style={{ fontFamily: BODY, fontSize: 12.5, color: T.subtext, maxWidth: 380, lineHeight: 1.6, margin: "7px 0 0" }}>{body}</p>}
            {actionLabel && (
                <button onClick={onAction} className="ct-cta"
                        style={{ marginTop: 16, fontFamily: BODY, fontSize: 12.5, fontWeight: 700, padding: "9px 16px", borderRadius: 999, border: "none", background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`, color: "#F5FBF6", cursor: "pointer" }}>
                    {actionLabel}
                </button>
            )}
        </div>
    );
}

/* ---------------------------------------------------------------- */
/* First-run walkthrough                                             */
/* ---------------------------------------------------------------- */
const WALKTHROUGH_STEPS = [
    { icon: Leaf, title: "Welcome to CarbonTrack", body: "Your personal and organisational carbon cockpit. This 5-step tour takes about 20 seconds.", tab: "dashboard" },
    { icon: PlusCircle, title: "Log an activity", body: "Add travel, energy, meals and waste in the Log tab. Every entry instantly recalculates today's footprint, streak and quests.", tab: "log" },
    { icon: TrendIcon, title: "Filter your analytics", body: "Use the date-range and category filters on Trends, Insights and Team to narrow every chart and table by time and emissions type.", tab: "trends" },
    { icon: Trophy, title: "Benchmark anonymously", body: "The leaderboard compares weekly footprints without exposing personal data. Turn on anonymous mode in your profile.", tab: "leaderboard" },
    { icon: Download, title: "Export your reports", body: "Download activity logs and leaderboard standings as CSV from the Team and Leaderboard tabs for organisation reporting.", tab: "team" },
];

function Walkthrough({ open, step, onStep, onClose, onDone }) {
    const T = useTheme();
    if (!open) return null;
    const s = WALKTHROUGH_STEPS[step];
    const Icon = s.icon;
    const last = step === WALKTHROUGH_STEPS.length - 1;
    return (
        <div style={{ position: "fixed", inset: 0, zIndex: 4000, background: "rgba(12,22,16,0.5)", backdropFilter: "blur(6px)", display: "grid", placeItems: "center", padding: 20, animation: "fadeIn 260ms ease both" }}
             onClick={onClose}>
            <div onClick={(e) => e.stopPropagation()}
                 style={{ width: "min(520px, 100%)", background: T.card, border: `1px solid ${T.line}`, borderRadius: 20, padding: 26, boxShadow: "0 40px 90px -40px rgba(10,30,18,0.7)", animation: "scaleUp 320ms cubic-bezier(.22,1,.36,1) both", position: "relative", overflow: "hidden" }}>
                <div className="ct-aurora" style={{ opacity: 0.55 }} />
                <div style={{ position: "relative" }}>
                    <button onClick={onClose} aria-label="Skip tour"
                            style={{ position: "absolute", top: -6, right: -6, background: "transparent", border: "none", cursor: "pointer", color: T.subtext }}>
                        <X size={16} />
                    </button>
                    <div style={{ width: 46, height: 46, borderRadius: 14, background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`, display: "grid", placeItems: "center", marginBottom: 16 }}>
                        <Icon size={20} color="#F5FBF6" />
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: T.moss, marginBottom: 7 }}>
                        Step {step + 1} of {WALKTHROUGH_STEPS.length}
                    </div>
                    <h2 style={{ fontFamily: DISPLAY, fontSize: 23, color: T.ink, margin: 0, letterSpacing: "-0.02em" }}>{s.title}</h2>
                    <p style={{ fontFamily: BODY, fontSize: 13.5, color: T.subtext, lineHeight: 1.65, margin: "10px 0 20px" }}>{s.body}</p>

                    <div style={{ display: "flex", gap: 6, marginBottom: 20 }}>
                        {WALKTHROUGH_STEPS.map((_, i) => (
                            <span key={i} style={{ height: 4, flex: 1, borderRadius: 999, background: i <= step ? T.moss : T.railBg || T.paperRaised, transition: "background 300ms ease" }} />
                        ))}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <button onClick={onClose}
                                style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 600, color: T.subtext, background: "transparent", border: "none", cursor: "pointer" }}>
                            Skip tour
                        </button>
                        <div style={{ flex: 1 }} />
                        {step > 0 && (
                            <button onClick={() => onStep(step - 1)}
                                    style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: BODY, fontSize: 12.5, fontWeight: 600, padding: "9px 14px", borderRadius: 999, border: `1px solid ${T.line}`, background: "transparent", color: T.ink, cursor: "pointer" }}>
                                <ChevronLeft size={13} /> Back
                            </button>
                        )}
                        <button className="ct-cta" onClick={() => (last ? onDone() : onStep(step + 1))}
                                style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: BODY, fontSize: 12.5, fontWeight: 700, padding: "10px 18px", borderRadius: 999, border: "none", background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`, color: "#F5FBF6", cursor: "pointer" }}>
                            {last ? "Start tracking" : "Next"} <ArrowRight size={13} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

/* Page header used by every secondary tab */

function PageHeader({ eyebrow, title, subtitle, actions }) {
    const T = useTheme();
    return (
        <Reveal>
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, flexWrap: "wrap", marginBottom: 18 }}>
                <div>
                    {eyebrow && (
                        <div style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.14em", textTransform: "uppercase", color: T.moss, marginBottom: 6 }}>{eyebrow}</div>
                    )}
                    <h1 style={{ fontFamily: DISPLAY, fontSize: 28, letterSpacing: "-0.02em", color: T.ink, margin: 0 }}>{title}</h1>
                    {subtitle && <p style={{ fontFamily: BODY, fontSize: 13, color: T.subtext, margin: "6px 0 0 0", maxWidth: 620, lineHeight: 1.5 }}>{subtitle}</p>}
                </div>
                {actions}
            </div>
        </Reveal>
    );
}

/* Profile + settings drawer */
function ProfilePanel({ open, onClose, profile, onChange, dark, onToggleDark, orgId, onOrgChange, earnedIds, youWeekly }) {
    const T = useTheme();
    if (!open) return null;
    const org = ORGS.find((o) => o.id === orgId) || ORGS[0];
    const initials = profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

    const Row = ({ label, hint, children }) => (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "11px 0", borderBottom: `1px solid ${T.line}` }}>
            <div>
                <div style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 600, color: T.ink }}>{label}</div>
                {hint && <div style={{ fontFamily: BODY, fontSize: 11, color: T.subtext, marginTop: 2 }}>{hint}</div>}
            </div>
            {children}
        </div>
    );

    const Switch = ({ on, onToggle }) => (
        <button onClick={onToggle} aria-pressed={on} style={{ width: 40, height: 22, borderRadius: 999, border: `1px solid ${T.line}`, background: on ? T.moss : T.railBg, position: "relative", cursor: "pointer", flexShrink: 0, transition: "background 200ms ease" }}>
            <span style={{ position: "absolute", top: 2, left: on ? 20 : 2, width: 16, height: 16, borderRadius: "50%", background: T.card, transition: "left 220ms cubic-bezier(.22,1,.36,1)" }} />
        </button>
    );

    return (
        <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(12,20,15,0.42)", backdropFilter: "blur(4px)", animation: "fadeIn 200ms ease both", display: "flex", justifyContent: "flex-end" }}>
            <div
                onClick={(e) => e.stopPropagation()}
                style={{
                    width: "min(400px, 92vw)", height: "100%", overflowY: "auto", padding: 24,
                    background: T.card, borderLeft: `1px solid ${T.line}`, boxShadow: T.shadowLg,
                    animation: "ctSlideRight 320ms cubic-bezier(.22,1,.36,1) both",
                }}
            >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                    <SectionLabel style={{ marginBottom: 0 }}>Profile & settings</SectionLabel>
                    <button onClick={onClose} aria-label="Close" style={{ border: "none", background: "transparent", cursor: "pointer", color: T.subtext }}><X size={17} /></button>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: 14, padding: 16, borderRadius: 16, background: T.mist, border: `1px solid ${T.line}`, marginBottom: 20 }}>
                    <div style={{ width: 50, height: 50, borderRadius: "50%", display: "grid", placeItems: "center", background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`, color: "#F4FBF5", fontFamily: BODY, fontWeight: 700, fontSize: 17 }}>
                        {initials}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontFamily: DISPLAY, fontSize: 19, color: T.ink }}>{profile.name}</div>
                        <div style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext }}>{profile.email}</div>
                        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, marginTop: 6, fontFamily: BODY, fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: `${T.olive}22`, color: T.olive }}>
                            <Shield size={10} /> Eco-Guardian · {earnedIds.length} badges
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
                    <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${T.line}`, background: T.paperRaised }}>
                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: T.subtext }}>This week</div>
                        <div style={{ fontFamily: DISPLAY, fontSize: 21, color: T.ink }}>{fmt1(youWeekly)} <span style={{ fontFamily: BODY, fontSize: 11, color: T.subtext }}>kg</span></div>
                    </div>
                    <div style={{ padding: 12, borderRadius: 12, border: `1px solid ${T.line}`, background: T.paperRaised }}>
                        <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.08em", textTransform: "uppercase", color: T.subtext }}>Workspace</div>
                        <div style={{ fontFamily: DISPLAY, fontSize: 15, color: T.ink, marginTop: 4 }}>{org.name}</div>
                    </div>
                </div>

                <div style={{ marginBottom: 6 }}>
                    <label style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext, display: "block", marginBottom: 6 }}>Display name</label>
                    <input
                        value={profile.name}
                        onChange={(e) => onChange({ ...profile, name: e.target.value })}
                        className="ct-input"
                        style={{ width: "100%", boxSizing: "border-box", padding: "10px 12px", fontFamily: BODY, fontSize: 13.5, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 10 }}
                    />
                </div>

                <div style={{ margin: "14px 0 6px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext, display: "block", marginBottom: 6 }}>Organisation (tenant)</label>
                    <select
                        value={orgId}
                        onChange={(e) => onOrgChange(e.target.value)}
                        className="ct-input"
                        style={{ width: "100%", padding: "10px 12px", fontFamily: BODY, fontSize: 13.5, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 10 }}
                    >
                        {ORGS.map((o) => <option key={o.id} value={o.id}>{o.name} · {o.plan}</option>)}
                    </select>
                    <div style={{ fontFamily: BODY, fontSize: 10.5, color: T.subtext, marginTop: 6 }}>All org analytics, logs and goal data are scoped to this tenant ID.</div>
                </div>

                <div style={{ marginTop: 12 }}>
                    <Row label="Dark mode" hint="Match your environment">
                        <Switch on={dark} onToggle={onToggleDark} />
                    </Row>
                    <Row label="Anonymous leaderboard" hint="Show yourself as an alias to peers">
                        <Switch on={profile.anonymous} onToggle={() => onChange({ ...profile, anonymous: !profile.anonymous })} />
                    </Row>
                    <Row label="Weekly digest email" hint="Sunday summary of your footprint">
                        <Switch on={profile.digest} onToggle={() => onChange({ ...profile, digest: !profile.digest })} />
                    </Row>
                    <Row label="Share data with org" hint="Contribute to anonymised team benchmarks">
                        <Switch on={profile.shareWithOrg} onToggle={() => onChange({ ...profile, shareWithOrg: !profile.shareWithOrg })} />
                    </Row>
                    <Row label="Daily target" hint="kg CO₂e per day">
                        <input
                            type="number" min="1" step="0.5" value={profile.dailyTarget}
                            onChange={(e) => onChange({ ...profile, dailyTarget: e.target.value })}
                            style={{ width: 78, padding: "7px 9px", fontFamily: MONO, fontSize: 13, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 9, textAlign: "right" }}
                        />
                    </Row>
                </div>

                <button
                    onClick={onClose}
                    className="ct-cta"
                    style={{ width: "100%", marginTop: 20, padding: "11px 0", fontFamily: BODY, fontSize: 13.5, fontWeight: 650, color: "#F5FBF6", background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`, border: "none", borderRadius: 12, cursor: "pointer" }}
                >
                    Save preferences
                </button>
            </div>
        </div>
    );
}

function TopNav({ activeTab, onTab, dark, onToggleDark, profile, onOpenProfile, orgId, onStartTour }) {

    const T = useTheme();
    const { lang, setLang } = useLocalization();
    const [scrolled, setScrolled] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 4);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);
    const activeLang = LANGUAGES.find((l) => l.code === lang) || LANGUAGES[0];

    return (
        <div
            style={{
                position: "sticky",
                top: 0,
                zIndex: 60,
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "10px 26px",
                borderBottom: `1px solid ${scrolled ? T.line : "transparent"}`,
                background: T.navGlass,
                backdropFilter: "blur(18px) saturate(160%)",
                boxShadow: scrolled ? T.shadow : "none",
                transition: "box-shadow 240ms ease, border-color 240ms ease",
                flexWrap: "wrap",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginRight: 6 }}>
                <img src={ctLogo} alt="CarbonTrack logo" width={34} height={39} style={{ width: 34, height: 39, objectFit: "contain", display: "block" }} />
                <div>
                    <div style={{ fontFamily: DISPLAY, fontSize: 21, fontWeight: 700, color: T.ink, lineHeight: 1.05 }}>
                        Carbon<span style={{ color: T.moss }}>Track</span>
                    </div>
                    <div style={{ fontFamily: MONO, fontSize: 8.5, letterSpacing: "0.12em", textTransform: "uppercase", color: T.subtext, marginTop: 2 }}>
                        Leave lighter. Live better.
                    </div>
                </div>
            </div>

            <div
                style={{
                    display: "flex",
                    gap: 2,
                    flex: 1,
                    flexWrap: "wrap",
                    padding: 4,
                    borderRadius: 999,
                    background: T.railBg,
                    border: `1px solid ${T.line}`,
                }}
            >
                {TABS.map((tab) => {
                    const Icon = tab.icon;
                    const active = activeTab === tab.key;
                    return (
                        <button
                            key={tab.key}
                            onClick={() => onTab(tab.key)}
                            className="ct-tab"
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 6,
                                padding: "7px 13px",
                                fontFamily: BODY,
                                fontSize: 12.5,
                                fontWeight: active ? 650 : 500,
                                color: active ? "#F5FBF6" : T.subtext,
                                background: active ? `linear-gradient(140deg, ${T.moss}, ${T.mossDark})` : "transparent",
                                border: "none",
                                borderRadius: 999,
                                cursor: "pointer",
                                boxShadow: active ? `0 8px 18px -10px ${T.moss}` : "none",
                                transition: "all 220ms cubic-bezier(.22,1,.36,1)",
                            }}
                        >
                            <Icon size={14} strokeWidth={2} color={active ? "#F5FBF6" : T.subtext} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginLeft: "auto" }}>
                {/* Language capsule */}
                <div style={{ position: "relative" }}>
                    <button
                        onClick={() => setLangOpen((o) => !o)}
                        aria-label="Change language"
                        aria-expanded={langOpen}
                        style={{
                            display: "flex", alignItems: "center", gap: 6,
                            padding: "6px 12px", borderRadius: 999,
                            border: `1px solid ${T.line}`, background: T.railBg,
                            cursor: "pointer", fontFamily: BODY, fontSize: 12, fontWeight: 600, color: T.ink,
                        }}
                    >
                        <Globe2 size={13} color={T.subtext} />
                        {activeLang.label}
                        <ChevronDown size={12} color={T.subtext} />
                    </button>
                    {langOpen && (
                        <>
                            <div onClick={() => setLangOpen(false)} style={{ position: "fixed", inset: 0, zIndex: 70 }} />
                            <div
                                style={{
                                    position: "absolute", top: "calc(100% + 6px)", right: 0, zIndex: 71,
                                    background: T.card, border: `1px solid ${T.line}`, borderRadius: 12,
                                    boxShadow: T.shadowLg, padding: 6, minWidth: 150,
                                }}
                            >
                                {LANGUAGES.map((l) => (
                                    <button
                                        key={l.code}
                                        onClick={() => { setLang(l.code); setLangOpen(false); }}
                                        style={{
                                            display: "flex", alignItems: "center", justifyContent: "space-between",
                                            width: "100%", padding: "7px 10px", borderRadius: 8, border: "none",
                                            background: l.code === lang ? T.railBg : "transparent",
                                            color: T.ink, fontFamily: BODY, fontSize: 12.5, fontWeight: l.code === lang ? 650 : 500,
                                            cursor: "pointer", textAlign: "left",
                                        }}
                                    >
                                        {l.label}
                                        {l.code === lang && <CheckCircle2 size={13} color={T.moss} />}
                                    </button>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* Tour capsule */}
                <button
                    onClick={onStartTour}
                    aria-label="Take the tour"
                    style={{
                        display: "flex", alignItems: "center", gap: 6,
                        padding: "6px 12px", borderRadius: 999,
                        border: `1px solid ${T.line}`, background: T.railBg,
                        cursor: "pointer", fontFamily: BODY, fontSize: 12, fontWeight: 600, color: T.ink,
                    }}
                >
                    <MessageSquare size={13} color={T.subtext} />
                    Take the tour
                </button>

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
                        background: T.railBg,
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
                                transition: "left 0.25s cubic-bezier(.22,1,.36,1)",
                            }}
                        />
                    </div>
                    <Moon size={13} color={dark ? T.sky : T.subtext} />
                </button>
            </div>

            <button
                onClick={onOpenProfile}
                className="ct-round"
                aria-label="Open profile and settings"
                style={{
                    display: "flex", alignItems: "center", gap: 9, padding: "5px 12px 5px 6px",
                    borderRadius: 999, border: `1px solid ${T.line}`, background: T.railBg, cursor: "pointer",
                }}
            >
                <span style={{ width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`, color: "#F4FBF5", fontFamily: BODY, fontSize: 11, fontWeight: 700 }}>
                    {profile.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()}
                </span>
                <span style={{ textAlign: "left", lineHeight: 1.15 }}>
                    <span style={{ display: "block", fontFamily: BODY, fontSize: 12, fontWeight: 650, color: T.ink }}>{profile.name}</span>
                    <span style={{ display: "block", fontFamily: BODY, fontSize: 10, color: T.subtext }}>
                        {(ORGS.find((o) => o.id === orgId) || ORGS[0]).name}
                    </span>
                </span>
                <SettingsIcon size={13} color={T.subtext} />
            </button>
        </div>
    );
}


function DashboardHome({ activities, todayTotal, rank, quests, onNavigate, earnedIds }) {
    const T = useTheme();
    const { t } = useLocalization();
    const CATCOLOR = CATEGORY_COLOR(T);
    const dailyAvg = 8.2;
    const monthTotal = MONTHLY_BEFORE_TODAY + todayTotal;
    const monthPct = Math.min(100, Math.round((monthTotal / MONTHLY_TARGET) * 100));
    const completedCount = quests.filter((q) => q.done).length;
    const streak = earnedIds.includes("streak_7") ? 7 : 6;
    const weekSeries = [...THIS_WEEK_SO_FAR, todayTotal, 6.2, 7.4, 5.6];
    const weekTotal = weekSeries.reduce((s, v) => s + v, 0);
    const weekData = WEEK_DAYS.map((d, i) => ({ day: d, kg: Math.round(weekSeries[i] * 10) / 10 }));

    const byCategory = useMemo(() => {
        const map = {};
        CATEGORIES.forEach((c) => (map[c] = 0));
        activities.forEach((a) => { map[a.category] = (map[a.category] || 0) + a.co2e; });
        const total = Object.values(map).reduce((s, v) => s + v, 0) || 1;
        return CATEGORIES.map((c) => ({ name: c, value: map[c], pct: Math.round((map[c] / total) * 100) })).filter((d) => d.value > 0);
    }, [activities]);

    const recent = [...activities].slice(-3).reverse();

    const stats = [
        {
            label: t("todaysFootprint"), icon: Leaf, color: T.moss, bg: `${T.moss}1F`,
            value: fmt1(todayTotal), unit: "kg CO₂e",
            trend: Math.round(((todayTotal - dailyAvg) / dailyAvg) * 100),
            spark: [7.1, 6.4, 8.2, 5.9, 6.8, 4.9, Math.max(0.5, todayTotal)],
        },
        {
            label: "Logged today", icon: PlusCircle, color: T.sky, bg: `${T.sky}22`,
            value: String(activities.length), unit: "entries", sub: "keep the log honest",
            spark: [1, 2, 2, 3, 2, 4, Math.max(1, activities.length)],
        },
        {
            label: "Monthly budget", icon: Target, color: T.olive, bg: `${T.olive}22`,
            value: `${monthPct}`, unit: "%", sub: `of ${MONTHLY_TARGET} kg CO₂e`, bar: monthPct,
        },
        {
            label: "Quests done", icon: Award, color: T.clay, bg: `${T.clay}22`,
            value: `${completedCount}`, unit: `/ ${quests.length}`, sub: "keep going!",
            bar: (completedCount / quests.length) * 100,
        },
    ];

    return (
        <div className="ct-grid" style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) 340px", gap: 18, alignItems: "start" }}>
            {/* ---------------- main column ---------------- */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
                <Reveal delay={0}>
                    <div style={{ display: "grid", gridTemplateColumns: "minmax(0,1fr) auto", gap: 16, alignItems: "center" }}>
                        <div style={{ minWidth: 0 }}>
                            <h1 style={{ fontFamily: DISPLAY, fontSize: 30, color: T.ink, margin: 0, letterSpacing: "-0.02em" }}>
                                {t(greeting())}, <span style={{ color: T.moss }}>there</span> 🌿
                            </h1>
                            <p style={{ fontFamily: BODY, fontSize: 13.5, color: T.subtext, margin: "6px 0 0" }}>
                                Here's how you're doing on your sustainability journey today.
                            </p>
                        </div>
                        <button
                            onClick={() => onNavigate("log")}
                            className="ct-cta"
                            style={{
                                display: "inline-flex", alignItems: "center", gap: 8,
                                padding: "11px 20px", borderRadius: 12, border: "none", cursor: "pointer",
                                background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`,
                                color: "#F5FBF6", fontFamily: BODY, fontSize: 13.5, fontWeight: 650,
                                boxShadow: `0 14px 30px -14px ${T.moss}`,
                            }}
                        >
                            <Plus size={16} /> {t("logActivity")}
                        </button>
                    </div>
                </Reveal>

                {/* cinematic hero */}
                <Reveal delay={80}>
                    <div
                        className="ct-hero"
                        style={{
                            position: "relative",
                            overflow: "hidden",
                            borderRadius: 20,
                            padding: "26px 28px",
                            background: `linear-gradient(120deg, ${T.mossDark}, ${T.moss})`,
                            boxShadow: T.shadowLg,
                        }}
                    >
                        <div className="ct-aurora" />
                        <div className="ct-hero-wave" />
                        <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
                            <StreakRing value={streak} color="#EAF6E9" track="rgba(255,255,255,0.22)" />
                            <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                                <div style={{ fontFamily: DISPLAY, fontSize: 21, color: "#FBFDF8", lineHeight: 1.35 }}>
                                    {t("streakBanner", streak)}
                                </div>
                                <button
                                    onClick={() => onNavigate("badges")}
                                    className="ct-ghost"
                                    style={{
                                        marginTop: 14, padding: "8px 16px", borderRadius: 10,
                                        border: "1px solid rgba(255,255,255,0.4)", background: "rgba(255,255,255,0.12)",
                                        color: "#FBFDF8", fontFamily: BODY, fontSize: 12.5, fontWeight: 600, cursor: "pointer",
                                        backdropFilter: "blur(6px)",
                                    }}
                                >
                                    View streak
                                </button>
                            </div>
                            <div style={{ paddingLeft: 22, borderLeft: "1px solid rgba(255,255,255,0.22)" }}>
                                <div style={{ fontFamily: DISPLAY, fontSize: 30, color: "#FBFDF8", lineHeight: 1 }}>#{rank}</div>
                                <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.14em", color: "#FBFDF8", opacity: 0.78, marginTop: 6 }}>COMMUNITY RANK</div>
                                <div style={{ fontFamily: BODY, fontSize: 12, color: "#FBFDF8", opacity: 0.9, marginTop: 10 }}>Top 5% this week</div>
                            </div>
                            <div style={{ width: 104, height: 104, margin: "-8px 0" }}>
                                <DotLottieReact src={LOTTIE_ANIMS.heroPlanet} loop autoplay />
                            </div>
                        </div>
                    </div>
                </Reveal>

                {/* stat cards */}
                <div className="ct-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 14 }}>
                    {stats.map((s, i) => (
                        <Reveal key={s.label} delay={140 + i * 70}>
                            <GlassCard tilt pad={16} style={{ height: "100%" }}>
                                <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                                    <IconChip icon={s.icon} color={s.color} bg={s.bg} size={30} />
                                    <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.12em", textTransform: "uppercase", color: T.subtext, lineHeight: 1.3 }}>
                                        {s.label}
                                    </div>
                                </div>
                                <div style={{ marginTop: 12, display: "flex", alignItems: "baseline", gap: 5 }}>
                                    <span style={{ fontFamily: DISPLAY, fontSize: 27, color: T.ink, letterSpacing: "-0.02em" }}>
                                        {/^\d+(\.\d+)?$/.test(s.value)
                                            ? <Counter value={parseFloat(s.value)} decimals={s.value.includes(".") ? 1 : 0} />
                                            : s.value}
                                    </span>
                                    <span style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext }}>{s.unit}</span>
                                </div>
                                <div style={{ marginTop: 8, minHeight: 34, display: "flex", flexDirection: "column", justifyContent: "flex-end" }}>
                                    {typeof s.trend === "number" && (
                                        <div style={{ marginBottom: 6 }}><Trend value={s.trend} /> <span style={{ fontFamily: BODY, fontSize: 11, color: T.subtext }}>vs avg</span></div>
                                    )}
                                    {s.sub && !s.bar && <div style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext, marginBottom: 6 }}>{s.sub}</div>}
                                    {s.spark && <Sparkline points={s.spark} color={s.color} height={30} />}
                                    {s.bar !== undefined && (
                                        <>
                                            {s.sub && <div style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext, marginBottom: 8 }}>{s.sub}</div>}
                                            <ProgressBar pct={s.bar} color={`linear-gradient(90deg, ${s.color}, ${T.moss})`} track={T.railBg} />
                                        </>
                                    )}
                                </div>
                            </GlassCard>
                        </Reveal>
                    ))}
                </div>

                {/* quests */}
                <Reveal delay={430}>
                    <GlassCard>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 6 }}>
                            <div style={{ fontFamily: BODY, fontSize: 15, fontWeight: 700, color: T.ink }}>{t("todaysQuests")}</div>
                            <div style={{ fontFamily: MONO, fontSize: 10.5, color: T.subtext, letterSpacing: "0.1em" }}>
                                {completedCount}/{quests.length} COMPLETE
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column" }}>
                            {quests.map((q, i) => {
                                const Icon = q.done ? CheckCircle2 : Circle;
                                return (
                                    <div
                                        key={q.key}
                                        className="ct-row"
                                        style={{
                                            display: "flex", alignItems: "center", gap: 11,
                                            padding: "11px 8px", borderRadius: 10,
                                            borderTop: i === 0 ? "none" : `1px solid ${T.line}`,
                                            transition: "background 200ms ease",
                                        }}
                                    >
                                        <Icon size={18} color={q.done ? T.moss : T.grey} strokeWidth={2.2} />
                                        <span style={{ flex: 1, fontFamily: BODY, fontSize: 13, color: q.done ? T.subtext : T.ink, textDecoration: q.done ? "line-through" : "none" }}>
                                            {q.label}
                                        </span>
                                        <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", color: q.done ? T.moss : T.subtext, textTransform: "uppercase" }}>
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
                    </GlassCard>
                </Reveal>

                {/* quick actions */}
                <div style={{ marginBottom: "20px" }}>
                    <div className="ct-actions" style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 14 }}>
                        {[
                            { tab: "log", label: "Log an activity", desc: "Add today's commute, meals, or power use.", icon: PlusCircle },
                            { tab: "goals", label: "Set reduction goals", desc: "Compare against community benchmarks & set targets.", icon: Target },
                            { tab: "badges", label: "View your badges", desc: "Unlock gamified milestone accomplishments.", icon: Award },
                        ].map((item, i) => (
                            <Reveal key={item.tab} delay={500 + i * 70}>
                                <GlassCard
                                    tilt
                                    pad={18}
                                    style={{ height: "100%", cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 14 }}
                                >
                                    <div onClick={() => onNavigate(item.tab)}>
                                        <div style={{ fontFamily: BODY, fontSize: 14.5, fontWeight: 700, color: T.ink }}>{item.label}</div>
                                        <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, marginTop: 4, lineHeight: 1.5 }}>{item.desc}</div>
                                    </div>
                                    <button
                                        onClick={() => onNavigate(item.tab)}
                                        aria-label={item.label}
                                        className="ct-round"
                                        style={{
                                            width: 34, height: 34, borderRadius: "50%", border: "none", cursor: "pointer",
                                            background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`,
                                            display: "grid", placeItems: "center",
                                            boxShadow: `0 10px 20px -12px ${T.moss}`,
                                        }}
                                    >
                                        <ArrowRight size={16} color="#F5FBF6" />
                                    </button>
                                </GlassCard>
                            </Reveal>
                        ))}
                    </div>
                </div>

                {/* tip banner — standalone card, no absolute positioning or negative margins */}
                <Reveal delay={720}>
                    <div
                        style={{
                            width: "100%",
                            display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap",
                            marginTop: "16px",
                            padding: "16px 20px",
                            borderRadius: "16px",
                            background: "rgba(30, 74, 44, 0.06)",
                            border: "1px solid rgba(30, 74, 44, 0.12)",
                        }}
                    >
                        <IconChip icon={Leaf} color={T.moss} bg={`${T.moss}22`} size={34} />
                        <div style={{ flex: "1 1 260px", minWidth: 0 }}>
                            <div style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 700, color: T.ink }}>Small step, big impact 💚</div>
                            <div style={{ fontFamily: BODY, fontSize: 12.5, color: T.subtext, marginTop: 2 }}>
                                Switching off lights for one hour can save up to 0.2 kg CO₂e.
                            </div>
                        </div>
                        <button
                            onClick={() => onNavigate("insights")}
                            className="ct-cta"
                            style={{
                                padding: "9px 16px", borderRadius: 10, border: "none", cursor: "pointer",
                                background: `linear-gradient(140deg, ${T.moss}, ${T.mossDark})`, color: "#F5FBF6",
                                fontFamily: BODY, fontSize: 12.5, fontWeight: 650,
                            }}
                        >
                            Explore tips
                        </button>
                    </div>
                </Reveal>
            </div>

            {/* ---------------- right rail ---------------- */}
            <div style={{ display: "flex", flexDirection: "column", gap: 18, minWidth: 0 }}>
                <Reveal delay={200}>
                    <GlassCard tilt pad={18}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
                            <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 700, color: T.ink }}>Carbon Footprint Overview</div>
                            <div style={{ fontFamily: MONO, fontSize: 9.5, letterSpacing: "0.1em", color: T.subtext, border: `1px solid ${T.line}`, borderRadius: 999, padding: "4px 9px" }}>THIS WEEK</div>
                        </div>
                        <div style={{ marginTop: 14, display: "flex", alignItems: "baseline", gap: 6 }}>
                            <span style={{ fontFamily: DISPLAY, fontSize: 32, color: T.ink, letterSpacing: "-0.02em" }}>
                                <Counter value={weekTotal} decimals={1} />
                            </span>
                            <span style={{ fontFamily: BODY, fontSize: 12.5, color: T.subtext }}>kg CO₂e</span>
                        </div>
                        <div style={{ marginTop: 4 }}><Trend value={-18} /> <span style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext }}>vs last week</span></div>
                        <div style={{ height: 132, marginTop: 12, marginLeft: -8 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={weekData} margin={{ top: 6, right: 6, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="ctArea" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="0%" stopColor={T.moss} stopOpacity={0.34} />
                                            <stop offset="100%" stopColor={T.moss} stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke={T.line} vertical={false} />
                                    <XAxis dataKey="day" tick={{ fill: T.subtext, fontSize: 10, fontFamily: BODY }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fill: T.subtext, fontSize: 10, fontFamily: BODY }} axisLine={false} tickLine={false} width={26} />
                                    <Tooltip
                                        contentStyle={{ background: T.card, border: `1px solid ${T.line}`, borderRadius: 10, fontFamily: BODY, fontSize: 12 }}
                                        labelStyle={{ color: T.subtext }}
                                    />
                                    <Area type="monotone" dataKey="kg" stroke={T.moss} strokeWidth={2.2} fill="url(#ctArea)" dot={{ r: 2.5, fill: T.moss, strokeWidth: 0 }} animationDuration={1200} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </Reveal>

                <Reveal delay={280}>
                    <GlassCard tilt pad={18}>
                        <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 700, color: T.ink }}>Footprint by Category</div>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
                            <div style={{ width: 116, height: 116, flexShrink: 0 }}>
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={byCategory} dataKey="value" innerRadius={34} outerRadius={54} paddingAngle={2} stroke="none" animationDuration={1100}>
                                            {byCategory.map((d) => <Cell key={d.name} fill={CATCOLOR[d.name]} />)}
                                        </Pie>
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: 7 }}>
                                {byCategory.map((d) => (
                                    <div key={d.name} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                        <span style={{ width: 8, height: 8, borderRadius: "50%", background: CATCOLOR[d.name], flexShrink: 0 }} />
                                        <span style={{ flex: 1, fontFamily: BODY, fontSize: 12, color: T.charcoal }}>{d.name}</span>
                                        <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.ink }}>{d.pct}%</span>
                                    </div>
                                ))}
                                {byCategory.length === 0 && (
                                    <span style={{ fontFamily: BODY, fontSize: 12, color: T.subtext }}>No entries logged today yet.</span>
                                )}
                            </div>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 14, paddingTop: 12, borderTop: `1px solid ${T.line}` }}>
                            <span style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 600, color: T.ink }}>Total</span>
                            <span style={{ fontFamily: MONO, fontSize: 12.5, color: T.ink }}>{fmt1(todayTotal)} kg CO₂e</span>
                        </div>
                    </GlassCard>
                </Reveal>

                <Reveal delay={360}>
                    <GlassCard tilt pad={18}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <div style={{ fontFamily: BODY, fontSize: 14, fontWeight: 700, color: T.ink }}>Recent Activities</div>
                            <button
                                onClick={() => onNavigate("log")}
                                style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: BODY, fontSize: 11.5, color: T.moss, fontWeight: 600 }}
                            >
                                View all
                            </button>
                        </div>
                        <div style={{ marginTop: 8, display: "flex", flexDirection: "column" }}>
                            {recent.map((a, i) => {
                                const Icon = CATEGORY_ICON[a.category] || Leaf;
                                return (
                                    <div key={a.id || i} className="ct-row" style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 4px", borderTop: i === 0 ? "none" : `1px solid ${T.line}`, borderRadius: 8 }}>
                                        <IconChip icon={Icon} color={CATCOLOR[a.category]} bg={`${CATCOLOR[a.category]}22`} size={28} />
                                        <span style={{ flex: 1, minWidth: 0, fontFamily: BODY, fontSize: 12.5, color: T.ink, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                            {a.activityType || a.category}
                                        </span>
                                        <span style={{ fontFamily: MONO, fontSize: 11.5, color: T.charcoal }}>{fmt1(a.co2e)} kg</span>
                                    </div>
                                );
                            })}
                            {recent.length === 0 && (
                                <span style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, padding: "8px 0" }}>Nothing logged yet today.</span>
                            )}
                        </div>
                    </GlassCard>
                </Reveal>
            </div>
        </div>
    );
}

function ActivityLogger({ onLog, editingEntry, onUpdate, onCancelEdit }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const [category, setCategory] = useState("Transport");
    const [activityType, setActivityType] = useState(Object.keys(EMISSION_FACTORS.Transport)[0]);
    const [quantity, setQuantity] = useState("");
    const [logDate, setLogDate] = useState(TODAY_STR);
    const [carouselStart, setCarouselStart] = useState(0);

    useEffect(() => {
        if (editingEntry) {
            setCategory(editingEntry.category);
            setActivityType(editingEntry.activityType);
            setQuantity(String(editingEntry.quantity));
            setLogDate(editingEntry.date);
        }
    }, [editingEntry]);

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
        if (editingEntry) {
            onUpdate({ ...editingEntry, category, activityType, quantity: qtyNum, unit: factorInfo.unit, co2e: preview, date: logDate });
        } else {
            onLog({ id: Date.now(), category, activityType, quantity: qtyNum, unit: factorInfo.unit, co2e: preview, date: logDate });
        }
        setQuantity("");
    };

    const visible = QUICK_LOG.slice(carouselStart, carouselStart + 3);

    return (
        <GlassCard>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <SectionLabel>{editingEntry ? "Edit activity" : "Log an activity"}</SectionLabel>
                {editingEntry && (
                    <button
                        onClick={onCancelEdit}
                        style={{ border: "none", background: "transparent", cursor: "pointer", fontFamily: BODY, fontSize: 11.5, color: T.subtext, fontWeight: 600 }}
                    >
                        Cancel edit
                    </button>
                )}
            </div>

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
                <div style={{ flex: "0 0 120px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, display: "block", marginBottom: 6 }}>Quantity ({factorInfo.unit})</label>
                    <input
                        type="number" min="0" step="0.1" value={quantity}
                        onChange={(e) => setQuantity(e.target.value)} placeholder="0"
                        style={{ width: "100%", padding: "9px 10px", fontFamily: MONO, fontSize: 14, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6, boxSizing: "border-box" }}
                    />
                </div>
                <div style={{ flex: "0 0 150px" }}>
                    <label style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, display: "flex", alignItems: "center", gap: 4, marginBottom: 6 }}>
                        <Calendar size={11} /> Date
                    </label>
                    <input
                        type="date" value={logDate} max={TODAY_STR}
                        onChange={(e) => setLogDate(e.target.value)}
                        style={{ width: "100%", padding: "9px 10px", fontFamily: MONO, fontSize: 13, color: T.ink, background: T.paper, border: `1px solid ${T.line}`, borderRadius: 6, boxSizing: "border-box" }}
                    />
                </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 14px", background: T.paper, borderRadius: 8, marginBottom: 18 }}>
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
                {editingEntry ? (
                    <Pencil size={14} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />
                ) : (
                    <Plus size={14} style={{ display: "inline", verticalAlign: -2, marginRight: 6 }} />
                )}
                {editingEntry ? "Update activity" : "Log activity"}
            </button>

            <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
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
        </GlassCard>
    );
}

function RecentLogsList({ activities, onEdit, onDelete }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const sorted = [...activities].sort((a, b) => (b.id || 0) - (a.id || 0)).slice(0, 8);

    return (
        <div>
            <div style={{ marginBottom: 16 }}>
                <div style={{ fontFamily: DISPLAY, fontSize: "22px", fontWeight: 600, color: T.ink }}>Your recent logs</div>
                <div style={{ fontFamily: BODY, fontSize: 13, color: T.subtext, marginTop: 4 }}>
                    Review, edit or remove any entry you have logged.
                </div>
            </div>

            {sorted.length === 0 ? (
                <div style={{ padding: "24px 18px", textAlign: "center", fontFamily: BODY, fontSize: 13, color: T.subtext, background: T.mist, borderRadius: 14, border: `1px solid ${T.line}` }}>
                    No activities logged yet today.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {sorted.map((a) => {
                        const Icon = CATEGORY_ICON[a.category] || Leaf;
                        return (
                            <div
                                key={a.id}
                                style={{
                                    display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap",
                                    padding: "14px 16px", borderRadius: "14px",
                                    background: "#FFFEF9", border: "1px solid rgba(0,0,0,0.06)",
                                }}
                            >
                                <IconChip icon={Icon} color={CATCOLOR[a.category]} bg={`${CATCOLOR[a.category]}22`} size={36} />
                                <div style={{ flex: "1 1 200px", minWidth: 0 }}>
                                    <div style={{ fontFamily: BODY, fontSize: 13.5, fontWeight: 700, color: T.ink }}>{a.activityType}</div>
                                    <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, marginTop: 2 }}>
                                        {a.quantity} {a.unit} · {a.date}
                                    </div>
                                </div>
                                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                    <span style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: T.ink }}>{fmt1(a.co2e)} kg</span>
                                    <button
                                        onClick={() => onEdit(a)}
                                        aria-label={`Edit ${a.activityType}`}
                                        style={{
                                            width: 30, height: 30, display: "grid", placeItems: "center",
                                            borderRadius: 8, border: `1px solid ${T.line}`, background: T.paper, cursor: "pointer",
                                        }}
                                    >
                                        <Pencil size={13} color={T.subtext} />
                                    </button>
                                    <button
                                        onClick={() => onDelete(a.id)}
                                        aria-label={`Delete ${a.activityType}`}
                                        style={{
                                            width: 30, height: 30, display: "grid", placeItems: "center",
                                            borderRadius: 8, border: `1px solid ${T.line}`, background: T.paper, cursor: "pointer",
                                        }}
                                    >
                                        <Trash2 size={13} color={T.clay} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
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

function FootprintSummary({ entries }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const [granularity, setGranularity] = useState("week");
    const countMap = { day: 14, week: 8, month: 6 };
    const buckets = useMemo(() => aggregate(entries, granularity, countMap[granularity]), [entries, granularity]);
    const rangeTotal = buckets.reduce((s, b) => s + b.total, 0);
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

function GoalsView({ goal, onSetGoal, onClearGoal, entries }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);

    const [targetPct, setTargetPct] = useState(15);
    const [periodWeeks, setPeriodWeeks] = useState(8);

    const weeklyBuckets = useMemo(
        () => aggregate(entries, "week", (goal ? goal.periodWeeks : periodWeeks) + 1),
        [entries, goal, periodWeeks]
    );

    const currentWeekTotal = weeklyBuckets[weeklyBuckets.length - 1]?.total || 0;
    const currentWeekBucket = weeklyBuckets[weeklyBuckets.length - 1] || {};

    const progress = useMemo(() => {
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

        // Daily reduction required: the gap between this week's total and the
        // target weekly figure, spread evenly across the days left in the period.
        const gapToClose = Math.max(0, currentWeekTotal - targetWeekly);
        const dailyReductionRequired = daysRemaining > 0 ? gapToClose / daysRemaining : gapToClose;

        return {
            requiredPct,
            actualPct,
            onTrack,
            achieved,
            daysRemaining,
            targetWeekly,
            baselineWeekly: goal.baselineWeekly,
            gapToClose,
            dailyReductionRequired,
        };
    }, [goal, currentWeekTotal]);

    // Timeline projection: extrapolate the recent week-over-week trend forward
    // to the end of the goal period, so the user can see where they're headed.
    const projectionChartData = useMemo(() => {
        if (!goal) return [];
        const lookback = weeklyBuckets.slice(-4);
        let slope = 0;
        if (lookback.length >= 2) {
            slope = (lookback[lookback.length - 1].total - lookback[0].total) / (lookback.length - 1);
        }
        const remainingWeeks = Math.max(0, Math.ceil(progress.daysRemaining / 7));

        const history = weeklyBuckets.map((b, i) => ({
            label: b.label,
            total: b.total,
            projected: i === weeklyBuckets.length - 1 ? b.total : null,
        }));

        const future = [];
        for (let i = 1; i <= remainingWeeks; i++) {
            const value = Math.max(0, currentWeekTotal + slope * i);
            future.push({ label: `+${i}wk`, total: null, projected: +value.toFixed(2) });
        }

        return [...history, ...future];
    }, [goal, weeklyBuckets, currentWeekTotal, progress]);

    const handleStartGoal = () => {
        const priorWeeks = weeklyBuckets.slice(0, -1);
        const baselineWeekly = priorWeeks.length
            ? priorWeeks.reduce((s, b) => s + b.total, 0) / priorWeeks.length
            : currentWeekTotal || 35.0;

        onSetGoal({
            targetPct: Number(targetPct),
            periodWeeks: Number(periodWeeks),
            startDate: TODAY_STR,
            baselineWeekly: +baselineWeekly.toFixed(2),
        });
    };

    const activeTargetWeekly = goal ? progress.targetWeekly : TOTAL_COMMUNITY_WEEKLY_AVG * (1 - targetPct / 100);
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

                    {!progress.achieved && (
                        <Card style={{ background: progress.onTrack ? `${T.moss}12` : `${T.danger}12`, border: `1px solid ${progress.onTrack ? T.moss : T.danger}40` }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                                <AlertCircle size={18} color={progress.onTrack ? T.moss : T.danger} />
                                <div>
                                    <div style={{ fontFamily: BODY, fontSize: 13, fontWeight: 700, color: T.ink }}>
                                        {progress.dailyReductionRequired > 0
                                            ? `Cut about ${fmt1(progress.dailyReductionRequired)} kg CO₂e/day to stay on track`
                                            : "You're already pacing at or below your target — keep it up"}
                                    </div>
                                    <div style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, marginTop: 2 }}>
                                        Spread evenly across your remaining {progress.daysRemaining} days to close the {fmt1(progress.gapToClose)} kg gap to target.
                                    </div>
                                </div>
                            </div>
                        </Card>
                    )}

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

                        <div style={{ fontFamily: BODY, fontSize: 11, color: T.subtext, marginBottom: 4 }}>
                            Solid line: actual weekly total · Dashed line: projected, based on your recent trend
                        </div>
                        <div style={{ height: 220, marginTop: 8 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={projectionChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid stroke={T.line} vertical={false} />
                                    <XAxis dataKey="label" tick={{ fontFamily: BODY, fontSize: 10, fill: T.subtext }} axisLine={{ stroke: T.line }} tickLine={false} />
                                    <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 6, background: T.card }} formatter={(v, name) => [v == null ? "—" : `${fmt1(v)} kg`, name === "total" ? "Actual" : "Projected"]} />
                                    <ReferenceLine y={progress.targetWeekly} stroke={T.moss} strokeDasharray="4 3" label={{ value: `Target (${fmt1(progress.targetWeekly)}kg)`, fontSize: 10, fill: T.moss, position: "top" }} />
                                    <ReferenceLine y={TOTAL_COMMUNITY_WEEKLY_AVG} stroke={T.clay} strokeDasharray="3 3" label={{ value: `Peer Avg (${fmt1(TOTAL_COMMUNITY_WEEKLY_AVG)}kg)`, fontSize: 10, fill: T.clay, position: "bottom" }} />
                                    <Line type="monotone" dataKey="total" stroke={T.sky} strokeWidth={2.5} dot={{ r: 4, fill: T.sky }} connectNulls={false} />
                                    <Line type="monotone" dataKey="projected" stroke={T.olive} strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3, fill: T.olive }} connectNulls={true} />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16 }}>
                            <button
                                onClick={onClearGoal}
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
            <GlassCard>
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
            </GlassCard>

            <GlassCard>
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
            </GlassCard>
        </div>
    );
}

function BadgesView({ earnedIds, reduction, activeStreak }) {
    const T = useTheme();
    const total = BADGES.length;
    const unlockedCount = earnedIds.length;
    const pct = total > 0 ? Math.round((unlockedCount / total) * 100) : 0;

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <Reveal>
                <GlassCard pad={24}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
                        <div>
                            <span
                                style={{
                                    display: "inline-block", fontFamily: MONO, fontSize: 10.5, fontWeight: 700,
                                    letterSpacing: "0.12em", textTransform: "uppercase", color: "#1E4A2C",
                                    background: "rgba(30,74,44,0.1)", borderRadius: 999, padding: "4px 12px", marginBottom: 10,
                                }}
                            >
                                Recognition
                            </span>
                            <h1 style={{ fontFamily: DISPLAY, fontSize: 26, letterSpacing: "-0.02em", color: T.ink, margin: 0 }}>Milestone Badges</h1>
                            <p style={{ fontFamily: BODY, fontSize: 13, color: T.subtext, margin: "6px 0 0 0" }}>Earn badges as your footprint shrinks.</p>
                        </div>
                        <div style={{ textAlign: "right" }}>
                            <div style={{ fontFamily: DISPLAY, fontSize: 22, color: T.ink }}>{unlockedCount}/{total}</div>
                            <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: T.subtext, marginTop: 2 }}>Unlocked</div>
                        </div>
                    </div>

                    <div style={{ marginTop: 18, height: 8, borderRadius: 999, background: T.line, overflow: "hidden" }}>
                        <div
                            style={{
                                height: "100%", width: `${pct}%`, borderRadius: 999,
                                background: `linear-gradient(90deg, ${T.moss}, ${T.mossDark})`,
                                transition: "width 900ms cubic-bezier(.22,1,.36,1)",
                            }}
                        />
                    </div>
                </GlassCard>
            </Reveal>

            <div className="ct-badges-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
                {BADGES.map((b, i) => {
                    const isEarned = earnedIds.includes(b.id);
                    const Icon = b.icon;
                    const badgeColor = b.color(T);

                    return (
                        <Reveal key={b.id} delay={i * 45}>
                            <div
                                style={{
                                    display: "flex", flexDirection: "column", height: "100%",
                                    padding: 18, borderRadius: "16px",
                                    background: isEarned ? T.card : T.paper,
                                    border: `1px solid ${isEarned ? `${badgeColor}55` : T.line}`,
                                    opacity: isEarned ? 1 : 0.65,
                                    transition: "transform 0.25s ease, box-shadow 0.25s ease",
                                }}
                                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-3px)"; e.currentTarget.style.boxShadow = T.shadow; }}
                                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}
                            >
                                <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                                    <div
                                        style={{
                                            width: 46, height: 46, borderRadius: 14,
                                            background: isEarned ? `${badgeColor}22` : T.line,
                                            display: "flex", alignItems: "center", justifyContent: "center",
                                            animation: isEarned ? "ctBadgeGlow 3200ms ease-in-out infinite" : "none",
                                        }}
                                    >
                                        {isEarned
                                            ? <Icon size={22} color={badgeColor} />
                                            : <Icon size={20} color={T.grey} style={{ filter: "grayscale(1)" }} />}
                                    </div>
                                    <span
                                        style={{
                                            display: "inline-flex", alignItems: "center", gap: 4,
                                            fontFamily: MONO, fontSize: 9, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                                            padding: "3px 8px", borderRadius: 999,
                                            color: isEarned ? badgeColor : T.subtext,
                                            background: isEarned ? `${badgeColor}1A` : T.line,
                                            border: `1px solid ${isEarned ? `${badgeColor}40` : "transparent"}`,
                                        }}
                                    >
                                        {isEarned ? b.tag : (<><Lock size={9} /> Locked</>)}
                                    </span>
                                </div>

                                <div style={{ marginTop: 14, fontFamily: BODY, fontSize: 14.5, fontWeight: 700, color: T.ink }}>{b.name}</div>
                                <p style={{ fontFamily: BODY, fontSize: 12, color: T.subtext, margin: "5px 0 0 0", lineHeight: 1.45, flex: 1 }}>{b.desc}</p>

                                <div style={{ marginTop: 14, paddingTop: 10, borderTop: `1px dashed ${T.line}` }}>
                                    <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: "0.04em", textTransform: "uppercase", color: isEarned ? badgeColor : T.grey }}>
                                        {b.requirement}
                                    </span>
                                </div>
                            </div>
                        </Reveal>
                    );
                })}
            </div>
        </div>
    );
}

function Leaderboard({ youWeekly, earnedIds, onSelectMember, anonymous = false }) {
    const T = useTheme();
    const [scope, setScope] = useState("Friends");
    const [hoveredIdx, setHoveredIdx] = useState(null);

    const ranked = useMemo(() => {
        const withYou = LEADERBOARD.map((p) => (p.name === "You" ? { ...p, weekly: youWeekly } : p));
        return [...withYou].sort((a, b) => a.weekly - b.weekly);
    }, [youWeekly]);

    const alias = (name, i) => (name === "You" ? "You" : anonymous ? `Member ${String.fromCharCode(65 + i)}` : name);

    return (
        <GlassCard>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14, gap: 12, flexWrap: "wrap" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Trophy size={16} color={T.olive} />
                    <SectionLabel style={{ marginBottom: 0 }}>Community Leaderboard · Lowest Weekly CO₂e</SectionLabel>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 4 }}>
                        {["Friends", "Global"].map((s) => (
                            <button key={s} onClick={() => setScope(s)}
                                    style={{ fontFamily: BODY, fontSize: 12, fontWeight: 600, padding: "5px 12px", borderRadius: 999, border: `1px solid ${scope === s ? T.moss : T.line}`, background: scope === s ? `linear-gradient(140deg, ${T.moss}, ${T.mossDark})` : "transparent", color: scope === s ? "#F5FBF6" : T.subtext, cursor: "pointer", transition: "all 200ms cubic-bezier(.22,1,.36,1)" }}>
                                {s}
                            </button>
                        ))}
                    </div>
                    <ExportButton
                        label="Export standings"
                        onClick={() =>
                            downloadCSV(
                                "carbontrack-leaderboard.csv",
                                ["Rank", "Member", "Weekly CO2e (kg)"],
                                ranked.map((p, i) => [i + 1, alias(p.name, i), p.weekly.toFixed(1)])
                            )
                        }
                    />
                </div>

            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: BODY, fontSize: 11, color: T.subtext, marginBottom: 12, padding: "8px 12px", borderRadius: 10, background: T.mist, border: `1px solid ${T.line}` }}>
                <Shield size={12} color={T.moss} />
                {anonymous
                    ? "Anonymous mode on — peers are shown as aliases and your name is hidden from them."
                    : "Rankings are aggregate-only. Click any member to view their public badge portfolio."}
            </div>


            <div style={{ display: "flex", flexDirection: "column" }}>
                {ranked.map((p, i) => {
                    const isYou = p.name === "You";
                    const teamInfo = TEAM_MEMBERS.find((m) => m.name === p.name);
                    const badges = isYou ? earnedIds : (MOCK_MEMBER_BADGES[p.name] || []);
                    const label = alias(p.name, i);
                    const medal = ["#D9A441", "#B9BDC1", "#C08457"][i] || null;

                    return (
                        <Reveal key={p.name} delay={i * 55}>
                            <div
                                onMouseEnter={() => setHoveredIdx(i)}
                                onMouseLeave={() => setHoveredIdx(null)}
                                onClick={() => onSelectMember({
                                    name: label,
                                    weekly: isYou ? youWeekly : p.weekly,
                                    dept: anonymous && !isYou ? null : (teamInfo ? teamInfo.dept : null),
                                    badges: badges
                                })}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 12,
                                    padding: "11px 13px",
                                    borderRadius: 12,
                                    background: isYou ? T.mist : (hoveredIdx === i ? T.paperRaised : "transparent"),
                                    border: `1px solid ${isYou ? T.moss : "transparent"}`,
                                    cursor: "pointer",
                                    transform: hoveredIdx === i ? "translateX(6px)" : "none",
                                    transition: "all 0.24s cubic-bezier(.22,1,.36,1)",
                                }}
                            >
                                <span style={{ fontFamily: MONO, fontSize: 12, color: medal || T.subtext, fontWeight: medal ? 700 : 400, width: 22 }}>#{i + 1}</span>
                                <div style={{ width: 30, height: 30, borderRadius: "50%", background: isYou ? `linear-gradient(140deg, ${T.moss}, ${T.mossDark})` : T.lichen, color: "#F5FBF6", display: "grid", placeItems: "center", fontFamily: BODY, fontSize: 11, fontWeight: 700 }}>
                                    {label.split(" ").map((w) => w[0]).join("").slice(0, 2)}
                                </div>
                                <span style={{ fontFamily: BODY, fontSize: 13, fontWeight: isYou ? 700 : 500, color: T.ink, flex: 1, display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                                {label}
                                    {badges.map((id) => {
                                        const b = BADGES.find((x) => x.id === id);
                                        if (!b) return null;
                                        const Icon = b.icon;
                                        return (
                                            <span key={id} title={b.name} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 18, height: 18, borderRadius: "50%", background: b.color(T), color: "#F5FBF6" }}>
                                            <Icon size={10} />
                                        </span>
                                        );
                                    })}
                            </span>
                                <span style={{ width: 92 }}>
                                <ProgressBar pct={Math.max(6, 100 - ((isYou ? youWeekly : p.weekly) / 45) * 100)} color={isYou ? T.moss : T.lichen} track={T.railBg} />
                            </span>
                                <span style={{ fontFamily: MONO, fontSize: 13, color: T.ink, width: 74, textAlign: "right" }}>{fmt1(isYou ? youWeekly : p.weekly)} kg</span>
                            </div>
                        </Reveal>
                    );
                })}

            </div>
        </GlassCard>
    );
}

function OrgReportView({ orgId, youWeekly, filters = DEFAULT_FILTERS, onFilters }) {
    const T = useTheme();
    const CATCOLOR = CATEGORY_COLOR(T);
    const org = ORGS.find((o) => o.id === orgId) || ORGS[0];
    const members = useMemo(() => membersForOrg(orgId), [orgId]);
    const logs = useMemo(() => logsForOrg(orgId), [orgId]);
    const visibleLogs = useMemo(() => filterLogs(logs, filters), [logs, filters]);
    const [statusFilter, setStatusFilter] = useState("All");


    const teamTotal = members.reduce((s, m) => s + m.weekly, 0);
    const teamAvg = members.length ? teamTotal / members.length : 0;
    const dailyAvgOrg = teamAvg / 7;
    const goalsAchieved = members.filter((m) => m.weekly <= m.targetWeekly).length;
    const co2Saved = members.reduce((s, m) => s + Math.max(0, m.targetWeekly - m.weekly), 0) + Math.max(0, 30 - youWeekly / 1);

    const catData = useMemo(() => {
        const src = ORG_CATEGORY_AVG[orgId] || ORG_CATEGORY_AVG[DEFAULT_ORG_ID];
        return CATEGORIES.map((c) => ({ cat: c, avg: src[c], benchmark: PLATFORM_CATEGORY_AVG[c] }));
    }, [orgId]);

    const statusOf = (m) => {
        if (m.weekly <= m.targetWeekly) return "On track";
        if (m.goalPct >= 50) return "In progress";
        return "Missed";
    };
    const statusColor = (s) => (s === "On track" ? T.moss : s === "In progress" ? T.olive : T.danger);
    const filtered = statusFilter === "All" ? members : members.filter((m) => statusOf(m) === statusFilter);

    const headline = [
        { label: "Active users", value: members.length, dec: 0, suffix: "", icon: Users, color: T.sky, hint: `${org.plan} workspace` },
        { label: "Avg daily CO₂e", value: dailyAvgOrg, dec: 1, suffix: "kg", icon: Leaf, color: T.moss, hint: "per member / day" },
        { label: "Goals achieved", value: goalsAchieved, dec: 0, suffix: `/ ${members.length}`, icon: Target, color: T.olive, hint: "weekly targets met" },
        { label: "CO₂e saved", value: co2Saved, dec: 1, suffix: "kg", icon: TrendingDown, color: T.clay, hint: "vs. target baseline" },
    ];

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {onFilters && <FilterBar filters={filters} onChange={onFilters} />}
            <Reveal>

                <div className="ct-stats" style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0,1fr))", gap: 16 }}>
                    {headline.map((s, i) => {
                        const Icon = s.icon;
                        return (
                            <Reveal key={s.label} delay={i * 70}>
                                <GlassCard tilt style={{ position: "relative", overflow: "hidden" }}>
                                    <div style={{ position: "absolute", inset: 0, background: `radial-gradient(120% 90% at 100% 0%, ${s.color}22, transparent 60%)`, pointerEvents: "none" }} />
                                    <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 12 }}>
                                        <span style={{ fontFamily: MONO, fontSize: 10.5, letterSpacing: "0.09em", textTransform: "uppercase", color: T.subtext }}>{s.label}</span>
                                        <IconChip icon={Icon} color={s.color} bg={`${s.color}1f`} size={30} />
                                    </div>
                                    <div style={{ position: "relative", fontFamily: DISPLAY, fontSize: 30, color: T.ink, letterSpacing: "-0.02em" }}>
                                        <Counter value={s.value} decimals={s.dec} />
                                        <span style={{ fontFamily: BODY, fontSize: 13, color: T.subtext, marginLeft: 6 }}>{s.suffix}</span>
                                    </div>
                                    <div style={{ position: "relative", fontFamily: BODY, fontSize: 11.5, color: T.subtext, marginTop: 4 }}>{s.hint}</div>
                                </GlassCard>
                            </Reveal>
                        );
                    })}
                </div>
            </Reveal>

            <div className="ct-grid" style={{ display: "grid", gridTemplateColumns: "1.35fr 1fr", gap: 20, alignItems: "start" }}>
                <Reveal delay={120}>
                    <GlassCard>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 14 }}>
                            <SectionLabel style={{ marginBottom: 0 }}>Average emissions by category</SectionLabel>
                            <span style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext }}>{org.name} vs platform benchmark</span>
                        </div>
                        <div style={{ height: 260 }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={catData} margin={{ top: 8, right: 8, left: -18, bottom: 0 }} barGap={4}>
                                    <CartesianGrid stroke={T.line} vertical={false} />
                                    <XAxis dataKey="cat" tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={{ stroke: T.line }} tickLine={false} />
                                    <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: "rgba(127,150,132,0.08)" }} contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 10, background: T.card }} formatter={(v, n) => [`${fmt1(v)} kg`, n === "avg" ? "Org avg" : "Benchmark"]} />
                                    <Legend wrapperStyle={{ fontFamily: BODY, fontSize: 11, color: T.subtext }} formatter={(v) => (v === "avg" ? "Org average" : "Platform benchmark")} />
                                    <Bar dataKey="avg" radius={[6, 6, 0, 0]} animationDuration={900}>
                                        {catData.map((d) => <Cell key={d.cat} fill={CATCOLOR[d.cat]} />)}
                                    </Bar>
                                    <Bar dataKey="benchmark" radius={[6, 6, 0, 0]} fill={T.line} animationDuration={1100} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </GlassCard>
                </Reveal>

                <Reveal delay={180}>
                    <GlassCard>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 8, flexWrap: "wrap" }}>
                            <SectionLabel style={{ marginBottom: 0 }}>Goal progress</SectionLabel>
                            <div style={{ display: "flex", gap: 4 }}>
                                {["All", "On track", "In progress", "Missed"].map((s) => (
                                    <button key={s} onClick={() => setStatusFilter(s)}
                                            style={{ fontFamily: BODY, fontSize: 10.5, fontWeight: 600, padding: "4px 9px", borderRadius: 999, cursor: "pointer",
                                                border: `1px solid ${statusFilter === s ? T.moss : T.line}`,
                                                background: statusFilter === s ? `${T.moss}22` : "transparent",
                                                color: statusFilter === s ? T.moss : T.subtext }}>
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                            {filtered.map((m, i) => {
                                const st = statusOf(m);
                                const c = statusColor(st);
                                return (
                                    <Reveal key={m.id} delay={200 + i * 60}>
                                        <div>
                                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
                                                <div style={{ width: 26, height: 26, borderRadius: "50%", background: `${c}22`, color: c, display: "grid", placeItems: "center", fontFamily: BODY, fontSize: 10.5, fontWeight: 700 }}>
                                                    {m.name.split(" ").map((w) => w[0]).join("")}
                                                </div>
                                                <div style={{ flex: 1, minWidth: 0 }}>
                                                    <div style={{ fontFamily: BODY, fontSize: 12.5, fontWeight: 600, color: T.ink }}>{m.name}</div>
                                                    <div style={{ fontFamily: BODY, fontSize: 10.5, color: T.subtext }}>{m.dept} · {m.lastActive}</div>
                                                </div>
                                                <span style={{ fontFamily: BODY, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 999, background: `${c}1f`, color: c }}>{st}</span>
                                            </div>
                                            <ProgressBar pct={m.goalPct} color={c} track={T.railBg} />
                                            <div style={{ display: "flex", justifyContent: "space-between", fontFamily: MONO, fontSize: 10.5, color: T.subtext, marginTop: 4 }}>
                                                <span>{fmt1(m.weekly)} kg this week</span>
                                                <span>target {fmt1(m.targetWeekly)} kg</span>
                                            </div>
                                        </div>
                                    </Reveal>
                                );
                            })}
                            {filtered.length === 0 && (
                                <div style={{ fontFamily: BODY, fontSize: 12.5, color: T.subtext }}>No members in this state.</div>
                            )}
                        </div>
                    </GlassCard>
                </Reveal>
            </div>

            <Reveal delay={240}>
                <GlassCard pad={0}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "18px 20px 12px", gap: 12, flexWrap: "wrap" }}>
                        <SectionLabel style={{ marginBottom: 0 }}>Recent activity logs</SectionLabel>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <span style={{ fontFamily: BODY, fontSize: 11.5, color: T.subtext }}>Scoped to {org.name}</span>
                            <ExportButton
                                label="Export logs"
                                onClick={() =>
                                    downloadCSV(
                                        `carbontrack-${org.id}-activity-logs.csv`,
                                        ["User", "Category", "Activity", "Quantity", "Unit", "CO2e (kg)", "When", "Goal aligned"],
                                        visibleLogs.map((l) => [l.user, l.category, l.activityType, l.quantity, l.unit, l.co2e.toFixed(2), l.when, l.onGoal ? "Yes" : "No"])
                                    )
                                }
                            />
                        </div>
                    </div>

                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
                            <thead>
                            <tr>
                                {["User", "Category", "Activity", "Amount", "CO₂e", "When", "Goal"].map((h) => (
                                    <th key={h} style={{ textAlign: h === "CO₂e" || h === "Amount" ? "right" : "left", fontFamily: MONO, fontSize: 10, letterSpacing: "0.08em", textTransform: "uppercase", color: T.subtext, fontWeight: 500, padding: "8px 20px", borderBottom: `1px solid ${T.line}` }}>{h}</th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {visibleLogs.map((l) => {
                                const Icon = CATEGORY_ICON[l.category];
                                return (
                                    <tr key={l.id} className="ct-row" style={{ transition: "background 180ms ease" }}>
                                        <td style={{ padding: "11px 20px", borderBottom: `1px solid ${T.line}`, fontFamily: BODY, fontSize: 12.5, color: T.ink, fontWeight: 500 }}>{l.user}</td>
                                        <td style={{ padding: "11px 20px", borderBottom: `1px solid ${T.line}` }}>
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, fontFamily: BODY, fontSize: 12, color: T.subtext }}>
                                                    <Icon size={13} color={CATCOLOR[l.category]} /> {l.category}
                                                </span>
                                        </td>
                                        <td style={{ padding: "11px 20px", borderBottom: `1px solid ${T.line}`, fontFamily: BODY, fontSize: 12.5, color: T.charcoal }}>{l.activityType}</td>
                                        <td style={{ padding: "11px 20px", borderBottom: `1px solid ${T.line}`, textAlign: "right", fontFamily: MONO, fontSize: 12, color: T.subtext }}>{l.quantity} {l.unit}</td>
                                        <td style={{ padding: "11px 20px", borderBottom: `1px solid ${T.line}`, textAlign: "right", fontFamily: MONO, fontSize: 12.5, color: l.co2e > 5 ? T.clay : T.ink, fontWeight: 600 }}>{fmt1(l.co2e)} kg</td>
                                        <td style={{ padding: "11px 20px", borderBottom: `1px solid ${T.line}`, fontFamily: BODY, fontSize: 11.5, color: T.subtext }}>{l.when}</td>
                                        <td style={{ padding: "11px 20px", borderBottom: `1px solid ${T.line}` }}>
                                                <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: BODY, fontSize: 10.5, fontWeight: 700, padding: "3px 9px", borderRadius: 999, background: l.onGoal ? `${T.moss}1f` : `${T.danger}1f`, color: l.onGoal ? T.moss : T.danger }}>
                                                    {l.onGoal ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                                                    {l.onGoal ? "Aligned" : "Off goal"}
                                                </span>
                                        </td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </table>
                        {visibleLogs.length === 0 && (
                            <EmptyState
                                compact
                                icon={Calendar}
                                title="No activity logs match your filters"
                                body={`Nothing recorded for ${filterLabel(filters)} in ${org.name}. Try a wider range or clear the category filters.`}
                                actionLabel={onFilters ? "Reset filters" : undefined}
                                onAction={() => onFilters && onFilters({ ...DEFAULT_FILTERS })}
                            />
                        )}

                    </div>
                </GlassCard>
            </Reveal>

            <Reveal delay={300}>
                <GlassCard>
                    <SectionLabel>Department averages</SectionLabel>
                    <div style={{ height: 200 }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={DEPARTMENTS} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                <CartesianGrid stroke={T.line} vertical={false} />
                                <XAxis dataKey="dept" tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={{ stroke: T.line }} tickLine={false} />
                                <YAxis tick={{ fontFamily: BODY, fontSize: 11, fill: T.subtext }} axisLine={false} tickLine={false} />
                                <Tooltip cursor={{ fill: "rgba(127,150,132,0.08)" }} contentStyle={{ fontFamily: BODY, fontSize: 12, border: `1px solid ${T.line}`, borderRadius: 10, background: T.card }} formatter={(v) => [`${fmt1(v)} kg`, "avg"]} />
                                <Bar dataKey="avg" radius={[6, 6, 0, 0]}>
                                    {DEPARTMENTS.map((d) => <Cell key={d.dept} fill={d.avg > teamAvg ? T.clay : T.moss} />)}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </GlassCard>
            </Reveal>
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

    /* Analytics filters (date range + categories) shared by Trends / Insights / Team */
    const [filters, setFilters] = useState({ ...DEFAULT_FILTERS });

    /* First-run walkthrough */
    const [tourStep, setTourStep] = useState(0);
    const [tourOpen, setTourOpen] = useState(() => localStorage.getItem("carbontrack_tour_done") !== "1");
    const closeTour = () => {
        localStorage.setItem("carbontrack_tour_done", "1");
        setTourOpen(false);
    };
    const startTour = () => {
        setTourStep(0);
        setTourOpen(true);
    };

    /* Language selector — scoped translation, see STRINGS/LANGUAGES above */
    const [lang, setLang] = useState(() => localStorage.getItem("carbontrack_lang") || "en");
    useEffect(() => {
        localStorage.setItem("carbontrack_lang", lang);
    }, [lang]);
    const t = (key, vars) => {
        const entry = STRINGS[key];
        if (!entry) return key;
        const val = entry[lang] ?? entry.en;
        return typeof val === "function" ? val(vars) : val;
    };



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
    const filteredEntries = useMemo(() => filterEntries(allEntries, filters), [allEntries, filters]);
    const ready = useReady(520, [activeTab]);


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

    /* Recent logs: edit / delete — reuses the same activities state so
       Today's Footprint, streak and quests all recompute automatically
       since they're derived from `activities`. No formulas touched. */
    const [editingEntry, setEditingEntry] = useState(null);
    const startEditActivity = (entry) => setEditingEntry(entry);
    const cancelEditActivity = () => setEditingEntry(null);
    const handleUpdateActivity = (updated) => {
        setActivities((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setEditingEntry(null);
    };
    const handleDeleteActivity = (id) => {
        setActivities((prev) => prev.filter((a) => a.id !== id));
        setEditingEntry((cur) => (cur && cur.id === id ? null : cur));
    };

    const [profileOpen, setProfileOpen] = useState(false);
    const [orgId, setOrgId] = useState(DEFAULT_ORG_ID);
    const [profile, setProfile] = useState({
        name: "Ditya",
        email: "alex.rivera@carbontrack.app",
        anonymous: false,
        digest: true,
        shareWithOrg: true,
        dailyTarget: 8,
    });

    useEffect(() => {
        document.body.style.backgroundColor = T.paper;
        document.body.style.margin = "0";
        document.body.style.padding = "0";
    }, [T.paper]);


    return (
        <ThemeContext.Provider value={T}>
            <LocalizationContext.Provider value={{ lang, setLang, t }}>
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
                @keyframes ctRise {
                    from { opacity: 0; transform: translateY(var(--ct-y, 14px)); filter: blur(6px); }
                    to { opacity: 1; transform: translateY(0); filter: blur(0); }
                }
                @keyframes ctAurora {
                    0%   { transform: translate3d(-6%, -4%, 0) scale(1.05) rotate(0deg); }
                    50%  { transform: translate3d(6%, 5%, 0) scale(1.18) rotate(8deg); }
                    100% { transform: translate3d(-6%, -4%, 0) scale(1.05) rotate(0deg); }
                }
                @keyframes ctDrift {
                    0%   { transform: translateX(0); }
                    100% { transform: translateX(-50%); }
                }
                @keyframes ctDraw {
                    from { stroke-dashoffset: 240; }
                    to   { stroke-dashoffset: 0; }
                }
                .ct-draw { stroke-dasharray: 240; animation: ctDraw 1.4s cubic-bezier(.22,1,.36,1) both; }
                .ct-hero { isolation: isolate; }
                .ct-aurora {
                    position: absolute; inset: -40%;
                    background:
                        radial-gradient(38% 44% at 22% 32%, rgba(190,235,196,0.42), transparent 60%),
                        radial-gradient(34% 40% at 74% 62%, rgba(127,192,207,0.34), transparent 62%),
                        radial-gradient(30% 36% at 52% 18%, rgba(255,231,178,0.26), transparent 60%);
                    filter: blur(16px);
                    animation: ctAurora 18s ease-in-out infinite;
                    pointer-events: none;
                }
                .ct-hero-wave {
                    position: absolute; inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.16) 1px, transparent 1px);
                    background-size: 22px 22px;
                    opacity: 0.35;
                    mask-image: linear-gradient(90deg, transparent, #000 40%, transparent);
                    pointer-events: none;
                }
                .ct-card:hover { box-shadow: 0 22px 48px -26px rgba(20,40,28,0.55); }
                .ct-row:hover { background: rgba(127,150,132,0.09); }
                .ct-tab:hover { color: inherit; transform: translateY(-1px); }
                .ct-cta { position: relative; overflow: hidden; transition: transform 200ms cubic-bezier(.22,1,.36,1), box-shadow 200ms ease; }
                .ct-cta:hover { transform: translateY(-2px); }
                .ct-cta::after {
                    content: ""; position: absolute; inset: 0; transform: translateX(-120%);
                    background: linear-gradient(100deg, transparent, rgba(255,255,255,0.34), transparent);
                }
                .ct-cta:hover::after { transition: transform 750ms ease; transform: translateX(120%); }
                .ct-ghost:hover { background: rgba(255,255,255,0.22) !important; }
                .ct-round { transition: transform 200ms cubic-bezier(.22,1,.36,1); }
                .ct-round:hover { transform: scale(1.09); }
                @keyframes ctSlideRight {
                    from { transform: translateX(38px); opacity: 0; }
                    to   { transform: translateX(0); opacity: 1; }
                }
                .ct-input { outline: none; transition: box-shadow 200ms ease, border-color 200ms ease; }
                @keyframes ctShimmer { 0% { background-position: -420px 0; } 100% { background-position: 420px 0; } }
                .ct-skel {
                    position: relative; overflow: hidden;
                    background-image: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0) 100%);
                    background-repeat: no-repeat; background-size: 420px 100%;
                    animation: ctShimmer 1.25s linear infinite;
                }

                .ct-input:focus { border-color: rgba(90,140,105,0.85) !important; box-shadow: 0 0 0 4px rgba(120,180,135,0.18); }

                @media (max-width: 1180px) {
                    .ct-grid { grid-template-columns: minmax(0,1fr) !important; }
                    .ct-stats { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
                    .ct-badges-grid { grid-template-columns: repeat(2, minmax(0,1fr)) !important; }
                }
                @media (max-width: 760px) {
                    .ct-stats, .ct-actions { grid-template-columns: minmax(0,1fr) !important; }
                    .ct-badges-grid { grid-template-columns: minmax(0,1fr) !important; }
                }
                @keyframes ctBadgeGlow {
                    0%, 100% { box-shadow: 0 0 0 0 rgba(63,107,74,0.0), 0 4px 12px rgba(0,0,0,0.10); }
                    50% { box-shadow: 0 0 0 6px rgba(63,107,74,0.10), 0 4px 12px rgba(0,0,0,0.10); }
                }
                @media (prefers-reduced-motion: reduce) {
                    *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; transition-duration: 0.01ms !important; }
                }
            `}} />

                <div style={{ background: T.paper, minHeight: "100vh", fontFamily: BODY, transition: "background-color 0.25s ease" }}>
                    <TopNav
                        activeTab={activeTab}
                        onTab={goTo}
                        dark={dark}
                        onToggleDark={() => setDark((d) => !d)}
                        profile={profile}
                        orgId={orgId}
                        onOpenProfile={() => setProfileOpen(true)}
                        onStartTour={startTour}
                    />

                    <ProfilePanel
                        open={profileOpen}
                        onClose={() => setProfileOpen(false)}
                        profile={profile}
                        onChange={setProfile}
                        dark={dark}
                        onToggleDark={() => setDark((d) => !d)}
                        orgId={orgId}
                        onOrgChange={setOrgId}
                        earnedIds={earnedBadgeIds}
                        youWeekly={youWeekly}
                    />

                    <Walkthrough
                        open={tourOpen}
                        step={tourStep}
                        onStep={(s) => {
                            setTourStep(s);
                            const t = WALKTHROUGH_STEPS[s];
                            if (t?.tab) goTo(t.tab);
                        }}
                        onClose={closeTour}
                        onDone={() => {
                            closeTour();
                            goTo("dashboard");
                        }}
                    />

                    <div style={{ padding: "26px 26px 60px", paddingBottom: "48px", maxWidth: 1440, margin: "0 auto" }}>
                        {activeTab === "dashboard" && (
                            !ready ? <PanelSkeleton /> : (
                                <DashboardHome
                                    activities={todaysActivities}
                                    todayTotal={todayTotal}
                                    rank={rank}
                                    quests={quests}
                                    onNavigate={goTo}
                                    earnedIds={earnedBadgeIds}
                                />
                            )
                        )}

                        {activeTab === "log" && (
                            <>
                                <PageHeader
                                    eyebrow="Capture"
                                    title="Log activity"
                                    subtitle="Add today's travel, energy, meals and waste. Every entry recalculates your footprint, streak and quests instantly."
                                    actions={
                                        <ExportButton
                                            label="Export activities"
                                            onClick={() =>
                                                downloadCSV(
                                                    "carbontrack-activities.csv",
                                                    ["Date", "Category", "Activity", "Quantity", "Unit", "CO2e (kg)"],
                                                    filteredEntries.map((e) => [e.date, e.category, e.activityType, e.quantity, e.unit, e.co2e.toFixed(2)])
                                                )
                                            }
                                        />
                                    }
                                />
                                {!ready ? <PanelSkeleton variant="log" /> : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                                        <div className="ct-grid" style={{ display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 20, alignItems: "start" }}>
                                            <ActivityLogger
                                                onLog={handleLogActivity}
                                                editingEntry={editingEntry}
                                                onUpdate={handleUpdateActivity}
                                                onCancelEdit={cancelEditActivity}
                                            />
                                            <TodaysFootprint activities={todaysActivities} />
                                        </div>
                                        <GlassCard pad={22}>
                                            <RecentLogsList
                                                activities={activities}
                                                onEdit={startEditActivity}
                                                onDelete={handleDeleteActivity}
                                            />
                                        </GlassCard>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "trends" && (
                            <>
                                <PageHeader
                                    eyebrow="Analytics"
                                    title="Trends & breakdowns"
                                    subtitle="How your emissions move across days, weeks and categories."
                                />
                                <FilterBar
                                    filters={filters}
                                    onChange={setFilters}
                                    actions={
                                        <ExportButton
                                            onClick={() =>
                                                downloadCSV(
                                                    "carbontrack-trends.csv",
                                                    ["Date", "Category", "Activity", "Quantity", "Unit", "CO2e (kg)"],
                                                    filteredEntries.map((e) => [e.date, e.category, e.activityType, e.quantity, e.unit, e.co2e.toFixed(2)])
                                                )
                                            }
                                        />
                                    }
                                />
                                {!ready ? <PanelSkeleton /> : filteredEntries.length === 0 ? (
                                    <GlassCard>
                                        <EmptyState
                                            icon={TrendIcon}
                                            title="No data in this range"
                                            body={`Nothing matches ${filterLabel(filters)}. Widen the date range, clear category filters, or log a new activity.`}
                                            actionLabel="Log an activity"
                                            onAction={() => goTo("log")}
                                        />
                                    </GlassCard>
                                ) : (
                                    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                                        <FootprintSummary entries={filteredEntries} />
                                        <div className="ct-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                                            <CategoryPie activities={todaysActivities} />
                                            <WeeklyTrend todayTotal={todayTotal} />
                                        </div>
                                        <MonthlyProgress todayTotal={todayTotal} />
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === "goals" && (
                            <>
                                <PageHeader eyebrow="Commitments" title="Goals" subtitle="Set a reduction target and track your progress against your baseline week." />
                                {!ready ? <PanelSkeleton variant="leaderboard" /> : (
                                    <GoalsView
                                        goal={goal}
                                        onSetGoal={setGoal}
                                        onClearGoal={() => setGoal(null)}
                                        entries={allEntries}
                                    />
                                )}
                            </>
                        )}

                        {activeTab === "insights" && (
                            <>
                                <PageHeader eyebrow="Intelligence" title="Insights" subtitle="Patterns, peer benchmarks and the highest-leverage changes for your footprint." />
                                <FilterBar filters={filters} onChange={setFilters} />
                                {!ready ? <PanelSkeleton /> : filteredEntries.length === 0 ? (
                                    <GlassCard>
                                        <EmptyState
                                            icon={Sparkles}
                                            title="Not enough data to analyse"
                                            body={`No entries match ${filterLabel(filters)}. Insights need at least a few logged activities in the selected window.`}
                                            actionLabel="Reset filters"
                                            onAction={() => setFilters({ ...DEFAULT_FILTERS })}
                                        />
                                    </GlassCard>
                                ) : (
                                    <InsightsView entries={filteredEntries} />
                                )}
                            </>
                        )}

                        {activeTab === "badges" && (
                            <>
                                <PageHeader eyebrow="Recognition" title="Badges" subtitle="Milestones you've unlocked on the way to a lower-carbon routine." />
                                {!ready ? <PanelSkeleton variant="badges" /> : (
                                    <BadgesView
                                        earnedIds={earnedBadgeIds}
                                        reduction={reduction}
                                        activeStreak={activeStreak}
                                    />
                                )}
                            </>
                        )}

                        {activeTab === "leaderboard" && (
                            <>
                                <PageHeader
                                    eyebrow="Community"
                                    title="Leaderboard"
                                    subtitle="Anonymous peer benchmarking — compare weekly footprints without exposing personal data."
                                />
                                {!ready ? <PanelSkeleton variant="leaderboard" /> : (
                                    <Leaderboard
                                        youWeekly={youWeekly}
                                        earnedIds={earnedBadgeIds}
                                        onSelectMember={setSelectedMember}
                                        anonymous={profile.anonymous}
                                    />
                                )}
                            </>
                        )}

                        {activeTab === "team" && (
                            !ready ? <PanelSkeleton /> : (
                                <OrgReportView orgId={orgId} youWeekly={youWeekly} filters={filters} onFilters={setFilters} />
                            )
                        )}

                    </div>


                    {/* Floating "Sprout" 🌱 Chatbot Component (Always Available Across Every Tab) */}
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

                                <SectionLabel>Badges Unlocked</SectionLabel>
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
            </LocalizationContext.Provider>
        </ThemeContext.Provider>
    );
}