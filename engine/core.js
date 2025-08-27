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
        this.stateofrest = false
        this.nextLevelTimeoutId = null;
        this.levelComplete = false;
        this.Detect = false

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
        // her i will handle refrech and gameover !!
        if (this.state.isGameOver() || this.state.Isrestar()) {
            console.log("game is over---------------------")
            this.state.SetPause(false)
            this.Detect = this.state.Isrestar() ? true : false 
            //this.Detect = true
            await this.gameOver()
            //Restar
            return
        }
        if (this.state.isPaused()) {
            // this.map.grid.style.display = "none"
        } else {
            this.updateRender(timestamp);
        }
        this.IDRE = requestAnimationFrame(this.loop.bind(this));
    }

    updateRender(timestamp) {
        if (this.stateofrest) return
        this.map.updateRender(timestamp)
        this.player.updateRender(timestamp);
        this.map.bombs?.forEach(b => b.updateRender(timestamp));
        // test score board !!
        // LIFE OF PLAYER Checker !
        this.state.update()
        //console.log("the grid", this.map.level.initial_grid)
        this.map.enemys?.forEach(enemy => enemy.Canmoveandupdate());
        // Her I Will check if player it's dead !
        const alive = this.map.enemys.filter(enemy => !enemy.dead)
        if (alive.length === 0 && !this.levelComplete) {
            this.levelComplete = true;
            setTimeout(() => {
                this.nextLevel();
            }, 1600);
        }
    }

    async gameOver() {
        if (this.IDRE) {
            cancelAnimationFrame(this.IDRE);
            this.IDRE = null;
        }
        this.stateofrest = true
        this.levelComplete = false;
        // <============>>>>>>> showing menu <<<< =====================>
        const instructions = document.getElementById("instructions");
        const title = document.getElementById("menu-title");
        const message = document.getElementById("menu-message");
        const btn = document.getElementById("start-btn");
        instructions.classList.remove("hidden");
        if (this.Detect) {
            title.textContent = "REFRECH GAME IS DONE";
            message.textContent = "Enjoy .....";
            btn.textContent = "Continue ...";
            this.Detect = false
            this.state.Restar()
        }else {
        title.textContent = "💀 GAME OVER";
        message.textContent = "Time’s up or you lost all lives!";
        btn.textContent = "PLAY AGAIN";
        }
        // <==========================================================>


        console.log("at gmae over after menu")
        //this.State.Restar()
        console.log("------------------------------------")
        this.state.setScore(0)
        this.state.initState()
        this.scoreboard.initScoreBaord() // todo: update this
        //this.state.setScore(0)
        this.scoreboard.updateLives()
        this.scoreboard.updateScore()
        // im her to destry verything i creat before !!
        // ======= Let's Star With Map =======!!

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
        this.map.destructeur()
        // <=======================> 
        //this.state = null
        //this.map = null
        ///======================= remove event listner to handle the problem of multi handlers
        this.state.removeEventListeners();
        // <========================================================>
        this.state = State.getInstance(this)
        this.map = Map.getInstance(this)
        this.player = Player.getInstance(this)
        await this.map.initMap()
        this.enemie = new Enemy(this);
        await this.player.initPlayer()
        this.stateofrest = false
        //this.state.Restar()
        //this.state.pauseStart()
    }

    async nextLevel() {
        if (this.IDRE) {
            cancelAnimationFrame(this.IDRE);
            this.IDRE = null;
        }
        // be ready 
        const instructions = document.getElementById("instructions");
        instructions.classList.remove("hidden");
        const title = document.getElementById("menu-title");
        const message = document.getElementById("menu-message");
        title.textContent = "➡️ NEXT LEVEL";
        message.textContent = "Get ready!";
        // wait 
        await new Promise(resolve => setTimeout(resolve, 1500));
        // Clear old objects
        this.state.setScore(0);
        this.state.initState();
        this.scoreboard.initScoreBaord(); // todo: update this
        //this.state.setScore(0)
        this.scoreboard.updateLives();
        this.scoreboard.updateScore();

        this.map.enemys.forEach(en => en.killenemy(false));
        this.map.enemys = [];
        this.map.bombs.forEach(B => B.cleanDOM());
        this.map.Booms = [];
        this.player.removeplayer();
        // <=============|------|==============>
        this.map.destructeur();
        this.state.removeEventListeners();
        // ==== next level++
        this.state.nextLevel(); //<<======>>
        this.scoreboard.updateLevel();
        // Reinitialize the map and player for new level
        this.map = null
        this.map = Map.getInstance(this);
        await this.map.initMap();
        console.log(this.map.level.name);
        this.player = Player.getInstance(this);
        await this.player.initPlayer();
        //this.stateofrest = false;
        //this.scoreboard.updateLevel();
        this.stateofrest = false;
        this.levelComplete = false;
        // Resume the game loop
        //this.run();
        // <==========--============> \\

    }
}
