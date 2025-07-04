export function createRatioGraph(doneWith, receiveWith) {
    const container = document.getElementById('audit-ratio');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "1200");
    svg.setAttribute("height", "500");
    svg.style.boxShadow = "0 0 0 3px steelblue"; 
    const done = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    done.setAttribute("x", "10");
    done.setAttribute("y", "10");
    done.setAttribute("width", doneWith);
    done.setAttribute("height", "180");
    done.setAttribute("fill", "red");
    const receive = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    receive.setAttribute("x", "10");
    receive.setAttribute("y", "300");
    receive.setAttribute("width", receiveWith);
    receive.setAttribute("height", "160");
    svg.appendChild(done);
    svg.appendChild(receive);
    container.appendChild(svg);
    

}


import { transactSkill } from "./app.js";

export async function createSkillsGraph() {
    let data = await transactSkill(); // Fix: await and async

    const yourSkills = document.createElement("h3");
    yourSkills.textContent= `Your skills : `;
    document.getElementById("skills").appendChild(yourSkills);

    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", 500);
    svg.setAttribute("height", 400);

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
        line.setAttribute("stroke", "rgba(255, 255, 255, 0.5)");
        line.setAttribute("stroke-width", 2);
        svg.appendChild(line);

        const label = document.createElementNS("http://www.w3.org/2000/svg", "text");
        label.setAttribute("x", x);
        label.setAttribute("y", y);
        label.setAttribute("fill", "white");
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
    polygon.setAttribute("fill", "rgba(255, 0, 0, 0.5)");
    svg.appendChild(polygon);
    const skillsDiv = document.getElementById("skills");
    if (skillsDiv) {
        skillsDiv.appendChild(svg);
    } else {
        console.error('Element with id "talentSkills" not found.');
    }

  
}