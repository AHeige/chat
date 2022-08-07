"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function renderFrame(ctx) {
    console.log('renderFrame');
}
function nextFrame(ctx) {
    let v;
    v = { x: 0, y: 0 };
    v.x = 1;
    v.y = 2;
    return 'ts: vec2d: {v.x=' + v.x + ', v.y=' + v.y + '}';
}
const pic32lander = { render: renderFrame, nextFrame: nextFrame };
exports.default = pic32lander;
