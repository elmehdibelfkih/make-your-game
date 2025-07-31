import * as consts from '../utils/consts.js';

export class Map {

    constructor(game, level) {
        this.game = game
        this.level = level;
    }

    static getInstance(game, level) {
        if (!Map.instance) {
            // todo: check the return of getCurrentLevelObj
            Map.instance = new Map(game, level);
            Map.instance.runder()
        }
        return Map.instance;
    }

    // todo
    // addBoom(x, y);
    // removeEnemy(x, y);

    runder() {
        let grid = document.getElementById("div")
        if (grid) document.body.removeChild(grid)
        grid = document.createElement("div")
        grid.id = "grid"
        document.body.appendChild(grid)
        grid.style.position = "absolute";
        this.level.map.forEach((row, colIndex) => {
            row.forEach((cell, rowIndex) => {
                const tile = document.createElement("div");
                tile.style.position = "absolute";
                tile.style.transform = `translate(${64 * rowIndex}px, ${64 * colIndex}px)`;
                if (cell === consts.WALL) tile.style.backgroundImage = `url(${this.level.brick})`;
                else tile.style.backgroundImage = `url(${this.level.floor})`;
                if (cell === consts.BLOCK) {
                    const block = document.createElement("img");
                    block.src = this.level.block
                    tile.appendChild(block)
                }
                tile.style.width = this.level.tile_size;
                tile.style.height = this.level.tile_size;
                tile.style.backgroundSize = "cover";
                grid.appendChild(tile);
            });
        });
    }
}

