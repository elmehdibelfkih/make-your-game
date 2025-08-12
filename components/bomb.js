import * as consts from '../utils/consts.js';

export class Bomb {
    constructor(game, x, y, timestamp) {
        this.game = game
        this.id = this.game.state.getBombCount()
        this.done = false
        this.xMap = Math.floor(x / this.game.map.level.block_size)
        this.yMap = Math.floor(y / this.game.map.level.block_size)
        this.startTime = timestamp
        this.flashing = true
        this.image = this.game.map.level.bomb
        this.explosionTime = this.game.map.level.explosion_time
        this.explosionImg = this.game.map.level.explosion_img
        this.frameIndex = 0
        this.lastTime = performance.now()
        this.freeBlocks = []
        this.initBomb()
    }

    getId = () => this.id
    isDone =() => this.done

    initBomb() {
        this.bomb = document.createElement("div")
        this.bomb.id = "bomb" + this.id
        this.bomb.style.opacity = 1
        this.bomb.style.position = "absolute";

        this.img = document.createElement("img")
        this.img.src = this.image
        this.bomb.appendChild(this.img)

        this.game.state.setBombCount(1)
        this.game.map.grid.appendChild(this.bomb)


        this.bomb.style.transform = `translate(${this.xMap * this.game.map.level.block_size}px,
        ${this.yMap * this.game.map.level.block_size}px)`;
        this.game.map.level.map[this.yMap][this.xMap] = consts.BOMB

        this.game.map.level.map[this.yMap][this.xMap - 1] !== consts.WALL ? this.freeBlocks.push(1) : 0
        this.game.map.level.map[this.yMap][this.xMap + 1] !== consts.WALL ? this.freeBlocks.push(3) : 0
        this.game.map.level.map[this.yMap - 1][this.xMap] !== consts.WALL ? this.freeBlocks.push(2) : 0
        this.game.map.level.map[this.yMap + 1][this.xMap] !== consts.WALL ? this.freeBlocks.push(0) : 0

    }

    render() {
        if (this.done) return
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
            if (delta >= 50) {
                this.disappearing = true
                this.lastTime = timestamp;
            }
            return
        }

        if (timestamp - this.startTime >= this.explosionTime) {
            this.image = this.image.replace(/\d+\.png$/, "2.png");
            this.flashing = true
            if (delta >= 20) {
                this.frameIndex = (this.frameIndex + 1) % 4;
                this.explosionImg = this.explosionImg.replace(this.frameIndex + ".png", ((this.frameIndex + 1) % 4) + ".png")
                this.lastTime = timestamp;
            }
            this.explosion = true
            return
        }

        if (delta >= 300) {
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
                if (!this.freeBlocks.includes(i)) continue
                this.exp[i] = document.createElement("img")
                this.bomb.appendChild(this.exp[i])
                this.exp[i].style.position = "absolute";
                i === 0 ? this.exp[i].style.transform = `translate(-68px, 34px)` : 0
                i === 1 ? this.exp[i].style.transform = "rotate(90deg) translate(-17px, 119px)" : 0
                i === 2 ? this.exp[i].style.transform = "rotate(180deg) translate(68px, 68px)" : 0
                i === 3 ? this.exp[i].style.transform = "rotate(270deg) translate(17px, -9px)" : 0
            }
        }
        this.exp?.forEach(b => b ? b.src = this.explosionImg : 0);
    }

    makeDisappearing() {
        this.bomb.style.opacity = parseFloat(this.bomb.style.opacity) - 0.1;
        if (this.bomb.style.opacity <= 0) {
            console.log(this.id);
            this.game.map.grid.removeChild(this.bomb);
            this.game.state.setBombCount(-1);
            this.done = true;
        }
    }

}


