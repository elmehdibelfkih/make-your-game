// Her UI  <<>>
export class UI {

    constructor(game) {
        UI.instance = this;
        this.game = game
    }
    static getInstance = (game) => UI.instance ? UI.instance : new UI(game)

    GameOver() {
        // ====== \\
        const index = this.game.state.getcurentindex()
        const story = this.game.map.level.game_over_story
        const storyy = story[index]
        //console.log(index)
        const instructions = document.getElementById("instructions");
        const title = document.getElementById("menu-title");
        const message = document.getElementById("menu-message");
        const btn = document.getElementById("start-btn");
        const st = document.getElementById("menu-story")
        st.innerHTML = ""
        instructions.classList.remove("hidden");
        if (this.game.state.GetState()) {
            title.textContent = "REFRECH GAME IS DONE";
            message.textContent = "Enjoy .....";
            btn.textContent = "Continue ...";
            this.game.state.updateStateof(false)
            this.game.state.Restar()
        } else {
            title.textContent = "GAME OVER";
            message.textContent = "Time’s up or you lost all lives!";
            st.innerHTML = `<strong>Story:</strong> ${storyy}`;
            btn.textContent = "PLAY AGAIN";
        }
    }

    nextLevel() {
        const instructions = document.getElementById("instructions");
        instructions.classList.remove("hidden");
        const title = document.getElementById("menu-title");
        const message = document.getElementById("menu-message");
        title.textContent = "NEXT LEVEL";
        message.textContent = "Get ready!";
    }

    win() {
        const instructions = document.getElementById("instructions");
        instructions.classList.remove("hidden");
        const st = document.getElementById("menu-story")
        const title = document.getElementById("menu-title");
        const message = document.getElementById("menu-message");
        const m = document.getElementById('')
        title.textContent = "YOU WIN!";
        message.textContent = "Congratulations, you completed all levels!";
        st.innerHTML = ""
        st.innerHTML = `<strong>Story:</strong> Through every maze, every blast, and every hidden shard, you proved your skill as the ultimate Blast Runner. Enemies vanquished, secrets uncovered, and the Heart of the labyrinth finally revealed—your courage has rewritten the song of this maze. Victory is yours, and the art of the bomb lives on forever.`;
    
    }

    story(score) {
        
        // Her I Will Check The story 
        const index = this.game.state.getcurentindex()
        const story = this.game.map.level.story
        const storyy = story[index]
        console.log(index)
        console.log(story)
        const instructions = document.getElementById("instructions");
        const title = document.getElementById("menu-title");
        const message = document.getElementById("menu-message");
        const history = document.getElementById("menu-story");
        //this.state.SetPause(true);
        instructions.classList.remove("hidden");
        title.textContent = "🎮 Score Milestone!";
        message.textContent = `You’ve reached ${score} points!`;
        history.innerHTML = `<strong>Story:</strong> ${storyy}`;
        const originalBtn = document.getElementById("start-btn");
        originalBtn.style.display = "none";
        const storyBtn = document.createElement("button");
        storyBtn.textContent = "Continue";
        storyBtn.className = "start-btn";
        storyBtn.setAttribute("aria-label", "Continue");
        const container = instructions.querySelector(".instruction-box");
        container.appendChild(storyBtn);
        storyBtn.addEventListener("click", () => {
            storyBtn.remove();
            originalBtn.style.display = "block";
            instructions.classList.add("hidden");
            this.game.state.pauseStart()
            this.game.state.SetPause(false);
            this.game.state.setIndex()
        });
    }



}