// ==UserScript==
// @name        VanaDataHero bot
// @namespace   Violentmonkey Scripts
// @match       https://www.vanadatahero.com/home*
// @grant       none
// @version     1.0
// @author      -
// @description 29.09.2024, 13:09:16
// @downloadURL  https://github.com/xorascs/Vana/blob/main/vana.js
// @updateURL    https://github.com/xorascs/Vana/blob/main/vana.js
// @homepage     https://github.com/xorascs/Vana
// ==/UserScript==

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function simulateEvent(element, eventType, eventData) {
    const event = new PointerEvent(eventType, {
        isTrusted: true,
        bubbles: true,
        cancelable: true,
        pointerId: eventData.pointerId || 1,
        width: eventData.width || 1,
        height: eventData.height || 1,
        pressure: eventData.pressure || 0.5,
        clientX: eventData.clientX || 0,
        clientY: eventData.clientY || 0,
        screenX: eventData.screenX || 0,
        screenY: eventData.screenY || 0,
    });
    element.dispatchEvent(event);
}

async function start() {
    await sleep(5000);
    
    const canvas = document.querySelector("div[class='h-full w-full'] > canvas");
    const eventData = {
        screenX: canvas.width,
        screenY: canvas.height,
        clientX: canvas.width / 2,
        clientY: canvas.height,
        pressure: 0.5,
        pointerId: 1
    };
    while (true) {  // Use while(true) for an infinite loop
        for (let i = 0; i < 20000 / 200; i++) {
            simulateEvent(canvas, 'pointerdown', eventData);
            simulateEvent(canvas, 'mousedown', eventData);

            simulateEvent(canvas, 'pointermove', eventData);
            simulateEvent(canvas, 'mousemove', eventData);

            simulateEvent(canvas, 'pointerup', { ...eventData, pressure: 0 });
            simulateEvent(canvas, 'mouseup', { ...eventData, pressure: 0 });

            simulateEvent(canvas, 'click', { ...eventData, pressure: 0 });

            await sleep(200);  // Await the sleep function to pause execution
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
} else {
    start();
}
