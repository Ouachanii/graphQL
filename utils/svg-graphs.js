export function createBarGraph(data, options = {}) {
    const width = options.width || 400;
    const height = options.height || 200;
    const max = Math.max(...data.map(d => d.value));
    const barWidth = width / data.length;
    let bars = data.map((d, i) => {
        const barHeight = (d.value / max) * (height - 20);
        return `<rect x="${i * barWidth}" y="${height - barHeight}" width="${barWidth - 2}" height="${barHeight}" fill="#007bff"/>` +
               `<text x="${i * barWidth + barWidth/2}" y="${height - 5}" font-size="10" text-anchor="middle">${d.label}</text>`;
    }).join('');
    return `<svg width="${width}" height="${height}">${bars}</svg>`;
}

export function createPieChart(data, options = {}) {
    // Placeholder: implement SVG pie chart rendering
    // data: [{label: string, value: number}, ...]
    // options: {width, height, colors, ...}
    return '<svg><!-- Pie chart here --></svg>';
}
