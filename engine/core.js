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
        return
    }

    run = () => {
        this.IDRE = requestAnimationFrame(this.loop.bind(this));
    }

    async loop(timestamp) {
        if (this.state.isGameOver() || this.state.Isrestar()) {
            this.state.SetPause(false)
            this.Detect = this.state.Isrestar() ? true : false
            await this.gameOver()
            return
        }
        if (!this.state.isPaused())
            this.updateRender(timestamp);
        this.IDRE = requestAnimationFrame(this.loop.bind(this));
    }

    updateRender(timestamp) {
        if (this.stateofrest) return
        this.player.updateRender(timestamp);
        this.map.bombs?.forEach(b => b.updateRender(timestamp));
        this.state.update()
        this.map.enemys?.forEach(enemy => enemy.updateRender())

        const alive = this.map.enemys.filter(enemy => !enemy.dead)
        if (alive.length === 0 && !this.levelComplete) {
            this.levelComplete = true;
            setTimeout(() => {
                this.nextLevel();
            }, 1600);
        }
    }

    async gameOver() {
        this.state.stopTimer(); 
        if (this.IDRE) {
            cancelAnimationFrame(this.IDRE);
            this.IDRE = null;
        }
        this.stateofrest = true
        this.levelComplete = false;
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
        } else {
            title.textContent = "GAME OVER";
            message.textContent = "Time’s up or you lost all lives!";
            btn.textContent = "PLAY AGAIN";
        }

        this.state.setScore(0)
        this.state.initState()
        this.scoreboard.initScoreBaord() // todo: update this
        this.scoreboard.updateLives()
        this.scoreboard.updateScore()

        this.map.enemys.forEach(en => {
            en.killEnemy(false)
        })
        this.map.enemys = []
        this.map.bombs.forEach(Boom => {
            Boom.cleanDOM()
        })
        this.map.Booms = []
        this.player.removeplayer()
        this.map.destructeur()
        this.state.removeEventListeners();
        this.state = State.getInstance(this)
        this.map = Map.getInstance(this)
        this.player = Player.getInstance(this)
        await this.map.initMap()
        this.enemie = new Enemy(this);
        await this.player.initPlayer()
        this.stateofrest = false
    }

    async nextLevel() {
        this.state.stopTimer(); 
        if (this.IDRE) {
            cancelAnimationFrame(this.IDRE);
            this.IDRE = null;
        }
        const instructions = document.getElementById("instructions");
        instructions.classList.remove("hidden");
        const title = document.getElementById("menu-title");
        const message = document.getElementById("menu-message");
        title.textContent = "NEXT LEVEL";
        message.textContent = "Get ready!";
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.state.setScore(0);
        this.state.initState();
        this.scoreboard.initScoreBaord();
        this.scoreboard.updateLives();
        this.scoreboard.updateScore();
        this.map.enemys.forEach(en => en.killEnemy(false));
        this.map.enemys = [];
        this.map.bombs.forEach(B => B.cleanDOM());
        this.map.Booms = [];
        this.player.removeplayer();
        this.map.destructeur();
        this.state.removeEventListeners();
        this.state.nextLevel();
        this.scoreboard.updateLevel();
        this.map = null
        this.map = Map.getInstance(this);
        await this.map.initMap();
        this.player = Player.getInstance(this);
        await this.player.initPlayer();
        this.stateofrest = false;
        this.levelComplete = false;
    }
}
