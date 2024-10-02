// ==UserScript==
// @name        Pop bot
// @namespace   Violentmonkey Scripts
// @match       https://planet.popp.club/*
// @grant       none
// @version     1.0
// @author      -
// @description 29.09.2024, 13:09:16
// @downloadURL  https://github.com/xorascs/PoP/blob/main/pop.js
// @updateURL    https://github.com/xorascs/PoP/blob/main/pop.js
// @homepage     https://github.com/xorascs/PoP
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

async function claimStartWindow() {
    waitForElement('div[class="text-center text-primary text-2xl font-bold"]', async (startButton) => {
        startButton.click();
        await sleep(10000);
        document.querySelector('div[class="flex items-center justify-center w-full h-14 px-2.5 text-base font-bold gap-2 w-full"]').click();
        await sleep(10000);
        document.querySelector('div[class="w-full mt-2"] > button').click()
        await sleep(10000);
    });
}

function claimDaily() {
    waitForElement('div[class="flex items-center justify-center w-full h-14 px-2.5 text-base font-bold gap-2 w-full"]', (claimButton) => {
        if (claimButton) {
            claimButton.click()
        } else {
            console.error("Claim button not found in iframe.");
        }
    })
}

async function claimSD() {
    waitForElement('div[class="px-5  bg-body h-20 fixed flex-col gap-1 bottom-bar-button  flex items-center justify-center z-50 w-full"]', async () => {
        let isClaimed = false;
        try {
            isClaimed = document.querySelector('div[class="px-5  bg-body h-20 fixed flex-col gap-1 bottom-bar-button  flex items-center justify-center z-50 w-full"] > div > button > div > div')?.textContent === 'To The Moon!';
        } catch (err) {}
        if (!isClaimed) {
            document.querySelector('div[class="px-5  bg-body h-20 fixed flex-col gap-1 bottom-bar-button  flex items-center justify-center z-50 w-full"] > button').click();
            await sleep(5000);
        }
        document.querySelector('div[class="px-5  bg-body h-20 fixed flex-col gap-1 bottom-bar-button  flex items-center justify-center z-50 w-full"] > div > button').click();
        await sleep(5000);
        document.querySelector('div[data-testid="flowbite-drawer-items"] > button').click();
    });
}

function isSDFarming() {
    if (!sessionStorage.getItem("SDFarming")) {
        let lines = (document.querySelector('button[class="w-full bg-primary/20 hover:bg-primary/20 text-primary/50  rounded-lg"] > div > div')?.childElementCount) ? document.querySelector('button[class="w-full bg-primary/20 hover:bg-primary/20 text-primary/50  rounded-lg"] > div > div').childElementCount : 0;

        if (lines == 2) {
            sessionStorage.setItem('SDFarming', true);
            return true;
        }
        else {
            sessionStorage.setItem('SDFarming', false);
            return false;
        }
    }
    return sessionStorage.getItem("SDFarming") === 'true';
}

function getPlanets() {
    let aList = document.querySelectorAll('a');
    let newList = []; // Initialize as an array

    aList.forEach(item => {
        if (item.href && item.href.includes('lucky')) {
            newList.push(item); // Use push to add items to an array
        }
    });

    return newList;
}

function getProbes() {
    location.href = "https://planet.popp.club/en/inventory/items-b";
    let probesCount = 0;

    probesCount = parseInt(document.querySelector('div[class="text-xs text-primary/50 font-medium mt-1 mb-3"]').textContent.replace('x', ''))

    sessionStorage.setItem("probesCount", probesCount);

    location.href = 'https://planet.popp.club/en/home/';
}

async function clickOnPlanet() {
    let planetList = getPlanets();

    let rndPlanetNum = Math.floor(Math.random() * planetList.length);

    try {
      planetList[rndPlanetNum].click();
    } catch (err) {}

    await sleep(5000);
    waitForElement('button[class="w-full bg-primary hover:bg-primary text-body rounded-lg"]', (startButton) => {
        startButton.click();
    })

    await sleep(10000);
    sessionStorage.setItem("probesCount", parseInt(sessionStorage.getItem("probesCount")) - 1);
    waitForElement('div[data-testid="flowbite-drawer-items"]', () => {
        document.querySelector('button[class="w-full bg-body hover:bg-body text-primary rounded-lg"]').click();
    })

    await sleep(10000);
    location.href = 'https://planet.popp.club/en/home/';
}

async function main() {
    await sleep(5000);

    if (document.querySelector('div[class="text-center text-primary text-2xl font-bold"]')) {
        await claimStartWindow();
    }
    else {
        if (document.querySelector('div[class="flex items-center justify-center w-full h-14 px-2.5 text-base font-bold gap-2 w-full"]')) {
            claimDaily();
        }
        if (!sessionStorage.getItem('probesCount')) {
            getProbes();
        }
        if (sessionStorage.getItem('probesCount') > 0) {
            await clickOnPlanet();
        }
        else {
            if (!isSDFarming()) {
                claimSD();
            }
            else {
                setTimeout(() => {location.reload();},30000);
            }
        }
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', main);
} else {
    main();
}