import { Scoreboard } from '../components/scoreboard.js';
import { Player } from '../components/player.js';
import { Enemy } from '../components/enemy.js';
// import { Bomb } from '../components/bomb.js';
import { Map } from '../components/map.js';
import { State } from './state.js';

export class Game {
    static #instance = null;

    static getInstance(initialLevel) {
        if (!Game.#instance)  Game.#instance = new Game(initialLevel);
        return Game.#instance;
    }

    constructor(initialLevel) {
        this.state = State.getInstance();
        this.scoreboard = Scoreboard.getInstance(this)
        this.map = Map.getInstance(this, initialLevel)
        this.player = Player.getInstance(this)
        // this.enemy = new Enemy(this)
        // this.bomb = new Bomb(this)
    }

    static async getCurrentLevelObj() {
        const state = State.getInstance();
        return await fetch(`assets/maps/level${state.getLevel()}.json`).then(res => res.json());
    }

    async getPlayerCoordinate() {
        const state = State.getInstance();
        return await fetch(`assets/playerCoordinate.json`).then(res => res.json());
    }

    run() {
        requestAnimationFrame(this.loop.bind(this));
    }

    async loop(timestamp) {
        // const delta = timestamp - this.lastUpdateTime;
        // this.lastUpdateTime = timestamp;

        if (!this.state.isPaused()) {
            this.update(timestamp);
            await this.render();
        }

        requestAnimationFrame(this.loop.bind(this));
    }

    update(timestamp) {
        this.player.update(timestamp);
        // this.enemy.update(timestamp);
        // this.bombs?.forEach(b => b.update(timestamp));
        // this.scoreboard.update(this.state);
    }

    async render() {
        await this.map.render();
        await this.player.render();
        // this.enemy.render();
    }
}
