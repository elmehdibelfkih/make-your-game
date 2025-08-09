import * as consts from '../utils/consts.js';

export class Bomb {
    constructor(game, x, y, timestamp) {
        this.game = game
        this.x = x
        this.y = y
        this.startTime = timestamp
        this.mustrender = true
        this.image = this.game.map.level.bomb
        this.explosionTime = this.game.map.level.explosion_time
        this.explosionImg = this.game.map.level.explosion_img

        this.frameIndex = 0
        this.MS_PER_FRAME = 300
        // this.lastUpdate = performance.now()
        this.lastTime = performance.now()
        this.initBomb()
    }

    initBomb() {
        this.bomb = document.createElement("div")
        this.img = document.createElement("img")
        this.img.src = this.image
        this.bomb.appendChild(this.img)
        this.bomb.id = "bomb" + this.game.state.getBombCount()
        this.game.state.setBombCount(1)
        this.game.map.grid.appendChild(this.bomb)
        this.bomb.style.position = "absolute";
        this.bomb.style.transform = `translate(${Math.floor(this.x / this.game.map.level.block_size) * this.game.map.level.block_size}px, ${Math.floor(this.y / this.game.map.level.block_size) * this.game.map.level.block_size}px)`;
        this.game.map.level.map[Math.floor(this.y / this.game.map.level.block_size)]

        [Math.floor(this.x / this.game.map.level.block_size)] = consts.BOMB
    }

    render() {
        if (!this.mustrender) return
        this.img.src = this.image
        this.mustrender = false

    }

    update(timestamp) {
        if (timestamp - this.startTime >= this.explosionTime) {
            this.image = this.image.replace(/\d+\.png$/, "2.png");
            this.mustrender = true

            const delta = timestamp - this.lastTime;
            if (delta >= this.MS_PER_FRAME - 280) {

                // this.bomb.style.backgroundImage = `url(${this.explosionImg})`;
                // this.bomb.style.backgroundRepeat = 'no-repeat';
                // this.bomb.style.imageRendering = 'pixelated';
                if (!this.exp) {
                    this.exp = document.createElement("img")
                    this.bomb.appendChild(this.exp)
                    this.exp.style.position = "absolute";
                    this.exp.style.transform = `translate(${Math.floor(this.x / this.game.map.level.block_size) * this.game.map.level.block_size}px, ${(Math.floor(this.y / this.game.map.level.block_size) * this.game.map.level.block_size)}px)`;
                }



                this.exp.src = this.explosionImg
                this.frameIndex = (this.frameIndex + 1) % 4;
                this.explosionImg = this.explosionImg.replace(this.frameIndex + ".png", ((this.frameIndex + 1) % 4) + ".png")
                this.lastTime = timestamp;
                this.mustrender = true
            }

            return
        }

        const delta = timestamp - this.lastTime;
        if (delta >= this.MS_PER_FRAME) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.image = this.image.replace(this.frameIndex + ".png", ((this.frameIndex + 1) % 2) + ".png")
            this.lastTime = timestamp;
            this.mustrender = true
        }
    }
}


