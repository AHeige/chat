// Framework logic: take ref to canvas 2D context.
// Render the game with a main game renderFrame function.
// Step to next animation frame with a nextFrame function


function rndf(min: number, max: number) {
  return Math.random() * (max - min) + min
}

function rndi(min: number, max: number) {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function round2dec(num: number, dec: number = 2): number {
  const exp = Math.pow(10, dec)
  return Math.round((num + Number.EPSILON) * exp) / exp
}

type Vec2d = {
  x: number
  y: number
}

// refactor all vector ops to only return results and not change the arguments
function add(to: Vec2d, from: Vec2d): Vec2d {
  to.x += from.x
  to.y += from.y
  return to
}

function addc(to: Vec2d, from: Vec2d): Vec2d {
  let tmp = copy(to)
  tmp.x += from.x
  tmp.y += from.y
  return tmp
}

function sub(to: Vec2d, from: Vec2d): Vec2d {
  let tmp = copy(to)
  tmp.x -= from.x
  tmp.y -= from.y
  return tmp
}

function copy_(to: Vec2d, from: Vec2d): Vec2d {
  to.x = from.x
  to.y = from.y
  return to
}

function copy(from: Vec2d): Vec2d {
  let to: Vec2d = { x: 0, y: 0 }
  to.x = from.x
  to.y = from.y
  return to
}

function copy2(from: Vec2d): Vec2d {
  return { x: from.x, y: from.y }
}


function rndiVec(xyrnd: number): Vec2d {
  return {x: rndi(0, xyrnd), y: rndi(0, xyrnd)}
}

function rndiVec_mm(min: number, max: number): Vec2d {
  return {x: rndi(min, max), y: rndi(min, max)}
}

function rndfVec(xyrnd: number): Vec2d {
  return {x: rndf(0, xyrnd), y: rndf(0, xyrnd)}
}

function rndfVec_mm(min: number, max: number): Vec2d {
  return {x: rndf(min, max), y: rndf(min, max)}
}

function to_string(v: Vec2d): string {
  return "(" + round2dec(v.x, 0) + ", " + round2dec(v.y, 0) + ")"
}

function scalarMultiply(v: Vec2d, s: number): Vec2d {
  v.x *= s
  v.y *= s
  return v
}

function round(v: Vec2d, decimals: number): Vec2d {
  let tmp = copy2(v)
  tmp.x = round2dec(tmp.x, decimals)
  tmp.y = round2dec(tmp.y, decimals)
  return tmp
}

function floor(v: Vec2d): Vec2d {
  return {x: Math.floor(v.x), y: Math.floor(v.x)}
}

function magnitude(v: Vec2d): number {
  return Math.sqrt(Math.pow(v.x, 2) + Math.pow(v.y, 2))
}

function wrap(p: Vec2d, screen: Vec2d) {
  if (p.x < 0) {
    p.x = screen.x
  }
  if (p.x > screen.x) {
    p.x = 0
  }
  if (p.y < 0) {
    p.y = screen.y
  }
  if (p.y > screen.y) {
    p.y = 0
  }
}

function wrapSpaceObject(so: SpaceObject, screen: Vec2d) {
  wrap(so.position, screen)
}

function degToRad(deg: number): number {
  return (deg * Math.PI) / 180
}

function radToDeg(rad: number): number {
  return rad * (180/Math.PI)
}

function heading(so: SpaceObject): Vec2d {
  return {
    x: Math.cos(degToRad(so.angleDegree)),
    y: Math.sin(degToRad(so.angleDegree)),
  }
}

function headingFromAngle(angleDegree: number): Vec2d {
  return {
    x: Math.cos(degToRad(angleDegree)),
    y: Math.sin(degToRad(angleDegree)),
  }
}

function alignHeadingToVelocity(so: SpaceObject) {
  so.angleDegree = radToDeg(Math.atan2(so.velocity.y, so.velocity.x))
}

function isColliding(so0: SpaceObject, so1: SpaceObject): boolean {
  if (
    so0.position.x < so1.position.x + so1.size.x &&
    so0.position.x + so0.size.x > so1.position.x &&
    so0.position.y < so1.position.y + so1.size.y &&
    so0.position.y + so0.size.y > so1.position.y
  ) {
    return true
  }
  return false
}

function bounceSpaceObject(
  so: SpaceObject,
  screen: Vec2d,
  energyFactor: number = 1,
  gap: number = 1,
  damageDeltaFactor: number
) {
  if (so.position.x < gap) {
    so.velocity.x = -so.velocity.x * energyFactor
    so.position.x = gap
    so.bounceCount++
    so.damage = so.damage*damageDeltaFactor
  }
  if (so.position.x >= screen.x) {
    so.velocity.x = -so.velocity.x * energyFactor
    so.position.x = screen.x - gap
    so.bounceCount++
    so.damage = so.damage*damageDeltaFactor

  }
  if (so.position.y < gap) {
    so.velocity.y = -so.velocity.y * energyFactor
    so.position.y = gap
    so.bounceCount++
    so.damage = so.damage*damageDeltaFactor

  }
  if (so.position.y >= screen.y) {
    so.velocity.y = -so.velocity.y * energyFactor
    so.position.y = screen.y - gap
    so.bounceCount++
    so.damage = so.damage*damageDeltaFactor

  }
}

function gravity(so1: SpaceObject, so2: SpaceObject, G: number, mul: number) {
  const m1: number = so1.mass
  const m2: number = so2.mass
  const r: number = magnitude(sub(so1.position, so2.position))
  const r2: number = Math.pow(r, 2)
  const F: number = G * ((m1*m2)/r2)

} 

function friction(so: SpaceObject, friction: number) {
  scalarMultiply(so.velocity, friction)
}

enum Shape {
  Triangle,
  Block,
  Ellipse,
  Asteroid,
  Ship,
}

type SpaceObject = {
  shape: Shape
  mass: number
  size: Vec2d
  color: string
  position: Vec2d
  velocity: Vec2d
  acceleration: Vec2d
  angleDegree: number
  name: string
  health: number
  killCount: number
  fuel: number
  enginePower: number
  steeringPower: number
  ammo: number
  shotsInFlight: SpaceObject[]
  missileSpeed: number
  missileDamage: number
  canonCoolDown: number
  canonOverHeat: boolean
  canonHeatAddedPerShot: number
  canonCoolDownSpeed: number
  shieldPower: number
  colliding: boolean
  collidingWith: SpaceObject[]
  damage: number
  armedDelay: number
  bounceCount: number
  didHit: boolean
  shotBlowFrame: number
  afterBurnerEnabled: boolean
}

function createDefaultSpaceObject(): SpaceObject {
  let maxSpeed = 1.5
  let so: SpaceObject = {
    shape: Shape.Triangle,
    mass: 1,
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
    missileSpeed: 5, // 30
    missileDamage: 10,
    canonCoolDown: 0,
    canonOverHeat: false,
    canonHeatAddedPerShot: 25,
    canonCoolDownSpeed: 8,
    shieldPower: 100,
    colliding: false,
    collidingWith: [],
    damage: 5,
    armedDelay: 1,
    bounceCount: 0,
    didHit: false,
    shotBlowFrame: 16,
    afterBurnerEnabled: false
  }

  return so
}

function drawSpaceObject(so: SpaceObject, ctx: any) {
  switch (so.shape) {
    case Shape.Ship:
      drawShip(so, ctx)
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
  ctx.translate(so.position.x, so.position.y)
  ctx.fillStyle = so.colliding === true ? "#f00" : so.color
  // ctx.fillRect(-so.size.x / 2, -so.size.y / 2, so.size.x, so.size.y)
  ctx.fillRect(0, 0, so.size.x, so.size.y)
  ctx.font = "22px courier"
  ctx.fillStyle = '#000'
  ctx.fillText(round2dec(so.health, 0), 5, 8+(so.size.y/2))
  ctx.restore()
}

function randomColor(r: string, g: string, b: string): string {
  return (
    "#" +
    r[Math.floor(Math.random() * r.length)] +
    g[Math.floor(Math.random() * g.length)] +
    b[Math.floor(Math.random() * b.length)]
  )
}

function randomGreen(): string {
  const r = "012345"
  const g = "6789ABCDEF"
  const b = "012345"
  return randomColor(r, g, b)
}

function randomBlue(): string {
  const r = "012345"
  const g = "012345"
  const b = "6789ABCDEF"
  return randomColor(r, g, b)
}

function randomRed(): string {
  const r = "6789ABCDEF"
  const g = "012345"
  const b = "012345"
  return randomColor(r, g, b)
}

function randomAnyColor(): string {
  const r = "0123456789ABCDEF"
  const g = "0123456789ABCDEF"
  const b = "0123456789ABCDEF"
  return randomColor(r, g, b)
}

function drawShot(so: SpaceObject, ctx: any) {
  for (let shot of so.shotsInFlight) {
    if (shot.didHit) continue
    if (Math.random() > 0.990) {
      ctx.fillStyle = (shot.armedDelay < 0 ? '#00f' : '#fff')
    } else if (Math.random() > 0.985) {
      ctx.fillStyle = (shot.armedDelay < 0 ? '#ff0' : '#fff')
    } else if (Math.random() > 0.975) {
      ctx.fillStyle = (shot.armedDelay < 0 ? '#f00' : '#fff')
    } else {
      ctx.fillStyle = (shot.armedDelay < 0 ? shot.color : '#fff')
    }
    ctx.save()
    ctx.translate(shot.position.x, shot.position.y)
    ctx.rotate(((90 + shot.angleDegree) * Math.PI) / 180)
    ctx.fillRect(-shot.size.x / 2, -shot.size.y / 2, shot.size.x, shot.size.y)
    // ctx.beginPath()
    // ctx.arc(0, 0, 5, 0, 2 * Math.PI);
    // ctx.fill()
    ctx.restore()
  }
}

function drawShip(so: SpaceObject, ctx: any) {
  let scale: number = 2
  let shipSize = {x: 40, y: 80}
  ctx.save()
  ctx.translate(so.position.x, so.position.y)
  ctx.fillStyle = "#fff"
  ctx.font = "22px courier"
  if (so.fuel < 250) ctx.fillStyle = "#ff0"
  if (so.fuel < 150) ctx.fillStyle = "#f00"
  let xtext: number = 200
  ctx.fillText("fuel: " + round2dec(so.fuel, 1), xtext, -50)
  ctx.fillStyle = "#fff"
  ctx.fillText(so.name, xtext, -200)
  ctx.fillText(to_string(so.velocity), xtext, -150)
  ctx.fillText(to_string(so.position), xtext, -100)
  ctx.fillText("sif: " + so.shotsInFlight.length, xtext, 0)
  ctx.fillText("ammo: " + so.ammo, xtext, 50)
  ctx.fillText("health: " + round2dec(so.health, 1), xtext, 100)
  ctx.fillText("heat: " + round2dec(so.canonCoolDown, 1), xtext, 150)
  ctx.fillText("angle: " + round2dec(Math.abs(so.angleDegree % 360)), xtext, 200)
  ctx.rotate((round2dec(90 + so.angleDegree, 1) * Math.PI) / 180)
  ctx.beginPath()
  ctx.strokeStyle = so.color
  ctx.lineWidth = 5

  // hull
  ctx.strokeStyle = so.colliding ? "#f00" : so.color
  ctx.fillStyle = so.colliding ? "#f00" : so.color
  ctx.moveTo(0, (-shipSize.y / 2) * scale)
  ctx.lineTo((-shipSize.x / 4) * scale, (shipSize.y / 4) * scale)
  ctx.lineTo((shipSize.x / 4) * scale, (shipSize.y / 4) * scale)
  ctx.lineTo(0, (-shipSize.y / 2) * scale)

  // canons
  const cannonWidth: number = 10
  const cannonStart: number = 15
  const cannonEnd: number = 40
  ctx.moveTo(cannonWidth, cannonStart)
  ctx.lineTo(cannonWidth, -cannonEnd)
  ctx.moveTo(-cannonWidth, cannonStart)
  ctx.lineTo(-cannonWidth, -cannonEnd)
  ctx.stroke()

  // tower
  ctx.beginPath()
  ctx.arc(0, 20, 16, 0, Math.PI * 2)
  ctx.fill()

  // shield
  // ctx.beginPath()
  // ctx.lineWidth = 1
  // ctx.strokeStyle = "#66f"
  // ctx.arc(0, 0, 170, 0, Math.PI * 2)
  // ctx.stroke()

  // ctx.lineWidth = 3;
  // ctx.strokeStyle = (so.colliding ? '#f00' : so.color)
  // ctx.strokeRect(-so.size.x/2, -so.size.y/2, so.size.x, so.size.y)

  ctx.restore()
  // drawVector(so.velocity, so.position, 5, ctx)
  drawShot(so, ctx)

  if (so.afterBurnerEnabled) {
    renderAfterBurnerFrame(addc(so.position, scalarMultiply(headingFromAngle(so.angleDegree-180), 60)), ctx)
  }

  // ctx.lineWidth = 2
  // ctx.strokeStyle = '#00f'
  // ctx.strokeRect(so.position.x, so.position.y, so.size.x, so.size.y)

}

function drawVector(
  v: Vec2d,
  position: Vec2d,
  scale: number = 2,
  ctx: any,
  offset: Vec2d = { x: 0, y: 0 }
) {
  ctx.save()
  ctx.translate(position.x + offset.x, position.y + offset.y)
  ctx.beginPath()
  ctx.strokeStyle = "#fff"
  ctx.lineWidth = 5
  ctx.moveTo(0, 0)
  ctx.lineTo(scale * v.x, scale * v.y)
  ctx.stroke()
  ctx.restore()
}

let upPressed: boolean = false
let downPressed: boolean = false
let rightPressed: boolean = false
let rightStrafePressed = false
let leftStrafePressed = false
let leftPressed: boolean = false
let spacePressed: boolean = false
let bounce: boolean = true

function arrowControl(e: any, value: boolean) {
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
  if (e.code === "Space") {
    // wtf code...
    spacePressed = value
  }
  if (e.key === "b" && value) {
    bounce = !bounce
    console.log({ bounce })
  }
  if (e.key === "i") {
    console.log({allSpaceObjects})
    console.log({myShip})
  }
}

function applyEngine(so: SpaceObject): number {
  if (so.fuel > 0) {
    so.fuel -= so.enginePower
    return so.enginePower
  }
  so.fuel = 0
  console.log(so.name + " has no more fuel!", so)
  return 0
}


function fire(so: SpaceObject) {
  if (so.ammo < 1) {
    console.log(so.name + ' is out of ammo')
    return
  }
  if (so.canonOverHeat) {
    return
  }
  so.canonCoolDown+=so.canonHeatAddedPerShot
  so.ammo--
  let shot = createDefaultSpaceObject()
  shot.damage = so.missileDamage
  shot.size = { x: rndi(2, 3), y: rndi(30, 45) }
  shot.color = randomGreen()
  let head: Vec2d = copy(so.position)
  const aimError = 8
  const headError = 0.019
  const speedError = 1.8
  head = add(head, scalarMultiply(heading(so), 15))
  head = add(head, {
    x: rndi(-aimError, aimError),
    y: rndi(-aimError, aimError),
  })
  shot.velocity = scalarMultiply(
    heading(so),
    so.missileSpeed + rndf(0, speedError)
  )
  add(shot.velocity, {
    x: rndf(-headError, headError),
    y: rndf(-headError, headError),
  })
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



function decayDeadSpaceObjects(so: SpaceObject[]): SpaceObject[] {
    let out = so.filter(function (e) {
        return e.health > 0
    })
    return out
}

function decayOffScreenShots(so: SpaceObject, screen: Vec2d) {
    so.shotsInFlight = so.shotsInFlight.filter(function (e) {
        return !ofScreen(e.position, screen)
    })
}

function renderExplosionFrame(pos: Vec2d, ctx: any) {
  let offset: number = 7
  let minSize: number = 1
  let maxSize: number = 12
  ctx.save()
  ctx.translate(pos.x, pos.y)
  for (let c of ['#ff0', '#f00', '#ee0', '#e00', '#dd0', '#d00', '#008', '#000', '#444', '#fee', '#f66,', '#f99', '#fbb']) {
    let center = add({x: 0, y: 0}, {x: rndi(-offset, offset), y : rndi(-offset, offset)})
    let size = add({x: 0, y: 0}, {x: rndi(minSize, maxSize), y : rndi(minSize, maxSize)})
    ctx.fillStyle = c
    ctx.fillRect(center.x, center.y, size.x, size.y)
  }
  ctx.restore()
}

function renderAfterBurnerFrame(pos: Vec2d, ctx: any) {
  let offset: number = 12
  let minSize: number = 4
  let maxSize: number = 9
  ctx.save()
  ctx.translate(pos.x, pos.y)
  for (let c of ['#ff0', '#00f', '#ee0', '#e00', '#ccc', '#ccc', '#aaa', '#999', '#888']) {
    let center = add({x: 0, y: 0}, {x: rndi(-offset, offset), y : rndi(-offset, offset)})
    let size = add({x: 0, y: 0}, {x: rndi(minSize, maxSize), y : rndi(minSize, maxSize)})
    ctx.fillStyle = c
    ctx.fillRect(center.x, center.y, size.x, size.y)
  }
  ctx.restore()
}


function decayDeadShots(so: SpaceObject) {
  so.shotsInFlight = decayDeadSpaceObjects(so.shotsInFlight)
}

function removeShotsAfterBounces(so: SpaceObject, maxBounces: number) {
  so.shotsInFlight = so.shotsInFlight.filter(function (e) {
      return e.bounceCount <= maxBounces
  })
}


function applySteer(so: SpaceObject): number {
  return so.steeringPower
}

function spaceObjectKeyController(so: SpaceObject) {
  so.afterBurnerEnabled = false
  if (upPressed) {
    so.afterBurnerEnabled = true
    let angleRadians: number = (so.angleDegree * Math.PI) / 180
    let engine = applyEngine(so)
    add(so.velocity, {
      x: engine * Math.cos(angleRadians),
      y: engine * Math.sin(angleRadians),
    })
  }

  if (downPressed) {
    let angleRadians: number = (so.angleDegree * Math.PI) / 180
    let engine = applyEngine(so)
    add(so.velocity, {
      x: -engine * Math.cos(angleRadians),
      y: -engine * Math.sin(angleRadians),
    })
  }

  if (leftStrafePressed) {
    let angleRadians: number = ((so.angleDegree - 90) * Math.PI) / 180
    let engine = applyEngine(so)
    add(so.velocity, {
      x: engine * Math.cos(angleRadians),
      y: engine * Math.sin(angleRadians),
    })
  }

  if (rightStrafePressed) {
    let angleRadians: number = ((so.angleDegree + 90) * Math.PI) / 180
    let engine = applyEngine(so)
    add(so.velocity, {
      x: engine * Math.cos(angleRadians),
      y: engine * Math.sin(angleRadians),
    })
  }

  if (leftPressed) {
    so.angleDegree -= applySteer(so)
  }

  if (rightPressed) {
    so.angleDegree += applySteer(so)
  }

  if (spacePressed) {
    fire(so)
  }
}

function handleHittingShot(shot: SpaceObject, ctx: any) {
  if (shot.didHit) {
    shot.shotBlowFrame--
    shot.velocity = scalarMultiply(shot.velocity, -0.8)
    renderExplosionFrame(shot.position, ctx)
    if (shot.shotBlowFrame < 0) {
      shot.health = 0
    }
  }
}

function coolDown(so: SpaceObject) {

  if (so.canonCoolDown >= 100) {
    so.canonOverHeat = true
  }

  so.canonCoolDown-=so.canonCoolDownSpeed
  if (so.canonCoolDown < 1) {
    so.canonCoolDown = 0
    so.canonOverHeat = false
  }
}

function updateSpaceObject(so: SpaceObject, screen: Vec2d, ctx: any) {
  add(so.position, so.velocity)
  add(so.velocity, so.acceleration)
  coolDown(so)
  for (let shot of so.shotsInFlight) {
    add(shot.position, shot.velocity)
    add(shot.velocity, shot.acceleration)
    shot.armedDelay--
    bounceSpaceObject(shot, screen, 1, 0, 0.7)
    alignHeadingToVelocity(shot)
    handleHittingShot(shot, ctx)
  }
  // decayShots(so, screen)
  decayDeadShots(so)
  removeShotsAfterBounces(so, 2)
}

function handleCollisions(spaceObjects: SpaceObject[], ctx: any) {
  const vibration: number = 0
  for (let so0 of spaceObjects) {
    for (let so1 of spaceObjects) {
      if (isColliding(so0, so1) && so0.name !== so1.name) {
        so0.colliding = true
        so1.colliding = true
        so0.collidingWith.push(so1)
        so1.collidingWith.push(so0)
        so0.health-=25
        so1.health-=25
        renderExplosionFrame(so0.position, ctx)
        renderExplosionFrame(so1.position, ctx)
      }
      for (let shot of so0.shotsInFlight) {
        if (shot.armedDelay < 0) {
          if (isColliding(shot, so0) && shot.didHit === false) {
            so0.health-=shot.damage
            so0.position = add(so0.position, {x: rndi(-vibration, vibration), y: rndi(-vibration, vibration)})
            so0.angleDegree = so0.angleDegree + rndi(-vibration, vibration)
            shot.didHit = true
          }
          if (isColliding(shot, so1) && shot.didHit === false) {
            so1.health-=shot.damage
            so1.position = add(so1.position, {x: rndi(-vibration, vibration), y: rndi(-vibration, vibration)})
            so1.angleDegree = so0.angleDegree + rndi(-vibration, vibration)
            shot.didHit = true
          }
        }
      }
    }
  }
}

function resetCollisions(spaceObjects: SpaceObject[]) {
  for (let so of spaceObjects) {
    so.colliding = false
    so.collidingWith = []
  }
}


const numberOfAsteroids: number = 50
let myShip: SpaceObject = createDefaultSpaceObject()
let allSpaceObjects: SpaceObject[] = []

function init(cid: number, ctx: any) {

  myShip.name = "Slayer" + cid
  myShip.shape = Shape.Ship
  myShip.health = 9000
  myShip.fuel = 400
  myShip.ammo = 9000
  myShip.missileSpeed = 32
  myShip.missileDamage = 16
  myShip.canonHeatAddedPerShot = 100
  myShip.canonCoolDownSpeed = 50
  myShip.size = { x: 50, y: 50 }
  myShip.steeringPower = 0.88
  myShip.enginePower = 0.055
  myShip.color = '#fff'
  myShip.position = {x: 700, y: 600}
  myShip.velocity = {x: 0.4, y: -0.6}

  allSpaceObjects.push(myShip)


  console.log("adds event listeners")
  document.addEventListener("keydown", (event) => arrowControl(event, true))
  document.addEventListener("keyup", (event) => arrowControl(event, false))
  const edge: number = 10
  for (let i = 0; i < numberOfAsteroids; i++) {
    let a: SpaceObject = createDefaultSpaceObject()
    a.shape = Shape.Asteroid
    a.name = "Asteroid #" + i
    a.health = rndi(7000, 9999)
    a.size = rndiVec_mm(60, 120)
    a.position = { x: rndi(edge, ctx.canvas.width-edge), y: rndi(edge, ctx.canvas.height-edge) }
    allSpaceObjects.push(a)
  }
  console.log(allSpaceObjects)
}

function lowerLeft(ctx: any, padding: number) {
  const screen: Vec2d = { x: ctx.canvas.width, y: ctx.canvas.height }
  return {x: padding, y: screen.y - padding}
}

function lowerRight(ctx: any, padding: number) {
  const screen: Vec2d = { x: ctx.canvas.width, y: ctx.canvas.height }
  return {x: screen.x - padding, y: screen.y - padding}
}

function upperLeft(ctx: any, padding: number) {
  const screen: Vec2d = { x: ctx.canvas.width, y: ctx.canvas.height }
  return {x: padding, y: padding}
}

function upperRight(ctx: any, padding: number) {
  const screen: Vec2d = { x: ctx.canvas.width, y: ctx.canvas.height }
  return {x: screen.x - padding, y: padding}
}

function center(ctx: any) {
  const screen: Vec2d = { x: ctx.canvas.width, y: ctx.canvas.height }
  return {x: screen.x/2, y: screen.y/2}
}

let da: number = 0

function renderFrame(ctx: any) {
  for (let so of allSpaceObjects) {
    drawSpaceObject(so, ctx)
  }
  resetCollisions(allSpaceObjects)
  renderWatch(center(ctx), 100, ctx, da+=2)
}

function nextFrame(ctx: any) {
  const screen: Vec2d = { x: ctx.canvas.width, y: ctx.canvas.height }
  // const center: Vec2d = { x: ctx.canvas.width/2, y: ctx.canvas.height/2 }
  
  // renderExplosionFrame(center, ctx)

  allSpaceObjects = decayDeadSpaceObjects(allSpaceObjects)
  handleCollisions(allSpaceObjects, ctx)
  spaceObjectKeyController(myShip)

  for (let so of allSpaceObjects) {
    if (bounce) {
      bounceSpaceObject(so, screen, 0.9995, 0, 1)
    } else {
      wrapSpaceObject(so, screen)
    }
    // friction(so, 0.992)
    updateSpaceObject(so, screen, ctx)

    // floor positions
    // so.position = floor(so.position)
    so.size = floor(so.size)
  }
  friction(myShip, 0.991)
}

function renderWatch(pos: Vec2d, size: number, ctx: any, da: number) {
  // save current state of the context
  ctx.save()
  ctx.translate(pos.x, pos.y)
  ctx.strokeStyle = '#f00'
  ctx.lineWidth = 3
  ctx.beginPath();
  // ctx.moveTo(0, 0)
  // ctx.lineTo(0, size)
  // ctx.moveTo(0, 0)
  // ctx.lineTo(size, 0)
  // ctx.moveTo(0, 0)
  // ctx.lineTo(0, -size)
  // ctx.moveTo(0, 0)
  // ctx.lineTo(-size, 0)

  const stopx: number = 0.7
  const stopy: number = 0.7
  const startx: number = 0.4
  const starty: number = 0.4
  const da2: number = 3.5*da
  const adt: number = 30
  
  ctx.moveTo(startx*size*Math.cos(degToRad(0)), starty*size*Math.sin(degToRad(0)))
  for (let i = 0 - da; i < 360; i+=adt) {
    ctx.moveTo(startx*size*Math.cos(degToRad(i)), starty*size*Math.sin(degToRad(i)))
    ctx.lineTo(stopx*size*Math.cos(degToRad(i)), stopy*size*Math.sin(degToRad(i)))
  }

  ctx.moveTo(size*Math.cos(degToRad(da2)), size*Math.sin(degToRad(da2)))
  ctx.arc(0, 0, size, degToRad(da2), (0.36 * Math.PI)+degToRad(da2));
  // ctx.arc(0, 0, size/2, 0, 2 * Math.PI);
  // ctx.arc(0, 0, size/20, 0, 2 * Math.PI);
  // ctx.rect(-size/2, -size/2, size, size)
  // ctx.rect(-size, -size, 2*size, 2*size)
  ctx.stroke()
  ctx.restore()
}


export const pic32lander = {
  renderFrame: renderFrame,
  nextFrame: nextFrame,
  init: init,
  round2dec: round2dec,
}
