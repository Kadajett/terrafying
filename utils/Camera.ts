import { IMap } from './Map';

const Camera = (() => {
    console.log("Camera Initialized")
    var x = 0;
    var y = 0;
    var width = 0;
    var height = 0;
    var maxX = 0;
    var maxY = 0;
    const SPEED = 256;
    const move = (delta: number, dirx: number, diry: number) => {
        // console.log("Move Calles with ", {x,y,delta, dirx, diry, maxX, maxY});
        // move camera
        x = x + (dirx * SPEED * delta);
        y = y + (diry * SPEED * delta);
        // clamp values
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        debugger;
        return { x, y }
    }

    const camera = (map: IMap, aWidth: number, aHeight: number) => {

        width = aWidth;
        height = aHeight;
        maxX = map.cols * map.tsize - width;
        maxY = map.cols * map.tsize - width
        return {
            x,
            y,
            width,
            height,
            move
        }
    }

    return camera;
})()

interface ICamera {
    x: number, y: number, width: number, height: number,
    move: (delta: number, dirx: number, diry: number) => { x: number, y: number }
}

export type { ICamera };
export default Camera;