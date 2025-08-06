import * as consts from '../utils/consts.js';

export class Bomb {
    constructor(game, x, y, timestamp) {
        this.game = game
        this.x = x
        this.y = y
        this.timestamp = timestamp
        this.mustrender = true
        this.image = this.game.map.level.bomb
        this.lastUpdate = performance.now()
        this.render()
    }

    render() {
        if (!this.mustrender) return
        if (!this.bomb) {
            this.bomb = document.createElement("div")
            let img = document.createElement("img")
            img.src = this.image
            this.bomb.appendChild(img)
            this.bomb.id = "bomb" + this.game.state.getBombCount()
            this.game.state.setBombCount(1)
            this.game.map.grid.appendChild(this.bomb)
            this.bomb.style.position = "absolute";
            this.bomb.style.transform = `translate(${Math.floor(this.x / this.game.map.level.block_size) * this.game.map.level.block_size}px, ${Math.floor(this.y / this.game.map.level.block_size) * this.game.map.level.block_size}px)`;
            this.game.map.level.map[Math.floor(this.y / this.game.map.level.block_size)]
            [Math.floor(this.x / this.game.map.level.block_size)] = consts.BOMB
        }

    }

    update(timestamp) {
        
    }
}


