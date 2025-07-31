export class Player {
    constructor(game, x, y) {
        this.game = game
        this.x = x
        this.y = y
        this.mustRunder = true
        this.runder()
    }

    static getInstance(game) {
        if (!Player.instance) {
            Player.instance = new Player(game, game.map.level.player_x, game.map.level.player_y)
        }
        return Player.instance
    }

    runder() {
        if (!this.mustRunder) return
        // todo: logic
        this.mustRunder = false
    }

    updateX() {
        // todo: logic
        this.mustRunder = true
    }

    updateY() {
        // todo: logic
        this.mustRunder = true
    }
}