import { useState, useEffect, useCallback, useContext, createContext } from "react";

// ── SITE ───────────────────────────────────────────────────────────────
export const SITE_URL  = "https://quickunits.co.uk";
const SITE_NAME = "QuickUnits";

// ── TOOLS ──────────────────────────────────────────────────────────────
const TOOLS = [
  { id: "length",      label: "Length",           icon: "ti-ruler",          desc: "Inches, cm, feet, metres & more" },
  { id: "weight",      label: "Weight & Mass",    icon: "ti-weight",         desc: "kg, lbs, stone, ounces & more" },
  { id: "temperature", label: "Temperature",      icon: "ti-temperature",    desc: "Celsius, Fahrenheit & Kelvin" },
  { id: "area",        label: "Area",             icon: "ti-square",         desc: "m², ft², acres, hectares & more" },
  { id: "volume",      label: "Volume & Liquid",  icon: "ti-droplet",        desc: "Litres, gallons, pints, cups & more" },
  { id: "speed",       label: "Speed",            icon: "ti-gauge",          desc: "mph, km/h, knots, m/s & more" },
  { id: "data",        label: "Data Storage",     icon: "ti-database",       desc: "Bytes, KB, MB, GB, TB & more" },
  { id: "cooking",     label: "Cooking",          icon: "ti-chef-hat",       desc: "Cups, tbsp, tsp, ml & grams" },
  { id: "currency",    label: "Number Bases",     icon: "ti-hash",           desc: "Binary, octal, decimal, hex" },
  { id: "time",        label: "Time",             icon: "ti-clock",          desc: "Seconds, minutes, hours, days & more" },
];

const BLUE = "#2563eb";

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
      { id: "gb",   label: "Gigabytes (GB)",     toBase: v => v * 1024**3,   fromBase: v => v / 1024**3 },
      { id: "tb",   label: "Terabytes (TB)",     toBase: v => v * 1024**4,   fromBase: v => v / 1024**4 },
      { id: "pb",   label: "Petabytes (PB)",     toBase: v => v * 1024**5,   fromBase: v => v / 1024**5 },
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

// One conversion engine used by the tool, the "all units" list and the
// static "common conversions" tables (so the tables can be pre-rendered).
const BASE_PATTERNS = { bin:/^[01]+$/, oct:/^[0-7]+$/, dec:/^\d+$/, hex:/^[0-9a-f]+$/i };
function convertValue(toolId, val, from, to) {
  const conv = CONVERSIONS[toolId];
  const fromObj = conv.units.find(u => u.id === from);
  const toObj   = conv.units.find(u => u.id === to);
  if (!fromObj || !toObj) return "";
  if (toolId === "currency") {
    // Number bases: keep the raw string so hex digits (A–F) work
    const s = String(val ?? "").trim();
    if (!s || !BASE_PATTERNS[from].test(s)) return "";
    return toObj.fromBase(fromObj.toBase(s));
  }
  const num = parseFloat(val);
  if (isNaN(num)) return "";
  const result = toObj.fromBase(fromObj.toBase(num));
  if (Math.abs(result) >= 1e9 || (Math.abs(result) < 0.0001 && result !== 0)) {
    return result.toExponential(4);
  }
  return parseFloat(result.toFixed(6)).toString();
}

