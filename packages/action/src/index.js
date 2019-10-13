'use strict';
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var Bezier = require('bezier-js');
var click;
var swipe;
function useAction() {
    return {
        click: click,
        swipe: swipe
    };
}
exports.useAction = useAction;
function setAction(core) {
    var isRoot = core.isRoot;
    swipe = function (startPoint, endPoint, duration) {
        var x1 = startPoint[0];
        var y1 = startPoint[1];
        var x2 = endPoint[0];
        var y2 = endPoint[1];
        var xMax = Math.max(x1, x2);
        var xMin = Math.min(x1, x2);
        var yMax = Math.max(y1, y2);
        var yMin = Math.min(y1, y2);
        // duration 距离成正比，每100px加100毫秒
        duration = duration || random(800, 1000);
        duration += Math.max(xMax - xMin, yMax - yMin);
        if (isRoot) {
            Swipe(x1, y1, x2, y2, duration);
            sleep(duration);
            return;
        }
        var c1 = [
            Math.floor((xMax - xMin) / 3 + xMin) - random(5, 10),
            Math.floor((yMax - yMin) / 3 + yMin) + random(5, 10)
        ];
        var c2 = [
            Math.floor((xMax - xMin) / 3 * 2 + xMin) + random(5, 10),
            Math.floor((yMax - yMin) / 3 * 2 + yMin) - random(5, 10)
        ];
        // const points = bezier.getBezierPoints(50, startPoint, c1, c2, endPoint)
        var curve = new (Bezier.bind.apply(Bezier, __spreadArrays([void 0], startPoint, endPoint, c1, c2)))();
        var points = curve.getLUT(16).map(function (p) { return [Math.floor(p['x']), Math.floor(p['y'])]; });
        gesture.apply(void 0, __spreadArrays([duration], points));
    };
    click = function (x, y, delay) {
        if (delay === void 0) { delay = [600, 800]; }
        if (x == null || y == null) {
            return;
        }
        if (isRoot) {
            Tap(x, y);
            sleep(300);
        }
        else {
            press(x, y, random.apply(void 0, delay));
        }
    };
    core.provide('swipe', swipe);
    core.provide('click', click);
}
var Action = {
    install: function (core) {
        setAction(core);
    }
};
exports.default = Action;
