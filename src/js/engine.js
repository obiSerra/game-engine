import * as u from "./utils.js";
import * as r from "./render.js";
import * as c from "./constants.js";

export class Game {
  constructor() {
    this.lastFrame = null;
    this.lastEx = null;
    this.delta = null;
    this.canvas = null;
    this.ctx = null;
    this.entities = [];
  }
}

class Pipeline {
  constructor(game) {
    this.game = game;
  }
  sideEffect(stepFn) {
    stepFn(this.game);
    return this;
  }
  step(stepFn) {
    this.game = stepFn(this.game);
    return this;
  }
}

function detectCollision(collider, collidee) {
  const l1 = collider.left();
  const t1 = collider.top();
  const r1 = collider.right();
  const b1 = collider.bottom();

  const l2 = collidee.left();
  const t2 = collidee.top();
  const r2 = collidee.right();
  const b2 = collidee.bottom();

  return !(b1 < t2 || t1 > b2 || r1 < l2 || l1 > r2);
}

function speedTresh(speed) {
  if (Math.abs(speed) < 1) return 0;
  else return speed;
}

function detectCollisions(game) {
  const l = game.entities.length;
  const bounce = 0.8;
  for (let i = 0; i < l; i++) {
    const collider = game.entities[i];
    for (let j = 0; j < l; j++) {
      const collidee = game.entities[j];
      if (
        i !== j &&
        collider.box2d.type === c.entities.T_DYN &&
        detectCollision(collider.box2d, collidee.box2d)
      ) {
        const b1 = collider.box2d;
        const b2 = collidee.box2d;
        console.log(b1.bottom(), b2.top(), b1.v);
        if (b1.bottom() > b2.top() && b1.v[1] > 0) {
          game.entities[i].box2d.v = [b1.v[0], -(b1.v[1] * bounce)];
        } else if (b1.top() < b2.bottom() && b1.v[1] < 0) {
          game.entities[i].box2d.v = [b1.v[0], -(b1.v[1] * bounce)];
        } else if (b1.right() > b2.left() && b1.v[0] > 0) {
          game.entities[i].box2d.v = [-(b1.v[0] * bounce), b1.v[1]];
        } else if (b1.left() < b2.right() && b1.v[0] < 0) {
          game.entities[i].box2d.v = [-(b1.v[1] * bounce), b1.v[1]];
        }
      }
    }
  }

  return game;
}

function detectOutscreen(entity, canvas) {
  return (
    entity.bottom() > canvas.height ||
    entity.top() < 0 ||
    entity.left < 0 ||
    entity.right() > canvas.width
  );
}

// Calculate velocity and position:
// vel +=  (acc * elapsed) + g(if subject to gravity)
// pos += (vel * elapsed)
const calcMov = (v, a, e, g = [0, 0]) =>
  [0, 1].map((i) => v[i] + a[i] * e + g[i]);

function move(elap, entity) {
  let box2d = entity.box2d;

  const g = [c.physic.GRAVITY_X * elap, c.physic.GRAVITY_Y * elap];

  if (box2d.type === c.entities.T_DYN)
    box2d.v = calcMov(box2d.v, box2d.a, elap, g);
  else if (box2d.type === c.entities.T_KIN)
    box2d.v = calcMov(box2d.v, box2d.a, elap);

  box2d.p = calcMov(box2d.p, box2d.v, elap);
  entity.box2d = box2d;
  return entity;
}

function moveEntities(game) {
  game.entities = game.entities.map((e) => move(game.delta / 1000, e));
  return game;
}
function runLoop(game, timestamp) {
  const w = window;

  if (!game.lastFrame) game.lastFrame = timestamp;

  game.delta = timestamp - game.lastFrame;
  game.lastEx = Date.now();
  let pipe = new Pipeline(game);

  pipe = pipe.step(moveEntities).step(detectCollisions);

  if (!u.isFunc(w.requestAnimationFrame)) {
    u.errLog("Your browser is not supported");
    return;
  }

  game.lastFrame = timestamp;

  return game;
}

function renderPipeline(game) {
  const pipe = new Pipeline(game);
  pipe.sideEffect(r.clean).sideEffect(r.renderEntities);
}

export function startLoop(game) {
  window.requestAnimationFrame(nextLoop(game));
  game.lastEx = Date.now();
  backupLoop(game);
}

function backupLoop(game) {
  const g = runLoop(game, Date.now());
  //renderPipeline(g);

  setTimeout(() => backupLoop(g), 1000 / 60);
}

export function nextLoop(game) {
  return (timestamp) => {
    //const g = runLoop(game, timestamp);
    renderPipeline(game);
    window.requestAnimationFrame(nextLoop(game));
  };
}
