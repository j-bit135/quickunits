import { useState, useEffect, useCallback } from "react";

// ── TOOLS ──────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "length",      label: "Length",           icon: "ti-ruler",          desc: "Inches, cm, feet, metres & more" },
  { id: "weight",      label: "Weight & Mass",    icon: "ti-weight",         desc: "kg, lbs, stone, ounces & more" },
  { id: "temperature", label: "Temperature",      icon: "ti-temperature",    desc: "Celsius, Fahrenheit & Kelvin" },
  { id: "area",        label: "Area",             icon: "ti-square",         desc: "m², ft², acres, hectares & more" },
  { id: "volume",      label: "Volume & Liquid",  icon: "ti-droplet",        desc: "Litres, gallons, pints, cups & more" },
  { id: "speed",       label: "Speed",            icon: "ti-gauge",          desc: "mph, km/h, knots, m/s & more" },
  { id: "data",        label: "Data Storage",     icon: "ti-database",       desc: "Bytes, KB, MB, GB, TB & more" },
  { id: "cooking",     label: "Cooking",          icon: "ti-chef-hat",       desc: "Cups, tbsp, tsp, ml & oven temps" },
  { id: "currency",    label: "Number Bases",     icon: "ti-hash",           desc: "Binary, octal, decimal, hex" },
  { id: "time",        label: "Time",             icon: "ti-clock",          desc: "Seconds, minutes, hours, days & more" },
];

const BLUE = "#2563eb";
const BLUEBG = "#eff6ff";

// ── CONVERSION DATA ─────────────────────────────────────────────────────
const CONVERSIONS = {
  length: {
    label: "Length",
    units: [
      { id: "mm",    label: "Millimetres (mm)",   toBase: v => v / 1000,       fromBase: v => v * 1000 },
      { id: "cm",    label: "Centimetres (cm)",   toBase: v => v / 100,        fromBase: v => v * 100 },
      { id: "m",     label: "Metres (m)",         toBase: v => v,              fromBase: v => v },
      { id: "km",    label: "Kilometres (km)",    toBase: v => v * 1000,       fromBase: v => v / 1000 },
      { id: "in",    label: "Inches (in)",        toBase: v => v * 0.0254,     fromBase: v => v / 0.0254 },
      { id: "ft",    label: "Feet (ft)",          toBase: v => v * 0.3048,     fromBase: v => v / 0.3048 },
      { id: "yd",    label: "Yards (yd)",         toBase: v => v * 0.9144,     fromBase: v => v / 0.9144 },
      { id: "mi",    label: "Miles (mi)",         toBase: v => v * 1609.344,   fromBase: v => v / 1609.344 },
      { id: "nmi",   label: "Nautical Miles",     toBase: v => v * 1852,       fromBase: v => v / 1852 },
      { id: "ly",    label: "Light Years",        toBase: v => v * 9.461e15,   fromBase: v => v / 9.461e15 },
    ]
  },
  weight: {
    label: "Weight & Mass",
    units: [
      { id: "mg",    label: "Milligrams (mg)",    toBase: v => v / 1e6,        fromBase: v => v * 1e6 },
      { id: "g",     label: "Grams (g)",          toBase: v => v / 1000,       fromBase: v => v * 1000 },
      { id: "kg",    label: "Kilograms (kg)",     toBase: v => v,              fromBase: v => v },
      { id: "t",     label: "Metric Tonnes (t)",  toBase: v => v * 1000,       fromBase: v => v / 1000 },
      { id: "oz",    label: "Ounces (oz)",        toBase: v => v * 0.0283495,  fromBase: v => v / 0.0283495 },
      { id: "lb",    label: "Pounds (lb)",        toBase: v => v * 0.453592,   fromBase: v => v / 0.453592 },
      { id: "st",    label: "Stone (st)",         toBase: v => v * 6.35029,    fromBase: v => v / 6.35029 },
      { id: "ton",   label: "US Tons (ton)",      toBase: v => v * 907.185,    fromBase: v => v / 907.185 },
      { id: "lton",  label: "Long Tons (UK)",     toBase: v => v * 1016.047,   fromBase: v => v / 1016.047 },
    ]
  },
  temperature: {
    label: "Temperature",
    units: [
      { id: "c",  label: "Celsius (°C)",    toBase: v => v,                   fromBase: v => v },
      { id: "f",  label: "Fahrenheit (°F)", toBase: v => (v - 32) * 5/9,     fromBase: v => v * 9/5 + 32 },
      { id: "k",  label: "Kelvin (K)",      toBase: v => v - 273.15,          fromBase: v => v + 273.15 },
      { id: "r",  label: "Rankine (°R)",    toBase: v => (v - 491.67) * 5/9, fromBase: v => (v + 273.15) * 9/5 },
    ]
  },
  area: {
    label: "Area",
    units: [
      { id: "mm2",  label: "mm²",              toBase: v => v / 1e6,       fromBase: v => v * 1e6 },
      { id: "cm2",  label: "cm²",              toBase: v => v / 10000,     fromBase: v => v * 10000 },
      { id: "m2",   label: "Square Metres m²", toBase: v => v,             fromBase: v => v },
      { id: "km2",  label: "km²",              toBase: v => v * 1e6,       fromBase: v => v / 1e6 },
      { id: "ha",   label: "Hectares (ha)",    toBase: v => v * 10000,     fromBase: v => v / 10000 },
      { id: "ac",   label: "Acres (ac)",       toBase: v => v * 4046.86,   fromBase: v => v / 4046.86 },
      { id: "ft2",  label: "Square Feet ft²",  toBase: v => v * 0.092903,  fromBase: v => v / 0.092903 },
      { id: "mi2",  label: "Square Miles mi²", toBase: v => v * 2.59e6,    fromBase: v => v / 2.59e6 },
      { id: "yd2",  label: "Square Yards yd²", toBase: v => v * 0.836127,  fromBase: v => v / 0.836127 },
    ]
  },
  volume: {
    label: "Volume & Liquid",
    units: [
      { id: "ml",    label: "Millilitres (ml)",  toBase: v => v / 1000,      fromBase: v => v * 1000 },
      { id: "l",     label: "Litres (L)",        toBase: v => v,             fromBase: v => v },
      { id: "m3",    label: "Cubic Metres m³",   toBase: v => v * 1000,      fromBase: v => v / 1000 },
      { id: "tsp",   label: "Teaspoons (tsp)",   toBase: v => v * 0.00492892,fromBase: v => v / 0.00492892 },
      { id: "tbsp",  label: "Tablespoons (tbsp)",toBase: v => v * 0.0147868, fromBase: v => v / 0.0147868 },
      { id: "floz",  label: "Fl Oz (US)",        toBase: v => v * 0.0295735, fromBase: v => v / 0.0295735 },
      { id: "cup",   label: "Cups (US)",         toBase: v => v * 0.236588,  fromBase: v => v / 0.236588 },
      { id: "pt",    label: "Pints (US)",        toBase: v => v * 0.473176,  fromBase: v => v / 0.473176 },
      { id: "ukpt",  label: "Pints (UK)",        toBase: v => v * 0.568261,  fromBase: v => v / 0.568261 },
      { id: "qt",    label: "Quarts (US)",       toBase: v => v * 0.946353,  fromBase: v => v / 0.946353 },
      { id: "gal",   label: "Gallons (US)",      toBase: v => v * 3.78541,   fromBase: v => v / 3.78541 },
      { id: "ukgal", label: "Gallons (UK)",      toBase: v => v * 4.54609,   fromBase: v => v / 4.54609 },
    ]
  },
  speed: {
    label: "Speed",
    units: [
      { id: "ms",   label: "Metres/sec (m/s)",   toBase: v => v,             fromBase: v => v },
      { id: "kmh",  label: "Kilometres/hr (km/h)",toBase: v => v / 3.6,      fromBase: v => v * 3.6 },
      { id: "mph",  label: "Miles/hr (mph)",     toBase: v => v * 0.44704,   fromBase: v => v / 0.44704 },
      { id: "kt",   label: "Knots (kt)",         toBase: v => v * 0.514444,  fromBase: v => v / 0.514444 },
      { id: "fts",  label: "Feet/sec (ft/s)",    toBase: v => v * 0.3048,    fromBase: v => v / 0.3048 },
      { id: "mach", label: "Mach",               toBase: v => v * 340.29,    fromBase: v => v / 340.29 },
    ]
  },
  data: {
    label: "Data Storage",
    units: [
      { id: "bit",  label: "Bits (bit)",         toBase: v => v / 8,         fromBase: v => v * 8 },
      { id: "b",    label: "Bytes (B)",          toBase: v => v,             fromBase: v => v },
      { id: "kb",   label: "Kilobytes (KB)",     toBase: v => v * 1024,      fromBase: v => v / 1024 },
      { id: "mb",   label: "Megabytes (MB)",     toBase: v => v * 1048576,   fromBase: v => v / 1048576 },
      { id: "gb",   label: "Gigabytes (GB)",     toBase: v => v * 1.074e9,   fromBase: v => v / 1.074e9 },
      { id: "tb",   label: "Terabytes (TB)",     toBase: v => v * 1.1e12,    fromBase: v => v / 1.1e12 },
      { id: "pb",   label: "Petabytes (PB)",     toBase: v => v * 1.126e15,  fromBase: v => v / 1.126e15 },
    ]
  },
  cooking: {
    label: "Cooking",
    units: [
      { id: "tsp",   label: "Teaspoons (tsp)",   toBase: v => v * 4.92892,   fromBase: v => v / 4.92892 },
      { id: "tbsp",  label: "Tablespoons (tbsp)",toBase: v => v * 14.7868,   fromBase: v => v / 14.7868 },
      { id: "floz",  label: "Fl Oz",             toBase: v => v * 29.5735,   fromBase: v => v / 29.5735 },
      { id: "cup",   label: "Cups (US)",         toBase: v => v * 236.588,   fromBase: v => v / 236.588 },
      { id: "ml",    label: "Millilitres (ml)",  toBase: v => v,             fromBase: v => v },
      { id: "l",     label: "Litres (L)",        toBase: v => v * 1000,      fromBase: v => v / 1000 },
      { id: "g",     label: "Grams (g)",         toBase: v => v,             fromBase: v => v },
      { id: "oz",    label: "Ounces (oz)",       toBase: v => v * 28.3495,   fromBase: v => v / 28.3495 },
      { id: "lb",    label: "Pounds (lb)",       toBase: v => v * 453.592,   fromBase: v => v / 453.592 },
    ]
  },
  currency: {
    label: "Number Bases",
    units: [
      { id: "bin", label: "Binary (Base 2)",     toBase: v => parseInt(String(v), 2) || 0,  fromBase: v => Math.round(v).toString(2) },
      { id: "oct", label: "Octal (Base 8)",      toBase: v => parseInt(String(v), 8) || 0,  fromBase: v => Math.round(v).toString(8) },
      { id: "dec", label: "Decimal (Base 10)",   toBase: v => Number(v),                    fromBase: v => Math.round(v).toString(10) },
      { id: "hex", label: "Hexadecimal (Base 16)",toBase: v => parseInt(String(v), 16) || 0, fromBase: v => Math.round(v).toString(16).toUpperCase() },
    ]
  },
  time: {
    label: "Time",
    units: [
      { id: "ns",   label: "Nanoseconds (ns)",   toBase: v => v / 1e9,       fromBase: v => v * 1e9 },
      { id: "us",   label: "Microseconds (μs)",  toBase: v => v / 1e6,       fromBase: v => v * 1e6 },
      { id: "ms",   label: "Milliseconds (ms)",  toBase: v => v / 1000,      fromBase: v => v * 1000 },
      { id: "s",    label: "Seconds (s)",        toBase: v => v,             fromBase: v => v },
      { id: "min",  label: "Minutes (min)",      toBase: v => v * 60,        fromBase: v => v / 60 },
      { id: "hr",   label: "Hours (hr)",         toBase: v => v * 3600,      fromBase: v => v / 3600 },
      { id: "day",  label: "Days",               toBase: v => v * 86400,     fromBase: v => v / 86400 },
      { id: "wk",   label: "Weeks",              toBase: v => v * 604800,    fromBase: v => v / 604800 },
      { id: "mo",   label: "Months (avg)",       toBase: v => v * 2629800,   fromBase: v => v / 2629800 },
      { id: "yr",   label: "Years",              toBase: v => v * 31557600,  fromBase: v => v / 31557600 },
    ]
  },
};

