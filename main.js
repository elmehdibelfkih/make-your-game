import { Game } from "./engine/core.js"
// import { ScoreBoard } from "./components/scoreboard.js"

// document.addEventListener("DOMContentLoaded", () => {
// 
// })
//     const aud = document.createElement("audio")
//     aud.setAttribute("id", "happy_adventure")
//     aud.setAttribute("preload", "auto")
//     aud.src = "./assets/audios/happy_adventure.mp3"
//     aud.loop = true

//     document.body.appendChild(aud)

//     // Wait for user interaction
//     // document.addEventListener("click", () => {
//         aud.play().catch(err => console.error("Playback failed:", err))



// let game = new ScoreBoard()
let level = await Game.getCurrentLevelObj()
let game = Game.getInstance(level)
game.run()

// document.addEventListener("click", () => {
//     let lvs = game.state.getLives()    
//     game.state.setLives(--lvs) // todo fix this problem
//     game.scoreboard.updateLives()
// })
// scoreBoard.creatScoreBoard()
// map.render()
