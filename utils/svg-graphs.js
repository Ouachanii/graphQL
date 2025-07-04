const colors = {
    blue1: '#27548A',
    yellow: '#DDA853',
    coldWhite: '#f9f9f9'
}

export class UserNameHelper {
    constructor(username) {
        this.userName = username;
        this.userNameHtmlElement = document.getElementById('username-text');
    }

    insertValueInDom() {
        if (!this.userNameHtmlElement) {
            console.error('UserNameHelper: username-text element not found');
            return;
        }
        if (this.userName) {
            this.userNameHtmlElement.textContent = `Welcome, ${this.userName}`;
        }
    }
}

export class LevelHelper {
    constructor(level, xp) {
        this.level = level;
        this.xp = xp;
        this.xpHtmlElement = document.getElementById('xp-text');
        const levelContainerElement = document.getElementById('drawing-level');
        if (levelContainerElement) {
            levelContainerElement.innerHTML = '';
            try {
                this.draw = SVG().addTo(levelContainerElement).size(110, 110);
            } catch (e) {
                console.error('LevelHelper: SVG.js error', e);
            }
        } else {
            console.error('LevelHelper: drawing-level element not found');
        }
    }

    drawingLevel() {
        if (!this.draw) return;
        let circle = this.draw.circle(100).attr({
            fill: colors.coldWhite,
            'stroke-width': 10,
            stroke: colors.yellow,
            cx: 55,
            cy: 55
        });
        let text = this.draw.text(`${this.level}`).fill(colors.yellow).font({
            size: 45,
            weight: 600
        });
        text.center(circle.cx(), circle.cy());
    }

    insertValueInDom() {
        if (!this.xpHtmlElement) {
            console.error('LevelHelper: xp-text element not found');
            return;
        }
        if (typeof formatBytes === 'function') {
            this.xpHtmlElement.textContent = `${(formatBytes(this.xp)[0]).toFixed(2)} ${formatBytes(this.xp)[1]}`;
        } else {
            this.xpHtmlElement.textContent = this.xp;
        }
    }

    createGraph() {
        if (this.level && this.xp) {
            this.drawingLevel();
            this.insertValueInDom();
        }
    }
}

export class AuditHelper {
    constructor(done, received, bonus, ratio) {
        this.BYTES_PER_PIXEL = 130 / (1000 * 1000);
        this.height = 10;
        this.done = done;
        this.received = received;
        this.bonus = bonus;
        this.ratio = ratio;
        this.doneHtmlElement = document.getElementById('done-text');
        this.receivedHtmlElement = document.getElementById('received-text');
        this.ratioHtmlElement = document.getElementById('ratio-text');
        const doneContainerElement = document.getElementById('audit-graph-done');
        const receivedContainerElement = document.getElementById('audit-graph-received');
        if (doneContainerElement && receivedContainerElement) {
            doneContainerElement.innerHTML = '';
            receivedContainerElement.innerHTML = '';
            try {
                this.doneDrawing = SVG().addTo(doneContainerElement).size('100%', 10);
                this.receivedDrawing = SVG().addTo(receivedContainerElement).size('100%', 10);
            } catch (e) {
                console.error('AuditHelper: SVG.js error', e);
            }
        } else {
            if (!doneContainerElement) console.error('AuditHelper: audit-graph-done element not found');
            if (!receivedContainerElement) console.error('AuditHelper: audit-graph-received element not found');
        }
    }

    doneDrawingRect() {
        if (!this.doneDrawing) return;
        this.doneDrawing.rect(this.BYTES_PER_PIXEL * this.done, this.height).attr({
            fill: colors.yellow
        });
        if (this.bonus) {
            this.doneDrawing.rect(this.BYTES_PER_PIXEL * this.bonus, this.height).attr({
                fill: colors.blue1,
                x: this.BYTES_PER_PIXEL * this.done
            });
        }
    }
    drawingReceivedRect() {
        if (!this.receivedDrawing) return;
        this.receivedDrawing.rect(this.BYTES_PER_PIXEL * this.received, this.height).attr({
            fill: colors.yellow
        });
    }
    insertValueInDom() {
        if (!this.doneHtmlElement || !this.receivedHtmlElement || !this.ratioHtmlElement) {
            console.error('AuditHelper: One or more stat elements not found');
            return;
        }
        if (typeof formatBytes === 'function') {
            this.doneHtmlElement.textContent += `${Math.floor(formatBytes(this.done)[0] * 100) / 100}${formatBytes(this.done)[1]} ${Math.floor(formatBytes(this.bonus)[0] * 100) / 100}${formatBytes(this.bonus)[1]}`;
            this.receivedHtmlElement.textContent += `${Math.round(formatBytes(this.received)[0] * 100) / 100}${formatBytes(this.received)[1]}`;
        } else {
            this.doneHtmlElement.textContent += `${this.done} ${this.bonus}`;
            this.receivedHtmlElement.textContent += `${this.received}`;
        }
        this.ratioHtmlElement.textContent = `Ratio:${this.ratio}`;
    }

    createGraph() {
        if (this.doneDrawing && this.receivedDrawing && this.done && this.received && this.ratio) {
            this.doneDrawingRect();
            this.drawingReceivedRect();
            this.insertValueInDom();
        }
    }
}

export class ProgressXp {
    constructor(data) {
        this.container = document.getElementById('progress-xp-graph')
        this.data = data;
        this.height = 300;
        this.dotRadius = 4;
        this.margin = 6;

        if (this.container) {
            this.container.innerHTML = '';
            const moduleSection = document.getElementById('progress-xp-section')
            this.width = moduleSection.offsetWidth - 43.9;
            this.draw = SVG().addTo(this.container).size(this.width, this.height);
        } else {
            console.error("Container element not found");
        }
    }

