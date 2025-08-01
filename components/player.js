export class Player {
    constructor(game, x, y) {
        this.game = game
        this.x = x
        this.y = y
        this.mustrender = true
        this.render()
    }

    static getInstance(game) {
        if (!Player.instance) {
            Player.instance = new Player(game, game.map.level.player_x, game.map.level.player_y)
        }
        return Player.instance
    }

    render() {
        if (!this.mustrender) return
        if (!this.player) {
            this.player = document.createElement("div")
            let img = document.createElement("img")
            img.src = this.game.map.level.player
            this.player.appendChild(img)
            this.player.id = "player"
            this.game.map.grid.appendChild(this.player)
            document.addEventListener('keydown', this.updatePosition.bind(this))
            this.player.style.position = "absolute";
        }

        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.mustrender = false
    }

    // ArrowUp
    // ArrowDown
    // ArrowRight
    // ArrowLeft

    updatePosition(event) {
        if (event.key === 'ArrowUp' && this.game.map.canPlayerMoveTo(this.x, this.y - this.game.state.getPlayerSpeed())) {
            this.y-=  this.game.state.getPlayerSpeed()
        }
        if (event.key === 'ArrowDown' && this.game.map.canPlayerMoveTo(this.x, this.y + this.game.state.getPlayerSpeed())) {
            this.y+= this.game.state.getPlayerSpeed()
        }
        if (event.key === 'ArrowRight' && this.game.map.canPlayerMoveTo(this.x + this.game.state.getPlayerSpeed(), this.y)) {            
            this.x+= this.game.state.getPlayerSpeed()
        }
        if (event.key === 'ArrowLeft' && this.game.map.canPlayerMoveTo(this.x - this.game.state.getPlayerSpeed(), this.y)) {
            this.x-= this.game.state.getPlayerSpeed()
        }
        this.mustrender = true
    }

    getPlayerHeight() {
        return 40
    }

    getPlayerWeight() {
        return 40
    }

}