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

const mistakeCounter = document.querySelector(".mistake-counter");

class Game {
    constructor(time, timer, wiresModule, buttonModule) {
        this.mistakes = 0;
        this.victoryPoints = 0;
        this.time = time;
        this.timer = timer;
        this.wiresModule = wiresModule;
        this.buttonModule = buttonModule;
    }

    //todo gameover

    checkGameover = () => {
        if (!this.timer.currentTime || this.mistakes === 3) {
            this.timer.stopTimer();
            console.log("game over");
            const loss = document.querySelector(".loss");
            const gameDisplay = document.getElementById("game");
            const gameBack = document.getElementById("game-back");
            gameDisplay.style.display = "none";
            gameBack.style.display = "none";
            loss.style.display = "flex";
        }
        if (this.victoryPoints === 2) {
            this.timer.stopTimer();
            console.log("you win!");
            const victory = document.querySelector(".victory");
            const gameDisplay = document.getElementById("game");
            const gameBack = document.getElementById("game-back");
            gameDisplay.style.display = "none";
            gameBack.style.display = "none";
            victory.style.display = "flex";
            victory.h1.innerHTML = `PARABÉNS! VC GANHOU, FALTANDO ${this.timer.printSplit()}`;
        }
    };
    //quando ganhar ou perder vai fazer o window.reload

    renderWires = () => {
        const isCompletedDiv = document.createElement("div");
        isCompletedDiv.classList.add("not-completed");
        const gameDisplay = document.querySelector("#game");
        const wireModule = document.createElement("div");
        wireModule.classList.add("wire-module");
        wireModule.appendChild(isCompletedDiv);
        gameDisplay.appendChild(wireModule);
        this.wiresModule.wires.forEach((e) => {
            const handler = () => {
                if (e.correctWire) {
                    this.victoryPoints++;
                    console.log(`victory: ${this.victoryPoints}`);
                    isCompletedDiv.classList.remove("not-completed");
                    isCompletedDiv.classList.add("completed");
                    wireDiv.removeEventListener("click", handler);
                    this.checkGameover();
                    let wireList = document.querySelectorAll(".wire");
                    for (let i = 0; i < wireList.length; i++) {
                        let elClone = wireList[i].cloneNode(true);
                        wireList[i].parentNode.replaceChild(elClone, wireList[i]);
                    }
                } else {
                    this.mistakes++;
                    mistakeCounter.innerText += "X";
                    wireDiv.removeEventListener("click", handler);
                    this.checkGameover();
                }
            };
            let wireDiv = e.wireAsDiv();
            wireModule.appendChild(wireDiv);
            wireDiv.addEventListener("click", handler);
        });
    };

    renderButton = () => {
        this.buttonModule.setStripCondition();
        const gameDisplay = document.querySelector("#game");
        const buttonModule = document.createElement("div");
        const isCompletedDiv = document.createElement("div");
        isCompletedDiv.classList.add("not-completed");
        buttonModule.classList.add("button-module");
        gameDisplay.appendChild(buttonModule);
        let button = this.buttonModule.buttonAsDiv();
        buttonModule.appendChild(isCompletedDiv);
        buttonModule.appendChild(button);

        let interval;

        const mouseDownHandler = () => {
            interval = setInterval(() => {
                this.buttonModule.holdCounter++;
            }, 1);
            console.log("mouse down fired");
            if (this.buttonModule.stripCondition) {
                this.renderStrip();
            }
        };

        const mouseUpHandler = () => {
            clearInterval(interval);
            if (!this.buttonModule.stripCondition) {
                if (this.buttonModule.holdCounter < this.buttonModule.holdThreshold) {
                    this.victoryPoints++;
                    console.log(`victory: ${this.victoryPoints}`);
                    isCompletedDiv.classList.remove("not-completed");
                    isCompletedDiv.classList.add("completed");
                    button.removeEventListener("mousedown", mouseDownHandler);
                    button.removeEventListener("mouseup", mouseUpHandler);
                    this.checkGameover();
                } else {
                    this.mistakes++;
                    mistakeCounter.innerText += "X";
                    this.checkGameover();
                }
            } else {
                let string = this.printMinutes() + this.printSeconds();
                string = string.split("").map((e) => Number(e));
                if (string.includes(this.buttonModule.stripCondition)) {
                    this.victoryPoints++;
                    console.log(`victory: ${this.victoryPoints}`);
                    isCompletedDiv.classList.remove("not-completed");
                    isCompletedDiv.classList.add("completed");
                    button.removeEventListener("mousedown", mouseDownHandler);
                    button.removeEventListener("mouseup", mouseUpHandler);
                    this.checkGameover();
                } else {
                    this.mistakes++;
                    mistakeCounter.innerText += "X";
                    this.checkGameover();
                }
            }
            this.buttonModule.holdCounter = 0;
            this.clearStrip();
            console.log("mouse up fired");
        };

        button.addEventListener("mousedown", mouseDownHandler);
        button.addEventListener("mouseup", mouseUpHandler);
    };

