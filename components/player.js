export class Player {
    constructor(game, x, y) {
        this.game = game
        this.x = x
        this.y = y
        this.mustrender = true
        this.direction = 'Down'
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
            this.player.style.position = "absolute";
        }
        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.mustrender = false
    }

    // ArrowUp
    // ArrowDown
    // ArrowRight
    // ArrowLeft

    update(timestamp) {
        if (this.game.state.isArrowUp() && this.game.map.canPlayerMoveTo(this.x, this.y - this.game.state.getPlayerSpeed())) {
            this.y -= this.game.state.getPlayerSpeed()
            this.direction = 'Up'
            this.mustrender = true
        }
        if (this.game.state.isArrowDown() && this.game.map.canPlayerMoveTo(this.x, this.y + this.game.state.getPlayerSpeed())) {
            this.y += this.game.state.getPlayerSpeed()
            this.direction = 'Down'
            this.mustrender = true
        }
        if (this.game.state.isArrowRight() && this.game.map.canPlayerMoveTo(this.x + this.game.state.getPlayerSpeed(), this.y)) {
            this.x += this.game.state.getPlayerSpeed()
            this.direction = 'Right'
            this.mustrender = true
        }
        if (this.game.state.isArrowLeft() && this.game.map.canPlayerMoveTo(this.x - this.game.state.getPlayerSpeed(), this.y)) {
            this.x -= this.game.state.getPlayerSpeed()
            this.direction = 'Left'
            this.mustrender = true
        }
        
        if (this.game.state.isSpace()) {
            this.game.map.addBoom(this.x, this.y, timestamp)
        }

    }

    movePlayer(timestamp) {

    }

    getPlayerHeight() {
        return 40
    }

    getPlayerWeight() {
        return 40
    }

    // intiEvent() {

    // }

}