"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function rndf(min, max) {
    return Math.random() * (max - min) + min;
}
function rndi(min, max) {
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
        position: { x: rndi(0, 1500), y: rndi(0, 1500) },
        velocity: { x: rndf(-4, 4), y: rndf(-4, 4) },
        acceleration: { x: 0, y: 0 },
        name: 'SpaceObject',
        angleDegree: 0,
        health: 100,
        killCount: 0,
        fuel: 500,
        enginePower: 0.25,
        steeringPower: 2.5,
        ammo: 10,
        shotsInFlight: [],
        missileSpeed: 30,
        canonCoolDown: 0,
        shieldPower: 100
    };
    return so;
}
function drawSpaceObject(so, ctx) {
    switch (so.shape) {
        case Shape.Triangle:
            drawTriangleObject(so, ctx);
            break;
        case Shape.Asteroid:
            drawAsteroid(so, ctx);
            break;
        default:
            console.error("Unknown Shape", so.shape);
    }
}
function drawAsteroid(so, ctx) {
    ctx.save();
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = '#fff';
    ctx.fillRect(-40, -40, 80, 80);
    ctx.restore();
}
function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
function randomColor(r, g, b) {
    return '#' + r[Math.floor(Math.random() * r.length)] + g[Math.floor(Math.random() * g.length)] + b[Math.floor(Math.random() * b.length)];
}
function randomGreen() {
    const r = '012345';
    const g = '6789ABCDEF';
    const b = '012345';
    return randomColor(r, g, b);
}
function randomBlue() {
    const r = '012345';
    const g = '012345';
    const b = '6789ABCDEF';
    return randomColor(r, g, b);
}
function randomRed() {
    const r = '6789ABCDEF';
    const g = '012345';
    const b = '012345';
    return randomColor(r, g, b);
}
function drawShot(so, ctx) {
    for (let shot of so.shotsInFlight) {
        ctx.fillStyle = shot.color;
        ctx.save();
        ctx.translate(shot.position.x, shot.position.y);
        ctx.rotate((90 + shot.angleDegree) * Math.PI / 180);
        ctx.fillRect(-shot.size.x / 2, -shot.size.y / 2, shot.size.x, shot.size.y);
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
    let xtext = 200;
    ctx.fillText('fuel: ' + round2dec(so.fuel, 1), xtext, -50);
    ctx.fillStyle = '#fff';
    ctx.fillText(so.name, xtext, -200);
    ctx.fillText(to_string(so.velocity), xtext, -150);
    ctx.fillText(to_string(so.position), xtext, -100);
    ctx.fillText('sif: ' + so.shotsInFlight.length, xtext, 0);
    ctx.fillText('ammo: ' + so.ammo, xtext, 50);
    ctx.fillText('health: ' + so.health, xtext, 100);
    ctx.fillText('shield: ' + so.shieldPower, xtext, 150);
    ctx.fillText('angle: ' + Math.abs(so.angleDegree % 360), xtext, 200);
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
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#66f';
    ctx.arc(0, 0, 170, 0, Math.PI * 2);
    ctx.stroke();
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
    if (e.key === "b" && value) {
        bounce = !bounce;
        console.log({ bounce });
    }
}
function clearInputKeys() {
    upPressed = false;
    downPressed = false;
    rightPressed = false;
    leftPressed = false;
    spacePressed = false;
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
    shot.size = { x: rndi(3, 6), y: rndi(14, 60) };
    shot.color = randomGreen();
    let head = copy(so.position);
    const aimError = 12;
    const headError = 1;
    const speedError = 5;
    head = add(head, scalarMultiply(heading(so), 35));
    head = add(head, { x: rndi(-aimError, aimError), y: rndi(-aimError, aimError) });
    shot.velocity = scalarMultiply(heading(so), so.missileSpeed + rndf(0, speedError));
    add(shot.velocity, { x: rndf(-headError, headError), y: rndf(-headError, headError) });
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
let asteroids = [];
let myShip = createDefaultSpaceObject();
myShip.name = 'ransed';
myShip.missileSpeed = 50;
function renderFrame(ctx) {
    drawSpaceObject(myShip, ctx);
    for (let asteroid of asteroids) {
        drawSpaceObject(asteroid, ctx);
    }
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
    for (let asteroid of asteroids) {
        if (bounce) {
            bounceSpaceObject(asteroid, screen);
        }
        else {
            wrapSpaceObject(asteroid, screen);
        }
        updateSpaceObject(asteroid, screen);
    }
}
function init() {
    console.log('adds event listeners');
    document.addEventListener('keydown', (event) => arrowControl(event, true));
    document.addEventListener('keyup', (event) => arrowControl(event, false));
    for (let i = 0; i < 10; i++) {
        let a = createDefaultSpaceObject();
        a.shape = Shape.Asteroid;
        asteroids.push(a);
    }
    console.log(asteroids);
}
const pic32lander = { renderFrame: renderFrame, nextFrame: nextFrame, init: init, round2dec: round2dec };
exports.default = pic32lander;