// ── SEO HELPERS ────────────────────────────────────────────────────────
const TOOL_META = {
  length:      { path:"/tools/length-converter",      title:"Length Converter — mm, cm, inches, feet, miles | QuickUnits",       desc:"Convert between millimetres, centimetres, metres, kilometres, inches, feet, yards and miles instantly. Free length converter." },
  weight:      { path:"/tools/weight-converter",      title:"Weight Converter — kg, lbs, stone, ounces | QuickUnits",            desc:"Convert between kilograms, pounds, stone, ounces, grams and tonnes instantly. Free weight and mass converter." },
  temperature: { path:"/tools/temperature-converter", title:"Temperature Converter — Celsius, Fahrenheit, Kelvin | QuickUnits",  desc:"Convert between Celsius, Fahrenheit and Kelvin instantly. Free temperature converter with formula explanations." },
  area:        { path:"/tools/area-converter",        title:"Area Converter — m², ft², acres, hectares | QuickUnits",            desc:"Convert between square metres, square feet, acres, hectares and more. Free area and land measurement converter." },
  volume:      { path:"/tools/volume-converter",      title:"Volume Converter — litres, gallons, pints, cups | QuickUnits",      desc:"Convert between litres, gallons, pints, cups, fluid ounces, millilitres and more. Free liquid volume converter." },
  speed:       { path:"/tools/speed-converter",       title:"Speed Converter — mph, km/h, knots, m/s | QuickUnits",              desc:"Convert between miles per hour, kilometres per hour, knots, metres per second and Mach. Free speed converter." },
  data:        { path:"/tools/data-converter",        title:"Data Storage Converter — Bytes, KB, MB, GB, TB | QuickUnits",       desc:"Convert between bytes, kilobytes, megabytes, gigabytes and terabytes instantly. Free data storage converter." },
  cooking:     { path:"/tools/cooking-converter",     title:"Cooking Measurement Converter — Cups, tbsp, ml, oz | QuickUnits",   desc:"Convert between cups, tablespoons, teaspoons, millilitres, ounces and grams. Free cooking measurement converter." },
  currency:    { path:"/tools/number-base-converter", title:"Number Base Converter — Binary, Octal, Decimal, Hex | QuickUnits",  desc:"Convert between binary, octal, decimal and hexadecimal number bases instantly. Free programmer's number converter." },
  time:        { path:"/tools/time-converter",        title:"Time Converter — Seconds, Minutes, Hours, Days, Years | QuickUnits",desc:"Convert between nanoseconds, seconds, minutes, hours, days, weeks, months and years. Free time converter." },
};
const PAGE_META = {
  blog:        { path:"/blog",        title:"Conversion Guides & Tips | QuickUnits Blog",                    desc:"Practical guides on unit conversions, measurement systems, and everyday calculation tips." },
  advertising: { path:"/advertising", title:"Advertise on QuickUnits — Reach a Measurement-Focused Audience",desc:"Reach people actively converting measurements. Premium ad placements on QuickUnits." },
  about:       { path:"/about",       title:"About QuickUnits — Free Unit Conversion Tools",                 desc:"QuickUnits is a free unit conversion toolkit built for everyday use. Fast, accurate and ad-supported." },
  privacy:     { path:"/privacy",     title:"Privacy Policy | QuickUnits",                                   desc:"QuickUnits privacy policy. How we collect, use and protect your data." },
};
const SITE_DEFAULT = { title:"QuickUnits — Free Unit Conversion Tools", desc:"Free unit conversion tools for length, weight, temperature, volume, speed, data storage, cooking and more. Fast, accurate, instant." };

