import * as consts from '../utils/consts.js';
import { Bomb } from "./bomb.js"
import { Enemy } from "./enemy.js"
import { Bonus } from './bonus.js';

export class Map {

    constructor(game) {
        this.bonusArray = []
        this.bonusArray.push(this.addTimeBonus.bind(this)) // todo: must be not fully random
        this.bonusArray.push(this.addSpeedBonus.bind(this))
        this.bonusArray.push(this.addHeartBonus.bind(this))
        this.game = game
        this.level
        this.grid
        this.gridArray
        this.backGroundMusic
        this.mustrender = false
        this.updateLevel = false
        this.bombs = []
        this.enemys = []
        this.loot = []
        this.blocksToBlowing = []
        this.enemyCordination
        this.tiles = [];
        this.blockElements = [];
        this.backGroundMusic;
        this.container = document.createElement("div");
        this.container.id = "grid-container";
        document.body.appendChild(this.container)
    }

    static getInstance = (game) => Map.instance ? Map.instance : new Map(game)

    async initMap() {
        this.level = await fetch(`assets/maps/level${this.game.state.getLevel()}.json`).then(res => res.json());
        this.enemyCordination = await fetch(`assets/enemycordinate.json`).then(res => res.json())
        this.initGrid()
        this.initAudios()
    }

