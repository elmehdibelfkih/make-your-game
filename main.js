import { Game } from "./engine/core.js"

let test = document.createElement('div')
test.id = 'test'
document.body.appendChild(test)


let game = Game.getInstance();
await game.intiElements();

window.startGame = async function () {
    document.getElementById('instructions').classList.add('hidden');
    const levelDisplay = document.getElementById('level-display');
    levelDisplay.textContent = `${game.map.level.name}`
    levelDisplay.classList.add('show');


    //  Initialize timer from JSON file to be depend on the time of level
 
    let rawTime = game.map.level.level_time;  
    let seconds;

    if (typeof rawTime === "string" && rawTime.endsWith("min")) {
        seconds = parseInt(rawTime) * 60;  
    } else {
        seconds = parseInt(rawTime); 
    }
    game.state.setTime(seconds);
    game.state.startTimer();
    // <===============================================>
    // Start the game now !!
    game.run();
    //game.state.pauseStart()
    setTimeout(() => {
        game.state.pauseStart()
        levelDisplay.classList.remove('show');
    }, 2000);
}