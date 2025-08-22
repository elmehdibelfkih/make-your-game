import * as consts from '../utils/consts.js';
// import { Game } from "./engine/core.js"
import { Bomb } from "./bomb.js"

export class Map {

    constructor(game, level) {
        this.game = game
        this.level = level;
        this.mustrender = true
        this.updateLevel = false
        this.bombs = []
        // her i creat this div for controling css !!
        this.container = document.createElement("div");
        this.container.id = "grid-container";
        document.body.appendChild(this.container)
        // I Will Make The Grid Shared !!
        this.grid = null
    }
    
    static getInstance(game, level) {
        if (!Map.instance) {
            // todo: check the return of getCurrentLevelObj
            Map.instance = new Map(game, level);
            Map.instance.render()
        }
        return Map.instance;
    }

    // creat container for css to the grid 
    // todo
    // removeEnemy(x, y);
    async render() {
        // creat div for styling the grid
        if (!this.mustrender) return
        if (this.updateLevel) this.level = await this.getCurrentLevelObj()
        //let grid = document.getElementById("grid")
        // === > 
        this.grid = document.createElement("div")
        this.grid.id = "grid"
        this.container.appendChild(this.grid)
        //this.grid = grid
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
                // HER I ADD THIS TO DETECT EVERY TILE THE CORDIANTION FOR ENEMY PLACE
                //tile.textContent =  `(${this.level.block_size * rowIndex}px, ${this.level.block_size * colIndex}px)`
                this.grid.appendChild(tile);
            });
        });
        this.mustrender = false
    }

    canPlayerMoveTo(x, y) {
        // if (Math.floor(x / this.level.block_size) === Math.floor(this.game.player.x / this.level.block_size) &&
        // Math.floor(y / this.level.block_size) === Math.floor(this.game.player.y / this.level.block_size) && ) return true
        let topLeftX = Math.floor(x / this.level.block_size)
        let topLeftY = Math.floor(y / this.level.block_size)
        if (!this.isFreeSpaceInGrid(topLeftX, topLeftY)) return false

        let topRightX = Math.floor((x + this.game.player.getPlayerWeight()) / this.level.block_size)
        let topRightY = Math.floor(y / this.level.block_size)
        if (!this.isFreeSpaceInGrid(topRightX, topRightY)) return false

        let bottomLeftX = Math.floor(x / this.level.block_size)
        let bottomLeftY = Math.floor((y + this.game.player.getPlayerHeight()) / this.level.block_size)
        if (!this.isFreeSpaceInGrid(bottomLeftX, bottomLeftY)) return false

        let bottomRightX = Math.floor((x + this.game.player.getPlayerWeight()) / this.level.block_size)
        let bottomRightY = Math.floor((y + this.game.player.getPlayerHeight()) / this.level.block_size)
        if (!this.isFreeSpaceInGrid(bottomRightX, bottomRightY)) return false

        return true
    }

    isFreeSpaceInGrid = (x, y) => this.level.map[y][x] === 0 || this.level.map[y][x] === 6

    addBoom(x, y, timestamp) {
        this.bombs.push(new Bomb(this.game, x, y, timestamp))
    }
}

