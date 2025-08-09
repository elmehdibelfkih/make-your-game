import * as consts from '../utils/consts.js';
import { Bomb } from "./bomb.js"

export class Map {

    constructor(game) {
        this.game = game
        this.level
        this.mustrender = true
        this.updateLevel = false
        this.bombs = []
    }

    static getInstance = (game) => Map.instance ? Map.instance : new Map(game)


    // todo
    // removeEnemy(x, y);

    async initMap() {
        this.level = await fetch(`assets/maps/level${this.game.state.getLevel()}.json`).then(res => res.json());
        let grid = document.getElementById("grid")
        if (grid) document.body.removeChild(grid)
        grid = document.createElement("div")
        grid.id = "grid"
        document.body.appendChild(grid)
        this.grid = grid
        grid.style.position = "absolute";
        this.level.map.forEach((row, colIndex) => {
            row.forEach((cell, rowIndex) => {
                const tile = document.createElement("div");
                tile.style.position = "absolute";
                tile.style.transform = `translate(${this.level.block_size * rowIndex}px, ${this.level.block_size * colIndex}px)`;
                if (cell === consts.WALL) tile.style.backgroundImage = `url(${this.level.wall})`;
                else tile.style.backgroundImage = `url(${this.level.floor})`;
                if (cell === consts.BLOCK) {
                    const block = document.createElement("img");
                    block.src = this.level.block
                    tile.appendChild(block)
                }
                tile.style.width = `${this.level.block_size}px`;
                tile.style.height = `${this.level.block_size}px`;
                tile.style.backgroundSize = "cover";
                grid.appendChild(tile);
            });
        });
    }

    render() {
        if (!this.mustrender) return
        this.mustrender = false
    }

    canPlayerMoveTo(x, y) {
        let topLeftX = Math.floor(x / this.level.block_size)
        let topLeftY = Math.floor(y / this.level.block_size)
        if (!this.isFreeSpaceInGrid(topLeftX, topLeftY)) return false

        let topRightX = Math.floor((x + this.game.player.getPlayerWidth()) / this.level.block_size)
        let topRightY = Math.floor(y / this.level.block_size)
        if (!this.isFreeSpaceInGrid(topRightX, topRightY)) return false

        let bottomLeftX = Math.floor(x / this.level.block_size)
        let bottomLeftY = Math.floor((y + this.game.player.getPlayerHeight()) / this.level.block_size)
        if (!this.isFreeSpaceInGrid(bottomLeftX, bottomLeftY)) return false

        let bottomRightX = Math.floor((x + this.game.player.getPlayerWidth()) / this.level.block_size)
        let bottomRightY = Math.floor((y + this.game.player.getPlayerHeight()) / this.level.block_size)
        if (!this.isFreeSpaceInGrid(bottomRightX, bottomRightY)) return false

        return true
    }

    isFreeSpaceInGrid = (x, y) => this.level.map[y][x] === 0 || this.level.map[y][x] === 6

    addBoom(x, y, timestamp) {
        if (this.game.state.getBombCount() < this.game.state.getMaxAllowdBombCount()){
             this.bombs.push(new Bomb(this.game, x, y, timestamp))
        }
    }

    removeBomb() {
        
    }
}

