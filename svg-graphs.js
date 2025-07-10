export function createRatioGraph(doneWidth, receiveWidth) {
    const container = document.getElementById('audit-ratio');
    // Clear previous SVG if any
    container.innerHTML = '';
    const header = document.createElement("h3");
    header.textContent= `Audit ratio`;
    header.className = "graphs-titles";
    header.style.marginBottom = "60px";
    container.appendChild(header);
    let maxBarWidth = container.offsetWidth;

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", maxBarWidth);
    svg.setAttribute("height", "250");

    let doneWt = 0;
    let receiveWt = 0;
    maxBarWidth = maxBarWidth * 0.9;

    // Prevent division by zero and negative widths
    if (receiveWidth === 0) {
        doneWt = maxBarWidth;
        receiveWt = 0;
    } else if (doneWidth === 0) {
        receiveWt = maxBarWidth;
        doneWt = 0;
    } else if (doneWidth >= receiveWidth) {
        doneWt = maxBarWidth;
        receiveWt = Math.max(0, maxBarWidth * (receiveWidth / doneWidth));
    } else {
        receiveWt = maxBarWidth;
        doneWt = Math.max(0, maxBarWidth * (doneWidth / receiveWidth));
    }

    const done = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    done.setAttribute("x", "10");
    done.setAttribute("y", "10");
    done.setAttribute("width", doneWt);
    done.setAttribute("height", "50");
    done.setAttribute("fill", "green");
    done.setAttribute("rx", "15");
    done.setAttribute("ry", "15");

    const receive = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    receive.setAttribute("x", "10");
    receive.setAttribute("y", "100");
    receive.setAttribute("width", receiveWt);
    receive.setAttribute("height", "50");
    receive.setAttribute("fill", "red");
    receive.setAttribute("rx", "15");
    receive.setAttribute("ry", "15");

    const doneText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    doneText.setAttribute("x", "10");
    doneText.setAttribute("y", "90");
    doneText.setAttribute("fill", "green");
    doneText.setAttribute("font-size", "20px");
    doneText.textContent = `Done: ${(doneWidth/1000).toFixed(3)} Mb`;

    const receiveText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    receiveText.setAttribute("x", "10");
    receiveText.setAttribute("y", "180");
    receiveText.setAttribute("fill", "red");
    receiveText.setAttribute("font-size", "20px");
    receiveText.textContent = `Received: ${(receiveWidth/1000).toFixed(3)} Mb`;

    svg.appendChild(done);
    svg.appendChild(receive);
    svg.appendChild(doneText);
    svg.appendChild(receiveText);

    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "10");
    title.setAttribute("y", "220");
    title.setAttribute("fill", "yellow");
    title.setAttribute("font-size", "24px");
    const ratio = receiveWidth === 0 ? 0 : doneWidth / receiveWidth;
    title.textContent = `Your Audit Ratio: ${ratio.toFixed(2)}`;
    svg.appendChild(title);
    container.appendChild(svg);
}


import { transactSkill } from "./app.js";

export async function createSkillsGraph() {
    let data = await transactSkill();

    const yourSkills = document.createElement("h3");
    yourSkills.textContent= `Your skills`;
    yourSkills.className = "graphs-titles";
    document.getElementById("skills").appendChild(yourSkills);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 500);
    svg.setAttribute("height", 400);
    svg.setAttribute("id", "skills-svg");

    const width = 500;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) / 2 - 20; // 20 for padding

    // create line progress
    data.forEach((_, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Création de la ligne
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", centerX);
        line.setAttribute("y1", centerY);
        line.setAttribute("x2", x);
        line.setAttribute("y2", y);
        line.setAttribute("stroke", "blue");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y);
        label.setAttribute("fill", "black");
        label.setAttribute("font-size", "14px");
        label.setAttribute("text-anchor", "middle"); 
        label.setAttribute("alignment-baseline", "middle"); 
        label.textContent = `${data[index].type} : ${data[index].amount}`; 
        svg.appendChild(label);
    });

    const polyPoints = data.map((value, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const x = centerX + (radius * value.amount) / 100 * Math.cos(angle);
        const y = centerY + (radius * value.amount) / 100 * Math.sin(angle);
        return `${x},${y}`;
    });
    const polygon = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    polygon.setAttribute("points", polyPoints.join(" "));
    polygon.setAttribute("fill", "rgba(0, 89, 255, 0.5)");
    svg.appendChild(polygon);
    const skillsDiv = document.getElementById("skills");
    if (skillsDiv) {
        skillsDiv.appendChild(svg);
    } else {
        console.error('Element with id "talentSkills" not found.');
    }

  
}