import * as consts from '../utils/consts.js';
import * as helpers from '../utils/helpers.js';


export class Player {
    constructor(game) {
        this.game = game
        this.x
        this.y
        this.movement
        this.direction
        this.lastTime
        this.dying
        this.MS_PER_FRAME
        this.frameIndex
        this.explosionFrameIndex
    }

    static getInstance = (game) => Player.instance ? Player.instance : new Player(game)

    async initPlayer() {
        this.playerCoordinate = await fetch(`assets/playerCoordinate.json`).then(res => res.json())
        if (this.player) this.game.grid.removeChild(this.player)
        this.player = document.createElement("div")
        this.player.className = 'player';
        this.game.map.grid.appendChild(this.player)
        this.initClassData()

    }

    initClassData() {
        this.movement = false
        this.dying = false
        this.direction = 'Down'
        this.lastTime = performance.now()
        this.MS_PER_FRAME = 100
        this.frameIndex = 0
        this.explosionFrameIndex = 0
        const tmp = helpers.getCoordinates(this.game.map.level.initial_grid, consts.PLAYER)
        this.y = tmp[0] * this.game.map.level.block_size
        this.x = tmp[1] * this.game.map.level.block_size + 15
        this.game.map.gridArray[tmp[0]][tmp[1]] = 0
        this.player.style.backgroundImage = `url(${this.game.map.level.player})`;
        this.player.style.backgroundRepeat = 'no-repeat';
        this.player.style.imageRendering = 'pixelated';
        this.player.style.position = 'absolute';
        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.frame = this.playerCoordinate[this.direction][this.frameIndex];
        this.player.style.width = this.frame.width;
        this.player.style.height = this.frame.height;
        this.player.style.backgroundPosition = `${this.frame.x} ${this.frame.y}`;
        this.player.style.opacity = 1;
        this.exp = null
    }

    render() {
        if (this.reRender) this.initClassData()

        if (this.exp) {
            this.exp.src = this.explosionImg
            this.player.style.opacity = this.player.style.opacity - 0.1
            return
        }

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
        this.playerDying(timestamp)
        if (this.dying) return
        this.movePlayer(timestamp)
    }

    playerDying(timestamp) {
        if (!this.dying) return
        if (!this.lastTimeDying) {
            this.lastTimeDying = performance.now()
            this.exp = document.createElement("img")
            this.game.map.grid.appendChild(this.exp)
            this.exp.style.position = "absolute";
            this.exp.style.transform = `translate(${this.x}px, ${this.y}px)`;
            this.frameIndex = 0
            this.explosionFrameIndex = 0
            this.explosionImg = this.game.map.level.player_explosion_img
        }
        const delta = timestamp - this.lastTimeDying;

        if (delta >= 800) {
            this.exp.src = this.exp.src.replace(/\d+/, `${++this.explosionFrameIndex}`)
        }
        if (this.explosionFrameIndex === 10) {
            this.dying = false
            this.game.map.grid.removeChild(this.exp)
            this.lastTimeDying = null
            this.reRender = true
        }
    }

    movePlayer(timestamp) {
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
        if (this.game.state.isSpace() && (!this.lastBomb || timestamp - this.lastBomb > 500)) {
            this.lastBomb = timestamp
            this.game.map.addBomb(this.x + (this.getPlayerWidth() / 2), this.y + (this.getPlayerHeight() / 2), timestamp)
        }
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

    isColliding(x, y, width, height) {
        return !this.dying && !(
            this.x + this.getPlayerWidth() <= x ||
            this.x >= x + width ||
            this.y + this.getPlayerHeight() <= y ||
            this.y >= y + height
        );
    }




    kill = () => this.dying = true
    getPlayerHeight = () => Number(this.playerCoordinate[this.direction][this.frameIndex]['height'].replace('px', ''))
    getPlayerWidth = () => Number(this.playerCoordinate[this.direction][this.frameIndex]['width'].replace('px', ''))

}