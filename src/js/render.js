export function render(game, entity) {
  game.ctx.fillRect(
    entity.box2d.p[0],
    entity.box2d.p[1],
    entity.box2d.w,
    entity.box2d.h
  );
}

export function clean(game) {
  game.ctx.clearRect(0, 0, game.canvas.width, game.canvas.height);
  return game;
}

export function renderEntities(game) {
  game.entities.forEach((e) => render(game, e));
  return game;
}
