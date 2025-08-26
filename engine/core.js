import { Scoreboard } from '../components/scoreboard.js';
import { Player } from '../components/player.js';
import { Map } from '../components/map.js';
import { State } from './state.js';
import { Enemy } from '../components/enemy.js';

export class Game {
    static #instance = null;

    static getInstance() {
        if (!Game.#instance) Game.#instance = new Game();
        return Game.#instance;
    }

    constructor() {
        this.state = State.getInstance(this);
        this.scoreboard = Scoreboard.getInstance(this)
        this.map = Map.getInstance(this)
        this.player = Player.getInstance(this)
        // test enemy with logic of mehdi 
        //this.enemie = null;
        // her id of request animation frame
        this.IDRE = null
    }

    async intiElements() {
        this.state.initArrowState()
        await this.map.initMap()
        await this.player.initPlayer()
        //this.map.initTimer()
        return
        //this.map.enemie.
        //this.enemie = new Enemy(this)
        //this.enemie.createnemy();
    }

    run = () => {
        //  her id reauest to move it to not creat milty rrequest !!
        this.IDRE = requestAnimationFrame(this.loop.bind(this));
    }

    async loop(timestamp) {
        if (this.state.isGameOver()) {
            console.log("game is over")
            this.state.SetPause(false)
            await this.gameOver()
        }
        if (this.state.isPaused()) {
            // this.map.grid.style.display = "none"
        } else {

            this.updateRender(timestamp);
        }
        this.IDRE = requestAnimationFrame(this.loop.bind(this));
    }

    updateRender(timestamp) {
        this.map.updateRender(timestamp)
        this.player.updateRender(timestamp);
        this.map.bombs?.forEach(b => b.updateRender(timestamp));
        // test score board !!
        this.state.update()
        //console.log("the grid", this.map.level.initial_grid)
        this.map.enemys?.forEach(enemy => enemy.Canmoveandupdate());
    }

    async gameOver() {

        if (this.IDRE) {
            cancelAnimationFrame(this.IDRE);
            this.IDRE = null;
        }
        // <============>>>>>>> showing menu <<<< =====================>
        const instructions = document.getElementById("instructions");
        const title = document.getElementById("menu-title");
        const message = document.getElementById("menu-message");
        const btn = document.getElementById("start-btn");
        instructions.classList.remove("hidden");
        title.textContent = "💀 GAME OVER";
        message.textContent = "Time’s up or you lost all lives!";
        btn.textContent = "PLAY AGAIN";
        // <==========================================================>
        this.state.setScore(0)
        this.state.initState()
        this.scoreboard.initScoreBaord() // todo: update this
        //this.state.setScore(0)
        this.scoreboard.updateLives()
        this.scoreboard.updateScore()
        // im her to destry verything i creat before !!

        // =======let's star with map !!
        this.map.destructeur()

        this.map.enemys.forEach(en => {
            en.killenemy(false)
        })
        this.map.enemys = []
        // Her I Will See The bommbs !!
        this.map.bombs.forEach(Boom => {
            Boom.cleanDOM()
        })
        this.map.Booms = []
        // === remove player 
        this.player.removeplayer()
        // <=======================>
        this.player = null
        //this.state = null
        this.map = null
        // <========================================================>
        this.state = State.getInstance(this)
        this.map = Map.getInstance(this)
        this.player = Player.getInstance(this)
        await this.map.initMap()
        this.enemie = new Enemy(this);
        await this.player.initPlayer()
        this.state.pauseStart()
    }
}
