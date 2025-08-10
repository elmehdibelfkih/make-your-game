import * as consts from '../utils/consts.js';

export class Bomb {
    constructor(game, x, y, timestamp) {
        this.game = game
        this.x = x
        this.y = y
        this.startTime = timestamp
        this.flashing = true
        this.image = this.game.map.level.bomb
        this.explosionTime = this.game.map.level.explosion_time
        this.explosionImg = this.game.map.level.explosion_img
        this.frameIndex = 0
        this.MS_PER_FRAME = 300
        this.lastTime = performance.now()
        this.exp
        this.initBomb()
    }

    initBomb() {
        this.bomb = document.createElement("div")
        this.bomb.style.opacity = 1
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
        if (this.flashing) {
            this.img.src = this.image
            this.flashing = false
        }
        if (this.explosion) {
            this.makeShockSound()
            this.makeExplosion()
            this.explosion = false
        }
        if (this.disappearing) {
            this.makeDisappearing()
            this.disappearing = false
        }

    }

    update(timestamp) {
        const delta = timestamp - this.lastTime;


        if (timestamp - this.startTime >= this.explosionTime + 1000) {
            // this.bomb.removeChild(this.exp)\
            if (delta >= this.MS_PER_FRAME - 250) {
                this.disappearing = true
                this.lastTime = timestamp;
            }
            return
        }

        if (timestamp - this.startTime >= this.explosionTime) {
            this.image = this.image.replace(/\d+\.png$/, "2.png");
            this.flashing = true
            if (delta >= this.MS_PER_FRAME - 280) {
                this.frameIndex = (this.frameIndex + 1) % 4;
                this.explosionImg = this.explosionImg.replace(this.frameIndex + ".png", ((this.frameIndex + 1) % 4) + ".png")
                this.lastTime = timestamp;
            }
            this.explosion = true
            return
        }

        if (delta >= this.MS_PER_FRAME) {
            this.frameIndex = (this.frameIndex + 1) % 2;
            this.image = this.image.replace(this.frameIndex + ".png", ((this.frameIndex + 1) % 2) + ".png")
            this.flashing = true
            this.lastTime = timestamp;
        }
    }

    makeShockSound() {
        if (!this.shock) {
            this.game.map.electricShock.play().catch(err => {
                console.error("Playback failed:", err);
            });
            this.shock = true
        }
    }
    makeExplosion() {
        if (!this.exp) {
            this.exp = []
            for (let i = 0; i < 4; i++) {
                this.exp[i] = document.createElement("img")
                this.bomb.appendChild(this.exp[i])
                this.exp[i].style.position = "absolute";
                if (i === 0) {
                    this.exp[i].style.transform = `translate(-68px, 34px)`;
                }
                if (i === 1) {
                    this.exp[i].style.transform = "rotate(90deg) translate(-17px, 119px)";
                }
                if (i === 2) {
                    this.exp[i].style.transform = "rotate(180deg) translate(68px, 68px)"
                }
                if (i === 3) {
                    this.exp[i].style.transform = "rotate(270deg) translate(17px, -9px)"
                }

            }
        }
        this.exp?.forEach(b => b.src = this.explosionImg);
    }

    makeDisappearing() {
        this.bomb.style.opacity = this.bomb.style.opacity - 0.1
        // console.log( this.bomb.style.opacity);

    }
}


