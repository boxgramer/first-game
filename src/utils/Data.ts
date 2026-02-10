type SaveData = {
    highScore: number;
    level: number;
    tutorialCompleted: boolean;
};

export class Data {
    private static KEY = 'game_save';

    private data: SaveData = {
        highScore: 0,
        level: 1,
        tutorialCompleted: false,
    };

    constructor() {
        this.load();
    }


    addScore(score: number) {
        if (score > this.data.highScore) {
            this.data.highScore = score;
            this.save();
        }
    }

    getScore(): number {
        return this.data.highScore;
    }

    addLevel() {
        this.data.level += 1;
        this.save();
    }

    getLevel(): number {
        return this.data.level;
    }


    completeTutorial() {
        this.data.tutorialCompleted = true;
        this.save();
    }

    isTutorialCompleted(): boolean {
        return this.data.tutorialCompleted;
    }


    private save() {
        localStorage.setItem(
            Data.KEY,
            JSON.stringify(this.data)
        );
    }

    private load() {
        const raw = localStorage.getItem(Data.KEY);
        if (raw) {
            this.data = JSON.parse(raw);
        }
    }

    reset() {
        localStorage.removeItem(Data.KEY);
        this.data = {
            highScore: 0,
            level: 1,
            tutorialCompleted: false,

        };
        this.save();
    }
}