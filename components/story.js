export class Story {
    constructor(game) {
        this.game = game;
        this._developmentShown = false;
    }

    // Show a story panel with a given title and text, returns a Promise
    show(title, text) {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.id = 'story-overlay';

            overlay.innerHTML = `
                <div class="story-box">
                    <div class="story-title">${title}</div>
                    <p class="story-text">${text}</p>
                    <button class="story-btn">CONTINUE</button>
                </div>
            `;

            document.body.appendChild(overlay);

            // Trigger animation on next frame
            requestAnimationFrame(() => overlay.classList.add('story-visible'));

            overlay.querySelector('.story-btn').addEventListener('click', () => {
                overlay.classList.remove('story-visible');
                overlay.addEventListener('transitionend', () => {
                    overlay.remove();
                    resolve();
                }, { once: true });
            });
        });
    }

    showIntroduction() {
        this._developmentShown = false;
        const story = this.game.map.level?.story;
        if (!story?.introduction) return Promise.resolve();
        const levelName = this.game.map.level.name ?? `Level ${this.game.state.getcurentlevel()}`;
        return this.show(`📖 ${levelName}`, story.introduction);
    }

    showDevelopment() {
        if (this._developmentShown) return Promise.resolve();
        const story = this.game.map.level?.story;
        if (!story?.development) return Promise.resolve();
        this._developmentShown = true;
        return this.show('⚡ Meanwhile...', story.development);
    }

    showConclusion(won) {
        const story = this.game.map.level?.story;
        if (!story?.conclusion) return Promise.resolve();
        const title = won ? '🏆 Level Complete' : '💀 Fallen...';
        return this.show(title, story.conclusion);
    }
}
