import React, { useEffect, useState } from 'react';
import Loader from '../utils/Loader';
import Keyboard from '../utils/Keyboard'
import Camera, { ICamera } from '../utils/Camera';
import Map from '../utils/Map';
import CellAuto from '../utils/cellAuto';

interface IGameState {
  ctx?: CanvasRenderingContext2D | null,
  _previousElapsedTime?: number,
  tileAtlas?: CanvasImageSource | null,
  camera?: ICamera,
  layerCanvas?: HTMLCanvasElement[],
  hasScrolled?: boolean,

}

let Game: IGameState = {
  ctx: null,
  _previousElapsedTime: 0,
  tileAtlas: null,
  camera: Camera(Map, 512, 512),
  layerCanvas: [],
  hasScrolled: false,
};

let world: unknown;

const setGame = (newGame: any) => {
  // debugger;
  if (newGame?.hasScrolled) {
    // console.log("newGameState", newGame)
  }


  Game = { ...Game, ...newGame }
}

const load = () => {
  return [
    Loader.loadImage('tiles', '/tiles.png'),
  ]
};
const init = () => {
  console.log("init called")
  Keyboard.listenForEvents([
    Keyboard.LEFT,
    Keyboard.RIGHT,
    Keyboard.UP,
    Keyboard.DOWN
  ]);
  const newLayerCanvas = Map.layers.map(() => {

    let c = document.createElement('canvas');
    // these need to not be hard coded.
    c.width = 1000;
    c.height = 1000;
    return c;
  });
  Game.tileAtlas = Loader.getImage('tiles');
  Game.layerCanvas = newLayerCanvas;
  world = new CellAuto.World({ width: Map.cols, height: Map.rows });
  initCA();
  // initial draw of the map.
  drawMap()
};

/**
 * Init CellAuto code. Splitting this as it might get a little complicated.
 */
const initCA = () => {
  
}

const update = (delta: number) => {
  setGame({ ...Game, hasScrolled: false });
  if (!Game?.camera) {
    console.warn("Failed to update() Game object malformed");
    return;
  }
  let dirx = 0;
  let diry = 0;

  if (Keyboard.isDown(Keyboard.LEFT)) { console.log("Left Pressed") }
  if (Keyboard.isDown(Keyboard.RIGHT)) { console.log("Right Pressed") }
  if (Keyboard.isDown(Keyboard.UP)) { console.log("Up Pressed") }
  if (Keyboard.isDown(Keyboard.DOWN)) { console.log("Down Pressed") }

  if (Keyboard.isDown(Keyboard.LEFT)) { dirx = -1; }
  if (Keyboard.isDown(Keyboard.RIGHT)) { dirx = 1; }
  if (Keyboard.isDown(Keyboard.UP)) { diry = -1; }
  if (Keyboard.isDown(Keyboard.DOWN)) { diry = 1; }
  if (dirx !== 0 || diry !== 0) {
    Game.hasScrolled = true;
    let newXY = Game.camera.move(delta, dirx, diry);
    Game.camera.x = newXY.x;
    Game.camera.y = newXY.y;
  }
}
const tick = (elapsed: number) => {
  window.requestAnimationFrame(tick);
  Game.ctx?.clearRect(0, 0, 512, 512);
  if (typeof Game._previousElapsedTime !== "number") {
    console.warn("Failed to tick. Game object malformed");
    return;
  }
  var delta = (elapsed - Game?._previousElapsedTime || 0) / 1000.0;
  delta = Math.min(delta, 0.25); // maximum delta of 250 ms
  Game._previousElapsedTime = elapsed;
  // debugger;
  update(delta);
  render();
}

const drawMap = () => {
  Map.layers.forEach((layer, index) => {
    drawLayer(index);
  })
}

const drawLayer = (layer: number) => {
  let context = Game.layerCanvas?.[layer]?.getContext?.('2d');
  context?.clearRect?.(0, 0, 512, 512);
  if (Game?.camera) {
    let startCol = Math.floor(Game.camera.x / Map.tsize);
    let endCol = startCol + (Game.camera.width / Map.tsize);
    let startRow = Math.floor(Game.camera.y / Map.tsize);
    let endRow = startRow + (Game.camera.height / Map.tsize);
    let offsetX = -Game.camera.x + startCol * Map.tsize;
    let offsetY = -Game.camera.y + startRow * Map.tsize;
    if (Game.tileAtlas) {
      for (let c = startCol; c <= endCol; c++) {
        for (let r = startRow; r <= endRow; r++) {
          let tile = Map.getTile(layer, c, r);
          let x = (c - startCol) * Map.tsize + offsetX;
          let y = (r - startRow) * Map.tsize + offsetY;
          if (tile !== 0) { // 0 => empty tile
            context?.drawImage?.(
              Game.tileAtlas, // image
              (tile - 1) * Map.tsize, // source x
              0, // source y
              Map.tsize, // source width
              Map.tsize, // source height
              Math.round(x),  // target x
              Math.round(y), // target y
              Map.tsize, // target width
              Map.tsize // target height
            );
          }
        }
      }
    }
  }


}
const run = (context: CanvasRenderingContext2D) => {
  Game.ctx = context;
  Game._previousElapsedTime = 0;
  let p = load();

  Promise.all(p).then((loaded) => {

    init();
    window.requestAnimationFrame(tick);
  })
}
const render = () => {
  // re-draw map if there has been scroll
  if (Game.hasScrolled) {
    drawMap();
  }
  if (Game?.layerCanvas) {
    // draw the map layers into game context
    Game.layerCanvas.forEach((layer, index) => {
      Game.ctx?.drawImage(layer, 0, 0);
    })
  }

}

const WorldContainer = () => {
  const [frame, setFrame] = useState(new Date())

  useEffect(() => {
    var baseElement = document.getElementById('demo') as HTMLCanvasElement;
    var context = baseElement.getContext('2d');
    if (context) {
      run(context)
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(new Date());
    }, 13);

    render()

    // This is important, you must clear your interval when component unmounts
    return () => clearInterval(interval);
  }, [])

  return <>
    <canvas id="demo" width="512" height="512" />
  </>;
};

export { WorldContainer };
