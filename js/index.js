const INDICATORS = [
    "SND",
    "CLR",
    "CAR",
    "IND",
    "FRQ",
    "SIG",
    "NSA",
    "MSA",
    "TRN",
    "BOB",
    "FRK",
];

let minDec = document.getElementById("minDec");
let minUni = document.getElementById("minUni");
let secDec = document.getElementById("secDec");
let secUni = document.getElementById("secUni");

// todo how to make more than one module render

class Game {
    constructor(time, modules, timer, wiresModule, buttonModule) {
        this.mistakes = 0;
        this.victoryPoints = 0;
        this.time = time;
        this.modules = modules;
        this.timer = timer;
        this.wiresModule = wiresModule;
        this.buttonModule = buttonModule;
    }

    //todo gameover

    checkGameover = () => {
        if (!this.timer.currentTime || this.mistakes === 3) {
            this.timer.stopTimer();
            console.log("game over");
        }
        if (this.victoryPoints == this.modules) {
            this.timer.stopTimer();
            console.log("you win!");
        }
    };

    // todo disable all event handlers when hitting the right wire;

    renderWires = () => {
        const gameDisplay = document.querySelector("#game");
        const wireModule = document.createElement("div");
        wireModule.classList.add("wire-module");
        gameDisplay.appendChild(wireModule);
        this.wiresModule.wires.forEach((e) => {
            const handler = () => {
                if (e.correctWire) {
                    this.victoryPoints++;
                    console.log(`victory: ${this.victoryPoints}`);
                    wireDiv.removeEventListener("click", handler);
                    this.checkGameover();
                    let wireList = document.querySelectorAll(".wire");
                    for (let i = 0; i < wireList.length; i++) {
                        let elClone = wireList[i].cloneNode(true);
                        wireList[i].parentNode.replaceChild(elClone, wireList[i]);
                    }
                } else {
                    this.mistakes++;
                    console.log(`mistakes ${this.mistakes}`);
                    wireDiv.removeEventListener("click", handler);
                    this.checkGameover();
                }
            };
            let wireDiv = e.wireAsDiv();
            wireModule.appendChild(wireDiv);
            console.log(wireDiv);
            wireDiv.addEventListener("click", handler);
        });
    };

    renderSerialNumber = () => {};

    renderBatteries = () => {};

    printTime = () => {
        this.printMinutes();
        this.printSeconds();
        this.checkGameover();
    };

    printMinutes = () => {
        let minutes = this.timer.twoDigitsNumber(this.timer.getMinutes());
        minDec.innerText = minutes[0];
        minUni.innerText = minutes[1];
    };

    printSeconds = () => {
        let seconds = this.timer.twoDigitsNumber(this.timer.getSeconds());
        secDec.innerText = seconds[0];
        secUni.innerText = seconds[1];
    };
}

window.onload = () => {
    document.getElementById("start").onsubmit = (e) => {
        e.preventDefault();
        startGame();
    };
};

const startGame = () => {
    // display Changes
    const gameDisplay = document.querySelector("#game");
    const menu = document.querySelector("#menu");
    menu.style.display = "none";
    gameDisplay.style.display = "block";

    // timer Initialization
    let time = document.querySelector(".time").value * 60;
    const timer = new Timer(time);

    //widgets initialization
    let serialNumber = randomizeSerialNumber();
    let batteries = randomizeBatteries();
    let indicator = randomizeIndicator();

    // wiresModule initialization
    const wiresModule = new WiresModule(randomizeNumberOfWires(), serialNumber);

    // buttonsModule initialization
    const buttonModule = new ButtonModule(batteries, indicator);

    // game Initialization
    const modules = document.querySelector(".modules").value;
    console.log(modules);
    const game = new Game(time, modules, timer, wiresModule, buttonModule);
    game.timer.startTimer(game.printTime);
    game.wiresModule.makeWires();
    game.wiresModule.setCorrectWire();
    game.renderWires();
    game.buttonModule.makeButton();
};

const randomizeSerialNumber = () => {
    let randomString;
    do {
        randomString = Math.random().toString(36).slice(-5);
    } while (randomString.split("").every((e) => typeof e === "number"));
    randomString += Math.floor(Math.random() * 10);
    return randomString;
};

const randomizeBatteries = () => Math.floor(Math.random() * 4);

const randomizeNumberOfWires = () => Math.floor(Math.random() * (7 - 3) + 3);

const randomizeIndicator = () => {
    let isThereIndicator = Math.random() < 0.5;
    let indicator;
    if (isThereIndicator) {
        let index = Math.floor(Math.random() * INDICATORS.length);
        indicator = INDICATORS[index];
        let isLit = Math.random() < 0.5;
        return {
            indicator: indicator,
            isLit: isLit,
        };
    }
    return false;
};