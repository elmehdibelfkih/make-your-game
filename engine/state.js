export class State {

    #CURRENT_LEVEL = 1
    #LIVES = 3
    #SCORE = 0
    #PAUSE = false

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
}