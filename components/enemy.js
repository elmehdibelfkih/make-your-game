export class Enemy {

    constructor(game, level) {
        this.game = game
        //this.x = x
        //this.y = y
        //this.xMap = 11
        //this.yMap = 11
        this.enemies = [];
        this.level = level
        this.createnemy();
        //this.nextId = 0            // <-- unique id counter

        // console.log(this.level.map)
        //console.log(this.enemies); 
        //this.check();
    }

    //console.log('Enemy start coords:', game.map.level.enemy_x, game.map.level.enemy_y);
    // i Will remove this instance  later !!
    static getInstance(game, initialLevel) {
        if (!Enemy.instance) {
            Enemy.instance = new Enemy(game, initialLevel)
            //console.log('Enemy start coords:', game.map.level.enemy_x, game.map.level.enemy_y);
        }
        return Enemy.instance
    }
    // ==> I Want To CreatE Enemy <==!! \\

    // Debugging: Log the enemies array
    //console.log(this.enemies);
    //console.log(this.enemies)
    // console.log('Enemy start coords:', game.map.level.enemy_x, game.map.level.enemy_y);
    // 
    createnemy() {
        this.level.map.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                if (cellValue === 5) {
                    const x = this.level.block_size * colIndex + 12 ;
                    const y = this.level.block_size * rowIndex + 15;
                    const id = rowIndex * this.level.map[0].length + colIndex   // <-- id based on map
                    const en = new Emy(this.game, this.level, x, y, id);
                    this.enemies.push(en);
                }
            });
        });
    }
    
    update() {
        this.enemies.map((el) => el.Canmoveandupdate())
    }
    


}

// Update logic of the enemies >.

export class Emy {
    constructor(game, level, x, y, i) {
        this.game = game
        this.x = x
        this.y = y
        this.level = level
        this.id = i
        this.direction = "up"
        this.enemySize = this.level.block_size
        this.speed = 2     
        this.detect = true
        this.lastposition = ""
        this.mustrender = true
        this.targetX = x
        this.targetY = y
        this.creatediv()
    }

    creatediv() {
        if (this.mustrender) {
            this.domElement = document.createElement('div');
            this.domElement.className = 'enemy';
            this.domElement.style.backgroundImage = `url(${this.game.map.level.enemy})`;
            this.domElement.style.backgroundRepeat = 'no-repeat';
            this.domElement.style.imageRendering = 'pixelated';
            this.domElement.style.position = 'absolute';
            this.domElement.style.width = `${this.enemySize}px`;
            this.domElement.style.height = `${this.enemySize}px`;
            this.game.map.grid.appendChild(this.domElement);
        }
        this.domElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.mustrender = false
    }

    Canmoveandupdate() {
        const directions = {
            up: { rowset: -1, colset: 0 },
            down: { rowset: 1, colset: 0 },
            left: { rowset: 0, colset: -1 },
            right: { rowset: 0, colset: 1 }
        }

        const blockSize = this.level.block_size
        const col = Math.floor(this.x / blockSize)
        const row = Math.floor(this.y / blockSize)

        if (this.detect) {
            const nextRow = row + directions[this.direction].rowset
            const nextCol = col + directions[this.direction].colset

            // check if i can move !!
            if (this.Canmove(nextRow, nextCol)) {
                this.targetX = nextCol * blockSize + 12
                this.targetY = nextRow * blockSize + 15
            } else {
                this.detect = false
                this.lastposition = this.direction
            }
        } else {
            this.direction = this.randomDirection()
            this.detect = true
            if (this.direction === this.lastposition) {
                this.direction = this.randomDirection()
            }
        }
        // Move pixel by pixel to the the next tiles but not in one shoot !
        if (this.x < this.targetX) this.x += this.speed
        if (this.x > this.targetX) this.x -= this.speed
        if (this.y < this.targetY) this.y += this.speed
        if (this.y > this.targetY) this.y -= this.speed

        // get the value of the target tiles by moving !!
        if (Math.abs(this.x - this.targetX) < this.speed) this.x = this.targetX + 1
        if (Math.abs(this.y - this.targetY) < this.speed) this.y = this.targetY + 1
        this.creatediv()
    }

    Canmove(x, y) {
        return this.level.map[x] && this.level.map[x][y] === 0
    }

    randomDirection() {
        const dirs = ["up", "down", "left", "right"]
        return dirs[Math.floor(Math.random() * dirs.length)]
    }
}
