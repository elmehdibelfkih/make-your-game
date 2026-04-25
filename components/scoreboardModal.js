export class ScoreboardModal {
    constructor(game) {
        this.game = game;
        this.apiUrl = 'http://localhost:8080/api/scores';
        this.currentPage = 1;
        this.scoresPerPage = 5;
        this.allScores = [];
        this.totalScores = 0
        this.createModal();
    }

    createModal() {
        this.modal = document.createElement('div');
        this.modal.id = 'scoreboard-modal';
        this.modal.className = 'scoreboard-modal hidden';
        this.modal.innerHTML = `
            <div class="scoreboard-content">
                <h2>Scoreboard</h2>
                <div id="player-stats"></div>
                <table class="scoreboard-table">
                    <thead>
                        <tr>
                            <th>Rank</th>
                            <th>Name</th>
                            <th>Score</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody id="scoreboard-body"></tbody>
                </table>
                <div class="pagination">
                    <button type="button" id="prev-page">&lt;</button>
                    <span id="page-info">Page 1/1</span>
                    <button type="button" id="next-page">&gt;</button>
                </div>
                <button type="button" id="close-scoreboard">Close</button>
            </div>
        `;
        document.body.appendChild(this.modal);

        document.getElementById('close-scoreboard').addEventListener('click', () => this.hide());
        document.getElementById('prev-page').addEventListener('click', () => this.changePage(-1));
        document.getElementById('next-page').addEventListener('click', () => this.changePage(1));
    }

    async submitScore(playerName, score, time) {
        try {
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: playerName, score, time })
            });

            if (!response.ok) throw new Error('Failed to submit score');

            const data = await response.json();
            this.allScores = data.scores;
            this.totalScores = Number(data.totalScores)

            this.displayPlayerStats(playerName, data.position, data.percentile);
            this.displayScores();
            this.show();
        } catch (error) {
            const statsDiv = document.getElementById('player-stats');
            statsDiv.innerHTML = `<p class="submit-error">Failed to submit score. Please check if the server is running.</p>`;
        }

    }

    displayPlayerStats(name, position, percentile) {
        const statsDiv = document.getElementById('player-stats');
        const ordinal = this.getOrdinal(position);
        statsDiv.innerHTML = `
            <p class="player-stats">
                Congrats ${name}, you are in the top ${percentile.toFixed(1)}%, on the ${ordinal} position.
            </p>
        `
    }

    displayScores() {
        const tbody = document.getElementById('scoreboard-body');
        tbody.innerHTML = '';

        const totalPages = Math.ceil(this.totalScores / this.scoresPerPage);

        this.allScores.forEach(score => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${this.getOrdinal(score.rank)}</td>
                <td>${score.name}</td>
                <td>${score.score}</td>
                <td>${score.time}</td>
            `;
            tbody.appendChild(row);
        });

        document.getElementById('page-info').textContent = `Page ${this.currentPage}/${totalPages || 1}`;
        document.getElementById('prev-page').disabled = this.currentPage === 1;
        document.getElementById('next-page').disabled = this.currentPage >= totalPages;
    }

    async fetchScores() {
        try {
            const response = await fetch(this.apiUrl + `?page=${this.currentPage}`, {
                method: "GET"
            })
            console.log(response.ok);
            if (!response.ok) throw new Error('Failed to fetch scores')
            const data = await response.json();
            this.allScores = data.scores;
            this.totalScores = Number(data.totalScores);
        } catch (error) {
            console.warn(error);
        }
    }

    async changePage(direction) {
        const totalPages = Math.ceil(this.totalScores / this.scoresPerPage);
        this.currentPage += direction;
        if (this.currentPage < 1) this.currentPage = 1;
        if (this.currentPage > totalPages) this.currentPage = totalPages;
        await this.fetchScores();
        this.displayScores();
    }

    getOrdinal(n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }

    show() {
        this.modal.classList.remove('hidden');
    }

    hide() {
        this.modal.classList.add('hidden');
        this.currentPage = 1;
    }

    async promptPlayerName() {
        return new Promise((resolve) => {
            const nameModal = document.createElement('div');
            nameModal.className = 'name-modal';
            nameModal.innerHTML = `
                <div class="name-modal-content">
                    <h3>Enter Your Name</h3>
                    <input type="text" id="player-name-input" maxlength="20" placeholder="Your name">
                    <button type="button" id="submit-name">Submit</button>
                </div>
            `;
            document.body.appendChild(nameModal);

            const input = document.getElementById('player-name-input');
            const submitBtn = document.getElementById('submit-name');

            const submit = (e) => {
                e.preventDefault();
                const name = input.value.trim();
                if (name == "") return
                document.body.removeChild(nameModal);
                resolve(name);
            };

            submitBtn.addEventListener('click', submit);
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault()
                    submit(e);
                }
            });

            input.focus();
        });
    }
}
