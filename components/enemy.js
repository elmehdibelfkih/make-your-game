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
        this.isMoving = false
        this.stuckCounter = 0
        this.maxStuckFrames = 5
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

  
    getValidDirections() {
        const directions = {
            Up: { rowset: -1, colset: 0 },
            Down: { rowset: 1, colset: 0 },
            Left: { rowset: 0, colset: -1 },
            Right: { rowset: 0, colset: 1 }
        };
        
        const blockSize = this.level.block_size;
        const col = Math.floor(this.x / blockSize);
        const row = Math.floor(this.y / blockSize);
        
        const validDirections = [];
        
        for (let [dirName, dirData] of Object.entries(directions)) {
            const nextRow = row + dirData.rowset;
            const nextCol = col + dirData.colset;
            
            if (this.game.map.Canmove(nextRow, nextCol)) {
                validDirections.push(dirName);
            }
        }
        
        return validDirections;
    }

    // ====
    getOppositeDirection(direction) {
        const opposites = {
            Up: "Down",
            Down: "Up",
            Left: "Right",
            Right: "Left"
        };
        return opposites[direction];
    }

    // Choose best direction smartly
    chooseNewDirection() {
        const validDirections = this.getValidDirections();
        
        if (validDirections.length === 0) {
            // No valid directions, stay in place
            return this.direction;
        }
        
        if (validDirections.length === 1) {
            // Only one valid direction
            return validDirections[0];
        }
        
        
        const oppositeOfLast = this.getOppositeDirection(this.lastposition);
        const filteredDirections = validDirections.filter(dir => dir !== oppositeOfLast);
        
        const finalDirections = filteredDirections.length > 0 ? filteredDirections : validDirections;

        return finalDirections[Math.floor(Math.random() * finalDirections.length)];

    }

   
    hasReachedTarget() {
        return Math.abs(this.x - this.targetX) < this.speed && 
               Math.abs(this.y - this.targetY) < this.speed;
    }

    updateRender() {
        if (this.dead) return;
        
        this.checkColision();
        if (!this.game || !this.game.player) return;

        if (this.game.player.isColliding(this.x, this.y, this.enemySize, this.enemySize)) {
            this.game.player.kill();
        }

        const directions = {
            Up: { rowset: -1, colset: 0 },
            Down: { rowset: 1, colset: 0 },
            Left: { rowset: 0, colset: -1 },
            Right: { rowset: 0, colset: 1 }
        };

        const blockSize = this.level.block_size;
        const col = Math.floor(this.x / blockSize);
        const row = Math.floor(this.y / blockSize);

         if (this.hasReachedTarget()) {
            this.x = this.targetX;
            this.y = this.targetY;
            this.isMoving = false;
            
            // Try to continue in current direction first
            const nextRow = row + directions[this.direction].rowset;
            const nextCol = col + directions[this.direction].colset;
            
            if (this.game.map.Canmove(nextRow, nextCol)) {
                // Can continue in same direction
                this.targetX = nextCol * blockSize + 12;
                this.targetY = nextRow * blockSize + 12;
                this.isMoving = true;
                this.stuckCounter = 0;
            } else {
                // Can't continue, need new direction
                this.lastposition = this.direction;
                this.direction = this.chooseNewDirection();
                
                // Set new target
                const newNextRow = row + directions[this.direction].rowset;
                const newNextCol = col + directions[this.direction].colset;
                
                if (this.game.map.Canmove(newNextRow, newNextCol)) {
                    this.targetX = newNextCol * blockSize + 12;
                    this.targetY = newNextRow * blockSize + 12;
                    this.isMoving = true;
                    this.stuckCounter = 0;
                } else {
                    // Still can't move, increment THIS STACK
                    this.stuckCounter++;
                    
                    // If stuck for too long, force a random valid direction
                    if (this.stuckCounter > this.maxStuckFrames) {
                        const validDirs = this.getValidDirections();
                        if (validDirs.length > 0) {
                            this.direction = validDirs[Math.floor(Math.random() * validDirs.length)];
                            const forceNextRow = row + directions[this.direction].rowset;
                            const forceNextCol = col + directions[this.direction].colset;
                            this.targetX = forceNextCol * blockSize + 12;
                            this.targetY = forceNextRow * blockSize + 12;
                            this.isMoving = true;
                        }
                        this.stuckCounter = 0;
                    }
                }
            }
        }
        if (this.isMoving) {
            if (this.x < this.targetX) this.x += this.speed;
            if (this.x > this.targetX) this.x -= this.speed;
            if (this.y < this.targetY) this.y += this.speed;
            if (this.y > this.targetY) this.y -= this.speed;
        }
        this.arzigid();
    }
    arzigid() {
        if (!this.Div) return;
        const scale = this.game.map.currentScale || 1;
        const frame = this.AnimationCord[this.direction];
        this.currentFrame = frame; // <-- store last frame


        this.Div.style.backgroundPosition = `${frame.x * scale}px ${frame.y * scale}px`;
        this.Div.style.width = `${frame.width * scale}px`;
        this.Div.style.height = `${frame.height * scale}px`;
        this.Div.style.transform = `translate3d(${this.x * scale}px, ${this.y * scale}px, 10px)`;
    }
    isColliding(x, y, w, h) {
        return !(this.x + this.enemySize < x || this.x > x + w ||
            this.y + this.enemySize < y || this.y > y + h);
    }
}
