import { Scoreboard } from '../components/scoreboard.js';
import { Player } from '../components/player.js';
import { Enemy } from '../components/enemy.js';
import { Bomb } from '../components/bomb.js';
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
        this.enemy = new Enemy(this)
        this.bomb = new Bomb(this)
    }

    static async getCurrentLevelObj() {
        const state = State.getInstance();
        return await fetch(`assets/maps/level${state.getLevel()}.json`).then(res => res.json());
    }


    // run() {
    //     requestAnimationFrame(this.loop.bind(this));
    // }

    // loop(timestamp) {
    //     const delta = timestamp - this.lastUpdateTime;
    //     this.lastUpdateTime = timestamp;

    //     if (!this.state.paused) {
    //         this.update(delta);
    //         this.render();
    //     }

    //     requestAnimationFrame(this.loop.bind(this));
    // }

    // update(delta) {
    //     this.player.update(delta);
    //     this.enemy.update(delta);
    //     this.bombs?.forEach(b => b.update(delta));
    //     this.scoreboard.update(this.state);
    // }

    // render() {
    //     this.map.render();
    //     this.player.render();
    //     this.enemy.render();
    // }
}
