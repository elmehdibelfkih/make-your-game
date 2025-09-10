export class Bonus {
    constructor(game, x, y, level, id) {
        this.game = game
        this.x = x
        this.y = y
        this.level = level
        this.id = id
        this.at = [this.y / this.level.block_size, this.x / this.level.block_size]
        this.audio = new Audio(this.level.GetSpeed)
        this.audio1 = new Audio(this.level.GetTime)
        this.activeTiming = [];
    }

    removeitfromgrid() {
        this.game.map.gridArray[this.at[0]][this.at[1]] = 0
    }

    removeitfromDOM() {
        const div = document.getElementById(this.id)
        div.remove()
    }

    addspeed() {
        this.game.state.setPlayerspped(6)
        this.audio.currentTime = 0
        this.audio.play().catch(err => console.error(err))
        const id= setTimeout(() => {
            this.game.state.setPlayerspped(4)
        }, 600)
        this.activeTiming.push(id)
    }

    showSpeedEffect() {
        const effect = document.createElement("div");
        effect.className = "speed-effect";
        effect.style.left = `${this.x}px`;
        effect.style.top = `${this.y}px`;
        this.game.map.grid.appendChild(effect);
        const id = setTimeout(() => effect.remove(), 500);
        this.activeTiming.push(id)
    }

    showTimeEffect() {
        const effect = document.createElement("div");
        effect.className = "time-effect";
        effect.style.left = `${this.x}px`;
        effect.style.top = `${this.y}px`;
        this.game.map.grid.appendChild(effect);
        const id = setTimeout(() => effect.remove(), 500);
        this.activeTiming.push(id)
    }

    cleanDOM() {

        this.removeitfromgrid();
        const div = document.getElementById(this.id);
        if (div && div.parentNode) div.parentNode.removeChild(div);

        if (this.audio) {
            this.audio.pause();
            this.audio.currentTime = 0;
            this.audio = null;
        }
        
        if (this.audio1) {
            this.audio1.pause();
            this.audio1.currentTime = 0;
            this.audio1 = null;
        }
        
        this.activeTiming.forEach(tt => {
            clearTimeout(tt)
        })
    }
}