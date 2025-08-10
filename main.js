import { Game } from "./engine/core.js"
// import { ScoreBoard } from "./components/scoreboard.js"

let game = Game.getInstance()
await game.intiElements()
game.run()