// ── SEO: PER-PAGE META ─────────────────────────────────────────────────
// Titles ≤ 60 chars, descriptions 120–160 chars (checked at build time).
const TOOL_META = {
  length: {
    path:"/tools/length-converter", h1:"Length Converter",
    title:"Length Converter: cm, Inches, Feet, Metres | QuickUnits",
    desc:"Convert length instantly between millimetres, centimetres, metres, kilometres, inches, feet, yards and miles. Free, accurate and works on any device.",
    intro:"Convert any length or distance between metric and imperial units. Enter a value, choose your units and the result updates as you type. Every value uses the exact international definitions, such as 1 inch = 2.54 cm and 1 mile = 1,609.344 m.",
    common:[[1,"in","cm"],[1,"ft","m"],[1,"m","ft"],[1,"mi","km"],[1,"km","mi"],[10,"cm","in"],[100,"m","yd"],[1,"nmi","km"]],
  },
  weight: {
    path:"/tools/weight-converter", h1:"Weight Converter",
    title:"Weight Converter: kg, Pounds, Stone, Ounces | QuickUnits",
    desc:"Convert weight and mass instantly between kilograms, pounds, stone, ounces, grams and tonnes, including UK long tons and US short tons. Free and accurate.",
    intro:"Convert body weight, parcel weights or recipe quantities between metric and imperial units. Handy for UK stone-to-kg conversions as well as the US and UK versions of the ton.",
    common:[[1,"kg","lb"],[1,"lb","kg"],[1,"st","kg"],[1,"st","lb"],[1,"oz","g"],[100,"g","oz"],[1,"t","lb"],[1,"lton","t"]],
  },
  temperature: {
    path:"/tools/temperature-converter", h1:"Temperature Converter",
    title:"Temperature Converter: °C to °F and Kelvin | QuickUnits",
    desc:"Convert temperatures instantly between Celsius, Fahrenheit, Kelvin and Rankine. Ideal for weather, cooking, oven settings and science homework. Free.",
    intro:"Convert temperatures between Celsius, Fahrenheit, Kelvin and Rankine. The formulas used are °F = (°C × 9/5) + 32 and K = °C + 273.15.",
    common:[[0,"c","f"],[100,"c","f"],[37,"c","f"],[180,"c","f"],[-40,"c","f"],[98.6,"f","c"],[350,"f","c"],[0,"k","c"]],
  },
  area: {
    path:"/tools/area-converter", h1:"Area Converter",
    title:"Area Converter: m², ft², Acres, Hectares | QuickUnits",
    desc:"Convert area instantly between square metres, square feet, square yards, acres, hectares, km² and square miles. Free area and land measurement converter.",
    intro:"Work out floor space, garden sizes or land areas in whichever unit you need. Covers everyday units such as square feet and square metres as well as land units like acres and hectares.",
    common:[[1,"ac","m2"],[1,"ha","ac"],[1,"m2","ft2"],[100,"ft2","m2"],[1,"yd2","m2"],[1,"km2","mi2"],[1,"mi2","ac"]],
  },
  volume: {
    path:"/tools/volume-converter", h1:"Volume Converter",
    title:"Volume Converter: Litres, Gallons, Pints, Cups | QuickUnits",
    desc:"Convert liquid volume instantly between litres, millilitres, UK and US gallons, pints, cups, fluid ounces and cubic metres. Free and accurate converter.",
    intro:"Convert liquid volumes between metric, UK imperial and US customary units. UK and US pints and gallons are different sizes, so both are listed separately.",
    common:[[1,"l","ukpt"],[1,"ukpt","ml"],[1,"ukgal","l"],[1,"gal","l"],[1,"l","gal"],[1,"cup","ml"],[1,"floz","ml"],[1,"tbsp","ml"]],
  },
  speed: {
    path:"/tools/speed-converter", h1:"Speed Converter",
    title:"Speed Converter: mph, km/h, Knots, m/s | QuickUnits",
    desc:"Convert speed instantly between miles per hour, kilometres per hour, knots, metres per second, feet per second and Mach. Free, fast speed converter.",
    intro:"Convert speeds used on the road, at sea, in the air and in science. As a quick rule of thumb, 60 mph is roughly 100 km/h, and 1 knot is exactly 1.852 km/h.",
    common:[[1,"mph","kmh"],[1,"kmh","mph"],[70,"mph","kmh"],[100,"kmh","mph"],[1,"kt","kmh"],[1,"ms","kmh"],[1,"mach","mph"]],
  },
  data: {
    path:"/tools/data-converter", h1:"Data Storage Converter",
    title:"Data Storage Converter: KB, MB, GB, TB | QuickUnits",
    desc:"Convert data storage instantly between bits, bytes, kilobytes, megabytes, gigabytes, terabytes and petabytes. Free converter using binary (1,024) units.",
    intro:"Convert file sizes and storage capacities between bits, bytes and their multiples. This converter uses binary units, where 1 KB = 1,024 bytes, matching how most operating systems report memory.",
    common:[[1,"gb","mb"],[1,"tb","gb"],[1,"mb","kb"],[1,"b","bit"],[500,"gb","tb"],[1,"pb","tb"]],
  },
  cooking: {
    path:"/tools/cooking-converter", h1:"Cooking Measurement Converter",
    title:"Cooking Converter: Cups, Tbsp, ml and Grams | QuickUnits",
    desc:"Convert recipe measurements instantly between cups, tablespoons, teaspoons, fluid ounces, millilitres, grams, ounces and pounds. Free cooking converter.",
    intro:"Convert recipe quantities between US cups and spoons and metric measures. Conversions between volume and weight assume the density of water (1 ml = 1 g), so check dry ingredients like flour and sugar separately.",
    common:[[1,"cup","ml"],[1,"tbsp","ml"],[1,"tsp","ml"],[1,"floz","ml"],[1,"oz","g"],[1,"lb","g"],[100,"g","oz"]],
  },
  currency: {
    path:"/tools/number-base-converter", h1:"Number Base Converter",
    title:"Number Base Converter: Binary, Hex, Decimal | QuickUnits",
    desc:"Convert numbers instantly between binary, octal, decimal and hexadecimal. A free number base converter for programmers, students and electronics work.",
    intro:"Convert whole numbers between binary (base 2), octal (base 8), decimal (base 10) and hexadecimal (base 16). Hex input accepts the digits 0–9 and A–F.",
    common:[["255","dec","hex"],["255","dec","bin"],["FF","hex","dec"],["1010","bin","dec"],["777","oct","dec"],["100","dec","oct"]],
  },
  time: {
    path:"/tools/time-converter", h1:"Time Converter",
    title:"Time Converter: Seconds, Minutes, Hours, Days | QuickUnits",
    desc:"Convert time instantly between nanoseconds, milliseconds, seconds, minutes, hours, days, weeks, months and years. A free, accurate time unit converter.",
    intro:"Convert durations between units from nanoseconds to years. Months and years use average lengths (a year of 365.25 days), so results are approximate for calendar dates.",
    common:[[1,"hr","min"],[90,"min","hr"],[1,"day","hr"],[1,"day","s"],[1,"wk","day"],[1,"yr","day"],[1,"yr","wk"],[1000,"ms","s"]],
  },
};

const PAGE_META = {
  blog:    { path:"/blog",    h1:"Unit Conversion Guides", title:"Unit Conversion Guides & Explainers | QuickUnits",
             desc:"Plain-English guides to unit conversions: metric vs imperial, temperature scales, cooking measures, data storage, speed, weight and number bases." },
  about:   { path:"/about",   h1:"About QuickUnits",        title:"About QuickUnits: Free Unit Conversion Tools",
             desc:"QuickUnits is a free, fast unit conversion toolkit for everyday use. Every conversion runs instantly in your browser, with nothing to install or sign up for." },
  contact: { path:"/contact", h1:"Contact QuickUnits",      title:"Contact QuickUnits: Feedback and Suggestions",
             desc:"Get in touch with QuickUnits to suggest a new converter, report an error, share feedback or ask about partnerships. We read every message we receive." },
  privacy: { path:"/privacy", h1:"Privacy Policy",          title:"Privacy Policy | QuickUnits",
             desc:"How QuickUnits handles your data: conversions run in your browser and are never stored. Details on analytics, cookies and your rights under UK GDPR." },
  terms:   { path:"/terms",   h1:"Terms of Service",        title:"Terms of Service | QuickUnits",
             desc:"The terms that apply when you use the free QuickUnits unit conversion tools, including the accuracy of results, limitation of liability and governing law." },
};

const HOME_META = {
  path:"/", h1:"Free Online Unit Converters",
  title:"QuickUnits: Free Online Unit Converters",
  desc:"Free, instant unit converters for length, weight, temperature, area, volume, speed, data, cooking, time and number bases. No sign-up, works on any device.",
};
const NOT_FOUND_META = {
  title:"Page Not Found | QuickUnits",
  desc:"Sorry, we couldn't find that page. Browse all of the free QuickUnits converters for length, weight, temperature, volume, speed, data and more.",
};
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

