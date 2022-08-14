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
function addc(to, from) {
    let tmp = copy(to);
    tmp.x += from.x;
    tmp.y += from.y;
    return tmp;
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
    return "(" + round2dec(v.x, 0) + ", " + round2dec(v.y, 0) + ")";
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
    return (deg * Math.PI) / 180;
}
function radToDeg(rad) {
    return rad * (180 / Math.PI);
}
function heading(so) {
    return {
        x: Math.cos(degToRad(so.angleDegree)),
        y: Math.sin(degToRad(so.angleDegree)),
    };
}
function headingFromAngle(angleDegree) {
    return {
        x: Math.cos(degToRad(angleDegree)),
        y: Math.sin(degToRad(angleDegree)),
    };
}
function alignHeadingToVelocity(so) {
    so.angleDegree = radToDeg(Math.atan2(so.velocity.y, so.velocity.x));
}
function isColliding(so0, so1) {
    if (so0.position.x < so1.position.x + so1.size.x &&
        so0.position.x + so0.size.x > so1.position.x &&
        so0.position.y < so1.position.y + so1.size.y &&
        so0.position.y + so0.size.y > so1.position.y) {
        return true;
    }
    return false;
}
function bounceSpaceObject(so, screen, energyFactor = 1, gap = 1) {
    if (so.position.x < gap) {
        so.velocity.x = -so.velocity.x * energyFactor;
        so.position.x = gap;
        so.bounceCount++;
        so.damage = so.damage * 0.1;
    }
    if (so.position.x >= screen.x) {
        so.velocity.x = -so.velocity.x * energyFactor;
        so.position.x = screen.x - gap;
        so.bounceCount++;
        so.damage = so.damage * 0.1;
    }
    if (so.position.y < gap) {
        so.velocity.y = -so.velocity.y * energyFactor;
        so.position.y = gap;
        so.bounceCount++;
        so.damage = so.damage * 0.1;
    }
    if (so.position.y >= screen.y) {
        so.velocity.y = -so.velocity.y * energyFactor;
        so.position.y = screen.y - gap;
        so.bounceCount++;
        so.damage = so.damage * 0.1;
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
    let maxSpeed = 1;
    let so = {
        shape: Shape.Triangle,
        mass: 10,
        size: { x: 24, y: 24 },
        color: "#fff",
        position: { x: rndi(0, 1000), y: rndi(0, 900) },
        velocity: { x: rndf(-maxSpeed, maxSpeed), y: rndf(-maxSpeed, maxSpeed) },
        acceleration: { x: 0, y: 0 },
        name: "SpaceObject",
        angleDegree: 0,
        health: 100,
        killCount: 0,
        fuel: 500,
        enginePower: 0.25,
        steeringPower: 2.5,
        ammo: 10,
        shotsInFlight: [],
        missileSpeed: 5,
        missileDamage: 10,
        canonCoolDown: 0,
        canonOverHeat: false,
        canonHeatConstant: 25,
        shieldPower: 100,
        colliding: false,
        collidingWith: [],
        damage: 5,
        armedDelay: 1,
        bounceCount: 0,
        didHit: false,
        shotBlowFrame: 8,
        afterBurnerEnabled: false
    };
    return so;
}
function drawSpaceObject(so, ctx) {
    switch (so.shape) {
        case Shape.Ship:
            drawShip(so, ctx);
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
    ctx.fillStyle = so.colliding === true ? "#f00" : so.color;
    ctx.fillRect(-so.size.x / 2, -so.size.y / 2, so.size.x, so.size.y);
    ctx.restore();
}
function randomColor(r, g, b) {
    return ("#" +
        r[Math.floor(Math.random() * r.length)] +
        g[Math.floor(Math.random() * g.length)] +
        b[Math.floor(Math.random() * b.length)]);
}
function randomGreen() {
    const r = "012345";
    const g = "6789ABCDEF";
    const b = "012345";
    return randomColor(r, g, b);
}
function randomBlue() {
    const r = "012345";
    const g = "012345";
    const b = "6789ABCDEF";
    return randomColor(r, g, b);
}
function randomRed() {
    const r = "6789ABCDEF";
    const g = "012345";
    const b = "012345";
    return randomColor(r, g, b);
}
function randomAnyColor() {
    const r = "0123456789ABCDEF";
    const g = "0123456789ABCDEF";
    const b = "0123456789ABCDEF";
    return randomColor(r, g, b);
}
function drawShot(so, ctx) {
    for (let shot of so.shotsInFlight) {
        if (shot.didHit)
            continue;
        if (Math.random() > 0.990) {
            ctx.fillStyle = (shot.armedDelay < 0 ? '#00f' : '#fff');
        }
        else if (Math.random() > 0.985) {
            ctx.fillStyle = (shot.armedDelay < 0 ? '#ff0' : '#fff');
        }
        else if (Math.random() > 0.975) {
            ctx.fillStyle = (shot.armedDelay < 0 ? '#f00' : '#fff');
        }
        else {
            ctx.fillStyle = (shot.armedDelay < 0 ? shot.color : '#fff');
        }
        ctx.save();
        ctx.translate(shot.position.x, shot.position.y);
        ctx.rotate(((90 + shot.angleDegree) * Math.PI) / 180);
        ctx.fillRect(-shot.size.x / 2, -shot.size.y / 2, shot.size.x, shot.size.y);
        ctx.restore();
    }
}
function drawShip(so, ctx) {
    let scale = 2;
    let shipSize = { x: 40, y: 80 };
    ctx.save();
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = "#fff";
    ctx.font = "22px courier";
    if (so.fuel < 250)
        ctx.fillStyle = "#ff0";
    if (so.fuel < 150)
        ctx.fillStyle = "#f00";
    let xtext = 200;
    ctx.fillText("fuel: " + round2dec(so.fuel, 1), xtext, -50);
    ctx.fillStyle = "#fff";
    ctx.fillText(so.name, xtext, -200);
    ctx.fillText(to_string(so.velocity), xtext, -150);
    ctx.fillText(to_string(so.position), xtext, -100);
    ctx.fillText("sif: " + so.shotsInFlight.length, xtext, 0);
    ctx.fillText("ammo: " + so.ammo, xtext, 50);
    ctx.fillText("health: " + round2dec(so.health, 1), xtext, 100);
    ctx.fillText("heat: " + round2dec(so.canonCoolDown, 1), xtext, 150);
    ctx.fillText("angle: " + round2dec(Math.abs(so.angleDegree % 360)), xtext, 200);
    ctx.rotate((round2dec(90 + so.angleDegree, 1) * Math.PI) / 180);
    ctx.beginPath();
    ctx.strokeStyle = so.color;
    ctx.lineWidth = 5;
    ctx.strokeStyle = so.colliding ? "#f00" : so.color;
    ctx.fillStyle = so.colliding ? "#f00" : so.color;
    ctx.moveTo(0, (-shipSize.y / 2) * scale);
    ctx.lineTo((-shipSize.x / 4) * scale, (shipSize.y / 4) * scale);
    ctx.lineTo((shipSize.x / 4) * scale, (shipSize.y / 4) * scale);
    ctx.lineTo(0, (-shipSize.y / 2) * scale);
    const cannonWidth = 10;
    const cannonStart = 15;
    const cannonEnd = 40;
    ctx.moveTo(cannonWidth, cannonStart);
    ctx.lineTo(cannonWidth, -cannonEnd);
    ctx.moveTo(-cannonWidth, cannonStart);
    ctx.lineTo(-cannonWidth, -cannonEnd);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(0, 20, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
    drawShot(so, ctx);
    if (so.afterBurnerEnabled) {
        renderAfterBurnerFrame(addc(so.position, scalarMultiply(headingFromAngle(so.angleDegree - 180), 60)), ctx);
    }
}
function drawVector(v, position, scale = 2, ctx, offset = { x: 0, y: 0 }) {
    ctx.save();
    ctx.translate(position.x + offset.x, position.y + offset.y);
    ctx.beginPath();
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0);
    ctx.lineTo(scale * v.x, scale * v.y);
    ctx.stroke();
    ctx.restore();
}
let upPressed = false;
let downPressed = false;
let rightPressed = false;
let rightStrafePressed = false;
let leftStrafePressed = false;
let leftPressed = false;
let spacePressed = false;
let bounce = true;
function arrowControl(e, value) {
    if (e.key === "ArrowUp") {
        upPressed = value;
    }
    if (e.key === "w") {
        upPressed = value;
    }
    if (e.key === "ArrowDown") {
        downPressed = value;
    }
    if (e.key === "s") {
        downPressed = value;
    }
    if (e.key === "ArrowLeft") {
        leftPressed = value;
    }
    if (e.key === "ArrowRight") {
        rightPressed = value;
    }
    if (e.key === "a") {
        leftStrafePressed = value;
    }
    if (e.key === "d") {
        rightStrafePressed = value;
    }
    if (e.code === "Space") {
        spacePressed = value;
    }
    if (e.key === "b" && value) {
        bounce = !bounce;
        console.log({ bounce });
    }
    if (e.key === "i") {
        console.log({ allSpaceObjects });
        console.log({ myShip });
    }
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
    if (so.ammo < 1) {
        console.log(so.name + ' is out of ammo');
        return;
    }
    if (so.canonOverHeat) {
        return;
    }
    so.canonCoolDown += so.canonHeatConstant;
    so.ammo--;
    let shot = createDefaultSpaceObject();
    shot.damage = so.missileDamage;
    shot.size = { x: rndi(2, 3), y: rndi(30, 45) };
    shot.color = randomGreen();
    let head = copy(so.position);
    const aimError = 8;
    const headError = 0.019;
    const speedError = 1.8;
    head = add(head, scalarMultiply(heading(so), 15));
    head = add(head, {
        x: rndi(-aimError, aimError),
        y: rndi(-aimError, aimError),
    });
    shot.velocity = scalarMultiply(heading(so), so.missileSpeed + rndf(0, speedError));
    add(shot.velocity, {
        x: rndf(-headError, headError),
        y: rndf(-headError, headError),
    });
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
function decayDeadSpaceObjects(so) {
    let out = so.filter(function (e) {
        return e.health > 0;
    });
    return out;
}
function decayOffScreenShots(so, screen) {
    so.shotsInFlight = so.shotsInFlight.filter(function (e) {
        return !ofScreen(e.position, screen);
    });
}
function renderExplosionFrame(pos, ctx) {
    let offset = 7;
    let minSize = 1;
    let maxSize = 12;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    for (let c of ['#ff0', '#f00', '#ee0', '#e00', '#dd0', '#d00', '#008', '#000', '#444']) {
        let center = add({ x: 0, y: 0 }, { x: rndi(-offset, offset), y: rndi(-offset, offset) });
        let size = add({ x: 0, y: 0 }, { x: rndi(minSize, maxSize), y: rndi(minSize, maxSize) });
        ctx.fillStyle = c;
        ctx.fillRect(center.x, center.y, size.x, size.y);
    }
    ctx.restore();
}
function renderAfterBurnerFrame(pos, ctx) {
    let offset = 12;
    let minSize = 4;
    let maxSize = 9;
    ctx.save();
    ctx.translate(pos.x, pos.y);
    for (let c of ['#ff0', '#00f', '#ee0', '#e00', '#ccc', '#ccc', '#aaa', '#999', '#888']) {
        let center = add({ x: 0, y: 0 }, { x: rndi(-offset, offset), y: rndi(-offset, offset) });
        let size = add({ x: 0, y: 0 }, { x: rndi(minSize, maxSize), y: rndi(minSize, maxSize) });
        ctx.fillStyle = c;
        ctx.fillRect(center.x, center.y, size.x, size.y);
    }
    ctx.restore();
}
function decayDeadShots(so) {
    so.shotsInFlight = decayDeadSpaceObjects(so.shotsInFlight);
}
function removeShotsAfterBounces(so, maxBounces) {
    so.shotsInFlight = so.shotsInFlight.filter(function (e) {
        return e.bounceCount <= maxBounces;
    });
}
function applySteer(so) {
    return so.steeringPower;
}
function spaceObjectKeyController(so) {
    so.afterBurnerEnabled = false;
    if (upPressed) {
        so.afterBurnerEnabled = true;
        let angleRadians = (so.angleDegree * Math.PI) / 180;
        let engine = applyEngine(so);
        add(so.velocity, {
            x: engine * Math.cos(angleRadians),
            y: engine * Math.sin(angleRadians),
        });
    }
    if (downPressed) {
        let angleRadians = (so.angleDegree * Math.PI) / 180;
        let engine = applyEngine(so);
        add(so.velocity, {
            x: -engine * Math.cos(angleRadians),
            y: -engine * Math.sin(angleRadians),
        });
    }
    if (leftStrafePressed) {
        let angleRadians = ((so.angleDegree - 90) * Math.PI) / 180;
        let engine = applyEngine(so);
        add(so.velocity, {
            x: engine * Math.cos(angleRadians),
            y: engine * Math.sin(angleRadians),
        });
    }
    if (rightStrafePressed) {
        let angleRadians = ((so.angleDegree + 90) * Math.PI) / 180;
        let engine = applyEngine(so);
        add(so.velocity, {
            x: engine * Math.cos(angleRadians),
            y: engine * Math.sin(angleRadians),
        });
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
function handleHittingShot(shot, ctx) {
    if (shot.didHit) {
        shot.shotBlowFrame--;
        shot.velocity = scalarMultiply(shot.velocity, 0.3);
        renderExplosionFrame(shot.position, ctx);
        if (shot.shotBlowFrame < 0) {
            shot.health = 0;
        }
    }
}
function coolDown(so) {
    if (so.canonCoolDown >= 100) {
        so.canonOverHeat = true;
    }
    so.canonCoolDown -= 8;
    if (so.canonCoolDown < 1) {
        so.canonCoolDown = 0;
        so.canonOverHeat = false;
    }
}
function updateSpaceObject(so, screen, ctx) {
    add(so.position, so.velocity);
    add(so.velocity, so.acceleration);
    coolDown(so);
    for (let shot of so.shotsInFlight) {
        add(shot.position, shot.velocity);
        add(shot.velocity, shot.acceleration);
        shot.armedDelay--;
        bounceSpaceObject(shot, screen);
        alignHeadingToVelocity(shot);
        handleHittingShot(shot, ctx);
    }
    decayDeadShots(so);
    removeShotsAfterBounces(so, 1);
}
function handleCollisions(spaceObjects, ctx) {
    const vibration = 0;
    for (let so0 of spaceObjects) {
        for (let so1 of spaceObjects) {
            if (isColliding(so0, so1) && so0.name !== so1.name) {
                so0.colliding = true;
                so1.colliding = true;
                so0.collidingWith.push(so1);
                so1.collidingWith.push(so0);
                so0.health -= 50;
                so1.health -= 50;
                renderExplosionFrame(so0.position, ctx);
                renderExplosionFrame(so1.position, ctx);
            }
            for (let shot of so0.shotsInFlight) {
                if (shot.armedDelay < 0) {
                    if (isColliding(shot, so0) && shot.didHit === false) {
                        so0.health -= shot.damage;
                        so0.position = add(so0.position, { x: rndi(-vibration, vibration), y: rndi(-vibration, vibration) });
                        so0.angleDegree = so0.angleDegree + rndi(-vibration, vibration);
                        shot.didHit = true;
                    }
                    if (isColliding(shot, so1) && shot.didHit === false) {
                        so1.health -= shot.damage;
                        so1.position = add(so1.position, { x: rndi(-vibration, vibration), y: rndi(-vibration, vibration) });
                        so1.angleDegree = so0.angleDegree + rndi(-vibration, vibration);
                        shot.didHit = true;
                    }
                }
            }
        }
    }
}
function resetCollisions(spaceObjects) {
    for (let so of spaceObjects) {
        so.colliding = false;
        so.collidingWith = [];
    }
}
const numberOfAsteroids = 80;
let myShip = createDefaultSpaceObject();
let allSpaceObjects = [];
function init(cid) {
    myShip.name = "Player" + cid;
    myShip.shape = Shape.Ship;
    myShip.health = 9000;
    myShip.fuel = 270;
    myShip.ammo = 90;
    myShip.missileSpeed = 31;
    myShip.missileDamage = 6000;
    myShip.canonHeatConstant = 100;
    myShip.size = { x: 50, y: 50 };
    myShip.steeringPower = 1.12;
    myShip.enginePower = 0.063;
    myShip.color = '#fff';
    myShip.position = { x: 700, y: 600 };
    myShip.velocity = { x: 0.4, y: -0.6 };
    allSpaceObjects.push(myShip);
    console.log("adds event listeners");
    document.addEventListener("keydown", (event) => arrowControl(event, true));
    document.addEventListener("keyup", (event) => arrowControl(event, false));
    for (let i = 0; i < numberOfAsteroids; i++) {
        let a = createDefaultSpaceObject();
        a.shape = Shape.Asteroid;
        a.name = "Asteroid #" + i;
        a.health = 5500;
        let size = rndi(10, 30);
        a.size = { x: size, y: size };
        allSpaceObjects.push(a);
    }
    console.log(allSpaceObjects);
}
function renderFrame(ctx) {
    for (let so of allSpaceObjects) {
        drawSpaceObject(so, ctx);
    }
    resetCollisions(allSpaceObjects);
}
function nextFrame(ctx) {
    const screen = { x: ctx.canvas.width, y: ctx.canvas.height };
    allSpaceObjects = decayDeadSpaceObjects(allSpaceObjects);
    handleCollisions(allSpaceObjects, ctx);
    spaceObjectKeyController(myShip);
    for (let so of allSpaceObjects) {
        if (bounce) {
            bounceSpaceObject(so, screen, 0.9995);
        }
        else {
            wrapSpaceObject(so, screen);
        }
        updateSpaceObject(so, screen, ctx);
    }
    friction(myShip, 0.991);
}
const pic32lander = {
    renderFrame: renderFrame,
    nextFrame: nextFrame,
    init: init,
    round2dec: round2dec,
};
exports.default = pic32lander;
