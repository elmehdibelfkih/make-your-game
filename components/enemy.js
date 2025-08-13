export class Enemy {

    constructor(game,x,y, level) {
        this.game = game
        this.x = x
        this.y = y
        //this.xMap = 11
        //this.yMap = 11
        this.enemies = []; 
        this.level = level
        this.createnemy();
        console.log(this.enemies);  
        this.render();
        this.check();
    }

    //console.log('Enemy start coords:', game.map.level.enemy_x, game.map.level.enemy_y);

    static getInstance(game, initialLevel) {
        if (!Enemy.instance) {
            Enemy.instance = new Enemy(game, game.map.level.enemy_x, game.map.level.enemy_y, initialLevel)
            console.log('Enemy start coords:', game.map.level.enemy_x, game.map.level.enemy_y);
        }
        return Enemy.instance
    }
    // ==> I Want To CreatE Enemy <==!! \\
     
    // Debugging: Log the enemies array
    //console.log(this.enemies);
    //console.log(this.enemies)
    // console.log('Enemy start coords:', game.map.level.enemy_x, game.map.level.enemy_y);
    render() {
        //console.log(this.level.map)
        //var detect = f
        if (!this.enemy) {
            this.level.map.forEach((row, col) => {
                var j = 0
              row.forEach((i ,rr) => {
                console.log("here", i)
                console.log("col", col) 
                console.log("rr", rr)
                if (i === 5) {
                    this.enemy = document.createElement('div');
                    this.enemy.className = 'enemy';
                    this.game.map.grid.appendChild(this.enemy);
                    this.enemy.style.backgroundImage = `url(${this.game.map.level.enemy})`;
                    this.enemy.style.backgroundRepeat = 'no-repeat';
                    this.enemy.style.imageRendering = 'pixelated';  
                    this.enemy.style.position = 'absolute';
                    this.enemy.style.width = '50px';  
                    this.enemy.style.height = '50px';
                    this.enemy.style.transform = `translate(${this.level.block_size * rr + 12}px, ${this.level.block_size * col + 11}px)`;
                    this.enemies.push(new Emy(this.game,`${this.level.block_size * rr + 12}px`, `${this.level.block_size * col + 11}px`, j++ ))
                }
              })
            });        
        } 
    }
    // update logic of the enemies
    //
    check() {
    this.enemies.forEach(el => {
        console.log(el.x)
    })
    }
}

export class Emy{

    constructor(game ,x ,y ,i) {
        this.game = game
        this.x = x 
        this.y = y
        this.i = i
    }
}