export const styleNames = ['sorgente', 'carta', 'pietra', 'riva', 'ambra', 'selce', 'onda', 'aria'];
export const defaultTheme = { style: 'sorgente', base: 'sand', accent: 'terracotta', chart: 'clay', heading: 'editorial', font: 'dm', radius: 10, menu: 'soft' };
export function validateTheme(input) { if (!input || typeof input !== 'object')
    throw Error('Invalid theme preset'); const v = { ...defaultTheme, ...input }; if (!styleNames.includes(v.style) || !['sand', 'slate', 'olive'].includes(v.base) || !['terracotta', 'amber', 'olive', 'ink'].includes(v.accent) || !['clay', 'sage', 'gold'].includes(v.chart) || !['editorial', 'sans'].includes(v.heading) || !['dm', 'system'].includes(v.font) || !['soft', 'solid'].includes(v.menu) || typeof v.radius !== 'number' || !Number.isFinite(v.radius) || v.radius < 0 || v.radius > 24)
    throw Error('Invalid theme preset values'); return Object.fromEntries(Object.keys(defaultTheme).map(k => [k, v[k]])); }
export function themeTokens(config, dark = false) {
    const c = validateTheme(config);
    const bases = { sand: ['#f5f3ed', '#fbfaf6', '#eae7df', '#dcd8cf'], slate: ['#f3f4f5', '#fafbfc', '#e6e9ec', '#d4d9de'], olive: ['#f2f3ee', '#fafbf7', '#e5e8dc', '#d2d8c7'] };
    const base = bases[c.base];
    const accents = { terracotta: dark ? '#e39b80' : '#a64832', amber: dark ? '#e6bf63' : '#95651d', olive: dark ? '#a9c294' : '#536b42', ink: dark ? '#e6e4dc' : '#30342c' };
    const rounded = c.style === 'pietra' ? 2 : c.style === 'aria' ? 18 : c.style === 'onda' ? 24 : c.radius;
    return { '--color-paper': dark ? '#191b18' : base[0], '--color-card': dark ? '#222520' : base[1], '--color-surface': dark ? '#2d312a' : base[2], '--color-line': dark ? '#454b40' : base[3], '--color-ink': dark ? '#eeeee6' : '#242720', '--color-muted': dark ? '#aeb4a6' : '#74796d', '--color-terracotta': accents[c.accent], '--color-chart-3': c.chart === 'gold' ? '#d7bd80' : c.chart === 'sage' ? '#9eae98' : '#c2a58f', '--font-sans': c.font === 'dm' ? '"DM Sans Variable", Arial, sans-serif' : 'Arial, Helvetica, sans-serif', '--font-editorial': c.heading === 'editorial' ? '"Lora Variable", Georgia, serif' : c.font === 'dm' ? '"DM Sans Variable", Arial, sans-serif' : 'Arial, Helvetica, sans-serif', '--radius-lg': rounded + 'px', '--radius-xl': (rounded + 6) + 'px', '--radius-2xl': (rounded + 12) + 'px', '--color-menu': c.menu === 'solid' ? (dark ? '#30352b' : '#e9e7de') : (dark ? '#222520' : base[1]) };
}
export function themeCSS(config) { return ':root {\n' + Object.entries(themeTokens(config)).map(([k, v]) => '  ' + k + ': ' + v + ';').join('\n') + '\n}\n[data-theme="dark"] {\n' + Object.entries(themeTokens(config, true)).map(([k, v]) => '  ' + k + ': ' + v + ';').join('\n') + '\n}'; }
