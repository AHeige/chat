
// Framework logic: take ref to canvas 2D context.
// Render the game with a main game renderFrame function.
// Step to next animation frame with a nextFrame function

function round2dec(num: number, dec: number=2): number {
    const exp = Math.pow(10, dec)
    return Math.round((num + Number.EPSILON) * exp) / exp
}

type Vec2d = {
    x: number;
    y: number;
}

function add(to: Vec2d, from: Vec2d) {
    to.x+=from.x
    to.y+=from.y
}

function scalarMultiply(v: Vec2d, s: number) {
    v.x*=s
    v.y*=s
}

function wrap(p: Vec2d, screen: Vec2d) {
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

function wrapSpaceObject(so: SpaceObject, screen: Vec2d) {
    wrap(so.position, screen)
}

function bounceSpaceObject(so: SpaceObject, screen: Vec2d, gap: number = 1) {
    if (so.position.x < gap) {
        so.velocity.x = -so.velocity.x;
        so.position.x = gap
    }
    if (so.position.x >= screen.x) {
        so.velocity.x = -so.velocity.x;
        so.position.x = screen.x - gap
    }
    if (so.position.y < gap) {
        so.velocity.y = -so.velocity.y;
        so.position.y = gap
    }
    if (so.position.y >= screen.y) {
        so.velocity.y = -so.velocity.y;
        so.position.y = screen.y - gap
    }
}

function friction(so: SpaceObject, friction: number) {
    scalarMultiply(so.velocity, friction)
}

enum Shape {
    Triangle,
    Block,
    Ellipse,
    Asteroid,
    Ship
}

type SpaceObject = {
    shape: Shape,
    mass: number;
    size: Vec2d;
    color: string
    position: Vec2d;
    velocity: Vec2d;
    acceleration: Vec2d;
    angleDegree: number;
    name: string;
    health: number;
    killCount: number;
    fuel: number;
    enginePower: number;
    steeringPower: number;

}

function createDefaultSpaceObject(): SpaceObject {
    let so: SpaceObject = {
        shape: Shape.Triangle,
        mass: 10, 
        size: {x: 80, y: 120},
        color: '#fff',
        position: {x: 600, y: 600},
        velocity: {x: 0.1, y: 0.1},
        acceleration: {x: 0, y: 0},
        name: 'SpaceObject',
        angleDegree: 0,
        health: 100,
        killCount: 0,
        fuel: 200,
        enginePower: 0.4,
        steeringPower: 7
    }

    return so
}

function drawSpaceObject(so: SpaceObject, ctx: any) {
    switch (so.shape) {
        case Shape.Triangle:
            drawTriangleObject(so, ctx)
            break
        default:
            console.error("Unknown Shape", so.shape)
    }
}

function drawTriangleObject(so: SpaceObject, ctx: any) {
    let scale: number = 2
    ctx.save()
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = '#fff'
    ctx.fillRect(-5, -5, 10, 10)
    ctx.font = '30px courier';
    if (so.fuel < 10) ctx.fillStyle = '#ee0'
    if (so.fuel < 0.1) ctx.fillStyle = '#e00'
    ctx.fillText('fuel: ' + round2dec(so.fuel, 1), 150, -80)
    ctx.fillStyle = '#fff'
    ctx.rotate((90 + so.angleDegree) * Math.PI / 180);
    ctx.beginPath();
    ctx.strokeStyle = so.color;
    ctx.lineWidth = 5;
    ctx.moveTo(0, (-so.size.y/2)*scale);
    ctx.lineTo((-so.size.x/4)*scale, (so.size.y/4)*scale);
    ctx.lineTo((so.size.x/4)*scale, (so.size.y/4)*scale);
    ctx.lineTo(0, (-so.size.y/2)*scale);
    ctx.stroke();
    // ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.restore()

    drawVector(so.velocity, so.position, 3, ctx)

}

function drawVector(v: Vec2d, position: Vec2d, scale: number = 2, ctx: any) {
    ctx.save()
    ctx.translate(position.x, position.y);
    ctx.beginPath();
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0)
    ctx.lineTo(scale * v.x, scale * v.y);
    ctx.stroke();
    ctx.restore()
}

function updateSpaceObject(so: SpaceObject, ctx: any) {
    add(so.position, so.velocity)
    add(so.velocity, so.acceleration)
}


let upPressed: boolean = false
let downPressed: boolean = false
let rightPressed: boolean = false
let leftPressed: boolean = false

function arrowControl (e: any) {
    if (e.key === "ArrowUp") {
        upPressed = true
    }

    if (e.key === "ArrowDown") {
        downPressed = true
    }

    if (e.key === "ArrowLeft") {
        leftPressed = true
    }

    if (e.key === "ArrowRight") {
        rightPressed = true
    }
}

function clearInputKeys() {
    upPressed = false
    downPressed = false
    rightPressed = false
    leftPressed = false
}

function init() {
    console.log('adds event listeners')
    document.addEventListener('keydown', (event) => arrowControl(event));
    document.addEventListener('keyup', (event) => clearInputKeys());
}

function applyEngine(so: SpaceObject): number {
    if (so.fuel > 0) {
        so.fuel-=so.enginePower
        return so.enginePower
    }
    so.fuel = 0
    console.log(so.name + " has no more fuel!", so)
    return 0
}

function applySteer(so: SpaceObject): number {
    return so.steeringPower
}

function spaceObjectKeyController(so: SpaceObject) {
    if (upPressed) {
        let angleRadians: number = so.angleDegree  * Math.PI / 180
        let engine = applyEngine(so)
        add(so.velocity, {x: engine * Math.cos(angleRadians), y: engine * Math.sin(angleRadians)})
    }

    if (downPressed) {
        let angleRadians: number = so.angleDegree  * Math.PI / 180
        let engine = applyEngine(so)
        add(so.velocity, {x: -engine * Math.cos(angleRadians), y: -engine * Math.sin(angleRadians)})
    }

    if (leftPressed) {
        so.angleDegree-=applySteer(so)
    }

    if (rightPressed) {
        so.angleDegree+=applySteer(so)
    }
}



const myShip: SpaceObject = createDefaultSpaceObject()

function renderFrame (ctx: any) {
    drawSpaceObject(myShip, ctx)
}

function nextFrame (ctx: any) {
    spaceObjectKeyController(myShip)
    // wrapSpaceObject(myShip.position, {x: ctx.canvas.width, y: ctx.canvas.height})
    bounceSpaceObject(myShip, {x: ctx.canvas.width, y: ctx.canvas.height})
    friction(myShip, 0.998)
    updateSpaceObject(myShip, ctx)
}

const pic32lander = {renderFrame: renderFrame, nextFrame: nextFrame, init: init, round2dec: round2dec}

export default pic32lander
