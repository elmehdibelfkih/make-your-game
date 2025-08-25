export class Bonus {
    constructor(game, x, y, level, id){
        this.game = game 
        this.x = x    
        this.y = y
        this.level = level
        //this.checkit() 
        this.id = id
        this.at = [this.y/ this.level.block_size, this.x/this.level.block_size] 
        this.audio =  new Audio("./assets/audios/CoinGet.mp3")
    }

    removeitfromgrid() {
        this.game.map.gridArray[this.at[0]][this.at[1]] = 0
    }

    removeitfromDOM() {
        const div = document.getElementById(this.id)
        div.remove()
    }

    //  what's i will need know to do it nmmm it update speed !?
    addspeed() {
        const lastsped = this.game.state.getPlayerSpeed()
        this.game.state.setPlayerspped(6)
        this.audio.currentTime = 0
        this.audio.play().catch(err => console.error(err))
        //  i will need the timer to let
        setTimeout(()=> {
            this.game.state.setPlayerspped(lastsped)
        }, 3000)
    }

    showSpeedEffect() {
    const effect = document.createElement("div");
    effect.className = "speed-effect";
    effect.style.left = `${this.x}px`;
    effect.style.top = `${this.y}px`;
    this.game.map.grid.appendChild(effect);
    setTimeout(() => effect.remove(), 500);
    }
}