function useDocumentMeta(title, desc) {
  useEffect(() => {
    document.title = title;
    let m = document.querySelector('meta[name="description"]');
    if (!m) { m = document.createElement('meta'); m.name = 'description'; document.head.appendChild(m); }
    m.content = desc;
  }, [title, desc]);
}
function usePushState(path) {
  useEffect(() => {
    if (window.location.pathname !== path) window.history.pushState({}, '', path);
  }, [path]);
}

function useIsMobile() {
  const [mobile, setMobile] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setMobile(window.innerWidth <= 768);
    window.addEventListener("resize", fn);
    fn();
    return () => window.removeEventListener("resize", fn);
  }, []);
  return mobile;
}

// ── STYLES ─────────────────────────────────────────────────────────────
const styles = `
  @import url('https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@latest/tabler-icons.min.css');
  @import url('https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body, #root { background: #f7f8fa; color: #1a1a1a; font-family: 'DM Sans', sans-serif; }
  ::-webkit-scrollbar { width: 4px; height: 4px; }
  ::-webkit-scrollbar-track { background: #eee; }
  ::-webkit-scrollbar-thumb { background: #ccc; }

  input, select {
    background: #fff; border: 1.5px solid #e0e4ed; border-radius: 6px;
    font-family: 'DM Sans', sans-serif; font-size: 14px; color: #1a1a1a;
    outline: none; transition: border-color .2s;
  }
  input:focus, select:focus { border-color: #2563eb; box-shadow: 0 0 0 3px rgba(37,99,235,.1); }

  .card { background: #fff; border: 1.5px solid #e0e4ed; border-radius: 8px; padding: 20px; margin-bottom: 14px; }
  .card:hover { border-color: #bfcde8; }

  .btn {
    display: inline-flex; align-items: center; gap: 8px; padding: 9px 20px;
    background: #2563eb; color: #fff; font-family: 'DM Sans'; font-size: 13px;
    font-weight: 500; border: none; border-radius: 6px; cursor: pointer; transition: background .2s;
  }
  .btn:hover { background: #1d4ed8; }

  .btn-ghost {
    background: transparent; border: 1.5px solid #e0e4ed; color: #666;
    padding: 7px 14px; font-size: 12px; font-family: 'DM Sans'; border-radius: 6px;
    cursor: pointer; transition: all .15s; display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-ghost:hover { border-color: #2563eb; color: #2563eb; }

  .copy-btn {
    background: #f0f4ff; border: 1.5px solid #c7d7fc; color: #2563eb;
    padding: 5px 12px; font-size: 11px; font-family: 'DM Mono'; border-radius: 5px;
    cursor: pointer; transition: all .15s; letter-spacing: .04em;
  }
  .copy-btn:hover { background: #2563eb; color: #fff; }

  .result-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; background: #f7f8fa; border: 1.5px solid #e0e4ed;
    border-radius: 7px; margin-bottom: 8px; transition: border-color .15s;
  }
  .result-row:hover { border-color: #2563eb; background: #f0f4ff; }
  .result-row.highlighted { border-color: #2563eb; background: #eff6ff; }

  .tab { padding: 7px 14px; border-radius: 6px; font-size: 13px; font-weight: 500; cursor: pointer; border: none; background: transparent; color: #666; transition: all .15s; }
  .tab.active { background: #eff6ff; color: #2563eb; }
  .tab:hover:not(.active) { background: #f0f4ff; color: #2563eb; }

  /* Sidebar */
  .sidebar { width: 324px; background: #fff; border-right: 1.5px solid #e0e4ed; display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; height: 100vh; position: sticky; top: 0; }
  .sidebar-tool { display: flex; align-items: center; gap: 12px; padding: 11px 18px; cursor: pointer; border-left: 3px solid transparent; transition: all .15s; }
  .sidebar-tool:hover { background: #f7f8fa; }
  .sidebar-tool.active { background: #eff6ff; border-left-color: #2563eb; }
  .sidebar-tool.active .tool-label { color: #2563eb; font-weight: 600; }
  .tool-label { font-size: 13px; color: #1a1a1a; font-weight: 500; }
  .tool-desc  { font-size: 11px; color: #888; margin-top: 1px; }

  /* Mobile header */
  .mobile-header { display: none; background: #fff; border-bottom: 1.5px solid #e0e4ed; padding: 12px 16px; position: sticky; top: 0; z-index: 100; }

  /* Ad units */
  .inline-ad { width: 100%; border: 1.5px solid #e0e4ed; border-radius: 6px; background: #f7f8fa; overflow: hidden; cursor: pointer; transition: border-color .2s; margin-top: 8px; }
  .inline-ad:hover { border-color: #c7d7fc; }
  .inline-ad-label { font-size: 9px; letter-spacing: .1em; color: #b0b8cc; text-transform: uppercase; text-align: center; padding: 5px 0 0; font-family: 'DM Mono'; }

  @media (max-width: 768px) {
    .sidebar { display: none; }
    .mobile-header { display: flex; align-items: center; justify-content: space-between; }
    .main-scroll { padding: 16px !important; }
    .ab-cols { grid-template-columns: 1fr !important; }
    .drawer { position: fixed; inset: 0; z-index: 200; display: flex; }
    .drawer-panel { width: min(92vw, 340px); height: 100%; background: #fff; border-right: 1.5px solid #e0e4ed; overflow-y: auto; display: flex; flex-direction: column; }
    .drawer-backdrop { flex: 1; background: rgba(0,0,0,.3); }
  }
  @media (min-width: 769px) {
    .drawer { display: none !important; }
  }
`;

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  return (
    <button className="copy-btn" onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1800); }}>
      {copied ? "✓ copied" : "copy"}
    </button>
  );
}