// Search titles/descriptions for each article (the on-page H1 stays the full title)
const BLOG_SEO = {
  "metric-vs-imperial":           { title:"Metric vs Imperial: Why Two Systems Still Exist | QuickUnits", desc:"Why the US, Liberia and Myanmar never fully went metric, how the imperial system survives, and the key conversions to know when working across both." },
  "temperature-scales-explained": { title:"Celsius, Fahrenheit and Kelvin Explained | QuickUnits",        desc:"What the Celsius, Fahrenheit and Kelvin scales are, where they came from, how to convert between them and when each one is actually used." },
  "cooking-conversions-guide":    { title:"Cooking Measurement Conversions Guide | QuickUnits",           desc:"How to convert cups, tablespoons, grams and millilitres in recipes, why volume and weight differ, plus UK vs US measures and oven temperatures." },
  "data-storage-explained":       { title:"Bytes, KB, MB, GB and TB Explained | QuickUnits",              desc:"How bits, bytes, kilobytes, megabytes and gigabytes relate, why a 1TB drive shows as 931GB, and the difference between SI and binary units." },
  "speed-conversions-guide":      { title:"mph, km/h, Knots and Mach Explained | QuickUnits",             desc:"Why drivers, pilots and sailors use different speed units, how mph, km/h, knots, m/s and Mach compare, and quick rules for converting them." },
  "imperial-to-metric-cheatsheet":{ title:"Imperial to Metric Conversion Cheat Sheet | QuickUnits",       desc:"A quick-reference cheat sheet of the most useful imperial to metric conversions for length, weight, volume, temperature and speed, all in one place." },
  "number-bases-explained":       { title:"Binary, Octal, Decimal and Hex Explained | QuickUnits",        desc:"How binary, octal, decimal and hexadecimal number bases work, why computers use binary and programmers use hex, with simple worked examples." },
  "weight-measurement-guide":     { title:"kg, Pounds, Stone and Tons Explained | QuickUnits",            desc:"A clear guide to kilograms, pounds, stone and the three kinds of ton: where each unit is used, how they relate and how to convert between them." },
};

// ── ROUTING ────────────────────────────────────────────────────────────
function normalisePath(p) {
  const path = String(p || "/").split(/[?#]/)[0].replace(/\/+$/, "");
  return path || "/";
}

function parsePath(pathname) {
  const path = normalisePath(pathname);
  if (path === "/") return { type:"home" };
  const toolId = Object.keys(TOOL_META).find(id => TOOL_META[id].path === path);
  if (toolId) return { type:"tool", id:toolId };
  const pageId = Object.keys(PAGE_META).find(id => PAGE_META[id].path === path);
  if (pageId) return { type:"page", id:pageId };
  const m = path.match(/^\/blog\/([^/]+)$/);
  if (m && BLOG_POSTS.some(p => p.slug === m[1])) return { type:"article", id:m[1] };
  return { type:"404" };
}

// Every indexable URL — used by the pre-renderer and the sitemap
export const ROUTES = [
  "/",
  ...TOOLS.map(t => TOOL_META[t.id].path),
  "/blog",
  ...BLOG_POSTS.map(p => `/blog/${p.slug}`),
  "/about", "/contact", "/privacy", "/terms",
];

// ── STRUCTURED DATA + HEAD TAGS ────────────────────────────────────────
const PUBLISHER = { "@type":"Organization", name:SITE_NAME, url:SITE_URL };
function breadcrumbLd(items) {
  return {
    "@context":"https://schema.org", "@type":"BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type":"ListItem", position:i+1, name:it.name, item:SITE_URL + (it.path === "/" ? "/" : it.path) })),
  };
}

export function getMeta(pathname) {
  const route = parsePath(pathname);
  const home = { name:"Home", path:"/" };
  if (route.type === "home") {
    return { ...HOME_META, canonical:SITE_URL + "/", ogType:"website", jsonLd:[
      { "@context":"https://schema.org", "@type":"WebSite", name:SITE_NAME, alternateName:"QuickUnits.co.uk", url:SITE_URL + "/", publisher:PUBLISHER },
      { "@context":"https://schema.org", "@type":"ItemList", name:"Unit converters",
        itemListElement: TOOLS.map((t, i) => ({ "@type":"ListItem", position:i+1, name:TOOL_META[t.id].h1, url:SITE_URL + TOOL_META[t.id].path })) },
    ]};
  }
  if (route.type === "tool") {
    const m = TOOL_META[route.id];
    return { ...m, canonical:SITE_URL + m.path, ogType:"website", jsonLd:[
      { "@context":"https://schema.org", "@type":"WebApplication", name:m.h1, url:SITE_URL + m.path, description:m.desc,
        applicationCategory:"UtilitiesApplication", operatingSystem:"Any", browserRequirements:"Requires JavaScript",
        offers:{ "@type":"Offer", price:"0", priceCurrency:"GBP" }, publisher:PUBLISHER },
      breadcrumbLd([home, { name:m.h1, path:m.path }]),
    ]};
  }
  if (route.type === "page") {
    const m = PAGE_META[route.id];
    return { ...m, canonical:SITE_URL + m.path, ogType:"website", jsonLd:[ breadcrumbLd([home, { name:m.h1, path:m.path }]) ] };
  }
  if (route.type === "article") {
    const post = BLOG_POSTS.find(p => p.slug === route.id);
    const seo = BLOG_SEO[post.slug];
    const path = `/blog/${post.slug}`;
    return { path, h1:post.title, title:seo.title, desc:seo.desc, canonical:SITE_URL + path, ogType:"article", jsonLd:[
      { "@context":"https://schema.org", "@type":"Article", headline:post.title, description:seo.desc,
        articleSection:post.category, mainEntityOfPage:SITE_URL + path, author:PUBLISHER, publisher:PUBLISHER },
      breadcrumbLd([home, { name:"Blog", path:"/blog" }, { name:post.title, path }]),
    ]};
  }
  return { ...NOT_FOUND_META, canonical:null, robots:"noindex, follow", jsonLd:[] };
}

