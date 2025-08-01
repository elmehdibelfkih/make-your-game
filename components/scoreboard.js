
// the scoreborad 
// lives: ❤️❤️❤️    score: 0    level: 1    FPS: 0  menu

export class Scoreboard {
    constructor(game) {
        this.game = game
        
        let ScoreBoard = document.createElement("div")
        ScoreBoard.id = "ScoreBoard"
        document.body.appendChild(ScoreBoard)
        this.lives = document.createElement("span")
        this.lives.innerText = "lives: " + "❤️".repeat(game.state.getLives())
        ScoreBoard.appendChild(this.lives)
        this.score = document.createElement("span")
        this.score.innerText = `score: ${game.state.getScore()}`
        ScoreBoard.appendChild(this.score)
        this.level = document.createElement("span")
        this.level.innerText = `level: ${game.state.getLevel()}`
        ScoreBoard.appendChild(this.level)
        this.FPS = document.createElement("span")
        this.FPS.innerText = "FPS: 0"
        ScoreBoard.appendChild(this.FPS)
        this.timer = document.createElement("span")
        this.timer.innerText = "timer: "
        ScoreBoard.appendChild(this.timer)
    }
    
    static getInstance(game, state) {
        if (!Scoreboard.instance) {
            Scoreboard.instance = new Scoreboard(game, state)
        }
        return Scoreboard.instance
    }
    
    
    reset() {
        
    }
    
    updateLives() {        
        this.lives.innerText = "lives: " + "❤️".repeat(this.game.state.getLives())
    }
    
    updateScore() {
        this.score.innerText = `score: ${this.game.state.getScore()}`
    }
    
    updateLevel() {
        this.level.innerText = `level: ${this.game.state.getLevel()}`
    }
    
    updateTimer() {
        // this.lives.innerText = "lives: " + "❤️".repeat(this.game.state.getLives())
    }


}