// ── INLINE AD UNIT ─────────────────────────────────────────────────────
function InlineAdUnit() {
  const [hover, setHover] = useState(false);
  const [mob, setMob] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    fn();
    return () => window.removeEventListener('resize', fn);
  }, []);
  const h = mob ? 58 : 90;
  const divH = mob ? 26 : 40;
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ width:"100%", border:`1.5px solid ${hover?"#c7d7fc":"#e0e4ed"}`, borderRadius:6,
        background:"#f7f8fa", overflow:"hidden", cursor:"pointer", transition:"border-color .2s", marginTop:8 }}>
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#b0b8cc", textTransform:"uppercase",
        textAlign:"center", padding:"5px 0 0", fontFamily:"DM Mono,monospace" }}>Advertisement</div>
      <div style={{ width:"100%", height:h, display:"flex", alignItems:"center", justifyContent:"center",
        gap:mob?10:14, padding:`0 ${mob?14:24}px`, position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg,transparent,${BLUE} 40%,${BLUE} 60%,transparent)`,
          opacity: hover ? .2 : .08, transition:"opacity .2s" }} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
          <span style={{ fontSize:mob?14:18, opacity:.3 }}>📢</span>
          <span style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#b0b8cc" }}>{mob?"320 × 50":"728 × 90"}</span>
        </div>
        <div style={{ width:1, height:divH, background:"#e0e4ed", flexShrink:0 }} />
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          <span style={{ fontFamily:"DM Mono,monospace", fontSize:mob?9:10, color:"#b0b8cc" }}>
            {mob ? "Mobile banner — insert ad tag here" : "Leaderboard — insert ad tag here"}
          </span>
          <span style={{ fontFamily:"DM Mono,monospace", fontSize:9, color:"#c8d0de" }}>
            Responsive · switches format by breakpoint
          </span>
        </div>
      </div>
    </div>
  );
}

function BottomAdUnit() {
  const [hover, setHover] = useState(false);
  const [mob, setMob] = useState(() => typeof window !== 'undefined' && window.innerWidth <= 768);
  useEffect(() => {
    const fn = () => setMob(window.innerWidth <= 768);
    window.addEventListener('resize', fn);
    fn();
    return () => window.removeEventListener('resize', fn);
  }, []);
  const h = mob ? 58 : 90;
  const divH = mob ? 26 : 40;
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{ width:"100%", border:`1.5px solid ${hover?"#c7d7fc":"#e0e4ed"}`, borderRadius:6,
        background:"#f7f8fa", overflow:"hidden", cursor:"pointer", transition:"border-color .2s", marginTop:32 }}>
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#b0b8cc", textTransform:"uppercase",
        textAlign:"center", padding:"5px 0 0", fontFamily:"DM Mono,monospace" }}>Advertisement</div>
      <div style={{ width:"100%", height:h, display:"flex", alignItems:"center", justifyContent:"center",
        gap:mob?10:14, padding:`0 ${mob?14:24}px`, position:"relative" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:1,
          background:`linear-gradient(90deg,transparent,${BLUE} 40%,${BLUE} 60%,transparent)`,
          opacity: hover ? .2 : .08, transition:"opacity .2s" }} />
        <div style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:3, flexShrink:0 }}>
          <span style={{ fontSize:mob?14:18, opacity:.3 }}>📢</span>
          <span style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#b0b8cc" }}>{mob?"320 × 50":"728 × 90"}</span>
        </div>
        <div style={{ width:1, height:divH, background:"#e0e4ed", flexShrink:0 }} />
        <div style={{ display:"flex", flexDirection:"column", gap:3 }}>
          <span style={{ fontFamily:"DM Mono,monospace", fontSize:mob?9:10, color:"#b0b8cc" }}>
            {mob ? "Mobile banner — insert ad tag here" : "Leaderboard — insert ad tag here"}
          </span>
          <span style={{ fontFamily:"DM Mono,monospace", fontSize:9, color:"#c8d0de" }}>
            Responsive · switches format by breakpoint
          </span>
        </div>
      </div>
    </div>
  );
}

function SidebarAdUnit() {
  const [hover, setHover] = useState(false);
  return (
    <div style={{ padding:"12px", borderTop:"1.5px solid #e0e4ed", marginTop:8 }}>
      <div style={{ fontSize:9, letterSpacing:".1em", color:"#b0b8cc", textTransform:"uppercase", marginBottom:6, textAlign:"center", fontFamily:"DM Mono,monospace" }}>Advertisement</div>
      <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
        style={{ width:300, height:250, background:hover?"#eff6ff":"#f7f8fa", border:`1.5px dashed ${hover?"#2563eb":"#e0e4ed"}`, borderRadius:6, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", cursor:"pointer", transition:"all .2s", position:"relative", overflow:"hidden", margin:"0 auto" }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:2, background:"#2563eb", opacity:hover?0.4:0.1, transition:"opacity .2s" }} />
        <i className="ti ti-ad-2" style={{ fontSize:28, color:"#c8d0de", marginBottom:10 }} />
        <div style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#b0b8cc", letterSpacing:".06em", marginBottom:4 }}>300 × 250</div>
        <div style={{ fontFamily:"DM Mono,monospace", fontSize:10, color:"#c8d0de" }}>AD PLACEMENT</div>
        <div style={{ position:"absolute", bottom:8, fontSize:9, color:"#c8d0de", fontFamily:"DM Mono,monospace" }}>Insert ad tag here</div>
      </div>
    </div>
  );
}

// ── CONVERTER TOOL ─────────────────────────────────────────────────────
function ConverterTool({ toolId }) {
  const conv = CONVERSIONS[toolId];
  const [fromUnit, setFromUnit] = useState(conv.units[0].id);
  const [toUnit, setToUnit] = useState(conv.units[1].id);
  const [inputVal, setInputVal] = useState("1");
  const [showAll, setShowAll] = useState(false);

  const fromUnitObj = conv.units.find(u => u.id === fromUnit);
  const toUnitObj   = conv.units.find(u => u.id === toUnit);

  const convert = useCallback((val, from, to) => {
    const num = parseFloat(val);
    if (isNaN(num)) return "";
    const fromObj = conv.units.find(u => u.id === from);
    const toObj   = conv.units.find(u => u.id === to);
    if (!fromObj || !toObj) return "";
    const base   = fromObj.toBase(num);
    const result = toObj.fromBase(base);
    if (typeof result === "string") return result;
    if (Math.abs(result) >= 1e9 || (Math.abs(result) < 0.0001 && result !== 0)) {
      return result.toExponential(4);
    }
    return parseFloat(result.toFixed(6)).toString();
  }, [conv]);

  const result = convert(inputVal, fromUnit, toUnit);

  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); setInputVal(result || "1"); };

  return (
    <div>
      <div style={{ marginBottom:8 }}>
        <div style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".08em", marginBottom:4, textTransform:"uppercase" }}>
          {conv.label} Converter
        </div>
        <h1 style={{ fontSize:22, fontWeight:600, color:"#1a1a1a", marginBottom:2 }}>{conv.label} Converter</h1>
        <p style={{ fontSize:13, color:"#888" }}>Convert between {conv.units.slice(0,4).map(u => u.label).join(", ")} and more</p>
      </div>

      {/* Main converter */}
      <div className="card" style={{ marginTop:16 }}>
        <div className="ab-cols" style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:12, alignItems:"end", marginBottom:16 }}>
          {/* From */}
          <div>
            <div style={{ fontSize:11, color:"#888", marginBottom:6, fontFamily:"DM Mono,monospace", letterSpacing:".04em" }}>FROM</div>
            <select value={fromUnit} onChange={e => setFromUnit(e.target.value)}
              style={{ width:"100%", padding:"8px 10px", marginBottom:8 }}>
              {conv.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
            <input type="number" value={inputVal} onChange={e => setInputVal(e.target.value)}
              style={{ width:"100%", padding:"10px 12px", fontSize:18, fontWeight:600, fontFamily:"DM Mono,monospace" }} />
          </div>

          {/* Swap */}
          <div style={{ paddingBottom:4 }}>
            <button onClick={swap} style={{ background:"#f0f4ff", border:"1.5px solid #c7d7fc", borderRadius:8, width:40, height:40, cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", transition:"all .15s", color:BLUE, fontSize:16 }}
              onMouseEnter={e => { e.currentTarget.style.background="#2563eb"; e.currentTarget.style.color="#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background="#f0f4ff"; e.currentTarget.style.color=BLUE; }}>
              ⇄
            </button>
          </div>

          {/* To */}
          <div>
            <div style={{ fontSize:11, color:"#888", marginBottom:6, fontFamily:"DM Mono,monospace", letterSpacing:".04em" }}>TO</div>
            <select value={toUnit} onChange={e => setToUnit(e.target.value)}
              style={{ width:"100%", padding:"8px 10px", marginBottom:8 }}>
              {conv.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
            <div style={{ background:"#eff6ff", border:"1.5px solid #c7d7fc", borderRadius:6, padding:"10px 12px", fontSize:18, fontWeight:600, fontFamily:"DM Mono,monospace", color:BLUE, minHeight:42 }}>
              {result || "—"}
            </div>
          </div>
        </div>

        {/* Formula */}
        {result && inputVal && (
          <div style={{ background:"#f7f8fa", border:"1.5px solid #e0e4ed", borderRadius:6, padding:"10px 14px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontFamily:"DM Mono,monospace", fontSize:13, color:"#555" }}>
              {inputVal} {fromUnitObj?.label} = {result} {toUnitObj?.label}
            </span>
            <CopyButton text={`${inputVal} ${fromUnitObj?.label} = ${result} ${toUnitObj?.label}`} />
          </div>
        )}
      </div>

      {/* Convert to all */}
      <div style={{ marginBottom:14 }}>
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
          <div style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>
            {inputVal || "1"} {fromUnitObj?.label} in all units
          </div>
          <button className="btn-ghost" onClick={() => setShowAll(!showAll)} style={{ fontSize:11 }}>
            {showAll ? "Show less" : "Show all"}
          </button>
        </div>
        {conv.units.slice(0, showAll ? conv.units.length : 6).map(unit => {
          if (unit.id === fromUnit) return null;
          const val = convert(inputVal || "1", fromUnit, unit.id);
          return (
            <div key={unit.id} className={`result-row ${unit.id === toUnit ? "highlighted" : ""}`}
              onClick={() => setToUnit(unit.id)} style={{ cursor:"pointer" }}>
              <div>
                <div style={{ fontFamily:"DM Mono,monospace", fontSize:14, fontWeight:600, color: unit.id === toUnit ? BLUE : "#1a1a1a" }}>{val}</div>
                <div style={{ fontSize:11, color:"#888", marginTop:1 }}>{unit.label}</div>
              </div>
              <CopyButton text={val} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── INFO PAGES ─────────────────────────────────────────────────────────
function AboutPage() {
  return (
    <div>
      <div style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".08em", marginBottom:4, textTransform:"uppercase" }}>About</div>
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:16 }}>About QuickUnits</h1>
      <div className="card" style={{ marginTop:16 }}>
        <p style={{ fontSize:14, color:"#555", lineHeight:1.8, marginBottom:12 }}>QuickUnits is a free unit conversion toolkit built for everyday use. Whether you're cooking, travelling, coding or doing science homework, QuickUnits gives you fast, accurate conversions across ten categories of measurement.</p>
        <p style={{ fontSize:14, color:"#555", lineHeight:1.8, marginBottom:12 }}>All conversions happen instantly in your browser — no server required, no data stored. We don't track your conversions and we never will.</p>
        <p style={{ fontSize:14, color:"#555", lineHeight:1.8 }}>QuickUnits is free to use, supported by advertising. If you find it useful, sharing it with someone who needs it is the best way to support us.</p>
      </div>
    </div>
  );
}

function AdvertisingPage() {
  return (
    <div>
      <div style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".08em", marginBottom:4, textTransform:"uppercase" }}>Advertising</div>
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:8 }}>Advertise on QuickUnits</h1>
      <p style={{ fontSize:14, color:"#888", marginBottom:16 }}>Reach people actively converting measurements — a highly intent-driven audience.</p>
      <div className="card" style={{ marginTop:16 }}>
        <div style={{ fontSize:13, fontWeight:600, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".04em", marginBottom:10, textTransform:"uppercase" }}>01 — Our Audience</div>
        <p style={{ fontSize:14, color:"#555", lineHeight:1.8, marginBottom:12 }}>QuickUnits attracts developers, students, chefs, engineers, travellers and everyday users who need quick, accurate unit conversions. High intent, task-focused traffic.</p>
        <div style={{ fontSize:13, fontWeight:600, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".04em", marginBottom:10, marginTop:20, textTransform:"uppercase" }}>02 — Ad Placements</div>
        <p style={{ fontSize:14, color:"#555", lineHeight:1.8, marginBottom:8 }}>We offer three standard IAB placements: a 300×250 sidebar unit, and responsive 728×90/320×50 leaderboard units above and below each tool.</p>
        <div style={{ fontSize:13, fontWeight:600, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".04em", marginBottom:10, marginTop:20, textTransform:"uppercase" }}>03 — Get in Touch</div>
        <p style={{ fontSize:14, color:"#555", lineHeight:1.8 }}>Contact us directly for rates, formats and availability.</p>
        <a href="mailto:contact.quickunits@gmail.com" style={{ display:"inline-flex", alignItems:"center", gap:8, marginTop:12, background:BLUE, color:"#fff", padding:"9px 20px", borderRadius:6, fontSize:13, fontWeight:500, textDecoration:"none" }}>
          contact.quickunits@gmail.com
        </a>
      </div>
    </div>
  );
}

function PrivacyPage() {
  const sections = [
    { title:"Overview", body:"This Privacy Policy explains how QuickUnits collects, uses and protects information when you visit quickunits.co.uk. By using the site you agree to the practices described in this policy." },
    { title:"Information We Collect", body:"We do not require you to create an account or provide personal information to use QuickUnits. All conversions happen entirely in your browser — conversion data is never sent to our servers.\n\nIf you choose to subscribe to our newsletter, we collect your email address for the sole purpose of sending you that newsletter." },
    { title:"Third-Party Services", body:"QuickUnits uses Google AdSense to serve advertisements. Google may use cookies to serve ads based on your prior visits to this or other websites. You can opt out at adssettings.google.com.\n\nWe may use Google Analytics to understand site usage in aggregate form." },
    { title:"Cookies", body:"Essential cookies are required for the site to function. Analytics and advertising cookies may be set by third-party services. You can control cookie settings through your browser." },
    { title:"Your Rights", body:"Under UK GDPR you have the right to access, correct, or delete your personal data. To exercise these rights, contact us at contact.quickunits@gmail.com." },
    { title:"Contact", body:"If you have questions about this Privacy Policy, contact us at contact.quickunits@gmail.com. We are based in the United Kingdom." },
  ];
  return (
    <div>
      <div style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".08em", marginBottom:4, textTransform:"uppercase" }}>Privacy Policy</div>
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:4 }}>Privacy Policy</h1>
      <p style={{ fontSize:13, color:"#aaa", marginBottom:16 }}>Effective June 2026 · quickunits.co.uk</p>
      {sections.map((sec, i) => (
        <div key={i} className="card" style={{ marginTop:i===0?16:0 }}>
          <div style={{ fontSize:13, fontWeight:600, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".04em", marginBottom:8, textTransform:"uppercase" }}>0{i+1} — {sec.title}</div>
          {sec.body.split("\n\n").map((para, j) => (
            <p key={j} style={{ fontSize:14, color:"#555", lineHeight:1.8, marginBottom: j < sec.body.split("\n\n").length-1 ? 10 : 0 }}>{para}</p>
          ))}
        </div>
      ))}
    </div>
  );
}

// ── BLOG ───────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  { slug:"metric-vs-imperial", title:"Metric vs Imperial — Why Two Systems Still Exist in 2026", category:"Measurement", readTime:"5 min read", intro:"Most of the world uses metric. The United States, Liberia and Myanmar don't. Here's why the imperial system has survived, and what it means for anyone working across borders.", body:`The metric system was designed in France during the Revolution of the 1790s, with one goal: to replace the chaos of regional measurement systems with a single, rational, decimal-based standard. By almost every measure it succeeded — 195 of the world's 198 countries now use it as their official system of measurement.\n\nThe three holdouts — the United States, Liberia and Myanmar — are notable for very different reasons. Myanmar and Liberia have been making slow progress toward metrication for decades. The United States is a more complex case: the country officially adopted the metric system in 1975 with the Metric Conversion Act, but made conversion entirely voluntary, and voluntary conversion largely did not happen.\n\nThe result is a system where American scientists, doctors and the military use metric exclusively, American international trade is conducted largely in metric, and American consumer products are labelled in both — while everyday American life continues in miles, pounds and Fahrenheit.\n\nFor anyone converting between the two systems regularly, the key relationships to memorise are: 1 inch = 2.54 centimetres exactly, 1 mile = 1.60934 kilometres, 1 kilogram = 2.20462 pounds, and the Celsius-Fahrenheit formula °F = (°C × 9/5) + 32. Everything else can be derived from a converter.` },
  { slug:"temperature-scales-explained", title:"The Three Temperature Scales — Celsius, Fahrenheit and Kelvin Explained", category:"Temperature", readTime:"4 min read", intro:"Three scales measure temperature, each invented for different purposes. Here's what they are, why they differ, and when you'd actually use each one.", body:`Celsius is the world's default temperature scale for everyday use. Defined by the freezing point of water (0°C) and the boiling point of water (100°C) at standard atmospheric pressure, it was designed to be intuitive for human-scale temperatures. Most of the world uses Celsius for weather, cooking and everyday conversation.\n\nFahrenheit was developed in 1724 by Daniel Gabriel Fahrenheit. He set 0°F as the lowest temperature he could achieve with a brine solution, and 96°F as human body temperature. The result is a scale that doesn't map to water's phase transitions as neatly, but which has the advantage (for some applications) of giving more decimal precision in the range of typical outdoor temperatures. The United States, its territories and a few other countries still use Fahrenheit for weather and cooking.\n\nKelvin is the scientific standard, used in physics, chemistry, astronomy and engineering. It starts at absolute zero — the coldest possible temperature, at which all molecular motion stops, equivalent to -273.15°C. Kelvin uses the same scale divisions as Celsius, which makes converting between the two simple: K = °C + 273.15. Scientists prefer Kelvin because it avoids negative numbers in thermodynamic calculations, which simplifies the mathematics considerably.\n\nFor practical purposes: if someone tells you the temperature is 100°F, they mean a hot summer day (about 38°C). If they say 100°C, water is boiling. If they say 100K, you are in the realm of liquid nitrogen (-173°C), far beyond anything encountered in daily life.` },
  { slug:"cooking-conversions-guide", title:"The Complete Guide to Cooking Measurement Conversions", category:"Cooking", readTime:"6 min read", intro:"American recipes use cups. European recipes use grams. British recipes use a combination of both plus stones, pounds and sometimes archaic spoon measurements. Here's how to convert confidently between all of them.", body:`The fundamental problem with cooking measurements is that volume and weight are not the same thing, and different ingredients have different densities. One cup of flour weighs roughly 120-130 grams. One cup of sugar weighs around 200 grams. One cup of water weighs exactly 240 grams. This means that converting a volume measurement to a weight measurement requires knowing what you're measuring.\n\nThe most reliable approach to cooking conversions is to use weight (grams or ounces) wherever possible. Weight measurements are unambiguous — a gram is a gram, regardless of how loosely or tightly you've packed a cup. Professional bakers virtually always use weight for this reason, and most good modern cookbooks include weight measurements alongside volume.\n\nFor liquid measurements, the conversions are more straightforward since liquids are consistent in density. One US cup = 240ml = 16 tablespoons = 8 fluid ounces. One tablespoon = 3 teaspoons = 15ml. One fluid ounce = 2 tablespoons = 30ml. UK and US measures differ: a UK tablespoon is 17.7ml, slightly larger than the US standard of 14.8ml — a small difference that rarely matters in practice unless you're scaling up a recipe significantly.\n\nOven temperatures are a particular source of confusion in international recipes. British recipes traditionally use Gas Marks (Gas Mark 4 = 180°C = 350°F), while American recipes use Fahrenheit and European recipes use Celsius. The key temperatures to remember: 160°C (320°F) is a slow oven for casseroles, 180°C (350°F) is a moderate oven for cakes, 200°C (390°F) is a hot oven for roasting, and 220°C (430°F) is very hot for bread and pizza.` },
  { slug:"data-storage-explained", title:"Bytes, Kilobytes, Megabytes, Gigabytes — Data Storage Explained", category:"Data", readTime:"5 min read", intro:"Everyone uses gigabytes daily but most people couldn't explain exactly how many megabytes are in one. Here's a clear breakdown of data storage units and the maddening SI vs binary divide.", body:`The byte is the fundamental unit of digital data — a single byte contains 8 bits, and a bit is the smallest possible unit of binary information, a single 0 or 1. Everything from a text message to a 4K film is ultimately measured in bytes.\n\nThe confusion in data storage measurements comes from two competing standards. The traditional computer science standard defines a kilobyte as 1,024 bytes (2¹⁰), a megabyte as 1,024 kilobytes (2²⁰), and so on — using powers of two, which is natural for binary computing. The SI (International System of Units) standard defines a kilobyte as exactly 1,000 bytes, a megabyte as exactly 1,000,000 bytes, and so on.\n\nHard drive manufacturers use the SI definition (1GB = 1,000,000,000 bytes) because it makes their drives appear larger. Operating systems traditionally used the binary definition (1GB = 1,073,741,824 bytes) because that's how memory is actually addressed. The result: a hard drive advertised as 1TB contains 1,000,000,000,000 bytes, but your operating system might report it as 931GB because it's dividing by 1,073,741,824 instead of 1,000,000,000.\n\nThe IEC introduced new prefixes to eliminate this ambiguity: a kibibyte (KiB) is exactly 1,024 bytes, a mebibyte (MiB) is exactly 1,048,576 bytes, and a gibibyte (GiB) is exactly 1,073,741,824 bytes. Most operating systems have slowly adopted these — macOS reports storage in GB (using SI), while Linux and Windows have been more variable.` },
  { slug:"speed-conversions-guide", title:"Speed Conversions — mph, km/h, Knots and Mach Explained", category:"Speed", readTime:"4 min read", intro:"Speed is measured differently depending on whether you're driving, flying or sailing. Here's why different industries use different units and how to convert between them.", body:`The mile per hour (mph) is primarily used in the United States and United Kingdom for road speeds. The kilometre per hour (km/h) is used everywhere else for road and general speed measurement. Converting between the two is straightforward: multiply mph by 1.60934 to get km/h, or divide km/h by 1.60934 to get mph. The approximate rule of thumb — 60mph ≈ 100km/h — is convenient and accurate to within 4%.\n\nKnots are used in aviation and maritime navigation. One knot is one nautical mile per hour, and a nautical mile is defined as one minute of arc along a meridian of the Earth — approximately 1,852 metres. This makes knots particularly useful for navigation because the relationship between speed, distance and position on a chart is direct. One knot = 1.852 km/h = 1.15078 mph.\n\nMach numbers measure speed relative to the speed of sound, which varies with altitude and temperature. At sea level and 15°C, the speed of sound is approximately 340 metres per second (761 mph, 1,225 km/h). Mach 1 is the speed of sound, Mach 2 is twice the speed of sound, and so on. Concorde cruised at Mach 2.04 — about 2,170 km/h at its cruising altitude. Commercial aircraft typically cruise at Mach 0.78-0.85.\n\nMetres per second (m/s) is the SI unit for speed and the preferred unit in scientific contexts. It relates cleanly to other SI units — a force of one newton accelerates one kilogram by one metre per second squared — making it essential in physics and engineering.` },
  { slug:"imperial-to-metric-cheatsheet", title:"The Ultimate Imperial to Metric Cheat Sheet", category:"Reference", readTime:"3 min read", intro:"A quick-reference guide to the most common unit conversions you'll actually need, arranged for maximum usability.", body:`LENGTH\n1 inch = 2.54 cm\n1 foot = 30.48 cm = 0.3048 m\n1 yard = 0.9144 m\n1 mile = 1.60934 km\n1 nautical mile = 1.852 km\n\nWEIGHT\n1 ounce = 28.35 g\n1 pound = 453.59 g = 0.45359 kg\n1 stone = 6.35029 kg\n1 US ton = 907.185 kg\n1 UK long ton = 1,016.047 kg\n\nVOLUME\n1 US fluid ounce = 29.57 ml\n1 UK fluid ounce = 28.41 ml\n1 US cup = 236.59 ml\n1 US pint = 473.18 ml\n1 UK pint = 568.26 ml\n1 US gallon = 3.785 L\n1 UK gallon = 4.546 L\n\nTEMPERATURE\n°C = (°F - 32) × 5/9\n°F = (°C × 9/5) + 32\nK = °C + 273.15\n\nSPEED\n1 mph = 1.60934 km/h\n1 knot = 1.852 km/h = 1.15078 mph\n1 Mach = ~340 m/s = ~761 mph (at sea level)\n\nCOMMON BENCHMARKS\n5'10" = 177.8 cm (average male height)\n70 kg = 11 stone = 154.3 lbs\n100°F = 37.8°C (fever temperature)\n60 mph = 96.56 km/h` },
  { slug:"number-bases-explained", title:"Binary, Octal, Decimal and Hexadecimal — Number Bases Explained", category:"Computing", readTime:"5 min read", intro:"Every number can be expressed in different bases. Computers use binary. Programmers use hexadecimal. Understanding why makes programming, networking and computer science considerably easier.", body:`Our everyday number system is base 10 (decimal) — we use ten digits (0-9) and each position in a number represents a power of ten. The number 347 means 3×100 + 4×10 + 7×1. This system is natural for humans (we have ten fingers) but arbitrary for computers.\n\nBinary (base 2) uses only two digits — 0 and 1. This maps directly to the on/off states of transistors in digital circuits. The binary number 1011 means 1×8 + 0×4 + 1×2 + 1×1 = 11 in decimal. All computer processing ultimately happens in binary, which is why understanding it is foundational to computer science.\n\nHexadecimal (base 16) uses sixteen digits: 0-9 and then A-F (where A=10, B=11, C=12, D=13, E=14, F=15). Hexadecimal is popular in programming because each hex digit represents exactly four binary digits (a nibble), making it a compact way to represent binary data. The hex number FF = 1111 1111 in binary = 255 in decimal. Memory addresses, colour codes (#FF5733) and binary data are all commonly written in hexadecimal.\n\nOctal (base 8) uses digits 0-7 and was historically used in computing because early computers had word sizes that were multiples of 3 bits, making octal a convenient shorthand for binary. It is less common today but still appears in Unix file permissions (chmod 755) where each digit represents three binary permission bits.` },
  { slug:"weight-measurement-guide", title:"Understanding Weight Measurements — kg, Pounds, Stone and More", category:"Weight", readTime:"4 min read", intro:"Weight is measured differently around the world, and the differences matter more than you might think. Here's a clear guide to all the main weight units and how to think about them.", body:`The kilogram (kg) is the SI base unit of mass and the standard used in science, medicine and most of the world for everyday weighing. The kilogram was originally defined as the mass of one litre of water at its maximum density. Since 2019 it has been redefined in terms of Planck's constant — a quantum mechanical constant — making it more precise and stable than any physical prototype could be.\n\nPounds (lb) are the primary weight unit in the United States and are still used alongside kilograms in the United Kingdom. One pound = 0.453592 kilograms. The abbreviation "lb" comes from the Latin word "libra" — the same root as the pound sterling (£) currency symbol, which also derives from a pound weight of silver.\n\nStone is a unit used almost exclusively in the UK and Ireland for measuring human body weight. One stone = 14 pounds = 6.35029 kilograms. The stone has no equivalent in other measurement systems and is one of the most confusing units for non-British people to interpret — someone who weighs 11 stone 4 pounds weighs 71.67 kilograms or 158 pounds.\n\nTons come in three varieties, which cause frequent confusion in international contexts. A metric tonne (t) = 1,000 kg. A US short ton = 2,000 pounds = 907.185 kg. A UK long ton = 2,240 pounds = 1,016.047 kg. When someone mentions "tons" without specifying, the context usually indicates which one — the UK tends to use metric tonnes now, while the US uses short tons, and long tons appear mostly in historical texts.` },
];

