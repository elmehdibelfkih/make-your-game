export class Player {

    constructor(game, x, y) {
        this.game = game
        this.x = x
        this.y = y
        this.mustrender = true
        this.direction = 'Down'
        this.lastTime = 0;
        this.MS_PER_FRAME = 400
        this.frameIndex = 0
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
            this.game.map.grid.appendChild(this.player) // I add here player to father 
            this.player.style.backgroundImage = `url(${this.game.map.level.player})`;
            this.player.style.backgroundRepeat = 'no-repeat';
            this.player.style.imageRendering = 'pixelated';
            this.player.style.position = 'absolute';
            this.player.style.width = this.playerCoordinate[this.direction]['width'];
            this.player.style.height = this.playerCoordinate[this.direction]['height'];
            this.player.style.backgroundPosition = `${this.playerCoordinate[this.direction]['x']} ${this.playerCoordinate[this.direction]['y']}`;
        }
        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        // her it's add frame for exemple last is at index 0  it's fix and then it will be 1 and click it's simulation moving "soubaaiss"
        if (this.frame) {
            this.player.style.width = this.frame.width;
            this.player.style.height = this.frame.height;
            this.player.style.backgroundPosition = `${this.frame.x} ${this.frame.y}`;
            this.frameIndex = (this.frameIndex + 1) % this.playerCoordinate['walking' + this.direction].length;
        }
        this.mustrender = false
    }

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
        this.movePlayer(timestamp)
    }

    movePlayer(timestamp) {
        if (!this.playerCoordinate) return
        const delta = timestamp - this.lastTime;
        if (this.mustrender) {
            this.frame = this.playerCoordinate['walking' + this.direction][this.frameIndex];
        } else {
            this.player.style.width = this.playerCoordinate[this.direction]['width'];
            this.player.style.height = this.playerCoordinate[this.direction]['height'];
            this.player.style.backgroundPosition = `${this.playerCoordinate[this.direction].x} ${this.playerCoordinate[this.direction].y}`;
            return
        }
        if (delta >= this.MS_PER_FRAME) {
            this.lastTime = timestamp;
            this.player.style.width = this.frame.width;
            this.player.style.height = this.frame.height;
            this.player.style.backgroundPosition = `${this.frame.x} ${this.frame.y}`;
            this.frameIndex = (this.frameIndex + 1) % this.playerCoordinate['walking' + this.direction].length;
        }
    }

    getPlayerHeight = () => Number(this.playerCoordinate[this.direction]['height'].replace('px', ''))
    // getPlayerWeight = () => 33
    getPlayerWeight = () => Number(this.playerCoordinate[this.direction]['width'].replace('px', ''))

}