// Keeps <head> in sync on client-side navigation (pre-rendered HTML sets it on first load)
function useDocumentMeta(meta) {
  useEffect(() => {
    document.title = meta.title;
    const set = (selector, attr, value, create) => {
      let el = document.head.querySelector(selector);
      if (!value) { if (el) el.remove(); return; }
      if (!el) { el = create(); document.head.appendChild(el); }
      el.setAttribute(attr, value);
    };
    const mk = (tag, attrs) => () => { const el = document.createElement(tag); Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v)); return el; };
    set('meta[name="description"]', "content", meta.desc, mk("meta", { name:"description" }));
    set('link[rel="canonical"]', "href", meta.canonical, mk("link", { rel:"canonical" }));
    set('meta[name="robots"]', "content", meta.robots, mk("meta", { name:"robots" }));
    set('meta[property="og:title"]', "content", meta.title, mk("meta", { property:"og:title" }));
    set('meta[property="og:description"]', "content", meta.desc, mk("meta", { property:"og:description" }));
    set('meta[property="og:url"]', "content", meta.canonical, mk("meta", { property:"og:url" }));
  }, [meta.title, meta.desc, meta.canonical, meta.robots]);
}

// ── CLIENT-SIDE NAVIGATION ─────────────────────────────────────────────
// Real <a href> links (crawlable by Google) that navigate without a page reload.
const NavContext = createContext(() => {});
function Link({ to, children, onClick, ...rest }) {
  const navigate = useContext(NavContext);
  return (
    <a href={to} {...rest} onClick={e => {
      if (onClick) onClick(e);
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      e.preventDefault();
      navigate(to);
    }}>{children}</a>
  );
}

