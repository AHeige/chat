
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

function isColliding(so0: SpaceObject, so1: SpaceObject): boolean {
	if (so0.position.x < so1.position.x + so1.size.x &&
		so0.position.x + so0.size.x > so1.position.x &&
		so0.position.y < so1.position.y + so1.size.y &&
		so0.position.y + so0.size.y > so1.position.y) {
		return true;
	}
	return false;
}


function bounceSpaceObject(so: SpaceObject, screen: Vec2d, energyFactor: number = 1, gap: number = 1) {
    if (so.position.x < gap) {
        so.velocity.x = -so.velocity.x * energyFactor;
        so.position.x = gap
    }
    if (so.position.x >= screen.x) {
        so.velocity.x = -so.velocity.x * energyFactor;
        so.position.x = screen.x - gap
    }
    if (so.position.y < gap) {
        so.velocity.y = -so.velocity.y * energyFactor;
        so.position.y = gap
    }
    if (so.position.y >= screen.y) {
        so.velocity.y = -so.velocity.y * energyFactor;
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
    colliding: boolean;
}

function createDefaultSpaceObject(): SpaceObject {
    let so: SpaceObject = {
        shape: Shape.Triangle,
        mass: 10, 
        size: {x: 40, y: 40},
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
        steeringPower: 2.5,
        ammo: 10,
        shotsInFlight: [],
        missileSpeed: 5, // 30
        canonCoolDown: 0,
        shieldPower: 100,
        colliding: false
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
    ctx.fillStyle = (so.colliding === true ? '#f00' : so.color)
    ctx.font = '32px courier';
    ctx.fillText(so.name, 100, -50)
    ctx.fillText('health: ' + so.health, 100, 0)
    // ctx.fillText(to_string(so.position), 100, 50)
    ctx.fillRect(-so.size.x/2, -so.size.y/2, so.size.x, so.size.y)
    ctx.restore()
}

function randomColor(r: string, g: string, b: string): string {
    return '#' + r[Math.floor(Math.random() * r.length)] + g[Math.floor(Math.random() * g.length)] + b[Math.floor(Math.random() * b.length)]
}

function randomGreen(): string {
    const r = '012345';
    const g = '6789ABCDEF';
    const b = '012345';
    return randomColor(r, g, b)
}

function randomBlue(): string {
    const r = '012345';
    const g = '012345';
    const b = '6789ABCDEF';
    return randomColor(r, g, b)
}

function randomRed(): string {
    const r = '6789ABCDEF';
    const g = '012345';
    const b = '012345';
    return randomColor(r, g, b)
}

function randomAnyColor(): string {
    const r = '0123456789ABCDEF';
    const g = '0123456789ABCDEF';
    const b = '0123456789ABCDEF';
    return randomColor(r, g, b)
}


function drawShot(so: SpaceObject, ctx: any) {
    for (let shot of so.shotsInFlight) {
        ctx.fillStyle = shot.color
        ctx.save()
        ctx.translate(shot.position.x, shot.position.y);
        ctx.rotate((90 + shot.angleDegree) * Math.PI / 180);
        ctx.fillRect(-shot.size.x/2, -shot.size.y/2, shot.size.x, shot.size.y)
        ctx.restore()
    }
}


function drawTriangleObject(so: SpaceObject, ctx: any) {
    let scale: number = 2
    ctx.save()
    ctx.translate(so.position.x, so.position.y);
    ctx.fillStyle = '#fff'
    ctx.font = '32px courier';
    if (so.fuel < 250) ctx.fillStyle = '#ff0'
    if (so.fuel < 150) ctx.fillStyle = '#f00'
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
    ctx.strokeStyle = (so.colliding ? '#f00' : so.color)
    ctx.fillStyle = (so.colliding ? '#f00' : so.color)
    ctx.moveTo(0, (-so.size.y/2)*scale);
    ctx.lineTo((-so.size.x/4)*scale, (so.size.y/4)*scale);
    ctx.lineTo((so.size.x/4)*scale, (so.size.y/4)*scale);
    ctx.lineTo(0, (-so.size.y/2)*scale);


    // canons
    const cannonWidth: number = 20
    const cannonStart: number = 0
    const cannonEnd: number = 50
    ctx.moveTo(cannonWidth, cannonStart)
    ctx.lineTo(cannonWidth, -cannonEnd)
    ctx.moveTo(-cannonWidth, cannonStart)
    ctx.lineTo(-cannonWidth, -cannonEnd)
    ctx.stroke();

    // tower
    ctx.beginPath();
    ctx.arc(0, 20, 16, 0, Math.PI * 2)
    ctx.fill()


    // shield
    ctx.beginPath();
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#66f'
    ctx.arc(0, 0, 170, 0, Math.PI * 2)
    ctx.stroke()

    // ctx.lineWidth = 10;
    // ctx.strokeStyle = (so.colliding ? '#f00' : so.color)
    // ctx.strokeRect(-so.size.x/2, -so.size.y/2, so.size.x, so.size.y)

    ctx.restore()
    // drawVector(so.velocity, so.position, 5, ctx)
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
let rightStrafePressed = false
let leftStrafePressed = false
let leftPressed: boolean = false
let spacePressed: boolean = false
let bounce: boolean = false

function arrowControl (e: any, value: boolean) {
    if (e.key === "ArrowUp") {
        upPressed = value
    }
    if (e.key === "w") {
        upPressed = value
    }
    if (e.key === "ArrowDown") {
        downPressed = value
    }
    if (e.key === "s") {
        downPressed = value
    }
    if (e.key === "ArrowLeft") {
        leftPressed = value
    }
    if (e.key === "ArrowRight") {
        rightPressed = value
    }
    if (e.key === "a") {
        leftStrafePressed = value
    }
    if (e.key === "d") {
        rightStrafePressed = value
    }
    if (e.code === "Space") { // wtf code...
        spacePressed = value
    }
    if (e.key === "b" && value) {
        bounce = !bounce
        console.log ({bounce})
    }
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
    shot.size = {x: rndi(2, 6), y: rndi(20, 50)}
    shot.color = randomGreen()
    let head: Vec2d = copy(so.position)
    const aimError = 15
    const headError = 2
    const speedError = 10
    head = add(head, scalarMultiply(heading(so), 15))
    head = add(head, {x: rndi(-aimError, aimError), y: rndi(-aimError, aimError)})
    shot.velocity = scalarMultiply(heading(so), so.missileSpeed + rndf(0, speedError))
    add(shot.velocity, {x: rndf(-headError, headError), y: rndf(-headError, headError)})
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

    if (leftStrafePressed) {
        let angleRadians: number = (so.angleDegree-90)  * Math.PI / 180
        let engine = applyEngine(so)
        add(so.velocity, {x: engine * Math.cos(angleRadians), y: engine * Math.sin(angleRadians)})
    }

    if (rightStrafePressed) {
        let angleRadians: number = (so.angleDegree+90)  * Math.PI / 180
        let engine = applyEngine(so)
        add(so.velocity, {x: engine * Math.cos(angleRadians), y: engine * Math.sin(angleRadians)})
    }

    if (leftPressed) {
        so.angleDegree-=applySteer(so)
    }

    if (rightPressed) {
        so.angleDegree+=applySteer(so)
    }

    if (spacePressed) {
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


function handleCollisions(spaceObjects: SpaceObject[]) {
    for (let so0 of spaceObjects) {
        for (let so1 of spaceObjects) {
            if (isColliding(so0, so1) && so0.name !== so1.name) {
                so0.colliding = true
                so1.colliding = true
            }
            for (let shot of so0.shotsInFlight) {
                if (isColliding(shot, so0)) {
                    so0.health--
                }
                if (isColliding(shot, so1)) {
                    so1.health--
                }
            }
        }
    }
}

function resetCollisions(spaceObjects: SpaceObject[]) {
    for (let so of spaceObjects) {
        so.colliding = false
    }
}


const numberOfAsteroids: number = 4
let myShip: SpaceObject = createDefaultSpaceObject()
myShip.name = 'ransed'
myShip.missileSpeed = 50
myShip.size = {x: 60, y: 120}

let allSpaceObjects: SpaceObject[] = []
allSpaceObjects.push(myShip)

function renderFrame (ctx: any) {
    for (let so of allSpaceObjects) {
        drawSpaceObject(so, ctx)
    }
    resetCollisions(allSpaceObjects)
}

function nextFrame (ctx: any) {
    const screen: Vec2d = {x: ctx.canvas.width, y: ctx.canvas.height}

    handleCollisions(allSpaceObjects)
    spaceObjectKeyController(myShip)

    for (let so of allSpaceObjects) {
        if (bounce) {
            bounceSpaceObject(so, screen, 0.3)
        } else {
            wrapSpaceObject(so, screen)
        }
        friction(so, 0.992)
        updateSpaceObject(so, screen)
    }


}

function init() {
    console.log('adds event listeners')
    document.addEventListener('keydown', (event) => arrowControl(event, true));
    document.addEventListener('keyup', (event) => arrowControl(event, false));
    for (let i = 0; i<numberOfAsteroids; i++) {
        let a: SpaceObject = createDefaultSpaceObject()
        a.shape = Shape.Asteroid
        a.name = 'Asteroid #' + i
        allSpaceObjects.push(a)
    }
    console.log(allSpaceObjects)
}


const pic32lander = {renderFrame: renderFrame, nextFrame: nextFrame, init: init, round2dec: round2dec}

export default pic32lander