    scaleX(date) {
        const minDate = Math.min(...this.data.map(d => d.date.getTime()));
        const maxDate = Math.max(...this.data.map(d => d.date.getTime()));
        const dateMs = date.getTime();

        const plotWidth = this.width - 2 * this.margin;
        return this.margin + ((dateMs - minDate) / (maxDate - minDate)) * plotWidth;
    }

    scaleY(xp) {
        const maxXP = Math.max(...this.data.map(d => d.xp.currentXp));

        const plotHeight = this.height - 2 * this.margin;
        return this.margin + plotHeight - (xp / maxXP) * plotHeight;
    }

    resize(width, height) {
        if (width) this.width = width;
        if (height) this.height = height;

        this.draw.size(this.width, this.height);
        this.render();
    }

    render() {
        this.draw.clear();
        const points = this.data.map(d => [this.scaleX(d.date), this.scaleY(d.xp.currentXp), d]);
        let pathString = `M ${points[0][0]},${points[0][1]}`;
        for (let i = 1; i < points.length; i++) {
            const [currX, currY] = points[i];
            pathString += ` H ${currX} V ${currY}`;
        }

        this.draw.path(pathString)
            .fill('none')
            .stroke({ color: '#27548A', width: 2 });

        points.forEach(([x, y, data]) => {
            const dataPoint = this.draw.circle(this.dotRadius * 2)
                .center(x, y)
                .fill('#DDA853');


            dataPoint.on('mouseover', function () {
                dataPoint.radius(6);
                const infoDotsContainer = document.getElementById('dot-info-container')
                infoDotsContainer.innerHTML = `
                <h3 style=color:var(--yellow)>${data.name}</h3>
                <h3 style=color:var(--yellow)>Current xp:${formatBytes(data.xp.currentXp)[0].toFixed(0)} ${formatBytes(data.xp.currentXp)[1]}</h3>
                `
            });

            dataPoint.on('mouseout', function () {
                dataPoint.radius(4);
                const infoDotsContainer = document.getElementById('dot-info-container')
                infoDotsContainer.innerHTML = ""
            });
        });
    }
}

export class XpEarnedByProject {
    constructor(data) {
        this.container = document.getElementById('xp-earned-by-project-graph');
        this.data = data.filter(d => d.xp.amount >= 5000);
        this.height = 300;
        this.padding = 60;

        if (this.container) {
            this.container.innerHTML = '';
            this.width = this.container.offsetWidth;
            this.draw = SVG().addTo(this.container).size(this.width, this.height);
        } else {
            console.error("Container element not found");
            return;
        }
    }


    scaleY(xp) {
        const maxXP = Math.max(...this.data.map(d => d.xp.amount));
        if (maxXP === 0) return 0;

        return this.height * (xp / maxXP);
    }


    drawAxes() {
        const maxXP = Math.max(...this.data.map(d => d.xp.amount));

        // X-axis
        this.draw.line(this.padding, this.height, this.width, this.height)
            .stroke({ width: 2, color: '#333' });

        // Y-axis
        this.draw.line(this.padding, this.height, this.padding)
            .stroke({ width: 2, color: '#333' });

        // Y-axis ticks and labels
        const yTickCount = 5;
        for (let i = 0; i <= yTickCount; i++) {
            const y = this.height - (i / yTickCount) * (this.height);
            const value = Math.round((i / yTickCount) * maxXP);

            this.draw.line(this.padding - 5, y, this.padding, y)
                .stroke({ width: 1, color: '#333' });

            this.draw.text(`${formatBytes(value)[0]}`)
                .font({ size: 12 })
                .move(this.padding - 35, y);

            this.draw.line(this.padding, y, this.width - this.padding, y)
                .stroke({ width: 0.5, color: '#ccc', dasharray: '5,5' });
        }
    }

    resize(width) {
        if (width) this.width = width;

        this.draw.size(this.width, this.height);
        this.render();
    }

    render() {
        if (!this.draw) return;

        this.draw.clear();
        this.drawAxes();


        // Calculate available width for bars
        const availableWidth = this.width - (this.padding);
        const barWidth = availableWidth / this.data.length;
        const barPadding = barWidth * 0.2; // 20% of bar width as padding

        // Draw the bars
        this.data.forEach((d, i) => {

            const xp = d.xp.amount;
            const scaledHeight = this.scaleY(xp);

            const x = this.padding + (i * barWidth) + (barPadding / 2);
            const y = this.height - scaledHeight;
            const width = barWidth - barPadding;

            const rect = this.draw.rect(width, scaledHeight).attr({
                x: x,
                y: y,
                fill: typeof colors !== 'undefined' && colors.blue1 ? colors.blue1 : '#3498db',
                rx: 3,
                ry: 3
            });

            rect.on('mouseover', () => {
                document.getElementById('project-info').innerHTML = `
                <h3 class="details">Project Name: <span>${d.name}</span></h3>
                <h3 class="details">Xp Earned: <span>${formatBytes(d.xp.amount)[0]} ${formatBytes(d.xp.amount)[1]}</span></h3>
                `
            })

            rect.on('mouseout', () => {
                document.getElementById('project-info').innerHTML = `                
                <h3 class="details">Project Name: <span>-</h3>
                <h3 class="details">Xp Earned: <span>-</span></h3>`

            })

        });
    }


}

function formatBytes(bytes) {
    if (bytes === 0 || isNaN(bytes) || bytes < 0) return "0 bytes";

    const units = ["bytes", "KB", "MB", "GB", "TB"];
    const threshold = 1000;

    let i = 0;
    while (bytes >= threshold && i < units.length - 1) {
        bytes /= threshold;
        i++;
    }

    return [bytes, units[i]];
}