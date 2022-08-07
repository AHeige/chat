"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function round2dec(num, dec = 2) {
    const exp = Math.pow(10, dec);
    return Math.round((num + Number.EPSILON) * exp) / exp;
}
function add(to, from) {
    to.x += from.x;
    to.y += from.y;
}
function scalarMultiply(v, s) {
    v.x *= s;
    v.y *= s;
}
function wrap(p, screen) {
    if (p.x < 0) {
        p.x = screen.x;
    }
    if (p.x > screen.x) {
        p.x = 0;
    }
    if (p.y < 0) {
        p.y = screen.y;
    }
    if (p.y > screen.y) {
        p.y = 0;
    }
}
function wrapSpaceObject(so, screen) {
    wrap(so.position, screen);
}
function bounceSpaceObject(so, screen, gap = 1) {
    if (so.position.x < gap) {
        so.velocity.x = -so.velocity.x;
        so.position.x = gap;
    }
    if (so.position.x >= screen.x) {
        so.velocity.x = -so.velocity.x;
        so.position.x = screen.x - gap;
    }
    if (so.position.y < gap) {
        so.velocity.y = -so.velocity.y;
        so.position.y = gap;
    }
    if (so.position.y >= screen.y) {
        so.velocity.y = -so.velocity.y;
        so.position.y = screen.y - gap;
    }
}
function friction(so, friction) {
    scalarMultiply(so.velocity, friction);
}
var Shape;
(function (Shape) {
    Shape[Shape["Triangle"] = 0] = "Triangle";
    Shape[Shape["Block"] = 1] = "Block";
    Shape[Shape["Ellipse"] = 2] = "Ellipse";
    Shape[Shape["Asteroid"] = 3] = "Asteroid";
    Shape[Shape["Ship"] = 4] = "Ship";
})(Shape || (Shape = {}));
function createDefaultSpaceObject() {
    let so = {
        shape: Shape.Triangle,
        mass: 10,
        size: { x: 80, y: 120 },
        color: '#fff',
        position: { x: 600, y: 600 },
        velocity: { x: 0.1, y: 0.1 },
        acceleration: { x: 0, y: 0 },
        name: 'SpaceObject',
        angleDegree: 0,
        health: 100,
        killCount: 0,
        fuel: 200,
        enginePower: 0.4,
        steeringPower: 7
    };
    return so;
}
function drawSpaceObject(so, ctx) {
    switch (so.shape) {
        case Shape.Triangle:
            drawTriangleObject(so, ctx);
            break;
        default:
            console.error("Unknown Shape", so.shape);
    }
}
function drawTriangleObject(so, ctx) {
    let scale = 2;
    ctx.save();
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-5, -5, 10, 10);
    ctx.font = '30px courier';
    if (so.fuel < 10)
        ctx.fillStyle = '#ee0';
    if (so.fuel < 0.1)
        ctx.fillStyle = '#e00';
    ctx.fillText('fuel: ' + round2dec(so.fuel, 1), 150, -80);
    ctx.fillStyle = '#fff';
    ctx.rotate((90 + so.angleDegree) * Math.PI / 180);
    ctx.beginPath();
    ctx.strokeStyle = so.color;
    ctx.lineWidth = 5;
    ctx.moveTo(0, (-so.size.y / 2) * scale);
    ctx.lineTo((-so.size.x / 4) * scale, (so.size.y / 4) * scale);
    ctx.lineTo((so.size.x / 4) * scale, (so.size.y / 4) * scale);
    ctx.lineTo(0, (-so.size.y / 2) * scale);
    ctx.stroke();
    ctx.restore();
    drawVector(so.velocity, so.position, 3, ctx);
}
function drawVector(v, position, scale = 2, ctx) {
    ctx.save();
    ctx.translate(position.x, position.y);
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0);
    ctx.lineTo(scale * v.x, scale * v.y);
    ctx.stroke();
    ctx.restore();
}
function updateSpaceObject(so, ctx) {
    add(so.position, so.velocity);
    add(so.velocity, so.acceleration);
}
let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;
function arrowControl(e) {
    if (e.key === "ArrowUp") {
        upPressed = true;
    }
    if (e.key === "ArrowDown") {
        downPressed = true;
    }
    if (e.key === "ArrowLeft") {
        leftPressed = true;
    }
    if (e.key === "ArrowRight") {
        rightPressed = true;
    }
}
function clearInputKeys() {
    upPressed = false;
    downPressed = false;
    rightPressed = false;
    leftPressed = false;
}
function init() {
    console.log('adds event listeners');
    document.addEventListener('keydown', (event) => arrowControl(event));
    document.addEventListener('keyup', (event) => clearInputKeys());
}
function applyEngine(so) {
    if (so.fuel > 0) {
        so.fuel -= so.enginePower;
        return so.enginePower;
    }
    so.fuel = 0;
    console.log(so.name + " has no more fuel!", so);
    return 0;
}
function applySteer(so) {
    return so.steeringPower;
}
function spaceObjectKeyController(so) {
    if (upPressed) {
        let angleRadians = so.angleDegree * Math.PI / 180;
        let engine = applyEngine(so);
        add(so.velocity, { x: engine * Math.cos(angleRadians), y: engine * Math.sin(angleRadians) });
    }
    if (downPressed) {
        let angleRadians = so.angleDegree * Math.PI / 180;
        let engine = applyEngine(so);
        add(so.velocity, { x: -engine * Math.cos(angleRadians), y: -engine * Math.sin(angleRadians) });
    }
    if (leftPressed) {
        so.angleDegree -= applySteer(so);
    }
    if (rightPressed) {
        so.angleDegree += applySteer(so);
    }
}
const myShip = createDefaultSpaceObject();
function renderFrame(ctx) {
    drawSpaceObject(myShip, ctx);
}
function nextFrame(ctx) {
    spaceObjectKeyController(myShip);
    bounceSpaceObject(myShip, { x: ctx.canvas.width, y: ctx.canvas.height });
    friction(myShip, 0.998);
    updateSpaceObject(myShip, ctx);
}
const pic32lander = { renderFrame: renderFrame, nextFrame: nextFrame, init: init, round2dec: round2dec };
exports.default = pic32lander;
