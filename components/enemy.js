export class Enemy {

    constructor(game, level, x, y, Cordination) {
        this.game = game
        this.x = x
        this.y = y
        this.level = level

        this.direction = "Right"
        this.enemySize = 40
        this.speed = 2
        this.detect = true
        this.lastposition = ""
        this.mustrender = true
        this.targetX = x
        this.targetY = y
        this.Div = null
        this.dead = false
        this.AnimationCord = Cordination
    }

    killEnemy(cs = true) {
        if (this.Div && this.Div.parentNode) {
            this.Div.parentNode.removeChild(this.Div);
            if (cs) this.game.state.setScore(100)
            this.dead = true;
        }

        this.Div = null;
        this.game = null;
        this.level = null;
        this.AnimationCord = null;
    }

    checkColision() {
        const blockSize = this.level.block_size;
        const now = performance.now();
        for (let bomb of this.game.map.bombs) {
            if (!bomb.active) continue;
            if (now < bomb.startTime + bomb.explosionTime) continue;
            const bombX = bomb.xMap * blockSize;
            const bombY = bomb.yMap * blockSize;

            if (this.isColliding(bombX, bombY, blockSize, blockSize)) {
                this.killEnemy()
                this.dead = true
                return;
            }
            for (let dir of bomb.freeBlocks) {
                let ex = bombX, ey = bombY;
                if (dir === 0) ey += blockSize;
                if (dir === 1) ex -= blockSize;
                if (dir === 2) ey -= blockSize;
                if (dir === 3) ex += blockSize;

                if (this.isColliding(ex, ey, blockSize, blockSize)) {
                    this.killEnemy();
                    this.dead = true;
                    return;
                }
            }
        }
    }

    updateRender() {
        if (this.dead) return
       
        this.checkColision()
        if (!this.game || !this.game.player)  return
         
        if (this.game.player.isColliding(this.x, this.y, this.enemySize, this.enemySize)) this.game.player.kill()

        const directions = {
            Up: { rowset: -1, colset: 0 },
            Down: { rowset: 1, colset: 0 },
            Left: { rowset: 0, colset: -1 },
            Right: { rowset: 0, colset: 1 }
        }

        const blockSize = this.level.block_size
        const col = (this.direction === "Left") ? Math.round(this.x / blockSize) : Math.floor(this.x / blockSize);
        const row = (this.direction === "Left") ? Math.round(this.y / blockSize) : Math.floor(this.y / blockSize);
        if (this.detect) {
            const nextRow = row + directions[this.direction].rowset
            const nextCol = col + directions[this.direction].colset

            if (this.game.map.Canmove(nextRow, nextCol)) {
                this.targetX = nextCol * blockSize + 12
                this.targetY = nextRow * blockSize + 12
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
        if (this.x < this.targetX) this.x += this.speed
        if (this.x > this.targetX) this.x -= this.speed
        if (this.y < this.targetY) this.y += this.speed
        if (this.y > this.targetY) this.y -= this.speed

        if (Math.abs(this.x - this.targetX) < this.speed) this.x = this.targetX
        if (Math.abs(this.y - this.targetY) < this.speed) this.y = this.targetY
        this.arzigid()
    }

    arzigid() {
        if (!this.Div) return;
        const scale = this.game.map.currentScale || 1;
        const frame = this.AnimationCord[this.direction];
    
        this.Div.style.backgroundPosition = `${frame.x * scale}px ${frame.y * scale}px`;
    
        this.Div.style.width  = `${frame.width * scale}px`;
        this.Div.style.height = `${frame.height * scale}px`;
        this.Div.style.transform = `translate3d(${this.x * scale}px, ${this.y * scale}px, 10px)`;
    }
    

    randomDirection() {
        const dirs = ["Up", "Down", "Left", "Right"]
        return dirs[Math.floor(Math.random() * dirs.length)]
    }

    isColliding(x, y, w, h) {
        return !(this.x + this.enemySize < x || this.x > x + w ||
            this.y + this.enemySize < y || this.y > y + h);
    }
}
