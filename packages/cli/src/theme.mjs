export const styleNames = [
    "sorgente",
    "carta",
    "pietra",
    "riva",
    "ambra",
    "selce",
    "onda",
    "aria",
];
export const defaultTheme = {
    style: "sorgente",
    base: "sand",
    accent: "terracotta",
    chart: "clay",
    heading: "editorial",
    font: "dm",
    radius: 10,
    menu: "soft",
};
export function validateTheme(input) {
    if (!input || typeof input !== "object" || Array.isArray(input))
        throw Error("Invalid theme preset");
    const v = { ...defaultTheme, ...input };
    if (!styleNames.includes(v.style) ||
        !["sand", "slate", "olive"].includes(v.base) ||
        !["terracotta", "amber", "olive", "ink"].includes(v.accent) ||
        !["clay", "sage", "gold"].includes(v.chart) ||
        !["editorial", "sans"].includes(v.heading) ||
        !["dm", "system"].includes(v.font) ||
        !["soft", "solid"].includes(v.menu) ||
        typeof v.radius !== "number" ||
        !Number.isFinite(v.radius) ||
        v.radius < 0 ||
        v.radius > 24)
        throw Error("Invalid theme preset values");
    return Object.fromEntries(Object.keys(defaultTheme).map((k) => [k, v[k]]));
}
export function themeTokens(config, dark = false) {
    const c = validateTheme(config);
    const bases = {
        sand: ["#f5f3ed", "#fbfaf6", "#eae7df", "#dcd8cf"],
        slate: ["#f3f4f5", "#fafbfc", "#e6e9ec", "#d4d9de"],
        olive: ["#f2f3ee", "#fafbf7", "#e5e8dc", "#d2d8c7"],
    };
    const base = bases[c.base], paper = dark ? "#191b18" : base[0], line = dark ? "#454b40" : base[3];
    const accents = {
        terracotta: dark ? "#e39b80" : "#a64832",
        amber: dark ? "#e6bf63" : "#95651d",
        olive: dark ? "#a9c294" : "#536b42",
        ink: dark ? "#e6e4dc" : "#30342c",
    };
    const styles = {
        sorgente: { space: 24, shadow: "0 1px 2px #00000005" },
        carta: { space: 24, shadow: "0 4px 14px #20180a09" },
        pietra: { space: 18, shadow: "none", line: dark ? "#89917f" : "#999f91" },
        riva: { space: 24, shadow: "none" },
        ambra: {
            space: 24,
            shadow: "none",
            line: dark ? "#a38b56" : "#c8ad71",
            top: 3,
        },
        selce: {
            space: 20,
            shadow: "none",
            line: dark ? "#89917f" : "#8c9482",
            width: 2,
        },
        onda: { space: 26, shadow: "0 6px 24px #161e1609" },
        aria: { space: 30, shadow: "0 2px 5px #151b1204" },
    };
    const s = styles[c.style], card = c.style === "riva" ? paper : dark ? "#222520" : base[1];
    return {
        "--color-paper": paper,
        "--color-card": card,
        "--color-surface": dark ? "#2d312a" : base[2],
        "--color-line": line,
        "--color-ink": dark ? "#eeeee6" : "#242720",
        "--color-muted": dark ? "#aeb4a6" : "#62685d",
        "--color-terracotta": accents[c.accent],
        "--color-chart-3": c.chart === "gold"
            ? "#d7bd80"
            : c.chart === "sage"
                ? "#9eae98"
                : "#c2a58f",
        "--font-sans": c.font === "dm"
            ? '"DM Sans Variable", Arial, sans-serif'
            : "Arial, Helvetica, sans-serif",
        "--font-editorial": c.heading === "editorial"
            ? '"Lora Variable", Georgia, serif'
            : c.font === "dm"
                ? '"DM Sans Variable", Arial, sans-serif'
                : "Arial, Helvetica, sans-serif",
        "--radius-lg": c.radius + "px",
        "--radius-xl": c.radius + 6 + "px",
        "--radius-2xl": c.radius + 12 + "px",
        "--color-menu": c.menu === "solid" ? (dark ? "#30352b" : "#e9e7de") : card,
        "--space-card": s.space + "px",
        "--shadow-card": s.shadow,
        "--color-card-border": s.line || line,
        "--card-border-width": (s.width || 1) + "px",
        "--card-top-width": (s.top || s.width || 1) + "px",
    };
}
export function themeCSS(config) {
    return (":root {\n" +
        Object.entries(themeTokens(config))
            .map(([k, v]) => "  " + k + ": " + v + ";")
            .join("\n") +
        '\n}\n[data-theme="dark"] {\n' +
        Object.entries(themeTokens(config, true))
            .map(([k, v]) => "  " + k + ": " + v + ";")
            .join("\n") +
        "\n}");
}
