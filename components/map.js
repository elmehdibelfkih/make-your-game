import * as consts from '../utils/consts.js';
import { Bomb } from "./bomb.js"

export class Map {

    constructor(game) {
        this.game = game
        this.level
        this.grid
        this.gridArray
        this.mustrender = false
        this.updateLevel = false
        this.bombs = []
        this.blocksToBlowing = []
    }

    static getInstance = (game) => Map.instance ? Map.instance : new Map(game)

    async initMap() {
        this.level = await fetch(`assets/maps/level${this.game.state.getLevel()}.json`).then(res => res.json());
        this.initGrid()
        this.initAudios()
    }

    render() {
        if (!this.mustrender) return
        // document.body.removeChild(this.grid)        // document.body.removeChild(this.grid)
        this.mustrender = false
    }

    updateRender(timstamp) {
        // this.bombs = this.bombs.filter(bomb => !bomb.isDone());
        this.render()
    }



    blowingUpBlock(x, y) {
        this.gridArray[y][x] = consts.FLOOR
        let img = document.getElementById(x.toString() + y.toString())
        let container = document.getElementsByClassName(x.toString() + y.toString())
        console.log(this.gridArray[y][x]);
        
        container[0].removeChild(img)

        // this.blocksToBlowing.push()
    }

    
    canPlayerMoveTo(x, y) {
        const blockSize = this.level.block_size;
        const width = this.game.player.getPlayerWidth();
        const height = this.game.player.getPlayerHeight();
        const corners = [
            [x, y],
            [x + width, y],
            [x, y + height],
            [x + width, y + height]
        ];
        
        for (const [cx, cy] of corners) {
            const gridX = Math.floor(cx / blockSize);
            const gridY = Math.floor(cy / blockSize);            
            if (!this.isFreeSpaceInGrid(gridX, gridY)) return false
        }
        return true;
    }
    
    isBlock = (x, y) => this.gridArray[y][x] === consts.BLOCK
    isFreeSpaceInGrid = (x, y) => this.gridArray[y][x] !== consts.BLOCK && this.gridArray[y][x] !== consts.WALL

    addBomb(x, y, timestamp) {
        if (this.game.state.getBombCount() < this.game.state.getMaxAllowdBombCount()) {
            this.bombs.push(new Bomb(this.game, x, y, timestamp))
        }
    }

    initGrid() {
        this.gridArray = this.level.initial_grid.map(row => [...row])
        if (this.grid) document.body.removeChild(grid)
        this.grid = document.createElement("div")
        this.grid.id = "grid"
        document.body.appendChild(this.grid)
        this.grid.style.position = "absolute";
        this.level.initial_grid.forEach((row, colIndex) => {
            row.forEach((cell, rowIndex) => {
                const tile = document.createElement("div");
                tile.style.position = "absolute";
                tile.style.transform = `translate(${this.level.block_size * rowIndex}px, ${this.level.block_size * colIndex}px)`;
                if (cell === consts.WALL) tile.style.backgroundImage = `url(${this.level.wall})`;
                else tile.style.backgroundImage = `url(${this.level.floor})`;

                if (cell === consts.BLOCK) {
                    const block = document.createElement("img");
                    block.src = this.level.block
                    block.id = rowIndex.toString() + colIndex.toString()
                    tile.className = rowIndex.toString() + colIndex.toString()
                    tile.appendChild(block)
                }

                tile.style.width = `${this.level.block_size}px`;
                tile.style.height = `${this.level.block_size}px`;
                tile.style.backgroundSize = "cover";
                this.grid.appendChild(tile);
            });
        });
    }

    initAudios() {
        this.backGroundMusic = new Audio(this.level.back_ground_music);
        this.grid.appendChild(this.backGroundMusic)
        this.backGroundMusic.preload = 'auto';
        this.backGroundMusic.loop = true;
        this.backGroundMusic.volume = 0.4;
        const playMusic = () => {
            this.backGroundMusic.play().catch(err => {
                console.error("Playback failed:", err);
            });
            document.body.removeEventListener('click', playMusic);
            document.body.removeEventListener('keydown', playMusic);
        };
        document.body.addEventListener('click', playMusic);
        document.body.addEventListener('keydown', playMusic);
    }

    destructeur() {
        document.body.removeChild(this.grid)
        this.instance = null
    }
}

