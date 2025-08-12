export class Player {
    constructor(game) {
        this.game = game
        this.x
        this.y
        this.movement = false
        this.direction = 'Down'
        // this.lastTime = 0;
        this.lastTime =  performance.now()

        this.MS_PER_FRAME = 100
        this.frameIndex = 0
    }

    static getInstance = (game) => Player.instance ? Player.instance : new Player(game)

    async initPlayer() {
        this.playerCoordinate = await fetch(`assets/playerCoordinate.json`).then(res => res.json())
        this.x = this.game.map.level.player_x
        this.y = this.game.map.level.player_y
        this.player = document.createElement("div")
        this.player.className = 'player';
        this.game.map.grid.appendChild(this.player)
        this.player.style.backgroundImage = `url(${this.game.map.level.player})`;
        this.player.style.backgroundRepeat = 'no-repeat';
        this.player.style.imageRendering = 'pixelated';
        this.player.style.position = 'absolute';
        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.frame = this.playerCoordinate[this.direction][this.frameIndex];
        this.player.style.width = this.frame.width;
        this.player.style.height = this.frame.height;
        this.player.style.backgroundPosition = `${this.frame.x} ${this.frame.y}`;
    }

    render() {
        if (!this.movement && !this.animate) return
        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        if (this.animate) {
            this.player.style.width = this.frame.width;
            this.player.style.height = this.frame.height;
            this.player.style.backgroundPosition = `${this.frame.x} ${this.frame.y}`;
            this.animate = false
        }
        this.movement = false
    }

    update(timestamp) {
        if (this.game.state.isArrowUp() && this.game.map.canPlayerMoveTo(this.x, this.y - this.game.state.getPlayerSpeed())) {
            this.y -= this.game.state.getPlayerSpeed()
            this.direction = 'walkingUp'
            this.movement = true
        }
        if (this.game.state.isArrowDown() && this.game.map.canPlayerMoveTo(this.x, this.y + this.game.state.getPlayerSpeed())) {
            this.y += this.game.state.getPlayerSpeed()
            this.direction = 'walkingDown'
            this.movement = true
        }
        if (this.game.state.isArrowRight() && this.game.map.canPlayerMoveTo(this.x + this.game.state.getPlayerSpeed(), this.y)) {
            this.x += this.game.state.getPlayerSpeed()
            this.direction = 'walkingRight'
            this.movement = true
        }
        if (this.game.state.isArrowLeft() && this.game.map.canPlayerMoveTo(this.x - this.game.state.getPlayerSpeed(), this.y)) {
            this.x -= this.game.state.getPlayerSpeed()
            this.direction = 'walkingLeft'
            this.movement = true
        }
        if (this.game.state.isSpace() && (!this.lastBomb || timestamp - this.lastBomb > 1500 )) {
            this.lastBomb = timestamp
            this.game.map.addBomb(this.x + (this.getPlayerWidth() / 2), this.y + (this.getPlayerHeight() / 2) , timestamp)
        }
        this.movePlayer(timestamp)


    }

    movePlayer(timestamp) {
        if (!this.movement && this.direction.includes("walking")) {
            this.direction = this.direction.replace("walking", '')
            this.animate = true
            this.frameIndex = 0
            this.frame = this.playerCoordinate[this.direction][this.frameIndex];
            return
        }

        const delta = timestamp - this.lastTime;
        if ((delta >= this.MS_PER_FRAME) && this.movement) {
            this.frame = this.playerCoordinate[this.direction][this.frameIndex];
            this.lastTime = timestamp;
            this.animate = true
            this.frameIndex = (this.frameIndex + 1) % this.playerCoordinate[this.direction].length;
        }
    }

    getPlayerHeight = () => Number(this.playerCoordinate[this.direction][this.frameIndex]['height'].replace('px', ''))
    getPlayerWidth = () => Number(this.playerCoordinate[this.direction][this.frameIndex]['width'].replace('px', ''))

}