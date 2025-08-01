import * as consts from '../utils/consts.js';

export class Map {

    constructor(game, level) {
        this.game = game
        this.level = level;
        this.mustrender = true
    }

    static getInstance(game, level) {
        if (!Map.instance) {
            // todo: check the return of getCurrentLevelObj
            Map.instance = new Map(game, level);
            Map.instance.render()
        }
        return Map.instance;
    }

    // todo
    // addBoom(x, y);
    // removeEnemy(x, y);

    render() {
        if (!this.mustrender) return
        let grid = document.getElementById("div")
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
                if (cell === consts.WALL) tile.style.backgroundImage = `url(${this.level.brick})`;
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
        this.mustrender = false
    }

    canPlayerMoveTo(x, y) {
        let topLeftX = Math.floor(x / this.level.block_size)
        let topLeftY = Math.floor(y / this.level.block_size)

        let topRightX = Math.floor((x + this.game.player.getPlayerWeight()) / this.level.block_size)
        let topRightY = Math.floor(y / this.level.block_size)

        let bottomLeftX = Math.floor(x / this.level.block_size)
        let bottomLeftY = Math.floor((y + this.game.player.getPlayerHeight()) / this.level.block_size)

        let bottomRightX = Math.floor((x + this.game.player.getPlayerHeight()) / this.level.block_size)
        let bottomRightY = Math.floor((y + this.game.player.getPlayerHeight()) / this.level.block_size)
        
        if (!this.isFreeSpaceInGrid(topLeftX, topLeftY)) return false
        if (!this.isFreeSpaceInGrid(topRightX, topRightY)) return false
        if (!this.isFreeSpaceInGrid(bottomLeftX, bottomLeftY)) return false
        if (!this.isFreeSpaceInGrid(bottomRightX, bottomRightY)) return false
        return true

    }

    isFreeSpaceInGrid = (x, y) =>  this.level.map[y][x] === 0
}

