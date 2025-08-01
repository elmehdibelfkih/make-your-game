export class State {

    #CURRENT_LEVEL = 1
    #LIVES = 3
    #SCORE = 0
    #PAUSE = false
    #PLAYER_SPEED = 5

    constructor() {
    }

    static getInstance() {
        if (!State.instance) {
            State.instance = new State()
        }
        return State.instance
    }

    getLives() {
        return this.#LIVES
    }

    getLevel() {
        return this.#CURRENT_LEVEL
    }

    getScore() {
        return this.#SCORE
    }

    setLives(val) {
        this.#LIVES = val
    }

    setLevel(val) {
        this.#CURRENT_LEVEL = val
    }

    setScore(val) {
        this.#SCORE = val
    }

    FPS() {

    }

    pause() {
        this.#PAUSE = true
    }

    start() {
        this.#PAUSE = false
    }

    isPaused() {
        return this.#PAUSE
    }

    getPlayerSpeed() {
        return this.#PLAYER_SPEED
    }
}