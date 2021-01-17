import * as u from "./utils.js";
import * as e from "./engine.js";
import * as c from "./constants.js";
class Box2d {
  constructor(pos, w, h, type = c.entities.T_DYN) {
    this.p = pos;
    this.m = 1;
    this.w = w;
    this.h = h;
    this.type = type;
    this.a = [0, 0];
    this.v = [0, 0];
  }
  middle() {
    return [this.p[0] + this.w / 2, this.p[1] + this.h / 2];
  }
  left() {
    return this.p[0];
  }
  right() {
    return this.p[0] + this.w;
  }
  top() {
    return this.p[1];
  }
  bottom() {
    return this.p[1] + this.h;
  }
}
class Entity {
  constructor(box2d) {
    this.box2d = box2d;
    this.id = Math.random(0, 9999);
  }
}

const sq = new Entity(new Box2d([20, 20], 10, 10));
const pave = new Entity(new Box2d([0, 200], 600, 10, c.entities.T_KIN));
function onExit() {
  this.box2d.p = [20, 20];
}
u.extend(sq, "onExit", onExit.bind(sq));

const game = new e.Game();

game.canvas = document.querySelector("canvas");
game.ctx = game.canvas.getContext("2d");
game.entities = [
  sq,
  pave,
  new Entity(new Box2d([100, 100], 600, 10, c.entities.T_KIN)),
  new Entity(new Box2d([0, 0], 600, 10, c.entities.T_KIN)),
  new Entity(new Box2d([0, 0], 10, 600, c.entities.T_KIN)),
  new Entity(new Box2d([100, 0], 10, 600, c.entities.T_KIN)),
];

e.startLoop(game);
