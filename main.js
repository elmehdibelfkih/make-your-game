import { Game } from "./engine/core.js"

window.game = Game.getInstance();
await game.intiElements();

while (!game.player || !game.player.playerCoordinate) {
    await new Promise(r => setTimeout(r, 0));
}

window.startGame = async function () {
    document.getElementById('instructions').classList.add('hidden');
    const levelDisplay = document.getElementById('level-display');
    levelDisplay.textContent = `${game.map.level.name}`
    levelDisplay.classList.add('show');
    
    //  Initialize Timer From JSON File To Be Depend On The Time Of Level !
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