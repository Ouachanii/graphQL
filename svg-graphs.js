export function createRatioGraph(doneWith, receiveWith) {
    const container = document.getElementById('audit-ratio');
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "200");
    svg.setAttribute("height", "200");
    svg.setAttribute("viewBox", "0 0 200 200");
    const done = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    done.setAttribute("x", "10");
    done.setAttribute("y", "10");
    done.setAttribute("width", doneWith);
    done.setAttribute("height", "180");
    done.setAttribute("fill", "#5fcdd1");
    const receive = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    receive.setAttribute("x", "20");
    receive.setAttribute("y", "20");
    receive.setAttribute("width", receiveWith);
    receive.setAttribute("height", "160");
    svg.appendChild(done);
    svg.appendChild(receive);
    container.appendChild(svg);
    

}