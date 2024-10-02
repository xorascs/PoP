// ==UserScript==
// @name        Banana bot
// @match       https://banana.carv.io/*
// @grant       none
// @version     1.0
// @author      xorascs
// @downloadURL https://raw.githubusercontent.com/xorascs/Banana/refs/heads/main/banana.js
// @updateURL   https://raw.githubusercontent.com/xorascs/Banana/refs/heads/main/banana.js
// @homepage    https://github.com/xorascs/Banana
// ==/UserScript==

function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function waitForElement(selector, callback) {
    const element = document.querySelector(selector);
    if (element) {
    callback(element);
    } else {
    setTimeout(() => waitForElement(selector, callback), 500);
    }
}

// Function to generate a random number within a range
function getRandomClicks(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function claimBanana() {
    waitForElement('uni-view[class="claim-container"]', async () => {
        try {
            document.querySelector('uni-view[class="claim-container"] > uni-view').click();
        } catch (err) {}
            await sleep(5000);
        try {
            document.querySelector('uni-button[class="anim-button anim-button_large anim-button_purple btn-harvest"]').click();
        } catch (err) {}
            await sleep(5000);
        try {
            document.querySelector('uni-button[class="anim-button anim-button_small anim-button_white btn-cancel"]').click();
        } catch (err) {}
            await sleep(8000);
        try {
            document.querySelector('uni-button[class="anim-button anim-button_large anim-button_grey button btn-operate"]').click();
        } catch (err) {}
    })
}

async function startClicking(clickObj, clicks) {
    for (let i = 0; i < clicks; i++) {
        clickObj.click();
        console.log(`Click: ${i + 1}`);
        await sleep(50);  // Delay between clicks (10 ms)
    }
}

async function start(clickObj, maxClickCount) {
    let remainingClicks = maxClickCount;
    let totalExecutions = 3;

    for (let j = 0; j < totalExecutions; j++) {
        let currentClickCount;

        // For the first two executions, generate random clicks
        if (j < totalExecutions - 1) {
            currentClickCount = getRandomClicks(1, remainingClicks - (totalExecutions - j - 1)); // Ensure enough clicks are left
        } else {
            // In the last execution, use the remaining clicks
            currentClickCount = remainingClicks;
        }

        remainingClicks -= currentClickCount;

        console.log(`Execution ${j + 1}: Clicking ${currentClickCount} times`);
        await startClicking(clickObj, currentClickCount);
        await sleep(8000);  // Optional: Add a delay between executions (1 second)
    }
}

async function main() {
    await sleep(5000);
    if (document.querySelector('uni-view[class="claim-container"]')) {
    console.log("Claiming banana!");
    await claimBanana();
    }
    else {
    console.log("Banana is already claimed!");
    }

    let clickObj = document.querySelectorAll('uni-button[data-v-aafd0a55]')[0];
    let maxClickObjText = document.querySelectorAll('uni-view[class="value"]')[0].textContent;
    let currentClickCount = parseInt(maxClickObjText.substring(0, maxClickObjText.indexOf('/')));
    let maxClickCount = parseInt(maxClickObjText.substring(maxClickObjText.indexOf('/') + 1));

    if (currentClickCount < maxClickCount) {
        start(clickObj, maxClickCount - currentClickCount);
    }
    else {
        console.log("Clicks is already completed!")
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}