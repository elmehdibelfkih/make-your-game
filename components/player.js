import * as consts from '../utils/consts.js';
import * as helpers from '../utils/helpers.js';


export class Player {

    constructor(game) {
        this.game = game
    }

    static getInstance = (game) => Player.instance ? Player.instance : new Player(game)

    async initPlayer() {
        this.playerCoordinate = await fetch(`assets/playerCoordinate.json`).then(res => res.json())
        if (this.player) this.game.grid.removeChild(this.player)
        this.player = document.createElement("div")
        this.player.className = 'player';
        this.dyingSound = new Audio(this.game.map.level.dying_sound);
        this.player.appendChild(this.dyingSound)
        this.game.map.grid.appendChild(this.player)
        this.initClassData()
        this.canPutBomb = true
        document.addEventListener('keydown', (event) => event.key === ' ' ? this.putBomb = true : 0)
        document.addEventListener('keyup', (event) => event.key === ' ' ? this.canPutBomb = true : 0)

    }

    initClassData() {
        this.movement = false
        this.dying = false
        this.reRender = false
        this.renderExp = false
        this.exp = null
        this.frameIndex = 0
        this.explosionFrameIndex = 0
        this.direction = 'Down'
        this.lastTime = performance.now()
        this.MS_PER_FRAME = 100

        const tmp = helpers.getCoordinates(this.game.map.level.initial_grid, consts.PLAYER)
        this.y = tmp[0] * this.game.map.level.block_size
        this.x = tmp[1] * this.game.map.level.block_size + 15
        this.game.map.gridArray[tmp[0]][tmp[1]] = consts.FLOOR
        this.player.style.backgroundImage = `url(${this.game.map.level.player})`;
        this.player.style.backgroundRepeat = 'no-repeat';
        this.player.style.imageRendering = 'pixelated';
        this.player.style.position = 'absolute';
        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.frame = this.playerCoordinate[this.direction][this.frameIndex];
        this.player.style.width = this.frame.width + "px";
        this.player.style.height = this.frame.height + "px";
        this.player.style.backgroundPosition = `${this.frame.x} ${this.frame.y}`;
        this.player.style.opacity = 1;
    }

    updateRender(timestamp) {
        this.playerDying(timestamp)
        this.movePlayer(timestamp)
        this.checkBonusSpeed()
        this.checkBonusTime()
        this.render()
    }

    playerDying(timestamp) {
        if (!this.dying) return

        if (!this.lastTimeDying) {
            this.dyingSound.play().catch(err => {
                console.error("Playback failed:", err);
            });
            this.lastTimeDying = timestamp
            this.exp = document.createElement("img")
            this.game.map.grid.appendChild(this.exp)
            this.exp.style.position = "absolute";
            this.exp.style.transform = `translate(${this.x - 20}px, ${this.y}px)`;
            this.explosionFrameIndex = 0
            this.explosionImg = this.game.map.level.player_explosion_img
            this.renderExp = true
        }
        const delta = timestamp - this.lastTimeDying;

        if (delta >= 40) {
            this.explosionImg = this.explosionImg.replace(/\d+.png/, `${++this.explosionFrameIndex}.png`)
            this.lastTimeDying = timestamp
            this.renderExp = true
            if (this.explosionFrameIndex === 10) {
                this.dying = false
                this.game.map.grid.removeChild(this.exp)
                this.lastTimeDying = null
                this.reRender = true
                this.game.state.setLives(-1)
                this.game.scoreboard.updateLives()
            }
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

        if (this.putBomb && this.canPutBomb) {
            this.game.map.addBomb(this.x + (this.getPlayerWidth() / 2), this.y + (this.getPlayerHeight() / 2), timestamp)
            this.putBomb = false
            this.canPutBomb = false
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

    render() {
        if (this.reRender) return this.initClassData()

        if (this.renderExp) {
            this.exp.src = this.explosionImg
            this.player.style.opacity = this.player.style.opacity - 0.2
            this.renderExp = false
            return
        }

        if (!this.movement && !this.animate) return

        this.player.style.transform = `translate(${this.x}px, ${this.y}px)`;

        if (this.animate) {
            this.player.style.width = this.frame.width + "px";
            this.player.style.height = this.frame.height + "px";
            this.player.style.backgroundPosition = `${this.frame.x} ${this.frame.y}`;
            this.animate = false
        }
        this.movement = false
    }

    isColliding(x, y, width, height) {
        return !this.dying && !(
            this.x + this.getPlayerWidth() <= x ||
            this.x >= x + width ||
            this.y + this.getPlayerHeight() <= y ||
            this.y >= y + height
        );
    }

    /// checker for get speed 
    checkBonusSpeed() {
        for (const bonus of this.game.map.speedBonuses) {
            const blockSize = this.game.map.level.block_size;
            if (this.isColliding(bonus.x, bonus.y, blockSize, blockSize)) {
                bonus.addspeed();
                bonus.removeitfromDOM();
                bonus.removeitfromgrid();
                this.game.map.speedBonuses = this.game.map.speedBonuses.filter(b => b !== bonus);
                bonus.showSpeedEffect();
            }
        }
    }
    checkBonusTime() {
        for (const bonus of this.game.map.timeBonuses) {
            const blockSize = this.game.map.level.block_size;
            if (this.isColliding(bonus.x, bonus.y, blockSize, blockSize)) {
                this.game.state.addtime();             
                bonus.removeitfromDOM();       
                bonus.removeitfromgrid(); 
                bonus.audio1.play().catch(err => console.error(err))
                this.game.map.timeBonuses = this.game.map.timeBonuses.filter(b => b !== bonus);
                bonus.showTimeEffect();        
            }
        }
    }

    kill = () => this.dying = true
    getPlayerHeight = () => this.playerCoordinate[this.direction][this.frameIndex].height
    getPlayerWidth = () => this.playerCoordinate[this.direction][this.frameIndex].width

}