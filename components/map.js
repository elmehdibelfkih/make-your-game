import * as consts from '../utils/consts.js';
import { Bomb } from "./bomb.js"
import { Enemy } from "./enemy.js"
import { Bonus } from './bonus.js';

export class Map {

    constructor(game) {
        this.game = game
        this.level
        this.grid
        this.gridArray
        this.backGroundMusic
        this.mustrender = false
        this.updateLevel = false
        this.bombs = []
        this.enemys = []
        // bonus arrat 
        this.timeBonuses = []
        this.speedBonuses = []
        this.blocksToBlowing = []
        this.enemyCordination
        this.tiles = [];
        this.blockElements = [];
        // her for styling 
        this.container = document.createElement("div");
        this.container.id = "grid-container";
        document.body.appendChild(this.container)
    }

    static getInstance = (game) => Map.instance ? Map.instance : new Map(game)

    async initMap() {
        this.level = await fetch(`assets/maps/level${this.game.state.getLevel()}.json`).then(res => res.json());
        // I will fetch enemy cordination !!
        this.enemyCordination = await fetch(`assets/maps/enemycordinate.json`).then(res => res.json())
        console.log(this.level.speed)
        console.log(this.enemyCordination["Up"].width)
        this.initGrid()
        this.initAudios()
        this.initEnemy()
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
        this.game.state.setScore(25);
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
    // her it's can move enemy based on dynamic array 
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

        //return;
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
        //  <====> . <====> . <====>
        this.grid.style.width = `${gridWidth}px`;
        this.grid.style.height = `${gridHeight}px`;
        // --- SCALING LOGIC !!!
        const scaleGrid = () => {

            const containerWidth = this.container.clientWidth;
            const containerHeight = this.container.clientHeight;

            const scaleX = (containerWidth) / gridWidth;
            const scaleY = containerHeight / gridHeight;
            const scale = Math.min(scaleX, scaleY, 1);

            /// <==========> |(-)| <==========> 
            this.currentScale = scale;

            //  Each Tiles Enemy Or Player Or Bonus Will Be scaled based on the shrink of broswer !!
            /*
            this.tiles.forEach((tile, index) => {
                const rowIndex = index % cols;
                const colIndex = Math.floor(index / cols);

                tile.style.width = `${tileSize * scale}px`;
                tile.style.height = `${tileSize * scale}px`;
                tile.style.transform = `translate(${rowIndex * tileSize * scale}px, ${colIndex * tileSize * scale}px)`;
            });
            */
            this.tiles.forEach((tile) => {
                const rowIndex = parseInt(tile.dataset.rowIndex);
                const colIndex = parseInt(tile.dataset.colIndex);
                
                tile.style.width = `${tileSize * scale}px`;
                tile.style.height = `${tileSize * scale}px`;
                tile.style.transform = `translate(${tileSize * rowIndex * scale}px, ${tileSize * colIndex * scale}px)`;
                tile.style.backgroundSize = `${tileSize * scale}px ${tileSize * scale}px`;
            });
            /*
            this.enemys.forEach(enemy => {
                enemy.Div.style.width = `${enemy.originalWidth * scale}px`;
                enemy.Div.style.height = `${enemy.originalHeight * scale}px`;
                enemy.Div.style.transform = `translate(${enemy.originalX * scale}px, ${enemy.originalY * scale}px)`;
            });
            */
            // scale enemies
            /*
            this.enemys.forEach(enemy => {
                enemy.Div.style.width = `${enemy.originalWidth * scale}px`;
                enemy.Div.style.height = `${enemy.originalHeight * scale}px`;
                enemy.Div.style.transform = `translate(${enemy.originalX * scale}px, ${enemy.originalY * scale}px)`;
            });
            
            */
            // the enemies responsive scale <|-|>

            // her i handle the block !! responsive scale !!
            this.blockElements.forEach(block => {
                block.style.width = `${tileSize * scale}px`;
                block.style.height = `${tileSize * scale}px`;
            });
        
            this.enemys.forEach(enemy => {

                enemy.Div.style.width = `${enemy.originalWidth * scale}px`;
                enemy.Div.style.height = `${enemy.originalHeight * scale}px`;
                // REMOVED THE TRANSFORM LINE
                enemy.Div.style.zIndex = "20";
                enemy.Div.style.backgroundSize = `${160 * scale}px ${160 * scale}px`;
                enemy.Div.style.imageRendering = 'pixelated';
                enemy.Div.style.backgroundRepeat = 'no-repeat';

            });

            this.timeBonuses.forEach(timeBonus => {
                const bonusElement = document.getElementById(timeBonus.id);
                if (bonusElement) {
                    bonusElement.style.width = `${timeBonus.originalWidth * scale}px`;
                    bonusElement.style.height = `${timeBonus.originalHeight * scale}px`;
                    bonusElement.style.transform = `translate(${15 * scale}px, ${10 * scale}px)`;
                }
            });

            this.speedBonuses.forEach(speedBonus => {
                const bonusElement = document.getElementById(speedBonus.id);
                if (bonusElement) {
                    // her i 
                    if (speedBonus.originalWidth && speedBonus.originalHeight) {
                        bonusElement.style.width = `${speedBonus.originalWidth * scale}px`;
                        bonusElement.style.height = `${speedBonus.originalHeight * scale}px`;

                        const translateX = 20 * scale;
                        const translateY = 10 * scale;
                        bonusElement.style.transform = `translate(${translateX}px, ${translateY}px)`;
                    }
                }
            });
            // speed scale
            // <===|-|===> 
            // <===|-|==>
            // Center the grid
            this.grid.style.width = `${gridWidth * scale}px`;
            this.grid.style.height = `${gridHeight * scale}px`;
            this.grid.style.position = "absolute";
            this.grid.style.left = `${(containerWidth - gridWidth * scale) / 2}px`;
            this.grid.style.top = `${(containerHeight - gridHeight * scale) / 2}px`;
        };

        // safe call function 
        this._scaleGrid = scaleGrid;
        // initial scale
        scaleGrid();
        // update scale on window resize
        window.addEventListener("resize", scaleGrid);

        this.level.initial_grid.forEach((row, colIndex) => {

            row.forEach((cell, rowIndex) => {
                const tile = document.createElement("div");
                tile.style.position = "absolute";
                tile.dataset.rowIndex = rowIndex;  // Add this
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
                    //this.tiles.push(block)
                }
                // Her I WILL  add Speed !!

                if (cell === consts.SPEED) {
                    console.log("howa")
                    const bonus = document.createElement("img");
                    bonus.src = this.level.speed
                    bonus.className = "speed-bonus";
                    //bonus.dataset.speed = 2;      
                    bonus.style.width = `${30}px`;
                    bonus.style.height = `${40}px`;
                    bonus.style.position = "absolute";
                    //bonus.style
                    var x = this.level.block_size * rowIndex
                    var y = this.level.block_size * colIndex
                    // her i will put it in ther cordination in grid 
                    bonus.style.transform = `translate(${20}px, ${10}px)`;
                    // Her I Will Create CLASS !! la class aben 3mi
                    // I Neeed To Remove It In Grid Later !!
                    bonus.id = rowIndex.toString() + colIndex.toString()
                    const id = rowIndex.toString() + colIndex.toString()
                    const Bamboleao = new Bonus(this.game, x, y, this.level, id)
                    //bonus.style.zIndex = 10;
                    Bamboleao.originalWidth = 30;  // <====>
                    Bamboleao.originalHeight = 40 // <====>
                    this.speedBonuses.push(Bamboleao)
                    tile.appendChild(bonus);
                    // her i add them to the array for scaling them later !!
                    //this.tiles.push(bonus)
                }

                // === Add TIME Bonus ===
                if (cell === consts.TIME) {
                    const bonus = document.createElement("img");
                    bonus.src = this.level.time;  // <- path to your clock/hourglass image
                    bonus.className = "time-bonus";
                    bonus.style.width = `${35}px`;
                    bonus.style.height = `${50}px`;
                    bonus.style.position = "absolute";

                    const x = this.level.block_size * rowIndex;
                    const y = this.level.block_size * colIndex;

                    bonus.style.transform = `translate(${15}px, ${10}px)`;

                    bonus.id = rowIndex.toString() + colIndex.toString() + "T";
                    const id = rowIndex.toString() + colIndex.toString() + "T";
                    // Create Bonus object (reuse your Bonus class, or make a TimeBonus class)
                    const timeBonus = new Bonus(this.game, x, y, this.level, id);

                    //timeBonus.W = 
                    timeBonus.originalWidth = 35
                    timeBonus.originalHeight = 50
                    //en.originalHeight = parseInt(this.enemyCordination["Left"].height);
                    // point to the target enemy !!
                    this.timeBonuses.push(timeBonus);
                    tile.appendChild(bonus);
                    //this.tiles.push(bonus)
                }

                tile.style.width = `${this.level.block_size}px`;
                tile.style.height = `${this.level.block_size}px`;
                tile.style.backgroundSize = "cover";
                this.grid.appendChild(tile);
                this.tiles.push(tile);
            });

        });
    }
    // when i creadted new div on top of this i get problem of the enmiey it's not visible becs ..
    // the floor it's will be in the top every time so for that i will creat enemy separate from grid

    initEnemy() {
        this.level.initial_grid.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                if (cellValue === consts.ENEMY) {
                    // her i will accesse to enemy and make it 0
                    //console.log("before the add 0 to grid", this.level.initial_grid)
                    //console.log(" the ",  this.level.initial_grid[rowIndex][colIndex])
                    this.gridArray[rowIndex][colIndex] = 0
                    const x = this.level.block_size * colIndex + 12
                    const y = this.level.block_size * rowIndex + 15
                    //console.log("after the add 0", this.level.initial_grid)
                    // ===>>>>>>>> Create enemy div <<<<=============
                    const enemyDiv = document.createElement('div');
                    enemyDiv.className = 'enemy';
                    enemyDiv.style.backgroundImage = `url(${this.level.enemy})`;
                    enemyDiv.style.backgroundRepeat = 'no-repeat';
                    enemyDiv.style.imageRendering = 'pixelated';
                    enemyDiv.style.position = 'absolute';
                    enemyDiv.style.width = `${this.enemyCordination["Left"].width}`;
                    enemyDiv.style.height = `${this.enemyCordination["Left"].height}`;
                    enemyDiv.style.backgroundPosition = `${this.enemyCordination["Left"].x}px ${this.enemyCordination["Left"].y}px`;
                    enemyDiv.style.transform = `translate(${x}px, ${y}px)`;
                    this.grid.appendChild(enemyDiv);
                    // ============ Store enemy object (Emy) ============
                    const en = new Enemy(this.game, this.level, x, y, this.enemyCordination);
                    en.Div = enemyDiv;
                    en.originalX = x;
                    en.originalY = y;
                    en.originalWidth = parseInt(this.enemyCordination["Left"].width);
                    en.originalHeight = parseInt(this.enemyCordination["Left"].height);
                    // point to the target enemy !!
                    this.enemys.push(en);
                    // and then push it to ARRAY !!
                    // for more resonnsife !! 
                    //this.tiles.push(enemyDiv)
                }
            });
        });
        if (this._scaleGrid) {
            this._scaleGrid();
        }
    }


    /*
    initEnemy() {
        const tileSize = this.level.block_size;

        this.level.initial_grid.forEach((row, rowIndex) => {
            row.forEach((cell, colIndex) => {

                if (cell === consts.ENEMY) {
                    const x = this.level.block_size * colIndex + 12; // offset inside tile
                    const y = this.level.block_size * rowIndex + 15;

                    const enemyDiv = document.createElement("div");
                    enemyDiv.className = "enemy";
                    enemyDiv.style.backgroundImage = `url(${this.level.enemy})`;
                    enemyDiv.style.backgroundRepeat = "no-repeat";
                    enemyDiv.style.imageRendering = "pixelated";
                    enemyDiv.style.position = "absolute";
                    enemyDiv.style.width = `${this.enemyCordination["Left"].width}px`;
                    enemyDiv.style.height = `${this.enemyCordination["Left"].height}px`;
                    enemyDiv.style.backgroundPosition = `${this.enemyCordination["Left"].x}px ${this.enemyCordination["Left"].y}px`;
                    enemyDiv.style.transform = `translate(${x}px, ${y}px)`;
                    enemyDiv.style.zIndex = 1000;

                    this.grid.appendChild(enemyDiv);

                    const en = new Enemy(this.game, this.level, x, y, this.enemyCordination);
                    en.Div = enemyDiv;
                    en.originalX = x;            // store actual pixel x
                    en.originalY = y;            // store actual pixel y
                    en.originalWidth = this.enemyCordination["Left"].width;
                    en.originalHeight = this.enemyCordination["Left"].height;
                    en.rowIndex = rowIndex;
                    en.colIndex = colIndex;

                    this.enemys.push(en);
                }

                });
        });
    }
    */

    //console.log(this.level.initial_grid)

    initAudios() {
        this.backGroundMusic = new Audio(this.level.back_ground_music);
        this.grid.appendChild(this.backGroundMusic)
        this.backGroundMusic.preload = 'auto';
        this.backGroundMusic.loop = true;
        this.backGroundMusic.volume = 0.3;
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
        document.body.removeChild(this.container)
        //this.instance = null
    }
}