function BlogPage({ onNavigate }) {
  const [article, setArticle] = useState(null);

  usePushState(article ? `/blog/${article}` : '/blog');
  useEffect(() => {
    if (article) {
      const post = BLOG_POSTS.find(p => p.slug === article);
      if (post) { document.title = post.title + ' | QuickUnits'; }
    }
  }, [article]);

  if (article) {
    const post = BLOG_POSTS.find(p => p.slug === article);
    if (!post) return null;
    return (
      <div>
        <button className="btn-ghost" onClick={() => { setArticle(null); setTimeout(()=>{ const el=document.querySelector(".main-scroll"); if(el) el.scrollTop=0; window.scrollTo(0,0); },0); }} style={{ marginBottom:20 }}>← Back to Blog</button>
        <div style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".08em", marginBottom:4, textTransform:"uppercase" }}>{post.category}</div>
        <h1 style={{ fontSize:22, fontWeight:600, color:"#1a1a1a", marginBottom:6, lineHeight:1.3 }}>{post.title}</h1>
        <p style={{ fontSize:12, color:"#aaa", fontFamily:"DM Mono,monospace", marginBottom:16 }}>{post.readTime}</p>
        <div className="card" style={{ marginTop:16 }}>
          <p style={{ fontSize:15, color:"#444", lineHeight:1.85, marginBottom:16, fontStyle:"italic", borderLeft:`3px solid ${BLUE}`, paddingLeft:14 }}>{post.intro}</p>
          {post.body.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize:14, color:"#555", lineHeight:1.85, marginBottom:14 }}>{para}</p>
          ))}
        </div>
        <BottomAdUnit />
        <SiteFooter onNavigate={(p) => { if(p==="blog"){setArticle(null);setTimeout(()=>{const el=document.querySelector(".main-scroll");if(el)el.scrollTop=0;window.scrollTo(0,0);},0);}else if(onNavigate)onNavigate(p); }} />
      </div>
    );
  }

  return (
    <div>
      <div style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".08em", marginBottom:4, textTransform:"uppercase" }}>Blog</div>
      <h1 style={{ fontSize:22, fontWeight:600, marginBottom:16 }}>Conversion Guides</h1>
      <div style={{ marginTop:16 }}>
        {BLOG_POSTS.map((post, i) => (
          <div key={post.slug} className="card" style={{ cursor:"pointer", marginBottom:10 }}
            onClick={() => { setArticle(post.slug); setTimeout(()=>{ const el=document.querySelector(".main-scroll"); if(el) el.scrollTop=0; window.scrollTo(0,0); },0); }}>
            <div style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".06em", textTransform:"uppercase", marginBottom:4 }}>{post.category}</div>
            <div style={{ fontSize:15, fontWeight:600, color:"#1a1a1a", marginBottom:6, lineHeight:1.35 }}>{post.title}</div>
            <div style={{ fontSize:13, color:"#666", lineHeight:1.65, marginBottom:10 }}>{post.intro}</div>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:"#aaa", fontFamily:"DM Mono,monospace" }}>{post.readTime}</span>
              <span style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace" }}>Read article →</span>
            </div>
          </div>
        ))}
      </div>
      <BottomAdUnit />
      <SiteFooter onNavigate={onNavigate} />
    </div>
  );
}

