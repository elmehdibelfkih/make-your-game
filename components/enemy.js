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
    createnemy() {
        this.level.map.forEach((row, rowIndex) => {
            row.forEach((cellValue, colIndex) => {
                if (cellValue === 5) {
                    const x = this.level.block_size * colIndex + 12;
                    const y = this.level.block_size * rowIndex + 11;
                    const en = new Emy(this.game, this.level, x, y);
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

    constructor(game, level, x, y) {
        this.game = game
        this.x = x
        this.y = y
        this.level = level
       // this.direction = "left"
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
    canMove(dx, dy) {
        const blockSize = this.level.block_size;
        const map = this.level.map;

         const enemySize = blockSize;

        // Check All Four Corners After The Move <==> !!
        const corners = [
            { x: this.x + dx, y: this.y + dy }, // top-left
            { x: this.x + dx + enemySize - 1, y: this.y + dy }, // top-right
            { x: this.x + dx, y: this.y + dy + enemySize - 1 }, // bottom-left
            { x: this.x + dx + enemySize - 1, y: this.y + dy + enemySize - 1 }  // bottom-right
        ];

        return corners.every(corner => {
            const col = Math.floor(corner.x / blockSize);
            const row = Math.floor(corner.y / blockSize);
            return map[row] && map[row][col] === 0;  
        });
    }

    Canmoveandupdate() {
        let dx = 0, dy = 0;
        switch (this.direction) {
            case 'right': dx = 1; break;
            case 'left': dx = -1; break;
            case 'down': dy = 1; break;
            case 'up': dy = -1; break;
        }

        if (this.canMove(dx, dy)) {
            this.x += dx;
            this.y += dy;
        } else {
            const directions = ['right', 'left', 'down', 'up'];
            this.direction = directions[Math.floor(Math.random() * directions.length)];
        }

        this.domElement.style.transform = `translate(${this.x + 12}px, ${this.y + 11}px)`;
    }


}