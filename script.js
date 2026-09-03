const canvas = document.getElementById("network-canvas");
const ctx = canvas.getContext("2d");

function resizeCanvas() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
}

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const nodes = [];

const nodeCount = 34;

const mouse = {
    x: null,
    y: null,
    active: false
};

canvas.addEventListener("mousemove", (event) => {
    const rect = canvas.getBoundingClientRect();

    mouse.x = event.clientX - rect.left;
    mouse.y = event.clientY - rect.top;
    mouse.active = true;
});

canvas.addEventListener("mouseleave", () => {
    mouse.active = false;
});

function getNetworkBounds() {
    return {
        left: canvas.width * 0.15,
        right: canvas.width * 0.70,
        top: 35,
        bottom: canvas.height - 55
    };
}

for (let i = 0; i < nodeCount; i++) {
    nodes.push({
        x:
            getNetworkBounds().left +
            Math.random() *
            (getNetworkBounds().right - getNetworkBounds().left),
            
        y:
            getNetworkBounds().top +
            Math.random() *
            (getNetworkBounds().bottom - getNetworkBounds().top),
        radius: Math.random() * 2 + 1,

        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25
    });
}

function drawNodes() {

    for (const node of nodes) {
        ctx.beginPath();

        ctx.arc(
            node.x,
            node.y,
            node.radius,
            0,
            Math.PI * 2
        );

        ctx.fillStyle = "rgba(96, 165, 250, 0.7)";
        ctx.fill();
    }
}

function drawConnections() {
    const maxDistance = 130;

    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {

            const dx = nodes[i].x - nodes[j].x;
            const dy = nodes[i].y - nodes[j].y;

            const distance = Math.sqrt(
                dx * dx + dy * dy
            );

            if (distance < maxDistance) {
                ctx.beginPath();

                ctx.moveTo(nodes[i].x, nodes[i].y);
                ctx.lineTo(nodes[j].x, nodes[j].y);

                ctx.strokeStyle = "rgba(96, 165, 250, 0.12)";
                ctx.lineWidth = 1;

                ctx.stroke();
            }
        }
    }
}

function updateNodes() {
    for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x <= 0 || node.x >= canvas.width) {
            node.vx *= -1;
        }

        if (node.y <= 0 || node.y >= canvas.height) {
            node.vy *= -1;
        }
    }
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    updateNodes();

    drawConnections();
    drawMouseConnections();
    drawNodes();

    requestAnimationFrame(animate);
}

function drawMouseConnections() {
    if (!mouse.active) {
        return;
    }

    const maxDistance = 160;

    for (const node of nodes) {
        const dx = node.x - mouse.x;
        const dy = node.y - mouse.y;

        const distance = Math.sqrt(
            dx * dx + dy * dy
        );

        if (distance < maxDistance) {
            const opacity =
                1 - distance / maxDistance;

            ctx.beginPath();

            ctx.moveTo(node.x, node.y);
            ctx.lineTo(mouse.x, mouse.y);

            ctx.strokeStyle =
                `rgba(96, 165, 250, ${opacity * 0.28})`;

            ctx.lineWidth = 1;
            ctx.stroke();
        }
    }
}

animate();
