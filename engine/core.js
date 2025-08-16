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
        if (this.state.isGameOver()) await this.gameOver()
        if (!this.state.isPaused()) {
            this.update(timestamp);
            this.render();
        }
        requestAnimationFrame(this.loop.bind(this));
    }

    update(timestamp) {
        this.map.update(timestamp)
        this.player.update(timestamp);
        this.map.bombs?.filter(b => b.update(timestamp));
        this.state.updateState()
        // this.enemy.update(timestamp);
        // this.scoreboard.update(this.state);
    }

    render() {
        this.map.render();
        this.player.render();
        this.map.bombs?.forEach(b => b.render());
        // this.enemy.render();
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
