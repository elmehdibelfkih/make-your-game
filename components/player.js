export class Player {
    constructor(game, x, y) {
        this.game = game
        this.x = x
        this.y = y
        this.mustrender = true
        this.direction = 'Down'
        this.lastTime = 0;
        this.MS_PER_FRAME = 100
        this.render()
    }

    static getInstance(game) {
        if (!Player.instance) {
            Player.instance = new Player(game, game.map.level.player_x, game.map.level.player_y)
        }
        return Player.instance
    }

    async render() {
        if (!this.playerCoordinate) this.playerCoordinate = await this.game.getPlayerCoordinate()
        if (!this.mustrender) return
         if (!this.player) {
            this.player = document.createElement("div")
            this.player.className = 'player';
            this.game.map.grid.appendChild(this.player)

            this.player.style.backgroundImage = `url(${this.game.map.level.player})`;
            this.player.style.backgroundRepeat = 'no-repeat';
            this.player.style.imageRendering = 'pixelated';
            this.player.style.position = 'absolute';
            this.player.style.width = this.playerCoordinate[this.direction]['width'];
            this.player.style.height = this.playerCoordinate[this.direction]['height'];


            // let img = document.createElement("img")

            // img.src = this.game.map.level.player

            // this.player.appendChild(img)
            // this.player.id = "player"
            // this.player.style.position = "absolute";

            // console.log(this.playerCoordinate[this.direction]['height']);

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
        const delta = timestamp - lastTime;
        if (delta >= MS_PER_FRAME) {
            // frameIndex = (frameIndex + 1) % COLS;
            lastTime = timestamp;
        }

    }

    getPlayerHeight() {
        console.log((this.playerCoordinate[this.direction]['height'].replace('px', '')));
        
        return Number(this.playerCoordinate[this.direction]['height'].replace('px', ''))
    }

    getPlayerWeight() {
        // return this.playerCoordinate[this.direction]['width']
        console.log((this.playerCoordinate[this.direction]['width'].replace('px', '')));

        return Number(this.playerCoordinate[this.direction]['width'].replace('px', ''))
    }

    // intiEvent() {

    // }

}