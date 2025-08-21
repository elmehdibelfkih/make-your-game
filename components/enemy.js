export class Enemy {

    constructor(game, level, x, y) {
        this.game = game
        this.x = x
        this.y = y
        this.level = level
        //this.id = i
        this.direction = "up"
        this.enemySize = this.level.block_size
        //console.log(this.enemySize)
        this.speed = 2
        this.detect = true
        this.lastposition = ""
        this.mustrender = true
        this.targetX = x
        this.targetY = y
        // i will acces to the target div enemys 
        this.Div = null
        //this.creatediv()
    }

    Canmoveandupdate() {
        if (this.game.player.isColliding(this.x, this.y, 68, 68)) {
            this.game.player.kill()
        }
        const directions = {
            up: { rowset: -1, colset: 0 },
            down: { rowset: 1, colset: 0 },
            left: { rowset: 0, colset: -1 },
            right: { rowset: 0, colset: 1 }
        }

        const blockSize = this.level.block_size
        //  her i face i round it becs it's give me exect traget col and row in all grid
        const col = Math.round(this.x / blockSize)
        const row = Math.round(this.y / blockSize)
        if (this.detect) {
            const nextRow = row + directions[this.direction].rowset
            const nextCol = col + directions[this.direction].colset

            // check if i can move !!
            if (this.Canmove(nextRow, nextCol)) {
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
        this.Div.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
    Canmove(row, col) {
        const grid = this.level.initial_grid
        return grid[row] && grid[row][col] === 0
    }
    randomDirection() {
        const dirs = ["up", "down", "left", "right"]
        return dirs[Math.floor(Math.random() * dirs.length)]
    }

}
 