    blowingUpBlock(x, y) {
        this.gridArray[y][x] = consts.FLOOR

        let img = document.getElementById(x.toString() + y.toString())
        let container = document.getElementsByClassName(x.toString() + y.toString())
        this.game.state.setScore(25);
        container[0].removeChild(img)
        const randomIndex = Math.floor(Math.random() * this.bonusArray.length);
        this.bonusArray[randomIndex](x, y, container[0])
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

    Canmove(row, col) {
        return this.gridArray[row] && this.gridArray[row][col] === 0
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
        this.container.appendChild(this.grid)
        this.grid.style.position = "relative";
        const rows = this.level.initial_grid.length;
        const cols = this.level.initial_grid[0].length;
        const tileSize = this.level.block_size;

        const gridWidth = cols * tileSize;
        const gridHeight = rows * tileSize;
        this.grid.style.width = `${gridWidth}px`;
        this.grid.style.height = `${gridHeight}px`;
        const scaleGrid = () => {
            const containerWidth = this.container.clientWidth;
            const containerHeight = this.container.clientHeight;
            const scaleX = (containerWidth) / gridWidth;
            const scaleY = containerHeight / gridHeight;
            const scale = Math.min(scaleX, scaleY, 1);
            /// <==========> |(-)| <==========> 
            this.currentScale = scale;
            this.tiles.forEach((tile) => {
                //if (!tile) return 
                const rowIndex = parseInt(tile.dataset.rowIndex);
                const colIndex = parseInt(tile.dataset.colIndex);
                tile.style.width = `${tileSize * scale}px`;
                tile.style.height = `${tileSize * scale}px`;
                tile.style.transform = `translate(${tileSize * rowIndex * scale}px, ${tileSize * colIndex * scale}px)`;
                tile.style.backgroundSize = `${tileSize * scale}px ${tileSize * scale}px`;
            });
            // her i handle the block !! responsive scale !!
            this.blockElements.forEach(block => {
                //if (block) return 
                block.style.width = `${tileSize * scale}px`;
                block.style.height = `${tileSize * scale}px`;
            });
            this.enemys.forEach(enemy => {
                if (!enemy) return
                enemy.Div.style.width = `${enemy.originalWidth * scale}px`;
                enemy.Div.style.height = `${enemy.originalHeight * scale}px`;
                // REMOVED THE TRANSFORM LINE
                enemy.Div.style.zIndex = "20";
                enemy.Div.style.backgroundSize = `${160 * scale}px ${160 * scale}px`;
                enemy.Div.style.imageRendering = 'pixelated';
                enemy.Div.style.backgroundRepeat = 'no-repeat';

            });
            this.loot.forEach(bonus => {
                const bonusElement = document.getElementById(bonus.id);
                //if (!bonusElement) return 
                if (bonusElement) {
                    bonusElement.style.width = `${bonus.originalWidth * scale}px`;
                    bonusElement.style.height = `${bonus.originalHeight * scale}px`;
                    // You might also need to scale the transform offset
                    const offsetX = bonus.type === 'time' ? 15 : 20;
                    const offsetY = 10;
                    bonusElement.style.transform = `translate(${offsetX * scale}px, ${offsetY * scale}px)`;
                }
            });
            //this.scaleBombs() 

            // HER I WILL HANDLE SCALL PLAYER !!
            if (this.game.player && this.game.player.forceScaleUpdate) {
                this.game.player.forceScaleUpdate();
            }
            //this.game.player.forceScaleUpdate();        
            this.grid.style.width = `${gridWidth * scale}px`;
            this.grid.style.height = `${gridHeight * scale}px`;
            this.grid.style.position = "absolute";
            this.grid.style.left = `${(containerWidth - gridWidth * scale) / 2}px`;
            this.grid.style.top = `${(containerHeight - gridHeight * scale) / 2}px`;
        };
        // safe call function !!
        this._scaleGrid = scaleGrid;
        // initial scale
        scaleGrid();
        // update scale on window resize
        window.addEventListener("resize", scaleGrid);

        this.level.initial_grid.forEach((row, colIndex) => {

            row.forEach((cell, rowIndex) => {
                const tile = document.createElement("div");
                tile.style.position = "absolute";
                tile.dataset.rowIndex = rowIndex;
                tile.dataset.colIndex = colIndex;
                tile.style.transform = `translate(${this.level.block_size * rowIndex}px, ${this.level.block_size * colIndex}px)`;

                if (cell === consts.WALL) tile.style.backgroundImage = `url(${this.level.wall})`;
                else tile.style.backgroundImage = `url(${this.level.floor})`;
                if (cell === consts.BLOCK) {
                    const block = document.createElement("img");
                    block.src = this.level.block
                    block.id = rowIndex.toString() + colIndex.toString()
                    tile.className = rowIndex.toString() + colIndex.toString()
                    tile.appendChild(block)
                    this.blockElements.push(block);
                }

                if (cell === consts.ENEMY) {
                    this.gridArray[colIndex][rowIndex] = 0
                    const x = this.level.block_size * rowIndex + 12
                    const y = this.level.block_size * colIndex + 15

                    const enemyDiv = document.createElement('div');
                    enemyDiv.className = 'enemy';
                    enemyDiv.style.backgroundImage = `url(${this.level.enemy})`;
                    enemyDiv.style.backgroundRepeat = 'no-repeat';
                    enemyDiv.style.imageRendering = 'pixelated';
                    enemyDiv.style.zIndex = 1
                    enemyDiv.style.position = 'absolute';
                    enemyDiv.style.width = `${this.enemyCordination["Left"].width}`;
                    enemyDiv.style.height = `${this.enemyCordination["Left"].height}`;
                    enemyDiv.style.backgroundPosition = `${this.enemyCordination["Left"].x}px ${this.enemyCordination["Left"].y}px`;
                    enemyDiv.style.transform = `translate(${x}px, ${y}px)`;
                    this.grid.appendChild(enemyDiv);
                    const en = new Enemy(this.game, this.level, x, y, this.enemyCordination);
                    en.Div = enemyDiv;
                    en.originalX = x;
                    en.originalY = y;
                    en.originalWidth = parseInt(this.enemyCordination["Left"].width);
                    en.originalHeight = parseInt(this.enemyCordination["Left"].height);
                    this.enemys.push(en);

                }
                tile.style.width = `${this.level.block_size}px`;
                tile.style.height = `${this.level.block_size}px`;
                tile.style.backgroundSize = "cover";
                this.grid.appendChild(tile);
                this.tiles.push(tile);
            });
        });
    }
    addSpeedBonus(xMap, yMap, node) {
        const scale = this.currentScale || 1;  
        const bonus = document.createElement("img");
        bonus.src = this.level.speed_img;
        bonus.className = "speed-bonus";
        bonus.style.width = `${30 * scale}px`
        bonus.style.height = `${40 * scale}px`;
        bonus.style.position = "absolute";
        const x = this.level.block_size * xMap;
        const y = this.level.block_size * yMap;
        bonus.style.transform = `translate(${20 * scale}px, ${10 * scale}px)`;
        bonus.id = xMap.toString() + yMap.toString() + "T";
        const id = xMap.toString() + yMap.toString() + "T";
        const Bamboleao = new Bonus(this.game, x, y, this.level, id, 'speed');
        Bamboleao.originalWidth = 30;
        Bamboleao.originalHeight = 40;
        this.loot.push(Bamboleao);
        node.appendChild(bonus);
    }
    addTimeBonus(xMap, yMap, node) {
        const scale = this.currentScale || 1;
        const bonus = document.createElement("img");
        bonus.src = this.level.time_img;
        bonus.className = "time-bonus";
        bonus.style.width = `${35 * scale}px`;
        bonus.style.height = `${50 * scale}px`;
        bonus.style.position = "absolute";
    
        const x = this.level.block_size * xMap;
        const y = this.level.block_size * yMap;
        bonus.style.transform = `translate(${15 * scale}px, ${10 * scale}px)`;
    
        bonus.id = xMap.toString() + yMap.toString() + "T";
        const id = xMap.toString() + yMap.toString() + "T";
    
        const timeBonus = new Bonus(this.game, x, y, this.level, id, 'time');
        timeBonus.originalWidth = 35;
        timeBonus.originalHeight = 50;
        this.loot.push(timeBonus);
        node.appendChild(bonus);
    }    

    addHeartBonus(xMap, yMap, node) {
        const scale = this.currentScale || 1;
        const bonus = document.createElement("img");
        bonus.src = this.level.heart_img;
        bonus.className = "heart-bonus";
        bonus.style.width = `${30 * scale}px`;
        bonus.style.height = `${40 * scale}px`;
        bonus.style.position = "absolute";
    
        const x = this.level.block_size * xMap;
        const y = this.level.block_size * yMap;
        bonus.style.transform = `translate(${20 * scale}px, ${10 * scale}px)`;
    
        bonus.id = xMap.toString() + yMap.toString() + "T";
        const id = xMap.toString() + yMap.toString() + "T";
    
        const Bamboleao = new Bonus(this.game, x, y, this.level, id, 'heart');
        Bamboleao.originalWidth = 30;
        Bamboleao.originalHeight = 40;
        this.loot.push(Bamboleao);
        node.appendChild(bonus);
    }

    initAudios() {
        this.backGroundMusic = new Audio(this.level.back_ground_music);
        this.grid.appendChild(this.backGroundMusic)
        this.backGroundMusic.preload = 'auto';
        this.backGroundMusic.loop = true;
        const soundOn = this.game.state.isSoundOn();
        this.backGroundMusic.volume = soundOn ? 0.3 : 0.0;
        const playMusic = () => {
            this.backGroundMusic.play().catch(err => {
                console.error("Playback failed:", err);
            });
            document.body.removeEventListener('click', playMusic);
            document.body.removeEventListener('keydown', playMusic);
        };
        document.body.addEventListener('click', playMusic);
        document.body.addEventListener('keydown', playMusic);
        this.game.state.updateSoundIcon();
    }
    
    destructeur() {
        document.body.removeChild(this.container)
    }

}
