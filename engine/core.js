import { Scoreboard } from '../components/scoreboard.js';
import { Player } from '../components/player.js';
import { Map } from '../components/map.js';
import { State } from './state.js';
import { Enemy } from '../components/enemy.js';
import { UI } from '../components/ui.js';
import { ScoreboardModal } from '../components/scoreboardModal.js'
import { Story } from '../components/story.js'

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
        this.scoreboardModal = new ScoreboardModal(this);
        this.ui = UI.getInstance(this)
        this.story = new Story(this)
        this.IDRE = null
        this.stateofrest = false
        this.nextLevelTimeoutId = null;
        this.levelComplete = false;
        this.Detect = false
    }
    async waitForLevel() {
        while (!this.map || !this.map.level) {
            await new Promise(r => setTimeout(r, 50));
        }
    }
    async intiElements() {
        this.state.initArrowState()
        await this.map.initMap()
        await this.player.initPlayer()
        return
    }
    run = () => {
        if (this.IDRE) return;
        this.IDRE = requestAnimationFrame(this.loop.bind(this));
    }
    async loop(timestamp) {
        if (this.state.isGameOver() || this.state.Isrestar()) {
            this.state.SetPause(false)
            this.Detect = this.state.Isrestar() ? true : false
            this.state.updateStateof(this.Detect)
            await this.gameOver()
            return
        }
        if (!this.state.isPaused()) this.updateRender(timestamp);
        this.IDRE = requestAnimationFrame(this.loop.bind(this));
    }

    async updateRender(timestamp) {
        if (this.stateofrest) return
        this.player.updateRender(timestamp);
        this.map.bombs = this.map.bombs?.filter(b => b.updateRender(timestamp) && !b.done);
        this.map.enemys = this.map.enemys?.filter(b => {
            b.updateRender(timestamp)
            return !b.dead
        });
        this.state.update()
        this.checkState()
    }

    async gameOver() {
        this.state.stopTimer();
        if (this.IDRE) {
            cancelAnimationFrame(this.IDRE);
            this.IDRE = null;
        }
        this.stateofrest = true
        this.levelComplete = false;

        // Show conclusion of the level (loss)
        await this.story.showConclusion(false);

        // should show the leaderboard first
        const playerName = await this.scoreboardModal.promptPlayerName();
        const data = await this.scoreboardModal.submitScore(playerName, this.state.getScore(), this.formatTime(this.state.getTime()));

        this.ui.GameOver()
        this.state.setScore(0)
        this.state.initState()
        this.scoreboard.initScoreBaord()
        this.scoreboard.updateLives()
        this.scoreboard.updateScore()
        this.scoreboard.updateLevel();
        this.map.enemys = []
        this.map.Booms = []
        this.player.removeplayer()
        this.map.destructeur()
        this.state.removeEventListeners();
        this.state = State.getInstance(this)
        this.state.initArrowState();
        this.map = Map.getInstance(this)
        this.player = Player.getInstance(this)
        await this.map.initMap()
        await this.player.initPlayer()
        this.story = new Story(this);
        this.stateofrest = false
    }

    async nextLevel() {
        this.state.stopTimer();
        if (this.IDRE) {
            cancelAnimationFrame(this.IDRE);
            this.IDRE = null;
        }
        this.state.SetPause(true);

        // Show conclusion of the level just finished
        await this.story.showConclusion(true);

        this.map.enemys = [];
        this.map.Booms = [];
        this.player.removeplayer();
        this.map.destructeur();

        this.state.removeEventListeners();
        this.state.initArrowState();

        this.state.nextLevel();
        this.scoreboard.updateLevel();

        this.map = Map.getInstance(this);
        this.player = Player.getInstance(this);
        await this.map.initMap();
        await this.player.initPlayer();

        await this.waitForLevel();

        // Show introduction of the next level
        this.story = new Story(this);
        await this.story.showIntroduction();

        this.state.resetTimer();
        this.state.setTime(this.map.level.level_time);
        this.state.startTimer();
        this.state.SetPause(false);
        this.stateofrest = false;
        this.levelComplete = false;
        this.run();
    }

    async handleWin() {
        this.state.stopTimer();
        if (this.IDRE) {
            cancelAnimationFrame(this.IDRE);
            this.IDRE = null;
        }
        this.stateofrest = true

        // Show final conclusion — the end of the full story
        await this.story.showConclusion(true);
        this.ui.win()
        await new Promise(resolve => setTimeout(resolve, 1500));
        this.state.setScore(0);
        this.state.initState();
        this.scoreboard.initScoreBaord();
        this.scoreboard.updateLives();
        this.scoreboard.updateScore();
        this.map.enemys = [];
        this.map.Booms = [];
        this.player.removeplayer();
        this.map.destructeur();
        this.state.removeEventListeners();
        this.state = State.getInstance(this);
        this.state.initArrowState();
        this.state.resetLevel();
        this.scoreboard.updateLevel();
        this.map = null
        this.map = Map.getInstance(this);
        this.player = Player.getInstance(this);
        await this.map.initMap();
        await this.player.initPlayer();
        await this.waitForLevel();
        this.state.stopTimer();
        this.state.resetTimer();
        this.state.setTime(map.level.level_time);
        this.state.startTimer();
        this.stateofrest = false;
        this.levelComplete = false;
    }

    async checkState() {
        // Show development story beat at roughly half the enemies cleared
        const totalEnemies = this.map.level?.initial_grid.flat().filter(c => c === 4).length || 0;
        const remaining = this.map.enemys.length;
        console.log(`Enemies: ${remaining}/${totalEnemies}`);
        if (totalEnemies > 0 && remaining <= Math.floor(totalEnemies / 2) && !this.story._developmentShown) {
            this.state.SetPause(true);
            await this.story.showDevelopment();
            this.state.SetPause(false);
        }

        if (this.map.enemys.length === 0 && !this.levelComplete) {
            this.levelComplete = true;
            if (this.state.getcurentlevel() >= this.state.maxlevel()) {
                const Id = setTimeout(() => {
                    this.handleWin();
                    clearTimeout(Id)
                }, 1600)
            } else {
                const id = setTimeout(() => {
                    this.nextLevel();
                    clearTimeout(id)
                }, 1600);
            }
        }
    }

    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

}
