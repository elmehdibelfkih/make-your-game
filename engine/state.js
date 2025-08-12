export class State {

    #CURRENT_LEVEL = 1
    #LIVES = 3
    #SCORE = 0
    #PAUSE = false
    #PLAYER_SPEED = 2
    #BOMB_COUNT = 0
    #MAX_ALLOWD_BOMBS = 3

    #ARROW_UP = false
    #ARROW_DOWN = false
    #ARROW_RIGHT = false
    #ARROW_LEFT = false
    #SPACE = false

    constructor() {
    }

    static getInstance = (game) => State.instance ? State.instance : new State(game)


    isArrowUp = () => this.#ARROW_UP
    isArrowDown = () => this.#ARROW_DOWN
    isArrowRight = () => this.#ARROW_RIGHT
    isArrowLeft = () => this.#ARROW_LEFT
    isSpace = () => this.#SPACE

    setArrowStateKeyDown = (event) => {
        if (event.key === 'ArrowUp') this.#ARROW_UP = true
        if (event.key === 'ArrowDown') this.#ARROW_DOWN = true
        if (event.key === 'ArrowRight') this.#ARROW_RIGHT = true
        if (event.key === 'ArrowLeft') this.#ARROW_LEFT = true
        if (event.key === ' ') this.#SPACE = true
    }

    setArrowStateKeyUp = (event) => {
        if (event.key === 'ArrowUp') this.#ARROW_UP = false
        if (event.key === 'ArrowDown') this.#ARROW_DOWN = false
        if (event.key === 'ArrowRight') this.#ARROW_RIGHT = false
        if (event.key === 'ArrowLeft') this.#ARROW_LEFT = false
        if (event.key === ' ') this.#SPACE = false
    }

    initArrowState() {
        document.addEventListener('keydown', this.setArrowStateKeyDown.bind(this))
        document.addEventListener('keyup', this.setArrowStateKeyUp.bind(this))
    }

    getLives = () => this.#LIVES
    setLives = (val = 1) => this.#LIVES += val

    setLevel = (val) => this.#CURRENT_LEVEL = val
    getLevel = () => this.#CURRENT_LEVEL

    getScore = () => this.#SCORE
    setScore = (val) => this.#SCORE = val
    
    getBombCount = () => this.#BOMB_COUNT
    setBombCount = (val = 1) => this.#BOMB_COUNT += val

    getMaxAllowdBombCount = () => this.#MAX_ALLOWD_BOMBS
    setMaxAllowdBombCount = (val = 1) => this.#MAX_ALLOWD_BOMBS += val

    // FPS = () => 
    pause = () => this.#PAUSE = true
    start = () => this.#PAUSE = false
    isPaused = () => this.#PAUSE
    getPlayerSpeed = () => this.#PLAYER_SPEED
}