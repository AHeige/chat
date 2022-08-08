
// Framework logic: take ref to canvas 2D context.
// Render the game with a main game renderFrame function.
// Step to next animation frame with a nextFrame function

function rndf(min: number, max: number) {
    return Math.random() * (max - min) + min;
}

function rndi(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function round2dec(num: number, dec: number=2): number {
    const exp = Math.pow(10, dec)
    return Math.round((num + Number.EPSILON) * exp) / exp
}

type Vec2d = {
    x: number;
    y: number;
}

function add(to: Vec2d, from: Vec2d): Vec2d {
    to.x+=from.x
    to.y+=from.y
    return to
}

function copy_(to: Vec2d, from: Vec2d): Vec2d {
    to.x=from.x
    to.y=from.y
    return to
}

function copy(from: Vec2d): Vec2d {
    let to: Vec2d = {x: 0, y: 0}
    to.x=from.x
    to.y=from.y
    return to
}

function to_string(v: Vec2d): string {
     return '(' + round2dec(v.x, 0) + ', ' + round2dec(v.y, 0) + ')'
}

function scalarMultiply(v: Vec2d, s: number): Vec2d {
    v.x*=s
    v.y*=s
    return v
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

function degToRad(deg: number): number {
    return deg  * Math.PI / 180
}

function heading(so: SpaceObject): Vec2d {
    return {x: Math.cos(degToRad(so.angleDegree)), y: Math.sin(degToRad(so.angleDegree))}
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
    ammo: number;
    shotsInFlight: SpaceObject[];
    missileSpeed: number;
    canonCoolDown: number;
    shieldPower: number;
}

function createDefaultSpaceObject(): SpaceObject {
    let so: SpaceObject = {
        shape: Shape.Triangle,
        mass: 10, 
        size: {x: 80, y: 120},
        color: '#fff',
        position: {x: rndi(0, 1500), y: rndi(0, 1500)},
        velocity: {x: rndf(-4, 4), y: rndf(-4, 4)},
        acceleration: {x: 0, y: 0},
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
        canonCoolDown: 0,
        shieldPower: 100
    }

    return so
}

function drawSpaceObject(so: SpaceObject, ctx: any) {
    switch (so.shape) {
        case Shape.Triangle:
            drawTriangleObject(so, ctx)
            break
        case Shape.Asteroid:
            drawAsteroid(so, ctx)
            break
        default:
            console.error("Unknown Shape", so.shape)
    }
}

function drawAsteroid(so: SpaceObject, ctx: any) {
    ctx.save()
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = '#fff'
    ctx.fillRect(-40, -40, 80, 80)
    ctx.restore()
}

function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function randomColor(r: string, g: string, b: string): string {
    return '#' + r[Math.floor(Math.random() * r.length)] + g[Math.floor(Math.random() * g.length)] + b[Math.floor(Math.random() * b.length)]
}

function randomGreen(): string {
    const r = '012345';
    const g = '6789ABCDEF';
    const b = '012345';
    return randomColor(r, g, b)
    // return '#' + r[Math.floor(Math.random() * r.length)] + g[Math.floor(Math.random() * g.length)] + b[Math.floor(Math.random() * b.length)]
}

function randomBlue(): string {
    const r = '012345';
    const g = '012345';
    const b = '6789ABCDEF';
    return randomColor(r, g, b)
    // return '#' + r[Math.floor(Math.random() * r.length)] + g[Math.floor(Math.random() * g.length)] + b[Math.floor(Math.random() * b.length)]
}

function randomRed(): string {
    const r = '6789ABCDEF';
    const g = '012345';
    const b = '012345';
    return randomColor(r, g, b)
    // return '#' + r[Math.floor(Math.random() * r.length)] + g[Math.floor(Math.random() * g.length)] + b[Math.floor(Math.random() * b.length)]
}


function drawShot(so: SpaceObject, ctx: any) {
    for (let shot of so.shotsInFlight) {
        ctx.fillStyle = shot.color
        // console.log('shot color: ' + shot.color)
        ctx.save()
        ctx.translate(shot.position.x, shot.position.y);
        ctx.rotate((90 + shot.angleDegree) * Math.PI / 180);
        ctx.fillRect(-3, -16, 6, 32)
        ctx.restore()
    }
}


function drawTriangleObject(so: SpaceObject, ctx: any) {
    let scale: number = 2
    ctx.save()
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = '#fff'
    // ctx.fillRect(-10, -10, 20, 20)
    ctx.font = '32px courier';
    if (so.fuel < 10) ctx.fillStyle = '#ee0'
    if (so.fuel < 0.1) ctx.fillStyle = '#e00'
    let xtext: number = 200
    ctx.fillText('fuel: ' + round2dec(so.fuel, 1), xtext, -50)
    ctx.fillStyle = '#fff'
    ctx.fillText(so.name, xtext, -200)
    ctx.fillText(to_string(so.velocity), xtext, -150)
    ctx.fillText(to_string(so.position), xtext, -100)
    ctx.fillText('sif: ' + so.shotsInFlight.length, xtext, 0)
    ctx.fillText('ammo: ' + so.ammo, xtext, 50)
    ctx.fillText('health: ' + so.health, xtext, 100)
    ctx.fillText('shield: ' + so.shieldPower, xtext, 150)
    ctx.fillText('angle: ' + Math.abs(so.angleDegree%360), xtext, 200)
    ctx.rotate((90 + so.angleDegree) * Math.PI / 180);
    ctx.beginPath();
    ctx.strokeStyle = so.color;
    ctx.lineWidth = 5;

    // hull
    ctx.moveTo(0, (-so.size.y/2)*scale);
    ctx.lineTo((-so.size.x/4)*scale, (so.size.y/4)*scale);
    ctx.lineTo((so.size.x/4)*scale, (so.size.y/4)*scale);
    ctx.lineTo(0, (-so.size.y/2)*scale);


    // canons
    ctx.moveTo(8, 10)
    ctx.lineTo(8, -40)
    ctx.moveTo(-8, 10)
    ctx.lineTo(-8, -40)
    ctx.stroke();

    // tower
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2)
    ctx.fill()


    // shield
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#66f'
    ctx.arc(0, 0, 170, 0, Math.PI * 2)
    ctx.stroke()

    ctx.restore()
    drawVector(so.velocity, so.position, 5, ctx)
    drawShot(so, ctx)
}

function drawVector(v: Vec2d, position: Vec2d, scale: number = 2, ctx: any, offset: Vec2d = {x: 0, y:0}) {
    ctx.save()
    ctx.translate(position.x + offset.x, position.y + offset.y);
    ctx.beginPath();
    ctx.strokeStyle = '#fff'
    ctx.lineWidth = 5;
    ctx.moveTo(0, 0)
    ctx.lineTo(scale * v.x, scale * v.y);
    ctx.stroke();
    ctx.restore()
}

let upPressed: boolean = false
let downPressed: boolean = false
let rightPressed: boolean = false
let leftPressed: boolean = false
let spacePressed: boolean = false
let bounce: boolean = false

function arrowControl (e: any, value: boolean) {
    if (e.key === "ArrowUp") {
        upPressed = value
    }
    if (e.key === "ArrowDown") {
        downPressed = value
    }
    if (e.key === "ArrowLeft") {
        leftPressed = value
    }
    if (e.key === "ArrowRight") {
        rightPressed = value
    }
    if (e.code === "Space") { // wtf code...
        spacePressed = value
    }
    if (e.key === "b" && value) {
        bounce = !bounce
        console.log ({bounce})
    }
}

function clearInputKeys() {
    upPressed = false
    downPressed = false
    rightPressed = false
    leftPressed = false
    spacePressed = false
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



function fire(so: SpaceObject) {
    let shot = createDefaultSpaceObject()
    // shot.color = randomGreen()
    // shot.color = randomBlue()
    shot.color = randomRed()
    // console.log (shot.color)
    let head: Vec2d = copy(so.position)
    const aimError = 12
    const headError = 1
    const speedError = 5
    head = add(head, scalarMultiply(heading(so), 35))
    head = add(head, {x: rndi(-aimError, aimError), y: rndi(-aimError, aimError)})
    shot.velocity = scalarMultiply(heading(so), so.missileSpeed + rndf(0, speedError))
    add(shot.velocity, {x: rndf(-headError, headError), y: rndf(-headError, headError)})
    // shot.position = {x: so.position.x + rnd(-aimError, aimError), y: so.position.y + rnd(-aimError, aimError) }
    shot.position = head
    shot.angleDegree = so.angleDegree
    so.shotsInFlight.push(shot)
}

function ofScreen(v: Vec2d, screen: Vec2d) {
    if (v.x > screen.x) return true
    if (v.x < 0) return true
    if (v.y > screen.y) return true
    if (v.y < 0) return true
    return false
}

function decayShots(so: SpaceObject, screen: Vec2d) {
    so.shotsInFlight = so.shotsInFlight.filter(function(e) {
        return !ofScreen(e.position, screen)
    })
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

    if (spacePressed) {
        // console.log ("fire!")
        fire(so)
    }
}


function updateSpaceObject(so: SpaceObject, screen: Vec2d) {
    add(so.position, so.velocity)
    add(so.velocity, so.acceleration)
    for (let shot of so.shotsInFlight) {
        add(shot.position, shot.velocity)
        add(shot.velocity, shot.acceleration)
    }
    decayShots(so, screen)
}

let asteroids: SpaceObject[] = []
const myShip: SpaceObject = createDefaultSpaceObject()
myShip.name = 'ransed'

function renderFrame (ctx: any) {
    drawSpaceObject(myShip, ctx)
    for (let asteroid of asteroids) {
        drawSpaceObject(asteroid, ctx)
    }
}

function nextFrame (ctx: any) {
    const screen: Vec2d = {x: ctx.canvas.width, y: ctx.canvas.height}

    spaceObjectKeyController(myShip)
    if (bounce) {
        bounceSpaceObject(myShip, screen)
    } else {
        wrapSpaceObject(myShip, screen)
    }
    friction(myShip, 0.998)
    updateSpaceObject(myShip, screen)


    for (let asteroid of asteroids) {
        if (bounce) {
            bounceSpaceObject(asteroid, screen)
        } else {
            wrapSpaceObject(asteroid, screen)
        }
        updateSpaceObject(asteroid, screen)
    }

}

function init() {
    console.log('adds event listeners')
    document.addEventListener('keydown', (event) => arrowControl(event, true));
    document.addEventListener('keyup', (event) => arrowControl(event, false));
    for (let i = 0; i<10; i++) {
        let a: SpaceObject = createDefaultSpaceObject()
        a.shape = Shape.Asteroid
        asteroids.push(a)
        // console.log(a)
    }
    console.log(asteroids)
}


const pic32lander = {renderFrame: renderFrame, nextFrame: nextFrame, init: init, round2dec: round2dec}

export default pic32lander
