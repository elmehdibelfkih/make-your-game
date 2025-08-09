import { Scoreboard } from '../components/scoreboard.js';
import { Player } from '../components/player.js';
// import { Enemy } from '../components/enemy.js';
// import { Bomb } from '../components/bomb.js';
import { Map } from '../components/map.js';
import { State } from './state.js';

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

    loop(timestamp) {
        if (!this.state.isPaused()) {
            this.update(timestamp);
            this.render();
        }
        requestAnimationFrame(this.loop.bind(this));
    }

    update(timestamp) {
        this.player.update(timestamp);        
        this.map.bombs?.forEach(b => b.update(timestamp));
        // this.enemy.update(timestamp);
        // this.scoreboard.update(this.state);
    }

    render() {
        this.map.render();
        this.player.render();
        this.map.bombs?.forEach(b => b.render());
        // this.enemy.render();
    }
}
