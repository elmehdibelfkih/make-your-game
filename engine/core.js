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
        this.enemy = Enemy.getInstance(this, initialLevel)
        // this.bomb = new Bomb(this)
    }
    // get curent with considre 
    static async getCurrentLevelObj() {
        const state = State.getInstance();
        return await fetch(`assets/maps/level${state.getLevel()}.json`).then(res => res.json());
    }

    async getPlayerCoordinate() {
        const state = State.getInstance();
        return await fetch(`assets/playerCoordinate.json`).then(res => res.json());
    }
    
    // async getCorofenemy() {
        // return await fetch(`assets/enemycor.json`).then(re => re.json)
    // }
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
    // for update the cordination
    update(timestamp) {
        this.player.update(timestamp);
        console.log("hello")
        //this.enemy.update(timestamp);
        // this.bombs?.forEach(b => b.update(timestamp));
        // this.scoreboard.update(this.state);
    }

    async render() {
        // Here Is This Is Static One... ! 
        await this.map.render();
        await this.player.render();
        // I WILL TRY TO RENDER ENEMIES INTO MAP ?
        //this.enemy.render();
        this.enemy.update();
    }
}
