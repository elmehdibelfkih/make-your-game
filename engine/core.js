import { Scoreboard } from '../components/scoreboard.js';
import { Player } from '../components/player.js';
import { Map } from '../components/map.js';
import { State } from './state.js';
// import { Enemy } from '../components/enemy.js';
// import { Bomb } from '../components/bomb.js';

export class Game {
    static #instance = null;

    static getInstance() {
        if (!Game.#instance) Game.#instance = new Game();
        return Game.#instance;
    }

    constructor() {
        this.state = State.getInstance();
        this.scoreboard = Scoreboard.getInstance(this)
        this.map = Map.getInstance(this)
        this.player = Player.getInstance(this)
    }

    async intiElements() {
        this.state.initArrowState()
        await this.map.initMap()
        await this.player.initPlayer()
    }


    run() {
        requestAnimationFrame(this.loop.bind(this));
    }

    async loop(timestamp) {

        if (this.state.isGameOver()) {
            await this.gameOver()
        }
        if (this.state.isPaused()) {
            // this.map.grid.style.display = "none"

        } else {
            this.updateRender(timestamp);
        }
        requestAnimationFrame(this.loop.bind(this));
    }

    updateRender(timestamp) {
        this.map.updateRender(timestamp)
        this.player.updateRender(timestamp);
        this.map.bombs?.forEach(b => b.updateRender(timestamp));
        this.state.update()
        // this.enemy.update(timestamp);
        // this.scoreboard.update(this.state);
    }


    async gameOver() {
        this.state.initState()
        this.scoreboard.initScoreBaord() // todo: update this
        this.scoreboard.updateLives()
        this.map.destructeur()
        this.map = null
        this.player = null

        this.map = Map.getInstance(this)
        this.player = Player.getInstance(this)
        await this.map.initMap()
        await this.player.initPlayer()
        this.state.pauseStart()
    }
}
