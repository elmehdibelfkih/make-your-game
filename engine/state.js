export class State {

    #CURRENT_LEVEL = 1
    #LIVES = 3
    #SCORE = 0
    #PAUSE = true
    #PLAYER_SPEED = 3
    #BOMB_COUNT = 0
    #MAX_ALLOWD_BOMBS = 3
    #GAME_OVER = false
    #SOUND = true
    #ARROW_UP = false
    #ARROW_DOWN = false
    #ARROW_RIGHT = false
    #ARROW_LEFT = false
    #TIME = 0
    #TIMER_ID = null

    constructor(game) {
        State.instance = this;
        this.game = game
        this.isStar = true;
    }

    static getInstance = (game) => State.instance ? State.instance : new State(game)

    stopTimer = () => {
        if (this.#TIMER_ID) {
            clearInterval(this.#TIMER_ID);
            this.#TIMER_ID = null;
        }
    }

    initState() {
        this.stopTimer();
        this.#LIVES = 3
        this.#SCORE = 0
        this.#PAUSE = true
        this.#PLAYER_SPEED = 4
        this.#BOMB_COUNT = 0
        this.#MAX_ALLOWD_BOMBS = 3
        this.#GAME_OVER = false
        this.#SOUND = true
        this.#TIME = 0;
        this.#TIMER_ID = null;
    }
    isArrowUp = () => this.#ARROW_UP
    isArrowDown = () => this.#ARROW_DOWN
    isArrowRight = () => this.#ARROW_RIGHT
    isArrowLeft = () => this.#ARROW_LEFT

    setArrowStateKeyDown = (event) => {
        if (event.key === 'ArrowUp') this.#ARROW_UP = true
        if (event.key === 'ArrowDown') this.#ARROW_DOWN = true
        if (event.key === 'ArrowRight') this.#ARROW_RIGHT = true
        if (event.key === 'ArrowLeft') this.#ARROW_LEFT = true
        if (event.key.toLowerCase() === 'p') {
            this.pauseStart()
        }
    }

    setArrowStateKeyUp = (event) => {
        if (event.key === 'ArrowUp') this.#ARROW_UP = false
        if (event.key === 'ArrowDown') this.#ARROW_DOWN = false
        if (event.key === 'ArrowRight') this.#ARROW_RIGHT = false
        if (event.key === 'ArrowLeft') this.#ARROW_LEFT = false
    }

    initArrowState() {
        //FIXME: REMOVE THIS
        this.test = document.getElementById('test')
        document.getElementById('star_pause').addEventListener('click', this.transeferit.bind(this))
        document.getElementById('sound').addEventListener('click', this.switch.bind(this))
        document.addEventListener('keydown', this.setArrowStateKeyDown.bind(this))
        document.addEventListener('keyup', this.setArrowStateKeyUp.bind(this))
    }

    getTime = () => this.#TIME
    setLives = (val = 1) => this.#LIVES += val
    getLives = () => this.#LIVES
    setLevel = (val) => this.#CURRENT_LEVEL = val
    getLevel = () => this.#CURRENT_LEVEL
    // Her I Set Player Speed For Add 
    setPlayerspped = (val) => this.#PLAYER_SPEED = val
    getScore = () => this.#SCORE
    setScore = (val) => this.#SCORE = val

    getBombCount = () => this.#BOMB_COUNT
    setBombCount = (val = 1) => this.#BOMB_COUNT += val

    getMaxAllowdBombCount = () => this.#MAX_ALLOWD_BOMBS
    setMaxAllowdBombCount = (val = 1) => this.#MAX_ALLOWD_BOMBS += val
    // FPS = () => 
    pauseStart = () => {
        this.#PAUSE = !this.#PAUSE;
        this.updatePauseIcon();
    }
    
    isPaused = () => this.#PAUSE
    isGameOver = () => this.#GAME_OVER
    GameOver = () => this.#GAME_OVER = true
    getPlayerSpeed = () => this.#PLAYER_SPEED
    // ============================= just test score >>>>>>
    //update = () => {
      //  this.setScore(this.#SCORE);
    //}
    setScore = (val) => {
        this.#SCORE += val;
        if (this.game && this.game.scoreboard) {
            this.game.scoreboard.updateScore();
        }
    }

    // ================ just test score >>>>>>>>>>>>
    updatePauseIcon = () => {
        const icon = document.getElementById('icon');
        if (!icon) return;
        if (!this.#PAUSE) {
            icon.src = './icon/pause.svg';
            icon.alt = 'pause';
            this.isStar = false;
        } else {
            icon.src = './icon/play.svg';
            icon.alt = 'star';
            this.isStar = true;
        }
    }

    // her i will set timer for game 
    setTime = (seconds) => {
        this.#TIME = seconds;
        this.maxTime = this.#TIME
        if (this.game && this.game.scoreboard) {
            this.game.scoreboard.updateTimer();
        }
    };

    addtime = (val) => {
        this.#TIME += val;
        return this.#TIME;
    }

    // ====================================//
    startTimer = () => {
        // Clear any existing interval
        if (this.#TIMER_ID) clearInterval(this.#TIMER_ID);

        // Star timer count 
        this.#TIMER_ID = setInterval(() => {
            // Only decrease time if the game is not paused
            if (!this.isPaused()) {
                if (this.#TIME > 0) {
                    this.#TIME--;
                    console.log(this.#TIME)
                    this.game.scoreboard.updateTimer();

                } else {
                    clearInterval(this.#TIMER_ID);
                    this.#GAME_OVER = true
                    //this.GameOver(); 
                    // her i will initialize the game over !!
                }
            }
        }, 1000);
    };

    switch() {
        const ic = document.getElementById('Icon')
        // now it true
        if (this.#SOUND) {
            // svg for mute
            ic.src = './icon/volume-x.svg'
            this.game.map.backGroundMusic.volume = 0.0;
            this.#SOUND = false
        } else {
            // svg for sound e-
            ic.src = './icon/volume-2.svg'
            this.game.map.backGroundMusic.volume = 0.3;
            this.#SOUND = true
        }
    }
    // ABOUT HEART IN GAME !
    update = () => {
        if (!this.#LIVES) {
            this.GameOver()
        }
    }

    transeferit = () => {
        this.pauseStart()
    }

    SetPause(env) {
        this.#PAUSE = env
    }
}