// ── STYLES ─────────────────────────────────────────────────────────────
// Fonts and icon CSS are loaded via <link> tags in index.html.
const styles = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { -webkit-text-size-adjust: 100%; }
  body, #root { background: #f7f8fa; color: #1a1a1a; font-family: 'DM Sans', sans-serif; }
  a { color: inherit; }
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
  a.card { display: block; text-decoration: none; color: inherit; }

  .eyebrow { font-size: 11px; color: #2563eb; font-family: 'DM Mono', monospace; letter-spacing: .08em; margin-bottom: 4px; text-transform: uppercase; }
  .h1 { font-size: 22px; font-weight: 600; color: #1a1a1a; margin-bottom: 4px; line-height: 1.3; }
  .h2 { font-size: 15px; font-weight: 600; color: #1a1a1a; margin: 28px 0 12px; }
  .lead { font-size: 14px; color: #666; line-height: 1.7; }
  .body-p { font-size: 14px; color: #555; line-height: 1.8; }

  .crumbs { display: flex; flex-wrap: wrap; gap: 6px; font-size: 11px; font-family: 'DM Mono', monospace; letter-spacing: .06em; text-transform: uppercase; color: #aaa; margin-bottom: 6px; list-style: none; }
  .crumbs a { color: #2563eb; text-decoration: none; }
  .crumbs a:hover { text-decoration: underline; }
  .crumbs li + li::before { content: "/"; margin-right: 6px; color: #ccc; }

  .btn-ghost {
    background: transparent; border: 1.5px solid #e0e4ed; color: #666;
    padding: 7px 14px; font-size: 12px; font-family: 'DM Sans'; border-radius: 6px; text-decoration: none;
    cursor: pointer; transition: all .15s; display: inline-flex; align-items: center; gap: 6px;
  }
  .btn-ghost:hover { border-color: #2563eb; color: #2563eb; }

  .copy-btn {
    background: #f0f4ff; border: 1.5px solid #c7d7fc; color: #2563eb;
    padding: 5px 12px; font-size: 11px; font-family: 'DM Mono'; border-radius: 5px;
    cursor: pointer; transition: all .15s; letter-spacing: .04em;
  }
  .copy-btn:hover { background: #2563eb; color: #fff; }

  .swap-btn { background: #f0f4ff; border: 1.5px solid #c7d7fc; border-radius: 8px; width: 40px; height: 40px; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all .15s; color: #2563eb; font-size: 16px; }
  .swap-btn:hover { background: #2563eb; color: #fff; }

  .result-row {
    display: flex; align-items: center; justify-content: space-between;
    padding: 10px 14px; background: #f7f8fa; border: 1.5px solid #e0e4ed;
    border-radius: 7px; margin-bottom: 8px; transition: border-color .15s;
  }
  .result-row:hover { border-color: #2563eb; background: #f0f4ff; }
  .result-row.highlighted { border-color: #2563eb; background: #eff6ff; }

  .conv-table { width: 100%; border-collapse: collapse; font-size: 13px; }
  .conv-table th, .conv-table td { text-align: left; padding: 9px 12px; border-bottom: 1px solid #eef0f5; }
  .conv-table th { font-size: 11px; color: #888; font-family: 'DM Mono', monospace; letter-spacing: .04em; text-transform: uppercase; font-weight: 500; }
  .conv-table td.num { font-family: 'DM Mono', monospace; color: #1a1a1a; }
  .conv-table tr:last-child td { border-bottom: none; }

  .chip { display: inline-flex; align-items: center; gap: 6px; padding: 7px 14px; background: #f7f8fa; border: 1.5px solid #e0e4ed; border-radius: 6px; font-size: 12px; color: #555; text-decoration: none; transition: all .15s; }
  .chip:hover { border-color: #2563eb; color: #2563eb; background: #eff6ff; }
  .chips { display: flex; flex-wrap: wrap; gap: 8px; }

  .tool-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 10px; }
  .tool-card { display: flex; align-items: center; gap: 12px; padding: 14px 16px; background: #fff; border: 1.5px solid #e0e4ed; border-radius: 8px; text-decoration: none; color: inherit; transition: all .15s; }
  .tool-card:hover { border-color: #2563eb; background: #f7faff; }
  .tool-card i { font-size: 20px; color: #2563eb; width: 36px; height: 36px; border-radius: 8px; background: #eff6ff; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }

  .guide-link { display: flex; justify-content: space-between; gap: 12px; align-items: baseline; padding: 11px 14px; background: #fff; border: 1.5px solid #e0e4ed; border-radius: 7px; margin-bottom: 8px; text-decoration: none; color: inherit; transition: border-color .15s; }
  .guide-link:hover { border-color: #2563eb; }

  /* Sidebar */
  .sidebar { width: 324px; background: #fff; border-right: 1.5px solid #e0e4ed; display: flex; flex-direction: column; flex-shrink: 0; overflow-y: auto; height: 100vh; position: sticky; top: 0; }
  .sidebar-tool { display: flex; align-items: center; gap: 12px; padding: 11px 18px; cursor: pointer; border-left: 3px solid transparent; transition: all .15s; text-decoration: none; color: inherit; }
  .sidebar-tool:hover { background: #f7f8fa; }
  .sidebar-tool.active { background: #eff6ff; border-left-color: #2563eb; }
  .sidebar-tool.active .tool-label { color: #2563eb; font-weight: 600; }
  .tool-label { font-size: 13px; color: #1a1a1a; font-weight: 500; }
  .tool-desc  { font-size: 11px; color: #888; margin-top: 1px; }

  /* Mobile header */
  .mobile-header { display: none; background: #fff; border-bottom: 1.5px solid #e0e4ed; padding: 12px 16px; position: sticky; top: 0; z-index: 100; }

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

// Visible breadcrumb trail (mirrors the BreadcrumbList structured data)
function Crumbs({ items }) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="crumbs">
        {items.map((it, i) => (
          <li key={i}>{it.path && i < items.length - 1 ? <Link to={it.path}>{it.name}</Link> : <span>{it.name}</span>}</li>
        ))}
      </ol>
    </nav>
  );
}

// Standard page header: breadcrumb, H1, optional sub-line
function PageHeader({ crumbs, h1, sub }) {
  return (
    <div style={{ marginBottom:16 }}>
      <Crumbs items={crumbs} />
      <h1 className="h1">{h1}</h1>
      {sub && <p style={{ fontSize:13, color:"#888" }}>{sub}</p>}
    </div>
  );
}

// ── ADS ────────────────────────────────────────────────────────────────
// All ad units removed for now (Nov 2026). Placement reference for later:
//   • top banner    — above the page header on every page
//   • bottom banner — above the site footer on every page
//   • sidebar MPU   — bottom of the desktop sidebar / mobile drawer

// ── CONVERTER TOOL ─────────────────────────────────────────────────────
function ConverterTool({ toolId }) {
  const conv = CONVERSIONS[toolId];
  const meta = TOOL_META[toolId];
  const isBase = toolId === "currency";
  const [fromUnit, setFromUnit] = useState(conv.units[0].id);
  const [toUnit, setToUnit] = useState(conv.units[1].id);
  const [inputVal, setInputVal] = useState("1");
  const [showAll, setShowAll] = useState(false);

  const fromUnitObj = conv.units.find(u => u.id === fromUnit);
  const toUnitObj   = conv.units.find(u => u.id === toUnit);
  const convert = useCallback((val, from, to) => convertValue(toolId, val, from, to), [toolId]);
  const result = convert(inputVal, fromUnit, toUnit);
  const swap = () => { setFromUnit(toUnit); setToUnit(fromUnit); setInputVal(result || "1"); };

  return (
    <div>
      <PageHeader crumbs={[{ name:"Home", path:"/" }, { name:meta.h1 }]} h1={meta.h1}
        sub={`Convert between ${conv.units.slice(0,4).map(u => u.label).join(", ")} and more`} />

      {/* Main converter */}
      <div className="card" style={{ marginTop:16 }}>
        <div className="ab-cols" style={{ display:"grid", gridTemplateColumns:"1fr auto 1fr", gap:12, alignItems:"end", marginBottom:16 }}>
          {/* From */}
          <div>
            <label htmlFor="qu-from" style={{ display:"block", fontSize:11, color:"#888", marginBottom:6, fontFamily:"DM Mono,monospace", letterSpacing:".04em" }}>FROM</label>
            <select id="qu-from" value={fromUnit} onChange={e => setFromUnit(e.target.value)}
              style={{ width:"100%", padding:"8px 10px", marginBottom:8 }}>
              {conv.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
            <input type={isBase ? "text" : "number"} inputMode={isBase ? "text" : "decimal"} aria-label={`Value in ${fromUnitObj?.label}`}
              value={inputVal} onChange={e => setInputVal(e.target.value)} autoCapitalize="off" spellCheck={false}
              style={{ width:"100%", padding:"10px 12px", fontSize:18, fontWeight:600, fontFamily:"DM Mono,monospace" }} />
          </div>

          {/* Swap */}
          <div style={{ paddingBottom:4 }}>
            <button className="swap-btn" onClick={swap} aria-label="Swap units">⇄</button>
          </div>

          {/* To */}
          <div>
            <label htmlFor="qu-to" style={{ display:"block", fontSize:11, color:"#888", marginBottom:6, fontFamily:"DM Mono,monospace", letterSpacing:".04em" }}>TO</label>
            <select id="qu-to" value={toUnit} onChange={e => setToUnit(e.target.value)}
              style={{ width:"100%", padding:"8px 10px", marginBottom:8 }}>
              {conv.units.map(u => <option key={u.id} value={u.id}>{u.label}</option>)}
            </select>
            <div aria-live="polite" style={{ background:"#eff6ff", border:"1.5px solid #c7d7fc", borderRadius:6, padding:"10px 12px", fontSize:18, fontWeight:600, fontFamily:"DM Mono,monospace", color:BLUE, minHeight:42 }}>
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
          <h2 style={{ fontSize:13, fontWeight:600, color:"#1a1a1a" }}>
            {inputVal || "1"} {fromUnitObj?.label} in all units
          </h2>
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
                <div style={{ fontFamily:"DM Mono,monospace", fontSize:14, fontWeight:600, color: unit.id === toUnit ? BLUE : "#1a1a1a" }}>{val || "—"}</div>
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

// Static, crawlable content under each tool: explainer, common conversions, related tools
function ToolInfo({ toolId }) {
  const meta = TOOL_META[toolId];
  const conv = CONVERSIONS[toolId];
  const label = u => conv.units.find(x => x.id === u)?.label || u;
  const noun = meta.h1.replace(/ Converter$/, "").toLowerCase();
  return (
    <section>
      <h2 className="h2">About the {meta.h1.toLowerCase()}</h2>
      <div className="card"><p className="body-p">{meta.intro}</p></div>

      <h2 className="h2">Common {noun} conversions</h2>
      <div className="card" style={{ padding:"6px 8px", overflowX:"auto" }}>
        <table className="conv-table">
          <thead><tr><th>From</th><th>Equals</th></tr></thead>
          <tbody>
            {meta.common.map(([v, from, to], i) => (
              <tr key={i}>
                <td className="num">{v} {label(from)}</td>
                <td className="num">{convertValue(toolId, v, from, to)} {label(to)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <h2 className="h2">Other converters</h2>
      <div className="chips">
        {TOOLS.filter(t => t.id !== toolId).map(t => (
          <Link key={t.id} to={TOOL_META[t.id].path} className="chip"><i className={`ti ${t.icon}`} aria-hidden="true" />{TOOL_META[t.id].h1}</Link>
        ))}
      </div>
    </section>
  );
}

// ── HOME PAGE ──────────────────────────────────────────────────────────
function HomePage() {
  return (
    <div>
      <div style={{ marginBottom:20 }}>
        <div className="eyebrow">Free · Instant · No sign-up</div>
        <h1 className="h1" style={{ fontSize:26 }}>{HOME_META.h1}</h1>
        <p className="lead" style={{ maxWidth:640 }}>
          QuickUnits is a set of fast, accurate unit converters for everyday use. Pick a tool below to convert length, weight,
          temperature, volume and more. Every conversion runs instantly in your browser.
        </p>
      </div>

      <h2 className="h2">Conversion tools</h2>
      <div className="tool-grid">
        {TOOLS.map(t => (
          <Link key={t.id} to={TOOL_META[t.id].path} className="tool-card">
            <i className={`ti ${t.icon}`} aria-hidden="true" />
            <span>
              <span className="tool-label" style={{ display:"block" }}>{TOOL_META[t.id].h1}</span>
              <span className="tool-desc" style={{ display:"block" }}>{t.desc}</span>
            </span>
          </Link>
        ))}
      </div>

      <h2 className="h2">Conversion guides</h2>
      {BLOG_POSTS.map(p => (
        <Link key={p.slug} to={`/blog/${p.slug}`} className="guide-link">
          <span style={{ fontSize:13, fontWeight:500 }}>{p.title}</span>
          <span style={{ fontSize:11, color:"#aaa", fontFamily:"DM Mono,monospace", whiteSpace:"nowrap" }}>{p.readTime}</span>
        </Link>
      ))}
      <div style={{ marginTop:10 }}><Link to="/blog" className="btn-ghost">All guides →</Link></div>

      <h2 className="h2">Information</h2>
      <div className="chips">
        {INFO_LINKS.map(l => (
          <Link key={l.to} to={l.to} className="chip"><i className={`ti ${l.icon}`} aria-hidden="true" />{l.label}</Link>
        ))}
      </div>
    </div>
  );
}

// ── INFO PAGES ─────────────────────────────────────────────────────────
function NumberedCards({ sections }) {
  return sections.map((sec, i) => (
    <div key={i} className="card" style={{ marginTop:i===0?16:0 }}>
      <h2 style={{ fontSize:13, fontWeight:600, color:BLUE, fontFamily:"DM Mono,monospace", letterSpacing:".04em", marginBottom:8, textTransform:"uppercase" }}>{String(i+1).padStart(2,"0")} — {sec.title}</h2>
      {sec.body.split("\n\n").map((para, j, arr) => (
        <p key={j} className="body-p" style={{ marginBottom: j < arr.length-1 ? 10 : 0 }}>{para}</p>
      ))}
    </div>
  ));
}

function AboutPage() {
  return (
    <div>
      <PageHeader crumbs={[{ name:"Home", path:"/" }, { name:"About" }]} h1={PAGE_META.about.h1} />
      <div className="card" style={{ marginTop:16 }}>
        <p className="body-p" style={{ marginBottom:12 }}>QuickUnits is a free unit conversion toolkit built for everyday use. Whether you're cooking, travelling, coding or doing science homework, QuickUnits gives you fast, accurate conversions across ten categories of measurement.</p>
        <p className="body-p" style={{ marginBottom:12 }}>All conversions happen instantly in your browser — no server required, no data stored. We don't track your conversions and we never will.</p>
        <p className="body-p">QuickUnits is free to use. If you find it useful, sharing it with someone who needs it is the best way to support us.</p>
      </div>
    </div>
  );
}

function ContactPage() {
  return (
    <div>
      <PageHeader crumbs={[{ name:"Home", path:"/" }, { name:"Contact" }]} h1={PAGE_META.contact.h1}
        sub="We'd love to hear from you · contact.jwgroup@proton.me" />
      <NumberedCards sections={[
        { title:"General Enquiries", body:"Have a suggestion for a new unit converter, spotted an error or want to give feedback? We'd love to hear from you. Email us at contact.jwgroup@proton.me and we'll get back to you as soon as possible." },
        { title:"Advertising & Partnerships", body:"QuickUnits attracts a broad audience of students, professionals, engineers and everyday users who need fast, reliable unit conversions. We welcome enquiries from education platforms, productivity tools, engineering software and other relevant services. Contact us at contact.jwgroup@proton.me to discuss opportunities." },
      ]} />
    </div>
  );
}

function TermsPage() {
  return (
    <div>
      <PageHeader crumbs={[{ name:"Home", path:"/" }, { name:"Terms" }]} h1={PAGE_META.terms.h1} sub="Last updated: November 2026 · quickunits.co.uk" />
      <NumberedCards sections={[
        { title:"Acceptance of Terms", body:"By using QuickUnits (quickunits.co.uk) you agree to these Terms of Service. If you do not agree, please do not use our website." },
        { title:"Use of Tools", body:"QuickUnits provides free unit conversion tools for personal and professional use. You may not resell or redistribute access to our tools without written permission." },
        { title:"Accuracy of Conversions", body:"Our conversion tools are provided in good faith for informational purposes. While we strive for accuracy, conversion results should be verified before use in professional, medical, legal or engineering contexts. We accept no liability for errors in conversion results." },
        { title:"Advertising", body:"QuickUnits may display third-party advertisements. We are not responsible for the content of third-party advertisements or the websites they link to." },
        { title:"Intellectual Property", body:"QuickUnits and all associated tools, branding and original content are the intellectual property of JW Group. All rights reserved." },
        { title:"Limitation of Liability", body:"QuickUnits and its operators shall not be liable for any damages arising from your use of our tools or website, including damages resulting from errors in conversion calculations." },
        { title:"Changes to Terms", body:"We may update these terms at any time. Continued use of QuickUnits constitutes acceptance of any revised terms." },
        { title:"Governing Law", body:"These terms are governed by the laws of England and Wales." },
        { title:"Contact", body:"If you have any questions about these Terms of Service, please contact us at contact.jwgroup@proton.me." },
      ]} />
    </div>
  );
}

function PrivacyPage() {
  return (
    <div>
      <PageHeader crumbs={[{ name:"Home", path:"/" }, { name:"Privacy" }]} h1={PAGE_META.privacy.h1} sub="Effective November 2026 · quickunits.co.uk" />
      <NumberedCards sections={[
        { title:"Overview", body:"This Privacy Policy explains how QuickUnits collects, uses and protects information when you visit quickunits.co.uk. By using the site you agree to the practices described in this policy." },
        { title:"Information We Collect", body:"We do not require you to create an account or provide personal information to use QuickUnits. All conversions happen entirely in your browser — conversion data is never sent to our servers." },
        { title:"Third-Party Services", body:"We use Google Analytics to understand how the site is used in aggregate, such as which converters are most popular. Google Analytics may set cookies to do this.\n\nWe may display third-party advertising in future. If we do, this policy will be updated to describe the advertising partners and the cookies they use." },
        { title:"Cookies", body:"Essential cookies are required for the site to function. Analytics cookies may be set by Google Analytics. You can control or delete cookies through your browser settings." },
        { title:"Your Rights", body:"Under UK GDPR you have the right to access, correct, or delete your personal data. To exercise these rights, contact us at contact.jwgroup@proton.me." },
        { title:"Contact", body:"If you have questions about this Privacy Policy, contact us at contact.jwgroup@proton.me. We are based in the United Kingdom." },
      ]} />
    </div>
  );
}

function NotFoundPage() {
  return (
    <div>
      <div className="eyebrow">404</div>
      <h1 className="h1">Page not found</h1>
      <p className="lead" style={{ marginBottom:20 }}>Sorry, we couldn't find that page. Try one of our converters instead.</p>
      <div className="chips">
        <Link to="/" className="chip"><i className="ti ti-home" aria-hidden="true" />Home</Link>
        {TOOLS.map(t => <Link key={t.id} to={TOOL_META[t.id].path} className="chip">{TOOL_META[t.id].h1}</Link>)}
      </div>
    </div>
  );
}

function BlogPage({ article }) {
  if (article) {
    const post = BLOG_POSTS.find(p => p.slug === article);
    if (!post) return null;
    return (
      <article>
        <PageHeader crumbs={[{ name:"Home", path:"/" }, { name:"Blog", path:"/blog" }, { name:post.category }]} h1={post.title} />
        <p style={{ fontSize:12, color:"#aaa", fontFamily:"DM Mono,monospace", marginTop:-10, marginBottom:16 }}>{post.readTime}</p>
        <div className="card" style={{ marginTop:16 }}>
          <p style={{ fontSize:15, color:"#444", lineHeight:1.85, marginBottom:16, fontStyle:"italic", borderLeft:`3px solid ${BLUE}`, paddingLeft:14 }}>{post.intro}</p>
          {post.body.split("\n\n").map((para, i) => (
            <p key={i} style={{ fontSize:14, color:"#555", lineHeight:1.85, marginBottom:14, whiteSpace:"pre-line" }}>{para}</p>
          ))}
        </div>
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          <Link to="/blog" className="btn-ghost">← All guides</Link>
          <Link to="/" className="btn-ghost">All converters</Link>
        </div>
      </article>
    );
  }

  return (
    <div>
      <PageHeader crumbs={[{ name:"Home", path:"/" }, { name:"Blog" }]} h1={PAGE_META.blog.h1}
        sub="Plain-English explainers on measurement systems and everyday conversions" />
      <div style={{ marginTop:16 }}>
        {BLOG_POSTS.map(post => (
          <Link key={post.slug} to={`/blog/${post.slug}`} className="card" style={{ marginBottom:10 }}>
            <div className="eyebrow" style={{ letterSpacing:".06em" }}>{post.category}</div>
            <h2 style={{ fontSize:15, fontWeight:600, color:"#1a1a1a", marginBottom:6, lineHeight:1.35 }}>{post.title}</h2>
            <p style={{ fontSize:13, color:"#666", lineHeight:1.65, marginBottom:10 }}>{post.intro}</p>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <span style={{ fontSize:11, color:"#aaa", fontFamily:"DM Mono,monospace" }}>{post.readTime}</span>
              <span style={{ fontSize:11, color:BLUE, fontFamily:"DM Mono,monospace" }}>Read article →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

// ── SITE FOOTER ────────────────────────────────────────────────────────
const INFO_LINKS = [
  { label:"About Us",         icon:"ti-info-circle",   to:"/about" },
  { label:"Contact",          icon:"ti-speakerphone",  to:"/contact" },
  { label:"Privacy Policy",   icon:"ti-shield",        to:"/privacy" },
  { label:"Terms of Service", icon:"ti-file-text",     to:"/terms" },
];
const FOOTER_LINKS = [
  { label:"Home", icon:"ti-home",   to:"/" },
  { label:"Blog", icon:"ti-pencil", to:"/blog" },
  ...INFO_LINKS,
];

function SiteFooter() {
  return (
    <footer style={{ marginTop:40, paddingTop:24, borderTop:"1.5px solid #e0e4ed" }}>
      <nav aria-label="Footer" className="chips" style={{ justifyContent:"center", marginBottom:16 }}>
        {FOOTER_LINKS.map(l => (
          <Link key={l.to} to={l.to} className="chip"><i className={`ti ${l.icon}`} aria-hidden="true" />{l.label}</Link>
        ))}
      </nav>
      <div style={{ textAlign:"center", fontSize:11, color:"#999", fontFamily:"DM Mono,monospace" }}>
        © 2026 QUICKUNITS · quickunits.co.uk
      </div>
    </footer>
  );
}

// ── BRAND LOGO (links to the homepage) ────────────────────────────────
function BrandLink({ children, style }) {
  return (
    <Link to="/" aria-label="QuickUnits home"
      style={{ display:"flex", alignItems:"center", gap:10, textDecoration:"none", color:"inherit", cursor:"pointer", ...style }}>
      {children}
    </Link>
  );
}

// ── SIDEBAR ─────────────────────────────────────────────────────────────
function SidebarContents({ activeTool, isHome }) {
  return (
    <>
      <div style={{ padding:"16px 18px 8px", borderBottom:"1.5px solid #e0e4ed" }}>
        <BrandLink>
          <div style={{ width:30, height:30, background:BLUE, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
            <i className="ti ti-arrows-exchange" style={{ color:"#fff", fontSize:16 }} aria-hidden="true" />
          </div>
          <div>
            <div style={{ fontWeight:700, fontSize:14, letterSpacing:".02em", color:"#1a1a1a", fontFamily:"DM Mono,monospace" }}>QUICKUNITS</div>
            <div style={{ fontSize:9, color:"#aaa", letterSpacing:".1em", textTransform:"uppercase" }}>UNIT CONVERSION TOOLS</div>
          </div>
        </BrandLink>
      </div>
      <nav aria-label="Converters" style={{ padding:"10px 0 6px" }}>
        <Link to="/" className={`sidebar-tool ${isHome ? "active" : ""}`}>
          <i className="ti ti-home" style={{ fontSize:16, color: isHome ? BLUE : "#888", flexShrink:0 }} aria-hidden="true" />
          <div><div className="tool-label">Home</div><div className="tool-desc">All tools, guides & info</div></div>
        </Link>
        <div style={{ fontSize:9, color:"#bbb", letterSpacing:".1em", textTransform:"uppercase", padding:"10px 18px 6px", fontFamily:"DM Mono,monospace" }}>TOOLS</div>
        {TOOLS.map(tool => (
          <Link key={tool.id} to={TOOL_META[tool.id].path} className={`sidebar-tool ${activeTool === tool.id ? "active" : ""}`}>
            <i className={`ti ${tool.icon}`} style={{ fontSize:16, color: activeTool === tool.id ? BLUE : "#888", flexShrink:0 }} aria-hidden="true" />
            <div>
              <div className="tool-label">{tool.label}</div>
              <div className="tool-desc">{tool.desc}</div>
            </div>
          </Link>
        ))}
      </nav>
      <div style={{ padding:"8px 18px 6px", marginTop:8 }}>
        <div style={{ fontSize:9, color:"#bbb", letterSpacing:".1em", textTransform:"uppercase", marginBottom:6, fontFamily:"DM Mono,monospace" }}>POWERED BY</div>
        <div style={{ fontFamily:"DM Mono,monospace", fontSize:11, color:"#aaa" }}>Pure JavaScript · No AI needed</div>
      </div>
      {/* Sidebar ad slot removed for now */}
    </>
  );
}

// ── APP ─────────────────────────────────────────────────────────────────
// `url` is passed when pre-rendering at build time; in the browser it's read from location.
export default function App({ url }) {
  const [path, setPath] = useState(() => normalisePath(url ?? window.location.pathname));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const route = parsePath(path);

  const navigate = useCallback(to => {
    const p = normalisePath(to);
    if (p !== normalisePath(window.location.pathname)) window.history.pushState({}, "", p);
    setPath(p);
    setDrawerOpen(false);
  }, []);

  // Browser back/forward
  useEffect(() => {
    const onPop = () => { setPath(normalisePath(window.location.pathname)); setDrawerOpen(false); };
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  useDocumentMeta(getMeta(path));

  useEffect(() => {
    const el = document.querySelector(".main-scroll");
    if (el) el.scrollTop = 0;
    window.scrollTo(0, 0);
  }, [path]);

  const activeTool = route.type === "tool" ? route.id : null;
  const isHome = route.type === "home";

  let content;
  if (route.type === "home")         content = <HomePage />;
  else if (route.type === "tool")    content = <><ConverterTool key={route.id} toolId={route.id} /><ToolInfo toolId={route.id} /></>;
  else if (route.type === "article") content = <BlogPage article={route.id} />;
  else if (route.type === "page") {
    content = route.id === "blog"    ? <BlogPage />
            : route.id === "about"   ? <AboutPage />
            : route.id === "contact" ? <ContactPage />
            : route.id === "privacy" ? <PrivacyPage />
            : <TermsPage />;
  }
  else content = <NotFoundPage />;

  return (
    <NavContext.Provider value={navigate}>
      <style>{styles}</style>
      <div style={{ display:"flex", minHeight:"100vh", background:"#f7f8fa" }}>

        {/* Desktop sidebar */}
        <aside className="sidebar">
          <SidebarContents activeTool={activeTool} isHome={isHome} />
        </aside>

        {/* Mobile drawer */}
        {drawerOpen && (
          <div className="drawer" onClick={e => { if (e.target === e.currentTarget) setDrawerOpen(false); }}>
            <div className="drawer-panel">
              <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", padding:"8px 12px 0" }}>
                <button onClick={() => setDrawerOpen(false)} aria-label="Close menu" style={{ background:"none", border:"none", cursor:"pointer", fontSize:22, color:"#888" }}>×</button>
              </div>
              <SidebarContents activeTool={activeTool} isHome={isHome} />
            </div>
            <div className="drawer-backdrop" onClick={() => setDrawerOpen(false)} />
          </div>
        )}

        {/* Main content */}
        <div style={{ flex:1, display:"flex", flexDirection:"column", minWidth:0 }}>
          {/* Mobile header */}
          <header className="mobile-header">
            <BrandLink>
              <div style={{ width:28, height:28, background:BLUE, borderRadius:6, display:"flex", alignItems:"center", justifyContent:"center" }}>
                <i className="ti ti-arrows-exchange" style={{ color:"#fff", fontSize:14 }} aria-hidden="true" />
              </div>
              <span style={{ fontWeight:700, fontSize:14, fontFamily:"DM Mono,monospace", color:"#1a1a1a" }}>QUICKUNITS</span>
            </BrandLink>
            <div style={{ display:"flex", alignItems:"center", gap:12 }}>
              <Link to="/blog" style={{ fontSize:13, color:"#555", textDecoration:"none" }}>Blog</Link>
              <button onClick={() => setDrawerOpen(true)}
                style={{ background:BLUE, color:"#fff", border:"none", borderRadius:6, padding:"7px 14px", fontSize:13, fontWeight:500, cursor:"pointer", fontFamily:"DM Sans" }}>
                Tools
              </button>
            </div>
          </header>

          {/* Content area */}
          <main className="main-scroll" style={{ flex:1, overflowY:"auto", padding:"28px 28px 48px" }}>
            <div key={path}>
              {/* Top ad slot removed for now */}
              {content}
              {/* Bottom ad slot removed for now */}
              <SiteFooter />
            </div>
          </main>
        </div>
      </div>
    </NavContext.Provider>
  );
}