    clearStrip = () => {
        const strip = document.querySelector(".strip");
        if (strip) {
            strip.remove();
        }
    };

    renderStrip = () => {
        if (this.buttonModule.holdThreshold !== -1) {
            return null;
        }
        const buttonModule = document.querySelector(".button-module");
        const strip = document.createElement("div");
        strip.classList.add(this.buttonModule.strip);
        strip.classList.add("strip");
        buttonModule.appendChild(strip);
    };

    renderSerialNumber = () => {
        const backDisplay = document.getElementById("game-back");
        const serialNumber = this.wiresModule.serialNumber.toUpperCase();
        const serialNumberDiv = document.createElement("div");
        serialNumberDiv.innerHTML = `<h2>${serialNumber}</h2>`;
        backDisplay.appendChild(serialNumberDiv);
    };

    renderBatteries = () => {
        const backDisplay = document.getElementById("game-back");
        const batteries = this.buttonModule.batteries;
        for (let i = 0; i < batteries; i++) {
            const batteryDiv = document.createElement("div");
            batteryDiv.classList.add("battery");
            backDisplay.appendChild(batteryDiv);
        }
    };

    renderIndicator = () => {
        if (!this.buttonModule.indicator) {
            return null;
        }
        const backDisplay = document.getElementById("game-back");
        const indicatorDiv = document.createElement("div");
        const lightDiv = document.createElement("div");
        const light = this.buttonModule.indicator.isLit;
        if (light) {
            lightDiv.classList.add("lit");
        } else {
            lightDiv.classList.add("not-lit");
        }
        const labelDiv = document.createElement("div");
        const label = this.buttonModule.indicator.label;
        labelDiv.classList.add("label");
        labelDiv.innerHTML = `<h2>${label}</h2>`;
        indicatorDiv.appendChild(lightDiv);
        indicatorDiv.appendChild(labelDiv);
        backDisplay.appendChild(indicatorDiv);
    };

    printTime = () => {
        this.printMinutes();
        this.printSeconds();
        this.checkGameover();
    };

    printMinutes = () => {
        let minutes = this.timer.twoDigitsNumber(this.timer.getMinutes());
        minDec.innerText = minutes[0];
        minUni.innerText = `${minutes[1]}:`;
        return minutes;
    };

    printSeconds = () => {
        let seconds = this.timer.twoDigitsNumber(this.timer.getSeconds());
        secDec.innerText = seconds[0];
        secUni.innerText = seconds[1];
        return seconds;
    };
}

window.onload = () => {
    document.getElementById("start").onsubmit = (e) => {
        e.preventDefault();
        startGame();
    };
    const playAgainBtnList = document.querySelectorAll(".play-again");
    playAgainBtnList.forEach((button) => {
        button.onclick = () => {
            location.reload();
        };
    });
};

const startGame = () => {
    // display Changes
    const gameDisplay = document.querySelector("#game");
    const gameBack = document.querySelector("#game-back");
    const menu = document.querySelector("#menu");
    menu.style.display = "none";
    gameDisplay.style.display = "flex";

    const spinBtnList = document.querySelectorAll(".spin-btn");

    spinBtnList.forEach((e) => {
        console.log(e);
        console.log(gameDisplay.style);
        e.onclick = () => {
            console.log("spin-btn fired");
            if (gameDisplay.style.display === "flex") {
                gameDisplay.style.display = "none";
                gameBack.style.display = "flex";
            } else {
                gameBack.style.display = "none";
                gameDisplay.style.display = "flex";
            }
        };
    });

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
    const game = new Game(time, timer, wiresModule, buttonModule);
    game.timer.startTimer(game.printTime);
    game.wiresModule.makeWires();
    game.wiresModule.setCorrectWire();
    game.renderWires();
    game.buttonModule.makeButton();
    game.buttonModule.setHoldThreshold();
    game.renderButton();
    game.renderSerialNumber();
    game.renderBatteries();
    game.renderIndicator();
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
        label = INDICATORS[index];
        let isLit = Math.random() < 0.5;
        return {
            label: label,
            isLit: isLit,
        };
    }
    return false;
};