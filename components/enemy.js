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

        console.log(this.level.map)
        //console.log(this.enemies); 
        //this.check();
    }

    //console.log('Enemy start coords:', game.map.level.enemy_x, game.map.level.enemy_y);
    // i Will remove this instance  later !!
    static getInstance(game, initialLevel) {
        if (!Enemy.instance) {
            Enemy.instance = new Enemy(game, initialLevel)
            console.log('Enemy start coords:', game.map.level.enemy_x, game.map.level.enemy_y);
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
                    const x = this.level.block_size * colIndex ;
                    const y = this.level.block_size * rowIndex ;
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
        this.enemySize = 60// Add this missing property
        this.speed = 1 // Make speed configurable
        
        this.creatediv()
    }

    creatediv() {
        this.domElement = document.createElement('div');
        this.domElement.className = 'enemy';
        this.domElement.style.backgroundImage = `url(${this.game.map.level.enemy})`;
        this.domElement.style.backgroundRepeat = 'no-repeat';
        this.domElement.style.imageRendering = 'pixelated';
        this.domElement.style.position = 'absolute';
        this.domElement.style.width = '50px';
        this.domElement.style.height = '50px';
        this.game.map.grid.appendChild(this.domElement);
        this.domElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    // Check if enemy can move based on its size
    canEnemyMoveTo(newX, newY) {
    console.log("Checking position - x:", newX, "y:", newY)
    
    // Make sure blockSize matches your actual grid size
    const blockSize = 60// Should match your CSS width/height and grid size
    
    const corners = [
        { x: newX, y: newY }, // Top-left
        { x: newX + this.enemySize - 1, y: newY }, // Top-right
        { x: newX, y: newY + this.enemySize - 1 }, // Bottom-left
        { x: newX + this.enemySize - 1, y: newY + this.enemySize - 1 } // Bottom-right
    ]

    return corners.every(corner => {
        const col = Math.floor(corner.x / blockSize)
        const row = Math.floor(corner.y / blockSize)
        //console.log("col", col)
        //console.log("row", row)
        console.log(`Checking corner (${corner.x}, ${corner.y}) -> grid[${row}][${col}]`)

        // CRITICAL: You need this bounds checking!
        //if (row < 0 || row >= this.level.map.length) {
            //console.log("Out of bounds - row:", row)
            //return false
        //}
        
        //if (col < 0 || col >= this.level.map[row].length) {
            //console.log("Out of bounds - col:", col)
            //return false
        //}
        
        // Check if the cell is walkable (0 = walkable, anything else = wall/obstacle)
        const cellValue = this.level.map[row][col]
        console.log(`Grid[${row}][${col}] = ${cellValue}`)
        
        return cellValue === 0
    })
}

    // Renamed method for better naming convention
     Canmoveandupdate() {
        let dx = 0, dy = 0

        switch (this.direction) {
            case "up": dy = -this.speed; break
            case "down": dy = this.speed; break
            case "left": dx = -this.speed; break
            case "right": dx = this.speed; break
        }
        console.log("before can move", this.x, this.y)

        if (this.canEnemyMoveTo(this.x + dx, this.y + dy)) {
            console.log("at can move")
            this.x += dx
            this.y += dy
        } else {
            // Change direction when hitting an obstacle
            const directions = ["up", "down", "left", "right"]
            this.direction = directions[Math.floor(Math.random() * directions.length)]
            console.log("direction changed to:", this.direction)
        }

        // Update visual position
        this.domElement.style.transform = `translate(${this.x}px, ${this.y}px)`;
        console.log("Enemy id:", this.id, "x:", this.x, "y:", this.y)
    }

}