'use strict';

import { Plugin, isRoot, isPause} from '@auto.pro/core'
const Bezier = require('bezier-js')

/**
 * 根据坐标进行点击，若坐标不存在则啥都不做
 * @param {number} x 要点击的横坐标
 * @param {number} y 要点击的纵坐标
 * @param {[number, number]} delay 点击后的等待延迟，默认是[600, 800]，600-800毫秒
 */
export let click: (x: number, y: number, delay?: [number, number] | [600, 800]) => any

/**
 * 根据给定的两个点进行滑动，root模式直接使用两点滑动，无障碍模式下使用贝塞尔曲线
 * @param {[number, number]} startPoint 起点
 * @param {[number, number]} endPoint 终点
 * @param {number} duration 滑动时间，默认随机800-1000毫秒，并根据两点距离进行调整
 */
export let swipe: (startPoint: [number, number], endPoint: [number, number], duration?: number) => any

function setAction () {

    swipe = (startPoint: [number, number], endPoint: [number, number], duration?: number) => {
        while (isPause) {}
        const x1 = startPoint[0]
        const y1 = startPoint[1]
        const x2 = endPoint[0]
        const y2 = endPoint[1]
        const xMax = Math.max(x1, x2)
        const xMin = Math.min(x1, x2)
        const yMax = Math.max(y1, y2)
        const yMin = Math.min(y1, y2)

        // duration 距离成正比，每100px加100毫秒
        duration = duration || random(800, 1000)
        duration += Math.max(xMax - xMin, yMax - yMin)

        if (isRoot) {
            Swipe(x1, y1, x2, y2, duration)
            sleep(duration)
            return
        }

        const c1 = [
            Math.floor((xMax - xMin) / 3 + xMin) - random(5, 10),
            Math.floor((yMax - yMin) / 3 + yMin) + random(5, 10)
        ]
        const c2 = [
            Math.floor((xMax - xMin) / 3 * 2 + xMin) + random(5, 10),
            Math.floor((yMax - yMin) / 3 * 2 + yMin) - random(5, 10)
        ]

        const curve = new Bezier(...startPoint, ...endPoint, ...c1, ...c2)
        const points = curve.getLUT(16).map(p => [Math.floor(p['x']), Math.floor(p['y'])])
        gesture(duration, ...points)
    } 
    click = (x: number, y: number, delay: [number, number] = [600, 800]) => {
        while (isPause) {}
        if (x == null || y == null) {
            return
        }
        if (isRoot) {
            Tap(x, y)
            sleep(300)
        } else {
            press(x, y, random(...delay))
        }
    }
}

const Action: Plugin = {
    install (option={}) {
        setAction()
    }
}

export default Action
