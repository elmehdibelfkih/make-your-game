export class Enemy {

    constructor(game, level, x, y, Cordination) {
        this.game = game
        this.x = x
        this.y = y
        this.level = level
        //this.id = i
        this.direction = "Left"
        this.enemySize = 40
        //console.log(this.enemySize)
        this.speed = 2
        this.detect = true
        this.lastposition = ""
        this.mustrender = true
        this.targetX = x
        this.targetY = y
        // I will accesS to The Target div enemys !
        this.Div = null
        this.dead = false
        // this.creatediv()
        // her i add cordination frame up left right !!
        this.AnimationCord = Cordination
    }
    // i will remove enenmy
    killenemy(cs = true) {
        if (this.Div && this.Div.parentNode) {
            this.Div.parentNode.removeChild(this.Div);
            // this.game.removeEnemy(this);
            if (cs) this.game.state.setScore(100)
            this.dead = true;
        }
        // Clear references
        this.Div = null;
        this.game = null;
        this.level = null;
        this.AnimationCord = null;
    }

    checkiftheriscolision() {
        const blockSize = this.level.block_size;
        const now = performance.now();
        for (let bomb of this.game.map.bombs) {
            if (!bomb.active) continue;
            if (now < bomb.startTime + bomb.explosionTime) continue;
            const bombX = bomb.xMap * blockSize;
            const bombY = bomb.yMap * blockSize;

            if (this.isColliding(bombX, bombY, blockSize, blockSize)) {
                // i want to test it and remove the div of enemys where we are now how i will do it exect
                this.killenemy()
                this.dead = true
                //this.kill();
                return;
            }
            for (let dir of bomb.freeBlocks) {
                let ex = bombX, ey = bombY;
                if (dir === 0) ey += blockSize;
                if (dir === 1) ex -= blockSize;
                if (dir === 2) ey -= blockSize;
                if (dir === 3) ex += blockSize;

                if (this.isColliding(ex, ey, blockSize, blockSize)) {
                    this.killenemy();
                    this.dead = true;
                    return;
                }
            }
        }
    }

    Canmoveandupdate() {
        if (this.dead) return
       
        this.checkiftheriscolision()
        // i get problem of it's get access to player memory while he is null  and it's need to checkk first !
        if (!this.game || !this.game.player) {
            return; // Safe exit - don't try to use null objects
        }
        //this.checkiftheriscolision()
         
        if (this.game.player.isColliding(this.x, this.y, this.enemySize, this.enemySize)) {
            this.game.player.kill()
        }
        const directions = {
            Up: { rowset: -1, colset: 0 },
            Down: { rowset: 1, colset: 0 },
            Left: { rowset: 0, colset: -1 },
            Right: { rowset: 0, colset: 1 }
        }

        const blockSize = this.level.block_size
        //  her i face i round it becs it's give me exect traget col and row in all grid

        const col = (this.direction === "Left") ? Math.round(this.x / blockSize) : Math.floor(this.x / blockSize);
        const row = (this.direction === "Left") ? Math.round(this.y / blockSize) : Math.floor(this.y / blockSize);
        if (this.detect) {
            const nextRow = row + directions[this.direction].rowset
            const nextCol = col + directions[this.direction].colset

            // check if i can move !!
            if (this.game.map.Canmove(nextRow, nextCol)) {
                this.targetX = nextCol * blockSize + 12
                this.targetY = nextRow * blockSize + 12
                //this.lastposition = this.direction
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
        if (Math.abs(this.x - this.targetX) < this.speed) this.x = this.targetX
        if (Math.abs(this.y - this.targetY) < this.speed) this.y = this.targetY
        this.arzigid()
    }

    arzigid() {
        // IF EXEIST
        this.Div.style.backgroundPosition = `${this.AnimationCord[this.direction].x} ${this.AnimationCord[this.direction].y}`
        this.Div.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }

    randomDirection() {
        const dirs = ["Up", "Down", "Left", "Right"]
        return dirs[Math.floor(Math.random() * dirs.length)]
    }

    // helper to check collision with enemy 
    isColliding(x, y, w, h) {
        return !(this.x + this.enemySize < x || this.x > x + w ||
            this.y + this.enemySize < y || this.y > y + h);
    }
    // HER I CLEAN DOM !! 
}
