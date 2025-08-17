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
                    const x = this.level.block_size * colIndex + 12;
                    const y = this.level.block_size * rowIndex + 11;
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
        this.direction = "down"
        this.enemySize = this.level.block_size
        this.speed = 1
        this.detect = true
        this.lastposition = ""
        this.mustrender = true
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
            this.domElement.style.transform = `translate(${this.x}px, ${this.y}px)`;

        }
        this.domElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
        this.mustrender = false
    }

    // Check if enemy can move based on its size !
    // Renamed method for better naming convention
    Canmoveandupdate() {
        if (this.detect) {
            // here there is the direction of up  down 
            const directions = {
                up: { rowset: -1, colset: 0 },
                down: { rowset: 1, colset: 0 },
                left: { rowset: 0, colset: -1 },
                right: { rowset: 0, colset: 1 }
            }
            // I Will Check The Direction At First If It's Space In Grid At First ! <==> ! 
            var blockSize = this.level.block_size
            var col = Math.floor(this.x / blockSize);
            var row = Math.floor(this.y / blockSize);
            // i will get the cordination base of the direction 
            var nextRow = row + directions[this.direction].rowset
            var nextCol = col + directions[this.direction].colset
            // this variable it's for moving the enmies base on the correct direction 
            var Xchange = directions[this.direction].colset
            var Ychange = directions[this.direction].rowset
            console.log("the next check")
            console.log(nextRow,nextCol)
            console.log("the direction is ", this.direction)
            console.log("where is the player in grid ")
            console.log(row, col)
            console.log("i will check this IN GRID", this.level.map[nextRow][nextRow])
            // here i will check if this it's can move !!
            this.Canmove(nextRow, nextCol) ? (this.x += Xchange * blockSize, this.y += Ychange * blockSize , this.creatediv(), console.log("the x and y" , this.x, this.y)) : (this.detect = false, this.lastposition = this.direction)

        } else {
            // Her i will chnage the position of enemies
              this.direction = this.randomDirection();
            this.detect = true;
            if (this.direction === this.lastposition) {
                this.direction = this.randomDirection()
            }
            //console.log("not")
        }

    }
    Canmove(x, y) {
        console.log("at the can move", this.level.map[x][y] )
        return this.level.map[x][y] === 0
    }
    randomDirection() {
    const dirs = ["up", "down", "left", "right"];
    return dirs[Math.floor(Math.random() * dirs.length)];
}

}
 