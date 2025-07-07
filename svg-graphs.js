export function createRatioGraph(doneWith, receiveWith) {
    const container = document.getElementById('audit-ratio');
    // Clear previous SVG if any
    container.innerHTML = '';

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "700");
    svg.setAttribute("height", "250");

    let doneWt = 0;
    let receiveWt = 0;
    let diff = 0;
    const maxBarWidth = container.offsetWidth ? container.offsetWidth * 0.8 : 560;

    // Prevent division by zero and negative widths
    if (receiveWith === 0) {
        doneWt = maxBarWidth;
        receiveWt = 0;
    } else if (doneWith === 0) {
        receiveWt = maxBarWidth;
        doneWt = 0;
    } else if (doneWith >= receiveWith) {
        doneWt = maxBarWidth;
        receiveWt = Math.max(0, maxBarWidth * (receiveWith / doneWith));
    } else {
        receiveWt = maxBarWidth;
        doneWt = Math.max(0, maxBarWidth * (doneWith / receiveWith));
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
    doneText.textContent = `Done: ${doneWith} kb`;

    const receiveText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    receiveText.setAttribute("x", "10");
    receiveText.setAttribute("y", "180");
    receiveText.setAttribute("fill", "red");
    receiveText.setAttribute("font-size", "20px");
    receiveText.textContent = `Received: ${receiveWith} kb`;

    svg.appendChild(done);
    svg.appendChild(receive);
    svg.appendChild(doneText);
    svg.appendChild(receiveText);

    const title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "10");
    title.setAttribute("y", "220");
    title.setAttribute("fill", "yellow");
    title.setAttribute("font-size", "24px");
    const ratio = receiveWith === 0 ? 0 : doneWith / receiveWith;
    title.textContent = `Your Audit Ratio: ${ratio.toFixed(2)}`;
    svg.appendChild(title);
    container.appendChild(svg);
}


import { transactSkill } from "./app.js";

export async function createSkillsGraph() {
    let data = await transactSkill(); // Fix: await and async

    const yourSkills = document.createElement("h3");
    yourSkills.textContent= `Your skills:`;
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
    const radius = Math.min(width, height) / 2 - 20;

    // create line progress
    data.forEach((value, index) => {
        const angle = (Math.PI * 2 * index) / data.length;
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);

        // Création de la ligne jusqu'à 100%
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