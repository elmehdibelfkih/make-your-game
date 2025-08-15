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
    update(){
        this.enemies.map((el) => el.Canmoveandupdate())
    }
    
}

// Update logic of the enemies >.

export class Emy{

    constructor(game ,level, x ,y) {
        this.game = game
        this.x = x 
        this.y = y
        this.level = level
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

    Canmoveandupdate() {
            const blockSize = this.level.block_size;
            const map = this.level.map;
            const col = Math.floor(this.x / blockSize);
            const row = Math.floor(this.y / blockSize);

            const maxRow = map.length - 1;
            const maxCol = map[0].length - 1;

            const canMoveRight = col < maxCol && map[row][col + 1] === 0;
            const canMoveLeft  = col > 0 && map[row][col - 1] === 0;
            const canMoveDown  = row < maxRow && map[row + 1][col] === 0;
            const canMoveUp    = row > 0 && map[row - 1][col] === 0;

            if (canMoveRight) this.x += 1;
            else if (canMoveLeft) this.x -= 1;
            else if (canMoveDown) this.y += 1;
            else if (canMoveUp) this.y -= 1;
            this.domElement.style.transform = `translate(${this.x + 12}px, ${this.y + 11}px)`;
    }
}