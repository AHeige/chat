"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rnd_(min, max) {
    return Math.random() * (max - min) + min;
}
function rnd(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function round2dec(num, dec = 2) {
    const exp = Math.pow(10, dec);
    return Math.round((num + Number.EPSILON) * exp) / exp;
}
function add(to, from) {
    to.x += from.x;
    to.y += from.y;
    return to;
}
function copy_(to, from) {
    to.x = from.x;
    to.y = from.y;
    return to;
}
function copy(from) {
    let to = { x: 0, y: 0 };
    to.x = from.x;
    to.y = from.y;
    return to;
}
function to_string(v) {
    return '(' + round2dec(v.x, 0) + ', ' + round2dec(v.y, 0) + ')';
}
function scalarMultiply(v, s) {
    v.x *= s;
    v.y *= s;
    return v;
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
function degToRad(deg) {
    return deg * Math.PI / 180;
}
function heading(so) {
    return { x: Math.cos(degToRad(so.angleDegree)), y: Math.sin(degToRad(so.angleDegree)) };
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
        fuel: 500,
        enginePower: 0.25,
        steeringPower: 5,
        ammo: 10,
        shotsInFlight: [],
        missileSpeed: 30,
        canonCoolDown: 0
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
function drawShot(so, ctx) {
    for (let shot of so.shotsInFlight) {
        ctx.fillStyle = '#0f0';
        ctx.save();
        ctx.translate(shot.position.x, shot.position.y);
        ctx.rotate((90 + shot.angleDegree) * Math.PI / 180);
        ctx.fillRect(-4, -14, 8, 28);
        ctx.restore();
    }
}
function drawTriangleObject(so, ctx) {
    let scale = 2;
    ctx.save();
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = '#fff';
    ctx.font = '32px courier';
    if (so.fuel < 10)
        ctx.fillStyle = '#ee0';
    if (so.fuel < 0.1)
        ctx.fillStyle = '#e00';
    ctx.fillText('fuel: ' + round2dec(so.fuel, 1), 150, -50);
    ctx.fillStyle = '#fff';
    ctx.fillText('sif: ' + so.shotsInFlight.length, 150, 0);
    ctx.fillText(to_string(so.position), 150, -100);
    ctx.fillText(to_string(so.velocity), 150, -150);
    ctx.rotate((90 + so.angleDegree) * Math.PI / 180);
    ctx.beginPath();
    ctx.strokeStyle = so.color;
    ctx.lineWidth = 5;
    ctx.moveTo(0, (-so.size.y / 2) * scale);
    ctx.lineTo((-so.size.x / 4) * scale, (so.size.y / 4) * scale);
    ctx.lineTo((so.size.x / 4) * scale, (so.size.y / 4) * scale);
    ctx.lineTo(0, (-so.size.y / 2) * scale);
    ctx.moveTo(8, 10);
    ctx.lineTo(8, -40);
    ctx.moveTo(-8, 10);
    ctx.lineTo(-8, -40);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawVector(so.velocity, so.position, 5, ctx);
    drawShot(so, ctx);
}
function drawVector(v, position, scale = 2, ctx, offset = { x: 0, y: 0 }) {
    ctx.save();
    ctx.translate(position.x + offset.x, position.y + offset.y);
    ctx.beginPath();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0);
    ctx.lineTo(scale * v.x, scale * v.y);
    ctx.stroke();
    ctx.restore();
}
let upPressed = false;
let downPressed = false;
let rightPressed = false;
let leftPressed = false;
let spacePressed = false;
let bounce = false;
function arrowControl(e, value) {
    if (e.key === "ArrowUp") {
        upPressed = value;
    }
    if (e.key === "ArrowDown") {
        downPressed = value;
    }
    if (e.key === "ArrowLeft") {
        leftPressed = value;
    }
    if (e.key === "ArrowRight") {
        rightPressed = value;
    }
    if (e.code === "Space") {
        spacePressed = value;
    }
    if (e.key === "b") {
        console.log({ bounce });
        bounce = value;
    }
}
function clearInputKeys() {
    upPressed = false;
    downPressed = false;
    rightPressed = false;
    leftPressed = false;
    spacePressed = false;
}
function init() {
    console.log('adds event listeners');
    document.addEventListener('keydown', (event) => arrowControl(event, true));
    document.addEventListener('keyup', (event) => arrowControl(event, false));
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
function fire(so) {
    let shot = createDefaultSpaceObject();
    let head = copy(so.position);
    const aimError = 12;
    head = add(head, scalarMultiply(heading(so), 35));
    head = add(head, { x: rnd(-aimError, aimError), y: rnd(-aimError, aimError) });
    shot.velocity = scalarMultiply(heading(so), so.missileSpeed);
    shot.position = head;
    shot.angleDegree = so.angleDegree;
    so.shotsInFlight.push(shot);
}
function ofScreen(v, screen) {
    if (v.x > screen.x)
        return true;
    if (v.x < 0)
        return true;
    if (v.y > screen.y)
        return true;
    if (v.y < 0)
        return true;
    return false;
}
function decayShots(so, screen) {
    so.shotsInFlight = so.shotsInFlight.filter(function (e) {
        return !ofScreen(e.position, screen);
    });
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
    if (spacePressed) {
        fire(so);
    }
}
function updateSpaceObject(so, screen) {
    add(so.position, so.velocity);
    add(so.velocity, so.acceleration);
    for (let shot of so.shotsInFlight) {
        add(shot.position, shot.velocity);
        add(shot.velocity, shot.acceleration);
    }
    decayShots(so, screen);
}
const myShip = createDefaultSpaceObject();
function renderFrame(ctx) {
    drawSpaceObject(myShip, ctx);
}
function nextFrame(ctx) {
    const screen = { x: ctx.canvas.width, y: ctx.canvas.height };
    spaceObjectKeyController(myShip);
    if (bounce) {
        bounceSpaceObject(myShip, screen);
    }
    else {
        wrapSpaceObject(myShip, screen);
    }
    friction(myShip, 0.998);
    updateSpaceObject(myShip, screen);
}
const pic32lander = { renderFrame: renderFrame, nextFrame: nextFrame, init: init, round2dec: round2dec };
exports.default = pic32lander;
