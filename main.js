import { Game } from "./engine/core.js"
// import { ScoreBoard } from "./components/scoreboard.js"

let test = document.createElement('div')
test.id = 'test'
document.body.appendChild(test)



let game = Game.getInstance()
await game.intiElements()
game.run()