// ── SITE FOOTER ────────────────────────────────────────────────────────
const FOOTER_LINKS = [
  { label:"Blog",           icon:"ti-pencil",       page:"blog" },
  { label:"Advertising",    icon:"ti-speakerphone",  page:"advertising" },
  { label:"About Us",       icon:"ti-info-circle",   page:"about" },
  { label:"Privacy Policy", icon:"ti-shield",        page:"privacy" },
];

function SiteFooter({ onNavigate }) {
  return (
    <div style={{ marginTop:40, paddingTop:24, borderTop:"1.5px solid #e0e4ed" }}>
      <div style={{ display:"flex", flexWrap:"wrap", gap:8, justifyContent:"center", marginBottom:16 }}>
        {FOOTER_LINKS.map(l => (
          <button key={l.page} onClick={() => onNavigate(l.page)}
            style={{ display:"inline-flex", alignItems:"center", gap:6, padding:"7px 14px", background:"#f7f8fa", border:"1.5px solid #e0e4ed", borderRadius:6, cursor:"pointer", fontSize:12, color:"#555", fontFamily:"DM Sans", transition:"all .15s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor=BLUE; e.currentTarget.style.color=BLUE; e.currentTarget.style.background="#eff6ff"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor="#e0e4ed"; e.currentTarget.style.color="#555"; e.currentTarget.style.background="#f7f8fa"; }}>
            <i className={`ti ${l.icon}`} />
            {l.label}
          </button>
        ))}
      </div>
      <div style={{ textAlign:"center", fontSize:11, color:"#ccc", fontFamily:"DM Mono,monospace" }}>
        © 2026 QUICKUNITS · quickunits.co.uk
      </div>
    </div>
  );
}

// ── SIDEBAR ─────────────────────────────────────────────────────────────
function SidebarContents({ activeTool, onSelectTool, onNavigate }) {
  return (
    <>
      <div style={{ padding:"16px 18px 8px", borderBottom:"1.5px solid #e0e4ed" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ width:30, height:30, background:BLUE, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <i className="ti ti-arrows-exchange" style={{ color:"#fff", fontSize:16 }} />
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, letterSpacing:".02em", color:"#1a1a1a", fontFamily:"DM Mono,monospace" }}>QUICKUNITS</div>
            <div style={{ fontSize:9, color:"#aaa", letterSpacing:".1em", textTransform:"uppercase" }}>UNIT CONVERSION TOOLS</div>
          </div>
        </div>
      </div>
      <div style={{ padding:"10px 0 6px" }}>
        <div style={{ fontSize:9, color:"#bbb", letterSpacing:".1em", textTransform:"uppercase", padding:"0 18px 6px", fontFamily:"DM Mono,monospace" }}>TOOLS</div>
        {TOOLS.map(tool => (
          <div key={tool.id} className={`sidebar-tool ${activeTool === tool.id ? "active" : ""}`}
            onClick={() => onSelectTool(tool.id)}>
            <i className={`ti ${tool.icon}`} style={{ fontSize:16, color: activeTool === tool.id ? BLUE : "#888", flexShrink:0 }} />
            <div>
              <div className="tool-label">{tool.label}</div>
              <div className="tool-desc">{tool.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <div style={{ padding:"8px 18px 6px", marginTop:8 }}>
        <div style={{ fontSize:9, color:"#bbb", letterSpacing:".1em", textTransform:"uppercase", marginBottom:6, fontFamily:"DM Mono,monospace" }}>POWERED BY</div>
        <div style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>Pure JavaScript · No AI needed</div>
      </div>
      <SidebarAdUnit />
    </>
  );
}

// ── APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTool, setActiveTool] = useState("length");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [page, setPage]             = useState(null);
  const isMobile                    = useIsMobile();

  const handleNav  = p => { setPage(p); setDrawerOpen(false); };
  const handleBack = () => setPage(null);

  const toolMeta = TOOL_META[activeTool] || {};
  const pageMeta = page ? PAGE_META[page] : null;
  const currentMeta = pageMeta || (page ? SITE_DEFAULT : toolMeta);
  useDocumentMeta(currentMeta.title || SITE_DEFAULT.title, currentMeta.desc || SITE_DEFAULT.desc);
  usePushState(pageMeta ? pageMeta.path : (toolMeta.path || "/"));

  useEffect(() => {
    const el = document.querySelector('.main-scroll');
    if (el) el.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [page, activeTool]);

  const handleSelectTool = t => { setActiveTool(t); setPage(null); setDrawerOpen(false); };

  return (
    <>
      <style>{styles}</style>
      <div style={{ display:"flex", minHeight:"100vh", background:"#f7f8fa" }}>

        {/* Desktop sidebar */}
        <div className="sidebar">
          <SidebarContents activeTool={activeTool} onSelectTool={handleSelectTool} onNavigate={handleNav} />
        </div>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="drawer" onClick={e => { if(e.target === e.currentTarget) setDrawerOpen(false); }}>
            <div className="drawer-panel">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"14px 16px", borderBottom:"1.5px solid #e0e4ed" }}>
                <span style={{ fontWeight:600, fontSize:13, fontFamily:"DM Mono,monospace" }}>QUICKUNITS</span>
                <button onClick={() => setDrawerOpen(false)} style={{ background:"none", border:"none", cursor:"pointer", fontSize:20, color:"#888" }}>×</button>
              </div>
              <SidebarContents activeTool={activeTool} onSelectTool={handleSelectTool} onNavigate={handleNav} />
            </div>
            <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          {/* Mobile header */}
          <div className="mobile-header">
            <div style={{ display:"flex", alignItems:"center", gap:10 }}>
              <div style={{ width:28, height:28, background:BLUE, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ti ti-arrows-exchange" style={{ color:"#fff", fontSize:14 }} />
              </div>
              <span style={{ fontWeight:700, fontSize:14, fontFamily:"DM Mono,monospace", color:"#1a1a1a" }}>QUICKUNITS</span>
            </div>
            <div style={{ display:"flex", alignItems:"center", gap:8 }}>
              <button onClick={() => handleNav("blog")} style={{ background:"none", border:"none", cursor:"pointer", fontSize:13, color:"#555", fontFamily:"DM Sans" }}>blog</button>
              <button onClick={() => setDrawerOpen(true)}
                style={{ background:BLUE, color:"#fff", border:"none", borderRadius:6, padding:"7px 14px", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"DM Sans" }}>
                Tools
              </button>
            </div>
          </div>

          {/* Content area */}
          <div className="main-scroll" style={{ flex:1, overflowY:"auto", padding:"28px 28px 48px" }}>
            {page ? (
              <>
                <InlineAdUnit />
                <div style={{ marginTop:24 }}>
                  {page==="blog"        && <BlogPage onNavigate={handleNav} />}
                  {page==="advertising" && <><AdvertisingPage /><BottomAdUnit /><SiteFooter onNavigate={handleNav} /></>}
                  
                  {page==="about"       && <><AboutPage /><BottomAdUnit /><SiteFooter onNavigate={handleNav} /></>}
                  {page==="privacy"     && <><PrivacyPage /><BottomAdUnit /><SiteFooter onNavigate={handleNav} /></>}
                </div>
              </>
            ) : (
              <>
                <InlineAdUnit />
                <div style={{ marginTop:24 }}>
                  <ConverterTool key={activeTool} toolId={activeTool} />
                  <BottomAdUnit />
                  <SiteFooter onNavigate={handleNav} />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
