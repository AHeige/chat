
// Framework logic: take ref to canvas 2D context.
// Render the game with a main game renderFrame function.
// Step to next animation frame with a nextFrame function

type vec2d = {
    x: number;
    y: number;
};

function renderFrame (ctx: any) {
    console.log ('renderFrame')
}

function nextFrame (ctx: any) {
    let v : vec2d;
    v = {x: 0, y:0};
    v.x = 1;
    v.y = 2;
    return 'ts: vec2d: {v.x=' + v.x + ', v.y=' + v.y + '}';
}

const pic32lander = {render: renderFrame, nextFrame: nextFrame}

export default pic32lander
