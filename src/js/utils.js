export function log(msg) {
  console.log(msg);
}

export function errLog(msg) {
  console.error(msg);
}

export function isFunc(target) {
  return typeof target === "function";
}

export function extend(instance, methodName, method) {
  instance[methodName] = method.bind(instance);
}

export function opPoints(p1, p2, fn) {
  return [fn(p1[0], p2[0]), fn(p1[1], p2[1])];
}
